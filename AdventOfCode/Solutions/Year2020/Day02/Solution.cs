using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day02 : ASolution
    {
        string[] Passwords;

        public Day02() : base(02, 2020, "Password Philosophy")
        {
            Passwords = Input.SplitByNewline();
        }

        protected override string SolvePartOne()
        {
            int numberOfCorrectPasswords = 0;
            foreach (var password in Passwords)
            {
                int found = password.IndexOf(": ");

                string fullRule = password.Substring(0, found);
                int[] counts = fullRule.Substring(0, found - 1).ToIntArray("-");
                string letter = fullRule.Substring(found - 1);

                string pass = password.Substring(found + 2);

                int numberOfCharsInPass = pass.Count(f => f == letter.ToCharArray()[0]);

                if (numberOfCharsInPass >= counts[0] && numberOfCharsInPass <= counts[1])
                {
                    numberOfCorrectPasswords += 1;
                }
            }
            return numberOfCorrectPasswords.ToString();
        }

        protected override string SolvePartTwo()
        {
            int numberOfCorrectPasswords = 0;

            foreach (var password in Passwords)
            {
                int found = password.IndexOf(": ");

                string fullRule = password.Substring(0, found);
                int[] positions = fullRule.Substring(0, found - 1).ToIntArray("-");
                char letter = fullRule.Substring(found - 1)[0];

                string pass = password.Substring(found + 2);

                char[] charsInPositions = new char[2] { pass[positions[0] - 1], pass[positions[1] - 1] };

                if (charsInPositions[0] == letter && charsInPositions[1] != letter)
                {
                    numberOfCorrectPasswords += 1;
                }

                if (charsInPositions[1] == letter && charsInPositions[0] != letter)
                {
                    numberOfCorrectPasswords += 1;
                }
            }


            return numberOfCorrectPasswords.ToString();
        }
    }
}
