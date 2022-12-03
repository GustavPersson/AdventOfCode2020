import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { Set } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLines(rawInput)

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  let answer = 0

  for (const bag of input) {
    let firstCompartment = bag.slice(0, bag.length / 2)
    let secondCompartment = bag.slice(bag.length / 2)

    const first = Set(firstCompartment)
    const second = Set(secondCompartment)

    const sameItems = first.intersect(second)

    for (const item of sameItems) {
      if (item.toLowerCase() === item) {
        answer += item.charCodeAt(0) - "a".charCodeAt(0) + 1
      } else {
        answer += item.charCodeAt(0) - "A".charCodeAt(0) + 27
      }
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)
  let answer = 0

  for (let i = 0; i < input.length; i += 3) {
    const firstBag = Set(input[i])
    const secondBag = Set(input[i + 1])
    const thirdBag = Set(input[i + 2])

    const sameItems = firstBag.intersect(secondBag, thirdBag)

    for (const item of sameItems) {
      if (item.toLowerCase() === item) {
        answer += item.charCodeAt(0) - "a".charCodeAt(0) + 1
      } else {
        answer += item.charCodeAt(0) - "A".charCodeAt(0) + 27
      }
    }
  }

  return answer
}

run({
  part1: {
    tests: [
      {
        input: `
      vJrwpWtwJgWrhcsFMMfFFhFp
      jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
      PmmdzqPrVvPwwTWBwg
      wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
      ttgJtRGJQctTZtZT
      CrZsJsPPZsGzwwsLwLmpwMDw      
      `,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      vJrwpWtwJgWrhcsFMMfFFhFp
      jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
      PmmdzqPrVvPwwTWBwg
      wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
      ttgJtRGJQctTZtZT
      CrZsJsPPZsGzwwsLwLmpwMDw
      `,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
