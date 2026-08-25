import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";

const DISMISS_KEY = "dc-announcement-dismissed";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) !== "1";
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // sessionStorage unavailable — dismissal simply won't persist
    }
    setVisible(false);
  };

  return (
    <aside aria-label="Site announcement" className="bg-brand-navy text-brand-navy-foreground">
      <div className="container mx-auto flex items-center gap-3 px-4 py-2">
        <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden="true" />
        <p className="flex-1 text-center text-sm text-white/85">
          Price first. See your cleaning price before you choose a time.
          <Link
            to="/reviews"
            className="ml-2 inline-flex min-h-[44px] items-center font-semibold text-accent-on-dark underline-offset-2 transition-colors hover:underline"
          >
            Read reviews →
          </Link>
        </p>


        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          // text-muted-foreground and foreground are both near-black tokens meant
          // for light surfaces. On this navy bar they measured 2.21:1, dropping to
          // 1.18:1 on hover — so the bar's only escape hatch faded out as the user
          // reached for it. White matches the bar's own text scale and gets
          // brighter on hover rather than dimmer.
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-white/80 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
