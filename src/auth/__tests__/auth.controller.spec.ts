import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Response } from 'express';
import { mockLoginUserDto, mockTokensResponse } from 'test/mock/mock-data';
import { mockAuthService } from 'test/mock/mock-service';

const mockResponse = {
  cookie: jest.fn().mockReturnThis(),
} as unknown as Response;

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('[AuthController.loginUser] - 로그인', () => {
    it('로그인 성공', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockTokensResponse);

      const result = await authController.loginUser(
        mockLoginUserDto,
        mockResponse,
      );

      expect(result).toEqual(mockTokensResponse);
      expect(authService.login).toBeCalled();
      expect(authService.login).toBeCalledWith(mockLoginUserDto, mockResponse);
    });
  });

  describe('[AuthController.restoreAccessToken] - access_token 재발급', () => {
    const mockUserId = 1;

    it('재발급 성공', async () => {
      jest.spyOn(authService, 'restore').mockResolvedValue(mockTokensResponse);

      const result = await authController.restoreAccessToken(
        mockUserId,
        mockResponse,
      );

      expect(result).toEqual(mockTokensResponse);
      expect(authService.restore).toBeCalled();
      expect(authService.restore).toBeCalledWith(mockUserId, mockResponse);
    });
  });
});
