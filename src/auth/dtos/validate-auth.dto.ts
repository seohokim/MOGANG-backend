import { PickType } from "@nestjs/mapped-types";
import { IsOptional } from "class-validator";
import { CoreOutPut } from "src/common/dtos/core.dto";
import { User } from "src/users/entities/user.entity";

export class ValidateAuthInputDto extends PickType(User, ['email', 'password' ]) {}

export class ValidateAuthOutputDto extends CoreOutPut {
  @IsOptional()
  user?: User;
}