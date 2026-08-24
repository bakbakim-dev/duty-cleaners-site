import { useEffect, useRef, useState } from "react";
import { Award, Home, Star, UserCheck, type LucideIcon } from "lucide-react";

interface CityTrustStatsProps {
  city: string;
  homesCleaned: string;
}

function useInViewOnce<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);

  return value;
}

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

function StatCell({
  icon: Icon,
  value,
  label,
  active,
  bordered,
}: Stat & { active: boolean; bordered: boolean }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const parsed = match ? parseInt(match[2].replace(/,/g, ""), 10) : null;
  // Small numbers (e.g. "<5%") have nothing to animate and read as wrong
  // values mid-count — show them verbatim.
  const target = parsed !== null && parsed >= 10 ? parsed : null;
  const counted = useCountUp(target ?? 0, active && target !== null);
  const display =
    match && target !== null
      ? `${match[1]}${counted.toLocaleString("en-CA")}${match[3]}`
      : value;


  return (
    <div
      className={`flex flex-col items-center gap-2 px-4 text-center ${bordered ? "md:border-l md:border-brand-navy-foreground/20" : ""}`}
    >
      <Icon className="h-5 w-5 text-brand-gold" aria-hidden="true" />
      <dd className="order-1 text-3xl font-bold tracking-tight text-brand-navy-foreground md:text-4xl">
        {display}
      </dd>
      <dt className="order-2 text-sm text-brand-navy-foreground/85">{label}</dt>
    </div>
  );
}

export default function CityTrustStats({ city, homesCleaned }: CityTrustStatsProps) {
  const { ref, visible } = useInViewOnce<HTMLDListElement>();

  const stats: Stat[] = [
    { icon: Award, value: "10+", label: "Years of service" },
    { icon: Home, value: homesCleaned, label: `${city} homes cleaned` },
    { icon: Star, value: "Five-Star", label: "Rated by local homeowners" },
    { icon: UserCheck, value: "<5%", label: "Of applicants accepted" },
  ];

  return (
    <dl
      ref={ref}
      className="mx-auto mb-12 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4"
      aria-label={`${city} cleaning track record`}
    >
      {stats.map((stat, index) => (
        <StatCell key={stat.label} {...stat} active={visible} bordered={index > 0} />
      ))}
    </dl>
  );
}
