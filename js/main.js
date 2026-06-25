/* =============================================================================
   FRIGHT TRAIL — interactions
   Renders the video carousel + gallery from js/data.js, runs the video modal,
   the mobile nav, carousel arrows, and "Get Directions" links.
   Carousel thumbnails use generated gritty black-and-white "scared face"
   portraits until real photos/thumbnails are added in js/data.js.
   ========================================================================== */
(function () {
  "use strict";

  var DATA = window.FRIGHT_DATA || { videos: [], gallery: [], location: {} };

  /* ----- small SVG helpers --------------------------------------------- */
  var SVG = {
    play:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="29" fill="rgba(0,0,0,.45)" stroke="#ededeb" stroke-width="2"/><path d="M26 21l18 11-18 11z" fill="#ededeb"/></svg>',
    camera:
      '<svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="#7c7a73" stroke-width="1.3"><path d="M6 4l12 4-1 12H7L6 4z"/><path d="M9 4a3 3 0 016 0"/></svg>'
  };

  /* =====================================================================
     SCARED-FACE PORTRAIT GENERATOR
     5 distinct gritty B&W horror portraits. Ids use the __U__ token so each
     rendered instance gets a unique suffix (avoids cross-SVG id collisions).
     ================================================================== */
  var FACE_DEFS =
    '<defs>' +
      '<radialGradient id="bg__U__" cx="50%" cy="38%" r="80%">' +
        '<stop offset="0%" stop-color="#444440"/><stop offset="55%" stop-color="#13130f"/><stop offset="100%" stop-color="#000"/></radialGradient>' +
      '<linearGradient id="sk__U__" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0%" stop-color="#eceae3"/><stop offset="50%" stop-color="#8c8a80"/><stop offset="100%" stop-color="#0d0d0c"/></linearGradient>' +
      '<radialGradient id="vg__U__" cx="50%" cy="42%" r="70%">' +
        '<stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.85"/></radialGradient>' +
      '<filter id="rg__U__"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="__S__" result="n"/>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="6"/></filter>' +
      '<filter id="gr__U__"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="t"/>' +
        '<feColorMatrix in="t" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0"/></filter>' +
    '</defs>';

  // each face = inner markup (uses url(#sk__U__) etc.)
  var FACES = [
    // 1 — screaming woman, long hair
    '<g filter="url(#rg__U__)">' +
      '<path d="M75 32C46 32 39 62 41 96c2 34 18 68 34 78 16-10 32-44 34-78 2-34-5-64-34-64Z" fill="url(#sk__U__)"/>' +
      '<path d="M41 100C30 64 44 16 75 16s45 48 34 84c8-26 2-58-14-70 12 18 10 44 6 52 4-30-8-46-26-46s-30 16-26 46c-4-8-10-40 2-58C32 50 36 78 41 100Z" fill="#050505"/>' +
      '<path d="M41 98c-3 40 1 70-10 102h16c-5-46 0-78 2-96Z" fill="#070707"/>' +
      '<path d="M109 98c3 40-1 70 10 102h-16c5-46 0-78-2-96Z" fill="#070707"/>' +
      '<path d="M75 32c16 12 30 80 24 110 9-12 18-46 16-78-2-30-12-44-40-32Z" fill="#000" opacity="0.32"/>' +
      '<path d="M50 78q12-9 23-3M100 78q-12-9-23-3" stroke="#000" stroke-width="3" fill="none"/>' +
      '<ellipse cx="61" cy="92" rx="9" ry="11" fill="#f1efe8"/><circle cx="61" cy="93" r="4.2" fill="#000"/>' +
      '<ellipse cx="90" cy="92" rx="9" ry="11" fill="#f1efe8"/><circle cx="90" cy="93" r="4.2" fill="#000"/>' +
      '<path d="M75 100l-6 22q6 5 12 0z" fill="#000" opacity="0.3"/>' +
      '<ellipse cx="75" cy="143" rx="15" ry="23" fill="#000"/>' +
      '<path d="M61 138q14-6 28 0" stroke="#1c1c1c" stroke-width="2" fill="none"/>' +
    '</g>',
    // 2 — shocked face, gaunt, hands up cheeks
    '<g filter="url(#rg__U__)">' +
      '<path d="M75 30C48 30 42 60 44 94c2 32 16 64 31 74 15-10 29-42 31-74 2-34-4-64-31-64Z" fill="url(#sk__U__)"/>' +
      '<path d="M44 94C36 60 48 22 75 22s39 38 31 72c6-22 2-46-10-58-22-14-44-6-52 14-3 8-3 28 0 44Z" fill="#060606"/>' +
      '<path d="M75 30c14 10 26 74 22 102 8-12 16-44 14-72-2-26-10-40-36-30Z" fill="#000" opacity="0.3"/>' +
      '<path d="M52 80q11-6 21-2M98 80q-11-6-21-2" stroke="#000" stroke-width="2.5" fill="none"/>' +
      '<ellipse cx="62" cy="95" rx="10" ry="12" fill="#efece5"/><circle cx="62" cy="96" r="4.6" fill="#000"/>' +
      '<ellipse cx="89" cy="95" rx="10" ry="12" fill="#efece5"/><circle cx="89" cy="96" r="4.6" fill="#000"/>' +
      '<path d="M75 104l-5 20q5 4 10 0z" fill="#000" opacity="0.32"/>' +
      '<ellipse cx="75" cy="146" rx="9" ry="14" fill="#000"/>' +
      '<path d="M30 120c8 18 8 40 6 80h14c-4-42-2-66-20-80Z" fill="#0a0a0a"/>' +
      '<path d="M120 120c-8 18-8 40-6 80h-14c4-42 2-66 20-80Z" fill="#0a0a0a"/>' +
    '</g>',
    // 3 — terrified man, short hair, sweat, gritted open mouth
    '<g filter="url(#rg__U__)">' +
      '<path d="M75 34C50 34 45 62 46 92c1 30 16 60 29 70 13-10 28-40 29-70 1-30-4-58-29-58Z" fill="url(#sk__U__)"/>' +
      '<path d="M46 86C42 58 52 30 75 30s33 28 29 56c4-14-2-34-12-42-16-12-38-10-50 6-4 6-4 24 4 36Z" fill="#070707"/>' +
      '<path d="M75 34c12 10 24 70 21 96 8-12 15-42 13-66-2-24-10-38-34-30Z" fill="#000" opacity="0.34"/>' +
      '<path d="M52 82q11-5 20 0M98 82q-11-5-20 0" stroke="#000" stroke-width="3" fill="none"/>' +
      '<path d="M53 92a9 9 0 0118 0 9 9 0 01-18 0Z" fill="#ecede6"/><circle cx="62" cy="93" r="4" fill="#000"/>' +
      '<path d="M79 92a9 9 0 0118 0 9 9 0 01-18 0Z" fill="#ecede6"/><circle cx="88" cy="93" r="4" fill="#000"/>' +
      '<path d="M75 100l-6 20q6 4 12 0z" fill="#000" opacity="0.3"/>' +
      '<path d="M60 138q15 14 30 0q-4 16-15 16t-15-16Z" fill="#000"/>' +
      '<g stroke="#cfccc4" stroke-width="1.4"><path d="M60 138h30"/><path d="M66 138v8M72 138v9M78 138v9M84 138v8"/></g>' +
      '<circle cx="50" cy="74" r="2.3" fill="#dfdcd4" opacity="0.7"/><circle cx="56" cy="66" r="1.8" fill="#dfdcd4" opacity="0.6"/>' +
    '</g>',
    // 4 — wide-eyed face filling the frame, huge eyes
    '<g filter="url(#rg__U__)">' +
      '<path d="M75 20C42 20 34 54 36 96c2 40 18 80 39 92 21-12 37-52 39-92 2-42-6-76-39-76Z" fill="url(#sk__U__)"/>' +
      '<path d="M36 96C30 54 42 14 75 14s45 40 39 82c6-26 0-58-16-70 12 16 12 40 8 50 4-30-10-46-31-46S52 60 56 90c-4-10-16-40-2-58C38 48 40 70 36 96Z" fill="#050505"/>' +
      '<path d="M75 20c16 14 30 92 24 124 10-14 18-54 16-90-2-34-14-50-40-34Z" fill="#000" opacity="0.3"/>' +
      '<path d="M44 78q16-10 28-2M106 78q-16-10-28-2" stroke="#000" stroke-width="3" fill="none"/>' +
      '<ellipse cx="58" cy="98" rx="14" ry="16" fill="#f3f1ea"/><circle cx="58" cy="100" r="5.5" fill="#000"/><circle cx="55" cy="96" r="1.6" fill="#fff"/>' +
      '<ellipse cx="93" cy="98" rx="14" ry="16" fill="#f3f1ea"/><circle cx="93" cy="100" r="5.5" fill="#000"/><circle cx="90" cy="96" r="1.6" fill="#fff"/>' +
      '<path d="M75 108l-5 22q5 4 10 0z" fill="#000" opacity="0.3"/>' +
      '<ellipse cx="75" cy="156" rx="11" ry="9" fill="#000"/>' +
    '</g>',
    // 5 — shadow figure with faint glowing eyes in fog
    '<g>' +
      '<path d="M75 40C52 40 44 64 44 92c0 18-8 30-14 44-6 14-10 24-10 24h110s-4-10-10-24c-6-14-14-26-14-44 0-28-8-52-31-52Z" fill="#000"/>' +
      '<path d="M75 40c-23 0-31 24-31 52 0 18-8 30-14 44h22c-2-30 0-66 8-82 6-12 14-16 15-14Z" fill="#0c0c0c"/>' +
      '<ellipse cx="63" cy="84" rx="6" ry="4.5" fill="#e9e7e0" opacity="0.92"/>' +
      '<ellipse cx="87" cy="84" rx="6" ry="4.5" fill="#e9e7e0" opacity="0.92"/>' +
      '<ellipse cx="63" cy="84" rx="2.4" ry="2" fill="#fff"/><ellipse cx="87" cy="84" rx="2.4" ry="2" fill="#fff"/>' +
      '<g fill="#9b988f" opacity="0.16"><ellipse cx="75" cy="170" rx="70" ry="30"/><ellipse cx="40" cy="150" rx="34" ry="20"/><ellipse cx="112" cy="150" rx="34" ry="20"/></g>' +
    '</g>'
  ];

  var faceUid = 0;
  function buildFace(index) {
    var face = FACES[index % FACES.length];
    var uid = "f" + (faceUid++);
    var svg =
      '<svg class="vthumb__svg" viewBox="0 0 150 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        FACE_DEFS +
        '<rect width="150" height="200" fill="url(#bg__U__)"/>' +
        face +
        '<rect width="150" height="200" fill="url(#vg__U__)"/>' +
        '<rect width="150" height="200" filter="url(#gr__U__)" opacity="0.42"/>' +
      '</svg>';
    return svg.replace(/__U__/g, uid).replace(/__S__/g, String((index % 7) + 1));
  }

  /* =====================================================================
     IMAGE MANIFEST  (js/assets-manifest.js -> window.FRIGHT_ASSETS)
     Resolves a dot-path like "cards.tickets" to its image URL and applies it
     to any [data-asset] element: <img> gets src, anything else gets a
     background-image. Missing files fall back to the built-in CSS/SVG art.
     ================================================================== */
  function getAsset(path) {
    var a = window.FRIGHT_ASSETS;
    if (!a || !path) return null;
    return path.split(".").reduce(function (o, k) { return o == null ? null : o[k]; }, a);
  }
  function initAssets() {
    // Hero video: inject the <source> from the manifest and start it. If there
    // is no heroVideo the <video> just shows its SVG poster (graceful).
    var heroVid = document.querySelector("[data-hero-video]");
    if (heroVid) {
      var vurl = window.FRIGHT_ASSETS && window.FRIGHT_ASSETS.heroVideo;
      if (vurl) {
        var src = document.createElement("source");
        src.setAttribute("src", vurl);
        src.setAttribute("type", "video/mp4");
        heroVid.insertBefore(src, heroVid.firstChild);
        try { heroVid.load(); } catch (e) {}
        var played = heroVid.play && heroVid.play();
        if (played && played.catch) played.catch(function () { /* autoplay blocked; muted should allow it */ });
      }
    }

    document.querySelectorAll("[data-asset]").forEach(function (node) {
      var url = getAsset(node.getAttribute("data-asset"));
      var isImg = node.tagName === "IMG";
      var host = node.closest(".card, .location, .feature");

      // Hero: a missing image swaps to the hand-built SVG illustration.
      if (isImg && node.classList.contains("hero__bg")) {
        node.onerror = function () {
          node.onerror = null;
          node.src = "assets/img/hero-haunted-woods.svg";
          node.classList.add("hero__bg--fallback");
        };
        if (url) node.src = url; else node.onerror();
        return;
      }

      // No image for this section -> reveal the built-in CSS/SVG fallback art.
      if (!url) {
        if (host) host.classList.add("is-noimg");
        if (isImg) node.style.display = "none";
        return;
      }

      if (isImg) {
        // Section <img> shown full-size; if it fails, hide it and show fallback.
        node.onerror = function () {
          node.onerror = null;
          node.style.display = "none";
          if (host) host.classList.add("is-noimg");
        };
        node.src = url;
      } else {
        node.style.backgroundImage = "url('" + url + "')";
      }
    });
  }

  /* ----- helpers -------------------------------------------------------- */
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

    function open(video, faceIndex) {
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
          '<div class="modal__ph">' + buildFace(faceIndex || 0) +
          '<div class="modal__ph-txt">VIDEO COMING SOON<span>Real people. Real fear.</span></div></div>';
      }
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("open");
      frame.innerHTML = "";
      document.body.style.overflow = "";
    }

    $(".modal__close", modal).addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    window.__frightOpenVideo = open;
  }

  /* =====================================================================
     CAROUSEL
     ================================================================== */
  function initCarousel() {
    var track = $("#video-track");
    if (!track) return;

    DATA.videos.forEach(function (v, i) {
      var tile = el("button", "vthumb");
      tile.setAttribute("aria-label", "Play " + v.title);
      // Generated scary-face is the base layer (and the graceful fallback).
      // A real thumbnail, if present, is layered on top via background-image
      // (background images fail silently — no console error if missing).
      var inner = '<span class="vthumb__face">' + buildFace(i) + "</span>";
      // thumbnail comes from the manifest (assets/img/videos/fear-0X/image.png),
      // falling back to any thumb set in data.js, then to the generated face.
      var thumb = getAsset("videos." + i);
      if (thumb == null && window.FRIGHT_ASSETS && Array.isArray(window.FRIGHT_ASSETS.videos)) {
        thumb = window.FRIGHT_ASSETS.videos[i];
      }
      thumb = thumb || v.thumb;
      if (thumb) {
        inner += '<span class="vthumb__img" style="background-image:url(\'' + thumb + '\')"></span>';
      }
      inner += '<span class="vthumb__grade">REAL FEAR</span>';
      inner += '<div class="vthumb__play">' + SVG.play + "</div>";
      tile.innerHTML = inner;
      tile.addEventListener("click", function () {
        if (window.__frightOpenVideo) window.__frightOpenVideo(v, i);
      });
      track.appendChild(tile);
    });

    var prev = $(".carousel__btn--prev");
    var next = $(".carousel__btn--next");
    function step() { return Math.max(track.clientWidth * 0.8, 200); }
    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
  }

  /* =====================================================================
     GALLERY
     ================================================================== */
  function initGallery() {
    var grid = $("#gallery-grid");
    if (!grid) return;
    DATA.gallery.forEach(function (g, i) {
      var tile = el("figure", "gtile");
      tile.innerHTML = g.src
        ? '<img src="' + g.src + '" alt="' + g.caption + '">'
        : buildFace(i + 2);
      tile.innerHTML += '<figcaption class="gtile__cap">' + g.caption + "</figcaption>";
      grid.appendChild(tile);
    });
  }

  /* ----- boot ----------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initAssets();
    initNav();
    initDirections();
    initModal();
    initCarousel();
    initGallery();
  });
})();
