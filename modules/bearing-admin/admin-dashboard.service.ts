import { Injectable, Logger } from '@nestjs/common';
import { db } from '@server/database/db';
import {
  bearingProducts,
  bearingInquiries,
  bearingOrders,
} from '@server/database/schema';
import { eq, desc, count, sql } from 'drizzle-orm';
import type { DashboardStats } from '@shared/api.interface';
import { mapInquiry, mapOrder } from './admin.mappers';

@Injectable()
export class BearingAdminDashboardService {
  private readonly logger = new Logger(BearingAdminDashboardService.name);
  private readonly db = db;

  async getDashboard(): Promise<DashboardStats> {
    try {
      const [
        productsCount,
        inquiriesCount,
        ordersCount,
        revenueResult,
        pendingInquiriesCount,
        pendingOrdersCount,
        recentInquiries,
        recentOrders,
      ] = await Promise.all([
        this.db
          .select({ count: count() })
          .from(bearingProducts)
          .where(eq(bearingProducts.status, 'active')),
        this.db.select({ count: count() }).from(bearingInquiries),
        this.db.select({ count: count() }).from(bearingOrders),
        this.db
          .select({
            total: sql<number>`COALESCE(SUM(${bearingOrders.totalAmount}), 0)`,
          })
          .from(bearingOrders)
          .where(eq(bearingOrders.paymentStatus, 'paid')),
        this.db
          .select({ count: count() })
          .from(bearingInquiries)
          .where(eq(bearingInquiries.status, 'pending')),
        this.db
          .select({ count: count() })
          .from(bearingOrders)
          .where(eq(bearingOrders.status, 'pending')),
        this.db
          .select()
          .from(bearingInquiries)
          .orderBy(desc(bearingInquiries.createdAt))
          .limit(5),
        this.db
          .select()
          .from(bearingOrders)
          .orderBy(desc(bearingOrders.createdAt))
          .limit(5),
      ]);

      return {
        totalProducts: Number(productsCount[0]?.count ?? 0),
        totalInquiries: Number(inquiriesCount[0]?.count ?? 0),
        totalOrders: Number(ordersCount[0]?.count ?? 0),
        totalRevenue: Number(revenueResult[0]?.total ?? 0),
        pendingInquiries: Number(pendingInquiriesCount[0]?.count ?? 0),
        pendingOrders: Number(pendingOrdersCount[0]?.count ?? 0),
        recentInquiries: recentInquiries.map((row) => mapInquiry(row)),
        recentOrders: recentOrders.map((row) => mapOrder(row)),
      };
    } catch (error) {
      this.logger.error('获取仪表盘数据失败', error);
      throw error;
    }
  }
}
