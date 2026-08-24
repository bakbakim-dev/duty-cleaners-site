/**
 * "Sun disc" — a small hand-drawn morning-light mark used as the bullet for
 * marketing section eyebrows. Decorative only; never used inside the funnel,
 * forms, payment copy, or error/confirmation states.
 */
export default function SunDisc({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 14 14"
      className={`h-3.5 w-3.5 flex-shrink-0 ${className}`}
    >
      <path
        d="M7 2.4c2.5 0 4.5 2 4.6 4.5 0 2.5-2.1 4.7-4.6 4.6C4.5 11.4 2.5 9.4 2.4 7 2.4 4.5 4.4 2.4 7 2.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7 4.8c1.2 0 2.2 1 2.2 2.2S8.2 9.2 7 9.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
    </svg>
  );
}
