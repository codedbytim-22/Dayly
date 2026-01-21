// DOM Elements
const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const progressBar = document.getElementById("progressBar");
const percentageDisplay = document.getElementById("percentageDisplay");
const progressText = document.getElementById("progressText");
const percentText = document.getElementById("percentText");
const yearLabel = document.getElementById("yearLabel");
const dayOfYear = document.getElementById("dayOfYear");
const daysRemaining = document.getElementById("daysRemaining");
const totalDays = document.getElementById("totalDays");
const seasonDropdown = document.getElementById("seasonDropdown");
const seasonName = document.getElementById("seasonName");
const seasonDates = document.getElementById("seasonDates");
const currentYear = document.getElementById("currentYear");
const versionInfo = document.getElementById("versionInfo");

// Theme Toggle Elements
const lightBulb = document.querySelector(".light-bulb");
const pullChain = document.querySelector(".pull-chain");
const themeToggle = document.getElementById("themeToggle");
const toggleSwitch = document.querySelector(".toggle-switch");

// App Configuration
const CONFIG = {
  VERSION: "1.2.0",
  UPDATE_INTERVAL: 1000,
  PERFORMANCE: {
    THROTTLE_ANIMATIONS: true,
    ANIMATION_DURATION: 800,
    REDUCED_MOTION: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  },
  THEME: {
    DARK: "dark",
    LIGHT: "light",
    STORAGE_KEY: "yearProgressTheme",
  },
  BACKGROUND: {
    PARTICLE_COUNT: 50,
    DATA_STREAMS: 4,
    GRID_SIZE: 40,
  },
  SEASONS: {
    northern: {
      spring: {
        name: "Spring",
        startMonth: 2,
        startDay: 20,
        endMonth: 5,
        endDay: 20,
        icon: "fas fa-seedling",
        color: "#4ade80",
      },
      summer: {
        name: "Summer",
        startMonth: 5,
        startDay: 21,
        endMonth: 8,
        endDay: 22,
        icon: "fas fa-sun",
        color: "#fbbf24",
      },
      autumn: {
        name: "Autumn",
        startMonth: 8,
        startDay: 23,
        endMonth: 11,
        endDay: 21,
        icon: "fas fa-leaf",
        color: "#f97316",
      },
      winter: {
        name: "Winter",
        startMonth: 11,
        startDay: 22,
        endMonth: 1,
        endDay: 19,
        icon: "fas fa-snowflake",
        color: "#60a5fa",
      },
    },
    southern: {
      autumn: {
        name: "Autumn",
        startMonth: 2,
        startDay: 20,
        endMonth: 5,
        endDay: 20,
        icon: "fas fa-leaf",
        color: "#f97316",
      },
      winter: {
        name: "Winter",
        startMonth: 5,
        startDay: 21,
        endMonth: 8,
        endDay: 22,
        icon: "fas fa-snowflake",
        color: "#60a5fa",
      },
      spring: {
        name: "Spring",
        startMonth: 8,
        startDay: 23,
        endMonth: 11,
        endDay: 21,
        icon: "fas fa-seedling",
        color: "#4ade80",
      },
      summer: {
        name: "Summer",
        startMonth: 11,
        startDay: 22,
        endMonth: 1,
        endDay: 19,
        icon: "fas fa-sun",
        color: "#fbbf24",
      },
    },
  },
};

// ============================================
// SOPHISTICATED BACKGROUND SYSTEM
// ============================================

class BackgroundSystem {
  constructor() {
    this.particles = [];
    this.isReducedMotion = CONFIG.PERFORMANCE.REDUCED_MOTION;
    this.init();
  }

  init() {
    if (this.isReducedMotion) return;

    this.createGridLayer();
    this.createTimePulse();
    this.createDataStreams();
    this.createParticles();
  }

  createGridLayer() {
    const gridLayer = document.createElement("div");
    gridLayer.className = "grid-layer";
    document.body.appendChild(gridLayer);
  }

  createTimePulse() {
    const timePulse = document.createElement("div");
    timePulse.className = "time-pulse";
    document.body.appendChild(timePulse);
  }

  createDataStreams() {
    const streamsContainer = document.createElement("div");
    streamsContainer.className = "data-streams";

    // Create 4 data streams (2 on each side)
    for (let i = 0; i < CONFIG.BACKGROUND.DATA_STREAMS; i++) {
      const stream = document.createElement("div");
      const isLeft = i < 2;
      const position = i % 2 === 0 ? 1 : 2;

      stream.className = `data-stream ${isLeft ? "left" : "right"}-${position}`;
      streamsContainer.appendChild(stream);
    }

    document.body.appendChild(streamsContainer);
  }

  createParticles() {
    const particlesContainer = document.createElement("div");
    particlesContainer.className = "particles";
    document.body.appendChild(particlesContainer);

    // Calculate optimal particle count based on screen size
    const particleCount =
      window.innerWidth < 768
        ? Math.floor(CONFIG.BACKGROUND.PARTICLE_COUNT / 2)
        : CONFIG.BACKGROUND.PARTICLE_COUNT;

    for (let i = 0; i < particleCount; i++) {
      this.createParticle(particlesContainer, i);
    }
  }

  createParticle(container, index) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Calculate position based on golden ratio for natural distribution
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angle = (index * 2 * Math.PI) / goldenRatio;
    const radius = Math.sqrt(index) * 2;

    const x = 50 + radius * Math.cos(angle);
    const drift = Math.sin(angle) * 2; // Natural drift pattern

    // Size based on distance from center (smaller at edges)
    const centerDistance = Math.abs(x - 50) / 50;
    const size = 1 + (1 - centerDistance) * 1.5;

    // Speed based on position (faster near center)
    const speed = 20 + (1 - centerDistance) * 15;

    // Delayed start for staggered appearance
    const delay = index * 0.1;

    particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}vw;
            animation-delay: ${delay}s;
            animation-duration: ${speed}s;
            --particle-drift: ${drift};
        `;

    // Store reference
    this.particles.push({
      element: particle,
      x,
      drift,
      speed,
      delay,
    });

    container.appendChild(particle);
  }

  updateForTheme(isDark) {
    // Update particle colors based on theme
    const particles = document.querySelectorAll(".particle");
    particles.forEach((particle) => {
      particle.style.background = isDark
        ? "rgba(76, 201, 240, 0.3)"
        : "rgba(67, 97, 238, 0.2)";
    });
  }

  updateForPerformance() {
    // Throttle animations if needed
    if (window.performance && window.performance.memory) {
      const usedJSHeapSize = window.performance.memory.usedJSHeapSize;
      const maxHeapSize = window.performance.memory.jsHeapSizeLimit;

      if (usedJSHeapSize > maxHeapSize * 0.7) {
        this.throttleAnimations();
      }
    }
  }

  throttleAnimations() {
    // Reduce animation intensity if memory is high
    const animations = document.querySelectorAll(".particle, .data-stream");
    animations.forEach((anim) => {
      const currentDuration = parseFloat(
        getComputedStyle(anim).animationDuration,
      );
      anim.style.animationDuration = `${currentDuration * 1.5}s`;
    });
  }
}

// ============================================
// THEME MANAGEMENT
// ============================================

class ThemeManager {
  constructor(backgroundSystem) {
    this.currentTheme = this.getPreferredTheme();
    this.backgroundSystem = backgroundSystem;
    this.init();
  }

  getPreferredTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME.STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? CONFIG.THEME.DARK
      : CONFIG.THEME.LIGHT;
  }

  init() {
    this.setTheme(this.currentTheme);
    this.setupEventListeners();
    this.watchSystemTheme();
  }

  setTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(CONFIG.THEME.STORAGE_KEY, theme);

    const isDark = theme === CONFIG.THEME.DARK;
    this.updateUI(isDark);

    // Update background system
    if (this.backgroundSystem) {
      this.backgroundSystem.updateForTheme(isDark);
    }
  }

  toggleTheme() {
    const newTheme =
      this.currentTheme === CONFIG.THEME.DARK
        ? CONFIG.THEME.LIGHT
        : CONFIG.THEME.DARK;
    this.setTheme(newTheme);
    this.triggerPullChainAnimation();
    return newTheme;
  }

  updateUI(isDark) {
    if (lightBulb) {
      lightBulb.classList.toggle("on", !isDark);
    }

    if (themeToggle) {
      themeToggle.checked = !isDark;
    }
  }

  triggerPullChainAnimation() {
    if (pullChain) {
      pullChain.classList.add("pulling");
      setTimeout(() => {
        pullChain.classList.remove("pulling");
      }, 500);
    }
  }

  setupEventListeners() {
    if (lightBulb) {
      lightBulb.addEventListener("click", () => this.toggleTheme());
    }

    if (pullChain) {
      pullChain.addEventListener("click", () => this.toggleTheme());
    }

    if (themeToggle) {
      themeToggle.addEventListener("change", () => this.toggleTheme());
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", (e) => {
      if (!localStorage.getItem(CONFIG.THEME.STORAGE_KEY)) {
        this.setTheme(e.matches ? CONFIG.THEME.DARK : CONFIG.THEME.LIGHT);
      }
    });
  }
}

// ============================================
// CORE APP FUNCTIONALITY
// ============================================

// Utility Functions
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

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getDaysInYear(year) {
  return isLeapYear(year) ? 366 : 365;
}

function calculateProgress(currentDate) {
  const year = currentDate.getFullYear();
  const dayOfYearValue = getDayOfYear(currentDate);
  const totalDaysInYear = getDaysInYear(year);
  const progress = (dayOfYearValue / totalDaysInYear) * 100;

  return {
    year,
    dayOfYear: dayOfYearValue,
    totalDays: totalDaysInYear,
    progress: progress,
    daysRemaining: totalDaysInYear - dayOfYearValue,
  };
}

function getCurrentSeason(date, hemisphere = "northern") {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const seasons = CONFIG.SEASONS[hemisphere];

  for (const season of Object.values(seasons)) {
    const startDate = new Date(
      date.getFullYear(),
      season.startMonth - 1,
      season.startDay,
    );
    let endDate = new Date(
      date.getFullYear(),
      season.endMonth - 1,
      season.endDay,
    );

    if (season.startMonth > season.endMonth) {
      if (month >= season.startMonth || month <= season.endMonth) {
        if (month === season.startMonth && day < season.startDay) {
          continue;
        }
        if (month === season.endMonth && day > season.endDay) {
          continue;
        }
        return season;
      }
    } else {
      if (month > season.startMonth && month < season.endMonth) {
        return season;
      }
      if (month === season.startMonth && day >= season.startDay) {
        return season;
      }
      if (month === season.endMonth && day <= season.endDay) {
        return season;
      }
    }
  }

  return Object.values(seasons)[0];
}

// Performance Optimized Update Functions
let lastProgressUpdate = 0;
const PROGRESS_UPDATE_THROTTLE = 5000;

function updateDateTime() {
  const now = new Date();
  const timestamp = now.getTime();

  dateDisplay.textContent = formatDate(now);
  timeDisplay.textContent = formatTime(now);

  const progressData = calculateProgress(now);

  yearLabel.textContent = progressData.year;

  const formattedProgress = progressData.progress.toFixed(2);
  percentageDisplay.textContent = `${formattedProgress}%`;
  percentText.textContent = `${formattedProgress}%`;

  progressBar.style.width = `${progressData.progress}%`;

  if (timestamp - lastProgressUpdate > PROGRESS_UPDATE_THROTTLE) {
    dayOfYear.textContent = progressData.dayOfYear;
    daysRemaining.textContent = progressData.daysRemaining;
    totalDays.textContent = progressData.totalDays;
    lastProgressUpdate = timestamp;
  }

  updateSeason(now);
  currentYear.textContent = progressData.year;
}

function updateSeason(date) {
  const hemisphere = seasonDropdown.value;
  const season = getCurrentSeason(date, hemisphere);

  seasonName.textContent = season.name;
  seasonName.style.color = season.color;

  const startMonthName = getMonthName(season.startMonth - 1);
  const endMonthName = getMonthName(season.endMonth - 1);
  seasonDates.textContent = `${startMonthName} ${season.startDay} - ${endMonthName} ${season.endDay}`;

  const seasonIcon = document.querySelector(".season-icon i");
  if (seasonIcon) {
    seasonIcon.classList.remove(
      "fa-sun",
      "fa-snowflake",
      "fa-seedling",
      "fa-leaf",
    );
    const iconClasses = season.icon.split(" ");
    iconClasses.forEach((cls) => {
      if (cls) seasonIcon.classList.add(cls);
    });
    seasonIcon.style.color = season.color;
  }
}

function getMonthName(monthIndex) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[monthIndex];
}

// ============================================
// INITIALIZATION
// ============================================

let backgroundSystem;
let themeManager;
let updateInterval;

function init() {
  console.log(`Year Progress Tracker v${CONFIG.VERSION} initializing...`);

  // Initialize background system
  backgroundSystem = new BackgroundSystem();

  // Initialize theme manager with background system
  themeManager = new ThemeManager(backgroundSystem);

  // Set version info
  versionInfo.textContent = `v${CONFIG.VERSION}`;

  // Set initial progress text with percentage
  const now = new Date();
  const initialProgress = calculateProgress(now);

  progressText.textContent = `${initialProgress.year} is ${initialProgress.progress.toFixed(2)}% complete`;

  // Set up updates
  updateInterval = setInterval(updateDateTime, CONFIG.UPDATE_INTERVAL);

  // Event listeners
  seasonDropdown.addEventListener("change", () => {
    updateDateTime();
  });

  // Configure animations
  progressBar.style.transition = `width ${CONFIG.PERFORMANCE.ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

  // Animate toggle switch
  animateToggleSwitch();

  // Initial update
  updateDateTime();

  // Performance monitoring
  if (process.env.NODE_ENV === "development") {
    setupPerformanceMonitoring();
  }

  console.log("App initialized successfully");

  // Handle performance updates
  window.addEventListener("resize", handleResize);
}

function animateToggleSwitch() {
  setTimeout(() => {
    if (toggleSwitch) {
      toggleSwitch.classList.add("visible");
    }
  }, 1000);
}

function handleResize() {
  // Throttle resize handling
  clearTimeout(window.resizeTimeout);
  window.resizeTimeout = setTimeout(() => {
    if (backgroundSystem) {
      backgroundSystem.updateForPerformance();
    }
  }, 250);
}

function setupPerformanceMonitoring() {
  let frameCount = 0;
  let lastTime = performance.now();

  function checkFPS(currentTime) {
    frameCount++;

    if (currentTime > lastTime + 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

      if (fps < 30) {
        console.warn(`Low FPS: ${fps}. Consider reducing animations.`);
        if (backgroundSystem) {
          backgroundSystem.throttleAnimations();
        }
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  }

  requestAnimationFrame(checkFPS);
}

// ============================================
// SERVICE WORKER & CLEANUP
// ============================================

function registerServiceWorker() {
  if (
    "serviceWorker" in navigator &&
    (window.location.protocol === "https:" ||
      window.location.hostname === "localhost")
  ) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered:", registration);
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  }
}

function cleanup() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  window.removeEventListener("resize", handleResize);
}

// ============================================
// START THE APP
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  init();
  registerServiceWorker();

  window.addEventListener("beforeunload", cleanup);
});

// Export for testing if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateProgress,
    formatDate,
    formatTime,
    ThemeManager,
    BackgroundSystem,
  };
}
