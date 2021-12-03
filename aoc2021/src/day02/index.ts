import run from "aocrunner";
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/).map((row) => {
    const splitRow = row.split(' ');
    return [splitRow[0], Number(splitRow[1])];
  });
  
  const position = [0, 0];

  _.forEach(input, (operation) => {
    switch (operation[0]) {
      case "up":
        position[0] = _.subtract(position[0], operation[1] as number);
        break;
      case "down":
        position[0] = _.add(position[0], operation[1] as number);
        break;
      case "forward":
        position[1] = _.add(position[1], operation[1] as number);
        break;
      default:
        break;
    }
  });

  return _.multiply(position[0], position[1]);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/).map((row) => {
    const splitRow = row.split(' ');
    return [splitRow[0], Number(splitRow[1])];
  });
  
  const position = [0, 0, 0];

  _.forEach(input, (operation) => {
    switch (operation[0]) {
      case "up":
        position[2] = _.subtract(position[2], operation[1] as number);
        break;
      case "down":
        position[2] = _.add(position[2], operation[1] as number);
        break;
      case "forward":
        position[0] = _.add(position[0], _.multiply(operation[1] as number, position[2]));
        position[1] = _.add(position[1], operation[1] as number);
        break;
      default:
        break;
    }
  });

  return _.multiply(position[0], position[1]);
};

run({
  part1: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // { input: ``, expected: "" },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
