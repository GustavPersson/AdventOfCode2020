import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

log.enableAll();

const parseInput = (rawInput: string) => rawInput.split(",").map(Number);

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const max = _.max(input) as number;
  const fuelCosts: Array<number> = [];

  for (let position = 0; position <= max; position++) {
    const fuelCostforEachCrab = [];
    for (const crab of input) {
      fuelCostforEachCrab.push(Math.abs(crab - position));
    }
    fuelCosts.push(_.reduce(fuelCostforEachCrab, (a, b) => a + b) as number);
  }

  return _.min(fuelCosts) as number;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const max = _.max(input) as number;
  const fuelCosts: Array<number> = [];

  for (let position = 0; position <= max; position++) {
    const fuelCostforEachCrab = [];
    for (const crab of input) {
      const distanceForCrabToMove = Math.abs(crab - position);

      let fuelCostForCrab = 0;
      for (let i = 0; i <= distanceForCrabToMove; i++) {
        fuelCostForCrab += i;
      }
      fuelCostforEachCrab.push(fuelCostForCrab);
    }
    fuelCosts.push(_.reduce(fuelCostforEachCrab, (a, b) => a + b) as number);
  }
  return _.min(fuelCosts) as number;
};

run({
  part1: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 37 }],
    solution: part1,
  },
  part2: {
    tests: [{ input: `16,1,2,0,4,2,7,1,2,14`, expected: 168 }],
    solution: part2,
  },
  trimTestInputs: true,
});
