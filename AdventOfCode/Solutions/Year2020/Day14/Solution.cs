using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Generic;

namespace AdventOfCode.Solutions.Year2020
{

    class Day14 : ASolution
    {

        public Day14() : base(14, 2020, "Docking Data")
        {
            //             DebugInput = @"
            // mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
            // mem[8] = 11
            // mem[7] = 101
            // mem[8] = 0
            // ";
        }

        protected override string SolvePartOne()
        {
            var lines = Input.SplitByNewline().ToList();
            var mask = "";
            var memory = new Dictionary<int, string>();

            foreach (var line in lines)
            {
                var amount = line.Split(" = ")[1];

                if (line.Contains("mask"))
                {
                    mask = amount;
                    continue;
                }

                var index = int.Parse(Regex.Match(line, "\\[([0-9]*)\\]").Value.Replace("[", "").Replace("]", ""));
                var bitValue = Convert.ToString(int.Parse(amount), 2).PadLeft(36, '0').ToArray();

                // Utilities.WriteLine(Convert.ToString(int.Parse(amount), 2).PadLeft(36, '0'));

                for (var i = 0; i < mask.Length; i++)
                {
                    bitValue[i] = mask[i] == 'X' ? bitValue[i] : mask[i];
                }

                memory[index] = string.Join("", bitValue);
            }

            return memory.Sum(x => Convert.ToInt64(x.Value, 2)).ToString();
        }

        protected override string SolvePartTwo()
        {
            var lines = Input.SplitByNewline().ToList();
            var mask = "";
            var memory = new Dictionary<long, string>();

            foreach (var line in lines)
            {
                var amount = line.Split(" = ")[1];

                if (line.Contains("mask"))
                {
                    mask = amount;
                    continue;
                }

                var index = int.Parse(Regex.Match(line, "\\[([0-9]*)\\]").Value.Replace("[", "").Replace("]", ""));
                var indexBitValue = Convert.ToString(index, 2).PadLeft(36, '0').ToArray();
                var bitValue = Convert.ToString(int.Parse(amount), 2).PadLeft(36, '0');

                for (int i = 0; i < mask.Length; i++)
                    indexBitValue[i] = mask[i] == '0' ? indexBitValue[i] : mask[i];

                var adresses = GenerateAdresses(string.Join("", indexBitValue));

                foreach (var adress in adresses)
                    memory[Convert.ToInt64(adress, 2)] = bitValue;
            }

            return memory.Sum(x => Convert.ToInt64(x.Value, 2)).ToString();

        }
        private static IEnumerable<string> GenerateAdresses(string adress)
        {
            if (!adress.Any(c => c.Equals('X')))
            {
                return new List<string> { adress };
            }
            else
            {
                var adress0 = ReplaceFirstMatch(adress, "X", "0");
                var adress1 = ReplaceFirstMatch(adress, "X", "1");
                return GenerateAdresses(adress0).Concat(GenerateAdresses(adress1));
            }
        }

        private static string ReplaceFirstMatch(string adress, string oldValue, string newValue)
        {
            int index = adress.IndexOf(oldValue);
            if (index < 0)
                return adress;
            return adress.Remove(index, oldValue.Length).Insert(index, newValue);
        }
    }
}
