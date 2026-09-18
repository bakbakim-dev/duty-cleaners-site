// Import-time responsive images (vite.config.ts IMAGE_PRESETS): an image path
// ending in ?card, ?col or ?hero resolves to a vite-imagetools Picture.
declare module "*?card" {
  const picture: import("vite-imagetools").Picture;
  export default picture;
}
declare module "*?col" {
  const picture: import("vite-imagetools").Picture;
  export default picture;
}
declare module "*?hero" {
  const picture: import("vite-imagetools").Picture;
  export default picture;
}
declare module "*?thumb" {
  const picture: import("vite-imagetools").Picture;
  export default picture;
}
