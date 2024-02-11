import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth.service';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import {
  mockLoginUserDto,
  mockTokensResponse,
  mockUser,
} from 'test/mock/mock-data';
import { mockJwtService, mockUsersService } from 'test/mock/mock-service';

const mockResponse = {
  cookie: jest.fn().mockReturnThis(),
} as unknown as Response;

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(jwtService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('[로그인]', () => {
    it('로그인 성공', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
      jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValue(mockTokensResponse);

      const result = await authService.login(mockLoginUserDto, mockResponse);

      expect(result).toEqual(mockTokensResponse);
      expect(mockResponse.cookie).toBeCalledWith(
        'refreshToken',
        mockTokensResponse.refresh_token,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: parseInt(process.env.JWT_RT_COOKIE_MAX_AGE),
        },
      );
      expect(authService.getTokens).toBeCalledWith(mockUser);
    });

    it('로그인 실패 - 회원가입을 안한 경우(401에러)', async () => {
      jest.spyOn(usersService, 'findOneUserByOptions').mockResolvedValue(null);

      try {
        await authService.login(mockLoginUserDto, mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });

    it('로그인 실패 - 비밀번호가 틀린 경우(401에러)', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

      try {
        await authService.login(mockLoginUserDto, mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('[AccessToken 재발급]', () => {
    const mockUserId = 1;

    it('새로운 access_token 및 refresh_token 발급 성공', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(authService, 'getTokens')
        .mockResolvedValue(mockTokensResponse);

      const result = await authService.restore(mockUserId, mockResponse);

      expect(result).toEqual(mockTokensResponse);
      expect(mockResponse.cookie).toBeCalledWith(
        'refreshToken',
        mockTokensResponse.refresh_token,
        {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          maxAge: parseInt(process.env.JWT_RT_COOKIE_MAX_AGE),
        },
      );
      expect(authService.getTokens).toBeCalledWith(mockUser);
    });

    it('access_token 재발급 실패 - 유저가 없는 경우(401에러)', async () => {
      jest.spyOn(usersService, 'findOneUserByOptions').mockResolvedValue(null);

      try {
        await authService.restore(mockUserId, mockResponse);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
});
