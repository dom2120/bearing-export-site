import { axiosForBackend, logger } from './index';
import type {
  BearingProduct,
  BearingCategory,
  BearingProductListResponse,
  BearingCategoryListResponse,
  ProductFilterParams,
} from '@shared/api.interface';

export async function getCategories(): Promise<BearingCategoryListResponse> {
  try {
    const response = await axiosForBackend.get('/products/categories');
    return response.data;
  } catch (error) {
    logger.error('获取分类列表失败', error);
    throw error;
  }
}

export async function getCategoryBySlug(slug: string): Promise<BearingCategory> {
  try {
    const response = await axiosForBackend.get(`/products/categories/${slug}`);
    return response.data;
  } catch (error) {
    logger.error(`获取分类详情失败: ${slug}`, error);
    throw error;
  }
}

export async function getProducts(params: ProductFilterParams): Promise<BearingProductListResponse> {
  try {
    const queryParams: Record<string, string | number | boolean> = {};
    if (params.categoryId) queryParams.categoryId = params.categoryId;
    if (params.keyword) queryParams.keyword = params.keyword;
    if (params.material) queryParams.material = params.material;
    if (params.precisionLevel) queryParams.precisionLevel = params.precisionLevel;
    if (params.exportRegion) queryParams.exportRegion = params.exportRegion;
    if (params.applicationScenario) queryParams.applicationScenario = params.applicationScenario;
    if (params.isFeatured !== undefined) queryParams.isFeatured = params.isFeatured;
    if (params.page) queryParams.page = params.page;
    if (params.pageSize) queryParams.pageSize = params.pageSize;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    const response = await axiosForBackend.get('/products', { params: queryParams });
    return response.data;
  } catch (error) {
    logger.error('获取产品列表失败', error);
    throw error;
  }
}

export async function getProductBySlug(slug: string): Promise<BearingProduct> {
  try {
    const response = await axiosForBackend.get(`/products/${slug}`);
    return response.data;
  } catch (error) {
    logger.error(`获取产品详情失败: ${slug}`, error);
    throw error;
  }
}
