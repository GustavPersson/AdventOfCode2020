import run from "aocrunner";

import _ from "lodash";
import log from "loglevel";

import { Solution } from "../types.js";
import { getLines } from "../utils/index.js";
import { Vector2, Vector3 } from "../utils/Vector.js";

log.enableAll();

interface Instruction {
  turn: string;
  rangeX: Vector2;
  rangeY: Vector2;
  rangeZ: Vector2;
}

class Cuboid {
  public constructor(public from: Vector3, public to: Vector3) {}

  public size(): Vector3 {
    return this.to.clone().subtract(this.from);
  }

  public getVertices(): Vector3[] {
    const size = this.size();

    return [
      this.from.clone(),
      this.from.clone().add(new Vector3(size.x, 0, 0)),
      this.from.clone().add(new Vector3(0, size.y, 0)),
      this.from.clone().add(new Vector3(size.x, size.y, 0)),
      this.from.clone().add(new Vector3(0, 0, size.z)),
      this.from.clone().add(new Vector3(size.x, 0, size.z)),
      this.from.clone().add(new Vector3(0, size.y, size.z)),
      this.from.clone().add(new Vector3(size.x, size.y, size.z)),
    ];
  }

  public intersects(cuboid: Cuboid): boolean {
    if (this.to.x > cuboid.from.x && this.from.x < cuboid.to.x && this.to.y > cuboid.from.y && this.from.y < cuboid.to.y && this.to.z > cuboid.from.z && this.from.z < cuboid.to.z)
      return true;

    return false;
  }

  public volume(): number {
    const size = this.size();
    return size.x * size.y * size.z;
  }

  public fixVertices() {
    const { from, to } = this;

    if (from.x > to.x) {
      [from.x, to.x] = [to.x, from.x];
    }

    if (from.y > to.y) {
      [from.y, to.y] = [to.y, from.y];
    }

    if (from.z > to.z) {
      [from.z, to.z] = [to.z, from.z];
    }
  }

  public isValid() {
    return this.to.greaterThan(this.from);
  }
}

const pointVsAAABBB = (point: Vector3, aaa: Vector3, bbb: Vector3) => point.equalOrGreaterThan(aaa) && point.equalOrLessThan(bbb);

const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(num, min), max);

const getTotalVolume = (cuboids: Cuboid[]): number => {
  const volumes = cuboids.map((cuboid) => cuboid.volume());
  return volumes.reduce((a, b) => a + b, 0);
};

const getDifferentAxis = (v1: Vector3, v2: Vector3): number => v1.toArray().findIndex((pos, i) => v2.toArray()[i] !== pos);

const getCommonAxis = (vectors: Vector3[]): number => vectors[0].toArray().findIndex((pos, i) => vectors.every((other) => other.toArray()[i] === pos));

const makeVertexPartition = (from: Vector3, to: Vector3, v: number) => {
  const sideIndex = v % 4;

  if (v >= 4) {
    // Vertice at Z: 1
    [from.z, to.z] = [to.z, from.z];
  }

  if (sideIndex === 1 || sideIndex === 3) {
    // Vertice at 1, 0 or 1, 1
    [from.x, to.x] = [to.x, from.x];
  }

  if (sideIndex === 2 || sideIndex === 3) {
    // Vertice at 0, 1 or 1, 1
    [from.y, to.y] = [to.y, from.y];
  }

  return new Cuboid(from, to);
};

const parseInput = (rawInput: string) =>
  getLines(rawInput).map((line) => {
    const [turn, ranges] = line.split(" ");
    const [rangeX, rangeY, rangeZ] = ranges.split(",").map((str) => Vector2.fromArray(str.split("=")[1].split("..").map(Number)));
    return { turn, rangeX, rangeY, rangeZ };
  });

const splitIntersections = (cuboids: Cuboid[], cuboid: Cuboid): Cuboid[] => {
  // Remove smaller overlapping cuboids
  cuboids = cuboids.filter((other) => !(other.from.equalOrGreaterThan(cuboid.from) && other.to.equalOrLessThan(cuboid.to)));

  const intersects = cuboids.filter((other) => cuboid !== other && cuboid.intersects(other));
  cuboids = cuboids.filter((other) => !intersects.includes(other));

  // Split intersections into multiple cuboids
  for (const intersect of intersects) {
    // console.log('---- intersection start ---- VOLUME:', intersect.volume());
    const vertices = cuboid.getVertices();
    const otherVertices = intersect.getVertices();

    // Vertex partitions
    for (let v = 0; v < vertices.length; v++) {
      if (pointVsAAABBB(otherVertices[v], cuboid.from, cuboid.to)) continue;

      const partition = makeVertexPartition(otherVertices[v].clone(), vertices[v].clone(), v);
      if (partition.isValid()) {
        // console.log('Adding vertex partition with volume:', partition.volume());
        cuboids.push(partition);
      }
    }

    // Face partitions
    const faces = [
      [0, 1, 2, 3], // +Z
      [4, 5, 6, 7], // -Z
      [2, 3, 6, 7], // +Y
      [0, 1, 4, 5], // -Y
      [1, 3, 5, 7], // +X
      [0, 2, 4, 6], // -X
    ];

    for (const vertexIndices of faces) {
      const fromFace = vertexIndices.map((v) => vertices[v].clone());
      const toFace = vertexIndices.map((v) => otherVertices[v].clone());

      const commonAxisIndex = getCommonAxis(fromFace);

      if (commonAxisIndex === -1) throw new Error("No common face axis found");
      const commonAxis = commonAxisIndex === 0 ? "x" : commonAxisIndex === 1 ? "y" : "z";

      if (
        toFace.some((vertex) => {
          const pos = vertex[commonAxis];

          const facesWithSameDiffAxis = faces.map((face) => face.map((v) => vertices[v])).filter((face) => getCommonAxis(face) === commonAxisIndex);

          if (facesWithSameDiffAxis.length !== 2) throw new Error("Faces with same common axis must be 2");

          const [min, max] = facesWithSameDiffAxis.map((vec) => vec[0][commonAxis]).sort((a, b) => a - b);

          return pos >= min && pos <= max;
        })
      ) {
        continue;
      }

      // Clamp face size
      for (let axis = 0; axis < 3; axis++) {
        if (axis === commonAxisIndex) continue;

        for (let v = 0; v < fromFace.length; v++) {
          const vertex = toFace[v].toArray();

          vertex[axis] = clamp(vertex[axis], fromFace[0].toArray()[axis], fromFace[3].toArray()[axis]);
          toFace[v] = Vector3.fromArray(vertex);
        }
      }

      const allVertices = [
        ...toFace,
        ...toFace.map((vertex) => {
          vertex = vertex.clone();
          vertex[commonAxis] = fromFace[3][commonAxis];
          return vertex;
        }),
      ];

      allVertices.sort((a, b) => a[commonAxis] - b[commonAxis]);

      const partition = new Cuboid(allVertices[0], allVertices[allVertices.length - 1]);
      partition.fixVertices();

      // console.log('Adding face partition with volume:', partition.volume());
      cuboids.push(partition);
    }

    // Edge partitions
    const edgeIndices = [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [0, 2],
      [1, 3],
      [4, 6],
      [5, 7],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    const edges = edgeIndices.map((edge) => edge.map((v) => vertices[v]));
    const otherEdges = edgeIndices.map((edge) => edge.map((v) => otherVertices[v]));

    for (let e = 0; e < edges.length; e++) {
      const edge = edges[e].map((vec) => vec.clone());
      const otherEdge = otherEdges[e].map((vec) => vec.clone());

      const diffAxis = getDifferentAxis(edge[0], edge[1]);

      if (
        otherEdge.some((vertex) => {
          const pos = Vector2.fromArray(vertex.toArray().filter((_, i) => i !== diffAxis));

          const edgesWithSameDiffAxis = edges.filter((edge) => getDifferentAxis(edge[0], edge[1]) === diffAxis);

          if (edgesWithSameDiffAxis.length !== 4) throw new Error("Edges with the same different axis must be 4");

          const [from, , , to] = edgesWithSameDiffAxis.map((edge) => Vector2.fromArray(edge[0].toArray().filter((_, i) => i !== diffAxis)));

          return (pos.x >= from.x && pos.x <= to.x) || (pos.y >= from.y && pos.y <= to.y);
        })
      )
        continue;

      if (diffAxis === -1) throw new Error("No different edge axis found");

      // Clamp edge length
      for (let v = 0; v < edge.length; v++) {
        const vertex = otherEdge[v].toArray();

        vertex[diffAxis] = clamp(vertex[diffAxis], edge[0].toArray()[diffAxis], edge[1].toArray()[diffAxis]);

        otherEdge[v] = Vector3.fromArray(vertex);
      }

      const endpointArr = otherEdge[1].toArray();

      for (let axis = 0; axis < 3; axis++) {
        if (axis === diffAxis) continue;

        const diff = edge[1].toArray()[axis] - endpointArr[axis];
        endpointArr[axis] += diff;
      }

      const partition = new Cuboid(otherEdge[0], Vector3.fromArray(endpointArr));
      partition.fixVertices();

      // console.log('Adding edge partition with volume:', partition.volume());
      cuboids.push(partition);
    }
  }

  return cuboids;
};

const rebootReactor = (instructions: Instruction[]) => {
  let cuboids: Cuboid[] = [];

  for (const { turn, rangeX, rangeY, rangeZ } of instructions) {
    const cuboid = new Cuboid(new Vector3(rangeX.x, rangeY.x, rangeZ.x), new Vector3(rangeX.y + 1, rangeY.y + 1, rangeZ.y + 1));

    if (turn === "on") {
      if (!cuboids.length) {
        cuboids.push(cuboid);
        continue;
      }

      cuboids = splitIntersections(cuboids, cuboid);
      cuboids.push(cuboid);
    } else if (cuboids.length) {
      cuboids = splitIntersections(cuboids, cuboid);
    }
  }

  return cuboids;
};

const part1: Solution = (rawInput: string) => {
  const maxRange = 50;
  const instructions = parseInput(rawInput).filter((i) => [i.rangeX, i.rangeY, i.rangeZ].every((range) => range.x < maxRange && range.y > -maxRange));

  const cuboids = rebootReactor(instructions);

  return getTotalVolume(cuboids);
};

const part2: Solution = (rawInput: string) => {
  const instructions = parseInput(rawInput);
  const cuboids = rebootReactor(instructions);

  return getTotalVolume(cuboids);
};

run({
  part1: {
    tests: [
      {
        input: `
          on x=-20..26,y=-36..17,z=-47..7
          on x=-20..33,y=-21..23,z=-26..28
          on x=-22..28,y=-29..23,z=-38..16
          on x=-46..7,y=-6..46,z=-50..-1
          on x=-49..1,y=-3..46,z=-24..28
          on x=2..47,y=-22..22,z=-23..27
          on x=-27..23,y=-28..26,z=-21..29
          on x=-39..5,y=-6..47,z=-3..44
          on x=-30..21,y=-8..43,z=-13..34
          on x=-22..26,y=-27..20,z=-29..19
          off x=-48..-32,y=26..41,z=-47..-37
          on x=-12..35,y=6..50,z=-50..-2
          off x=-48..-32,y=-32..-16,z=-15..-5
          on x=-18..26,y=-33..15,z=-7..46
          off x=-40..-22,y=-38..-28,z=23..41
          on x=-16..35,y=-41..10,z=-47..6
          off x=-32..-23,y=11..30,z=-14..3
          on x=-49..-5,y=-3..45,z=-29..18
          off x=18..30,y=-20..-8,z=-3..13
          on x=-41..9,y=-7..43,z=-33..15
          on x=-54112..-39298,y=-85059..-49293,z=-27449..7877
          on x=967..23432,y=45373..81175,z=27513..53682      
        `,
        expected: 590784,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          on x=-5..47,y=-31..22,z=-19..33
          on x=-44..5,y=-27..21,z=-14..35
          on x=-49..-1,y=-11..42,z=-10..38
          on x=-20..34,y=-40..6,z=-44..1
          off x=26..39,y=40..50,z=-2..11
          on x=-41..5,y=-41..6,z=-36..8
          off x=-43..-33,y=-45..-28,z=7..25
          on x=-33..15,y=-32..19,z=-34..11
          off x=35..47,y=-46..-34,z=-11..5
          on x=-14..36,y=-6..44,z=-16..29
          on x=-57795..-6158,y=29564..72030,z=20435..90618
          on x=36731..105352,y=-21140..28532,z=16094..90401
          on x=30999..107136,y=-53464..15513,z=8553..71215
          on x=13528..83982,y=-99403..-27377,z=-24141..23996
          on x=-72682..-12347,y=18159..111354,z=7391..80950
          on x=-1060..80757,y=-65301..-20884,z=-103788..-16709
          on x=-83015..-9461,y=-72160..-8347,z=-81239..-26856
          on x=-52752..22273,y=-49450..9096,z=54442..119054
          on x=-29982..40483,y=-108474..-28371,z=-24328..38471
          on x=-4958..62750,y=40422..118853,z=-7672..65583
          on x=55694..108686,y=-43367..46958,z=-26781..48729
          on x=-98497..-18186,y=-63569..3412,z=1232..88485
          on x=-726..56291,y=-62629..13224,z=18033..85226
          on x=-110886..-34664,y=-81338..-8658,z=8914..63723
          on x=-55829..24974,y=-16897..54165,z=-121762..-28058
          on x=-65152..-11147,y=22489..91432,z=-58782..1780
          on x=-120100..-32970,y=-46592..27473,z=-11695..61039
          on x=-18631..37533,y=-124565..-50804,z=-35667..28308
          on x=-57817..18248,y=49321..117703,z=5745..55881
          on x=14781..98692,y=-1341..70827,z=15753..70151
          on x=-34419..55919,y=-19626..40991,z=39015..114138
          on x=-60785..11593,y=-56135..2999,z=-95368..-26915
          on x=-32178..58085,y=17647..101866,z=-91405..-8878
          on x=-53655..12091,y=50097..105568,z=-75335..-4862
          on x=-111166..-40997,y=-71714..2688,z=5609..50954
          on x=-16602..70118,y=-98693..-44401,z=5197..76897
          on x=16383..101554,y=4615..83635,z=-44907..18747
          off x=-95822..-15171,y=-19987..48940,z=10804..104439
          on x=-89813..-14614,y=16069..88491,z=-3297..45228
          on x=41075..99376,y=-20427..49978,z=-52012..13762
          on x=-21330..50085,y=-17944..62733,z=-112280..-30197
          on x=-16478..35915,y=36008..118594,z=-7885..47086
          off x=-98156..-27851,y=-49952..43171,z=-99005..-8456
          off x=2032..69770,y=-71013..4824,z=7471..94418
          on x=43670..120875,y=-42068..12382,z=-24787..38892
          off x=37514..111226,y=-45862..25743,z=-16714..54663
          off x=25699..97951,y=-30668..59918,z=-15349..69697
          off x=-44271..17935,y=-9516..60759,z=49131..112598
          on x=-61695..-5813,y=40978..94975,z=8655..80240
          off x=-101086..-9439,y=-7088..67543,z=33935..83858
          off x=18020..114017,y=-48931..32606,z=21474..89843
          off x=-77139..10506,y=-89994..-18797,z=-80..59318
          off x=8476..79288,y=-75520..11602,z=-96624..-24783
          on x=-47488..-1262,y=24338..100707,z=16292..72967
          off x=-84341..13987,y=2429..92914,z=-90671..-1318
          off x=-37810..49457,y=-71013..-7894,z=-105357..-13188
          off x=-27365..46395,y=31009..98017,z=15428..76570
          off x=-70369..-16548,y=22648..78696,z=-1892..86821
          on x=-53470..21291,y=-120233..-33476,z=-44150..38147
          off x=-93533..-4276,y=-16170..68771,z=-104985..-24507        
      `,
        expected: 2758514936282235,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
});
