import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { CreateProductDto } from '../dtos/createProduct.dto';

export const createProductDtoMock: CreateProductDto = {
  name: 'namemock',
  categoryId: categoryEntityMock.id,
  price: 34.3,
  image: 'http://image.com',
};