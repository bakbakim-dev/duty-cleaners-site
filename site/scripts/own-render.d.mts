/** Types for own-render.mjs, which prerender.mjs runs under plain node. */
export const SITE_ORIGIN: string;
export function ownRenderProblem(html: string, route: string, shellTitle?: string | null): string | null;
export function shellTitleOf(shellHtml: string): string | null;
