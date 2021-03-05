let snowflakes = []; // array to hold snowflake objects
let score = 0;
let mouse_radius = 5;
let mouse_current_radius = mouse_radius;
let space_timer = 0;

function setup() {
  createCanvas(800, 600);
  fill(240);
  textSize(18);
  noStroke();
}

function draw() {
  background('brown');
  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(5); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }

  fill(0);
  if (space_timer == 0)
    mouse_current_radius = mouse_radius;
  else {
    mouse_current_radius = (mouse_radius+space_timer);
    space_timer--;
  }
  ellipse(mouseX, mouseY, mouse_current_radius*2, mouse_current_radius*2);

  let _score = "Score: " + score;
  fill(50);
  text(_score, 5, 20);

  fill(240);
}

function keyReleased() {
  if (keyCode == 32) {
    space_timer = 50;
  }
}

// snowflake class
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 5);

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // x position follows a circle
    let w = 0.6; // angular speed
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if ((this.posY > height) || (this.collide(mouseX, mouseY))) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.collide = function(mx, my) {
    let retval = false;
    let _r = 2;

    // https://stackoverflow.com/questions/1736734/circle-circle-collision
    //(x2-x1)^2 + (y1-y2)^2 <= (r1+r2)^2

    let _left  = Math.pow(mx-this.posX, 2) + Math.pow(this.posY-my, 2);
    let _right = Math.pow(_r + mouse_current_radius, 2);
    if (_left <= _right) {
      retval = true;
      score++;
    }

    return retval;
  }

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
  };
}