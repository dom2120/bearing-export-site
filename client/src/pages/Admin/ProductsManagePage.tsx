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
import { Switch } from '@client/src/components/ui/switch';
import { Textarea } from '@client/src/components/ui/textarea';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingAdminApi, bearingProductsApi } from '@client/src/api';
import type {
  BearingProduct,
  BearingProductListResponse,
  BearingCategory,
} from '@shared/api.interface';
import { Image } from '@client/src/components/ui/image';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  nameEn: z.string().optional(),
  categoryId: z.string().optional(),
  model: z.string().optional(),
  sku: z.string().optional(),
  images: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  material: z.string().optional(),
  precisionLevel: z.string().optional(),
  certifications: z.string().optional(),
  minOrderQty: z.coerce.number().int().min(0).optional(),
  unitPrice: z.coerce.number().min(0).optional(),
  priceCurrency: z.string().default('USD'),
  stockQty: z.coerce.number().int().min(0).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  status: z.string().default('published'),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  slug: z.string().min(1, 'Slug is required'),
  parametersJson: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<BearingProduct | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categoriesData } = useQuery<BearingCategory[]>({
    queryKey: ['admin-categories-all'],
    queryFn: async () => {
      const res = await bearingProductsApi.getCategories();
      return res.items;
    },
  });

  const { data, isLoading } = useQuery<BearingProductListResponse>({
    queryKey: ['admin-products', page, pageSize, keyword, categoryId],
    queryFn: () =>
      bearingProductsApi.getProducts({
        page,
        pageSize,
        keyword: keyword || undefined,
        categoryId: categoryId || undefined,
      }),
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      nameEn: '',
      categoryId: '',
      model: '',
      sku: '',
      images: '',
      description: '',
      descriptionEn: '',
      material: '',
      precisionLevel: '',
      certifications: '',
      minOrderQty: 1,
      unitPrice: 0,
      priceCurrency: 'USD',
      stockQty: 0,
      sortOrder: 0,
      status: 'published',
      isFeatured: false,
      isNew: false,
      slug: '',
      parametersJson: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: ProductFormValues) => {
      const body: bearingAdminApi.ProductCreateBody = {
        name: values.name,
        slug: values.slug,
        nameEn: values.nameEn,
        categoryId: values.categoryId,
        model: values.model,
        sku: values.sku,
        images: values.images,
        description: values.description,
        descriptionEn: values.descriptionEn,
        material: values.material,
        precisionLevel: values.precisionLevel,
        certifications: values.certifications,
        minOrderQty: values.minOrderQty,
        unitPrice: values.unitPrice,
        priceCurrency: values.priceCurrency,
        stockQty: values.stockQty,
        sortOrder: values.sortOrder,
        status: values.status,
        isFeatured: values.isFeatured,
        isNew: values.isNew,
        parametersJson: values.parametersJson
          ? (JSON.parse(values.parametersJson) as Record<string, string>)
          : undefined,
      };
      return bearingAdminApi.createProduct(body);
    },
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, values }: { id: string; values: ProductFormValues }) =>
      bearingAdminApi.updateProduct(id, {
        ...values,
        parametersJson: values.parametersJson
          ? (JSON.parse(values.parametersJson) as Record<string, string>)
          : undefined,
      }),
    onSuccess: () => {
      toast.success(t('common.success'));
      setDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingAdminApi.deleteProduct,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    form.reset({
      name: '',
      nameEn: '',
      categoryId: '',
      model: '',
      sku: '',
      images: '',
      description: '',
      descriptionEn: '',
      material: '',
      precisionLevel: '',
      certifications: '',
      minOrderQty: 1,
      unitPrice: 0,
      priceCurrency: 'USD',
      stockQty: 0,
      sortOrder: 0,
      status: 'published',
      isFeatured: false,
      isNew: false,
      slug: '',
      parametersJson: '',
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: BearingProduct) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      nameEn: product.nameEn,
      categoryId: product.categoryId,
      model: product.model,
      sku: product.sku,
      images: product.images,
      description: product.description,
      descriptionEn: product.descriptionEn,
      material: product.material,
      precisionLevel: product.precisionLevel,
      certifications: product.certifications,
      minOrderQty: product.minOrderQty,
      unitPrice: product.unitPrice ?? 0,
      priceCurrency: product.priceCurrency,
      stockQty: product.stockQty,
      sortOrder: product.sortOrder,
      status: product.status,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      slug: product.slug,
      parametersJson: product.parametersJson
        ? JSON.stringify(product.parametersJson, null, 2)
        : '',
    });
    setDialogOpen(true);
  };

  const onSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, values });
    } else {
      createMutation.mutate(values);
    }
  };

  const columns: TableProps<BearingProduct>['columns'] = [
    {
      title: 'Image',
      dataIndex: 'images',
      width: 80,
      render: (images: string | undefined) => (
        <div className="h-12 w-12 overflow-hidden rounded-md bg-muted">
          {images ? (
            <Image
              src={images.split(',')[0]}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      ),
    },
    { title: 'Name', dataIndex: 'name', width: 180 },
    { title: 'Model', dataIndex: 'model', width: 120 },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      width: 120,
      render: (val: string | undefined) => val || '-',
    },
    {
      title: 'Price',
      width: 100,
      render: (_: unknown, record: BearingProduct) =>
        `${record.priceCurrency} ${record.unitPrice ?? '-'}`,
    },
    { title: 'Stock', dataIndex: 'stockQty', width: 80 },
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
    { title: 'Sort', dataIndex: 'sortOrder', width: 60 },
    {
      title: 'Featured',
      dataIndex: 'isFeatured',
      width: 80,
      render: (val: boolean) => (val ? 'Yes' : 'No'),
    },
    {
      title: t('admin.actions'),
      key: 'actions',
      fixed: 'right',
      width: 140,
      render: (_: unknown, record: BearingProduct) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenEdit(record)}
          >
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
          <CardTitle className="text-xl">{t('admin.products')}</CardTitle>
          <Button onClick={handleOpenCreate}>
            <Plus className="mr-2 size-4" />
            {t('admin.addNew')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
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
            <Select
              value={categoryId}
              onValueChange={(val) => {
                setCategoryId(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categoriesData?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
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
            scroll={{ x: 1000, y: 500 }}
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

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : t('admin.addNew')}
            </DialogTitle>
            <DialogDescription>
              Fill in the product details below.
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
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {categoriesData?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
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
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
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
                        <Textarea rows={3} {...field} />
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
                        <Textarea rows={3} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="precisionLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precision Level</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certifications</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="parametersJson"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Parameters (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          {...field}
                          placeholder='{"boreDiameter":"20mm","outerDiameter":"47mm"}'
                          className="font-mono text-xs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minOrderQty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Order Qty</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockQty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Qty</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Is Featured</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Is New</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
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

export default ProductsManagePage;
