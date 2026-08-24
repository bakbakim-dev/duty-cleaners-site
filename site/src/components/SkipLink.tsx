/**
 * "Skip to content" — the first focusable element on every page.
 *
 * Most pages expose a <main> landmark; a few older ones don't yet, so the
 * click handler falls back to the first <h1>. Either way the target gets a
 * programmatic focus so screen readers announce the content, not the nav.
 */
export default function SkipLink() {
  const focusMain = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const target =
      document.getElementById("main-content") ??
      document.querySelector("main") ??
      document.querySelector("h1");

    if (!target) return;
    event.preventDefault();

    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    (target as HTMLElement).focus({ preventScroll: false });
    target.scrollIntoView({ block: "start" });
  };

  return (
    <a href="#main-content" className="skip-link" onClick={focusMain}>
      Skip to content
    </a>
  );
}
