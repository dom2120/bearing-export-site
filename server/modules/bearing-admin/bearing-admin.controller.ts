import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from '@server/common/guards/admin.guard';
import { BearingAdminService } from './bearing-admin.service';
import type {
  DashboardStats,
  BearingProduct,
  BearingCategory,
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
} from '@shared/api.interface';
import {
  ProductCreateBody,
  ProductUpdateBody,
  CategoryCreateBody,
  CategoryUpdateBody,
  BannerCreateBody,
  BannerUpdateBody,
  CaseCreateBody,
  CaseUpdateBody,
  NewsCreateBody,
  NewsUpdateBody,
  SettingUpdateBody,
} from './admin.dto';

@UseGuards(AdminGuard)
@Controller('admin')
export class BearingAdminController {
  constructor(private readonly bearingAdminService: BearingAdminService) {}

  @Get('dashboard')
  async getDashboard(): Promise<DashboardStats> {
    return this.bearingAdminService.getDashboard();
  }

  // ============ Products ============

  @Post('products')
  async createProduct(@Body() dto: ProductCreateBody): Promise<BearingProduct> {
    return this.bearingAdminService.createProduct(dto, 'admin');
  }

  @Put('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: ProductUpdateBody,
  ): Promise<BearingProduct> {
    return this.bearingAdminService.updateProduct(id, dto, 'admin');
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.bearingAdminService.deleteProduct(id);
  }

  // ============ Categories ============

  @Post('categories')
  async createCategory(@Body() dto: CategoryCreateBody): Promise<BearingCategory> {
    return this.bearingAdminService.createCategory(dto, 'admin');
  }

  @Put('categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: CategoryUpdateBody,
  ): Promise<BearingCategory> {
    return this.bearingAdminService.updateCategory(id, dto, 'admin');
  }

  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCategory(@Param('id') id: string): Promise<void> {
    await this.bearingAdminService.deleteCategory(id);
  }

  // ============ Banners ============

  @Post('banners')
  async createBanner(@Body() dto: BannerCreateBody): Promise<BearingBanner> {
    return this.bearingAdminService.createBanner(dto, 'admin');
  }

  @Put('banners/:id')
  async updateBanner(
    @Param('id') id: string,
    @Body() dto: BannerUpdateBody,
  ): Promise<BearingBanner> {
    return this.bearingAdminService.updateBanner(id, dto, 'admin');
  }

  @Delete('banners/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBanner(@Param('id') id: string): Promise<void> {
    await this.bearingAdminService.deleteBanner(id);
  }

  // ============ Cases ============

  @Post('cases')
  async createCase(@Body() dto: CaseCreateBody): Promise<BearingCase> {
    return this.bearingAdminService.createCase(dto, 'admin');
  }

  @Put('cases/:id')
  async updateCase(
    @Param('id') id: string,
    @Body() dto: CaseUpdateBody,
  ): Promise<BearingCase> {
    return this.bearingAdminService.updateCase(id, dto, 'admin');
  }

  @Delete('cases/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCase(@Param('id') id: string): Promise<void> {
    await this.bearingAdminService.deleteCase(id);
  }

  // ============ News ============

  @Post('news')
  async createNews(@Body() dto: NewsCreateBody): Promise<BearingNews> {
    return this.bearingAdminService.createNews(dto, 'admin');
  }

  @Put('news/:id')
  async updateNews(
    @Param('id') id: string,
    @Body() dto: NewsUpdateBody,
  ): Promise<BearingNews> {
    return this.bearingAdminService.updateNews(id, dto, 'admin');
  }

  @Delete('news/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNews(@Param('id') id: string): Promise<void> {
    await this.bearingAdminService.deleteNews(id);
  }

  // ============ Settings ============

  @Put('settings/:key')
  async updateSetting(
    @Param('key') key: string,
    @Body() dto: SettingUpdateBody,
  ): Promise<CmsSetting> {
    return this.bearingAdminService.updateSetting(key, dto, 'admin');
  }
}
