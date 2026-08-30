import { memo, useEffect, useRef, useState } from "react";
import { Image } from "@client/src/components/ui/image";
import { useI18nStore } from "@client/src/store/useI18nStore";
import { Factory, Package, Globe2, CheckCircle2 } from "lucide-react";

const STATS = [
  { icon: Factory, value: 5000000, suffix: "+", labelKey: "stat.capacity" },
  { icon: Package, value: 100, suffix: "+", labelKey: "stat.models" },
  { icon: Globe2, value: 30, suffix: "+", labelKey: "stat.countries" },
  { icon: CheckCircle2, value: 99.5, suffix: "%", labelKey: "stat.quality" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    let raf = 0;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(target * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return count;
}

function formatNumber(n: number, decimals = 0): string {
  if (decimals > 0) return n.toFixed(decimals);
  if (n >= 1000000) return (n / 1000000).toFixed(0) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return Math.round(n).toString();
}

interface StatItemProps {
  value: number;
  suffix: string;
  labelKey: string;
  icon: typeof Factory;
  start: boolean;
}

const StatItem = memo(function StatItem({
  value,
  suffix,
  labelKey,
  icon: Icon,
  start,
}: StatItemProps) {
  const { t } = useI18nStore();
  const decimals = value % 1 !== 0 ? 1 : 0;
  const count = useCountUp(value, 1800, start);

  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-bold text-foreground">
          {formatNumber(count, decimals)}
          <span className="text-secondary">{suffix}</span>
        </div>
        <div className="text-sm text-muted-foreground">{t(labelKey)}</div>
      </div>
    </div>
  );
});

interface FactorySectionProps {
  factoryImage: string;
}

const FactorySection = memo(function FactorySection({
  factoryImage,
}: FactorySectionProps) {
  const { t } = useI18nStore();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [startAnim, setStartAnim] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartAnim(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-20 bg-background"
      data-ai-section-type="card-stat"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative rounded-xl overflow-hidden shadow-lg order-2 lg:order-1">
            <Image
              src={factoryImage}
              alt="Factory"
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              {t("home.manufacturingLabel")}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mt-2 mb-5">
              {t("home.manufacturingTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {t("home.manufacturingDesc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {STATS.map((s) => (
                <StatItem
                  key={s.labelKey}
                  value={s.value}
                  suffix={s.suffix}
                  labelKey={s.labelKey}
                  icon={s.icon}
                  start={startAnim}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default FactorySection;
