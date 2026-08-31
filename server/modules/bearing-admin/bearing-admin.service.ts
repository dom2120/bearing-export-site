import { Injectable } from '@nestjs/common';
import { BearingAdminDashboardService } from './admin-dashboard.service';
import { BearingAdminProductCrudService } from './admin-product-crud.service';
import type { ProductCreateDto, ProductUpdateDto } from './admin-product-crud.service';
import { BearingAdminCategoryCrudService } from './admin-category-crud.service';
import type { CategoryCreateDto, CategoryUpdateDto } from './admin-category-crud.service';
import { BearingAdminContentCrudService } from './admin-content-crud.service';
import type { BannerCreateDto, BannerUpdateDto, CaseCreateDto, CaseUpdateDto } from './admin-content-crud.service';
import { BearingAdminNewsCrudService } from './admin-news-crud.service';
import type { NewsCreateDto, NewsUpdateDto } from './admin-news-crud.service';
import type {
  DashboardStats,
  BearingProduct,
  BearingCategory,
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
} from '@shared/api.interface';

@Injectable()
export class BearingAdminService {
  constructor(
    private readonly dashboardService: BearingAdminDashboardService,
    private readonly productCrudService: BearingAdminProductCrudService,
    private readonly categoryCrudService: BearingAdminCategoryCrudService,
    private readonly contentCrudService: BearingAdminContentCrudService,
    private readonly newsCrudService: BearingAdminNewsCrudService,
  ) {}

  // Dashboard
  async getDashboard(): Promise<DashboardStats> {
    return this.dashboardService.getDashboard();
  }

  // Products
  async createProduct(dto: ProductCreateDto, userId: string): Promise<BearingProduct> {
    return this.productCrudService.createProduct(dto, userId);
  }

  async updateProduct(id: string, dto: ProductUpdateDto, userId: string): Promise<BearingProduct> {
    return this.productCrudService.updateProduct(id, dto, userId);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productCrudService.deleteProduct(id);
  }

  // Categories
  async createCategory(dto: CategoryCreateDto, userId: string): Promise<BearingCategory> {
    return this.categoryCrudService.createCategory(dto, userId);
  }

  async updateCategory(id: string, dto: CategoryUpdateDto, userId: string): Promise<BearingCategory> {
    return this.categoryCrudService.updateCategory(id, dto, userId);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryCrudService.deleteCategory(id);
  }

  // Banners
  async createBanner(dto: BannerCreateDto, userId: string): Promise<BearingBanner> {
    return this.contentCrudService.createBanner(dto, userId);
  }

  async updateBanner(id: string, dto: BannerUpdateDto, userId: string): Promise<BearingBanner> {
    return this.contentCrudService.updateBanner(id, dto, userId);
  }

  async deleteBanner(id: string): Promise<void> {
    return this.contentCrudService.deleteBanner(id);
  }

  // Cases
  async createCase(dto: CaseCreateDto, userId: string): Promise<BearingCase> {
    return this.contentCrudService.createCase(dto, userId);
  }

  async updateCase(id: string, dto: CaseUpdateDto, userId: string): Promise<BearingCase> {
    return this.contentCrudService.updateCase(id, dto, userId);
  }

  async deleteCase(id: string): Promise<void> {
    return this.contentCrudService.deleteCase(id);
  }

  // News
  async createNews(dto: NewsCreateDto, userId: string): Promise<BearingNews> {
    return this.newsCrudService.createNews(dto, userId);
  }

  async updateNews(id: string, dto: NewsUpdateDto, userId: string): Promise<BearingNews> {
    return this.newsCrudService.updateNews(id, dto, userId);
  }

  async deleteNews(id: string): Promise<void> {
    return this.newsCrudService.deleteNews(id);
  }

  // CMS Settings
  async updateSetting(
    key: string,
    dto: { settingValue: string; settingType?: string; description?: string },
    userId: string,
  ): Promise<CmsSetting> {
    return this.newsCrudService.updateSetting(key, dto, userId);
  }
}
