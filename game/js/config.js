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
  COLORS: {
    BACKGROUND: '#fff',
    PLATFORM: '#000',
    PLATFORM_OUTLINE: '#1e90ff',
    GOAL: '#fff',
    GOAL_OUTLINE: '#1e90ff',
    GOAL_FLAG: '#1e90ff',
    PENGUIN_BODY: '#000',
    PENGUIN_BELLY: '#fff',
    PENGUIN_EYES: '#fff',
    PENGUIN_PUPILS: '#1e90ff',
    PENGUIN_BEAK: '#1e90ff',
    PENGUIN_FEET: '#1e90ff',
    WIN_OVERLAY: 'rgba(0, 0, 0, 0.8)',
    WIN_TEXT: '#1e90ff'
  },
  // Sound settings
  SOUND_ENABLED: true,
  SOUND_VOLUME: 0.6
};
