import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInputDto } from 'src/common/dtos/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserInputDto: CreateUserInputDto) {
    return this.usersService.createUser(createUserInputDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfie(@Request() req) {
    console.log(req.body);
    return req.user;
  }
}