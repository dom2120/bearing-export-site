import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingBanners, bearingCases } from '@server/database/schema';
import { eq } from 'drizzle-orm';
import type { BearingBanner, BearingCase } from '@shared/api.interface';
import { mapBanner, mapCase } from './admin.mappers';

export interface BannerCreateDto {
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

export type BannerUpdateDto = Partial<BannerCreateDto>;

export interface CaseCreateDto {
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

export type CaseUpdateDto = Partial<CaseCreateDto>;

@Injectable()
export class BearingAdminContentCrudService {
  private readonly logger = new Logger(BearingAdminContentCrudService.name);
  private readonly db = db;

  // ============ Banners CRUD ============

  async createBanner(dto: BannerCreateDto, userId: string): Promise<BearingBanner> {
    try {
      const values: Omit<
        typeof bearingBanners.$inferInsert,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        title: dto.title,
        titleEn: dto.titleEn,
        titleTh: dto.titleTh,
        titleVi: dto.titleVi,
        titleId: dto.titleId,
        titleEs: dto.titleEs,
        subtitle: dto.subtitle,
        subtitleEn: dto.subtitleEn,
        subtitleTh: dto.subtitleTh,
        subtitleVi: dto.subtitleVi,
        subtitleId: dto.subtitleId,
        subtitleEs: dto.subtitleEs,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'active',
        position: dto.position ?? 'home',
        createdBy: userId,
        updatedBy: userId,
      };

      const rows = await this.db.insert(bearingBanners).values(values).returning();
      return mapBanner(rows[0]);
    } catch (error) {
      this.logger.error('创建轮播图失败', error);
      throw error;
    }
  }

  async updateBanner(
    id: string,
    dto: BannerUpdateDto,
    userId: string,
  ): Promise<BearingBanner> {
    try {
      const patch: Record<string, unknown> = {};

      if (dto.title !== undefined) patch.title = dto.title;
      if (dto.titleEn !== undefined) patch.titleEn = dto.titleEn;
      if (dto.titleTh !== undefined) patch.titleTh = dto.titleTh;
      if (dto.titleVi !== undefined) patch.titleVi = dto.titleVi;
      if (dto.titleId !== undefined) patch.titleId = dto.titleId;
      if (dto.titleEs !== undefined) patch.titleEs = dto.titleEs;
      if (dto.subtitle !== undefined) patch.subtitle = dto.subtitle;
      if (dto.subtitleEn !== undefined) patch.subtitleEn = dto.subtitleEn;
      if (dto.subtitleTh !== undefined) patch.subtitleTh = dto.subtitleTh;
      if (dto.subtitleVi !== undefined) patch.subtitleVi = dto.subtitleVi;
      if (dto.subtitleId !== undefined) patch.subtitleId = dto.subtitleId;
      if (dto.subtitleEs !== undefined) patch.subtitleEs = dto.subtitleEs;
      if (dto.imageUrl !== undefined) patch.imageUrl = dto.imageUrl;
      if (dto.linkUrl !== undefined) patch.linkUrl = dto.linkUrl;
      if (dto.sortOrder !== undefined) patch.sortOrder = dto.sortOrder;
      if (dto.status !== undefined) patch.status = dto.status;
      if (dto.position !== undefined) patch.position = dto.position;

      if (Object.keys(patch).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      patch.updatedAt = new Date();
      patch.updatedBy = userId;

      const rows = await this.db
        .update(bearingBanners)
        .set(patch as typeof bearingBanners.$inferInsert)
        .where(eq(bearingBanners.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('轮播图不存在');
      }

      return mapBanner(rows[0]);
    } catch (error) {
      this.logger.error(`更新轮播图失败: ${id}`, error);
      throw error;
    }
  }

  async deleteBanner(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingBanners)
        .where(eq(bearingBanners.id, id))
        .returning({ id: bearingBanners.id });

      if (rows.length === 0) {
        throw new NotFoundException('轮播图不存在');
      }
    } catch (error) {
      this.logger.error(`删除轮播图失败: ${id}`, error);
      throw error;
    }
  }

  // ============ Cases CRUD ============

  async createCase(dto: CaseCreateDto, userId: string): Promise<BearingCase> {
    try {
      const values: Omit<
        typeof bearingCases.$inferInsert,
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
        images: dto.images,
        region: dto.region,
        industry: dto.industry,
        sortOrder: dto.sortOrder ?? 0,
        status: dto.status ?? 'active',
        seoTitle: dto.seoTitle,
        seoKeywords: dto.seoKeywords,
        seoDescription: dto.seoDescription,
        createdBy: userId,
        updatedBy: userId,
      };

      const rows = await this.db.insert(bearingCases).values(values).returning();
      return mapCase(rows[0]);
    } catch (error) {
      this.logger.error('创建案例失败', error);
      throw error;
    }
  }

  async updateCase(
    id: string,
    dto: CaseUpdateDto,
    userId: string,
  ): Promise<BearingCase> {
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
      if (dto.images !== undefined) patch.images = dto.images;
      if (dto.region !== undefined) patch.region = dto.region;
      if (dto.industry !== undefined) patch.industry = dto.industry;
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
        .update(bearingCases)
        .set(patch as typeof bearingCases.$inferInsert)
        .where(eq(bearingCases.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('案例不存在');
      }

      return mapCase(rows[0]);
    } catch (error) {
      this.logger.error(`更新案例失败: ${id}`, error);
      throw error;
    }
  }

  async deleteCase(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingCases)
        .where(eq(bearingCases.id, id))
        .returning({ id: bearingCases.id });

      if (rows.length === 0) {
        throw new NotFoundException('案例不存在');
      }
    } catch (error) {
      this.logger.error(`删除案例失败: ${id}`, error);
      throw error;
    }
  }
}
