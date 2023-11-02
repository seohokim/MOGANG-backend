import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import {
  CreateLectureInputDto,
  CreateLectureOutputDto,
} from './dto/create-lecture.dto';
import { LoadLecturesOutputDto } from './dto/load-lectures.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lectureService: LecturesService) {}

  @Post()
  async createLecture(
    @Body() createLectureInputDto: CreateLectureInputDto,
  ): Promise<CreateLectureOutputDto> {
    return this.lectureService.createLecture(createLectureInputDto);
  }
  //   @Get() //find lectures
  //   async loadLectures(
  //     @Query('level') level?: string,
  //     @Query('charge') charge?: string,
  //     @Query('order') order?: string,
  //     @Query('skill') skill?: string[],
  //     @Query('keyword') keyword?: string,
  //   ): Promise<LoadLecturesOutputDto> {}
}
