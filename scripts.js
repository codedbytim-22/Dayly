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

// Background Animation System
function createBackgroundAnimations() {
  // Remove existing animation container if it exists
  const existingContainer = document.querySelector(".background-animations");
  if (existingContainer) {
    existingContainer.remove();
  }

  // Create new animation container
  const animationsContainer = document.createElement("div");
  animationsContainer.className = "background-animations";
  document.body.appendChild(animationsContainer);

  function createParticles() {
    const isLightMode = document.body.classList.contains("light-mode");
    const container = document.querySelector(".background-animations");
    if (!container) return;

    container.innerHTML = "";

    // Use fewer particles for better performance
    const count = window.innerWidth < 768 ? 15 : isLightMode ? 25 : 35;
    const type = isLightMode ? "particle" : "star";

    for (let i = 0; i < count; i++) {
      const element = document.createElement("div");
      const size = isLightMode
        ? Math.random() * 4 + 2 // Larger particles for light mode
        : Math.random() * 3 + 1; // Smaller stars for dark mode

      element.className = isLightMode ? "particle" : "star";
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;

      if (isLightMode) {
        // Light mode particles - soft pastel colors
        const colors = [
          "rgba(147, 197, 253, 0.3)", // soft blue
          "rgba(192, 132, 252, 0.25)", // soft purple
          "rgba(253, 230, 138, 0.2)", // soft yellow
        ];
        element.style.setProperty(
          "--particle-color",
          colors[Math.floor(Math.random() * colors.length)],
        );
        element.style.setProperty("--move-x", `${Math.random() * 60 - 30}px`);
        element.style.setProperty("--move-y", `${Math.random() * 60 - 30}px`);
        element.style.setProperty("--duration", `${Math.random() * 40 + 30}s`);
        element.style.setProperty("--delay", `${Math.random() * 15}s`);
        element.style.setProperty("--opacity", Math.random() * 0.4 + 0.2);
      } else {
        // Dark mode stars - glowing colors
        const colors = [
          "rgba(96, 165, 250, 0.6)", // blue glow
          "rgba(124, 58, 237, 0.5)", // purple glow
          "rgba(248, 250, 252, 0.4)", // white glow
        ];
        element.style.setProperty(
          "--star-color",
          colors[Math.floor(Math.random() * colors.length)],
        );
        element.style.setProperty("--duration", `${Math.random() * 25 + 15}s`);
        element.style.setProperty("--delay", `${Math.random() * 10}s`);
        element.style.setProperty("--size", `${size * 4}px`);
      }

      container.appendChild(element);
    }
  }

  // Initial creation
  createParticles();

  // Recreate on theme change
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        setTimeout(createParticles, 500); // Wait for transition to complete
      }
    });
  });

  observer.observe(document.body, { attributes: true });

  // Adjust on resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createParticles, 250);
  });

  // Recreate periodically to keep fresh
  setInterval(createParticles, 60000); // Every minute
}

// Initialize the app
function initApp() {
  // Initialize theme
  initTheme();

  // Set up theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Create sun rays and stars containers
  sunRays.innerHTML = "";
  starsContainer.innerHTML = "";

  // Initialize background animations
  createBackgroundAnimations();

  // Initial update
  updateDateTime();

  // Update every second
  setInterval(updateDateTime, 1000);
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Add performance optimization for animations
let lastTime = 0;
function optimizeAnimations() {
  const now = performance.now();
  if (now - lastTime > 1000) {
    const particles = document.querySelectorAll(".particle, .star");
    particles.forEach((particle) => {
      const isInViewport =
        particle.getBoundingClientRect().top < window.innerHeight;
      particle.style.animationPlayState = isInViewport ? "running" : "paused";
    });
    lastTime = now;
  }
  requestAnimationFrame(optimizeAnimations);
}

// Start animation optimization
requestAnimationFrame(optimizeAnimations);
