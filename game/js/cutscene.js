// Cutscene manager - handles story sequences between levels
class CutsceneManager {
  constructor() {
    this.isActive = false;
    this.currentScene = null;
    this.currentTextIndex = 0;
    this.textRevealProgress = 0;
    this.textRevealSpeed = 2; // Characters per frame
    this.autoAdvanceDelay = 2000; // ms to wait before auto-advancing
    this.lastAdvanceTime = 0;
    this.onComplete = null;

    // Story cutscenes - shown at start and after every 2 levels
    this.cutscenes = {
      0: { // Before level 1 (intro)
        title: "The Frozen Journey Begins",
        texts: [
          "A penguin looks toward distant mountains...",
          "No one knows why.",
          "The penguin does not explain!"
        ],
        objective: "Master the basics: Jump and reach the goal!",
        background: '#1a1a2e'
      }
    };

    this.createCutsceneUI();
  }

  createCutsceneUI() {
    // Create cutscene overlay
    const overlay = document.createElement('div');
    overlay.id = 'cutscene';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      display: none;
      z-index: 200;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;

    // Create content container
    const content = document.createElement('div');
    content.id = 'cutsceneContent';
    content.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 90%;
      max-width: 700px;
      text-align: center;
      color: #fff;
    `;

    // Create title
    const title = document.createElement('h2');
    title.id = 'cutsceneTitle';
    title.style.cssText = `
      font-size: 36px;
      color: #1e90ff;
      margin-bottom: 20px;
      font-weight: bold;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
      font-family: 'Press Start 2P', 'Courier New', monospace;
      letter-spacing: 2px;
      text-transform: uppercase;
    `;

    // Create objective box
    const objective = document.createElement('div');
    objective.id = 'cutsceneObjective';
    objective.style.cssText = `
      background: rgba(30, 144, 255, 0.2);
      border: 2px solid #1e90ff;
      border-radius: 8px;
      padding: 15px 20px;
      margin: 20px auto 30px;
      font-size: 16px;
      color: #ffd700;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      font-family: 'Press Start 2P', 'Courier New', monospace;
      letter-spacing: 1px;
      line-height: 1.6;
      box-shadow: 0 0 20px rgba(30, 144, 255, 0.3);
    `;

    // Create text display
    const textDisplay = document.createElement('p');
    textDisplay.id = 'cutsceneText';
    textDisplay.style.cssText = `
      font-size: 18px;
      line-height: 2;
      margin: 30px 0;
      min-height: 120px;
      color: #e0e0e0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      font-family: 'VT323', 'Courier New', monospace;
      letter-spacing: 1px;
    `;

    // Create continue prompt
    const prompt = document.createElement('div');
    prompt.id = 'cutscenePrompt';
    prompt.style.cssText = `
      font-size: 14px;
      color: #1e90ff;
      margin-top: 30px;
      opacity: 0;
      animation: blink 1.5s infinite;
      font-family: 'Press Start 2P', 'Courier New', monospace;
      letter-spacing: 1px;
    `;
    prompt.textContent = '[ TAP TO CONTINUE ]';

    // Add blink animation and import fonts
    const style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');
      
      @keyframes blink {
        0%, 50% { opacity: 0.3; }
        25%, 75% { opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    content.appendChild(title);
    content.appendChild(objective);
    content.appendChild(textDisplay);
    content.appendChild(prompt);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    this.overlay = overlay;
    this.title = title;
    this.objective = objective;
    this.textDisplay = textDisplay;
    this.prompt = prompt;

    // Add event listeners for advancing
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    const advance = () => {
      if (this.isActive) {
        this.advance();
      }
    };

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (this.isActive) {
        advance();
      }
    });

    // Mouse click
    this.overlay.addEventListener('click', advance);

    // Touch
    this.overlay.addEventListener('touchstart', advance);
  }

  // Check if cutscene should play for this level
  shouldPlayCutscene(level) {
    return this.cutscenes.hasOwnProperty(level);
  }

  // Start a cutscene
  play(level, onComplete) {
    if (!this.cutscenes[level]) {
      if (onComplete) onComplete();
      return;
    }

    this.currentScene = this.cutscenes[level];
    this.currentTextIndex = 0;
    this.textRevealProgress = 0;
    this.isActive = true;
    this.onComplete = onComplete;
    this.lastAdvanceTime = Date.now();

    // Set background color
    this.overlay.style.background = this.currentScene.background || '#000';

    // Set title
    this.title.textContent = this.currentScene.title;

    // Set objective
    if (this.currentScene.objective) {
      this.objective.textContent = '⚡ OBJECTIVE: ' + this.currentScene.objective;
      this.objective.style.display = 'block';
    } else {
      this.objective.style.display = 'none';
    }

    // Clear text
    this.textDisplay.textContent = '';
    this.prompt.style.opacity = '0';

    // Show overlay with fade in
    this.overlay.style.display = 'block';
    setTimeout(() => {
      this.overlay.style.opacity = '1';
    }, 10);

    // Start revealing first text
    this.revealCurrentText();
  }

  // Reveal current text character by character
  revealCurrentText() {
    const fullText = this.currentScene.texts[this.currentTextIndex];
    this.textRevealProgress = 0;
    this.textDisplay.textContent = '';

    const revealInterval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(revealInterval);
        return;
      }

      this.textRevealProgress += this.textRevealSpeed;
      const visibleText = fullText.substring(0, Math.floor(this.textRevealProgress));
      this.textDisplay.textContent = visibleText;

      if (this.textRevealProgress >= fullText.length) {
        clearInterval(revealInterval);
        this.showPrompt();
      }
    }, 30);
  }

  showPrompt() {
    this.prompt.style.opacity = '1';
    this.lastAdvanceTime = Date.now();
  }

  hidePrompt() {
    this.prompt.style.opacity = '0';
  }

  // Advance to next text or complete cutscene
  advance() {
    if (!this.isActive) return;

    // Prevent rapid advancing
    if (Date.now() - this.lastAdvanceTime < 300) return;
    this.lastAdvanceTime = Date.now();

    // If text is still revealing, show it all immediately
    const fullText = this.currentScene.texts[this.currentTextIndex];
    if (this.textRevealProgress < fullText.length) {
      this.textRevealProgress = fullText.length;
      this.textDisplay.textContent = fullText;
      this.showPrompt();
      return;
    }

    // Move to next text
    this.currentTextIndex++;

    if (this.currentTextIndex < this.currentScene.texts.length) {
      this.hidePrompt();
      setTimeout(() => {
        this.revealCurrentText();
      }, 200);
    } else {
      this.complete();
    }
  }

  // Complete the cutscene
  complete() {
    this.isActive = false;

    // Fade out
    this.overlay.style.opacity = '0';

    setTimeout(() => {
      this.overlay.style.display = 'none';
      if (this.onComplete) {
        this.onComplete();
      }
    }, 500);
  }

  // Skip cutscene entirely
  skip() {
    if (this.isActive) {
      this.complete();
    }
  }
}

