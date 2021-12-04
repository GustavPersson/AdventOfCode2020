import run from "aocrunner";
import _ from 'lodash';


const parseInput = (rawInput: string) => rawInput;

let gammaRate: string;
let epsilonRate: string;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/);
  
  const reducedInput = _.reduce(input, (sum, n) => {
    const splitString = n.split("").map(Number);
    const returnArray = splitString.map((num, idx) => {
      return _.add(num, sum[idx]);
    });
  return returnArray;
  }, [0, 0, 0, 0, 0]);

  gammaRate = reducedInput.map((val) => val > input.length / 2 ? 1 : 0).join("");
  epsilonRate = reducedInput.map((val) => val < input.length / 2 ? 1 : 0).join("");

  return _.multiply(_.parseInt(gammaRate, 2), _.parseInt(epsilonRate, 2));

};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput).split(/\n/);
  
  let o2Found = false;

  let o2gen = input;
  let bitPosition = 0;

  while (!o2Found) {
    const gammaFilteredInput = _.filter(o2gen, (item, index, collection) => {
      const count = [0, 0];
      _.forEach(collection, (countItem) => {
        const splitString = countItem.split("").map(Number);

        splitString[bitPosition] === 1 ? count[1]++ : count[0]++;
      });

      const mostCommonNumber = count[1] >= count[0] ? 1 : 0;

      const itemAsArray = item.split("").map(Number);
      return mostCommonNumber === itemAsArray[bitPosition];
    });
    o2gen = gammaFilteredInput;
    
    if (o2gen.length <= 1) {
      o2Found = true;
    }
    bitPosition++;
  }

  let co2Found = false;

  let co2gen = input;

  bitPosition = 0;

  while (!co2Found) {
    const epsilonFilteredInput = _.filter(co2gen, (item, index, collection) => {
      const count = [0, 0];
      _.forEach(collection, (countItem) => {
        const splitString = countItem.split("").map(Number);

        splitString[bitPosition] === 1 ? count[1]++ : count[0]++;
      });

      const leastCommonNumber = count[0] <= count[1] ? 0 : 1;

      const itemAsArray = item.split("").map(Number);
      return leastCommonNumber === itemAsArray[bitPosition];
    });
    co2gen = epsilonFilteredInput;
    
    if (co2gen.length <= 1) {
      co2Found = true;
    }
    bitPosition++;
  }

  return _.multiply(_.parseInt(o2gen.join(""), 2), _.parseInt(co2gen.join(""), 2));
};

run({
  part1: {
    tests: [
      { input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 198 },    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `00100
11110
10110
10111
10101
01111
00111
11100
10000
11001
00010
01010`, expected: 230
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
