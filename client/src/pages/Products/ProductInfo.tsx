import { memo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Share2,
  Minus,
  Plus,
  Package,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import { Badge } from "@client/src/components/ui/badge";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { formatCurrency } from "@client/src/utils/i18n";
import { getLocalizedField, parseCsvList } from "@client/src/utils/localized-field";
import type { BearingProduct } from "@shared/api.interface";

interface ProductInfoProps {
  product: BearingProduct;
}

const ProductInfo = memo(function ProductInfo({ product }: ProductInfoProps) {
  const { t, currentLanguage } = useI18nStore();
  const [quantity, setQuantity] = useState(product.minOrderQty || 1);

  const name = getLocalizedField(
    product as unknown as Record<string, unknown>,
    "name",
    currentLanguage,
    product.name,
  );
  const description = getLocalizedField(
    product as unknown as Record<string, unknown>,
    "description",
    currentLanguage,
    "",
  );
  const categories = product.category
    ? [product.category]
    : [];
  const certificationsList = parseCsvList(product.certifications);

  const inStock = product.stockQty > 0;

  const handleQtyDecrease = () => {
    setQuantity((q) => Math.max(product.minOrderQty || 1, q - 1));
  };

  const handleQtyIncrease = () => {
    setQuantity((q) => q + 1);
  };

  return (
    <div className="space-y-5">
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {product.isNew && (
          <Badge variant="secondary">NEW</Badge>
        )}
        {categories.map((cat) => (
          <Badge key={cat.id} variant="outline">
            {getLocalizedField(
              cat as unknown as Record<string, unknown>,
              "name",
              currentLanguage,
              cat.name,
            )}
          </Badge>
        ))}
        {certificationsList.slice(0, 3).map((cert: string) => (
          <Badge key={cert} variant="default">
            {cert}
          </Badge>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
        {name}
      </h1>

      {/* Model / SKU */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {product.model && (
          <span>
            {t("products.model")}: <span className="text-foreground font-medium">{product.model}</span>
          </span>
        )}
        {product.sku && (
          <span>
            {t("products.sku")}: <span className="text-foreground font-medium">{product.sku}</span>
          </span>
        )}
      </div>

      {/* Price */}
      <div className="py-3 border-y border-border">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-secondary">
            {product.unitPrice !== undefined
              ? formatCurrency(product.unitPrice, "USD", currentLanguage)
              : "—"}
          </span>
          <span className="text-sm text-muted-foreground">
            / {t("products.pieces")}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {t("products.minOrder")}: {product.minOrderQty} {t("products.pieces")}
        </p>
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        {inStock ? (
          <>
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">
              {t("products.inStock")} ({product.stockQty} {t("products.pieces")})
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              {t("products.outOfStock")}
            </span>
          </>
        )}
      </div>

      {/* Short description */}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
          {description}
        </p>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">
          {t("common.quantity")}:
        </span>
        <div className="flex items-center border border-border rounded-md overflow-hidden">
          <button
            onClick={handleQtyDecrease}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val) && val > 0) setQuantity(val);
            }}
            className="w-16 h-9 text-center text-sm border-0 focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min={product.minOrderQty || 1}
          />
          <button
            onClick={handleQtyIncrease}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("products.minOrder")}: {product.minOrderQty}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          variant="default"
          size="lg"
          className="flex-1 font-semibold"
          asChild
        >
          <Link to={`/contact?product=${product.slug}`}>
            <MessageSquare className="w-4 h-4" />
            {t("products.inquireNow")}
          </Link>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 font-semibold"
          asChild
        >
          <Link to={`/checkout?product=${product.slug}&qty=${quantity}`}>
            <ShoppingCart className="w-4 h-4" />
            {t("products.orderNow")}
          </Link>
        </Button>
      </div>

      {/* Share */}
      <div className="flex items-center gap-3 pt-2">
        <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Package className="w-4 h-4" />
          {product.material && <span>{product.material}</span>}
          {product.precisionLevel && (
            <span>
              {product.material ? " · " : ""}
              {product.precisionLevel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductInfo;
