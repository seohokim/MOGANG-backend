import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import {
  CreateLectureInputDto,
  CreateLectureOutputDto,
} from './dto/create-lecture.dto';
import {
  LoadLecturesInputDto,
  LoadLecturesOutputDto,
} from './dto/load-lectures.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lectureService: LecturesService) {}

  @Post()
  async createLecture(
    @Res() res,
    @Body() createLectureInputDto: CreateLectureInputDto,
  ): Promise<CreateLectureOutputDto> {
    const result = await this.lectureService.createLecture(
      createLectureInputDto,
    );
    return res.status(result.statusCode).json(result);
  }
  @Get() //find lectures
  async loadLectureList(
    @Res() res,
    loadLecturesInputDto: LoadLecturesInputDto,
  ): Promise<LoadLecturesOutputDto> {
    const result =
      await this.lectureService.loadLectureList(loadLecturesInputDto);
    return res.status(result.statusCode).json(result);
  }
}
