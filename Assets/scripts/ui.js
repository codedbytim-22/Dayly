// Assets/scripts/ui.js

const APP_UI = {
  // DOM Elements cache
  elements: {},

  // Initialize UI elements
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
    };
  },

  // Update date and time display
  updateDateTime(date) {
    if (this.elements.dateDisplay) {
      this.elements.dateDisplay.textContent = APP_LOGIC.formatDate(date);
    }
    if (this.elements.timeDisplay) {
      this.elements.timeDisplay.textContent = APP_LOGIC.formatTime(date);
    }
  },

  // Update year progress
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
  },

  // Update season display
  updateSeason(date, hemisphere) {
    const season = APP_LOGIC.getCurrentSeason(date, hemisphere);

    if (this.elements.seasonName) {
      this.elements.seasonName.textContent = season.name;
      this.elements.seasonName.style.color = season.color;
    }

    if (this.elements.seasonDates) {
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
      const startMonthName = months[season.startMonth - 1];
      const endMonthName = months[season.endMonth - 1];
      this.elements.seasonDates.textContent = `${startMonthName} ${season.startDay} - ${endMonthName} ${season.endDay}`;
    }
  },

  // Update streak display
  updateStreakDisplay() {
    if (this.elements.streakCount) {
      this.elements.streakCount.textContent = APP_STATE.streak.count;
    }
    this.updateStreakGrid();
  },

  // Update streak grid (GitHub-style)
  updateStreakGrid() {
    if (!this.elements.streakGrid) return;

    this.elements.streakGrid.innerHTML = "";

    const today = new Date();
    for (let week = 0; week < 4; week++) {
      const weekDiv = document.createElement("div");
      weekDiv.className = "week";
      weekDiv.id = `week${week + 1}`;

      for (let day = 6; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));

        const dateStr = APP_STATE.formatDate(date);
        const dayBox = document.createElement("div");
        dayBox.className = "day-box";
        dayBox.title = date.toLocaleDateString();

        // Check if this date has a check-in
        if (APP_STATE.streak.checkIns[dateStr]) {
          const level = APP_STATE.streak.checkIns[dateStr];
          dayBox.classList.add(`level-${level}`);

          // Add sparkle for today's check-in
          if (APP_STATE.isToday(dateStr)) {
            dayBox.innerHTML = "✨";
            dayBox.style.background = "transparent";
          }
        }

        weekDiv.appendChild(dayBox);
      }
      this.elements.streakGrid.appendChild(weekDiv);
    }
  },

  // Update goal display
  updateGoalDisplay() {
    if (!APP_STATE.goal.title) {
      this.showGoalSetup();
      return;
    }

    this.showGoalDisplay();

    if (this.elements.goalTitle) {
      this.elements.goalTitle.textContent = APP_STATE.goal.title;
    }

    // Calculate progress
    const progressPercent =
      (APP_STATE.goal.progressDays / APP_STATE.goal.totalDays) * 100;
    const remainingDays =
      APP_STATE.goal.totalDays - APP_STATE.goal.progressDays;

    // Update progress bar
    if (this.elements.goalProgressFill) {
      this.elements.goalProgressFill.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    // Update text
    if (this.elements.progressDays) {
      this.elements.progressDays.textContent = APP_STATE.goal.progressDays;
    }
    if (this.elements.totalDaysGoal) {
      this.elements.totalDaysGoal.textContent = APP_STATE.goal.totalDays;
    }
    if (this.elements.progressPercent) {
      this.elements.progressPercent.textContent = `${Math.min(progressPercent, 100).toFixed(1)}%`;
    }
    if (this.elements.daysRemainingGoal) {
      this.elements.daysRemainingGoal.textContent = remainingDays;
    }

    // Update dates
    if (APP_STATE.goal.startDate && this.elements.startDate) {
      const start = new Date(APP_STATE.goal.startDate);
      this.elements.startDate.textContent = start.toLocaleDateString();
    }

    if (APP_STATE.goal.startDate && this.elements.completionDate) {
      const start = new Date(APP_STATE.goal.startDate);
      const completionDate = new Date(start);
      completionDate.setDate(
        completionDate.getDate() + APP_STATE.goal.totalDays,
      );
      this.elements.completionDate.textContent =
        completionDate.toLocaleDateString();
    }
  },

  // Show goal setup form
  showGoalSetup() {
    if (this.elements.goalDisplay && this.elements.goalSetup) {
      this.elements.goalDisplay.style.display = "none";
      this.elements.goalSetup.style.display = "block";
      if (this.elements.progressButton) {
        this.elements.progressButton.disabled = true;
      }
    }
  },

  // Show goal display
  showGoalDisplay() {
    if (this.elements.goalDisplay && this.elements.goalSetup) {
      this.elements.goalDisplay.style.display = "block";
      this.elements.goalSetup.style.display = "none";
      if (this.elements.progressButton) {
        this.elements.progressButton.disabled = false;
      }
    }
  },

  // Show message in streak card
  showStreakMessage(text, duration = 5000) {
    if (!this.elements.streakMessage) return;

    this.elements.streakMessage.textContent = text;
    this.elements.streakMessage.classList.add("show");

    setTimeout(() => {
      this.elements.streakMessage.classList.remove("show");
    }, duration);
  },

  // Show message in goal card
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
  },

  // Update check-in button state
  updateCheckInButton() {
    if (!this.elements.checkInButton) return;

    const today = APP_STATE.getToday();
    const isCheckedIn = !!APP_STATE.streak.checkIns[today];

    if (isCheckedIn) {
      this.elements.checkInButton.innerHTML =
        '<i class="fas fa-check-circle"></i> Checked In!';
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
  },

  // Show welcome message for new users
  showWelcomeMessage() {
    if (APP_STATE.streak.count === 0) {
      this.showStreakMessage(
        "Start your streak today! Come back tomorrow to continue.",
      );
    }
  },
};
