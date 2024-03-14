import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { CreateProductDTO } from '../dtos/create-product.dto';

export const createProductDTOMock: CreateProductDTO = {
  name: 'namemock',
  categoryId: categoryEntityMock.id,
  price: 34.3,
  image: 'http://image.com',
};
