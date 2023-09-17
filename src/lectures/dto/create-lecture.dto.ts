import { PickType } from "@nestjs/mapped-types";
import { IsOptional } from "class-validator";
import { CoreOutPut } from "src/common/dtos/core.dto";
import { Lecture } from "../entities/lecture.entity";

export class CreateLectureInputDto extends PickType(Lecture, ['title', 'author','provider', 'htmlContent' ,'photo' ,'score','url']) {}

export class CreateLectureOutputDto extends CoreOutPut{

}