// Assets/scripts/logic.js

const APP_LOGIC = {
  // Date utilities
  formatDate(date) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  },

  formatTime(date) {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  },

  // Year progress calculations
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  },

  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  },

  getDaysInYear(year) {
    return this.isLeapYear(year) ? 366 : 365;
  },

  calculateProgress(currentDate) {
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
  },

  // Streak logic
  checkStreakReset() {
    const today = APP_STATE.getToday();

    // If user has never checked in, do nothing
    if (!APP_STATE.streak.lastCheckIn) return;

    // If last check-in was today, streak is fine
    if (APP_STATE.streak.lastCheckIn === today) return;

    const daysDiff = APP_STATE.daysBetween(APP_STATE.streak.lastCheckIn, today);

    // If missed more than 1 day, reset streak
    if (daysDiff > 1) {
      console.log(`Streak reset: Missed ${daysDiff} days`);
      APP_STATE.streak.count = 0;
      APP_STATE.saveStreak();
    }
  },

  processStreakCheckIn() {
    const today = APP_STATE.getToday();

    // Check if already checked in today
    if (APP_STATE.streak.checkIns[today]) {
      return { success: false, message: "Already checked in today!" };
    }

    const yesterday = APP_STATE.getYesterday();
    let message = "";

    // Determine streak logic
    if (!APP_STATE.streak.lastCheckIn) {
      // First check-in ever
      APP_STATE.streak.count = 1;
      message = "🎉 First day! Your streak begins!";
    } else if (APP_STATE.streak.lastCheckIn === yesterday) {
      // Consecutive day
      APP_STATE.streak.count++;
      message = `🔥 Day ${APP_STATE.streak.count}! Keep the streak going!`;
    } else if (APP_STATE.streak.lastCheckIn === today) {
      // Already checked in today (shouldn't reach here)
      return { success: false, message: "Already checked in today!" };
    } else {
      // Missed one or more days
      const daysMissed = APP_STATE.daysBetween(
        APP_STATE.streak.lastCheckIn,
        today,
      );
      APP_STATE.streak.count = 1;
      message = `💔 Missed ${daysMissed} days. Starting fresh!`;
    }

    // Update state
    APP_STATE.streak.checkIns[today] = 1;
    APP_STATE.streak.lastCheckIn = today;

    // Update longest streak
    if (APP_STATE.streak.count > APP_STATE.streak.longestStreak) {
      APP_STATE.streak.longestStreak = APP_STATE.streak.count;
    }

    APP_STATE.saveStreak();

    return { success: true, message, streak: APP_STATE.streak.count };
  },

  // Goal logic
  processGoalProgress() {
    const today = APP_STATE.getToday();

    // Check if goal exists
    if (!APP_STATE.goal.title || !APP_STATE.goal.startDate) {
      return { success: false, message: "No goal set!" };
    }

    // Check if already recorded today
    if (APP_STATE.goal.checkIns[today]) {
      return { success: false, message: "Already recorded progress today!" };
    }

    // Update progress
    APP_STATE.goal.checkIns[today] = true;
    APP_STATE.goal.progressDays++;

    let message = `✅ Day ${APP_STATE.goal.progressDays} recorded! Keep going!`;

    // Check if goal completed
    if (APP_STATE.goal.progressDays >= APP_STATE.goal.totalDays) {
      APP_STATE.goal.completed = true;
      message = `🎉 CONGRATULATIONS! You completed your goal: "${APP_STATE.goal.title}"!`;
    }

    APP_STATE.saveGoal();

    return {
      success: true,
      message,
      progressDays: APP_STATE.goal.progressDays,
      totalDays: APP_STATE.goal.totalDays,
      completed: APP_STATE.goal.completed,
    };
  },

  setGoal(title, totalDays) {
    APP_STATE.goal = {
      title: title,
      startDate: APP_STATE.getToday(),
      progressDays: 0,
      totalDays: totalDays,
      checkIns: {},
      completed: false,
    };

    APP_STATE.saveGoal();

    return {
      success: true,
      message: `🎯 Goal set! "${title}" for ${totalDays} days. Start tracking!`,
    };
  },

  // Seasonal logic
  getCurrentSeason(date, hemisphere = "northern") {
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
  },
};
