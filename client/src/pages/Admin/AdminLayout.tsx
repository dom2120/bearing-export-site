import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Image as ImageIcon,
  Briefcase,
  Newspaper,
  MessageSquare,
  ShoppingCart,
  Settings as SettingsIcon,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Search,
  User,
  Globe,
} from 'lucide-react';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { useAdminStore } from '@client/src/store/useAdminStore';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import { Badge } from '@client/src/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@client/src/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@client/src/components/ui/sheet';
import { languageNames, type LanguageCode } from '@client/src/i18n';
import { cn } from '@client/src/lib/utils';

const navItems = [
  { path: 'dashboard', key: 'dashboard', icon: LayoutDashboard },
  { path: 'products', key: 'products', icon: Package },
  { path: 'categories', key: 'categories', icon: Layers },
  { path: 'banners', key: 'banners', icon: ImageIcon },
  { path: 'cases', key: 'cases', icon: Briefcase },
  { path: 'news', key: 'news', icon: Newspaper },
  { path: 'inquiries', key: 'inquiries', icon: MessageSquare },
  { path: 'orders', key: 'orders', icon: ShoppingCart },
  { path: 'settings', key: 'settings', icon: SettingsIcon },
];

const AdminLayout = () => {
  const { t, currentLanguage, setLanguage } = useI18nStore();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileSidebarOpen,
    setMobileSidebarOpen,
  } = useAdminStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    navigate('/');
  };

  const renderNavItems = (isMobile = false) => (
    <nav className="flex-1 space-y-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={`/admin/${item.path}`}
            onClick={() => isMobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {(!sidebarCollapsed || isMobile) && (
              <span className="truncate">{t(`admin.${item.key}`)}</span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const renderSidebarFooter = (isMobile = false) => (
    <div className="border-t border-sidebar-border p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <User className="size-4 text-primary" />
        </div>
        {(!sidebarCollapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Admin</p>
            <p className="truncate text-xs text-muted-foreground">
              admin@bearingex.com
            </p>
          </div>
        )}
      </div>
      {(!sidebarCollapsed || isMobile) && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          {t('admin.logout')}
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex md:flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          {!sidebarCollapsed ? (
            <span className="text-lg font-bold text-primary">
              BearingEx Admin
            </span>
          ) : (
            <span className="mx-auto text-lg font-bold text-primary">BE</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>

        {renderNavItems(false)}
        {renderSidebarFooter(false)}
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <SheetHeader className="border-b border-sidebar-border p-4">
            <SheetTitle className="text-lg font-bold text-primary">
              BearingEx Admin
            </SheetTitle>
          </SheetHeader>
          <div className="flex h-full flex-col pt-4">
            {renderNavItems(true)}
            {renderSidebarFooter(true)}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
            <div className="relative hidden w-72 md:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('common.search') + '...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('nav.language')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(languageNames).map(
                  ([code, { label, flag }]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => setLanguage(code as LanguageCode)}
                      className={cn(
                        currentLanguage === code && 'bg-accent text-accent-foreground'
                      )}
                    >
                      <span className="mr-2">{flag}</span>
                      {label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center px-1 text-[10px]">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-4 text-primary" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate('/admin/settings')}
                >
                  <SettingsIcon className="mr-2 size-4" />
                  {t('admin.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  {t('admin.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
