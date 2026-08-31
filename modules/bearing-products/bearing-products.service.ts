import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingProducts, bearingCategories } from '@server/database/schema';
import {
  eq,
  and,
  desc,
  asc,
  ilike,
  count,
  or,
} from 'drizzle-orm';
import type {
  BearingProduct,
  BearingCategory,
  BearingProductListResponse,
  BearingCategoryListResponse,
  ProductFilterParams,
} from '@shared/api.interface';

@Injectable()
export class BearingProductsService {
  private readonly logger = new Logger(BearingProductsService.name);

  private readonly db = db;

  private mapCategory(row: typeof bearingCategories.$inferSelect): BearingCategory {
    return {
      id: row.id,
      name: row.name,
      nameEn: row.nameEn ?? undefined,
      nameTh: row.nameTh ?? undefined,
      nameVi: row.nameVi ?? undefined,
      nameId: row.nameId ?? undefined,
      nameEs: row.nameEs ?? undefined,
      slug: row.slug,
      description: row.description ?? undefined,
      descriptionEn: row.descriptionEn ?? undefined,
      descriptionTh: row.descriptionTh ?? undefined,
      descriptionVi: row.descriptionVi ?? undefined,
      descriptionId: row.descriptionId ?? undefined,
      descriptionEs: row.descriptionEs ?? undefined,
      icon: row.icon ?? undefined,
      sortOrder: row.sortOrder ?? 0,
      status: row.status ?? 'active',
    };
  }

  private mapProduct(
    row: typeof bearingProducts.$inferSelect & { category?: BearingCategory },
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
      parametersJson: row.parametersJson as BearingProduct['parametersJson'],
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
      category: row.category,
    };
  }

  async getCategories(): Promise<BearingCategoryListResponse> {
    try {
      const [countResult, rows] = await Promise.all([
        this.db
          .select({ count: count() })
          .from(bearingCategories)
          .where(eq(bearingCategories.status, 'active')),
        this.db
          .select()
          .from(bearingCategories)
          .where(eq(bearingCategories.status, 'active'))
          .orderBy(asc(bearingCategories.sortOrder), asc(bearingCategories.name)),
      ]);

      const total = Number(countResult[0]?.count ?? 0);
      return {
        items: rows.map((row: typeof bearingCategories.$inferSelect) => this.mapCategory(row)),
        total,
      };
    } catch (error) {
      this.logger.error('获取分类列表失败', error);
      throw error;
    }
  }

  async getCategoryBySlug(slug: string): Promise<BearingCategory> {
    try {
      const rows: (typeof bearingCategories.$inferSelect)[] = await this.db
        .select()
        .from(bearingCategories)
        .where(and(eq(bearingCategories.slug, slug), eq(bearingCategories.status, 'active')))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('分类不存在');
      }

      return this.mapCategory(rows[0]);
    } catch (error) {
      this.logger.error(`获取分类详情失败: ${slug}`, error);
      throw error;
    }
  }

  async getProducts(params: ProductFilterParams): Promise<BearingProductListResponse> {
    try {
      const page = params.page ?? 1;
      const pageSize = Math.min(params.pageSize ?? 20, 100);
      const offset = (page - 1) * pageSize;

      const conditions = [];
      conditions.push(eq(bearingProducts.status, 'active'));

      if (params.categoryId) {
        conditions.push(eq(bearingProducts.categoryId, params.categoryId));
      }
      if (params.keyword) {
        const keyword = `%${params.keyword}%`;
        conditions.push(
          or(
            ilike(bearingProducts.name, keyword),
            ilike(bearingProducts.nameEn, keyword),
            ilike(bearingProducts.sku, keyword),
            ilike(bearingProducts.model, keyword),
          ),
        );
      }
      if (params.material) {
        conditions.push(ilike(bearingProducts.material, `%${params.material}%`));
      }
      if (params.precisionLevel) {
        conditions.push(ilike(bearingProducts.precisionLevel, `%${params.precisionLevel}%`));
      }
      if (params.exportRegion) {
        conditions.push(ilike(bearingProducts.exportRegions, `%${params.exportRegion}%`));
      }
      if (params.applicationScenario) {
        conditions.push(
          ilike(bearingProducts.applicationScenarios, `%${params.applicationScenario}%`),
        );
      }
      if (params.isFeatured !== undefined) {
        conditions.push(eq(bearingProducts.isFeatured, params.isFeatured));
      }

      const whereClause = and(...conditions);

      // sort order
      let orderColumn;
      let orderDir;
      switch (params.sortBy) {
        case 'price':
          orderColumn = bearingProducts.unitPrice;
          break;
        case 'name':
          orderColumn = bearingProducts.name;
          break;
        case 'createdAt':
          orderColumn = bearingProducts.createdAt;
          break;
        default:
          orderColumn = bearingProducts.sortOrder;
      }
      orderDir = params.sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

      const [countResult, rows] = await Promise.all([
        this.db.select({ count: count() }).from(bearingProducts).where(whereClause),
        this.db
          .select()
          .from(bearingProducts)
          .where(whereClause)
          .orderBy(orderDir, desc(bearingProducts.createdAt))
          .limit(pageSize)
          .offset(offset),
      ]);

      const total = Number(countResult[0]?.count ?? 0);

      // get categories for join
      const categoryIds = [
        ...new Set(
          rows
            .map((row: typeof bearingProducts.$inferSelect) => row.categoryId)
            .filter((id: string | undefined): id is string => !!id),
        ),
      ];

      const categoryMap = new Map<string, BearingCategory>();
      if (categoryIds.length > 0) {
        const categoryRows: (typeof bearingCategories.$inferSelect)[] = await this.db
          .select()
          .from(bearingCategories)
          .where(eq(bearingCategories.status, 'active'));

        for (const cat of categoryRows) {
          categoryMap.set(cat.id, this.mapCategory(cat));
        }
      }

      const items = rows.map((row: typeof bearingProducts.$inferSelect) =>
        this.mapProduct({
          ...row,
          category: row.categoryId ? categoryMap.get(row.categoryId) : undefined,
        }),
      );

      return { items, total, page, pageSize };
    } catch (error) {
      this.logger.error('获取产品列表失败', error);
      throw error;
    }
  }

  async getProductBySlug(slug: string): Promise<BearingProduct> {
    try {
      const rows = await this.db
        .select()
        .from(bearingProducts)
        .where(and(eq(bearingProducts.slug, slug), eq(bearingProducts.status, 'active')))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('产品不存在');
      }

      const row = rows[0];
      let category: BearingCategory | undefined = undefined;
      if (row.categoryId) {
        const catRows: (typeof bearingCategories.$inferSelect)[] = await this.db
          .select()
          .from(bearingCategories)
          .where(eq(bearingCategories.id, row.categoryId))
          .limit(1);
        if (catRows.length > 0) {
          category = this.mapCategory(catRows[0]);
        }
      }

      return this.mapProduct({ ...row, category });
    } catch (error) {
      this.logger.error(`获取产品详情失败: ${slug}`, error);
      throw error;
    }
  }
}
