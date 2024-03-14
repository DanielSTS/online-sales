import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '../../product/product.service';
import { Repository } from 'typeorm';
import { CartProductService } from '../cart-product.service';
import { CartProductEntity } from '../entities/cart-product.entity';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import { returnDeleteMock } from '../../product/__mocks__/delete-product.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';
import { insertCartMock } from '../../cart/__mocks__/insert-cart.mock';
import { cartProductEntityMock } from '../__mock__/cart-product.mock';
import { NotFoundException } from '@nestjs/common';
import { updateCartMock } from '../../cart/__mocks__/update-cart.mock';

describe('CartProductService', () => {
  let service: CartProductService;
  let productService: ProductService;
  let cartProductRepository: Repository<CartProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ProductService,
          useValue: {
            findProductById: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
        {
          provide: getRepositoryToken(CartProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(cartProductEntityMock),
            save: jest.fn().mockResolvedValue(cartProductEntityMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
        CartProductService,
      ],
    }).compile();

    service = module.get<CartProductService>(CartProductService);
    productService = module.get<ProductService>(ProductService);
    cartProductRepository = module.get<Repository<CartProductEntity>>(
      getRepositoryToken(CartProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(cartProductRepository).toBeDefined();
  });

  it('should return Delete Result after delete product', async () => {
    const deleteResult = await service.deleteProductCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(deleteResult).toEqual(returnDeleteMock);
  });

  it('should return error in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'delete').mockRejectedValue(new Error());

    expect(
      service.deleteProductCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return CartProduct after create', async () => {
    const productCart = await service.createProductInCart(
      insertCartMock,
      cartEntityMock.id,
    );

    expect(productCart).toEqual(cartProductEntityMock);
  });

  it('should return error in exception delete', async () => {
    jest.spyOn(cartProductRepository, 'save').mockRejectedValue(new Error());

    expect(
      service.createProductInCart(insertCartMock, cartEntityMock.id),
    ).rejects.toThrowError();
  });

  it('should return CartProduct if exist', async () => {
    const productCart = await service.verifyProductInCart(
      productEntityMock.id,
      cartEntityMock.id,
    );

    expect(productCart).toEqual(cartProductEntityMock);
  });

  it('should return error if not found', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.verifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(Error);
  });

  it('should return error in exception verifyProductInCart', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockRejectedValue(new Error());

    expect(
      service.verifyProductInCart(productEntityMock.id, cartEntityMock.id),
    ).rejects.toThrowError(Error);
  });

  it('should return error in exception insertProductInCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.insertProductInCart(insertCartMock, cartEntityMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    const cartProduct = await service.insertProductInCart(
      insertCartMock,
      cartEntityMock,
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0].amount).toEqual(insertCartMock.amount);
  });

  it('should return cart product if not exist cart', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.insertProductInCart(
      insertCartMock,
      cartEntityMock,
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0]).toEqual({
      ...cartProductEntityMock,
      amount: cartProductEntityMock.amount + insertCartMock.amount,
    });
  });

  it('should return error in exception updateProductInCart', async () => {
    jest
      .spyOn(productService, 'findProductById')
      .mockRejectedValue(new NotFoundException());

    expect(
      service.updateProductInCart(updateCartMock, cartEntityMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exist cart (updateProductInCart)', async () => {
    jest.spyOn(cartProductRepository, 'findOne').mockResolvedValue(undefined);

    expect(
      service.updateProductInCart(updateCartMock, cartEntityMock),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should return cart product if not exist cart (updateProductInCart)', async () => {
    const spy = jest.spyOn(cartProductRepository, 'save');

    const cartProduct = await service.updateProductInCart(
      updateCartMock,
      cartEntityMock,
    );

    expect(cartProduct).toEqual(cartProductEntityMock);
    expect(spy.mock.calls[0][0].amount).toEqual(updateCartMock.amount);
  });
});
