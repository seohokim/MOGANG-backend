import { IsOptional, IsString } from "class-validator";
import { CoreOutPut } from "src/common/dtos/core.dto";
import { User } from "src/users/entities/user.entity";

export class LoginAuthInputDto extends CoreOutPut {
  @IsOptional()
  @IsString()
  user?: User;
}

export class LoginAuthOutputDto extends CoreOutPut {
  @IsOptional()
  @IsString()
  accessToken?: string;
}

