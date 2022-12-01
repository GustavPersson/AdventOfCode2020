import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import type { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
