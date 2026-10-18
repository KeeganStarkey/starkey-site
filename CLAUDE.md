# Starkey Productions website

Live site for keeganstarkey.com. Astro (static output), hosted on Netlify, video on Mux.

## Commands
- `npm run dev` · local dev server
- `npm run build` · builds to `dist/` (Netlify runs this on every push to `main`)

## Where things live
- `src/data/site.ts` · contact details, socials, client names, testimonial, sister brands, nav. Edit here, never in pages.
- `src/data/videos.ts` · every clip by key. Set `mux` to a Mux playback ID to switch a clip from the stand-in file in `public/media/` to Mux streaming. `film: true` puts it on /work/ and makes it open in the player.
- `src/pages/` · one file per page. Service pages share the components in `src/components/`.
- `src/styles/base.css` shared · `home.css` homepage only · `inner.css` every other page.
- `src/scripts/` · `footage.ts` (lazy loops, Mux/HLS, live camera frame, timecode), `chrome.ts` (header, menu, mobile bar, logo light, footer, form), `lightbox.ts` (film player), `eggs.ts` (Easter eggs), `home.ts`, `filter.ts`.
- `netlify.toml` · redirects from old Wix URLs, security headers (CSP), caching.

## Rules
- Design direction is "Noir": dark, cinematic, camera-frame styling for any video smaller than fullscreen. Only the homepage hero is fullscreen; inner pages use the framed hero.
- Always write "Starkey Productions" in copy, never just "Starkey".
- No prices anywhere on the site. Pricing questions are answered without numbers.
- Publishing/posting is presented as its own service, never "included free".
- Contact is form, WhatsApp and email only. No call booking.
- Golf belongs to Bad At Golf and weddings to Wedding Diaries; keep them off this site except the footer links.
- One H1 per page with its main search phrase; keyword plan per page is in the claude.ai project doc `website/seo-keyword-map.md`.
- The inline script in `Header.astro` is allowed by a sha256 hash in the CSP (`netlify.toml`). If you change it, update the hash.
- Enquiry forms are Netlify Forms (`enquiry`, `event-enquiry`). Netlify finds them in the built HTML; keep `data-netlify`, `form-name` and the honeypot.
- Respect `prefers-reduced-motion` for anything animated.
