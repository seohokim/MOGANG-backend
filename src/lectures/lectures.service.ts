import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
import {
  generateErrorResponse,
  generateOkResponse,
} from 'src/common/utils/response.util';
import { UsersService } from 'src/users/users.service';

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
      const lectureExist = await this.findLectureByUrl(
        createLectureInputDto.url,
      );

      if (lectureExist) {
        return generateErrorResponse(['already-exist'], 409);
      }
      const newLecture = await this.saveNewLecture(createLectureInputDto);

      return generateOkResponse<CreateLectureOutputDto>(200, {
        lecture: newLecture,
      });
    } catch (error) {
      return generateErrorResponse<CreateLectureOutputDto>(
        ['server-error', error],
        500,
      );
    }
  }

  private async saveNewLecture(
    createLectureInputDto: CreateLectureInputDto,
  ): Promise<Lecture> {
    const newLecture = this.lectureRepository.create(createLectureInputDto);

    return await this.lectureRepository.save(newLecture);
  }

  async getLectureById(
    loadLectureInputDto: LoadLectureInputDto,
  ): Promise<LoadLectureOutputDto> {
    try {
      const { id } = loadLectureInputDto;
      const lecture = await this.findLectureById(id);

      if (!lecture) {
        return generateErrorResponse<LoadLectureOutputDto>(
          ['lecture-not-found', id.toString()],
          400,
        );
      }
      const lectureHasLikeCount = await this.calculateLikeCount(lecture);

      return generateOkResponse<LoadLectureOutputDto>(200, {
        lectures: [lectureHasLikeCount],
      });
    } catch (error) {
      return generateErrorResponse<LoadLectureOutputDto>(
        ['server-error', error.toString()],
        500,
      );
    }
  }

  private async findLectureById(id: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({ where: { id } });
  }

  private async findLectureByUrl(url: string): Promise<Lecture> {
    return await this.lectureRepository.findOne({ where: { url } });
  }

  private async calculateLikeCount(lecture: Lecture): Promise<Lecture> {
    const likeCount = lecture.likedByUsers.length;
    delete lecture.likedByUsers;
    const sublecture = Object.assign(lecture, {
      ...lecture,
      like: likeCount,
    });
    return sublecture;
  }

  async getLectureListByFilter(
    filter: LoadLecturesListInputDto,
  ): Promise<LoadLecturesListOutputDto> {
    try {
      const queryBuilder = this.lectureRepository
        .createQueryBuilder('lecture')
        .loadRelationCountAndMap('lecture.likes', 'lecture.likedByUsers');

      if (filter.category) {
        this.applyCategory(filter.category, queryBuilder);
      }

      if (filter.title) {
        this.applyTitle(filter.title, queryBuilder);
      }

      if (filter.skills) {
        this.applySkills(filter.skills, queryBuilder);
      }

      if (filter.currentPrice) {
        this.applyPrice(filter.currentPrice, queryBuilder);
      }

      this.applyOrder(filter.order, queryBuilder);
      const lectures = await queryBuilder.getMany();

      if (lectures.length === 0) {
        return generateErrorResponse<LoadLectureOutputDto>(
          ['lectures-not-found'],
          400,
        );
      }
      return generateOkResponse<LoadLectureOutputDto>(400, { lectures });
    } catch (error) {
      return generateErrorResponse<LoadLectureOutputDto>(
        ['server-error', error.toString()],
        500,
      );
    }
  }

  //Filter 적용 메소드
  private applyCategory(
    category: string[],
    queryBuilder: SelectQueryBuilder<Lecture>,
  ): SelectQueryBuilder<Lecture> {
    queryBuilder.andWhere(
      `string_to_array(lecture.category, ',') && :category`,
      { category },
    ); //lecutre의 category가 해당 category만 맞는 lecture만 선별

    return queryBuilder;
  }
  private applyTitle(
    title: string,
    queryBuilder: SelectQueryBuilder<Lecture>,
  ): SelectQueryBuilder<Lecture> {
    const formattedTitle = title.replace(/\s+/g, ''); // 사용자 입력에서 공백 제거
    queryBuilder.andWhere(
      "regexp_replace(lecture.title, '\\s', '', 'g') LIKE :title",
      { title: `%${formattedTitle}%` },
    );

    return queryBuilder;
  }
  private applySkills(
    skills: string[],
    queryBuilder: SelectQueryBuilder<Lecture>,
  ): SelectQueryBuilder<Lecture> {
    queryBuilder.andWhere(`string_to_array(lecture.skills, ',') && :skills`, {
      skills: skills,
    });

    return queryBuilder;
  }
  private applyPrice(
    currentPrice: number,
    queryBuilder: SelectQueryBuilder<Lecture>,
  ): SelectQueryBuilder<Lecture> {
    queryBuilder.andWhere('lecture.price < :price', {
      currentPrice,
    });

    return queryBuilder;
  }
  private applyOrder(
    order: string,
    queryBuilder: SelectQueryBuilder<Lecture>,
  ): SelectQueryBuilder<Lecture> {
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

    return queryBuilder;
  }

  //좋아요
  async likeLecture(
    reqBody: any,
    likeInputDto: LikeInputDto,
  ): Promise<LikeOutputDto> {
    try {
      const { user, lecture } = await this.findUserAndLecture(
        reqBody.id,
        likeInputDto.lectureId,
      );

      if (!user || !lecture) {
        return generateErrorResponse<LikeOutputDto>(
          ['user-or-lecture-not-found'],
          400,
        );
      }

      await this.processLikeAction(user, lecture);

      return generateOkResponse<LikeOutputDto>(200);
    } catch (error) {
      return generateErrorResponse<LikeOutputDto>([error.toString()], 500);
    }
  }

  private async findUserAndLecture(
    userId: number,
    lectureId: number,
  ): Promise<{ user: User; lecture: Lecture }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['likedLectures'],
    });

    const lecture = await this.lectureRepository.findOne({
      where: { id: lectureId },
      relations: ['likedByUsers'],
    });

    return { user, lecture };
  }

  private async processLikeAction(user: User, lecture: Lecture): Promise<void> {
    const alreadyLiked = user.likedLectures.some(
      (likedLecture) => likedLecture.id === lecture.id,
    );

    if (alreadyLiked) {
      user.likedLectures = user.likedLectures.filter(
        (likedLecture) => likedLecture.id !== lecture.id,
      );
      lecture.likedByUsers = lecture.likedByUsers.filter(
        (likedUser) => likedUser.id !== user.id,
      );
    } else {
      user.likedLectures.push(lecture);
      lecture.likedByUsers.push(user);
    }

    await this.userRepository.save(user);
    await this.lectureRepository.save(lecture);
  }
}
