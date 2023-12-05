import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scores: Array<number> = [];

  for (let line of input) {
    const numberLine = line.split(':')[1];
    const [winningNumbers, numbers] = numberLine.split('|').map((string) =>
      string
        .trim()
        .split(' ')
        .filter((number) => number)
        .map((number) => parseInt(number)),
    );

    const numberOfWinningNumbers = _.reduce(
      _.intersection(winningNumbers, numbers),
      (result, value) => {
        if (value) {
          if (result === 0) {
            return 1;
          }
          return (result *= 2);
        }
        return 0;
      },
      0,
    );
    scores.push(numberOfWinningNumbers);
  }

  return _.sum(scores);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const scratchCards = new Array(input.length).fill(1);

  _.forEach(input, (line, index) => {
    const numberLine = line.split(':')[1];
    const [winningNumbers, numbers] = numberLine.split('|').map((string) =>
      string
        .trim()
        .split(' ')
        .filter((number) => number)
        .map((number) => parseInt(number)),
    );

    const numberOfWinningNumbers = _.intersection(
      winningNumbers,
      numbers,
    ).length;

    for (let i = 1; i <= numberOfWinningNumbers; i++) {
      scratchCards[index + i] += scratchCards[index];
    }
  });

  return _.sum(scratchCards);
};

run({
  part1: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11                
        `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11        
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
