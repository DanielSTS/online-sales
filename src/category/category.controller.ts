import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReturnCategoryDTO } from './dtos/return-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { CreateCategoryDTO } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Roles(UserType.User, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAllCategories(): Promise<ReturnCategoryDTO[]> {
    return (await this.categoryService.findAllCategories()).map(
      (category) => new ReturnCategoryDTO(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() createCategory: CreateCategoryDTO,
  ): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
