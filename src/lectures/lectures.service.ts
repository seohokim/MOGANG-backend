import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entities/lecture.entity';
import { Repository } from 'typeorm';
import { CreateLectureInputDto, CreateLectureOutputDto } from './dto/create-lecture.dto';

@Injectable()
export class LecturesService {
  constructor(
    @InjectRepository(Lecture) private readonly lectureRepository: Repository<Lecture>
  ) {}
  
  async createLecture(createLectureInputDto: CreateLectureInputDto): Promise<CreateLectureOutputDto> {
    try{
      const { title, author,provider, htmlContent, photo, score, url } = createLectureInputDto;
      const lectureExist = await this.lectureRepository.findOne({ where: { url }})
      if (lectureExist) return {ok: false, error: "Already exist." };
      const lecture = this.lectureRepository.create({ title, author,provider, htmlContent, photo, score, url });
      await this.lectureRepository.save(lecture);
      return { ok: true };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Something went wrong Try again.'};
    }
  }
}
