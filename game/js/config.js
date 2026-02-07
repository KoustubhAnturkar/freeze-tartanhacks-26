// Game configuration constants
const CONFIG = {
  // Physics
  GRAVITY: 0.5,
  JUMP_FORCE: -12,
  MOVE_SPEED: 4,

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
    bgTop: '#bfdbfe',    // Light Blue
    bgBottom: '#f8fafc', // White/Fog at the horizon

    // Platforms: Dark Slate (High contrast against the sky)
    platform: '#334155',
    platformTop: '#f1f5f9', // A "Snow cap" on top of the platform

    // The Player (unchanged, keeps focus)
    playerBody: '#111827',
    playerBelly: '#ffffff',
    playerEyes: '#ffffff',
    playerPupils: '#1e90ff',
    playerBeak: '#F59E0B',
    playerFeet: '#F59E0B',

    // The Goal Mountain
    goal: '#64748b',
    goalPeak: '#ffffff',
    goalFlag: '#EF4444',

    // Distant Background Mountains (Subtle)
    distantMountain: '#cbd5e1',

    // UI
    winOverlay: 'rgba(17, 24, 39, 0.8)',
    winText: '#ffffff'
  }
};
