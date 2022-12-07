import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

const DISK_SIZE = 70000000
const UPDATE_SIZE = 30000000

interface Dir {
  parent?: Dir
  files: { [name: string]: number }
  dirs: { [name: string]: Dir }
}

const parseInput = (rawInput: string) => {
  const instructions = getLines(rawInput)
  const fileSystem: Dir = { files: {}, dirs: {} }
  let currentDir = fileSystem

  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].startsWith("$ ")) {
      const command = instructions[i].substring(2)
      if (command === "ls") {
        i++
        while (i < instructions.length && !instructions[i].startsWith("$")) {
          const [size, name] = instructions[i].split(" ")
          if (/^\d+$/.test(size)) {
            currentDir.files[name] = parseInt(size)
          }
          i++
        }
        i--
      } else {
        // command is cd
        const dir = command.substring(3)
        if (dir === "..") {
          currentDir = currentDir.parent!
        } else if (dir === "/") {
          currentDir = fileSystem
        } else {
          if (!currentDir.dirs[dir]) {
            currentDir.dirs[dir] = { parent: currentDir, files: {}, dirs: {} }
          }
          currentDir = currentDir.dirs[dir]
        }
      }
    } else {
      throw new Error()
    }
  }

  return fileSystem
}

const getSizesPartOne = (fileSystem: Dir): [number, number] => {
  let totalSize = 0
  let answer = 0

  for (const file in fileSystem.files) {
    totalSize += fileSystem.files[file]
  }

  for (const dir in fileSystem.dirs) {
    const [dirSize, dirAns] = getSizesPartOne(fileSystem.dirs[dir])
    totalSize += dirSize
    answer += dirAns
  }

  if (totalSize <= 100000) {
    answer += totalSize
  }

  return [totalSize, answer]
}

const getSizesPartTwo = (fileSystem: Dir) => {
  let size = 0
  let ret: number[] = []

  for (const file in fileSystem.files) {
    size += fileSystem.files[file]
  }

  for (const dir in fileSystem.dirs) {
    const dirSizes = getSizesPartTwo(fileSystem.dirs[dir])
    size += dirSizes[dirSizes.length - 1]
    ret = ret.concat(dirSizes)
  }

  ret.push(size)
  return ret
}

const part1: Solution = (rawInput: string) => {
  const fileSystem = parseInput(rawInput)

  const [totalSize, answer] = getSizesPartOne(fileSystem)

  return answer
}

const part2: Solution = (rawInput: string) => {
  const fileSystem = parseInput(rawInput)
  const dirSizes = getSizesPartTwo(fileSystem)

  const totalSize = dirSizes[dirSizes.length - 1]
  const availableFreeSpace = DISK_SIZE - totalSize
  const needToFree = UPDATE_SIZE - availableFreeSpace

  dirSizes.sort((a, b) => a - b)
  for (const size of dirSizes) {
    if (size >= needToFree) {
      return size
    }
  }

  return dirSizes[0]
}

run({
  part1: {
    tests: [
      {
        input: `
        $ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k
    `,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      $ cd /
      $ ls
      dir a
      14848514 b.txt
      8504156 c.dat
      dir d
      $ cd a
      $ ls
      dir e
      29116 f
      2557 g
      62596 h.lst
      $ cd e
      $ ls
      584 i
      $ cd ..
      $ cd ..
      $ cd d
      $ ls
      4060174 j
      8033020 d.log
      5626152 d.ext
      7214296 k      
      `,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
