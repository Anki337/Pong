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
const baseline_speed = 2;
let x_velocity = baseline_speed;
let y_velocity = x_velocity;
let computer_speed = 2;

// make variables to hold player & computer scores:
let player1_score = 0;
let computer_score = 0;

// Set a win or loose criteria and a reset game bool for handling wins and replays:
const winning_score = 2000;
let game_over = false;

// Reset_ball()
function reset_ball() {
  //Reset ball position after scoring:
  ball_x = game_plan.width / 2;
  ball_y = game_plan.height / 2;
  x_velocity = baseline_speed * (Math.random() > 0.5 ? 1 : -1);
  y_velocity = baseline_speed * (Math.random() > 0.5 ? 1 : -1);
}
// Bounce_ball()
function bounce_ball() {
  // Calculate next position of the ball
  let next_ball_x = ball_x + x_velocity;
  let next_ball_y = ball_y + y_velocity;
  // Bounce ball off the top of the screen:
  if (next_ball_y - ball_size / 2 <= 0 && y_velocity < 0) {
    y_velocity = -y_velocity;
    next_ball_y = ball_size / 2; // Adjust to prevent clipping
  }
  // Bounce ball off the bottom of the screen:
  if (next_ball_y + ball_size / 2 >= game_plan.height && y_velocity > 0) {
    y_velocity = -y_velocity;
    next_ball_y = game_plan.height - ball_size / 2; // Adjust to prevent clipping
  }
  // Check collision with the left side (player paddle):
  if (next_ball_x - ball_size / 2 <= paddle_thickness) {
    if (
      next_ball_y >= player_paddle_y &&
      next_ball_y <= player_paddle_y + paddle_height
    ) {
      x_velocity = -x_velocity;
      next_ball_x = paddle_thickness + ball_size / 2; // Adjust to prevent clipping
      console.log(x_velocity, y_velocity);
    } else {
      computer_score++;
      reset_ball();
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
      next_ball_x = game_plan.width - paddle_thickness - ball_size / 2; // Adjust to prevent clipping
    } else {
      player1_score++;
      reset_ball();
      return; // Ensure we exit early after resetting the ball
    }
  }
  // Update ball position with corrected next positions
  ball_x = next_ball_x;
  ball_y = next_ball_y;
}
// Move_ball()
function move_ball() {
  // Clear previous projectile
  context.clearRect(
    ball_x - ball_size / 2 - Math.abs(x_velocity),
    ball_y - ball_size / 2 - Math.abs(y_velocity),
    ball_size + Math.abs(x_velocity) * 2,
    ball_size + Math.abs(x_velocity) * 2
  );
  // Call the bounce_ball function with ball collision logic from here keeping it in one place.
  bounce_ball();
  // Re-draw the projectile
  context.fillRect(
    ball_x - ball_size / 2,
    ball_y - ball_size / 2,
    ball_size,
    ball_size
  );
}
// Computer_paddle()
function computer_paddle() {
  // Decide the color
  context.fillStyle = "rgba(240, 247, 21)";
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
function player_paddle() {
  // clear it before update:
  context.clearRect(0, player_paddle_y, paddle_thickness, paddle_height);
  // Update the paddle position:
  player_paddle_y = Math.max(
    0,
    Math.min(game_plan.height - paddle_height, mouseY - paddle_height / 2)
  );
  // Re-Draw the paddle1_y
  context.fillRect(0, player_paddle_y, paddle_thickness, paddle_height);
}

// Rendering the game:
function setup_gameplan() {
  //Set canvas background:
  const my_background = new Image();
  my_background.src = "./Images/Pong.jpg";

  my_background.onload = () => {
    context.drawImage(my_background, 0, 0);
  };

  // Set text color
  context.fillStyle = "rgba(240, 247, 21)";
  // Add Score board boxes
  context.fillRect(90, game_plan.height - 95, 40, 40);
  context.fillRect(game_plan.width - 110, 65, 40, 40);

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
function winner() {
  if (player1_score == winning_score || computer_score == winning_score) {
    game_over = true;
    cancelAnimationFrame(animationid);

    context.fillStyle = "rgba(240, 247, 21)";
    context.font = "48px serif";
    context.fillText(
      "End of Game",
      game_plan.width / 2 - game_plan.width / 6,
      game_plan.height / 2
    );
    if (player1_score === winning_score) {
      context.font = "24px serif";
      context.fillText(
        "You won!",
        game_plan.width / 2 - game_plan.width / 14,
        game_plan.height / 2 + 25
      );
    }
    if (computer_score === winning_score) {
      context.font = "24px serif";
      context.fillText(
        "The AI won!",
        game_plan.width / 2 - game_plan.width / 14,
        game_plan.height / 2 + 25
      );
    }
  }
}
// Setup the gameloop:
function gameloop() {
  if (!game_over) {
    setup_gameplan();
    computer_paddle();
    player_paddle();
    move_ball();
    winner();

    animationid = requestAnimationFrame(gameloop);
  }
}
// Run the game.
gameloop();
