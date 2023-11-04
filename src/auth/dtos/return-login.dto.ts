import { ReturnUserDto } from '../../user/dtos/return-user.dto';

export interface ReturnLoginDto {
  user: ReturnUserDto;
  accessToken: string;
}
