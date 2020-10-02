const ROLL_STATE = 0;
const MOVE_STATE = 1;
const SNADDER_STATE = 2;
let state = ROLL_STATE;


let tiles = [];

let player;

let rolls = [];
let index = 0;
let averageRolls = 0;
let avgP;

function setup() {
  createCanvas(400, 400);
  avgP = createP('');

  rolls[index] = 0;

  let resolution = 40;
  let cols = width / resolution;
  let rows = height / resolution;


  let x = 0;
  let y = (rows - 1) * resolution;
  let dir = 1;
  for (let i = 0; i < cols * rows; i++) {
    let tile = new Tile(x, y, resolution, i, i + 1);
    tiles.push(tile);
    x = x + resolution * dir;

    if (x >= width || x <= -resolution) {
      dir *= -1;
      x += resolution * dir;
      y -= resolution;
    }
  }


  for (let i = 0; i < 3; i++) {
    let index = floor(random(cols, tiles.length - 1));

    tiles[index].snadder = -1 * floor(random(index % cols, index - 1));
  }


  for (let i = 0; i < 3; i++) {
    let index = floor(random(0, tiles.length - cols));
    tiles[index].snadder = floor(
      random(cols - (index % cols), tiles.length - index - 1)
    );
  }


  player = new Player();
}

function draw() {
  frameRate(5);
  background(51);


  for (let tile of tiles) {
    tile.show();
  }
  for (let tile of tiles) {
    tile.showSnadders();
  }


  if (state === ROLL_STATE) {
    player.rollDie();
    rolls[index]++;
    player.showPreview();
    state = MOVE_STATE;

  } else if (state === MOVE_STATE) {
    player.move();
    if (player.isSnadder()) {
      state = SNADDER_STATE;
    } else {
      state = ROLL_STATE;
    }

  } else if (state === SNADDER_STATE) {
    player.moveSnadder();
    state = ROLL_STATE;
  }

  player.show();

  if (player.spot >= tiles.length - 1) {
    state = ROLL_STATE;
    player.reset();
    index++;
    rolls[index] = 0;
  }

  let sum = 0;
  for (let i = 0; i < rolls.length - 1; i++) {
    sum += rolls[i];
  }
  let avg = sum / (rolls.length - 1);
  if (avg) {
    avgP.html(avg);
  }
}
