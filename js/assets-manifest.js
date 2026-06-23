/* =============================================================================
   FRIGHT TRAIL — image asset manifest
   -----------------------------------------------------------------------------
   HOW TO SWAP AN IMAGE (no code changes needed):
     1. Open the section's folder under assets/img/...
     2. Drop your photo in and name it exactly  image.png
     3. Refresh. Done.

   The browser can't list a folder on GitHub Pages, so this manifest names the
   one file the site loads from each folder. Each folder already contains an
   image.png placeholder — just overwrite it.

   If an image.png is missing, the section gracefully falls back to its built-in
   CSS / SVG art (the page never breaks).
   ========================================================================== */
window.FRIGHT_ASSETS = {
  hero: "assets/img/hero/main/image.png",

  cards: {
    tickets: "assets/img/cards/tickets/image.png",
    merch:   "assets/img/cards/merch/image.png",
    dates:   "assets/img/cards/dates/image.png"
  },

  location: "assets/img/location/main/image.png",

  features: {
    acresOfFear:    "assets/img/features/acres-of-fear/image.png",
    notForChildren: "assets/img/features/not-for-children/image.png",
    securityOnSite: "assets/img/features/security-on-site/image.png",
    volunteer:      "assets/img/features/volunteer/image.png"
  },

  videos: [
    "assets/img/videos/fear-01/image.png",
    "assets/img/videos/fear-02/image.png",
    "assets/img/videos/fear-03/image.png",
    "assets/img/videos/fear-04/image.png",
    "assets/img/videos/fear-05/image.png"
  ]
};
