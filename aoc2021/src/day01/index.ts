import run from "aocrunner";
import _, { List } from "lodash";

const parseInput = (rawInput: string) => rawInput;

const slidingWindows = (arr: Array<number>, size: number) => {
  if (size > arr.length) {
    return arr;
  }
  let result = [];
  let lastWindow = arr.length - size;
  for (let i = 0; i <= lastWindow; i += 1) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/).map(Number);

  const windows = _.filter(slidingWindows(input, 2), (window: string) => window[1] > window[0]);

  return windows.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/).map(Number);

  const windows = _.filter(
    slidingWindows(
      slidingWindows(input, 3).map((window) => _.sum(window as List<number>)),
      2,
    ),
    (window: string) => window[1] > window[0],
  );

  return windows.length;

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
