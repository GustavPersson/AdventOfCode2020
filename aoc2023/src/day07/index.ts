import run from 'aocrunner';
import _ from 'lodash';
import log from 'loglevel';

import { getLines } from '../utils/index.js';

log.enableAll();

const sortHands = (a: number[], b: number[]) => {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return b[i] - a[i];
    }
  }
  return 0;
};

const parseInput = (rawInput: string) =>
  getLines(rawInput).map((line) => line.split(' '));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const STRENGTH = '23456789TJQKA';

  const hands = input
    .map((line) => {
      const [hand, bid] = line;

      const handValues = hand.split('').map((card) => STRENGTH.indexOf(card));

      const frequencies = _.countBy(handValues);

      const handHash = Object.values(frequencies).sort((a, b) => b - a);

      return { sort: handHash.concat(handValues), bid: Number(bid) };
    })
    .sort((a, b) => sortHands(b.sort, a.sort));

  const totalWinnings = hands.reduce(
    (acc, hand, index) => acc + hand.bid * (index + 1),
    0,
  );

  return totalWinnings;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const STRENGTH = 'J23456789TQKA';

  const hands = input
    .map((line) => {
      const [hand, bid] = line;

      const handValues = hand.split('').map((card) => STRENGTH.indexOf(card));

      const frequencies = _.countBy(handValues);

      const jokers = frequencies['0'];
      delete frequencies['0'];

      const handHash = Object.values(frequencies).sort((a, b) => b - a);

      if (jokers) {
        handHash[0] ??= 0;
        handHash[0] += jokers;
      }

      return { sort: handHash.concat(handValues), bid: Number(bid) };
    })
    .sort((a, b) => sortHands(b.sort, a.sort));

  const totalWinnings = hands.reduce(
    (acc, hand, index) => acc + hand.bid * (index + 1),
    0,
  );

  return totalWinnings;
};

run({
  part1: {
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483`,
        expected: 6440,
      },
      {
        input: `
        2345A 1
        Q2KJJ 13
        Q2Q2Q 19
        T3T3J 17
        T3Q33 11
        2345J 3
        J345A 2
        32T3K 5
        T55J5 29
        KK677 7
        KTJJT 34
        QQQJA 31
        JJJJJ 37
        JAAAA 43
        AAAAJ 59
        AAAAA 61
        2AAAA 23
        2JJJJ 53
        JJJJ2 41`,
        expected: 6592,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483`,
        expected: 5905,
      },
      {
        input: `
        2345A 1
        Q2KJJ 13
        Q2Q2Q 19
        T3T3J 17
        T3Q33 11
        2345J 3
        J345A 2
        32T3K 5
        T55J5 29
        KK677 7
        KTJJT 34
        QQQJA 31
        JJJJJ 37
        JAAAA 43
        AAAAJ 59
        AAAAA 61
        2AAAA 23
        2JJJJ 53
        JJJJ2 41`,
        expected: 6839,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
