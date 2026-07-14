// ------------------------------------------------------------------
// برقتو - نسخه ۵: سبک مینیمال Stripe
// فقط scroll-progress + fade-in-on-scroll ساده؛ بدون canvas/tilt
// ------------------------------------------------------------------

// ۱) لیست استان‌های ایران برای فرم بررسی رایگان
const PROVINCES = [
  "آذربایجان شرقی", "آذربایجان غربی", "اردبیل", "اصفهان", "البرز", "ایلام",
  "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی",
  "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس",
  "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد",
  "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "هرمزگان", "همدان", "یزد"
];

function fillProvinces() {
  const select = document.getElementById("province");
  if (!select) return;
  PROVINCES.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    select.appendChild(opt);
  });
}

// ۲) fade-in-on-scroll ساده
function setupFadeIn() {
  const items = document.querySelectorAll(".fade-in");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add("in-view"), Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
}

// ۳) نوار پیشرفت اسکرول
function setupScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + "%";
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
}

// ۴) آکاردئون سوالات متداول
function setupFaq() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach((i) => {
        i.classList.remove("open");
        i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

// ۵) منوی موبایل (همبرگری)
function setupMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });
}

// ۵) ماشین‌حساب درآمد
// نرخ‌های زیر «نمونه» هستند و صرفاً برای نمایش تخمینی به‌کار می‌روند.
// پیش از استفاده واقعی، باید با نرخ‌های به‌روز بازار برق و خرید تضمینی جایگزین شوند.
const SAMPLE_RATES = {
  guaranteedPricePerKwh: 4500,
  barghtoPricePerKwh: 6200,
  specificYieldPerKw: 1500,
  hybridGridShare: 0.8,
};

function formatToman(value) {
  return Math.round(value).toLocaleString("fa-IR") + " تومان";
}

function setupCalculator() {
  const form = document.getElementById("calc-form");
  if (!form) return;

  form.addEventListener("submit", () => {
    const capacityInput = parseFloat(document.getElementById("capacity").value);
    if (!capacityInput || capacityInput <= 0) return;

    const unit = document.getElementById("capacity-unit").value;
    const capacityKw = unit === "mw" ? capacityInput * 1000 : capacityInput;
    const plantType = document.getElementById("plant-type").value;

    let annualProduction = capacityKw * SAMPLE_RATES.specificYieldPerKw;
    if (plantType === "hybrid") {
      annualProduction *= SAMPLE_RATES.hybridGridShare;
    }

    const guaranteedIncome = annualProduction * SAMPLE_RATES.guaranteedPricePerKwh;
    const barghtoIncome = annualProduction * SAMPLE_RATES.barghtoPricePerKwh;
    const diff = barghtoIncome - guaranteedIncome;

    document.getElementById("res-production").textContent =
      Math.round(annualProduction).toLocaleString("fa-IR") + " kWh";
    document.getElementById("res-guaranteed").textContent = formatToman(guaranteedIncome);
    document.getElementById("res-barghto").textContent = formatToman(barghtoIncome);
    document.getElementById("res-diff").textContent = "+" + formatToman(diff);
  });
}

// ۶) فرم بررسی رایگان (بدون بک‌اند - فقط نمایش پیام موفقیت روی کلاینت)
function setupReviewForm() {
  const form = document.getElementById("review-form");
  const success = document.getElementById("review-success");
  if (!form) return;

  form.addEventListener("submit", () => {
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // TODO: اتصال به بک‌اند/CRM برقتو برای ثبت واقعی درخواست
    success.hidden = false;
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fillProvinces();
  setupFadeIn();
  setupScrollProgress();
  setupFaq();
  setupMobileNav();
  setupCalculator();
  setupReviewForm();
});
