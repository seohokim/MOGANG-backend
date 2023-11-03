import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInputDto } from 'src/users/dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(
    @Res() res: Response,
    @Body() createUserInputDto: CreateUserInputDto,
  ) {
    const result = await this.usersService.createUser(createUserInputDto);

    if (result.ok) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('comparison')
  getProfie(@Request() req) {
    //TODO comparion 구현
    return req.user;
  }
}
