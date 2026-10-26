// REALM 9 — THE WORKSHOP — part A (lessons 1-11: imports, math, random, collections)
LESSONS.push(
{
  id:'r9-01', realm:9, n:1, title:'import: borrowing other people\'s tools',
  teaches:['import-basic'], requires:['realm8-gap'],
  story:`Beyond the Archive stands a long, roaring **Workshop**: benches of brass tools, each labelled by the programmers who made them. A tinker with gears for fingers waves a spanner. "I am Master Cog. You've been building every tool from scratch. Python ships with **thousands**, free, in boxes called *modules*."`,
  concept:{
    html:`A **module** is a file of ready-made Python tools. \`import\` brings one in:\n\n\`\`\`\nimport math\n\nprint(math.sqrt(16))   # 4.0\nprint(math.pi)         # 3.141592653589793\n\`\`\`\n\n- \`math.sqrt\` means: the \`sqrt\` function **inside** the \`math\` module. The dot is the way in.\n- Python comes with a huge **standard library**: \`math\`, \`random\`, \`json\`, \`csv\`, \`datetime\`, \`collections\` and hundreds more. People call it *batteries included*.\n- You must \`import\` before you use. Using \`sqrt(16)\` with no import is a \`NameError\`.\n- Put imports at the **top** of the file.`,
    analogy:`A workshop wall of labelled toolboxes: take down the box, then reach inside.`,
    example:R`import math

print(math.sqrt(16))
print(math.pi)`},
  predict:{code:R`import math
print(math.floor(2.9), math.ceil(2.1))`, q:'What prints?', opts:['2 3','3 2','2 2'], ans:0, why:'floor rounds down, ceil rounds up.'},
  cast:{code:R`import math

print(math.sqrt(16))
print(math.pi)`, task:'Cast it. Then try math.sqrt(2).'},
  bug:{broken:R`print(sqrt(16))`, task:'NameError: sqrt lives inside the math module. Import it and call it properly.',
    cases:[{inputs:[],tests:[['Works','lines==["4.0"]'],['Uses math.','"math.sqrt" in src']]}],
    sol:R`import math
print(math.sqrt(16))`, wrong:[R`print(sqrt(16))`]},
  write:{prompt:'Ask `Radius: ` (a number). Print `Area: <pi × r²>` and `Circumference: <2 × pi × r>`, both with 2 decimals. Use `math.pi`.',
    starter:R`import math
radius = float(input("Radius: "))
`,
    inputs:['10'],
    cases:[{inputs:['10'],tests:[['Radius 10','lines[-2:]==["Area: 314.16","Circumference: 62.83"]']]},{inputs:['2.5'],tests:[['Radius 2.5','lines[-2:]==["Area: 19.63","Circumference: 15.71"]']]},{inputs:['0'],tests:[['Zero','lines[-2:]==["Area: 0.00","Circumference: 0.00"]'],['Uses math.pi','"math.pi" in src']]}],
    sol:R`import math
radius = float(input("Radius: "))
print(f"Area: {math.pi * radius ** 2:.2f}")
print(f"Circumference: {2 * math.pi * radius:.2f}")`,
    wrong:[R`radius = float(input("Radius: "))
print(f"Area: {3.14 * radius ** 2:.2f}")
print(f"Circumference: {2 * 3.14 * radius:.2f}")`, R`import math
radius = float(input("Radius: "))
print(f"Area: {math.pi * radius * 2:.2f}")
print(f"Circumference: {2 * math.pi * radius:.2f}")`],
    hints:['import math at the top. math.pi is the constant.','Area is pi * radius ** 2. Circumference is 2 * pi * radius.','Format both with :.2f inside f-strings.','import math\nradius = float(input("Radius: "))\nprint(f"Area: {math.pi * radius ** 2:.2f}")\nprint(f"Circumference: {2 * math.pi * radius:.2f}")']},
  power:{can:['Import a module and use its tools','Use math.pi and math.sqrt'],
    expand:'Ask for a sphere\'s radius and print its volume (4/3 × pi × r³).',
    where:'Every Python program starts with imports. This is how you stand on other people\'s shoulders.',
    next:'Next: importing just the names you need.'},
  codex:{title:'import',body:'import module, then module.name. Standard library modules are always available.',snip:R`import math
math.sqrt(16)`}
},
{
  id:'r9-02', realm:9, n:2, title:'from ... import: just the tool you need',
  teaches:['from-import'], requires:['import-basic'],
  story:`"Reaching into the math box every time gets tiring," Master Cog says, clicking a spanner. "If you only need **one tool**, take it out of the box and put it on your own bench."`,
  concept:{
    html:`\`from module import name\` copies **just that name** into your program, so you drop the prefix:\n\n\`\`\`\nfrom math import sqrt, pi\n\nprint(sqrt(16))    # not math.sqrt\nprint(pi)\n\`\`\`\n\n- You can list several names separated by commas.\n- After a \`from\` import, the module name itself (\`math\`) is **not** defined. \`math.sqrt\` would be a \`NameError\`.\n- Avoid \`from math import *\`. It dumps hundreds of names into your program and can silently replace your own (a name clash).\n\nWhich to use? \`import math\` keeps the origin visible (\`math.sqrt\` is clear). \`from math import sqrt\` is neater for a few heavily used names.`,
    analogy:`Taking one wrench from the toolbox and hanging it on your own wall.`,
    example:R`from math import sqrt, pi

print(sqrt(16))
print(round(pi, 2))`},
  predict:{code:R`from math import sqrt
print(sqrt(9))
print(math.pi)`, q:'What happens?', opts:['3.0 prints, then NameError','3.0 and 3.14','NameError immediately'], ans:0, why:'sqrt was imported, but the name math was never defined.'},
  cast:{code:R`from math import sqrt, pi

print(sqrt(16))
print(round(pi, 2))`, task:'Cast it.'},
  bug:{broken:R`from math import sqrt
print(math.sqrt(25))`, task:'NameError: only sqrt was imported, not math. Call it as sqrt.',
    cases:[{inputs:[],tests:[['Works','lines==["5.0"]']]}],
    sol:R`from math import sqrt
print(sqrt(25))`, wrong:[R`from math import sqrt
print(math.sqrt(25))`]},
  write:{prompt:'Ask `A: ` and `B: ` (the two short sides of a right triangle). Using `from math import sqrt` (not `import math`), print `Hypotenuse: <value>` with 2 decimals.',
    starter:R`from math import sqrt
a = float(input("A: "))
b = float(input("B: "))
`,
    inputs:['3','4'],
    cases:[{inputs:['3','4'],tests:[['3-4-5','lines[-1]=="Hypotenuse: 5.00"']]},{inputs:['1','1'],tests:[['Root two','lines[-1]=="Hypotenuse: 1.41"']]},{inputs:['0','7'],tests:[['Degenerate','lines[-1]=="Hypotenuse: 7.00"']]},{inputs:['5','12'],tests:[['5-12-13','lines[-1]=="Hypotenuse: 13.00"'],['from-import style','"from math import" in src and "math." not in src.replace("from math import","")']]}],
    sol:R`from math import sqrt
a = float(input("A: "))
b = float(input("B: "))
print(f"Hypotenuse: {sqrt(a ** 2 + b ** 2):.2f}")`,
    wrong:[R`import math
a = float(input("A: "))
b = float(input("B: "))
print(f"Hypotenuse: {math.sqrt(a ** 2 + b ** 2):.2f}")`, R`from math import sqrt
a = float(input("A: "))
b = float(input("B: "))
print(f"Hypotenuse: {sqrt(a + b):.2f}")`],
    hints:['The hypotenuse is the square root of a squared plus b squared.','sqrt(a ** 2 + b ** 2) — no math. prefix.','Format with :.2f.','from math import sqrt\na = float(input("A: "))\nb = float(input("B: "))\nprint(f"Hypotenuse: {sqrt(a ** 2 + b ** 2):.2f}")']},
  power:{can:['Import single names with from','Know when to avoid import *'],
    expand:'Also print the triangle\'s area with the same two numbers.',
    where:'You will see both styles in real code. Now you can read both.',
    next:'Next: giving imports a nickname.'},
  codex:{title:'from import',body:'from math import sqrt, pi. The module name is not defined afterwards. Avoid import *.',snip:R`from math import sqrt`}
},
{
  id:'r9-03', realm:9, n:3, title:'import ... as: nicknames',
  teaches:['import-as'], requires:['from-import'],
  story:`"Long names are a chore to type," Master Cog says, scratching a nickname on a drawer with a nail. "**Short alias**, same tool."`,
  concept:{
    html:`\`as\` gives an import a shorter (or clearer) name:\n\n\`\`\`\nimport statistics as stats\n\nprint(stats.mean([4, 8, 6, 10]))\n\`\`\`\n\n- Aliases are just a **local name**. The module is unchanged.\n- Some aliases are conventions you'll see everywhere (for example \`import numpy as np\`, \`import pandas as pd\`). For standard-library modules, use the alias only when it helps.\n- You can alias a single name too: \`from statistics import median as mid\`.\n\n\`statistics\` offers \`mean\`, \`median\`, \`mode\`, \`stdev\` and more. (We study it properly soon.)`,
    analogy:`A nickname: same person, quicker to call.`,
    example:R`import statistics as stats

print(stats.mean([4, 8, 6, 10]))
print(stats.median([4, 8, 6, 10]))`},
  predict:{code:R`import math as m
print(m.floor(3.7))`, q:'What prints?', opts:['3','4','NameError'], ans:0, why:'m is just another name for the math module.'},
  cast:{code:R`import statistics as stats

print(stats.mean([4, 8, 6, 10]))
print(stats.median([4, 8, 6, 10]))`, task:'Cast it.'},
  bug:{broken:R`import statistics as stats
print(statistics.mean([2, 4]))`, task:'NameError: with an alias, the original name is not defined. Use the alias.',
    cases:[{inputs:[],tests:[['Works','lines==["3"]']]}],
    sol:R`import statistics as stats
print(stats.mean([2, 4]))`, wrong:[R`import statistics as stats
print(statistics.mean([2, 4]))`]},
  write:{prompt:'Ask `Numbers: ` (space-separated). Using `import statistics as stats`, print `Mean: <m>` and `Median: <m>`, each with 2 decimals.',
    starter:R`import statistics as stats
numbers = [float(n) for n in input("Numbers: ").split()]
`,
    inputs:['4 8 6 10'],
    cases:[{inputs:['4 8 6 10'],tests:[['Even count','lines[-2:]==["Mean: 7.00","Median: 7.00"]']]},{inputs:['1 2 9'],tests:[['Odd count','lines[-2:]==["Mean: 4.00","Median: 2.00"]']]},{inputs:['5'],tests:[['One number','lines[-2:]==["Mean: 5.00","Median: 5.00"]']]},{inputs:['2.5 3.5'],tests:[['Decimals','lines[-2:]==["Mean: 3.00","Median: 3.00"]'],['Uses alias','"import statistics as" in src']]}],
    sol:R`import statistics as stats
numbers = [float(n) for n in input("Numbers: ").split()]
print(f"Mean: {stats.mean(numbers):.2f}")
print(f"Median: {stats.median(numbers):.2f}")`,
    wrong:[R`numbers = [float(n) for n in input("Numbers: ").split()]
print(f"Mean: {sum(numbers) / len(numbers):.2f}")
print(f"Median: {sorted(numbers)[len(numbers) // 2]:.2f}")`, R`import statistics as stats
numbers = [float(n) for n in input("Numbers: ").split()]
print(f"Mean: {stats.median(numbers):.2f}")
print(f"Median: {stats.mean(numbers):.2f}")`],
    hints:['stats.mean(numbers) and stats.median(numbers).','Format each result with :.2f.','Use the alias stats, not statistics.','import statistics as stats\nnumbers = [float(n) for n in input("Numbers: ").split()]\nprint(f"Mean: {stats.mean(numbers):.2f}")\nprint(f"Median: {stats.median(numbers):.2f}")']},
  power:{can:['Give imports a short alias','Use mean and median from statistics'],
    expand:'Also print the mode with stats.mode.',
    where:'Aliases such as np and pd appear in every data-science notebook.',
    next:'Next: the math module\'s handy tools.'},
  codex:{title:'import as',body:'import statistics as stats. The original name is not defined after aliasing.',snip:R`import statistics as stats`}
},
{
  id:'r9-04', realm:9, n:4, title:'math tools: ceil, floor, gcd and friends',
  teaches:['math-tools'], requires:['import-as'],
  story:`Master Cog hauls out a drawer of brass gauges. "Pages in a book, tiles for a floor, the most that fits in a box. Ordinary jobs, but your own arithmetic keeps getting them **off by one**."`,
  concept:{
    html:`The \`math\` module has rounding and number tools:\n\n\`\`\`\nimport math\n\nmath.ceil(2.1)        # 3   round UP\nmath.floor(2.9)       # 2   round DOWN\nmath.trunc(-2.9)      # -2  chop off the decimals\nmath.gcd(12, 18)      # 6   greatest common divisor\nmath.hypot(3, 4)      # 5.0 length of the diagonal\nmath.factorial(5)     # 120\nmath.isqrt(17)        # 4   integer square root\n\`\`\`\n\n**Pagination** is the classic use of \`ceil\`: 23 items at 10 per page need \`math.ceil(23 / 10)\` = 3 pages.\n\nThe usual hand-made trick \`items // per + 1\` is **wrong** when the items divide evenly (20 items, 10 per page is 2 pages, not 3).`,
    analogy:`Always buying a whole box of tiles: you round up, never down.`,
    example:R`import math

items, per_page = 23, 10
print(math.ceil(items / per_page))
print(math.gcd(12, 18), math.hypot(3, 4))`},
  predict:{code:R`import math
print(math.ceil(20 / 10), 20 // 10 + 1)`, q:'What prints?', opts:['2 3','3 3','2 2'], ans:0, why:'ceil gives the right answer (2). The "// + 1" shortcut over-counts by one when the division is exact.'},
  cast:{code:R`import math

items, per_page = 23, 10
print(math.ceil(items / per_page))
print(math.gcd(12, 18), math.hypot(3, 4))`, task:'Cast it.'},
  bug:{broken:R`items, per_page = 20, 10
pages = items // per_page + 1
print("Pages:", pages)`, task:'20 items at 10 per page should be 2 pages, but it says 3. Use math.ceil.',
    cases:[{inputs:[],tests:[['Two pages','lines==["Pages: 2"]'],['Uses ceil','"ceil" in src']]}],
    sol:R`import math
items, per_page = 20, 10
pages = math.ceil(items / per_page)
print("Pages:", pages)`, wrong:[R`items, per_page = 20, 10
pages = items // per_page + 1
print("Pages:", pages)`]},
  write:{prompt:'Ask `Items: ` and `Per page: ` (whole numbers). If per page is 0 or less print `Per page must be positive`. Otherwise print `Pages: <n>` and `Last page has: <k> items` (0 items means 0 pages and 0 on the last page).',
    starter:R`import math
items = int(input("Items: "))
per_page = int(input("Per page: "))
`,
    inputs:['23','10'],
    cases:[{inputs:['23','10'],tests:[['Not exact','lines[-2:]==["Pages: 3","Last page has: 3 items"]']]},{inputs:['20','10'],tests:[['Exact','lines[-2:]==["Pages: 2","Last page has: 10 items"]']]},{inputs:['0','10'],tests:[['Nothing','lines[-2:]==["Pages: 0","Last page has: 0 items"]']]},{inputs:['5','10'],tests:[['Fits on one','lines[-2:]==["Pages: 1","Last page has: 5 items"]']]},{inputs:['9','0'],tests:[['Bad size','lines[-1]=="Per page must be positive"']]},{inputs:['1','1'],tests:[['One each','lines[-2:]==["Pages: 1","Last page has: 1 items"]'],['Uses ceil','"math.ceil" in src']]}],
    sol:R`import math
items = int(input("Items: "))
per_page = int(input("Per page: "))
if per_page <= 0:
    print("Per page must be positive")
else:
    pages = math.ceil(items / per_page)
    last = items - (pages - 1) * per_page if pages > 0 else 0
    print("Pages:", pages)
    print("Last page has:", last, "items")`,
    wrong:[R`items = int(input("Items: "))
per_page = int(input("Per page: "))
if per_page <= 0:
    print("Per page must be positive")
else:
    pages = items // per_page + 1
    last = items - (pages - 1) * per_page
    print("Pages:", pages)
    print("Last page has:", last, "items")`, R`import math
items = int(input("Items: "))
per_page = int(input("Per page: "))
pages = math.ceil(items / per_page)
last = items - (pages - 1) * per_page if pages > 0 else 0
print("Pages:", pages)
print("Last page has:", last, "items")`],
    hints:['Check per_page <= 0 first.','pages = math.ceil(items / per_page).','Items on the last page = items - (pages - 1) * per_page, but 0 if there are no pages.','import math\nitems = int(input("Items: "))\nper_page = int(input("Per page: "))\nif per_page <= 0:\n    print("Per page must be positive")\nelse:\n    pages = math.ceil(items / per_page)\n    last = items - (pages - 1) * per_page if pages > 0 else 0\n    print("Pages:", pages)\n    print("Last page has:", last, "items")']},
  power:{can:['Round up and down on purpose','Use gcd, hypot, factorial and isqrt'],
    expand:'Simplify a fraction like 12/18 by dividing both parts by their gcd.',
    where:'Pagination, packaging and layout code all use ceil.',
    next:'Next: why floats misbehave.'},
  codex:{title:'math tools',body:'ceil up, floor down, trunc chop, gcd, hypot, factorial, isqrt. ceil(items / per_page) is how you count pages.',snip:R`pages = math.ceil(items / per_page)`}
},
{
  id:'r9-05', realm:9, n:5, title:'Float surprises and honest rounding',
  teaches:['math-float'], requires:['math-tools'],
  story:`Master Cog lays 0.1 and 0.2 on the bench, weighs them together, and frowns. "**0.30000000000000004.** Every computer does this. Don't be fooled, and don't compare floats with ==."`,
  concept:{
    html:`Computers store decimals in binary, so many (like 0.1) are **slightly off**:\n\n\`\`\`\n0.1 + 0.2 == 0.3          # False!\n0.1 + 0.2                 # 0.30000000000000004\n\`\`\`\n\n**Compare** floats with \`math.isclose\`:\n\n\`\`\`\nimport math\nmath.isclose(0.1 + 0.2, 0.3)       # True\n\`\`\`\n\n**Rounding:** Python's built-in \`round\` uses *banker's rounding* (round half to even):\n\n\`\`\`\nround(0.5)  # 0\nround(1.5)  # 2\nround(2.5)  # 2   (not 3!)\nround(3.5)  # 4\n\`\`\`\n\nWhen you want the "school" rule (half goes up), use \`math.floor(x + 0.5)\` for non-negative x.\n\nFor **money**, avoid floats entirely (the \`decimal\` module, later in this Realm) or keep whole cents as ints.`,
    analogy:`A ruler marked in binary: it can't land exactly on every tenth.`,
    example:R`import math

print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
print(round(2.5), round(3.5))`},
  predict:{code:R`print(round(0.5), round(1.5), round(2.5))`, q:'What prints?', opts:['0 2 2','1 2 3','0 1 2'], ans:0, why:'Round-half-to-even: 0.5 goes to 0, 1.5 to 2, 2.5 to 2.'},
  cast:{code:R`import math

print(0.1 + 0.2 == 0.3)
print(math.isclose(0.1 + 0.2, 0.3))
print(round(2.5), round(3.5))`, task:'Cast it.'},
  bug:{broken:R`total = 0.1 + 0.2
if total == 0.3:
    print("equal")
else:
    print("different")`, task:'It says different. Compare with math.isclose so it prints equal.',
    cases:[{inputs:[],tests:[['Equal','lines==["equal"]']]}],
    sol:R`import math
total = 0.1 + 0.2
if math.isclose(total, 0.3):
    print("equal")
else:
    print("different")`, wrong:[R`total = 0.1 + 0.2
if total == 0.3:
    print("equal")
else:
    print("different")`]},
  write:{prompt:'Write `same(a, b)` (True if the floats are close, using `math.isclose`) and `round_half_up(x)` (for `x >= 0`: 0.5 → 1, 2.5 → 3, 1.4 → 1, returns an int). Print `same(0.1 + 0.2, 0.3)`, `round_half_up(2.5)` and the built-in `round(2.5)`, one per line.',
    starter:R`import math
`,
    cases:[{inputs:[],tests:[['Printed','lines==["True","3","2"]'],['same','g["same"](0.1+0.2,0.3) is True and g["same"](1.0,1.1) is False'],['half up','[g["round_half_up"](x) for x in (0.5,1.5,2.5,3.5,1.4,0,9.99)]==[1,2,3,4,1,0,10]'],['int result','type(g["round_half_up"](2.5)) is int'],['Uses isclose','"isclose" in src']]}],
    sol:R`import math

def same(a, b):
    return math.isclose(a, b)

def round_half_up(x):
    return math.floor(x + 0.5)

print(same(0.1 + 0.2, 0.3))
print(round_half_up(2.5))
print(round(2.5))`,
    wrong:[R`import math

def same(a, b):
    return a == b

def round_half_up(x):
    return math.floor(x + 0.5)

print(same(0.1 + 0.2, 0.3))
print(round_half_up(2.5))
print(round(2.5))`, R`import math

def same(a, b):
    return math.isclose(a, b)

def round_half_up(x):
    return round(x)

print(same(0.1 + 0.2, 0.3))
print(round_half_up(2.5))
print(round(2.5))`],
    hints:['same is just return math.isclose(a, b).','round_half_up: add 0.5 then math.floor.','Print the three values; the last one is the built-in round(2.5).','import math\n\ndef same(a, b):\n    return math.isclose(a, b)\n\ndef round_half_up(x):\n    return math.floor(x + 0.5)\n\nprint(same(0.1 + 0.2, 0.3))\nprint(round_half_up(2.5))\nprint(round(2.5))']},
  power:{can:['Compare floats safely','Explain banker\'s rounding and apply round-half-up'],
    expand:'Show that sum([0.1] * 10) == 1.0 is False, then fix it with isclose.',
    where:'Money, science and graphics code all trip on float equality.',
    next:'Next: randomness.'},
  codex:{title:'Floats',body:'Never == on floats: use math.isclose. round() is half-to-even. floor(x + 0.5) rounds half up.',snip:R`math.isclose(a, b)`}
},
{
  id:'r9-06', realm:9, n:6, title:'random: dice, coins and seeds',
  teaches:['random-basics'], requires:['math-float'],
  story:`Master Cog tips a sack of dice onto the bench. "Games need **chance**. Python's random module makes it, and a secret handle called a **seed** lets you replay the exact same luck when you're testing."`,
  concept:{
    html:`\`\`\`\nimport random\n\nrandom.randint(1, 6)          # a whole number from 1 to 6 (both included)\nrandom.random()               # a float from 0.0 up to (not including) 1.0\nrandom.choice(["heads", "tails"])\n\nrandom.seed(42)               # same seed → the same "random" sequence\n\`\`\`\n\n- \`randint(a, b)\` **includes both ends**.\n- The numbers are *pseudo-random*: made by a formula. Seeding the generator with the same number makes it repeat exactly: great for **tests** and bug reports.\n- Don't use \`random\` for passwords or security. (Use the \`secrets\` module for that.)\n- Don't hard-code expected random values in tests. Test **properties**: always between 1 and 6, both values happen, etc.`,
    analogy:`A shuffled deck whose order you can replay by remembering the shuffle number.`,
    example:R`import random

random.seed(1)
a = [random.randint(1, 6) for _ in range(5)]
random.seed(1)
b = [random.randint(1, 6) for _ in range(5)]
print(a == b)`},
  predict:{code:R`import random
random.seed(7)
x = random.randint(1, 6)
print(1 <= x <= 6)`, q:'What prints?', opts:['True','False','It depends on the seed'], ans:0, why:'randint(1, 6) is always from 1 to 6, whatever the seed.'},
  cast:{code:R`import random

random.seed(1)
a = [random.randint(1, 6) for _ in range(5)]
random.seed(1)
b = [random.randint(1, 6) for _ in range(5)]
print(a == b)`, task:'Cast it. Change the seed for the second list and see what happens.'},
  bug:{broken:R`import random
rolls = [random.randint(0, 6) for _ in range(300)]
print(min(rolls) >= 1 and max(rolls) <= 6)`, task:'This die can roll a 0, which is not a die face. Fix the range so it prints True.',
    cases:[{inputs:[],tests:[['True','lines==["True"]']]}],
    sol:R`import random
rolls = [random.randint(1, 6) for _ in range(300)]
print(min(rolls) >= 1 and max(rolls) <= 6)`, wrong:[R`import random
rolls = [random.randint(0, 6) for _ in range(300)]
print(min(rolls) >= 1 and max(rolls) <= 6)`]},
  write:{prompt:'Write `roll_die(sides=6)` (a random whole number from 1 to `sides`) and `flip()` (returns `"heads"` or `"tails"`). Then print `Ready`.',
    starter:R`import random

# define roll_die and flip
`,
    cases:[{inputs:[],tests:[['Ready','lines==["Ready"]'],['Die range','all(1<=g["roll_die"]()<=6 for _ in range(300))'],['Both ends happen','{g["roll_die"]() for _ in range(600)}=={1,2,3,4,5,6}'],['Custom sides','{g["roll_die"](2) for _ in range(200)}=={1,2} and all(1<=g["roll_die"](20)<=20 for _ in range(300))'],['Coin values','{g["flip"]() for _ in range(200)}=={"heads","tails"}'],['Seed repeats','(lambda r: (r.seed(5), [g["roll_die"]() for _ in range(8)], r.seed(5), [g["roll_die"]() for _ in range(8)]))(__import__("random"))[1]==(lambda r: (r.seed(5), [g["roll_die"]() for _ in range(8)]))(__import__("random"))[1]'],['Uses random','"random." in src']]}],
    sol:R`import random

def roll_die(sides=6):
    return random.randint(1, sides)

def flip():
    return random.choice(["heads", "tails"])

print("Ready")`,
    wrong:[R`import random

def roll_die(sides=6):
    return random.randint(0, sides)

def flip():
    return random.choice(["heads", "tails"])

print("Ready")`, R`import random

def roll_die(sides=6):
    return random.randint(1, 6)

def flip():
    return random.choice(["heads", "tails"])

print("Ready")`],
    hints:['roll_die: return random.randint(1, sides).','flip: random.choice(["heads", "tails"]).','Print Ready at the end.','import random\n\ndef roll_die(sides=6):\n    return random.randint(1, sides)\n\ndef flip():\n    return random.choice(["heads", "tails"])\n\nprint("Ready")']},
  power:{can:['Roll dice and flip coins in code','Make randomness repeatable with a seed'],
    expand:'Roll two dice 1000 times and count how often the total is 7.',
    where:'Games, simulations and tests all depend on controlled randomness.',
    next:'Next: shuffling and sampling.'},
  codex:{title:'random',body:'randint(a, b) includes both ends. choice(seq). seed(n) repeats the sequence. Not for security.',snip:R`random.randint(1, 6)`}
},
{
  id:'r9-07', realm:9, n:7, title:'shuffle, sample and choices',
  teaches:['random-sample'], requires:['random-basics'],
  story:`Master Cog builds a stack of brass cards. "A deck of cards needs: **mix them up**, **deal a hand** (no card twice), and sometimes **draw with replacement**."`,
  concept:{
    html:`\`\`\`\nimport random\n\ncards = ["A", "B", "C", "D"]\nrandom.shuffle(cards)              # reorders the list IN PLACE (returns None)\nrandom.sample(cards, 2)            # 2 different items, original unchanged\nrandom.choices(cards, k=5)         # 5 picks WITH replacement (repeats allowed)\nrandom.choices(["a", "b"], weights=[9, 1], k=10)   # weighted\n\`\`\`\n\n- \`shuffle\` **changes the list** and returns \`None\`. Writing \`x = random.shuffle(x)\` makes \`x\` \`None\`.\n- \`sample(population, k)\` raises \`ValueError\` if \`k\` is larger than the population.\n- \`sample\` never gives the same item twice (a hand of cards); \`choices\` may (rolling dice).\n- To shuffle without changing the original: \`shuffled = random.sample(cards, len(cards))\`.`,
    analogy:`sample: dealing from a deck. choices: rolling dice.`,
    example:R`import random

suits = ["S", "H"]
ranks = ["A", "K", "Q"]
deck = [r + s for s in suits for r in ranks]
hand = random.sample(deck, 3)
print(len(hand), len(set(hand)))`},
  predict:{code:R`import random
x = [3, 1, 2]
y = random.shuffle(x)
print(y)`, q:'What prints?', opts:['None','[3, 1, 2]','a shuffled list'], ans:0, why:'shuffle works in place and returns None.'},
  cast:{code:R`import random

suits = ["S", "H"]
ranks = ["A", "K", "Q"]
deck = [r + s for s in suits for r in ranks]
hand = random.sample(deck, 3)
print(len(hand), len(set(hand)))`, task:'Cast it.'},
  bug:{broken:R`import random
cards = [1, 2, 3]
cards = random.shuffle(cards)
print(len(cards))`, task:'TypeError: shuffle returns None, so cards became None. Shuffle in place and keep the list.',
    cases:[{inputs:[],tests:[['Length','lines==["3"]']]}],
    sol:R`import random
cards = [1, 2, 3]
random.shuffle(cards)
print(len(cards))`, wrong:[R`import random
cards = [1, 2, 3]
cards = random.shuffle(cards)
print(len(cards))`]},
  write:{prompt:'Build a deck of 52 cards (ranks `A 2 3 4 5 6 7 8 9 10 J Q K` × suits `S H D C`, written like `AS` or `10H`) with a comprehension. Write `deal(deck, n)` that returns `n` different random cards **without changing the deck** and raises `ValueError` if `n` is more than the deck holds. Print `Deck: 52 cards`, deal 5 and print `Hand: 5 unique cards`.',
    starter:R`import random

ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
suits = ["S", "H", "D", "C"]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Deck: 52 cards","Hand: 5 unique cards"]'],['Deck size','len(g["deck"])==52 and len(set(g["deck"]))==52'],['Card format','"10H" in g["deck"] and "AS" in g["deck"]'],['deal size','len(g["deal"](g["deck"],7))==7'],['deal unique','len(set(g["deal"](g["deck"],52)))==52'],['Deck unchanged','(lambda d: (g["deal"](d,5), d==g["deck"] and len(d)==52)[1])(list(g["deck"]))'],['Too many','__import__("unittest").TestCase().assertRaises(ValueError, g["deal"], ["a","b"], 3) is None'],['Uses sample','"sample" in src']]}],
    sol:R`import random

ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
suits = ["S", "H", "D", "C"]
deck = [rank + suit for suit in suits for rank in ranks]

def deal(deck, n):
    return random.sample(deck, n)

print("Deck:", len(deck), "cards")
hand = deal(deck, 5)
print("Hand:", len(set(hand)), "unique cards")`,
    wrong:[R`import random

ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
suits = ["S", "H", "D", "C"]
deck = [rank + suit for suit in suits for rank in ranks]

def deal(deck, n):
    random.shuffle(deck)
    return deck[:n]

print("Deck:", len(deck), "cards")
hand = deal(deck, 5)
print("Hand:", len(set(hand)), "unique cards")`, R`import random

ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
suits = ["S", "H", "D", "C"]
deck = [rank + suit for suit in suits for rank in ranks]

def deal(deck, n):
    return random.choices(deck, k=n)

print("Deck:", len(deck), "cards")
hand = deal(deck, 5)
print("Hand:", len(set(hand)), "unique cards")`],
    hints:['deck = [rank + suit for suit in suits for rank in ranks].','deal: random.sample(deck, n) gives n different cards and leaves the deck alone (and raises ValueError itself when n is too big).','Print len(deck), then deal 5 and print len(set(hand)).','import random\n\nranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]\nsuits = ["S", "H", "D", "C"]\ndeck = [rank + suit for suit in suits for rank in ranks]\n\ndef deal(deck, n):\n    return random.sample(deck, n)\n\nprint("Deck:", len(deck), "cards")\nhand = deal(deck, 5)\nprint("Hand:", len(set(hand)), "unique cards")']},
  power:{can:['Shuffle, deal and sample correctly','Know the difference between sample and choices'],
    expand:'Deal two hands of 5 from the same deck without overlap.',
    where:'Card games, raffles, A/B tests and quiz question order all use sample and shuffle.',
    next:'Next: counting things with Counter.'},
  codex:{title:'shuffle & sample',body:'shuffle mixes in place (returns None). sample(seq, k) draws k different items. choices draws with repeats.',snip:R`hand = random.sample(deck, 5)`}
},
{
  id:'r9-08', realm:9, n:8, title:'Counter: counting made easy',
  teaches:['collections-counter'], requires:['random-sample','dict-count'],
  story:`"You've counted words with dicts," Master Cog says. "Very honourable. Now meet the tool built for exactly that. **Counter** is a dict that counts."`,
  concept:{
    html:`\`collections.Counter\` counts items in one line:\n\n\`\`\`\nfrom collections import Counter\n\nc = Counter("mississippi")\nprint(c)                    # Counter({'i': 4, 's': 4, 'p': 2, 'm': 1})\nprint(c["s"])               # 4\nprint(c["z"])               # 0  (missing items count as 0, no KeyError)\nprint(c.most_common(2))     # [('i', 4), ('s', 4)]\n\`\`\`\n\n- It works on any iterable: strings, lists, the words of a file.\n- \`c.update(more_items)\` adds more counts. \`c1 + c2\` combines counters.\n- **Careful:** \`most_common\` keeps ties in the order the items were **first seen**. When you need a fair, predictable order, sort yourself: \`sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))\`.`,
    analogy:`A tally-stick keeper who never forgets a mark.`,
    example:R`from collections import Counter

c = Counter("mississippi")
print(c.most_common(2))
print(c["z"])`},
  predict:{code:R`from collections import Counter
c = Counter(["a", "b", "a"])
print(c["a"], c["z"])`, q:'What prints?', opts:['2 0','2 KeyError','1 0'], ans:0, why:'Counter returns 0 for items it has not seen.'},
  cast:{code:R`from collections import Counter

c = Counter("mississippi")
print(c.most_common(2))
print(c["z"])`, task:'Cast it.'},
  bug:{broken:R`from collections import Counter
c = Counter(["b", "a", "a", "b", "c"])
print(c.most_common(1)[0][0])`, task:'a and b tie with 2 each, and a should win alphabetically. most_common picks whichever was seen first (b). Sort with a (-count, name) key. Expected: a',
    cases:[{inputs:[],tests:[['Fair','lines==["a"]']]}],
    sol:R`from collections import Counter
c = Counter(["b", "a", "a", "b", "c"])
print(sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))[0][0])`, wrong:[R`from collections import Counter
c = Counter(["b", "a", "a", "b", "c"])
print(c.most_common(1)[0][0])`]},
  write:{prompt:'Ask `Text: `. Using `Counter`, print the **top 3 words** (lower-case, words are runs of letters/digits/apostrophes: use `re.findall(r"[a-z0-9\']+", text.lower())`) as `<word>: <count>`. Ties go alphabetical. Print `No words` if there are none.',
    starter:R`import re
from collections import Counter

text = input("Text: ")
`,
    inputs:['the cat and the hat and the bat'],
    cases:[{inputs:['the cat and the hat and the bat'],tests:[['Top three','lines[-3:]==["the: 3","and: 2","bat: 1"]']]},{inputs:["It's a cat. A CAT! it's"],tests:[['Case and punctuation','lines[-3:]==["a: 2","cat: 2","it\'s: 2"]']]},{inputs:['hello'],tests:[['One word','lines[-1]=="hello: 1"']]},{inputs:['!!! ...'],tests:[['No words','lines[-1]=="No words"']]},{inputs:['b a d c'],tests:[['All tie','lines[-3:]==["a: 1","b: 1","c: 1"] and "Counter" in src']]}],
    sol:R`import re
from collections import Counter

text = input("Text: ")
words = re.findall(r"[a-z0-9']+", text.lower())
counts = Counter(words)
if not counts:
    print("No words")
else:
    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    for word, count in ranked[:3]:
        print(f"{word}: {count}")`,
    wrong:[R`import re
from collections import Counter

text = input("Text: ")
words = re.findall(r"[a-z0-9']+", text.lower())
counts = Counter(words)
if not counts:
    print("No words")
else:
    for word, count in counts.most_common(3):
        print(f"{word}: {count}")`, R`import re
from collections import Counter

text = input("Text: ")
words = re.findall(r"[a-z0-9']+", text)
counts = Counter(words)
if not counts:
    print("No words")
else:
    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))
    for word, count in ranked[:3]:
        print(f"{word}: {count}")`],
    hints:['words = re.findall(r"[a-z0-9\']+", text.lower()), then Counter(words).','An empty counter is falsy: check it first to print No words.','Sort counts.items() by (-count, word) and print the first three.','import re\nfrom collections import Counter\n\ntext = input("Text: ")\nwords = re.findall(r"[a-z0-9\']+", text.lower())\ncounts = Counter(words)\nif not counts:\n    print("No words")\nelse:\n    ranked = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))\n    for word, count in ranked[:3]:\n        print(f"{word}: {count}")']},
  power:{can:['Count anything with Counter','Rank with a fair tie-break'],
    expand:'Add the total number of words and the number of distinct words.',
    where:'Word clouds, log analysis, survey tallies and inventory counts are Counter jobs.',
    next:'Next: grouping with defaultdict.'},
  codex:{title:'Counter',body:'Counter(iterable). c[item] is 0 if unseen. most_common(n) keeps ties in first-seen order, so sort yourself for fairness.',snip:R`Counter(words).most_common(3)`}
},
{
  id:'r9-09', realm:9, n:9, title:'defaultdict: groups without the fuss',
  teaches:['collections-defaultdict'], requires:['collections-counter'],
  story:`"Grouping means checking *'is the key there yet?'* on every line," Master Cog grumbles. "A **defaultdict** answers that question for you."`,
  concept:{
    html:`A \`defaultdict\` creates a missing value the first time you ask:\n\n\`\`\`\nfrom collections import defaultdict\n\ngroups = defaultdict(list)      # missing key → a new empty list\nfor word in ["pear", "fig", "plum", "kiwi"]:\n    groups[len(word)].append(word)\n\nprint(dict(groups))   # {4: ['pear', 'plum', 'kiwi'], 3: ['fig']}\n\`\`\`\n\n- \`defaultdict(list)\`, \`defaultdict(int)\` (counts), \`defaultdict(set)\`: the argument is a **factory** called with no arguments.\n- Compare the plain-dict way: \`groups.setdefault(key, []).append(x)\` or an \`if key not in groups\` check.\n- Reading a missing key **creates** it. Use \`key in groups\` to test without creating.`,
    analogy:`A filing cabinet that adds a new folder the moment you mention a new name.`,
    example:R`from collections import defaultdict

groups = defaultdict(list)
for word in ["pear", "fig", "plum", "kiwi"]:
    groups[len(word)].append(word)
print(dict(groups))`},
  predict:{code:R`from collections import defaultdict
d = defaultdict(int)
d["a"] += 1
d["a"] += 1
print(d["a"], d["b"], len(d))`, q:'What prints?', opts:['2 0 2','2 0 1','2 KeyError'], ans:0, why:'Reading d["b"] creates it with the default 0, so the length becomes 2.'},
  cast:{code:R`from collections import defaultdict

groups = defaultdict(list)
for word in ["pear", "fig", "plum", "kiwi"]:
    groups[len(word)].append(word)
print(dict(groups))`, task:'Cast it.'},
  bug:{broken:R`groups = {}
for word in ["pear", "fig", "plum"]:
    groups[len(word)].append(word)
print(groups)`, task:'KeyError on the first word. Use a defaultdict(list) so groups are created on demand.',
    cases:[{inputs:[],tests:[['Grouped','lines==["defaultdict(<class \'list\'>, {4: [\'pear\', \'plum\'], 3: [\'fig\']})"]']]}],
    sol:R`from collections import defaultdict
groups = defaultdict(list)
for word in ["pear", "fig", "plum"]:
    groups[len(word)].append(word)
print(groups)`, wrong:[R`groups = {}
for word in ["pear", "fig", "plum"]:
    groups[len(word)].append(word)
print(groups)`]},
  write:{prompt:'Ask `Words: ` (space-separated). Using `defaultdict(list)`, group the words by length. Print one line per length, shortest first, as `<length>: <words joined by ", ">` (words in the order typed). Print `No words` for empty input.',
    starter:R`from collections import defaultdict

words = input("Words: ").split()
`,
    inputs:['pear fig plum kiwi apple'],
    cases:[{inputs:['pear fig plum kiwi apple'],tests:[['Groups','lines[-3:]==["3: fig","4: pear, plum, kiwi","5: apple"]']]},{inputs:['a bb cc a'],tests:[['Repeats kept','lines[-2:]==["1: a, a","2: bb, cc"]']]},{inputs:[''],tests:[['Empty','lines[-1]=="No words"']]},{inputs:['hello'],tests:[['One','lines[-1]=="5: hello"'],['Uses defaultdict','"defaultdict(list)" in src']]}],
    sol:R`from collections import defaultdict

words = input("Words: ").split()
groups = defaultdict(list)
for word in words:
    groups[len(word)].append(word)

if not groups:
    print("No words")
for length in sorted(groups):
    print(f"{length}: {', '.join(groups[length])}")`,
    wrong:[R`words = input("Words: ").split()
groups = {}
for word in words:
    groups.setdefault(len(word), []).append(word)

if not groups:
    print("No words")
for length in sorted(groups):
    print(f"{length}: {', '.join(groups[length])}")`, R`from collections import defaultdict

words = input("Words: ").split()
groups = defaultdict(list)
for word in words:
    groups[len(word)].append(word)

if not groups:
    print("No words")
for length in groups:
    print(f"{length}: {', '.join(groups[length])}")`],
    hints:['groups = defaultdict(list); groups[len(word)].append(word).','Print No words if groups is empty.','Loop sorted(groups) and join each list with ", ".','from collections import defaultdict\n\nwords = input("Words: ").split()\ngroups = defaultdict(list)\nfor word in words:\n    groups[len(word)].append(word)\n\nif not groups:\n    print("No words")\nfor length in sorted(groups):\n    print(f"{length}: {\', \'.join(groups[length])}")']},
  power:{can:['Group items without key checks','Choose the right default factory'],
    expand:'Group the words by first letter instead.',
    where:'Grouping rows by a column is the first step of every report.',
    next:'Next: queues with deque.'},
  codex:{title:'defaultdict',body:'defaultdict(list) / (int) / (set) creates missing values on first access.',snip:R`groups = defaultdict(list)
groups[key].append(item)`}
},
{
  id:'r9-10', realm:9, n:10, title:'deque: queues and "last N" lists',
  teaches:['collections-deque'], requires:['collections-defaultdict'],
  story:`A line of customers snakes out of the Workshop door. "Fair is fair," Master Cog says. "**First come, first served.** A list can do it, but slowly. Use the tool made for queues."`,
  concept:{
    html:`A \`deque\` ("deck") is a list-like queue that is fast at **both ends**:\n\n\`\`\`\nfrom collections import deque\n\nq = deque()\nq.append("Ada")        # join the back\nq.append("Bo")\nq.popleft()            # serve the front → "Ada"\nq.appendleft("VIP")    # jump to the front\n\`\`\`\n\n- \`list.pop(0)\` is slow for big lists (everything shifts); \`deque.popleft()\` is instant.\n- **\`deque(maxlen=3)\`** keeps only the **last 3** items. Adding a 4th pushes the oldest out automatically. Perfect for "recent history".\n- Handy extras: \`rotate(n)\`, \`extend\`, \`len(q)\`, iteration, indexing at the ends.`,
    analogy:`A queue at a bakery, with a window that only shows the last three customers.`,
    example:R`from collections import deque

recent = deque(maxlen=3)
for n in range(1, 6):
    recent.append(n)
print(list(recent))`},
  predict:{code:R`from collections import deque
q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), list(q))`, q:'What prints?', opts:['1 [2, 3, 4]','4 [1, 2, 3]','1 [1, 2, 3, 4]'], ans:0, why:'popleft removes and returns the front item (1).'},
  cast:{code:R`from collections import deque

recent = deque(maxlen=3)
for n in range(1, 6):
    recent.append(n)
print(list(recent))`, task:'Cast it.'},
  bug:{broken:R`recent = []
for n in range(1, 6):
    recent.append(n)
    if len(recent) > 3:
        recent.pop()
print(recent)`, task:'It keeps the OLDEST instead of the newest. Use a deque with maxlen=3. Expected: [3, 4, 5]',
    cases:[{inputs:[],tests:[['Last three','lines==["[3, 4, 5]"]'],['Uses deque','"deque" in src']]}],
    sol:R`from collections import deque
recent = deque(maxlen=3)
for n in range(1, 6):
    recent.append(n)
print(list(recent))`, wrong:[R`recent = []
for n in range(1, 6):
    recent.append(n)
    if len(recent) > 3:
        recent.pop()
print(recent)`]},
  write:{prompt:'A command history. Loop asking `> `. Any ordinary text is remembered (only the **last 3** are kept). `history` prints the remembered commands numbered `1.`, `2.`, `3.` (oldest first). `quit` stops. Use a `deque`.',
    starter:R`from collections import deque

history = deque(maxlen=3)
`,
    inputs:['open door','look','history','quit'],
    cases:[{inputs:['open door','look','take lamp','go north','history','quit'],tests:[['Last three','[l for l in lines if not l.startswith("> ")]==["1. look","2. take lamp","3. go north"]']]},{inputs:['a','history','quit'],tests:[['One entry','[l for l in lines if not l.startswith("> ")]==["1. a"]']]},{inputs:['history','quit'],tests:[['Empty history','[l for l in lines if not l.startswith("> ")]==[]']]},{inputs:['a','b','history','c','d','e','history','quit'],tests:[['Rolling','[l for l in lines if not l.startswith("> ")]==["1. a","2. b","1. c","2. d","3. e"] and "deque(maxlen=3)" in src.replace(" ","")']]}],
    sol:R`from collections import deque

history = deque(maxlen=3)
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command == "history":
        for number, item in enumerate(history, 1):
            print(f"{number}. {item}")
    else:
        history.append(command)`,
    wrong:[R`from collections import deque

history = deque()
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command == "history":
        for number, item in enumerate(history, 1):
            print(f"{number}. {item}")
    else:
        history.append(command)`, R`from collections import deque

history = deque(maxlen=3)
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command == "history":
        for number, item in enumerate(reversed(history), 1):
            print(f"{number}. {item}")
    else:
        history.append(command)`],
    hints:['history = deque(maxlen=3) forgets the oldest item automatically.','quit breaks, history prints numbered items, anything else is appended.','Number with enumerate(history, 1), oldest first.','from collections import deque\n\nhistory = deque(maxlen=3)\nwhile True:\n    command = input("> ")\n    if command == "quit":\n        break\n    elif command == "history":\n        for number, item in enumerate(history, 1):\n            print(f"{number}. {item}")\n    else:\n        history.append(command)']},
  power:{can:['Use a fast queue with deque','Keep only the last N items automatically'],
    expand:'Add an `undo` command that removes the newest entry with pop().',
    where:'Undo stacks, recent-files lists, chat buffers and task queues are deques.',
    next:'Next: lightweight records with namedtuple.'},
  codex:{title:'deque',body:'append / popleft are fast. deque(maxlen=n) keeps only the last n items.',snip:R`recent = deque(maxlen=3)`}
},
{
  id:'r9-11', realm:9, n:11, title:'namedtuple: records with names',
  teaches:['collections-namedtuple'], requires:['collections-deque'],
  story:`"A tuple like ("lamp", 12.5, 3) is hard to read six months later," Master Cog says. "Was 12.5 the price? The weight? Give each slot a **name**."`,
  concept:{
    html:`\`namedtuple\` builds a tiny record type: an immutable tuple whose slots have names.\n\n\`\`\`\nfrom collections import namedtuple\n\nItem = namedtuple("Item", ["name", "price", "qty"])\nlamp = Item("lamp", 12.5, 3)\n\nprint(lamp.name)         # lamp   (readable)\nprint(lamp[1])           # 12.5   (still works as a tuple)\nname, price, qty = lamp  # unpacking works too\nlamp2 = lamp._replace(qty=10)   # a modified copy\nprint(lamp._asdict())    # {'name': 'lamp', 'price': 12.5, 'qty': 3}\n\`\`\`\n\n- Like tuples, they are **immutable**: \`lamp.qty = 5\` is an \`AttributeError\`. Use \`_replace\` to make a changed copy.\n- They use **less memory** than dicts and read better than plain tuples.\n- Later in the course you will meet \`dataclass\`, the modern, more flexible cousin.`,
    analogy:`A tuple with sticky labels on each slot.`,
    example:R`from collections import namedtuple

Item = namedtuple("Item", ["name", "price", "qty"])
lamp = Item("lamp", 12.5, 3)
print(lamp.name, lamp.price * lamp.qty)
print(lamp._replace(qty=10))`},
  predict:{code:R`from collections import namedtuple
P = namedtuple("P", "x y")
p = P(1, 2)
print(p.x + p[1])`, q:'What prints?', opts:['3','2','Error'], ans:0, why:'p.x is 1 and p[1] is 2: both access styles work.'},
  cast:{code:R`from collections import namedtuple

Item = namedtuple("Item", ["name", "price", "qty"])
lamp = Item("lamp", 12.5, 3)
print(lamp.name, lamp.price * lamp.qty)
print(lamp._replace(qty=10))`, task:'Cast it.'},
  bug:{broken:R`from collections import namedtuple
Item = namedtuple("Item", ["name", "qty"])
lamp = Item("lamp", 3)
lamp.qty = 5
print(lamp)`, task:'AttributeError: namedtuples are immutable. Make a changed copy with _replace instead.',
    cases:[{inputs:[],tests:[['Replaced','lines==["Item(name=\'lamp\', qty=5)"]'],['Uses _replace','"_replace" in src']]}],
    sol:R`from collections import namedtuple
Item = namedtuple("Item", ["name", "qty"])
lamp = Item("lamp", 3)
lamp = lamp._replace(qty=5)
print(lamp)`, wrong:[R`from collections import namedtuple
Item = namedtuple("Item", ["name", "qty"])
lamp = Item("lamp", 3)
lamp.qty = 5
print(lamp)`]},
  write:{prompt:'Define `Item = namedtuple("Item", ["name", "price", "qty"])` and the list `items` given. Write `total(items)` (sum of price × qty) and `priciest(items)` (the item with the highest price × qty; the first one wins a tie). Print `Total: <t>` (2 decimals) and `Top: <name> (<value>)` (2 decimals).',
    starter:R`from collections import namedtuple

items = [("lamp", 12.5, 3), ("wick", 0.5, 40), ("oil", 4.0, 10)]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Total: 97.50","Top: oil (40.00)"]'],['Item type','g["Item"]._fields==("name","price","qty")'],['total works','g["total"]([g["Item"]("a",2,3)])==6 and g["total"]([])==0'],['priciest works','g["priciest"]([g["Item"]("a",1,1),g["Item"]("b",5,1)]).name=="b"'],['Tie goes first','g["priciest"]([g["Item"]("a",2,2),g["Item"]("b",4,1)]).name=="a"'],['Uses attribute names','".price" in src and ".qty" in src']]}],
    sol:R`from collections import namedtuple

Item = namedtuple("Item", ["name", "price", "qty"])
items = [Item("lamp", 12.5, 3), Item("wick", 0.5, 40), Item("oil", 4.0, 10)]

def total(items):
    return sum(item.price * item.qty for item in items)

def priciest(items):
    return max(items, key=lambda item: item.price * item.qty)

best = priciest(items)
print(f"Total: {total(items):.2f}")
print(f"Top: {best.name} ({best.price * best.qty:.2f})")`,
    wrong:[R`from collections import namedtuple

Item = namedtuple("Item", ["name", "price", "qty"])
items = [Item("lamp", 12.5, 3), Item("wick", 0.5, 40), Item("oil", 4.0, 10)]

def total(items):
    return sum(item.price for item in items)

def priciest(items):
    return max(items, key=lambda item: item.price * item.qty)

best = priciest(items)
print(f"Total: {total(items):.2f}")
print(f"Top: {best.name} ({best.price * best.qty:.2f})")`, R`from collections import namedtuple

Item = namedtuple("Item", ["name", "price", "qty"])
items = [Item("lamp", 12.5, 3), Item("wick", 0.5, 40), Item("oil", 4.0, 10)]

def total(items):
    return sum(item.price * item.qty for item in items)

def priciest(items):
    return sorted(items, key=lambda item: item.price * item.qty)[-1]

best = priciest(items)
print(f"Total: {total(items):.2f}")
print(f"Top: {best.name} ({best.price * best.qty:.2f})")`],
    hints:['Item = namedtuple("Item", ["name", "price", "qty"]) and wrap each tuple: Item("lamp", 12.5, 3).','total: sum(item.price * item.qty for item in items). priciest: max(items, key=lambda item: item.price * item.qty) (max keeps the first on a tie).','Print with f-strings and :.2f.','from collections import namedtuple\n\nItem = namedtuple("Item", ["name", "price", "qty"])\nitems = [Item("lamp", 12.5, 3), Item("wick", 0.5, 40), Item("oil", 4.0, 10)]\n\ndef total(items):\n    return sum(item.price * item.qty for item in items)\n\ndef priciest(items):\n    return max(items, key=lambda item: item.price * item.qty)\n\nbest = priciest(items)\nprint(f"Total: {total(items):.2f}")\nprint(f"Top: {best.name} ({best.price * best.qty:.2f})")']},
  power:{can:['Build readable record types with namedtuple','Use _replace and _asdict'],
    expand:'Sort the items by value with sorted(items, key=...) and print them.',
    where:'Coordinates, rows from a database and function results often use namedtuples.',
    next:'Next: itertools, a box of loop tools.'},
  codex:{title:'namedtuple',body:'Item = namedtuple("Item", ["name", "price"]). Access by name or index. Immutable: use _replace.',snip:R`lamp = lamp._replace(qty=5)`}
}
);
