import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bearingOrdersApi } from "@client/src/api";
import { Loader2 } from "lucide-react";
import { logger } from '@/api';
import CheckoutForm, { type CheckoutFormValues } from "./CheckoutForm";
import OrderSummary from "./OrderSummary";

const DEMO_IMAGE = "https://picsum.photos/seed/bearing-demo/200/200";

const CheckoutPage = () => {
  const { t } = useI18nStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const currentStep = 2;

  const demoItems = useMemo(
    () => [
      {
        id: searchParams.get("productId") || "demo-1",
        name: searchParams.get("productName") || "Deep Groove Ball Bearing 6205",
        image: DEMO_IMAGE,
        quantity: Number(searchParams.get("quantity")) || 100,
        unitPrice: Number(searchParams.get("price")) || 12.5,
      },
    ],
    [searchParams]
  );

  const mutation = useMutation({
    mutationFn: (values: CheckoutFormValues) => {
      const baseSubtotal = demoItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
      const shippingFee = baseSubtotal * 0.05;
      return bearingOrdersApi.createOrder({
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerCompany: values.customerCompany,
        country: values.country,
        shippingAddress:
          values.shippingAddress +
          ", " +
          values.city +
          " " +
          (values.postalCode || ""),
        billingAddress: values.billingSame ? undefined : values.billingAddress,
        invoiceInfo:
          values.billingCompany || values.taxId
            ? JSON.stringify({
                company: values.billingCompany,
                taxId: values.taxId,
              })
            : undefined,
        items: demoItems.map((item) => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
        })),
        currency: values.currency,
        paymentType: values.paymentType,
        shippingFee,
        notes: values.notes,
      });
    },
    onSuccess: (data) => {
      navigate(`/order-success?orderNo=${data.orderNo}`);
    },
    onError: (error) => {
      logger.error("Create order error", error);
    },
  });

  const { data: rateData } = useQuery({
    queryKey: ["exchangeRate", "USD", selectedCurrency],
    queryFn: () => bearingOrdersApi.getExchangeRate("USD", selectedCurrency),
    enabled: selectedCurrency !== "USD",
    staleTime: 5 * 60 * 1000,
  });

  const exchangeRate = rateData?.rates?.[selectedCurrency] || 1;

  const baseSubtotal = demoItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const shippingFee = baseSubtotal * 0.05;
  const taxAmount = 0;
  const discountAmount = 0;
  const baseTotal = baseSubtotal + shippingFee + taxAmount - discountAmount;

  const steps = [
    { id: 1, label: t("checkout.stepCart") },
    { id: 2, label: t("checkout.stepCustomer") },
    { id: 3, label: t("checkout.stepPayment") },
  ];

  const handleSubmit = (values: CheckoutFormValues) => {
    mutation.mutate(values);
  };

  const displaySubtotal = baseSubtotal * (selectedCurrency === "USD" ? 1 : exchangeRate);
  const displayShipping = shippingFee * (selectedCurrency === "USD" ? 1 : exchangeRate);
  const displayTax = taxAmount * (selectedCurrency === "USD" ? 1 : exchangeRate);
  const displayDiscount = discountAmount * (selectedCurrency === "USD" ? 1 : exchangeRate);
  const displayTotal = baseTotal * (selectedCurrency === "USD" ? 1 : exchangeRate);

  return (
    <div className="bg-muted/30 min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Step Indicator */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    {step.id}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      currentStep >= step.id
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`w-12 md:w-24 h-0.5 mx-2 -mt-6 ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handleSubmit}
              isPending={mutation.isPending}
              exchangeRate={exchangeRate}
              showSubmitButton={false}
              defaultCurrency={selectedCurrency}
              onCurrencyChange={setSelectedCurrency}
            />
          </div>

          {/* Right: Order Summary */}
          <div className="hidden lg:block">
            <OrderSummary
              items={demoItems}
              subtotal={displaySubtotal}
              shippingFee={displayShipping}
              taxAmount={displayTax}
              discountAmount={displayDiscount}
              totalAmount={displayTotal}
              currency="USD"
              displayCurrency={selectedCurrency}
              exchangeRate={selectedCurrency !== "USD" ? exchangeRate : undefined}
            />
            <div className="mt-4">
              <button
                type="button"
                onClick={() => {
                  const formEl = document.querySelector("form");
                  if (formEl) formEl.requestSubmit();
                }}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-white rounded-md font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("checkout.placeOrder")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
