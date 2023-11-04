import { CityEntity } from '../entities/city.entity';
import ReturnStateDto from '../../state/dtos/return-state.dto';

export default class ReturnCityDto {
  name: string;
  state: ReturnStateDto;

  constructor(cityEntity: CityEntity) {
    this.name = cityEntity.name;
    this.state = cityEntity.state
      ? new ReturnStateDto(cityEntity.state)
      : undefined;
  }
}
