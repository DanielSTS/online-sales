import { cityEntityMock } from '../../city/__mocks__/city.mock';
import { CreateAddressDTO } from '../dtos/create-address.dto';

export const createAddressMock: CreateAddressDTO = {
  cep: '58410452',
  cityId: cityEntityMock.id,
  complement: 'complement',
  numberAddress: 123,
};
