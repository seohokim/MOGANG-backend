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
  ): Promise<LoadLecturesOutputDto> {}
}
