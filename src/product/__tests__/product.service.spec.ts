import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { productEntityMock } from '../__mocks__/product.mock';
import { createProductDTOMock } from '../__mocks__/create-product.mock';
import { CategoryService } from '../../category/category.service';
import { categoryEntityMock } from '../../category/__mocks__/category.mock';
import { returnDeleteMock } from '../__mocks__/delete-product.mock';

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
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
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
    const product = await service.createProduct(createProductDTOMock);
    expect(product).toEqual(productEntityMock);
  });

  it('should return error if category not exists in create', async () => {
    jest
      .spyOn(categoryService, 'findCategoryById')
      .mockRejectedValueOnce(new Error());
    expect(service.createProduct(createProductDTOMock)).rejects.toThrowError();
  });

  it('should return a product in findById', async () => {
    const product = await service.findProductById(productEntityMock.id);
    expect(product).toEqual(productEntityMock);
  });

  it('should return error if product not found', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(service.findProductById(999)).rejects.toThrowError();
  });

  it('should return delete true in delete product', async () => {
    const result = await service.deleteProduct(productEntityMock.id);
    expect(result).toEqual(returnDeleteMock);
  });

  it('should return error if product not found in delete', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(service.deleteProduct(999)).rejects.toThrowError();
  });

  it('should return a product after update', async () => {
    const result = await service.updateProduct(
      productEntityMock.id,
      createProductDTOMock,
    );
    expect(result).toEqual(productEntityMock);
  });

  it('should return error if product not found in update', async () => {
    jest.spyOn(productRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(
      service.updateProduct(productEntityMock.id, createProductDTOMock),
    ).rejects.toThrowError();
  });
});
