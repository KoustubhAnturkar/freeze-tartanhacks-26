// Player class - handles movement, physics, and drawing
class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.vx = 0; // velocity x
    this.vy = 0; // velocity y
    this.onGround = false;
  }

  // Update player physics and handle collisions
  update(keys, platforms, gravity, speed, jumpForce, deceleration) {
    // Horizontal movement
    if (keys.left) {
      this.vx = -speed;
    } else if (keys.right) {
      this.vx = speed;
    } else {
      // Apply deceleration when no horizontal input and not on ground
      if(!this.onGround) {
        if(this.vx > 0) {
          this.vx = Math.max(0, this.vx + deceleration); // slow down in air
        } else {
          this.vx = Math.min(0, this.vx - deceleration); // slow down in air
        }
      } else {
        this.vx = 0; // stop immediately on ground
      }
    }

    // Apply gravity
    this.vy += gravity;

    // Update position
    this.x += this.vx;
    this.y += this.vy;

    this.onGround = false;

    // Platform collision detection
    platforms.forEach(platform => {
      if (this.checkCollision(platform)) {
        // Landing on top of platform
        if (this.vy > 0 && this.y + this.h - this.vy <= platform.y) {
          this.y = platform.y - this.h;
          this.vy = 0;
          this.onGround = true;
        }
        // Hitting platform from below
        else if (this.vy < 0 && this.y - this.vy >= platform.y + platform.h) {
          this.y = platform.y + platform.h;
          this.vy = 0;
        }
        // Hitting platform from right
        else if (this.vx > 0) {
          this.x = platform.x - this.w;
          this.vx = 0;
        }
        // Hitting platform from left
        else if (this.vx < 0) {
          this.x = platform.x + platform.w;
          this.vx = 0;
        }
      }
    });

    // Jump
    if (keys.jump && this.onGround) {
      this.vy = jumpForce;
    }
  }

  // Check collision with rectangle
  checkCollision(rect) {
    return this.x < rect.x + rect.w &&
           this.x + this.w > rect.x &&
           this.y < rect.y + rect.h &&
           this.y + this.h > rect.y;
  }

  // Reset player position
  reset(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  // Draw the penguin
  draw(ctx, colors) {
    ctx.save();
    ctx.translate(this.x + this.w / 2, this.y + this.h / 2);

    // Body - black ellipse
    ctx.fillStyle = colors.PENGUIN_BODY;
    ctx.beginPath();
    ctx.ellipse(0, 2, 13, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly - white ellipse
    ctx.fillStyle = colors.PENGUIN_BELLY;
    ctx.beginPath();
    ctx.ellipse(0, 6, 9, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes - white circles
    ctx.fillStyle = colors.PENGUIN_EYES;
    ctx.beginPath();
    ctx.arc(-5, -8, 4, 0, Math.PI * 2);
    ctx.arc(5, -8, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pupils - blue circles
    ctx.fillStyle = colors.PENGUIN_PUPILS;
    ctx.beginPath();
    ctx.arc(-4, -8, 2, 0, Math.PI * 2);
    ctx.arc(6, -8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak - blue triangle
    ctx.fillStyle = colors.PENGUIN_BEAK;
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(7, -2);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Feet - blue rectangles
    ctx.fillStyle = colors.PENGUIN_FEET;
    ctx.fillRect(-8, 17, 6, 3);
    ctx.fillRect(2, 17, 6, 3);

    ctx.restore();
  }
}
