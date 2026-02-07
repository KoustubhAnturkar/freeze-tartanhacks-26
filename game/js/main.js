// Main entry point - loads all game modules in correct order

// Load configuration
document.write('<script src="js/config.js"></script>');

// Load level data
document.write('<script src="js/levels.js"></script>');

// Load sound manager
document.write('<script src="js/sound.js"></script>');

// Load game classes
document.write('<script src="js/player.js"></script>');
document.write('<script src="js/renderer.js"></script>');
document.write('<script src="js/input.js"></script>');
document.write('<script src="js/gameState.js"></script>');

// Load main game controller (this starts the game)
document.write('<script src="js/game.js"></script>');
