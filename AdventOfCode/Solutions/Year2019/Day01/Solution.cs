using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2019
{

    class Day01 : ASolution
    {
        int[] Modules;
        int FuelMass;

        public Day01() : base(01, 2019, "The Tyranny of the Rocket Equation")
        {
            Modules = Input.ToIntArray("\n");
        }

        private static int CalculateFuelNeeded(int mass)
        {
            int fuelNeeded = (int)Math.Floor(mass / 3.0) - 2;

            return fuelNeeded;
        }


        protected override string SolvePartOne()
        {
            int fuelNeeded = Modules.Aggregate(0, (sum, next) => sum + CalculateFuelNeeded(next));
            FuelMass = fuelNeeded;
            return fuelNeeded.ToString();
        }

        protected override string SolvePartTwo()
        {
            int fuelNeeded = Modules.Aggregate(0, (sum, next) =>
            {
                int fuelNeeded = CalculateFuelNeeded(next);
                int fuelNeedingFuel = fuelNeeded;
                int totalFuelNeeded = fuelNeeded;
                while (fuelNeedingFuel > 0)
                {

                    int fuelNeededForFuel = CalculateFuelNeeded(fuelNeedingFuel);

                    if (fuelNeededForFuel <= 0)
                    {
                        break;
                    }
                    fuelNeedingFuel = fuelNeededForFuel;
                    totalFuelNeeded += fuelNeededForFuel;
                }
                return sum + totalFuelNeeded;
            });

            return fuelNeeded.ToString();
        }
    }
}
