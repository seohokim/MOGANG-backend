import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lecture } from 'src/lectures/entities/lecture.entity';
import { Banner } from './entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lecture, Banner])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService]
})
export class DashboardModule {}
