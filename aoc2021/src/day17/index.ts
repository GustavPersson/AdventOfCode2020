import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";
import { Set } from "immutable";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

interface TargetArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const parseInput = (rawInput: string): TargetArea => {
  const values = rawInput
    .split(": ")[1]
    .split(", ")
    .map((coord) => coord.split("=")[1].split("..").map(Number))
    .flat();

  return {
    x1: values[0],
    x2: values[1],
    y1: values[2],
    y2: values[3],
  };
};

const part1: Solution = (rawInput: string) => {
  const targetArea = parseInput(rawInput);

  const initialVelocity = [0, 0];
  let netHighestY = 0;
  let retry = 0;

  main: while (true) {
    const position = [0, 0];
    const velocity = [...initialVelocity];
    let highestY = 0;

    // Simulate trajectory at current initial velocity
    while (true) {
      const lastPosition = [...position];
      position[0] += velocity[0];
      position[1] += velocity[1];

      if (position[1] > highestY) {
        highestY = position[1];
      }

      velocity[0] -= Math.sign(velocity[0]);
      velocity[1]--;

      if (position[1] > targetArea.y2) {
        // Has not yet reached target area by Y
        continue;
      }

      if (position[0] >= targetArea.x1 && position[0] <= targetArea.x2 && position[1] >= targetArea.y1 && position[1] <= targetArea.y2) {
        // Trajectory enters target area
        retry = 0;
        netHighestY = highestY;
        initialVelocity[1]++;
        break;
      }

      if (position[1] < targetArea.y1) {
        // Trajectory passes the target area by Y
        if (lastPosition[1] > targetArea.y2) {
          // Trajectory goes through target area, highest initial velocity might have been found
          if (++retry > 100) break main;

          // Retry at most 100 times to find next highest Y
          initialVelocity[1]++;
          break;
        }

        if (lastPosition[0] < targetArea.x1) {
          // Trajectory goes left of the target area
          initialVelocity[0]++; // Adjust trajectory to the right
        } else if (lastPosition[0] > targetArea.x2) {
          // Trajectory goes right of the target area
          initialVelocity[0]--; // Adjust trajectory to the left
        } else {
          throw new Error("i mean just in case something goes wrong");
        }

        break;
      }
    }
  }

  return netHighestY;
};

const part2: Solution = (rawInput: string) => {
  const targetArea = parseInput(rawInput);

  let validInitialVelocities = Set<string>();

  const initialVelocity = [0, targetArea.y1];
  let retry = 0;
  let foundOnCurrentInitialY = false;
  let lastHorizontalChange = 0;

  main: while (true) {
    const position = [0, 0];
    const velocity = [...initialVelocity];
    while (true) {
      const lastPosition = [...position];
      position[0] += velocity[0];
      position[1] += velocity[1];

      velocity[0] -= Math.sign(velocity[0]);
      velocity[1]--;

      if (position[1] > targetArea.y2) {
        // Has not yet reached target area by Y
        continue;
      }

      if (position[0] >= targetArea.x1 && position[0] <= targetArea.x2 && position[1] >= targetArea.y1 && position[1] <= targetArea.y2) {
        // Trajectory enters target area
        retry = 0;
        validInitialVelocities = validInitialVelocities.add(initialVelocity.join(","));

        foundOnCurrentInitialY = true;
        initialVelocity[0] += lastHorizontalChange;

        break;
      }

      if (position[1] < targetArea.y1) {
        if (foundOnCurrentInitialY) {
          // Nothing else to check on current initial Y velocity
          initialVelocity[0] = 0;
          initialVelocity[1]++;
          foundOnCurrentInitialY = false;
          break;
        }

        // Trajectory passes the target area by Y
        if (lastPosition[1] > targetArea.y2) {
          // Trajectory goes through target area, highest initial velocity might have been found
          if (++retry > 100) break main;

          // Retry at most 100 times to find next highest Y
          initialVelocity[0] = 0;
          initialVelocity[1]++;
          break;
        }

        if (lastPosition[0] < targetArea.x1) {
          // Trajectory goes left of the target area
          initialVelocity[0]++; // Adjust trajectory to the right
          lastHorizontalChange = 1;
        } else if (lastPosition[0] > targetArea.x2) {
          // Trajectory goes right of the target area
          initialVelocity[0]--; // Adjust trajectory to the left
          lastHorizontalChange = -1;
        } else {
          throw new Error("i mean just in case something goes wrong");
        }
        break;
      }
    }
  }

  return validInitialVelocities.size;
};

run({
  part1: {
    tests: [{ input: `target area: x=20..30, y=-10..-5`, expected: 45 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `target area: x=20..30, y=-10..-5`, expected: 112 }],
    solution: part2,
  },
  trimTestInputs: true,
});
