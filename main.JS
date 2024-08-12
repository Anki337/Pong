/* Pong Game Logic */

// Global variables:

// Canvas id=gp eventlistener:
// Get the canvas:
const game_plan = document.getElementById("gp");
// Get the context variable to draw the elements on the canvas:
const context = game_plan.getContext("2d");
// Global mouse variable.
let mouseY;
// Create a function that listens for mouseover on the canvas:
game_plan.addEventListener("mousemove", function (e) {
  // Get a boundary for the rect around the canvas so it doesn't escape the game_plan:
  const rect = game_plan.getBoundingClientRect();
  // Calculate mouseposition relative to the top we can use that to calculate where the paddle1_y should be relative to the mouseY value:
  mouseY = e.clientY - rect.top;
});

// Set global animationid variable:
let animationid;

// Hit-counter to keep track of hits to increase game speed.
let hit_counter = 0;
// Power_up-counter to keep track of power-ups stages and effects.
let power_up = 0;
// Crazy_mode switch:
let crazy_mode = false;

// Crazy mode power ups window of placement:
const canvasWidth = game_plan.width;
const canvasHeight = game_plan.height;

// Set paddle positions:
let player_paddle_y = 40;
let computer_paddle_y = 40;

// Set paddle sizes on screen:
let paddle_thickness = 10;
let paddle_height = 100;

// set the ball position:
let ball_x = 50;
let ball_y = 50;

// set the ball dimension:
let ball_size = 20;

//set speed variables:
let baseline_speed = 2;
let x_velocity = baseline_speed;
let y_velocity = x_velocity;
let computer_speed = 1.815;

// make variables to hold player & computer scores:
let player1_score = 0;
let computer_score = 0;

// Set a win or loose criteria and a reset game bool for handling wins and replays:
const winning_score = 5;
let game_over = false;

// Set up background:
function setBackground() {
  const my_background = new Image();
  my_background.src = "./Images/Pong.jpg";

  my_background.onload = () => {
    context.drawImage(my_background, 0, 0);
  };
}

// Array of power_up Rects that will interact with the ball if hit x10.
const power_up_arr = [
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
  { width: ball_size, height: ball_size, isActive: false },
];

// Make the ball round:
function drawBall(x, y, radius) {
  context.beginPath(); // Start a new path (to avoid connecting with other drawings)
  context.arc(x, y, radius, 0, Math.PI * 2); // Draw the circle using arc method
  context.fillStyle = "rgba(167, 2, 152, 1)";
  context.fill(); // Fill the circle with the specified color
  context.closePath(); // Close the path
}
// Clear a round area instead of square, via saving context , removing and restoring from the save.
function clearBall(x, y, radius) {
  // Save the current context state
  context.save();

  // Create a circular clipping path
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.clip();

  // Clear the circular area
  context.clearRect(x - radius, y - radius, radius * 2, radius * 2);

  // Restore the original context state
  context.restore();
}
// Reset_ball()
function resetBall() {
  //Reset ball position after scoring:
  ball_x = game_plan.width / 2;
  ball_y = game_plan.height / 2;
  baseline_speed = 2;
  power_up = 0;
  hit_counter = 0;
  computer_speed = 1.815;
  crazy_mode = false;
  x_velocity = baseline_speed * (Math.random() > 0.5 ? 1 : -1);
  y_velocity = baseline_speed * (Math.random() > 0.5 ? 1 : -1);
  console.log("Hit Counter reset to ", hit_counter);
}
// Bounce_ball()
function bounceBall() {
  // Calculate next position of the ball
  let next_ball_x = ball_x + x_velocity;
  let next_ball_y = ball_y + y_velocity;
  // Bounce ball off the top of the screen:
  if (next_ball_y - ball_size / 2 <= 0 && y_velocity < 0) {
    y_velocity = -y_velocity;
    next_ball_y = ball_size / 2; // Adjustment to prevent clipping
  }
  // Bounce ball off the bottom of the screen:
  if (next_ball_y + ball_size / 2 >= game_plan.height && y_velocity > 0) {
    y_velocity = -y_velocity;
    next_ball_y = game_plan.height - ball_size / 2; // Adjustment to prevent clipping
  }
  // Check collision with the left side (player paddle):
  if (next_ball_x - ball_size / 2 <= paddle_thickness) {
    if (
      next_ball_y >= player_paddle_y &&
      next_ball_y <= player_paddle_y + paddle_height
    ) {
      x_velocity = -x_velocity;
      next_ball_x = paddle_thickness + ball_size / 2; // Adjustment to prevent clipping
      ++hit_counter;
      console.log(hit_counter);
    } else {
      computer_score++;
      resetBall();
      return; // Ensure we exit early after resetting the ball
    }
  }
  // Check collision with the right side (computer paddle):
  if (next_ball_x + ball_size / 2 >= game_plan.width - paddle_thickness) {
    if (
      next_ball_y >= computer_paddle_y &&
      next_ball_y <= computer_paddle_y + paddle_height
    ) {
      x_velocity = -x_velocity;
      next_ball_x = game_plan.width - paddle_thickness - ball_size / 2; // Adjustment to prevent clipping
      ++hit_counter;
      console.log(hit_counter);
    } else {
      player1_score++;
      resetBall();
      return; // Ensure we exit early after resetting the ball
    }
  }
  // Update ball position with corrected next positions
  ball_x = next_ball_x;
  ball_y = next_ball_y;
}
// Move_ball()
function moveBall() {
  // Clear previous projectile
  clearBall(ball_x, ball_y, ball_size / 2);
  // Call the bounceBall function with ball collision logic from here keeping it in one place.
  bounceBall();
  // incrementSpeed()
  incrementSpeed();
  // Re-draw the projectile
  drawBall(ball_x, ball_y, ball_size / 2);
}
// Increment_speed of the x_velocity and computer_speed.
function incrementSpeed() {
  if (hit_counter == 2 && power_up == 0) {
    x_velocity += x_velocity > 0 ? 1 : -1;
    console.log(
      "Speed Incremented by: 1 and is now at: ",
      x_velocity,
      "Because you made: ",
      hit_counter,
      "consecutive hits!",
      "Power up is at level: ",
      power_up
    );
    power_up++;
  }
  if (hit_counter == 5 && power_up == 1) {
    x_velocity += x_velocity > 0 ? 1 : -1;
    computer_speed += 0.050;
    console.log(
      "Speed Incremented by: 1 and is now at: ",
      x_velocity,
      "Because you made: ",
      hit_counter,
      "consecutive hits!",
      "Power up is at level: ",
      power_up
    );
    power_up++;
  }
  if (hit_counter == 7 && power_up == 2) {
    x_velocity += x_velocity > 0 ? 1 : -1;
    console.log(
      "Speed Incremented by: 1 and is now at: ",
      x_velocity,
      "Because you made: ",
      hit_counter,
      "consecutive hits!",
      "Power up is at level: ",
      power_up
    );
    power_up++;
  }
  if (hit_counter == 9 && power_up == 3) {
    x_velocity += x_velocity > 0 ? 1 : -1;
    console.log(
      "Speed Incremented by: 1 and is now at: ",
      x_velocity,
      "Because you made: ",
      hit_counter,
      "consecutive hits!",
      "Power up is at level: ",
      power_up
    );
    power_up++;
  }
  if (hit_counter == 11 && power_up == 4) {
    x_velocity += x_velocity > 0 ? 1 : -1;
    computer_speed += 0.5;
    console.log(
      "Speed Incremented by: 1 and is now at: ",
      x_velocity,
      "Because you made: ",
      hit_counter,
      "consecutive hits!",
      "Power up is at level: ",
      power_up,
      "Computer speed power up by: ",
      computer_speed
    );
    power_up++;
  }
  if (hit_counter == 20 && power_up == 5) {
    x_velocity += x_velocity > 0 ? 4 : -4;
    computer_speed += computer_speed + 1;
    power_up++;
  }
}
// Function to get a random position within the constraints
function getRandomPosition(rectWidth, rectHeight) {
  const xMargin = 300; // Margin from the left and right sides of the screen
  const yMargin = 25; // Margin from the top and bottom sides of the screen

  const minX = xMargin; // Minimum x position
  const maxX = 1280 - rectWidth - xMargin; // Maximum x position

  const minY = yMargin; // Minimum y position
  const maxY = 720 - rectHeight - yMargin; // Maximum y position

  const randomX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const randomY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  return { x: randomX, y: randomY };
}
// Spawns yellow rects from an array in a for loop with length of power_up_arr, starting with same rect as ball to begin with.
function spawnPowerUps(power_up_arr) {
  if (!game_over) {
    if (power_up === 5 && crazy_mode == false) {
      power_up_arr.forEach((power_up, i) => {
        setTimeout(() => {
          const position = getRandomPosition(power_up.width, power_up.height);
          power_up.x = position.x;
          power_up.y = position.y;
          power_up.isActive = true; // Activate power-up
          console.log("Power-up spawned at:", position);
        }, i * 2000); // 2 seconds delay between spawning each power-up
      });
      crazy_mode = true;
    }
  }
}
function drawPowerUps(power_up_arr) {
  power_up_arr.forEach((power_up) => {
    if (power_up.isActive) {
      context.fillStyle = "green";
      drawBall(power_up.x, power_up.y, power_up.width / 2); // Draw power-up using ball size
    }
  });
}
// Checking for powerUp Collision and changing by delta * 0.3
function checkPowerUpCollision(power_up_arr) {
  power_up_arr.forEach((power_up) => {
    if (power_up.isActive) {
      const distance = Math.sqrt(
        (ball_x - power_up.x) ** 2 + (ball_y - power_up.y) ** 2
      );
      if (distance < ball_size / 2 + power_up.width / 2) {
        // Handle power-up collision
        power_up.isActive = false; // Deactivate power-up
        // Change ball velocity
        x_velocity = -x_velocity;
      }
    }
  });
}
// Computer_paddle()
function computerPaddle() {
  // Decide the color
  context.fillStyle = "rgba(235, 62, 62, 1)";
  // Clear the previous rect for smooth movement
  context.clearRect(
    game_plan.width - paddle_thickness,
    computer_paddle_y,
    paddle_thickness,
    paddle_height
  );
  //Move ai paddle up or down based on the "y" value of the ball.
  if (computer_paddle_y + paddle_height / 2 < ball_y) {
    computer_paddle_y += computer_speed;
  } else {
    computer_paddle_y -= computer_speed;
  }
  // Re-draw it after each If-check to make it look smooth.
  context.fillRect(
    game_plan.width - paddle_thickness,
    computer_paddle_y,
    paddle_thickness,
    paddle_height
  );
}

// Function to update the pos of player paddle.
function playerPaddle() {
  // clear it before update:
  context.clearRect(0, player_paddle_y, paddle_thickness, paddle_height);
  // Update the paddle position:
  player_paddle_y = Math.max(
    0,
    Math.min(game_plan.height - paddle_height, mouseY - paddle_height / 2)
  );
  // Re-Draw the paddle1_y
  context.fillStyle = "rgba(70, 230, 88, 1)";
  context.fillRect(0, player_paddle_y, paddle_thickness, paddle_height);
}

// Rendering the game:
function setupGamefield() {
  // Set text color
  context.fillStyle = "rgba(240, 247, 21)";
  // Add Score board boxes
  context.fillRect(90, game_plan.height - 95, 40, 40);
  context.fillRect(game_plan.width - 110, 65, 40, 40);

  // Add the middle line
  context.fillRect(game_plan.width / 2, -1, 2, game_plan.height + 1);

  // Add the score text
  context.font = "18px serif";
  context.fillText("Your Score", 70, game_plan.height - 40);
  context.fillText("AI Score", game_plan.width - 120, 60);
  context.fillStyle = "gray";
  context.font = "34px serif";
  context.fillText(player1_score, 93, game_plan.height - 60);
  context.fillText(computer_score, game_plan.width - 107, 100);
}

// End-Screen.
function winnerScreen() {
  if (player1_score == winning_score || computer_score == winning_score) {
    game_over = true;
    context.fillStyle = "rgba(240, 247, 21)";
    context.font = "48px serif";
    context.fillText(
      "End of Game",
      game_plan.width / 2 - game_plan.width / 9,
      game_plan.height / 2
    );
    if (player1_score === winning_score) {
      context.font = "24px serif";
      context.fillText(
        "You won!",
        game_plan.width / 2 - game_plan.width / 16,
        game_plan.height / 2 + 25
      );
    }
    if (computer_score === winning_score) {
      context.font = "24px serif";
      context.fillText(
        "The AI won!",
        game_plan.width / 2 - game_plan.width / 16,
        game_plan.height / 2 + 25
      );
    }
    cancelAnimationFrame(animationid);
  }
}
// Setup the gameloop:
function gameloop() {
  if (!game_over) {
    setBackground();
    setupGamefield();
    spawnPowerUps(power_up_arr);
    drawPowerUps(power_up_arr);
    checkPowerUpCollision(power_up_arr);
    computerPaddle();
    playerPaddle();
    moveBall();
    winnerScreen();
    animationid = requestAnimationFrame(gameloop);
  } else {
    winnerScreen();
  }
}
// Run the game.
gameloop();
