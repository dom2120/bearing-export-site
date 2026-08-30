import { axiosForBackend, logger } from './index';
import type {
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
  BearingProduct,
} from '@shared/api.interface';

export interface FeaturedResponse {
  banners: BearingBanner[];
  featuredProducts: BearingProduct[];
  featuredCases: BearingCase[];
}

export interface CaseListResponse {
  items: BearingCase[];
  total: number;
  page: number;
  pageSize: number;
}

export interface NewsListResponse {
  items: BearingNews[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getBanners(position?: string): Promise<BearingBanner[]> {
  try {
    const params: Record<string, string> = {};
    if (position) params.position = position;
    const response = await axiosForBackend.get('/cms/banners', { params });
    return response.data;
  } catch (error) {
    logger.error('获取轮播图列表失败', error);
    throw error;
  }
}

export async function getCases(page = 1, pageSize = 20): Promise<CaseListResponse> {
  try {
    const response = await axiosForBackend.get('/cms/cases', {
      params: { page, pageSize },
    });
    return response.data;
  } catch (error) {
    logger.error('获取客户案例列表失败', error);
    throw error;
  }
}

export async function getCaseBySlug(slug: string): Promise<BearingCase> {
  try {
    const response = await axiosForBackend.get(`/cms/cases/${slug}`);
    return response.data;
  } catch (error) {
    logger.error(`获取案例详情失败: ${slug}`, error);
    throw error;
  }
}

export async function getNews(
  page = 1,
  pageSize = 20,
  category?: string,
): Promise<NewsListResponse> {
  try {
    const params: Record<string, string | number> = { page, pageSize };
    if (category) params.category = category;
    const response = await axiosForBackend.get('/cms/news', { params });
    return response.data;
  } catch (error) {
    logger.error('获取资讯列表失败', error);
    throw error;
  }
}

export async function getNewsBySlug(slug: string): Promise<BearingNews> {
  try {
    const response = await axiosForBackend.get(`/cms/news/${slug}`);
    return response.data;
  } catch (error) {
    logger.error(`获取资讯详情失败: ${slug}`, error);
    throw error;
  }
}

export async function getCmsSettings(): Promise<CmsSetting[]> {
  try {
    const response = await axiosForBackend.get('/cms/settings');
    return response.data;
  } catch (error) {
    logger.error('获取CMS设置失败', error);
    throw error;
  }
}

export async function getFeatured(): Promise<FeaturedResponse> {
  try {
    const response = await axiosForBackend.get('/cms/featured');
    return response.data;
  } catch (error) {
    logger.error('获取首页聚合数据失败', error);
    throw error;
  }
}
