using System;
using System.Collections.Generic;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{
    class Day20 : ASolution
    {
        Tile[,] Tiles;
        Tile FullImage;
        readonly string[] Monster = new string[]{
                "                  # ",
                "#    ##    ##    ###",
                " #  #  #  #  #  #   "
            };
        public Day20() : base(20, 2020, "Jurassic Jigsaw")
        {
            Tiles = AssemblePuzzle(Input);
            FullImage = CombineTiles(-1, Tiles);
        }

        protected override string SolvePartOne()
        {

            int size = Tiles.GetLength(0);

            return ((long)Tiles[0, 0].id *
                Tiles[size - 1, size - 1].id *
                Tiles[0, size - 1].id *
                Tiles[size - 1, 0].id).ToString();
        }

        protected override string SolvePartTwo()
        {
            while (true)
            {
                var monsterCount = FindNumberOfMatchesInImage(FullImage, Monster);
                if (monsterCount > 0)
                {
                    var hashCountInImage = FullImage.ToString().Count(ch => ch == '#');
                    var hashCountInMonster = string.Join("\n", Monster).Count(ch => ch == '#');
                    return (hashCountInImage - monsterCount * hashCountInMonster).ToString();
                }
                FullImage.ChangeOrientation();
            }
        }

        private Tile[] Parse(string input)
        {
            return (
                from block in input.Split("\n\n")
                let lines = block.Split("\n")
                let id = lines[0].Trim(':').Split(" ")[1]
                let image = lines.Skip(1).Where(x => x != "").ToArray()
                select new Tile(int.Parse(id), image)
            ).ToArray();
        }

        int FindNumberOfMatchesInImage(Tile image, params string[] pattern)
        {
            int Matches = 0;
            for (int row = 0; row < image.size; row++)
            {
                for (int column = 0; column < image.size; column++)
                {
                    if (FindMatch(image, pattern, row, column))
                    {
                        Matches++;
                    }
                }
            }
            return Matches;
        }

        bool FindMatch(Tile tile, string[] pattern, int irow, int icol)
        {
            var (ccolP, crowP) = (pattern[0].Length, pattern.Length);

            if (irow + crowP >= tile.size)
            {
                return false;
            }

            if (icol + ccolP >= tile.size)
            {
                return false;
            }

            for (var icolP = 0; icolP < ccolP; icolP++)
            {
                for (var irowP = 0; irowP < crowP; irowP++)
                {
                    if (pattern[irowP][icolP] == '#' && tile[irow + irowP, icol + icolP] != '#')
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        private Tile CombineTiles(int id, Tile[,] tiles)
        {
            // create a big tile leaving out the borders
            var image = new List<string>();
            var tileSize = tiles[0, 0].size;
            for (var irow = 0; irow < tiles.GetLength(0); irow++)
            {
                for (var i = 1; i < tileSize - 1; i++)
                {
                    var st = "";
                    for (var icol = 0; icol < tiles.GetLength(1); icol++)
                    {
                        st += tiles[irow, icol].Row(i).Substring(1, tileSize - 2);
                    }
                    image.Add(st);
                }
            }
            return new Tile(id, image.ToArray());
        }

        private Tile[,] AssemblePuzzle(string input)
        {
            Tile[] Tiles = Parse(input);

            // map the tiles sharing a common edge, it will be either one item for tiles on the edge or two for inner pieces
            var pairs = new Dictionary<string, List<Tile>>();
            foreach (var tile in Tiles)
            {
                for (var i = 0; i < 8; i++)
                {
                    var pattern = tile.Top();
                    if (!pairs.ContainsKey(pattern))
                    {
                        pairs[pattern] = new List<Tile>();
                    }
                    pairs[pattern].Add(tile);
                    tile.ChangeOrientation();
                }
            }

            Tile getConnectingTile(Tile tile, string pattern) =>
                pairs[pattern].SingleOrDefault(tileB => tileB != tile);

            // once the corner is fixed we can always find a unique tile that matches the one to the left/above
            Tile putMatchingTileInPlace(Tile above, Tile left)
            {
                if (above == null && left == null)
                {
                    // find top-left corner
                    foreach (var tile in Tiles)
                    {
                        for (var i = 0; i < 8; i++)
                        {
                            if (getConnectingTile(tile, tile.Top()) == null && getConnectingTile(tile, tile.Left()) == null)
                            {
                                return tile;
                            }
                            tile.ChangeOrientation();
                        }
                    }
                }
                else
                {
                    // we know the tile from the inversion structure, just need to find its orientation
                    var tile = above != null ? getConnectingTile(above, above.Bottom()) : getConnectingTile(left, left.Right());
                    for (var i = 0; i < 8; i++)
                    {
                        var topMatch = above == null ? getConnectingTile(tile, tile.Top()) == null : tile.Top() == above.Bottom();
                        var leftMatch = left == null ? getConnectingTile(tile, tile.Left()) == null : tile.Left() == left.Right();

                        if (topMatch && leftMatch)
                        {
                            return tile;
                        }
                        tile.ChangeOrientation();
                    }
                }

                throw new Exception();
            }

            // just fill up the tileset one by one
            var size = (int)Math.Sqrt(Tiles.Length);
            var tileset = new Tile[size, size];
            for (var irow = 0; irow < size; irow++)
                for (var icol = 0; icol < size; icol++)
                {
                    var tileAbove = irow == 0 ? null : tileset[irow - 1, icol];
                    var tileLeft = icol == 0 ? null : tileset[irow, icol - 1];
                    tileset[irow, icol] = putMatchingTileInPlace(tileAbove, tileLeft);
                }

            return tileset;
        }
    }

    class Tile
    {
        public int id;
        public int size;

        string[] image;
        int orentation = 0;

        public Tile(int title, string[] image)
        {
            this.id = title;
            this.image = image;
            this.size = image.Length;
        }

        public void ChangeOrientation()
        {
            this.orentation++;
            this.orentation %= 8;
        }

        public char this[int row, int col]
        {
            get
            {
                for (var i = 0; i < orentation % 4; i++)
                {
                    (row, col) = (col, size - 1 - row);
                }

                if (orentation % 8 >= 4)
                {
                    col = size - 1 - col;
                }

                return this.image[row][col];
            }
        }

        public string Row(int irow) => GetSlice(irow, 0, 0, 1);
        public string Top() => GetSlice(0, 0, 0, 1);
        public string Right() => GetSlice(0, size - 1, 1, 0);
        public string Left() => GetSlice(0, 0, 1, 0);
        public string Bottom() => GetSlice(size - 1, 0, 0, 1);

        public override string ToString()
        {
            return $"Tile {id}:\n" + string.Join("\n", Enumerable.Range(0, size).Select(i => Row(i)));
        }

        string GetSlice(int irow, int icol, int drow, int dcol)
        {
            var st = "";
            for (var i = 0; i < size; i++)
            {
                st += this[irow, icol];
                irow += drow;
                icol += dcol;
            }
            return st;
        }
    }

}
