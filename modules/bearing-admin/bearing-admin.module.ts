import { Module } from '@nestjs/common';
import { BearingAdminController } from './bearing-admin.controller';
import { BearingAdminService } from './bearing-admin.service';
import { BearingAdminDashboardService } from './admin-dashboard.service';
import { BearingAdminProductCrudService } from './admin-product-crud.service';
import { BearingAdminCategoryCrudService } from './admin-category-crud.service';
import { BearingAdminContentCrudService } from './admin-content-crud.service';
import { BearingAdminNewsCrudService } from './admin-news-crud.service';

@Module({
  controllers: [BearingAdminController],
  providers: [
    BearingAdminService,
    BearingAdminDashboardService,
    BearingAdminProductCrudService,
    BearingAdminCategoryCrudService,
    BearingAdminContentCrudService,
    BearingAdminNewsCrudService,
  ],
  exports: [BearingAdminService],
})
export class BearingAdminModule {}
