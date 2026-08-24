import type { LucideIcon } from "lucide-react";

interface HowItWorksStepProps {
  icon: LucideIcon;
  step: string;
  title: string;
  description: string;
}

const HowItWorksStep = ({ icon: Icon, step, title, description }: HowItWorksStepProps) => {
  return (
    <div className="text-center group" style={{ perspective: "1000px" }}>
      <div
        className="transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="w-14 h-14 bg-accent/15 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
          <Icon className="w-7 h-7 text-accent" />
        </div>
        <span className="text-xs font-bold text-accent uppercase tracking-wider">Step {step}</span>
        <h4 className="font-semibold mt-1 mb-2">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default HowItWorksStep;
