import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLines(rawInput)

const checkXRegister = (cycle: number, xRegister: number) => {
  switch (cycle) {
    case 20:
      return xRegister * 20
    case 60:
      return xRegister * 60
    case 100:
      return xRegister * 100
    case 140:
      return xRegister * 140
    case 180:
      return xRegister * 180
    case 220:
      return xRegister * 220
    default:
      return 0
  }
}

const checkIfRender = (xRegister: number, crtDrawPosition: number) => {
  if (xRegister + 1 >= crtDrawPosition && xRegister - 1 <= crtDrawPosition) {
    return "#"
  } else {
    return "."
  }
}

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let cycle = 1
  let xRegister = 1
  let answer = 0

  for (const instruction of input) {
    if (instruction === "noop") {
      cycle++
      answer += checkXRegister(cycle, xRegister)
    } else {
      const xVal = parseInt(instruction.substring("addx".length))
      cycle++
      answer += checkXRegister(cycle, xRegister)
      xRegister += xVal
      cycle++
      answer += checkXRegister(cycle, xRegister)
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)
  let screen: Array<string> = []
  let cycle = 1
  let xRegister = 1
  let crtDrawPosition = 0
  let crtPixelRow = ""

  const checkForRowBreak = () => {
    if (crtPixelRow.length % 40 === 0) {
      screen.push(crtPixelRow)
      crtPixelRow = ""
      crtDrawPosition = 0
    }
  }

  for (const instruction of input) {
    if (instruction === "noop") {
      crtPixelRow += checkIfRender(xRegister, crtDrawPosition)
      cycle++
      crtDrawPosition++
      checkForRowBreak()
    } else {
      const xVal = parseInt(instruction.substring("addx".length))
      crtPixelRow += checkIfRender(xRegister, crtDrawPosition)
      cycle++
      crtDrawPosition++
      checkForRowBreak()

      crtPixelRow += checkIfRender(xRegister, crtDrawPosition)
      xRegister += xVal
      cycle++
      crtDrawPosition++
      checkForRowBreak()
    }
  }

  return screen.join("\n")
  // return "PCPBKAPJ"
}

run({
  part1: {
    tests: [
      {
        input: `
      addx 15
      addx -11
      addx 6
      addx -3
      addx 5
      addx -1
      addx -8
      addx 13
      addx 4
      noop
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx -35
      addx 1
      addx 24
      addx -19
      addx 1
      addx 16
      addx -11
      noop
      noop
      addx 21
      addx -15
      noop
      noop
      addx -3
      addx 9
      addx 1
      addx -3
      addx 8
      addx 1
      addx 5
      noop
      noop
      noop
      noop
      noop
      addx -36
      noop
      addx 1
      addx 7
      noop
      noop
      noop
      addx 2
      addx 6
      noop
      noop
      noop
      noop
      noop
      addx 1
      noop
      noop
      addx 7
      addx 1
      noop
      addx -13
      addx 13
      addx 7
      noop
      addx 1
      addx -33
      noop
      noop
      noop
      addx 2
      noop
      noop
      noop
      addx 8
      noop
      addx -1
      addx 2
      addx 1
      noop
      addx 17
      addx -9
      addx 1
      addx 1
      addx -3
      addx 11
      noop
      noop
      addx 1
      noop
      addx 1
      noop
      noop
      addx -13
      addx -19
      addx 1
      addx 3
      addx 26
      addx -30
      addx 12
      addx -1
      addx 3
      addx 1
      noop
      noop
      noop
      addx -9
      addx 18
      addx 1
      addx 2
      noop
      noop
      addx 9
      noop
      noop
      noop
      addx -1
      addx 2
      addx -37
      addx 1
      addx 3
      noop
      addx 15
      addx -21
      addx 22
      addx -6
      addx 1
      noop
      addx 2
      addx 1
      noop
      addx -10
      noop
      noop
      addx 20
      addx 1
      addx 2
      addx 2
      addx -6
      addx -11
      noop
      noop
      noop      
      `,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      addx 15
      addx -11
      addx 6
      addx -3
      addx 5
      addx -1
      addx -8
      addx 13
      addx 4
      noop
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx 5
      addx -1
      addx -35
      addx 1
      addx 24
      addx -19
      addx 1
      addx 16
      addx -11
      noop
      noop
      addx 21
      addx -15
      noop
      noop
      addx -3
      addx 9
      addx 1
      addx -3
      addx 8
      addx 1
      addx 5
      noop
      noop
      noop
      noop
      noop
      addx -36
      noop
      addx 1
      addx 7
      noop
      noop
      noop
      addx 2
      addx 6
      noop
      noop
      noop
      noop
      noop
      addx 1
      noop
      noop
      addx 7
      addx 1
      noop
      addx -13
      addx 13
      addx 7
      noop
      addx 1
      addx -33
      noop
      noop
      noop
      addx 2
      noop
      noop
      noop
      addx 8
      noop
      addx -1
      addx 2
      addx 1
      noop
      addx 17
      addx -9
      addx 1
      addx 1
      addx -3
      addx 11
      noop
      noop
      addx 1
      noop
      addx 1
      noop
      noop
      addx -13
      addx -19
      addx 1
      addx 3
      addx 26
      addx -30
      addx 12
      addx -1
      addx 3
      addx 1
      noop
      noop
      noop
      addx -9
      addx 18
      addx 1
      addx 2
      noop
      noop
      addx 9
      noop
      noop
      noop
      addx -1
      addx 2
      addx -37
      addx 1
      addx 3
      noop
      addx 15
      addx -21
      addx 22
      addx -6
      addx 1
      noop
      addx 2
      addx 1
      noop
      addx -10
      noop
      noop
      addx 20
      addx 1
      addx 2
      addx 2
      addx -6
      addx -11
      noop
      noop
      noop      
      `,
        expected: [
          "##..##..##..##..##..##..##..##..##..##..",
          "###...###...###...###...###...###...###.",
          "####....####....####....####....####....",
          "#####.....#####.....#####.....#####.....",
          "######......######......######......####",
          "#######.......#######.......#######.....",
        ].join("\n"),
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
