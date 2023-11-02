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

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  async createLecture(
    createLectureInputDto: CreateLectureInputDto,
  ): Promise<CreateLectureOutputDto> {
    try {
      const {
        title,
        author,
        skills,
        level,
        price,
        provider,
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
        level,
        price,
        provider,
        thumbnailUrl,
        score,
        url,
      });
      await this.lectureRepository.save(lecture);
      return { ok: true, lecture, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: ['server-error'],
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
      const lecture = await this.lectureRepository.findOne({ where: { id } });
      if (!lecture) {
        return {
          ok: false,
          message: ['not-found'],
          error: 'Not Found',
          statusCode: 404,
        };
      }
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
      const { title, skills, price, order } = filter;
      const queryBuilder = this.lectureRepository.createQueryBuilder('lecture');
      if (title) {
        const formattedTitle = title.replace(/\s+/g, ''); // 사용자 입력에서 공백 제거
        queryBuilder.andWhere(
          "regexp_replace(lecture.title, '\\s', '', 'g') LIKE :title",
          { title: `%${formattedTitle}%` },
        );
      }
      if (skills && skills.length > 0) {
        queryBuilder.andWhere('lecture.skills && :skills', {
          skills,
        });
      }
      if (price) {
        queryBuilder.andWhere('lecture.price < :price', {
          price,
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
          case 'price':
            queryBuilder.orderBy(`lecture.${order}`, 'ASC');
            break;
        }
      } else {
        return {
          ok: false,
          message: ['order-not-found'],
          error: 'Not Found',
          statusCode: 404,
        };
      }
      const lectures = await queryBuilder.getMany();
      return { ok: true, lectures, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: [error],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }
}
