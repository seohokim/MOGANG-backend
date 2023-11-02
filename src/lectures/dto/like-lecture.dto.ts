import { PickType } from '@nestjs/mapped-types';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { Lecture } from '../entities/lecture.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeInputDto {
  @IsNotEmpty()
  @IsNumber()
  lectureId: number;
}

export class LikeOutputDto extends CoreOutPut {}
