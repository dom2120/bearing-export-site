import type { BearingOrder, OrderItem } from '@shared/api.interface';
import { bearingOrders, bearingPayments } from '@server/database/schema';

export function mapOrder(row: typeof bearingOrders.$inferSelect): BearingOrder {
  return {
    id: row.id,
    orderNo: row.orderNo,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    customerPhone: row.customerPhone ?? undefined,
    customerCompany: row.customerCompany ?? undefined,
    country: row.country ?? undefined,
    shippingAddress: row.shippingAddress ?? undefined,
    billingAddress: row.billingAddress ?? undefined,
    invoiceInfo: row.invoiceInfo ?? undefined,
    itemsJson: (row.itemsJson as OrderItem[]) ?? [],
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shippingFee),
    taxAmount: Number(row.taxAmount),
    discountAmount: Number(row.discountAmount),
    totalAmount: Number(row.totalAmount),
    currency: row.currency ?? 'USD',
    exchangeRate: Number(row.exchangeRate),
    paymentType: row.paymentType ?? 'full',
    depositAmount: Number(row.depositAmount),
    balanceAmount: Number(row.balanceAmount),
    status: row.status ?? 'pending',
    paymentStatus: row.paymentStatus ?? 'unpaid',
    trackingNumber: row.trackingNumber ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export function mapPayment(row: typeof bearingPayments.$inferSelect): {
  id: string;
  orderId: string;
  paymentNo: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentType: string;
  status: string;
  transactionId?: string;
  payerInfo?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
} {
  return {
    id: row.id,
    orderId: row.orderId ?? '',
    paymentNo: row.paymentNo,
    amount: Number(row.amount),
    currency: row.currency ?? 'USD',
    paymentMethod: row.paymentMethod ?? 'stripe',
    paymentType: row.paymentType ?? 'full',
    status: row.status ?? 'pending',
    transactionId: row.transactionId ?? undefined,
    payerInfo: row.payerInfo ?? undefined,
    failureReason: row.failureReason ?? undefined,
    paidAt: row.paidAt ? row.paidAt.toISOString() : undefined,
    createdAt: row.createdAt.toISOString(),
  };
}
