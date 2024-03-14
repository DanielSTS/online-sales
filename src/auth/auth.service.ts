import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { UserService } from '../user/user.service';
import { ReturnLoginDTO } from './dtos/return-login.dto';
import { UserEntity } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ReturnUserDTO } from '../user/dtos/return-user.dto';
import { LoginPayloadDTO } from './dtos/login-payload.dto';
import { validatePassword } from '../utils/password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(loginDTO: LoginDTO): Promise<ReturnLoginDTO> {
    const user: UserEntity | undefined = await this.userService
      .findUserByEmail(loginDTO.email)
      .catch(() => undefined);

    const isMatch = await validatePassword(
      loginDTO.password,
      user?.password || '',
    );

    if (!user || !isMatch) {
      throw new NotFoundException('Email or password invalid ');
    }

    return {
      user: new ReturnUserDTO(user),
      accessToken: await this.jwtService.signAsync({
        ...new LoginPayloadDTO(user),
      }),
    };
  }
}
