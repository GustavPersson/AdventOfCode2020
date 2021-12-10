import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

const points: { [key: string]: number } = {};

const pairs = new Map<string, string>();
pairs.set("(", ")");
pairs.set("[", "]");
pairs.set("{", "}");
pairs.set("<", ">");

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  points[")"] = 3;
  points["]"] = 57;
  points["}"] = 1197;
  points[">"] = 25137;

  let total = 0;
  for (const line of input) {
    const expectedClosers: string[] = [];
    let valid = true;

    for (const char of line) {
      if (pairs.has(char)) {
        expectedClosers.push(pairs.get(char) as string);
      } else {
        const expected = expectedClosers.pop();
        if (expected != char) {
          total += points[char];
          valid = false;
          break;
        }
      }
    }
  }

  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  points[")"] = 1;
  points["]"] = 2;
  points["}"] = 3;
  points[">"] = 4;

  const scores = [];

  for (const line of input) {
    const expectedClosers: string[] = [];
    let valid = true;

    for (const char of line) {
      if (pairs.has(char)) {
        expectedClosers.push(pairs.get(char) as string);
      } else {
        const expected = expectedClosers.pop();
        if (expected != char) {
          valid = false;
          break;
        }
      }
    }
    if (valid) {
      let score = 0;
      while (expectedClosers.length > 0) {
        const char = expectedClosers.pop() as string;
        score *= 5;
        score += points[char];
      }
      scores.push(score);
    }
  }

  scores.sort((a, b) => b - a);

  return scores[_.floor(scores.length / 2)];
};

run({
  part1: {
    tests: [
      {
        input: `
          [({(<(())[]>[[{[]{<()<>>
          [(()[<>])]({[<{<<[]>>(
          {([(<{}[<>[]}>{[]{[(<()>
          (((({<>}<{<{<>}{[]{[]{}
          [[<[([]))<([[{}[[()]]]
          [{[{({}]{}}([{[{{{}}([]
          {<[[]]>}<{[{[{[]{()[[[]
          [<(<(<(<{}))><([]([]()
          <{([([[(<>()){}]>(<<{{
          <{([{{}}[<[[[<>{}]]]>[]]
      `,
        expected: 26397,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          [({(<(())[]>[[{[]{<()<>>
          [(()[<>])]({[<{<<[]>>(
          {([(<{}[<>[]}>{[]{[(<()>
          (((({<>}<{<{<>}{[]{[]{}
          [[<[([]))<([[{}[[()]]]
          [{[{({}]{}}([{[{{{}}([]
          {<[[]]>}<{[{[{[]{()[[[]
          [<(<(<(<{}))><([]([]()
          <{([([[(<>()){}]>(<<{{
          <{([{{}}[<[[[<>{}]]]>[]]
      `,
        expected: 288957,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
