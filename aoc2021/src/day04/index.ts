import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLineGroups } from "../utils/index.js";

log.enableAll();

type Board = (number | null)[][];

const parseInput = (rawInput: string): { boards: Board[]; drawnNumbers: number[] } => {
  const groups = getLineGroups(rawInput);

  const drawnNumbers = groups[0][0].split(",").map((d) => parseInt(d, 10));
  const boards = groups.slice(1).map((group) =>
    group.map((line) =>
      line
        .trim()
        .split(/\s+/g)
        .map((n) => parseInt(n, 10)),
    ),
  );

  return { boards, drawnNumbers };
};

const mark = (board: Board, number: number) => {
  board.forEach((line, y) => {
    line.forEach((cell, x) => {
      if (cell === number) {
        board[y][x] = null;
      }
    });
  });
};

const isWon = (board: Board) => {
  for (const line of board) {
    if (line.every((val) => val === null)) {
      return true;
    }
  }

  for (let i = 0; i < board[0].length; i++) {
    if (board.every((line) => line[i] === null)) {
      return true;
    }
  }

  return false;
};

const getScore = (board: Board) => {
  let value = 0;
  board.forEach((line) => {
    line.forEach((cell) => {
      if (cell !== null) {
        value = value + cell;
      }
    });
  });

  return value;
};

const part1 = (rawInput: string) => {
  const { drawnNumbers, boards } = parseInput(rawInput);

  for (const number of drawnNumbers) {
    for (const board of boards) {
      mark(board, number);
      if (isWon(board)) {
        return getScore(board) * number;
      }
    }
  }
};

const part2 = (rawInput: string) => {
  const { drawnNumbers, boards } = parseInput(rawInput);

  for (const number of drawnNumbers) {
    for (let i = boards.length - 1; i >= 0; i--) {
      const board = boards[i];
      mark(board, number);
      if (isWon(board)) {
        if (boards.length === 1) {
          return getScore(board) * number;
        }
        boards.splice(i, 1);
      }
    }
  }
};

run({
  part1: {
    tests: [
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7`,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
