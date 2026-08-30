import { useState } from "react";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bearingInquiriesApi } from "@client/src/api";
import { Button } from "@client/src/components/ui/button";
import { Input } from "@client/src/components/ui/input";
import { Textarea } from "@client/src/components/ui/textarea";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@client/src/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@client/src/components/ui/accordion";
import {
  MapPin,
  Mail,
  Phone,
  Upload,
  FileText,
  X,
  MessageCircle,
  Clock,
  CheckCircle,
} from "lucide-react";
import { logger } from '@/api';

const COUNTRIES = [
  "United States", "China", "Germany", "Japan", "South Korea",
  "Thailand", "Vietnam", "Indonesia", "Malaysia", "Singapore",
  "Brazil", "Mexico", "Spain", "Italy", "France",
  "United Kingdom", "Canada", "Australia", "India", "Russia",
];

const inquirySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  attachmentUrl: z.string().optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

const ContactPage = () => {
  const { t, currentLanguage } = useI18nStore();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      company: "",
      country: "",
      productName: "",
      quantity: "",
      message: "",
      attachmentUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: InquiryFormValues) =>
      bearingInquiriesApi.createInquiry({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone || undefined,
        company: values.company || undefined,
        country: values.country || undefined,
        productName: values.productName || undefined,
        quantity: values.quantity ? Number(values.quantity) : undefined,
        message: values.message || undefined,
        source: "website",
        language: currentLanguage,
      }),
    onError: (error) => {
      logger.error("Submit inquiry error", error);
    },
  });

  const onSubmit = (values: InquiryFormValues) => {
    mutation.mutate(values);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["application/pdf", "image/", "image/jpeg", "image/png"];
      const isValid = validTypes.some((type) => file.type.startsWith(type)) ||
        file.name.toLowerCase().endsWith(".dwg");
      if (isValid && file.size < 10 * 1024 * 1024) {
        setUploadedFile(file);
      }
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const faqs = [
    { q: t("contact.faq1Q"), a: t("contact.faq1A") },
    { q: t("contact.faq2Q"), a: t("contact.faq2A") },
    { q: t("contact.faq3Q"), a: t("contact.faq3A") },
    { q: t("contact.faq4Q"), a: t("contact.faq4A") },
    { q: t("contact.faq5Q"), a: t("contact.faq5A") },
  ];

  if (mutation.isSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {t("contact.thankYou")}
          </h2>
          <p className="text-muted-foreground mb-8">{t("contact.thankYouDesc")}</p>
          <Button onClick={() => mutation.reset()} variant="outline">
            {t("contact.submitInquiry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="bg-primary text-white py-20 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("contact.contactUs")}
          </h1>
          <p className="text-white/80 text-lg">{t("contact.getInTouchDesc")}</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-10">
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("contact.address")}</h3>
                <p className="text-muted-foreground text-sm">{t("contact.addressValue")}</p>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("contact.salesEmail")}</h3>
                <p className="text-muted-foreground text-sm">{t("contact.salesEmailValue")}</p>
              </div>
            </div>
            <div className="bg-card rounded-lg shadow-lg p-6 border border-border flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{t("contact.phoneNumber")}</h3>
                <p className="text-muted-foreground text-sm">{t("contact.phoneValue")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inquiry Form */}
            <div className="lg:col-span-3 bg-card rounded-lg border border-border p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {t("contact.sendMessage")}
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                {t("contact.getInTouchDesc")}
              </p>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.fullName")} *</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={mutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.email")} *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} disabled={mutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.phone")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={mutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.company")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={mutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.country")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={mutation.isPending}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("contact.productName")}</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={mutation.isPending} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem className="md:w-1/2">
                        <FormLabel>{t("contact.quantity")}</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} disabled={mutation.isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.message")} *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder={t("contact.message")}
                            {...field}
                            disabled={mutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      {t("contact.uploadDrawing")}
                    </label>
                    {!uploadedFile ? (
                      <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload PDF / DWG / Image (max 10MB)
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.dwg,image/*"
                          onChange={handleFileChange}
                          disabled={mutation.isPending}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="text-sm flex-1 truncate">{uploadedFile.name}</span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                          disabled={mutation.isPending}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white border-0 h-11 text-base"
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? t("common.loading") : t("contact.submitInquiry")}
                  </Button>
                  {mutation.isError && (
                    <p className="text-destructive text-sm text-center">
                      {t("common.error")}
                    </p>
                  )}
                </form>
              </Form>
            </div>

            {/* Side Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                <div className="aspect-video bg-muted relative flex items-center justify-center">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d131332.748859348!2d121.374674!3d31.23039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35b27040b1f53c33%3A0x295129423c364a1!2sShanghai%2C%20China!5e0!3m2!1sen!2sus!4v1690000000000"
                    title="Map"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-4 border-t border-border flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{t("contact.addressValue")}</span>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-green-600 rounded-lg p-6 text-white shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{t("contact.whatsappChat")}</h3>
                    <p className="text-sm text-white/80 mb-3">{t("contact.whatsappValue")}</p>
                    <a
                      href={`https://wa.me/8613888886666`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-md font-medium text-sm hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("contact.chatWhatsApp")}
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Reply Card */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {t("contact.quickReplyTitle")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.quickReplyDesc")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {t("contact.workingHours")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("contact.workingHoursValue")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
              {t("contact.faqTitle")}
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx}`}
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
              >
                <AccordionTrigger className="py-4 text-left font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4 text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
