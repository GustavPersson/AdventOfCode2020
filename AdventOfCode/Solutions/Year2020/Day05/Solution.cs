using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;


namespace AdventOfCode.Solutions.Year2020
{

    class Day05 : ASolution
    {
        string[] BoardingCards;
        int numberOfColumns = 8;
        int numberOfRows = 128;
        int[] Rows = new int[128];
        int[] Columns = new int[8];
        int[] seatIds = new int[0];


        public Day05() : base(05, 2020, "Binary Boarding")
        {
            BoardingCards = Input.Split(new string[] { Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);

            for (int i = 0; i < numberOfRows; i++)
            {
                Rows[i] = i;
            }

            for (int i = 0; i < numberOfColumns; i++)
            {
                Columns[i] = i;
            }
        }

        protected override string SolvePartOne()
        {
            int highestSeatID = 0;
            foreach (var boardingCard in BoardingCards)
            {
                string rowInstructions = boardingCard.Substring(0, 7);
                string columnInstructions = boardingCard.Substring(7);
                int[] rows = Rows;
                int[] cols = Columns;

                for (int i = 0; i < rowInstructions.Length; i++)
                {
                    if (rowInstructions[i] == 'F')
                    {
                        rows = rows.Take(rows.Length / 2).ToArray();
                    }
                    else if (rowInstructions[i] == 'B')
                    {
                        rows = rows.Skip(rows.Length / 2).ToArray();
                    }
                }

                for (int i = 0; i < columnInstructions.Length; i++)
                {
                    if (columnInstructions[i] == 'R')
                    {
                        cols = cols.Skip(cols.Length / 2).ToArray();
                    }
                    else if (columnInstructions[i] == 'L')
                    {
                        cols = cols.Take(cols.Length / 2).ToArray();
                    }
                }

                int seatId = (rows[0] * 8) + cols[0];
                seatIds = seatIds.Append(seatId).ToArray();

                if (seatId > highestSeatID)
                {
                    highestSeatID = seatId;
                }
            }

            return highestSeatID.ToString();
        }

        protected override string SolvePartTwo()
        {
            Array.Sort(seatIds);

            List<int> ids = seatIds.ToList();
            string remaining = Enumerable.Range(ids.First(), ids.Last() - ids.First() + 1).ToList().Except(ids).First().ToString();

            return remaining;
        }
    }
}
