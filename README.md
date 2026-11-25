# গ্রাম গঞ্জের হাট: Date Palm Jaggery Landing Page

Static site: HTML + **Tailwind CSS (Play CDN)** + vanilla JS. No backend, no install, no build step.
Open `index.html` directly, or deploy on GitHub Pages (Settings > Pages > Deploy from a branch > `main` / root).

## Prices and settings: `script.js` > `CONFIG` (top of file)
- `pricePerKg` per product (patali 250, jhola 500, danadar 400, nolen 650). Pack price = per-kg price x weight.
- `delivery.charge`: 0 shows "to be confirmed"; set a number when decided. Totals say "ডেলিভারি বাদে" until then.
- `whatsapp`: real number with country code, no `+` (e.g. `8801712345678`). Until then the WhatsApp button shows a notice.
- `products[].available`: `true` = sold, `false` = information only. Packs: `discountPct` (0 = none).
- Phone, Facebook, email in the same block.

## Photos: `assets/images/`
Added so far: hero, patali, jhola, danadar, nolen, step-1, step-2, step-4, step-5 (step images are crops of hero.jpg).
Still illustrations: `step-3`, `step-6`, `why-hygiene`, `why-packaging`.
Illustrations show by default. Add your own photos with these exact names and they appear automatically:
- `hero.jpg`
- Process steps: `step-1.jpg` (tree), `step-2.jpg` (sap pot), `step-3.jpg` (filtering), `step-4.jpg` (boiling), `step-5.jpg` (jaggery), `step-6.jpg` (packing/delivery)
- Why Us: `why-hygiene.jpg` (clean pots/containers, hygienic handling), `why-packaging.jpg` (packaging and packing area)
- Products: `patali.jpg`, `jhola.jpg`, `danadar.jpg`, `nolen.jpg`
Use your own photos (best for trust) or properly licensed stock. About 1200px wide, compressed.

## Owner checklist (yellow badges on the page)
Source details, packaging type, batch format/date, lab report or certificate (only if it exists), delivery areas and charge,
Cash on Delivery/payment, return policy, Privacy and Terms pages. Remove a badge's `<span class="tbc">` once confirmed.
Do not add "organic", "100% pure" or "chemical-free" without proof.

## Notes
- Orders are not stored. The form builds a Bengali WhatsApp message; an order exists only after the customer sends it.
- The Tailwind Play CDN is great for static demos. For heavy traffic, you can later compile Tailwind with its CLI.
- Fonts (Google Fonts), icons (Font Awesome) and Tailwind load from CDNs, so an internet connection is needed.
