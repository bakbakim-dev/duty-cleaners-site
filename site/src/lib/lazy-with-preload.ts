import { createElement, lazy, type ComponentType, type ReactElement } from "react";

/**
 * React.lazy() for route pages, plus preload(): once the page's module has
 * loaded, the component renders synchronously instead of suspending.
 *
 * Why this exists (measured 2026-10-05 in Chrome on the live site): every page
 * is prerendered, but each route used plain React.lazy(). A lazy component
 * always suspends on its first render, even when its chunk is already
 * downloaded (the prerender snapshot modulepreloads it), because lazy() only
 * starts the import when it first renders. So React's first render replaced
 * the prerendered page with App.tsx's full-screen "Loading page…" Suspense
 * fallback, then rendered the page again 100–300 ms later on a desktop and
 * 1–5 s later on a phone-speed CPU. Visitors saw the page, a spinner, then
 * the page; and the hero photo's Largest Contentful Paint was only recorded
 * after the second render.
 *
 * main.tsx calls preload() for the route being opened before React's first
 * render, so that render produces the page itself and the swap is invisible.
 * On later client-side navigations the component behaves like React.lazy.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- route pages take no common props
type AnyComponent = ComponentType<any>;

export interface PreloadableComponent {
  (props: Record<string, unknown>): ReactElement;
  /** Loads the module; afterwards the component renders without suspending. */
  preload: () => Promise<void>;
}

export function lazyWithPreload(factory: () => Promise<{ default: AnyComponent }>): PreloadableComponent {
  let loaded: AnyComponent | null = null;
  let pending: Promise<{ default: AnyComponent }> | null = null;
  const load = () =>
    (pending ??= factory().then(
      (module) => {
        loaded = module.default;
        return module;
      },
      (error: unknown) => {
        // Let a later render or preload() try again after a failed fetch.
        pending = null;
        throw error;
      },
    ));
  const Lazy = lazy(load);
  const Preloadable = ((props: Record<string, unknown>) =>
    createElement(loaded ?? Lazy, props)) as PreloadableComponent;
  Preloadable.preload = () => load().then(() => undefined);
  return Preloadable;
}
