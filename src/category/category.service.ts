import {
  BadRequestException,
  Injectable,
  NotFoundException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { ReturnCategoryDTO } from './dtos/return-category.dto';
import { CountProduct } from '../product/dtos/count-product.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,

    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
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

  findAmountCategoryInProducts(
    category: CategoryEntity,
    countList: CountProduct[],
  ): number {
    const count = countList.find(
      (itemCount) => itemCount.category_id === category.id,
    );

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategoryDTO[]> {
    const categories = await this.categoryRepository.find();
    const count = await this.productService.countProdutsByCategoryId();
    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories not found');
    }
    return categories.map(
      (category) =>
        new ReturnCategoryDTO(
          category,
          this.findAmountCategoryInProducts(category, count),
        ),
    );
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
