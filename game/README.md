# Penguin Quest - Modular Game Structure

A minimalist puzzle platformer game with clean, modular code structure.

## 📁 Project Structure

```
penguin-quest/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── README.md           # This file
└── js/
    ├── main.js         # Entry point (loads all modules)
    ├── config.js       # Game constants & settings
    ├── levels.js       # Level definitions
    ├── player.js       # Player physics & rendering
    ├── renderer.js     # Drawing functions
    ├── input.js        # Keyboard & touch input
    ├── gameState.js    # Level & state management
    └── game.js         # Main game controller
```

## 🎮 How to Run

1. **Open `index.html` in a browser**
   - That's it! No build step needed.

2. **Or use a local server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve
   ```
   Then visit `http://localhost:8000`

## ✏️ How to Edit

### 🎨 Change Colors
**File:** `js/config.js`

Find the `COLORS` object and modify any color:
```javascript
COLORS: {
  BACKGROUND: '#fff',        // Change background
  PLATFORM: '#000',          // Change platform color
  PLATFORM_OUTLINE: '#1e90ff', // Change outline
  PENGUIN_BODY: '#000',      // Change penguin color
  // ... etc
}
```

### ⚙️ Adjust Physics
**File:** `js/config.js`

Modify these values:
```javascript
GRAVITY: 0.5,        // Lower = floatier (try 0.3)
JUMP_FORCE: -12,     // Higher = jump higher (try -15)
MOVE_SPEED: 4,       // Higher = faster movement (try 6)
```

### 🎯 Add New Levels
**File:** `js/levels.js`

Add a new level object to the `LEVELS` array:
```javascript
{
  platforms: [
    { x: 0, y: 550, w: 200, h: 50 },    // Starting platform
    { x: 250, y: 480, w: 150, h: 20 },  // Jump platform
    // Add more platforms...
  ],
  goal: { x: 680, y: 420, w: 35, h: 35 }  // Goal position
}
```

**Platform properties:**
- `x`: Horizontal position
- `y`: Vertical position
- `w`: Width
- `h`: Height

### 🐧 Modify Penguin Appearance
**File:** `js/player.js`

Find the `draw()` method and modify the drawing code:
- Change ellipse sizes for body shape
- Modify colors (though better to use config)
- Add new features (hat, scarf, etc.)

### 🎨 Change UI Layout
**File:** `styles.css`

Modify button positions, sizes, colors:
```css
.btn {
  width: 70px;        /* Button size */
  height: 70px;
  background: #000;   /* Button color */
  border: 3px solid #1e90ff;
}
```

### 📱 Adjust Canvas Size
**File:** `js/config.js`

```javascript
MAX_WIDTH: 800,   // Maximum canvas width
MAX_HEIGHT: 600,  // Maximum canvas height
```

## 🔧 Module Overview

### `config.js` - Configuration
- All game constants in one place
- Physics values
- Colors
- Dimensions
- Easy to tweak without touching game logic

### `levels.js` - Level Data
- Array of level objects
- Each level defines platforms and goal
- Add/remove/modify levels easily

### `player.js` - Player Class
```javascript
// Methods:
update()          // Physics & movement
checkCollision()  // Collision detection
reset()           // Reset position
draw()            // Render penguin
```

### `renderer.js` - Renderer Class
```javascript
// Methods:
clear()           // Clear canvas
drawPlatforms()   // Draw all platforms
drawGoal()        // Draw goal with flag
drawWinMessage()  // Draw win overlay
```

### `input.js` - Input Handler
```javascript
// Methods:
setupEventListeners()  // Setup keyboard & touch
setupButton()          // Setup individual button
getKeys()              // Get current input state
```

### `gameState.js` - Game State Manager
```javascript
// Methods:
loadLevel()            // Load specific level
nextLevel()            // Advance to next level
markLevelComplete()    // Handle level completion
checkGoalCollision()   // Check if player reached goal
```

### `game.js` - Main Game Controller
```javascript
// Methods:
setupTutorial()  // Show tutorial on first play
update()         // Update game state
draw()           // Render everything
gameLoop()       // Main game loop
```

## 🎯 Common Modifications

### Add Moving Platforms
1. In `levels.js`, add a property to platforms:
   ```javascript
   { x: 200, y: 400, w: 100, h: 20, moving: true, vx: 2 }
   ```

2. In `player.js` `update()` method, add logic to move platforms:
   ```javascript
   platforms.forEach(p => {
     if (p.moving) {
       p.x += p.vx;
       if (p.x > 600 || p.x < 100) p.vx *= -1;
     }
   });
   ```

### Add Collectibles
1. In `levels.js`, add collectibles:
   ```javascript
   {
     platforms: [...],
     goal: {...},
     collectibles: [
       { x: 300, y: 450, w: 20, h: 20 }
     ]
   }
   ```

2. In `game.js`, add collision check in `update()`:
   ```javascript
   // Check collectible collision and remove
   ```

3. In `renderer.js`, add drawing method:
   ```javascript
   drawCollectibles(collectibles) { ... }
   ```

### Add Sound Effects
1. Create `js/audio.js`:
   ```javascript
   class AudioManager {
     playJump() {
       // Audio code
     }
   }
   ```

2. In `main.js`, load the audio module

3. In `game.js`, play sounds on events

## 🚀 Tips for Hackathon

- **Quick iterations**: Change `config.js` for instant tweaks
- **Add levels fast**: Copy/paste in `levels.js`
- **Debug**: Open browser console to see errors
- **Test mobile**: Use Chrome DevTools device mode
- **Version control**: Each file is independent, easy to track changes

## 📦 Building Single File

If you need a single HTML file for deployment:

```bash
# Manual method:
# 1. Copy styles.css content into <style> tag in index.html
# 2. Copy all .js files into <script> tag in order
# 3. Save as penguin-quest-single.html
```

## 🐛 Troubleshooting

**Game doesn't load:**
- Check browser console for errors
- Make sure all files are in correct folders
- Use a local server (some browsers block file:// requests)

**Controls don't work:**
- Check that button IDs match in HTML and input.js
- Verify event listeners are attached

**Graphics look wrong:**
- Check canvas size in config.js
- Verify colors in CONFIG.COLORS

## 📝 License

Free to use for your hackathon project!

## 🎉 Good Luck!

Happy coding! May your penguin reach all the mountains! 🐧🏔️
