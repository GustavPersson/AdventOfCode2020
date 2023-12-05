import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLineGroups, getLines, parseNumbers } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => {
  const lineGroups = getLineGroups(rawInput);

  const seeds = parseNumbers(lineGroups[0][0].split(':')[1]);
  const almanac = lineGroups.map((lineGroup) => {
    const returnval = lineGroup.slice(1).map((num) => parseNumbers(num));
    return returnval;
  });

  return { seeds, almanac };
};

const doWeHaveThatSeed = (seed: number, seedRanges: number[][]): boolean =>
  seedRanges.some(
    ([seedStart, length]) => seedStart <= seed && seedStart + length >= seed,
  );

const getSeedLocation = (step: number, almanac: number[][][]): number => {
  for (const almanacEntry of almanac) {
    for (const [destination, source, length] of almanacEntry) {
      if (source <= step && source + length > step) {
        step = destination + step - source;
        break;
      }
    }
  }

  return step;
};

function getSeedGivenLocation(step: number, almanac: number[][][]): number {
  for (const almanacEntry of almanac.slice().reverse()) {
    for (const [destination, source, length] of almanacEntry) {
      if (destination <= step && destination + length > step) {
        step = source + step - destination;
        break;
      }
    }
  }

  return step;
}

const part1 = (rawInput: string) => {
  const { almanac, seeds } = parseInput(rawInput);

  return Math.min(...seeds.map((seed) => getSeedLocation(seed, almanac)));
};

const part2 = (rawInput: string) => {
  const { almanac, seeds } = parseInput(rawInput);

  const seedGroups = _.chunk(seeds, 2);

  for (let i = 0; i < 1_000_000_000; i++) {
    const seed = getSeedGivenLocation(i, almanac);

    if (doWeHaveThatSeed(seed, seedGroups)) {
      return i;
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4        
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4        
        `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
