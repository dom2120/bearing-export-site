import { memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@client/src/components/ui/input";
import { Checkbox } from "@client/src/components/ui/checkbox";
import { Slider } from "@client/src/components/ui/slider";
import { Button } from "@client/src/components/ui/button";
import { Skeleton } from "@client/src/components/ui/skeleton";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import type { BearingCategory } from "@shared/api.interface";

export interface FilterState {
  keyword: string;
  categoryIds: string[];
  material: string;
  precisionLevel: string;
  exportRegion: string;
  applicationScenario: string;
  minPrice: number;
  maxPrice: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  categories: BearingCategory[];
  categoriesLoading: boolean;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onReset: () => void;
  priceRange: [number, number];
}

const MATERIALS = [
  { value: "chrome-steel", label: "Chrome Steel (GCr15)" },
  { value: "stainless-steel", label: "Stainless Steel (440C)" },
  { value: "carbon-steel", label: "Carbon Steel" },
  { value: "ceramic", label: "Ceramic (Si3N4)" },
];

const PRECISION_LEVELS = [
  { value: "P0", label: "P0 - Standard" },
  { value: "P6", label: "P6 - Precision" },
  { value: "P5", label: "P5 - High Precision" },
  { value: "P4", label: "P4 - Ultra Precision" },
];

const EXPORT_REGIONS = [
  { value: "southeast-asia", label: "Southeast Asia" },
  { value: "middle-east", label: "Middle East" },
  { value: "europe", label: "Europe" },
  { value: "latin-america", label: "Latin America" },
  { value: "north-america", label: "North America" },
  { value: "africa", label: "Africa" },
];

const APPLICATIONS = [
  { value: "automotive", label: "Automotive" },
  { value: "industrial-machinery", label: "Industrial Machinery" },
  { value: "agriculture", label: "Agriculture" },
  { value: "mining", label: "Mining & Construction" },
  { value: "energy", label: "Energy & Power" },
  { value: "aerospace", label: "Aerospace" },
];

const FilterGroup = memo(function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
});

const FilterSidebar = memo(function FilterSidebar({
  filters,
  categories,
  categoriesLoading,
  onFilterChange,
  onReset,
  priceRange,
}: FilterSidebarProps) {
  const { t, currentLanguage } = useI18nStore();

  const handleCategoryToggle = (catId: string) => {
    const newIds = filters.categoryIds.includes(catId)
      ? filters.categoryIds.filter((id: string) => id !== catId)
      : [...filters.categoryIds, catId];
    onFilterChange({ categoryIds: newIds });
  };

  const hasActiveFilters =
    filters.keyword ||
    filters.categoryIds.length > 0 ||
    filters.material ||
    filters.precisionLevel ||
    filters.exportRegion ||
    filters.applicationScenario ||
    filters.minPrice > priceRange[0] ||
    filters.maxPrice < priceRange[1];

  return (
    <aside className="bg-card border border-border rounded-xl p-5 space-y-6 sticky top-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">
          {t("products.filter")}
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            {t("products.resetFilters")}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={t("products.searchPlaceholder")}
          value={filters.keyword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onFilterChange({ keyword: e.target.value })
          }
          className="pl-9"
        />
      </div>

      {/* Categories */}
      <FilterGroup title={t("products.category")}>
        {categoriesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i: number) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {categories.map((cat: BearingCategory) => {
              const name = getLocalizedField(
                cat as unknown as Record<string, unknown>,
                "name",
                currentLanguage,
                cat.name,
              );
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
                >
                  <Checkbox
                    checked={filters.categoryIds.includes(cat.id)}
                    onCheckedChange={() => handleCategoryToggle(cat.id)}
                  />
                  <span className="line-clamp-1">{name}</span>
                </label>
              );
            })}
          </div>
        )}
      </FilterGroup>

      <div className="border-t border-border pt-5" />

      {/* Material */}
      <FilterGroup title={t("products.material")}>
        <div className="space-y-2">
          {MATERIALS.map((m) => (
            <label
              key={m.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.material === m.value}
                onCheckedChange={() =>
                  onFilterChange({
                    material:
                      filters.material === m.value ? "" : m.value,
                  })
                }
              />
              <span>{m.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border pt-5" />

      {/* Precision */}
      <FilterGroup title={t("products.precision")}>
        <div className="space-y-2">
          {PRECISION_LEVELS.map((p) => (
            <label
              key={p.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.precisionLevel === p.value}
                onCheckedChange={() =>
                  onFilterChange({
                    precisionLevel:
                      filters.precisionLevel === p.value ? "" : p.value,
                  })
                }
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border pt-5" />

      {/* Export Region */}
      <FilterGroup title={t("products.exportRegion")}>
        <div className="space-y-2">
          {EXPORT_REGIONS.map((r) => (
            <label
              key={r.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.exportRegion === r.value}
                onCheckedChange={() =>
                  onFilterChange({
                    exportRegion:
                      filters.exportRegion === r.value ? "" : r.value,
                  })
                }
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border pt-5" />

      {/* Application */}
      <FilterGroup title={t("products.application")}>
        <div className="space-y-2">
          {APPLICATIONS.map((a) => (
            <label
              key={a.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm text-foreground hover:text-primary transition-colors"
            >
              <Checkbox
                checked={filters.applicationScenario === a.value}
                onCheckedChange={() =>
                  onFilterChange({
                    applicationScenario:
                      filters.applicationScenario === a.value ? "" : a.value,
                  })
                }
              />
              <span>{a.label}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <div className="border-t border-border pt-5" />

      {/* Price Range */}
      <FilterGroup title={`${t("common.price")} (USD)`}>
        <Slider
          value={[filters.minPrice, filters.maxPrice]}
          min={priceRange[0]}
          max={priceRange[1]}
          step={1}
          onValueChange={(vals: number[]) =>
            onFilterChange({ minPrice: vals[0], maxPrice: vals[1] })
          }
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>${filters.minPrice.toFixed(0)}</span>
          <span>${filters.maxPrice.toFixed(0)}</span>
        </div>
      </FilterGroup>
    </aside>
  );
});

export default FilterSidebar;
