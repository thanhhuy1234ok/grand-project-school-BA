import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VnPayService } from './vn-pay.service';
import { CreateVnPayDto } from './dto/create-vn-pay.dto';
import { UpdateVnPayDto } from './dto/update-vn-pay.dto';
import { Request } from 'express';

@Controller('vn-pay')
export class VnPayController {
  constructor(private readonly vnPayService: VnPayService) {}

  @Post('payment-url')
  createPaymentUrl(
    @Body() createVnpayDto: CreateVnPayDto,
    @Req() request: Request,
  ) {
    return this.vnPayService.createUrl(createVnpayDto, request);
  }

  @Get()
  findAll() {
    return this.vnPayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vnPayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVnPayDto: UpdateVnPayDto) {
    return this.vnPayService.update(+id, updateVnPayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vnPayService.remove(+id);
  }
}
