import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { UserType } from '../user/enum/user-type.enum';
import { ProductService } from './product.service';
import { ReturnProductDto } from './dtos/returnProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dtos/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllCategories(): Promise<ReturnProductDto[]> {
    return (await this.productService.findAllProducts()).map(
      (category) => new ReturnProductDto(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin)
  @Put('/:productId')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProduct: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(productId, updateProduct);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }
}
