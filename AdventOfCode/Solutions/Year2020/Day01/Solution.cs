using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day01 : ASolution
    {

        int[] Expenses;

        public Day01() : base(01, 2020, "Report Repair")
        {
            Expenses = Input.ToIntArray("\n").Where(e => e < 2020).ToArray();
        }

        protected override string SolvePartOne()
        {
            foreach (var expense1 in Expenses)
            {
                foreach (var expense2 in Expenses)
                {
                    if (expense1 + expense2 == 2020)
                    {
                        return (expense1 * expense2).ToString();
                    }
                }

            }
            return null;
        }

        protected override string SolvePartTwo()
        {
            foreach (var expense1 in Expenses)
            {
                foreach (var expense2 in Expenses)
                {
                    foreach (var expense3 in Expenses)
                    {

                        if (expense1 + expense2 + expense3 == 2020)
                        {
                            return (expense1 * expense2 * expense3).ToString();
                        }
                    }
                }

            }
            return null;
        }
    }
}
