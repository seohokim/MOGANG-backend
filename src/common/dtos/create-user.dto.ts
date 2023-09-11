import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { CoreOutPut } from "./core.dto";
import { User } from "src/users/entities/user.entity";

export class CreateUserInputDto extends PickType(User, ['email', 'firstName', 'lastName', 'password']) {
  @IsString()
  checkPassword: string;
}

export class CreateUserOutputDto extends CoreOutPut {

}