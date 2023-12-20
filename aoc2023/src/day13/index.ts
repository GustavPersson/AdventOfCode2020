import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLineGroups, rotateGrid } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => {
  return getLineGroups(rawInput).map((group) =>
    group.map((line) => line.split('')),
  );
};

const findMirrors = (map: string[][], scoreMultiplier: number): number[] => {
  let scores: number[] = [];
  for (let i = 0; i < map.length - 1; i++) {
    if (map[i].join('') === map[i + 1].join('')) {
      let broken = false,
        k = 0.5,
        j = i + 0.5;

      while (j - k >= 0 && j + k < map.length) {
        if (map[j - k].join('') !== map[j + k].join('')) {
          broken = true;
          break;
        }

        k += 1;
      }
      if (!broken) {
        scores.push((i + 1) * scoreMultiplier);
      }
    }
  }
  return scores;
};

const mapScores = (map: string[][]): number[] => [
  ...findMirrors(map, 100),
  ...findMirrors(rotateGrid(map).reverse(), 1),
];

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const scores: number[] = [];

  input.forEach((map) => {
    scores.push(...mapScores(map));
  });

  return scores.reduce((a, b) => a + b, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let result = 0;

  input.forEach((map) => {
    const smudgedScores = mapScores(map);

    for (let i = 0; i < map.length; i++) {
      for (let j = 0; j < map[0].length; j++) {
        let newMap = _.cloneDeep(map);
        newMap[i][j] = newMap[i][j] == '.' ? '#' : '.';

        let unSmudgedScores = _.difference(mapScores(newMap), smudgedScores);

        if (unSmudgedScores.length === 1) {
          result += unSmudgedScores[0];
          return true;
        }
      }
    }
  });

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.
        
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#
        `,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        #.##..##.
        ..#.##.#.
        ##......#
        ##......#
        ..#.##.#.
        ..##..##.
        #.#.##.#.
        
        #...##..#
        #....#..#
        ..##..###
        #####.##.
        #####.##.
        ..##..###
        #....#..#`,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
