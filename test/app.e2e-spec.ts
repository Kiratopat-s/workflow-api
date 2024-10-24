import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World! This is API of Workfow application developed by @kiratipatS.');
  });

  it('/auth/login (POST) - Unauthorized', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'wronguser',
        password: 'wrongpassword'
      })
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Wrong username or password',
        error: 'Unauthorized'
      });
  });

  it('/auth/login (POST) - OK', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword'
      })
      .expect(201)
      .expect(res => {
        expect(res.body.access_token).toBeDefined();
        expect(res.body.refresh_token).toBeDefined();
      });
  });

  it('/auth/refresh (POST) - Wrong token', () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .send({
        refresh: 'wrongtoken'
      })
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized'
      });
  });

  afterAll(async () => {
    await app.close();
  });


});
