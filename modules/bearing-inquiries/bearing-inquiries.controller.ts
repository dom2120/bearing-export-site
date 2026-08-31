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
import { BearingInquiriesService } from './bearing-inquiries.service';
import type { BearingInquiry, CreateInquiryDto, InquiryListResponse } from '@shared/api.interface';

@Controller('inquiries')
export class BearingInquiriesController {
  constructor(private readonly bearingInquiriesService: BearingInquiriesService) {}

  @Post()
  async create(@Body() dto: CreateInquiryDto): Promise<BearingInquiry> {
    return this.bearingInquiriesService.create(dto);
  }

  @UseGuards(AdminGuard)
  @Get('export')
  async exportCsv(
    @Query('status') status?: string,
    @Query('keyword') keyword?: string,
    @Res() res?: Response,
  ): Promise<void> {
    const csv = await this.bearingInquiriesService.exportCsv(status, keyword);
    if (res) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="inquiries_${Date.now()}.csv"`,
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
    @Query('keyword') keyword?: string,
  ): Promise<InquiryListResponse> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20;
    return this.bearingInquiriesService.getList(pageNum, pageSizeNum, status, keyword);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async getById(@Param('id') id: string): Promise<BearingInquiry> {
    return this.bearingInquiriesService.getById(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: { status?: string; replyContent?: string },
  ): Promise<BearingInquiry> {
    return this.bearingInquiriesService.update(id, dto, 'admin');
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.bearingInquiriesService.delete(id);
  }
}
