import { IsOptional } from 'class-validator';
import { Banner } from '../entity/banner.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { PickType } from '@nestjs/mapped-types';

export class GetBannerInputDto {
  @IsOptional()
  id?: number;
}

export class GetBannerOutputDto extends CoreOutPut {
  @IsOptional()
  banner?: Banner;
}
