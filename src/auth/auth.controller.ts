import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { AtGuard } from './guards/at.guard';
import { RtGuard } from './guards/rt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginUserDto, res);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  restoreAccessToken(
    @CurrentUser('id') userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.restore(userId, res);
  }
}
