import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

const parseInput = (rawInput: string) => getLines(rawInput);

class MonadProgram {
  public currentDigit = 0;
  public z = 0;

  private divisors: number[] = [];
  private matchOffsets: number[] = [];
  private counterAdds: number[] = [];

  public constructor(instructions: string[]) {
    for (let i = 0; i < instructions.length; i += 18) {
      const divisorWords = instructions[i + 4].split(/\s+/);
      const matchOffsetWords = instructions[i + 5].split(/\s+/);
      const counterAddWords = instructions[i + 15].split(/\s+/);

      this.divisors.push(Number(divisorWords[2]));
      this.matchOffsets.push(Number(matchOffsetWords[2]));
      this.counterAdds.push(Number(counterAddWords[2]));
    }
  }

  public nextDigit(digit: number): boolean {
    let newZ = this.z;

    const divisor = this.divisors[this.currentDigit];
    const matchOffset = this.matchOffsets[this.currentDigit];

    const decrease = divisor > 1;
    const shouldNotIncrease = matchOffset < 10;

    if (decrease === !shouldNotIncrease) throw new Error("Cannot increase and decrease Z on the same digit");

    if (decrease) {
      newZ = Math.floor(this.z / divisor);
    }

    if (shouldNotIncrease) {
      const matchInputTest = (this.z % 26) + matchOffset;

      if (matchInputTest !== digit) {
        // Z was about to increase when it shouldn't have
        return false;
      }
    } else {
      newZ *= 26;
      newZ += digit + this.counterAdds[this.currentDigit];
    }

    this.z = newZ;
    this.currentDigit++;
    return true;
  }
}

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput);
  const program = new MonadProgram(input);
  const digits = Array(14).fill(9);

  while (true) {
    if (!program.nextDigit(digits[program.currentDigit])) {
      if (program.currentDigit >= 14) throw new Error("Could not find a valid number");

      digits[program.currentDigit]--;

      let wrapIndex: number;
      while ((wrapIndex = digits.lastIndexOf(0)) !== -1) {
        if (wrapIndex === 0) throw new Error("Cannot wrap first digit");

        digits[wrapIndex] = 9;
        digits[wrapIndex - 1]--;

        program.currentDigit = 0;
        program.z = 0;
      }
    } else if (program.currentDigit >= 14) {
      return Number(digits.join(""));
    }
  }
};

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput);
  const program = new MonadProgram(input);

  const digits = Array(14).fill(1);

  while (true) {
    if (!program.nextDigit(digits[program.currentDigit])) {
      if (program.currentDigit >= 14) throw new Error("Could not find a valid number");

      digits[program.currentDigit]++;

      let wrapIndex: number;
      while ((wrapIndex = digits.lastIndexOf(10)) !== -1) {
        if (wrapIndex === 0) throw new Error("Cannot wrap first digit");

        digits[wrapIndex] = 1;
        digits[wrapIndex - 1]++;

        program.currentDigit = 0;
        program.z = 0;
      }
    } else if (program.currentDigit >= 14) {
      return Number(digits.join(""));
    }
  }
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
