import { PartialType, PickType } from '@nestjs/mapped-types';
import { Lecture } from '../entities/lecture.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { IsArray, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class LoadLecturesListInputDto extends PartialType(
  PickType(Lecture, ['title', 'skills', 'price', 'category']),
) {
  @IsNotEmpty({ message: 'order-not-found' })
  @IsIn(['score', 'createdAt', 'price'], { message: 'wrong-order' })
  order: 'score' | 'createdAt' | 'price';
}

export class LoadLecturesListOutputDto extends CoreOutPut {
  @IsOptional()
  @IsArray()
  lectures?: Lecture[];
}

export class LoadLectureInputDto extends PickType(Lecture, ['id']) {}

export class LoadLectureOutputDto extends CoreOutPut {
  @IsOptional()
  lecture?: Lecture;
}
