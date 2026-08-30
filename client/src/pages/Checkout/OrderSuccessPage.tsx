import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { useQuery } from "@tanstack/react-query";
import { bearingOrdersApi } from "@client/src/api";
import { formatCurrency } from "@client/src/utils/i18n";
import { Button } from "@client/src/components/ui/button";
import {
  CheckCircle,
  Package,
  CreditCard,
  Mail,
  ShoppingBag,
  FileText,
} from "lucide-react";

const OrderSuccessPage = () => {
  const { t, currentLanguage } = useI18nStore();
  const [searchParams] = useSearchParams();
  const orderNo = searchParams.get("orderNo") || "";
  const [displayOrder, setDisplayOrder] = useState<{
    orderNo: string;
    totalAmount: number;
    currency: string;
    paymentStatus: string;
    customerEmail: string;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderNo],
    queryFn: () => bearingOrdersApi.getOrderByOrderNo(orderNo),
    enabled: !!orderNo,
    retry: 1,
  });

  useEffect(() => {
    if (data) {
      setDisplayOrder(data);
    }
  }, [data]);

  // Fallback demo data when no order number
  useEffect(() => {
    if (!orderNo) {
      setDisplayOrder({
        orderNo: "BRG-" + Math.floor(Math.random() * 100000).toString().padStart(6, "0"),
        totalAmount: 1250,
        currency: "USD",
        paymentStatus: "pending",
        customerEmail: "customer@example.com",
      });
    }
  }, [orderNo]);

  return (
    <div className="bg-muted/30 min-h-screen py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 md:p-10 text-white text-center">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6 backdrop-blur">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {t("checkout.orderSuccessTitle")}
            </h1>
            <p className="text-white/80">{t("checkout.orderSuccessDesc")}</p>
          </div>

          {/* Order Details */}
          <div className="p-6 md:p-8 space-y-6">
            {isLoading && orderNo ? (
              <div className="text-center py-8 text-muted-foreground">
                {t("common.loading")}...
              </div>
            ) : displayOrder ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("checkout.orderNoLabel")}
                      </span>
                    </div>
                    <p className="font-mono font-semibold text-foreground">
                      {displayOrder.orderNo}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center text-accent">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("checkout.paymentStatusLabel")}
                      </span>
                    </div>
                    <p
                      className={`font-semibold ${
                        displayOrder.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-amber-600"
                      }`}
                    >
                      {displayOrder.paymentStatus === "paid"
                        ? t("checkout.paymentPaid")
                        : t("checkout.paymentPending")}
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg sm:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {t("checkout.orderAmountLabel")}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-accent">
                      {formatCurrency(
                        displayOrder.totalAmount,
                        displayOrder.currency as "USD" | "EUR" | "CNY",
                        currentLanguage
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    {t("checkout.emailNote")}
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {t("common.error")}: Order not found
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Link to="/products" className="flex-1">
                <Button variant="outline" className="w-full h-11">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  {t("checkout.continueShopping")}
                </Button>
              </Link>
              <Link to={`/orders`} className="flex-1">
                <Button className="w-full h-11 bg-accent hover:bg-accent/90 text-white border-0">
                  {t("checkout.viewOrderDetails")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
