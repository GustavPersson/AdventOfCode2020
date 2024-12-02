import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import {
  getLineGroupsAsNumbers,
  getLines,
  getLinesAsGridOfNumbers,
} from "../utils/index.js";

const parseInput = (rawInput: string) => {
  return getLines(rawInput).map((line) => line.split(" ").map(Number));
};

const isSafe = (levels: number[]) => {
  const differences: number[] = [];

  for (let i = 1; i < levels.length; i++) {
    differences.push(levels[i] - levels[i - 1]);
  }

  const increasing = differences.every((d) => d >= 1 && d <= 3);
  const decreasing = differences.every((d) => d <= -1 && d >= -3);

  return increasing || decreasing;
};

const part1 = (rawInput: string) => {
  log.disableAll();
  const reports = parseInput(rawInput);

  let safeReports = 0;

  _.forEach(reports, (report) => {
    let reportIsUnsafe = false;

    if (report.length < 2) {
      return;
    }

    const shouldBeIncreasing = report[0] < report[1];
    const shouldBeDecreasing = report[0] > report[1];

    if (report[0] === report[1]) {
      return;
    }

    _.forEach(report, (level, index) => {
      if (index === report.length - 1) {
        return;
      }

      if (shouldBeIncreasing && level > report[index + 1]) {
        reportIsUnsafe = true;
        return false;
      }

      if (shouldBeDecreasing && level < report[index + 1]) {
        reportIsUnsafe = true;
        return false;
      }

      if (
        Math.abs(level - report[index + 1]) > 3 ||
        Math.abs(level - report[index + 1]) < 1
      ) {
        reportIsUnsafe = true;
        return false;
      }
    });

    if (reportIsUnsafe) {
      return;
    }

    safeReports += 1;
    log.debug("safe ", report);
  });

  return safeReports;
};

const part2 = (rawInput: string) => {
  log.enableAll();

  const reports = parseInput(rawInput);

  let madeSafe = 0;

  for (const report of reports) {
    let tolerable = false;

    for (let i = 0; i < report.length; i++) {
      const removed = _.clone(report);
      _.pullAt(removed, i);

      if (isSafe(removed)) {
        tolerable = true;
        break;
      }
    }

    if (isSafe(report) || tolerable) {
      madeSafe++;
    }
  }

  return madeSafe;
};

run({
  part1: {
    tests: [
      {
        input: `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
        `,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
        `,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
