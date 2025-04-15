import { DataSource, Repository, UpdateResult } from 'typeorm';
import { GreylistItem } from '../entities/grey-list-item.entity';


export class GreyListItemRepository {
    private readonly _repository: Repository<GreylistItem>;

    constructor(dataSource: DataSource) {
        this._repository = dataSource.getRepository(GreylistItem);
    }

    findAllByImeiDate(imei: string, date: string): Promise<GreylistItem[]> {
        return this._repository
            .createQueryBuilder('greyList')
            .innerJoinAndSelect('greyList.meter', 'meter')
            .innerJoin('greyList.device', 'device')
            .where('device.imei = :imei AND Date(greyList.timestamp) = Date(:date)', { imei, date })
            .getMany();
    }

    findLastGreyListItemByMeterId(meter_id: string): Promise<GreylistItem> {
        return this._repository
            .createQueryBuilder('greyList')
            .innerJoin('greyList.meter', 'meter')
            .where('meter.meter_id = :meter_id', {meter_id})
            .orderBy('meter.id', 'DESC')
            .getOne()
    }

    updateGreyListItem(id: number, updatedGreyList: Partial<GreylistItem>): Promise<UpdateResult>{
        return this._repository.update({id}, updatedGreyList);
    }

    createGreyListItem(greyList: Partial<GreylistItem>){
        return this._repository.save(greyList);
    }





}
