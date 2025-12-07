// Function to create explosion particles
function createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * 5 + 2; // Random speed
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;
        particles.push(new Particle(x, y, velocityX, velocityY, 1000, Math.random() * 10 + 5, 'rgba(255, 0, 0, 1)')); // Explosion particles
    }
}

// Function to create a random glow effect
function createGlowEffect(x, y) {
    const glowSize = Math.random() * 30 + 10; // Random glow size
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`; // Random opacity
    ctx.beginPath();
    ctx.arc(x, y, glowSize, 0, Math.PI * 2); // Draw glow
    ctx.fill();
}

// Function to create a screen flash effect
function createScreenFlash() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White flash
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Cover the entire screen
}

// Modify the existing collision detection to include explosions and screen flashes
function updateEnemyMobs() {
    for (let i = enemyMobs.length - 1; i >= 0; i--) {
        const mob = enemyMobs[i];
        mob.x += mob.velocityX * (mob.x < player.x ? 1 : -1); // Move towards the player

        // Randomly make the enemy jump
        mob.jumpTimer -= 16; // Approximate time step
        if (mob.jumpTimer <= 0) {
            mob.velocityY = -10; // Jump strength
            mob.jumpTimer = Math.random() * 4000 + 1000; // Reset jump timer
        }

        // Apply gravity to the enemy mob
        mob.velocityY += player.gravity; // Use player's gravity for consistency
        mob.y += mob.velocityY; // Move mob vertically

        // Collision with the floor (bottom of the screen)
        if (mob.y + mob.height >= canvas.height) {
            mob.y = canvas.height - mob.height; // Reset position to floor level
            mob.velocityY = 0; // Stop falling
            createDust(mob.x + mob.width / 2, mob.y + mob.height); // Create dust on collision
        }

        // Check for collision with player
        if (mob.x < player.x + player.width &&
            mob.x + mob.width > player.x &&
            mob.y < player.y + player.height &&
            mob.y + mob.height > player.y) {
            // Bounce player in a random direction with random speed
            const randomAngle = Math.random() * Math.PI * 2; // Random angle
            const randomSpeed = Math.random() * player.maxSpeed * 3; // Random speed up to 3 times max speed
            player.velocityX = randomSpeed * Math.cos(randomAngle);
            player.velocityY = randomSpeed * Math.sin(randomAngle);
            enemyMobs.splice(i, 1); // Remove the enemy mob on collision
            createSparks(mob.x + mob.width / 2, mob.y + mob.height); // Create sparks on bounce
            createExplosion(mob.x + mob.width / 2, mob.y + mob.height); // Create explosion effect
            createGlowEffect(mob.x + mob.width / 2, mob.y + mob.height); // Create glow effect
            createScreenFlash(); // Create screen flash on collision
        }

        // Remove enemy mob if it goes off the bottom of the screen
        if (mob.y > canvas.height) {
            enemyMobs.splice(i, 1);
        }
    }
}

// Update and draw particles in the game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Existing game logic...

    updateParticles(); // Update particles
    drawParticles(); // Draw particles

    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();