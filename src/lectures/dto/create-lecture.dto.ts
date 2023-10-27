import { PickType } from "@nestjs/mapped-types";
import { CoreOutPut } from "src/common/dtos/core.dto";
import { Lecture } from "../entities/lecture.entity";

export class CreateLectureInputDto extends PickType(Lecture, ['title', 'author','provider', 'htmlContent' ,'thumnailUrl' ,'score','url']) {}

export class CreateLectureOutputDto extends CoreOutPut{

}