import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../__mocks__/product.mock';
import { createProductDtoMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryEntityMock } from '../../category/__mocks__/category.mock';

describe('ProductService', () => {
  let service: ProductService;
  let categoryService: CategoryService;
  let productRepository: Repository<ProductEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: CategoryService,
          useValue: {
            findCategoryById: jest.fn().mockResolvedValue(categoryEntityMock),
          },
        },
        {
          provide: getRepositoryToken(ProductEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(productEntityMock),
            find: jest.fn().mockResolvedValue([productEntityMock]),
            save: jest.fn().mockResolvedValue(productEntityMock),
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoryService>(CategoryService);
    productRepository = module.get<Repository<ProductEntity>>(
      getRepositoryToken(ProductEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(productRepository).toBeDefined();
  });

  it('should return list of products', async () => {
    const categories = await service.findAllProducts();
    expect(categories).toEqual([productEntityMock]);
  });

  it('should return error in list of products empty', async () => {
    jest.spyOn(productRepository, 'find').mockResolvedValueOnce([]);
    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return error in list of products exception', async () => {
    jest.spyOn(productRepository, 'find').mockRejectedValueOnce(new Error());
    expect(service.findAllProducts()).rejects.toThrowError();
  });

  it('should return a product after save', async () => {
    const product = await service.createProduct(createProductDtoMock);
    expect(product).toEqual(productEntityMock);
  });

  it('should return error if category not exists in create', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockRejectedValueOnce(new Error());
    expect(service.createProduct(createProductDtoMock)).rejects.toThrowError();
  });
});
