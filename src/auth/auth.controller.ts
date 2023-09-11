import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from './auth.interface';
import { LoginAuthOutputDto } from './dtos/login-auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/login-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser, @Res({ passthrough: true}) res: Response): Promise<LoginAuthOutputDto> {
    return this.authService.login(res, req.user);
  }
  
}
