/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
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

    const result = await this.userRepository.save(newUser);

    const payload = {
      username: newUser.username,
      id: newUser.id,
    };
    const token = await this.createToken(payload);
    return {
      id: result.id,
      username: result.username,
      token,
    };
  }

  async loginUser(usercredentialDto: LogInUserDto) {
    const { password, ...rest } = await this.userRepository.findOne({
      where: { username: usercredentialDto.username },
    });

    if (!rest.username) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      usercredentialDto.password,
      password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const payload = {
      username: rest.username,
      id: rest.id,
    };

    const token = await this.createToken(payload);

    return {
      ...rest,
      token,
    };
  }

  private async createToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }
}
