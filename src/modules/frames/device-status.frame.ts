import { Config } from './interfaces/config.interface';
import { Exception } from '../../common/exceptions/exception';
import { JSONUtils } from '../../common/utils/json.utils';
import { Frame } from "./interfaces/frame";

export class DeviceStatusFrame implements Frame {

    private payload: string;
    private imei: string;
    private config: Config;
    private sigtec: string;
    private battery: string;
    private lte: string;
    private alarms: string[];

    constructor(imei: string, payload: string){
        this.imei = imei;
        if(!JSONUtils.isJsonValid(payload)) throw new Exception('JSON is not valid', `Config frame json is not valid: ${payload}`)
        this.payload = payload;
        const {config, sigtec, battery, alarms, lte } = JSON.parse(payload);
        this.isValidPayload(imei, config, sigtec, battery, alarms);
        this.imei = imei;
        this.config = config;
        this.sigtec = sigtec;
        this.battery = battery;
        this.alarms = alarms;
        this.lte = lte;
    }

    private isValidPayload(imei: string, config: Config, sigtec: string, battery: number, alarms: string[]): void {
        if (!imei || !config || !sigtec || battery === undefined || !alarms) {
            throw new Exception('Device Status Frame validation exception', `Invalid payload format: Missing required fields. ${this.payload}`);
        }
        //Añadir las validaciones que me faltan comentar con Pablo
    }

    public getImei(): string {
        return this.imei;
    }

    public getConfig(): Config {
        return this.config;
    }

    public getSigtec(): string {
        return this.sigtec;
    }

    public getBattery(): string {
        return this.battery;
    }

    public getAlarms(): string[] {
        return this.alarms;
    }

    public getLte(): string {
        return this.lte
    }
}

