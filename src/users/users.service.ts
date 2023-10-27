import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from 'src/users/dtos/create-user.dto';
import { GetUserInputDto, GetUserOutputDto } from 'src/users/dtos/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserInputDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    try {
      const { email, firstName, lastName, password, checkPassword } =
        createUserInputDto;
      const userExist = await this.userRepository.findOne({ where: { email } });

      if (userExist)
        return {
          ok: false,
          message: ['already-submitted'],
          error: 'Conflict',
          statusCode: 409,
        };
      if (password !== checkPassword)
        return { 
          ok: false, 
          message: [],
          error: 'Password does not match.',
          statusCode: 
        };

      const user = this.userRepository.create({
        email,
        firstName,
        lastName,
        password,
      });
      await this.userRepository.save(user);
      return { ok: true,
        statusCode: 200 };
    } catch (error) {
      return { ok: false, error: 'Something went wrong. Try again.' };
    }
  }

  async findOneUser(
    getUserInputDto: GetUserInputDto,
  ): Promise<GetUserOutputDto> {
    try {
      const { email } = getUserInputDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) return { ok: false, error: "Can't find user." };
      return { ok: true, user };
    } catch (error) {
      return { ok: false, error: "Can't find user." };
    }
  }
}
