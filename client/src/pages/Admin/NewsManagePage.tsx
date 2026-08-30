import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Table } from '@lark-apaas/client-toolkit/antd-table';
import type { TableProps } from '@lark-apaas/client-toolkit/antd-table';
import { Card, CardContent, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
import { Input } from '@client/src/components/ui/input';
import { Textarea } from '@client/src/components/ui/textarea';
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
import type { BearingNews } from '@shared/api.interface';
import type { NewsListResponse } from '@client/src/api/bearing-cms';
import { Image } from '@client/src/components/ui/image';

const newsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().optional(),
  summaryEn: z.string().optional(),
  content: z.string().optional(),
  contentEn: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().default('industry'),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: z.string().default('published'),
});

type NewsFormValues = z.infer<typeof newsSchema>;

const newsCategories = [
  { value: 'industry', label: 'Industry News' },
  { value: 'company', label: 'Company News' },
  { value: 'product', label: 'Product News' },
  { value: 'technical', label: 'Technical Articles' },
];

const NewsManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [category, setCategory] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<BearingNews | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingNews, setViewingNews] = useState<BearingNews | null>(null);

  const { data, isLoading } = useQuery<NewsListResponse>({
    queryKey: ['admin-news', page, pageSize, category],
    queryFn: () => bearingCmsApi.getNews(page, pageSize, category || undefined),
  });

  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      slug: '',
      summary: '',
      summaryEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      category: 'industry',
      sortOrder: 0,
      status: 'published',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: NewsFormValues) =>
      bearingAdminApi.createNews(values as bearingAdminApi.NewsCreateBody),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: NewsFormValues }) =>
      bearingAdminApi.updateNews(id, values),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingAdminApi.deleteNews,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleOpenCreate = () => {
    setEditingNews(null);
    form.reset({
      title: '',
      titleEn: '',
      slug: '',
      summary: '',
      summaryEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      category: 'industry',
      sortOrder: 0,
      status: 'published',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: BearingNews) => {
    setEditingNews(item);
    form.reset({
      title: item.title,
      titleEn: item.titleEn,
      slug: item.slug,
      summary: item.summary,
      summaryEn: item.summaryEn,
      content: item.content,
      contentEn: item.contentEn,
      coverImage: item.coverImage,
      category: item.category,
      sortOrder: item.sortOrder,
      status: item.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: NewsFormValues) => {
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns: TableProps<BearingNews>['columns'] = [
    {
      title: 'Cover',
      dataIndex: 'coverImage',
      width: 140,
      render: (url: string | undefined) => (
        <div className="h-14 w-24 overflow-hidden rounded bg-muted">
          {url ? (
            <Image src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      ),
    },
    { title: 'Title', dataIndex: 'title', width: 220 },
    { title: 'Category', dataIndex: 'category', width: 120 },
    { title: 'Views', dataIndex: 'viewCount', width: 80 },
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
      width: 180,
      render: (_: unknown, record: BearingNews) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingNews(record)}
          >
            <Eye className="size-4" />
          </Button>
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
          <CardTitle className="text-xl">{t('admin.news')}</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            {t('admin.addNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {newsCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={data?.items ?? []}
            loading={isLoading}
            scroll={{ x: 900, y: 500 }}
            pagination={{
              current: page,
              pageSize,
              total: data?.total ?? 0,
              onChange: setPage,
              showSizeChanger: false,
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingNews ? 'Edit News' : t('admin.addNew')}
            </DialogTitle>
            <DialogDescription>
              Fill in the news details below.
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
                      <FormLabel>Title (Default) *</FormLabel>
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {newsCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Cover Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Summary (Default)</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="summaryEn"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Summary (English)</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Content (Default)</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contentEn"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Content (English)</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
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

      {/* View Dialog */}
      <Dialog open={!!viewingNews} onOpenChange={(open) => !open && setViewingNews(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingNews?.title}</DialogTitle>
            <DialogDescription>
              {viewingNews?.category} · {viewingNews?.viewCount} views
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {viewingNews?.coverImage && (
              <Image
                src={viewingNews.coverImage}
                alt=""
                className="w-full rounded-lg"
              />
            )}
            {viewingNews?.summary && (
              <p className="text-sm text-muted-foreground">{viewingNews.summary}</p>
            )}
            {viewingNews?.content && (
              <div className="whitespace-pre-wrap text-sm">
                {viewingNews.content}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingNews(null)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete News</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this news item? This action cannot be undone.
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

export default NewsManagePage;
