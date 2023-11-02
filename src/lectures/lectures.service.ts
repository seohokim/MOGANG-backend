import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { Repository } from 'typeorm';
import {
  CreateLectureInputDto,
  CreateLectureOutputDto,
} from './dto/create-lecture.dto';

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
        charge,
        provider,
        htmlContent,
        thumnailUrl,
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
        provider,
        htmlContent,
        thumnailUrl,
        score,
        url,
      });
      await this.lectureRepository.save(lecture);
      return { ok: true, statusCode: 200 };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: ['server-error'],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }

  async loadLectures() {}
}
