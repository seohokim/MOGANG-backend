import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entity/banner.entity';
import { Repository } from 'typeorm';
import { GetBannerInputDto, GetBannerOutputDto } from './dto/get-banner.dto';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async getLatestBanner(): Promise<GetBannerOutputDto> {
    try {
      const banner = await this.bannerRepository.findOne({
        order: { createdAt: 'DESC' },
      });
      if (!banner) {
        return {
          ok: false,
          message: ['not-found'],
          error: 'Not Found',
          statusCode: 404,
        };
      }
      return { ok: true, banner, statusCode: 200 };
    } catch (error) {
      return {
        ok: false,
        message: [error.toString()],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }

  async getBannerById(
    getBannerInputDto: GetBannerInputDto,
  ): Promise<GetBannerOutputDto> {
    try {
      const { id } = getBannerInputDto;
      if (id === 0) {
        return this.getLatestBanner();
      } else {
        const banner = await this.bannerRepository.findOne({
          where: { id },
        });
        if (!banner) {
          return {
            ok: false,
            message: ['not-found'],
            error: 'Not Found',
            statusCode: 404,
          };
        }
        return { ok: true, banner, statusCode: 200 };
      }
    } catch (error) {
      return {
        ok: false,
        message: [error.toString()],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }
}
