import { create } from 'zustand';

type ResponseState = "none" | "fast" | "slow";

interface ClickGameState {
  // Tracking click times and speed
  clicks: number[];
  lastClickTime: number | null;
  clickSpeed: number; // clicks per second
  responseState: ResponseState;
  excitement: number; // Added excitement state

  // Game state info
  totalClicks: number;
  longestStreak: number;
  currentStreak: number;
  cumStage: number;
  readyToCum: boolean;
  checkReadyToCum: () => void;
  triggerCumStage: () => void;

  // Actions
  registerClick: (time: number) => void;
  calculateClickSpeed: () => void;
  resetGame: () => void;
  setResponseState: (state: ResponseState) => void;
}

export const useClickGame = create<ClickGameState>((set, get) => ({
  clicks: [],
  lastClickTime: null,
  clickSpeed: 0,
  responseState: "none",
  excitement: 0, // Initialize excitement

  // Additional stats
  totalClicks: 0,
  longestStreak: 0,
  currentStreak: 0,
  cumStage: 0,
  readyToCum: false,

  registerClick: (time) => {
    const state = get();
    const newClicks = [...state.clicks, time];

    // Update total clicks - always increment by 1 for each click
    const totalClicks = state.totalClicks + 1;

    // Calculate streaks - more forgiving for multi-finger tapping
    let currentStreak = state.currentStreak;
    let longestStreak = state.longestStreak;

    // Always count as part of a streak, regardless of time since last click
    // This makes multi-finger clicking more effective
    currentStreak += 1;
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    // Keep more clicks in the queue for multi-finger tapping (30 instead of 10)
    if (newClicks.length > 30) {
      newClicks.shift();
    }

    const newExcitement = state.excitement + 1;

    set({ 
      clicks: newClicks,
      lastClickTime: time,
      totalClicks,
      currentStreak,
      longestStreak,
      excitement: newExcitement // Update excitement
    });

    get().calculateClickSpeed();
  },

  calculateClickSpeed: () => {
    const { clicks } = get();

    // Need at least 2 clicks to calculate speed
    if (clicks.length < 2) {
      set({ clickSpeed: 0, responseState: "none" });
      return;
    }

    // Calculate clicks per second based on recent window of clicks
    const timeSpan = (clicks[clicks.length - 1] - clicks[0]) / 1000; // in seconds

    // Ensure we have a minimum timespan to prevent division by near-zero
    // This helps with multi-finger clicking where clicks can be very close in time
    const safeTimeSpan = Math.max(0.05, timeSpan); // At least 50ms between clicks

    if (safeTimeSpan > 0) {
      // clicks per second = number of clicks / time span
      // Multiply by factor to make reaching 1000 possible with rapid clicking
      const speed = (clicks.length - 1) / safeTimeSpan;

      // Different smoothing for multi-finger clicks to respond faster
      const { clickSpeed: oldSpeed } = get();
      // More weight to new speed (0.9) to be responsive to bursts of clicks
      // No base multiplier at the start - rely on upgrades to reach 1000
      const baseMultiplier = 1; // Start with 1x multiplier (no boost)
      // Adjusted formula to make 1000 reachable with enough upgrades
      const smoothedSpeed = (oldSpeed * 0.15 + speed * 0.85) * baseMultiplier * 5.0;

      // Higher thresholds for better progression
      const responseState = smoothedSpeed > 50 
        ? "fast" 
        : smoothedSpeed > 20 
          ? "slow" 
          : "none";

      set({ 
        clickSpeed: smoothedSpeed,
        responseState
      });
    }
  },

  resetGame: () => {
    set({
      clicks: [],
      lastClickTime: null,
      clickSpeed: 0,
      responseState: "none",
      currentStreak: 0,
      cumStage: 0,
      readyToCum: false,
      excitement: 0, // Reset excitement
      // Note: we're not resetting totalClicks or longestStreak to preserve achievements
    });
  },

  triggerCumStage: () => {
    const state = get();
    set({ 
      cumStage: state.cumStage + 1,
      readyToCum: false,
      clickSpeed: 0
    });
  },

  checkReadyToCum: () => {
    const { clickSpeed } = get();
    if (clickSpeed >= 50) {
      set({ readyToCum: true });
    } else {
      set({ readyToCum: false });
    }
  },

  setResponseState: (state) => {
    set({ responseState: state });
  }
}));