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
export const TWO_PI = Math.PI * 2;

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

export function wrapRotation(angle: number): number {
  while (angle < 0) angle += TWO_PI;
  return angle % TWO_PI;
}
