import { useQuery } from "@tanstack/react-query";
import { bearingCmsApi } from "@client/src/api";
import HeroSection from "./HeroSection";
import AdvantagesSection from "./AdvantagesSection";
import CategoriesSection from "./CategoriesSection";
import FactorySection from "./FactorySection";
import FeaturedProductsSection from "./FeaturedProductsSection";
import CasesSection from "./CasesSection";
import QuoteSection from "./QuoteSection";
import NewsSection from "./NewsSection";
import { bearingProductsApi } from "@client/src/api";
import { Alert } from "@client/src/components/ui/alert";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { AlertCircle } from "lucide-react";

// Static image URLs from project assets
const FACTORY_IMG =
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7tgwcdq_ve_miaoda";

const CATEGORY_ICONS = [
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadkseaus6cco_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7zspgfg_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksebovdyeq_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadkseayuccdg_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadkseacmnucg_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd75gugjq_ve_miaoda",
];

const CASE_COVERS = [
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7oc36di_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadkseavwf4no_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7rhm6cg_ve_miaoda",
  "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksead4dcag_ve_miaoda",
];

const HomePage = () => {
  const { t, currentLanguage } = useI18nStore();

  const {
    data: featuredData,
    isLoading: featuredLoading,
    isError: featuredError,
  } = useQuery({
    queryKey: ["homeFeatured", currentLanguage],
    queryFn: () => bearingCmsApi.getFeatured(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories", currentLanguage],
    queryFn: () => bearingProductsApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: newsData, isLoading: newsLoading } = useQuery({
    queryKey: ["homeNews", currentLanguage],
    queryFn: () => bearingCmsApi.getNews(1, 3),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex flex-col">
      {featuredError && (
        <Alert variant="destructive" className="mx-4 mt-4 max-w-xl">
          <AlertCircle className="h-4 w-4" />
          <span>{t("common.error")}: Failed to load content</span>
        </Alert>
      )}

      <HeroSection
        banners={featuredData?.banners ?? []}
        loading={featuredLoading}
      />

      <AdvantagesSection />

      <CategoriesSection
        categories={categoriesData?.items ?? []}
        loading={categoriesLoading}
        fallbackIcons={CATEGORY_ICONS}
      />

      <FactorySection factoryImage={FACTORY_IMG} />

      <FeaturedProductsSection
        products={featuredData?.featuredProducts ?? []}
        loading={featuredLoading}
      />

      <CasesSection
        cases={featuredData?.featuredCases ?? []}
        loading={featuredLoading}
        fallbackImages={CASE_COVERS}
      />

      <QuoteSection />

      <NewsSection news={newsData?.items ?? []} loading={newsLoading} />
    </div>
  );
};

export default HomePage;
