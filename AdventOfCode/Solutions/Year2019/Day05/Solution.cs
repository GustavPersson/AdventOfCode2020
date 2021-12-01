using System;
using System.Collections.Generic;
using System.Text;
using AdventOfCode.UserClasses;
using System.Linq;

namespace AdventOfCode.Solutions.Year2019
{

    class Day05 : ASolution
    {
        readonly long[] BaseProgram;
        readonly IntCode cpu;

        public Day05() : base(05, 2019, "Sunny with a Chance of Asteroids")
        {
            BaseProgram = Input.ToLongArray(",");
            cpu = new IntCode(BaseProgram);
        }

        protected override string SolvePartOne()
        {
            long lastItem = long.MinValue;
            cpu.ReadyInput(1);
            foreach (long item in cpu.RunProgram())
            {
                Console.WriteLine(item);
                lastItem = item;
            }
            return lastItem.ToString();
        }

        protected override string SolvePartTwo()
        {
            return null;
        }
    }
}
