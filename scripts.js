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
  document.dispatchEvent(new CustomEvent("themeChanged", { detail: "light" }));
}

function setDarkMode() {
  document.body.classList.remove("light-mode");
  document.body.classList.add("dark-mode");
  isDarkMode = true;
  localStorage.setItem("yearProgressTheme", "dark");
  document.dispatchEvent(new CustomEvent("themeChanged", { detail: "dark" }));
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

// Enhanced Sun Animation
function triggerSunAnimation() {
  sunRays.innerHTML = "";

  // Create 12 rays for more dynamic effect
  for (let i = 0; i < 12; i++) {
    const ray = document.createElement("div");
    ray.className = "sun-ray";
    const delay = i * 0.1;
    const length = 15 + Math.random() * 10;

    ray.style.cssText = `
      --length: ${length}px;
      --rot: ${i * 30}deg;
      --delay: ${delay}s;
    `;

    sunRays.appendChild(ray);
  }

  // Add glow effect
  const glow = document.createElement("div");
  glow.className = "sun-glow";
  sunRays.appendChild(glow);

  sunRays.classList.add("sun-animation");
  setTimeout(() => {
    sunRays.classList.remove("sun-animation");
  }, 1500);
}

// Enhanced Moon Stars Animation
function triggerMoonStarsAnimation() {
  starsContainer.innerHTML = "";

  // Create 20 stars with varied timing
  for (let i = 0; i < 20; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const angle = Math.random() * Math.PI * 2;
    const distance = 15 + Math.random() * 40;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const delay = Math.random() * 0.5;
    const size = 2 + Math.random() * 3;
    const duration = 1 + Math.random() * 1.5;

    // Create unique animation for each star
    const animationName = `starEmit${i}`;
    const keyframes = `
      @keyframes ${animationName} {
        0% { 
          transform: translate(-50%, -50%) scale(0); 
          opacity: 0;
        }
        20% { 
          transform: translate(calc(-50% + ${tx * 0.3}px), calc(-50% + ${ty * 0.3}px)) scale(1.5); 
          opacity: 1;
        }
        40% { 
          transform: translate(calc(-50% + ${tx * 0.7}px), calc(-50% + ${ty * 0.7}px)) scale(1); 
          opacity: 0.7;
        }
        70% { 
          transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0.8); 
          opacity: 0.3;
        }
        100% { 
          transform: translate(calc(-50% + ${tx * 1.2}px), calc(-50% + ${ty * 1.2}px)) scale(0.5); 
          opacity: 0;
        }
      }
    `;

    // Add the keyframes to the document
    const style = document.createElement("style");
    style.textContent = keyframes;
    document.head.appendChild(style);

    star.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: white;
      border-radius: 50%;
      left: 50%;
      top: 50%;
      box-shadow: 0 0 ${size * 2}px white;
      opacity: 0;
      animation: ${animationName} ${duration}s ease-out ${delay}s forwards;
    `;

    starsContainer.appendChild(star);

    // Clean up the style element after animation
    setTimeout(
      () => {
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      },
      (duration + delay) * 1000,
    );
  }

  // Add moon glow
  const moonGlow = document.createElement("div");
  moonGlow.className = "moon-glow";
  starsContainer.appendChild(moonGlow);

  starsContainer.classList.add("moon-stars-animation");
  setTimeout(() => {
    starsContainer.classList.remove("moon-stars-animation");
  }, 2000);
}

// Particle System Class
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.container = null;
    this.isActive = true;
    this.particleCount = window.innerWidth < 768 ? 15 : 25;
    this.animationId = null;

    this.init();
  }

  init() {
    this.createContainer();
    this.generateParticles();
    this.startAnimation();

    // Toggle with theme
    document.addEventListener("themeChanged", () => {
      this.resetParticles();
    });
  }

  createContainer() {
    this.container = document.createElement("div");
    this.container.className = "particle-system";
    document.body.appendChild(this.container);
  }

  generateParticles() {
    this.clearParticles();

    const isLight = document.body.classList.contains("light-mode");
    const colors = isLight
      ? [
          "rgba(147, 197, 253, 0.3)",
          "rgba(192, 132, 252, 0.25)",
          "rgba(253, 230, 138, 0.2)",
        ]
      : [
          "rgba(96, 165, 250, 0.4)",
          "rgba(124, 58, 237, 0.3)",
          "rgba(248, 250, 252, 0.25)",
        ];

    for (let i = 0; i < this.particleCount; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 4 + 2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 30 + 20;
      const delay = Math.random() * 10;

      particle.className = isLight ? "particle" : "star";
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        --duration: ${duration}s;
        --delay: ${delay}s;
      `;

      if (isLight) {
        particle.style.setProperty(
          "--particle-color",
          colors[Math.floor(Math.random() * colors.length)],
        );
        particle.style.setProperty("--move-x", `${Math.random() * 60 - 30}px`);
        particle.style.setProperty("--move-y", `${Math.random() * 60 - 30}px`);
        particle.style.setProperty("--opacity", Math.random() * 0.4 + 0.2);
        particle.style.setProperty("--blur", "2px");
      } else {
        particle.style.setProperty(
          "--star-color",
          colors[Math.floor(Math.random() * colors.length)],
        );
        particle.style.setProperty("--size", `${size * 4}px`);
      }

      this.container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  clearParticles() {
    if (this.container) {
      this.container.innerHTML = "";
    }
    this.particles = [];
  }

  resetParticles() {
    this.clearParticles();
    this.generateParticles();
  }

  startAnimation() {
    if ("requestAnimationFrame" in window) {
      this.animate();
    }
  }

  animate() {
    if (!this.isActive) return;

    // Subtle continuous movement for particles
    this.particles.forEach((particle, i) => {
      if (particle.className === "particle") {
        const time = Date.now() / 10000;
        const x = Math.sin(time + i) * 1;
        const y = Math.cos(time + i) * 1;
        const currentTransform =
          particle.style.transform || "translate(0px, 0px)";
        particle.style.transform = `translate(${x}px, ${y}px) ${currentTransform.replace(/translate\([^)]+\)/, "")}`;
      }
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.clearParticles();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
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
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Initialize theme
  initTheme();

  // Set up theme toggle
  themeToggle.addEventListener("click", toggleTheme);

  // Initialize sun rays and stars containers
  sunRays.innerHTML = "";
  starsContainer.innerHTML = "";

  // Initialize background animations (only if not reduced motion)
  if (!prefersReducedMotion) {
    window.particleSystem = new ParticleSystem();
  }

  // Initial date/time update
  updateDateTime();

  // Set up interval for updates
  setInterval(updateDateTime, 1000);

  // Service worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("Service Worker update found!");

          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New content is available; please refresh.");
              // You could show a notification here
            }
          });
        });
      })
      .catch((error) => {
        console.log("Service Worker registration failed:", error);
      });
  }

  // Handle offline/online status
  window.addEventListener("online", () => {
    console.log("App is online");
    document.body.classList.remove("offline");
  });

  window.addEventListener("offline", () => {
    console.log("App is offline");
    document.body.classList.add("offline");
  });

  // Check initial connection status
  if (!navigator.onLine) {
    document.body.classList.add("offline");
  }

  // Handle visibility changes
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      // Refresh time when tab becomes visible
      updateDateTime();
    }
  });
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Handle page unloading
window.addEventListener("beforeunload", () => {
  if (window.particleSystem) {
    window.particleSystem.destroy();
  }
});
