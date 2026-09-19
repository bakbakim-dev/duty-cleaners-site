/** Types for compile-hints.mjs, the Vite plugin that marks the entry chunk for eager compilation. */
import type { Plugin } from "vite";

export const COMPILE_HINT: string;
export function compileHints(): Plugin;
