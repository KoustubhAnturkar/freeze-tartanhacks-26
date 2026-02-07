// Main Game class - coordinates all game components
class Game {
  constructor() {
    // Setup canvas
    this.canvas = document.getElementById('c');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = Math.min(CONFIG.MAX_WIDTH, window.innerWidth);
    this.height = this.canvas.height = Math.min(CONFIG.MAX_HEIGHT, window.innerHeight);

    // Initialize game components
    this.renderer = new Renderer(this.ctx, this.width, this.height);
    this.input = new InputHandler();
    this.gameState = new GameState(LEVELS, CONFIG.LEVEL_TRANSITION_DELAY);
    this.player = new Player(50, this.height - 100, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT);

    // Initialize sounds and ensure BGM starts/resumes on user gesture
    if (typeof SOUNDS !== 'undefined' && SOUNDS) {
      SOUNDS.init();
      // Ensure BGM will start when user interacts (autoplay policies)
      try { SOUNDS.ensureBGMOnGesture(); } catch (e) {}
      // Attempt to start immediately in case audio is already allowed
      try { SOUNDS.startBGM(); } catch (e) {}
    }

    // Setup tutorial
    this.setupTutorial();

    // Start game loop
    this.gameLoop();
  }

  // Setup tutorial overlay
  setupTutorial() {
    if (this.gameState.isTutorialActive()) {
      const tutorial = document.getElementById('tutorial');
      tutorial.style.display = 'block';
      
      document.getElementById('skipBtn').onclick = () => {
        if (typeof SOUNDS !== 'undefined' && SOUNDS && SOUNDS.play) SOUNDS.play('button');
        // Ensure BGM is running when tutorial exits
        if (typeof SOUNDS !== 'undefined' && SOUNDS && SOUNDS.startBGM) {
          try { SOUNDS.startBGM(); } catch (e) {}
        }
        tutorial.style.display = 'none';
        this.gameState.completeTutorial();
      };
    }
  }

  // Update game state
  update() {
    // Don't update during tutorial or transitions
    if (this.gameState.isTutorialActive() || 
        this.gameState.isWon() || 
        this.gameState.isTransitioning()) {
      return;
    }

    // Update player with current input and platforms
    const keys = this.input.getKeys();
    this.player.update(
      keys,
      this.gameState.getPlatforms(),
      CONFIG.GRAVITY,
      CONFIG.MOVE_SPEED,
      CONFIG.JUMP_FORCE
    );

    // Let input poll run to handle step sounds
    if (this.input && typeof this.input.poll === 'function') this.input.poll();

    // Check if player fell off screen
    if (this.player.y > this.height) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('fall');
      }
      this.player.reset(50, this.height - 100);
    }

    // Check goal collision
    if (this.gameState.checkGoalCollision(this.player)) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('levelComplete');
      }
      this.gameState.markLevelComplete(() => {
        this.player.reset(50, this.height - 100);
      });
    }
  }

  // Draw everything
  draw() {
    // Clear screen
    this.renderer.clear(CONFIG.COLORS.BACKGROUND);

    // Draw level elements
    this.renderer.drawPlatforms(this.gameState.getPlatforms(), CONFIG.COLORS);
    this.renderer.drawGoal(this.gameState.getGoal(), CONFIG.COLORS);

    // Draw player
    this.player.draw(this.ctx, CONFIG.COLORS);

    // Draw win message if level complete
    if (this.gameState.isWon()) {
      this.renderer.drawWinMessage(
        this.gameState.getCurrentLevel(),
        this.gameState.getTotalLevels(),
        CONFIG.COLORS
      );
    }
  }

  // Main game loop
  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'data:text/javascript,self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));'
  );
}
