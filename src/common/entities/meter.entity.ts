import {
    Column,
    Entity,
    Index,
    OneToMany,
} from "typeorm";
import { WiotData } from "./entitities";
import { GreylistItem } from "./grey-list-item.entity";
import { WhitelistItem } from "./white-list-item.entity";

@Index("key", ["key"], {})
@Entity("meter", { schema: "wiot_db" })
export class Meter {
    @Column("varchar", { primary: true, name: "meter_id", length: 50 })
    meterId: string;

    @Column("varchar", { name: "key", length: 100 })
    key: string;

    @OneToMany(() => WiotData, (wiotData) => wiotData.meter)
    wiotData: WiotData[];

    @OneToMany(() => GreylistItem, (greylistItem) => greylistItem.meter)
    greylistItems: GreylistItem[];

    @OneToMany(() => WhitelistItem, (whitelistItem) => whitelistItem.meter)
    whitelistItems: WhitelistItem[];
}
