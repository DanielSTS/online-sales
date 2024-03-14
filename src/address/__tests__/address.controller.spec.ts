import { Test, TestingModule } from '@nestjs/testing';
import { userEntityMock } from '../../user/__mocks__/user.mock';
import { AddressController } from '../address.controller';
import { AddressService } from '../address.service';
import { addressEntityMock } from '../__mocks__/address.mock';
import { createAddressMock } from '../__mocks__/create-address.mock';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn().mockResolvedValue(addressEntityMock),
            findAddressByUserId: jest
              .fn()
              .mockResolvedValue([addressEntityMock]),
          },
        },
      ],
      controllers: [AddressController],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(addressService).toBeDefined();
  });

  it('should address Entity in createAddress', async () => {
    const address = await controller.createAddress(
      createAddressMock,
      userEntityMock.id,
    );

    expect(address).toEqual(addressEntityMock);
  });

  it('should address Entity in findAddressByUserId', async () => {
    const addresses = await controller.findAddressByUserId(userEntityMock.id);

    expect(addresses).toEqual([
      {
        complement: addressEntityMock.complement,
        numberAddress: addressEntityMock.numberAddress,
        cep: addressEntityMock.cep,
      },
    ]);
  });
});
