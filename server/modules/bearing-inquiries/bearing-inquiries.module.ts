import { Module } from '@nestjs/common';
import { BearingInquiriesController } from './bearing-inquiries.controller';
import { BearingInquiriesService } from './bearing-inquiries.service';

@Module({
  controllers: [BearingInquiriesController],
  providers: [BearingInquiriesService],
  exports: [BearingInquiriesService],
})
export class BearingInquiriesModule {}
