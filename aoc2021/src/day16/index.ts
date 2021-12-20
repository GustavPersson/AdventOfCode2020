import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";

import { getLines } from "../utils/index.js";

log.enableAll();

interface Packet {
  version: number;
  type: number;
}

interface LiteralPacket extends Packet {
  value: number;
}

interface OperatorPacket extends Packet {
  subPackets: AnyPacket[];
}

type AnyPacket = LiteralPacket | OperatorPacket;

const parseInput = (rawInput: string) => toBinary(rawInput);

const part1 = (rawInput: string) => {
  const binaryInput = parseInput(rawInput);

  const rootPacket = parsePacket(binaryInput).packet;

  function packetVersionSum(packet: AnyPacket): number {
    if (isLiteralPacket(packet)) return packet.version;

    return packet.version + packet.subPackets.reduce((sum, sub) => sum + packetVersionSum(sub), 0);
  }

  return packetVersionSum(rootPacket);
};

const part2 = (rawInput: string) => {
  const binaryInput = parseInput(rawInput);
  const rootPacket = parsePacket(binaryInput).packet;

  function getPacketValue(packet: AnyPacket): number {
    if (isLiteralPacket(packet)) {
      return packet.value;
    }

    const subPacketValues = packet.subPackets.map((subPacket) => getPacketValue(subPacket));

    switch (packet.type) {
      case 0:
        return subPacketValues.reduce((a, b) => a + b);
      case 1:
        return subPacketValues.reduce((a, b) => a * b);
      case 2:
        return Math.min(...subPacketValues);
      case 3:
        return Math.max(...subPacketValues);
      case 5:
        return subPacketValues[0] > subPacketValues[1] ? 1 : 0;
      case 6:
        return subPacketValues[0] < subPacketValues[1] ? 1 : 0;
      case 7:
        return subPacketValues[0] === subPacketValues[1] ? 1 : 0;
      default:
        throw new Error("Invalid packet type: " + packet.type);
    }
  }

  return getPacketValue(rootPacket);
};

const isLiteralPacket = (packet: AnyPacket): packet is LiteralPacket => {
  return (packet as LiteralPacket).value !== undefined;
};

const toBinary = (input: string): string => {
  return input
    .split("")
    .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
    .join("")
    .replace(/0+$/, "");
};

const parsePacket = (data: string): { packet: AnyPacket; rest: string } => {
  const chars = data.split("");
  const version = parseInt(chars.splice(0, 3).join(""), 2);
  const type = parseInt(chars.splice(0, 3).join(""), 2);

  if (type === 4) {
    let literalBinary = "";

    while (true) {
      const sub = chars.splice(0, 5).join("").padEnd(5, "0");
      literalBinary += sub.substring(1);

      if (sub[0] === "0") break;
    }

    const packet: LiteralPacket = { version, type, value: parseInt(literalBinary, 2) };
    return { packet, rest: chars.join("") };
  }

  const lenghTypeID = chars.splice(0, 1)[0];

  if (lenghTypeID === "0") {
    const subPacketsLength = parseInt(chars.splice(0, 15).join(""), 2);
    let subPacketContent = chars.splice(0, subPacketsLength).join("");

    const subPackets: AnyPacket[] = [];

    while (subPacketContent.length > 0) {
      const { packet, rest } = parsePacket(subPacketContent);

      subPackets.push(packet);
      subPacketContent = rest;
    }

    const packet: OperatorPacket = { version, type, subPackets };
    return { packet, rest: chars.join("") };
  } else {
    const subPacketCount = parseInt(chars.splice(0, 11).join(""), 2);
    let subData = chars.join("");

    const subPackets: AnyPacket[] = [];

    for (let i = 0; i < subPacketCount; i++) {
      const { packet, rest } = parsePacket(subData);

      subPackets.push(packet);
      subData = rest;
    }

    const packet: OperatorPacket = { version, type, subPackets };
    return { packet, rest: subData };
  }
};

run({
  part1: {
    tests: [
      { input: `8A004A801A8002F478`, expected: 16 },
      { input: `620080001611562C8802118E34`, expected: 12 },
      { input: `C0015000016115A2E0802F182340`, expected: 23 },
      { input: `A0016C880162017C3686B18A3D4780`, expected: 31 },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      { input: `C200B40A82`, expected: 3 },
      { input: `04005AC33890`, expected: 54 },
      { input: `880086C3E88112`, expected: 7 },
      { input: `CE00C43D881120`, expected: 9 },
      { input: `D8005AC2A8F0`, expected: 1 },
      { input: `F600BC2D8F`, expected: 0 },
      { input: `9C005AC2F8F0`, expected: 0 },
      { input: `9C0141080250320F1802104A08`, expected: 1 },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
