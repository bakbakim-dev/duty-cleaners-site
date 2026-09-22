import { Component, type ErrorInfo, type ReactNode } from "react";
import { CITY_PROOF } from "@/data/proof";

interface Props {
  children: ReactNode;
  area?: string;
  onDismiss?: () => void;
}

interface State {
  failed: boolean;
}

/** A visible recovery path when a lazy JavaScript chunk cannot be loaded. */
export default class LoadErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Avoid logging route, form or customer data. Form failures are monitored
    // separately; this boundary exists to prevent a blank screen.
    console.error("[ui] a page component could not be loaded");
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const area = this.props.area ?? "page";
    return (
      <main data-load-error="true" className="flex min-h-[60vh] items-center justify-center bg-background px-6 py-16">
        <div role="alert" className="max-w-xl rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-foreground">We couldn&rsquo;t load this {area}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Your connection may have changed while the site was updating. Reload to try again.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[48px] bg-accent px-6 py-3 font-bold text-accent-foreground"
            >
              Reload and try again
            </button>
            {this.props.onDismiss && (
              <button
                type="button"
                onClick={this.props.onDismiss}
                className="min-h-[48px] border border-border bg-card px-6 py-3 font-semibold text-foreground"
              >
                Back to the page
              </button>
            )}
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Need help now? Call Edmonton at <a className="font-semibold underline" href={CITY_PROOF.edmonton.phoneLink}>{CITY_PROOF.edmonton.phone}</a>
            {", Calgary at "}<a className="font-semibold underline" href={CITY_PROOF.calgary.phoneLink}>{CITY_PROOF.calgary.phone}</a>
            {", or Red Deer at "}<a className="font-semibold underline" href={CITY_PROOF.reddeer.phoneLink}>{CITY_PROOF.reddeer.phone}</a>.
          </p>
        </div>
      </main>
    );
  }
}
