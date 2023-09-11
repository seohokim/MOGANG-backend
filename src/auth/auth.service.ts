import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ValidateAuthInputDto, ValidateAuthOutputDto } from './dtos/validate-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthInputDto, LoginAuthOutputDto } from './dtos/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto>{
    try{
      const { email, password } = validateAuthInputDto;
      const { user } = await this.userService.findOneUser({ email })
      if (!user) return { ok: false, error: 'User does not exist.' };
      if (user && (await user.validatePassword(password)) === false) {
        return { ok: false, error: 'Password does not match.'};
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'Something went wrong. Try again.'};
    }
  }

  async login(res: Response, loginAuthInputDto: LoginAuthInputDto): Promise<LoginAuthOutputDto> {
    const { ok, error, user } = loginAuthInputDto;
    if (ok === false) return { ok: false, error };
    if(!user) return { ok: false, error: 'Can\'t generate token.' };
    const { id, firstName, lastName, email } = user;
    const payload = { id, firstName, lastName, email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + + this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
      httpOnly: true,
    });
    return {
      ok: true,
      accessToken,
    };
  } catch (error) {
    console.log(error);
    return { ok: false, error:'Authorization failed'};
  }
}
