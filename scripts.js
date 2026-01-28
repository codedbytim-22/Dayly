// DOM Elements
const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const progressBar = document.getElementById("progressBar");
const percentText = document.getElementById("percentText");
const percentTextInline = document.getElementById("percentTextInline");
const yearText = document.getElementById("yearText");
const daysPassed = document.getElementById("daysPassed");
const daysRemaining = document.getElementById("daysRemaining");
const totalDays = document.getElementById("totalDays");
const currentYear = document.getElementById("currentYear");
const themeToggle = document.getElementById("themeToggle");
const sunRays = document.getElementById("sunRays");
const starsContainer = document.getElementById("starsContainer");

// Theme Management
let isDarkMode = true;

// Initialize theme from localStorage or default to dark
function initTheme() {
  const savedTheme = localStorage.getItem("yearProgressTheme");
  if (savedTheme === "light") {
    setLightMode();
  } else {
    setDarkMode();
  }
}

function setLightMode() {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  isDarkMode = false;
  localStorage.setItem("yearProgressTheme", "light");
}

function setDarkMode() {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
  isDarkMode = true;
  localStorage.setItem("yearProgressTheme", "dark");
}

function toggleTheme() {
  if (isDarkMode) {
    setLightMode();
    triggerSunAnimation();
  } else {
    setDarkMode();
    triggerMoonStarsAnimation();
  }
}

// Theme Animation Functions
function triggerSunAnimation() {
  sunRays.innerHTML = "";
  // Create 8 sun rays
  for (let i = 0; i < 8; i++) {
    const ray = document.createElement("div");
    ray.className = "sun-ray";
    ray.style.transform = `translate(-50%, -100%) rotate(${i * 45}deg)`;
    sunRays.appendChild(ray);
  }

  sunRays.classList.add("sun-animation");
  setTimeout(() => {
    sunRays.classList.remove("sun-animation");
  }, 1500);
}

function triggerMoonStarsAnimation() {
  starsContainer.innerHTML = "";
  // Create 15 stars
  for (let i = 0; i < 15; i++) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position around the moon
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    star.style.setProperty("--tx", `${tx}px`);
    star.style.setProperty("--ty", `${ty}px`);
    star.style.left = "50%";
    star.style.top = "50%";
    star.style.animationDelay = `${Math.random() * 0.5}s`;

    starsContainer.appendChild(star);
  }

  starsContainer.classList.add("moon-stars-animation");
  setTimeout(() => {
    starsContainer.classList.remove("moon-stars-animation");
  }, 2000);
}

// Date and Progress Calculations
function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getTotalDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function formatDate(date) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
}

function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function updateDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = getDayOfYear(now);
  const totalDaysInYear = getTotalDaysInYear(year);
  const progress = (dayOfYear / totalDaysInYear) * 100;

  // Update date and time
  dateDisplay.textContent = formatDate(now);
  timeDisplay.textContent = formatTime(now);

  // Update progress bar
  progressBar.style.width = `${progress}%`;

  // Update percentage text
  const progressFixed = progress.toFixed(2);
  percentText.textContent = `${progressFixed}%`;
  percentTextInline.textContent = `${progressFixed}%`;

  // Update year text
  yearText.textContent = year;

  // Update stats
  daysPassed.textContent = dayOfYear;
  daysRemaining.textContent = totalDaysInYear - dayOfYear;
  totalDays.textContent = totalDaysInYear;

  // Update footer year
  currentYear.textContent = year;
}

// Initialize the app
function initApp() {
  // Initialize theme
  initTheme();

  // Set up theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Create sun rays and stars containers
  // (Already created in HTML, but ensure they're empty initially)
  sunRays.innerHTML = "";
  starsContainer.innerHTML = "";

  // Initial update
  updateDateTime();

  // Update every second
  setInterval(updateDateTime, 1000);
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
