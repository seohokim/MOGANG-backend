import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateAuthOutputDto } from '../dtos/validate-auth.dto';
import { AuthService } from '../auth.service';
import { plainToClass } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<ValidateAuthOutputDto> {
    try {
      const result = await this.authService.validateUser({ email, password });
      const { ok, error } = result;
      let { user } = result;
      if (ok === false) return { ok: false, message: [error], statusCode: 500 };
      if (!user) {
        return {
          ok: false,
          message: ['user-not-found'],
          error: 'Unauthorized',
          statusCode: 401,
        };
      }
      const plainUser = user.toJSON();
      user = plainToClass(User, plainUser);
      //console.log(user);
      return { ok: true, user, statusCode: 200 };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        message: ['server-error'],
        error: 'Internal Server Error',
        statusCode: 500,
      };
    }
  }
}
