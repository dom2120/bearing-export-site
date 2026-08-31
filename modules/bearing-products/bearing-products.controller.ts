import { Controller, Get, Param, Query } from '@nestjs/common';
import { BearingProductsService } from './bearing-products.service';
import type {
  BearingProduct,
  BearingCategory,
  BearingProductListResponse,
  BearingCategoryListResponse,
} from '@shared/api.interface';

@Controller('products')
export class BearingProductsController {
  constructor(private readonly bearingProductsService: BearingProductsService) {}

  @Get('categories')
  async getCategories(): Promise<BearingCategoryListResponse> {
    return this.bearingProductsService.getCategories();
  }

  @Get('categories/:slug')
  async getCategoryBySlug(@Param('slug') slug: string): Promise<BearingCategory> {
    return this.bearingProductsService.getCategoryBySlug(slug);
  }

  @Get()
  async getProducts(
    @Query('categoryId') categoryId?: string,
    @Query('keyword') keyword?: string,
    @Query('material') material?: string,
    @Query('precisionLevel') precisionLevel?: string,
    @Query('exportRegion') exportRegion?: string,
    @Query('applicationScenario') applicationScenario?: string,
    @Query('isFeatured') isFeatured?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<BearingProductListResponse> {
    return this.bearingProductsService.getProducts({
      categoryId,
      keyword,
      material,
      precisionLevel,
      exportRegion,
      applicationScenario,
      isFeatured: isFeatured !== undefined ? isFeatured === 'true' : undefined,
      page: page ? parseInt(page, 10) : 1,
      pageSize: pageSize ? parseInt(pageSize, 10) : 20,
      sortBy,
      sortOrder,
    });
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string): Promise<BearingProduct> {
    return this.bearingProductsService.getProductBySlug(slug);
  }
}
