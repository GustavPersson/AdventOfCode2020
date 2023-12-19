import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLinesAsGrid } from '../utils/index.js';

log.enableAll();

type Galaxy = [number, number];

const parseInput = (rawInput: string) => {
  const galaxies: Array<Galaxy> = [];
  const expandedUniverse: Array<Array<number>> = [[], []];
  const universe = getLinesAsGrid(rawInput);

  universe.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        galaxies.push([x, y]);
      }
    });
  });

  universe.forEach(
    (row, y) => !row.includes('#') && expandedUniverse[1].push(y),
  );

  universe[0].forEach(
    (o, x) =>
      !universe.map((v) => v[x]).includes('#') && expandedUniverse[0].push(x),
  );

  return { galaxies, universe, expandedUniverse };
};

const manhattanDistance = (a: Galaxy, b: Galaxy) =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

const galaxyDistance = (
  g1: Galaxy,
  g2: Galaxy,
  growthSize: number,
  expandedUniverse: Array<Array<number>>,
) =>
  [0, 1].reduce(
    (a, c) =>
      a +
      expandedUniverse[c].filter(
        (o) => o > Math.min(g1[c], g2[c]) && o < Math.max(g1[c], g2[c]),
      ).length *
        (growthSize - 1),
    manhattanDistance(g1, g2),
  );

const distances = (
  growthSize: number,
  galaxies: Array<Galaxy>,
  expandedUniverse: Array<Array<number>>,
) =>
  galaxies
    .map((g1, i: number) =>
      galaxies.map(
        (g2, j: number) =>
          Number(j > i) * galaxyDistance(g1, g2, growthSize, expandedUniverse),
      ),
    )
    .flat()
    .reduce((a, v) => a + v, 0);

const part1 = (rawInput: string) => {
  const { galaxies, expandedUniverse } = parseInput(rawInput);

  return distances(2, galaxies, expandedUniverse);
};

const part2 = (rawInput: string) => {
  const { galaxies, expandedUniverse } = parseInput(rawInput);

  return distances(1000000, galaxies, expandedUniverse);
};

run({
  part1: {
    tests: [
      {
        input: `
        ...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....                
        `,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
