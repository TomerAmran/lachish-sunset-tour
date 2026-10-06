// Edit these to personalize the invitation
const invitationSettings = {
  inviteeName: "", // e.g. "נועה" → "נועה, יש לך הזמנה". Leave empty for "יש לך הזמנה"
  signature: "המדריך הפרטי שלך 😘",
  tourDateDisplayText: "9.10",
  meetingStartIsoTime: "2026-10-09T17:30:00+03:00",
  tourEndIsoTime: "2026-10-09T19:30:00+03:00",
  sunsetTimeDisplayText: "18:16",
  meetingPointDisplayText: "תל לכיש, צמוד למושב לכיש",
  meetingPointLatitude: 31.5647,
  meetingPointLongitude: 34.8489,
};

const storyViewer = document.getElementById("story-viewer");
const slides = Array.from(document.querySelectorAll(".slide"));
const progressBarsContainer = document.getElementById("progress-bars");
const pauseButton = document.getElementById("pause-button");

const holdToPauseThresholdMilliseconds = 250;
const previousTapZoneWidthFraction = 0.3;

let currentSlideIndex = 0;
let currentSlideElapsedMilliseconds = 0;
let lastAnimationFrameTimestamp = null;
let isPausedByUser = false;
let isPausedByHold = false;
let pointerDownTimestamp = 0;

const progressBarFills = slides.map(() => {
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  const progressBarFill = document.createElement("div");
  progressBarFill.className = "progress-bar-fill";
  progressBar.appendChild(progressBarFill);
  progressBarsContainer.appendChild(progressBar);
  return progressBarFill;
});

function fillPersonalizedText() {
  if (invitationSettings.inviteeName) {
    document.getElementById("invitee-greeting").textContent = `${invitationSettings.inviteeName}, יש לך`;
  }
  document.getElementById("tour-date-text").textContent = invitationSettings.tourDateDisplayText;
  document.getElementById("meeting-time-text").textContent = new Date(invitationSettings.meetingStartIsoTime)
    .toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" });
  document.getElementById("sunset-time-text").textContent = invitationSettings.sunsetTimeDisplayText;
  document.getElementById("meeting-point-text").textContent = invitationSettings.meetingPointDisplayText;
  document.getElementById("signature-text").textContent = `— ${invitationSettings.signature}`;
}

function slideDurationMilliseconds(slideIndex) {
  return Number(slides[slideIndex].dataset.duration);
}

function showSlide(slideIndex) {
  currentSlideIndex = Math.max(0, Math.min(slides.length - 1, slideIndex));
  currentSlideElapsedMilliseconds = 0;
  slides.forEach((slide, index) => slide.classList.toggle("active", index === currentSlideIndex));
  progressBarFills.forEach((progressBarFill, index) => {
    progressBarFill.style.width = index < currentSlideIndex ? "100%" : "0%";
  });
  if (slideDurationMilliseconds(currentSlideIndex) === 0) {
    progressBarFills[currentSlideIndex].style.width = "100%";
  }
}

function goToNextSlide() {
  if (currentSlideIndex < slides.length - 1) showSlide(currentSlideIndex + 1);
}

function goToPreviousSlide() {
  showSlide(currentSlideIndex - 1);
}

function advanceStoryTimer(animationFrameTimestamp) {
  if (lastAnimationFrameTimestamp !== null && !isPausedByUser && !isPausedByHold && !document.hidden) {
    const duration = slideDurationMilliseconds(currentSlideIndex);
    if (duration > 0) {
      currentSlideElapsedMilliseconds += animationFrameTimestamp - lastAnimationFrameTimestamp;
      const progressFraction = Math.min(1, currentSlideElapsedMilliseconds / duration);
      progressBarFills[currentSlideIndex].style.width = `${progressFraction * 100}%`;
      if (progressFraction >= 1) goToNextSlide();
    }
  }
  lastAnimationFrameTimestamp = animationFrameTimestamp;
  requestAnimationFrame(advanceStoryTimer);
}

function isInteractiveElement(element) {
  return Boolean(element.closest("button, a, details, summary"));
}

storyViewer.addEventListener("pointerdown", (event) => {
  if (isInteractiveElement(event.target)) return;
  pointerDownTimestamp = performance.now();
  isPausedByHold = true;
});

storyViewer.addEventListener("pointerup", (event) => {
  isPausedByHold = false;
  if (isInteractiveElement(event.target)) return;
  const wasHold = performance.now() - pointerDownTimestamp > holdToPauseThresholdMilliseconds;
  if (wasHold) return;
  const viewerBounds = storyViewer.getBoundingClientRect();
  const tappedOnRightSide = event.clientX > viewerBounds.right - viewerBounds.width * previousTapZoneWidthFraction;
  // Hebrew reads right to left, so the right edge goes back and everything else goes forward
  if (tappedOnRightSide) goToPreviousSlide();
  else goToNextSlide();
});

storyViewer.addEventListener("pointercancel", () => { isPausedByHold = false; });
storyViewer.addEventListener("contextmenu", (event) => event.preventDefault());

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === " ") goToNextSlide();
  if (event.key === "ArrowRight") goToPreviousSlide();
});

pauseButton.addEventListener("click", () => {
  isPausedByUser = !isPausedByUser;
  pauseButton.textContent = isPausedByUser ? "▶" : "❚❚";
  pauseButton.setAttribute("aria-label", isPausedByUser ? "המשך" : "השהה");
});

// Countdown to the meeting time

const countdownElement = document.getElementById("countdown");

function renderCountdown() {
  const millisecondsLeft = new Date(invitationSettings.meetingStartIsoTime) - new Date();
  if (millisecondsLeft <= 0) {
    countdownElement.innerHTML = `<div class="countdown-unit"><span class="countdown-number">היום! 🌅</span></div>`;
    return;
  }
  const totalMinutesLeft = Math.floor(millisecondsLeft / 60000);
  const countdownUnits = [
    { value: Math.floor(totalMinutesLeft / 1440), label: "ימים" },
    { value: Math.floor((totalMinutesLeft % 1440) / 60), label: "שעות" },
    { value: totalMinutesLeft % 60, label: "דקות" },
  ];
  countdownElement.innerHTML = countdownUnits
    .map((unit) => `<div class="countdown-unit"><span class="countdown-number">${unit.value}</span><span class="countdown-label">${unit.label}</span></div>`)
    .join("");
}

// RSVP

const rsvpYesButton = document.getElementById("rsvp-yes-button");
const rsvpNoButton = document.getElementById("rsvp-no-button");
const noButtonLabelsWhileRunningAway = ["בטוחה? 🥺", "נו באמת...", "השקיעה מחכה 🌅", "אין לך לאן לברוח 😄", "טוב נו... כן 😅"];
let noButtonEscapeCount = 0;
let lastNoButtonEscapeTimestamp = 0;

function moveNoButtonAway(event) {
  if (noButtonEscapeCount >= noButtonLabelsWhileRunningAway.length - 1) return;
  event.preventDefault();
  lastNoButtonEscapeTimestamp = performance.now();
  noButtonEscapeCount += 1;
  rsvpNoButton.textContent = noButtonLabelsWhileRunningAway[noButtonEscapeCount - 1];
  const viewerBounds = storyViewer.getBoundingClientRect();
  const buttonBounds = rsvpNoButton.getBoundingClientRect();
  const margin = 20;
  const randomLeft = margin + Math.random() * (viewerBounds.width - buttonBounds.width - margin * 2);
  const randomTop = 120 + Math.random() * (viewerBounds.height - buttonBounds.height - 220);
  rsvpNoButton.classList.add("running-away");
  rsvpNoButton.style.left = `${randomLeft}px`;
  rsvpNoButton.style.top = `${randomTop}px`;
  if (noButtonEscapeCount === noButtonLabelsWhileRunningAway.length - 1) {
    rsvpNoButton.textContent = noButtonLabelsWhileRunningAway.at(-1);
  }
}

rsvpNoButton.addEventListener("pointerenter", moveNoButtonAway);
rsvpNoButton.addEventListener("click", (event) => {
  // On touch screens the same tap fires pointerenter and then click, so count it once
  if (performance.now() - lastNoButtonEscapeTimestamp < 400) return;
  if (noButtonEscapeCount >= noButtonLabelsWhileRunningAway.length - 1) acceptInvitation();
  else moveNoButtonAway(event);
});
rsvpYesButton.addEventListener("click", acceptInvitation);

function formatDateForCalendar(isoTime) {
  return new Date(isoTime).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildCalendarFileUrl() {
  const calendarFileLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//sunsets.lachish//invitation//HE",
    "BEGIN:VEVENT",
    `UID:sunset-tour-lachish-${invitationSettings.meetingStartIsoTime}@sunsets.lachish`,
    `DTSTAMP:${formatDateForCalendar(new Date().toISOString())}`,
    `DTSTART:${formatDateForCalendar(invitationSettings.meetingStartIsoTime)}`,
    `DTEND:${formatDateForCalendar(invitationSettings.tourEndIsoTime)}`,
    "SUMMARY:🌅 טיול שקיעה בלכיש",
    `LOCATION:${invitationSettings.meetingPointDisplayText}`,
    `GEO:${invitationSettings.meetingPointLatitude};${invitationSettings.meetingPointLongitude}`,
    "DESCRIPTION:נעליים נוחות\\, סוודר קל ומצב רוח טוב. כל השאר מסודר ❤️",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:עוד שעתיים יוצאים לשקיעה 🌅",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const calendarFile = new Blob([calendarFileLines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  return URL.createObjectURL(calendarFile);
}

function acceptInvitation() {
  document.getElementById("rsvp-question").classList.add("hidden");
  rsvpNoButton.classList.add("hidden");
  document.getElementById("rsvp-answer").classList.remove("hidden");
  document.getElementById("add-to-calendar-link").href = buildCalendarFileUrl();
  document.getElementById("navigation-link").href =
    `https://waze.com/ul?ll=${invitationSettings.meetingPointLatitude},${invitationSettings.meetingPointLongitude}&navigate=yes`;
  launchConfetti();
  if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
}

// Confetti

const confettiCanvas = document.getElementById("confetti-canvas");
const confettiContext = confettiCanvas.getContext("2d");
const confettiColors = ["#ff8a3d", "#ff5e7e", "#ffd166", "#ffffff", "#c77dff"];

function launchConfetti() {
  confettiCanvas.width = window.innerWidth * devicePixelRatio;
  confettiCanvas.height = window.innerHeight * devicePixelRatio;
  confettiContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const confettiPieces = Array.from({ length: 180 }, () => ({
    horizontalPosition: window.innerWidth / 2,
    verticalPosition: window.innerHeight * 0.55,
    horizontalVelocity: (Math.random() - 0.5) * 16,
    verticalVelocity: -Math.random() * 16 - 6,
    size: Math.random() * 8 + 5,
    rotation: Math.random() * Math.PI,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    isHeart: Math.random() < 0.2,
  }));
  const confettiStartTimestamp = performance.now();

  function drawConfettiFrame(animationFrameTimestamp) {
    confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiPieces.forEach((piece) => {
      piece.verticalVelocity += 0.35;
      piece.horizontalVelocity *= 0.99;
      piece.horizontalPosition += piece.horizontalVelocity;
      piece.verticalPosition += piece.verticalVelocity;
      piece.rotation += piece.rotationSpeed;
      confettiContext.save();
      confettiContext.translate(piece.horizontalPosition, piece.verticalPosition);
      confettiContext.rotate(piece.rotation);
      if (piece.isHeart) {
        confettiContext.font = `${piece.size * 2}px sans-serif`;
        confettiContext.fillText("❤️", 0, 0);
      } else {
        confettiContext.fillStyle = piece.color;
        confettiContext.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2);
      }
      confettiContext.restore();
    });
    if (animationFrameTimestamp - confettiStartTimestamp < 5000) requestAnimationFrame(drawConfettiFrame);
    else confettiContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  requestAnimationFrame(drawConfettiFrame);
}

fillPersonalizedText();
renderCountdown();
setInterval(renderCountdown, 30000);
// ?slide=3 opens a specific slide, paused (handy for previewing)
const requestedSlideNumber = Number(new URLSearchParams(location.search).get("slide"));
if (requestedSlideNumber) {
  showSlide(requestedSlideNumber - 1);
  pauseButton.click();
} else {
  showSlide(0);
}
requestAnimationFrame(advanceStoryTimer);
