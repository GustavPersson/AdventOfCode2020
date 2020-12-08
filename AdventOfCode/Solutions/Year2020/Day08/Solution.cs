using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;

namespace AdventOfCode.Solutions.Year2020
{

    class Day08 : ASolution
    {
        Instruction[] BootInstructions;

        public Day08() : base(08, 2020, "Handheld Halting")
        {
            BootInstructions = Input
            .Split(new string[] { Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries)
            .Select(line => new Instruction(Enum.Parse<Command>(line[..3].ToUpper()), int.Parse(line[3..])))
            .ToArray();
        }

        private static int DoMainLoop(Instruction[] instructions, bool breakOnInfiniteLoop = false)
        {
            int accumulator = 0;
            List<Guid> executedInstructions = new List<Guid>(instructions.Length);

            int nextInstructionToExecute = 0;
            bool booting = true;
            while (booting)
            {
                if (nextInstructionToExecute >= instructions.Length)
                {
                    return accumulator;
                }

                Instruction currentInstruction = instructions[nextInstructionToExecute];
                Command operation = currentInstruction.Command;
                int argument = currentInstruction.Argument;
                if (executedInstructions.Contains(currentInstruction.Id))
                {
                    if (breakOnInfiniteLoop)
                    {
                        break;
                    }
                    return accumulator;
                }

                if (operation == Command.NOP)
                {
                    nextInstructionToExecute += 1;
                }
                else if (operation == Command.ACC)
                {
                    accumulator += argument;
                    nextInstructionToExecute += 1;
                }
                else if (operation == Command.JMP)
                {
                    nextInstructionToExecute += argument;
                }
                executedInstructions.Add(currentInstruction.Id);
            }

            return 0;
        }

        protected override string SolvePartOne()
        {
            return DoMainLoop(BootInstructions).ToString();
        }

        protected override string SolvePartTwo()
        {
            return GenerateBootVariations()
            .Select(bootCode => DoMainLoop(bootCode, true))
            .First(result => result != 0)
            .ToString();
        }

        private IEnumerable<Instruction[]> GenerateBootVariations()
        {
            for (var i = 0; i < BootInstructions.Length; i++)
            {
                var copy = BootInstructions[..];
                var item = copy[i];

                copy[i] = item.Command switch
                {
                    Command.NOP => new Instruction(Command.JMP, item.Argument),
                    Command.JMP => new Instruction(Command.NOP, item.Argument),
                    _ => copy[i]
                };

                yield return copy;
            }
        }

        private enum Command
        {
            NOP,
            ACC,
            JMP
        }

        private readonly struct Instruction
        {
            public readonly Guid Id;
            public readonly Command Command;
            public readonly int Argument;

            public Instruction(Command command, int argument)
            {
                Id = Guid.NewGuid();
                Command = command;
                Argument = argument;
            }
        }
    }
}
