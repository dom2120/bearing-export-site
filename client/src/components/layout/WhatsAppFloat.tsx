import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useI18nStore } from "@client/src/store/useI18nStore";

const WHATSAPP_URL = "https://wa.me/8613888886666";

const WhatsAppFloat = () => {
  const { t } = useI18nStore();
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 md:bottom-24 md:right-6 z-40"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            bg-white text-foreground px-4 py-2 rounded-full shadow-lg border border-border
            text-sm font-medium whitespace-nowrap transition-all duration-300
            ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}
          `}
        >
          {t("home.whatsappCta")}
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
          <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105">
            <MessageCircle className="h-7 w-7 md:h-8 md:w-8" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default WhatsAppFloat;
