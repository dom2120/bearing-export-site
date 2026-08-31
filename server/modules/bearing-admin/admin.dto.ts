import type { ProductParameters } from '@shared/api.interface';

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
