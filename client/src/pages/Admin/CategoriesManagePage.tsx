import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table } from '@lark-apaas/client-toolkit/antd-table';
import type { TableProps } from '@lark-apaas/client-toolkit/antd-table';
import { Card, CardContent, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Badge } from '@client/src/components/ui/badge';
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
import { Input } from '@client/src/components/ui/input';
import { Textarea } from '@client/src/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/src/components/ui/select';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingAdminApi, bearingProductsApi } from '@client/src/api';
import type {
  BearingCategory,
  BearingCategoryListResponse,
} from '@shared/api.interface';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEn: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  status: z.string().default('published'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoriesManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BearingCategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data, isLoading } = useQuery<BearingCategoryListResponse>({
    queryKey: ['admin-categories', page, pageSize],
    queryFn: () =>
      bearingProductsApi.getCategories(),
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      icon: '',
      sortOrder: 0,
      status: 'published',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: CategoryFormValues) =>
      bearingAdminApi.createCategory(values as bearingAdminApi.CategoryCreateBody),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: CategoryFormValues }) =>
      bearingAdminApi.updateCategory(id, values),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingAdminApi.deleteCategory,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.reset({
      name: '',
      nameEn: '',
      slug: '',
      description: '',
      descriptionEn: '',
      icon: '',
      sortOrder: 0,
      status: 'published',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: BearingCategory) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      nameEn: category.nameEn,
      slug: category.slug,
      description: category.description,
      descriptionEn: category.descriptionEn,
      icon: category.icon,
      sortOrder: category.sortOrder,
      status: category.status,
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns: TableProps<BearingCategory>['columns'] = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 60,
      render: (icon: string | undefined) =>
        icon ? (
          <span className="text-xl">{icon}</span>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
            N/A
          </div>
        ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      render: (_: unknown, record: BearingCategory) => (
        <div>
          <p className="font-medium">{record.name}</p>
          {record.nameEn && (
            <p className="text-xs text-muted-foreground">{record.nameEn}</p>
          )}
        </div>
      ),
    },
    { title: 'Slug', dataIndex: 'slug', width: 150 },
    { title: 'Sort', dataIndex: 'sortOrder', width: 80 },
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
      render: (_: unknown, record: BearingCategory) => (
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
          <CardTitle className="text-xl">{t('admin.categories')}</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            {t('admin.addNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data?.items ?? []}
            loading={isLoading}
            scroll={{ x: 800, y: 500 }}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : t('admin.addNew')}
            </DialogTitle>
            <DialogDescription>
              Fill in the category details below.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Default) *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
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
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon (emoji or URL)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (Default)</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descriptionEn"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description (English)</FormLabel>
                      <FormControl>
                        <Textarea rows={2} {...field} />
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
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
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

export default CategoriesManagePage;
