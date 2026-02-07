// Level definitions
// Each level has platforms (where player can stand) and a goal (where player needs to reach)
const LEVELS = [
  // Level 1 - Introduction
  {
    platforms: [
      { x: 0, y: 550, w: 200, h: 50 },
      { x: 250, y: 480, w: 150, h: 20 },
      { x: 450, y: 420, w: 120, h: 20 },
      { x: 620, y: 480, w: 180, h: 50 }
    ],
    goal: { x: 680, y: 420, w: 35, h: 35 }
  },
  
  // Level 2 - Stepping up
  {
    platforms: [
      { x: 0, y: 550, w: 150, h: 50 },
      { x: 200, y: 460, w: 100, h: 20 },
      { x: 350, y: 500, w: 100, h: 20 },
      { x: 500, y: 420, w: 100, h: 20 },
      { x: 650, y: 360, w: 150, h: 50 }
    ],
    goal: { x: 700, y: 295, w: 35, h: 35 }
  },
  
  // Level 3 - Zigzag
  {
    platforms: [
      { x: 0, y: 550, w: 120, h: 50 },
      { x: 170, y: 470, w: 80, h: 20 },
      { x: 300, y: 400, w: 80, h: 20 },
      { x: 430, y: 470, w: 80, h: 20 },
      { x: 560, y: 400, w: 80, h: 20 },
      { x: 690, y: 320, w: 110, h: 50 }
    ],
    goal: { x: 720, y: 255, w: 35, h: 35 }
  },
  
  // Level 4 - Complex jumps
  {
    platforms: [
      { x: 0, y: 550, w: 100, h: 50 },
      { x: 140, y: 480, w: 90, h: 20 },
      { x: 270, y: 410, w: 70, h: 20 },
      { x: 380, y: 480, w: 80, h: 20 },
      { x: 500, y: 400, w: 90, h: 20 },
      { x: 630, y: 470, w: 80, h: 20 },
      { x: 350, y: 300, w: 100, h: 20 },
      { x: 500, y: 230, w: 150, h: 50 }
    ],
    goal: { x: 550, y: 165, w: 35, h: 35 }
  },
  
  // Level 5 - Final challenge
  {
    platforms: [
      { x: 0, y: 550, w: 100, h: 50 },
      { x: 130, y: 460, w: 70, h: 20 },
      { x: 230, y: 500, w: 70, h: 20 },
      { x: 330, y: 420, w: 70, h: 20 },
      { x: 430, y: 480, w: 70, h: 20 },
      { x: 530, y: 400, w: 70, h: 20 },
      { x: 630, y: 460, w: 70, h: 20 },
      { x: 250, y: 320, w: 80, h: 20 },
      { x: 400, y: 260, w: 80, h: 20 },
      { x: 550, y: 200, w: 120, h: 50 }
    ],
    goal: { x: 585, y: 135, w: 35, h: 35 }
  }
];
