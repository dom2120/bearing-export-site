import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingOrders, bearingPayments } from '@server/database/schema';
import { eq, and, or, desc, count, ilike } from 'drizzle-orm';
import type {
  BearingOrder,
  CreateOrderDto,
  OrderListResponse,
} from '@shared/api.interface';
import { mapOrder, mapPayment } from './orders.mappers';
import { BearingOrdersExportService } from './orders-export.service';

@Injectable()
export class BearingOrdersService {
  private readonly logger = new Logger(BearingOrdersService.name);
  private readonly db = db;

  constructor(
    private readonly exportService: BearingOrdersExportService,
  ) {}

  async create(dto: CreateOrderDto): Promise<BearingOrder> {
    try {
      const orderNo = `BR${Date.now()}${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`;

      const subtotal = dto.items.reduce(
        (sum: number, item) => sum + (item.unitPrice ?? 0) * (item.quantity ?? 1),
        0,
      );
      const taxAmount = subtotal * (dto.taxRate ?? 0);
      const discountAmount = subtotal * (dto.discountRate ?? 0);
      const totalAmount =
        subtotal + taxAmount + (dto.shippingFee ?? 0) - discountAmount;
      const depositAmount =
        dto.paymentType === 'deposit'
          ? totalAmount * (dto.depositRatio ?? 0.3)
          : totalAmount;
      const balanceAmount = totalAmount - depositAmount;

      const values: Omit<
        typeof bearingOrders.$inferInsert,
        'id' | 'createdAt' | 'updatedAt'
      > = {
        orderNo,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        customerCompany: dto.customerCompany,
        country: dto.country,
        shippingAddress: dto.shippingAddress,
        billingAddress: dto.billingAddress,
        invoiceInfo: JSON.stringify(dto.invoiceInfo ?? {}),
        itemsJson: JSON.stringify(dto.items) as unknown as string,
        subtotal: subtotal.toString(),
        shippingFee: (dto.shippingFee ?? 0).toString(),
        taxAmount: taxAmount.toString(),
        discountAmount: discountAmount.toString(),
        totalAmount: totalAmount.toString(),
        currency: dto.currency ?? 'USD',
        exchangeRate: String(dto.exchangeRate ?? 1),
        paymentType: dto.paymentType ?? 'full',
        depositAmount: depositAmount.toString(),
        balanceAmount: balanceAmount.toString(),
        status: 'pending',
        paymentStatus: 'unpaid',
        trackingNumber: null,
        notes: dto.notes,
        createdBy: null,
        updatedBy: null,
      };

      const rows = await this.db.insert(bearingOrders).values(values).returning();
      return mapOrder(rows[0]);
    } catch (error) {
      this.logger.error('创建订单失败', error);
      throw error;
    }
  }

  async getList(
    page: number,
    pageSize: number,
    status?: string,
    paymentStatus?: string,
    keyword?: string,
  ): Promise<OrderListResponse> {
    try {
      const pageNum = Math.max(1, page);
      const pageSizeNum = Math.min(Math.max(1, pageSize), 100);
      const offset = (pageNum - 1) * pageSizeNum;

      const conditions = [];
      if (status) conditions.push(eq(bearingOrders.status, status));
      if (paymentStatus)
        conditions.push(eq(bearingOrders.paymentStatus, paymentStatus));
      if (keyword) {
        const kw = `%${keyword}%`;
        conditions.push(
          or(
            ilike(bearingOrders.orderNo, kw),
            ilike(bearingOrders.customerName, kw),
            ilike(bearingOrders.customerEmail, kw),
          ),
        );
      }

      const whereClause =
        conditions.length > 0 ? and(...conditions) : undefined;

      const [totalResult, rows] = await Promise.all([
        whereClause
          ? this.db
              .select({ count: count() })
              .from(bearingOrders)
              .where(whereClause)
          : this.db.select({ count: count() }).from(bearingOrders),
        whereClause
          ? this.db
              .select()
              .from(bearingOrders)
              .where(whereClause)
              .orderBy(desc(bearingOrders.createdAt))
              .limit(pageSizeNum)
              .offset(offset)
          : this.db
              .select()
              .from(bearingOrders)
              .orderBy(desc(bearingOrders.createdAt))
              .limit(pageSizeNum)
              .offset(offset),
      ]);

      return {
        items: rows.map((row) => mapOrder(row)),
        total: Number(totalResult[0]?.count ?? 0),
        page: pageNum,
        pageSize: pageSizeNum,
      };
    } catch (error) {
      this.logger.error('获取订单列表失败', error);
      throw error;
    }
  }

  async getById(id: string): Promise<BearingOrder> {
    try {
      const rows = await this.db
        .select()
        .from(bearingOrders)
        .where(eq(bearingOrders.id, id))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('订单不存在');
      }

      return mapOrder(rows[0]);
    } catch (error) {
      this.logger.error(`获取订单详情失败: ${id}`, error);
      throw error;
    }
  }

  async getByOrderNo(orderNo: string): Promise<BearingOrder> {
    try {
      const rows = await this.db
        .select()
        .from(bearingOrders)
        .where(eq(bearingOrders.orderNo, orderNo))
        .limit(1);

      if (rows.length === 0) {
        throw new NotFoundException('订单不存在');
      }

      return mapOrder(rows[0]);
    } catch (error) {
      this.logger.error(`获取订单详情失败: ${orderNo}`, error);
      throw error;
    }
  }

  async update(
    id: string,
    dto: {
      status?: string;
      paymentStatus?: string;
      trackingNumber?: string;
      notes?: string;
    },
    userId: string,
  ): Promise<BearingOrder> {
    try {
      const patch: Record<string, unknown> = {};

      if (dto.status !== undefined) patch.status = dto.status;
      if (dto.paymentStatus !== undefined) patch.paymentStatus = dto.paymentStatus;
      if (dto.trackingNumber !== undefined) patch.trackingNumber = dto.trackingNumber;
      if (dto.notes !== undefined) patch.notes = dto.notes;

      if (Object.keys(patch).length === 0) {
        throw new BadRequestException('未提供可更新字段');
      }

      patch.updatedAt = new Date();
      patch.updatedBy = userId;

      const rows = await this.db
        .update(bearingOrders)
        .set(patch as typeof bearingOrders.$inferInsert)
        .where(eq(bearingOrders.id, id))
        .returning();

      if (rows.length === 0) {
        throw new NotFoundException('订单不存在');
      }

      return mapOrder(rows[0]);
    } catch (error) {
      this.logger.error(`更新订单失败: ${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const rows = await this.db
        .delete(bearingOrders)
        .where(eq(bearingOrders.id, id))
        .returning({ id: bearingOrders.id });

      if (rows.length === 0) {
        throw new NotFoundException('订单不存在');
      }
    } catch (error) {
      this.logger.error(`删除订单失败: ${id}`, error);
      throw error;
    }
  }

  async exportCsv(
    status?: string,
    paymentStatus?: string,
    keyword?: string,
  ): Promise<string> {
    return this.exportService.exportCsv(status, paymentStatus, keyword);
  }

  async getExchangeRate(from: string, to: string) {
    return this.exportService.getExchangeRate(from, to);
  }
}
