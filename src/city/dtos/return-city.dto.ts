import { CityEntity } from '../entities/city.entity';
import ReturnStateDTO from '../../state/dtos/return-state.dto';

export default class ReturnCityDTO {
  name: string;
  state: ReturnStateDTO;

  constructor(cityEntity: CityEntity) {
    this.name = cityEntity.name;
    this.state = cityEntity.state
      ? new ReturnStateDTO(cityEntity.state)
      : undefined;
  }
}
