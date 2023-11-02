import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CoreOutPut {
  @IsBoolean()
  @IsNotEmpty()
  ok: boolean;

  @IsString()
  @IsOptional()
  error?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsOptional()
  message?: string[];

  @IsNumber()
  statusCode: number;
}
