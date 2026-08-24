import { CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface InfoItem {
  text: string;
}

interface InfoCardProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  items: InfoItem[];
  variant?: "default" | "highlight";
  footerLink?: { text: string; href: string };
  footerText?: string;
}

const InfoCard = ({
  icon: Icon,
  iconColor = "text-accent",
  title,
  items,
  variant = "default",
  footerLink,
  footerText,
}: InfoCardProps) => {
  const isHighlight = variant === "highlight";
  const checkColor = isHighlight ? "text-accent" : iconColor;

  return (
    <div
      className={`rounded-2xl p-6 group transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl ${
        isHighlight
          ? "bg-accent/10 border-2 border-accent/30"
          : "bg-card shadow-lg border border-border/50"
      }`}
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
    >
      <div className={`w-12 h-12 ${isHighlight ? "bg-accent/20" : "bg-accent/10"} rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-6`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>

      {items.length > 0 && (
        <ul className="space-y-3">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 ${checkColor} mt-0.5 flex-shrink-0`} />
              <span className="text-muted-foreground text-sm leading-relaxed">{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {footerText && (
        <p className="text-foreground text-sm leading-relaxed mt-4">{footerText}</p>
      )}

      {footerLink && (
        <a href={footerLink.href} className="inline-flex min-h-[44px] items-center font-medium text-sm text-brand-navy underline underline-offset-4 mt-4">
          {footerLink.text} →
        </a>
      )}
    </div>
  );
};

export default InfoCard;
