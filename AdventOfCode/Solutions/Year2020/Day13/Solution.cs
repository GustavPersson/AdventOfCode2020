using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;
using static AdventOfCode.Solutions.Utilities;

namespace AdventOfCode.Solutions.Year2020
{

    class Day13 : ASolution
    {
        int EarliestDeparture;
        List<int> BusesInService;
        List<string> DepartureList;


        public Day13() : base(13, 2020, "Shuttle Search")
        {
            var Lines = Input.SplitByNewline();

            EarliestDeparture = Int32.Parse(Lines[0]);

            BusesInService = Lines[1]
            .Split(',')
            .Where(x => int.TryParse(x, out _))
            .Select(int.Parse)
            .ToList();

            DepartureList = Lines[1].Split(',').ToList();
        }

        protected override string SolvePartOne()
        {
            bool isFound = false;
            int TimeStampToCheck = EarliestDeparture;
            int NextDeparture = 0;
            int BusToTake = 0;

            do
            {
                foreach (var bus in BusesInService)
                {
                    if (TimeStampToCheck % bus == 0)
                    {
                        isFound = true;
                        NextDeparture = TimeStampToCheck;
                        BusToTake = bus;
                        WriteLine($"Found a bus to take! {bus} at {NextDeparture}");
                        break;
                    }
                }
                TimeStampToCheck++;
            } while (!isFound);

            return ((NextDeparture - EarliestDeparture) * BusToTake).ToString();
        }


        /**
        Let's assume that we have our bus IDs stored in an array named buses. Part 2 asks us to find the some timestamp t such that:
        the first bus departs at timestamp t - i.e. t % buses[0] == 0.
        the second bus departs at timestamp t+1 - i.e. (t+1) % buses[1] == 0.
        the third bus departs at timestamp t+2 - i.e. (t+2) % buses[2] == 0.
        and so on.

        (You should ignore the ones with xes as stated in the problem description.)

        This is tricky! Finding such a number requires the knowledge of a very nice theorem known as the Chinese remainder theorem, which essentially allows us to solve simultaneous equations of the form:

        x % n[0] == a[0]
        x % n[1] == a[1]
        x % n[2] == a[2]
        ...
        Our equations don't exactly look like this - but we can slightly adjust the equation with some modulo arithmetic:

        t % buses[0] == 0.

        (t+1) % buses[1] == 0, so t % buses[1] == (-1) % buses[1]

        (t+2) % buses[2] == 0, so t % buses[2] == (-2) % buses[2]

        and so on.

        Therefore, our values of n are the bus IDs, and our values for a are the 0, (-1) % buses[1]. (-2) % buses[2], and so on. Plugging them into some Chinese remainder theorem code gives us the answer.
        **/
        protected override string SolvePartTwo()
        {
            var time = 0L;
            var inc = long.Parse(DepartureList[0]);
            for (var i = 1; i < DepartureList.Count; i++)
            {
                if (!DepartureList[i].Equals("x"))
                {
                    var newTime = int.Parse(DepartureList[i]);
                    while (true)
                    {
                        time += inc;
                        if ((time + i) % newTime == 0)
                        {
                            inc *= newTime;
                            break;
                        }
                    }
                }
            }
            return time.ToString();

        }
    }
}
