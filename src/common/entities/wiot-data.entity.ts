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
@Index("idx_data_imei_capture_time", ["deviceImei", "captureTime"], {})
@Entity("wiot_data", { schema: "wiot_db" })
export class WiotData {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id?: number;

    @Column("datetime", { name: "capture_time" })
    captureTime: string;

    @Column("datetime", { name: "reception_time" })
    receptionTime: string;

    @Column("varchar", { name: "meter_id", length: 50 })
    meterId?: string;

    @Column("varchar", { name: "device_imei", length: 15 })
    deviceImei?: string;

    @Column("varchar", { name: "data_frame", length: 6200 })
    dataFrame: string;

    @Column("smallint", { name: "rssi" })
    rssi: number;

    @ManyToOne(() => Meter, (meter) => meter.wiotData, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "meter_id", referencedColumnName: "meterId" }])
    meter: Meter;

    @ManyToOne(() => Device, (device) => device.wiotData, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "device_imei", referencedColumnName: "imei" }])
    device: Device;
}
