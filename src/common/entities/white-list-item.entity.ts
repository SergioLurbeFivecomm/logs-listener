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
@Index("idx_whitelist_imei_assigned_at", ["deviceImei", "assignedAt"], {})
@Entity("whitelist_item", { schema: "wiot_db" })
export class WhitelistItem {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id: number;

    @Column("datetime", { name: "assigned_at" })
    assignedAt: string;

    @Column("tinyint", {
        name: "is_active",
        nullable: true,
        width: 1,
        default: () => "'1'",
    })
    isActive: boolean | null;

    @Column("varchar", { name: "device_imei", length: 15 })
    deviceImei: string;

    @Column("varchar", { name: "meter_id", length: 50 })
    meterId: string;

    @ManyToOne(() => Device, (device) => device.whitelistItems, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "device_imei", referencedColumnName: "imei" }])
    device: Device;

    @ManyToOne(() => Meter, (meter) => meter.whitelistItems, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "meter_id", referencedColumnName: "meterId" }])
    meter: Meter;
}
