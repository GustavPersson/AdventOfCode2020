using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using MoreLinq;


namespace AdventOfCode.Solutions.Year2019
{

    class Day04 : ASolution
    {
        int[] Range;
        public Day04() : base(04, 2019, "Secure Container")
        {
            Range = Input.Split('-').Select(number => Int32.Parse(number)).ToArray();
        }

        protected override string SolvePartOne()
        {
            return Enumerable.Range(Range[0], Range[1] - Range[0] + 1)
                .Where(i => i.ToString().Window(2).All(x => x[0] <= x[1]))
                .Where(i => i.ToString().GroupAdjacent(c => c).Any(g => g.Count() >= 2))
                .Count()
                .ToString();
        }

        protected override string SolvePartTwo()
        {
            return Enumerable.Range(Range[0], Range[1] - Range[0] + 1)
                .Where(i => i.ToString().Window(2).All(x => x[0] <= x[1]))
                .Where(i => i.ToString().GroupAdjacent(c => c).Any(g => g.Count() == 2))
                .Count()
                .ToString();
        }
    }
}
