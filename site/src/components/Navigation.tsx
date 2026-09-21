import { CITY_PROOF, RED_DEER_PATH, type Branch } from "@/data/proof";
import { OFFICES_ANCHOR } from "@/components/OfficeCallLink";
import { quoteHrefFor } from "@/lib/quote-link";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { explicitBranchFromPath } from "@/lib/city-from-path";
import { rememberBranch, useBranchPreference } from "@/lib/branch-preference";
import { useQuoteOverlay } from "@/hooks/use-quote-overlay";
import { Menu, Calculator, Gift, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnnouncementBar from "@/components/AnnouncementBar";
import { specialistCtaForLocation } from "@/lib/commercial-context";

interface NavigationProps {
  city?: "edmonton" | "calgary";
  /**
   * The branch office whose phone the nav shows, when it is not the city's.
   * Only the Red Deer page passes it: Red Deer has its own office and phone
   * but no service pages of its own, so the service links stay Edmonton's.
   */
  branch?: Branch;
}

/** Glyphs the nav uses, each traced as a CSS mask in index.css (.dc-icon-<name>). */
type NavIcon =
  | "map-pin" | "earth" | "sparkles" | "clipboard-list" | "truck" | "hard-hat"
  | "key-round" | "shield-check" | "users" | "circle-help" | "gift" | "message-square";

interface DropdownItem {
  to: string;
  /** Rendered as <span class="dc-icon dc-icon-{icon}">: one node, no inline SVG. */
  icon: NavIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

/** The three offices, in the order the site lists them. */
const OFFICES: ReadonlyArray<Branch> = ["edmonton", "calgary", "reddeer"];

/**
 * The "Call us" menu on pages that belong to no branch. Same always-rendered,
 * CSS-hidden shape as DropdownPanel, so the three tel: links are in every
 * prerendered neutral page for crawlers and stay out of the tab order while
 * closed. Anchors, not Links: these are tel: hrefs.
 */
function OfficePanel({ open, id }: { open: boolean; id: string }) {
  return (
    <div
      id={id}
      className={`absolute right-0 w-72 z-50 pt-3 transition-opacity duration-200 ${
        open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
      style={{ top: "100%" }}
    >
      <div className="rounded-xl border border-border bg-background p-2 shadow-xl">
        {OFFICES.map((key) => {
          const office = CITY_PROOF[key];
          return (
            <a
              key={key}
              href={office.phoneLink}
              className="flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-[0.95rem] text-foreground transition-colors hover:bg-secondary hover:text-accent"
            >
              <span className="dc-icon dc-icon-phone w-4 h-4 text-accent" aria-hidden="true" />
              <span className="font-semibold">{office.city}</span>
              <span className="ml-auto">{office.phone}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function DropdownPanel({
  items,
  align = "left",
  open,
  id,
}: {
  items: DropdownItem[];
  align?: "left" | "right";
  open: boolean;
  id: string;
}) {
  /**
   * Always rendered, hidden with CSS when closed.
   *
   * This panel used to be mounted only while open, which meant the header's
   * Services, Service Areas and Company links existed in NO prerendered page —
   * `/wall-washing-wall-cleaning` ended up with a single inbound internal link
   * sitewide while its siblings had 136+. `visibility: hidden` keeps it out of
   * the accessibility tree and out of the tab order while leaving the anchors
   * in the HTML for crawlers.
   */
  return (
    <div
      id={id}
      className={`absolute ${align === "right" ? "right-0" : "left-0"} w-80 z-50 pt-3 transition-opacity duration-200 ${
        open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
      }`}
      style={{ top: "100%" }}
    >
      <div className="relative bg-card rounded-xl shadow-2xl shadow-primary/15 border border-border p-2">
        {/* Caret */}
        <div
          className={`absolute -top-[7px] ${align === "right" ? "right-8" : "left-8"} w-3.5 h-3.5 bg-card border-l border-t border-border rotate-45 rounded-[2px]`}
        />
        {items.map((item) => (
          <Link
            key={item.to + item.title}
            to={item.to}
            className="group/item flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-secondary transition-colors"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover/item:bg-accent group-hover/item:text-accent-foreground">
              <span className={`dc-icon dc-icon-${item.icon} h-5 w-5`} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-foreground leading-tight group-hover/item:text-accent transition-colors">
                {item.title}
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                {item.description}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavLink({
  to,
  children,
  active,
}: {
  to: string;
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`relative py-2 text-[0.95rem] font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:rounded-full after:transition-all after:duration-300 ${
        active
          ? "text-accent after:w-full"
          : "text-foreground hover:text-accent after:w-0 hover:after:w-full"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navigation({ city, branch: branchKey }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);
  const [mobileLocationsOpen, setMobileLocationsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCtaHidden, setMobileCtaHidden] = useState(false);
  const location = useLocation();
  const { openQuote } = useQuoteOverlay();

  // Escape must dismiss the menu and any open dropdown — keyboard users had
  // no way out of an opened panel other than clicking elsewhere.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenDropdown(null);
      setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Give content-focused sections the full mobile viewport. The sticky CTA
  // should not cover process imagery or form fields while visitors read or book.
  // The site footer counts too: on pages without those sections the bar used to
  // stay up forever and cover the footer's last row of links on mobile.
  useEffect(() => {
    const targets = ["how-it-works", "who-we-help", "quote"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const footer = document.querySelector("footer");
    if (footer) targets.push(footer as HTMLElement);

    if (targets.length === 0) {
      setMobileCtaHidden(false);
      return;
    }

    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        setMobileCtaHidden(visible.size > 0);
      },
      { threshold: 0.05, rootMargin: "-8% 0px -18% 0px" },
    );
    targets.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);

  // Close mobile menu + dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Reserve space for the fixed mobile CTA bar so it never covers page content.
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile || mobileCtaHidden) {
      document.body.style.paddingBottom = "";
      return;
    }
    document.body.style.paddingBottom = "calc(76px + env(safe-area-inset-bottom))";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [mobileCtaHidden, location.pathname]);

  // Both were written out by hand here, and they disagreed: Calgary got
  // parentheses and Edmonton did not, on every page of the site. proof.ts is
  // the NAP authority — read it rather than restating the number.
  // Which office this page belongs to. The props win (168 pages pass city=,
  // the Red Deer page passes branch=); otherwise the URL decides, and a page
  // that belongs to no branch — About, FAQs, the blog, the legal pages —
  // resolves to null. A null page shows every office ("Call us") until the
  // visitor has been to a city page, then that city. The choice lives in
  // localStorage (branch-preference.ts), is read only after mount, and so is
  // invisible to the prerender and to crawlers, which are stateless and get
  // the neutral chrome. Body copy and JSON-LD never follow it.
  const pageBranch: Branch | null = branchKey ?? city ?? explicitBranchFromPath(location.pathname);
  const remembered = useBranchPreference();
  useEffect(() => {
    if (pageBranch) rememberBranch(pageBranch);
  }, [pageBranch, location.pathname]);
  const shownBranch: Branch | null = pageBranch ?? remembered;
  const neutral = shownBranch === null;
  const branch = CITY_PROOF[shownBranch ?? "edmonton"];
  const phone = branch.phone;
  const phoneLink = branch.phoneLink;
  // Service links follow the city. Red Deer has no service pages of its own
  // and shares Edmonton's, so a Red Deer choice keeps Edmonton links.
  const linkCity: "edmonton" | "calgary" = city ?? (shownBranch === "calgary" ? "calgary" : "edmonton");
  // NOTE: cityPath composes MODERN routes (/edmonton/pricing). Several of
  // those have a preserved legacy canonical (/pricing), so every link built
  // from it is resolved through canonicalForPath — otherwise the sitewide nav
  // sends a 301 hop from every page on the site.
  const cityPath = `/${linkCity}`;
  const specialistCta = specialistCtaForLocation(location.pathname, location.search, location.hash);
  const quoteTarget = specialistCta
    ? specialistCta.href
    : linkCity === "calgary"
      ? `${canonicalForPath("/calgary")}#quote`
      : "/#quote";
  const quoteLabel = specialistCta ? specialistCta.label : "See My Instant Price";

  // Quote CTAs open the full-screen booking takeover instead of scrolling
  // to an in-page section, so the form gets the whole viewport.
  const handleQuoteClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (specialistCta) {
      setMobileMenuOpen(false);
      return;
    }
    e.preventDefault();
    setMobileMenuOpen(false);
    openQuote();
  };

  const isActive = (path: string) => location.pathname === path;

  const locationsItems: DropdownItem[] = [
    { to: "/", icon: "map-pin", title: "Edmonton", description: "Edmonton neighbourhoods and nearby communities" },
    { to: canonicalForPath("/calgary"), icon: "map-pin", title: "Calgary", description: "Calgary neighbourhoods and nearby communities" },
    { to: RED_DEER_PATH, icon: "map-pin", title: "Red Deer", description: "The Red Deer office" },
    { to: "/locations/", icon: "earth", title: "All Locations", description: "See everywhere we clean" },
  ];

  const servicesItems: DropdownItem[] = [
    { to: canonicalForPath(`${cityPath}/services`), icon: "sparkles", title: "All Services", description: "Standard, deep & specialty cleaning" },
    { to: "/whats-included/", icon: "clipboard-list", title: "What's Included", description: "Room-by-room cleaning checklists" },
    { to: canonicalForPath(`${cityPath}/move-in-move-out-cleaning`), icon: "truck", title: "Move In/Out Cleaning", description: "Flat-priced cleans for moving in or out" },
    { to: canonicalForPath(`${cityPath}/post-construction-cleaning`), icon: "hard-hat", title: "Post-Construction", description: "Construction dust after a build or renovation" },
    { to: canonicalForPath(`${cityPath}/wall-washing`), icon: "sparkles", title: "Wall Washing", description: "Spot cleaning or a full wash, booked with a clean" },
    { to: canonicalForPath(`${cityPath}/airbnb-cleaning`), icon: "key-round", title: "Airbnb Turnovers", description: "Changeovers between guests, priced hourly" },
    // March-out is Edmonton-only military housing work, quoted by phone.
    ...(linkCity === "calgary" || shownBranch === "reddeer"
      ? []
      : [{
          to: "/edmonton/march-out-cleaning/",
          icon: "shield-check",
          title: "March Out Cleaning",
          description: "Military housing move-outs, by phone",
        } as DropdownItem]),
  ];

  // Company paths sit behind one dropdown. Reviews is promoted to a top-level
  // link because it is the highest-trust page in the funnel.
  const contactItems: DropdownItem[] = [
    { to: "/about-us/", icon: "users", title: "About Us", description: "Who we are and how cleaners are checked" },
    { to: canonicalForPath("/faq"), icon: "circle-help", title: "FAQ", description: "Answers to common questions" },
    { to: "/gift-card/", icon: "gift", title: "Gift Cards", description: "Give a house clean as a gift" },
    { to: "/join-the-team/", icon: "users", title: "Careers", description: "Join our cleaning team" },
    { to: canonicalForPath("/contact"), icon: "message-square", title: "Contact Us", description: "Phone, email and office addresses" },
  ];

  const dropdownButton = (label: string, id: string) => (
    <button
      type="button"
      aria-haspopup="true"
      aria-expanded={openDropdown === id}
      aria-controls={`nav-panel-${id}`}
      // Hover alone left this unreachable by keyboard and by touch (WCAG 2.1.1).
      onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpenDropdown(null);
      }}
      className={`relative text-[0.95rem] font-medium flex items-center gap-1 py-2 transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-accent after:rounded-full after:transition-all after:duration-300 ${
        openDropdown === id
          ? "text-accent after:w-full"
          : "text-foreground hover:text-accent after:w-0 hover:after:w-full"
      }`}
    >
      {label}
      <span
        className={`dc-icon dc-icon-chevron-down w-4 h-4 transition-transform duration-200 ${openDropdown === id ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );

  return (
    <>
      <AnnouncementBar />
      <nav
        className={`nav-glass sticky top-0 z-40 bg-background/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-primary/10" : "shadow-md"
        }`}
      >
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo — navy monogram plate plus a stacked wordmark. */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <span className="flex h-10 w-10 items-center justify-center bg-brand-navy font-serif text-lg font-bold text-brand-navy-foreground shadow-sm transition-shadow group-hover:shadow-md">
              DC
            </span>
            <span className="leading-none">
              <span className="block text-[0.6rem] font-bold uppercase tracking-[0.3em] text-brand-navy/70">
                Duty
              </span>
              <span className="mt-0.5 block text-lg font-extrabold uppercase tracking-[0.08em] text-brand-navy">
                Cleaners
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 whitespace-nowrap">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("services")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {dropdownButton("Services", "services")}
              <DropdownPanel items={servicesItems} open={openDropdown === "services"} id={`nav-panel-services`} />
            </div>

            <NavLink to={canonicalForPath(`${cityPath}/pricing`)} active={isActive(`${cityPath}/pricing`)}>
              Pricing
            </NavLink>

            <NavLink to="/reviews/" active={isActive("/reviews")}>
              Reviews
            </NavLink>

            <NavLink to="/blog/" active={isActive("/blog")}>
              Blog
            </NavLink>

            {/* Locations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("locations")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {dropdownButton("Service Areas", "locations")}
              <DropdownPanel items={locationsItems} open={openDropdown === "locations"} id={`nav-panel-locations`} />
            </div>

            {/* Company paths: about, FAQ, gift cards, careers, contact */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown("contact")}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {dropdownButton("Company", "contact")}
              <DropdownPanel items={contactItems} align="right" open={openDropdown === "contact"} id={`nav-panel-contact`} />
            </div>

            {neutral ? (
              <div
                className="relative"
                onMouseEnter={() => setOpenDropdown("call")}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {dropdownButton("Call us", "call")}
                <OfficePanel open={openDropdown === "call"} id="nav-panel-call" />
              </div>
            ) : (
              <a
                href={phoneLink}
                aria-label={`Call ${phone}`}
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 text-[0.95rem] font-semibold text-foreground transition-colors hover:text-accent xl:justify-start"
              >
                <span className="dc-icon dc-icon-phone w-4 h-4 text-accent" aria-hidden="true" />
                <span className="hidden xl:inline">{phone}</span>
              </a>
            )}
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-md shadow-accent/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/40"
              asChild
            >
              <Link to={quoteTarget} onClick={handleQuoteClick}>
                {quoteLabel}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            className="lg:hidden text-foreground p-2 -mr-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`dc-icon w-7 h-7 ${mobileMenuOpen ? "dc-icon-x" : "dc-icon-menu"}`} aria-hidden="true" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" role="dialog" aria-modal="false" aria-label="Site menu" className="lg:hidden py-4 space-y-1 border-t animate-in fade-in-0 slide-in-from-top-2 duration-200">
            {/* The primary action belongs inside the menu, not only in the bar. */}
            <a
              href={specialistCta ? quoteTarget : quoteHrefFor(location.pathname)}
              onClick={() => setMobileMenuOpen(false)}
              className="mb-3 flex min-h-[52px] items-center justify-center rounded-lg bg-accent px-5 text-base font-bold text-accent-foreground shadow-lg transition-colors hover:bg-accent/90"
            >
              {quoteLabel}
            </a>
            <Link to="/about-us/" className="block py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </Link>

            {/* Locations Dropdown - Mobile */}
            <div>
              <button
                type="button"
                aria-expanded={mobileLocationsOpen}
                className="w-full flex items-center justify-between py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors"
                onClick={() => setMobileLocationsOpen(!mobileLocationsOpen)}
              >
                Locations
                <span className={`dc-icon dc-icon-chevron-down w-4 h-4 transition-transform duration-200 ${mobileLocationsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {mobileLocationsOpen && (
                <div className="pl-4 mt-1 space-y-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {locationsItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`dc-icon dc-icon-${item.icon} w-4 h-4 text-accent`} aria-hidden="true" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/join-the-team/" className="block py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Careers
            </Link>

            {/* Services Dropdown - Mobile */}
            <div>
              <button
                type="button"
                aria-expanded={mobileServicesOpen}
                className="w-full flex items-center justify-between py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors"
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                Services
                <span className={`dc-icon dc-icon-chevron-down w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 mt-1 space-y-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {servicesItems.map((item) => (
                    <Link
                      key={item.to + item.title}
                      to={item.to}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`dc-icon dc-icon-${item.icon} w-4 h-4 text-accent`} aria-hidden="true" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to={canonicalForPath(`${cityPath}/pricing`)} className="block py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>

            <Link to="/reviews/" className="block py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Reviews
            </Link>

            {/* Company Dropdown - Mobile */}
            <div>
              <button
                type="button"
                aria-expanded={mobileContactOpen}
                className="w-full flex items-center justify-between py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors"
                onClick={() => setMobileContactOpen(!mobileContactOpen)}
              >
                Company
                <span className={`dc-icon dc-icon-chevron-down w-4 h-4 transition-transform duration-200 ${mobileContactOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
              {mobileContactOpen && (
                <div className="pl-4 mt-1 space-y-1 animate-in fade-in-0 slide-in-from-top-1 duration-200">
                  {contactItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 py-2.5 px-2 rounded-lg text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className={`dc-icon dc-icon-${item.icon} w-4 h-4 text-accent`} aria-hidden="true" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/blog/" className="block py-3 px-2 rounded-lg text-foreground hover:bg-secondary hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>
              Blog
            </Link>
            {neutral ? (
              OFFICES.map((key) => (
                <a key={key} href={CITY_PROOF[key].phoneLink} className="flex min-h-[48px] items-center gap-2 py-3 px-2 text-accent font-bold">
                  <span className="dc-icon dc-icon-phone w-4 h-4" aria-hidden="true" />
                  <span className="text-foreground font-medium">{CITY_PROOF[key].city}</span>
                  {CITY_PROOF[key].phone}
                </a>
              ))
            ) : (
              <a href={phoneLink} className="flex min-h-[48px] items-center gap-2 py-3 px-2 text-accent font-bold">
                <span className="dc-icon dc-icon-phone w-4 h-4" aria-hidden="true" />
                {phone}
              </a>
            )}
          </div>
        )}
      </div>
      </nav>

      {/* Mobile Sticky CTA Bar — rendered outside <nav> because the nav's
          backdrop-blur creates a containing block that would break fixed positioning */}
      {!mobileCtaHidden && (
        <aside
          aria-label="Quick contact and quote actions"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex gap-2 border-t border-brand-navy-foreground/15 bg-brand-navy p-3 shadow-2xl"
        >
          <Button
            asChild
            variant="outline"
            className="min-h-[48px] shrink-0 border-brand-navy-foreground/40 bg-transparent px-4 text-base font-bold text-brand-navy-foreground hover:bg-brand-navy-foreground/10 hover:text-brand-navy-foreground"
          >
            <a href={neutral ? OFFICES_ANCHOR : phoneLink} aria-label={neutral ? "Call an office" : `Call ${phone}`}>
              <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
              Call
            </a>
          </Button>
          <Button asChild className="min-h-[48px] flex-1 bg-accent text-base font-bold text-accent-foreground hover:bg-accent/90">
            <Link to={quoteTarget} onClick={handleQuoteClick}>
              <Calculator className="mr-2 h-5 w-5" aria-hidden="true" />
              {quoteLabel}
            </Link>
          </Button>
        </aside>
      )}
    </>
  );
}
