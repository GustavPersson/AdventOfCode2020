import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => rawInput.split(",").map(Number);

// en kö med antalet fiskar i varje ålder istället för en array med alla fiskar
const lanternFishCounterSubroutine = (input: Array<number>, numberOfDays: number) => {
  // 0 till 8 dagar
  const timers = Array(9).fill(0);
  for (const fish of input) {
    timers[fish]++;
  }

  for (let day = 0; day < numberOfDays; day++) {
    //shift the array to get today's births
    const birthingFishes = timers.shift();
    timers[6] += birthingFishes;
    // set the 8 again since we shifted the queue
    timers[8] = birthingFishes;
  }

  return timers.reduce((a, b) => a + b);
};

const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);

  return lanternFishCounterSubroutine(input, 80);
};

const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);

  return lanternFishCounterSubroutine(input, 256);
};

run({
  part1: {
    tests: [{ input: `3,4,3,1,2`, expected: 5934 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `3,4,3,1,2`, expected: 26984457539 }],

    solution: part2,
  },
  trimTestInputs: true,
});
