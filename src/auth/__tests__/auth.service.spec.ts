import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { JwtService } from '@nestjs/jwt';
import { jwtMock } from '../__mocks__/jwt.mock';
import { loginDto } from '../__mocks__/login-user.mock';
import { ReturnUserDto } from '../../user/dtos/returnUser.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(userEntityMock),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(jwtMock),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userService).toBeDefined();
  });

  it('should return user if email and password valids', async () => {
    const auths = await service.login(loginDto);
    expect(auths).toEqual({
      user: new ReturnUserDto(userEntityMock),
      accessToken: jwtMock,
    });
  });

  it('should return error if email is valid and password is invalid', async () => {
    expect(
      service.login({ ...loginDto, password: 'invalid' }),
    ).rejects.toThrowError();
  });

  it('should return error if email not exists', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(undefined);
    expect(service.login(loginDto)).rejects.toThrowError();
  });

  it('should return errorin UserService', async () => {
    jest
      .spyOn(userService, 'findUserByEmail')
      .mockRejectedValueOnce(new Error());
    expect(service.login(loginDto)).rejects.toThrowError();
  });
});
