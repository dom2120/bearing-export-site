import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AdminGuard } from '@server/common/guards/admin.guard';
import { BearingOrdersService } from './bearing-orders.service';
import type {
  BearingOrder,
  CreateOrderDto,
  OrderListResponse,
  ExchangeRateResponse,
} from '@shared/api.interface';

@Controller('orders')
export class BearingOrdersController {
  constructor(private readonly bearingOrdersService: BearingOrdersService) {}

  @Post()
  async create(@Body() dto: CreateOrderDto): Promise<BearingOrder> {
    return this.bearingOrdersService.create(dto);
  }

  @Get('exchange-rate')
  async getExchangeRate(
    @Query('from') from = 'USD',
    @Query('to') to = 'CNY',
  ): Promise<ExchangeRateResponse> {
    return this.bearingOrdersService.getExchangeRate(from, to);
  }

  @Get('lookup/:orderNo')
  async getByOrderNo(@Param('orderNo') orderNo: string): Promise<BearingOrder> {
    return this.bearingOrdersService.getByOrderNo(orderNo);
  }

  @UseGuards(AdminGuard)
  @Get('export')
  async exportCsv(
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('keyword') keyword?: string,
    @Res() res?: Response,
  ): Promise<void> {
    const csv = await this.bearingOrdersService.exportCsv(status, paymentStatus, keyword);
    if (res) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="orders_${Date.now()}.csv"`,
      );
      res.send(csv);
    }
  }

  @UseGuards(AdminGuard)
  @Get()
  async getList(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
    @Query('paymentStatus') paymentStatus?: string,
    @Query('keyword') keyword?: string,
  ): Promise<OrderListResponse> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20;
    return this.bearingOrdersService.getList(pageNum, pageSizeNum, status, paymentStatus, keyword);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<BearingOrder> {
    return this.bearingOrdersService.getById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    dto: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
      notes?: string;
    },
  ): Promise<BearingOrder> {
    return this.bearingOrdersService.update(id, dto, 'admin');
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bearingOrdersService.delete(id);
  }
}
