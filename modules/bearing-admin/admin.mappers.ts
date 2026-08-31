import type {
  BearingProduct,
  BearingCategory,
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
  BearingInquiry,
  BearingOrder,
  ProductParameters,
  OrderItem,
} from '@shared/api.interface';
import {
  bearingProducts,
  bearingCategories,
  bearingBanners,
  bearingCases,
  bearingNews,
  bearingCmsSettings,
  bearingInquiries,
  bearingOrders,
  bearingPayments,
} from '@server/database/schema';

export function mapProduct(
  row: typeof bearingProducts.$inferSelect,
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
    parametersJson: row.parametersJson as ProductParameters | undefined,
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
  };
}

export function mapCategory(
  row: typeof bearingCategories.$inferSelect,
): BearingCategory {
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

export function mapBanner(
  row: typeof bearingBanners.$inferSelect,
): BearingBanner {
  return {
    id: row.id,
    title: row.title ?? undefined,
    titleEn: row.titleEn ?? undefined,
    titleTh: row.titleTh ?? undefined,
    titleVi: row.titleVi ?? undefined,
    titleId: row.titleId ?? undefined,
    titleEs: row.titleEs ?? undefined,
    subtitle: row.subtitle ?? undefined,
    subtitleEn: row.subtitleEn ?? undefined,
    subtitleTh: row.subtitleTh ?? undefined,
    subtitleVi: row.subtitleVi ?? undefined,
    subtitleId: row.subtitleId ?? undefined,
    subtitleEs: row.subtitleEs ?? undefined,
    imageUrl: row.imageUrl,
    linkUrl: row.linkUrl ?? undefined,
    sortOrder: row.sortOrder ?? 0,
    status: row.status ?? 'active',
    position: row.position ?? 'home',
  };
}

export function mapCase(row: typeof bearingCases.$inferSelect): BearingCase {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.titleEn ?? undefined,
    titleTh: row.titleTh ?? undefined,
    titleVi: row.titleVi ?? undefined,
    titleId: row.titleId ?? undefined,
    titleEs: row.titleEs ?? undefined,
    slug: row.slug,
    summary: row.summary ?? undefined,
    summaryEn: row.summaryEn ?? undefined,
    summaryTh: row.summaryTh ?? undefined,
    summaryVi: row.summaryVi ?? undefined,
    summaryId: row.summaryId ?? undefined,
    summaryEs: row.summaryEs ?? undefined,
    content: row.content ?? undefined,
    contentEn: row.contentEn ?? undefined,
    contentTh: row.contentTh ?? undefined,
    contentVi: row.contentVi ?? undefined,
    contentId: row.contentId ?? undefined,
    contentEs: row.contentEs ?? undefined,
    coverImage: row.coverImage ?? undefined,
    images: row.images ?? undefined,
    region: row.region ?? undefined,
    industry: row.industry ?? undefined,
    sortOrder: row.sortOrder ?? 0,
    status: row.status ?? 'active',
  };
}

export function mapNews(row: typeof bearingNews.$inferSelect): BearingNews {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.titleEn ?? undefined,
    titleTh: row.titleTh ?? undefined,
    titleVi: row.titleVi ?? undefined,
    titleId: row.titleId ?? undefined,
    titleEs: row.titleEs ?? undefined,
    slug: row.slug,
    summary: row.summary ?? undefined,
    summaryEn: row.summaryEn ?? undefined,
    summaryTh: row.summaryTh ?? undefined,
    summaryVi: row.summaryVi ?? undefined,
    summaryId: row.summaryId ?? undefined,
    summaryEs: row.summaryEs ?? undefined,
    content: row.content ?? undefined,
    contentEn: row.contentEn ?? undefined,
    contentTh: row.contentTh ?? undefined,
    contentVi: row.contentVi ?? undefined,
    contentId: row.contentId ?? undefined,
    contentEs: row.contentEs ?? undefined,
    coverImage: row.coverImage ?? undefined,
    category: row.category ?? 'news',
    viewCount: row.viewCount ?? 0,
    sortOrder: row.sortOrder ?? 0,
    status: row.status ?? 'active',
  };
}

export function mapSetting(
  row: typeof bearingCmsSettings.$inferSelect,
): CmsSetting {
  return {
    id: row.id,
    settingKey: row.settingKey,
    settingValue: row.settingValue ?? undefined,
    settingType: row.settingType ?? 'text',
    description: row.description ?? undefined,
  };
}

export function mapInquiry(
  row: typeof bearingInquiries.$inferSelect,
): BearingInquiry {
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
