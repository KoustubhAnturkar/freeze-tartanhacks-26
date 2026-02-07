// Renderer class - handles all drawing operations
class Renderer {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  // Clear the canvas with background color
  clear(bgColor) {
    this.ctx.fillStyle = bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  // Draw all platforms
  drawPlatforms(platforms, colors) {
    platforms.forEach(platform => {
      // Fill platform
      this.ctx.fillStyle = colors.PLATFORM;
      this.ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
      
      // Draw outline
      this.ctx.strokeStyle = colors.PLATFORM_OUTLINE;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(platform.x, platform.y, platform.w, platform.h);
    });
  }

  // Draw the goal with flag
  drawGoal(goal, colors) {
    // Goal box
    this.ctx.fillStyle = colors.GOAL;
    this.ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
    
    // Goal outline
    this.ctx.strokeStyle = colors.GOAL_OUTLINE;
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);

    // Flag pole
    this.ctx.fillStyle = colors.GOAL_FLAG;
    this.ctx.fillRect(goal.x + goal.w / 2, goal.y - 25, 2, 25);
    
    // Flag
    this.ctx.beginPath();
    this.ctx.moveTo(goal.x + goal.w / 2 + 2, goal.y - 25);
    this.ctx.lineTo(goal.x + goal.w / 2 + 18, goal.y - 18);
    this.ctx.lineTo(goal.x + goal.w / 2 + 2, goal.y - 11);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Draw win message overlay
  drawWinMessage(currentLevel, totalLevels, colors) {
    // Semi-transparent overlay
    this.ctx.fillStyle = colors.WIN_OVERLAY;
    this.ctx.fillRect(0, this.height / 2 - 50, this.width, 100);
    
    // Win text
    this.ctx.fillStyle = colors.WIN_TEXT;
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    
    const message = currentLevel < totalLevels ? 'LEVEL COMPLETE' : 'YOU WIN!';
    this.ctx.fillText(message, this.width / 2, this.height / 2 + 10);
    
    // Reset text alignment
    this.ctx.textAlign = 'left';
  }
}
