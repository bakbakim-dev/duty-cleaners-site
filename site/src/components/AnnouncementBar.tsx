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
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </aside>
  );
}
