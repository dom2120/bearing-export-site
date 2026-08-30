import { useI18nStore } from "@client/src/store/useI18nStore";
import { formatCurrency } from "@client/src/utils/i18n";
import type { LanguageCode } from "@client/src/i18n";
import { Image } from '@client/src/components/ui/image';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  exchangeRate?: number;
  displayCurrency: string;
  convertedTotal?: number;
}

const OrderSummary = ({
  items,
  subtotal,
  shippingFee,
  taxAmount,
  discountAmount,
  totalAmount,
  currency,
  exchangeRate,
  displayCurrency,
  convertedTotal,
}: OrderSummaryProps) => {
  const { t, currentLanguage } = useI18nStore();
  const lang = currentLanguage as LanguageCode;
  const curr = (displayCurrency || currency) as "USD" | "EUR" | "CNY";

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm sticky top-6">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">
          {t("checkout.orderSummary")}
        </h2>
      </div>

      {/* Items */}
      <div className="p-6 max-h-64 overflow-y-auto space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <Image
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded-md border border-border flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("checkout.quantity")}: {item.quantity}
              </p>
              <p className="text-sm font-semibold text-accent mt-1">
                {formatCurrency(item.unitPrice * item.quantity, curr, lang)}
              </p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            {t("checkout.cartIsEmpty")}
          </p>
        )}
      </div>

      {/* Totals */}
      <div className="p-6 space-y-3 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("checkout.subtotal")}</span>
          <span className="text-foreground font-medium">
            {formatCurrency(subtotal, curr, lang)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("checkout.shipping")}</span>
          <span className="text-foreground font-medium">
            {formatCurrency(shippingFee, curr, lang)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">{t("checkout.tax")}</span>
          <span className="text-foreground font-medium">
            {formatCurrency(taxAmount, curr, lang)}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("checkout.discount")}</span>
            <span className="text-green-600 font-medium">
              -{formatCurrency(discountAmount, curr, lang)}
            </span>
          </div>
        )}
        <div className="border-t border-border pt-3 mt-3">
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-bold text-foreground">{t("checkout.total")}</span>
            <span className="text-2xl font-bold text-accent">
              {formatCurrency(totalAmount, curr, lang)}
            </span>
          </div>
        </div>

        {exchangeRate && displayCurrency !== currency && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border flex justify-between">
            <span>{t("checkout.exchangeRate")}</span>
            <span className="font-mono">
              1 {currency} = {exchangeRate.toFixed(4)} {displayCurrency}
            </span>
          </div>
        )}

        {convertedTotal !== undefined && displayCurrency !== currency && (
          <div className="text-xs text-muted-foreground flex justify-between">
            <span>{currency} {t("checkout.total")}</span>
            <span className="font-medium">
              {formatCurrency(totalAmount / exchangeRate, currency as "USD" | "EUR" | "CNY", lang)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
