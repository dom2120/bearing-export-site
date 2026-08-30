import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Search, Eye, Reply, Trash2, Download, Mail } from 'lucide-react';
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
import { bearingInquiriesApi } from '@client/src/api';
import type { BearingInquiry, InquiryListResponse } from '@shared/api.interface';

const statusColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'secondary',
  processing: 'default',
  replied: 'default',
  closed: 'outline',
  cancelled: 'destructive',
};

const InquiriesManagePage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [status, setStatus] = useState('');
  const [keyword, setKeyword] = useState('');
  const [viewingInquiry, setViewingInquiry] = useState<BearingInquiry | null>(null);
  const [replyingInquiry, setReplyingInquiry] = useState<BearingInquiry | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyStatus, setReplyStatus] = useState('replied');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useQuery<InquiryListResponse>({
    queryKey: ['admin-inquiries', page, pageSize, status, keyword],
    queryFn: () =>
      bearingInquiriesApi.getInquiryList({
        page,
        pageSize,
        status: status || undefined,
        keyword: keyword || undefined,
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status: s, replyContent: rc }: { id: string; status?: string; replyContent?: string }) =>
      bearingInquiriesApi.updateInquiry(id, { status: s, replyContent: rc }),
    onSuccess: () => {
      toast.success(t('common.success'));
      setReplyingInquiry(null);
      setViewingInquiry(null);
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const deleteMutation = useMutation({
    mutationFn: bearingInquiriesApi.deleteInquiry,
    onSuccess: () => {
      toast.success(t('common.success'));
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleExport = async () => {
    try {
      const blob = await bearingInquiriesApi.exportInquiriesCsv({
        status: status || undefined,
        keyword: keyword || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleReply = () => {
    if (!replyingInquiry) return;
    updateMutation.mutate({
      id: replyingInquiry.id,
      status: replyStatus,
      replyContent,
    });
  };

  const openReply = (inquiry: BearingInquiry) => {
    setReplyingInquiry(inquiry);
    setReplyContent(inquiry.replyContent || '');
    setReplyStatus(inquiry.status === 'pending' ? 'replied' : inquiry.status);
  };

  const columns: TableProps<BearingInquiry>['columns'] = [
    { title: 'Name', dataIndex: 'fullName', width: 120 },
    { title: 'Email', dataIndex: 'email', width: 180 },
    { title: 'Company', dataIndex: 'company', width: 140 },
    { title: 'Country', dataIndex: 'country', width: 100 },
    { title: 'Product', dataIndex: 'productName', width: 150 },
    { title: 'Qty', dataIndex: 'quantity', width: 70 },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (s: string) => (
        <Badge variant={statusColors[s] || 'outline'}>{s}</Badge>
      ),
    },
    {
      title: 'Submitted At',
      dataIndex: 'createdAt',
      width: 160,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: t('admin.actions'),
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_: unknown, record: BearingInquiry) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewingInquiry(record)}
          >
            <Eye className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openReply(record)}>
            <Reply className="size-4" />
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
          <CardTitle className="text-xl">{t('admin.inquiries')}</CardTitle>
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
                <SelectItem value="replied">Replied</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
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

      {/* View Detail Dialog */}
      <Dialog
        open={!!viewingInquiry}
        onOpenChange={(open) => !open && setViewingInquiry(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>
              Submitted on {viewingInquiry && new Date(viewingInquiry.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {viewingInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Name</p>
                  <p>{viewingInquiry.fullName}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Email</p>
                  <p className="break-all">{viewingInquiry.email}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Company</p>
                  <p>{viewingInquiry.company || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Country</p>
                  <p>{viewingInquiry.country || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Product</p>
                  <p>{viewingInquiry.productName || '-'}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Quantity</p>
                  <p>{viewingInquiry.quantity || '-'}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-medium text-muted-foreground">Status</p>
                  <Badge variant={statusColors[viewingInquiry.status] || 'outline'}>
                    {viewingInquiry.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Message</p>
                <p className="mt-1 whitespace-pre-wrap rounded-md bg-muted p-3 text-sm">
                  {viewingInquiry.message || '-'}
                </p>
              </div>
              {viewingInquiry.replyContent && (
                <div>
                  <p className="font-medium text-muted-foreground">Reply</p>
                  <p className="mt-1 whitespace-pre-wrap rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
                    {viewingInquiry.replyContent}
                  </p>
                  {viewingInquiry.repliedAt && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Replied at {new Date(viewingInquiry.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => viewingInquiry && openReply(viewingInquiry)}
            >
              <Mail className="mr-2 size-4" />
              Reply
            </Button>
            <Button onClick={() => setViewingInquiry(null)}>{t('common.close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog
        open={!!replyingInquiry}
        onOpenChange={(open) => !open && setReplyingInquiry(null)}
      >
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Reply Inquiry</DialogTitle>
            <DialogDescription>
              {replyingInquiry?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <Select value={replyStatus} onValueChange={setReplyStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="replied">Replied</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Reply Content</label>
              <Textarea
                rows={6}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyingInquiry(null)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleReply} disabled={updateMutation.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Inquiry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this inquiry? This action cannot be undone.
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

export default InquiriesManagePage;
