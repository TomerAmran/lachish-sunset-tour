const upcomingTours = [
  { date: "2026-10-09", meetingTime: "17:00", sunsetTime: "18:16", availability: "full" },
  { date: "2026-10-16", meetingTime: "16:50", sunsetTime: "18:08", availability: "few-left", spotsLeft: 4 },
  { date: "2026-10-23", meetingTime: "16:45", sunsetTime: "18:01", availability: "open" },
  { date: "2026-10-30", meetingTime: "15:40", sunsetTime: "16:54", availability: "open" },
];

const hebrewDayNames = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function formatShortDate(isoDate) {
  const [, month, day] = isoDate.split("-").map(Number);
  return `${day}.${month}`;
}

function availabilityText(tour) {
  if (tour.availability === "full") return "ההרשמה מלאה";
  if (tour.availability === "few-left") return `נותרו ${tour.spotsLeft} מקומות`;
  return "פתוח להרשמה";
}

function renderTourDates() {
  const datesGrid = document.getElementById("dates-grid");
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  upcomingTours
    .filter((tour) => new Date(`${tour.date}T23:59:00`) >= startOfToday)
    .forEach((tour) => {
      const tourDate = new Date(`${tour.date}T12:00:00`);
      const isFull = tour.availability === "full";
      const dateCard = document.createElement("article");
      dateCard.className = `date-card${isFull ? " date-card-full" : ""}`;
      dateCard.innerHTML = `
        <span class="date-card-day">יום ${hebrewDayNames[tourDate.getDay()]}</span>
        <span class="date-card-date">${formatShortDate(tour.date)}</span>
        <span class="date-card-times">מפגש ${tour.meetingTime} · שקיעה ${tour.sunsetTime}</span>
        <span class="date-card-status date-card-status-${tour.availability}">${availabilityText(tour)}</span>
        <button class="button" ${isFull ? "disabled" : ""}>${isFull ? "אין מקומות" : "להרשמה"}</button>
      `;
      if (!isFull) {
        dateCard.querySelector("button").addEventListener("click", () => openRegistrationDialog(tour, tourDate));
      }
      datesGrid.appendChild(dateCard);
    });
}

// Registration dialog (the form is not sent anywhere; it only shows a thank-you message)

const registrationDialog = document.getElementById("registration-dialog");
const registrationForm = document.getElementById("registration-form");
const registrationThanks = document.getElementById("registration-thanks");

function openRegistrationDialog(tour, tourDate) {
  document.getElementById("registration-selected-date").textContent =
    `יום ${hebrewDayNames[tourDate.getDay()]} ${formatShortDate(tour.date)} · מפגש ב־${tour.meetingTime}`;
  registrationForm.reset();
  registrationForm.classList.remove("hidden");
  registrationThanks.classList.add("hidden");
  registrationDialog.showModal();
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  registrationForm.classList.add("hidden");
  registrationThanks.classList.remove("hidden");
});

document.getElementById("dialog-close").addEventListener("click", () => registrationDialog.close());
document.getElementById("thanks-close").addEventListener("click", () => registrationDialog.close());
registrationDialog.addEventListener("click", (event) => {
  if (event.target === registrationDialog) registrationDialog.close();
});

// Header and mobile menu

const siteHeader = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const siteNavigation = document.getElementById("site-navigation");

function updateHeaderBackground() {
  siteHeader.classList.toggle("scrolled", window.scrollY > 40 || siteNavigation.classList.contains("open"));
}

menuToggle.addEventListener("click", () => {
  const isOpen = siteNavigation.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  updateHeaderBackground();
});

siteNavigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  siteNavigation.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  updateHeaderBackground();
}));

window.addEventListener("scroll", updateHeaderBackground, { passive: true });

renderTourDates();
updateHeaderBackground();
