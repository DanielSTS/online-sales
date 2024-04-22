import { OrderEntity } from '../entities/order.entity';
import { ReturnUserDTO } from '../../user/dtos/return-user.dto';
import { ReturnAddressDTO } from '../../address/dtos/return-address.dto';
import { ReturnPaymentDTO } from '../../payment/dtos/return-payment.dto';
import { ReturnOrderProductDTO } from '../../order-product/dtos/return-order-product.dto';

export class ReturnOrderDTO {
  id: number;
  date: string;
  user?: ReturnUserDTO;
  address?: ReturnAddressDTO;
  payment?: ReturnPaymentDTO;
  ordersProduct?: ReturnOrderProductDTO[];
  userId: number;
  addressId: number;
  paymentId: number;

  constructor(order: OrderEntity) {
    this.id = order.id;
    this.date = order.date.toString();
    this.userId = order.userId;
    this.addressId = order.addressId;
    this.paymentId = order.paymentId;
    this.user = order.user ? new ReturnUserDTO(order.user) : undefined;
    this.address = order.address
      ? new ReturnAddressDTO(order.address)
      : undefined;
    this.payment = order.payment
      ? new ReturnPaymentDTO(order.payment)
      : undefined;
    this.ordersProduct = order.ordersProduct
      ? order.ordersProduct.map(
          (orderProduct) => new ReturnOrderProductDTO(orderProduct),
        )
      : undefined;
  }
}
