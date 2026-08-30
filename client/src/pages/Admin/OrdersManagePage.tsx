import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, Eye, Edit, Trash2, Download, Package, Truck, CheckCircle } from 'lucide-react';
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
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingOrdersApi } from '@client/src/api';
import type { BearingOrder, OrderListResponse, OrderItem } from '@shared/api.interface';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  processing: 'default',
  shipped: 'default',
  completed: 'default',
  cancelled: 'destructive',
};

const paymentStatusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  unpaid: 'secondary',
  partial: 'default',
  paid: 'default',
  refunded: 'destructive',
};

const OrdersManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [viewingOrder, setViewingOrder] = useState<BearingOrder | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<BearingOrder | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<OrderListResponse>({
    queryKey: ['admin-orders', page, pageSize, status, paymentStatus, keyword],
    queryFn: () =>
      bearingOrdersApi.getOrderList({
        page,
        pageSize,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        keyword: keyword || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      status: s,
      notes,
    }: {
      id: string;
      status?: string;
      notes?: string;
    }) => bearingOrdersApi.updateOrder(id, { status: s, notes }),
    onSuccess: () => {
      toast.success(t('common.success'));
      setStatusDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingOrdersApi.deleteOrder,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleExport = async () => {
    try {
      const blob = await bearingOrdersApi.exportOrdersCsv({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        keyword: keyword || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const openStatusDialog = (order: BearingOrder) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    setStatusNote(order.notes || '');
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    if (!editingOrder) return;
    updateMutation.mutate({
      id: editingOrder.id,
      status: newStatus,
      notes: statusNote,
    });
  };

  const columns: TableProps<BearingOrder>['columns'] = [
    {
      title: 'Order No.',
      dataIndex: 'orderNo',
      width: 140,
      render: (no: string) => <span className="font-mono">#{no}</span>,
    },
    { title: 'Customer', dataIndex: 'customerName', width: 140 },
    {
      title: 'Amount',
      width: 120,
      render: (_: unknown, record: BearingOrder) => (
        <span className="font-semibold">
          {record.currency} {record.totalAmount.toLocaleString()}
        </span>
      ),
    },
    { title: 'Currency', dataIndex: 'currency', width: 80 },
    { title: 'Payment Type', dataIndex: 'paymentType', width: 100 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => (
        <Badge variant={statusColors[s] || 'outline'}>{s}</Badge>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      width: 120,
      render: (s: string) => (
        <Badge variant={paymentStatusColors[s] || 'outline'}>{s}</Badge>
      ),
    },
    {
      title: t('admin.createdAt'),
      dataIndex: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: t('admin.actions'),
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: unknown, record: BearingOrder) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingOrder(record)}
          >
            <Eye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openStatusDialog(record)}
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
          <CardTitle className="text-xl">{t('admin.orders')}</CardTitle>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 size-4" />
            {t('admin.export')}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search order no. or customer..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={paymentStatus}
              onValueChange={(v) => {
                setPaymentStatus(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Payment</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table
            rowKey="id"
            columns={columns}
            dataSource={data?.items ?? []}
            loading={isLoading}
            scroll={{ x: 1200, y: 500 }}
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

      {/* Order Detail Dialog */}
      <Dialog
        open={!!viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order #{viewingOrder?.orderNo}</DialogTitle>
            <DialogDescription>
              {viewingOrder && new Date(viewingOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {viewingOrder && (
            <div className="space-y-6">
              {/* Status Badges */}
              <div className="flex gap-2">
                <Badge variant={statusColors[viewingOrder.status] || 'outline'}>
                  <Package className="mr-1 size-3" />
                  {viewingOrder.status}
                </Badge>
                <Badge variant={paymentStatusColors[viewingOrder.paymentStatus] || 'outline'}>
                  {viewingOrder.paymentStatus}
                </Badge>
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="mb-2 font-semibold">Customer Information</h4>
                <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name: </span>
                    {viewingOrder.customerName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="break-all">{viewingOrder.customerEmail}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    {viewingOrder.customerPhone || '-'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Company: </span>
                    {viewingOrder.customerCompany || '-'}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Country: </span>
                    {viewingOrder.country || '-'}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="mb-2 font-semibold">Items</h4>
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Product</th>
                        <th className="px-3 py-2 text-right">Qty</th>
                        <th className="px-3 py-2 text-right">Unit Price</th>
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingOrder.itemsJson.map((item: OrderItem, idx: number) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="px-3 py-2">{item.productName}</td>
                          <td className="px-3 py-2 text-right">{item.quantity}</td>
                          <td className="px-3 py-2 text-right">
                            {viewingOrder.currency} {item.unitPrice}
                          </td>
                          <td className="px-3 py-2 text-right font-medium">
                            {viewingOrder.currency} {item.totalPrice}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="ml-auto w-64 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{viewingOrder.currency} {viewingOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{viewingOrder.currency} {viewingOrder.shippingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{viewingOrder.currency} {viewingOrder.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-{viewingOrder.currency} {viewingOrder.discountAmount}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-1 font-semibold">
                  <span>Total</span>
                  <span>{viewingOrder.currency} {viewingOrder.totalAmount}</span>
                </div>
              </div>

              {/* Payments */}
              {viewingOrder.payments && viewingOrder.payments.length > 0 && (
                <div>
                  <h4 className="mb-2 font-semibold">Payment Records</h4>
                  <div className="space-y-2">
                    {viewingOrder.payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
                      >
                        <div>
                          <p className="font-medium">{payment.paymentMethod}</p>
                          <p className="text-xs text-muted-foreground">
                            {payment.paymentType} · {new Date(payment.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant={payment.status === 'success' ? 'default' : 'secondary'}>
                          {payment.amount} {payment.currency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div>
                <h4 className="mb-3 font-semibold">Status Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Created</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(viewingOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {(viewingOrder.status === 'processing' ||
                    viewingOrder.status === 'shipped' ||
                    viewingOrder.status === 'completed') && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Package className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Processing</p>
                      </div>
                    </div>
                  )}
                  {(viewingOrder.status === 'shipped' ||
                    viewingOrder.status === 'completed') && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Truck className="size-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Shipped</p>
                        {viewingOrder.trackingNumber && (
                          <p className="text-xs text-muted-foreground">
                            Tracking: {viewingOrder.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {viewingOrder.status === 'completed' && (
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                        <CheckCircle className="size-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {viewingOrder.notes && (
                <div>
                  <h4 className="mb-2 font-semibold">Notes</h4>
                  <p className="rounded-lg bg-muted p-3 text-sm">{viewingOrder.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => viewingOrder && openStatusDialog(viewingOrder)}
            >
              <Edit className="mr-2 size-4" />
              Update Status
            </Button>
            <Button onClick={() => setViewingOrder(null)}>{t('common.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Order #{editingOrder?.orderNo}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">New Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>
              <Textarea
                rows={3}
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Internal notes about this status change..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleStatusUpdate} disabled={updateMutation.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
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

export default OrdersManagePage;
