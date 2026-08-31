import { Controller, Get, Param, Query } from '@nestjs/common';
import { BearingCmsService } from './bearing-cms.service';
import type {
  BearingBanner,
  BearingCase,
  BearingNews,
  BearingProduct,
  CmsSetting,
} from '@shared/api.interface';

interface CaseListResponse {
  items: BearingCase[];
  total: number;
  page: number;
  pageSize: number;
}

interface NewsListResponse {
  items: BearingNews[];
  total: number;
  page: number;
  pageSize: number;
}

interface FeaturedResponse {
  banners: BearingBanner[];
  featuredProducts: BearingProduct[];
  featuredCases: BearingCase[];
}

@Controller('cms')
export class BearingCmsController {
  constructor(private readonly bearingCmsService: BearingCmsService) {}

  @Get('banners')
  async getBanners(@Query('position') position?: string): Promise<BearingBanner[]> {
    return this.bearingCmsService.getBanners(position);
  }

  @Get('cases')
  async getCases(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ): Promise<CaseListResponse> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20;
    return this.bearingCmsService.getCases(pageNum, pageSizeNum);
  }

  @Get('cases/:slug')
  async getCaseBySlug(@Param('slug') slug: string): Promise<BearingCase> {
    return this.bearingCmsService.getCaseBySlug(slug);
  }

  @Get('news')
  async getNews(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
  ): Promise<NewsListResponse> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const pageSizeNum = pageSize ? Math.min(parseInt(pageSize, 10), 100) : 20;
    return this.bearingCmsService.getNews(pageNum, pageSizeNum, category);
  }

  @Get('news/:slug')
  async getNewsBySlug(@Param('slug') slug: string): Promise<BearingNews> {
    return this.bearingCmsService.getNewsBySlug(slug);
  }

  @Get('settings')
  async getSettings(): Promise<CmsSetting[]> {
    return this.bearingCmsService.getSettings();
  }

  @Get('featured')
  async getFeatured(): Promise<FeaturedResponse> {
    return this.bearingCmsService.getFeatured();
  }
}
