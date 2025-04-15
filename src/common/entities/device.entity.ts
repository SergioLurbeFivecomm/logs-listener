import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { Address, Alarms, Coverage, WiotData } from "./entitities";
import { GreylistItem } from "./grey-list-item.entity";
import { WhitelistItem } from "./white-list-item.entity";


@Index("address_id", ["addressId"], {})
@Index("idx_sn", ["sn"], {})
@Index("idx_last_message_sent", ["lastMessageSent"], {})
@Entity("device", { schema: "wiot_db" })
export class Device {
    @Column("varchar", { primary: true, name: "imei", length: 15 })
    imei: string;

    @Column("varchar", { name: "sn", length: 30 })
    sn: string;

    @Column("varchar", { name: "imsi", nullable: true, length: 15 })
    imsi: string | null;

    @Column("datetime", { name: "boot_time", nullable: true })
    bootTime: string | null;

    @Column("datetime", { name: "last_message_sent", nullable: true })
    lastMessageSent: string | null;

    @Column("datetime", { name: "registered_time", nullable: true })
    registeredTime: string | null;

    @Column("varchar", {
        name: "report_time",
        nullable: true,
        length: 5,
        default: () => "'23:00'",
    })
    reportTime: string | null;

    @Column("varchar", { name: "firmware", nullable: true, length: 255 })
    firmware: string | null;

    @Column("varchar", { name: "hardware", nullable: true, length: 255 })
    hardware: string | null;

    @Column("int", {
        name: "send_period",
        nullable: true,
        default: () => "'3600'",
    })
    sendPeriod: number | null;

    @Column("int", {
        name: "read_period",
        nullable: true,
        default: () => "'900'",
    })
    readPeriod: number | null;

    @Column("decimal", {
        name: "battery",
        nullable: true,
        precision: 6,
        scale: 4,
    })
    battery: string | null;

    @Column("decimal", {
        name: "first_battery_reported",
        nullable: true,
        precision: 6,
        scale: 4,
    })
    firstBatteryReported: string | null;

    @Column("smallint", {
        name: "signal_threshold",
        nullable: true,
        default: () => "'-120'",
    })
    signalThreshold: number | null;

    @Column("varchar", { name: "sequans_version", nullable: true, length: 50 })
    sequansVersion: string | null;

    @Column("varchar", { name: "apn", nullable: true, length: 100 })
    apn: string | null;

    @Column("varchar", {
        name: "fota",
        nullable: true,
        length: 255,
        default: () => "'None'",
    })
    fota: string | null;

    @Column("varchar", {
        name: "filter_vertical",
        nullable: true,
        length: 500,
        default: () =>
            "'00,01,02,04,07,16,30,37,00,06,15,28,21,25,31,32,33,36,38,05,1d,1e,1f,26,27,34,35,39,3a,3b,3c,3d,3e,3f'",
    })
    filterVertical: string | null;

    @Column("varchar", {
        name: "filter_manufacturer",
        nullable: true,
        length: 255,
        default: () => "'AE4C,A511,0907,9215,2D2C,B44C,9526,304C,1AC3'",
    })
    filterManufacturer: string | null;

    @Column("varchar", { name: "filter_model", nullable: true, length: 100 })
    filterModel: string | null;

    @Column("varchar", {
        name: "wmb_modes",
        nullable: true,
        length: 100,
        default: () => "'T1'",
    })
    wmbModes: string | null;

    @Column("smallint", { name: "wmb_measurement_interval", nullable: true })
    wmbMeasurementInterval: number | null;

    @Column("smallint", {
        name: "wmb_measurement_window",
        nullable: true,
        default: () => "'25'",
    })
    wmbMeasurementWindow: number | null;

    @Column("varchar", { name: "key", nullable: true, length: 100 })
    key: string | null;

    @Column("int", { name: "address_id", default: () => "'1'" })
    addressId: number;

    @ManyToOne(() => Address, (address) => address.devices, {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
    })
    @JoinColumn([{ name: "address_id", referencedColumnName: "id" }])
    address: Address;

    @OneToMany(() => WiotData, (wiotData) => wiotData.device)
    wiotData: WiotData[];

    @OneToMany(() => GreylistItem, (greylistItem) => greylistItem.device)
    greylistItems: GreylistItem[];

    @OneToMany(() => WhitelistItem, (whitelistItem) => whitelistItem.device)
    whitelistItems: WhitelistItem[];

    @OneToMany(() => Alarms, (alarms) => alarms.device)
    alarms: Alarms[];

    @OneToMany(() => Coverage, (coverage) => coverage.device)
    coverages: Coverage[];
}
