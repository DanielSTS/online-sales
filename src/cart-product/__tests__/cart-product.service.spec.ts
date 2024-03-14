import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductService } from '../../product/product.service';
import { Repository } from 'typeorm';
import { CartProductService } from '../cart-product.service';
import { CartProductEntity } from '../entities/cart-product.entity';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import { returnDeleteMock } from '../../product/__mocks__/delete-product.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';

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
            findOne: '',
            sabe: '',
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
});
