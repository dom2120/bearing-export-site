import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingInquiries } from '@server/database/schema';
import { eq, and, desc, ilike, count, or } from 'drizzle-orm';
import type { BearingInquiry, CreateInquiryDto, InquiryListResponse } from '@shared/api.interface';

@Injectable()
export class BearingInquiriesService {
  private readonly logger = new Logger(BearingInquiriesService.name);

  private readonly db = db;

  private mapInquiry(row: typeof bearingInquiries.$inferSelect): BearingInquiry {
    return {
      id: row.id,
      fullName: row.fullName,
      email: row.email,
      phone: row.phone ?? undefined,
      company: row.company ?? undefined,
      country: row.country ?? undefined,
      productId: row.productId ?? undefined,
      productName: row.productName ?? undefined,
      quantity: row.quantity ?? undefined,
      message: row.message ?? undefined,
      attachmentUrl: row.attachmentUrl ?? undefined,
      source: row.source ?? 'website',
      status: row.status ?? 'pending',
      replyContent: row.replyContent ?? undefined,
      repliedAt: row.repliedAt ? row.repliedAt.toISOString() : undefined,
      language: row.language ?? 'en',
      createdAt: row.createdAt.toISOString(),
    };
  }

  async create(dto: CreateInquiryDto): Promise<BearingInquiry> {
    try {
      if (!dto.fullName || !dto.email) {
        throw new BadRequestException('姓名和邮箱为必填项');
      }

      const values: Omit<typeof bearingInquiries.$inferInsert, 'id' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy' | 'status' | 'replyContent' | 'repliedAt'> = {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        country: dto.country,
        productId: dto.productId,
        productName: dto.productName,
        quantity: dto.quantity,
        message: dto.message,
        attachmentUrl: dto.attachmentUrl,
        source: dto.source ?? 'website',
        language: dto.language ?? 'en',
      };

      const rows = await this.db.insert(bearingInquiries).values(values).returning();
      return this.mapInquiry(rows[0]);
    } catch (error) {
      this.logger.error('创建询盘失败', error);
      throw error;
    }
  }

  async getList(
    page = 1,
    pageSize = 20,
    status?: string,
    keyword?: string,
  ): Promise<InquiryListResponse> {
    try {
      const offset = (page - 1) * pageSize;
      const conditions = [];

      if (status) {
        conditions.push(eq(bearingInquiries.status, status));
      }
      if (keyword) {
        const kw = `%${keyword}%`;
        conditions.push(
          or(
            ilike(bearingInquiries.fullName, kw),
            ilike(bearingInquiries.email, kw),
            ilike(bearingInquiries.company, kw),
            ilike(bearingInquiries.productName, kw),
          ),
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const countQuery = whereClause
        ? this.db.select({ count: count() }).from(bearingInquiries).where(whereClause)
        : this.db.select({ count: count() }).from(bearingInquiries);

      const listQuery = whereClause
        ? this.db
            .select()
            .from(bearingInquiries)
            .where(whereClause)
            .orderBy(desc(bearingInquiries.createdAt))
            .limit(pageSize)
            .offset(offset)
        : this.db
            .select()
            .from(bearingInquiries)
            .orderBy(desc(bearingInquiries.createdAt))
            .limit(pageSize)
            .offset(offset);

      const [countResult, rows] = await Promise.all([countQuery, listQuery]);

      const total = Number(countResult[0]?.count ?? 0);

      return {
        items: rows.map((row: typeof bearingInquiries.$inferSelect) => this.mapInquiry(row)),
        total,
        page,
        pageSize,
      };
    } catch (error) {
      this.logger.error('获取询盘列表失败', error);
      throw error;
    }
  }

  async getById(id: string): Promise<BearingInquiry> {
    try {
      const rows = await this.db
        .select()
        .from(bearingInquiries)
        .where(eq(bearingInquiries.id, id))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('询盘不存在');
      }

      return this.mapInquiry(rows[0]);
    } catch (error) {
      this.logger.error(`获取询盘详情失败: ${id}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    dto: { status?: string; replyContent?: string },
    userId: string,
  ): Promise<BearingInquiry> {
    try {
      const patch: Partial<typeof bearingInquiries.$inferInsert> = {};

      if (dto.status !== undefined) {
        patch.status = dto.status;
      }
      if (dto.replyContent !== undefined) {
        patch.replyContent = dto.replyContent;
        if (dto.status === 'replied') {
          patch.repliedAt = new Date();
        }
      }

      if (Object.keys(patch).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      patch.updatedAt = new Date();
      patch.updatedBy = userId;

      const rows = await this.db
        .update(bearingInquiries)
        .set(patch)
        .where(eq(bearingInquiries.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('询盘不存在');
      }

      return this.mapInquiry(rows[0]);
    } catch (error) {
      this.logger.error(`更新询盘失败: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingInquiries)
        .where(eq(bearingInquiries.id, id))
        .returning({ id: bearingInquiries.id });

      if (rows.length === 0) {
        throw new NotFoundException('询盘不存在');
      }
    } catch (error) {
      this.logger.error(`删除询盘失败: ${id}`, error);
      throw error;
    }
  }

  async exportCsv(status?: string, keyword?: string): Promise<string> {
    try {
      const conditions = [];
      if (status) {
        conditions.push(eq(bearingInquiries.status, status));
      }
      if (keyword) {
        const kw = `%${keyword}%`;
        conditions.push(
          or(
            ilike(bearingInquiries.fullName, kw),
            ilike(bearingInquiries.email, kw),
            ilike(bearingInquiries.company, kw),
          ),
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const query = whereClause
        ? this.db
            .select()
            .from(bearingInquiries)
            .where(whereClause)
            .orderBy(desc(bearingInquiries.createdAt))
        : this.db.select().from(bearingInquiries).orderBy(desc(bearingInquiries.createdAt));

      const rows = await query;

      const header =
        'ID,姓名,邮箱,电话,公司,国家,产品,数量,来源,状态,语言,创建时间,回复时间\n';
      const body = rows
        .map((row: typeof bearingInquiries.$inferSelect) => {
          const fields = [
            row.id,
            `"${(row.fullName ?? '').replace(/"/g, '""')}"`,
            row.email,
            row.phone ?? '',
            `"${(row.company ?? '').replace(/"/g, '""')}"`,
            row.country ?? '',
            `"${(row.productName ?? '').replace(/"/g, '""')}"`,
            row.quantity?.toString() ?? '',
            row.source ?? 'website',
            row.status ?? 'pending',
            row.language ?? 'en',
            row.createdAt.toISOString(),
            row.repliedAt ? row.repliedAt.toISOString() : '',
          ];
          return fields.join(',');
        })
        .join('\n');

      return header + body;
    } catch (error) {
      this.logger.error('导出询盘CSV失败', error);
      throw error;
    }
  }
}
