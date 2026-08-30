import { Link } from "react-router-dom";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { Button } from "@client/src/components/ui/button";
import {
  Factory,
  Award,
  Wrench,
  Package,
  ShieldCheck,
  Zap,
  Palette,
  Timer,
  ChevronRight,
} from "lucide-react";
import { Image } from '@client/src/components/ui/image';

const FACTORY_IMAGES = {
  panoramic:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7tgwcdq_ve_miaoda",
  automated:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadkseagq4qei_ve_miaoda",
  quality:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7ryikkg_ve_miaoda",
  warehouse:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7mw6wdo_ve_miaoda",
  team:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7vrqsgq_ve_miaoda",
  certificate:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksebgjfcci_ve_miaoda",
  oem:
    "/spark/app/app_17cztwhbg7n/runtime/api/v1/storage/object/bucket_aadksebuyegaq_static/static%2Faadksd7rxbqei_ve_miaoda",
};

const AboutPage = () => {
  const { t } = useI18nStore();

  const milestones = [
    { year: t("about.milestone1Year"), title: t("about.milestone1Title"), desc: t("about.milestone1Desc") },
    { year: t("about.milestone2Year"), title: t("about.milestone2Title"), desc: t("about.milestone2Desc") },
    { year: t("about.milestone3Year"), title: t("about.milestone3Title"), desc: t("about.milestone3Desc") },
    { year: t("about.milestone4Year"), title: t("about.milestone4Title"), desc: t("about.milestone4Desc") },
    { year: t("about.milestone5Year"), title: t("about.milestone5Title"), desc: t("about.milestone5Desc") },
  ];

  const factoryCards = [
    { image: FACTORY_IMAGES.automated, title: t("about.workshopAutomated"), icon: Factory },
    { image: FACTORY_IMAGES.quality, title: t("about.workshopQc"), icon: ShieldCheck },
    { image: FACTORY_IMAGES.warehouse, title: t("about.workshopWarehouse"), icon: Package },
    { image: FACTORY_IMAGES.panoramic, title: t("about.workshopAssembly"), icon: Wrench },
  ];

  const certifications = [
    t("about.certIso9001"),
    t("about.certIatf16949"),
    t("about.certCe"),
    t("about.certRohs"),
  ];

  const oemServices = [
    { title: t("about.customDesignTitle"), desc: t("about.customDesignDesc"), icon: Palette },
    { title: t("about.privateLabelTitle"), desc: t("about.privateLabelDesc"), icon: Award },
    { title: t("about.qcServiceTitle"), desc: t("about.qcServiceDesc"), icon: ShieldCheck },
    { title: t("about.fastDeliveryTitle"), desc: t("about.fastDeliveryDesc"), icon: Zap },
  ];

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section
        className="relative h-[320px] md:h-[400px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(10, 75, 138, 0.85), rgba(10, 75, 138, 0.7)), url(${FACTORY_IMAGES.panoramic})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("about.bannerTitle")}</h1>
          <nav className="flex items-center justify-center gap-2 text-sm text-white/80">
            <Link to="/" className="hover:text-white transition-colors">
              {t("about.breadcrumbHome")}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{t("about.bannerTitle")}</span>
          </nav>
        </div>
      </section>

      {/* Company Profile */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                {t("about.companyProfile")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-foreground">
                {t("about.aboutUs")}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base">
                {t("about.companyIntro")}
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">20+</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("home.exportExperience")}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">30+</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("about.milestone5Title")}</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">4</p>
                  <p className="text-sm text-muted-foreground mt-1">{t("about.certifications")}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src={FACTORY_IMAGES.team}
                alt="Team"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-accent text-white p-6 rounded-lg shadow-lg hidden md:block">
                <p className="text-3xl font-bold">ISO 9001</p>
                <p className="text-sm opacity-90">{t("about.certIso9001")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones / Timeline */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {t("about.milestones")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
              {t("about.ourHistory")}
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2" />
            <div className="space-y-10">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 pl-12 md:pl-0 md:text-right">
                    <div className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition-shadow">
                      <span className="inline-block text-accent font-bold text-2xl">
                        {m.year}
                      </span>
                      <h3 className="text-lg font-semibold mt-2 mb-2 text-foreground">
                        {m.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 top-6 w-4 h-4 -translate-x-1/2 bg-accent rounded-full border-4 border-white shadow-md z-10" />
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Factory Strength */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {t("about.factoryTour")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
              {t("about.factoryStrength")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              {t("about.factoryStrengthDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {factoryCards.map((card, idx) => (
              <div
                key={idx}
                className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                    <card.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">
                {t("about.certifications")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6 text-foreground">
                {t("about.certificationsTitle")}
              </h2>
              <p className="text-muted-foreground mb-8">
                {t("about.certificationsDesc")}
              </p>
              <div className="space-y-4">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <span className="text-foreground font-medium">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 md:order-2">
              <Image
                src={FACTORY_IMAGES.certificate}
                alt="Certificates"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OEM / ODM */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">
              {t("about.oemOdmService")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">
              {t("about.oemOdmTitle")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              {t("about.oemOdmDesc")}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {oemServices.map((svc, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                      <svc.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{svc.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Image
                src={FACTORY_IMAGES.oem}
                alt="OEM Customization"
                className="rounded-lg shadow-xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("about.ctaTitle")}</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            {t("about.ctaDesc")}
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white border-0"
            >
              {t("about.ctaButton")}
              <Timer className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
