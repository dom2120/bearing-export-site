import { Module } from '@nestjs/common';
import { BearingOrdersController } from './bearing-orders.controller';
import { BearingOrdersService } from './bearing-orders.service';
import { BearingOrdersExportService } from './orders-export.service';

@Module({
  controllers: [BearingOrdersController],
  providers: [BearingOrdersService, BearingOrdersExportService],
  exports: [BearingOrdersService],
})
export class BearingOrdersModule {}
