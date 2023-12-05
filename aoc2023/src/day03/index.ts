import run from 'aocrunner';
import _, { forEach } from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';
log.enableAll();

const symbolRegex = /[^0-9.]/g;

type Match = { text: string; start: number; end: number; line: number };

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);
  return lines;
};
const replaceNumberWithDot = (
  currIndex: number,
  lineIndex: number,
  lines: string[],
) => {
  const arr = lines[lineIndex].split('');
  arr.splice(currIndex, 1, '.');
  const newStr = arr.join('');
  lines[lineIndex] = newStr;
};

const getNumber = (currIndex: number, lineIndex: number, lines: string[]) => {
  let number = lines[lineIndex][currIndex];

  // replace right
  for (let i = currIndex + 1; i < lines[lineIndex].length; i++) {
    if (isNaN(+lines[lineIndex][i])) break;

    number = number + lines[lineIndex][i];
    replaceNumberWithDot(i, lineIndex, lines);
  }

  // replace left
  for (let i = currIndex - 1; i >= 0; i--) {
    if (isNaN(+lines[lineIndex][i])) break;

    number = lines[lineIndex][i] + number;
    replaceNumberWithDot(i, lineIndex, lines);
  }

  return +number;
};

const getSumOfAjacentNumbers = (
  symbolIndex: number,
  lineIndex: number,
  lines: string[],
) => {
  let sum = 0;
  // left
  if (
    lines[lineIndex][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex][symbolIndex - 1])
  )
    sum += getNumber(symbolIndex - 1, lineIndex, lines);
  // right
  if (
    lines[lineIndex][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex][symbolIndex + 1])
  )
    sum += getNumber(symbolIndex + 1, lineIndex, lines);
  // top
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex])
  )
    sum += getNumber(symbolIndex, lineIndex - 1, lines);
  // bottom
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex])
  )
    sum += getNumber(symbolIndex, lineIndex + 1, lines);

  // Top left diag
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex - 1])
  )
    sum += getNumber(symbolIndex - 1, lineIndex - 1, lines);
  // Top right diag
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex + 1])
  )
    sum += getNumber(symbolIndex + 1, lineIndex - 1, lines);
  // Bottom left diag
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex - 1])
  )
    sum += getNumber(symbolIndex - 1, lineIndex + 1, lines);
  // Bottom right diag
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex + 1])
  )
    sum += getNumber(symbolIndex + 1, lineIndex + 1, lines);

  return sum;
};

const getGearRatio = (
  symbolIndex: number,
  lineIndex: number,
  lines: string[],
) => {
  let nums = [];
  // left
  if (
    lines[lineIndex][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex][symbolIndex - 1])
  )
    nums.push(getNumber(symbolIndex - 1, lineIndex, lines));
  // right
  if (
    lines[lineIndex][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex][symbolIndex + 1])
  )
    nums.push(getNumber(symbolIndex + 1, lineIndex, lines));
  // top
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex, lineIndex - 1, lines));
  // bottom
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex, lineIndex + 1, lines));

  // Top left diag
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex - 1]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex - 1, lineIndex - 1, lines));
  // Top right diag
  if (
    lines[lineIndex - 1] &&
    lines[lineIndex - 1][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex - 1][symbolIndex + 1]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex + 1, lineIndex - 1, lines));
  // Bottom left diag
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex - 1] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex - 1]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex - 1, lineIndex + 1, lines));
  // Bottom right diag
  if (
    lines[lineIndex + 1] &&
    lines[lineIndex + 1][symbolIndex + 1] &&
    !isNaN(+lines[lineIndex + 1][symbolIndex + 1]) &&
    nums.length < 2
  )
    nums.push(getNumber(symbolIndex + 1, lineIndex + 1, lines));

  return nums.length < 2 ? 0 : nums.reduce((prev, curr) => prev * curr, 1);
};

const addAjacentNumbers = (
  lineIndex: number,
  line: string,
  lines: string[],
  isPartTwo = false,
) => {
  let sum = 0;

  for (let i = 0; i < line.length; i++) {
    const char = lines[lineIndex][i];
    if (symbolRegex.test(char)) {
      if (isPartTwo) {
        sum += getGearRatio(i, lineIndex, lines);
      } else {
        sum += getSumOfAjacentNumbers(i, lineIndex, lines);
      }
    }
  }

  return sum;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let finalNumber = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    if (symbolRegex.test(line)) {
      finalNumber += addAjacentNumbers(i, line, input);
    }
  }

  return finalNumber;
};

const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  let finalNumber = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (symbolRegex.test(line))
      finalNumber += addAjacentNumbers(i, line, lines, true);
  }

  return finalNumber;
};

run({
  part1: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..
`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
