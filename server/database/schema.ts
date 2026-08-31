/* eslint-disable */
/** auto generated, do not edit */
import { sql } from 'drizzle-orm';
import { boolean, foreignKey, index, integer, jsonb, numeric, pgTable, text, uniqueIndex, uuid, varchar, customType } from "drizzle-orm/pg-core"

export const customTimestamptz = customType<{
  data: Date;
  driverData: string;
  config: { precision?: number };
}>({
  dataType(config) {
    const precision = typeof config?.precision !== 'undefined'
      ? ` (${config.precision})`
      : '';
    return `timestamptz${precision}`;
  },
  toDriver(value: Date | string | number) {
    if (value == null) return value as any;
    if (typeof value === 'number') return new Date(value).toISOString();
    if (typeof value === 'string') return value;
    if (value instanceof Date) return value.toISOString();
    throw new Error('Invalid timestamp value');
  },
  fromDriver(value: string | Date): Date {
    if (value instanceof Date) return value;
    return new Date(value);
  },
});

export const bearingCmsSettings = pgTable("bearing_cms_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value"),
  settingType: varchar("setting_type", { length: 50 }).default('text'),
  description: varchar("description", { length: 255 }),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_cms_settings_setting_key_key").on(table.settingKey),
]);

export const bearingPayments = pgTable("bearing_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id"),
  paymentNo: varchar("payment_no", { length: 100 }).notNull().unique(),
  amount: numeric("amount").notNull(),
  currency: varchar("currency", { length: 10 }).default('USD'),
  paymentMethod: varchar("payment_method", { length: 50 }).default('stripe'),
  paymentType: varchar("payment_type", { length: 50 }).default('full'),
  status: varchar("status", { length: 50 }).default('pending'),
  transactionId: varchar("transaction_id", { length: 255 }),
  payerInfo: text("payer_info"),
  paymentData: jsonb("payment_data").default('{}'),
  failureReason: text("failure_reason"),
  paidAt: customTimestamptz("paid_at", { precision: 3 }),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_payments_payment_no_key").on(table.paymentNo),
  foreignKey({
    columns: [table.orderId],
    foreignColumns: [bearingOrders.id],
    name: "bearing_payments_order_id_fkey",
  }).onDelete("cascade"),
]);

export const bearingOrders = pgTable("bearing_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNo: varchar("order_no", { length: 50 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 50 }),
  customerCompany: varchar("customer_company", { length: 255 }),
  country: varchar("country", { length: 100 }),
  shippingAddress: text("shipping_address"),
  billingAddress: text("billing_address"),
  invoiceInfo: text("invoice_info"),
  /**
   * @type { productId?: string; productName?: string; sku?: string; quantity: number; unitPrice: number; totalPrice: number; specifications?: { [key: string]: string } }
   */
  itemsJson: jsonb("items_json").notNull().default('[]'),
  subtotal: numeric("subtotal").notNull().default('0'),
  shippingFee: numeric("shipping_fee").default('0'),
  taxAmount: numeric("tax_amount").default('0'),
  discountAmount: numeric("discount_amount").default('0'),
  totalAmount: numeric("total_amount").notNull().default('0'),
  currency: varchar("currency", { length: 10 }).default('USD'),
  exchangeRate: numeric("exchange_rate").default('1'),
  paymentType: varchar("payment_type", { length: 50 }).default('full'),
  depositAmount: numeric("deposit_amount").default('0'),
  balanceAmount: numeric("balance_amount").default('0'),
  status: varchar("status", { length: 50 }).default('pending'),
  paymentStatus: varchar("payment_status", { length: 50 }).default('unpaid'),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  notes: text("notes"),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_orders_order_no_key").on(table.orderNo),
  index("idx_bearing_orders_order_no").on(table.orderNo),
  index("idx_bearing_orders_status").on(table.status),
  index("idx_bearing_orders_payment_status").on(table.paymentStatus),
]);

export const bearingInquiries = pgTable("bearing_inquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  country: varchar("country", { length: 100 }),
  productId: uuid("product_id"),
  productName: varchar("product_name", { length: 255 }),
  quantity: integer("quantity"),
  message: text("message"),
  attachmentUrl: varchar("attachment_url", { length: 500 }),
  source: varchar("source", { length: 50 }).default('website'),
  status: varchar("status", { length: 50 }).default('pending'),
  replyContent: text("reply_content"),
  repliedAt: customTimestamptz("replied_at", { precision: 3 }),
  language: varchar("language", { length: 20 }).default('en'),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  index("idx_bearing_inquiries_status").on(table.status),
  index("idx_bearing_inquiries_email").on(table.email),
  foreignKey({
    columns: [table.productId],
    foreignColumns: [bearingProducts.id],
    name: "bearing_inquiries_product_id_fkey",
  }).onDelete("set null"),
]);

export const bearingNews = pgTable("bearing_news", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  titleTh: varchar("title_th", { length: 255 }),
  titleVi: varchar("title_vi", { length: 255 }),
  titleId: varchar("title_id", { length: 255 }),
  titleEs: varchar("title_es", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  summaryEn: text("summary_en"),
  summaryTh: text("summary_th"),
  summaryVi: text("summary_vi"),
  summaryId: text("summary_id"),
  summaryEs: text("summary_es"),
  content: text("content"),
  contentEn: text("content_en"),
  contentTh: text("content_th"),
  contentVi: text("content_vi"),
  contentId: text("content_id"),
  contentEs: text("content_es"),
  coverImage: varchar("cover_image", { length: 500 }),
  category: varchar("category", { length: 100 }).default('news'),
  viewCount: integer("view_count").default(0),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).default('active'),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoKeywords: text("seo_keywords"),
  seoDescription: text("seo_description"),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_news_slug_key").on(table.slug),
]);

export const bearingCases = pgTable("bearing_cases", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  titleEn: varchar("title_en", { length: 255 }),
  titleTh: varchar("title_th", { length: 255 }),
  titleVi: varchar("title_vi", { length: 255 }),
  titleId: varchar("title_id", { length: 255 }),
  titleEs: varchar("title_es", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  summaryEn: text("summary_en"),
  summaryTh: text("summary_th"),
  summaryVi: text("summary_vi"),
  summaryId: text("summary_id"),
  summaryEs: text("summary_es"),
  content: text("content"),
  contentEn: text("content_en"),
  contentTh: text("content_th"),
  contentVi: text("content_vi"),
  contentId: text("content_id"),
  contentEs: text("content_es"),
  coverImage: varchar("cover_image", { length: 500 }),
  images: text("images"),
  region: varchar("region", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).default('active'),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoKeywords: text("seo_keywords"),
  seoDescription: text("seo_description"),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_cases_slug_key").on(table.slug),
]);

export const bearingBanners = pgTable("bearing_banners", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }),
  titleEn: varchar("title_en", { length: 255 }),
  titleTh: varchar("title_th", { length: 255 }),
  titleVi: varchar("title_vi", { length: 255 }),
  titleId: varchar("title_id", { length: 255 }),
  titleEs: varchar("title_es", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  subtitleEn: varchar("subtitle_en", { length: 255 }),
  subtitleTh: varchar("subtitle_th", { length: 255 }),
  subtitleVi: varchar("subtitle_vi", { length: 255 }),
  subtitleId: varchar("subtitle_id", { length: 255 }),
  subtitleEs: varchar("subtitle_es", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  linkUrl: varchar("link_url", { length: 500 }),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).default('active'),
  position: varchar("position", { length: 50 }).default('home'),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
});

export const bearingProducts = pgTable("bearing_products", {
  id: uuid("id").primaryKey().defaultRandom(),
  categoryId: uuid("category_id"),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  nameTh: varchar("name_th", { length: 255 }),
  nameVi: varchar("name_vi", { length: 255 }),
  nameId: varchar("name_id", { length: 255 }),
  nameEs: varchar("name_es", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  sku: varchar("sku", { length: 100 }),
  model: varchar("model", { length: 100 }),
  images: text("images"),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionTh: text("description_th"),
  descriptionVi: text("description_vi"),
  descriptionId: text("description_id"),
  descriptionEs: text("description_es"),
  /**
   * @type { boreDiameter?: string; outerDiameter?: string; width?: string; weight?: string; ratedLoad?: string; limitingSpeed?: string; material?: string; sealType?: string; cageMaterial?: string; [key: string]: string }
   */
  parametersJson: jsonb("parameters_json").default('{}'),
  material: varchar("material", { length: 255 }),
  precisionLevel: varchar("precision_level", { length: 100 }),
  certifications: varchar("certifications", { length: 255 }),
  exportRegions: varchar("export_regions", { length: 255 }),
  applicationScenarios: varchar("application_scenarios", { length: 255 }),
  minOrderQty: integer("min_order_qty").default(1),
  unitPrice: numeric("unit_price"),
  priceCurrency: varchar("price_currency", { length: 10 }).default('USD'),
  stockQty: integer("stock_qty").default(0),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).default('active'),
  isFeatured: boolean("is_featured").default(false),
  isNew: boolean("is_new").default(false),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoKeywords: text("seo_keywords"),
  seoDescription: text("seo_description"),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_products_slug_key").on(table.slug),
  index("idx_bearing_products_category").on(table.categoryId),
  index("idx_bearing_products_status").on(table.status),
  index("idx_bearing_products_slug").on(table.slug),
  foreignKey({
    columns: [table.categoryId],
    foreignColumns: [bearingCategories.id],
    name: "bearing_products_category_id_fkey",
  }).onDelete("set null"),
]);

export const bearingCategories = pgTable("bearing_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  nameEn: varchar("name_en", { length: 255 }),
  nameTh: varchar("name_th", { length: 255 }),
  nameVi: varchar("name_vi", { length: 255 }),
  nameId: varchar("name_id", { length: 255 }),
  nameEs: varchar("name_es", { length: 255 }),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  descriptionEn: text("description_en"),
  descriptionTh: text("description_th"),
  descriptionVi: text("description_vi"),
  descriptionId: text("description_id"),
  descriptionEs: text("description_es"),
  icon: varchar("icon", { length: 255 }),
  sortOrder: integer("sort_order").default(0),
  status: varchar("status", { length: 50 }).default('active'),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoKeywords: text("seo_keywords"),
  seoDescription: text("seo_description"),
  createdAt: customTimestamptz("_created_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  createdBy: varchar("_created_by", { length: 255 }),
  updatedAt: customTimestamptz("_updated_at", { precision: 3 }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedBy: varchar("_updated_by", { length: 255 }),
}, (table) => [
  uniqueIndex("bearing_categories_slug_key").on(table.slug),
]);

// table aliases
export const bearingBannersTable = bearingBanners;
export const bearingCasesTable = bearingCases;
export const bearingCategoriesTable = bearingCategories;
export const bearingCmsSettingsTable = bearingCmsSettings;
export const bearingInquiriesTable = bearingInquiries;
export const bearingNewsTable = bearingNews;
export const bearingOrdersTable = bearingOrders;
export const bearingPaymentsTable = bearingPayments;
export const bearingProductsTable = bearingProducts;
