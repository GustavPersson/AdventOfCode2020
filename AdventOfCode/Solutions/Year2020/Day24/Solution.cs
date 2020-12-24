using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day24 : ASolution
    {

        List<string> Instructions;
        readonly Dictionary<string, (int column, int row)> Moves;
        Dictionary<(int column, int row), bool> TileFlipped = new Dictionary<(int column, int row), bool>();

        // e, se, sw, w, nw, and n
        public Day24() : base(24, 2020, "Lobby Layout")
        {
            Moves = new Dictionary<string, (int q, int r)>()
            {
                {"nw", (0, -1) },
                {"ne", (1, -1) },
                {"e",  (1, 0) },
                {"se", (0, 1) },
                {"sw", (-1, 1) },
                {"w",  (-1, 0) }
            };
            Instructions = new List<string>(Input.SplitByNewline());
        }

        protected override string SolvePartOne()
        {
            foreach (string Instruction in Instructions)
            {
                int i = 0;
                (int q, int r) curPos = (0, 0);

                while (i < Instruction.Length)
                {
                    string move;

                    // man kan inte gå söder eller norrut så de är alltid de andra
                    if (Instruction[i] == 's' || Instruction[i] == 'n')
                    {
                        move = Instruction.Substring(i, 2);
                        i += 2;
                    }
                    else
                    {
                        move = Instruction.Substring(i, 1);
                        i++;
                    }
                    curPos = curPos.Add(Moves[move]);
                }

                if (TileFlipped.ContainsKey(curPos))
                {
                    TileFlipped[curPos] = !TileFlipped[curPos];
                }
                else
                {
                    TileFlipped.Add(curPos, true);
                }

            }

            return TileFlipped.Count((Tile) => Tile.Value).ToString();
        }

        protected override string SolvePartTwo()
        {
            // ta bort alla vita ur listan, vi behöver bara de som rör vid svarta
            foreach (var Tile in TileFlipped.Where(kvp => !kvp.Value).ToList()) TileFlipped.Remove(Tile.Key);

            for (int i = 0; i < 100; i++)
            {
                var TileList = TileFlipped.Keys.ToList();

                // Lägg till alla tiles som rör vid en svart tile som vita tiles
                foreach (var Tile in TileList)
                {
                    foreach (var MoveDirection in Moves.Values)
                    {
                        var TouchingTile = Tile.Add(MoveDirection);
                        if (!TileFlipped.ContainsKey(TouchingTile))
                        {
                            TileFlipped[TouchingTile] = false;
                        }
                    }
                }

                var NextFlippedTiles = new Dictionary<(int q, int r), bool>(TileFlipped);
                TileList = new List<(int column, int row)>(TileFlipped.Keys);

                foreach (var Tile in TileList)
                {
                    int TouchingBlackTiles = 0;

                    foreach (var MoveDirection in Moves.Values)
                    {
                        var TouchingTile = Tile.Add(MoveDirection);
                        var isTileFlipped = TileFlipped.GetValueOrDefault(TouchingTile, false);
                        if (isTileFlipped)
                        {
                            TouchingBlackTiles++;
                        }
                    }

                    if (TileFlipped[Tile])
                    {
                        NextFlippedTiles[Tile] = !(TouchingBlackTiles == 0 || TouchingBlackTiles > 2);
                    }
                    else
                    {
                        NextFlippedTiles[Tile] = (TouchingBlackTiles == 2);
                    }
                }
                TileFlipped = NextFlippedTiles;
            }

            return TileFlipped.Count((Tile) => Tile.Value).ToString();
        }
    }
}
