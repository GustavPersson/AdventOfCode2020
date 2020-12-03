using System;
using System.Collections.Generic;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day03 : ASolution
    {

        string[] Map;
        int rowLength;

        public Day03() : base(03, 2020, "Toboggan Trajectory")
        {
            Map = Input.SplitByNewline();
            rowLength = Map[0].Length;
        }

        protected int getNumberOfTrees(int right, int down)
        {
            int currentColumn = 0;
            int numberOfTrees = 0;
            for (int i = down; i < Map.Length; i += down)
            {
                string row = Map[i];

                if (currentColumn + right >= rowLength)
                {
                    currentColumn = currentColumn - rowLength + right;

                    if (row[currentColumn] == '#')
                    {
                        numberOfTrees += 1;
                    }
                }
                else
                {
                    if (row[currentColumn + right] == '#')
                    {
                        numberOfTrees += 1;
                    }
                    currentColumn += right;
                }
            }

            return numberOfTrees;
        }

        protected override string SolvePartOne()
        {
            return getNumberOfTrees(3, 1).ToString();
        }

        protected override string SolvePartTwo()
        {
            int first = getNumberOfTrees(1, 1);
            int second = getNumberOfTrees(3, 1);
            int third = getNumberOfTrees(5, 1);
            int fourth = getNumberOfTrees(7, 1);
            int fifth = getNumberOfTrees(1, 2);

            return (first * second * third * fourth * fifth).ToString();
        }
    }
}
