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

    // 3. Draw Fluffy Clouds
    this.drawCloud(w * 0.2, h * 0.15, 1.0);
    this.drawCloud(w * 0.7, h * 0.1, 1.2);
    this.drawCloud(w * 0.5, h * 0.25, 0.8);
  }

  // Helper to draw a fluffy cloud
  drawCloud(x, y, scale) {
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    this.ctx.beginPath();
    // Center circle
    this.ctx.moveTo(x + 30 * scale, y);
    this.ctx.arc(x, y, 30 * scale, 0, Math.PI * 2);

    // Left overlapping circle
    this.ctx.moveTo((x - 25 * scale) + 25 * scale, y + 10 * scale);
    this.ctx.arc(x - 25 * scale, y + 10 * scale, 25 * scale, 0, Math.PI * 2);

    // Right overlapping circle
    this.ctx.moveTo((x + 25 * scale) + 28 * scale, y + 5 * scale);
    this.ctx.arc(x + 25 * scale, y + 5 * scale, 28 * scale, 0, Math.PI * 2);

    // Top-ish circle to add fluff
    this.ctx.moveTo((x + 10 * scale) + 25 * scale, y - 15 * scale);
    this.ctx.arc(x + 10 * scale, y - 15 * scale, 25 * scale, 0, Math.PI * 2);

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

  // Draw the goal as a mountain on the platform
  drawGoal(goal, colors) {
    // The mountain base should match the goal width (plus a bit)
    // The peak should be at the top of the goal (or slightly higher)
    const visualX = goal.x - 20;
    const visualW = goal.w + 40;
    const cx = visualX + visualW / 2;
    const peakY = goal.y - 40; // Peak above the goal hitbox
    const baseY = goal.y + goal.h + 50; // Extend base down to overlap with platform

    // Mountain Body
    this.ctx.fillStyle = colors.GOAL;
    this.ctx.beginPath();
    this.ctx.moveTo(visualX, baseY);
    this.ctx.lineTo(cx, peakY);
    this.ctx.lineTo(visualX + visualW, baseY);
    this.ctx.closePath();
    this.ctx.fill();

    // Snow Cap
    const capHeight = (baseY - peakY) * 0.3;
    const capY = peakY + capHeight;
    const capWidth = visualW * 0.3;

    this.ctx.fillStyle = colors.goalPeak;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, peakY);
    this.ctx.lineTo(cx + capWidth / 2, capY);
    this.ctx.lineTo(cx - capWidth / 2, capY);
    this.ctx.closePath();
    this.ctx.fill();

    // Flag (at the peak of the mountain)
    const flagX = cx;
    const flagY = peakY;

    // Pole
    this.ctx.fillStyle = '#4B5563';
    this.ctx.fillRect(flagX - 1, flagY - 25, 2, 25);

    // Flag Triangle
    this.ctx.fillStyle = colors.GOAL_FLAG;
    this.ctx.beginPath();
    this.ctx.moveTo(flagX, flagY - 25);
    this.ctx.lineTo(flagX + 15, flagY - 18);
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

  // Draw collectibles (canvas-only scooty-dog icon)
  // drawCollectibles(collectibles) {
  //   collectibles.forEach((c) => {
  //     const cx = c.x;
  //     const cy = c.y;
  //     const w = c.w;
  //     const h = c.h;

  //     // Wheels
  //     const wheelR = Math.max(2, Math.min(w, h) * 0.18);
  //     this.ctx.fillStyle = '#F59E0B';
  //     this.ctx.beginPath();
  //     this.ctx.arc(cx + wheelR + 1, cy + h - wheelR, wheelR, 0, Math.PI * 2);
  //     this.ctx.arc(cx + w - wheelR - 1, cy + h - wheelR, wheelR, 0, Math.PI * 2);
  //     this.ctx.fill();

  //     // Body
  //     this.ctx.fillStyle = '#000';
  //     const bodyH = Math.max(4, h * 0.45);
  //     this.ctx.fillRect(cx + 2, cy + h - wheelR - bodyH - 2, w - 4, bodyH);

  //     // Head (front)
  //     const headR = Math.max(2, Math.min(w, h) * 0.18);
  //     this.ctx.beginPath();
  //     this.ctx.arc(cx + w - headR - 3, cy + h - wheelR - bodyH + headR - 3, headR, 0, Math.PI * 2);
  //     this.ctx.fill();

  //     // Eyes
  //     this.ctx.fillStyle = '#fff';
  //     this.ctx.beginPath();
  //     this.ctx.arc(cx + w - headR - 5, cy + h - wheelR - bodyH + headR - 4, 1.2, 0, Math.PI * 2);
  //     this.ctx.arc(cx + w - headR + 1, cy + h - wheelR - bodyH + headR - 4, 1.2, 0, Math.PI * 2);
  //     this.ctx.fill();

  //     // Small ear/antenna to hint 'scooty'
  //     this.ctx.strokeStyle = '#4B5563';
  //     this.ctx.lineWidth = 1;
  //     this.ctx.beginPath();
  //     this.ctx.moveTo(cx + w - headR - 2, cy + h - wheelR - bodyH - 2);
  //     this.ctx.lineTo(cx + w - headR + 6, cy + h - wheelR - bodyH - 8);
  //     this.ctx.stroke();
  //   });
  // }
  // Draw collectibles (The Scotty Dog)
  // Draw collectibles (The Scotty Dog)
  // Draw collectibles (Pixel Scotty Dog - Fixed Collar)
  // Draw collectibles (Best of both worlds: V1 Body + V2 Collar)
  drawCollectibles(collectibles) {
    collectibles.forEach((c) => {
      const ctx = this.ctx;
      const x = c.x;
      const y = c.y;
      // Scale factor (using the V1 scale which was slightly smaller/crisper)
      const s = c.w / 30;

      ctx.save();
      // Bobbing animation
      const bob = Math.sin(Date.now() / 200) * 3;
      ctx.translate(x + c.w / 2, y + c.h / 2 + bob);
      ctx.scale(s, s);

      // --- 1. THE BODY (From First Version) ---
      ctx.fillStyle = "#000";
      ctx.beginPath();

      // Main body block
      ctx.rect(-12, -5, 20, 14);

      // Back leg
      ctx.rect(-12, 9, 6, 6);

      // Front leg
      ctx.rect(2, 9, 6, 6);

      // Tail (Pointy)
      ctx.moveTo(-12, -5);
      ctx.lineTo(-14, -12);
      ctx.lineTo(-8, -5);
      ctx.fill();

      // --- 2. THE HEAD (From First Version) ---
      ctx.beginPath();

      // Neck/Head area
      ctx.rect(0, -15, 14, 12);

      // Snout/Beard
      ctx.moveTo(14, -10);
      ctx.lineTo(18, -10); // Nose tip
      ctx.lineTo(14, 0);   // Chin

      // Ears (Pointy)
      ctx.moveTo(2, -15);
      ctx.lineTo(4, -22);  // Ear tip
      ctx.lineTo(8, -15);
      ctx.fill();

      // --- 3. THE COLLAR (From Second Version - Fixed Placement) ---
      // Placing it exactly where the head meets the body
      ctx.fillStyle = "#DC2626"; // Bright Red

      // A simple band around the neck area
      // x=0 (start of head), y=-3 (bottom of head block), w=14 (width of head)
      ctx.fillRect(-3, -4, 14, 4);

      ctx.restore();
    });
  }
}
