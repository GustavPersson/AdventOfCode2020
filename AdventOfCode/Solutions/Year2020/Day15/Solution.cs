using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day15 : ASolution
    {
        List<int> StartingNumbers;
        List<int> SpokenNumbers;
        Dictionary<int, int> LastTimeSpoken;
        public Day15() : base(15, 2020, "Rambunctious Recitation")
        {
            StartingNumbers = Input.ToIntArray(",").ToList();
        }

        private string PlayMemoryGame(int iterations)
        {

            SpokenNumbers.Capacity = iterations;

            int PreviousNumberSpoken = 0;

            for (int currentRound = StartingNumbers.Count; currentRound < iterations; currentRound++)
            {
                PreviousNumberSpoken = SpokenNumbers[^1];
                var lastTimeSpoken = LastTimeSpoken.GetValueOrDefault(PreviousNumberSpoken, -1);
                if (lastTimeSpoken == -1)
                {
                    lastTimeSpoken = 0;
                }
                else
                {
                    lastTimeSpoken = currentRound - lastTimeSpoken;
                }
                LastTimeSpoken[PreviousNumberSpoken] = currentRound;
                SpokenNumbers.Add(lastTimeSpoken);
            }

            return SpokenNumbers[^1].ToString();

        }

        protected override string SolvePartOne()
        {
            LastTimeSpoken = new Dictionary<int, int>();
            SpokenNumbers = new List<int>(StartingNumbers);

            for (int i = 1; i <= StartingNumbers.Count; i++)
            {
                LastTimeSpoken.Add(StartingNumbers[i - 1], i);
            }
            return PlayMemoryGame(2020);
        }

        protected override string SolvePartTwo()
        {
            LastTimeSpoken = new Dictionary<int, int>();
            SpokenNumbers = new List<int>(StartingNumbers);

            for (int i = 1; i <= StartingNumbers.Count; i++)
            {
                LastTimeSpoken.Add(StartingNumbers[i - 1], i);
            }
            return PlayMemoryGame(30000000);
        }
    }
}
