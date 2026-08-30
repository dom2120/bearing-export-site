import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, Factory } from 'lucide-react';
import { useI18nStore } from '@/store/useI18nStore';
import { languageNames, type LanguageCode } from '@/i18n';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const navItems = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.products', path: '/products' },
  { key: 'nav.aboutUs', path: '/about' },
  { key: 'nav.contact', path: '/contact' },
];

export default function Layout() {
  const { t, currentLanguage, setLanguage } = useI18nStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const location = useLocation();

  const currentLangInfo = languageNames[currentLanguage];

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isAdminPath = location.pathname.startsWith('/admin');
  if (isAdminPath) return <Outlet />;

  return (
    <div className="flex min-h-screen flex-col bg-background-page text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-white">
                <Factory className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-primary tracking-tight">
                  BearingEx
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  China Bearing
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    cn(
                      'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground/80 hover:text-primary hover:bg-primary/5',
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors"
                  aria-expanded={langDropdownOpen}
                  aria-haspopup="listbox"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-base leading-none">{currentLangInfo.flag}</span>
                  <span className="hidden lg:inline">{currentLangInfo.label}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </button>

                {langDropdownOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 w-44 rounded-md border border-border bg-white p-1 shadow-lg z-50"
                    role="listbox"
                  >
                    {(Object.keys(languageNames) as LanguageCode[]).map((code) => {
                      const info = languageNames[code];
                      const active = code === currentLanguage;
                      return (
                        <button
                          key={code}
                          type="button"
                          role="option"
                          aria-selected={active}
                          onClick={() => handleLanguageChange(code)}
                          className={cn(
                            'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-left',
                            'hover:bg-muted transition-colors',
                            active && 'bg-primary/10 text-primary font-medium',
                          )}
                        >
                          <span className="text-base">{info.flag}</span>
                          <span>{info.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Admin / Login */}
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  {t('nav.admin')}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                className="p-2 rounded-md md:hidden text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary bg-primary/5'
                        : 'text-foreground/80 hover:text-primary hover:bg-primary/5',
                    )
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}

              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-border mt-1">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  {t('nav.language')}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  {(Object.keys(languageNames) as LanguageCode[]).map((code) => {
                    const info = languageNames[code];
                    const active = code === currentLanguage;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleLanguageChange(code)}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1.5 text-xs rounded-md transition-colors',
                          active
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'hover:bg-muted text-foreground/80',
                        )}
                      >
                        <span>{info.flag}</span>
                        <span className="truncate">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Admin Link */}
              <div className="px-4 py-3 border-t border-border">
                <Link to="/admin/dashboard" onClick={closeMobileMenu}>
                  <Button variant="default" size="sm" className="w-full">
                    {t('nav.admin')}
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300">
        <div className="container mx-auto py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
                  <Factory className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">BearingEx</span>
              </div>
              <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Professional bearing manufacturer in China with 20+ years of export
                experience. Serving global partners with quality products and
                OEM/ODM services.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-primary transition-colors cursor-pointer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-primary transition-colors cursor-pointer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 hover:bg-accent transition-colors cursor-pointer">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/" className="text-sm hover:text-accent transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm hover:text-accent transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Deep Groove Ball Bearings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Tapered Roller Bearings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Spherical Roller Bearings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Cylindrical Roller Bearings
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="text-sm hover:text-accent transition-colors"
                  >
                    Angular Contact Bearings
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <svg
                    className="h-4 w-4 mt-0.5 text-accent shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>No.88 Industrial Zone, Shanghai, China</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-accent shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>sales@bearingex.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-accent shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>+86 21 8888 6666</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-accent shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>+86 138 8888 6666 (WhatsApp)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} BearingEx. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <Link to="/privacy" className="hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <span className="text-slate-700">|</span>
              <Link to="/about" className="hover:text-accent transition-colors">
                About
              </Link>
              <span className="text-slate-700">|</span>
              <Link to="/contact" className="hover:text-accent transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
