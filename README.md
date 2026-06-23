# Fright Trail — Twenty Acres of Haunted Woods

Black-and-white, distressed, vintage-haunted-attraction homepage for Fright Trail
(Scott, Louisiana). Static HTML/CSS/JS — no build step. Just open `index.html`.

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python -m http.server 8000
# then visit http://localhost:8000
```

## Files
```
index.html        Homepage (hero, video carousel, cards, location, gallery, features)
tickets.html      Ticket checkout placeholder  (→ Stripe)
merch.html        Merch store placeholder      (→ Stripe / products)
volunteer.html    Volunteer form placeholder   (→ form backend)
css/styles.css    All styles (shared by every page)
js/data.js        ← EDIT THIS to add real content (videos, gallery, dates, products)
js/main.js        Carousel, video modal, mobile nav, directions
assets/img/       Drop real photos here
```

## How to plug in real content later

### 1. YouTube Shorts / videos (carousel)
Edit `js/data.js` → `videos[]`. Set `youtubeId` to a real video id:
```js
{ id: "v1", title: "Real People. Real Fear. #1", youtubeId: "dQw4w9WgXcQ", thumb: "assets/img/face1.jpg" }
```
- `youtubeId` → embeds the YouTube/Shorts player in the modal.
- `src` (mp4 path) → plays a self-hosted video instead.
- `thumb` → real thumbnail; leave `null` for the drawn placeholder.

### 2. Gallery photos
Edit `js/data.js` → `gallery[]`, set `src: "assets/img/g1.jpg"`.

### 3. Stripe tickets
In `tickets.html`, replace the placeholder `submit` handler with a call to your
backend that creates a [Stripe Checkout Session](https://stripe.com/docs/checkout)
and `window.location` to `session.url`. Map each ticket tier to a Stripe price ID.

### 4. Stripe merch
Add `priceId` to each product in `js/data.js` → `products[]`, then in `merch.html`
swap the "Add to Cart" alert for a Checkout Session (single item or cart).

### 5. Volunteer form
In `volunteer.html`, point the `<form>` at Formspree / Netlify Forms / your endpoint
and remove the placeholder handler.

### 6. Location / directions
Edit `js/data.js` → `location.mapsQuery` with the exact street address. Every
`[data-directions]` link updates automatically.

## Design notes
- Strictly black & white (grayscale), distressed film-grain overlay, smoke, vignette.
- Fonts: **Metal Mania** (display), **Special Elite** (body), **Oswald** (labels).
- Horror art (skull, spiderweb, icons) is inline SVG so it works with no image
  assets; replace with real poster art any time.
- Fully responsive with a mobile hamburger menu.
