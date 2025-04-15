import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Device } from "./entitities";

@Index("idx_alarms_imei_reception_time", ["deviceImei", "receptionTime"], {})
@Entity("alarms", { schema: "wiot_db" })
export class Alarms {
    @PrimaryGeneratedColumn({ type: "int", name: "id" })
    id?: number;

    @Column("datetime", { name: "reception_time" })
    receptionTime: string;

    @Column("tinyint", {
        name: "sd_not_detected",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    sdNotDetected: boolean | null;

    @Column("tinyint", {
        name: "sd_formatted",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    sdFormatted: boolean | null;

    @Column("tinyint", {
        name: "sd_could_not_format",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    sdCouldNotFormat: boolean | null;

    @Column("tinyint", {
        name: "no_wmb_read",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    noWmbRead: boolean | null;

    @Column("tinyint", {
        name: "primary_server_failed",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    primaryServerFailed: boolean | null;

    @Column("tinyint", {
        name: "all_backups_filled",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    allBackupsFilled: boolean | null;

    @Column("tinyint", {
        name: "sim_failed",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    simFailed: boolean | null;

    @Column("tinyint", {
        name: "eprom_failed",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    epromFailed: boolean | null;

    @Column("tinyint", {
        name: "sd_could_not_mount",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    sdCouldNotMount: boolean | null;

    @Column("tinyint", {
        name: "rst_nmi",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    rstNmi: boolean | null;

    @Column("tinyint", {
        name: "rst_hard_fault",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    rstHardFault: boolean | null;

    @Column("tinyint", {
        name: "rst_usage_fault",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    rstUsageFault: boolean | null;

    @Column("tinyint", {
        name: "rst_bus_fault",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    rstBusFault: boolean | null;

    @Column("tinyint", {
        name: "rst_mem_manage",
        nullable: true,
        width: 1,
        default: () => "'0'",
    })
    rstMemManage: boolean | null;

    @Column("varchar", { name: "device_imei", length: 15 })
    deviceImei: string;

    @ManyToOne(() => Device, (device) => device.alarms, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "device_imei", referencedColumnName: "imei" }])
    device: Device;
}
