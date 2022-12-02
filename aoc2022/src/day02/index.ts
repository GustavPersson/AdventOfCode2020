import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import type { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

type Round = 'A X' | 'A Y' |'A Z' | 'B X' | 'B Y' | 'B Z' | 'C X' | 'C Y' | 'C Z';

enum Rock {
  win = 1 + 6,
  draw = 1 + 3,
  lose = 1 + 0
}

enum Paper {
  win = 2 + 6,
  draw = 2 + 3,
  lose = 2 + 0
}

enum Scissors {
  win = 3 + 6,
  draw = 3 + 3,
  lose = 3 + 0
}

type PointsMap = { [round in Round]: Rock | Paper | Scissors };

const POINTS: PointsMap = {
  'A X': Rock.draw,
  'A Y': Paper.win,
  'A Z': Scissors.lose,
  'B X': Rock.lose,
  'B Y': Paper.draw,
  'B Z': Scissors.win,
  'C X': Rock.win,
  'C Y': Paper.lose,
  'C Z': Scissors.draw,
};

const SECOND_POINTS = {
  'A X': Scissors.lose,
  'A Y': Rock.draw,
  'A Z': Paper.win,
  'B X': Rock.lose,
  'B Y': Paper.draw,
  'B Z': Scissors.win,
  'C X': Paper.lose,
  'C Y': Scissors.draw,
  'C Z': Rock.win,
}

const parseInput = (rawInput: string) => getLines(rawInput);

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput) as Array<Round>;
  let score = 0;

  input.forEach((round) => {
    score += POINTS[round]

  })
  return score;
};

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput) as Array<Round>;
  let score = 0;

  input.forEach((round) => {
    score += SECOND_POINTS[round]
  })
  return score;
};

run({
  part1: {
    tests: [
      { input: `
        A Y
        B X
        C Z
      `, expected: 15 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `
        A Y
        B X
        C Z
      `, expected: 12 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true
});
