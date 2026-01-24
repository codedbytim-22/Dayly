// Assets/scripts/ui.js

const APP_UI = {
  // DOM Elements cache
  elements: {},

  // Initialize UI elements
  initElements() {
    this.elements = {
      // Date & Time
      dateDisplay: document.getElementById("dateDisplay"),
      timeDisplay: document.getElementById("timeDisplay"),

      // Year Progress
      progressBar: document.getElementById("progressBar"),
      percentageDisplay: document.getElementById("percentageDisplay"),
      progressText: document.getElementById("progressText"),
      percentText: document.getElementById("percentText"),
      yearLabel: document.getElementById("yearLabel"),
      dayOfYear: document.getElementById("dayOfYear"),
      daysRemaining: document.getElementById("daysRemaining"),
      totalDays: document.getElementById("totalDays"),
      currentYear: document.getElementById("currentYear"),
      versionInfo: document.getElementById("versionInfo"),

      // Seasons
      seasonDropdown: document.getElementById("seasonDropdown"),
      seasonName: document.getElementById("seasonName"),
      seasonDates: document.getElementById("seasonDates"),

      // Streak Card
      streakCount: document.getElementById("streakCount"),
      streakGrid: document.querySelector(".streak-grid"),
      streakMessage: document.getElementById("streakMessage"),
      checkInButton: document.getElementById("checkInButton"),

      // Goal Card
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

    console.log(
      "UI Elements initialized:",
      Object.keys(this.elements).length,
      "elements found",
    );
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

  // Get month name for season display
  getMonthName(monthIndex) {
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
  },

  // Update season display
  updateSeason(date, hemisphere) {
    const season = APP_LOGIC.getCurrentSeason(date, hemisphere);

    if (!season) {
      console.error(
        "No season found for date:",
        date,
        "hemisphere:",
        hemisphere,
      );
      return;
    }

    if (this.elements.seasonName) {
      this.elements.seasonName.textContent = season.name;
      this.elements.seasonName.style.color = season.color;
    }

    if (this.elements.seasonDates) {
      const startMonthName = this.getMonthName(season.startMonth - 1);
      const endMonthName = this.getMonthName(season.endMonth - 1);
      this.elements.seasonDates.textContent = `${startMonthName} ${season.startDay} - ${endMonthName} ${season.endDay}`;
    }

    // Update season icon
    const seasonIcon = document.querySelector(".season-icon i");
    if (seasonIcon && season.icon) {
      // Clear existing classes
      seasonIcon.className = "";

      // Add icon classes from season config
      const iconClasses = season.icon.split(" ");
      iconClasses.forEach((cls) => {
        if (cls) seasonIcon.classList.add(cls);
      });

      seasonIcon.style.color = season.color;
    }
  },

  // Update streak display - FIXED: Immediate streak count update
  updateStreakDisplay() {
    console.log("UI: Updating streak display, count =", APP_STATE.streak.count);

    if (this.elements.streakCount) {
      this.elements.streakCount.textContent = APP_STATE.streak.count;
    }

    this.updateStreakGrid();
  },

  // Update streak grid (GitHub-style)
  updateStreakGrid() {
    if (!this.elements.streakGrid) {
      console.error("Streak grid element not found!");
      return;
    }

    // Clear existing
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
    if (!APP_STATE.goal.title || !APP_STATE.goal.startDate) {
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

      // Pre-fill if editing
      if (APP_STATE.goal.title) {
        if (this.elements.goalInput) {
          this.elements.goalInput.value = APP_STATE.goal.title;
        }
        if (this.elements.goalDuration) {
          this.elements.goalDuration.value =
            APP_STATE.goal.totalDays.toString();
        }
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
    if (!this.elements.streakMessage) {
      console.error("Streak message element not found!");
      return;
    }

    console.log("Showing streak message:", text);
    this.elements.streakMessage.textContent = text;
    this.elements.streakMessage.classList.add("show");

    setTimeout(() => {
      if (this.elements.streakMessage) {
        this.elements.streakMessage.classList.remove("show");
      }
    }, duration);
  },

  // Show message in goal card
  showGoalMessage(text, isError = false, duration = 5000) {
    if (!this.elements.motivationalMessage) {
      console.error("Motivational message element not found!");
      return;
    }

    console.log("Showing goal message:", text);
    this.elements.motivationalMessage.textContent = text;
    this.elements.motivationalMessage.style.background = isError
      ? "rgba(255, 107, 107, 0.1)"
      : "rgba(67, 97, 238, 0.1)";
    this.elements.motivationalMessage.style.color = isError
      ? "#ff6b6b"
      : "var(--accent-color)";
    this.elements.motivationalMessage.classList.add("show");

    setTimeout(() => {
      if (this.elements.motivationalMessage) {
        this.elements.motivationalMessage.classList.remove("show");
      }
    }, duration);
  },

  // Update check-in button state - FIXED: Shows "Showed up today!" when checked in
  updateCheckInButton() {
    if (!this.elements.checkInButton) {
      console.error("Check-in button not found!");
      return;
    }

    const today = APP_STATE.getToday();
    const isCheckedIn = !!APP_STATE.streak.checkIns[today];

    console.log(
      "Updating check-in button. Today:",
      today,
      "Checked in:",
      isCheckedIn,
    );

    if (isCheckedIn) {
      // ✅ Shows "Showed up today!" when checked in
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
  },

  // Animate check-in button
  animateCheckInButton() {
    if (!this.elements.checkInButton) return;

    this.elements.checkInButton.classList.add("check-in-pulse");
    setTimeout(() => {
      this.elements.checkInButton.classList.remove("check-in-pulse");
    }, 500);
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
