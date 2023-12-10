import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const answers: Array<number> = [];

  input.forEach((line) => {
    const history: number[][] = [];
    const numbers = line.split(' ').map(Number);
    let i = 0;
    history.push(numbers);

    while (true) {
      let allZero = true;
      for (let x = 0; x < history[i].length - 1; x++) {
        let diff = history[i][x + 1] - history[i][x];
        if (x == 0) {
          history[i + 1] = [];
        }
        history[i + 1][x] = diff;
        allZero = allZero && diff == 0;
      }

      if (allZero) {
        break;
      }
      i++;
    }

    let nextHistoryValue = 0;
    for (; i >= 0; i--) {
      nextHistoryValue += history[i].pop() as number;
    }

    answers.push(nextHistoryValue);
  });

  return answers.reduce((acc, curr) => acc + curr, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const answers: Array<number> = [];

  input.forEach((line) => {
    let i = 0;
    let history = [];
    const numbers = line.split(' ').map(Number);
    history.push(numbers);

    while (true) {
      let allzero = true;
      for (let x = 0; x < history[i].length - 1; x++) {
        let diff = history[i][x + 1] - history[i][x];
        if (x == 0) {
          history[i + 1] = [];
        }
        history[i + 1][x] = diff;
        allzero = allzero && diff == 0;
      }
      i++;
      if (allzero) {
        break;
      }
    }

    history[i].unshift(0);

    let nextHistoryValue = 0;
    for (i--; i >= 0; i--) {
      nextHistoryValue = history[i][0] - history[i + 1][0];
      history[i].unshift(nextHistoryValue);
    }

    answers.push(nextHistoryValue);
  });

  return answers.reduce((acc, curr) => acc + curr, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45                
        `,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45                
        `,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
