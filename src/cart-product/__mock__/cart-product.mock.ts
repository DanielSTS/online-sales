import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { CartProductEntity } from '../entities/cart-product.entity';

export const cartProductEntityMock: CartProductEntity = {
  amount: 5435,
  cartId: cartEntityMock.id,
  createdAt: new Date(),
  id: 234,
  productId: productEntityMock.id,
  updatedAt: new Date(),
};
