import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@client/src/components/ui/carousel";
import { Button } from "@client/src/components/ui/button";
import { Image } from "@client/src/components/ui/image";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { getLocalizedField } from "@client/src/utils/localized-field";
import { Skeleton } from "@client/src/components/ui/skeleton";
import type { BearingBanner } from "@shared/api.interface";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSectionProps {
  banners: BearingBanner[];
  loading: boolean;
}

const HeroSection = memo(function HeroSection({
  banners,
  loading,
}: HeroSectionProps) {
  const { t, currentLanguage } = useI18nStore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();

    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000);

    return () => {
      api.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [api]);

  if (loading) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-muted">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!banners.length) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-primary flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("home.heroSlogan")}
          </h1>
          <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-8">
            {t("home.heroSubtitle")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner: BearingBanner, index: number) => {
            const title = getLocalizedField(
              banner as unknown as Record<string, unknown>,
              "title",
              currentLanguage,
              t("home.heroSlogan"),
            );
            const subtitle = getLocalizedField(
              banner as unknown as Record<string, unknown>,
              "subtitle",
              currentLanguage,
              t("home.heroSubtitle"),
            );
            return (
              <CarouselItem
                key={banner.id || index}
                className="pl-0 basis-full"
              >
                <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
                  <Image
                    src={banner.imageUrl}
                    alt={title}
                    width={1920}
                    height={900}
                    className="w-full h-full object-cover"
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-slate-900/20" />
                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                      <div className="max-w-2xl text-white">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-3 md:mb-5">
                          {title}
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-white/85 mb-5 md:mb-8 line-clamp-3 md:line-clamp-none">
                          {subtitle}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="secondary"
                            size="lg"
                            asChild
                            className="font-semibold"
                          >
                            <Link to="/contact">
                              {t("home.requestQuote")}
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white [&_svg]:text-white no-default-hover-elevate"
                          >
                            <Link to="/products">
                              {t("home.viewProducts")}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {banners.map((_: BearingBanner, idx: number) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === current
                ? "w-8 bg-white"
                : "w-1.5 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows (desktop only) */}
      <button
        onClick={() => api?.scrollPrev()}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center backdrop-blur-sm transition-colors z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => api?.scrollNext()}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center backdrop-blur-sm transition-colors z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
});

export default HeroSection;
