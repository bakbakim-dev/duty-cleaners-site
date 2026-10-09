import { Component, type ErrorInfo, type ReactNode } from "react";
import { CITY_PROOF } from "@/data/proof";

interface Props {
  children: ReactNode;
  area?: string;
  /** Set inside the quote dialog: the boundary then closes it, and renders no second main/h1. */
  onDismiss?: () => void;
}

interface State {
  failed: boolean;
  /** A lazy chunk that could not be fetched, as opposed to an error in the code itself. */
  chunk: boolean;
}

/** Browsers word a failed dynamic import differently; these cover Chrome, Firefox and Safari. */
const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk/i;

/** A visible recovery path when a lazy JavaScript chunk cannot be loaded, or a component fails. */
export default class LoadErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, chunk: false };

  static getDerivedStateFromError(error: unknown): State {
    const text = error instanceof Error ? `${error.name} ${error.message}` : String(error);
    return { failed: true, chunk: CHUNK_ERROR.test(text) };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Avoid logging route, form or customer data. Form failures are monitored
    // separately; this boundary exists to prevent a blank screen.
    console.error("[ui] a page component could not be loaded");
  }

  /** "Back to the page" clears the failure, so opening the quote again tries again. */
  private dismiss = () => {
    this.setState({ failed: false, chunk: false });
    this.props.onDismiss?.();
  };

  render() {
    if (!this.state.failed) return this.props.children;
    const area = this.props.area ?? "page";
    const inDialog = Boolean(this.props.onDismiss);
    // A missing chunk usually means the site was updated while the page was open;
    // anything else is our fault, so the visitor's connection is not blamed for it.
    const cause = this.state.chunk
      ? "Your connection may have dropped, or the site was updated while this page was open."
      : "Something went wrong on our side.";
    const Wrapper = inDialog ? "div" : "main";
    const Heading = inDialog ? "h2" : "h1";
    return (
      <Wrapper data-load-error="true" className={`flex items-center justify-center bg-background px-6 py-16 ${inDialog ? "" : "min-h-[60vh]"}`}>
        <div role="alert" className="max-w-xl rounded-xl border border-border bg-card p-8 text-center shadow-sm">
          <Heading className="text-2xl font-bold text-foreground">We couldn&rsquo;t load this {area}</Heading>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            {cause} Reloading the page usually fixes it{inDialog ? ", but the form starts again from the first question" : ""}.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="min-h-[48px] bg-accent px-6 py-3 font-bold text-accent-foreground"
            >
              Reload and try again
            </button>
            {inDialog && (
              <button
                type="button"
                onClick={this.dismiss}
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
      </Wrapper>
    );
  }
}
