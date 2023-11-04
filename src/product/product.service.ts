import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoryService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProductDto.categoryId);
    return this.productRepository.save({ ...createProductDto });
  }

  async findAllProducts() {
    const products = await this.productRepository.find();
    if (!products || products.length === 0) {
      throw new NotFoundException('Products not found');
    }
    return products;
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);
    return this.productRepository.delete({ id: productId });
  }

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) {
      throw new NotFoundException(`Product Id ${productId} not found`);
    }
    return product;
  }

  async updateProduct(
    productId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);
    return this.productRepository.save({ ...product, ...updateProductDto });
  }
}
