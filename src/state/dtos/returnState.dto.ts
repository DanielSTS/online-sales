import { StateEntity } from '../entities/state.entity';

export default class ReturnStateDto {
  name: string;

  constructor(stateEntity: StateEntity) {
    this.name = stateEntity.name;
  }
}
