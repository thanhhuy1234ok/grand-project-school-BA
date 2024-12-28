import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Connect back end thành công ',
      host: 'localhost:8080',
    };
  }
}
