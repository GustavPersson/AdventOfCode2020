using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;


namespace AdventOfCode.Solutions.Year2020
{

    class Day10 : ASolution
    {
        readonly List<int> Adapters;
        readonly Dictionary<int, long> KnownCounts = new Dictionary<int, long>();

        public Day10() : base(10, 2020, "Adapter Array")
        {
            Adapters = Input.SplitByNewline().Select(Int32.Parse).ToList();

            Adapters.Sort();
            Adapters.Insert(0, 0);
            Adapters.Add(Adapters.Last() + 3);
        }

        protected override string SolvePartOne()
        {
            var adapterDifferences = Adapters.Zip(Adapters.Skip(1), Compare);
            return (adapterDifferences.Count(val => val == 1) * adapterDifferences.Count(val => val == 3)).ToString();
        }

        protected override string SolvePartTwo()
        {
            KnownCounts[Adapters.Count - 1] = 0; //No paths past the laptop. 
            KnownCounts[Adapters.Count - 2] = 1; //Final adapter is only connected to the lappy toppy
            FindValid(0);

            return KnownCounts[0].ToString();
        }

        static Int32 Compare(Int32 first, Int32 second)
        {
            return second - first;
        }


        long FindValid(int start)
        {
            if (KnownCounts.ContainsKey(start)) return KnownCounts[start];

            long tmp = 0;
            for (int i = 1; i <= 3; i++)
            {
                if ((start + i < Adapters.Count) && (Adapters[start + i] - Adapters[start] <= 3))
                {
                    tmp += FindValid(start + i);
                }
            }
            KnownCounts[start] = tmp;
            return tmp;
        }
    }
}
