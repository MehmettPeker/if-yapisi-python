// ---------- Kod kopyalama ----------
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const pre = btn.parentElement.querySelector("pre");
    const code = pre?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(code);
      const old = btn.textContent;
      btn.textContent = "kopyalandı ✓";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch {
      btn.textContent = "kopyalanamadı";
      setTimeout(() => (btn.textContent = "kopyala"), 1200);
    }
  });
});

// ---------- Gece/Gündüz Modu ----------
const root = document.documentElement;
const themeBtn = document.getElementById("themeToggle");
const prismLink = document.getElementById("prism-theme");

function setTheme(mode) {
  root.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);

  if (mode === "dark") {
    prismLink.href =
      "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css";
    if (themeBtn) themeBtn.textContent = "☀️ Gündüz Modu";
  } else {
    prismLink.href =
      "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css";
    if (themeBtn) themeBtn.textContent = "🌙 Gece Modu";
  }

  if (window.Prism) window.Prism.highlightAll();
}

setTheme(localStorage.getItem("theme") || "light");

themeBtn?.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") || "light";
  setTheme(current === "light" ? "dark" : "light");
});

// ---------- PDF İndir (html2canvas + jsPDF) ----------
const pdfBtn = document.getElementById("pdfBtn");

async function downloadPDF() {
  const page = document.getElementById("page");
  if (!page) return;

  document.body.classList.add("pdf-mode");

  const canvas = await html2canvas(page, {
    scale: 2,
    useCORS: true,
    backgroundColor: getComputedStyle(document.body).backgroundColor,
  });

  const imgData = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pageWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let y = 0;
  let remaining = imgHeight;

  while (remaining > 0) {
    pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
    remaining -= pageHeight;

    if (remaining > 0) {
      pdf.addPage();
      y -= pageHeight; // aynı görseli yukarı kaydırarak devam sayfası yap
    }
  }

  pdf.save("if-yapisi-mehmet-peker.pdf");
  document.body.classList.remove("pdf-mode");
}

pdfBtn?.addEventListener("click", () => {
  downloadPDF().catch(() => {
    document.body.classList.remove("pdf-mode");
    alert("PDF oluşturulamadı. Tarayıcı izin vermemiş olabilir.");
  });
});

// ---------- 🧪 Kendin Dene (Mini) ----------
function setTryOutput(box, text) {
  const out = box.querySelector("[data-out]");
  if (out) out.textContent = text;
}

function getVal(box, key) {
  const el = box.querySelector(`[data-input="${key}"]`);
  if (!el) return null;

  if (el.tagName === "SELECT") return el.value;
  if (el.type === "number") return Number(el.value);
  return (el.value || "").trim();
}

function runTry(type, box) {
  try {
    if (type === "lesson2") {
      const hava = (getVal(box, "hava") || "").toLowerCase();
      setTryOutput(
        box,
        hava === "güneşli" ? "Şemsiye al" : "Şemsiye almana gerek yok"
      );
      return;
    }

    if (type === "lesson3") {
      const not_ort = Number(getVal(box, "not_ort"));
      if (Number.isNaN(not_ort)) return setTryOutput(box, "Hata: not_ort sayı olmalı.");
      if (not_ort >= 85) setTryOutput(box, "Takdir aldın");
      else if (not_ort >= 70) setTryOutput(box, "Teşekkür aldın");
      else setTryOutput(box, "Belge alamadın");
      return;
    }

    if (type === "lesson4") {
      const sayi = Number(getVal(box, "sayi"));
      if (Number.isNaN(sayi)) return setTryOutput(box, "Hata: sayi sayı olmalı.");
      if (sayi > 0) setTryOutput(box, "Pozitif");
      else if (sayi < 0) setTryOutput(box, "Negatif");
      else setTryOutput(box, "Sıfır");
      return;
    }

    if (type === "lesson5") {
      const sayi = Number(getVal(box, "sayi"));
      if (Number.isNaN(sayi)) return setTryOutput(box, "Hata: sayi sayı olmalı.");
      setTryOutput(box, sayi % 2 === 0 ? "Çift sayı" : "Tek sayı");
      return;
    }

    if (type === "lesson6") {
      const not1 = Number(getVal(box, "not1"));
      const not2 = Number(getVal(box, "not2"));
      const devam = getVal(box, "devam") === "true";
      if ([not1, not2].some((n) => Number.isNaN(n)))
        return setTryOutput(box, "Hata: not1/not2 sayı olmalı.");

      const ort = (not1 + not2) / 2;

      if (ort >= 85 && devam) setTryOutput(box, "Takdir aldın");
      else if (ort >= 70 && devam) setTryOutput(box, "Teşekkür aldın");
      else if (!devam) setTryOutput(box, "Devamsızlıktan kaldın");
      else setTryOutput(box, "Başarısız");
      return;
    }

    if (type === "lesson7") {
      const sayi = Number(getVal(box, "sayi"));
      if (Number.isNaN(sayi)) return setTryOutput(box, "Hata: sayi sayı olmalı.");
      if (sayi > 0) setTryOutput(box, sayi % 2 === 0 ? "Pozitif ve çift" : "Pozitif ve tek");
      else setTryOutput(box, "Sıfır veya negatif");
      return;
    }

    if (type === "lesson8") {
      const sayi = Number(getVal(box, "sayi"));
      if (Number.isNaN(sayi)) return setTryOutput(box, "Hata: sayi sayı olmalı.");

      if (sayi % 2 !== 0) {
        setTryOutput(box, sayi > 0 ? "Pozitif tek sayı" : "Negatif tek sayı");
      } else {
        if (sayi < 0) setTryOutput(box, "Negatif çift sayı");
        else if (sayi > 0) setTryOutput(box, "Pozitif çift sayı");
        else setTryOutput(box, "Sayı sıfırdır");
      }
      return;
    }

    if (type === "lesson9") {
      const yas = Number(getVal(box, "yas"));
      const ogrenci = getVal(box, "ogrenci");
      if (Number.isNaN(yas)) return setTryOutput(box, "Hata: yas sayı olmalı.");

      if (yas >= 18) {
        setTryOutput(box, ogrenci === "evet" ? "Giriş ücreti indirimli" : "Giriş tam ücret");
      } else {
        setTryOutput(box, "Girişe izin yok");
      }
      return;
    }

    if (type === "lesson10") {
      const not1 = Number(getVal(box, "not1"));
      const not2 = Number(getVal(box, "not2"));
      const devam = getVal(box, "devam"); // evet/hayir
      if ([not1, not2].some((n) => Number.isNaN(n)))
        return setTryOutput(box, "Hata: not1/not2 sayı olmalı.");

      const ort = (not1 + not2) / 2;

      if (devam === "evet") {
        if (ort >= 85) setTryOutput(box, "Takdir aldınız");
        else if (ort >= 70) setTryOutput(box, "Teşekkür aldınız");
        else setTryOutput(box, "Geçemediniz");
      } else {
        setTryOutput(box, "Devamsızlıktan kaldınız");
      }
      return;
    }

    if (type === "lesson11") {
      const can = Number(getVal(box, "can"));
      const level = Number(getVal(box, "level"));
      const altin = Number(getVal(box, "altin"));
      if ([can, level, altin].some((n) => Number.isNaN(n)))
        return setTryOutput(box, "Hata: tüm değerler sayı olmalı.");

      if (can > 0) {
        if (level >= 5) {
          setTryOutput(
            box,
            altin >= 50 ? "Büyülü kılıcı alabilirsin" : "Yeterli altının yok"
          );
        } else {
          setTryOutput(box, "Seviyen yeterli değil");
        }
      } else {
        setTryOutput(box, "Öldün, oyuna yeniden başla");
      }
      return;
    }
  } catch {
    setTryOutput(box, "Hata oluştu. Değerleri kontrol et.");
  }
}

// Her kutunun input'ları birbirinden bağımsız olsun (autofill karışmasın)
document.querySelectorAll(".tryMini").forEach((box) => {
  const prefix = box.getAttribute("data-try") || "try";
  box.querySelectorAll('input[data-input], select[data-input]').forEach((el) => {
    const key = el.getAttribute("data-input") || "val";
    if (!el.getAttribute("name")) el.setAttribute("name", `${prefix}_${key}`);
    el.setAttribute("autocomplete", "off");
  });
});

// Butonları bağla
document.querySelectorAll("[data-run]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-run");
    const box = btn.closest(".tryMini");
    if (type && box) runTry(type, box);
  });
});
