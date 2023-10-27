import { Controller, Get, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Response } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getMainData(@Res() res: Response) {
    const result = await this.dashboardService.getMainData();

    if (result.ok) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  }
}
