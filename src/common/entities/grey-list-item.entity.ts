import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Device, Meter } from "./entitities";


@Index("meter_id", ["meterId"], {})
@Index("idx_greylist_imei_reception_time", ["deviceImei", "receptionTime"], {})
@Entity("greylist_item", { schema: "wiot_db" })
export class GreylistItem {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "reception_time" })
    receptionTime: string;

    @Column("smallint", { name: "rssi" })
    rssi: number;

    @Column("smallint", { name: "view_count" })
    viewCount: number;

    @Column("varchar", { name: "device_imei", length: 15 })
    deviceImei: string;

    @Column("varchar", { name: "meter_id", length: 50 })
    meterId: string;

    @ManyToOne(() => Device, (device) => device.greylistItems, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "device_imei", referencedColumnName: "imei" }])
    device: Device;

    @ManyToOne(() => Meter, (meter) => meter.greylistItems, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "meter_id", referencedColumnName: "meterId" }])
    meter: Meter;
}
