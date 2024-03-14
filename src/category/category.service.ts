import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(
      createCategoryDTO.name,
    ).catch(() => undefined);
    if (category) {
      throw new BadRequestException(
        `Category name ${createCategoryDTO.name} already exists`,
      );
    }
    return this.categoryRepository.save(createCategoryDTO);
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
      throw new NotFoundException(`Category name ${name} not found`);
    }
    return category;
  }

  async findCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException(`Category Id ${id} not found`);
    }
    return category;
  }
}
