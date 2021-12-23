import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";
import { Map } from "immutable";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";

log.enableAll();

interface Player {
  position: number;
  score: number;
}

class DeterministicDie {
  private _rolls = 0;
  private currentValue = 0;

  public constructor(public readonly maxValue: number) {}

  public roll(): number {
    this._rolls++;
    return (this.currentValue++ % this.maxValue) + 1;
  }

  public get rolls() {
    return this._rolls;
  }
}

const parseInput = (rawInput: string): Player[] => {
  const positions = getLines(rawInput).map((pos) => pos.split(": ")[1]);
  return positions.map((pos) => ({ position: Number(pos) - 1, score: 0 }));
};

const part1: Solution = (rawInput: string) => {
  const players = parseInput(rawInput);

  log.debug(players);
  const die = new DeterministicDie(100);

  main: while (true) {
    for (const player of players) {
      const movement = die.roll() + die.roll() + die.roll();
      // log.debug(movement);
      player.position = (player.position + movement) % 10;
      // log.debug("player position", player.position);
      player.score += player.position + 1;
      // log.debug(player);

      if (player.score >= 1000) {
        break main;
      }
    }
  }

  log.debug(players);

  const losingPlayer = players.sort((a, b) => a.score - b.score)[0];

  return losingPlayer.score * die.rolls;
};

const sizedPermutations = <T>(arr: T[], size: number): T[][] => {
  if (size === 1) return arr.map((e) => [e]);

  const out = [];

  for (const element of arr) {
    const subCombinations = sizedPermutations(arr, size - 1);
    out.push(...subCombinations.map((rest) => [element, ...rest]));
  }

  return out;
};

const serializeUniverse = (players: Player[], turn: number) => players.map((p) => `${p.position},${p.score}`).join(";") + ":" + turn;

const deserializeUniverse = (str: string): [Player[], number] => {
  const [rest, turnStr] = str.split(":");

  const players = rest.split(";").map((str) => {
    const [position, score] = str.split(",").map(Number);
    return { position, score };
  });

  return [players, Number(turnStr)];
};

const part2: Solution = (rawInput: string) => {
  const players = parseInput(rawInput);
  const possibleRolls = sizedPermutations([1, 2, 3], 3).map((roll) => roll.reduce((a, b) => a + b));
  const winCounts: number[] = Array(players.length).fill(0);

  let universeCounts = Map<string, number>([[serializeUniverse(players, 0), 1]]);

  while (universeCounts.size) {
    let newUniverseCounts: typeof universeCounts = Map();
    const entries = [...universeCounts.entries()];
    for (const [serializedUniverse, count] of entries) {
      const [players, turn] = deserializeUniverse(serializedUniverse);
      for (const roll of possibleRolls) {
        const player = { ...players[turn] }; // ✨ Quantum magic ✨

        player.position = (player.position + roll) % 10;
        player.score += player.position + 1;

        if (player.score >= 21) {
          winCounts[turn] += count;
        } else {
          const newPlayers = [...players];
          newPlayers[turn] = player;

          const key = serializeUniverse(newPlayers, (turn + 1) % newPlayers.length);
          newUniverseCounts = newUniverseCounts.set(key, (newUniverseCounts.get(key) || 0) + count);
        }
      }
    }
    universeCounts = newUniverseCounts;
  }

  return Math.max(...winCounts);
};

run({
  part1: {
    tests: [
      {
        input: `
          Player 1 starting position: 4
          Player 2 starting position: 8
      `,
        expected: 739785,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Player 1 starting position: 4
          Player 2 starting position: 8
      `,
        expected: 444356092776315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
