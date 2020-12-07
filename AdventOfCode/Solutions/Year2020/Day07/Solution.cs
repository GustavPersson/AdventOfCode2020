using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    public class LuggageRule
    {
        public string Type;
        public string ContentString;
        public Dictionary<LuggageRule, int> Contents = new Dictionary<LuggageRule, int>();
        public List<LuggageRule> ContainedBy = new List<LuggageRule>();
    }

    class Day07 : ASolution
    {
        string[] GovernmentRegulatedLuggageRules;
        Dictionary<string, LuggageRule> ruleMap = new Dictionary<string, LuggageRule>();

        public Day07() : base(07, 2020, "Handy Haversacks")
        {
            GovernmentRegulatedLuggageRules = Input.Split(new string[] { Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);

            Regex ruleStart = new Regex("(.*?) bags contain (.*)");
            Regex ruleContents = new Regex("(\\d+|no) (.*?) bag");

            foreach (string rule in GovernmentRegulatedLuggageRules)
            {
                Match match = ruleStart.Match(rule);
                ruleMap.Add(match.Groups[1].Value, new LuggageRule() { Type = match.Groups[1].Value, ContentString = match.Groups[2].Value });
            }

            foreach (LuggageRule rule in ruleMap.Values)
            {
                MatchCollection matches = ruleContents.Matches(rule.ContentString);
                foreach (Match match in matches)
                {
                    string amount = match.Groups[1].Value;
                    string type = match.Groups[2].Value;
                    if (amount != "no")
                    {
                        LuggageRule containedType = ruleMap[type];
                        rule.Contents.Add(ruleMap[type], int.Parse(amount));
                        containedType.ContainedBy.Add(rule);
                    }
                }
            }
        }

        protected override string SolvePartOne()
        {
            LuggageRule shinyGoldBag = ruleMap["shiny gold"];

            Stack<LuggageRule> luggageStack = new Stack<LuggageRule>();
            HashSet<string> possibleBags = new HashSet<string>();

            luggageStack.Push(shinyGoldBag);

            while (luggageStack.Count > 0)
            {
                foreach (LuggageRule c in luggageStack.Pop().ContainedBy)
                {
                    possibleBags.Add(c.Type);
                    if (c.ContainedBy.Count > 0)
                    {
                        luggageStack.Push(c);
                    }
                }
            }

            return possibleBags.Count.ToString();

        }

        protected override string SolvePartTwo()
        {
            LuggageRule shinyGoldBag = ruleMap["shiny gold"];
            int totalBagCount = 0;

            Stack<LuggageRule> luggageStack = new Stack<LuggageRule>();
            luggageStack.Push(shinyGoldBag);

            while (luggageStack.Count > 0)
            {
                LuggageRule currentRule = luggageStack.Pop();
                totalBagCount += currentRule.Contents.Values.Sum();

                foreach (LuggageRule key in currentRule.Contents.Keys)
                {
                    for (int x = 0; x < currentRule.Contents[key]; x++)
                    {
                        luggageStack.Push(key);
                    }
                }

            }

            return totalBagCount.ToString();
        }
    }
}
