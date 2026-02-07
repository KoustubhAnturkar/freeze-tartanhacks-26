// Level definitions
// Each level has platforms (where player can stand) and a goal (where player needs to reach)
const LEVELS = {
    platformsAndGoals: [
        // Testing level - simple platform and goal
        // Level 1 - Introduction
        {
            platforms: [
                {x: 0, y: 200, w: 200, h: 50},
                {x: 250, y: 400, w: 150, h: 20},
                {x: 450, y: 320, w: 120, h: 20},
                {x: 620, y: 200, w: 180, h: 50}
            ],
            goal: {x: 680, y: 130, w: 35, h: 35},
            collectibles: [
                {x: 270, y: 360, w: 20, h: 20},
                {x: 480, y: 280, w: 20, h: 20}
            ]
        },

        // Level 2 - Stepping up
        {
            platforms: [
                {x: 0, y: 200, w: 200, h: 50},
                {x: 200, y: 580, w: 450, h: 20},
                {x: 395, y: 0, w: 10, h: 500},
                {x: 405, y: 480, w: 100, h: 20},
                {x: 550, y: 380, w: 100, h: 20},
                {x: 405, y: 280, w: 100, h: 20},
                {x: 650, y: 250, w: 10, h: 350},
                {x: 650, y: 200, w: 150, h: 50}
            ],
            goal: {x: 700, y: 130, w: 35, h: 35},
            collectibles: [
                {x: 435, y: 450, w:20, h: 20},
                {x: 580, y: 350, w:20, h: 20},
                {x: 435, y: 250, w:20, h: 20},
            ]
        },
    ],
    walls: [
        {x: 0, y: 0, w: 800, h: 20}, // Top wall
        {x: 0, y: 0, w: 0, h: 600}, // Left wall
        {x: 800, y: 0, w: 0, h: 600} // Right wall
    ]
};
