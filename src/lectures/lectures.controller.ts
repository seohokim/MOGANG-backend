import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LikeInputDto, LikeOutputDto } from './dto/like-lecture.dto';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lectureService: LecturesService) {}

  @Post() //Lecture 생성
  async createLecture(
    @Res() res,
    @Body() createLectureInputDto: CreateLectureInputDto,
  ): Promise<CreateLectureOutputDto> {
    const result = await this.lectureService.createLecture(
      createLectureInputDto,
    );
    return res.status(result.statusCode).json(result);
  }

  @Get() //fillter로 lecture 불러오기
  async loadLectureList(
    @Res() res,
    @Body() loadLecturesListInputDto: LoadLecturesListInputDto,
  ): Promise<LoadLecturesListOutputDto> {
    const result = await this.lectureService.getLectureListByFilter(
      loadLecturesListInputDto,
    );
    return res.status(result.statusCode).json(result);
  }

  @Get(':id') //id별로 lecture 불러오기
  async loadLecture(
    @Res() res,
    @Body() loadLectureInputDto: LoadLectureInputDto,
  ): Promise<LoadLectureOutputDto> {
    const result =
      await this.lectureService.getLectureById(loadLectureInputDto);
    return res.status(result.statusCode).json(result);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like') //lecture id에 해당하는 좋아요 누르기(두 번 보내면 좋아요 삭제)
  async likeLecture(
    @Res() res,
    @Body() likeInputDto: LikeInputDto,
    @Request() req,
  ): Promise<LikeOutputDto> {
    const result = await this.lectureService.likeLecture(
      req.user,
      likeInputDto,
    );
    return res.status(result.statusCode).json(result);
  }
}
