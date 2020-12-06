using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day06 : ASolution
    {
        string[] Declarations;

        public Day06() : base(06, 2020, "Custom Customs")
        {
            Declarations = Input.Split(new string[] { Environment.NewLine + Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);
        }

        protected override string SolvePartOne()
        {
            int totalCounts = 0;
            foreach (var declaration in Declarations)
            {
                string cleanedString = declaration.Replace("\n", "").Replace("\r", "");
                int uniqueAnswers = cleanedString.Distinct().ToArray().Length;
                totalCounts += uniqueAnswers;
            }
            return totalCounts.ToString();
        }

        protected override string SolvePartTwo()
        {
            int totalCounts = 0;
            foreach (var declaration in Declarations)
            {
                string[] people = declaration.Split(new string[] { Environment.NewLine },
                               StringSplitOptions.RemoveEmptyEntries);

                int commonAnswers = 0;
                foreach (var character in people[0].ToCharArray())
                {
                    int count = declaration.Count(f => f == character);
                    if (count == people.Length)
                    {
                        commonAnswers += 1;
                    }
                }
                totalCounts += commonAnswers;
            }
            return totalCounts.ToString();
        }
    }
}
