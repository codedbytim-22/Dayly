// Assets/scripts/state.js

const APP_STATE = {
  // Theme state
  theme:
    localStorage.getItem("yearProgressTheme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"),

  // Streak state schema
  streak: {
    count: 0,
    lastCheckIn: null, // "YYYY-MM-DD"
    checkIns: {}, // "YYYY-MM-DD": level
    longestStreak: 0,
  },

  // Goal state schema
  goal: {
    title: "",
    startDate: null, // "YYYY-MM-DD"
    progressDays: 0,
    totalDays: 90,
    checkIns: {}, // "YYYY-MM-DD": true
    completed: false,
  },

  // Initialize from localStorage
  init() {
    this.loadStreak();
    this.loadGoal();
  },

  // Streak methods
  loadStreak() {
    try {
      const saved = localStorage.getItem("yearProgress_streak");
      if (saved) {
        const data = JSON.parse(saved);
        this.streak = { ...this.streak, ...data };
      }
    } catch (e) {
      console.error("Error loading streak:", e);
    }
  },

  saveStreak() {
    try {
      localStorage.setItem("yearProgress_streak", JSON.stringify(this.streak));
    } catch (e) {
      console.error("Error saving streak:", e);
    }
  },

  // Goal methods
  loadGoal() {
    try {
      const saved = localStorage.getItem("yearProgress_goal");
      if (saved) {
        const data = JSON.parse(saved);
        this.goal = { ...this.goal, ...data };
      }
    } catch (e) {
      console.error("Error loading goal:", e);
    }
  },

  saveGoal() {
    try {
      localStorage.setItem("yearProgress_goal", JSON.stringify(this.goal));
    } catch (e) {
      console.error("Error saving goal:", e);
    }
  },

  // Theme methods
  saveTheme() {
    localStorage.setItem("yearProgressTheme", this.theme);
  },

  // Helper to format date as YYYY-MM-DD
  formatDate(date) {
    return date.toISOString().split("T")[0];
  },

  // Get today's date string
  getToday() {
    return this.formatDate(new Date());
  },

  // Get yesterday's date string
  getYesterday() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDate(yesterday);
  },

  // Check if date is today
  isToday(dateStr) {
    return dateStr === this.getToday();
  },

  // Check if date is yesterday
  isYesterday(dateStr) {
    return dateStr === this.getYesterday();
  },

  // Calculate days between two date strings
  daysBetween(dateStr1, dateStr2) {
    const date1 = new Date(dateStr1);
    const date2 = new Date(dateStr2);
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
  },
};
