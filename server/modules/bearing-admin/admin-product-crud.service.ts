import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingProducts } from '@server/database/schema';
import { eq } from 'drizzle-orm';
import type { BearingProduct, ProductParameters } from '@shared/api.interface';
import { mapProduct } from './admin.mappers';

export interface ProductCreateDto {
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

export type ProductUpdateDto = Partial<ProductCreateDto>;

@Injectable()
export class BearingAdminProductCrudService {
  private readonly logger = new Logger(BearingAdminProductCrudService.name);
  private readonly db = db;

  async createProduct(dto: ProductCreateDto, userId: string): Promise<BearingProduct> {
    try {
      const values: Omit<
        typeof bearingProducts.$inferInsert,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        categoryId: dto.categoryId,
        name: dto.name,
        nameEn: dto.nameEn,
        nameTh: dto.nameTh,
        nameVi: dto.nameVi,
        nameId: dto.nameId,
        nameEs: dto.nameEs,
        slug: dto.slug,
        sku: dto.sku,
        model: dto.model,
        images: dto.images,
        description: dto.description,
        descriptionEn: dto.descriptionEn,
        descriptionTh: dto.descriptionTh,
        descriptionVi: dto.descriptionVi,
        descriptionId: dto.descriptionId,
        descriptionEs: dto.descriptionEs,
        parametersJson: dto.parametersJson as unknown as Record<string, string>,
        material: dto.material,
        precisionLevel: dto.precisionLevel,
        certifications: dto.certifications,
        exportRegions: dto.exportRegions,
        applicationScenarios: dto.applicationScenarios,
        minOrderQty: dto.minOrderQty ?? 1,
        unitPrice: dto.unitPrice?.toString(),
        priceCurrency: dto.priceCurrency ?? 'USD',
        stockQty: dto.stockQty ?? 0,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'active',
        isFeatured: dto.isFeatured ?? false,
        isNew: dto.isNew ?? false,
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        createdBy: userId,
        updatedBy: userId,
      };

      const rows = await this.db.insert(bearingProducts).values(values).returning();
      return mapProduct(rows[0]);
    } catch (error) {
      this.logger.error('创建产品失败', error);
      throw error;
    }
  }

  async updateProduct(
    id: string,
    dto: ProductUpdateDto,
    userId: string,
  ): Promise<BearingProduct> {
    try {
      const patch: Record<string, unknown> = {};

      if (dto.categoryId !== undefined) patch.categoryId = dto.categoryId;
      if (dto.name !== undefined) patch.name = dto.name;
      if (dto.nameEn !== undefined) patch.nameEn = dto.nameEn;
      if (dto.nameTh !== undefined) patch.nameTh = dto.nameTh;
      if (dto.nameVi !== undefined) patch.nameVi = dto.nameVi;
      if (dto.nameId !== undefined) patch.nameId = dto.nameId;
      if (dto.nameEs !== undefined) patch.nameEs = dto.nameEs;
      if (dto.slug !== undefined) patch.slug = dto.slug;
      if (dto.sku !== undefined) patch.sku = dto.sku;
      if (dto.model !== undefined) patch.model = dto.model;
      if (dto.images !== undefined) patch.images = dto.images;
      if (dto.description !== undefined) patch.description = dto.description;
      if (dto.descriptionEn !== undefined) patch.descriptionEn = dto.descriptionEn;
      if (dto.descriptionTh !== undefined) patch.descriptionTh = dto.descriptionTh;
      if (dto.descriptionVi !== undefined) patch.descriptionVi = dto.descriptionVi;
      if (dto.descriptionId !== undefined) patch.descriptionId = dto.descriptionId;
      if (dto.descriptionEs !== undefined) patch.descriptionEs = dto.descriptionEs;
      if (dto.parametersJson !== undefined) {
        patch.parametersJson = dto.parametersJson as unknown as Record<string, string>;
      }
      if (dto.material !== undefined) patch.material = dto.material;
      if (dto.precisionLevel !== undefined) patch.precisionLevel = dto.precisionLevel;
      if (dto.certifications !== undefined) patch.certifications = dto.certifications;
      if (dto.exportRegions !== undefined) patch.exportRegions = dto.exportRegions;
      if (dto.applicationScenarios !== undefined)
        patch.applicationScenarios = dto.applicationScenarios;
      if (dto.minOrderQty !== undefined) patch.minOrderQty = dto.minOrderQty;
      if (dto.unitPrice !== undefined) patch.unitPrice = dto.unitPrice.toString();
      if (dto.priceCurrency !== undefined) patch.priceCurrency = dto.priceCurrency;
      if (dto.stockQty !== undefined) patch.stockQty = dto.stockQty;
      if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
      if (dto.status !== undefined) patch.status = dto.status;
      if (dto.isFeatured !== undefined) patch.isFeatured = dto.isFeatured;
      if (dto.isNew !== undefined) patch.isNew = dto.isNew;
      if (dto.seoTitle !== undefined) patch.seoTitle = dto.seoTitle;
      if (dto.seoKeywords !== undefined) patch.seoKeywords = dto.seoKeywords;
      if (dto.seoDescription !== undefined) patch.seoDescription = dto.seoDescription;

      if (Object.keys(patch).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      patch.updatedAt = new Date();
      patch.updatedBy = userId;

      const rows = await this.db
        .update(bearingProducts)
        .set(patch as typeof bearingProducts.$inferInsert)
        .where(eq(bearingProducts.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('产品不存在');
      }

      return mapProduct(rows[0]);
    } catch (error) {
      this.logger.error(`更新产品失败: ${id}`, error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingProducts)
        .where(eq(bearingProducts.id, id))
        .returning({ id: bearingProducts.id });

      if (rows.length === 0) {
        throw new NotFoundException('产品不存在');
      }
    } catch (error) {
      this.logger.error(`删除产品失败: ${id}`, error);
      throw error;
    }
  }
}
