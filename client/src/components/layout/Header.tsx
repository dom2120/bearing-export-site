import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Globe, ChevronDown } from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@client/src/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@client/src/components/ui/sheet";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { languageNames, type LanguageCode } from "@client/src/i18n";
import { useNavigate } from 'react-router-dom';

const navKeys: { key: string; to: string }[] = [
  { key: "nav.home", to: "/" },
  { key: "nav.products", to: "/products" },
  { key: "nav.aboutUs", to: "/about" },
  { key: "nav.contact", to: "/contact" },
];

function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "ghost" }) {
  const { currentLanguage, setLanguage, t } = useI18nStore();
  const langList = Object.entries(languageNames) as [LanguageCode, { label: string; flag: string }][];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className="gap-1.5">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languageNames[currentLanguage].flag} {languageNames[currentLanguage].label}
          </span>
          <span className="sm:hidden">{languageNames[currentLanguage].flag}</span>
          <ChevronDown className="hidden sm:block h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {langList.map(([code, { label, flag }]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className="cursor-pointer gap-2"
          >
            <span>{flag}</span>
            <span>{label}</span>
            {currentLanguage === code && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const { t, currentLanguage } = useI18nStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-primary-foreground"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
                <line x1="12" y1="2" x2="12" y2="8" />
                <line x1="12" y1="16" x2="12" y2="22" />
                <line x1="2" y1="12" x2="8" y2="12" />
                <line x1="16" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg md:text-xl font-bold text-primary">
                BearingEx
              </span>
              <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">
                {t("home.exportExperience")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navKeys.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-primary bg-primary/5"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <LanguageSwitcher variant="ghost" />
            <Button
              variant="default"
              size="sm"
              className="hidden md:inline-flex bg-secondary hover:bg-secondary/90 text-secondary-foreground border-secondary"
              style={{
                ["--opaque-button-border-intensity" as string]: "-15",
              }}
              onClick={() => (navigate("/contact"))}
            >
              {t("nav.requestQuote")}
            </Button>

            {/* Mobile menu trigger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("common.more")}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle className="text-left text-primary">
                    BearingEx
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-1">
                  {navKeys.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `px-4 py-3 text-base font-medium rounded-md transition-colors ${
                          isActive
                            ? "text-primary bg-primary/5"
                            : "text-foreground hover:text-primary hover:bg-primary/5"
                        }`
                      }
                    >
                      {t(item.key)}
                    </NavLink>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("nav.language")}
                    </span>
                    <LanguageSwitcher />
                  </div>
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/contact");
                    }}
                  >
                    {t("nav.requestQuote")}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
