import { Module } from '@nestjs/common';
import { VnPayService } from './vn-pay.service';
import { VnPayController } from './vn-pay.controller';

@Module({
  controllers: [VnPayController],
  providers: [VnPayService],
})
export class VnPayModule {}
