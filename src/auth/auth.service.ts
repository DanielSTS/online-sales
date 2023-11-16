import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { ReturnLoginDto } from './dtos/return-login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDto } from '../user/dtos/return-user.dto';
import { LoginPayloadDto } from './dtos/login-payload.dto';
import { validatePassword } from '../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<ReturnLoginDto> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDto.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(
      loginDto.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid ');
    }

    return {
      user: new ReturnUserDto(user),
      accessToken: await this.jwtService.signAsync({
        ...new LoginPayloadDto(user),
      }),
    };
  }
}
