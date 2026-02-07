// Game configuration constants
const CONFIG = {
  // Physics
  GRAVITY: 0.5,
  JUMP_FORCE: -12,
  MOVE_SPEED: 4,
  DECELERATION: -0.1,

  // Player dimensions
  PLAYER_WIDTH: 28,
  PLAYER_HEIGHT: 38,

  // Canvas size
  MAX_WIDTH: 800,
  MAX_HEIGHT: 600,

  // Timing
  LEVEL_TRANSITION_DELAY: 1200, // milliseconds

  // Colors (minimalist black, white, blue theme)
  // Colors (Deep Freeze Theme)
  COLORS: {
    // The Sky Gradient (Top -> Bottom)
    bgTop: "#bfdbfe", // Light Blue
    bgBottom: "#f8fafc", // White/Fog at the horizon

    // The Goal Mountain
    goal: "#64748b",
    goalPeak: "#ffffff",
    goalFlag: "#EF4444",

    // Distant Background Mountains (Subtle)
    distantMountain: "#cbd5e1",

    // UI
    winOverlay: "rgba(17, 24, 39, 0.8)",
    winText: "#ffffff",
    BACKGROUND: "#ffffff",
    PLATFORM: "#334155",
    PLATFORM_TOP: "#f1f5f9",
    GOAL: "#828282ff",
    GOAL_OUTLINE: "#1e90ff",
    GOAL_FLAG: "#1e90ff",
    PENGUIN_BODY: "#000",
    PENGUIN_BELLY: "#fff",
    PENGUIN_EYES: "#fff",
    PENGUIN_PUPILS: "#000",
    PENGUIN_BEAK: "#F59E0B",
    PENGUIN_FEET: "#F59E0B",
    WIN_OVERLAY: "rgba(0, 0, 0, 0.8)",
    WIN_TEXT: "#1e90ff",
  },
  // Sound settings
  SOUND_ENABLED: true,
  SOUND_VOLUME: 0.6,
};

// No external images or SVGs: collectibles are rendered with canvas drawing
