import { useI18nStore } from "@client/src/store/useI18nStore";

const PrivacyPage = () => {
  const { t } = useI18nStore();

  const sections = [
    { title: t("privacy.section1Title"), content: t("privacy.section1Content") },
    { title: t("privacy.section2Title"), content: t("privacy.section2Content") },
    { title: t("privacy.section3Title"), content: t("privacy.section3Content") },
    { title: t("privacy.section4Title"), content: t("privacy.section4Content") },
    { title: t("privacy.section5Title"), content: t("privacy.section5Content") },
    { title: t("privacy.section6Title"), content: t("privacy.section6Content") },
    { title: t("privacy.section7Title"), content: t("privacy.section7Content") },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Banner */}
      <section className="bg-primary text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("privacy.title")}
          </h1>
          <p className="text-white/70 text-sm">{t("privacy.lastUpdated")}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card rounded-lg border border-border p-6 md:p-10 shadow-sm">
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-xl font-bold text-foreground mb-3">
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
