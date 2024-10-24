import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World! This is API of Workfow application developed by @kiratipatS.';
  }
}
