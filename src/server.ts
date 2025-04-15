import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();
import { AppDataSource } from './config/typeorm-config';
import { logger } from './config/winston-config';
import { RepositoryFactory } from './common/factories/repository-factory';
import { MqttService } from './modules/mqtt/mqtt.service';
import { BrokerConfig } from './config/mqtt.config';
import { EnvironmentValidatorConfig } from './config/environment-validator.config';
import { SchemaValidator } from './config/schema-validator.config';

async function initializeApp() {
    try {
        new EnvironmentValidatorConfig();
        await AppDataSource.initialize();
        logger.info('Data Source has been initialized!');
        const repositoryFactory = new RepositoryFactory(AppDataSource);

        const schemaValidator = new SchemaValidator(AppDataSource);
        await schemaValidator.validate();

        new MqttService(BrokerConfig, repositoryFactory);
    } catch (error) {
        logger.error('Error during initialization: ' + error.message);
    }
}

initializeApp();
