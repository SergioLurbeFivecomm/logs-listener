import { RepositoryFactory } from "../../../common/factories/repository-factory";
import { AddressRepository, DeviceRepository, } from "../../../common/repositories/repositories";
import { FrameService } from "../interfaces/frame-service";
import { SigtecFrame } from '../sigtec.frame';
import { Address, Device, Coverage } from "../../../common/entities/entitities";
import { DateUtils } from "../../../common/utils/date.utils";
import { logger } from "../../../config/winston-config";
import { CoverageRepository } from '../../../common/repositories/coverage.repository';
import { MqttSenderService } from '../../mqtt/mqtt-sender.service';
import { DeviceCommonService } from '../../../common/services/device-common.service';


export class SigtecFrameService implements FrameService {
    private mqttSenderService: MqttSenderService;
    private addressRepository: AddressRepository;
    private deviceRepository: DeviceRepository;
    private coverageRepository: CoverageRepository;
    private deviceCommonService: DeviceCommonService;

    constructor(mqttSenderService: MqttSenderService, repositoryFactory: RepositoryFactory) {
        this.mqttSenderService = mqttSenderService;
        this.addressRepository = repositoryFactory.createAddressRepository();
        this.deviceRepository = repositoryFactory.createDeviceRepository();
        this.coverageRepository = repositoryFactory.createCoverageRepository();
        this.deviceCommonService = new DeviceCommonService(this.deviceRepository);
    }

    async handleMessage(sigtecFrame: SigtecFrame): Promise<void> {
        const imei = sigtecFrame.getImei();
        const [address, device] = await Promise.all([
            this.addressRepository.findAddressByImei(imei),
            this.deviceCommonService.findDeviceByImei(imei)
        ]);
        const coverage = this.constructCoverage(sigtecFrame, device);
        this.coverageRepository.createCoverage(coverage);
        device.battery = sigtecFrame.getBattery();
        device.lastMessageSent = sigtecFrame.getTimestamp();
        this.deviceRepository.updateDeviceByImei(imei, device);
        this.sendFrame(address, device, imei)
    }


    private constructCoverage(sigtecFrame: SigtecFrame, device: Device): Coverage {
        return {
            cc: sigtecFrame.getCc(),
            nc: sigtecFrame.getNc(),
            tac: sigtecFrame.getTac(),
            band: sigtecFrame.getBand(),
            earfcn: sigtecFrame.getEarfcn(),
            rsrp: sigtecFrame.getRsrp(),
            rsrq: sigtecFrame.getRsrq(),
            pwd: sigtecFrame.getPwd(),
            paging: sigtecFrame.getPaging(),
            cid: sigtecFrame.getCid(),
            bw: sigtecFrame.getBw(),
            idCov: sigtecFrame.getIdCov(),
            timestamp: sigtecFrame.getTimestamp(),
            device: device
        }
    }

    private sendFrame(address: Address, device: Device, imei: string): void {
        const localTime = DateUtils.getCurrentDateStringFormat();
        try {
            let message = {
                reportTime: device.reportTime,
                granularity: device.wmbMeasurementWindow,
                wmbMode: 0,
                fotaIp: address.fotaIp,
                update: device.fota,
                allowedManufacturers: device.filterManufacturer,
                allowedTypes: device.filterVertical,
                srvAddr: address.primary + ',' + address.secondary,
                currentTime: localTime, 
            };
            this.mqttSenderService.sendMessage(`r${imei}`, JSON.stringify(message));
        } catch (error) {
            logger.error('Error in SigtecFrame.sendFrame: ' + error.message);
        }
    }
}
