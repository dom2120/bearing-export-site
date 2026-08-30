import { memo } from "react";
import { Link } from "react-router-dom";
import { Globe, Award, Wrench, ArrowRight } from "lucide-react";
import { useI18nStore } from "@client/src/store/useI18nStore";

const ADVANTAGES = [
  {
    icon: Globe,
    titleKey: "home.exportExperience",
    descKey: "home.exportExperienceDesc",
  },
  {
    icon: Award,
    titleKey: "home.internationalCert",
    descKey: "home.internationalCertDesc",
  },
  {
    icon: Wrench,
    titleKey: "home.oemOdm",
    descKey: "home.oemOdmDesc",
  },
];

const AdvantagesSection = memo(function AdvantagesSection() {
  const { t } = useI18nStore();

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {t("home.ourAdvantages")}
          </h2>
          <div className="w-16 h-1 bg-secondary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {ADVANTAGES.map((item: (typeof ADVANTAGES)[number], idx: number) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 md:p-8 text-center shadow-xs hover:shadow-md transition-shadow group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-secondary/10 transition-colors">
                  <Icon className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t(item.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default AdvantagesSection;
