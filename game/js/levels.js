// Level definitions
// Each level has platforms (where player can stand) and a goal (where player needs to reach)
const LEVELS = {
  platformsAndGoals: [
    // Testing level - simple platform and goal
    //Level 1 - Introduction
    {
      platforms: [
        { x: 0, y: 200, w: 200, h: 50 },
        { x: 250, y: 400, w: 150, h: 20, hasIcicles: true },
        { x: 450, y: 320, w: 120, h: 20, hasIcicles: true },
        { x: 620, y: 200, w: 180, h: 50, hasIcicles: true },
      ],
      goal: { x: 680, y: 130, w: 35, h: 35 },
      collectibles: [
        { x: 270, y: 360, w: 20, h: 20 },
        { x: 480, y: 280, w: 20, h: 20 },
      ],
    },

    // Level 2 - Stepping up
    {
      platforms: [
        { x: 0, y: 200, w: 200, h: 50 },
        { x: 200, y: 580, w: 450, h: 20, hasIcicles: true },
        { x: 395, y: 0, w: 10, h: 500, hasIcicles: true },
        { x: 405, y: 480, w: 100, h: 20, hasIcicles: true },
        { x: 550, y: 380, w: 100, h: 20, hasIcicles: true },
        { x: 405, y: 280, w: 100, h: 20, hasIcicles: true },
        { x: 650, y: 250, w: 10, h: 350, hasIcicles: true },
        { x: 650, y: 200, w: 150, h: 50 },
      ],
      goal: { x: 700, y: 130, w: 35, h: 35 },
      collectibles: [
        { x: 435, y: 450, w: 20, h: 20 },
        { x: 580, y: 350, w: 20, h: 20 },
        { x: 435, y: 250, w: 20, h: 20 },
      ],
    },

    // Level 3 - Icicle Danger Zone
    {
      platforms: [
        { x: 0, y: 200, w: 150, h: 50 },
        { x: 200, y: 350, w: 120, h: 20, hasIcicles: true },
        { x: 370, y: 280, w: 100, h: 20, hasIcicles: true },
        { x: 520, y: 400, w: 100, h: 20, hasIcicles: true },
        { x: 370, y: 480, w: 100, h: 20, hasIcicles: true },
        { x: 650, y: 300, w: 150, h: 50, hasIcicles: true },
      ],
      goal: { x: 690, y: 230, w: 35, h: 35 },
      collectibles: [
        { x: 230, y: 310, w: 20, h: 20 },
        { x: 550, y: 360, w: 20, h: 20 },
      ],
      icicles: [
        // Icicles hanging from ceiling - avoid these!
        { x: 180, y: 0, w: 20, h: 60 }, // Above first gap
        { x: 340, y: 0, w: 25, h: 80 }, // Above second platform
        { x: 490, y: 0, w: 20, h: 70 }, // Between platforms
        { x: 600, y: 0, w: 30, h: 90 }, // Before final platform
        { x: 250, y: 0, w: 18, h: 50 }, // Extra danger
        { x: 420, y: 0, w: 22, h: 65 }, // Extra danger
      ],
      polarBears: [
        // Polar bears that patrol horizontally - avoid these!
        { x: 200, y: 310, w: 40, h: 35, minX: 200, maxX: 280, speed: 1 }, // On second platform
        { x: 520, y: 360, w: 40, h: 35, minX: 520, maxX: 600, speed: 1 }, // On fourth platform
      ],
    },

    // Level 4 - Icicle Gauntlet (HARD - Heavy Icicle Focus)
    {
      platforms: [
        { x: 0, y: 250, w: 140, h: 50 },              // Starting platform - wider
        { x: 170, y: 470, w: 100, h: 20, hasIcicles: true },  // First jump
        { x: 310, y: 400, w: 70, h: 20, hasIcicles: true },   // Second platform
        { x: 170, y: 330, w: 100, h: 20, hasIcicles: true },  // Zigzag back
        { x: 310, y: 230, w: 90, h: 20, hasIcicles: true },   // Zigzag forward
        { x: 440, y: 350, w: 110, h: 20, hasIcicles: true },  // Mid section
        { x: 600, y: 280, w: 100, h: 20, hasIcicles: true },  // Upper right
        { x: 440, y: 210, w: 100, h: 20, hasIcicles: true },  // Back left high
        { x: 700, y: 250, w: 100, h: 50 },             // Final safe platform
      ],
      goal: { x: 730, y: 180, w: 35, h: 35 },
      collectibles: [
        { x: 330, y: 360, w: 20, h: 20 },  // On second platform
        { x: 600, y: 240, w: 20, h: 20 },  // Upper right
        { x: 460, y: 170, w: 20, h: 20 },  // High platform
      ],
      icicles: [
        // Strategic icicle placement - challenging but fair
        { x: 150, y: 0, w: 22, h: 70 },   // Above first jump
        { x: 195, y: 0, w: 20, h: 65 },   // Over platform
        { x: 240, y: 0, w: 18, h: 60 },   // Gap coverage
        { x: 290, y: 0, w: 24, h: 80 },   // Above second platform
        { x: 335, y: 0, w: 20, h: 70 },   // Platform edge
        { x: 160, y: 0, w: 20, h: 68 },   // Over zigzag back
        { x: 210, y: 0, w: 22, h: 75 },   // Coverage
        { x: 280, y: 0, w: 25, h: 85 },   // Above fourth platform
        { x: 325, y: 0, w: 20, h: 72 },   // Platform edge
        { x: 380, y: 0, w: 26, h: 90 },   // Large icicle
        { x: 420, y: 0, w: 22, h: 75 },   // Over mid platform
        { x: 470, y: 0, w: 24, h: 82 },   // Mid coverage
        { x: 520, y: 0, w: 20, h: 70 },   // Gap to upper right
        { x: 560, y: 0, w: 28, h: 95 },   // Big icicle - requires timing
        { x: 610, y: 0, w: 22, h: 78 },   // Over upper platform
        { x: 410, y: 0, w: 20, h: 68 },   // Over back platform
        { x: 455, y: 0, w: 23, h: 80 },   // High platform coverage
        { x: 500, y: 0, w: 21, h: 75 },   // More obstacles
        { x: 650, y: 0, w: 24, h: 85 },   // Before final platform
        { x: 360, y: 0, w: 20, h: 72 },   // Fill gap
      ],
    },
  ],
  walls: [
    { x: 0, y: 0, w: 800, h: 20 }, // Top wall
    { x: 0, y: 0, w: 0, h: 600 }, // Left wall
    { x: 800, y: 0, w: 0, h: 600 }, // Right wall
  ],
};