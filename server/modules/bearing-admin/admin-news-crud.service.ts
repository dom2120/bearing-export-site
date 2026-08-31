import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingNews, bearingCmsSettings } from '@server/database/schema';
import { eq } from 'drizzle-orm';
import type { BearingNews, CmsSetting } from '@shared/api.interface';
import { mapNews, mapSetting } from './admin.mappers';

export interface NewsCreateDto {
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

export type NewsUpdateDto = Partial<NewsCreateDto>;

@Injectable()
export class BearingAdminNewsCrudService {
  private readonly logger = new Logger(BearingAdminNewsCrudService.name);
  private readonly db = db;

  // ============ News CRUD ============

  async createNews(dto: NewsCreateDto, userId: string): Promise<BearingNews> {
    try {
      const values: Omit<
        typeof bearingNews.$inferInsert,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        title: dto.title,
        titleEn: dto.titleEn,
        titleTh: dto.titleTh,
        titleVi: dto.titleVi,
        titleId: dto.titleId,
        titleEs: dto.titleEs,
        slug: dto.slug,
        summary: dto.summary,
        summaryEn: dto.summaryEn,
        summaryTh: dto.summaryTh,
        summaryVi: dto.summaryVi,
        summaryId: dto.summaryId,
        summaryEs: dto.summaryEs,
        content: dto.content,
        contentEn: dto.contentEn,
        contentTh: dto.contentTh,
        contentVi: dto.contentVi,
        contentId: dto.contentId,
        contentEs: dto.contentEs,
        coverImage: dto.coverImage,
        category: dto.category ?? 'news',
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'active',
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        createdBy: userId,
        updatedBy: userId,
      };

      const rows = await this.db.insert(bearingNews).values(values).returning();
      return mapNews(rows[0]);
    } catch (error) {
      this.logger.error('创建资讯失败', error);
      throw error;
    }
  }

  async updateNews(
    id: string,
    dto: NewsUpdateDto,
    userId: string,
  ): Promise<BearingNews> {
    try {
      const patch: Record<string, unknown> = {};

      if (dto.title !== undefined) patch.title = dto.title;
      if (dto.titleEn !== undefined) patch.titleEn = dto.titleEn;
      if (dto.titleTh !== undefined) patch.titleTh = dto.titleTh;
      if (dto.titleVi !== undefined) patch.titleVi = dto.titleVi;
      if (dto.titleId !== undefined) patch.titleId = dto.titleId;
      if (dto.titleEs !== undefined) patch.titleEs = dto.titleEs;
      if (dto.slug !== undefined) patch.slug = dto.slug;
      if (dto.summary !== undefined) patch.summary = dto.summary;
      if (dto.summaryEn !== undefined) patch.summaryEn = dto.summaryEn;
      if (dto.summaryTh !== undefined) patch.summaryTh = dto.summaryTh;
      if (dto.summaryVi !== undefined) patch.summaryVi = dto.summaryVi;
      if (dto.summaryId !== undefined) patch.summaryId = dto.summaryId;
      if (dto.summaryEs !== undefined) patch.summaryEs = dto.summaryEs;
      if (dto.content !== undefined) patch.content = dto.content;
      if (dto.contentEn !== undefined) patch.contentEn = dto.contentEn;
      if (dto.contentTh !== undefined) patch.contentTh = dto.contentTh;
      if (dto.contentVi !== undefined) patch.contentVi = dto.contentVi;
      if (dto.contentId !== undefined) patch.contentId = dto.contentId;
      if (dto.contentEs !== undefined) patch.contentEs = dto.contentEs;
      if (dto.coverImage !== undefined) patch.coverImage = dto.coverImage;
      if (dto.category !== undefined) patch.category = dto.category;
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
        .update(bearingNews)
        .set(patch as typeof bearingNews.$inferInsert)
        .where(eq(bearingNews.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('资讯不存在');
      }

      return mapNews(rows[0]);
    } catch (error) {
      this.logger.error(`更新资讯失败: ${id}`, error);
      throw error;
    }
  }

  async deleteNews(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingNews)
        .where(eq(bearingNews.id, id))
        .returning({ id: bearingNews.id });

      if (rows.length === 0) {
        throw new NotFoundException('资讯不存在');
      }
    } catch (error) {
      this.logger.error(`删除资讯失败: ${id}`, error);
      throw error;
    }
  }

  // ============ CMS Settings ============

  async updateSetting(
    key: string,
    dto: { settingValue: string; settingType?: string; description?: string },
    userId: string,
  ): Promise<CmsSetting> {
    try {
      const existing = await this.db
        .select()
        .from(bearingCmsSettings)
        .where(eq(bearingCmsSettings.settingKey, key))
        .limit(1);

      if (existing.length === 0) {
        const values: Omit<
          typeof bearingCmsSettings.$inferInsert,
          'id' | 'createdAt' | 'updatedAt'
        > = {
          settingKey: key,
          settingValue: dto.settingValue,
          settingType: dto.settingType ?? 'text',
          description: dto.description,
          createdBy: userId,
          updatedBy: userId,
        };
        const rows = await this.db
          .insert(bearingCmsSettings)
          .values(values)
          .returning();
        return mapSetting(rows[0]);
      }

      const patch: Record<string, unknown> = {
        settingValue: dto.settingValue,
        updatedAt: new Date(),
        updatedBy: userId,
      };
      if (dto.settingType !== undefined) patch.settingType = dto.settingType;
      if (dto.description !== undefined) patch.description = dto.description;

      const rows = await this.db
        .update(bearingCmsSettings)
        .set(patch as typeof bearingCmsSettings.$inferInsert)
        .where(eq(bearingCmsSettings.settingKey, key))
        .returning();

      return mapSetting(rows[0]);
    } catch (error) {
      this.logger.error(`更新CMS设置失败: ${key}`, error);
      throw error;
    }
  }
}
