using System;
using System.Collections.Generic;
using System.Text;
using AdventOfCode.UserClasses;


namespace AdventOfCode.Solutions.Year2019
{

    class Day02 : ASolution
    {
        int[] Opcodes;

        private readonly IntCode IntCodePC;
        public Day02() : base(02, 2019, "1202 Program Alarm")
        {
            Opcodes = Input.ToIntArray(",");
            IntCodePC = new IntCode(Input.ToLongArray(","));
        }

        protected override string SolvePartOne()
        {
            IntCodePC.Program[1] = 12;
            IntCodePC.Program[2] = 2;
            foreach (long _ in IntCodePC.RunProgram()) { }
            return IntCodePC.PreviousRunState[0].ToString();
        }

        protected override string SolvePartTwo()
        {
            for (int i = 0; i < 100; i++)
            {
                for (int j = 0; j < 100; j++)
                {
                    IntCodePC.Program[1] = i;
                    IntCodePC.Program[2] = j;
                    foreach (long _ in IntCodePC.RunProgram()) { }

                    if (IntCodePC.PreviousRunState[0] == 19690720) return ((100 * i) + j).ToString();
                }
            }

            return null;
        }
    }
}
