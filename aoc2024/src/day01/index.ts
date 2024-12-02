import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLineGroupsAsNumbers, getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);

  const right: Array<number> = [];
  const left: Array<number> = [];

  _.forEach(lines, (line) => {
    const [leftNumber, rightNumber] = line.split("   ");

    right.push(parseInt(rightNumber));
    left.push(parseInt(leftNumber));
  });

  return { right, left };
};

const part1 = (rawInput: string) => {
  const { right, left } = parseInput(rawInput);

  const sortedRight = right.sort((a, b) => a - b);
  const sortedLeft = left.sort((a, b) => a - b);

  const results: Array<number> = [];

  _.forEach(sortedRight, (r, i) => {
    results.push(Math.abs(r - sortedLeft[i]));
  });

  return _.sum(results);
};

const part2 = (rawInput: string) => {
  const { right, left } = parseInput(rawInput);

  const results: Array<number> = [];

  const sortedRight = right.sort((a, b) => a - b);
  const sortedLeft = left.sort((a, b) => a - b);

  const groupedRight = _.groupBy(sortedRight, Math.abs);

  sortedLeft.forEach((l) => {
    results.push(l * (groupedRight[l]?.length ?? 0));
  });

  return _.sum(results);
};

run({
  part1: {
    tests: [
      {
        input: `
3   4
4   3
2   5
1   3
3   9
3   3
        `,
        expected: 11,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
3   4
4   3
2   5
1   3
3   9
3   3        
        `,
        expected: 31,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
