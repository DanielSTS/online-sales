import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(
    categoryDtoMock: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(categoryDtoMock.name).catch(
      () => undefined,
    );
    if (category) {
      throw new BadRequestException(
        `Category name ${categoryDtoMock.name} already exists`,
      );
    }
    return this.categoryRepository.save(categoryDtoMock);
  }

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = await this.categoryRepository.find();
    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories not found');
    }
    return categories;
  }

  async findCategoryByName(name: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        name,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category  name ${name} not found`);
    }
    return category;
  }
}
