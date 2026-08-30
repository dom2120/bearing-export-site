import { memo } from "react";
import { Link } from "react-router-dom";
import { Image } from "@client/src/components/ui/image";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import { formatDate } from "@client/src/utils/i18n";
import type { BearingNews } from "@shared/api.interface";
import { ArrowRight, Calendar } from "lucide-react";

interface NewsSectionProps {
  news: BearingNews[];
  loading: boolean;
}

const NewsSection = memo(function NewsSection({ news, loading }: NewsSectionProps) {
  const { t, currentLanguage } = useI18nStore();

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t("home.newsInsights")}
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i: number) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.slice(0, 3).map((item: BearingNews) => {
              const title = getLocalizedField(
                item as unknown as Record<string, unknown>,
                "title",
                currentLanguage,
                item.title,
              );
              const summary = getLocalizedField(
                item as unknown as Record<string, unknown>,
                "summary",
                currentLanguage,
                "",
              );
              return (
                <Link
                  key={item.id}
                  to={`/news/${item.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-muted">
                    {item.coverImage ? (
                      <Image
                        src={item.coverImage}
                        alt={title}
                        width={600}
                        height={340}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                        {t("common.noImage")}
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(new Date().toISOString(), currentLanguage)}</span>
                      <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-medium">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    {summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                        {summary}
                      </p>
                    )}
                    <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      {t("common.readMore") || "Read More"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
});

export default NewsSection;
