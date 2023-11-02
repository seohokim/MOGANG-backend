import { PickType } from '@nestjs/mapped-types';
import { Lecture } from '../entities/lecture.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';

export class LoadLecturesInputDto extends PickType(Lecture, [
  'title',
  'skills',
  'charge',
  'like',
]) {}

export class LoadLecturesOutputDto extends CoreOutPut {}
