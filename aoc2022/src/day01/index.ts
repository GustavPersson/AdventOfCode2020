import run from "aocrunner"
import { getLineGroups, getLineGroupsAsNumbers } from "../utils/index.js"

const parseInput = (rawInput: string) => rawInput

const part1 = (rawInput: string) => {
  const input = getLineGroupsAsNumbers(rawInput)

  const calories = input.map((calories) => calories.reduce((previous, current) => previous + current), 0).sort((a, b) => b - a)

  return calories[0]
}

const part2 = (rawInput: string) => {
  const input = getLineGroupsAsNumbers(rawInput)

  const calories = input.map((calories) => calories.reduce((previous, current) => previous + current), 0).sort((a, b) => b - a)

  return calories[0] + calories[1] + calories[2]

}

run({
  part1: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000`,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        1000
        2000
        3000
        
        4000
        
        5000
        6000
        
        7000
        8000
        9000
        
        10000`,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
