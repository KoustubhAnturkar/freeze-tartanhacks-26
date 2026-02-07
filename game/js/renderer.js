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

  // Draw icicles as hanging spikes
  drawIcicles(icicles) {
    icicles.forEach((icicle) => {
      const ctx = this.ctx;
      const x = icicle.x;
      const y = icicle.y;
      const w = icicle.w;
      const h = icicle.h;

      // Main icicle body - light blue with gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      gradient.addColorStop(0, '#E0F7FF');  // Light blue-white at top
      gradient.addColorStop(0.5, '#B3E5FC'); // Medium blue
      gradient.addColorStop(1, '#81D4FA');   // Darker blue at tip

      ctx.fillStyle = gradient;

      // Draw icicle as triangle pointing down (pixelated style)
      ctx.beginPath();
      ctx.moveTo(x, y);                    // Top left
      ctx.lineTo(x + w, y);                 // Top right
      ctx.lineTo(x + w / 2, y + h);         // Bottom point (sharp tip)
      ctx.closePath();
      ctx.fill();

      // Add white highlight on left side for 3D effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w * 0.3, y);
      ctx.lineTo(x + w / 2 * 0.6, y + h);
      ctx.closePath();
      ctx.fill();

      // Add darker edge on right for depth
      ctx.fillStyle = 'rgba(0, 100, 150, 0.3)';
      ctx.beginPath();
      ctx.moveTo(x + w, y);
      ctx.lineTo(x + w * 0.7, y);
      ctx.lineTo(x + w / 2 + w * 0.1, y + h);
      ctx.lineTo(x + w / 2, y + h);
      ctx.closePath();
      ctx.fill();

      // Sharp white tip at bottom
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Draw polar bears as pixelated enemies
  drawPolarBears(polarBears) {
    polarBears.forEach((bear) => {
      const ctx = this.ctx;
      const x = bear.x;
      const y = bear.y;
      const w = bear.w;
      const h = bear.h;

      // Determine facing direction
      const facingRight = bear.direction > 0;

      ctx.save();

      // Flip horizontally if moving left
      if (!facingRight) {
        ctx.translate(x + w, y);
        ctx.scale(-1, 1);
        ctx.translate(-x, -y);
      }

      // Body (white/cream color)
      ctx.fillStyle = '#F5F5DC';  // Beige-white
      ctx.fillRect(x + 5, y + 10, w - 10, h - 10);

      // Head (rounded)
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x + w - 10, y + 12, 8, 0, Math.PI * 2);
      ctx.fill();

      // Ears
      ctx.fillStyle = '#F5F5DC';
      ctx.fillRect(x + w - 15, y + 5, 4, 5);
      ctx.fillRect(x + w - 8, y + 5, 4, 5);

      // Snout
      ctx.fillStyle = '#FFE4E1';
      ctx.fillRect(x + w - 12, y + 14, 6, 4);

      // Nose (black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + w - 11, y + 14, 2, 2);

      // Eyes (black dots)
      ctx.fillRect(x + w - 14, y + 10, 2, 2);
      ctx.fillRect(x + w - 8, y + 10, 2, 2);

      // Legs (4 legs)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(x + 8, y + h - 8, 6, 8);   // Front left
      ctx.fillRect(x + 18, y + h - 8, 6, 8);  // Front right
      ctx.fillRect(x + w - 18, y + h - 8, 6, 8);  // Back left
      ctx.fillRect(x + w - 8, y + h - 8, 6, 8);   // Back right

      // Paws (black pads)
      ctx.fillStyle = '#333333';
      ctx.fillRect(x + 9, y + h - 2, 4, 2);
      ctx.fillRect(x + 19, y + h - 2, 4, 2);
      ctx.fillRect(x + w - 17, y + h - 2, 4, 2);
      ctx.fillRect(x + w - 7, y + h - 2, 4, 2);

      ctx.restore();
    });
  }
}
