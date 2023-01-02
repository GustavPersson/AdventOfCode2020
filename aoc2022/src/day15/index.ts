import run from "aocrunner"
import _ from "lodash"
import log from "loglevel"
import { Set } from "immutable"

import type { Solution } from "../types.js"
import { getLines } from "../utils/index.js"

log.enableAll()

type Coordinates = {
  x: number
  y: number
}

type SensorBeaconPair = {
  sensor: Coordinates
  beacon: Coordinates
}

const parseInput = (rawInput: string) => {
  let allBeacons = Set()
  const lines = getLines(rawInput)
  let data = lines.reduce((array: SensorBeaconPair[], line) => {
    let tokens = line.split(" ")
    let sensorX = parseInt(tokens[2].replace(",", "").split("=")[1])
    let sensorY = parseInt(tokens[3].replace(":", "").split("=")[1])

    let beaconX = parseInt(tokens[8].replace(",", "").split("=")[1])
    let beaconY = parseInt(tokens[9].split("=")[1])
    allBeacons = allBeacons.add(`${beaconX},${beaconY}`)

    array.push({
      sensor: { x: sensorX, y: sensorY },
      beacon: { x: beaconX, y: beaconY },
    })
    return array
  }, [])

  return { allBeacons, data }
}

const part1: Solution = (rawInput: string) => {
  const { data } = parseInput(rawInput)
  let endpoints: [number, boolean][] = []
  // const targetY = 2000000
  const targetY = 10

  for (const { sensor, beacon } of data) {
    const dist = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
    const leftover = dist - Math.abs(targetY - sensor.y)

    if (leftover >= 0) {
      endpoints.push([sensor.x - leftover, true])
      endpoints.push([sensor.x + leftover + 1, false])
    }
  }

  endpoints.sort((a, b) => a[0] - b[0])

  let ans = -1
  let count = 0
  let last = -1000000

  for (const [x, isStart] of endpoints) {
    if (count > 0) {
      ans += x - last
    }

    if (isStart) {
      count++
    } else {
      count--
    }

    last = x
  }

  return ans
}

async function* solvePart2(rawInput: string) {
  const { data } = parseInput(rawInput)

  const check = (x: number, y: number) => {
    for (const { sensor, beacon } of data) {
      const dist1 =
        Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
      const dist2 = Math.abs(sensor.x - x) + Math.abs(sensor.y - y)

      if (dist2 < dist1) {
        return false
      }
    }

    return true
  }

  for (const { sensor, beacon } of data) {
    const dist = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y)
    for (const xx of [-1, 1]) {
      for (const yy of [-1, 1]) {
        for (let dx = 0; dx <= dist + 1; dx++) {
          const dy = dist + 1 - dx
          let x = sensor.x + dx * xx
          let y = sensor.y + dy * yy
          if (x < 0 || y < 0 || x > 4000000 || y > 4000000) {
            return false
          }
          if (check(x, y)) {
            yield x * 4000000 + y
          }
        }
      }
    }
  }
}

const part2: Solution = async (rawInput: string) => {
  const result = await solvePart2(rawInput).next()
  return result.value
}

run({
  part1: {
    tests: [
      {
        input: `
      Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      Sensor at x=9, y=16: closest beacon is at x=10, y=16
      Sensor at x=13, y=2: closest beacon is at x=15, y=3
      Sensor at x=12, y=14: closest beacon is at x=10, y=16
      Sensor at x=10, y=20: closest beacon is at x=10, y=16
      Sensor at x=14, y=17: closest beacon is at x=10, y=16
      Sensor at x=8, y=7: closest beacon is at x=2, y=10
      Sensor at x=2, y=0: closest beacon is at x=2, y=10
      Sensor at x=0, y=11: closest beacon is at x=2, y=10
      Sensor at x=20, y=14: closest beacon is at x=25, y=17
      Sensor at x=17, y=20: closest beacon is at x=21, y=22
      Sensor at x=16, y=7: closest beacon is at x=15, y=3
      Sensor at x=14, y=3: closest beacon is at x=15, y=3
      Sensor at x=20, y=1: closest beacon is at x=15, y=3      
      `,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
      Sensor at x=2, y=18: closest beacon is at x=-2, y=15
      Sensor at x=9, y=16: closest beacon is at x=10, y=16
      Sensor at x=13, y=2: closest beacon is at x=15, y=3
      Sensor at x=12, y=14: closest beacon is at x=10, y=16
      Sensor at x=10, y=20: closest beacon is at x=10, y=16
      Sensor at x=14, y=17: closest beacon is at x=10, y=16
      Sensor at x=8, y=7: closest beacon is at x=2, y=10
      Sensor at x=2, y=0: closest beacon is at x=2, y=10
      Sensor at x=0, y=11: closest beacon is at x=2, y=10
      Sensor at x=20, y=14: closest beacon is at x=25, y=17
      Sensor at x=17, y=20: closest beacon is at x=21, y=22
      Sensor at x=16, y=7: closest beacon is at x=15, y=3
      Sensor at x=14, y=3: closest beacon is at x=15, y=3
      Sensor at x=20, y=1: closest beacon is at x=15, y=3      
      `,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
})
