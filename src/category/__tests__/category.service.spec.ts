import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';
import { createCategoryDTOMock } from '../__mocks__/create-category.mock';
import { countProductMock } from '../../product/__mocks__/count-product.mock';
import { ReturnCategoryDTO } from '../dtos/return-category.dto';
import { ProductService } from '../../product/product.service';
import { returnDeleteMock } from '../../__mocks__/return-delete.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ProductService,
          useValue: {
            countProdutsByCategoryId: jest
              .fn()
              .mockResolvedValue([countProductMock]),
          },
        },
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            findOne: jest.fn().mockResolvedValue(categoryEntityMock),
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
            save: jest.fn().mockResolvedValue(categoryEntityMock),
            delete: jest.fn().mockResolvedValue(returnDeleteMock),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    productService = module.get<ProductService>(ProductService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(productService).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return list of categories', async () => {
    const categories = await service.findAllCategories();
    expect(categories).toEqual([
      new ReturnCategoryDTO(categoryEntityMock, countProductMock.total),
    ]);
  });

  it('should return error in list of categories empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([]);
    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error in list of categories exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error());
    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return a category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(undefined);
    const category = await service.createCategory(createCategoryDTOMock);
    expect(category).toEqual(categoryEntityMock);
  });

  it('should return error if exist category name in create', async () => {
    expect(
      service.createCategory(createCategoryDTOMock),
    ).rejects.toThrowError();
  });

  it('should return error in create category exception', async () => {
    jest.spyOn(categoryRepository, 'save').mockRejectedValueOnce(new Error());
    expect(
      service.createCategory(createCategoryDTOMock),
    ).rejects.toThrowError();
  });

  it('should return a category in find by name', async () => {
    const category = await service.findCategoryByName(
      createCategoryDTOMock.name,
    );
    expect(category).toEqual(categoryEntityMock);
  });

  it('should return error in category find by name empty', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(
      service.findCategoryByName(createCategoryDTOMock.name),
    ).rejects.toThrowError();
  });

  it('should return a category in find by id', async () => {
    const category = await service.findCategoryById(categoryEntityMock.id);
    expect(category).toEqual(categoryEntityMock);
  });

  it('should return error in category find by id', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValueOnce(undefined);
    expect(
      service.findCategoryById(categoryEntityMock.id),
    ).rejects.toThrowError();
  });
});
