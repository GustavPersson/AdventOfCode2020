import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLineGroups, getLines } from "../utils/index.js"

log.enableAll()

interface Monkey {
  items: Array<number>
  operation: string
  test: number
  trueTarget: number
  falseTarget: number
}

const parseInput = (rawInput: string) => {
  const monkeyInput = getLineGroups(rawInput)

  const monkeys = monkeyInput.map((dat): Monkey => {
    return {
      items: dat[1]
        .split(":")[1]
        .split(",")
        .map((x) => parseInt(x)),
      operation: dat[2].split(":")[1].replace("new", "newVal"),
      test: parseInt(dat[3].split("by ")[1]),
      trueTarget: parseInt(dat[4].split("monkey ")[1]),
      falseTarget: parseInt(dat[5].split("monkey ")[1]),
    }
  })

  return monkeys
}

const part1: Solution = (rawInput: string) => {
  const monkeys = parseInput(rawInput)

  let counts = Array.from({ length: monkeys.length }, () => 0)

  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      for (let k = 0; k < monkeys[j].items.length; k++) {
        if (i === 0) {
          console.log(
            `monkey ${j} inspects item with worry level ${monkeys[j].items[k]}`,
          )
        }
        let newVal = 0
        let old = monkeys[j].items[k]
        eval(monkeys[j].operation)
        if (i === 0) {
          console.log(`Worry level is ${monkeys[j].operation} to ${newVal}.`)
        }
        newVal = Math.floor(newVal / 3)
        if (i === 0) {
          console.log(
            `Monkey ${j} gets bored with item. Worry level is divided by 3 to ${newVal}.`,
          )
        }

        monkeys[j].items[k] = newVal

        counts[j]++
        if (monkeys[j].items[k] % monkeys[j].test === 0) {
          if (i === 0) {
            console.log(
              `${monkeys[j].items[k]} is divisible by ${monkeys[j].test}, throw to ${monkeys[j].trueTarget}`,
            )
          }

          monkeys[monkeys[j].trueTarget].items.push(monkeys[j].items[k])
        } else {
          if (i === 0) {
            console.log(
              `${monkeys[j].items[k]} is not divisible by ${monkeys[j].test}, throw to ${monkeys[j].falseTarget}`,
            )
          }
          monkeys[monkeys[j].falseTarget].items.push(monkeys[j].items[k])
        }
      }

      monkeys[j].items = []
    }
    if (i === 0) {
      console.log(`after round ${i + 1} monkeys look like this: `, monkeys)
    }
  }

  counts.sort((a, b) => b - a)

  return counts[0] * counts[1]
}

const part2: Solution = (rawInput: string) => {
  const monkeys = parseInput(rawInput)

  let counts = Array.from({ length: monkeys.length }, () => 0)
  const mod = monkeys.reduce((a, b) => a * b.test, 1)

  for (let i = 0; i < 10000; i++) {
    for (let j = 0; j < monkeys.length; j++) {
      for (let k = 0; k < monkeys[j].items.length; k++) {
        let newVal = 0
        let old = monkeys[j].items[k]
        eval(monkeys[j].operation)
        monkeys[j].items[k] = newVal % mod
        counts[j]++
      }

      for (const item of monkeys[j].items) {
        if (item % monkeys[j].test === 0) {
          monkeys[monkeys[j].trueTarget].items.push(item)
        } else {
          monkeys[monkeys[j].falseTarget].items.push(item)
        }
      }

      monkeys[j].items = []
    }
  }

  counts.sort((a, b) => b - a)

  return counts[0] * counts[1]
}

run({
  part1: {
    tests: [
      {
        input: `
          Monkey 0:
            Starting items: 79, 98
            Operation: new = old * 19
            Test: divisible by 23
              If true: throw to monkey 2
              If false: throw to monkey 3

          Monkey 1:
            Starting items: 54, 65, 75, 74
            Operation: new = old + 6
            Test: divisible by 19
              If true: throw to monkey 2
              If false: throw to monkey 0

          Monkey 2:
            Starting items: 79, 60, 97
            Operation: new = old * old
            Test: divisible by 13
              If true: throw to monkey 1
              If false: throw to monkey 3

          Monkey 3:
            Starting items: 74
            Operation: new = old + 3
            Test: divisible by 17
              If true: throw to monkey 0
              If false: throw to monkey 1    
              `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Monkey 0:
            Starting items: 79, 98
            Operation: new = old * 19
            Test: divisible by 23
              If true: throw to monkey 2
              If false: throw to monkey 3

          Monkey 1:
            Starting items: 54, 65, 75, 74
            Operation: new = old + 6
            Test: divisible by 19
              If true: throw to monkey 2
              If false: throw to monkey 0

          Monkey 2:
            Starting items: 79, 60, 97
            Operation: new = old * old
            Test: divisible by 13
              If true: throw to monkey 1
              If false: throw to monkey 3

          Monkey 3:
            Starting items: 74
            Operation: new = old + 3
            Test: divisible by 17
              If true: throw to monkey 0
              If false: throw to monkey 1    
              `,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
