import { IsOptional, IsString } from "class-validator";
import { CoreOutPut } from "src/common/dtos/core.dto";

export class SilentRefreshAuthOutputDto extends CoreOutPut {
  @IsOptional()
  @IsString()
  accessToken?: string;
}