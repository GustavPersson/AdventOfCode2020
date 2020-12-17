using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using static AdventOfCode.Solutions.Utilities;


namespace AdventOfCode.Solutions.Year2020
{

    public class Action
    {
        public string Type;
        public int Value;
    }

    class Day12 : ASolution
    {
        List<Action> EvasiveActions;
        List<string> CardinalDirections = new List<string>() { "N", "S", "W", "E" };

        public Day12() : base(12, 2020, "Rain Risk")
        {
            EvasiveActions = Input.SplitByNewline().Select(item => new Action()
            {
                Type = item.Substring(0, 1),
                Value = Int32.Parse(item.Substring(1))
            }).ToList();

        }


        protected override string SolvePartOne()
        {

            Dictionary<string, int> TravelledDistances = new Dictionary<string, int>();
            TravelledDistances.Add("N", 0);
            TravelledDistances.Add("S", 0);
            TravelledDistances.Add("E", 0);
            TravelledDistances.Add("W", 0);


            string ShipIsPointingTowards = "E";

            foreach (var item in EvasiveActions)
            {
                if (CardinalDirections.Contains(item.Type))
                {
                    TravelledDistances[item.Type] += item.Value;
                }

                if (item.Type == "R" || item.Type == "L")
                {
                    ShipIsPointingTowards = GetNewDirection(ShipIsPointingTowards, item.Value, item.Type).ToString();
                }

                if (item.Type == "F")
                {
                    TravelledDistances[ShipIsPointingTowards] += item.Value;
                }
            }
            return Utilities.ManhattanDistance((TravelledDistances["E"], TravelledDistances["W"]), (TravelledDistances["N"], TravelledDistances["S"])).ToString();
        }

        protected override string SolvePartTwo()
        {
            // I den här lösningen så kommer vi på att vi kan använda ett koordinatsystem
            // istället för vädersträck
            // West/East är x, North/South är y
            (int x, int y) ShipPosition = (0, 0);
            (int x, int y) WaypointPosition = (10, 1);

            foreach (var item in EvasiveActions)
            {
                switch (item.Type)
                {
                    case "N":
                    case "W":
                    case "E":
                    case "S": WaypointPosition = WaypointPosition.MoveDirection((CompassDirection)Enum.Parse(typeof(CompassDirection), item.Type), item.Value); break;
                    case "L":
                        switch (item.Value)
                        {
                            // Om det är vänster, så ska punkten flyttas moturs på koordinatsystemet
                            case 90: WaypointPosition = (-WaypointPosition.y, WaypointPosition.x); break; // flytta till motsatt plats på y
                            case 180: WaypointPosition = (-WaypointPosition.x, -WaypointPosition.y); break; // flytta till motsatt plats på y&x (rakt över)
                            case 270: WaypointPosition = (WaypointPosition.y, -WaypointPosition.x); break; // flytta på motsatt plats på x
                        }
                        break;
                    case "R":
                        switch (item.Value)
                        {
                            // Om det är höger, så ska punkten flyttas medurs på koordinatsystemet
                            case 270: WaypointPosition = (-WaypointPosition.y, WaypointPosition.x); break; // flytta till motsatt plats på y
                            case 180: WaypointPosition = (-WaypointPosition.x, -WaypointPosition.y); break; // flytta till motsatt plats på y&x (rakt över)
                            case 90: WaypointPosition = (WaypointPosition.y, -WaypointPosition.x); break; ; // flytta till motsatt plats på x
                        }
                        break;
                    case "F":
                        ShipPosition = ShipPosition.Add((WaypointPosition.x * item.Value, WaypointPosition.y * item.Value));
                        break;
                    default:
                        break;
                }
            }

            return Utilities.ManhattanDistance((0, 0), ShipPosition).ToString();
        }
    }
}
