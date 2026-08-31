import { Injectable, Logger } from '@nestjs/common';
import { db } from '@server/database/db';
import { bearingOrders } from '@server/database/schema';
import { eq, and, or, desc, ilike } from 'drizzle-orm';
import type { ExchangeRateResponse } from '@shared/api.interface';

@Injectable()
export class BearingOrdersExportService {
  private readonly logger = new Logger(BearingOrdersExportService.name);
  private readonly db = db;

  async exportCsv(
    status?: string,
    paymentStatus?: string,
    keyword?: string,
  ): Promise<string> {
    try {
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
      const query = whereClause
        ? this.db
            .select()
            .from(bearingOrders)
            .where(whereClause)
            .orderBy(desc(bearingOrders.createdAt))
        : this.db
            .select()
            .from(bearingOrders)
            .orderBy(desc(bearingOrders.createdAt));

      const rows = await query;

      const header =
        '订单号,客户姓名,客户邮箱,客户电话,公司,国家,币种,金额,运费,实付,状态,支付状态,物流单号,创建时间\n';
      const body = rows
        .map((row) => {
          const fields = [
            row.orderNo,
            `"${(row.customerName ?? '').replace(/"/g, '""')}"`,
            row.customerEmail,
            row.customerPhone ?? '',
            `"${(row.customerCompany ?? '').replace(/"/g, '""')}"`,
            row.country ?? '',
            row.currency ?? 'USD',
            Number(row.subtotal).toString(),
            Number(row.shippingFee).toString(),
            Number(row.totalAmount).toString(),
            row.status ?? 'pending',
            row.paymentStatus ?? 'unpaid',
            row.trackingNumber ?? '',
            row.createdAt.toISOString(),
          ];
          return fields.join(',');
        })
        .join('\n');

      return header + body;
    } catch (error) {
      this.logger.error('导出订单CSV失败', error);
      throw error;
    }
  }

  async getExchangeRate(
    from: string,
    to: string,
  ): Promise<ExchangeRateResponse> {
    const rates: Record<string, number> = {
      USD: 1,
      CNY: 7.25,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 149.5,
      THB: 35.2,
      VND: 24500,
      IDR: 15650,
      MXN: 17.1,
      BRL: 4.95,
      ARS: 800,
      CLP: 920,
      PEN: 3.7,
      COP: 3900,
    };

    const fromRate = rates[from] ?? 1;
    const toRate = rates[to] ?? 1;
    const rate = toRate / fromRate;

    return {
      base: from,
      rates: { [to]: rate },
      timestamp: Math.floor(Date.now() / 1000),
    };
  }
}
