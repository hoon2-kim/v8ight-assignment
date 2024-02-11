import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { RtGuard } from './guards/rt.guard';
import { ITokenResponse } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ITokenResponse> {
    return await this.authService.login(loginUserDto, res);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  async restoreAccessToken(
    @CurrentUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ITokenResponse> {
    return await this.authService.restore(userId, res);
  }
}
