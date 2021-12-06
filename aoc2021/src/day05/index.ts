import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

interface CoordinateSystem {
  [key: string]: number;
}

const parseInput = (rawInput: string) => getLines(rawInput).map((line) => line.split(" -> ").map((coordinate) => coordinate.split(",").map(Number)));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid: CoordinateSystem = {};

  const setCoordinates = (x: number, y: number) => (grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1);

  for (const [to, from] of input) {
    if (to[0] === from[0]) {
      //y
      const start = Math.min(to[1], from[1]);
      const end = Math.max(to[1], from[1]);

      for (let i = start; i <= end; i++) {
        setCoordinates(to[0], i);
      }
    } else if (to[1] === from[1]) {
      //x
      const start = Math.min(to[0], from[0]);
      const end = Math.max(to[0], from[0]);

      for (let i = start; i <= end; i++) {
        setCoordinates(i, to[1]);
      }
    }
  }

  return _.countBy(_.values(grid), (value) => value > 1)["true"];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const grid: CoordinateSystem = {};

  const setCoordinates = (x: number, y: number) => (grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1);

  for (const [to, from] of input) {
    if (to[0] === from[0]) {
      //y
      const start = Math.min(to[1], from[1]);
      const end = Math.max(to[1], from[1]);

      for (let i = start; i <= end; i++) {
        setCoordinates(to[0], i);
      }
    } else if (to[1] === from[1]) {
      //x
      const start = Math.min(to[0], from[0]);
      const end = Math.max(to[0], from[0]);

      for (let i = start; i <= end; i++) {
        setCoordinates(i, to[1]);
      }
    } else {
      // diagonal
      const direction = [from[0] - to[0], from[1] - to[1]];
      const coordinatesMax = _.max(direction.map(Math.abs)) as number;

      const vector = direction.map((coordinate) => coordinate / coordinatesMax);

      for (let i = 0; i <= coordinatesMax; i++) {
        setCoordinates(to[0] + vector[0] * i, to[1] + vector[1] * i);
      }
    }
  }

  const countedValues = _.countBy(_.values(grid), (value) => value > 1);

  return countedValues["true"];
};

run({
  part1: {
    tests: [
      {
        input: `
        0,9 -> 5,9
        8,0 -> 0,8
        9,4 -> 3,4
        2,2 -> 2,1
        7,0 -> 7,4
        6,4 -> 2,0
        0,9 -> 2,9
        3,4 -> 1,4
        0,0 -> 8,8
        5,5 -> 8,2`,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        0,9 -> 5,9
        8,0 -> 0,8
        9,4 -> 3,4
        2,2 -> 2,1
        7,0 -> 7,4
        6,4 -> 2,0
        0,9 -> 2,9
        3,4 -> 1,4
        0,0 -> 8,8
        5,5 -> 8,2`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
