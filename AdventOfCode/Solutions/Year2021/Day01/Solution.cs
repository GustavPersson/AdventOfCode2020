using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdventOfCode.Solutions.Year2021
{

  class Day01 : ASolution
  {
    int[] Measurements;
    int Increases;

    public Day01() : base(01, 2021, "Sonar Sweep")
    {
      Measurements = Input.ToIntArray("\n").ToArray();
      Increases = 0;
    }

    protected override string SolvePartOne()
    {
      Increases = 0;
      int PreviousItem = 0;
      bool firstRun = true;
      foreach (var item in Measurements)
      {
        if (!firstRun && item > PreviousItem)
        {
          Increases++;
        }
        PreviousItem = item;
        firstRun = false;
      }
      return Increases.ToString();
    }

    protected override string SolvePartTwo()
    {
      Increases = 0;
      int PreviousSpan = 0;
      bool firstRun = true;

      for (int i = 0; i < Measurements.Length; i++)
      {
        if ((Measurements.Length - 1) >= i + 2)
        {
          int CurrentSpan = Measurements[i] + Measurements[i + 1] + Measurements[i + 2];
          if (!firstRun && CurrentSpan > PreviousSpan)
          {
            Increases++;
          }
          PreviousSpan = CurrentSpan;
        }
        firstRun = false;
      }

      return Increases.ToString();
    }
  }
}
