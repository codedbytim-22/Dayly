// Assets/scripts/scripts.js - COMPLETE WORKING VERSION

// ============================================
// APP STATE & CONFIGURATION
// ============================================

const APP_CONFIG = {
  VERSION: "1.4.0",
  UPDATE_INTERVAL: 1000,
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
// CORE UTILITIES
// ============================================

class DateUtils {
  static formatDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  }

  static formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  static getDaysInYear(year) {
    return this.isLeapYear(year) ? 366 : 365;
  }

  static calculateProgress(currentDate) {
    const year = currentDate.getFullYear();
    const dayOfYearValue = this.getDayOfYear(currentDate);
    const totalDaysInYear = this.getDaysInYear(year);
    const progress = (dayOfYearValue / totalDaysInYear) * 100;

    return {
      year,
      dayOfYear: dayOfYearValue,
      totalDays: totalDaysInYear,
      progress: progress,
      daysRemaining: totalDaysInYear - dayOfYearValue,
    };
  }

  static formatDateString(date) {
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  }

  static getMonthName(monthIndex) {
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

  static getCurrentSeason(date, hemisphere = "northern") {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const seasons = APP_CONFIG.SEASONS[hemisphere];

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
          if (month === season.startMonth && day < season.startDay) continue;
          if (month === season.endMonth && day > season.endDay) continue;
          return season;
        }
      } else {
        if (month > season.startMonth && month < season.endMonth) return season;
        if (month === season.startMonth && day >= season.startDay)
          return season;
        if (month === season.endMonth && day <= season.endDay) return season;
      }
    }
    return Object.values(seasons)[0];
  }
}

// ============================================
// STATE MANAGEMENT
// ============================================

class AppState {
  constructor() {
    this.streak = this.loadStreak();
    this.goal = this.loadGoal();
    this.theme = this.loadTheme();
  }

  // Streak management
  loadStreak() {
    const defaultData = {
      count: 0,
      lastCheckIn: null,
      checkIns: {},
      longestStreak: 0,
    };
    try {
      const saved = localStorage.getItem("yearProgress_streak");
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  }

  saveStreak() {
    try {
      localStorage.setItem("yearProgress_streak", JSON.stringify(this.streak));
    } catch (e) {
      console.error("Error saving streak:", e);
    }
  }

  // Goal management with streak reset logic
  loadGoal() {
    const defaultData = {
      title: "",
      startDate: null,
      progressDays: 0,
      totalDays: 90,
      checkIns: {},
      completed: false,
      lastProgressDate: null,
      goalStreak: 0,
      longestGoalStreak: 0,
    };
    try {
      const saved = localStorage.getItem("yearProgress_goal");
      return saved ? JSON.parse(saved) : defaultData;
    } catch {
      return defaultData;
    }
  }

  saveGoal() {
    try {
      localStorage.setItem("yearProgress_goal", JSON.stringify(this.goal));
    } catch (e) {
      console.error("Error saving goal:", e);
    }
  }

  // Theme management
  loadTheme() {
    const saved = localStorage.getItem("yearProgressTheme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  saveTheme() {
    localStorage.setItem("yearProgressTheme", this.theme);
  }

  // Utility methods
  getToday() {
    return DateUtils.formatDateString(new Date());
  }

  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return DateUtils.formatDateString(yesterday);
  }

  isToday(dateStr) {
    return dateStr === this.getToday();
  }

  isYesterday(dateStr) {
    return dateStr === this.getYesterday();
  }

  daysBetween(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  }

  // Check for missed days on load
  checkStreakReset() {
    const today = this.getToday();
    if (!this.streak.lastCheckIn) return;
    if (this.streak.lastCheckIn === today) return;

    const daysDiff = this.daysBetween(this.streak.lastCheckIn, today);
    if (daysDiff > 1) {
      console.log(`Streak reset: Missed ${daysDiff} days`);
      this.streak.count = 0;
      this.saveStreak();
    }
  }

  checkGoalStreakReset() {
    const today = this.getToday();
    if (!this.goal.title || !this.goal.lastProgressDate) return;
    if (this.goal.lastProgressDate === today) return;

    const daysDiff = this.daysBetween(this.goal.lastProgressDate, today);
    if (daysDiff > 1) {
      console.log(`Goal progress reset: Missed ${daysDiff} days`);
      this.goal.progressDays = 0;
      this.goal.checkIns = {};
      this.goal.goalStreak = 0;
      this.goal.completed = false;
      this.saveGoal();
    }
  }
}

// ============================================
// BUSINESS LOGIC
// ============================================

class AppLogic {
  constructor(state) {
    this.state = state;
  }

  processStreakCheckIn() {
    const today = this.state.getToday();

    // Check if already checked in today
    if (this.state.streak.checkIns[today]) {
      return { success: false, message: "Already checked in today!" };
    }

    const yesterday = this.state.getYesterday();
    let message = "";

    // Determine streak logic
    if (!this.state.streak.lastCheckIn) {
      // First check-in ever
      this.state.streak.count = 1;
      message = "🎉 First day! Your streak begins!";
    } else if (this.state.streak.lastCheckIn === yesterday) {
      // Consecutive day
      this.state.streak.count++;
      message = `🔥 Day ${this.state.streak.count}! Keep the streak going!`;
    } else if (this.state.streak.lastCheckIn === today) {
      // Already checked in today (shouldn't reach here)
      return { success: false, message: "Already checked in today!" };
    } else {
      // Missed one or more days
      const daysMissed = this.state.daysBetween(
        this.state.streak.lastCheckIn,
        today,
      );
      this.state.streak.count = 1;
      message = `💔 Missed ${daysMissed} days. Starting fresh!`;
    }

    // Update state
    this.state.streak.checkIns[today] = 1;
    this.state.streak.lastCheckIn = today;

    // Update longest streak
    if (this.state.streak.count > this.state.streak.longestStreak) {
      this.state.streak.longestStreak = this.state.streak.count;
    }

    this.state.saveStreak();

    return { success: true, message, streak: this.state.streak.count };
  }

  processGoalProgress() {
    const today = this.state.getToday();
    const yesterday = this.state.getYesterday();

    // Check if goal exists
    if (!this.state.goal.title || !this.state.goal.startDate) {
      return { success: false, message: "No goal set!" };
    }

    // Check if already recorded today
    if (this.state.goal.checkIns[today]) {
      return { success: false, message: "Already recorded progress today!" };
    }

    // Goal streak logic
    let streakMessage = "";
    if (!this.state.goal.lastProgressDate) {
      // First progress ever
      this.state.goal.goalStreak = 1;
      streakMessage = "First day of your goal streak!";
    } else if (this.state.goal.lastProgressDate === yesterday) {
      // Consecutive day - streak continues
      this.state.goal.goalStreak++;
      streakMessage = `🔥 Goal streak: ${this.state.goal.goalStreak} days!`;
    } else if (this.state.goal.lastProgressDate === today) {
      // Already recorded today (shouldn't reach here)
      return { success: false, message: "Already recorded progress today!" };
    } else {
      // MISSED ONE OR MORE DAYS - RESET PROGRESS TO ZERO
      const daysMissed = this.state.daysBetween(
        this.state.goal.lastProgressDate,
        today,
      );

      // Reset progress to zero
      this.state.goal.progressDays = 0;
      this.state.goal.checkIns = {};
      this.state.goal.goalStreak = 1;

      streakMessage = `💔 Missed ${daysMissed} day(s). Progress reset to 0. Starting fresh!`;
    }

    // Update progress
    this.state.goal.checkIns[today] = true;
    this.state.goal.progressDays++;
    this.state.goal.lastProgressDate = today;

    // Update longest goal streak
    if (this.state.goal.goalStreak > this.state.goal.longestGoalStreak) {
      this.state.goal.longestGoalStreak = this.state.goal.goalStreak;
    }

    let message = `✅ Day ${this.state.goal.progressDays} recorded! ${streakMessage}`;

    // Check if goal completed
    if (this.state.goal.progressDays >= this.state.goal.totalDays) {
      this.state.goal.completed = true;
      message = `🎉 CONGRATULATIONS! You completed your goal: "${this.state.goal.title}"!`;
    }

    this.state.saveGoal();

    return {
      success: true,
      message,
      progressDays: this.state.goal.progressDays,
      totalDays: this.state.goal.totalDays,
      goalStreak: this.state.goal.goalStreak,
      completed: this.state.goal.completed,
    };
  }

  setGoal(title, totalDays) {
    this.state.goal = {
      title: title,
      startDate: this.state.getToday(),
      progressDays: 0,
      totalDays: totalDays,
      checkIns: {},
      completed: false,
      lastProgressDate: null,
      goalStreak: 0,
      longestGoalStreak: 0,
    };

    this.state.saveGoal();

    return {
      success: true,
      message: `🎯 Goal set! "${title}" for ${totalDays} days. Track daily to keep your progress!`,
    };
  }
}

// ============================================
// UI MANAGEMENT
// ============================================

class AppUI {
  constructor() {
    this.elements = {};
    this.initElements();
  }

  initElements() {
    this.elements = {
      dateDisplay: document.getElementById("dateDisplay"),
      timeDisplay: document.getElementById("timeDisplay"),
      progressBar: document.getElementById("progressBar"),
      percentageDisplay: document.getElementById("percentageDisplay"),
      progressText: document.getElementById("progressText"),
      percentText: document.getElementById("percentText"),
      yearLabel: document.getElementById("yearLabel"),
      dayOfYear: document.getElementById("dayOfYear"),
      daysRemaining: document.getElementById("daysRemaining"),
      totalDays: document.getElementById("totalDays"),
      seasonDropdown: document.getElementById("seasonDropdown"),
      seasonName: document.getElementById("seasonName"),
      seasonDates: document.getElementById("seasonDates"),
      currentYear: document.getElementById("currentYear"),
      versionInfo: document.getElementById("versionInfo"),
      streakCount: document.getElementById("streakCount"),
      streakGrid: document.querySelector(".streak-grid"),
      streakMessage: document.getElementById("streakMessage"),
      checkInButton: document.getElementById("checkInButton"),
      goalTitle: document.getElementById("goalTitle"),
      goalProgressFill: document.getElementById("goalProgressFill"),
      progressDays: document.querySelector("#goalDisplay #progressDays"),
      totalDaysGoal: document.querySelector("#goalDisplay #totalDays"),
      progressPercent: document.querySelector("#goalDisplay #progressPercent"),
      daysRemainingGoal: document.querySelector("#goalDisplay #daysRemaining"),
      startDate: document.getElementById("startDate"),
      completionDate: document.getElementById("completionDate"),
      motivationalMessage: document.getElementById("motivationalMessage"),
      goalDisplay: document.getElementById("goalDisplay"),
      goalSetup: document.getElementById("goalSetup"),
      goalInput: document.getElementById("goalInput"),
      goalDuration: document.getElementById("goalDuration"),
      customDuration: document.getElementById("customDuration"),
      customDays: document.getElementById("customDays"),
      saveGoalButton: document.getElementById("saveGoalButton"),
      progressButton: document.getElementById("progressButton"),
      editGoalButton: document.getElementById("editGoalButton"),
      lightBulb: document.querySelector(".light-bulb"),
      pullChain: document.querySelector(".pull-chain"),
      themeToggle: document.getElementById("themeToggle"),
      toggleSwitch: document.querySelector(".toggle-switch"),
    };
  }

  updateDateTime(date) {
    if (this.elements.dateDisplay) {
      this.elements.dateDisplay.textContent = DateUtils.formatDate(date);
    }
    if (this.elements.timeDisplay) {
      this.elements.timeDisplay.textContent = DateUtils.formatTime(date);
    }
  }

  updateYearProgress(progressData) {
    if (this.elements.yearLabel) {
      this.elements.yearLabel.textContent = progressData.year;
    }
    if (this.elements.percentageDisplay) {
      this.elements.percentageDisplay.textContent = `${progressData.progress.toFixed(2)}%`;
    }
    if (this.elements.percentText) {
      this.elements.percentText.textContent = `${progressData.progress.toFixed(2)}%`;
    }
    if (this.elements.progressBar) {
      this.elements.progressBar.style.width = `${progressData.progress}%`;
    }
    if (this.elements.progressText) {
      this.elements.progressText.textContent = `${progressData.year} is ${progressData.progress.toFixed(2)}% complete`;
    }
    if (this.elements.dayOfYear) {
      this.elements.dayOfYear.textContent = progressData.dayOfYear;
    }
    if (this.elements.daysRemaining) {
      this.elements.daysRemaining.textContent = progressData.daysRemaining;
    }
    if (this.elements.totalDays) {
      this.elements.totalDays.textContent = progressData.totalDays;
    }
    if (this.elements.currentYear) {
      this.elements.currentYear.textContent = progressData.year;
    }
  }

  updateSeason(date, hemisphere) {
    const season = DateUtils.getCurrentSeason(date, hemisphere);

    if (this.elements.seasonName) {
      this.elements.seasonName.textContent = season.name;
      this.elements.seasonName.style.color = season.color;
    }

    if (this.elements.seasonDates) {
      const startMonthName = DateUtils.getMonthName(season.startMonth - 1);
      const endMonthName = DateUtils.getMonthName(season.endMonth - 1);
      this.elements.seasonDates.textContent = `${startMonthName} ${season.startDay} - ${endMonthName} ${season.endDay}`;
    }
  }

  updateStreakDisplay(state) {
    if (this.elements.streakCount) {
      this.elements.streakCount.textContent = state.streak.count;
    }
    this.updateStreakGrid(state);
  }

  updateStreakGrid(state) {
    if (!this.elements.streakGrid) return;

    this.elements.streakGrid.innerHTML = "";
    const today = new Date();

    for (let week = 0; week < 4; week++) {
      const weekDiv = document.createElement("div");
      weekDiv.className = "week";

      for (let day = 6; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));

        const dateStr = DateUtils.formatDateString(date);
        const dayBox = document.createElement("div");
        dayBox.className = "day-box";
        dayBox.title = date.toLocaleDateString();

        if (state.streak.checkIns[dateStr]) {
          const level = state.streak.checkIns[dateStr];
          dayBox.classList.add(`level-${level}`);
          if (dateStr === DateUtils.formatDateString(today)) {
            dayBox.innerHTML = "✨";
            dayBox.style.background = "transparent";
          }
        }

        weekDiv.appendChild(dayBox);
      }
      this.elements.streakGrid.appendChild(weekDiv);
    }
  }

  updateGoalDisplay(state) {
    if (!state.goal.title) {
      this.showGoalSetup();
      return;
    }

    this.showGoalDisplay();

    if (this.elements.goalTitle) {
      this.elements.goalTitle.textContent = state.goal.title;
    }

    const progressPercent =
      (state.goal.progressDays / state.goal.totalDays) * 100;
    const remainingDays = state.goal.totalDays - state.goal.progressDays;

    if (this.elements.goalProgressFill) {
      this.elements.goalProgressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    if (this.elements.progressDays) {
      this.elements.progressDays.textContent = state.goal.progressDays;
    }
    if (this.elements.totalDaysGoal) {
      this.elements.totalDaysGoal.textContent = state.goal.totalDays;
    }
    if (this.elements.progressPercent) {
      const streakText =
        state.goal.goalStreak > 0
          ? ` (${state.goal.goalStreak}-day streak)`
          : "";
      this.elements.progressPercent.textContent = `${Math.min(progressPercent, 100).toFixed(1)}%${streakText}`;
    }
    if (this.elements.daysRemainingGoal) {
      this.elements.daysRemainingGoal.textContent = remainingDays;
    }

    if (state.goal.startDate && this.elements.startDate) {
      const start = new Date(state.goal.startDate);
      this.elements.startDate.textContent = start.toLocaleDateString();
    }

    if (state.goal.startDate && this.elements.completionDate) {
      const start = new Date(state.goal.startDate);
      const completionDate = new Date(start);
      completionDate.setDate(completionDate.getDate() + state.goal.totalDays);
      this.elements.completionDate.textContent =
        completionDate.toLocaleDateString();
    }
  }

  showGoalSetup() {
    if (this.elements.goalDisplay && this.elements.goalSetup) {
      this.elements.goalDisplay.style.display = "none";
      this.elements.goalSetup.style.display = "block";
      if (this.elements.progressButton) {
        this.elements.progressButton.disabled = true;
      }
    }
  }

  showGoalDisplay() {
    if (this.elements.goalDisplay && this.elements.goalSetup) {
      this.elements.goalDisplay.style.display = "block";
      this.elements.goalSetup.style.display = "none";
      if (this.elements.progressButton) {
        this.elements.progressButton.disabled = false;
      }
    }
  }

  showStreakMessage(text, duration = 5000) {
    if (!this.elements.streakMessage) return;
    this.elements.streakMessage.textContent = text;
    this.elements.streakMessage.classList.add("show");
    setTimeout(() => {
      this.elements.streakMessage.classList.remove("show");
    }, duration);
  }

  showGoalMessage(text, isError = false, duration = 5000) {
    if (!this.elements.motivationalMessage) return;
    this.elements.motivationalMessage.textContent = text;
    this.elements.motivationalMessage.style.background = isError
      ? "rgba(255, 107, 107, 0.1)"
      : "rgba(67, 97, 238, 0.1)";
    this.elements.motivationalMessage.style.color = isError
      ? "#ff6b6b"
      : "var(--accent-color)";
    this.elements.motivationalMessage.classList.add("show");
    setTimeout(() => {
      this.elements.motivationalMessage.classList.remove("show");
    }, duration);
  }

  updateCheckInButton(state) {
    if (!this.elements.checkInButton) return;

    const today = DateUtils.formatDateString(new Date());
    const isCheckedIn = !!state.streak.checkIns[today];

    if (isCheckedIn) {
      this.elements.checkInButton.innerHTML =
        '<i class="fas fa-check-circle"></i> Showed up today!';
      this.elements.checkInButton.style.background =
        "linear-gradient(135deg, #40c463, #30a14e)";
      this.elements.checkInButton.disabled = true;
    } else {
      this.elements.checkInButton.innerHTML =
        '<i class="fas fa-check-circle"></i> I showed up today!';
      this.elements.checkInButton.style.background =
        "linear-gradient(135deg, #ff6b6b, #ffa726)";
      this.elements.checkInButton.disabled = false;
    }
  }

  showWelcomeMessage(state) {
    if (state.streak.count === 0) {
      this.showStreakMessage(
        "Start your streak today! Come back tomorrow to continue.",
      );
    }
  }
}

// ============================================
// MAIN APP CONTROLLER
// ============================================

class YearProgressApp {
  constructor() {
    this.state = new AppState();
    this.logic = new AppLogic(this.state);
    this.ui = new AppUI();
    this.updateInterval = null;
    this.lastProgressUpdate = 0;
    this.PROGRESS_UPDATE_THROTTLE = 5000;
  }

  init() {
    console.log(`Year Progress Tracker v${APP_CONFIG.VERSION} initializing...`);

    // Check for streak resets
    this.state.checkStreakReset();
    this.state.checkGoalStreakReset();

    // Set version info
    if (this.ui.elements.versionInfo) {
      this.ui.elements.versionInfo.textContent = `v${APP_CONFIG.VERSION}`;
    }

    // Setup event listeners
    this.setupEventListeners();

    // Initial UI updates
    this.updateAllDisplays();
    this.ui.updateCheckInButton(this.state);
    this.ui.updateGoalDisplay(this.state);
    this.ui.updateStreakDisplay(this.state);
    this.ui.showWelcomeMessage(this.state);

    // Apply theme
    this.applyTheme();

    // Start update interval
    this.startUpdates();

    console.log("App initialized successfully");
  }

  setupEventListeners() {
    // Season dropdown
    if (this.ui.elements.seasonDropdown) {
      this.ui.elements.seasonDropdown.addEventListener("change", () => {
        this.updateSeason();
      });
    }

    // Check-in button
    if (this.ui.elements.checkInButton) {
      this.ui.elements.checkInButton.addEventListener("click", () => {
        this.handleCheckIn();
      });
    }

    // Goal progress button
    if (this.ui.elements.progressButton) {
      this.ui.elements.progressButton.addEventListener("click", () => {
        this.handleGoalProgress();
      });
    }

    // Save goal button
    if (this.ui.elements.saveGoalButton) {
      this.ui.elements.saveGoalButton.addEventListener("click", () => {
        this.handleSaveGoal();
      });
    }

    // Edit goal button
    if (this.ui.elements.editGoalButton) {
      this.ui.elements.editGoalButton.addEventListener("click", () => {
        this.ui.showGoalSetup();
      });
    }

    // Goal duration selector
    if (this.ui.elements.goalDuration) {
      this.ui.elements.goalDuration.addEventListener("change", (e) => {
        if (this.ui.elements.customDuration) {
          this.ui.elements.customDuration.style.display =
            e.target.value === "custom" ? "block" : "none";
        }
      });
    }

    // Theme toggle
    if (this.ui.elements.lightBulb) {
      this.ui.elements.lightBulb.addEventListener("click", () =>
        this.toggleTheme(),
      );
    }
    if (this.ui.elements.themeToggle) {
      this.ui.elements.themeToggle.addEventListener("change", () =>
        this.toggleTheme(),
      );
    }
  }

  handleCheckIn() {
    const result = this.logic.processStreakCheckIn();
    if (result.success) {
      this.ui.showStreakMessage(result.message);
      this.ui.updateStreakDisplay(this.state);
      this.ui.updateCheckInButton(this.state);
      this.animateButton(this.ui.elements.checkInButton);
    } else {
      this.ui.showStreakMessage(result.message);
    }
  }

  handleGoalProgress() {
    const result = this.logic.processGoalProgress();
    if (result.success) {
      this.ui.showGoalMessage(result.message);
      this.ui.updateGoalDisplay(this.state);
      this.animateButton(this.ui.elements.progressButton);

      if (result.message.includes("reset to 0")) {
        this.ui.showGoalMessage(
          "💔 Progress reset! Track daily to avoid resets.",
          false,
          8000,
        );
      }
    } else {
      this.ui.showGoalMessage(result.message, true);
    }
  }

  handleSaveGoal() {
    if (!this.ui.elements.goalInput || !this.ui.elements.goalDuration) return;

    const title = this.ui.elements.goalInput.value.trim();
    if (!title) {
      this.ui.showGoalMessage("Please enter a goal!", true);
      return;
    }

    let totalDays;
    if (this.ui.elements.goalDuration.value === "custom") {
      const customDaysInput = this.ui.elements.customDays;
      totalDays = customDaysInput ? parseInt(customDaysInput.value) || 90 : 90;
      if (totalDays < 7) totalDays = 7;
      if (totalDays > 730) totalDays = 730;
    } else {
      totalDays = parseInt(this.ui.elements.goalDuration.value);
    }

    const result = this.logic.setGoal(title, totalDays);
    if (result.success) {
      this.ui.showGoalMessage(result.message);
      this.ui.updateGoalDisplay(this.state);
    }
  }

  updateAllDisplays() {
    const now = new Date();
    const timestamp = now.getTime();

    // Update date/time
    this.ui.updateDateTime(now);

    // Update year progress
    const progressData = DateUtils.calculateProgress(now);
    this.ui.updateYearProgress(progressData);

    // Throttle detailed updates
    if (timestamp - this.lastProgressUpdate > this.PROGRESS_UPDATE_THROTTLE) {
      this.lastProgressUpdate = timestamp;
    }

    // Update season
    const hemisphere = this.ui.elements.seasonDropdown
      ? this.ui.elements.seasonDropdown.value
      : "northern";
    this.ui.updateSeason(now, hemisphere);
  }

  updateSeason() {
    const now = new Date();
    const hemisphere = this.ui.elements.seasonDropdown
      ? this.ui.elements.seasonDropdown.value
      : "northern";
    this.ui.updateSeason(now, hemisphere);
  }

  startUpdates() {
    this.updateInterval = setInterval(() => {
      this.updateAllDisplays();
    }, APP_CONFIG.UPDATE_INTERVAL);
  }

  animateButton(button) {
    if (!button) return;
    button.classList.add("check-in-pulse");
    setTimeout(() => {
      button.classList.remove("check-in-pulse");
    }, 500);
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.state.theme);
    if (this.ui.elements.lightBulb) {
      this.ui.elements.lightBulb.classList.toggle(
        "on",
        this.state.theme === "light",
      );
    }
    if (this.ui.elements.themeToggle) {
      this.ui.elements.themeToggle.checked = this.state.theme === "light";
    }
    if (this.ui.elements.toggleSwitch) {
      setTimeout(() => {
        this.ui.elements.toggleSwitch.classList.add("visible");
      }, 1000);
    }
  }

  toggleTheme() {
    this.state.theme = this.state.theme === "dark" ? "light" : "dark";
    this.state.saveTheme();
    this.applyTheme();

    // Animate pull chain
    if (this.ui.elements.pullChain) {
      this.ui.elements.pullChain.classList.add("pulling");
      setTimeout(() => {
        this.ui.elements.pullChain.classList.remove("pulling");
      }, 500);
    }
  }

  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// ============================================
// INITIALIZE APP
// ============================================

let app;

document.addEventListener("DOMContentLoaded", () => {
  app = new YearProgressApp();
  app.init();

  window.addEventListener("beforeunload", () => {
    app.cleanup();
  });
});
