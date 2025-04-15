
import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Meter } from '../entities/meter.entity';


export class MeterRepository {
    private readonly _repository: Repository<Meter>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Meter);
    }
    findMeterById(meterId: string): Promise<Meter> {
        return this._repository.findOne({ where: { meterId }});
    }

    updateMeterById(meterId: string, updatedProperties: Partial<Meter>): Promise<UpdateResult> {
        return this._repository.update({ meterId }, updatedProperties);
    }

    createMeter(meter: Partial<Meter>) {
        return this._repository.save(meter);
    }

}
