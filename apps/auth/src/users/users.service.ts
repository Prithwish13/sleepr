import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const alreadyExists = await this.userRepository.findOne({
      email,
    });
    if (alreadyExists) {
      throw new BadRequestException({
        status: 400,
        error: true,
        message: 'user already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepository.create({
      email,
      password: hashedPassword,
    });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userRepository.findOne({
      email,
    });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException({
        status: 401,
        error: true,
        message: 'password is invalid',
      });
    }
    return user;
  }

  async getUser({ _id }: GetUserDto) {
    return this.userRepository.findOne({ _id });
  }
}
