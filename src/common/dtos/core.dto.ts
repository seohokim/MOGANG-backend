import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CoreOutPut{
  @IsBoolean()
  @IsNotEmpty()
  ok: boolean;

  @IsString()
  @IsOptional()
  error?: string;
}
