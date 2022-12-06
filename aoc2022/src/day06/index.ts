import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { List } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const parseInput = (rawInput: string) => getLines(rawInput)

const part1: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  const stringArray = input[0].split("")
  let marker = List()
  let answer = 0

  for (let i = 0; i < stringArray.length; i++) {
    if (i < 3) {
      marker = marker.push(stringArray[i])
    } else {
      marker = marker.push(stringArray[i])
      if (marker.size > 4) {
        marker = marker.shift()
      }
      let unique = marker.toSet()
      if (unique.size === 4) {
        return i + 1
      }
    }
  }

  return answer
}

const part2: Solution = (rawInput: string) => {
  const input = parseInput(rawInput)

  const stringArray = input[0].split("")
  let marker = List()
  let answer = 0

  for (let i = 0; i < stringArray.length; i++) {
    if (i < 13) {
      marker = marker.push(stringArray[i])
    } else {
      marker = marker.push(stringArray[i])
      if (marker.size > 14) {
        marker = marker.shift()
      }
      let unique = marker.toSet()
      if (unique.size === 14) {
        return i + 1
      }
    }
  }

  return answer
}

run({
  part1: {
    tests: [
      { input: `bvwbjplbgvbhsrlpgdmjqwftvncz`, expected: 5 },
      { input: `nppdvjthqldpwncqszvftbrmjlhg`, expected: 6 },
      { input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, expected: 10 },
      { input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`, expected: 11 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`, expected: 19 },
      { input: `bvwbjplbgvbhsrlpgdmjqwftvncz`, expected: 23 },
      { input: `nppdvjthqldpwncqszvftbrmjlhg`, expected: 23 },
      { input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`, expected: 29 },
      { input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`, expected: 26 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
