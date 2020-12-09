using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;


namespace AdventOfCode.Solutions.Year2020
{

    class Day09 : ASolution
    {
        int[] XMAS;
        int InvalidNumberSum;

        public Day09() : base(09, 2020, "Encoding Error")
        {
            XMAS = Input.ToIntArray("\n");
        }

        protected override string SolvePartOne()
        {
            int matchingNumber = 0;
            for (int i = 25; i < XMAS.Length; i++)
            {
                int numberToCheck = XMAS[i];
                bool numberIsValid = false;

                for (int leftIterator = i - 25; leftIterator < i; leftIterator++)
                {
                    int leftHand = XMAS[leftIterator];
                    for (int rightIterator = i - 25; rightIterator < i; rightIterator++)
                    {
                        int rightHand = XMAS[rightIterator];

                        if (leftHand == rightHand)
                        {
                            continue;
                        }
                        if (leftHand + rightHand == numberToCheck)
                        {
                            numberIsValid = true;
                        }
                    }
                }
                if (!numberIsValid)
                {
                    matchingNumber = numberToCheck;
                    break;
                }
            }
            InvalidNumberSum = matchingNumber;
            return matchingNumber.ToString();
        }


        protected override string SolvePartTwo()
        {
            int matchingNumber = 0;

            for (int i = 0; i < XMAS.Length; ++i)
            {
                int sum = XMAS[i];
                for (int j = i + 1; j < XMAS.Length; j++)
                {
                    sum += XMAS[j];
                    if (sum == InvalidNumberSum)
                    {
                        return (XMAS[i..j].Min() + XMAS[i..j].Max()).ToString();
                    }
                }
            }

            return matchingNumber.ToString();
        }
    }
}
