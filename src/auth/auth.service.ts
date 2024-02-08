import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { IJwtPayload, ITokenResponse } from './interfaces/auth.interface';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<ITokenResponse> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findOneUserByOptions({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new UnauthorizedException('비밀번호가 틀렸습니다.');
    }

    const tokens = await this.getTokens(user);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: false, // https환경에서는 true
      sameSite: 'lax', // https환경에서는 none
      maxAge: parseInt(process.env.JWT_RT_COOKIE_MAX_AGE),
    });

    return tokens;
  }

  async restore(userId: number, res: Response) {
    const user = await this.usersService.findOneUserByOptions({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const tokens = await this.getTokens(user);

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: parseInt(process.env.JWT_RT_COOKIE_MAX_AGE),
    });

    return tokens;
  }

  async getTokens(user: UserEntity): Promise<ITokenResponse> {
    const { id, email, nickname } = user;
    const payload: IJwtPayload = {
      id,
      email,
      nickname,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_AT_SECRET,
        expiresIn: process.env.JWT_AT_EXPIRESIN,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_RT_SECRET,
        expiresIn: process.env.JWT_RT_EXPIRESIN,
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
