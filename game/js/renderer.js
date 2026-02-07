// Renderer class - handles all drawing operations
class Renderer {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  // Draw the sky and distant heavy mountains
  drawScenery(colors) {
    const w = this.width;
    const h = this.height;

    // 1. Draw Sky Gradient
    let grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, colors.bgTop);
    grad.addColorStop(1, colors.bgBottom);
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // 2. Draw Distant Mountains
    this.ctx.fillStyle = colors.distantMountain;
    this.ctx.beginPath();
    // Mountain 1 (Left)
    this.ctx.moveTo(0, h);
    this.ctx.lineTo(w * 0.2, h - 150);
    this.ctx.lineTo(w * 0.4, h);
    // Mountain 2 (Right - Bigger)
    this.ctx.moveTo(w * 0.5, h);
    this.ctx.lineTo(w * 0.8, h - 220);
    this.ctx.lineTo(w, h);
    // Mountain 3 (Center/Back)
    this.ctx.moveTo(w * 0.3, h);
    this.ctx.lineTo(w * 0.5, h - 180);
    this.ctx.lineTo(w * 0.7, h);
    this.ctx.fill();

    // 3. Draw Simple Clouds
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    this.ctx.beginPath();
    this.ctx.arc(w * 0.2, h * 0.2, 30, 0, Math.PI * 2);
    this.ctx.arc(w * 0.25, h * 0.18, 40, 0, Math.PI * 2);
    this.ctx.arc(w * 0.7, h * 0.1, 50, 0, Math.PI * 2);
    this.ctx.arc(w * 0.8, h * 0.12, 30, 0, Math.PI * 2);
    this.ctx.fill();
  }

  // Draw all platforms with snow caps
  drawPlatforms(platforms, colors) {
    platforms.forEach((platform) => {
      // Main body (Dark Rock)
      this.ctx.fillStyle = colors.PLATFORM;
      this.ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

      // Snow Cap
      this.ctx.fillStyle = colors.PLATFORM_TOP;
      this.ctx.fillRect(platform.x, platform.y, platform.w, 6);
    });
  }

  // Draw the goal as a massive foreground mountain
  drawGoal(goal, colors) {
    // Make the visual mountain much larger than the hitbox
    const visualX = goal.x - 50;
    const visualW = goal.w + 100;
    const cx = visualX + visualW / 2;
    const peakY = goal.y - 50; // Taller peak
    const baseY = goal.y + goal.h;

    // Mountain Body
    this.ctx.fillStyle = colors.goal;
    this.ctx.beginPath();
    this.ctx.moveTo(visualX, baseY);
    this.ctx.lineTo(cx, peakY);
    this.ctx.lineTo(visualX + visualW, baseY);
    this.ctx.closePath();
    this.ctx.fill();

    // Snow Cap
    const capHeight = (baseY - peakY) * 0.3;
    const capY = peakY + capHeight;
    const capWidth = visualW * 0.3; // Approx width at cap height

    this.ctx.fillStyle = colors.goalPeak;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, peakY);
    this.ctx.lineTo(cx + capWidth / 2, capY);
    this.ctx.lineTo(cx - capWidth / 2, capY);
    this.ctx.closePath();
    this.ctx.fill();

    // Flag (at original goal position logic to guide player)
    const flagX = goal.x + goal.w / 2;
    const flagY = goal.y; // Original top of goal box

    this.ctx.fillStyle = "#4B5563";
    this.ctx.fillRect(flagX - 1, flagY - 25, 2, 25);

    this.ctx.fillStyle = colors.goalFlag;
    this.ctx.beginPath();
    this.ctx.moveTo(flagX, flagY - 25);
    this.ctx.lineTo(flagX + 12, flagY - 18);
    this.ctx.lineTo(flagX, flagY - 11);
    this.ctx.closePath();
    this.ctx.fill();
  }

  // Draw win message overlay
  drawWinMessage(currentLevel, totalLevels, colors) {
    this.ctx.fillStyle = colors.winOverlay;
    this.ctx.fillRect(0, this.height / 2 - 50, this.width, 100);

    this.ctx.fillStyle = colors.winText;
    this.ctx.font = "bold 32px Arial";
    this.ctx.textAlign = "center";

    const message = currentLevel < totalLevels ? "LEVEL COMPLETE" : "YOU WIN!";
    this.ctx.fillText(message, this.width / 2, this.height / 2 + 10);

    // Reset text alignment
    this.ctx.textAlign = "left";
  }
}
