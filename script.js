
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

// Мобильное меню
function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Закрыть меню" : "Открыть меню"
  );
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 700) closeMenu();
});

// Автоматически обновляем год в подвале
document.querySelector("#year").textContent = new Date().getFullYear();

// Плавное появление элементов при прокрутке
const animatedElements = document.querySelectorAll(
  ".service-card, .stat, .benefit, .price-row, .about-visual, .booking-form"
);

animatedElements.forEach((element) => element.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  animatedElements.forEach((element) => observer.observe(element));
} else {
  animatedElements.forEach((element) => element.classList.add("visible"));
}

// Выбор услуги по нажатию на карточку
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    const serviceSelect = document.querySelector("#service");
    const requestedService = link.dataset.service;

    const matchingOption = [...serviceSelect.options].find(
      (option) => option.text.trim() === requestedService
    );

    if (matchingOption) {
      serviceSelect.value = matchingOption.value;
    }
  });
});

// Подготовка заявки
// Пока нет сервера, заявка откроется в почтовом приложении.
const bookingForm = document.querySelector("#bookingForm");
const formStatus = document.querySelector("#formStatus");

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const service = formData.get("service");
  const message = formData.get("message").trim();

  const subject = encodeURIComponent("Заявка на обслуживание — TURBO GARAGE");
  const body = encodeURIComponent(
    `Новая заявка с сайта TURBO GARAGE\n\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Услуга: ${service}\n` +
    `Комментарий: ${message || "Не указан"}\n\n` +
    `Важно: укажи реальный email автосервиса в файле script.js.`
  );

  // ЗАМЕНИ адрес ниже на почту реального автосервиса.
  const serviceEmail = "example@gmail.com";

  formStatus.textContent =
    "Открываем почтовое приложение. Для реальной отправки укажи email сервиса в script.js.";

  window.location.href =
    `mailto:${serviceEmail}?subject=${subject}&body=${body}`;
});
