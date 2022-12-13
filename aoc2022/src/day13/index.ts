import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLineGroups, getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLineGroups(rawInput)

const compare = (a: any, b: any): boolean | undefined => {
  if (typeof a === "number" && typeof b === "number") {
    return a < b ? true : a > b ? false : undefined
  } else if (typeof a === typeof b) {
    for (let i = 0; i < a.length && i < b.length; i++) {
      let result = compare(a[i], b[i])
      if (result !== undefined) {
        return result
      }
    }

    if (a.length < b.length) {
      return true
    }

    if (a.length > b.length) {
      return false
    }

    return undefined
  } else {
    let newA = typeof a === "number" ? [a] : a
    let newB = typeof b === "number" ? [b] : b
    return compare(newA, newB)
  }
}

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)
  let answer = 0
  let i = 0

  for (const [a, b] of input) {
    i++
    if (compare(eval(a), eval(b))) {
      answer += i
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const data = getLines(rawInput)

  let x = [[2]]
  let y = [[6]]
  const packets = [x, y, ...data.filter((p) => p !== "").map(eval)]

  packets.sort((a, b) => {
    let res = compare(a, b)
    if (res === undefined) {
      throw new Error("compare returned undefined")
    }
    return res ? -1 : 1
  })

  return (packets.indexOf(x) + 1) * (packets.indexOf(y) + 1)
}

run({
  part1: {
    tests: [
      {
        input: `
      [1,1,3,1,1]
      [1,1,5,1,1]
      
      [[1],[2,3,4]]
      [[1],4]
      
      [9]
      [[8,7,6]]
      
      [[4,4],4,4]
      [[4,4],4,4,4]
      
      [7,7,7,7]
      [7,7,7]
      
      []
      [3]
      
      [[[]]]
      [[]]
      
      [1,[2,[3,[4,[5,6,7]]]],8,9]
      [1,[2,[3,[4,[5,6,0]]]],8,9]
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
      [1,1,3,1,1]
      [1,1,5,1,1]
      
      [[1],[2,3,4]]
      [[1],4]
      
      [9]
      [[8,7,6]]
      
      [[4,4],4,4]
      [[4,4],4,4,4]
      
      [7,7,7,7]
      [7,7,7]
      
      []
      [3]
      
      [[[]]]
      [[]]
      
      [1,[2,[3,[4,[5,6,7]]]],8,9]
      [1,[2,[3,[4,[5,6,0]]]],8,9]
      `,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
