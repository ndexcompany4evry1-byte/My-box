// تطبيق السمة من localStorage أو النظام
function applyTheme() {
  const saved = localStorage.getItem('theme') || 'system';
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (saved === 'system') {
    document.body.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  } else {
    document.body.setAttribute(' data-theme', saved);
  }
}

// تغيير السمة
document.getElementById('theme-switcher').addEventListener('change', (e) => {
  localStorage.setItem('theme', e.target.value);
  applyTheme();
});

// تغيير اللغة (يمكنك ربطه بنظام JSON لاحقًا)
document.getElementById('lang-switcher').addEventListener('change', (e) => {
  localStorage.setItem('lang', e.target.value);
  // هنا يمكن تحديث النصوص ديناميكيًا
});

// بيانات وهمية للمنتجات (يمكن استبدالها بـ JSON أو API)
const products = [
  {
    id: 1,
    physicalTitle: "كارت فيزيائي تقليدي",
    nfcTitle: "كارت NFC ذكي",
    qrLink: "https://example.com/user/123"
  },
  {
    id: 2,
    physicalTitle: "الكارت الذهبي",
    nfcTitle: "النسخة الرقمية مع NFC",
    qrLink: "https://example.com/user/456"
  }
];

// عرض المنتجات
function renderProducts() {
  const container = document.getElementById('products-container');
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="physical-card">
        <h3>${p.physicalTitle}</h3>
        <p>نسخة مطبوعة بجودة عالية</p>
      </div>
      <div class="nfc-card">
        <h3>${p.nfcTitle}</h3>
        <div class="qr-placeholder">QR: ${p.qrLink}</div>
        <button onclick="downloadVCard(${p.id})">حفظ كجهة اتصال</button>
      </div>
    </div>
  `).join('');
}

function downloadVCard(id) {
  alert(`تنزيل vCard للمنتج #${id} — سيتم ربطه لاحقًا ببيانات حقيقية.`);
}

// التشغيل الأولي
applyTheme();
renderProducts();
