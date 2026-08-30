import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Table } from '@lark-apaas/client-toolkit/antd-table';
import type { TableProps } from '@lark-apaas/client-toolkit/antd-table';
import { Card, CardContent, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import { Badge } from '@client/src/components/ui/badge';
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
import type { BearingCase } from '@shared/api.interface';
import type { CaseListResponse } from '@client/src/api/bearing-cms';
import { Image } from '@client/src/components/ui/image';

const caseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  titleEn: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  summary: z.string().optional(),
  summaryEn: z.string().optional(),
  content: z.string().optional(),
  contentEn: z.string().optional(),
  coverImage: z.string().optional(),
  region: z.string().optional(),
  industry: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: z.string().default('published'),
});

type CaseFormValues = z.infer<typeof caseSchema>;

const CasesManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<BearingCase | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<CaseListResponse>({
    queryKey: ['admin-cases', page, pageSize, keyword],
    queryFn: () => bearingCmsApi.getCases(page, pageSize),
  });

  const form = useForm<CaseFormValues>({
    resolver: zodResolver(caseSchema),
    defaultValues: {
      title: '',
      titleEn: '',
      slug: '',
      summary: '',
      summaryEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      region: '',
      industry: '',
      sortOrder: 0,
      status: 'published',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: CaseFormValues) =>
      bearingAdminApi.createCase(values as bearingAdminApi.CaseCreateBody),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-cases'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CaseFormValues }) =>
      bearingAdminApi.updateCase(id, values),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-cases'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingAdminApi.deleteCase,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-cases'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleOpenCreate = () => {
    setEditingCase(null);
    form.reset({
      title: '',
      titleEn: '',
      slug: '',
      summary: '',
      summaryEn: '',
      content: '',
      contentEn: '',
      coverImage: '',
      region: '',
      industry: '',
      sortOrder: 0,
      status: 'published',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: BearingCase) => {
    setEditingCase(item);
    form.reset({
      title: item.title,
      titleEn: item.titleEn,
      slug: item.slug,
      summary: item.summary,
      summaryEn: item.summaryEn,
      content: item.content,
      contentEn: item.contentEn,
      coverImage: item.coverImage,
      region: item.region,
      industry: item.industry,
      sortOrder: item.sortOrder,
      status: item.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: CaseFormValues) => {
    if (editingCase) {
      updateMutation.mutate({ id: editingCase.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns: TableProps<BearingCase>['columns'] = [
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
    { title: 'Title', dataIndex: 'title', width: 200 },
    { title: 'Region', dataIndex: 'region', width: 100 },
    { title: 'Industry', dataIndex: 'industry', width: 120 },
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
      render: (_: unknown, record: BearingCase) => (
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
          <CardTitle className="text-xl">{t('admin.cases')}</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            {t('admin.addNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t('common.search')}
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
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
              {editingCase ? 'Edit Case' : t('admin.addNew')}
            </DialogTitle>
            <DialogDescription>
              Fill in the case details below.
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
                  name="coverImage"
                  render={({ field }) => (
                    <FormItem>
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
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea rows={4} {...field} />
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
                        <Textarea rows={4} {...field} />
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
            <AlertDialogTitle>Delete Case</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this case? This action cannot be undone.
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

export default CasesManagePage;
