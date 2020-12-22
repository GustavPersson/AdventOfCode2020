using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AdventOfCode.Solutions.Year2020
{

    class Day22 : ASolution
    {
        string[] Decks;
        Queue<long> MyCards;
        Queue<long> CrabCards;

        public Day22() : base(22, 2020, "Crab Combat")
        {
            Decks = Input.Split(new string[] { Environment.NewLine + Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);
            MyCards = new Queue<long>();
            CrabCards = new Queue<long>();
        }

        protected override string SolvePartOne()
        {
            DealCards();

            long round = 1;
            long score = 0;
            while (true)
            {
                long myCard = -1;
                long crabCard = -1;
                if (MyCards.TryPeek(out myCard) && CrabCards.TryPeek(out crabCard))
                {
                    MyCards.TryDequeue(out myCard);
                    CrabCards.TryDequeue(out crabCard);

                    if (myCard > crabCard)
                    {
                        MyCards.Enqueue(myCard);
                        MyCards.Enqueue(crabCard);
                    }
                    else
                    {
                        CrabCards.Enqueue(crabCard);
                        CrabCards.Enqueue(myCard);
                    }
                }
                else
                {
                    if (MyCards.Count > 0)
                    {
                        score = CalculateScore(MyCards);
                    }
                    else
                    {
                        score = CalculateScore(CrabCards);
                    }

                    break;
                }
                round++;
            }

            return score.ToString();
        }

        protected override string SolvePartTwo()
        {
            DealCards();

            RecursiveCombat(MyCards, CrabCards, out long WinnerScore);

            return WinnerScore.ToString();
        }

        public static bool RecursiveCombat(Queue<long> p1Deck, Queue<long> p2Deck, out long WinnerScore)
        {
            HashSet<(long p1, long p2)> previousStates = new HashSet<(long p1, long p2)>();
            (long p1, long p2) curState = GetScores(new Queue<long>(p1Deck), new Queue<long>(p2Deck));
            previousStates.Add(curState);

            do
            {
                previousStates.Add(curState);
                long Player1Card = p1Deck.Dequeue();
                long Player2Card = p2Deck.Dequeue();

                bool IWon;

                if (Player1Card <= p1Deck.Count && Player2Card <= p2Deck.Count)
                {
                    IWon = RecursiveCombat(new Queue<long>(p1Deck.Take((int)Player1Card)), new Queue<long>(p2Deck.Take((int)Player2Card)), out WinnerScore);
                }
                else if (Player1Card > Player2Card)
                {
                    IWon = true;
                }
                else
                {
                    IWon = false;
                }

                if (IWon)
                {
                    p1Deck.Enqueue(Player1Card);
                    p1Deck.Enqueue(Player2Card);
                }
                else
                {
                    p2Deck.Enqueue(Player2Card);
                    p2Deck.Enqueue(Player1Card);
                }

                curState = GetScores(new Queue<long>(p1Deck), new Queue<long>(p2Deck));
            } while ((p1Deck.Count > 0 && p2Deck.Count > 0) && !previousStates.Contains(curState));

            if (p1Deck.Count > 0)
            {
                WinnerScore = CalculateScore(new Queue<long>(p1Deck));
                return true;
            }
            else
            {
                WinnerScore = CalculateScore(new Queue<long>(p2Deck));
                return false;
            }
        }

        private static (long p1, long p2) GetScores(Queue<long> p1Deck, Queue<long> p2Deck) => (CalculateScore(p1Deck), CalculateScore(p2Deck));

        private static long CalculateScore(Queue<long> deck)
        {
            return deck.ToArray().Reverse().Select((num, index) =>
            {
                return num * (index + 1);
            }).Sum();
        }

        public void DealCards()
        {
            MyCards.Clear();

            foreach (var l in Decks[0].SplitByNewline().Skip(1))
            {
                MyCards.Enqueue(long.Parse(l.TrimEnd(',')));
            }


            CrabCards.Clear();
            foreach (var l in Decks[1].SplitByNewline().Skip(1))
            {
                CrabCards.Enqueue(long.Parse(l.TrimEnd(',')));
            }
        }
    }
}
