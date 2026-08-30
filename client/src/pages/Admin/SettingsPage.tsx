import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Settings as SettingsIcon,
  Globe,
  Building,
  Phone,
  Share2,
  Search,
  Edit,
  Save,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@client/src/components/ui/card';
import { Button } from '@client/src/components/ui/button';
import { Input } from '@client/src/components/ui/input';
import { Textarea } from '@client/src/components/ui/textarea';
import { Skeleton } from '@client/src/components/ui/skeleton';
import { useI18nStore } from '@client/src/store/useI18nStore';
import { bearingCmsApi, bearingAdminApi } from '@client/src/api';
import type { CmsSetting } from '@shared/api.interface';

interface SettingGroup {
  key: string;
  title: string;
  icon: typeof SettingsIcon;
  keys: string[];
}

const settingGroups: SettingGroup[] = [
  {
    key: 'site',
    title: 'Site Settings',
    icon: Globe,
    keys: ['siteName', 'siteSlogan', 'siteLogo'],
  },
  {
    key: 'company',
    title: 'Company Information',
    icon: Building,
    keys: ['companyName', 'companyAddress', 'companyAbout'],
  },
  {
    key: 'contact',
    title: 'Contact Information',
    icon: Phone,
    keys: ['contactEmail', 'contactPhone', 'contactWhatsApp'],
  },
  {
    key: 'social',
    title: 'Social Links',
    icon: Share2,
    keys: ['socialFacebook', 'socialTwitter', 'socialLinkedIn', 'socialYoutube'],
  },
  {
    key: 'seo',
    title: 'SEO Settings',
    icon: Search,
    keys: ['seoTitle', 'seoKeywords', 'seoDescription'],
  },
];

const defaultSettings: Record<string, string> = {
  siteName: 'BearingEx',
  siteSlogan: 'Premium Bearings for Global Industry',
  siteLogo: '',
  companyName: 'BearingEx Co., Ltd.',
  companyAddress: 'No.88 Industrial Zone, Shanghai, China',
  companyAbout: 'BearingEx is a professional bearing manufacturer with 20+ years of export experience.',
  contactEmail: 'sales@bearingex.com',
  contactPhone: '+86 21 8888 6666',
  contactWhatsApp: '+86 138 8888 6666',
  socialFacebook: '',
  socialTwitter: '',
  socialLinkedIn: '',
  socialYoutube: '',
  seoTitle: 'BearingEx | China Bearing Manufacturer & Supplier',
  seoKeywords: 'bearing manufacturer, bearing supplier, OEM bearing, wholesale bearing',
  seoDescription: 'Leading China bearing manufacturer with 20+ years export experience.',
};

const labelMap: Record<string, string> = {
  siteName: 'Site Name',
  siteSlogan: 'Site Slogan',
  siteLogo: 'Logo URL',
  companyName: 'Company Name',
  companyAddress: 'Company Address',
  companyAbout: 'Company About',
  contactEmail: 'Email',
  contactPhone: 'Phone',
  contactWhatsApp: 'WhatsApp',
  socialFacebook: 'Facebook URL',
  socialTwitter: 'Twitter URL',
  socialLinkedIn: 'LinkedIn URL',
  socialYoutube: 'YouTube URL',
  seoTitle: 'SEO Title',
  seoKeywords: 'SEO Keywords',
  seoDescription: 'SEO Description',
};

const SettingsPage = () => {
  const { t } = useI18nStore();
  const queryClient = useQueryClient();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const { data, isLoading } = useQuery<CmsSetting[]>({
    queryKey: ['cms-settings'],
    queryFn: bearingCmsApi.getCmsSettings,
  });

  const settingsMap: Record<string, string> = data
    ? data.reduce((acc: Record<string, string>, item: CmsSetting) => {
        acc[item.settingKey] = item.settingValue || '';
        return acc;
      }, {})
    : defaultSettings;

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      bearingAdminApi.updateCmsSetting(key, { settingValue: value }),
    onSuccess: () => {
      toast.success(t('common.success'));
      setEditingKey(null);
      queryClient.invalidateQueries({ queryKey: ['cms-settings'] });
    },
    onError: () => toast.error(t('common.error')),
  });

  const handleEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const handleSave = (key: string) => {
    updateMutation.mutate({ key, value: editValue });
  };

  const renderSettingItem = (key: string) => {
    const value = settingsMap[key] || '';
    const isEditing = editingKey === key;
    const isTextarea = key === 'companyAbout' || key === 'seoDescription' || key === 'seoKeywords';

    return (
      <div key={key} className="flex items-start gap-3 border-b border-border py-3 last:border-0">
        <div className="flex-1">
          <p className="text-sm font-medium">{labelMap[key] || key}</p>
          {isEditing ? (
            isTextarea ? (
              <Textarea
                className="mt-2"
                rows={3}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            ) : (
              <Input
                className="mt-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            )
          ) : (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {value || <em>Not set</em>}
            </p>
          )}
        </div>
        {isEditing ? (
          <div className="flex shrink-0 gap-1">
            <Button
              size="sm"
              onClick={() => handleSave(key)}
              disabled={updateMutation.isPending}
            >
              <Save className="mr-1 size-3" />
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditingKey(null)}>
              {t('common.cancel')}
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(key, value)}
          >
            <Edit className="size-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t('admin.settings')}</h1>
        <p className="text-sm text-muted-foreground">
          Manage your website configuration settings
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {settingGroups.map((group) => (
            <Card key={group.key}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                {group.keys.map((key) => (
                  <Skeleton key={key} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        settingGroups.map((group) => {
          const Icon = group.icon;
          return (
            <Card key={group.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="size-5 text-primary" />
                  {group.title}
                </CardTitle>
                <CardDescription>
                  Configure your {group.title.toLowerCase()} settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {group.keys.map((key) => renderSettingItem(key))}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default SettingsPage;
