import { PickType } from '@nestjs/mapped-types';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { Lecture } from '../entities/lecture.entity';
import { IsOptional } from 'class-validator';

export class CreateLectureInputDto extends PickType(Lecture, [
  'title',
  'author',
  'skills',
  'category',
  'lectureUpdatedAt',
  'level',
  'price',
  'score',
  'provider',
  'thumbnailUrl',
  'durationInMinutes',
  'score',
  'url',
]) {}

export class CreateLectureOutputDto extends CoreOutPut {
  @IsOptional()
  lecture?: Lecture;
}
