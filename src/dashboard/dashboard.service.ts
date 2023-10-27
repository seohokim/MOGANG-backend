import { Injectable } from '@nestjs/common';
import { Banner } from './entities/banner.entity';
import { GetDashboardOutputDto } from './dtos/get-dashboard.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from 'src/lectures/entities/lecture.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
    @InjectRepository(Banner)
    private readonly bannerRepository: Repository<Banner>,
  ) {}

  async getMainData(): Promise<GetDashboardOutputDto> {
    try {
      const banner = await this.bannerRepository.findOne({
        //배너 최신순으로 나열해서 하나 고르기
        order: { createdAt: 'DESC' },
      });

      const lectures = await this.lectureRepository.find({
        //lecture 3개 최신순으로 나열 후 3개 고르기
        order: { createdAt: 'DESC' },
        take: 3,
      });

      return {
        ok: true,
        banner,
        lectures,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not get main data',
      };
    }
  }
}
