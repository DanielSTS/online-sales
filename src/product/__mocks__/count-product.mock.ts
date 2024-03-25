import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { CountProduct } from '../dtos/count-product.dto';

export const countProductMock: CountProduct = {
  category_id: categoryEntityMock.id,
  total: 4,
};
