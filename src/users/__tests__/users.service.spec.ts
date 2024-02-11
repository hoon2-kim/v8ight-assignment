import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  mockCreatedUser,
  mockCreateUserDto,
  mockUser,
} from 'test/mock/mock-data';
import { mockUserRepository } from 'test/mock/mock-repositoy';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersService } from '../users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('[회원가입]', () => {
    it('회원가입 성공', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValueOnce(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockCreatedUser);

      const result = await usersService.signup(mockCreateUserDto);

      expect(result).toEqual(mockCreatedUser);
    });

    it('유저 회원가입 실패 - 이메일 중복(400에러)', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValue(mockUser);

      try {
        await usersService.signup(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('유저 회원가입 실패 - 닉네임 중복(400에러)', async () => {
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValueOnce(null);
      jest
        .spyOn(usersService, 'findOneUserByOptions')
        .mockResolvedValue(mockUser);

      try {
        await usersService.signup(mockCreateUserDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
