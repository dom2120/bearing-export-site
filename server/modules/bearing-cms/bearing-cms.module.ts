import { Module } from '@nestjs/common';
import { BearingCmsController } from './bearing-cms.controller';
import { BearingCmsService } from './bearing-cms.service';

@Module({
  controllers: [BearingCmsController],
  providers: [BearingCmsService],
  exports: [BearingCmsService],
})
export class BearingCmsModule {}
