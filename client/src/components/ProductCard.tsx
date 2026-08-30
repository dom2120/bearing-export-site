import { memo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@client/src/components/ui/badge";
import { Button } from "@client/src/components/ui/button";
import { Image } from "@client/src/components/ui/image";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import { formatCurrency } from "@client/src/utils/i18n";
import type { BearingProduct } from "@shared/api.interface";

interface ProductCardProps {
  product: BearingProduct;
  view?: "grid" | "list";
}

const ProductCard = memo(function ProductCard({
  product,
  view = "grid",
}: ProductCardProps) {
  const { t, currentLanguage } = useI18nStore();
  const name = getLocalizedField(
    product as unknown as Record<string, unknown>,
    "name",
    currentLanguage,
    product.name,
  );
  const images = product.images ? product.images.split(",")[0] : "";

  if (view === "list") {
    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row">
        <Link
          to={`/products/${product.slug}`}
          className="sm:w-56 md:w-64 shrink-0 overflow-hidden bg-muted flex items-center justify-center"
        >
          {images ? (
            <Image
              src={images}
              alt={name}
              width={320}
              height={240}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-1.5">
            {product.isNew && (
              <Badge variant="secondary" className="text-[10px]">
                NEW
              </Badge>
            )}
          </div>
        </Link>
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          <Link
            to={`/products/${product.slug}`}
            className="text-base md:text-lg font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 mb-1.5"
          >
            {name}
          </Link>
          {product.model && (
            <p className="text-sm text-muted-foreground mb-2">
              {t("products.model")}: {product.model}
            </p>
          )}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-secondary">
              {product.unitPrice !== undefined
                ? formatCurrency(product.unitPrice, "USD", currentLanguage)
                : "—"}
            </span>
            <span className="text-xs text-muted-foreground">
              / {t("products.pieces")}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {t("products.minOrder")}: {product.minOrderQty} {t("products.pieces")}
          </p>
          <div className="mt-auto">
            <Button size="sm" variant="default" asChild>
              <Link to={`/products/${product.slug}`}>{t("products.inquireNow")}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
      <Link
        to={`/products/${product.slug}`}
        className="block aspect-[4/3] overflow-hidden bg-muted flex items-center justify-center"
      >
        {images ? (
          <Image
            src={images}
            alt={name}
            width={400}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            No Image
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          {product.isNew && (
            <Badge variant="secondary" className="text-[10px] px-2">
              NEW
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-3.5 md:p-4">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm md:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 h-10 md:h-12 mb-1.5 block"
        >
          {name}
        </Link>
        {product.model && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {t("products.model")}: {product.model}
          </p>
        )}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg md:text-xl font-bold text-secondary">
            {product.unitPrice !== undefined
              ? formatCurrency(product.unitPrice, "USD", currentLanguage)
              : "—"}
          </span>
          <span className="text-[11px] text-muted-foreground">
            / {t("products.pieces")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          {t("products.minOrder")}: {product.minOrderQty}
        </p>
        <Button size="sm" variant="default" className="w-full" asChild>
          <Link to={`/products/${product.slug}`}>{t("products.inquireNow")}</Link>
        </Button>
      </div>
    </div>
  );
});

export default ProductCard;
