/// <reference types="vite/client" />

declare global {
  interface Window {
    /** Set in main.tsx once the bundle boots; read by the scroll-reveal failsafe in index.html. */
    __dcMounted?: boolean;
  }
}

export {};
