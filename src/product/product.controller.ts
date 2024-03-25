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
import { ReturnProductDTO } from './dtos/return-product.dto';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDTO } from './dtos/create-product.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAllCategories(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAll([], true)).map(
      (category) => new ReturnProductDTO(category),
    );
  }

  @Roles(UserType.Admin)
  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(
    @Body() createProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin)
  @Put('/:productId')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProduct: UpdateProductDTO,
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
