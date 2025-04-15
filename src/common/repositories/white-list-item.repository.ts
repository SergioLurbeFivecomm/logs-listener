import { DataSource, Repository } from 'typeorm';
import { WhitelistItem } from '../entities/entitities';



export class WhiteListItemRepository {
    private readonly _repository: Repository<WhitelistItem>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(WhitelistItem);
    }

    //!TODO: En whitelist si el timestamp no es el de hoy no enviarla.
    findWhiteListByImei(imei: string): Promise<WhitelistItem[]> {
        return this._repository
            .createQueryBuilder('whitelist')
            .innerJoin('whitelist.device', 'device')
            .innerJoinAndSelect('whitelist.meter', 'meter')
            .where('device.imei = :imei', { imei })
            .andWhere('whitelist.is_active = :is_active', { is_active: 1 })
            .getMany();
    }
    
    createWhiteListByList(whiteList: WhitelistItem[]) {
        return this._repository.save(whiteList);
    }
}
