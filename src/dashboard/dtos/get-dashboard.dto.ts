import { Banner } from "../entities/banner.entity";
import { CoreOutPut } from "src/common/dtos/core.dto";
import { IsOptional } from "class-validator";
import { Lecture } from "src/lectures/entities/lecture.entity";


export class GetDashboardOutputDto extends CoreOutPut {
  @IsOptional()
  banner?: Pick<Banner, 'imageUrl'>

  @IsOptional()
  lectures?: Pick<Lecture, 'title' | 'author' | 'provider' | 'thumnailUrl' | 'score'>[];
}