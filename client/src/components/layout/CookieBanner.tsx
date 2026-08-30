import { useState, useEffect } from "react";
import { X, Settings } from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import { useI18nStore } from "@client/src/store/useI18nStore";

const COOKIE_KEY = "bearing-ex-cookie-consent";

const CookieBanner = () => {
  const { t } = useI18nStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_KEY);
      if (!consent) {
        // Delay a bit for better UX
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // localStorage not available
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "accepted");
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  const handleReject = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "rejected");
    } catch (e) {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6">
      <div className="max-w-5xl mx-auto bg-card border border-border rounded-lg shadow-xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1">
            {t("cookie.title")}
          </h4>
          <p className="text-sm text-muted-foreground">{t("cookie.message")}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="gap-1">
            <Settings className="h-4 w-4" />
            {t("cookie.settings")}
          </Button>
          <Button variant="outline" size="sm" onClick={handleReject}>
            {t("cookie.reject")}
          </Button>
          <Button variant="default" size="sm" onClick={handleAccept}>
            {t("cookie.accept")}
          </Button>
          <button
            onClick={() => setVisible(false)}
            className="md:hidden p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
