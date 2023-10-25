import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryEntityMock } from '../__mocks__/category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryEntityMock]),
          },
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(
      getRepositoryToken(CategoryEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return list of categories', async () => {
    const categories = await service.findAllCategories();
    expect(categories).toEqual([categoryEntityMock]);
  });

  it('should return error in list of categories empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce([]);
    expect(service.findAllCategories()).rejects.toThrowError();
  });

  it('should return error in list of categories exception', async () => {
    jest.spyOn(categoryRepository, 'find').mockRejectedValueOnce(new Error());
    expect(service.findAllCategories()).rejects.toThrowError();
  });
});
