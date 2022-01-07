import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";
import { List } from "immutable";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

interface Cucumber {
  facing: "east" | "south";
}
const formatCucumbers = (cucumbers: List<List<Cucumber | null>>): string => {
  const lines: string[] = [];

  for (let y = 0; y < cucumbers.size; y++) {
    let line = "";

    for (let x = 0; x < cucumbers.get(y).size; x++) {
      const cucumber = cucumbers.getIn([y, x]) as Cucumber | null;
      line += !cucumber ? "." : cucumber.facing === "east" ? ">" : "v";
    }

    lines.push(line.split("").join(" "));
  }

  return lines.join("\n");
};

const parseInput = (rawInput: string) => {
  const lines = getLines(rawInput);
  let out: List<List<Cucumber | null>> = List();

  for (let y = 0; y < lines.length; y++) {
    out = out.set(y, List());
    for (let x = 0; x < lines[y].length; x++) {
      const char = lines[y][x];

      out = out.setIn(
        [y, x],
        char === "."
          ? null
          : {
              facing: char === ">" ? "east" : "south",
            },
      );
    }
  }

  return out;
};

const part1: Solution = (rawInput: string) => {
  let cucumbers = parseInput(rawInput);

  for (let step = 1; ; step++) {
    let movedAtLeastOne = false;
    let newCucumbers = cucumbers;

    for (let y = 0; y < cucumbers.size; y++) {
      for (let x = 0; x < cucumbers.get(y).size; x++) {
        const cucumber = cucumbers.getIn([y, x]) as Cucumber | null;
        if (cucumber?.facing !== "east") {
          continue;
        }

        const destX = (x + 1) % cucumbers.get(y).size;
        if (cucumbers.getIn([y, destX]) === null) {
          newCucumbers = newCucumbers.setIn([y, x], null);
          newCucumbers = newCucumbers.setIn([y, destX], cucumber);
          movedAtLeastOne = true;
        }
      }
    }

    cucumbers = newCucumbers;

    for (let y = 0; y < cucumbers.size; y++) {
      for (let x = 0; x < cucumbers.get(y).size; x++) {
        const cucumber = cucumbers.getIn([y, x]) as Cucumber;
        if (cucumber?.facing !== "south") continue;

        const destY = (y + 1) % cucumbers.size;
        if (cucumbers.getIn([destY, x]) === null) {
          newCucumbers = newCucumbers.setIn([y, x], null);
          newCucumbers = newCucumbers.setIn([destY, x], cucumber);
          movedAtLeastOne = true;
        }
      }
    }

    cucumbers = newCucumbers;

    if (!movedAtLeastOne) {
      return step;
    }
  }
};

const part2: Solution = (rawInput: string) => {
  // const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
          v...>>.vv>
          .vv>>.vv..
          >>.>v>...v
          >>v>>.>.v.
          v>v.vv.v..
          >.>>..v...
          .vv..>.>v.
          v.v..>>v.v
          ....v..v.>
        `,
        expected: 58,
      },
    ],
    solution: part1,
  },
  trimTestInputs: true,
});
