import { Module } from '@nestjs/common';
import { BearingProductsModule } from './modules/bearing-products/bearing-products.module';
import { BearingCmsModule } from './modules/bearing-cms/bearing-cms.module';
import { BearingInquiriesModule } from './modules/bearing-inquiries/bearing-inquiries.module';
import { BearingOrdersModule } from './modules/bearing-orders/bearing-orders.module';
import { BearingAdminModule } from './modules/bearing-admin/bearing-admin.module';

@Module({
  imports: [
    BearingProductsModule,
    BearingCmsModule,
    BearingInquiriesModule,
    BearingOrdersModule,
    BearingAdminModule,
  ],
})
export class AppModule {}
