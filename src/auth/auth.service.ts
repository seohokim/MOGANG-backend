import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ValidateAuthInputDto, ValidateAuthOutputDto } from './dtos/validate-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthInputDto, LoginAuthOutputDto } from './dtos/login-auth.dto';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { SilentRefreshAuthOutputDto } from './dtos/silent-refresh-auth.dto';
import { GoogleRequest, RefreshTokenPayload } from './auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider, User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { GOOGLELoginAuthOutputDto } from './dtos/google-login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async validateUser(validateAuthInputDto: ValidateAuthInputDto): Promise<ValidateAuthOutputDto>{
    try{
      const { email, password } = validateAuthInputDto;
      const { user } = await this.userService.findOneUser({ email })
      if (!user) return { ok: false, error: 'User does not exist.' };
      if (user && (await user.validatePassword(password)) === false) {
        return { ok: false,error: 'Password does not match.'};
      }
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: 'Something went wrong. Try again.'};
    }
  }

  async login(res: Response, loginAuthInputDto: LoginAuthInputDto): Promise<LoginAuthOutputDto> {
    try{
      const { ok, error, user } = loginAuthInputDto;
      if (ok === false) return { ok: false, error };
      if(!user) return { ok: false, error: 'Can\'t generate token.' };
      const { id } = user;
      const payload = { id };
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

  async googleLogin(req: GoogleRequest, res: Response): Promise<GOOGLELoginAuthOutputDto> {
    try {
      const {
        user: { email, firstName, lastName, photo},
      } = req;
      let accessToken: string;
      let refreshToken: string;
      //유저 중복 검사
      const findUser = await this.userRepository.findOne({ where: { email } });
      if( findUser && findUser.provider === Provider.Local) {
        return { ok: false, error: '현재 계정으로 가입한 이메일이 존재합니다.' };
      }
      // 유저 생성
      if(!findUser) {
        const googleUser = this.userRepository.create({ email, firstName, lastName, photo, provider: Provider.Google });
        await this.userRepository.save(googleUser);
        //생성된 구글 유저로부터 accessToken & refreshToken 발급
        const googleUserPayload = { id: googleUser.id };
        accessToken = this.jwtService.sign(googleUserPayload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
          expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
        });
        refreshToken = this.jwtService.sign(googleUserPayload, {
          secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
          expiresIn: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
        });
        //쿠기 설정
        res.cookie('refreshToken', refreshToken, {
          expires: new Date(Date.now()+ +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
          httpOnly: true,
        });
        return {
          ok: true,
          accessToken
        };
      }
      //구글 가입이 되어 있는 경우
      const findUserPayload = { id: findUser.id};
      accessToken = this.jwtService.sign(findUserPayload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      refreshToken = this.jwtService.sign(findUserPayload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      });

      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      console.log(error);
      return { ok: false, error: '구글 인증 실패'};
    }
  }

  async silentRefresh(req: Request, res: Response): Promise<SilentRefreshAuthOutputDto> {
    try{
      const getRefreshToken = req.cookies['refreshToken'];
      if (!getRefreshToken) return { ok: false, error: 'Don\'t have cookie.'};
      const refreshTokenPayload: RefreshTokenPayload = await this.jwtService.verify(getRefreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
      });

      const payload = { id: refreshTokenPayload.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
        expiresIn: +this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
        expiresIn: +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      });

      res.cookie('refreshToken', refreshToken, {
        expires: new Date(Date.now() + +this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
        httpOnly: true,
      });
      return {
        ok: true,
        accessToken,
      };
    } catch (error) {
      return { ok: false, error: '로그인 연장 실패'};
    }
  }
}
