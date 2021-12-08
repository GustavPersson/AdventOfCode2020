import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

interface SignalPatterns {
  [key: string]: number;
}

const parseInput = (rawInput: string) => getLines(rawInput).map((line) => [...line.split(" | ")]);

const decodeNumbers = (input: Array<string>): SignalPatterns => {
  let decodedNumbers: string[] = ["", "", "", "", "", "", "", "", "", ""];

  // Sort the input by length first
  input.sort((a, b) => a.length - b.length);

  // Now the unique lengths are known, it's the three shortest and the longest
  decodedNumbers[1] = input.shift() as string;
  decodedNumbers[7] = input.shift() as string;
  decodedNumbers[4] = input.shift() as string;
  decodedNumbers[8] = input.pop() as string;

  // We know that 3, 2, 5 are 5 long
  let threeTwoFive = input.slice(0, 3);
  // And we know that 0, 9, 6 are 6 long
  let zeroNineSix = input.slice(3, 6);

  // We also know that 1 completely overlaps 0 and 9, but not 6, so we now know 6
  decodedNumbers[6] = zeroNineSix.filter((e) => ![...decodedNumbers[1]].every((f) => e.includes(f)))[0];
  zeroNineSix = zeroNineSix.filter((e) => e !== decodedNumbers[6]);
  // 4 completely overlaps with 9 but not 0
  decodedNumbers[0] = zeroNineSix.filter((e) => ![...decodedNumbers[4]].every((f) => e.includes(f)))[0];
  zeroNineSix = zeroNineSix.filter((e) => e !== decodedNumbers[0]);
  decodedNumbers[9] = zeroNineSix[0];

  // For the others, we know 1 completely overlaps with 3 but not 2 or 5, and 5 completely overlaps with 6).
  decodedNumbers[3] = threeTwoFive.filter((e) => [...decodedNumbers[1]].every((f) => e.includes(f)))[0];
  threeTwoFive = threeTwoFive.filter((e) => e !== decodedNumbers[3]);

  decodedNumbers[5] = threeTwoFive.filter((e) => [...e].every((f) => decodedNumbers[6].includes(f)))[0];
  threeTwoFive = threeTwoFive.filter((e) => e !== decodedNumbers[5]);

  decodedNumbers[2] = threeTwoFive[0];

  return Object.fromEntries([...decodedNumbers.map((num) => [...num].sort().join("")).entries()].map((e) => [e[1], e[0]]));
};

const checkNumber = (outputValue: string) => {
  switch (outputValue.length) {
    case 2:
      return 1;
    case 4:
      return 4;
    case 3:
      return 7;
    case 7:
      return 8;
    default:
      return -1;
      break;
  }
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const wantedOutputs = [1, 4, 7, 8];
  const foundOutputs = [];

  for (const line of input) {
    for (const outputValue of line[1].split(" ")) {
      const checkedNumber = checkNumber(outputValue);
      if (wantedOutputs.includes(checkedNumber)) {
        foundOutputs.push(checkedNumber);
      }
    }
  }

  return foundOutputs.length;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const decodedNumbers: Array<number> = [];

  for (const line of input) {
    const decoderInput = line[0].split(" ").map((outputValue) => outputValue.split("").sort().join(""));

    const decodingKey = decodeNumbers(decoderInput);

    const nums: Array<number> = [];
    for (const code of line[1].split(" ")) {
      let sortedCode = code.split("").sort().join("");
      nums.push(decodingKey[sortedCode]);
    }
    decodedNumbers.push(parseInt(nums.join(""), 10));
  }

  return _.sum(decodedNumbers);
};

run({
  part1: {
    tests: [
      {
        input: `
        be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
        edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
        fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
        fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
        aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
        fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
        dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
        bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
        egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
        gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
        `,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
        edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
        fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
        fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
        aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
        fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
        dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
        bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
        egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
        gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
        `,
        expected: 61229,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
