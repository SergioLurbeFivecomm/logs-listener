import {
    Column,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Device } from "./entitities";


@Index("idx_address_fota_ip", ["fotaIp"], {})
@Entity("address", { schema: "wiot_db" })
export class Address {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id?: number;

    @Column("varchar", { name: "primary", length: 255 })
    primary: string;

    @Column("varchar", { name: "secondary", length: 255 })
    secondary: string;

    @Column("varchar", { name: "fota_ip", length: 255 })
    fotaIp: string;

    @OneToMany(() => Device, (device) => device.address)
    devices?: Device[];
}
