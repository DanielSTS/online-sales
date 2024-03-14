import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { UpdateProductDTO } from '../dtos/update-product.dto';

export const updateProductMock: UpdateProductDTO = {
  categoryId: categoryEntityMock.id,
  image: 'kjbndabk',
  name: 'gdsaga',
  price: 43.0,
};
