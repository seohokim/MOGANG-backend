import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CoreOutPut } from 'src/common/dtos/core.dto';
import { User } from 'src/users/entities/user.entity';

export class CreateUserInputDto extends PickType(User, [
  'email',
  'firstName',
  'lastName',
  'password',
]) {
  @IsString()
  checkPassword: string;
}

export class CreateUserOutputDto extends CoreOutPut {}
