import { Module } from '@nestjs/common';
import { BearingProductsController } from './bearing-products.controller';
import { BearingProductsService } from './bearing-products.service';

@Module({
  controllers: [BearingProductsController],
  providers: [BearingProductsService],
  exports: [BearingProductsService],
})
export class BearingProductsModule {}
