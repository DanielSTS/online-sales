import { CategoryEntity } from '../entities/category.entity';

export class ReturnCategoryDTO {
  id: number;
  name: string;
  constructor(categoryEntity: CategoryEntity) {
    this.id = categoryEntity.id;
    this.name = categoryEntity.name;
  }
}
