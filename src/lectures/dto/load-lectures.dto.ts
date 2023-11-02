import { PickType } from '@nestjs/mapped-types';
import { Lecture } from '../entities/lecture.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { IsArray, IsOptional } from 'class-validator';

export enum Order {
  score = 0,
  createdAt = 1,
  price = 2,
}

export class LoadLecturesInputDto extends PickType(Lecture, [
  'title',
  'skills',
  'price',
]) {
  @IsOptional()
  order?: Order;
}

export class LoadLecturesOutputDto extends CoreOutPut {
  @IsOptional()
  @IsArray()
  lecture?: Lecture[];
}
