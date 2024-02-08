import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOneUserByOptions(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne(options);

    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, nickname, password } = createUserDto;

    const existEmail = await this.findOneUserByOptions({
      where: { email },
    });

    if (existEmail) {
      throw new BadRequestException(`Email:${email}은(는) 이미 존재합니다.`);
    }

    const existNickname = await this.findOneUserByOptions({
      where: { nickname },
    });

    if (existNickname) {
      throw new BadRequestException(
        `Nickname:${nickname}은(는) 이미 존재합니다.`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
