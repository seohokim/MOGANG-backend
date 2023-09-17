import { IsOptional, IsString } from "class-validator";
import { CoreOutPut } from "src/common/dtos/core.dto";

export class GOOGLELoginAuthOutputDto extends CoreOutPut {
  @IsOptional()
  @IsString()
  accessToken?: string;
}