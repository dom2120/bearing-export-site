import {
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { db } from '@server/database/db';
import {
  bearingBanners,
  bearingCases,
  bearingNews,
  bearingCmsSettings,
  bearingProducts,
} from '@server/database/schema';
import { eq, and, asc, desc, count, ilike } from 'drizzle-orm';
import type {
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
  CaseListResponse,
  NewsListResponse,
  FeaturedResponse,
  BearingProduct,
} from '@shared/api.interface';
import { mapBanner, mapCase, mapNews, mapSetting } from './cms.mappers';

@Injectable()
export class BearingCmsService {
  private readonly logger = new Logger(BearingCmsService.name);
  private readonly db = db;

  async getBanners(position?: string): Promise<BearingBanner[]> {
    try {
      const rows = await this.db
        .select()
        .from(bearingBanners)
        .where(
          and(
            eq(bearingBanners.status, 'active'),
            position ? eq(bearingBanners.position, position) : undefined,
          ),
        )
        .orderBy(
          asc(bearingBanners.sortOrder),
          desc(bearingBanners.createdAt),
        );
      return rows.map((row) => mapBanner(row));
    } catch (error) {
      this.logger.error('获取轮播图列表失败', error);
      throw error;
    }
  }

  async getCases(
    page = 1,
    pageSize = 20,
  ): Promise<CaseListResponse> {
    try {
      const offset = (page - 1) * pageSize;

      const [countResult, rows] = await Promise.all([
        this.db
          .select({ count: count() })
          .from(bearingCases)
          .where(eq(bearingCases.status, 'active')),
        this.db
          .select()
          .from(bearingCases)
          .where(eq(bearingCases.status, 'active'))
          .orderBy(
            desc(bearingCases.sortOrder),
            desc(bearingCases.createdAt),
          )
          .limit(pageSize)
          .offset(offset),
      ]);

      return {
        items: rows.map((row) => mapCase(row)),
        total: Number(countResult[0]?.count ?? 0),
        page,
        pageSize,
      };
    } catch (error) {
      this.logger.error('获取客户案例列表失败', error);
      throw error;
    }
  }

  async getCaseBySlug(slug: string): Promise<BearingCase> {
    try {
      const rows = await this.db
        .select()
        .from(bearingCases)
        .where(
          and(eq(bearingCases.slug, slug), eq(bearingCases.status, 'active')),
        )
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('案例不存在');
      }

      return mapCase(rows[0]);
    } catch (error) {
      this.logger.error(`获取案例详情失败: ${slug}`, error);
      throw error;
    }
  }

  async getNews(
    page = 1,
    pageSize = 20,
    category?: string,
  ): Promise<NewsListResponse> {
    try {
      const offset = (page - 1) * pageSize;
      const conditions = [eq(bearingNews.status, 'active')];
      if (category) {
        conditions.push(eq(bearingNews.category, category));
      }

      const whereClause = and(...conditions);

      const [countResult, rows] = await Promise.all([
        this.db.select({ count: count() }).from(bearingNews).where(whereClause),
        this.db
          .select()
          .from(bearingNews)
          .where(whereClause)
          .orderBy(
            desc(bearingNews.sortOrder),
            desc(bearingNews.createdAt),
          )
          .limit(pageSize)
          .offset(offset),
      ]);

      return {
        items: rows.map((row) => mapNews(row)),
        total: Number(countResult[0]?.count ?? 0),
        page,
        pageSize,
      };
    } catch (error) {
      this.logger.error('获取资讯列表失败', error);
      throw error;
    }
  }

  async getNewsBySlug(slug: string): Promise<BearingNews> {
    try {
      const rows = await this.db
        .select()
        .from(bearingNews)
        .where(
          and(eq(bearingNews.slug, slug), eq(bearingNews.status, 'active')),
        )
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('资讯不存在');
      }

      return mapNews(rows[0]);
    } catch (error) {
      this.logger.error(`获取资讯详情失败: ${slug}`, error);
      throw error;
    }
  }

  async getSettings(): Promise<CmsSetting[]> {
    try {
      const rows = await this.db.select().from(bearingCmsSettings);
      return rows.map((row) => mapSetting(row));
    } catch (error) {
      this.logger.error('获取CMS设置失败', error);
      throw error;
    }
  }

  async getFeatured(): Promise<FeaturedResponse> {
    try {
      const [banners, featuredProducts, featuredCases] = await Promise.all([
        this.db
          .select()
          .from(bearingBanners)
          .where(
            and(
              eq(bearingBanners.status, 'active'),
              eq(bearingBanners.position, 'home'),
            ),
          )
          .orderBy(
            asc(bearingBanners.sortOrder),
            desc(bearingBanners.createdAt),
          )
          .limit(5),
        this.db
          .select()
          .from(bearingProducts)
          .where(
            and(
              eq(bearingProducts.status, 'active'),
              eq(bearingProducts.isFeatured, true),
            ),
          )
          .orderBy(
            desc(bearingProducts.sortOrder),
            desc(bearingProducts.createdAt),
          )
          .limit(8),
        this.db
          .select()
          .from(bearingCases)
          .where(eq(bearingCases.status, 'active'))
          .orderBy(
            desc(bearingCases.sortOrder),
            desc(bearingCases.createdAt),
          )
          .limit(6),
      ]);

      return {
        banners: banners.map((row) => mapBanner(row)),
        featuredProducts: featuredProducts.map(
          (row) => mapProductFromRow(row),
        ),
        featuredCases: featuredCases.map((row) => mapCase(row)),
      };
    } catch (error) {
      this.logger.error('获取首页聚合数据失败', error);
      throw error;
    }
  }
}

function mapProductFromRow(
  row: typeof bearingProducts.$inferSelect,
): BearingProduct {
  return {
    id: row.id,
    categoryId: row.categoryId ?? undefined,
    name: row.name,
    nameEn: row.nameEn ?? undefined,
    nameTh: row.nameTh ?? undefined,
    nameVi: row.nameVi ?? undefined,
    nameId: row.nameId ?? undefined,
    nameEs: row.nameEs ?? undefined,
    slug: row.slug,
    sku: row.sku ?? undefined,
    model: row.model ?? undefined,
    images: row.images ?? undefined,
    description: row.description ?? undefined,
    descriptionEn: row.descriptionEn ?? undefined,
    descriptionTh: row.descriptionTh ?? undefined,
    descriptionVi: row.descriptionVi ?? undefined,
    descriptionId: row.descriptionId ?? undefined,
    descriptionEs: row.descriptionEs ?? undefined,
    parametersJson: row.parametersJson as unknown as BearingProduct['parametersJson'],
    material: row.material ?? undefined,
    precisionLevel: row.precisionLevel ?? undefined,
    certifications: row.certifications ?? undefined,
    exportRegions: row.exportRegions ?? undefined,
    applicationScenarios: row.applicationScenarios ?? undefined,
    minOrderQty: row.minOrderQty ?? 1,
    unitPrice: row.unitPrice ? Number(row.unitPrice) : undefined,
    priceCurrency: row.priceCurrency ?? 'USD',
    stockQty: row.stockQty ?? 0,
    sortOrder: row.sortOrder ?? 0,
    status: row.status ?? 'active',
    isFeatured: row.isFeatured ?? false,
    isNew: row.isNew ?? false,
  };
}
