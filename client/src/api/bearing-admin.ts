import { axiosForBackend, logger } from './index';
import type {
  DashboardStats,
  BearingProduct,
  BearingCategory,
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
  ProductParameters,
} from '@shared/api.interface';

export interface ProductCreateBody {
  categoryId?: string;
  name: string;
  nameEn?: string;
  nameTh?: string;
  nameVi?: string;
  nameId?: string;
  nameEs?: string;
  slug: string;
  sku?: string;
  model?: string;
  images?: string;
  description?: string;
  descriptionEn?: string;
  descriptionTh?: string;
  descriptionVi?: string;
  descriptionId?: string;
  descriptionEs?: string;
  parametersJson?: ProductParameters;
  material?: string;
  precisionLevel?: string;
  certifications?: string;
  exportRegions?: string;
  applicationScenarios?: string;
  minOrderQty?: number;
  unitPrice?: number;
  priceCurrency?: string;
  stockQty?: number;
  sortOrder?: number;
  status?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export type ProductUpdateBody = Partial<ProductCreateBody>;

export interface CategoryCreateBody {
  name: string;
  nameEn?: string;
  nameTh?: string;
  nameVi?: string;
  nameId?: string;
  nameEs?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  descriptionTh?: string;
  descriptionVi?: string;
  descriptionId?: string;
  descriptionEs?: string;
  icon?: string;
  sortOrder?: number;
  status?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export type CategoryUpdateBody = Partial<CategoryCreateBody>;

export interface BannerCreateBody {
  title?: string;
  titleEn?: string;
  titleTh?: string;
  titleVi?: string;
  titleId?: string;
  titleEs?: string;
  subtitle?: string;
  subtitleEn?: string;
  subtitleTh?: string;
  subtitleVi?: string;
  subtitleId?: string;
  subtitleEs?: string;
  imageUrl: string;
  linkUrl?: string;
  sortOrder?: number;
  status?: string;
  position?: string;
}

export type BannerUpdateBody = Partial<BannerCreateBody>;

export interface CaseCreateBody {
  title: string;
  titleEn?: string;
  titleTh?: string;
  titleVi?: string;
  titleId?: string;
  titleEs?: string;
  slug: string;
  summary?: string;
  summaryEn?: string;
  summaryTh?: string;
  summaryVi?: string;
  summaryId?: string;
  summaryEs?: string;
  content?: string;
  contentEn?: string;
  contentTh?: string;
  contentVi?: string;
  contentId?: string;
  contentEs?: string;
  coverImage?: string;
  images?: string;
  region?: string;
  industry?: string;
  sortOrder?: number;
  status?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export type CaseUpdateBody = Partial<CaseCreateBody>;

export interface NewsCreateBody {
  title: string;
  titleEn?: string;
  titleTh?: string;
  titleVi?: string;
  titleId?: string;
  titleEs?: string;
  slug: string;
  summary?: string;
  summaryEn?: string;
  summaryTh?: string;
  summaryVi?: string;
  summaryId?: string;
  summaryEs?: string;
  content?: string;
  contentEn?: string;
  contentTh?: string;
  contentVi?: string;
  contentId?: string;
  contentEs?: string;
  coverImage?: string;
  category?: string;
  sortOrder?: number;
  status?: string;
  seoTitle?: string;
  seoKeywords?: string;
  seoDescription?: string;
}

export type NewsUpdateBody = Partial<NewsCreateBody>;

export interface SettingUpdateBody {
  settingValue: string;
  settingType?: string;
  description?: string;
}

// ============ Dashboard ============

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await axiosForBackend.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    logger.error('获取仪表盘数据失败', error);
    throw error;
  }
}

// ============ Products ============

export async function createProduct(dto: ProductCreateBody): Promise<BearingProduct> {
  try {
    const response = await axiosForBackend.post('/admin/products', dto);
    return response.data;
  } catch (error) {
    logger.error('创建产品失败', error);
    throw error;
  }
}

export async function updateProduct(id: string, dto: ProductUpdateBody): Promise<BearingProduct> {
  try {
    const response = await axiosForBackend.put(`/admin/products/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新产品失败: ${id}`, error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/admin/products/${id}`);
  } catch (error) {
    logger.error(`删除产品失败: ${id}`, error);
    throw error;
  }
}

// ============ Categories ============

export async function createCategory(dto: CategoryCreateBody): Promise<BearingCategory> {
  try {
    const response = await axiosForBackend.post('/admin/categories', dto);
    return response.data;
  } catch (error) {
    logger.error('创建分类失败', error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  dto: CategoryUpdateBody,
): Promise<BearingCategory> {
  try {
    const response = await axiosForBackend.put(`/admin/categories/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新分类失败: ${id}`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/admin/categories/${id}`);
  } catch (error) {
    logger.error(`删除分类失败: ${id}`, error);
    throw error;
  }
}

// ============ Banners ============

export async function createBanner(dto: BannerCreateBody): Promise<BearingBanner> {
  try {
    const response = await axiosForBackend.post('/admin/banners', dto);
    return response.data;
  } catch (error) {
    logger.error('创建轮播图失败', error);
    throw error;
  }
}

export async function updateBanner(id: string, dto: BannerUpdateBody): Promise<BearingBanner> {
  try {
    const response = await axiosForBackend.put(`/admin/banners/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新轮播图失败: ${id}`, error);
    throw error;
  }
}

export async function deleteBanner(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/admin/banners/${id}`);
  } catch (error) {
    logger.error(`删除轮播图失败: ${id}`, error);
    throw error;
  }
}

// ============ Cases ============

export async function createCase(dto: CaseCreateBody): Promise<BearingCase> {
  try {
    const response = await axiosForBackend.post('/admin/cases', dto);
    return response.data;
  } catch (error) {
    logger.error('创建案例失败', error);
    throw error;
  }
}

export async function updateCase(id: string, dto: CaseUpdateBody): Promise<BearingCase> {
  try {
    const response = await axiosForBackend.put(`/admin/cases/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新案例失败: ${id}`, error);
    throw error;
  }
}

export async function deleteCase(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/admin/cases/${id}`);
  } catch (error) {
    logger.error(`删除案例失败: ${id}`, error);
    throw error;
  }
}

// ============ News ============

export async function createNews(dto: NewsCreateBody): Promise<BearingNews> {
  try {
    const response = await axiosForBackend.post('/admin/news', dto);
    return response.data;
  } catch (error) {
    logger.error('创建资讯失败', error);
    throw error;
  }
}

export async function updateNews(id: string, dto: NewsUpdateBody): Promise<BearingNews> {
  try {
    const response = await axiosForBackend.put(`/admin/news/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新资讯失败: ${id}`, error);
    throw error;
  }
}

export async function deleteNews(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/admin/news/${id}`);
  } catch (error) {
    logger.error(`删除资讯失败: ${id}`, error);
    throw error;
  }
}

// ============ Settings ============

export async function updateCmsSetting(
  key: string,
  dto: SettingUpdateBody,
): Promise<CmsSetting> {
  try {
    const response = await axiosForBackend.put(`/admin/settings/${key}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新CMS设置失败: ${key}`, error);
    throw error;
  }
}
