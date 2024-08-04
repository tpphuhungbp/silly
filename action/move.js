import { Types } from "../constant.js";

const currentLocation = { x: 0, y: 0 };

const Direction = {
  LEFT: "left",
  RIGHT: "right",
  UP: "up",
  DOWN: "down",
};

const velocities = {
  [Direction.LEFT]: { x: -100, y: 0 },
  [Direction.RIGHT]: { x: 100, y: 0 },
  [Direction.UP]: { x: 0, y: -100 },
  [Direction.DOWN]: { x: 0, y: 100 },
};

function setcurrentLocation(x, y) {
  currentLocation.x = x;
  currentLocation.y = y;
}

function getcurrentC() {
  const R = -4 & Math.floor(Date.now() / 1e5);
  const C =
    Math.round(currentLocation.x) * (R % 1e3) +
    Math.round(currentLocation.y) * (R % 23) +
    (R % 111);
  return C;
}

function move(room, direction) {
  const velocity = velocities[direction];

  room.send(Types.MOVE, [
    getcurrentC(),
    currentLocation.x,
    currentLocation.y,
    velocity.x,
    velocity.y,
  ]);

  setcurrentLocation(currentLocation.x + velocity.x, currentLocation.y + velocity.y);

  setTimeout(() => {
    stop(room);
  }, 1000);
}

function stop(room) {
  room.send(Types.MOVE, [getcurrentC(), currentLocation.x, currentLocation.y, 0, 0]);
}

export { move, setcurrentLocation, Direction, currentLocation, stop };
