import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { useI18nStore } from "@client/src/store/useI18nStore";
import ProductCard from "@client/src/components/ProductCard";
import type { BearingProduct } from "@shared/api.interface";

interface FeaturedProductsProps {
  products: BearingProduct[];
  loading: boolean;
}

const FeaturedProductsSection = memo(function FeaturedProductsSection({
  products,
  loading,
}: FeaturedProductsProps) {
  const { t } = useI18nStore();

  return (
    <section className="py-16 md:py-20 bg-muted/40" data-ai-section-type="card-list">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {t("home.featuredProducts")}
            </h2>
            <div className="w-16 h-1 bg-secondary rounded-full" />
          </div>
          <Link
            to="/products"
            className="text-primary font-medium text-sm md:text-base inline-flex items-center gap-1.5 hover:gap-2 transition-all shrink-0 ml-4"
          >
            {t("common.viewAll")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i: number) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product: BearingProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default FeaturedProductsSection;
