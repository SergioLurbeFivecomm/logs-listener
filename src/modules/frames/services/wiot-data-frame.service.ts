import { FrameService } from "../interfaces/frame-service";
import { WiotDataFrame } from '../wiot-data.frame';
import { RepositoryFactory } from "../../../common/factories/repository-factory";
import { DeviceRepository } from "../../../common/repositories/device.repository";
import { Meter, WiotData } from "../../../common/entities/entitities";
import { WiotDataRepository } from "../../../common/repositories/wiot-data.repository";
import { MeterRepository } from '../../../common/repositories/meter.repository';
import { logger } from "../../../config/winston-config";
import { MqttSenderService } from '../../mqtt/mqtt-sender.service';
import { DeviceCommonService } from '../../../common/services/device-common.service';

export class WiotDataFrameService implements FrameService {
    private timestamp: string;
    private mqttSenderService: MqttSenderService;
    private wiotDataRepository: WiotDataRepository;
    private deviceRepository: DeviceRepository;
    private meterRepository: MeterRepository;
    private deviceCommonService: DeviceCommonService;

    constructor(repositoryFactory: RepositoryFactory, timestamp: string) {
        this.timestamp = timestamp;
        this.wiotDataRepository = repositoryFactory.createWiotDataRepository();
        this.deviceRepository = repositoryFactory.createDeviceRepository();
        this.meterRepository = repositoryFactory.createMeterRepository();
        this.deviceCommonService = new DeviceCommonService(this.deviceRepository);
    }

    
    async handleMessage(wiotDataFrame: WiotDataFrame): Promise<void> {
        const imei = wiotDataFrame.getImei();
        try {
            const dataFields = wiotDataFrame.getWiotData();
            const device = await this.deviceCommonService.findDeviceByImei(imei);
            const receivedTime = wiotDataFrame.getBackupTime();

            const baseDateStr = receivedTime.split(' ')[0];

            for (const item of dataFields) {
                if (item.hora >= 24) continue;

                const hour = String(item.hora ?? 0).padStart(2, '0');
                const minutes = String(item.minutos ?? 0).padStart(2, '0');
                const seconds = String(item.segundos ?? 0).padStart(2, '0');
                const captureTime = `${baseDateStr} ${hour}:${minutes}:${seconds}`;
                const wiotData: WiotData = {
                    device: device,
                    rssi: item.RSSI,
                    dataFrame: item.datos,
                    receptionTime: this.timestamp,
                    captureTime: captureTime,
                    meter: await this.getMeter(item.datos, wiotDataFrame)
                };

                await this.wiotDataRepository.createWiotData(wiotData);
            }
            
            device.lastMessageSent = this.timestamp;
            await this.deviceRepository.updateDeviceByImei(imei, device);
        } catch (error) {
            logger.error('Error in WiotDataFrameService ' + error.message);
        } finally {
            this.mqttSenderService.sendMessage(`r${imei}`, '{ACK}');
        }
    }
    


    private async getMeter(dataFrame: string, wiotDataFrame: WiotDataFrame): Promise<Meter> {
        const meter_id = wiotDataFrame.getIsSensusRf() ? dataFrame.substring(4, 12).padEnd(16, '0') : dataFrame.substring(4, 20);
        try {
            const meterAux = await this.meterRepository.findMeterById(meter_id);
            if (!meterAux) {
                const meterNew = new Meter();
                meterNew.meterId = meter_id;
                await this.meterRepository.createMeter(meterNew);
                return meterNew;
            }
            return meterAux;
        } catch (error) {
            logger.error(error.message);
        }
    }

}