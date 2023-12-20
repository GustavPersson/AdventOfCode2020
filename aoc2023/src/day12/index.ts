import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';
import { Map } from 'immutable';

import { getLines } from '../utils/index.js';

log.enableAll();

let cache = Map<string, number>();

const count = (map: string, sizes: number[]): number => {
  if (map.length === 0) {
    return sizes.length === 0 ? 1 : 0;
  }

  if (sizes.length === 0) {
    return map.includes('#') ? 0 : 1;
  }

  let k = [map, ...sizes].join('_');

  if (cache.has(k)) {
    return cache.get(k)!;
  }

  let result = 0;

  if (['.', '?'].includes(map[0])) {
    result += count(map.slice(1), sizes);
  }

  if (['#', '?'].includes(map[0])) {
    if (
      map.length >= sizes[0] &&
      !map.slice(0, sizes[0]).includes('.') &&
      (map.length === sizes[0] || map[sizes[0]] !== '#')
    ) {
      result += count(map.slice(sizes[0] + 1), sizes.slice(1));
    }
  }

  cache = cache.set(k, result);

  return result;
};

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);

  return lines.map((line) => {
    const data = line.split(' ');
    return [data[0], data[1].split(',').map(Number)] as [string, number[]];
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  cache = cache.clear();

  return input.reduce((res, line) => {
    let [map, sizes] = [line[0], line[1]];
    res += count(map, sizes);

    return res;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  cache = cache.clear();

  return input.reduce((res, line) => {
    let [map, sizes] = [line[0], line[1]];

    map = Array(5).fill(map).join('?');
    sizes = Array(5).fill(sizes).flat();

    res += count(map, sizes);

    return res;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1               
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1               
        `,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
