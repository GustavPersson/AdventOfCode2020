using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    abstract class Rule
    {
        public int Num { get; set; }
    }
    class LitRule : Rule
    {
        public string Lit { get; set; }
    }
    class SeqRule : Rule
    {
        public List<int> Seq { get; set; }
    }

    class Matcher
    {
        private ILookup<int, Rule> _rules;

        public Matcher(IEnumerable<Rule> rules)
        {
            _rules = rules.ToLookup(r => r.Num);
        }

        public bool IsMatch(string input)
        {
            foreach (var end in Match(input, 0, 0))
            {
                if (end == input.Length) return true;
            }
            return false;
        }

        IEnumerable<int> Match(string input, int num, int pos)
        {
            foreach (var rule in _rules[num])
            {
                if (rule is LitRule lit)
                {
                    foreach (var end in MatchLit(input, lit, pos))
                    {
                        yield return end;
                    }
                }
                else if (rule is SeqRule seq)
                {
                    foreach (var end in MatchSeq(input, seq, pos, 0))
                    {
                        yield return end;
                    }
                }
                else
                {
                    throw new ArgumentException(nameof(rule));
                }
            }
        }

        IEnumerable<int> MatchLit(string input, LitRule lit, int pos)
        {
            if (string.CompareOrdinal(input, pos, lit.Lit, 0, lit.Lit.Length) == 0)
            {
                yield return pos + lit.Lit.Length;
            }
        }

        IEnumerable<int> MatchSeq(string input, SeqRule seq, int pos, int index)
        {
            if (index == seq.Seq.Count)
            {
                yield return pos;
                yield break;
            }
            foreach (var end in Match(input, seq.Seq[index], pos))
            {
                foreach (var end2 in MatchSeq(input, seq, end, index + 1))
                {
                    yield return end2;
                }
            }
        }
    }


    class Day19 : ASolution
    {

        List<Rule> Rules;
        List<string> Messages;

        public Day19() : base(19, 2020, "Monster Messages")
        {
            string[] Lines = Input.Split(new string[] { Environment.NewLine + Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);

            Rules = new List<Rule>();

            var pat = new Regex(@"^(\d+):(?: ""([^""]*)""|(?: ((?:\| )?)(\d+))+)\s*$");

            foreach (string rule in Lines[0].SplitByNewline())
            {
                if (pat.Match(rule) is { Success: true } m)
                {
                    if (m.Groups[2].Success)
                    {
                        Rules.Add(new LitRule
                        {
                            Num = int.Parse(m.Groups[1].Value),
                            Lit = m.Groups[2].Value
                        });
                    }
                    else
                    {
                        var seq = new List<int>();
                        var alt = new List<List<int>> { seq };
                        for (int i = 0; i < m.Groups[4].Captures.Count; i++)
                        {
                            if (m.Groups[3].Captures[i].Length != 0)
                            {
                                alt.Add(seq = new List<int>());
                            }
                            seq.Add(int.Parse(m.Groups[4].Captures[i].Value));
                        }
                        foreach (var seql in alt)
                        {
                            Rules.Add(new SeqRule
                            {
                                Num = int.Parse(m.Groups[1].Value),
                                Seq = seql
                            });
                        }
                    }
                }
            }


            Messages = new List<string>(Lines[1].SplitByNewline());
        }

        protected override string SolvePartOne()
        {
            var matcher = new Matcher(Rules);
            int count = 0;
            foreach (var msg in Messages)
            {
                if (matcher.IsMatch(msg))
                {
                    count++;
                }
            }

            return count.ToString();
        }

        protected override string SolvePartTwo()
        {
            Rules.Add(new SeqRule { Num = 8, Seq = new() { 42, 8 } });
            Rules.Add(new SeqRule { Num = 11, Seq = new() { 42, 11, 31 } });

            var matcher = new Matcher(Rules);
            int count = 0;
            foreach (var msg in Messages)
            {
                if (matcher.IsMatch(msg))
                {
                    count++;
                }
            }

            return count.ToString();
        }
    }
}
