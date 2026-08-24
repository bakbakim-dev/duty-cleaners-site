import { Check } from "lucide-react";
import { activeRiskReversal } from "@/data/proof";

/**
 * Risk-reversal lines shown directly beside a submit/continue button.
 * Reads from src/data/proof.ts so a line the owner cannot stand behind is
 * switched off rather than edited out of markup.
 */
export default function RiskReversalRow({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  const lines = activeRiskReversal();
  if (lines.length === 0) return null;

  const text = tone === "dark" ? "text-fine-print-on-dark" : "text-fine-print";

  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-1.5 text-base ${text} ${className}`}>
      {lines.map((line) => (
        <li key={line.id} className="flex items-center gap-1.5">
          <Check className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
          {line.label}
        </li>
      ))}
    </ul>
  );
}
