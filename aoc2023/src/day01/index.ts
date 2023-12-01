import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

const digits = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
} as const;
type MatchedString = keyof typeof digits;
type MatchedNumber = (typeof digits)[MatchedString];

const regexWords = Object.keys(digits).join("|");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const result = input
    .map((line) => {
      const numericLine = line.replace(/\D/g, "");
      const number = numericLine[0] + numericLine[numericLine.length - 1];

      return parseInt(number);
    })
    .reduce((acc, curr) => acc + curr, 0);

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const result = input
    .map((line) => {
      const first = line.match(
        /\d|one|two|three|four|five|six|seven|eight|nine/,
      )?.[0];
      
      const last = line.match(
        /.*(\d|one|two|three|four|five|six|seven|eight|nine)/,
      )?.[1];

      return _.parseInt(
        (digits[first as MatchedString] ?? first) +
          (digits[last as MatchedString] ?? last),
      );
    })
    .reduce((acc, curr) => acc + curr, 0);

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `
        1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
