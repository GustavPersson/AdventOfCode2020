import run from "aocrunner";
import { Set } from "immutable";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput).map((row) => row.split("").map(Number));

type Queue = Array<QueueItem>;

type QueueItem = {
  pos: number[];
  cost: number;
};

const shortestPath = (map: number[][], startPos = [0, 0]) => {
  const adjacent = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  const queue: Queue = [{ pos: startPos, cost: 0 }];

  let visited = Set();
  while (queue.length) {
    const {
      pos: [x, y],
      cost,
    } = queue.shift() as QueueItem;

    if (y === map.length - 1 && x === map[0].length - 1) {
      return cost;
    }

    adjacent
      .map(([dx, dy]) => [dx + x, dy + y])
      .filter(([x, y]) => map[y]?.[x])
      .filter((pos) => !visited.has(pos + ""))
      .forEach((pos) => {
        visited = visited.add(pos + "");
        queue.push({ pos, cost: cost + map[pos[1]][pos[0]] });
      });
    queue.sort((a, b) => a.cost - b.cost);
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return shortestPath(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const completeCaveMap = [...Array(input.length * 5)].map((val, y) =>
    [...Array(input[0].length * 5)].map((val, x) => 1 + ((input[y % input.length][x % input[0].length] - 1 + Math.trunc(x / input[0].length) + Math.trunc(y / input.length)) % 9)),
  );

  return shortestPath(completeCaveMap);
};

run({
  part1: {
    tests: [
      {
        input: `
        1163751742
        1381373672
        2136511328
        3694931569
        7463417111
        1319128137
        1359912421
        3125421639
        1293138521
        2311944581
        `,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1163751742
        1381373672
        2136511328
        3694931569
        7463417111
        1319128137
        1359912421
        3125421639
        1293138521
        2311944581
      `,
        expected: 315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
