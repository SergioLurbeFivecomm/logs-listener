import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Device } from "./entitities";

@Index("idx_coverage_imei_reception_time", ["deviceImei", "receptionTime"], {})
@Entity("coverage", { schema: "wiot_db" })
export class Coverage {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id?: number;

  @Column("datetime", { name: "reception_time" })
  receptionTime: string;

  @Column("smallint", { name: "cc" })
  cc: number;

  @Column("varchar", { name: "nc", length: 10 })
  nc: string;

  @Column("int", { name: "tac" })
  tac: number;

  @Column("varchar", { name: "band", length: 10 })
  band: string;

  @Column("smallint", { name: "earfcn" })
  earfcn: number;

  @Column("decimal", { name: "rsrp", precision: 6, scale: 2 })
  rsrp: string;

  @Column("decimal", { name: "rsrq", precision: 6, scale: 2 })
  rsrq: string;

  @Column("smallint", { name: "pwd" })
  pwd: number;

  @Column("smallint", { name: "paging" })
  paging: number;

  @Column("varchar", { name: "cid", length: 255 })
  cid: string;

  @Column("int", { name: "bw" })
  bw: number;

  @Column("int", { name: "id_cov" })
  idCov: number;

  @Column("varchar", { name: "device_imei", length: 15 })
  deviceImei?: string;

  @ManyToOne(() => Device, (device) => device.coverages, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_imei", referencedColumnName: "imei" }])
  device: Device;
}
