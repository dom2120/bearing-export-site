import type {
  BearingBanner,
  BearingCase,
  BearingNews,
  CmsSetting,
} from '@shared/api.interface';
import {
  bearingBanners,
  bearingCases,
  bearingNews,
  bearingCmsSettings,
} from '@server/database/schema';

export function mapBanner(row: typeof bearingBanners.$inferSelect): BearingBanner {
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

export function mapSetting(row: typeof bearingCmsSettings.$inferSelect): CmsSetting {
  return {
    id: row.id,
    settingKey: row.settingKey,
    settingValue: row.settingValue ?? undefined,
    settingType: row.settingType ?? 'text',
    description: row.description ?? undefined,
  };
}
