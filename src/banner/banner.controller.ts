import { Body, Controller, Get, Query, Req, Res } from '@nestjs/common';
import { BannerService } from './banner.service';
import { GetBannerInputDto, GetBannerOutputDto } from './dto/get-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getBanner(
    @Res() res,
    @Body() getBannerInputDto: GetBannerInputDto,
  ): Promise<GetBannerOutputDto> {
    if (getBannerInputDto) {
      const result = await this.bannerService.getBannerById(getBannerInputDto);
      return res.status(result.statusCode).json(result);
    } else {
      const result = await this.bannerService.getLatestBanner();
      return res.status(result.statusCode).json(result);
    }
  }
}
