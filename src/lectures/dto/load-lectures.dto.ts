import { PickType } from '@nestjs/mapped-types';
import { Lecture } from '../entities/lecture.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export class LoadLecturesInputDto extends PickType(Lecture, [
  'title',
  'skills',
  'price',
]) {
  @IsOptional()
  @IsIn(['score', 'createdAt', 'price'])
  order?: 'score' | 'createdAt' | 'price';
}

export class LoadLecturesOutputDto extends CoreOutPut {
  @IsOptional()
  @IsArray()
  lectures?: Lecture[];
}
