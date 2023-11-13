import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreateUserInputDto,
  CreateUserOutputDto,
} from 'src/users/dtos/create-user.dto';
import { GetUserInputDto, GetUserOutputDto } from 'src/users/dtos/get-user.dto';
import {
  generateErrorResponse,
  generateOkResponse,
} from 'src/common/utils/response.util';
import { create } from 'domain';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(
    createUserInputDto: CreateUserInputDto,
  ): Promise<CreateUserOutputDto> {
    try {
      const { email, password, checkPassword } = createUserInputDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        return generateErrorResponse<CreateUserOutputDto>(
          'already-submitted',
          409,
        );
      }

      if (password !== checkPassword) {
        return generateErrorResponse<CreateUserOutputDto>(
          'password-not-match',
          401,
        );
      }

      const newUser = await this.generateUser(createUserInputDto);
      return generateOkResponse<CreateUserOutputDto>(200, { user: newUser });
    } catch (error) {
      return generateErrorResponse<CreateUserOutputDto>(error, 500);
    }
  }

  async generateUser(createUserInputDto: CreateUserInputDto) {
    const { email, firstName, lastName, password } = createUserInputDto;
    const newUser = this.userRepository.create({
      email,
      firstName,
      lastName,
      password,
      provider: 0,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
  async findOneUser(
    getUserInputDto: GetUserInputDto,
  ): Promise<GetUserOutputDto> {
    try {
      const { email } = getUserInputDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        return generateErrorResponse<GetUserOutputDto>('user-not-found', 500);
      }
      return generateOkResponse<GetUserOutputDto>(200, { user });
    } catch (err) {
      return generateErrorResponse<GetUserOutputDto>('server-error', 500);
    }
  }
}
