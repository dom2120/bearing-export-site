import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Grid3x3, List, Filter } from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@client/src/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@client/src/components/ui/pagination";
import { Skeleton } from "@client/src/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@client/src/components/ui/sheet";
import { Alert } from "@client/src/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { bearingProductsApi } from "@client/src/api";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import ProductCard from "@client/src/components/ProductCard";
import ProductsPageHeader from "./ProductsPageHeader";
import FilterSidebar from "./FilterSidebar";
import type { FilterState } from "./FilterSidebar";
import type { BearingProduct, ProductFilterParams } from "@shared/api.interface";

const PAGE_SIZE = 12;
const PRICE_RANGE: [number, number] = [0, 500];

type SortOption = "default" | "price_asc" | "price_desc" | "newest";
type ViewMode = "grid" | "list";

const SORT_OPTIONS: { value: SortOption; labelKey: string }[] = [
  { value: "default", labelKey: "products.bestSelling" },
  { value: "price_asc", labelKey: "products.priceAsc" },
  { value: "price_desc", labelKey: "products.priceDesc" },
  { value: "newest", labelKey: "products.newest" },
];

const ProductsPage = () => {
  const { t, currentLanguage } = useI18nStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    categoryIds: [],
    material: "",
    precisionLevel: "",
    exportRegion: "",
    applicationScenario: "",
    minPrice: PRICE_RANGE[0],
    maxPrice: PRICE_RANGE[1],
  });

  const urlCategorySlug = searchParams.get("category");

  // Categories query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => bearingProductsApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });

  // Resolve category slug to ID
  const resolvedCategoryId = useMemo(() => {
    if (!urlCategorySlug || !categoriesData) return undefined;
    const cat = categoriesData.items.find(
      (c) => c.slug === urlCategorySlug,
    );
    return cat?.id;
  }, [urlCategorySlug, categoriesData]);

  // Sync url category to filter
  useEffect(() => {
    if (resolvedCategoryId) {
      setFilters((prev) => ({
        ...prev,
        categoryIds: prev.categoryIds.includes(resolvedCategoryId)
          ? prev.categoryIds
          : [...prev.categoryIds, resolvedCategoryId],
      }));
    }
  }, [resolvedCategoryId]);

  // Compute category name for header
  const categoryName = useMemo(() => {
    if (!urlCategorySlug || !categoriesData) return t("products.allProducts");
    const cat = categoriesData.items.find(
      (c) => c.slug === urlCategorySlug,
    );
    if (!cat) return t("products.allProducts");
    return getLocalizedField(
      cat as unknown as Record<string, unknown>,
      "name",
      currentLanguage,
      cat.name,
    );
  }, [urlCategorySlug, categoriesData, currentLanguage, t]);

  // Products query params
  const queryParams: ProductFilterParams = useMemo(() => {
    const params: ProductFilterParams = {
      page,
      pageSize: PAGE_SIZE,
    };
    if (filters.keyword) params.keyword = filters.keyword;
    if (filters.material) params.material = filters.material;
    if (filters.precisionLevel) params.precisionLevel = filters.precisionLevel;
    if (filters.exportRegion) params.exportRegion = filters.exportRegion;
    if (filters.applicationScenario)
      params.applicationScenario = filters.applicationScenario;
    if (filters.categoryIds.length === 1) {
      params.categoryId = filters.categoryIds[0];
    } else if (filters.categoryIds.length === 0 && resolvedCategoryId) {
      params.categoryId = resolvedCategoryId;
    }
    if (sortBy === "price_asc") {
      params.sortBy = "unit_price";
      params.sortOrder = "asc";
    } else if (sortBy === "price_desc") {
      params.sortBy = "unit_price";
      params.sortOrder = "desc";
    } else if (sortBy === "newest") {
      params.sortBy = "created_at";
      params.sortOrder = "desc";
    }
    return params;
  }, [filters, sortBy, page, resolvedCategoryId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => bearingProductsApi.getProducts(queryParams),
    staleTime: 2 * 60 * 1000,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters, sortBy, urlCategorySlug]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: "",
      categoryIds: [],
      material: "",
      precisionLevel: "",
      exportRegion: "",
      applicationScenario: "",
      minPrice: PRICE_RANGE[0],
      maxPrice: PRICE_RANGE[1],
    });
    if (urlCategorySlug) {
      setSearchParams({});
    }
  };

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;
  const products = data?.items ?? [];

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={
                page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
              }
            />
          </PaginationItem>
          {pages.map((p, idx: number) =>
            p === "ellipsis" ? (
              <PaginationItem key={`e-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  isActive={p === page}
                  onClick={() => setPage(p)}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ),
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              className={
                page === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const sidebar = (
    <FilterSidebar
      filters={filters}
      categories={categoriesData?.items ?? []}
      categoriesLoading={categoriesLoading}
      onFilterChange={handleFilterChange}
      onReset={handleResetFilters}
      priceRange={PRICE_RANGE}
    />
  );

  return (
    <div className="flex flex-col min-h-0">
      <ProductsPageHeader
        title={categoryName}
        totalCount={data?.total}
      />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <span>{t("common.error")}: Failed to load products</span>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </Alert>
        )}

        <div className="flex gap-6 lg:gap-8">
          {/* Sidebar - desktop */}
          <div className="hidden lg:block w-64 shrink-0">{sidebar}</div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="lg:hidden gap-1.5"
                    >
                      <Filter className="w-4 h-4" />
                      {t("products.filter")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[320px] p-0">
                    <SheetHeader className="p-4 pb-0">
                      <SheetTitle>{t("products.filter")}</SheetTitle>
                    </SheetHeader>
                    <div className="p-4 pt-2">{sidebar}</div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <Select
                  value={sortBy}
                  onValueChange={(v: string) =>
                    setSortBy(v as SortOption)
                  }
                >
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder={t("products.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="hidden sm:flex items-center border border-border rounded-md p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === "grid"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === "list"
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products grid / list */}
            {isLoading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6"
                    : "space-y-4"
                }
              >
                {Array.from({ length: PAGE_SIZE }).map((_, i: number) => (
                  <div
                    key={i}
                    className={
                      viewMode === "grid"
                        ? "bg-card border border-border rounded-lg overflow-hidden"
                        : "bg-card border border-border rounded-lg overflow-hidden flex"
                    }
                  >
                    <Skeleton
                      className={
                        viewMode === "grid"
                          ? "aspect-[4/3] w-full"
                          : "w-48 aspect-[4/3] shrink-0"
                      }
                    />
                    <div className="p-4 space-y-2 flex-1">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  {t("products.noResults")}
                </p>
                <Button variant="outline" onClick={handleResetFilters}>
                  {t("products.resetFilters")}
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product: BearingProduct) => (
                  <ProductCard key={product.id} product={product} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product: BearingProduct) => (
                  <ProductCard key={product.id} product={product} view="list" />
                ))}
              </div>
            )}

            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
