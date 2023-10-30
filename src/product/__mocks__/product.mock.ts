import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { ProductEntity } from '../entities/product.entity';

export const productEntityMock: ProductEntity = {
  id: 12431,
  categoryId: categoryEntityMock.id,
  name: 'namemock',
  price: 34.3,
  image: 'http://image.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};
