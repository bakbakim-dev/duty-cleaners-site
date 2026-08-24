import { CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface GiftCardDesign {
  id: string;
  name: string;
  icon: LucideIcon;
  gradient: string;
  bgPattern: string;
  description: string;
}

interface GiftCardDesignCardProps {
  design: GiftCardDesign;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const GiftCardDesignCard = ({ design, isSelected, onSelect }: GiftCardDesignCardProps) => {
  const IconComponent = design.icon;

  return (
    <button
      onClick={() => onSelect(design.id)}
      className={`relative group cursor-pointer transition-all duration-500 ease-out w-full ${
        isSelected ? "z-10" : ""
      }`}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`${design.bgPattern} ${design.gradient} rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-white shadow-md transition-all duration-500 ease-out ${
          isSelected
            ? "ring-4 ring-accent ring-offset-4 ring-offset-background shadow-2xl -translate-y-2 scale-[1.02]"
            : "group-hover:shadow-xl group-hover:-translate-y-2 group-hover:scale-[1.02]"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <IconComponent className="w-12 h-12 mb-3 transition-transform duration-500 group-hover:rotate-12" />
        <h3 className="text-xl font-bold">{design.name}</h3>
        <p className="text-sm text-white/80 mt-1 text-center px-2">Duty Cleaners Gift Card</p>

        {isSelected && (
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-accent-foreground" />
          </div>
        )}
      </div>

      <p
        className={`mt-3 text-sm text-center transition-colors duration-300 ${
          isSelected ? "text-accent font-medium" : "text-muted-foreground"
        }`}
      >
        {design.description}
      </p>
    </button>
  );
};

export default GiftCardDesignCard;
