/* Pong Game Logic */

// Global variables:

// Canvas id=gp eventlistener:
// Get the canvas:
const game_plan = document.getElementById("gp");
// Get the context variable to draw the elements on the canvas:
const context = game_plan.getContext("2d");
// Create a function that listens for mouseover on the canvas:
let mouseY;
game_plan.addEventListener("mousemove", function (e) {
  // Get a boundary for the rect around the canvas so it doesn't escape the game_plan:
  const rect = game_plan.getBoundingClientRect();
  // Calculate mouseposition relative to the top we can use that to calculate where the paddle1_y should be relative to the mouseY value:
  mouseY = e.clientY - rect.top;
});

// Set global animationid variable:
let animationid;
// Set paddle positions:
let paddle1_y = 40;
let paddle2_y = 40;

// Set paddle sizes on screen:
let paddle_thickness = 10;
let paddle_height = 100;

// set the ball position:
let ball_x = 50;
let ball_y = 50;

// set the ball dimension:
let ball_size = 20;

//set speed variables:
let x_velocity = 4;
let y_velocity = x_velocity;
let computer_speed = 3;

// make variables to hold player & computer scores:
let player1_score = 0;
let computer_score = 0;

// Set a win or loose criteria and a reset game bool for handling wins and replays:
const winning_score = 2;
let game_over = false;

// Reset_ball()
function reset_ball() {
  //Reset ball position after scoring:
  ball_x = game_plan.width / 2;
  ball_y = game_plan.height / 2;
  x_velocity = -x_velocity;
  y_velocity = 5;
}
// Move_ball()
function move_ball() {
  ball_x += x_velocity;
  ball_y += y_velocity;
}
// Computer_paddle()
function computer_paddle() {
  //Move ai paddle up or down based on the "y" value of the ball.
  if (paddle2_y + paddle_height / 2 < ball_y) {
    paddle2_y += computer_speed;
  } else {
    paddle2_y -= computer_speed;
  }
}
function updatePaddle1Position() {
  // Update the paddle position:
  paddle1_y = Math.max(
    0,
    Math.min(game_plan.height - paddle_height, mouseY - paddle_height / 2)
  );
}
// Bounce_ball()
function bounce_ball() {
  // Bounce ball of top of the screen:
  if (ball_y < 0 && y_velocity < 0) {
    y_velocity = -y_velocity;
  }
  // Bounce ball of bottom of the screen:
  if (ball_y > game_plan.height && y_velocity > 0) {
    y_velocity = -y_velocity;
  }
  // Bounce ball of the left side (where) there is a paddle:
  if (ball_x < 0) {
    // if a ball is smaller than 0, meaning on the left side and its Y coordinate is smaller than paddle1 "Y" pos + it's height, it's a collision.
    if (ball_y > 0 && ball_y < paddle1_y + paddle_height) {
      // Reverse the Y vector of the ball since it has hit a paddle and stopped.
      x_velocity = -x_velocity;
      // Has the ball hit (upper - middle - bottom) of the paddle? positive value delta_y = top, 0 = middle, negative delta_y value = bottom.
      delta_y = ball_y - (paddle1_y + paddle_height / 2);
      // Slightly change the direction of the ball.
      y_velocity = delta_y * Math.random();
    } else {
      computer_score++;
      reset_ball();
    }
  }
  // Bounce the ball of the right side (where) there is a paddle:
  if (ball_x > game_plan.width) {
    if (ball_y > paddle2_y && ball_y < paddle2_y + paddle_height) {
      // Stop and change x direction <-- since its a hit.
      x_velocity = -x_velocity;
      // Has the ball hit (upper - middle - bottom) of the paddle? positive value delta_y = top, 0 = middle, negative delta_y value = bottom.
      delta_y = ball_y - (paddle1_y + paddle_height / 2);
      // Slightly change the direction of the ball.
      y_velocity = delta_y * Math.random();
    } else {
      player1_score++;
      reset_ball();
    }
  }
}

// Rendering the game:
function setup_gameplan() {
  //fill in the canvas with objects
  // Set canvas background:
  const my_background = new Image();
  my_background.src = "./Images/Pong.jpg";

  my_background.onload = () => {
    context.drawImage(my_background, 0, 0);
  };

  // Add the paddles' color
  context.fillStyle = "yellow";

  // Add paddle 1
  context.fillRect(0, paddle1_y, paddle_thickness, paddle_height);

  // Add paddle 2
  context.fillRect(
    game_plan.width - paddle_thickness,
    paddle2_y,
    paddle_thickness,
    paddle_height
  );

  // Draw the ball
  context.fillRect(
    ball_x - ball_size / 2,
    ball_y - ball_size / 2,
    ball_size,
    ball_size
  );

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

function winner() {
  if (player1_score == winning_score || computer_score == winning_score) {
    game_over = true;

    cancelAnimationFrame(animationid);

    context.clearRect(0, 0, game_plan.width, game_plan.height);

    context.fillStyle = "Green";
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
    move_ball();
    updatePaddle1Position();
    computer_paddle();
    bounce_ball();
    winner();
    animationid = requestAnimationFrame(gameloop);
  }
}
// Run the game.
gameloop();
