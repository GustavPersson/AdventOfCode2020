using System.Collections.Generic;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day18 : ASolution
    {
        List<long> Results;
        List<string> Expressions;

        public Day18() : base(18, 2020, "Operation Order")
        {
            Expressions = new List<string>(Input.SplitByNewline());
            Results = new List<long>();
        }

        protected override string SolvePartOne()
        {
            Results.Clear();
            foreach (string Expression in Expressions)
            {
                Results.Add(EvaluateExpression(Expression));
            }
            return Results.Sum().ToString();
        }

        protected override string SolvePartTwo()
        {
            Results.Clear();
            foreach (string Expression in Expressions)
            {
                Results.Add(EvaluateExpression(ConvertForPart2(Expression)));
            }
            return Results.Sum().ToString();
        }

        // Nästan djikstras shunting yard, men skit i att dela upp i prioritering
        private static long EvaluateExpression(string expression)
        {
            Stack<long> nums = new Stack<long>();
            Stack<char> operations = new Stack<char>();
            expression = expression.Replace(" ", "");

            long opVal = 0;

            foreach (var c in expression)
            {
                long val;
                if (long.TryParse(c.ToString(), out val))
                {
                    if (operations.Count > 0 && operations.Peek() != '(')
                    {
                        char op = operations.Pop();
                        opVal = nums.Pop();
                        switch (op)
                        {
                            case '+': nums.Push(opVal + val); break;
                            case '*': nums.Push(opVal * val); break;
                        }
                    }
                    else
                    {
                        nums.Push(val);
                    }
                }
                else
                {
                    switch (c)
                    {
                        case '(':
                        case '+':
                        case '*': operations.Push(c); break;
                        case ')':
                            if (operations.Peek() == '(') operations.Pop();
                            while (operations.Count > 0 && operations.Peek() != '(')
                            {
                                char op = operations.Pop();
                                val = nums.Pop();
                                opVal = nums.Pop();
                                switch (op)
                                {
                                    case '+': nums.Push(opVal + val); break;
                                    case '*': nums.Push(opVal * val); break;
                                }
                            }
                            break;
                    }
                }
            }

            while (operations.Count > 0)
            {
                char op = operations.Pop();
                opVal = nums.Pop();
                long val = nums.Pop();
                switch (op)
                {
                    case '+': nums.Push(opVal + val); break;
                    case '*': nums.Push(opVal * val); break;
                }
            }

            return nums.Pop();
        }

        // istället för att göra om algoritmen, stoppa in paranteser runt alla +-operationer
        private static string ConvertForPart2(string expression)
        {
            List<char> ExpressionChars = expression.Replace(" ", "").ToList();

            int index = ExpressionChars.IndexOf('+');
            while (index > 0)
            {
                int rearIndex;
                int frontIndex;
                if (ExpressionChars[index + 1] == '(')
                {
                    int i = 1;
                    int parenCount = 0;
                    while ((index + i) < ExpressionChars.Count)
                    {
                        if (ExpressionChars[index + i] == '(') parenCount++;
                        if (ExpressionChars[index + i] == ')') parenCount--;
                        if (parenCount == 0) break;
                        i++;
                    }
                    rearIndex = index + i;

                }
                else rearIndex = index + 2;
                ExpressionChars.Insert(rearIndex, ')');

                if (ExpressionChars[index - 1] == ')')
                {
                    int i = 1;
                    int parenCount = 0;
                    while ((index + i) >= 0)
                    {
                        if (ExpressionChars[index - i] == '(') parenCount++;
                        if (ExpressionChars[index - i] == ')') parenCount--;
                        if (parenCount == 0) break;
                        i++;
                    }
                    frontIndex = index - i;
                }
                else frontIndex = index - 1;
                ExpressionChars.Insert(frontIndex, '(');

                index = ExpressionChars.IndexOf('+', index + 2);
            }

            return ExpressionChars.JoinAsStrings();
        }
    }
}
