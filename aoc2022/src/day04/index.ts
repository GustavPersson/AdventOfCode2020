import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { Set } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLines(rawInput)

const range = (start: number, stop: number, step: number) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step)

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)
  let answer = 0

  for (const elfPair of input) {
    const elves = elfPair.split(",")

    const firstElf = elves[0].split("-").map((value) => parseInt(value, 10))
    const secondElf = elves[1].split("-").map((value) => parseInt(value, 10))

    const firstRange = Set(range(firstElf[0], firstElf[1], 1))
    const secondRange = Set(range(secondElf[0], secondElf[1], 1))

    const intersect = firstRange.intersect(secondRange)

    if (
      intersect.size === firstRange.size ||
      intersect.size === secondRange.size
    ) {
      answer++
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)
  let answer = 0

  for (const elfPair of input) {
    const elves = elfPair.split(",")

    const firstElf = elves[0].split("-").map((value) => parseInt(value, 10))
    const secondElf = elves[1].split("-").map((value) => parseInt(value, 10))

    const firstRange = Set(range(firstElf[0], firstElf[1], 1))
    const secondRange = Set(range(secondElf[0], secondElf[1], 1))

    const intersect = firstRange.intersect(secondRange)

    if (intersect.size > 0) {
      answer++
    }
  }

  return answer
}

run({
  part1: {
    tests: [
      {
        input: `
      2-4,6-8
      2-3,4-5
      5-7,7-9
      2-8,3-7
      6-6,4-6
      2-6,4-8
      `,
        expected: 2,
      },
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
  // onlyTests: true,
})
