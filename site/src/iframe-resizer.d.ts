/** iframe-resizer 4.1.1 ships no types; this is the one call src/lib/booking-frame.ts makes. */
declare module "iframe-resizer/js/iframeResizer.js" {
  interface IFrameResizerOptions {
    log?: boolean;
    checkOrigin?: boolean | string[];
    heightCalculationMethod?: string;
    resizedCallback?: (data: unknown) => void;
  }
  export default function iframeResize(options: IFrameResizerOptions, target: HTMLIFrameElement): HTMLIFrameElement[];
}
