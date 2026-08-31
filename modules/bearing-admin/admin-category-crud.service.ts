import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingCategories } from '@server/database/schema';
import { eq } from 'drizzle-orm';
import type { BearingCategory } from '@shared/api.interface';
import { mapCategory } from './admin.mappers';

export interface CategoryCreateDto {
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

export type CategoryUpdateDto = Partial<CategoryCreateDto>;

@Injectable()
export class BearingAdminCategoryCrudService {
  private readonly logger = new Logger(BearingAdminCategoryCrudService.name);
  private readonly db = db;

  async createCategory(
    dto: CategoryCreateDto,
    userId: string,
  ): Promise<BearingCategory> {
    try {
      const values: Omit<
        typeof bearingCategories.$inferInsert,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        name: dto.name,
        nameEn: dto.nameEn,
        nameTh: dto.nameTh,
        nameVi: dto.nameVi,
        nameId: dto.nameId,
        nameEs: dto.nameEs,
        slug: dto.slug,
        description: dto.description,
        descriptionEn: dto.descriptionEn,
        descriptionTh: dto.descriptionTh,
        descriptionVi: dto.descriptionVi,
        descriptionId: dto.descriptionId,
        descriptionEs: dto.descriptionEs,
        icon: dto.icon,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'active',
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        createdBy: userId,
        updatedBy: userId,
      };

      const rows = await this.db.insert(bearingCategories).values(values).returning();
      return mapCategory(rows[0]);
    } catch (error) {
      this.logger.error('创建分类失败', error);
      throw error;
    }
  }

  async updateCategory(
    id: string,
    dto: CategoryUpdateDto,
    userId: string,
  ): Promise<BearingCategory> {
    try {
      const patch: Record<string, unknown> = {};

      if (dto.name !== undefined) patch.name = dto.name;
      if (dto.nameEn !== undefined) patch.nameEn = dto.nameEn;
      if (dto.nameTh !== undefined) patch.nameTh = dto.nameTh;
      if (dto.nameVi !== undefined) patch.nameVi = dto.nameVi;
      if (dto.nameId !== undefined) patch.nameId = dto.nameId;
      if (dto.nameEs !== undefined) patch.nameEs = dto.nameEs;
      if (dto.slug !== undefined) patch.slug = dto.slug;
      if (dto.description !== undefined) patch.description = dto.description;
      if (dto.descriptionEn !== undefined) patch.descriptionEn = dto.descriptionEn;
      if (dto.descriptionTh !== undefined) patch.descriptionTh = dto.descriptionTh;
      if (dto.descriptionVi !== undefined) patch.descriptionVi = dto.descriptionVi;
      if (dto.descriptionId !== undefined) patch.descriptionId = dto.descriptionId;
      if (dto.descriptionEs !== undefined) patch.descriptionEs = dto.descriptionEs;
      if (dto.icon !== undefined) patch.icon = dto.icon;
      if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
      if (dto.status !== undefined) patch.status = dto.status;
      if (dto.seoTitle !== undefined) patch.seoTitle = dto.seoTitle;
      if (dto.seoKeywords !== undefined) patch.seoKeywords = dto.seoKeywords;
      if (dto.seoDescription !== undefined) patch.seoDescription = dto.seoDescription;

      if (Object.keys(patch).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      patch.updatedAt = new Date();
      patch.updatedBy = userId;

      const rows = await this.db
        .update(bearingCategories)
        .set(patch as typeof bearingCategories.$inferInsert)
        .where(eq(bearingCategories.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('分类不存在');
      }

      return mapCategory(rows[0]);
    } catch (error) {
      this.logger.error(`更新分类失败: ${id}`, error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingCategories)
        .where(eq(bearingCategories.id, id))
        .returning({ id: bearingCategories.id });

      if (rows.length === 0) {
        throw new NotFoundException('分类不存在');
      }
    } catch (error) {
      this.logger.error(`删除分类失败: ${id}`, error);
      throw error;
    }
  }
}
