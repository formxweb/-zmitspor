/* ---------- MOTOR ----------
   Magaza ayarlari assets/config.js icinde (CONFIG). Bu dosyayi degistirmene gerek yok.
   Not: Guvenlik (CSP) icin HTML'de onclick="..." kullanilmiyor; tiklamalar
   data-action="..." ozelligi ile asagidaki tek dinleyiciden yonetiliyor. */
(function () {
"use strict";

const $ = id => document.getElementById(id);
const money = n => CONFIG.currency + n.toLocaleString("tr-TR");
const grad = i => { const g = [["#3f3f3f","#161616"],["#4a4a4a","#1c1c1c"],["#363636","#131313"],["#444444","#1a1a1a"],["#3a3a3a","#151515"],["#4e4e4e","#1e1e1e"],["#333333","#121212"],["#474747","#181818"]]; const c = g[i % g.length]; return `linear-gradient(150deg,${c[0]},${c[1]})`; };
const findP = id => CONFIG.products.find(x => x.id === Number(id));

/* Sepet: tarayicida saklanan veri guvenilmez kabul edilir. Isim, fiyat ve gorsel
   her yuklemede CONFIG'den yeniden okunur; bilinmeyen urun/beden atilir. */
const CART_KEY = "izmit_cart";
let cart = [];
try {
  const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  if (Array.isArray(raw)) {
    const merged = new Map();
    raw.forEach(i => {
      const p = findP(i && i.id);
      if (!p || !p.sizes.includes(i.size)) return;
      const qty = Math.min(99, Math.max(1, parseInt(i.qty, 10) || 1));
      const key = p.id + "-" + i.size;
      const ex = merged.get(key);
      if (ex) ex.qty = Math.min(99, ex.qty + qty);
      else merged.set(key, { key, id: p.id, name: p.name, price: p.price, size: i.size, img: p.img, qty });
    });
    cart = [...merged.values()];
  }
} catch (e) {}
const save = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} };

/* ---------- SAYFA ICERIGI ---------- */
document.documentElement.style.setProperty("--accent", CONFIG.accent);
const L = CONFIG.brand.charAt(0).toUpperCase();
["logoLetter", "logoLetter2"].forEach(id => $(id).textContent = L);
$("brandName").textContent = CONFIG.brand; $("brandSub").textContent = CONFIG.brandSub;
document.title = CONFIG.fullName + " — Online Mağaza";
$("heroEyebrow").textContent = CONFIG.heroEyebrow; $("heroTitle").innerHTML = CONFIG.heroTitle; $("heroText").textContent = CONFIG.heroText;
$("bannerEy").textContent = CONFIG.bannerEy; $("bannerTitle").textContent = CONFIG.bannerTitle; $("bannerText").textContent = CONFIG.bannerText;
$("footName").textContent = CONFIG.fullName; $("footAbout").textContent = CONFIG.about;
$("footCopy").textContent = "© " + new Date().getFullYear() + " " + CONFIG.fullName;
$("footPhone").textContent = CONFIG.phone; $("footPhone").href = "tel:" + CONFIG.phone.replace(/\s/g, "");
$("footWa").href = "https://wa.me/" + CONFIG.whatsapp; $("footIg").href = "https://instagram.com/" + CONFIG.instagram;
$("heroVisual").innerHTML = CONFIG.heroImg ? `<img src="${CONFIG.heroImg}" alt="">` : `<div class="hv-ph"><div class="l">${CONFIG.brand}</div></div>`;
$("heroMeta").innerHTML = CONFIG.heroMeta.map(m => `<div class="m"><div class="n">${m[0]}</div><div class="l">${m[1]}</div></div>`).join("");
$("pays").innerHTML = ["Havale/EFT", "Kapıda Ödeme", "Kredi Kartı"].map(p => `<span>${p}</span>`).join("");
const annTxt = `Türkiye'nin her yerine kargo &nbsp;·&nbsp; <b>${money(CONFIG.shipping.freeOver)}</b> üzeri kargo bedava &nbsp;·&nbsp; Güvenli ödeme &nbsp;·&nbsp; Kapıda ödeme`;
$("track").innerHTML = `<span>${annTxt}</span><span>${annTxt}</span>`;

const trustData = [["⛟","Hızlı Kargo","1-3 iş günü teslimat"],["↺","Kolay İade","14 gün içinde değişim"],["🔒","Güvenli Ödeme","Havale, kapıda, kart"],["✆","WhatsApp Destek",CONFIG.phone]];
$("trust").innerHTML = trustData.map(t => `<div class="t"><span class="ic">${t[0]}</span><div><div class="tt">${t[1]}</div><div class="ts">${t[2]}</div></div></div>`).join("");

const FAQ = [
  ["Kargo ne zaman gelir?", "Siparişiniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilir. " + money(CONFIG.shipping.freeOver) + " ve üzeri alışverişlerde kargo ücretsizdir."],
  ["Hangi ödeme yöntemleri var?", "Havale/EFT ve kapıda ödeme (nakit veya kart) ile ödeyebilirsiniz. Online kredi kartı ödemesi yakında eklenecektir."],
  ["İade ve değişim nasıl yapılır?", "Ürünü teslim aldıktan sonra 14 gün içinde, kullanılmamış ve etiketli olmak şartıyla iade veya beden değişimi yapabilirsiniz."],
  ["Beden seçiminde yardım alabilir miyim?", "Tabii. WhatsApp'tan bize yazın, ürünün ölçülerini ve beden önerimizi paylaşalım."]
];
$("faqWrap").innerHTML = FAQ.map(f => `<details class="faq"><summary>${f[0]}<span class="ar">＋</span></summary><div class="a">${f[1]}</div></details>`).join("");

function fallback(p) { return `<div class="fallback" style="background:${grad(p.id)}"><span class="fn">${p.name}</span><span class="fc">${p.category}</span></div>`; }
function visual(p) { return p.img ? `<img src="${p.img}" alt="${p.name}">` : fallback(p); }

/* ---------- URUNLER ---------- */
let activeCat = "Tümü";
const filtersEl = $("filters");
CONFIG.categories.forEach(c => {
  const b = document.createElement("button");
  b.className = "chip" + (c === "Tümü" ? " active" : "");
  b.textContent = c;
  b.addEventListener("click", () => { activeCat = c; [...filtersEl.children].forEach(x => x.classList.remove("active")); b.classList.add("active"); renderGrid(); });
  filtersEl.appendChild(b);
});

const gridEl = $("grid");
function renderGrid() {
  const list = CONFIG.products.filter(p => activeCat === "Tümü" || p.category === activeCat);
  gridEl.innerHTML = list.map(p => `
    <div class="card"><div class="ph" data-action="quick" data-id="${p.id}">${visual(p)}<span class="tag">${p.category}</span><div class="quick">Hızlı Bak</div></div>
      <div class="info"><div class="nm">${p.name}</div><div class="ct">${p.category}</div><div class="price">${money(p.price)}</div>
      <button class="addbtn" data-action="quick-add" data-id="${p.id}">Sepete Ekle</button></div></div>`).join("");
  requestAnimationFrame(() => { [...gridEl.querySelectorAll(".card")].forEach((c, i) => setTimeout(() => c.classList.add("in"), i * 45)); });
}
renderGrid();

function quickAdd(id) { const p = findP(id); if (!p) return; addToCart(p, p.sizes[0]); afterAdd(p.name); }
let modalProduct = null, modalSize = null;
function openQuick(id) {
  const p = findP(id); if (!p) return;
  modalProduct = p; modalSize = p.sizes[0];
  $("mImg").innerHTML = visual(p); $("mCat").textContent = p.category; $("mName").textContent = p.name; $("mPrice").textContent = money(p.price); $("mDesc").textContent = p.desc || "";
  $("mSpec").innerHTML = `<li><span class="k">Kumaş</span><span>${p.fabric || "-"}</span></li><li><span class="k">Kalıp</span><span>${p.fit || "-"}</span></li><li><span class="k">Kategori</span><span>${p.category}</span></li>`;
  $("mSizes").innerHTML = p.sizes.map((s, i) => `<button class="size${i === 0 ? " active" : ""}" data-action="size" data-size="${s}">${s}</button>`).join("");
  open2("overlay", "modal");
}
function pickSize(el) { modalSize = el.dataset.size; [...$("mSizes").children].forEach(x => x.classList.remove("active")); el.classList.add("active"); }
function addFromModal() { if (!modalProduct) return; addToCart(modalProduct, modalSize); afterAdd(modalProduct.name + " (" + modalSize + ")"); }

/* ---------- SEPET ---------- */
function addToCart(p, size) { const key = p.id + "-" + size; const ex = cart.find(x => x.key === key); if (ex) ex.qty = Math.min(99, ex.qty + 1); else cart.push({ key, id: p.id, name: p.name, price: p.price, size, img: p.img, qty: 1 }); save(); renderCart(); }
/* sepete ekleyince sepeti ac */
function afterAdd(label) { $("modal").classList.remove("open"); toast((label || "Ürün") + " sepete eklendi"); openCart(); }
function changeQty(key, d) { const it = cart.find(x => x.key === key); if (!it) return; it.qty = Math.min(99, it.qty + d); if (it.qty <= 0) cart = cart.filter(x => x.key !== key); save(); renderCart(); }
function removeItem(key) { cart = cart.filter(x => x.key !== key); save(); renderCart(); }
function totals() { const sub = cart.reduce((s, i) => s + i.price * i.qty, 0); const ship = (sub > 0 && sub < CONFIG.shipping.freeOver) ? CONFIG.shipping.fee : 0; return { sub, ship, total: sub + ship }; }
function renderCart() {
  $("cartCount").textContent = cart.reduce((s, i) => s + i.qty, 0);
  const box = $("cartItems"), foot = $("cartFoot");
  if (!cart.length) { box.innerHTML = '<div class="empty">Sepetiniz boş.<br>Koleksiyondan beğendiğiniz ürünleri ekleyin.</div>'; foot.style.display = "none"; return; }
  foot.style.display = "block";
  box.innerHTML = cart.map(i => {
    const v = i.img ? `<img src="${i.img}" alt="">` : `<div class="fallback" style="background:${grad(i.id)}">${i.name.split(" ")[0]}</div>`;
    return `<div class="ci"><div class="cim">${v}</div><div class="cd"><div class="nm">${i.name}</div><div class="meta">Beden: ${i.size}</div>
    <div class="qty"><button data-action="qty" data-key="${i.key}" data-d="-1" aria-label="Azalt">−</button><span>${i.qty}</span><button data-action="qty" data-key="${i.key}" data-d="1" aria-label="Artır">+</button></div></div>
    <div><div class="cp">${money(i.price * i.qty)}</div><button class="rm" data-action="remove" data-key="${i.key}">Kaldır</button></div></div>`;
  }).join("");
  const t = totals(); $("subtotal").textContent = money(t.sub); $("shipVal").textContent = t.ship === 0 ? "Bedava" : money(t.ship); $("total").textContent = money(t.total);
}

/* ---------- ODEME / SIPARIS ---------- */
let payMethod = "havale";
function openCheckout() { if (!cart.length) return; renderCheckout(); open2("overlay", "checkout"); $("drawer").classList.remove("open"); }
function renderCheckout() {
  const t = totals(), b = CONFIG.bank;
  const items = cart.map(i => `<div class="co-line"><span>${i.name} <span class="q">(${i.size}) ×${i.qty}</span></span><span>${money(i.price * i.qty)}</span></div>`).join("");
  $("coContent").innerHTML = `<div class="co-grid">
    <div class="co-form"><h3>Sipariş Bilgileri</h3><div class="sub">Bilgileri doldurun, ödeme yöntemini seçin.</div>
      <div class="two"><div class="field" id="f-ad"><label for="c-ad">Ad Soyad</label><input id="c-ad" placeholder="Adınız Soyadınız" autocomplete="name"></div>
      <div class="field" id="f-tel"><label for="c-tel">Telefon</label><input id="c-tel" placeholder="05xx xxx xx xx" inputmode="tel" autocomplete="tel"></div></div>
      <div class="two"><div class="field" id="f-il"><label for="c-il">İl</label><input id="c-il" placeholder="Kocaeli"></div>
      <div class="field" id="f-ilce"><label for="c-ilce">İlçe</label><input id="c-ilce" placeholder="İzmit"></div></div>
      <div class="field" id="f-adres"><label for="c-adres">Açık Adres</label><textarea id="c-adres" rows="2" placeholder="Mahalle, sokak, bina/daire no"></textarea></div>
      <div class="field"><label for="c-not">Sipariş Notu (isteğe bağlı)</label><input id="c-not" placeholder="Beden/renk notu..."></div>
      <div class="lbl" style="margin:18px 0 0">Ödeme Yöntemi</div>
      <div class="pay-opts" id="payOpts">
        <div class="pay ${payMethod === 'havale' ? 'sel' : ''}" data-action="pay" data-pay="havale"><div class="ph"><span class="dot"></span><div><div class="pt">Havale / EFT</div><div class="pd">IBAN'a ödeme, onay sonrası kargo</div></div></div><div class="extra">Banka: <b>${b.name}</b><br>IBAN: <b>${b.iban}</b><br>Hesap: <b>${b.holder}</b><br>Açıklamaya ad-soyad yazın.</div></div>
        <div class="pay ${payMethod === 'kapida' ? 'sel' : ''}" data-action="pay" data-pay="kapida"><div class="ph"><span class="dot"></span><div><div class="pt">Kapıda Ödeme</div><div class="pd">Teslimatta nakit veya kart</div></div></div><div class="extra">Ürünü teslim alırken kuryeye ödersiniz.</div></div>
        <div class="pay disabled"><div class="ph"><span class="dot"></span><div><div class="pt">Kredi / Banka Kartı</div><div class="pd">Online güvenli ödeme</div></div><span class="soon">Yakında</span></div></div>
      </div>
    </div>
    <div class="co-summary"><h4>Sipariş Özeti</h4>${items}
      <div class="co-line" style="border:none;padding-top:14px"><span class="q">Ara toplam</span><span>${money(t.sub)}</span></div>
      <div class="co-line" style="border:none;padding:4px 0"><span class="q">Kargo</span><span>${t.ship === 0 ? "Bedava" : money(t.ship)}</span></div>
      <div class="sumrow total" style="margin-top:12px"><span>Toplam</span><span>${money(t.total)}</span></div>
      <button class="wfull primary" style="margin-top:10px" data-action="confirm">Siparişi Onayla</button>
      <div class="secure">🔒 Bilgileriniz yalnızca siparişiniz için kullanılır</div>
    </div></div>`;
}
function selPay(el) { payMethod = el.dataset.pay; document.querySelectorAll('#payOpts .pay:not(.disabled)').forEach(e => e.classList.remove('sel')); el.classList.add('sel'); }
function val(id) { return ($(id).value || "").trim(); }
function confirmOrder() {
  const req = [["c-ad","f-ad"],["c-tel","f-tel"],["c-il","f-il"],["c-ilce","f-ilce"],["c-adres","f-adres"]]; let ok = true;
  req.forEach(([i, f]) => { const el = $(f); if (!val(i)) { el.classList.add("err"); ok = false; } else el.classList.remove("err"); });
  if (!ok) { toast("Lütfen zorunlu alanları doldurun"); return; }
  const t = totals(), payTxt = payMethod === 'havale' ? 'Havale/EFT' : 'Kapıda Ödeme';
  let msg = `*YENİ SİPARİŞ — ${CONFIG.fullName}*\n\n*Ad:* ${val('c-ad')}\n*Telefon:* ${val('c-tel')}\n*Adres:* ${val('c-adres')}, ${val('c-ilce')}/${val('c-il')}\n`;
  if (val('c-not')) msg += `*Not:* ${val('c-not')}\n`;
  msg += `\n*Ürünler:*\n`; cart.forEach(i => { msg += `• ${i.name} (${i.size}) ×${i.qty} — ${money(i.price * i.qty)}\n`; });
  msg += `\nKargo: ${t.ship === 0 ? 'Bedava' : money(t.ship)}\n*Toplam: ${money(t.total)}*\n*Ödeme: ${payTxt}*`;
  /* encodeURIComponent: adreste # veya & gibi karakterler olsa da mesaj kesilmez */
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  const ono = "#" + Math.floor(100000 + Math.random() * 900000);
  $("coContent").innerHTML = `<div class="co-success"><div class="ok">✓</div><h3>Siparişiniz Alındı</h3><div class="ono">Sipariş No: ${ono}</div>
    <p>Siparişiniz WhatsApp üzerinden tarafımıza iletildi. ${payMethod === 'havale' ? 'Havale/EFT bilgileri mesajda yer alıyor; ödemeniz onaylanınca kargonuz hazırlanır.' : 'Siparişiniz onaylanınca en kısa sürede kargoya verilir.'}</p>
    <button class="btn gold" style="margin-top:18px" data-action="close">Alışverişe Devam Et</button></div>`;
  cart = []; save(); renderCart();
}

/* ---------- BILGI SAYFALARI ---------- */
const INFO = {
  teslimat: ["Teslimat", "Siparişleriniz onay sonrası 1-3 iş günü içinde kargoya verilir. " + money(CONFIG.shipping.freeOver) + " ve üzeri kargo ücretsizdir. (Örnek metin — kendi koşullarınıza göre düzenleyin.)"],
  iade: ["İade & Değişim", "Teslimdan sonra 14 gün içinde, kullanılmamış ve etiketli ürünlerde iade/değişim yapılır. (Örnek metin.)"],
  mesafeli: ["Mesafeli Satış Sözleşmesi", "Satıcı bilgileri, teslimat ve cayma hakkı koşulları bu alanda yer alır. (Örnek metin — yasal metninizi ekleyin.)"],
  gizlilik: ["Gizlilik / KVKK", "Kişisel verileriniz yalnızca siparişiniz için kullanılır, üçüncü kişilerle paylaşılmaz. (Örnek metin — KVKK metninizi ekleyin.)"]
};
function info(k) { const d = INFO[k]; if (!d) return; $("infoTitle").textContent = d[0]; $("infoBody").textContent = d[1]; open2("overlay", "infoModal"); }

/* ---------- GENEL ---------- */
function open2(a, b) { $(a).classList.add("open"); $(b).classList.add("open"); }
function openCart() { open2("overlay", "drawer"); }
function closeAll() { document.querySelectorAll(".open").forEach(e => e.classList.remove("open")); }
let tTimer; function toast(m) { const el = $("toast"); el.textContent = m; el.classList.add("show"); clearTimeout(tTimer); tTimer = setTimeout(() => el.classList.remove("show"), 2000); }

/* Tum tiklamalar tek yerden (inline onclick yerine) */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const d = el.dataset;
  switch (d.action) {
    case "open-cart": e.preventDefault(); openCart(); break;
    case "close": closeAll(); break;
    case "info": e.preventDefault(); info(d.key); break;
    case "quick": openQuick(d.id); break;
    case "quick-add": quickAdd(d.id); break;
    case "size": pickSize(el); break;
    case "add-modal": addFromModal(); break;
    case "qty": changeQty(d.key, Number(d.d)); break;
    case "remove": removeItem(d.key); break;
    case "checkout": openCheckout(); break;
    case "pay": selPay(el); break;
    case "confirm": confirmOrder(); break;
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeAll(); });
renderCart();
})();
