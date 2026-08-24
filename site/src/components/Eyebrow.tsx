import SunDisc from "@/components/SunDisc";

/**
 * Marketing section eyebrow: sun-disc mark + letter-spaced label.
 * Marketing surfaces only — never inside the quote funnel or forms.
 */
export default function Eyebrow({
  children,
  className = "",
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-accent ${
        align === "center" ? "justify-center" : ""
      } ${className}`}
    >
      <SunDisc />
      {children}
    </span>
  );
}
