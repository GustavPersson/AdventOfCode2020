import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLineGroups } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLineGroups(rawInput);

//find largest coords to generate paper size
const getLargestCoords = (input: number[][]): number[] => {
  const largestCoords = input.reduce(
    (previousValue: number[], currentValue: number[]) => [
      previousValue[0] > currentValue[0] ? previousValue[0] : currentValue[0],
      previousValue[1] > currentValue[1] ? previousValue[1] : currentValue[1],
    ],
    [0, 0],
  );
  largestCoords[0]++;
  largestCoords[1]++;
  return largestCoords;
};

const printPaper = (paper: string[][]) => {
  for (let x of paper) {
    log.info(x.join(""));
  }
};

const countDots = (paper: string[][]): number => {
  return paper.reduce((a: number, e: string[]) => a + e.reduce((ax: number, el: string) => ax + (el === "#" ? 1 : 0), 0), 0);
};

const foldY = (paper: string[][], line: number = Math.floor(paper.length / 2)): string[][] => {
  let result: string[][] = [];
  for (let i = 0; i < line; i++) {
    let line1 = paper[i];
    let line2 = paper[paper.length - i - 1];
    for (let x = 0; x < line1.length; x++) {
      if (line2[x] === "#") {
        line1[x] = "#";
      }
    }
    result.push(line1);
  }
  return result;
};

const foldX = (paper: string[][], line: number = Math.floor(paper[0].length / 2)): string[][] => {
  let result: string[][] = [];
  for (let x of paper) {
    let row = [];
    for (let i = 0; i < line; i++) {
      row.push(x[i] === "#" || x[x.length - i - 1] === "#" ? "#" : " ");
    }
    result.push(row);
  }
  return result;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const points: number[][] = input[0].map((coordinates: string) => coordinates.split(",").map(Number));
  const instructions = input[1].map((instruction) => instruction.substring(11));
  let paper: string[][] = [];

  const largestCoords = getLargestCoords(points);

  for (let i = 0; i < largestCoords[1]; i++) {
    paper.push(Array(largestCoords[0]).fill(" "));
  }

  for (let point of points) {
    paper[point[1]][point[0]] = "#";
  }

  paper = instructions[0][0] === "y" ? foldY(paper) : (paper = foldX(paper));

  return countDots(paper);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const points: number[][] = input[0].map((coordinates: string) => coordinates.split(",").map(Number));
  const instructions = input[1].map((instruction) => instruction.substring(11));
  let paper: string[][] = [];

  const largestCoords = getLargestCoords(points);

  for (let i = 0; i < largestCoords[1]; i++) {
    paper.push(Array(largestCoords[0]).fill(" "));
  }

  for (let point of points) {
    paper[point[1]][point[0]] = "#";
  }

  // fold x or y as instructed.
  for (let instruction of instructions) {
    paper = instruction[0] === "y" ? foldY(paper) : (paper = foldX(paper));
  }

  printPaper(paper);
};

run({
  part1: {
    tests: [
      {
        input: `
          6,10
          0,14
          9,10
          0,3
          10,4
          4,11
          6,0
          6,12
          4,1
          0,13
          10,12
          3,4
          3,0
          8,4
          1,10
          2,14
          8,10
          9,0

          fold along y=7
          fold along x=5`,
        expected: 17,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
});
