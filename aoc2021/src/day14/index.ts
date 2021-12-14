import run from "aocrunner";
import { Map } from "immutable";
import _ from "lodash";
import log from "loglevel";

import { getLineGroups } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => {
  const input = getLineGroups(rawInput);

  const polymerTemplate = _.first(input[0]) as string;
  let pairInsertionRules: Map<string, string> = Map();

  input[1].forEach((line) => {
    const [adjacent, insertion] = line.split(" -> ");
    pairInsertionRules = pairInsertionRules.set(adjacent, insertion);
  });

  return { polymerTemplate, pairInsertionRules };
};

const step = (pattern: Map<string, number>, rules: Map<string, string>): Map<string, number> => {
  let out = Map<string, number>();

  for (let [key, cnt] of pattern) {
    if (rules.has(key)) {
      out = out.update(key[0] + rules.get(key)!, 0, (v) => v + cnt);
      out = out.update(rules.get(key)! + key[1], 0, (v) => v + cnt);
    }
  }

  return out;
};

const part1 = (rawInput: string) => {
  const { polymerTemplate, pairInsertionRules } = parseInput(rawInput);

  let pat = Map<string, number>();

  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    pat = pat.update(polymerTemplate[i] + polymerTemplate[i + 1], 0, (v) => v + 1);
  }

  for (let i = 0; i < 10; i++) {
    pat = step(pat, pairInsertionRules);
  }

  let outMap = Map<string, number>();
  outMap = outMap.update(polymerTemplate[0], 0, (v) => v + 1);
  outMap = outMap.update(polymerTemplate[polymerTemplate.length - 1], 0, (v) => v + 1);

  for (let [k, c] of pat) {
    outMap = outMap.update(k[0], 0, (v) => v + c);
    outMap = outMap.update(k[1], 0, (v) => v + c);
  }

  let min = outMap.minBy((v) => v)!;
  let max = outMap.maxBy((v) => v)!;

  return (max - min) / 2;
};

const part2 = (rawInput: string) => {
  const { polymerTemplate, pairInsertionRules } = parseInput(rawInput);

  let pat = Map<string, number>();

  for (let i = 0; i < polymerTemplate.length - 1; i++) {
    pat = pat.update(polymerTemplate[i] + polymerTemplate[i + 1], 0, (v) => v + 1);
  }

  for (let i = 0; i < 40; i++) {
    pat = step(pat, pairInsertionRules);
  }

  let outMap = Map<string, number>();
  outMap = outMap.update(polymerTemplate[0], 0, (v) => v + 1);
  outMap = outMap.update(polymerTemplate[polymerTemplate.length - 1], 0, (v) => v + 1);

  for (let [k, c] of pat) {
    outMap = outMap.update(k[0], 0, (v) => v + c);
    outMap = outMap.update(k[1], 0, (v) => v + c);
  }

  let min = outMap.minBy((v) => v)!;
  let max = outMap.maxBy((v) => v)!;

  return (max - min) / 2;
};

run({
  part1: {
    tests: [
      {
        input: `
          NNCB

          CH -> B
          HH -> N
          CB -> H
          NH -> C
          HB -> C
          HC -> B
          HN -> C
          NN -> C
          BH -> H
          NC -> B
          NB -> B
          BN -> B
          BB -> N
          BC -> B
          CC -> N
          CN -> C
    `,
        expected: 1588,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          NNCB

          CH -> B
          HH -> N
          CB -> H
          NH -> C
          HB -> C
          HC -> B
          HN -> C
          NN -> C
          BH -> H
          NC -> B
          NB -> B
          BN -> B
          BB -> N
          BC -> B
          CC -> N
          CN -> C
    `,
        expected: 2188189693529,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
