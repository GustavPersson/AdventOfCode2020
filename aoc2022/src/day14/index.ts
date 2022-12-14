import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { Map, Set } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const sandFlow = (
  old: Map<number, Set<number>>,
  floor: number,
): Map<number, Set<number>> => {
  let x = 500
  let y = 0
  while (y < floor) {
    // check down
    if (!old.get(x, Set()).has(y + 1)) {
      y++
      continue
    }

    // check down-left
    if (!old.get(x - 1, Set()).has(y + 1)) {
      x--
      y++
      continue
    }

    // check down-right
    if (!old.get(x + 1, Set()).has(y + 1)) {
      x++
      y++
      continue
    }
    return old.update(x, Set(), (s) => s.add(y))
  }
  console.log("")
  throw new Error("nope")
}

function sandFlowTwo(
  old: Map<number, Set<number>>,
  floor: number,
): Map<number, Set<number>> {
  let x = 500
  let y = 0

  while (y < 200) {
    if (y < floor) {
      // check down
      if (!old.get(x, Set()).has(y + 1)) {
        y++
        continue
      }

      // check down-left
      if (!old.get(x - 1, Set()).has(y + 1)) {
        x--
        y++
        continue
      }

      // check down-right
      if (!old.get(x + 1, Set()).has(y + 1)) {
        x++
        y++
        continue
      }
    }

    return old.update(x, Set(), (s) => s.add(y))
  }

  throw new Error("nope")
}

const parseInput = (rawInput: string) =>
  getLines(rawInput).map((line) =>
    line.split("->").map((coordinates) => coordinates.split(",").map(Number)),
  )

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let answer = 0

  let used = Map<number, Set<number>>()
  let maxY = 0

  for (const line of input) {
    for (let i = 0; i < line.length - 1; i++) {
      let [x1, y1] = line[i]
      let [x2, y2] = line[i + 1]

      for (
        let x = x1, y = y1;
        x !== x2 || y !== y2;
        x += Math.sign(x2 - x1), y += Math.sign(y2 - y1)
      ) {
        used = used.update(x, Set(), (s) => s.add(y))
      }

      used = used.update(x2, Set(), (s) => s.add(y2))
      maxY = Math.max(maxY, y1, y2)
    }
  }

  while (true) {
    try {
      used = sandFlow(used, maxY + 1)
      answer++
    } catch (err) {
      break
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let answer = 0

  let used = Map<number, Set<number>>()
  let maxY = 0

  for (const line of input) {
    for (let i = 0; i < line.length - 1; i++) {
      let [x1, y1] = line[i]
      let [x2, y2] = line[i + 1]

      for (
        let x = x1, y = y1;
        x !== x2 || y !== y2;
        x += Math.sign(x2 - x1), y += Math.sign(y2 - y1)
      ) {
        used = used.update(x, Set(), (s) => s.add(y))
      }

      used = used.update(x2, Set(), (s) => s.add(y2))
      maxY = Math.max(maxY, y1, y2)
    }
  }

  while (true) {
    try {
      used = sandFlowTwo(used, maxY + 1)
      answer++
      if (used.get(500, Set()).has(0)) {
        break
      }
    } catch (err) {
      break
    }
  }

  return answer
}

run({
  part1: {
    tests: [
      {
        input: `
      498,4 -> 498,6 -> 496,6
      503,4 -> 502,4 -> 502,9 -> 494,9      
      `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      498,4 -> 498,6 -> 496,6
      503,4 -> 502,4 -> 502,9 -> 494,9      
      `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
