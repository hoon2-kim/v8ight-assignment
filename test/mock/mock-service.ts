export const mockUsersService = {
  signup: jest.fn(),
  findOneUserByOptions: jest.fn(),
};

export const mockJwtService = {
  signAsync: jest.fn(),
};

export const mockAuthService = {
  login: jest.fn(),
  restore: jest.fn(),
};

export const mockPostsService = {
  findOnePostByOptions: jest.fn(),
  findAllPosts: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  upload: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const mockCommentsService = {
  findAllByPost: jest.fn(),
  createComment: jest.fn(),
  updateComment: jest.fn(),
  deleteComment: jest.fn(),
};

export const mockAwsS3Service = {
  deleteS3Object: jest.fn(),
  uploadFileToS3: jest.fn(),
};
