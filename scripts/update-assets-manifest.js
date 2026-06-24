#!/usr/bin/env node
/* =============================================================================
   FRIGHT TRAIL — asset manifest generator
   -----------------------------------------------------------------------------
   Scans each section image folder and writes js/assets-manifest.js pointing at
   the image you actually dropped in (any filename, any supported extension).

   Run it whenever you add/replace images:

       node scripts/update-assets-manifest.js

   Rules:
     - Ignores README.txt, .DS_Store, Thumbs.db and hidden (dot) files.
     - Accepts: .png .jpg .jpeg .webp .gif
     - If a folder has several images, the NEWEST (by modified time) wins.
     - If a folder has no valid image, the previous manifest path is kept if its
       file still exists; otherwise the section is reported as having no image.
     - Paths are relative and URL-encoded so spaces / parentheses / etc. work.

   This file is regenerated automatically — do not hand-edit js/assets-manifest.js.
   ========================================================================== */
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MANIFEST = path.join(ROOT, "js", "assets-manifest.js");

const VALID_EXT = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const IGNORE = new Set(["readme.txt", ".ds_store", "thumbs.db"]);

/* section key (dot-path) -> folder (relative to project root) */
const SECTIONS = [
  { key: "hero",                     dir: "assets/img/hero/main" },
  { key: "cards.tickets",            dir: "assets/img/cards/tickets" },
  { key: "cards.merch",              dir: "assets/img/cards/merch" },
  { key: "cards.dates",              dir: "assets/img/cards/dates" },
  { key: "location",                 dir: "assets/img/location/main" },
  { key: "features.acresOfFear",     dir: "assets/img/features/acres-of-fear" },
  { key: "features.notForChildren",  dir: "assets/img/features/not-for-children" },
  { key: "features.securityOnSite",  dir: "assets/img/features/security-on-site" },
  { key: "features.volunteer",       dir: "assets/img/features/volunteer" },
  { key: "videos.0",                 dir: "assets/img/videos/fear-01" },
  { key: "videos.1",                 dir: "assets/img/videos/fear-02" },
  { key: "videos.2",                 dir: "assets/img/videos/fear-03" },
  { key: "videos.3",                 dir: "assets/img/videos/fear-04" },
  { key: "videos.4",                 dir: "assets/img/videos/fear-05" }
];

/* URL-encode each path segment but keep the slashes (browser-safe) */
function toUrl(relPath) {
  return relPath.split("/").map(encodeURIComponent).join("/");
}

/* browser-safe URL + a cache-busting ?v=<modified-time> so a replaced image is
   never hidden by a stale browser / VS Code Live Preview cache. The token only
   changes when the file itself changes, so re-running on an unchanged folder
   produces no diff. */
function toVersionedUrl(relPath, mtimeMs) {
  return toUrl(relPath) + "?v=" + Math.round(mtimeMs);
}

function isValidImage(name) {
  if (name.startsWith(".")) return false;                 // hidden
  if (IGNORE.has(name.toLowerCase())) return false;       // README / system files
  return VALID_EXT.indexOf(path.extname(name).toLowerCase()) !== -1;
}

/* pick the newest valid image in a folder -> filename or null */
function newestImage(absDir) {
  let entries;
  try { entries = fs.readdirSync(absDir, { withFileTypes: true }); }
  catch (e) { return null; }
  const imgs = entries
    .filter(function (d) { return d.isFile() && isValidImage(d.name); })
    .map(function (d) {
      const full = path.join(absDir, d.name);
      return { name: d.name, mtime: fs.statSync(full).mtimeMs };
    })
    .sort(function (a, b) { return b.mtime - a.mtime; });
  return imgs.length ? imgs[0] : null;   // { name, mtime } | null
}

/* read previous manifest (best effort) so we can keep a still-valid path */
function readPrevManifest() {
  try {
    const txt = fs.readFileSync(MANIFEST, "utf8");
    const sandbox = { window: {} };
    // eslint-disable-next-line no-new-func
    new Function("window", txt)(sandbox.window);
    return sandbox.window.FRIGHT_ASSETS || {};
  } catch (e) { return {}; }
}
function getByPath(obj, dotKey) {
  return dotKey.split(".").reduce(function (o, k) { return o == null ? null : o[k]; }, obj);
}
function setByPath(obj, dotKey, value) {
  const parts = dotKey.split(".");
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (o[k] == null) o[k] = {};
    o = o[k];
  }
  o[parts[parts.length - 1]] = value;
}

/* decode a manifest URL back to a relative fs path to test existence */
function urlToRel(url) {
  if (!url) return null;
  try { return url.split("/").map(decodeURIComponent).join("/"); }
  catch (e) { return url; }
}

function main() {
  const prev = readPrevManifest();
  const resolved = { hero: null, cards: {}, location: null, features: {}, videos: [] };
  const report = [];

  SECTIONS.forEach(function (sec) {
    const absDir = path.join(ROOT, sec.dir);
    const found = newestImage(absDir);
    let url = null;
    let note = "";

    if (found) {
      url = toVersionedUrl(sec.dir + "/" + found.name, found.mtime);
      note = found.name;
    } else {
      // keep previous manifest path if that file still exists on disk
      const prevUrl = getByPath(prev, sec.key);
      const prevRel = urlToRel(prevUrl ? prevUrl.split("?")[0] : null);
      if (prevRel && fs.existsSync(path.join(ROOT, prevRel))) {
        url = toVersionedUrl(prevRel, fs.statSync(path.join(ROOT, prevRel)).mtimeMs);
        note = "(kept previous: " + path.basename(prevRel) + ")";
      } else {
        url = null;
        note = "!! NO VALID IMAGE — section will use built-in fallback art";
      }
    }

    setByPath(resolved, sec.key, url);
    report.push({ key: sec.key, dir: sec.dir, note: note, url: url });
  });

  // ---- serialise to the stable, readable shape ----
  const q = function (v) { return v == null ? "null" : '"' + v + '"'; };
  const out =
"/* =============================================================================\n" +
"   FRIGHT TRAIL — image asset manifest  (AUTO-GENERATED)\n" +
"   -----------------------------------------------------------------------------\n" +
"   DO NOT EDIT BY HAND. Regenerate with:\n" +
"       node scripts/update-assets-manifest.js\n" +
"\n" +
"   To change an image: drop any image (png/jpg/jpeg/webp/gif) into its section\n" +
"   folder under assets/img/... (any filename) and re-run the script above.\n" +
"   If several images are in a folder, the newest one is used. A missing image\n" +
"   gracefully falls back to the section's built-in CSS/SVG art.\n" +
"   ========================================================================== */\n" +
"window.FRIGHT_ASSETS = {\n" +
"  hero: " + q(resolved.hero) + ",\n" +
"\n" +
"  cards: {\n" +
"    tickets: " + q(resolved.cards.tickets) + ",\n" +
"    merch:   " + q(resolved.cards.merch) + ",\n" +
"    dates:   " + q(resolved.cards.dates) + "\n" +
"  },\n" +
"\n" +
"  location: " + q(resolved.location) + ",\n" +
"\n" +
"  features: {\n" +
"    acresOfFear:    " + q(resolved.features.acresOfFear) + ",\n" +
"    notForChildren: " + q(resolved.features.notForChildren) + ",\n" +
"    securityOnSite: " + q(resolved.features.securityOnSite) + ",\n" +
"    volunteer:      " + q(resolved.features.volunteer) + "\n" +
"  },\n" +
"\n" +
"  videos: [\n" +
    resolved.videos.map(function (v) { return "    " + q(v); }).join(",\n") + "\n" +
"  ]\n" +
"};\n";

  fs.writeFileSync(MANIFEST, out, "utf8");

  // ---- report ----
  console.log("\nFright Trail — asset manifest updated -> js/assets-manifest.js\n");
  let missing = 0;
  report.forEach(function (r) {
    const flag = r.url ? "OK " : "MISS";
    if (!r.url) missing++;
    console.log("  [" + flag + "] " + r.key.padEnd(22) + " " + r.note);
  });
  console.log("\n  " + (report.length - missing) + "/" + report.length + " sections have an image" +
              (missing ? "  (" + missing + " using fallback art)" : "") + "\n");
}

main();
