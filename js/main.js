/* =============================================================================
   FRIGHT TRAIL — interactions
   Renders the video carousel + gallery from js/data.js, runs the video modal,
   the mobile nav, carousel arrows, and "Get Directions" links.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.FRIGHT_DATA || { videos: [], gallery: [], location: {} };

  /* ----- small SVG helpers (reused as placeholders) --------------------- */
  var SVG = {
    play:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="none" stroke="%23ededeb" stroke-width="2" opacity=".8"/><path d="M26 21l18 11-18 11z" fill="%23ededeb"/></svg>'.replace(/%23/g, "#"),
    // a screaming-face placeholder so empty thumbs still read as "real people"
    scream:
      '<svg viewBox="0 0 100 120" aria-hidden="true" width="80" height="96">' +
      '<g fill="none" stroke="#9a978f" stroke-width="2.5">' +
      '<ellipse cx="50" cy="55" rx="30" ry="40"/>' +
      '<ellipse cx="38" cy="46" rx="6" ry="9" fill="#9a978f" stroke="none"/>' +
      '<ellipse cx="62" cy="46" rx="6" ry="9" fill="#9a978f" stroke="none"/>' +
      '<ellipse cx="50" cy="82" rx="9" ry="14" fill="#000"/>' +
      '<path d="M30 30c4-6 10-8 14-7M70 30c-4-6-10-8-14-7"/>' +
      "</g></svg>",
    camera:
      '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#7c7a73" stroke-width="1.4"><rect x="2" y="6" width="20" height="14" rx="2"/><circle cx="12" cy="13" r="4"/><path d="M8 6l2-3h4l2 3"/></svg>'
  };

  /* helper to query / create */
  function $(s, c) { return (c || document).querySelector(s); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* =====================================================================
     MOBILE NAV
     ================================================================== */
  function initNav() {
    var nav = $(".nav");
    var toggle = $(".nav__toggle");
    if (!nav || !toggle) return;
    toggle.addEventListener("click", function () { nav.classList.toggle("open"); });
    // close menu when a link is tapped
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () { nav.classList.remove("open"); });
    });
  }

  /* =====================================================================
     DIRECTIONS — every [data-directions] opens Google Maps
     ================================================================== */
  function initDirections() {
    var q = encodeURIComponent((DATA.location && DATA.location.mapsQuery) || "Fright Trail Scott Louisiana");
    var url = "https://www.google.com/maps/dir/?api=1&destination=" + q;
    document.querySelectorAll("[data-directions]").forEach(function (n) {
      n.setAttribute("href", url);
      n.setAttribute("target", "_blank");
      n.setAttribute("rel", "noopener");
    });
  }

  /* =====================================================================
     VIDEO MODAL
     ================================================================== */
  function initModal() {
    var modal = $("#video-modal");
    if (!modal) return;
    var frame = $(".modal__frame", modal);
    var cap = $(".modal__cap", modal);

    function open(video) {
      cap.textContent = video.title || "Fright Trail";
      if (video.youtubeId) {
        frame.innerHTML =
          '<iframe src="https://www.youtube.com/embed/' + video.youtubeId +
          '?autoplay=1&rel=0" title="' + (video.title || "") +
          '" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
      } else if (video.src) {
        frame.innerHTML = '<video src="' + video.src + '" controls autoplay playsinline></video>';
      } else {
        frame.innerHTML =
          '<div class="modal__ph">' + SVG.scream +
          "<div>VIDEO COMING SOON</div><div style=\"font-size:.7rem;opacity:.7\">Real people. Real fear.</div></div>";
      }
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("open");
      frame.innerHTML = ""; // stop playback
      document.body.style.overflow = "";
    }

    $(".modal__close", modal).addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    window.__frightOpenVideo = open; // used by carousel tiles
  }

  /* =====================================================================
     CAROUSEL — render thumbs + arrows
     ================================================================== */
  function initCarousel() {
    var track = $("#video-track");
    if (!track) return;

    DATA.videos.forEach(function (v) {
      var tile = el("button", "vthumb");
      tile.setAttribute("aria-label", "Play " + v.title);
      var inner = "";
      if (v.thumb) {
        inner += '<img src="' + v.thumb + '" alt="' + v.title + '">';
      } else {
        inner += '<div class="vthumb__face">' + SVG.scream + "</div>";
      }
      inner += '<div class="vthumb__play">' + SVG.play + "</div>";
      tile.innerHTML = inner;
      tile.addEventListener("click", function () {
        if (window.__frightOpenVideo) window.__frightOpenVideo(v);
      });
      track.appendChild(tile);
    });

    var prev = $(".carousel__btn--prev");
    var next = $(".carousel__btn--next");
    function step() { return Math.max(track.clientWidth * 0.8, 220); }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* =====================================================================
     GALLERY
     ================================================================== */
  function initGallery() {
    var grid = $("#gallery-grid");
    if (!grid) return;
    DATA.gallery.forEach(function (g) {
      var tile = el("figure", "gtile");
      if (g.src) {
        tile.innerHTML = '<img src="' + g.src + '" alt="' + g.caption + '">';
      } else {
        tile.innerHTML = '<div class="gtile__ph">' + SVG.camera + "</div>";
      }
      tile.innerHTML += '<figcaption class="gtile__cap">' + g.caption + "</figcaption>";
      grid.appendChild(tile);
    });
  }

  /* ----- boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initDirections();
    initModal();
    initCarousel();
    initGallery();
  });
})();
