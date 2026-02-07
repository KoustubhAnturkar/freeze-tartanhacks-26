// Input handler - manages keyboard and touch controls
class InputHandler {
  constructor() {
    this.keys = {
      left: false,
      right: false,
      jump: false
    };
    this.prevKeys = { left: false, right: false, jump: false };

    this.setupEventListeners();
  }

  // Setup all input event listeners
  setupEventListeners() {
    // Setup mobile button controls
    this.setupButton('bl', 'left');
    this.setupButton('br', 'right');
    this.setupButton('bj', 'jump');

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.keys.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.keys.right = true;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        this.keys.jump = true;
      }
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        this.keys.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        this.keys.right = false;
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') {
        this.keys.jump = false;
      }
    });
  }

  // Setup button for both touch and mouse events
  setupButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    
    // Touch events (mobile)
    button.addEventListener('touchstart', () => {
      this.keys[keyName] = true;
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') SOUNDS.play('button');
    });
    
    button.addEventListener('touchend', () => {
      this.keys[keyName] = false;
    });
    
    // Mouse events (desktop testing)
    button.addEventListener('mousedown', () => {
      this.keys[keyName] = true;
      if (typeof SOUNDS !== 'undefined' && SOUNDS && typeof SOUNDS.play === 'function') SOUNDS.play('button');
    });
    
    button.addEventListener('mouseup', () => {
      this.keys[keyName] = false;
    });
  }

  // Call frequently to update previous key state and play step sounds
  poll() {
    if (typeof SOUNDS === 'undefined' || !SOUNDS || !SOUNDS.play) {
      this.prevKeys.left = this.keys.left;
      this.prevKeys.right = this.keys.right;
      this.prevKeys.jump = this.keys.jump;
      return;
    }

    // Play step when movement begins
    if ((this.keys.left || this.keys.right) && !(this.prevKeys.left || this.prevKeys.right)) {
      SOUNDS.play('step');
    }

    this.prevKeys.left = this.keys.left;
    this.prevKeys.right = this.keys.right;
    this.prevKeys.jump = this.keys.jump;
  }

  // Get current key states
  getKeys() {
    return this.keys;
  }
}
