// Main Game class - coordinates all game components
class Game {
  constructor() {
    // Setup canvas
    this.canvas = document.getElementById('c');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width = CONFIG.MAX_WIDTH;
    this.height = this.canvas.height = CONFIG.MAX_HEIGHT;

    // Initialize game components
    this.renderer = new Renderer(this.ctx, this.width, this.height);
    this.input = new InputHandler();
    this.gameState = new GameState(LEVELS, CONFIG.LEVEL_TRANSITION_DELAY);
    this.player = new Player(50, 20, CONFIG.PLAYER_WIDTH, CONFIG.PLAYER_HEIGHT);
    this.score = 0;
    this.lastLevel = this.gameState.getCurrentLevel();

    // Setup small score icon renderer (scotty dog) if the DOM canvas exists
    const scoreIconEl = document.getElementById('scoreIcon');
    if (scoreIconEl && scoreIconEl.getContext) {
      try {
        const iconCtx = scoreIconEl.getContext('2d');
        this.scoreIconCanvas = scoreIconEl;
        this.scoreIconRenderer = new Renderer(iconCtx, scoreIconEl.width, scoreIconEl.height);
      } catch (e) {
        this.scoreIconCanvas = null;
        this.scoreIconRenderer = null;
      }
    }

    // Initialize cutscene manager
    this.cutsceneManager = new CutsceneManager();
    this.waitingForCutscene = false;

    // Initialize sounds and ensure BGM starts/resumes on user gesture
    if (typeof SOUNDS !== 'undefined' && SOUNDS) {
      SOUNDS.init();
      // Ensure BGM will start when user interacts (autoplay policies)
      try { SOUNDS.ensureBGMOnGesture(); } catch (e) { }
      // Attempt to start immediately in case audio is already allowed
      try { SOUNDS.startBGM(); } catch (e) { }
    }
    this.resize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      this.isLandscape = vw >= vh;

      // Approx height of your control strip:
      // buttons are 80px tall and #controls has 30px bottom padding [file:2]
      const controlsH = this.isLandscape ? (80 + 30 + 10) : 0; // +10 buffer

      this.canvas.style.position = "fixed";
      this.canvas.style.left = "0";
      this.canvas.style.top = "0";
      this.canvas.style.width = "100vw";
      this.canvas.style.height = `calc(100svh)`;
    };

    window.addEventListener("resize", this.resize, { passive: true });
    window.addEventListener("orientationchange", this.resize, { passive: true });
    this.resize();

    // Setup tutorial
    this.setupTutorial();

    // Initialize score UI
    const scoreEl = document.getElementById('score');
    if (scoreEl) scoreEl.textContent = String(this.score);

    // Start game loop
    this.gameLoop();

    // Show intro cutscene before level 1
    this.showCutsceneIfNeeded(0);
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
          try { SOUNDS.startBGM(); } catch (e) { }
        }
        tutorial.style.display = 'none';
        this.gameState.completeTutorial();
      };
    }
  }

  // Show cutscene if one exists for the current level
  showCutsceneIfNeeded(level) {
    if (this.cutsceneManager.shouldPlayCutscene(level)) {
      this.waitingForCutscene = true;
      this.cutsceneManager.play(level, () => {
        this.waitingForCutscene = false;
        // Start BGM after cutscene if available
        if (typeof SOUNDS !== 'undefined' && SOUNDS && SOUNDS.startBGM) {
          try { SOUNDS.startBGM(); } catch (e) { }
        }
      });
    }
  }

  // Update game state
  update() {
    // Reset score when a new level is loaded
    const currentLevel = this.gameState.getCurrentLevel();
    if (this.lastLevel !== currentLevel) {
      this.lastLevel = currentLevel;
      this.score = 0;
      const scoreEl = document.getElementById('score');
      if (scoreEl) scoreEl.textContent = String(this.score);
    }
    // Don't update during tutorial or transitions
    // Don't update during tutorial, transitions, or cutscenes
    if (!this.isLandscape) return;

    if (this.gameState.isTutorialActive() ||
      this.gameState.isWon() ||
      this.gameState.isTransitioning() ||
      this.waitingForCutscene) {
      return;
    }

    // Update polar bear positions (oscillate)
    this.gameState.updatePolarBears();

    // Update player with current input and platforms
    const keys = this.input.getKeys();
    this.player.update(
      keys,
      this.gameState.getWalls(),
      this.gameState.getPlatforms(),
      CONFIG.GRAVITY,
      CONFIG.MOVE_SPEED,
      CONFIG.JUMP_FORCE,
      CONFIG.DECELERATION
    );

    // Let input poll run to handle step sounds
    if (this.input && typeof this.input.poll === 'function') this.input.poll();
    // Check if player fell off screen
    if (this.player.y > this.height) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('fall');
      }
      // RESET COLLECTIBLES: Reload the level to respawn items
      this.gameState.loadLevel(this.gameState.getCurrentLevel());

      // Reset the score when player falls
      this.score = 0;
      const scoreEl = document.getElementById('score');
      if (scoreEl) scoreEl.textContent = String(this.score);

      this.player.reset(50, 20);
    }

    // Check icicle collision - reset level if hit
    if (this.gameState.checkIcicleCollision(this.player)) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('fall'); // Use fall sound for icicle hit
      }
      // RESET COLLECTIBLES: Reload the level to respawn items
      this.gameState.loadLevel(this.gameState.getCurrentLevel());
      // Reset the score when player hits an icicle
      this.score = 0;
      const scoreEl = document.getElementById('score');
      if (scoreEl) scoreEl.textContent = String(this.score);
      this.player.reset(50, 20);
    }

    // Check polar bear collision - reset level if hit
    if (this.gameState.checkPolarBearCollision(this.player)) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('fall'); // Use fall sound for polar bear hit
      }
      // RESET COLLECTIBLES: Reload the level to respawn items
        this.gameState.loadLevel(this.gameState.getCurrentLevel());
        // Reset the score when player hits a polar bear
        this.score = 0;
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = String(this.score);

      this.player.reset(50, 20);
    }

    // Check goal collision
    // Check collectible collision (collect before allowing level completion)
    if (this.gameState.collectAt(this.player)) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('collect');
      }
      // Increment score and update UI
      this.score += 1;
      const scoreEl = document.getElementById('score');
      if (scoreEl) scoreEl.textContent = String(this.score);
    }

    // Only allow level completion when all collectibles are gathered
    if (this.gameState.checkGoalCollision(this.player) && this.gameState.getCollectibles().length === 0) {
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') {
        SOUNDS.play('levelComplete');
      }
      this.gameState.markLevelComplete(() => {
        // Reset the score
        this.score = 0;
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = String(this.score);
        this.player.reset(50, 20);
      });
    }
  }

  // Draw everything
  draw() {
    if (!this.isLandscape) return;

    // Draw background scenery (Sky + Distant Mountains)
    this.renderer.drawScenery(CONFIG.COLORS);

    // Draw goal (Massive mountain in background)
    this.renderer.drawGoal(this.gameState.getGoal(), CONFIG.COLORS);

    // Draw level elements (Platforms in foreground)
    this.renderer.drawPlatforms(this.gameState.getPlatforms(), CONFIG.COLORS);

    // Draw icicles (dangerous obstacles)
    this.renderer.drawIcicles(this.gameState.getIcicles());

    // Draw polar bears (moving enemies)
    this.renderer.drawPolarBears(this.gameState.getPolarBears());

    // Draw player
    this.player.draw(this.ctx, CONFIG.COLORS);

    // Draw collectibles (canvas-only)
    this.renderer.drawCollectibles(this.gameState.getCollectibles());

    // Draw win message if level complete
    if (this.gameState.isWon()) {
      this.renderer.drawWinMessage(
        this.gameState.getCurrentLevel(),
        this.gameState.getTotalLevels(),
        CONFIG.COLORS
      );
    }

    // Render the small scotty-dog icon into the score canvas (keeps it animated)
    if (this.scoreIconRenderer && this.scoreIconCanvas) {
      try {
        const ic = this.scoreIconCanvas;
        const icCtx = ic.getContext('2d');
        icCtx.clearRect(0, 0, ic.width, ic.height);
        // Draw stationary scotty icon centered in the small canvas
        this.scoreIconRenderer.drawScottyIcon(0, 0, ic.width, ic.height);
      } catch (e) {}
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
  window.game = new Game();
});

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    'data:text/javascript,self.addEventListener("fetch",e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));'
  );
}
