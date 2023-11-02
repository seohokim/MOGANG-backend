import { IsOptional } from 'class-validator';
import { Banner } from '../entity/banner.entity';
import { CoreOutPut } from 'src/common/dtos/core.dto';

export class GetBannerOutputDto extends CoreOutPut {
  @IsOptional()
  banner?: Banner;
}
