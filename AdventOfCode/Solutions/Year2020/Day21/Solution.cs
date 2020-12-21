using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day21 : ASolution
    {
        List<(string[] ingredients, string[] allergens)> Food;
        Dictionary<string, string> IngredientAllergent;

        public Day21() : base(21, 2020, "Allergen Assessment")
        {
            Food = new List<(string[] ingredients, string[] allergens)>();
            IngredientAllergent = new Dictionary<string, string>();

            var FoodList = Input.SplitByNewline();

            foreach (var line in FoodList)
            {
                var halves = line.TrimEnd(')').Split(new[] { " (contains " }, 0);
                Food.Add((halves[0].Split(), halves[1].Split(new[] { ", " }, 0)));
            }

            Dictionary<string, string[][]> PossibleAllergensForIngredient = Food
                .SelectMany(f => f.allergens)
                .Distinct()
                .ToDictionary(a => a, a => Food.Where(f => f.allergens.Contains(a)).Select(f => f.ingredients).ToArray());


            while (PossibleAllergensForIngredient.Any())
            {
                foreach (var allergen in PossibleAllergensForIngredient.Keys)
                {
                    var possibleIngredients = PossibleAllergensForIngredient[allergen].Select(a => a.AsEnumerable()).Aggregate((a, b) => a.Intersect(b)).ToArray();
                    if (possibleIngredients.Length == 1)
                    {
                        var ingredient = possibleIngredients[0];
                        IngredientAllergent.Add(allergen, ingredient);
                        PossibleAllergensForIngredient.Remove(allergen);
                        foreach (var otherAllergen in PossibleAllergensForIngredient.Keys.ToArray())
                        {
                            PossibleAllergensForIngredient[otherAllergen] = PossibleAllergensForIngredient[otherAllergen].Select(a => a.Where(f => f != ingredient).ToArray()).ToArray();
                        }
                        break;
                    }
                }
            }

        }

        protected override string SolvePartOne()
        {
            return Food.Sum(f => f.ingredients.Count(i => !IngredientAllergent.Values.Contains(i))).ToString();
        }

        protected override string SolvePartTwo()
        {
            return string.Join(",", IngredientAllergent.Keys.OrderBy(a => a).Select(k => IngredientAllergent[k]));
        }
    }
}
