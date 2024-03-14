import { userEntityMock } from '../../user/__mocks__/user.mock';
import { ReturnLoginDTO } from '../dtos/return-login.dto';
import { jwtMock } from './jwt.mock';

export const returnLoginMock: ReturnLoginDTO = {
  accessToken: jwtMock,
  user: userEntityMock,
};
