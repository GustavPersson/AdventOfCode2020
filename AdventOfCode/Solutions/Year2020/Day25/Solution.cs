using System;
using System.Collections.Generic;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day25 : ASolution
    {
        long DoorKey;
        long CardKey;

        long DoorLoopSize;
        long CardLoopSize;

        readonly long SubjectNumber = 7;

        public Day25() : base(25, 2020, "Combo Breaker")
        {
            CardKey = long.Parse(Input.SplitByNewline()[0]);
            DoorKey = long.Parse(Input.SplitByNewline()[1]);
        }

        protected override string SolvePartOne()
        {
            long key = 1;
            DoorLoopSize = 0;
            CardLoopSize = 0;

            do
            {
                key *= SubjectNumber;
                key %= 20201227;
                DoorLoopSize++;
            } while (key != DoorKey);

            key = 1;
            do
            {
                key *= SubjectNumber;
                key %= 20201227;
                CardLoopSize++;
            } while (key != CardKey);

            key = 1;

            for (long i = 0; i < CardLoopSize; i++)
            {
                key *= DoorKey;
                key %= 20201227;
            }
            return key.ToString();
        }

        protected override string SolvePartTwo()
        {
            return "God Jul!";
        }
    }
}
