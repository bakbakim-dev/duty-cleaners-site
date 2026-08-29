import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { Link } from "react-router-dom";

interface RecurringDiscountCardProps {
  percentage: string;
  title: string;
  savings?: string;
  isPopular?: boolean;
}

const RecurringDiscountCard = ({ percentage, title, savings, isPopular = false }: RecurringDiscountCardProps) => {
  return (
    <div className="group" style={{ perspective: "1000px" }}>
      <div
        className={`relative bg-white/5 backdrop-blur-sm rounded-xl border transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02] p-8 text-center ${
          isPopular ? "border-accent/40 ring-1 ring-accent/20" : "border-white/10"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-4 py-1 rounded-full">
            Most Popular
          </div>
        )}
        <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
          <Percent className="w-6 h-6 text-brand-gold" />
        </div>
        <div className="text-5xl font-bold text-brand-gold mb-1">{percentage}</div>
        <div className="text-sm text-white/80 mb-3 uppercase tracking-wider font-semibold">OFF</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        {savings && <p className="text-white/80 text-sm mb-6">{savings}</p>}
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md hover:shadow-lg transition-all"
          asChild
        >
          <Link to="/contact-us/">Get Started</Link>
        </Button>
      </div>
    </div>
  );
};

export default RecurringDiscountCard;
