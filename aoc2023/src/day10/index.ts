import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => {
  const input = getLines(rawInput);

  let start: Position = { x: 0, y: 0 };
  let map: Array<Array<LoopItem>> = input.map((line, y) =>
    line.split('').map((v, x) => {
      if (v === 'S') {
        start = { x, y };
      }

      return {
        v: v,
        links: getLinks(v),
      };
    }),
  );

  // determine the start pipe
  if (start.x > 0 && map[start.y][start.x - 1].links.includes(Directions.E)) {
    map[start.y][start.x].links.push(Directions.W);
  }

  if (
    start.x < map[0].length - 1 &&
    map[start.y][start.x + 1].links.includes(Directions.W)
  ) {
    map[start.y][start.x].links.push(Directions.E);
  }

  if (start.y > 0 && map[start.y - 1][start.x].links.includes(Directions.S)) {
    map[start.y][start.x].links.push(Directions.N);
  }

  if (
    start.y < map.length - 1 &&
    map[start.y + 1][start.x].links.includes(Directions.N)
  ) {
    map[start.y][start.x].links.push(Directions.S);
  }

  let stack: Array<StackItem> = [{ pos: start, distance: 0 }];

  let n: StackItem | undefined;

  while ((n = stack.shift())) {
    if (n === undefined) {
      break;
    }

    const currentPos = map[n.pos.y][n.pos.x];
    if (currentPos.dist !== undefined && currentPos.dist <= n.distance) {
      continue;
    }

    currentPos.dist = n.distance;

    currentPos.links.forEach((d) => {
      if (n === undefined) {
        return;
      }

      stack.push({
        pos: { x: n.pos.x + dir[d].x, y: n.pos.y + dir[d].y },
        distance: n.distance + 1,
      });
    });
  }

  return { map, start };
};

type Position = { x: number; y: number };
type StackItem = { pos: Position; distance: number };
type LoopItem = { v: string; links: Array<Directions>; dist?: number };

enum Directions {
  N = 0,
  S = 1,
  E = 2,
  W = 3,
}

const dir: Array<Position> = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: -1, y: 0 },
];

const getLinks = (tube: string) => {
  switch (tube) {
    case '|':
      return [Directions.S, Directions.N];
    case '-':
      return [Directions.W, Directions.E];
    case 'L':
      return [Directions.N, Directions.E];
    case 'J':
      return [Directions.N, Directions.W];
    case '7':
      return [Directions.S, Directions.W];
    case 'F':
      return [Directions.S, Directions.E];
    case 'S':
      return [];
  }
  return [];
};

const part1 = (rawInput: string) => {
  const { map } = parseInput(rawInput);

  return Math.max(
    ...map.flat().map((p) => (p.dist === undefined ? 0 : p.dist)),
  );
};

const part2 = (rawInput: string) => {
  const { map } = parseInput(rawInput);
  let stack: Array<StackItem> = [];

  let maze = Array(map.length * 3),
    mazeDist = Array(map.length * 3);

  map.forEach((row, y) =>
    row.forEach((v, x) => {
      let submap = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];

      if (v.dist === undefined) {
        submap[1][1] = 2;
      } else {
        submap[1][1] = 1; // impassabru
        v.links.forEach((d) => (submap[1 + dir[d].y][1 + dir[d].x] = 1));
      }

      // copy submap into maze
      for (let i = 0; i <= 2; i++) {
        if (maze[y * 3 + i] === undefined) {
          maze[y * 3 + i] = Array(map[0].length * 3);
          mazeDist[y * 3 + i] = Array(map[0].length * 3);
        }
        for (let j = 0; j <= 2; j++) maze[y * 3 + i][x * 3 + j] = submap[i][j];
      }
    }),
  );

  map.forEach((row, y) =>
    row.forEach((v, x) => {
      if (
        (y * x == 0 || y == map.length - 1 || x == map[0].length - 1) &&
        map[y][x].dist === undefined
      )
        stack.push({ pos: { x: x * 3, y: y * 3 }, distance: 0 });
    }),
  );

  let n: StackItem | undefined;

  while ((n = stack.shift())) {
    if (n === undefined) {
      break;
    }
    if (
      maze[n.pos.y] === undefined ||
      maze[n.pos.y][n.pos.x] === undefined ||
      maze[n.pos.y][n.pos.x] == 1
    ) {
      continue;
    }

    if (
      mazeDist[n.pos.y][n.pos.x] !== undefined &&
      mazeDist[n.pos.y][n.pos.x] <= n.distance
    ) {
      continue;
    }

    mazeDist[n.pos.y][n.pos.x] = n.distance;
    dir.forEach((d) => {
      if (n === undefined) {
        return;
      }

      stack.push({
        pos: { x: n.pos.x + d.x, y: n.pos.y + d.y },
        distance: n.distance + 1,
      });
    });
  }

  return map
    .map((row, y) =>
      row.reduce(
        (a, v, x) =>
          a +
          (v.dist === undefined && mazeDist[y * 3][x * 3] === undefined
            ? 1
            : 0),
        0,
      ),
    )
    .reduce((a, v) => a + v, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
        .....
        .S-7.
        .|.|.
        .L-J.
        .....`,
        expected: 4,
      },
      {
        input: `
        7-F7-
        .FJ|7
        SJLL7
        |F--J
        LJ.LJ`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        ...........
        .S-------7.
        .|F-----7|.
        .||.....||.
        .||.....||.
        .|L-7.F-J|.
        .|..|.|..|.
        .L--J.L--J.
        ...........`,
        expected: 4,
      },
      {
        input: `
        ..........
        .S------7.
        .|F----7|.
        .||....||.
        .||....||.
        .|L-7F-J|.
        .|..||..|.
        .L--JL--J.
        ..........`,
        expected: 4,
      },
      {
        input: `
        .F----7F7F7F7F-7....
        .|F--7||||||||FJ....
        .||.FJ||||||||L7....
        FJL7L7LJLJ||LJ.L-7..
        L--J.L7...LJS7F-7L7.
        ....F-J..F7FJ|L7L7L7
        ....L7.F7||L7|.L7L7|
        .....|FJLJ|FJ|F7|.LJ
        ....FJL-7.||.||||...
        ....L---J.LJ.LJLJ...`,
        expected: 8,
      },
      {
        input: `
        FF7FSF7F7F7F7F7F---7
        L|LJ||||||||||||F--J
        FL-7LJLJ||||||LJL-77
        F--JF--7||LJLJ7F7FJ-
        L---JF-JLJ.||-FJLJJ7
        |F|F-JF---7F7-L7L|7|
        |FFJF7L7F-JF7|JL---7
        7-L-JL7||F7|L7F-7F7|
        L.L7LFJ|||||FJL7||LJ
        L7JLJL-JLJLJL--JLJ.L`,
        expected: 10,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
