import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { ValidateAuthOutputDto } from "../dtos/validate-auth.dto";
import { AuthService } from "../auth.service";
import { plainToClass } from "class-transformer";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<ValidateAuthOutputDto> {
    try{
      const result = await this.authService.validateUser({ email, password });
      const { ok, error } = result;
      let { user } = result;
      if (ok === false) return { ok: false, error };
      if(!user) {
        return { ok: false, error: 'Authorization failed.'};
      }
      const plainUser = user.toJSON();
      user = plainToClass(User, plainUser);
      //console.log(user);
      return { ok: true, user };
    } catch (error) {
      console.log(error);
      return { ok: false, error: 'Something went wrong. Try again.'};
    }
  }
}