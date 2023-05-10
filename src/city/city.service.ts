import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { CityEntity } from './entities/city.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class CityService {

    constructor(
        @InjectRepository(CityEntity)
        private readonly cityRepository: Repository<CityEntity>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async getAllCitiesByState(stateId: number): Promise<CityEntity[]> {
        const citiesCached: CityEntity[] = await this.cacheManager.get(`${stateId}`);
        if (citiesCached) {
            return citiesCached;
        }
        const cities = await this.cityRepository.find({
            where: {
                stateId,
            },
        });
        await this.cacheManager.set(`${stateId}`, cities);
        return cities;
    }
}
