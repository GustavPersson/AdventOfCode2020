using System;
using System.Collections.Generic;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day17 : ASolution
    {

        public class ConwayCubes
        {
            public HashSet<(int x, int y, int z)> ActiveCubes;
            private HashSet<(int x, int y, int z)> TransientCubes;
            private readonly Dictionary<(int x, int y, int z), int> NeighbouringCubes;

            private static readonly List<(int x, int y, int z)> Offsets = new List<(int, int, int)>()
            {
                (1, 1,  0), (1, 0,  0), (1, -1,  0), (0, -1,  0), (-1, -1,  0), (-1, 0,  0), (-1, 1,  0), (0, 1,  0),
                (1, 1,  1), (1, 0,  1), (1, -1,  1), (0, -1,  1), (-1, -1,  1), (-1, 0,  1), (-1, 1,  1), (0, 1,  1), (0, 0,  1),
                (1, 1, -1), (1, 0, -1), (1, -1, -1), (0, -1, -1), (-1, -1, -1), (-1, 0, -1), (-1, 1, -1), (0, 1, -1), (0, 0, -1)
            };


            public ConwayCubes(string[] GridRows)
            {
                ActiveCubes = new HashSet<(int, int, int)>();
                TransientCubes = new HashSet<(int, int, int)>();
                NeighbouringCubes = new Dictionary<(int, int, int), int>();

                for (int x = 0; x < GridRows.Length; x++)
                {
                    for (int y = 0; y < GridRows[x].Length; y++)
                    {
                        if (GridRows[x][y] == '#')
                        {
                            ActiveCubes.Add((x, y, 0));
                        }

                    }

                }

            }

            public int CalculateActiveCubesAfterNumCycles(int numCycles)
            {
                for (int i = 0; i < numCycles; i++)
                {
                    ExecuteCycle();
                }

                return ActiveCubes.Count;
            }

            private void ExecuteCycle()
            {
                NeighbouringCubes.Clear();
                foreach (var cube in ActiveCubes)
                {
                    TouchNeighbours(cube);
                }

                // Calculate new active grid
                TransientCubes.Clear();
                foreach (var (cube, count) in NeighbouringCubes)
                {
                    if (count == 2 && ActiveCubes.Contains(cube))
                    {
                        TransientCubes.Add(cube);
                    }
                    else if (count == 3)
                    {
                        TransientCubes.Add(cube);
                    }
                }

                // Swap active sets
                var tmp = ActiveCubes;
                ActiveCubes = TransientCubes;
                TransientCubes = tmp;
            }

            private void TouchNeighbours((int x, int y, int z) cube)
            {
                foreach (var (x, y, z) in Offsets)
                {
                    var pos = (cube.x + x, cube.y + y, cube.z + z);
                    if (NeighbouringCubes.ContainsKey(pos))
                    {
                        NeighbouringCubes[pos]++;
                    }
                    else
                    {
                        NeighbouringCubes[pos] = 1;
                    }
                }
            }

        }

        public class HyperCubes
        {
            public HashSet<(int x, int y, int z, int w)> ActiveCubes;
            private HashSet<(int x, int y, int z, int w)> TransientCubes;
            private readonly Dictionary<(int x, int y, int z, int w), int> NeighbouringCubes;
            private static readonly List<(int x, int y, int z, int w)> Offsets = new List<(int, int, int, int)>()
        {
            (1, 1, 0, 0), (1, 0, 0, 0), (1, -1, 0, 0), (0, -1, 0, 0), (-1, -1, 0, 0), (-1, 0, 0, 0), (-1, 1, 0, 0), (0, 1, 0, 0), (0, 0, 1, 0), (1, 1, 1, 0), (1, 0, 1, 0), (1, -1, 1, 0), (0, -1, 1, 0), (-1, -1, 1, 0), (-1, 0, 1, 0), (-1, 1, 1, 0), (0, 1, 1, 0), (0, 0, -1, 0), (1, 1, -1, 0), (1, 0, -1, 0), (1, -1, -1, 0), (0, -1, -1, 0), (-1, -1, -1, 0), (-1, 0, -1, 0), (-1, 1, -1, 0), (0, 1, -1, 0),
            (0, 0, 0, 1), (1, 1, 0, 1), (1, 0, 0, 1), (1, -1, 0, 1), (0, -1, 0, 1), (-1, -1, 0, 1), (-1, 0, 0, 1), (-1, 1, 0, 1), (0, 1, 0, 1), (0, 0, 1, 1), (1, 1, 1, 1), (1, 0, 1, 1), (1, -1, 1, 1), (0, -1, 1, 1), (-1, -1, 1, 1), (-1, 0, 1, 1), (-1, 1, 1, 1), (0, 1, 1, 1), (0, 0, -1, 1), (1, 1, -1, 1), (1, 0, -1, 1), (1, -1, -1, 1), (0, -1, -1, 1), (-1, -1, -1, 1), (-1, 0, -1, 1), (-1, 1, -1, 1),
            (0, 1, -1, 1), (0, 0, 0, -1), (1, 1, 0, -1), (1, 0, 0, -1), (1, -1, 0, -1), (0, -1, 0, -1), (-1, -1, 0, -1), (-1, 0, 0, -1), (-1, 1, 0, -1), (0, 1, 0, -1), (0, 0, 1, -1), (1, 1, 1, -1), (1, 0, 1, -1), (1, -1, 1, -1), (0, -1, 1, -1), (-1, -1, 1, -1), (-1, 0, 1, -1), (-1, 1, 1, -1), (0, 1, 1, -1), (0, 0, -1, -1), (1, 1, -1, -1), (1, 0, -1, -1), (1, -1, -1, -1), (0, -1, -1, -1), (-1, -1, -1, -1), (-1, 0, -1, -1), (-1, 1, -1, -1), (0, 1, -1, -1)
        };

            public HyperCubes(string[] GridRows)
            {
                ActiveCubes = new HashSet<(int, int, int, int)>();
                TransientCubes = new HashSet<(int, int, int, int)>();
                NeighbouringCubes = new Dictionary<(int, int, int, int), int>();
                // Parse Grid
                for (int x = 0; x < GridRows.Length; x++)
                {
                    for (int y = 0; y < GridRows[x].Length; y++)
                    {
                        if (GridRows[x][y] == '#')
                        {
                            ActiveCubes.Add((x, y, 0, 0));
                        }
                    }
                }
            }

            public int CalculateActiveCubesAfterNumCycles(int numCycles)
            {
                for (int i = 0; i < numCycles; i++)
                {
                    ExecuteCycle();
                }

                return ActiveCubes.Count;
            }

            private void ExecuteCycle()
            {
                NeighbouringCubes.Clear();
                foreach (var cube in ActiveCubes)
                {
                    TouchNeighbours(cube);
                }

                // Calculate new active grid
                TransientCubes.Clear();
                foreach (var (cube, count) in NeighbouringCubes)
                {
                    if (count == 2 && ActiveCubes.Contains(cube))
                    {
                        TransientCubes.Add(cube);
                    }
                    else if (count == 3)
                    {
                        TransientCubes.Add(cube);
                    }
                }

                // Swap active sets
                var tmp = ActiveCubes;
                ActiveCubes = TransientCubes;
                TransientCubes = tmp;
            }

            private void TouchNeighbours((int x, int y, int z, int w) cube)
            {
                foreach (var (x, y, z, w) in Offsets)
                {
                    var pos = (cube.x + x, cube.y + y, cube.z + z, cube.w + w);
                    if (NeighbouringCubes.ContainsKey(pos))
                    {
                        NeighbouringCubes[pos]++;
                    }
                    else
                    {
                        NeighbouringCubes[pos] = 1;
                    }
                }
            }
        }

        string[] GridRows;

        public Day17() : base(17, 2020, "Conway Cubes")
        {
            GridRows = Input.SplitByNewline();
        }

        protected override string SolvePartOne()
        {
            var Cubes = new ConwayCubes(GridRows);

            return Cubes.CalculateActiveCubesAfterNumCycles(6).ToString();
        }

        protected override string SolvePartTwo()
        {
            var Cubes = new HyperCubes(GridRows);

            return Cubes.CalculateActiveCubesAfterNumCycles(6).ToString();
        }
    }
}
