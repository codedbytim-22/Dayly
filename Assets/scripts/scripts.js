// ============================================
// UPDATED INITIALIZATION
// ============================================

function enhancedInit() {
  console.log(`DAYLY Progress Tracker v${CONFIG.VERSION} initializing...`);

  // Check for safe version update
  safeVersionUpdate();

  // Initialize background system
  backgroundSystem = new BackgroundSystem();

  // Initialize theme manager with background system
  themeManager = new ThemeManager(backgroundSystem);

  // Initialize enhanced systems
  window.enhancedStreakSystem = new EnhancedDailyStreak();
  window.enhancedGoalTracker = new EnhancedGoalTracker();

  // Initialize feedback system
  window.feedbackSystem = new FeedbackSystem();

  // Initialize contextual premium system
  window.premiumSystem = new ContextualPremium();

  // Update goal tracker for premium limits
  updateEnhancedGoalTracker();

  // Set version info
  if (versionInfo) {
    versionInfo.textContent = `v${CONFIG.VERSION}`;
  }

  // Set initial progress text with percentage
  const now = new Date();
  const initialProgress = calculateProgress(now);

  if (progressText) {
    progressText.textContent = `${initialProgress.year} is ${initialProgress.progress.toFixed(2)}% complete`;
  }

  // Set up updates
  updateInterval = setInterval(updateDateTime, CONFIG.UPDATE_INTERVAL);

  // Set up year progress updates
  setInterval(updateYearProgress, CONFIG.UPDATE_INTERVAL * 60);

  // Event listeners
  if (seasonDropdown) {
    seasonDropdown.addEventListener("change", () => {
      updateDateTime();
    });
  }

  // Configure animations
  if (progressBar) {
    progressBar.style.transition = `width ${CONFIG.PERFORMANCE.ANIMATION_DURATION}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  }

  // Animate toggle switch
  animateToggleSwitch();

  // Initial update
  updateDateTime();

  // Setup performance monitoring if enabled
  if (CONFIG.PERFORMANCE.THROTTLE_ANIMATIONS) {
    setupPerformanceMonitoring();
  }

  console.log("App initialized successfully");

  // Handle performance updates
  window.addEventListener("resize", handleResize);
}
