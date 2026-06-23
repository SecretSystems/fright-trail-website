/* =============================================================================
   FRIGHT TRAIL — site data / configuration
   -----------------------------------------------------------------------------
   This file is the single place to wire in real content later:

   • videos[]   -> swap `youtubeId` for real YouTube Shorts IDs (or set `src`
                   to an mp4). Leave `youtubeId` null to show a "coming soon"
                   placeholder. `thumb` can point to a real photo in /assets.
   • gallery[]  -> drop real photo paths into `src` to replace placeholders.
   • dates      -> operating nights + hours.
   • products[] -> merch items (later: add Stripe price IDs in merch checkout).

   Nothing here touches layout — render logic lives in js/main.js.
   ========================================================================== */

window.FRIGHT_DATA = {

  /* "REAL PEOPLE. REAL FEAR." carousel.
     youtubeId: paste a YouTube / Shorts video id (e.g. "dQw4w9WgXcQ").
     Until then the player shows a styled placeholder. */
  videos: [
    { id: "v1", title: "Real People. Real Fear. #1", youtubeId: null, thumb: null },
    { id: "v2", title: "Real People. Real Fear. #2", youtubeId: null, thumb: null },
    { id: "v3", title: "Real People. Real Fear. #3", youtubeId: null, thumb: null },
    { id: "v4", title: "Real People. Real Fear. #4", youtubeId: null, thumb: null },
    { id: "v5", title: "Real People. Real Fear. #5", youtubeId: null, thumb: null },
    { id: "v6", title: "Real People. Real Fear. #6", youtubeId: null, thumb: null },
    { id: "v7", title: "Real People. Real Fear. #7", youtubeId: null, thumb: null }
  ],

  /* GALLERY — replace `src: null` with real photo paths e.g. "assets/img/g1.jpg" */
  gallery: [
    { id: "g1", caption: "Into the woods", src: null },
    { id: "g2", caption: "The hollow",      src: null },
    { id: "g3", caption: "Don't look back",  src: null },
    { id: "g4", caption: "Run",              src: null },
    { id: "g5", caption: "The clearing",     src: null },
    { id: "g6", caption: "Last light",       src: null }
  ],

  /* OPEN SELECT DATES */
  dates: {
    october:  ["11–12", "18–19", "25–26", "31"],
    november: ["1–2"],
    hours: [
      { day: "Friday & Saturday", time: "7:30 PM – 11:30 PM" },
      { day: "Sunday",            time: "7:30 PM – 10:00 PM" },
      { day: "Halloween (Oct 31)", time: "7:30 PM – Midnight" }
    ]
  },

  /* MERCH — later: attach Stripe price IDs / checkout to each product */
  products: [
    { id: "tee-skull",  name: "Skull Tee",        price: "$25", img: null },
    { id: "hoodie",     name: "Haunted Woods Hoodie", price: "$45", img: null },
    { id: "poster",     name: "Vintage Poster",   price: "$15", img: null },
    { id: "cap",        name: "Fright Trail Cap",  price: "$20", img: null }
  ],

  /* LOCATION — used by every "Directions" link */
  location: {
    name: "Fright Trail",
    cityState: "Scott, Louisiana",
    // Replace with the exact street address when ready:
    mapsQuery: "Fright Trail Scott Louisiana"
  }
};
