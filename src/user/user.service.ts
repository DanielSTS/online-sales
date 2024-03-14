import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserType } from './enum/user-type.enum';
import { UpdatePasswordDTO } from './dtos/update-password.dto';
import { createHashedPassword, validatePassword } from '../utils/password';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const user = await this.findUserByEmail(createUserDTO.email).catch(
      () => undefined,
    );
    if (user) {
      throw new BadRequestException('email registered in system');
    }
    const passwordHashed = await createHashedPassword(createUserDTO.password);
    return this.userRepository.save({
      ...createUserDTO,
      typeUser: UserType.User,
      password: passwordHashed,
    });
  }

  async getAllUser(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async getUserByIdUsingRelations(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        addresses: {
          city: {
            state: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`userId: ${userId} not found`);
    }
    return user;
  }

  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException(`userId: ${userId} not found`);
    }
    return user;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException(`email: ${email} not found`);
    }
    return user;
  }

  async updatePasswordUser(
    updatePasswordDTO: UpdatePasswordDTO,
    userId: number,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);
    const passwordHashed = await createHashedPassword(
      updatePasswordDTO.newPassword,
    );
    const isMatch = await validatePassword(
      updatePasswordDTO.lastPassword,
      user.password,
    );
    if (!isMatch) {
      throw new BadRequestException('Last password invalid');
    }
    return this.userRepository.save({
      ...user,
      password: passwordHashed,
    });
  }
}
