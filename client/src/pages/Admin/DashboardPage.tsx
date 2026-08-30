import { useQuery } from '@tanstack/react-query';
import {
  Package,
  MessageSquare,
  ShoppingCart,
  DollarSign,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
import { Skeleton } from '@client/src/components/ui/skeleton';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingAdminApi } from '@client/src/api';
import type { DashboardStats } from '@shared/api.interface';

const DashboardPage = () => {
  const { t } = useI18nStore();

  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['admin-dashboard'],
    queryFn: bearingAdminApi.getDashboardStats,
  });

  const stats = [
    {
      key: 'totalProducts',
      label: t('admin.totalProducts'),
      value: data?.totalProducts ?? 0,
      icon: Package,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      key: 'totalInquiries',
      label: t('admin.totalInquiries'),
      value: data?.totalInquiries ?? 0,
      icon: MessageSquare,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      key: 'totalOrders',
      label: t('admin.totalOrders'),
      value: data?.totalOrders ?? 0,
      icon: ShoppingCart,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      key: 'totalRevenue',
      label: t('admin.totalRevenue'),
      value: data?.totalRevenue ? `${data.totalRevenue.toLocaleString()}` : '$0',
      icon: DollarSign,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'secondary', label: t('admin.pending') },
      processing: { variant: 'default', label: t('admin.processing') },
      completed: { variant: 'default', label: t('admin.completed') },
      cancelled: { variant: 'destructive', label: t('admin.cancelled') },
      published: { variant: 'default', label: t('admin.published') },
      draft: { variant: 'secondary', label: t('admin.draft') },
    };
    const config = map[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.dashboard')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('admin.statistics')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.key}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  {isLoading ? (
                    <Skeleton className="mt-1 h-7 w-20" />
                  ) : (
                    <p className="text-2xl font-bold">{stat.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Inquiries + Recent Orders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending Inquiries */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('admin.pendingInquiries')}</CardTitle>
            <Button variant="ghost" size="sm">
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">Failed to load data</p>
            ) : data?.recentInquiries?.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
            ) : (
              <div className="space-y-3">
                {data?.recentInquiries?.slice(0, 5).map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <MessageSquare className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{inquiry.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {inquiry.email}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <Clock className="mr-1 size-3" />
                      {inquiry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{t('admin.recentOrders')}</CardTitle>
            <Button variant="ghost" size="sm">
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-16" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-sm text-destructive">Failed to load data</p>
            ) : data?.recentOrders?.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('common.noData')}</p>
            ) : (
              <div className="space-y-3">
                {data?.recentOrders?.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="shrink-0">
                      <p className="text-xs font-mono text-muted-foreground">
                        #{order.orderNo}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {order.currency} {(order.totalAmount ?? 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {order.customerName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="shrink-0">{statusBadge(order.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart Placeholder */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            <TrendingUp className="mr-2 inline size-5 text-primary" />
            7-Day Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-end justify-around gap-2 px-4">
            {Array.from({ length: 7 }).map((_, i) => {
              const height = 30 + Math.random() * 60;
              return (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all hover:bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    D{i + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
