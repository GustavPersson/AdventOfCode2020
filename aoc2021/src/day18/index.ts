import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

interface SnailPair {
  data: [number | SnailPair, number | SnailPair];
  parent: SnailPair | null;
}

interface NumberedSnailPair extends SnailPair {
  data: [number, number];
}

const parseInput = (rawInput: string) => getLines(rawInput);

const parseSnailPair = (rawInput: string) => {
  rawInput = rawInput.replace(/\s+/g, "");

  const pair: SnailPair = { data: [-1, -1], parent: null };

  for (let i = 1; i < rawInput.length - 1; i++) {
    const char = rawInput[i];
    if (char === ",") continue;

    if (char === "[") {
      const start = i;
      let openBrackets = 0;

      do {
        const otherChar = rawInput[i++];

        if (otherChar === "[") {
          openBrackets++;
        } else if (otherChar === "]") {
          openBrackets--;
        }
      } while (openBrackets > 0);

      const subGroup = rawInput.substring(start, i);
      const subPair = parseSnailPair(subGroup);
      subPair.parent = pair;

      pair.data[pair.data.indexOf(-1)] = subPair;
      continue;
    }

    if (isNaN(Number(char))) throw new Error("Invalid input character: " + char);

    let numStr = char;

    while (!isNaN(Number(rawInput[i + 1]))) {
      numStr += rawInput[++i];
    }

    pair.data[pair.data.indexOf(-1)] = Number(numStr);
  }

  return pair;
};

const findPairToSplit = (pair: SnailPair): { pair: SnailPair; index: number } | null => {
  for (let i = 0; i < pair.data.length; i++) {
    const element = pair.data[i];

    if (typeof element === "number") {
      if (element < 10) continue;
      return { pair, index: i };
    }

    const result = findPairToSplit(element);
    if (result !== null) return result;
  }

  return null;
};

const splitPair = (pair: SnailPair, index: number) => {
  const num = pair.data[index];
  if (typeof num !== "number") throw new Error("Cannot split a non-number element");
  const half = num / 2;

  pair.data[index] = {
    data: [Math.floor(half), Math.ceil(half)],
    parent: pair,
  };
};

const addToSidemost = (pair: SnailPair, value: number, side: 0 | 1) => {
  if (typeof pair.data[side] === "number") {
    (pair.data[side] as number) += value;
  } else {
    addToSidemost(pair.data[side] as SnailPair, value, side);
  }
};

const addToSideIfNumberElseToOtherSidemost = (pair: SnailPair, value: number, side: 0 | 1) => {
  if (typeof pair.data[side] === "number") {
    (pair.data[side] as number) += value;
  } else {
    addToSidemost(pair.data[side] as SnailPair, value, side === 1 ? 0 : 1);
  }
};

const isNumberedSnailPair = (pair: SnailPair): pair is NumberedSnailPair => pair.data.every((element) => typeof element === "number");

const findPairToExplode = (pair: SnailPair, depth: number): NumberedSnailPair | null => {
  if (depth >= 4) {
    if (!isNumberedSnailPair(pair)) {
      throw new Error("Cannot explode a pair with non-number elements");
    }
    return pair;
  }

  for (const element of pair.data) {
    if (typeof element === "number") continue;

    const toExplode = findPairToExplode(element, depth + 1);
    if (toExplode !== null) return toExplode;
  }

  return null;
};

const findParentWithChildOnOtherSide = (pair: SnailPair): SnailPair | null => {
  if (!pair.parent) {
    return null;
  }

  const indexInParent = pair.parent.data.indexOf(pair);

  let checkingAgainst = pair.parent;
  let checking = pair.parent.parent;

  while (checking?.data[indexInParent] === checkingAgainst) {
    checkingAgainst = checking;
    checking = checking.parent;
  }

  return checking;
};

const explodePair = (pair: NumberedSnailPair): void => {
  if (!pair.parent) throw new Error("Cannot explode a pair without a parent");

  const indexAtParent = pair.parent.data.indexOf(pair);
  if (indexAtParent === -1) throw new Error("idk just in case");

  // Megumin moment
  if (indexAtParent === 0) {
    // Left element exploded
    addToSideIfNumberElseToOtherSidemost(pair.parent, pair.data[1], 1);

    const root = findParentWithChildOnOtherSide(pair);
    if (root !== null) {
      addToSideIfNumberElseToOtherSidemost(root, pair.data[0], 0);
    }
  } else {
    // Right element exploded
    addToSideIfNumberElseToOtherSidemost(pair.parent, pair.data[0], 0);

    const root = findParentWithChildOnOtherSide(pair);
    if (root !== null) {
      addToSideIfNumberElseToOtherSidemost(root, pair.data[1], 1);
    }
  }

  pair.parent.data[indexAtParent] = 0;
};

const snailMagnitude = (pair: SnailPair): number => {
  const [left, right] = pair.data;

  const first = typeof left === "number" ? left : snailMagnitude(left);
  const second = typeof right === "number" ? right : snailMagnitude(right);

  return 3 * first + 2 * second;
};

const reducePair = (pair: SnailPair) => {
  while (true) {
    const toExplode = findPairToExplode(pair, 0);
    if (toExplode) {
      explodePair(toExplode);
      continue;
    }

    const toSplit = findPairToSplit(pair);
    if (toSplit) {
      splitPair(toSplit.pair, toSplit.index);
      continue;
    }

    break;
  }
};

function cloneSnailPair(pair: SnailPair): SnailPair {
  function verifyPairParents(pair: SnailPair) {
    for (const element of pair.data) {
      if (typeof element === "number") continue;

      element.parent = pair;
      verifyPairParents(element);
    }
  }

  const newData = pair.data.map((element) => (typeof element === "number" ? element : cloneSnailPair(element))) as SnailPair["data"];

  const clone: SnailPair = {
    data: newData,
    parent: pair.parent,
  };

  verifyPairParents(clone);
  return clone;
}

function addSnailPairs(pair1: SnailPair, pair2: SnailPair) {
  const newPair: SnailPair = {
    data: [cloneSnailPair(pair1), cloneSnailPair(pair2)],
    parent: null,
  };

  for (const element of newPair.data) {
    (element as SnailPair).parent = newPair;
  }

  reducePair(newPair);
  return newPair;
}

const part1: Solution = (rawInput: string) => {
  const pairs = parseInput(rawInput).map(parseSnailPair);

  let rootPair = pairs[0];

  for (let i = 1; i < pairs.length; i++) {
    rootPair = addSnailPairs(rootPair, pairs[i]);
  }

  return snailMagnitude(rootPair);
};

const part2: Solution = (rawInput: string) => {
  const pairs = parseInput(rawInput).map(parseSnailPair);

  let max = 0;

  for (let i1 = 0; i1 < pairs.length; i1++) {
    for (let i2 = i1 + 1; i2 < pairs.length; i2++) {
      const sum1 = snailMagnitude(addSnailPairs(pairs[i1], pairs[i2]));
      const sum2 = snailMagnitude(addSnailPairs(pairs[i2], pairs[i1]));

      if (sum1 > max) max = sum1;
      if (sum2 > max) max = sum2;
    }
  }

  return max;
};

run({
  part1: {
    tests: [
      {
        input: `
          [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
          [[[5,[2,8]],4],[5,[[9,9],0]]]
          [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
          [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
          [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
          [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
          [[[[5,4],[7,7]],8],[[8,3],8]]
          [[9,3],[[9,9],[6,[4,9]]]]
          [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
          [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
      `,
        expected: 4140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
          [[[5,[2,8]],4],[5,[[9,9],0]]]
          [6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
          [[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
          [[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
          [[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
          [[[[5,4],[7,7]],8],[[8,3],8]]
          [[9,3],[[9,9],[6,[4,9]]]]
          [[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
          [[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
      `,
        expected: 3993,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
