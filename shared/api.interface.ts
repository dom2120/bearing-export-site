// 轴承出口 B2B 外贸官网 - 共享类型定义

export type LanguageCode = 'zh-CN' | 'en' | 'th' | 'vi' | 'id' | 'es';

// ============ 产品分类 ============
export interface BearingCategory {
  id: string;
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
  sortOrder: number;
  status: string;
}

export interface BearingCategoryListResponse {
  items: BearingCategory[];
  total: number;
}

// ============ 产品 ============
export interface ProductParameters {
  boreDiameter?: string;
  outerDiameter?: string;
  width?: string;
  weight?: string;
  ratedLoad?: string;
  limitingSpeed?: string;
  material?: string;
  sealType?: string;
  cageMaterial?: string;
  [key: string]: string | undefined;
}

export interface BearingProduct {
  id: string;
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
  minOrderQty: number;
  unitPrice?: number;
  priceCurrency: string;
  stockQty: number;
  sortOrder: number;
  status: string;
  isFeatured: boolean;
  isNew: boolean;
  category?: BearingCategory;
}

export interface BearingProductListResponse {
  items: BearingProduct[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductFilterParams {
  categoryId?: string;
  keyword?: string;
  material?: string;
  precisionLevel?: string;
  exportRegion?: string;
  applicationScenario?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============ 轮播图 ============
export interface BearingBanner {
  id: string;
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
  sortOrder: number;
  status: string;
  position: string;
}

// ============ 客户案例 ============
export interface BearingCase {
  id: string;
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
  sortOrder: number;
  status: string;
}

// ============ 资讯 ============
export interface BearingNews {
  id: string;
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
  category: string;
  viewCount: number;
  sortOrder: number;
  status: string;
}

// ============ 询盘 ============
export interface BearingInquiry {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  message?: string;
  attachmentUrl?: string;
  source: string;
  status: string;
  replyContent?: string;
  repliedAt?: string;
  language: string;
  createdAt: string;
}

export interface CreateInquiryDto {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  message?: string;
  attachmentUrl?: string;
  source?: string;
  language?: string;
}

export interface InquiryListResponse {
  items: BearingInquiry[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ 订单 ============
export interface OrderItem {
  productId?: string;
  productName?: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  specifications?: { [key: string]: string };
}

export interface BearingOrder {
  id: string;
  orderNo: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  country?: string;
  shippingAddress?: string;
  billingAddress?: string;
  invoiceInfo?: string;
  itemsJson: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  exchangeRate: number;
  paymentType: string;
  depositAmount: number;
  balanceAmount: number;
  status: string;
  paymentStatus: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  payments?: BearingPayment[];
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerCompany?: string;
  country?: string;
  shippingAddress?: string;
  billingAddress?: string;
  invoiceInfo?: string;
  items: OrderItem[];
  currency: string;
  paymentType: 'full' | 'deposit' | 'balance';
  shippingFee?: number;
  taxAmount?: number;
  discountAmount?: number;
  notes?: string;
}

export interface OrderListResponse {
  items: BearingOrder[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ 支付 ============
export interface BearingPayment {
  id: string;
  orderId: string;
  paymentNo: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentType: string;
  status: string;
  transactionId?: string;
  failureReason?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentCreateDto {
  orderId: string;
  paymentMethod: string;
  paymentType: string;
}

// ============ CMS 设置 ============
export interface CmsSetting {
  id: string;
  settingKey: string;
  settingValue?: string;
  settingType: string;
  description?: string;
}

// ============ 仪表盘统计 ============
export interface DashboardStats {
  totalProducts: number;
  totalInquiries: number;
  totalOrders: number;
  totalRevenue: number;
  pendingInquiries: number;
  pendingOrders: number;
  recentInquiries: BearingInquiry[];
  recentOrders: BearingOrder[];
}

// ============ 汇率 ============
export interface ExchangeRateResponse {
  base: string;
  rates: { [currency: string]: number };
  timestamp: number;
}
