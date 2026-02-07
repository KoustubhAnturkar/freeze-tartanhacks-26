// GameState - manages level progression, win conditions, and game state
class GameState {
  constructor(levels, transitionDelay) {
    this.walls = levels.walls;
    this.levels = levels.platformsAndGoals;
    this.transitionDelay = transitionDelay;
    this.currentLevel = 1;
    this.won = false;
    this.transitioning = false;
    this.tutorial = !localStorage.getItem("tutDone");
    this.currentLevelData = null;
    this.currentCollectibles = [];

    this.loadLevel(this.currentLevel);
  }

  // Load a specific level
  loadLevel(levelNumber) {
    this.currentLevel = levelNumber;
    this.currentLevelData = this.levels[levelNumber - 1];
    this.won = false;
    this.transitioning = false;
    // clone collectibles so we can mutate per-play
    this.currentLevelData.platforms.forEach((platform) => {
      if (platform.hasCollectible) {
        const x = platform.x + platform.w / 2;
        const y = platform.y - 20;

        this.currentCollectibles.push({
          x: x,
          y: y,
          w: 20, // Collectible width
          h: 20, // Collectible height
          collected: false,
        });
      }
    });

    // Load icicles if present
    this.currentIcicles = this.currentLevelData.icicles || [];
    // Load polar bears if present (with direction tracking)
    this.currentPolarBears = (this.currentLevelData.polarBears || []).map(
      (bear) => ({
        ...bear,
        direction: 1, // 1 = moving right, -1 = moving left
      }),
    );
    // Update UI
    document.getElementById("lvl").textContent = levelNumber;
  }

  // Move to next level
  nextLevel() {
    if (this.currentLevel < this.levels.length) {
      this.loadLevel(this.currentLevel + 1);
      return true;
    }
    return false;
  }

  // Mark level as complete and transition to next
  markLevelComplete(onComplete) {
    this.won = true;
    this.transitioning = true;

    setTimeout(() => {
      if (this.currentLevel < this.levels.length) {
        const completedLevel = this.currentLevel;
        this.nextLevel();
        if (onComplete) onComplete();

        // Trigger cutscene after levels 2, 4, 6, etc. if Game instance exists
        if (
          completedLevel % 2 === 0 &&
          window.game &&
          window.game.showCutsceneIfNeeded
        ) {
          window.game.showCutsceneIfNeeded(completedLevel);
        }
      } else {
        this.transitioning = false;
      }
    }, this.transitionDelay);
  }

  // Check if player reached the goal
  checkGoalCollision(player) {
    const goal = this.currentLevelData.goal;
    return (
      player.x < goal.x + goal.w &&
      player.x + player.w > goal.x &&
      player.y < goal.y + goal.h &&
      player.y + player.h > goal.y
    );
  }

  // Collectible accessors and collision handling
  getCollectibles() {
    return this.currentCollectibles;
  }

  // Check player against collectibles; remove and return true if any collected
  collectAt(player) {
    for (let i = this.currentCollectibles.length - 1; i >= 0; i--) {
      const c = this.currentCollectibles[i];
      if (
        player.x < c.x + c.w &&
        player.x + player.w > c.x &&
        player.y < c.y + c.h &&
        player.y + player.h > c.y
      ) {
        this.currentCollectibles.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  // Tutorial management
  isTutorialActive() {
    return this.tutorial;
  }

  completeTutorial() {
    this.tutorial = false;
    localStorage.setItem("tutDone", "1");
  }

  // Getters
  getPlatforms() {
    return this.currentLevelData.platforms;
  }

  getGoal() {
    return this.currentLevelData.goal;
  }

  getWalls() {
    return this.walls;
  }

  getIcicles() {
    return this.currentIcicles;
  }

  getPolarBears() {
    return this.currentPolarBears;
  }

  // Update polar bear positions (oscillate horizontally)
  updatePolarBears() {
    for (let bear of this.currentPolarBears) {
      // Move bear in current direction
      bear.x += bear.speed * bear.direction;

      // Check if bear hit boundary, reverse direction
      if (bear.x <= bear.minX) {
        bear.x = bear.minX;
        bear.direction = 1; // Start moving right
      } else if (bear.x >= bear.maxX) {
        bear.x = bear.maxX;
        bear.direction = -1; // Start moving left
      }
    }
  }

  // Check if player hit a polar bear
  checkPolarBearCollision(player) {
    for (let bear of this.currentPolarBears) {
      if (
        player.x < bear.x + bear.w &&
        player.x + player.w > bear.x &&
        player.y < bear.y + bear.h &&
        player.y + player.h > bear.y
      ) {
        return true;
      }
    }
    return false;
  }

  // Check if player hit an icicle
  checkIcicleCollision(player) {
    for (let icicle of this.currentIcicles) {
      if (
        player.x < icicle.x + icicle.w &&
        player.x + player.w > icicle.x &&
        player.y < icicle.y + icicle.h &&
        player.y + player.h > icicle.y
      ) {
        return true;
      }
    }
    return false;
  }

  checkIcicleCollisionWithPlatform(player) {
    for (let platform of this.currentLevelData.platforms) {
      if (platform.hasIcicles) {
        const icicleHeight = 20; // Match the height from drawPlatformIcicles
        const icicleBottom = platform.y + platform.h + icicleHeight;

        // Check if player's head is touching the icicle area
        if (
          player.y < icicleBottom && // Head is above icicle bottom
          player.y + player.h > platform.y + platform.h && // Body is below icicle top (inside icicle zone)
          player.x < platform.x + platform.w && // Horizontally overlapping
          player.x + player.w > platform.x
        ) {
          return true; // Player touched icicles - reset!
        }
      }
    }
    return false;
  }

  isWon() {
    return this.won;
  }

  isTransitioning() {
    return this.transitioning;
  }

  getCurrentLevel() {
    return this.currentLevel;
  }

  getTotalLevels() {
    return this.levels.length;
  }
}
