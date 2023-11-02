import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { BannerService } from './banner.service';
import { GetBannerOutputDto } from './dto/get-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanner(
    @Res() res,
    @Query('id') id?: number,
  ): Promise<GetBannerOutputDto> {
    if (id) {
      const result = await this.bannerService.getBannerById(id);
      return res.status(result.statusCode).json(result);
    } else {
      const result = await this.bannerService.getLatestBanner();
      return res.status(result.statusCode).json(result);
    }
  }
}
