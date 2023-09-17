import { Controller, Post, UseGuards, Res, Req, Get } from '@nestjs/common';
import { GoogleRequest, RequestWithUser } from './auth.interface';
import { LoginAuthOutputDto } from './dtos/login-auth.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/login-auth.guard';
import { Request, Response } from 'express';
import { SilentRefreshAuthOutputDto } from './dtos/silent-refresh-auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { GOOGLELoginAuthOutputDto } from './dtos/google-login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true}) res: Response): Promise<LoginAuthOutputDto> {
    return this.authService.login(res, req.user);
  }

  @Post('silent-refresh')
  async silentRefresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<SilentRefreshAuthOutputDto> {
    return this.authService.silentRefresh(req, res)
  }
}

@Controller('google')
export class GoogleController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() _req: Request) {}

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(
    @Req() req: GoogleRequest,
    @Res({ passthrough: true }) res: Response,
  ): Promise<GOOGLELoginAuthOutputDto> {
    return this.authService.googleLogin(req, res);
  }
}
