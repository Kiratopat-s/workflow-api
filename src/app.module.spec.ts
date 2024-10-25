import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { INestApplication } from '@nestjs/common';

describe('AppModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(AppModule).toBeDefined();
    });

    it('should have AppController', () => {
        const appController = app.get<AppController>(AppController);
        expect(appController).toBeInstanceOf(AppController);
    });

    it('should have AppService', () => {
        const appService = app.get<AppService>(AppService);
        expect(appService).toBeInstanceOf(AppService);
    });

});