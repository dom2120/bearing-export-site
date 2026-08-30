import { memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Circle,
  Triangle,
  ArrowUp,
  RefreshCw,
  MoveDiagonal,
  Minus,
  CircleDot,
} from "lucide-react";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import type { BearingCategory } from "@shared/api.interface";

interface CategoriesSectionProps {
  categories: BearingCategory[];
  loading: boolean;
  fallbackIcons: string[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  circle: Circle,
  triangle: Triangle,
  'arrow-up': ArrowUp,
  'refresh-cw': RefreshCw,
  'move-diagonal': MoveDiagonal,
  minus: Minus,
  'circle-dot': CircleDot,
};

const CategoriesSection = memo(function CategoriesSection({
  categories,
  loading,
  fallbackIcons,
}: CategoriesSectionProps) {
  const { t, currentLanguage } = useI18nStore();

  const displayCategories =
    categories.length > 0
      ? categories
      : Array.from({ length: 6 }, (_, i) => ({
          id: `cat-${i}`,
          name: `Category ${i + 1}`,
          slug: `category-${i + 1}`,
          icon: fallbackIcons[i],
        })) as unknown as BearingCategory[];

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t("home.productCategories")}
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i: number) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-6 h-48"
              >
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                <Skeleton className="h-5 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-20 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            data-ai-section-type="card-menu"
          >
            {displayCategories.map(
              (cat: BearingCategory, idx: number) => {
                const name = getLocalizedField(
                  cat as unknown as Record<string, unknown>,
                  "name",
                  currentLanguage,
                  cat.name,
                );
                const IconComp = iconMap[cat.icon || ''] || Circle;
                return (
                  <Link
                    key={cat.id}
                    to={`/products?category=${cat.slug}`}
                    className="group bg-card border border-border rounded-xl p-6 md:p-8 text-center hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <IconComp className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-primary font-medium group-hover:gap-2 transition-all">
                      {t("common.learnMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              },
            )}
          </div>
        )}
      </div>
    </section>
  );
});

export default CategoriesSection;
