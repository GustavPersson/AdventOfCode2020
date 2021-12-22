import run from "aocrunner";
import _ from "lodash";
import log from "loglevel";
import { Set } from "immutable";

import { mat4, vec3 } from "gl-matrix";

import { Solution, Coordinate3D } from "../types.js";
import { getLineGroups } from "../utils/index.js";

log.enableAll();

interface CoordinateWithDifferences {
  value: Coordinate3D;
  diffs: Coordinate3D[];
}

const PI_OVER_2 = Math.PI / 2;

class Scanner {
  public position: Coordinate3D | null = null;

  public beaconPermutations: CoordinateWithDifferences[][] = [];
  public finalBeaconPermutation: CoordinateWithDifferences[] | null = null;

  public constructor(relativeBeacons: Coordinate3D[]) {
    // Compute all 24 permutations of the coordinate list
    for (let face = 0; face < 6; face++) {
      const faceMatrix = face < 4 ? mat4.fromZRotation(mat4.create(), face * PI_OVER_2) : mat4.fromYRotation(mat4.create(), PI_OVER_2 * (face === 4 ? 1 : -1));

      for (let rotation = 0; rotation < 4; rotation++) {
        const rotationMatrix = mat4.rotateX(mat4.create(), faceMatrix, rotation * PI_OVER_2);
        const permutation: Coordinate3D[] = [];

        for (const [x, y, z] of relativeBeacons) {
          const vec = vec3.fromValues(x, y, z);
          vec3.transformMat4(vec, vec, rotationMatrix);

          permutation.push(vec as Coordinate3D);
        }

        this.beaconPermutations.push(
          permutation.map((coord) => {
            const everyOtherCoordinate = permutation.filter((other) => other !== coord);
            const diffs = everyOtherCoordinate.map((otherCoord) => subtractCoords(otherCoord, coord));

            return { value: coord, diffs };
          }),
        );
      }
    }
  }
}

const subtractCoords = (c1: Coordinate3D, c2: Coordinate3D): Coordinate3D => [c1[0] - c2[0], c1[1] - c2[1], c1[2] - c2[2]];

const addCoords = (c1: Coordinate3D, c2: Coordinate3D): Coordinate3D => [c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2]];

const coordsEqual = (c1: Coordinate3D, c2: Coordinate3D): boolean => c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];

const parseInput = (rawInput: string) => {
  const inputGroups = getLineGroups(rawInput).map((group) => group.slice(1));

  const reports: Coordinate3D[][] = [];

  for (const report of inputGroups) {
    reports.push(report.map((coords) => coords.split(",").map(Number) as Coordinate3D));
  }

  return reports.map((report) => new Scanner(report));
};

const inferScannerPositions = (scanners: Scanner[], minOverlaps: number) => {
  scanners[0].position = [0, 0, 0];
  scanners[0].finalBeaconPermutation = scanners[0].beaconPermutations[0];

  while (true) {
    const unknownScanners = scanners.filter((scanner) => !scanner.position);
    if (unknownScanners.length === 0) break;

    const knownScanners = scanners.filter((scanner) => !unknownScanners.includes(scanner));

    for (const unknownScanner of unknownScanners) {
      main: for (const knownScanner of knownScanners) {
        if (!knownScanner.position || !knownScanner.finalBeaconPermutation) {
          throw new Error("something went wrong");
        }

        for (const permutation of unknownScanner.beaconPermutations) {
          let overlappingBeacons: { fromBase: Coordinate3D; fromUnknown: Coordinate3D }[] = [];

          for (const baseBeacon of knownScanner.finalBeaconPermutation) {
            for (const beacon of permutation) {
              const overlappingDiffs = baseBeacon.diffs.filter((diff) => beacon.diffs.some((otherDiff) => coordsEqual(diff, otherDiff)));

              if (overlappingDiffs.length >= minOverlaps - 1) {
                overlappingBeacons.push({
                  fromBase: baseBeacon.value,
                  fromUnknown: beacon.value,
                });
              }
            }
          }

          if (overlappingBeacons.length < minOverlaps) continue;

          unknownScanner.finalBeaconPermutation = permutation;

          const refBeacon = overlappingBeacons[0];
          const absPosition = addCoords(knownScanner.position, refBeacon.fromBase);
          unknownScanner.position = subtractCoords(absPosition, refBeacon.fromUnknown);

          knownScanners.push(unknownScanner);
          break main;
        }
      }
    }
  }

  return scanners;
};

let cachedScannersFromPart1: Scanner[] | null = null;

const part1: Solution = (rawInput: string) => {
  let scanners = parseInput(rawInput);
  scanners = inferScannerPositions(scanners, 12);

  cachedScannersFromPart1 = scanners;

  let beacons = Set<string>();

  for (const scanner of scanners) {
    if (!scanner.position || !scanner.finalBeaconPermutation) continue;

    for (const relativeBeacon of scanner.finalBeaconPermutation) {
      const absPosition = addCoords(scanner.position, relativeBeacon.value);
      beacons = beacons.add(absPosition.join(","));
    }
  }

  return beacons.size;
};

const part2: Solution = (rawInput: string) => {
  const scanners = cachedScannersFromPart1 || inferScannerPositions(parseInput(rawInput), 12);

  let maxDistance = 0;
  for (const { position: p1 } of scanners) {
    for (const { position: p2 } of scanners) {
      if (!p1 || !p2) throw new Error("A scanner is missing its position");
      if (p1 === p2) continue;

      const distance = Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]) + Math.abs(p2[2] - p1[2]);
      if (distance > maxDistance) maxDistance = distance;
    }
  }

  return maxDistance;
};

run({
  part1: {
    tests: [
      {
        input: `
          --- scanner 0 ---
          404,-588,-901
          528,-643,409
          -838,591,734
          390,-675,-793
          -537,-823,-458
          -485,-357,347
          -345,-311,381
          -661,-816,-575
          -876,649,763
          -618,-824,-621
          553,345,-567
          474,580,667
          -447,-329,318
          -584,868,-557
          544,-627,-890
          564,392,-477
          455,729,728
          -892,524,684
          -689,845,-530
          423,-701,434
          7,-33,-71
          630,319,-379
          443,580,662
          -789,900,-551
          459,-707,401

          --- scanner 1 ---
          686,422,578
          605,423,415
          515,917,-361
          -336,658,858
          95,138,22
          -476,619,847
          -340,-569,-846
          567,-361,727
          -460,603,-452
          669,-402,600
          729,430,532
          -500,-761,534
          -322,571,750
          -466,-666,-811
          -429,-592,574
          -355,545,-477
          703,-491,-529
          -328,-685,520
          413,935,-424
          -391,539,-444
          586,-435,557
          -364,-763,-893
          807,-499,-711
          755,-354,-619
          553,889,-390

          --- scanner 2 ---
          649,640,665
          682,-795,504
          -784,533,-524
          -644,584,-595
          -588,-843,648
          -30,6,44
          -674,560,763
          500,723,-460
          609,671,-379
          -555,-800,653
          -675,-892,-343
          697,-426,-610
          578,704,681
          493,664,-388
          -671,-858,530
          -667,343,800
          571,-461,-707
          -138,-166,112
          -889,563,-600
          646,-828,498
          640,759,510
          -630,509,768
          -681,-892,-333
          673,-379,-804
          -742,-814,-386
          577,-820,562

          --- scanner 3 ---
          -589,542,597
          605,-692,669
          -500,565,-823
          -660,373,557
          -458,-679,-417
          -488,449,543
          -626,468,-788
          338,-750,-386
          528,-832,-391
          562,-778,733
          -938,-730,414
          543,643,-506
          -524,371,-870
          407,773,750
          -104,29,83
          378,-903,-323
          -778,-728,485
          426,699,580
          -438,-605,-362
          -469,-447,-387
          509,732,623
          647,635,-688
          -868,-804,481
          614,-800,639
          595,780,-596

          --- scanner 4 ---
          727,592,562
          -293,-554,779
          441,611,-461
          -714,465,-776
          -743,427,-804
          -660,-479,-426
          832,-632,460
          927,-485,-438
          408,393,-506
          466,436,-512
          110,16,151
          -258,-428,682
          -393,719,612
          -211,-452,876
          808,-476,-593
          -575,615,604
          -485,667,467
          -680,325,-822
          -627,-443,-432
          872,-547,-609
          833,512,582
          807,604,487
          839,-516,451
          891,-625,532
          -652,-548,-490
          30,-46,-14      
        `,
        expected: 79,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          --- scanner 0 ---
          404,-588,-901
          528,-643,409
          -838,591,734
          390,-675,-793
          -537,-823,-458
          -485,-357,347
          -345,-311,381
          -661,-816,-575
          -876,649,763
          -618,-824,-621
          553,345,-567
          474,580,667
          -447,-329,318
          -584,868,-557
          544,-627,-890
          564,392,-477
          455,729,728
          -892,524,684
          -689,845,-530
          423,-701,434
          7,-33,-71
          630,319,-379
          443,580,662
          -789,900,-551
          459,-707,401

          --- scanner 1 ---
          686,422,578
          605,423,415
          515,917,-361
          -336,658,858
          95,138,22
          -476,619,847
          -340,-569,-846
          567,-361,727
          -460,603,-452
          669,-402,600
          729,430,532
          -500,-761,534
          -322,571,750
          -466,-666,-811
          -429,-592,574
          -355,545,-477
          703,-491,-529
          -328,-685,520
          413,935,-424
          -391,539,-444
          586,-435,557
          -364,-763,-893
          807,-499,-711
          755,-354,-619
          553,889,-390

          --- scanner 2 ---
          649,640,665
          682,-795,504
          -784,533,-524
          -644,584,-595
          -588,-843,648
          -30,6,44
          -674,560,763
          500,723,-460
          609,671,-379
          -555,-800,653
          -675,-892,-343
          697,-426,-610
          578,704,681
          493,664,-388
          -671,-858,530
          -667,343,800
          571,-461,-707
          -138,-166,112
          -889,563,-600
          646,-828,498
          640,759,510
          -630,509,768
          -681,-892,-333
          673,-379,-804
          -742,-814,-386
          577,-820,562

          --- scanner 3 ---
          -589,542,597
          605,-692,669
          -500,565,-823
          -660,373,557
          -458,-679,-417
          -488,449,543
          -626,468,-788
          338,-750,-386
          528,-832,-391
          562,-778,733
          -938,-730,414
          543,643,-506
          -524,371,-870
          407,773,750
          -104,29,83
          378,-903,-323
          -778,-728,485
          426,699,580
          -438,-605,-362
          -469,-447,-387
          509,732,623
          647,635,-688
          -868,-804,481
          614,-800,639
          595,780,-596

          --- scanner 4 ---
          727,592,562
          -293,-554,779
          441,611,-461
          -714,465,-776
          -743,427,-804
          -660,-479,-426
          832,-632,460
          927,-485,-438
          408,393,-506
          466,436,-512
          110,16,151
          -258,-428,682
          -393,719,612
          -211,-452,876
          808,-476,-593
          -575,615,604
          -485,667,467
          -680,325,-822
          -627,-443,-432
          872,-547,-609
          833,512,582
          807,604,487
          839,-516,451
          891,-625,532
          -652,-548,-490
          30,-46,-14      
        `,
        expected: 3621,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
