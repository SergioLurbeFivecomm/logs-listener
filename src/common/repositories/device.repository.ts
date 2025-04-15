
import { DataSource, In, Repository, UpdateResult } from 'typeorm';
import { Device } from '../entities/device.entity';


export class DeviceRepository {
    private readonly _repository: Repository<Device>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(Device);
    }
    async findDeviceByImei(imei: string): Promise<Device | null> {
        const devices = await this._repository.find({
            where: { imei },
            order: { bootTime: 'DESC' }
        });
        return devices[0] ?? null;
    }
    
    
    findDevicesByImeis(imeis: string[]): Promise<Device[]> {
        return this._repository.find({ where: { imei: In(imeis) } });
    }

    updateDeviceByImei(imei: string, updatedProperties: Partial<Device>): Promise<UpdateResult> {
        return this._repository.update({ imei }, updatedProperties);
    }
}
