import { Body, Controller, Get, Post } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { CreateLectureInputDto, CreateLectureOutputDto } from './dto/create-lecture.dto';

@Controller('lectures')
export class LecturesController {
  constructor(
    private readonly lectureService: LecturesService
  ) {}

  @Post()
  async createLecture(@Body() createLectureInputDto: CreateLectureInputDto): Promise<CreateLectureOutputDto> {
    return this.lectureService.createLecture(createLectureInputDto);
  }
}
