import { memo } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import { useI18nStore } from "@client/src/store/useI18nStore";


const QuoteSection = memo(function QuoteSection() {
  const { t } = useI18nStore();

  return (
    <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-secondary blur-3xl" />
      </div>
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
              {t("home.quickQuoteTitle")}
            </h2>
            <p className="text-white/80 text-base md:text-lg">
              {t("home.quickQuoteDesc")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto font-semibold"
              asChild
            >
              <a
                href="https://wa.me/8613888886666"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4" />
                {t("common.whatsApp")}
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto font-semibold bg-white/10 text-white border-white/40 hover:bg-white/20 hover:text-white no-default-hover-elevate"
              asChild
            >
              <Link to="/contact">
                <Send className="w-4 h-4" />
                {t("home.sendInquiry")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default QuoteSection;
