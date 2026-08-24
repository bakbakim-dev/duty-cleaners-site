import type { LucideIcon } from "lucide-react";

interface PricingFactorCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PricingFactorCard = ({ icon: Icon, title, description }: PricingFactorCardProps) => {
  return (
    <div className="group" style={{ perspective: "1000px" }}>
      <div
        className="bg-card rounded-xl border border-border/50 shadow-sm p-6 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="w-11 h-11 bg-accent/10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-500 group-hover:rotate-6">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default PricingFactorCard;
