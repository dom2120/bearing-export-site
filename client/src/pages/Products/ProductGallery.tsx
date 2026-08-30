import { memo, useState } from "react";
import { Image } from "@client/src/components/ui/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

const ProductGallery = memo(function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.length > 0 ? images : [""];
  const currentImage = displayImages[activeIndex] || "";

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
        {currentImage ? (
          <Image
            src={currentImage}
            alt={productName}
            width={600}
            height={600}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-foreground" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                idx === activeIndex
                  ? "border-primary"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {img ? (
                <Image
                  src={img}
                  alt={`${productName} - ${idx + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-contain bg-muted"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

export default ProductGallery;
