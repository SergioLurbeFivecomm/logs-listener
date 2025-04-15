import { DateUtils } from "../../common/utils/date.utils";
import { Frame } from "./interfaces/frame";


export class SigtecFrame implements Frame {
    private imei: string;
    private battery: string;
    private coverageValues: string[];
    private cc: number;
    private nc: string;
    private tac: number;
    private band: string;
    private earfcn: number;
    private rsrp: string;
    private rsrq: string;
    private pwd: number;
    private paging: number;
    private cid: string;
    private bw: number;
    private idCov: number;
    private timestamp: string;


    constructor(imei: string, payload: string, timestamp: string){
        this.imei = imei;
        const coverageValues = this.extractCoverageValues(payload.split(';'));
        this.transformToCoverage(coverageValues, timestamp);
        let splitPayload = payload.split(';');
        this.battery = splitPayload[splitPayload.length - 2];
    }


    private extractCoverageValues(payloadParts: string[]): Record<string, string> {
        const frameCoverage = payloadParts[payloadParts.length - 3];
        return frameCoverage.split(' ').reduce((result, value) => {
            const [key, val] = value.split(':');
            if (key && val) {
                result[key] = val;
            }
            return result;
        }, {});
    }

    private transformToCoverage(values: Record<string, string>, timestamp: string): void {
        this.cc = parseInt(values['Cc'], 10);
        this.nc = values['Nc'];
        this.tac = parseInt(values['TAC'], 10);
        this.band = values['BAND'];
        this.earfcn =  parseInt(values['EARFCN'], 10);
        this.rsrp =  values['RSRP'];
        this.rsrq =  values['RSRQ'];
        this.pwd =  parseInt(values['PWR'], 10);
        this.paging =  parseInt(values['PAGING'], 10);
        this.cid =  values['CID'];
        this.bw =  parseInt(values['BW'], 10);
        this.idCov =  parseInt(values['Id'], 10);
        this.timestamp = timestamp;
    }


    public getCoverageValues(): string[] {
        return this.coverageValues;
    }

    public getImei(): string {
        return this.imei;
    }

    public getBattery(): string {
        return this.battery;
    }

    public getCc(): number {
        return this.cc;
    }

    public getNc(): string {
        return this.nc;
    }

    public getTac(): number {
        return this.tac;
    }

    public getBand(): string {
        return this.band;
    }

    public getEarfcn(): number {
        return this.earfcn;
    }

    public getRsrp(): string {
        return this.rsrp;
    }

    public getRsrq(): string {
        return this.rsrq;
    }

    public getPwd(): number {
        return this.pwd;
    }

    public getPaging(): number {
        return this.paging;
    }

    public getCid(): string {
        return this.cid;
    }

    public getBw(): number {
        return this.bw;
    }

    public getIdCov(): number {
        return this.idCov;
    }

    public getTimestamp(): string {
        return this.timestamp;
    }
}