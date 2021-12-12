import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput).map((line) => line.split("").map(Number));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let flashes = 0;

  const incFlash = (y: number, x: number) => {
    if (y < 0 || y >= 10 || x < 0 || x >= 10) return;

    input[y][x]++;
    if (input[y][x] == 10) {
      flashes++;

      incFlash(y - 1, x - 1);
      incFlash(y - 1, x - 0);
      incFlash(y - 1, x + 1);
      incFlash(y - 0, x - 1);
      incFlash(y - 0, x + 1);
      incFlash(y + 1, x - 1);
      incFlash(y + 1, x - 0);
      incFlash(y + 1, x + 1);
    }
  };

  for (let i = 0; i < 100; i++) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        incFlash(y, x);
      }
    }

    //reset all flashed flashers
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (input[y][x] > 9) {
          input[y][x] = 0;
        }
      }
    }
  }

  return flashes;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let syncronizedRound = 0;

  const incFlash = (y: number, x: number) => {
    if (y < 0 || y >= 10 || x < 0 || x >= 10) return;

    input[y][x]++;
    if (input[y][x] == 10) {
      incFlash(y - 1, x - 1);
      incFlash(y - 1, x - 0);
      incFlash(y - 1, x + 1);
      incFlash(y - 0, x - 1);
      incFlash(y - 0, x + 1);
      incFlash(y + 1, x - 1);
      incFlash(y + 1, x - 0);
      incFlash(y + 1, x + 1);
    }
  };

  for (let i = 0; i < 1000; i++) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        incFlash(y, x);
      }
    }

    let allFlash = true;
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        if (input[y][x] > 9) {
          input[y][x] = 0;
        } else {
          allFlash = false;
        }
      }
    }

    if (allFlash) {
      syncronizedRound = i + 1;
      break;
    }
  }

  return syncronizedRound;
};

run({
  part1: {
    tests: [
      {
        input: `
        5483143223
        2745854711
        5264556173
        6141336146
        6357385478
        4167524645
        2176841721
        6882881134
        4846848554
        5283751526
      `,
        expected: 1656,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        5483143223
        2745854711
        5264556173
        6141336146
        6357385478
        4167524645
        2176841721
        6882881134
        4846848554
        5283751526
      `,
        expected: 195,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
