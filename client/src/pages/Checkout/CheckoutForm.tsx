import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { Button } from "@client/src/components/ui/button";
import { Input } from "@client/src/components/ui/input";
import { Textarea } from "@client/src/components/ui/textarea";
import { Checkbox } from "@client/src/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@client/src/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/src/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@client/src/components/ui/card";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Building2,
  Loader2,
  ChevronRight,
} from "lucide-react";

export const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  customerEmail: z.string().email("Invalid email"),
  customerPhone: z.string().optional(),
  customerCompany: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  shippingAddress: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  billingSame: z.boolean().default(true),
  billingAddress: z.string().optional(),
  billingCompany: z.string().optional(),
  taxId: z.string().optional(),
  paymentType: z.enum(["full", "deposit", "balance"]).default("full"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  currency: z.string().default("USD"),
  notes: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const COUNTRIES = [
  "United States", "China", "Germany", "Japan", "South Korea",
  "Thailand", "Vietnam", "Indonesia", "Malaysia", "Singapore",
  "Brazil", "Mexico", "Spain", "Italy", "France",
  "United Kingdom", "Canada", "Australia", "India", "Russia",
];

const CURRENCIES = [
  { code: "USD", label: "USD - US Dollar" },
  { code: "EUR", label: "EUR - Euro" },
  { code: "CNY", label: "CNY - Chinese Yuan" },
];

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void;
  isPending: boolean;
  exchangeRate: number;
  showSubmitButton?: boolean;
  defaultCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

const CheckoutForm = ({
  onSubmit,
  isPending,
  exchangeRate,
  showSubmitButton = true,
  defaultCurrency = "USD",
  onCurrencyChange,
}: CheckoutFormProps) => {
  const { t } = useI18nStore();
  const [showBilling, setShowBilling] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerCompany: "",
      country: "",
      shippingAddress: "",
      city: "",
      postalCode: "",
      billingSame: true,
      billingAddress: "",
      billingCompany: "",
      taxId: "",
      paymentType: "full",
      paymentMethod: "tt",
      currency: defaultCurrency,
      notes: "",
    },
  });

  const handleCurrencyChange = (value: string) => {
    form.setValue("currency", value);
    onCurrencyChange?.(value);
  };

  const paymentTypes = [
    { value: "full", label: t("checkout.fullPayment") },
    { value: "deposit", label: t("checkout.deposit") },
    { value: "balance", label: t("checkout.balancePayment") },
  ];

  const paymentMethods = [
    { value: "tt", label: t("checkout.wireTransfer"), icon: Building2 },
    { value: "credit", label: t("checkout.creditCard"), icon: CreditCard },
    { value: "paypal", label: t("checkout.paypal"), icon: CreditCard },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Customer Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.billingInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.fullName")} *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.email")} *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("contact.company")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.country")} *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Shipping Address Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.shippingInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="shippingAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.address")} *</FormLabel>
                  <FormControl>
                    <Textarea rows={2} {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("checkout.city")} *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("checkout.postalCode")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Info Collapsible */}
        <Card>
          <CardHeader
            className="cursor-pointer py-4"
            onClick={() => setShowBilling(!showBilling)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{t("checkout.invoiceInfo")}</CardTitle>
              {showBilling ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showBilling && (
            <CardContent className="space-y-4 pt-0">
              <FormField
                control={form.control}
                name="billingSame"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        {t("checkout.sameAsBilling")}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {!form.watch("billingSame") && (
                <>
                  <FormField
                    control={form.control}
                    name="billingCompany"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.companyName")}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.taxId")}</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("checkout.billingAddress")}</FormLabel>
                        <FormControl>
                          <Textarea rows={2} {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          )}
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.paymentMethod")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.currency")}</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      handleCurrencyChange(val);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full md:w-64">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {form.watch("currency") !== "USD" && (
                      <span>
                        {t("checkout.exchangeRate")}: 1 USD ={" "}
                        {exchangeRate.toFixed(4)} {form.watch("currency")}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.paymentType")}</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentTypes.map((pt) => (
                      <button
                        key={pt.value}
                        type="button"
                        onClick={() => field.onChange(pt.value)}
                        className={`p-3 rounded-md border text-sm text-center transition-colors ${
                          field.value === pt.value
                            ? "border-primary bg-primary/5 text-primary font-medium"
                            : "border-border hover:border-primary/40"
                        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isPending}
                      >
                        {pt.label}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("checkout.paymentMethod")}</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((pm) => (
                      <button
                        key={pm.value}
                        type="button"
                        onClick={() => field.onChange(pm.value)}
                        className={`p-4 rounded-md border flex flex-col items-center gap-2 transition-colors ${
                          field.value === pm.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40"
                        } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isPending}
                      >
                        <pm.icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{pm.label}</span>
                      </button>
                    ))}
                  </div>
                  <FormDescription className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ {t("checkout.paymentMethodNote")}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Order Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("checkout.orderNotes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder={t("checkout.orderNotesPlaceholder")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {showSubmitButton && (
          <Button
            type="submit"
            className="w-full h-12 bg-accent hover:bg-accent/90 text-white border-0 text-base"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              <>
                {t("checkout.placeOrder")}
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default CheckoutForm;
