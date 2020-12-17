using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static AdventOfCode.Solutions.Utilities;
namespace AdventOfCode.Solutions.Year2019
{
    class Day03 : ASolution
    {
        Dictionary<(int x, int y), int> RedWirePath = new Dictionary<(int x, int y), int>();
        Dictionary<(int x, int y), int> BlueWirePath = new Dictionary<(int x, int y), int>();

        (int x, int y)[] intersections;

        public Day03() : base(03, 2019, "Crossed Wires")
        {
            var paths = Input.SplitByNewline();
            RedWirePath = GetPath(paths[0]);
            BlueWirePath = GetPath(paths[1]);

            intersections = RedWirePath.Keys.Intersect(BlueWirePath.Keys).ToArray();
        }

        private static Dictionary<(int x, int y), int> GetPath(string Path)
        {
            var r = new Dictionary<(int, int), int>();
            int x = 0, y = 0, pathLength = 0;
            foreach (var PathInstruction in Path.Split(","))
            {
                var dir = PathInstruction[0].ToString();
                var dist = int.Parse(PathInstruction[1..]);
                for (var d = 0; d < dist; d++)
                {
                    var newPoint = dir switch
                    {
                        "R" => (++x, y),
                        "D" => (x, --y),
                        "L" => (--x, y),
                        "U" => (x, ++y),
                        _ => throw new Exception()
                    };
                    r.TryAdd(newPoint, ++pathLength);
                }
            }

            return r;
        }

        protected override string SolvePartOne()
        {
            return intersections.Min(p => Math.Abs(p.x) + Math.Abs(p.y)).ToString();
        }

        protected override string SolvePartTwo()
        {
            return intersections.Min(x => RedWirePath[x] + BlueWirePath[x]).ToString();
        }
    }
}
