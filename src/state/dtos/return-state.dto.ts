import { StateEntity } from '../entities/state.entity';

export default class ReturnStateDTO {
  name: string;

  constructor(stateEntity: StateEntity) {
    this.name = stateEntity.name;
  }
}
