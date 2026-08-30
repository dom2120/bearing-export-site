import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table } from '@lark-apaas/client-toolkit/antd-table';
import type { TableProps } from '@lark-apaas/client-toolkit/antd-table';
import { Card, CardContent, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
import { Input } from '@client/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/src/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@client/src/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@client/src/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@client/src/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingAdminApi, bearingCmsApi } from '@client/src/api';
import type { BearingBanner } from '@shared/api.interface';
import { Image } from '@client/src/components/ui/image';

const bannerSchema = z.object({
  title: z.string().optional(),
  titleEn: z.string().optional(),
  subtitle: z.string().optional(),
  subtitleEn: z.string().optional(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  linkUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: z.string().default('published'),
  position: z.string().default('home'),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

const BannersManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [position, setPosition] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BearingBanner | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<BearingBanner[]>({
    queryKey: ['admin-banners', position],
    queryFn: () => bearingCmsApi.getBanners(position || undefined),
  });

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      subtitle: '',
      subtitleEn: '',
      imageUrl: '',
      linkUrl: '',
      sortOrder: 0,
      status: 'published',
      position: 'home',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: BannerFormValues) =>
      bearingAdminApi.createBanner(values as bearingAdminApi.BannerCreateBody),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: BannerFormValues }) =>
      bearingAdminApi.updateBanner(id, values),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingAdminApi.deleteBanner,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleOpenCreate = () => {
    setEditingBanner(null);
    form.reset({
      title: '',
      titleEn: '',
      subtitle: '',
      subtitleEn: '',
      imageUrl: '',
      linkUrl: '',
      sortOrder: 0,
      status: 'published',
      position: 'home',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (banner: BearingBanner) => {
    setEditingBanner(banner);
    form.reset({
      title: banner.title,
      titleEn: banner.titleEn,
      subtitle: banner.subtitle,
      subtitleEn: banner.subtitleEn,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      sortOrder: banner.sortOrder,
      status: banner.status,
      position: banner.position,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: BannerFormValues) => {
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns: TableProps<BearingBanner>['columns'] = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      width: 180,
      render: (url: string) => (
        <div className="h-16 w-32 overflow-hidden rounded">
          <Image src={url} alt="" className="h-full w-full object-cover" />
        </div>
      ),
    },
    { title: 'Title', dataIndex: 'title', width: 180 },
    { title: 'Subtitle', dataIndex: 'subtitle', width: 200 },
    { title: 'Position', dataIndex: 'position', width: 100 },
    { title: 'Sort', dataIndex: 'sortOrder', width: 70 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (status: string) => (
        <Badge variant={status === 'published' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      ),
    },
    {
      title: t('admin.actions'),
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_: unknown, record: BearingBanner) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(record)}>
            <Edit className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setDeleteId(record.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">{t('admin.banners')}</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            {t('admin.addNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Positions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Positions</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="products">Products</SelectItem>
                <SelectItem value="about">About</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={data ?? []}
            loading={isLoading}
            scroll={{ x: 900, y: 500 }}
            pagination={false}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : t('admin.addNew')}
            </DialogTitle>
            <DialogDescription>
              Fill in the banner details below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Default)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="titleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (Default)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Image URL *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="linkUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="products">Products</SelectItem>
                            <SelectItem value="about">About</SelectItem>
                            <SelectItem value="contact">Contact</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this banner? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BannersManagePage;
