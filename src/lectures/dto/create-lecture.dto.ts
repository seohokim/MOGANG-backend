import { PickType } from '@nestjs/mapped-types';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { Lecture } from '../entities/lecture.entity';
import { IsOptional } from 'class-validator';

export class CreateLectureInputDto extends PickType(Lecture, [
  'title',
  'author',
  'skills',
  'level',
  'price',
  'score',
  'provider',
  'thumbnailUrl',
  'score',
  'url',
]) {}

export class CreateLectureOutputDto extends CoreOutPut {
  @IsOptional()
  lecture?: Lecture;
}
