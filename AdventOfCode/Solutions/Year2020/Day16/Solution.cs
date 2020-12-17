using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day16 : ASolution
    {

        Dictionary<string, IEnumerable<int>[]> Rules = new Dictionary<string, IEnumerable<int>[]>();
        List<int[]> NearbyTickets;
        List<int[]> ValidTickets;
        List<int> MyTicket;
        public Day16() : base(16, 2020, "Ticket Translation")
        {
            string[] Lines = Input.Split(new string[] { Environment.NewLine + Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);

            foreach (var rule in Lines[0].SplitByNewline())
            {
                string[] NameAndValue = rule.Split(':');

                IEnumerable<int>[] RangesToSave = new IEnumerable<int>[0];

                foreach (var ValueRange in NameAndValue[1].Split("or"))
                {
                    int[] Range = ValueRange.Split('-').Select(number => Int32.Parse(number)).ToArray();
                    RangesToSave = RangesToSave.Append(Enumerable.Range(Range[0], Range[1] - Range[0] + 1)).ToArray();
                }
                Rules.Add(NameAndValue[0], RangesToSave);
            }

            MyTicket = Lines[1]
                .SplitByNewline()
                .Skip(1)
                .First()
                .Split(',')
                .Select(number => Int32.Parse(number))
                .ToList();

            NearbyTickets = Lines[2]
                .SplitByNewline()
                .Skip(1)
                .Select(ticket => ticket
                    .Split(',')
                    .Select(number => Int32.Parse(number))
                    .ToArray()
                )
                .ToList();

            ValidTickets = new List<int[]>();
        }

        protected override string SolvePartOne()
        {
            List<int> InvalidValues = new List<int>();
            foreach (var ticket in NearbyTickets)
            {
                bool TicketIsValid = true;
                foreach (var value in ticket)
                {
                    bool ValueIsValid = false;
                    foreach (var rule in Rules.Values)
                    {
                        if (rule[0].Contains(value) || rule[1].Contains(value))
                        {
                            ValueIsValid = true;
                            break;
                        }
                    }
                    if (!ValueIsValid)
                    {
                        InvalidValues.Add(value);
                        TicketIsValid = false;
                    }
                }
                if (TicketIsValid)
                {
                    ValidTickets.Add(ticket);
                }

            }
            return InvalidValues.Aggregate(0, (total, next) => total + next).ToString();
        }

        protected override string SolvePartTwo()
        {
            Dictionary<string, List<int>> PossibleRuleMatches = Rules.ToDictionary(fields => fields.Key, _ => new List<int>());

            for (int i = 0; i < Rules.Count; i++)
            {
                List<int> AllValuesOfType = ValidTickets.Select(ticket => ticket[i]).ToList();
                foreach (var rule in Rules)
                {
                    // If all values in the column matches the current rule, that rule is a possible match for that column
                    if (AllValuesOfType.All(value => (rule.Value[0].Contains(value) || rule.Value[1].Contains(value))))
                    {
                        PossibleRuleMatches[rule.Key].Add(i);
                    }
                }
            }

            var defined = new Dictionary<string, int>();

            while (PossibleRuleMatches.Any())
            {
                var exacts = PossibleRuleMatches.Where(possibility => possibility.Value.Count == 1);
                foreach (var exact in exacts)
                {
                    var value = exact.Value[0];
                    foreach (var possibility in PossibleRuleMatches.Except(exacts))
                    {
                        possibility.Value.Remove(value);
                    }
                    defined[exact.Key] = value;
                    PossibleRuleMatches.Remove(exact.Key);
                }
            }


            List<int> DepartureIndexes = defined.Where(x => x.Key.StartsWith("departure")).Select(x => x.Value).ToList();

            return DepartureIndexes.Aggregate(1L, (a, b) => a * MyTicket[b]).ToString();
        }
    }
}
