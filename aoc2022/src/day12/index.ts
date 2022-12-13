import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { List, Map } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
]

type Position = {
  pos: number[]
  steps: number
}

const parseInput = (rawInput: string, part: number) => {
  const lines = getLines(rawInput)
  const starts: number[][] = []
  let end: number[] = []

  const map = lines.map((line, i) =>
    line.split("").map((char, j) => {
      let elevation = -1
      if (char === "S" || (part === 2 && char === "a")) {
        elevation = 0
        starts.push([i, j])
      } else if (char === "E") {
        elevation = 25
        end = [i, j]
      } else {
        elevation =
          (char.codePointAt(0) as number) - ("a".codePointAt(0) as number)
      }
      return elevation
    }),
  )

  return { starts, map, end }
}

const findPath = (starts, map, end) => {
  let seen = List([])
  let queue = List(
    starts.map((start) => Map({ pos: start, steps: 0 } as Position)),
  )

  while (queue.size > 0) {
    const currentItem = queue.first()
    queue = queue.shift()

    if (!currentItem) {
      break
    }
    const steps = currentItem?.get("steps") as number

    let i = currentItem.getIn(["pos", 0]) as number
    let j = currentItem.getIn(["pos", 1]) as number

    if (seen.getIn([i, j])) {
      continue
    }

    if (i === end[0] && j === end[1]) {
      return steps
    }

    for (const [di, dj] of DIRECTIONS) {
      if (
        map[i + di]?.[j + dj] === undefined ||
        map[i + di][j + dj] > map[i][j] + 1 ||
        seen.getIn([i + di, j + dj])
      ) {
        continue
      }
      queue = queue.push(Map({ pos: [i + di, j + dj], steps: steps + 1 }))
    }

    seen = seen.set(i, seen.get(i) ?? [])
    seen = seen.setIn([i, j], 1)
  }
}

const part1: Solution = (rawInput: string) => {
  const { map, starts, end } = parseInput(rawInput, 1)
  return findPath(starts, map, end)
}

const part2: Solution = (rawInput: string) => {
  const { map, starts, end } = parseInput(rawInput, 2)

  return findPath(starts, map, end)
}

run({
  part1: {
    tests: [
      {
        input: `
      Sabqponm
      abcryxxl
      accszExk
      acctuvwj
      abdefghi
      `,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      Sabqponm
      abcryxxl
      accszExk
      acctuvwj
      abdefghi
      `,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
