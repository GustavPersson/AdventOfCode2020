import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLines(rawInput)

type Direction = "R" | "L" | "U" | "D"

const DIRECTIONS = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
}

const runSnake = (input: string[], numberOfKnots: number): number => {
  let rope = Array.from({ length: numberOfKnots }, () => [0, 0]),
    visited: { [key: string]: number } = {}

  input.map((instruction) => {
    let parts: Array<Direction | string> = instruction.split(" ")

    let direction = parts[0] as Direction
    let steps = parseInt(parts[1])

    while (steps--) {
      // advance head
      rope[0] = rope[0].map((v, d) => v + DIRECTIONS[direction][d])
      for (let i = 1; i < numberOfKnots; i++)
        if (rope[i - 1].some((v, d) => Math.abs(v - rope[i][d]) > 1))
          rope[i] = rope[i].map((v, d) => v + Math.sign(rope[i - 1][d] - v))
      // mark tail
      visited[rope[numberOfKnots - 1].join("_")] = 1
    }
  })

  return Object.keys(visited).length
}

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  return runSnake(input, 2)
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  return runSnake(input, 10)
}

run({
  part1: {
    tests: [
      {
        input: `
      R 4
      U 4
      L 3
      D 1
      R 4
      D 1
      L 5
      R 2
      `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      R 5
      U 8
      L 8
      D 3
      R 17
      D 10
      L 25
      U 20      
      `,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
