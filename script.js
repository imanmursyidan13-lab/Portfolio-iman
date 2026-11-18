/* ---------- Konten yang mudah diperbarui ---------- */
// Foto profil: isi dengan data URI atau nama file gambar milik Iman. Kosong = tampil inisial "IM".
const PHOTO_SRC = ""; // contoh: "foto.jpg" (letakkan file foto di folder yang sama)

// Proyek: tambahkan objek baru ke daftar ini dan kartu muncul otomatis.
// Contoh bentuk: { title: "", description: "", tags: ["MySQL"], link: "https://...", image: "" }
const PROJECTS = [];

/* ---------- Util ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const WA_NUMBER = "6285283954421";
const EMAIL = "imanmursyidan13@gmail.com";

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
async function copyText(text, okMsg = "Tersalin") {
  try { await navigator.clipboard.writeText(text); toast(okMsg); }
  catch (e) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { }
    ta.remove();
    toast(ok ? okMsg : "Salin manual: pilih teks lalu salin");
  }
}

/* ---------- Foto Profil ---------- */
(function setupProfilePhoto() {
  const img = $("#photo");
  const monogram = $("#monogram");
  if (!img) return;

  // Jika PHOTO_SRC diatur di script.js, gunakan itu
  if (typeof PHOTO_SRC !== "undefined" && PHOTO_SRC && PHOTO_SRC.trim() !== "") {
    img.src = PHOTO_SRC;
  }

  function onPhotoSuccess() {
    img.style.display = "block";
    if (monogram) monogram.style.display = "none";
  }

  function onPhotoFail() {
    img.style.display = "none";
    if (monogram) monogram.style.display = "grid";
  }

  const currentSrc = img.getAttribute("src");
  if (currentSrc && currentSrc.trim() !== "") {
    img.addEventListener("load", onPhotoSuccess);
    img.addEventListener("error", onPhotoFail);

    // Cek jika sudah selesai dimuat (cache browser)
    if (img.complete) {
      if (img.naturalWidth > 0) {
        onPhotoSuccess();
      } else {
        onPhotoFail();
      }
    }
  } else {
    onPhotoFail();
  }
})();

/* ---------- Navbar ---------- */
const header = $("#siteHeader"), menuBtn = $("#menuBtn"), navLinks = $("#navLinks"), progress = $("#progress");
function setMenu(open) {
  navLinks.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  menuBtn.innerHTML = '<svg class="icon"><use href="#' + (open ? "i-x" : "i-menu") + '"/></svg>';
}
menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
$$("[data-link]").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

function onScroll() {
  header.classList.toggle("scrolled", window.scrollY > 8);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const links = $$("[data-link]");
const sectionIds = ["home", "about", "skills", "experience", "contact"];
const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
function setActive() {
  const y = window.scrollY + 120;
  let current = "home";
  for (const s of sections) if (s.offsetTop <= y) current = s.id;
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
  links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));
}
window.addEventListener("scroll", setActive, { passive: true });
window.addEventListener("resize", setActive);
setActive();

/* ---------- Fade-in saat masuk viewport ---------- */
(function () {
  const items = $$("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.remove("pre"); io.unobserve(en.target); } });
  }, { threshold: 0.08 });
  items.forEach(el => {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.95) { el.classList.add("pre"); io.observe(el); }
  });
  // Pengaman: semua konten tetap terlihat walau observer tidak berjalan.
  setTimeout(() => $$(".pre").forEach(el => el.classList.remove("pre")), 4000);
})();

/* ---------- Proyek ---------- */
(function () {
  const grid = $("#projectGrid");
  if (!grid) return;
  if (!PROJECTS.length) {
    grid.innerHTML =
      '<div class="empty"><span class="ico"><svg class="icon"><use href="#i-folder"/></svg></span>' +
      '<h3>Projects Coming Soon</h3>' +
      '<p>Proyek dan hasil karya akan ditampilkan di sini setelah tersedia.</p></div>';
    return;
  }
  grid.innerHTML = PROJECTS.map(p =>
    '<article class="card project">' +
    '<div class="thumb">' + (p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' : '') + '</div>' +
    '<div class="body"><h3>' + esc(p.title) + '</h3><p>' + esc(p.description || "") + '</p>' +
    ((p.tags && p.tags.length) ? '<div class="tags">' + p.tags.map(t => '<span>' + esc(t) + '</span>').join("") + '</div>' : '') +
    (p.link ? '<a class="link" href="' + esc(p.link) + '" target="_blank" rel="noopener">Lihat Proyek <svg class="icon"><use href="#i-arrow"/></svg></a>' : '') +
    '</div></article>'
  ).join("");
})();

/* ---------- Salin kontak ---------- */
$$("[data-copy]").forEach(b => b.addEventListener("click", () => copyText(b.dataset.copy)));

/* ---------- Formulir kontak ---------- */
(function () {
  const form = $("#contactForm"), result = $("#formResult");
  const rules = {
    name: v => v.trim().length >= 2 ? "" : "Isi nama minimal 2 karakter.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Masukkan alamat email yang valid.",
    subject: v => v.trim().length >= 3 ? "" : "Isi subjek minimal 3 karakter.",
    message: v => v.trim().length >= 10 ? "" : "Pesan minimal 10 karakter."
  };
  function check(name) {
    const el = form.elements[name], wrap = el.closest(".field");
    const msg = rules[name](el.value);
    wrap.classList.toggle("invalid", !!msg);
    $("[data-err]", wrap).textContent = msg;
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }
  Object.keys(rules).forEach(n => {
    form.elements[n].addEventListener("blur", () => check(n));
    form.elements[n].addEventListener("input", () => { if (form.elements[n].closest(".field").classList.contains("invalid")) check(n); });
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const okAll = Object.keys(rules).map(check).every(Boolean);
    if (!okAll) {
      const first = $(".invalid input, .invalid textarea", form);
      if (first) first.focus();
      result.hidden = true;
      return;
    }
    const v = n => form.elements[n].value.trim();
    const text = "Halo Iman, saya " + v("name") + " (" + v("email") + ").\n\nSubjek: " + v("subject") + "\n\n" + v("message");
    const waHref = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
    const mailHref = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(v("subject")) + "&body=" + encodeURIComponent(text);
    result.hidden = false;
    result.innerHTML =
      '<p><strong>Pesan belum terkirim.</strong> Pesan Anda sudah disiapkan. Pilih salah satu cara untuk mengirimnya:</p>' +
      '<div class="quick">' +
      '<a class="btn btn-primary" href="' + waHref + '" target="_blank" rel="noopener">Kirim via WhatsApp</a>' +
      '<a class="btn btn-ghost" href="' + mailHref + '">Buka aplikasi email</a>' +
      '<button class="btn btn-ghost" type="button" id="copyMsg">Salin pesan</button>' +
      '</div>' +
      '<p class="note">Jika aplikasi email tidak terbuka, salin pesan dan kirim ke ' + EMAIL + '.</p>';
    $("#copyMsg").addEventListener("click", () => copyText(text, "Pesan tersalin"));
    result.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  });
})();
