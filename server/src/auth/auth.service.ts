import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LogInUserDto } from 'src/user/dto/login-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async register(createAuthDto: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: { username: createAuthDto.username },
    });

    if (userFound) {
      throw new BadRequestException('User already exists');
    }

    const hasedPassword = await bcrypt.hash(createAuthDto.password, 10);

    const newUser = this.userRepository.create({
      username: createAuthDto.username,
      password: hasedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async validateUser(usercredentialDto: LogInUserDto) {
    const user = await this.userRepository.findOne({
      where: { username: usercredentialDto.username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      usercredentialDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}
