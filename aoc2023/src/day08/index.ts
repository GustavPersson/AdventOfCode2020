import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLineGroups, lowestCommonMultiple } from '../utils/index.js';

log.enableAll();

const parseInput = (rawInput: string) => getLineGroups(rawInput);

const findExit = (
  instructions: string,
  fromNode: string,
  nodeMap: Map<string, string[]>,
) => {
  let foundExit = false;
  let instructionNumber = 0;
  let numberOfSteps = 0;
  let currentNode = fromNode;

  while (!foundExit) {
    numberOfSteps++;
    const instruction = instructions[instructionNumber];

    const [left, right] = nodeMap.get(currentNode) as string[];

    currentNode = instruction === 'L' ? left : right;
    let nodeEndsInZ = currentNode.toString().endsWith('Z');

    if (nodeEndsInZ) {
      foundExit = true;
    }

    if (instructionNumber >= instructions.length - 1) {
      instructionNumber = 0;
    } else {
      instructionNumber++;
    }
  }

  return numberOfSteps;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let [instArr, nodes] = input;
  const [instructions] = instArr;

  const nodeMap = new Map<string, string[]>();

  nodes.forEach((node) => {
    const split = node.split(' = ');
    nodeMap.set(split[0], split[1].replace(/[\(\)]/g, '').split(', '));
  });

  let foundExit = false;
  let instructionNumber = 0;
  let currentNode = 'AAA';
  let numberOfSteps = 0;

  while (!foundExit) {
    numberOfSteps++;
    const instruction = instructions[instructionNumber];
    const [left, right] = nodeMap.get(currentNode) as string[];

    currentNode = instruction === 'L' ? left : right;

    if (instructionNumber >= instructions.length - 1) {
      instructionNumber = 0;
    } else {
      instructionNumber++;
    }
    foundExit = currentNode === 'ZZZ';
  }

  return numberOfSteps;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let [instArr, nodes] = input;
  const [instructions] = instArr;

  const nodeMap = new Map<string, string[]>();

  nodes.forEach((node) => {
    const split = node.split(' = ');
    nodeMap.set(split[0], split[1].replace(/[\(\)]/g, '').split(', '));
  });

  const startNodes = [];

  for (let key of nodeMap.keys()) {
    if (key.toString().endsWith('A')) {
      startNodes.push(key);
    }
  }

  const numberOfSteps = startNodes.map((node) =>
    findExit(instructions, node, nodeMap),
  );

  return lowestCommonMultiple(numberOfSteps);
};

run({
  part1: {
    tests: [
      {
        input: `
        RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `
        LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        LR

        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)        
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
