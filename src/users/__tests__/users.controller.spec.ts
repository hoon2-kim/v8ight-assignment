import { Test, TestingModule } from '@nestjs/testing';
import { mockCreatedUser, mockCreateUserDto } from 'test/mock/mock-data';
import { mockUsersService } from 'test/mock/mock-service';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('[UsersController.signupUser] - 유저 회원가입', () => {
    it('회원가입 성공', async () => {
      jest.spyOn(usersService, 'signup').mockResolvedValue(mockCreatedUser);

      const result = await usersController.signupUser(mockCreateUserDto);

      expect(result).toEqual(mockCreatedUser);
      expect(usersService.signup).toHaveBeenCalled();
      expect(usersService.signup).toBeCalledWith(mockCreateUserDto);
    });
  });
});
