import { OrderEntity } from '../entities/order.entity';
import { ReturnUserDTO } from '../../user/dtos/return-user.dto';

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDTO;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
  }
}
