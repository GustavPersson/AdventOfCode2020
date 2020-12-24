using System;
using System.Collections.Generic;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day23 : ASolution
    {
        List<Cup> Cups;
        List<Cup> ManyCups;
        Dictionary<long, Cup> ManyCupsDict = new Dictionary<long, Cup>();
        public Day23() : base(23, 2020, "Crab Cups")
        {
            Cups = new List<Cup>(20);
            ManyCups = new List<Cup>(20);

            foreach (long i in Input.ToLongArray())
            {
                var tmp = new Cup(i);
                var tmp2 = new Cup(i);
                Cups.Add(tmp);
                ManyCups.Add(tmp2);
                ManyCupsDict[i] = tmp2;
            }

            for (int i = 0; i < Cups.Count; i++)
            {
                Cups[i].next = Cups[(i + 1) % Cups.Count];
                ManyCups[i].next = ManyCups[(i + 1) % Cups.Count];
            }

            var cur = ManyCups[^1];
            for (long i = 10; i <= 1_000_000; i++)
            {
                cur.next = new Cup(i);
                cur = cur.next;
                ManyCupsDict[i] = cur;
            }
            cur.next = ManyCups[0];

        }

        protected override string SolvePartOne()
        {
            Cup CurrentCup = Cups[0];

            for (long round = 1; round <= 100; round++)
            {
                var groupStart = CurrentCup.next;
                CurrentCup.next = CurrentCup.next.next.next.next;

                List<long> forbiddenValues = new List<long>(3)
                {
                    groupStart.val,
                    groupStart.next.val,
                    groupStart.next.next.val
                };
                long nextNodeVal = CurrentCup.val == 1 ? 9 : CurrentCup.val - 1;
                while (forbiddenValues.Contains(nextNodeVal))
                {
                    nextNodeVal--;
                    if (nextNodeVal < 1) nextNodeVal = 9;
                }

                var insertPoint = CurrentCup.next;
                while (insertPoint.val != nextNodeVal)
                {
                    insertPoint = insertPoint.next;
                }

                groupStart.next.next.next = insertPoint.next;
                insertPoint.next = groupStart;
                CurrentCup = CurrentCup.next;

            }

            StringBuilder sb = new StringBuilder();
            while (CurrentCup.val != 1)
            {
                CurrentCup = CurrentCup.next;
            }
            CurrentCup = CurrentCup.next; //start at 1 past the 1

            while (CurrentCup.val != 1)
            {
                sb.Append(CurrentCup.val);
                CurrentCup = CurrentCup.next;
            }

            return sb.ToString();
        }

        protected override string SolvePartTwo()
        {
            Cup CurrentCup = ManyCups[0];
            for (long i = 0; i < 10_000_000; i++)
            {
                var groupStart = CurrentCup.next;
                CurrentCup.next = CurrentCup.next.next.next.next;

                List<long> forbiddenValues = new List<long>(3)
                {
                    groupStart.val,
                    groupStart.next.val,
                    groupStart.next.next.val
                };
                long nextNodeVal = CurrentCup.val == 1 ? 1_000_000 : CurrentCup.val - 1;
                while (forbiddenValues.Contains(nextNodeVal))
                {
                    nextNodeVal--;
                    if (nextNodeVal < 1) nextNodeVal = 1_000_000;
                }

                var insertPoint = ManyCupsDict[nextNodeVal];

                groupStart.next.next.next = insertPoint.next;
                insertPoint.next = groupStart;
                CurrentCup = CurrentCup.next;

            }

            return (ManyCupsDict[1].next.val * ManyCupsDict[1].next.next.val).ToString();
        }

        private class Cup
        {
            public Cup(long val)
            {
                this.val = val;
            }
            public long val;
            public Cup next;
        }

    }
}
