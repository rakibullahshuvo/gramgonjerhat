'use strict';
document.documentElement.classList.add('js');

/* =====================================================================
   CONFIG: edit this block to update products, prices and contact details.
   Prices are per kg. Anything marked "placeholder" needs the owner's input.
   ===================================================================== */
const CONFIG = {
  whatsapp: '8801XXXXXXXXX',            // placeholder: country code + number, no "+" (e.g. 8801712345678)
  phone: '০১XXX-XXXXXX', facebook: 'facebook.com/আপনার-পেজ', email: 'info@example.com',
  pricesConfirmed: true,                // owner-provided per-kg prices below
  defaultPricePerKg: 250,               // used only if a product has no pricePerKg
  delivery: { charge: 0 },              // 0 = "to be confirmed". Set a number when decided.
  /* available:true = sold now. false = shown as information only. */
  products: [
    { id: 'patali',  name: 'পাটালি গুড়',  available: true, pricePerKg: 250, desc: 'জমাট বাঁধা, টুকরো করে কাটা যায়। চা, পিঠা বা এমনি খাওয়ার জন্য।' },
    { id: 'jhola',   name: 'ঝোলা গুড়',    available: true, pricePerKg: 500, desc: 'ঘন তরল গুড়। পায়েস, পিঠা ও রুটির সঙ্গে সহজে ব্যবহারযোগ্য।' },
    { id: 'danadar', name: 'দানাদার গুড়', available: true, pricePerKg: 400, desc: 'ছোট দানার মতো গুড়। মেপে নেওয়া ও রান্নায় মেশানো সহজ।' },
    { id: 'nolen',   name: 'নলেন গুড়',    available: true, pricePerKg: 650, desc: 'শীতের শুরুর দিকের রসে তৈরি বলে পরিচিত, সুগন্ধি ও বিশেষ স্বাদের গুড়।' }
  ],
  /* discountPct: 0 = no discount. Savings are shown only when above 0. */
  packs: [
    { id: '250',  kg: 0.25, label: '২৫০ গ্রাম', name: 'ট্রায়াল প্যাক',  discountPct: 0 },
    { id: '500',  kg: 0.5,  label: '৫০০ গ্রাম', name: 'ফ্যামিলি প্যাক',  discountPct: 0, popular: true },
    { id: '1000', kg: 1,    label: '১ কেজি',    name: 'ভ্যালু প্যাক',   discountPct: 0 },
    { id: '2000', kg: 2,    label: '২ কেজি',    name: 'ফ্যামিলি কম্বো', discountPct: 0 }
  ]
};
const DISTRICTS = 'Bagerhat,Bandarban,Barguna,Barishal,Bhola,Bogura,Brahmanbaria,Chandpur,Chapai Nawabganj,Chattogram,Chuadanga,Cumilla,Cox\'s Bazar,Dhaka,Dinajpur,Faridpur,Feni,Gaibandha,Gazipur,Gopalganj,Habiganj,Jamalpur,Jashore,Jhalokathi,Jhenaidah,Joypurhat,Khagrachhari,Khulna,Kishoreganj,Kurigram,Kushtia,Lakshmipur,Lalmonirhat,Madaripur,Magura,Manikganj,Meherpur,Moulvibazar,Munshiganj,Mymensingh,Naogaon,Narail,Narayanganj,Narsingdi,Natore,Netrokona,Nilphamari,Noakhali,Pabna,Panchagarh,Patuakhali,Pirojpur,Rajbari,Rajshahi,Rangamati,Rangpur,Satkhira,Shariatpur,Sherpur,Sirajganj,Sunamganj,Sylhet,Tangail,Thakurgaon'.split(',');

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const bn = n => Number(n).toLocaleString('bn-BD');
const money = n => '৳' + bn(Math.round(n));
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage blocked */ } };
const prod = id => CONFIG.products.find(p => p.id === id);
const pack = id => CONFIG.packs.find(k => k.id === id);
const perKg = p => p.pricePerKg ?? CONFIG.defaultPricePerKg;
const regular = (p, k) => Math.round(perKg(p) * k.kg);
const sale = (p, k) => Math.round(perKg(p) * k.kg * (1 - (k.discountPct || 0) / 100));
const sellable = () => CONFIG.products.filter(p => p.available);

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'pop rounded-xl border border-gold bg-deep px-5 py-3 text-[.92rem] text-cream shadow-lg'; t.textContent = msg;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3200);
}

/* ---------- picture slots ----------
   Each slot shows an illustration. If assets/images/<key>.jpg exists, the photo is shown on top.
   Keys: step-1..step-6, why-hygiene, why-packaging, patali, jhola, danadar, nolen, hero (hero is in index.html). */
const ART = {
  patali: '<g fill="#8A4A26"><rect x="40" y="82" width="120" height="30" rx="8"/></g><g fill="#6B3F25"><rect x="48" y="52" width="104" height="30" rx="8"/></g><g fill="#A5602F"><rect x="58" y="24" width="84" height="28" rx="8"/></g><path d="M62 36h76M52 66h96M44 96h112" stroke="#C58A3A" stroke-width="2" opacity=".6"/>',
  jhola: '<path d="M42 70h116c0 44-24 66-58 66S42 114 42 70z" fill="#B5683A"/><ellipse cx="100" cy="70" rx="58" ry="14" fill="#6B3F25"/><ellipse cx="100" cy="70" rx="48" ry="9" fill="#3B2418"/><path d="M92 62q4-8 10 0" stroke="#C58A3A" stroke-width="3" fill="none"/>',
  danadar: '<path d="M30 126q70-100 140 0z" fill="#A5602F"/><g fill="#C58A3A"><circle cx="86" cy="92" r="4"/><circle cx="104" cy="84" r="4"/><circle cx="120" cy="100" r="4"/><circle cx="96" cy="108" r="4"/><circle cx="70" cy="112" r="4"/><circle cx="134" cy="116" r="4"/><circle cx="110" cy="70" r="3.5"/></g>',
  nolen: '<path d="M100 0v26" stroke="#3B2418" stroke-width="3"/><path d="M70 50h60c0 42-14 70-30 70S70 92 70 50z" fill="#B5683A"/><rect x="76" y="38" width="48" height="14" rx="6" fill="#8A4A28"/><path d="M100 124c-6 10-6 16 0 16s6-6 0-16z" fill="#C58A3A"/>',
  'step-1': '<rect width="200" height="150" fill="#F0C98A"/><circle cx="160" cy="34" r="14" fill="#F8E6BC"/><path d="M0 120q100-30 200 0v30H0z" fill="#526B45"/><path d="M96 130c3-30-3-60 3-90" stroke="#3B2418" stroke-width="7" fill="none" stroke-linecap="round"/><g stroke="#2F4A2C" stroke-width="3.5" fill="none" stroke-linecap="round"><path d="M99 40q-24-18-44-2"/><path d="M99 40q-20-28-38-20"/><path d="M99 40q24-18 44-2"/><path d="M99 40q20-28 38-20"/><path d="M99 40q0-30-4-36"/></g>',
  'step-2': '<rect x="56" y="0" width="38" height="150" fill="#6B4A2E"/><path d="M64 0v150M78 0v150" stroke="#4d3320" stroke-width="2"/><path d="M94 56l14 8" stroke="#3B2418" stroke-width="3"/><ellipse cx="122" cy="82" rx="18" ry="22" fill="#B5683A"/><rect x="112" y="58" width="20" height="7" rx="3" fill="#8A4A28"/><path d="M104 40c-4 6-4 10 0 10s4-4 0-10z" fill="#C58A3A"/>',
  'step-3': '<path d="M60 36h80l-26 40h-28z" fill="#fff" stroke="#6B3F25" stroke-width="3"/><path d="M72 48h56M80 60h40" stroke="#D9C9A5" stroke-width="2"/><rect x="92" y="76" width="16" height="12" fill="#6B3F25"/><path d="M70 100h60c0 26-12 40-30 40s-30-14-30-40z" fill="#B5683A"/><path d="M100 90v8" stroke="#C58A3A" stroke-width="3"/>',
  'step-4': '<ellipse cx="100" cy="82" rx="64" ry="16" fill="#3B2418"/><ellipse cx="100" cy="80" rx="56" ry="11" fill="#A5602F"/><path d="M52 96h96l-10 36H62z" fill="#8A4A28"/><path d="M84 132q-6-18 4-26q2 12 10 8q8 4 4 18z" fill="#C58A3A"/><g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"><path d="M80 60q-6-10 0-18"/><path d="M104 56q-6-10 0-18"/><path d="M126 60q-6-10 0-18"/></g>',
  'step-6': '<path d="M50 60l50-22 50 22v52l-50 22-50-22z" fill="#C9A06A"/><path d="M50 60l50 22 50-22M100 82v52" stroke="#8A6A3A" stroke-width="3" fill="none"/><rect x="88" y="58" width="24" height="10" fill="#F7F1E5" opacity=".8"/>',
  'why-hygiene': '<path d="M62 66h76c0 38-16 62-38 62S62 104 62 66z" fill="#B5683A"/><ellipse cx="100" cy="66" rx="38" ry="10" fill="#6B3F25"/><path d="M58 52q42-26 84 0" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/><g fill="#fff"><path d="M40 36l4 10 10 4-10 4-4 10-4-10-10-4 10-4z"/><path d="M160 100l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></g>',
  'why-packaging': '<rect x="66" y="40" width="68" height="80" rx="10" fill="#fff" stroke="#6B3F25" stroke-width="3"/><rect x="62" y="30" width="76" height="16" rx="6" fill="#6B3F25"/><rect x="78" y="62" width="44" height="30" rx="4" fill="#C58A3A"/><path d="M84 74h32M84 82h24" stroke="#3B2418" stroke-width="3"/>'
};
ART['step-5'] = ART.patali;
const slot = (key, alt, cls = 'aspect-[4/3]') => `<div class="relative ${cls} overflow-hidden bg-cream2" role="img" aria-label="${alt}">
  <svg class="absolute inset-0 h-full w-full" viewBox="0 0 200 150" aria-hidden="true"><rect width="200" height="150" fill="#E9D7B4"/>${ART[key] || ''}</svg>
  <img class="absolute inset-0 h-full w-full object-cover" src="assets/images/${key}.jpg" alt="" loading="lazy" onerror="this.remove()"></div>`;

/* ---------- state: order list saved in localStorage ---------- */
let cart = load('ggh-cart', []).filter(i => prod(i.p) && pack(i.k) && i.q > 0);
function addItem(p, k, q) {
  const f = cart.find(i => i.p === p && i.k === k);
  if (f) f.q = Math.min(f.q + q, 50); else cart.push({ p, k, q: Math.min(q, 50) });
  renderCart();
}
const totals = () => {
  const sub = cart.reduce((s, i) => s + sale(prod(i.p), pack(i.k)) * i.q, 0);
  return { sub, del: CONFIG.delivery.charge, total: sub + CONFIG.delivery.charge, n: cart.reduce((s, i) => s + i.q, 0) };
};

/* ---------- renderers ---------- */
function renderProducts() {
  const k0 = CONFIG.packs[1];
  $('#productGrid').innerHTML = CONFIG.products.map(p => {
    const head = `${slot(p.id, p.name)}<div class="grid flex-1 content-start gap-2.5 p-5"><h3 class="font-head text-xl">${p.name}</h3><p class="text-[.93rem] leading-relaxed text-mute">${p.desc}</p>`;
    if (!p.available) return `<article class="reveal card flex flex-col overflow-hidden">${head}<p class="rounded-[10px] bg-cream2 px-3 py-2 text-sm text-mute">তথ্যমূলক: এই ধরন এখন বিক্রির জন্য নেই।</p></div></article>`;
    return `<article class="reveal card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl" data-id="${p.id}">${head}
      <p class="text-xs text-mute">প্রতি কেজি ${money(perKg(p))}</p>
      <div class="flex items-baseline gap-2"><b class="pp text-2xl text-brown">${money(sale(p, k0))}</b><s class="pr text-sm text-mute"></s></div>
      <div class="grid grid-cols-[1fr_84px] gap-2"><select class="pk inp" aria-label="${p.name} প্যাকেজ">${CONFIG.packs.map(k => `<option value="${k.id}" ${k === k0 ? 'selected' : ''}>${k.label}</option>`).join('')}</select>
      <input class="qt inp" type="number" min="1" max="50" value="1" aria-label="${p.name} পরিমাণ"></div>
      <button class="btn btn-gold" data-add><i class="fa-solid fa-basket-shopping"></i> অর্ডারে যোগ করুন</button></div></article>`;
  }).join('');
  $$('[data-id]').forEach(updateCardPrice);
}
function updateCardPrice(card) {
  const p = prod(card.dataset.id), k = pack($('.pk', card).value), q = Math.max(1, +$('.qt', card).value || 1);
  $('.pp', card).textContent = money(sale(p, k) * q);
  $('.pr', card).textContent = k.discountPct ? money(regular(p, k) * q) : '';
}

function renderCart() {
  save('ggh-cart', cart);
  const t = totals();
  $('#orderItems').innerHTML = cart.length ? cart.map((i, idx) => {
    const p = prod(i.p), k = pack(i.k);
    return `<div class="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 border-b border-line py-2.5 text-[.94rem]"><span>${p.name}, ${k.label}</span><b>${money(sale(p, k) * i.q)}</b>
      <div class="col-span-full flex items-center gap-1.5"><button type="button" class="h-8 w-8 rounded-full border border-line" data-qty="${idx}:-1" aria-label="কমান">&minus;</button><span class="min-w-6 text-center">${bn(i.q)}</span><button type="button" class="h-8 w-8 rounded-full border border-line" data-qty="${idx}:1" aria-label="বাড়ান">+</button><button type="button" class="ml-auto text-sm text-mute underline" data-rm="${idx}">সরান</button></div></div>`;
  }).join('') : '<p class="py-3 text-mute">এখনো কোনো গুড় যোগ করা হয়নি।</p>';
  $('#sumSub').textContent = money(t.sub);
  $('#sumDel').textContent = t.del ? money(t.del) : 'নিশ্চিত করা হবে';
  $('#sumTotalLbl').textContent = t.del ? 'মোট' : 'মোট (ডেলিভারি বাদে)';
  $('#sumTotal').textContent = money(t.total);
  [$('#cartCount'), $('#stickyCount')].forEach(el => { el.textContent = bn(t.n); el.dataset.n = t.n; });
  $('#stickyTotal').textContent = money(t.total);
}

/* ---------- order form & WhatsApp ---------- */
const FIELDS = {
  name: v => v.trim().length >= 2 || 'আপনার নাম লিখুন।',
  phone: v => /^(?:\+?88)?01[3-9]\d{8}$/.test(v.replace(/[\s-]/g, '')) || 'সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন 01712345678)।',
  address: v => v.trim().length >= 8 || 'বাড়ি/রাস্তা সহ পূর্ণ ঠিকানা লিখুন।',
  district: v => DISTRICTS.some(d => d.toLowerCase() === v.trim().toLowerCase()) || 'তালিকা থেকে আপনার জেলা বেছে নিন।'
};
function validate() {
  let ok = true, first = null;
  for (const [id, rule] of Object.entries(FIELDS)) {
    const el = $('#' + id), r = rule(el.value);
    $('#e-' + id).textContent = r === true ? '' : r; el.classList.toggle('bad', r !== true);
    if (r !== true) { ok = false; first = first || el; }
  }
  if (!cart.length) addItem($('#selProduct').value, $('#selPack').value, Math.max(1, +$('#selQty').value || 1)); // auto-add current selection
  $('#e-cart').textContent = '';
  if (first) first.focus();
  return ok;
}
function buildMessage() {
  const t = totals(), v = id => $('#' + id).value.trim();
  const lines = cart.map((i, n) => `${bn(n + 1)}. ${prod(i.p).name}, ${pack(i.k).label} × ${bn(i.q)} = ${money(sale(prod(i.p), pack(i.k)) * i.q)}`);
  const price = CONFIG.pricesConfirmed
    ? `সাবটোটাল: ${money(t.sub)}\nডেলিভারি: ${t.del ? money(t.del) : 'নিশ্চিত করে জানানো হবে'}\nমোট: ${money(t.total)}${t.del ? '' : ' (ডেলিভারি চার্জ বাদে)'}`
    : 'মূল্য: নিশ্চিত করে জানানো হবে';
  return `গ্রাম গঞ্জের হাট: নতুন অর্ডার\n\nনাম: ${v('name')}\nমোবাইল: ${v('phone')}\nঠিকানা: ${v('address')}, ${v('district')}\n\nঅর্ডার:\n${lines.join('\n')}\n\n${price}${v('notes') ? '\n\nনির্দেশনা: ' + v('notes') : ''}`;
}
function sendWhatsApp(msg) {
  if (/X/i.test(CONFIG.whatsapp)) { toast('WhatsApp নম্বর এখনো বসানো হয়নি। বার্তাটি কপি করে ব্যবহার করুন।'); return; }
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}
$('#orderForm').addEventListener('submit', e => {
  e.preventDefault();
  if (!validate()) return;
  renderCart(); $('#msgPreview').textContent = buildMessage(); $('#confirmBox').hidden = false; $('#confirmBox').scrollIntoView({ block: 'center' });
});
$('#waBtn').onclick = () => { if (validate()) { renderCart(); sendWhatsApp(buildMessage()); } };
$('#sendBtn').onclick = () => sendWhatsApp($('#msgPreview').textContent);
$('#copyBtn').onclick = async () => { try { await navigator.clipboard.writeText($('#msgPreview').textContent); toast('বার্তা কপি হয়েছে'); } catch { toast('কপি করা যায়নি, বার্তা হাতে নির্বাচন করুন।'); } };
$('#addItem').onclick = () => { addItem($('#selProduct').value, $('#selPack').value, Math.max(1, +$('#selQty').value || 1)); toast('অর্ডারে যোগ হয়েছে'); };

/* ---------- global events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-add],[data-qty],[data-rm],[data-soon]'); if (!t) return;
  if ('add' in t.dataset) { const c = t.closest('[data-id]'); addItem(c.dataset.id, $('.pk', c).value, Math.max(1, +$('.qt', c).value || 1)); toast(`${prod(c.dataset.id).name} অর্ডারে যোগ হয়েছে`); }
  else if (t.dataset.qty) { const [i, d] = t.dataset.qty.split(':').map(Number); cart[i].q = Math.min(50, cart[i].q + d); if (cart[i].q <= 0) cart.splice(i, 1); renderCart(); }
  else if (t.dataset.rm) { cart.splice(+t.dataset.rm, 1); renderCart(); }
  else if (t.dataset.soon) { e.preventDefault(); toast(`${t.dataset.soon} পেজ শিগগিরই যুক্ত হবে।`); }
});
document.addEventListener('input', e => { const c = e.target.closest('[data-id]'); if (c) updateCardPrice(c); if (e.target.matches('.bad')) e.target.classList.remove('bad'); });

/* Mobile navigation (Tailwind: nav has "hidden" on small screens) */
const menuBtn = $('#menuBtn'), nav = $('#mainNav');
const setMenu = o => { nav.classList.toggle('hidden', !o); menuBtn.setAttribute('aria-expanded', o); };
menuBtn.onclick = () => setMenu(nav.classList.contains('hidden'));
nav.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* FAQ: keep one answer open at a time */
$$('#faqList details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('#faqList details').forEach(o => { if (o !== d) o.open = false; }); }));

/* Scroll reveal */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: .12 }) : null;
function observe() { $$('.step,.head,.q-item,.why-c,.reveal').forEach(el => { el.classList.add('reveal'); io ? io.observe(el) : el.classList.add('in'); }); }

/* ---------- init ---------- */
$$('[data-slot]').forEach(el => { el.outerHTML = slot(el.dataset.slot, el.dataset.alt, el.dataset.cls); });
$$('[data-price-note]').forEach(n => n.textContent = CONFIG.pricesConfirmed ? '' : 'মূল্য নমুনা মাত্র। চূড়ান্ত মূল্য অর্ডার নিশ্চিত করার সময় জানানো হবে।');
$$('[data-cfg]').forEach(n => { const k = n.dataset.cfg; n.textContent = k === 'whatsappShow' ? (/X/i.test(CONFIG.whatsapp) ? '০১XXX-XXXXXX' : CONFIG.whatsapp) : CONFIG[k]; });
$('#selProduct').innerHTML = sellable().map(p => `<option value="${p.id}">${p.name} (${money(perKg(p))}/কেজি)</option>`).join('');
$('#selPack').innerHTML = CONFIG.packs.map(k => `<option value="${k.id}">${k.label}, ${k.name}</option>`).join('');
$('#districtList').innerHTML = DISTRICTS.map(d => `<option value="${d}">`).join('');
$('#year').textContent = bn(new Date().getFullYear()).replace(/,/g, '');
renderProducts(); renderCart(); observe();
