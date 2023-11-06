import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { Repository } from 'typeorm';
import {
  CreateLectureInputDto,
  CreateLectureOutputDto,
} from './dto/create-lecture.dto';
import {
  LoadLectureInputDto,
  LoadLectureOutputDto,
  LoadLecturesListInputDto,
  LoadLecturesListOutputDto,
} from './dto/load-lectures.dto';
import { LikeInputDto, LikeOutputDto } from './dto/like-lecture.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createLecture(
    createLectureInputDto: CreateLectureInputDto,
  ): Promise<CreateLectureOutputDto> {
    try {
      const {
        title,
        author,
        skills,
        category,
        lectureUpdatedAt,
        level,
        originPrice,
        currentPrice,
        description,
        provider,
        duration,
        thumbnailUrl,
        score,
        url,
      } = createLectureInputDto;
      const lectureExist = await this.lectureRepository.findOne({
        where: { url },
      });
      if (lectureExist)
        return {
          ok: false,
          message: ['already-exist'],
          error: 'Conflict',
          statusCode: 409,
        };
      const lecture = this.lectureRepository.create({
        title,
        author,
        skills,
        category,
        lectureUpdatedAt,
        level,
        originPrice,
        currentPrice,
        provider,
        description,
        duration,
        thumbnailUrl,
        score,
        url,
      });
      await this.lectureRepository.save(lecture);
      return { ok: true, lecture, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: [error.toString()],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }

  async loadLectureById(
    loadLectureInputDto: LoadLectureInputDto,
  ): Promise<LoadLectureOutputDto> {
    try {
      const { id } = loadLectureInputDto;
      const lecture = await this.lectureRepository.findOne({
        where: { id },
        relations: ['likedByUsers'],
      });
      if (!lecture) {
        return {
          ok: false,
          message: ['not-found'],
          error: 'Not Found',
          statusCode: 404,
        };
      }
      const likeCount = lecture.likedByUsers.length;
      delete lecture.likedByUsers;
      Object.assign(lecture, {
        ...lecture,
        like: likeCount,
      });
      return { ok: true, lecture, statusCode: 200 };
    } catch (error) {
      console.log(error);
      return { ok: false, message: ['server-error'], error, statusCode: 500 };
    }
  }

  async loadLectureList(
    filter: LoadLecturesListInputDto,
  ): Promise<LoadLecturesListOutputDto> {
    try {
      const { title, skills, category, currentPrice, order } = filter;
      const queryBuilder = this.lectureRepository
        .createQueryBuilder('lecture')
        .loadRelationCountAndMap('lecture.likes', 'lecture.likedByUsers');

      if (category) {
        queryBuilder.andWhere(
          `string_to_array(lecture.category, ',') && :category`,
          { category },
        ); //lecutre의 category가 해당 category만 맞는 lecture만 선별
      } else {
        return {
          ok: false,
          message: ['category-not-found'],
          error: 'Not Found',
          statusCode: 400,
        };
      }
      if (title) {
        const formattedTitle = title.replace(/\s+/g, ''); // 사용자 입력에서 공백 제거
        queryBuilder.andWhere(
          "regexp_replace(lecture.title, '\\s', '', 'g') LIKE :title",
          { title: `%${formattedTitle}%` },
        );
      }
      if (skills && skills.length > 0) {
        queryBuilder.andWhere(
          `string_to_array(lecture.skills, ',') && :skills`,
          { skills: skills },
        );
      }

      if (currentPrice) {
        queryBuilder.andWhere('lecture.price < :price', {
          currentPrice,
        });
      }
      if (order) {
        switch (order) {
          case 'score':
            queryBuilder.orderBy(`lecture.${order}`, 'DESC');
            break;
          case 'createdAt':
            queryBuilder.orderBy(`lecture.${order}`, 'DESC');
            break;
          case 'currentPrice':
            queryBuilder.orderBy(`lecture.${order}`, 'ASC');
            break;
        }
      }
      const lectures = await queryBuilder.getMany();
      if (lectures.length === 0) {
        return {
          ok: true,
          message: ['not-found'],
          statusCode: 200,
        };
      }
      return { ok: true, lectures, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: [error.toString()],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }

  async likeLecture(
    reqBody: any,
    likeInputDto: LikeInputDto,
  ): Promise<LikeOutputDto> {
    try {
      const userId = reqBody.id;
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['likedLectures'],
      });

      const { lectureId } = likeInputDto;
      const lecture = await this.lectureRepository.findOne({
        where: { id: lectureId },
        relations: ['likedByUsers'],
      });

      if (!user) {
        return {
          ok: false,
          message: ['user-not-found'],
          error: 'Unauthorized',
          statusCode: 401,
        };
      }

      if (!lecture) {
        return {
          ok: false,
          message: ['lecture-not-found'],
          error: 'Not Found',
          statusCode: 404,
        };
      }

      // Check if user has already liked the lecture
      const idx = user.likedLectures.findIndex(
        (likedLecture) => likedLecture.id === lectureId,
      );

      if (idx > -1) {
        // User has already liked the lecture. Remove like.
        user.likedLectures.splice(idx, 1);
        const lectureIdx = lecture.likedByUsers.findIndex(
          (likedUser) => likedUser.id === userId,
        );
        lecture.likedByUsers.splice(lectureIdx, 1);
        await this.userRepository.save(user);
        await this.lectureRepository.save(lecture);
        return {
          ok: true,
          message: ['like-eliminated'],
          statusCode: 200,
        };
      } else {
        // User hasn't liked the lecture. Add like.
        user.likedLectures.push(lecture);
        lecture.likedByUsers.push(user);
      }

      await this.userRepository.save(user);
      await this.lectureRepository.save(lecture);

      return {
        ok: true,
        statusCode: 200,
      };
    } catch (error) {
      return {
        ok: false,
        message: [error.toString()],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }
}
