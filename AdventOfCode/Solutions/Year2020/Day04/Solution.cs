using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;
using System.Linq;


namespace AdventOfCode.Solutions.Year2020
{

    class Day04 : ASolution
    {
        string[] Passports;
        string[] RequiredFields = { "byr:", "pid:", "ecl:", "hcl:", "hgt:", "eyr:", "iyr:" };

        public Day04() : base(04, 2020, "Passport Processing")
        {
            Passports = Input.Split(new string[] { Environment.NewLine + Environment.NewLine },
                                           StringSplitOptions.RemoveEmptyEntries);
        }

        protected override string SolvePartOne()
        {
            int numberOfValidPassports = 0;
            foreach (var passport in Passports)
            {
                if (RequiredFields.All(passport.Contains))
                {
                    numberOfValidPassports += 1;
                }
            }
            return numberOfValidPassports.ToString();
        }

        protected override string SolvePartTwo()
        {
            int numberOfValidPassports = 0;
            foreach (var passport in Passports)
            {
                if (RequiredFields.All(passport.Contains))
                {

                    Regex byr = new Regex("(byr:)(19[2-9][0-9]|200[0-2])", RegexOptions.IgnoreCase);
                    Regex iyr = new Regex("(iyr:)(201[0-9]|2020)", RegexOptions.IgnoreCase);
                    Regex eyr = new Regex("(eyr:)(202[0-9]|2030)", RegexOptions.IgnoreCase);
                    Regex hgt = new Regex("(hgt:)((1[5-9][0-3]|1[5-8][0-9])cm|(59|6[0-9]|7[0-6])in)", RegexOptions.IgnoreCase);
                    Regex hcl = new Regex("(hcl:)(#([a-fA-F0-9]{6}))", RegexOptions.IgnoreCase);
                    Regex ecl = new Regex("(ecl:)(amb|blu|brn|gry|grn|hzl|oth)", RegexOptions.IgnoreCase);
                    Regex pid = new Regex("(pid:)(\\d{9}\\b)", RegexOptions.ECMAScript);

                    if (byr.IsMatch(passport) && byr.IsMatch(passport) && iyr.IsMatch(passport) && eyr.IsMatch(passport) && hgt.IsMatch(passport) && hcl.IsMatch(passport) && ecl.IsMatch(passport) && pid.IsMatch(passport))
                    {
                        numberOfValidPassports += 1;
                    }
                }
            }
            return numberOfValidPassports.ToString();
        }
    }
}
