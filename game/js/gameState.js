// GameState - manages level progression, win conditions, and game state
class GameState {
  constructor(levels, transitionDelay) {
    this.walls = levels.walls;
    this.levels = levels.platformsAndGoals;
    this.transitionDelay = transitionDelay;
    this.currentLevel = 1;
    this.won = false;
    this.transitioning = false;
    this.tutorial = !localStorage.getItem('tutDone');
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
    this.currentCollectibles = (this.currentLevelData.collectibles || []).map(c => ({...c}));
    // Update UI
    document.getElementById('lvl').textContent = levelNumber;
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
        this.nextLevel();
        if (onComplete) onComplete();
      } else {
        this.transitioning = false;
      }
    }, this.transitionDelay);
  }

  // Check if player reached the goal
  checkGoalCollision(player) {
    const goal = this.currentLevelData.goal;
    return player.x < goal.x + goal.w &&
           player.x + player.w > goal.x &&
           player.y < goal.y + goal.h &&
           player.y + player.h > goal.y;
  }

  // Collectible accessors and collision handling
  getCollectibles() {
    return this.currentCollectibles;
  }

  // Check player against collectibles; remove and return true if any collected
  collectAt(player) {
    for (let i = this.currentCollectibles.length - 1; i >= 0; i--) {
      const c = this.currentCollectibles[i];
      if (player.x < c.x + c.w && player.x + player.w > c.x && player.y < c.y + c.h && player.y + player.h > c.y) {
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
    localStorage.setItem('tutDone', '1');
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
