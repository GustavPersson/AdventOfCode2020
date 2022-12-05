import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import { List, fromJS, Map } from "immutable"

import type { Solution } from "../types.js"
import { getLineGroups } from "../utils/index.js"

log.enableAll()

const parseInput = (
  rawInput: string,
): {
  startingStacks: Immutable.List<Immutable.List<String>>
  instructions: Immutable.List<Immutable.Map<String, Number>>
} => {
  const [starting, operations] = getLineGroups(rawInput)

  const stacks = starting.map((line) =>
    line.includes("[")
      ? Array.from(line.matchAll(/([A-Z]+|\s{3})/g)).map((m) => m[1])
      : Array.from(line.matchAll(/(\d+)/g)).map((m) => m[1]),
  )

  const startingStacks = stacks.slice(0, -1).reduce(
    (acc, curr) => (
      curr.forEach((box, i) => {
        ;/\S/.test(box) && acc[i].unshift(box)
      }),
      acc
    ),
    stacks.slice(-1)[0].map((_) => [] as string[]),
  )

  const instructions = List(
    operations.filter(Boolean).map((operationString) => {
      const [toMove, from, to] = Array.from(operationString.matchAll(/(\d+)/g))
        .map((m) => m[1])
        .map(Number)
      return Map({ toMove, from: from - 1, to: to - 1 })
    }),
  )

  return {
    startingStacks: fromJS(startingStacks) as List<List<String>>,
    instructions,
  }
}

const part1: Solution = (rawInput: string) => {
  let { startingStacks, instructions } = parseInput(rawInput)

  instructions.forEach((instruction) => {
    let newStack = List(startingStacks.get(instruction.get("to") as number))
    let oldStack = List(startingStacks.get(instruction.get("from") as number))

    for (let i = 0; i < (instruction.get("toMove") as number); i++) {
      newStack = newStack.push(oldStack.last() as String)
      oldStack = oldStack.pop()
    }

    startingStacks = startingStacks
      .set(instruction.get("to") as number, newStack)
      .set(instruction.get("from") as number, oldStack)
  })

  return startingStacks.map((stack) => stack.slice(-1).get(0)).join("")
}

const part2: Solution = (rawInput: string) => {
  let { startingStacks, instructions } = parseInput(rawInput)

  instructions.forEach((instruction) => {
    let newStack = List(startingStacks.get(instruction.get("to") as number))
    let oldStack = List(startingStacks.get(instruction.get("from") as number))

    newStack = newStack.concat(
      oldStack.takeLast(instruction.get("toMove") as number),
    )
    oldStack = oldStack.skipLast(instruction.get("toMove") as number)

    startingStacks = startingStacks
      .set(instruction.get("to") as number, newStack)
      .set(instruction.get("from") as number, oldStack)
  })

  return startingStacks.map((stack) => stack.slice(-1).get(0)).join("")
}

run({
  part1: {
    tests: [
      {
        input: `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
        `,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
          `,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  // onlyTests: true,
})
