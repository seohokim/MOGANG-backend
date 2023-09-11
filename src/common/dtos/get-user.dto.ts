import { PickType } from "@nestjs/mapped-types";
import { CoreOutPut } from "./core.dto";
import { IsOptional } from "class-validator";
import { User } from "src/users/entities/user.entity";

export class GetUserInputDto extends PickType(User, ['email']) {}

export class GetUserOutputDto extends CoreOutPut{
  @IsOptional()
  user?: User;
}