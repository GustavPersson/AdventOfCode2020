import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) =>
  getLines(rawInput).map((row) => row.split("").map(Number))

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let answer = 0

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (
        i === 0 ||
        j === 0 ||
        i === input.length - 1 ||
        j === input[i].length - 1
      ) {
        answer++
      } else {
        let upOk = true,
          downOk = true,
          leftOk = true,
          rightOk = true

        for (let k = i - 1; k >= 0; k--) {
          if (input[k][j] >= input[i][j]) {
            upOk = false
          }
        }

        for (let k = i + 1; k < input.length; k++) {
          if (input[k][j] >= input[i][j]) {
            downOk = false
          }
        }

        for (let k = j - 1; k >= 0; k--) {
          if (input[i][k] >= input[i][j]) {
            leftOk = false
          }
        }

        for (let k = j + 1; k < input[i].length; k++) {
          if (input[i][k] >= input[i][j]) {
            rightOk = false
          }
        }
        if (upOk || downOk || leftOk || rightOk) {
          answer++
        }
      }
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let answer = 0

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      let upVisibleTrees = 0,
        downVisibleTrees = 0,
        leftVisibleTrees = 0,
        rightVisibleTrees = 0

      for (let k = i - 1; k >= 0; k--) {
        upVisibleTrees++
        if (input[k][j] >= input[i][j]) {
          break
        }
      }

      for (let k = i + 1; k < input.length; k++) {
        downVisibleTrees++
        if (input[k][j] >= input[i][j]) {
          break
        }
      }

      for (let k = j - 1; k >= 0; k--) {
        leftVisibleTrees++
        if (input[i][k] >= input[i][j]) {
          break
        }
      }

      for (let k = j + 1; k < input[i].length; k++) {
        rightVisibleTrees++
        if (input[i][k] >= input[i][j]) {
          break
        }
      }

      answer = Math.max(
        answer,
        upVisibleTrees *
          downVisibleTrees *
          leftVisibleTrees *
          rightVisibleTrees,
      )
    }
  }

  return answer
}

run({
  part1: {
    tests: [
      {
        input: `
      30373
      25512
      65332
      33549
      35390
      `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      30373
      25512
      65332
      33549
      35390
      `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
