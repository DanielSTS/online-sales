import { cityEntityMock } from '../../city/__mocks__/city.mock';
import { CreateAddressDto } from '../dtos/create-address.dto';

export const createAddressMock: CreateAddressDto = {
  cep: '58410452',
  cityId: cityEntityMock.id,
  complement: 'complement',
  numberAddress: 123,
};
