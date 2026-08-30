import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@client/src/components/ui/breadcrumb";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { Alert } from "@client/src/components/ui/alert";
import { AlertCircle, ArrowRight } from "lucide-react";
import { bearingProductsApi } from "@client/src/api";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDetailTabs from "./ProductDetailTabs";
import ProductCard from "@client/src/components/ProductCard";
import type { BearingProduct } from "@shared/api.interface";

const ProductDetailPage = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { t, currentLanguage } = useI18nStore();

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => bearingProductsApi.getProductBySlug(slug),
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
  });

  // Related products (same category)
  const { data: relatedData } = useQuery({
    queryKey: ["relatedProducts", product?.categoryId, product?.id],
    queryFn: () =>
      bearingProductsApi.getProducts({
        categoryId: product?.categoryId,
        page: 1,
        pageSize: 6,
      }),
    staleTime: 5 * 60 * 1000,
    enabled: !!product?.categoryId,
  });

  const relatedProducts = relatedData?.items.filter(
    (p: BearingProduct) => p.id !== product?.id,
  ).slice(0, 6) ?? [];

  if (isError) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Alert variant="destructive" className="max-w-xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <span>{t("common.error")}: Product not found</span>
          <button
            onClick={() => refetch()}
            className="ml-auto text-sm underline"
          >
            Retry
          </button>
        </Alert>
        <div className="text-center mt-6">
          <Link
            to="/products"
            className="text-primary hover:underline inline-flex items-center gap-1"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const categoryName = product?.category
    ? getLocalizedField(
        product.category as unknown as Record<string, unknown>,
        "name",
        currentLanguage,
        product.category.name,
      )
    : "";
  const productName = product
    ? getLocalizedField(
        product as unknown as Record<string, unknown>,
        "name",
        currentLanguage,
        product.name,
      )
    : "";
  const images = product?.images
    ? product.images.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-0">
      {/* Breadcrumb header */}
      <div className="bg-muted/40 border-b border-border">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">{t("common.home")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/products">{t("nav.products")}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {product?.category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link
                        to={`/products?category=${product.category.slug}`}
                      >
                        {categoryName}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="max-w-[200px] truncate">
                  {isLoading ? (
                    <Skeleton className="h-4 w-32" />
                  ) : (
                    productName
                  )}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="grid grid-cols-5 gap-2 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          </div>
        ) : product ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 md:mb-16">
              <ProductGallery images={images} productName={productName} />
              <ProductInfo product={product} />
            </div>

            {/* Tabs */}
            <div className="mb-12 md:mb-16">
              <ProductDetailTabs product={product} />
            </div>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <section>
                <div className="flex items-end justify-between mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {t("products.relatedProducts")}
                  </h2>
                  <Link
                    to="/products"
                    className="text-primary text-sm font-medium hover:underline"
                  >
                    {t("common.viewAll")}
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                  {relatedProducts.map((p: BearingProduct) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetailPage;
