import { memo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@client/src/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { useI18nStore } from "@client/src/store/useI18nStore";

interface PageHeaderProps {
  title: string;
  totalCount?: number;
}

const ProductsPageHeader = memo(function ProductsPageHeader({
  title,
  totalCount,
}: PageHeaderProps) {
  const { t } = useI18nStore();

  return (
    <div className="bg-gradient-to-r from-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">{t("common.home")}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          {totalCount !== undefined && (
            <span className="text-sm text-muted-foreground">
              {totalCount} {t("products.allProducts").toLowerCase()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductsPageHeader;
