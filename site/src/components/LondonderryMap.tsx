import { lazy, Suspense } from "react";
import DeferUntilVisible from "@/components/DeferUntilVisible";

/**
 * Lazy shell for LondonderryMap. The map itself, and Leaflet with it (42 KB gzipped),
 * loads only once the map's placeholder is near the viewport. Every map on
 * the site sits below the fold, so no page pays for Leaflet in its first
 * paint, and a page that is never scrolled that far never fetches it.
 */
const Impl = lazy(() => import("./LondonderryMapImpl"));

const Placeholder = () => <div className="min-h-[320px] w-full rounded-xl bg-muted/40" aria-hidden="true" />;

// Some maps take no props; Parameters<>[0] is then undefined, which cannot be spread, so it becomes an empty object type.
type Params = Parameters<(typeof import("./LondonderryMapImpl"))["default"]>;
type Props = Params extends [infer P] ? (P extends object ? P : Record<never, never>) : Record<never, never>;

export default function LondonderryMap(props: Props) {
  return (
    <DeferUntilVisible placeholder={<Placeholder />}>
      <Suspense fallback={<Placeholder />}>
        <Impl {...props} />
      </Suspense>
    </DeferUntilVisible>
  );
}
