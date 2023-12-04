import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';

log.enableAll();

type Games = {
  [key: number]: {
    [key: number]: Colors;
  };
};

type Colors = {
  red: number;
  green: number;
  blue: number;
};

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);

  const games: Games = {};

  lines.forEach((line) => {
    const [game, sets] = line.split(':');
    const gameNumber = parseInt(game.split(' ')[1], 10);
    games[gameNumber] = {};

    const setArray = sets.split(';');

    setArray.forEach((set, index) => {
      games[gameNumber][index] = {
        red: 0,
        green: 0,
        blue: 0,
      };

      const colors = set.split(',');
      colors.forEach((color) => {
        const [count, colorName] = color.trim().split(' ') as [
          string,
          keyof Colors,
        ];
        games[gameNumber][index][colorName] = parseInt(count, 10);
      });
    });
  });

  return games;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cubeAmounts = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const legalGames: Array<number> = [];

  Object.keys(input).forEach((game) => {
    const gameNumber = parseInt(game, 10);
    const sets = input[gameNumber];
    let isLegal = true;

    for (let set = 0; set < Object.keys(sets).length; set++) {
      const colors = sets[set];
      if (
        colors.red > cubeAmounts.red ||
        colors.green > cubeAmounts.green ||
        colors.blue > cubeAmounts.blue
      ) {
        isLegal = false;
      }
    }

    if (isLegal) {
      legalGames.push(gameNumber);
    }
  });

  const answer = legalGames.reduce((acc, curr) => acc + curr, 0);

  return answer;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const smallestPossibleCubePowerInTheGameForItToBeLegal: Array<number> = [];

  Object.keys(input).forEach((game) => {
    const cubeAmounts: Colors = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const gameNumber = parseInt(game, 10);
    const sets = input[gameNumber];

    for (let set = 0; set < Object.keys(sets).length; set++) {
      const colors = sets[set];

      const colorKeys = Object.keys(colors) as Array<keyof Colors>;

      _.forEach(colorKeys, (color) => {
        if (colors[color] > cubeAmounts[color]) {
          cubeAmounts[color] = colors[color];
        }
      });
    }

    smallestPossibleCubePowerInTheGameForItToBeLegal.push(
      Object.values(cubeAmounts).reduce((acc, curr) => acc * curr, 1),
    );
  });

  const answer = smallestPossibleCubePowerInTheGameForItToBeLegal.reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return answer;
};

run({
  part1: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green        
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
