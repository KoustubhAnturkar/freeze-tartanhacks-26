// Renderer class - handles all drawing operations
class Renderer {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.lastFlipX = true;

    // Sprite GIFs
    this.sprites = {};
    this.spritesLoaded = false;

    // Scotty collectible sprite
    this.scottySprite = new Image();
    this.scottySprite.src = 'Spritesheets/Scotty.png';
    this.scottySprite.onload = () => {
      console.log('Scotty sprite loaded!');
    };

    // Goal sprite
    this.goalSprite = new Image();
    this.goalSprite.src = 'Spritesheets/Goal.png';
    this.goalSprite.onload = () => {
      console.log('Goal sprite loaded!');
    };

    // Background image
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'Spritesheets/images.jpeg';
    this.backgroundImage.onload = () => {
      console.log('Background image loaded!');
    };

    // Polar bear walking sprite
    this.polarBearSprite = new Image();
    this.polarBearSprite.src = 'Spritesheets/Polar_bear_walking.gif';
    this.polarBearSprite.onload = () => {
      console.log('Polar bear sprite loaded!');
    };

    // Polar bear HTML elements for animation (like player sprites)
    this.polarBearElements = [];

    // Platform sprite
    this.platformSprite = new Image();
    this.platformSprite.src = 'Spritesheets/img_1.png';
    this.platformSprite.onload = () => {
      console.log('Platform sprite loaded!');
    };

    // Wall sprite
    this.wallSprite = new Image();
    this.wallSprite.src = 'Spritesheets/wall.png';
    this.wallSprite.onload = () => {
      console.log('Wall sprite loaded!');
    };

    // Create HTML img element for animated GIF display
    this.playerImgElement = null;
    this.currentSpriteName = 'idle';
    this.createPlayerImageElement();

    // Load all sprite GIFs
    this.loadSprites();
  }

  // Create an HTML img element to display animated GIFs
  createPlayerImageElement() {
    this.playerImgElement = document.createElement('img');
    this.playerImgElement.id = 'player-sprite';
    this.playerImgElement.style.position = 'absolute';
    this.playerImgElement.style.pointerEvents = 'none';
    this.playerImgElement.style.imageRendering = 'pixelated';
    this.playerImgElement.style.zIndex = '5';
    document.body.appendChild(this.playerImgElement);
  }

  // Load all sprite sheets
  loadSprites() {
    const spriteNames = ['Idle', 'Walk', 'Jump', 'Land'];

    let loadedCount = 0;
    const totalSprites = spriteNames.length;

    spriteNames.forEach(name => {
      const img = new Image();
      img.src = `Spritesheets/${name}.gif`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalSprites) {
          this.spritesLoaded = true;
          console.log('All sprite GIFs loaded!');
        }
      };
      img.onerror = () => {
        console.error(`Failed to load sprite: ${name}.gif`);
      };
      this.sprites[name.toLowerCase()] = img;
    });
  }

  // Draw sprite (GIF is already animated by browser)
  drawSprite(spriteName, x, y, width, height, frameIndex = 0, flipX = false) {
    const sprite = this.sprites[spriteName];
    if (!sprite || !sprite.complete) return;

    this.ctx.save();

    if (flipX) {
      this.ctx.translate(x + width, y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(sprite, 0, 0, width, height);
    } else {
      this.ctx.drawImage(sprite, x, y, width, height);
    }

    this.ctx.restore();
  }

  // Draw the sky and distant heavy mountains
  drawScenery(colors) {
    const w = this.width;
    const h = this.height;

    if (this.backgroundImage && this.backgroundImage.complete) {
      // Draw background image stretched to fill canvas
      this.ctx.drawImage(this.backgroundImage, 0, 0, w, h);
    } else {
      // Fallback to gradient if image not loaded
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

  // Draw all platforms using img_1.png sprite
  drawPlatforms(platforms, colors) {
    if (!this.platformSprite || !this.platformSprite.complete) {
      // Fallback to drawn platforms if sprite not loaded
      platforms.forEach((platform) => {
        // Main body (Dark Rock)
        this.ctx.fillStyle = colors.PLATFORM;
        this.ctx.fillRect(platform.x, platform.y, platform.w, platform.h);

        // Snow Cap
        this.ctx.fillStyle = colors.PLATFORM_TOP;
        this.ctx.fillRect(platform.x, platform.y, platform.w, 6);
      });
      return;
    }

    // Draw each platform using the sprite image
    platforms.forEach((platform) => {
      this.ctx.drawImage(
        this.platformSprite,
        platform.x,
        platform.y,
        platform.w,
        platform.h
      );
    });
  }

  // Draw all walls using wall.png sprite
  drawWalls(walls, colors) {
    console.log("Drawing walls:", walls);
    if (!walls || walls.length === 0) {
      return;
    }

    if (!this.wallSprite || !this.wallSprite.complete) {
      // Fallback to drawn walls if sprite not loaded
      walls.forEach((wall) => {
        this.ctx.fillStyle = '#8B7355'; // Brown wall color
        this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
      });
      return;
    }

    // Draw each wall using the sprite image
    walls.forEach((wall) => {
      this.ctx.drawImage(
        this.wallSprite,
        wall.x,
        wall.y,
        wall.w,
        wall.h
      );
    });
  }

  // Draw the goal using Goal.png sprite
  drawGoal(goal, colors) {
    if (!this.goalSprite || !this.goalSprite.complete) {
      // Fallback to drawing mountain if sprite not loaded
      this.drawGoalMountain(goal, colors);
      return;
    }

    // Scale the goal sprite to be larger and more visible
    const spriteScale = 5;
    const spriteWidth = goal.w * spriteScale;
    const spriteHeight = goal.h * spriteScale;

    // Center the sprite on the goal hitbox
    const offsetX = (spriteWidth - goal.w) / 2;
    const offsetY = (spriteHeight - goal.h - 50) / 2 ;

    this.ctx.save();
    this.ctx.drawImage(
      this.goalSprite,
      goal.x - offsetX,
      goal.y - offsetY,
      spriteWidth,
      spriteHeight
    );
    this.ctx.restore();
  }

  // Fallback method to draw goal as mountain (if sprite not loaded)
  drawGoalMountain(goal, colors) {
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

  // Draw collectibles using Scotty.png sprite
  drawCollectibles(collectibles) {
    if (!this.scottySprite || !this.scottySprite.complete) {
      // If sprite not loaded, don't draw anything
      return;
    }

    collectibles.forEach((c) => {
      this.ctx.save();

      // Bobbing animation
      const bob = Math.sin(Date.now() / 200) * 3;

      // Scale sprite to 2x the collectible size
      const spriteScale = 2;
      const spriteWidth = c.w * spriteScale;
      const spriteHeight = c.h * spriteScale;

      // Center the larger sprite on the collectible position
      const offsetX = (spriteWidth - c.w) / 2;
      const offsetY = (spriteHeight - c.h) / 2;

      // Draw Scotty sprite centered and scaled 2x with bobbing
      this.ctx.drawImage(
        this.scottySprite,
        c.x - offsetX,
        c.y + bob - offsetY,
        spriteWidth,
        spriteHeight
      );

      this.ctx.restore();
    });
  }

  // Draw a single stationary scotty dog icon (no bobbing) - using sprite at 2x size
  drawScottyIcon(x, y, w, h) {
    if (!this.scottySprite || !this.scottySprite.complete) {
      // If sprite not loaded, don't draw
      return;
    }

    this.ctx.save();

    // Scale to 2x size
    const spriteScale = 2;
    const spriteWidth = w * spriteScale;
    const spriteHeight = h * spriteScale;

    // Center the larger sprite in the given area
    const offsetX = (spriteWidth - w) / 2;
    const offsetY = (spriteHeight - h) / 2;

    this.ctx.drawImage(
      this.scottySprite,
      x - offsetX,
      y - offsetY,
      spriteWidth,
      spriteHeight
    );
    this.ctx.restore();
  }

  // Draw player using sprite GIFs (via HTML img element for animation)
  drawPlayer(player, colors) {
    // // Draw debug hitbox rectangle (RED SQUARE)
    // this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
    // this.ctx.lineWidth = 2;
    // this.ctx.strokeRect(player.x, player.y, player.w, player.h);
    //
    // // Draw hitbox center point (for reference)
    // this.ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    // this.ctx.fillRect(player.x + player.w / 2 - 2, player.y + player.h / 2 - 2, 4, 4);

    if (!this.spritesLoaded || !this.playerImgElement) {
      // Fallback to original penguin drawing if sprites not loaded
      if (this.playerImgElement) {
        this.playerImgElement.style.display = 'none';
      }
      player.draw(this.ctx, colors);
      return;
    }

    // Determine which sprite to use based on player state
    let spriteName = 'idle';

    if (player.vy < -2) {
      spriteName = 'jump';
    } else if (player.vy > 2 && !player.onGround) {
      spriteName = 'land';
    } else if (Math.abs(player.vx) > 0.5) {
      spriteName = 'walk';
    } else if (player.onGround) {
      spriteName = 'idle';
    }

    // Update sprite if changed
    if (this.currentSpriteName !== spriteName) {
      this.currentSpriteName = spriteName;
      this.playerImgElement.src = `Spritesheets/${spriteName.charAt(0).toUpperCase() + spriteName.slice(1)}.gif`;
    }

    // Get canvas element and its position/scale
    const canvas = this.ctx.canvas;
    const canvasRect = canvas.getBoundingClientRect();

    // Calculate canvas scale factors (how much the canvas is scaled from its internal size)
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;

    // Sprite scale relative to hitbox (2.5x the hitbox size)
    const spriteScale = 3;

    // Calculate sprite dimensions in canvas coordinates (before scaling)
    const spriteWidthCanvas = player.w * spriteScale;
    const spriteHeightCanvas = player.h * spriteScale;

    // Calculate sprite dimensions in screen coordinates (after canvas scaling)
    const spriteWidthScreen = spriteWidthCanvas * scaleX;
    const spriteHeightScreen = spriteHeightCanvas * scaleY;

    // Calculate offset to center sprite on hitbox (in canvas coordinates)
    const offsetXCanvas = (spriteWidthCanvas - player.w) / 2;
    const offsetYCanvas = (spriteHeightCanvas - 2*player.h) / 2;

    // Calculate player position in screen coordinates
    const playerScreenX = canvasRect.left + (player.x * scaleX);
    const playerScreenY = canvasRect.top + (player.y * scaleY);

    // Calculate offset in screen coordinates
    const offsetXScreen = offsetXCanvas * scaleX;
    const offsetYScreen = offsetYCanvas * scaleY;

    // Final sprite position (centered on hitbox)
    const spriteScreenX = playerScreenX - offsetXScreen;
    const spriteScreenY = playerScreenY - offsetYScreen;

    // Determine flip direction
    const flipX = player.vx > 0 ? true : player.vx < 0 ? false : this.lastFlipX;
    this.lastFlipX = flipX;

    // Apply positioning
    this.playerImgElement.style.display = 'block';
    this.playerImgElement.style.left = spriteScreenX + 'px';
    this.playerImgElement.style.top = spriteScreenY + 'px';
    this.playerImgElement.style.width = spriteWidthScreen + 'px';
    this.playerImgElement.style.height = spriteHeightScreen + 'px';
    this.playerImgElement.style.transform = flipX ? 'scaleX(-1)' : 'scaleX(1)';
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

  // Draw polar bears using Polar_bear_walking.gif sprite (HTML elements for animation)
  drawPolarBears(polarBears) {
    if (!this.polarBearSprite || !this.polarBearSprite.complete) {
      // If sprite not loaded, don't draw
      return;
    }

    // Ensure we have enough HTML elements for all polar bears
    while (this.polarBearElements.length < polarBears.length) {
      const img = document.createElement('img');
      img.className = 'polar-bear-sprite';
      img.src = 'Spritesheets/Polar_bear_walking.gif';
      img.style.position = 'absolute';
      img.style.pointerEvents = 'none';
      img.style.imageRendering = 'pixelated';
      img.style.zIndex = '4';
      document.body.appendChild(img);
      this.polarBearElements.push(img);
    }

    // Get canvas position and scale
    const canvas = this.ctx.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / canvas.width;
    const scaleY = canvasRect.height / canvas.height;

    polarBears.forEach((bear, index) => {
      const imgElement = this.polarBearElements[index];

      // Scale the polar bear sprite (smaller now - 1.5x instead of 2.5x)
      const spriteScale = 1.5;
      const spriteWidthCanvas = bear.w * spriteScale;
      const spriteHeightCanvas = bear.h * spriteScale;

      // Convert to screen coordinates
      const spriteWidthScreen = spriteWidthCanvas * scaleX;
      const spriteHeightScreen = spriteHeightCanvas * scaleY;

      // Center the sprite on the bear hitbox
      const offsetXCanvas = (spriteWidthCanvas - bear.w) / 2;
      const offsetYCanvas = (spriteHeightCanvas - bear.h - 25) / 2;
      const offsetXScreen = offsetXCanvas * scaleX;
      const offsetYScreen = offsetYCanvas * scaleY;

      // Calculate bear position in screen coordinates
      const bearScreenX = canvasRect.left + (bear.x * scaleX);
      const bearScreenY = canvasRect.top + (bear.y * scaleY);

      // Final sprite position (centered on hitbox)
      const spriteScreenX = bearScreenX - offsetXScreen;
      const spriteScreenY = bearScreenY - offsetYScreen;

      // Determine facing direction
      const facingRight = bear.direction > 0;

      // Position and style the element
      imgElement.style.display = 'block';
      imgElement.style.left = spriteScreenX + 'px';
      imgElement.style.top = spriteScreenY + 'px';
      imgElement.style.width = spriteWidthScreen + 'px';
      imgElement.style.height = spriteHeightScreen + 'px';
      imgElement.style.transform = facingRight ? 'scaleX(1)' : 'scaleX(-1)';
    });

    // Hide extra elements if we have more than needed
    for (let i = polarBears.length; i < this.polarBearElements.length; i++) {
      this.polarBearElements[i].style.display = 'none';
    }
  }
}
