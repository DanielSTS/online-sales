import { cityEntityMock } from '../../city/__mocks__/city.mock';
import { AddressEntity } from '../entities/address.entity';
import { userEntityMock } from '../../user/__mocks__/user.mock';

export const addressEntityMock: AddressEntity = {
  id: 1,
  cep: '58410452',
  cityId: cityEntityMock.id,
  userId: userEntityMock.id,
  complement: 'complement',
  numberAddress: 123,
  createdAt: new Date(),
  updatedAt: new Date(),
};
