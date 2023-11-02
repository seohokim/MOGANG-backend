import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { LecturesService } from './lectures.service';
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
    @Body() loadLecturesListInputDto: LoadLecturesListInputDto,
  ): Promise<LoadLecturesListOutputDto> {
    const result = await this.lectureService.loadLectureList(
      loadLecturesListInputDto,
    );
    return res.status(result.statusCode).json(result);
  }

  @Get(':id')
  async loadLecture(
    @Res() res,
    @Body() loadLectureInputDto: LoadLectureInputDto,
  ): Promise<LoadLectureOutputDto> {
    const result =
      await this.lectureService.loadLectureById(loadLectureInputDto);
    return res.status(result.statusCode).json(result);
  }
}
