import { UserEntity } from '../entities/user.entity';
import { UserType } from '../enum/user-type.enum';

export const userEntityMock: UserEntity = {
  id: 12431,
  name: 'namemock',
  email: 'emailmock@email.com',
  phone: '88882222',
  cpf: '11111111',
  password: 'largepassword',
  typeUser: UserType.User,
  createdAt: new Date(),
  updatedAt: new Date(),
};
