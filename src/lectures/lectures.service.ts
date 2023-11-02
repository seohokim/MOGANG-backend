import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { Repository } from 'typeorm';
import {
  CreateLectureInputDto,
  CreateLectureOutputDto,
} from './dto/create-lecture.dto';
import {
  LoadLecturesInputDto,
  LoadLecturesOutputDto,
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

  async loadLectureList(
    filter: LoadLecturesInputDto,
  ): Promise<LoadLecturesOutputDto> {
    try {
      const { title, skills, price, order } = filter;
      const queryBuilder = this.lectureRepository.createQueryBuilder('lecture');
      if (title) {
        queryBuilder.andWhere('lecture.title LIKE: title', {
          title: `${title}`,
        });
      }
      if (skills && skills.length > 0) {
        queryBuilder.andWhere('lecture.skills && :skills', { skills });
      }
      if (price) {
        queryBuilder.andWhere('lecture.price < :price', { price });
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
      }
      const lectures = await queryBuilder.getMany();
      return { ok: true, lectures, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: ['server-error'],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }
}
