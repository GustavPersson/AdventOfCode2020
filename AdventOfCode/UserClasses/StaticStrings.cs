using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MathNotationConverter
{
    public static class StaticStrings
    {
        public static string Numbers = "0123456789";
        public static string Operators = "+*";

        public static string AllowedCharacters = Numbers + Operators + "()";

        public enum Associativity
        {
            Left, Right
        }

        public static Dictionary<char, int> PrecedenceDictionary = new Dictionary<char, int>()
        {
            {'(', 0}, {')', 0},
            {'+', 1},
            {'*', 2},
        };

        public static Dictionary<char, Associativity> AssociativityDictionary = new Dictionary<char, Associativity>()
        {
            {'+', Associativity.Left}, {'*', Associativity.Left}
        };

        public static bool IsNumeric(string text)
        {
            return string.IsNullOrWhiteSpace(text) ? false : text.All(c => Numbers.Contains(c));
        }
    }
}