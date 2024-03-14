import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { ReturnLoginDTO } from './dtos/return-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(ValidationPipe)
  @Post()
  async login(@Body() loginDTO: LoginDTO): Promise<ReturnLoginDTO> {
    return this.authService.login(loginDTO);
  }
}
