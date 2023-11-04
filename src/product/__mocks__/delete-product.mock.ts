import { DeleteResult } from 'typeorm';

export const returnDeleteMock: DeleteResult = {
  raw: true,
  affected: 1,
};
