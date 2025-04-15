import { DeviceStatusFrame } from '../device-status.frame';
import { ConfigResponse } from '../interfaces/response/config-response';
import { DateUtils } from '../../../common/utils/date.utils';
import { FrameService } from '../interfaces/frame-service';
import { DeviceRepository } from '../../../common/repositories/device.repository';
import { Exception } from '../../../common/exceptions/exception';
import { Device } from '../../../common/entities/device.entity';
import { Config } from '../interfaces/config.interface';
import { AddressRepository, CoverageRepository, AlarmsRepository} from '../../../common/repositories/repositories';
import { DeviceStatusHelper } from '../../../common/helpers/device-status.helper';
import { Address } from '../../../common/entities/address.entity';
import { RepositoryFactory } from '../../../common/factories/repository-factory';
import { MqttSenderService } from '../../mqtt/mqtt-sender.service';
import { DeviceCommonService } from '../../../common/services/device-common.service';

export class DeviceStatusFrameService implements FrameService {
    private mqttSenderService: MqttSenderService;
    private deviceRepository: DeviceRepository;
    private coverageRepository: CoverageRepository;
    private alarmsRepository: AlarmsRepository;
    private addressRepository: AddressRepository;
    private deviceCommonService: DeviceCommonService;

    constructor(mqttSenderService: MqttSenderService, repositoryFactory: RepositoryFactory) {
        this.mqttSenderService = mqttSenderService;
        this.deviceRepository = repositoryFactory.createDeviceRepository();
        this.coverageRepository = repositoryFactory.createCoverageRepository();
        this.alarmsRepository = repositoryFactory.createAlarmsRepository();
        this.addressRepository = repositoryFactory.createAddressRepository();
        this.deviceCommonService = new DeviceCommonService(this.deviceRepository)
    }

    async handleMessage(deviceStatusFrame: DeviceStatusFrame): Promise<void> {
        const imei = deviceStatusFrame.getImei();
        const device = await this.deviceCommonService.findDeviceByImei(imei);
        const address = await this.addressRepository.findAddressByImei(imei);
        if(!address) throw new Exception('Address not found', `Address not found for imei: ${imei} in Device Status Frame Service handle message`)
        const update = device.fota;
        await this.updateDeviceStatusProperties(deviceStatusFrame, device, address);
        this.sendResponse(device, address, imei, update);
    }

    private sendResponse(device: Device, address: Address, imei: string, update: string): void {
        const response: ConfigResponse = {
            reportTime: device.reportTime,
            granularity: device.wmbMeasurementWindow,
            wmbModes: device.wmbModes,
            fotaIp: address.fotaIp,
            update: update,
            allowedManufacturers: device.filterManufacturer,
            allowedTypes: device.filterVertical,
            srvAddr: address.primary + ',' + address.secondary,
            currentTime: DateUtils.getCurrentDateStringFormat()
        };
    
        if (process.env.READ_SEND_PERIODS_ENABLED == '1') {
            response.sendPeriod = device.sendPeriod;
            response.readPeriod = device.readPeriod;
        }
    
        this.mqttSenderService.sendMessage(`r${imei}`, JSON.stringify(response));
    }
    

    private async updateDeviceStatusProperties(deviceStatusFrame: DeviceStatusFrame, device: Device, address: Address) {
        device.fota = 'None';
        device.lastMessageSent = DateUtils.getCurrentDateStringFormat();
        const coverage = DeviceStatusHelper.prepareCoverage(deviceStatusFrame.getSigtec(), device);
        const alarms = DeviceStatusHelper.prepareAlarms(deviceStatusFrame.getAlarms(), device);
        const devicePrepared = DeviceStatusHelper.prepareDevice(deviceStatusFrame, device);
        const addressPrepared = await this.checkAddressUpdate(deviceStatusFrame.getConfig(), address);
        device.address = addressPrepared;
        await Promise.all([
            this.addressRepository.updateAddress(addressPrepared),
            this.deviceRepository.updateDeviceByImei(device.imei, devicePrepared),
            this.coverageRepository.createCoverage(coverage),
            this.alarmsRepository.createAlarms(alarms)
            
        ]);
    }


    private async checkAddressUpdate(config: Config, address: Address): Promise<Address> {
        if (!config.fotaIp) return address;

        const addressAux: Address = {
            primary: address.primary,
            secondary: address.secondary,
            fotaIp: config.fotaIp
        };
        const existingAddress = await this.addressRepository.findAddress(addressAux);
        if (existingAddress) return existingAddress;
        
        const newAddress: Address = { ...addressAux };
        await this.addressRepository.createAddress(newAddress);
        return newAddress;
    }



    // private checkIfAddressIsDifferent(config: Config, address: Address): Address {
    //     if (config.srvAddr[0] == address.primary && config.srvAddr[1] == address.secondary && config.fotaIp == address.fotaIp) return address;
    // }

}
