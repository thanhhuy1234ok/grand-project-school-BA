import { Controller, Get, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './helpers/decorator/customize';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get()
  @Version(null)
  getHello() {
    return this.appService.getHello();
  }
}
