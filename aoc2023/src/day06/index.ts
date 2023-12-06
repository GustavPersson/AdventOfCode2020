import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines, parseNumbers } from '../utils/index.js';

log.disableAll();

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);
  return lines.map((line) => parseNumbers(line.split(':')[1]));
};

const doRace = (times: Array<number>, distances: Array<number>) => {
  const raceWins: Array<number> = [];

  _.forEach(times, (time, i) => {
    const numberOWinningOptions: Array<number> = [];
    const distance = distances[i];
    log.log(time, distance);

    for (let i = 0; i <= time; i++) {
      const speed = i;
      const travelled = speed * (time - i);
      if (travelled > distance) {
        numberOWinningOptions.push(i);
      }
    }
    raceWins.push(numberOWinningOptions.length);
  });

  log.log({ raceWins });

  let result = _.reduce(raceWins, (acc, curr) => acc * curr, 1);

  log.debug({ result });
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const times = input[0];
  const distances = input[1];

  return doRace(times, distances);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const times = parseNumbers(input[0].join(''));
  const distances = parseNumbers(input[1].join(''));

  return doRace(times, distances);
};

run({
  part1: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
