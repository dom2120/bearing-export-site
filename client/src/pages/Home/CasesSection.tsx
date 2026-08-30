import { memo } from "react";
import { Link } from "react-router-dom";
import { Image } from "@client/src/components/ui/image";
import { Badge } from "@client/src/components/ui/badge";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import type { BearingCase } from "@shared/api.interface";
import { ArrowRight } from "lucide-react";

interface CasesSectionProps {
  cases: BearingCase[];
  loading: boolean;
  fallbackImages: string[];
}

const CasesSection = memo(function CasesSection({
  cases,
  loading,
  fallbackImages,
}: CasesSectionProps) {
  const { t, currentLanguage } = useI18nStore();

  const displayCases =
    cases.length > 0
      ? cases.slice(0, 4)
      : Array.from({ length: 4 }, (_, i) => ({
          id: `case-${i}`,
          title: `Case Study ${i + 1}`,
          slug: `case-${i + 1}`,
          region: i === 0 ? "Southeast Asia" : i === 1 ? "Latin America" : i === 2 ? "Middle East" : "Europe",
          coverImage: fallbackImages[i],
        })) as unknown as BearingCase[];

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t("home.customerCases")}
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i: number) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {displayCases.map((item: BearingCase, idx: number) => {
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
              const img = item.coverImage || fallbackImages[idx] || "";
              return (
                <Link
                  key={item.id}
                  to={`/cases/${item.slug}`}
                  className="group bg-card border border-border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted relative">
                    {img ? (
                      <Image
                        src={img}
                        alt={title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                         {t("common.noImage")}
                      </div>
                    )}
                    {item.region && (
                      <Badge
                        variant="secondary"
                        className="absolute top-3 left-3"
                      >
                        {item.region}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 md:p-5">
                    <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors h-12">
                      {title}
                    </h3>
                    {summary && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {summary}
                      </p>
                    )}
                    <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("common.learnMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
});

export default CasesSection;
