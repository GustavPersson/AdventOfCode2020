import _ from "lodash";

/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
export function getLines(rawInput: string): string[] {
  return rawInput
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l);
}

export function getLineGroups(rawInput: string): string[][] {
  const parts: string[][] = [[]];

  for (const line of rawInput.split(/\n/)) {
    if (!line.trim().length) {
      parts.push([]);
    } else {
      parts[parts.length - 1].push(line);
    }
  }

  return parts.filter((part) => part.length > 0);
}

export function getLinesAsGrid(rawInput: string): string[][] {
  return getLines(rawInput).map((line) => line.split(""));
}

export function getLinesAsGridOfNumbers(rawInput: string): number[][] {
  return getLines(rawInput).map((line) => line.split("").map(Number));
}

export function getLineGroupsAsNumbers(rawInput: string): number[][] {
  const parts: number[][] = [[]];

  for (const line of rawInput.split(/\n/)) {
    if (!line.trim().length) {
      parts.push([]);
    } else {
      parts[parts.length - 1].push(parseInt(line, 10));
    }
  }

  return parts.filter((part) => part.length > 0);
}

export const parseNumbers = (str: string) =>
  str
    .split(" ")
    .filter((x) => x !== "")
    .map((x) => parseInt(x));

/**
 * @function greatestCommonFactor
 * @description Determine the greatest common factor of a group of numbers.
 * @param {Number[]} nums - An array of numbers.
 * @return {Number} - The greatest common factor.
 * @see https://www.mathsisfun.com/greatest-common-factor.html
 * @example GreatestCommonFactor(12, 8) = 4
 * @example GreatestCommonFactor(3, 6) = 3
 * @example GreatestCommonFactor(32, 16, 12) = 4
 */

export const binaryGCF = (a: number, b: number): number => {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) {
    throw new Error("numbers must be natural to determine factors");
  }

  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

export const greatestCommonFactor = (nums: number[]): number => {
  if (nums.length === 0) {
    throw new Error("at least one number must be passed in");
  }

  return nums.reduce(binaryGCF);
};

/**
 * @function lowestCommonMultiple
 * @description Determine the lowest common multiple of a group of numbers.
 * @param {Number[]} nums - An array of numbers.
 * @return {Number} - The lowest common multiple.
 * @see https://www.mathsisfun.com/least-common-multiple.html
 * @example LowestCommonMultiple(3, 4) = 12
 * @example LowestCommonMultiple(8, 6) = 24
 * @example LowestCommonMultiple(5, 8, 3) = 120
 */

//A naive solution which requires no additional mathematical algorithm

export const naiveLCM = (nums: number[]): number => {
  if (nums.some((num) => num < 0)) {
    throw new Error(
      "numbers must be positive to determine lowest common multiple",
    );
  }

  if (nums.length === 0) {
    throw new Error("at least one number must be passed in");
  }

  const max_num = Math.max(...nums);
  let current_num = max_num;

  while (true) {
    if (nums.every((num) => current_num % num === 0)) {
      return current_num;
    } else {
      current_num += max_num;
    }
  }
};

//A typically more efficient solution which requires prior knowledge of GCF
//Note that due to utilizing GCF, which requires natural numbers, this method only accepts natural numbers.

export const binaryLCM = (a: number, b: number): number => {
  if (a < 0 || b < 0) {
    throw new Error(
      "numbers must be positive to determine lowest common multiple",
    );
  }

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new Error(
      "this method, which utilizes GCF, requires natural numbers.",
    );
  }

  return (a * b) / greatestCommonFactor([a, b]);
};

export const lowestCommonMultiple = (nums: number[]): number => {
  if (nums.length === 0) {
    throw new Error("at least one number must be passed in");
  }

  return nums.reduce(binaryLCM);
};

export const rotateGrid = <T>(source: T[][]) => {
  let result: T[][] = [];
  source.forEach((a, i, aa) =>
    a.forEach((b, j, bb) => {
      result[bb.length - j - 1] = result[bb.length - j - 1] || [];
      result[bb.length - j - 1][i] = b;
    }),
  );
  return result;
};
