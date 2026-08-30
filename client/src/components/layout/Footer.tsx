import { Link } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  MessageCircle,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@client/src/components/ui/button";
import { Input } from "@client/src/components/ui/input";
import { useI18nStore } from "@client/src/store/useI18nStore";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://wa.me/8613888886666", label: "WhatsApp" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const quickLinks = [
  { key: "nav.home", to: "/" },
  { key: "nav.products", to: "/products" },
  { key: "nav.aboutUs", to: "/about" },
  { key: "nav.contact", to: "/contact" },
  { key: "nav.inquiry", to: "/contact" },
];

const Footer = () => {
  const { t } = useI18nStore();

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white"
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
              <span className="text-xl font-bold text-white">BearingEx</span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {t("footer.aboutBrief")}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="h-9 w-9 rounded-full bg-slate-800 hover:bg-primary flex items-center justify-center transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.contactInfo")}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-slate-500" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href={`tel:${t("footer.phone")}`}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.phone")}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                <a
                  href={`mailto:${t("footer.email")}`}
                  className="hover:text-white transition-colors"
                >
                  {t("footer.email")}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {t("footer.subscribe")}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {t("footer.subscribeDesc")}
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary h-10"
              />
              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-10"
              >
                {t("footer.subscribeButton")}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-500 text-center md:text-left">
            {t("footer.copyright")}
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-slate-500 hover:text-white transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/terms"
              className="text-sm text-slate-500 hover:text-white transition-colors"
            >
              {t("footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
