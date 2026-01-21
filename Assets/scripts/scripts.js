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

// App Configuration
const CONFIG = {
  VERSION: "1.0.0",
  UPDATE_INTERVAL: 1000,
  PERFORMANCE: {
    THROTTLE_ANIMATIONS: true,
    ANIMATION_DURATION: 800,
  },
  SEASONS: {
    northern: {
      spring: {
        name: "Spring",
        startMonth: 2, // March (1-based: 3)
        startDay: 20,
        endMonth: 5, // June (1-based: 6)
        endDay: 20,
        icon: "fas fa-seedling",
        color: "#4ade80",
      },
      summer: {
        name: "Summer",
        startMonth: 5, // June
        startDay: 21,
        endMonth: 8, // September
        endDay: 22,
        icon: "fas fa-sun",
        color: "#fbbf24",
      },
      autumn: {
        name: "Autumn",
        startMonth: 8, // September
        startDay: 23,
        endMonth: 11, // December
        endDay: 21,
        icon: "fas fa-leaf",
        color: "#f97316",
      },
      winter: {
        name: "Winter",
        startMonth: 11, // December
        startDay: 22,
        endMonth: 1, // February
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
  const month = date.getMonth() + 1; // Convert to 1-based
  const day = date.getDate();
  const seasons = CONFIG.SEASONS[hemisphere];

  // Check each season
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

    // Handle year wrap-around for winter
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
const PROGRESS_UPDATE_THROTTLE = 5000; // Update detailed progress every 5 seconds

function updateDateTime() {
  const now = new Date();
  const timestamp = now.getTime();

  // Update date and time displays
  dateDisplay.textContent = formatDate(now);
  timeDisplay.textContent = formatTime(now);

  // Calculate progress
  const progressData = calculateProgress(now);

  // Update year label
  yearLabel.textContent = progressData.year;

  // Update percentage displays
  const formattedProgress = progressData.progress.toFixed(2);
  percentageDisplay.textContent = `${formattedProgress}%`;
  percentText.textContent = `${formattedProgress}%`;

  // Update progress bar width
  progressBar.style.width = `${progressData.progress}%`;

  // Throttle detailed updates for better performance
  if (timestamp - lastProgressUpdate > PROGRESS_UPDATE_THROTTLE) {
    dayOfYear.textContent = progressData.dayOfYear;
    daysRemaining.textContent = progressData.daysRemaining;
    totalDays.textContent = progressData.totalDays;
    lastProgressUpdate = timestamp;
  }

  // Update season (only if changed or first load)
  updateSeason(now);

  // Update footer year
  currentYear.textContent = progressData.year;
}

function updateSeason(date) {
  const hemisphere = seasonDropdown.value;
  const season = getCurrentSeason(date, hemisphere);

  // Update season name with color
  seasonName.textContent = season.name;
  seasonName.style.color = season.color;

  // CORRECTED: Convert 1-based to 0-based for month names
  const startMonthName = getMonthName(season.startMonth - 1);
  const endMonthName = getMonthName(season.endMonth - 1);
  seasonDates.textContent = `${startMonthName} ${season.startDay} - ${endMonthName} ${season.endDay}`;

  // Update season icon safely using classList
  const seasonIcon = document.querySelector(".season-icon i");
  if (seasonIcon) {
    // Remove previous season icon classes
    seasonIcon.classList.remove(
      "fa-sun",
      "fa-snowflake",
      "fa-seedling",
      "fa-leaf",
    );

    // Add new icon classes
    const iconClasses = season.icon.split(" ");
    iconClasses.forEach((cls) => {
      if (cls) seasonIcon.classList.add(cls);
    });

    // Update icon color
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

// Initialize App
function init() {
  console.log(`Year Progress Tracker v${CONFIG.VERSION} initializing...`);

  // Set version info
  versionInfo.textContent = `v${CONFIG.VERSION}`;

  // Set initial year in progress text
  const now = new Date();
  const initialProgress = calculateProgress(now);

  // Set up performance optimized updates
  const updateInterval = setInterval(updateDateTime, CONFIG.UPDATE_INTERVAL);

  // Set up event listeners with debouncing
  seasonDropdown.addEventListener("change", () => {
    updateDateTime();
  });

  // Configure smooth animations
  progressBar.style.transition = `width ${CONFIG.PERFORMANCE.ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;

  // Initial update
  updateDateTime();

  // Performance monitoring (dev only)
  if (process.env.NODE_ENV === "development") {
    monitorPerformance();
  }

  console.log("App initialized successfully");

  // Return cleanup function
  return () => clearInterval(updateInterval);
}

// Performance monitoring utility
function monitorPerformance() {
  let updateCount = 0;
  const startTime = performance.now();

  const originalUpdate = updateDateTime;
  updateDateTime = function () {
    const before = performance.now();
    originalUpdate();
    const after = performance.now();

    updateCount++;
    if (updateCount % 60 === 0) {
      // Log every minute
      console.log(`Avg update time: ${(after - before).toFixed(2)}ms`);
    }
  };
}

// Service Worker Registration
function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("ServiceWorker registered:", registration);

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          console.log("ServiceWorker update found:", newWorker);
        });
      })
      .catch((error) => {
        console.error("ServiceWorker registration failed:", error);
      });
  }
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const cleanup = init();

  // Register service worker
  if (
    window.location.protocol === "https:" ||
    window.location.hostname === "localhost"
  ) {
    registerServiceWorker();
  }

  // Cleanup on page unload
  window.addEventListener("beforeunload", cleanup);
});
