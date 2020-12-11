using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day11 : ASolution
    {
        char[,] SeatPlan;
        Dictionary<(int, int), bool> Seats = new Dictionary<(int, int), bool>();
        Dictionary<(int, int), bool> Seats2;
        private readonly List<(int, int)> Neighbors = new List<(int x, int y)>()
        {
            (1,0),
            (1,1),
            (0,1),
            (-1,1),
            (-1,0),
            (-1,-1),
            (0,-1),
            (1,-1)
        };
        readonly int maxX = 0;
        readonly int maxY = 0;

        public Day11() : base(11, 2020, "Seating System")
        {

            var res = Input.SplitByNewline().Select(x => x.ToCharArray()).ToArray();

            SeatPlan = new char[res.Length, res[0].Length];
            for (int i = 0; i != res.Length; i++)
                for (int j = 0; j != res[0].Length; j++)
                    SeatPlan[i, j] = res[i][j];

            var lines = Input.SplitByNewline().ToList();

            maxY = res.Length;
            for (int j = 0; j < lines.Count; j++)
            {
                for (int i = 0; i < lines[j].Length; i++)
                {
                    if (lines[j][i] == 'L') Seats[(i, j)] = false;
                    else if (lines[j][i] == '#') Seats[(i, j)] = false;
                    if (i > maxX) maxX = i;
                }
            }

            Seats2 = new Dictionary<(int, int), bool>(Seats);
        }

        protected override string SolvePartOne()
        {
            int seatsChanged = 0;
            int rows = SeatPlan.GetLength(0);
            int columns = SeatPlan.GetLength(1);
            while (true)
            {
                char[,] SeatPlanAtStartOfRound = (char[,])SeatPlan.Clone();
                seatsChanged = 0;

                for (int i = 0; i < rows; i++)
                {
                    for (int x = 0; x < columns; x++)
                    {
                        char seatToLookAt = SeatPlanAtStartOfRound[i, x];
                        var results = AdjacentElements<char>(SeatPlanAtStartOfRound, i, x);

                        if (seatToLookAt == 'L')
                        {
                            if (results.Count(x => x == '#') == 0)
                            {
                                seatsChanged++;
                                SeatPlan[i, x] = '#';
                            }
                        }
                        if (seatToLookAt == '#')
                        {
                            if (results.Count(x => x == '#') >= 4)
                            {
                                seatsChanged++;
                                SeatPlan[i, x] = 'L';
                            }
                        }

                    }
                }

                if (seatsChanged == 0)
                {
                    break;
                }
            }


            return SeatPlan.Flatten().Count(x => x == '#').ToString();
        }

        protected override string SolvePartTwo()
        {
            Seats = new Dictionary<(int, int), bool>(Seats2);
            int seatsChanged = int.MaxValue;
            do
            {
                seatsChanged = 0;
                var nextSeats = new Dictionary<(int, int), bool>(Seats);
                foreach (var seat in Seats)
                {
                    bool nextVal = AliveNext(seat.Key, true);
                    if (nextVal != seat.Value) seatsChanged++;
                    nextSeats[seat.Key] = nextVal;
                }

                Seats = new Dictionary<(int, int), bool>(nextSeats);
            } while (seatsChanged != 0);


            return Seats.Count(x => x.Value).ToString();

        }

        void PrintSeatPlan()
        {
            for (int i = 0; i < SeatPlan.GetLength(0); i++)
            {
                var row = SeatPlan.GetRow(i);

                Utilities.WriteLine(string.Join("", row.Select(element => element.ToString())));
            }
        }

        public static IEnumerable<T> AdjacentElements<T>(T[,] arr, int row, int column)
        {
            int rows = arr.GetLength(0);
            int columns = arr.GetLength(1);

            for (int j = row - 1; j <= row + 1; j++)
                for (int i = column - 1; i <= column + 1; i++)
                    if (i >= 0 && j >= 0 && i < columns && j < rows && !(j == row && i == column))
                        yield return arr[j, i];
        }

        private bool AliveNext((int x, int y) c, bool part2 = false)
        {
            int livingNeighbors = 0;
            List<(int, int)> locNeighbors = new List<(int x, int y)>();
            List<(int, int)> extendedNeighbors = new List<(int x, int y)>();
            foreach (var n in Neighbors)
            {
                locNeighbors.Add(c.Add(n));

                var tmp = c.Add(n);
                while (!Seats.ContainsKey(tmp))
                {
                    if (tmp.Item1 < 0 || tmp.Item1 > maxX || tmp.Item2 < 0 || tmp.Item2 > maxY) break;
                    tmp = tmp.Add(n);
                }

                extendedNeighbors.Add(tmp);
            }


            foreach (var n in extendedNeighbors)
            {
                if (!Seats.ContainsKey(n)) continue;
                if (Seats[n]) livingNeighbors++;
            }
            if (Seats[c])
            {
                if (livingNeighbors < 5) return true;
            }
            else
            {
                if (livingNeighbors == 0) return true;
            }

            return false;
        }
    }
}
