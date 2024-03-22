import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { paymentMock } from '../__mocks__/payment.mock';
import { paymentPixMock } from '../__mocks__/payment-pix.mock';
import { PaymentPixEntity } from '../entities/payment-pix.entity';
import { PaymentCreditCardEntity } from '../entities/payment-credit-card.entity';
import { paymentCreditCardMock } from '../__mocks__/payment-credit-card.mock';
import { BadRequestException } from '@nestjs/common';
import { cartEntityMock } from '../../cart/__mocks__/cart.mock';
import {
  createOrderCreditCardMock,
  createOrderPixMock,
} from '../../order/__mocks__/create-order.mock';
import { productEntityMock } from '../../product/__mocks__/product.mock';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<PaymentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(paymentMock),
          },
        },
        PaymentService,
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<PaymentEntity>>(
      getRepositoryToken(PaymentEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(paymentRepository).toBeDefined();
  });

  it('should save payment pix in DB', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderPixMock,
      [productEntityMock],
      cartEntityMock,
    );

    const savePayment: PaymentPixEntity = spy.mock
      .calls[0][0] as PaymentPixEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.code).toEqual(paymentPixMock.code);
    expect(savePayment.datePayment).toEqual(paymentPixMock.datePayment);
  });

  it('should save payment credit card in DB', async () => {
    const spy = jest.spyOn(paymentRepository, 'save');
    const payment = await service.createPayment(
      createOrderCreditCardMock,
      [productEntityMock],
      cartEntityMock,
    );

    const savePayment: PaymentCreditCardEntity = spy.mock
      .calls[0][0] as PaymentCreditCardEntity;

    expect(payment).toEqual(paymentMock);
    expect(savePayment.amountPayments).toEqual(
      paymentCreditCardMock.amountPayments,
    );
  });

  it('should return exception in not send data', async () => {
    expect(
      service.createPayment(
        {
          addressId: createOrderCreditCardMock.addressId,
        },
        [productEntityMock],
        cartEntityMock,
      ),
    ).rejects.toThrowError(BadRequestException);
  });
});
