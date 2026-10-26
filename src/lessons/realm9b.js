// REALM 9 — THE WORKSHOP — part B (lessons 12-22: itertools, functools, statistics, textwrap, dates and times)
LESSONS.push(
{
  id:'r9-12', realm:9, n:12, title:'itertools: combinations, permutations, product',
  teaches:['itertools-combo'], requires:['collections-namedtuple'],
  story:`Master Cog slides open a hatch to the **Gear Loft**, where brass wheels spin in every arrangement. "Teams of two from five heroes. Locks with four dials. Don't write nested loops by hand. **itertools** makes every arrangement for you."`,
  concept:{
    html:`\`itertools\` builds arrangements lazily (one at a time):\n\n\`\`\`\nfrom itertools import combinations, permutations, product\n\nlist(combinations("ABC", 2))   # [('A','B'), ('A','C'), ('B','C')]  order does NOT matter\nlist(permutations("ABC", 2))   # 6 results: ('A','B') and ('B','A') both count\nlist(product("AB", [1, 2]))    # [('A',1), ('A',2), ('B',1), ('B',2)]  every pairing\n\`\`\`\n\n- **combinations**: pick k, order ignored (a team).\n- **permutations**: pick k, order matters (a podium: gold, silver, bronze).\n- **product**: one from each group (a menu: main × side). \`product(range(10), repeat=4)\` makes every 4-digit lock code.\n- They return iterators. Wrap in \`list(...)\` to see them, or loop over them.\n\nThe counts explode quickly, so never \`list()\` a huge one.`,
    analogy:`Combinations: choosing a team. Permutations: ranking a race. Product: ordering a meal from a menu.`,
    example:R`from itertools import combinations

for pair in combinations(["Ada", "Bo", "Cy"], 2):
    print(pair)`},
  predict:{code:R`from itertools import permutations
print(len(list(permutations("abc", 2))))`, q:'How many results?', opts:['6','3','9'], ans:0, why:'3 choices for the first slot × 2 for the second = 6.'},
  cast:{code:R`from itertools import combinations

for pair in combinations(["Ada", "Bo", "Cy"], 2):
    print(pair)`, task:'Cast it. Then change combinations to permutations.'},
  bug:{broken:R`from itertools import permutations
people = ["A", "B", "C", "D"]
handshakes = list(permutations(people, 2))
print(len(handshakes))`, task:'Each pair shakes hands once, but A-B and B-A are counted twice. Expected: 6',
    cases:[{inputs:[],tests:[['Six','lines==["6"]']]}],
    sol:R`from itertools import combinations
people = ["A", "B", "C", "D"]
handshakes = list(combinations(people, 2))
print(len(handshakes))`, wrong:[R`from itertools import permutations
people = ["A", "B", "C", "D"]
handshakes = list(permutations(people, 2))
print(len(handshakes))`]},
  write:{prompt:'Ask `Toppings: ` (space-separated) and `Pick: ` (a whole number). Print every combination of that many toppings on its own line joined with `+` (in the order itertools gives them), then `Total: <count>`. If `Pick` is below 1 print `Pick at least 1` instead.',
    starter:R`from itertools import combinations

toppings = input("Toppings: ").split()
pick = int(input("Pick: "))
`,
    inputs:['ham egg corn','2'],
    cases:[{inputs:['ham egg corn','2'],tests:[['Pairs','lines[-4:]==["ham+egg","ham+corn","egg+corn","Total: 3"]']]},{inputs:['a b c d','3'],tests:[['Triples','lines[-5:]==["a+b+c","a+b+d","a+c+d","b+c+d","Total: 4"]']]},{inputs:['a b','5'],tests:[['Too many','lines[-1]=="Total: 0"']]},{inputs:['a b','0'],tests:[['Zero','lines[-1]=="Pick at least 1"']]},{inputs:['x','1'],tests:[['Single','lines[-2:]==["x","Total: 1"]'],['Uses combinations','"combinations(" in src']]}],
    sol:R`from itertools import combinations

toppings = input("Toppings: ").split()
pick = int(input("Pick: "))
if pick < 1:
    print("Pick at least 1")
else:
    count = 0
    for combo in combinations(toppings, pick):
        print("+".join(combo))
        count += 1
    print("Total:", count)`,
    wrong:[R`from itertools import permutations

toppings = input("Toppings: ").split()
pick = int(input("Pick: "))
if pick < 1:
    print("Pick at least 1")
else:
    count = 0
    for combo in permutations(toppings, pick):
        print("+".join(combo))
        count += 1
    print("Total:", count)`, R`from itertools import combinations

toppings = input("Toppings: ").split()
pick = int(input("Pick: "))
count = 0
for combo in combinations(toppings, pick):
    print("+".join(combo))
    count += 1
print("Total:", count)`],
    hints:['for combo in combinations(toppings, pick): each combo is a tuple of words.','"+".join(combo) builds the line. Count how many you printed.','Check pick < 1 first and print Pick at least 1.','from itertools import combinations\n\ntoppings = input("Toppings: ").split()\npick = int(input("Pick: "))\nif pick < 1:\n    print("Pick at least 1")\nelse:\n    count = 0\n    for combo in combinations(toppings, pick):\n        print("+".join(combo))\n        count += 1\n    print("Total:", count)']},
  power:{can:['Generate teams, rankings and menu pairings','Choose between combinations, permutations and product'],
    expand:'Use product(range(10), repeat=3) to count all 3-digit lock codes.',
    where:'Test-case generators, puzzle solvers and scheduling tools use these daily.',
    next:'Next: chaining, slicing and accumulating streams.'},
  codex:{title:'itertools arrangements',body:'combinations: order ignored. permutations: order matters. product: one from each group. All lazy.',snip:R`list(combinations("ABC", 2))`}
},
{
  id:'r9-13', realm:9, n:13, title:'chain, islice and accumulate',
  teaches:['itertools-chain'], requires:['itertools-combo'],
  story:`"Sometimes you don't want arrangements. You want to **join** belts, **take the first few** items off an endless belt, or keep a **running total**," Master Cog says, pointing at three conveyor belts.`,
  concept:{
    html:`\`\`\`\nfrom itertools import chain, islice, accumulate\n\nlist(chain([1, 2], [3], (4, 5)))      # [1, 2, 3, 4, 5]  join several iterables\nlist(islice(range(100), 3))           # [0, 1, 2]        first 3 only\nlist(islice("abcdef", 1, 4))          # ['b', 'c', 'd']  like [1:4] on anything\nlist(accumulate([1, 2, 3, 4]))        # [1, 3, 6, 10]    running totals\n\`\`\`\n\n- \`chain\` joins without building a big combined list first.\n- \`islice\` slices things that can't be sliced with \`[ ]\`: generators, files, endless streams. Normal slicing on a generator is a \`TypeError\`.\n- \`accumulate(items, max)\` can use another function: here a running maximum.`,
    analogy:`chain: bolting belts end to end. islice: grabbing the first few boxes. accumulate: a running tally on a whiteboard.`,
    example:R`from itertools import chain, islice, accumulate

print(list(chain([1, 2], [3])))
print(list(islice(range(100), 3)))
print(list(accumulate([1, 2, 3, 4])))`},
  predict:{code:R`from itertools import accumulate
print(list(accumulate([5, 1, 2], max)))`, q:'What prints?', opts:['[5, 5, 5]','[5, 6, 8]','[5, 1, 2]'], ans:0, why:'A running maximum never goes down: 5, max(5,1)=5, max(5,2)=5.'},
  cast:{code:R`from itertools import chain, islice, accumulate

print(list(chain([1, 2], [3])))
print(list(islice(range(100), 3)))
print(list(accumulate([1, 2, 3, 4])))`, task:'Cast it.'},
  bug:{broken:R`squares = (n * n for n in range(1, 100))
print(squares[:3])`, task:'TypeError: generators can\'t be sliced with [ ]. Use islice and make a list. Expected: [1, 4, 9]',
    cases:[{inputs:[],tests:[['Slice','lines==["[1, 4, 9]"]']]}],
    sol:R`from itertools import islice
squares = (n * n for n in range(1, 100))
print(list(islice(squares, 3)))`, wrong:[R`squares = (n * n for n in range(1, 100))
print(squares[:3])`]},
  write:{prompt:'Ask `Numbers: ` (space-separated whole numbers, at least one). Print `Running: <running totals>`, `First 3: <the first three running totals>` and `Chain: <the numbers followed by the same numbers reversed>`. All joined with spaces. Use `accumulate`, `islice` and `chain`.',
    starter:R`from itertools import accumulate, islice, chain

numbers = [int(n) for n in input("Numbers: ").split()]
`,
    inputs:['1 2 3 4'],
    cases:[{inputs:['1 2 3 4'],tests:[['Basic','lines[-3:]==["Running: 1 3 6 10","First 3: 1 3 6","Chain: 1 2 3 4 4 3 2 1"]']]},{inputs:['5'],tests:[['One','lines[-3:]==["Running: 5","First 3: 5","Chain: 5 5"]']]},{inputs:['2 -2 7'],tests:[['Negative','lines[-3:]==["Running: 2 0 7","First 3: 2 0 7","Chain: 2 -2 7 7 -2 2"]']]},{inputs:['1 1 1 1 1'],tests:[['Long','lines[-3:]==["Running: 1 2 3 4 5","First 3: 1 2 3","Chain: 1 1 1 1 1 1 1 1 1 1"]'],['Uses all three','"accumulate(" in src and "islice(" in src and "chain(" in src']]}],
    sol:R`from itertools import accumulate, islice, chain

numbers = [int(n) for n in input("Numbers: ").split()]
running = list(accumulate(numbers))
first = list(islice(running, 3))
both = list(chain(numbers, reversed(numbers)))
print("Running:", *running)
print("First 3:", *first)
print("Chain:", *both)`,
    wrong:[R`from itertools import accumulate, islice, chain

numbers = [int(n) for n in input("Numbers: ").split()]
running = list(accumulate(numbers))
first = list(islice(numbers, 3))
both = list(chain(numbers, reversed(numbers)))
print("Running:", *running)
print("First 3:", *first)
print("Chain:", *both)`, R`from itertools import accumulate, islice, chain

numbers = [int(n) for n in input("Numbers: ").split()]
running = list(accumulate(numbers))
first = list(islice(running, 3))
both = list(chain(numbers, numbers))
print("Running:", *running)
print("First 3:", *first)
print("Chain:", *both)`],
    hints:['running = list(accumulate(numbers)).','First 3 comes from islice(running, 3). Chain joins numbers with reversed(numbers).','print("Running:", *running) spreads a list into space-separated values.','from itertools import accumulate, islice, chain\n\nnumbers = [int(n) for n in input("Numbers: ").split()]\nrunning = list(accumulate(numbers))\nfirst = list(islice(running, 3))\nboth = list(chain(numbers, reversed(numbers)))\nprint("Running:", *running)\nprint("First 3:", *first)\nprint("Chain:", *both)']},
  power:{can:['Join, slice and total streams of data','Slice a generator safely'],
    expand:'Use accumulate(numbers, max) to print a running record-high.',
    where:'Running balances, log-file previews and endless generators lean on these.',
    next:'Next: groupby, for runs of equal items.'},
  codex:{title:'chain / islice / accumulate',body:'chain joins iterables. islice slices anything. accumulate gives running totals (or any running function).',snip:R`list(islice(gen, 3))`}
},
{
  id:'r9-14', realm:9, n:14, title:'groupby: runs of equal things',
  teaches:['itertools-groupby'], requires:['itertools-chain'],
  story:`"Compressing a message," Master Cog muses, tapping a punch-card. "**aaabcc** can become **a3b1c2**. You need to spot each *run* of equal letters. That's what **groupby** does."`,
  concept:{
    html:`\`groupby\` splits an iterable into **consecutive** runs that share a key:\n\n\`\`\`\nfrom itertools import groupby\n\nfor key, run in groupby("aaabcc"):\n    print(key, len(list(run)))\n# a 3\n# b 1\n# c 2\n\`\`\`\n\n- Each \`run\` is itself a lazy iterator. Use it **before** moving on (wrap in \`list(...)\` to keep it).\n- ⚠️ **groupby only joins neighbours.** \`"aabaa"\` gives *four* groups (aa, b, aa), not two. To group everything that matches, **sort by the same key first**.\n- Pass a key function: \`groupby(words, key=len)\` groups consecutive words of equal length.`,
    analogy:`Walking along a queue and calling out each time the shirt colour changes.`,
    example:R`from itertools import groupby

for key, run in groupby("aaabcc"):
    print(key, len(list(run)))`},
  predict:{code:R`from itertools import groupby
print([k for k, _ in groupby("aabba")])`, q:'What prints?', opts:["['a', 'b', 'a']","['a', 'b']","['a', 'a', 'b', 'b', 'a']"], ans:0, why:'Only neighbours join: aa, bb, then a again.'},
  cast:{code:R`from itertools import groupby

for key, run in groupby("aaabcc"):
    print(key, len(list(run)))`, task:'Cast it.'},
  bug:{broken:R`from itertools import groupby
words = ["apple", "bob", "avocado"]
groups = [(k, len(list(g))) for k, g in groupby(words, key=lambda w: w[0])]
print(groups)`, task:'a-words are split because they aren\'t neighbours. Sort by the same key first. Expected: [(\'a\', 2), (\'b\', 1)]',
    cases:[{inputs:[],tests:[['Merged','lines==["[(\'a\', 2), (\'b\', 1)]"]']]}],
    sol:R`from itertools import groupby
words = ["apple", "bob", "avocado"]
key = lambda w: w[0]
groups = [(k, len(list(g))) for k, g in groupby(sorted(words, key=key), key=key)]
print(groups)`, wrong:[R`from itertools import groupby
words = ["apple", "bob", "avocado"]
groups = [(k, len(list(g))) for k, g in groupby(words, key=lambda w: w[0])]
print(groups)`]},
  write:{prompt:'Run-length encode text. Ask `Text: ` and print the encoded text where each run of equal characters becomes the character followed by its length (`aaabcc` → `a3b1c2`). Print `(empty)` for empty input. Use `groupby`.',
    starter:R`from itertools import groupby

text = input("Text: ")
`,
    inputs:['aaabcc'],
    cases:[{inputs:['aaabcc'],tests:[['Basic','lines[-1]=="a3b1c2"']]},{inputs:['aabaa'],tests:[['Neighbours only','lines[-1]=="a2b1a2"']]},{inputs:['x'],tests:[['Single','lines[-1]=="x1"']]},{inputs:[''],tests:[['Empty','lines[-1]=="(empty)"']]},{inputs:['wwwwwwwwwwww'],tests:[['Two-digit run','lines[-1]=="w12"'],['Uses groupby','"groupby(" in src']]}],
    sol:R`from itertools import groupby

text = input("Text: ")
if not text:
    print("(empty)")
else:
    out = ""
    for char, run in groupby(text):
        out += char + str(len(list(run)))
    print(out)`,
    wrong:[R`from collections import Counter

text = input("Text: ")
if not text:
    print("(empty)")
else:
    counts = Counter(text)
    print("".join(c + str(n) for c, n in counts.items()))`, R`from itertools import groupby

text = input("Text: ")
if not text:
    print("(empty)")
else:
    out = ""
    for char, run in groupby(sorted(text)):
        out += char + str(len(list(run)))
    print(out)`],
    hints:['for char, run in groupby(text): char is the letter, run is its run.','len(list(run)) is how long the run is. Build a string char + str(length).','Handle empty text first.','from itertools import groupby\n\ntext = input("Text: ")\nif not text:\n    print("(empty)")\nelse:\n    out = ""\n    for char, run in groupby(text):\n        out += char + str(len(list(run)))\n    print(out)']},
  power:{can:['Split data into runs with groupby','Remember to sort before grouping non-neighbours'],
    expand:'Write the decoder: turn a3b1c2 back into aaabcc.',
    where:'Run-length encoding, log chunking and report sections all use groupby.',
    next:'Next: functools: reduce and partial.'},
  codex:{title:'groupby',body:'groupby(items, key) groups CONSECUTIVE equal keys. Sort by the same key first to group everything.',snip:R`for key, run in groupby(sorted(x, key=f), key=f):`}
},
{
  id:'r9-15', realm:9, n:15, title:'functools: reduce and partial',
  teaches:['functools-reduce'], requires:['itertools-groupby'],
  story:`Master Cog hangs a half-finished gadget on the wall. "**reduce** squashes a whole list into one result. **partial** pre-fills part of a tool so it becomes a new, simpler one."`,
  concept:{
    html:`\`\`\`\nfrom functools import reduce, partial\n\nreduce(lambda a, b: a * b, [1, 2, 3, 4])      # 24: ((1*2)*3)*4\nreduce(lambda a, b: a + b, [], 0)             # 0: the 3rd argument is the START value\n\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)   # power with exp already filled in\nsquare(5)                         # 25\n\`\`\`\n\n- **reduce(func, items, start)**: carries a running result through the list. With **no start** value an empty list raises \`TypeError\`. Give a start value when the list could be empty.\n- For sums use \`sum\`; for products use \`math.prod\`. Learn reduce for custom combining.\n- **partial** fixes some arguments in advance. Name them (\`exp=2\`) so it's clear which ones.`,
    analogy:`reduce: folding a long ribbon into one small parcel. partial: a pre-set dial on a machine.`,
    example:R`from functools import reduce, partial

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(5))`},
  predict:{code:R`from functools import reduce
print(reduce(lambda a, b: a - b, [10, 3, 2]))`, q:'What prints?', opts:['5','9','-5'], ans:0, why:'(10 - 3) - 2 = 5.'},
  cast:{code:R`from functools import reduce, partial

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
print(square(5))`, task:'Cast it.'},
  bug:{broken:R`from functools import reduce
nums = []
print(reduce(lambda a, b: a * b, nums))`, task:'TypeError: reduce of an empty list needs a start value. Give it one so the product of nothing is 1. Expected: 1',
    cases:[{inputs:[],tests:[['One','lines==["1"]']]}],
    sol:R`from functools import reduce
nums = []
print(reduce(lambda a, b: a * b, nums, 1))`, wrong:[R`from functools import reduce
nums = []
print(reduce(lambda a, b: a * b, nums))`]},
  write:{prompt:'Write `power(base, exp)`, then use `partial` to make `square` and `cube`. Write `product(nums)` using `reduce` (the product of an empty list is `1`). Print `product([1, 2, 3, 4])`, `square(5)` and `cube(2)` on separate lines.',
    starter:R`from functools import reduce, partial
`,
    cases:[{inputs:[],tests:[['Printed','lines==["24","25","8"]'],['product edge','g["product"]([])==1 and g["product"]([5])==5 and g["product"]([2,-3])==-6'],['square/cube','g["square"](-3)==9 and g["cube"](-2)==-8'],['Uses reduce and partial','"reduce(" in src and "partial(" in src']]}],
    sol:R`from functools import reduce, partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
cube = partial(power, exp=3)

def product(nums):
    return reduce(lambda a, b: a * b, nums, 1)

print(product([1, 2, 3, 4]))
print(square(5))
print(cube(2))`,
    wrong:[R`from functools import reduce, partial

def power(base, exp):
    return base ** exp

square = partial(power, 2)
cube = partial(power, 3)

def product(nums):
    return reduce(lambda a, b: a * b, nums, 1)

print(product([1, 2, 3, 4]))
print(square(5))
print(cube(2))`, R`from functools import reduce, partial

def power(base, exp):
    return base ** exp

square = partial(power, exp=2)
cube = partial(power, exp=3)

def product(nums):
    return reduce(lambda a, b: a * b, nums)

print(product([1, 2, 3, 4]))
print(square(5))
print(cube(2))`],
    hints:['square = partial(power, exp=2) fills in the exponent.','product: reduce(lambda a, b: a * b, nums, 1). The 1 handles empty lists.','Print product([1, 2, 3, 4]), square(5), cube(2).','from functools import reduce, partial\n\ndef power(base, exp):\n    return base ** exp\n\nsquare = partial(power, exp=2)\ncube = partial(power, exp=3)\n\ndef product(nums):\n    return reduce(lambda a, b: a * b, nums, 1)\n\nprint(product([1, 2, 3, 4]))\nprint(square(5))\nprint(cube(2))']},
  power:{can:['Fold a list into one value with reduce','Pre-fill arguments with partial'],
    expand:'Make a `double` with partial(multiply, 2) and map it over a list.',
    where:'Callbacks, GUI buttons and data pipelines use partial to bind settings.',
    next:'Next: lru_cache, a free speed boost.'},
  codex:{title:'functools',body:'reduce(f, items, start) folds a list. partial(f, name=value) pre-fills arguments.',snip:R`square = partial(power, exp=2)`}
},
{
  id:'r9-16', realm:9, n:16, title:'lru_cache: remember the answers',
  teaches:['functools-lru'], requires:['functools-reduce'],
  story:`The Workshop's clock tower asks the same question forty times a second: *"what is the 80th Fibonacci number?"* Master Cog sighs. "Why compute it again? **Write the answer on a card and keep it.**"`,
  concept:{
    html:`\`@lru_cache\` makes a function **remember** results for arguments it has seen:\n\n\`\`\`\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(80))     # instant! (without the cache this would take years)\n\`\`\`\n\n- Plain recursive Fibonacci recomputes the same values again and again: **exponential** time. With the cache each value is computed **once**.\n- \`fib.cache_info()\` shows hits and misses. \`fib.cache_clear()\` forgets everything.\n- ⚠️ Arguments must be **hashable**: ints, strings and tuples yes; lists and dicts **no** (\`TypeError\`). Pass a tuple instead.\n- Only cache **pure** functions: same input must always give the same output (not \`random\`, not "the current time").`,
    analogy:`Writing every answer on a card and checking the card box before doing any sums.`,
    example:R`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))`},
  predict:{code:R`from functools import lru_cache

@lru_cache(maxsize=None)
def sq(n):
    return n * n

sq(2); sq(2); sq(3)
print(sq.cache_info().hits)`, q:'What prints?', opts:['1','2','3'], ans:0, why:'Only the second sq(2) was found in the cache: one hit.'},
  cast:{code:R`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(80))`, task:'Cast it. Remove the @lru_cache line and try fib(35) to feel the difference.'},
  bug:{broken:R`from functools import lru_cache

@lru_cache(maxsize=None)
def total(nums):
    return sum(nums)

print(total([1, 2, 3]))`, task:'TypeError: unhashable list. Pass a tuple to the cached function. Expected: 6',
    cases:[{inputs:[],tests:[['Six','lines==["6"]']]}],
    sol:R`from functools import lru_cache

@lru_cache(maxsize=None)
def total(nums):
    return sum(nums)

print(total((1, 2, 3)))`, wrong:[R`from functools import lru_cache

@lru_cache(maxsize=None)
def total(nums):
    return sum(nums)

print(total([1, 2, 3]))`]},
  write:{prompt:'Write a cached recursive `fib(n)` (`fib(0)` is 0, `fib(1)` is 1). Print `fib(10)` and `fib(80)` on separate lines.',
    starter:R`from functools import lru_cache

# decorate and define fib
`,
    cases:[{inputs:[],tests:[['Printed','lines==["55","23416728348467685"]'],['Base cases','g["fib"](0)==0 and g["fib"](1)==1 and g["fib"](2)==1'],['Big','g["fib"](90)==2880067194370816120'],['Cache is on','hasattr(g["fib"],"cache_info")']]}],
    sol:R`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
print(fib(80))`,
    wrong:[R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(10))
print(fib(80))`, R`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return 0
    return fib(n - 1) + fib(n - 2)

print(fib(10))
print(fib(80))`],
    hints:['Put @lru_cache(maxsize=None) on the line above def fib(n):.','Base case: if n < 2, return n. Otherwise add the two previous values.','Print fib(10) then fib(80).','from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(10))\nprint(fib(80))']},
  power:{can:['Memoize pure functions with @lru_cache','Know why arguments must be hashable'],
    expand:'Call fib(30) and print fib.cache_info() to see hits and misses.',
    where:'Caching slow lookups (parsing, math, path counting) is a classic interview and real-world trick.',
    next:'Next: the statistics module.'},
  codex:{title:'lru_cache',body:'@lru_cache(maxsize=None) remembers results. Arguments must be hashable. Only for pure functions.',snip:R`@lru_cache(maxsize=None)`}
},
{
  id:'r9-17', realm:9, n:17, title:'statistics: mean, median, mode, stdev',
  teaches:['statistics-mod'], requires:['functools-lru'],
  story:`A pile of numbers lands on the bench, scores from the Workshop's apprentice tests. "Averages hide things," Master Cog says. "Median, mode and **spread** tell the rest of the story."`,
  concept:{
    html:`\`\`\`\nimport statistics\n\ndata = [2, 4, 4, 4, 5, 5, 7, 9]\nstatistics.mean(data)      # 5     the average\nstatistics.median(data)    # 4.5   the middle value\nstatistics.mode(data)      # 4     the most common\nstatistics.stdev(data)     # 2.138  spread (sample)\nstatistics.pstdev(data)    # 2.0    spread (whole population)\n\`\`\`\n\n- **stdev** treats your data as a *sample* (divides by n−1). **pstdev** treats it as the *whole population* (divides by n). Use \`stdev\` unless you really have everything.\n- \`stdev\` needs **at least 2** values; \`mean\`/\`median\` need at least 1. Empty data raises \`StatisticsError\`.\n- \`mean\` of ints can come back as an int or float; format with \`:.2f\` for tidy output.\n- Data from \`input()\` arrives as strings: **convert to numbers first**.`,
    analogy:`Mean: the balance point. Median: the middle person in a line. Mode: the most popular choice. Stdev: how scattered the crowd is.`,
    example:R`import statistics

data = [2, 4, 4, 4, 5, 5, 7, 9]
print(statistics.mean(data), statistics.median(data), statistics.mode(data))
print(round(statistics.stdev(data), 2))`},
  predict:{code:R`import statistics
print(statistics.median([1, 3, 2, 10]))`, q:'What prints?', opts:['2.5','3','2'], ans:0, why:'Sorted: 1 2 3 10. With an even count, the median is the average of the middle two (2 and 3).'},
  cast:{code:R`import statistics

data = [2, 4, 4, 4, 5, 5, 7, 9]
print(statistics.mean(data), statistics.median(data), statistics.mode(data))
print(round(statistics.stdev(data), 2))`, task:'Cast it.'},
  bug:{broken:R`import statistics
data = ["3", "5"]
print(statistics.mean(data))`, task:'TypeError: these are strings, not numbers. Convert them first. Expected: 4',
    cases:[{inputs:[],tests:[['Four','lines==["4"]']]}],
    sol:R`import statistics
data = ["3", "5"]
print(statistics.mean([int(x) for x in data]))`, wrong:[R`import statistics
data = ["3", "5"]
print(statistics.mean(data))`]},
  write:{prompt:'Ask `Scores: ` (space-separated numbers). Print `Mean`, `Median`, `Mode` and `Stdev` (sample), each with 2 decimals, e.g. `Mean: 5.00`. With only one score, `Stdev: n/a`. For empty input print `No numbers`.',
    starter:R`import statistics

scores = [float(s) for s in input("Scores: ").split()]
`,
    inputs:['2 4 4 4 5 5 7 9'],
    cases:[{inputs:['2 4 4 4 5 5 7 9'],tests:[['Classic','lines[-4:]==["Mean: 5.00","Median: 4.50","Mode: 4.00","Stdev: 2.14"]']]},{inputs:['5'],tests:[['One score','lines[-4:]==["Mean: 5.00","Median: 5.00","Mode: 5.00","Stdev: n/a"]']]},{inputs:['1 2 3 4'],tests:[['No repeat mode is first','lines[-4:]==["Mean: 2.50","Median: 2.50","Mode: 1.00","Stdev: 1.29"]']]},{inputs:[''],tests:[['Empty','lines[-1]=="No numbers"']]},{inputs:['10 10'],tests:[['Same values','lines[-1]=="Stdev: 0.00"'],['Uses statistics','"statistics." in src']]}],
    sol:R`import statistics

scores = [float(s) for s in input("Scores: ").split()]
if not scores:
    print("No numbers")
else:
    print(f"Mean: {statistics.mean(scores):.2f}")
    print(f"Median: {statistics.median(scores):.2f}")
    print(f"Mode: {statistics.mode(scores):.2f}")
    if len(scores) < 2:
        print("Stdev: n/a")
    else:
        print(f"Stdev: {statistics.stdev(scores):.2f}")`,
    wrong:[R`import statistics

scores = [float(s) for s in input("Scores: ").split()]
if not scores:
    print("No numbers")
else:
    print(f"Mean: {statistics.mean(scores):.2f}")
    print(f"Median: {statistics.median(scores):.2f}")
    print(f"Mode: {statistics.mode(scores):.2f}")
    if len(scores) < 2:
        print("Stdev: n/a")
    else:
        print(f"Stdev: {statistics.pstdev(scores):.2f}")`, R`import statistics

scores = [float(s) for s in input("Scores: ").split()]
if not scores:
    print("No numbers")
else:
    print(f"Mean: {statistics.mean(scores):.2f}")
    print(f"Median: {statistics.median(scores):.2f}")
    print(f"Mode: {max(set(scores)):.2f}")
    if len(scores) < 2:
        print("Stdev: n/a")
    else:
        print(f"Stdev: {statistics.stdev(scores):.2f}")`],
    hints:['Check for empty first, then statistics.mean / median / mode.','stdev needs 2+ values: print n/a when there is only one.','Format every number with :.2f.','import statistics\n\nscores = [float(s) for s in input("Scores: ").split()]\nif not scores:\n    print("No numbers")\nelse:\n    print(f"Mean: {statistics.mean(scores):.2f}")\n    print(f"Median: {statistics.median(scores):.2f}")\n    print(f"Mode: {statistics.mode(scores):.2f}")\n    if len(scores) < 2:\n        print("Stdev: n/a")\n    else:\n        print(f"Stdev: {statistics.stdev(scores):.2f}")']},
  power:{can:['Summarise data with mean, median, mode and stdev','Guard against empty or tiny data sets'],
    expand:'Flag any score more than 2 standard deviations from the mean.',
    where:'Reports, dashboards and quality checks all start with these numbers.',
    next:'Next: textwrap, tidy long text.'},
  codex:{title:'statistics',body:'mean, median, mode, stdev (sample), pstdev (population). stdev needs 2+ values. Empty data raises StatisticsError.',snip:R`statistics.stdev(data)`}
},
{
  id:'r9-18', realm:9, n:18, title:'textwrap and the string module',
  teaches:['textwrap-mod'], requires:['statistics-mod'],
  story:`The Workshop prints its manuals on narrow brass tape. "Long sentences spill off the edge," Master Cog says. "**textwrap** folds them at word boundaries so nothing gets chopped in half."`,
  concept:{
    html:`\`\`\`\nimport textwrap\n\ntext = "the quick brown fox jumps over the lazy dog"\ntextwrap.wrap(text, width=20)     # a LIST of lines\ntextwrap.fill(text, width=20)     # ONE string with newlines in it\ntextwrap.shorten(text, width=20, placeholder="...")   # 'the quick brown...'\ntextwrap.dedent(block)            # removes common leading spaces\n\`\`\`\n\n- Breaks happen **between words**, never inside them. Slicing with \`text[:20]\` chops words in half.\n- \`wrap\` returns a list, so \`print(wrap(...))\` shows brackets and quotes. Use \`fill\`, or \`"\\n".join(wrap(...))\`.\n- \`shorten\` collapses spaces and cuts at a word, adding your placeholder.\n\nThe \`string\` module has handy constants too: \`string.ascii_lowercase\`, \`string.ascii_uppercase\`, \`string.digits\`, \`string.punctuation\`.`,
    analogy:`A typesetter who only breaks lines between words.`,
    example:R`import textwrap

text = "the quick brown fox jumps over the lazy dog"
print(textwrap.fill(text, width=20))
print(textwrap.shorten(text, width=20, placeholder="..."))`},
  predict:{code:R`import textwrap
print(len(textwrap.wrap("aaa bbb ccc", width=7)))`, q:'How many lines?', opts:['2','3','1'], ans:0, why:'"aaa bbb" is exactly 7 characters; "ccc" goes on the next line.'},
  cast:{code:R`import textwrap

text = "the quick brown fox jumps over the lazy dog"
print(textwrap.fill(text, width=20))
print(textwrap.shorten(text, width=20, placeholder="..."))`, task:'Cast it. Try width=10.'},
  bug:{broken:R`import textwrap
text = "one two three four"
print(textwrap.wrap(text, 10))`, task:'It prints a list with brackets. Print the wrapped lines as plain text, one per line. Expected: one two / three four',
    cases:[{inputs:[],tests:[['Plain lines','lines==["one two","three four"]']]}],
    sol:R`import textwrap
text = "one two three four"
print(textwrap.fill(text, 10))`, wrong:[R`import textwrap
text = "one two three four"
print(textwrap.wrap(text, 10))`]},
  write:{prompt:'Ask `Text: `. Print the text wrapped to width 20 (one line per row), then `Short: <text shortened to width 20 with the placeholder "...">`.',
    starter:R`import textwrap

text = input("Text: ")
`,
    inputs:['the quick brown fox jumps over the lazy dog'],
    cases:[{inputs:['the quick brown fox jumps over the lazy dog'],tests:[['Wrapped and short','lines[-4:]==["the quick brown fox","jumps over the lazy","dog","Short: the quick brown..."]']]},{inputs:['hi there'],tests:[['Short text','lines[-2:]==["hi there","Short: hi there"]']]},{inputs:['supercalifragilistic expialidocious'],tests:[['Long words','lines[-1].startswith("Short: ") and len(lines[-1])<=27']]},{inputs:['a b c d e f g h i j k l m n o p'],tests:[['Many words','lines[-3]=="a b c d e f g h i j" and lines[-2]=="k l m n o p" and lines[-1].startswith("Short: a b c d e f")'],['Uses textwrap','"textwrap." in src']]}],
    sol:R`import textwrap

text = input("Text: ")
print(textwrap.fill(text, width=20))
print("Short: " + textwrap.shorten(text, width=20, placeholder="..."))`,
    wrong:[R`import textwrap

text = input("Text: ")
print(textwrap.fill(text, width=20))
print("Short: " + text[:20] + "...")`, R`import textwrap

text = input("Text: ")
print(textwrap.wrap(text, width=20))
print("Short: " + textwrap.shorten(text, width=20, placeholder="..."))`],
    hints:['textwrap.fill(text, width=20) gives the wrapped block as a string.','textwrap.shorten(text, width=20, placeholder="...") cuts at a word.','Remember the "Short: " prefix.','import textwrap\n\ntext = input("Text: ")\nprint(textwrap.fill(text, width=20))\nprint("Short: " + textwrap.shorten(text, width=20, placeholder="..."))']},
  power:{can:['Wrap and shorten text at word boundaries','Use the string constants'],
    expand:'Add `initial_indent="> "` to fill to make a quoted block.',
    where:'CLI help, emails, reports and chatbots all need tidy text.',
    next:'Next: dates and times: date objects.'},
  codex:{title:'textwrap',body:'wrap -> list, fill -> string, shorten -> one trimmed line. Breaks only between words.',snip:R`textwrap.fill(text, width=20)`}
},
{
  id:'r9-19', realm:9, n:19, title:'datetime.date: real calendar days',
  teaches:['date-basic'], requires:['textwrap-mod'],
  story:`The Workshop's great calendar wheel clicks past a hundred festival days. "Dates look simple," Master Cog warns, "until February 29th. **Never do date maths by hand.** Let Python's calendar do it."`,
  concept:{
    html:`\`\`\`\nfrom datetime import date\n\nd = date(2026, 10, 23)      # year, month, day\nd.year, d.month, d.day      # 2026 10 23\nd.weekday()                 # 4   (Monday is 0, Sunday is 6)\nd.isoformat()               # '2026-10-23'\ndate.fromisoformat("2024-02-29")   # parse 'YYYY-MM-DD'\ndate(2026, 10, 23) < date(2026, 12, 1)   # True: dates compare\n\`\`\`\n\n- Invalid dates raise \`ValueError\`: \`date(2026, 2, 30)\` and \`date.fromisoformat("banana")\` both do. Wrap user input in \`try / except ValueError\`.\n- \`date.today()\` is the current day, but it changes daily. For **repeatable code and tests**, pass in a fixed date instead.\n- Leap years: \`import calendar; calendar.isleap(2024)\`. Never use \`year % 4 == 0\` alone (1900 was not a leap year, 2000 was).`,
    analogy:`A strict calendar clerk who refuses to write down the 30th of February.`,
    example:R`from datetime import date

d = date(2026, 10, 23)
print(d.year, d.month, d.day)
print(d.weekday(), d.isoformat())`},
  predict:{code:R`from datetime import date
print(date(2024, 2, 29).weekday())`, q:'What prints? (Monday is 0)', opts:['3','2','4'], ans:0, why:'29 February 2024 was a Thursday, and Thursday is 3.'},
  cast:{code:R`from datetime import date

d = date(2026, 10, 23)
print(d.year, d.month, d.day)
print(d.weekday(), d.isoformat())`, task:'Cast it.'},
  bug:{broken:R`from datetime import date
d = date(2026, 23, 10)
print(d)`, task:'ValueError: the arguments go year, month, day. Fix the order. Expected: 2026-10-23',
    cases:[{inputs:[],tests:[['Right date','lines==["2026-10-23"]']]}],
    sol:R`from datetime import date
d = date(2026, 10, 23)
print(d)`, wrong:[R`from datetime import date
d = date(2026, 23, 10)
print(d)`]},
  write:{prompt:'Ask `Date (YYYY-MM-DD): `. If it is not a real date print `Invalid date`. Otherwise print `Year: <y>`, `Weekday: <full name, e.g. Friday>` and `Leap year: yes` or `no`. Use `date.fromisoformat` and `calendar.isleap`.',
    starter:R`from datetime import date
import calendar

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
text = input("Date (YYYY-MM-DD): ")
`,
    inputs:['2026-10-23'],
    cases:[{inputs:['2026-10-23'],tests:[['Friday','lines[-3:]==["Year: 2026","Weekday: Friday","Leap year: no"]']]},{inputs:['2024-02-29'],tests:[['Leap day','lines[-3:]==["Year: 2024","Weekday: Thursday","Leap year: yes"]']]},{inputs:['2000-01-01'],tests:[['Y2K','lines[-3:]==["Year: 2000","Weekday: Saturday","Leap year: yes"]']]},{inputs:['1900-03-01'],tests:[['1900 not leap','lines[-3:]==["Year: 1900","Weekday: Thursday","Leap year: no"]']]},{inputs:['2026-02-30'],tests:[['Bad day','lines[-1]=="Invalid date"']]},{inputs:['banana'],tests:[['Not a date','lines[-1]=="Invalid date"'],['Uses calendar','"isleap" in src']]}],
    sol:R`from datetime import date
import calendar

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
text = input("Date (YYYY-MM-DD): ")
try:
    d = date.fromisoformat(text)
except ValueError:
    print("Invalid date")
else:
    print("Year:", d.year)
    print("Weekday:", DAYS[d.weekday()])
    print("Leap year:", "yes" if calendar.isleap(d.year) else "no")`,
    wrong:[R`from datetime import date

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
text = input("Date (YYYY-MM-DD): ")
try:
    d = date.fromisoformat(text)
except ValueError:
    print("Invalid date")
else:
    print("Year:", d.year)
    print("Weekday:", DAYS[d.weekday()])
    print("Leap year:", "yes" if d.year % 4 == 0 else "no")`, R`from datetime import date
import calendar

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
text = input("Date (YYYY-MM-DD): ")
try:
    d = date.fromisoformat(text)
except ValueError:
    print("Invalid date")
else:
    print("Year:", d.year)
    print("Weekday:", DAYS[d.isoweekday() % 7])
    print("Leap year:", "yes" if calendar.isleap(d.year) else "no")`],
    hints:['try: d = date.fromisoformat(text) except ValueError: print Invalid date.','DAYS[d.weekday()] gives the name (Monday is 0).','calendar.isleap(d.year) does the leap rule correctly.','from datetime import date\nimport calendar\n\nDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]\ntext = input("Date (YYYY-MM-DD): ")\ntry:\n    d = date.fromisoformat(text)\nexcept ValueError:\n    print("Invalid date")\nelse:\n    print("Year:", d.year)\n    print("Weekday:", DAYS[d.weekday()])\n    print("Leap year:", "yes" if calendar.isleap(d.year) else "no")']},
  power:{can:['Build, parse and compare dates','Handle invalid dates safely'],
    expand:'Print whether the date falls on a weekend.',
    where:'Bookings, birthdays, billing cycles and reports all begin with a date object.',
    next:'Next: timedelta, adding and subtracting days.'},
  codex:{title:'date',body:'date(y, m, d). weekday() Monday=0. fromisoformat parses. Invalid dates raise ValueError. Use calendar.isleap.',snip:R`date.fromisoformat("2026-10-23")`}
},
{
  id:'r9-20', realm:9, n:20, title:'timedelta: adding and subtracting days',
  teaches:['timedelta'], requires:['date-basic'],
  story:`"How many days until the festival? What date is 30 days after the order?" Master Cog tosses a brass ruler marked in days. "Subtract two dates and you get a **gap of time**: a timedelta."`,
  concept:{
    html:`\`\`\`\nfrom datetime import date, timedelta\n\na = date(2026, 1, 1)\nb = date(2026, 3, 1)\n\ngap = b - a                       # a timedelta\ngap.days                          # 59\na + timedelta(days=30)            # date(2026, 1, 31)\na - timedelta(weeks=2)            # two weeks earlier\n\`\`\`\n\n- \`date - date\` gives a **timedelta**; printing it shows \`59 days, 0:00:00\`. Use **\`.days\`** for the plain number.\n- \`date + timedelta\` gives a new date. \`timedelta(days=, weeks=, hours=, minutes=, seconds=)\`.\n- The result can be **negative** if the first date is earlier.\n- Months and years aren't fixed lengths, so \`timedelta\` has no \`months\`. It handles the calendar (month ends, leap days) for you when you add days.`,
    analogy:`A ruler for time: place it between two dates, or walk it forward from one.`,
    example:R`from datetime import date, timedelta

a = date(2026, 1, 1)
b = date(2026, 3, 1)
print((b - a).days)
print(a + timedelta(days=30))`},
  predict:{code:R`from datetime import date
print((date(2026, 3, 1) - date(2026, 2, 1)).days)`, q:'What prints?', opts:['28','30','31'], ans:0, why:'February 2026 has 28 days.'},
  cast:{code:R`from datetime import date, timedelta

a = date(2026, 1, 1)
b = date(2026, 3, 1)
print((b - a).days)
print(a + timedelta(days=30))`, task:'Cast it.'},
  bug:{broken:R`from datetime import date
a = date(2026, 1, 1)
b = date(2026, 3, 1)
print(b - a)`, task:'It prints "59 days, 0:00:00". We want just the number of days. Expected: 59',
    cases:[{inputs:[],tests:[['Plain number','lines==["59"]']]}],
    sol:R`from datetime import date
a = date(2026, 1, 1)
b = date(2026, 3, 1)
print((b - a).days)`, wrong:[R`from datetime import date
a = date(2026, 1, 1)
b = date(2026, 3, 1)
print(b - a)`]},
  write:{prompt:'Ask `From: ` and `To: ` (both `YYYY-MM-DD`, always valid). Print `Days between: <n>` (negative if `To` is earlier) and `Plus 30 days: <the To date plus 30 days>`.',
    starter:R`from datetime import date, timedelta

start = date.fromisoformat(input("From: "))
end = date.fromisoformat(input("To: "))
`,
    inputs:['2026-01-01','2026-03-01'],
    cases:[{inputs:['2026-01-01','2026-03-01'],tests:[['Forward','lines[-2:]==["Days between: 59","Plus 30 days: 2026-03-31"]']]},{inputs:['2026-03-01','2026-01-01'],tests:[['Backward','lines[-2:]==["Days between: -59","Plus 30 days: 2026-01-31"]']]},{inputs:['2024-02-28','2024-03-01'],tests:[['Leap year','lines[-2:]==["Days between: 2","Plus 30 days: 2024-03-31"]']]},{inputs:['2026-05-05','2026-05-05'],tests:[['Same day','lines[-2:]==["Days between: 0","Plus 30 days: 2026-06-04"]']]},{inputs:['2025-12-01','2025-12-31'],tests:[['Year end','lines[-2:]==["Days between: 30","Plus 30 days: 2026-01-30"]'],['Uses timedelta','"timedelta(" in src']]}],
    sol:R`from datetime import date, timedelta

start = date.fromisoformat(input("From: "))
end = date.fromisoformat(input("To: "))
print("Days between:", (end - start).days)
print("Plus 30 days:", end + timedelta(days=30))`,
    wrong:[R`from datetime import date, timedelta

start = date.fromisoformat(input("From: "))
end = date.fromisoformat(input("To: "))
print("Days between:", (start - end).days)
print("Plus 30 days:", end + timedelta(days=30))`, R`from datetime import date, timedelta

start = date.fromisoformat(input("From: "))
end = date.fromisoformat(input("To: "))
print("Days between:", (end - start).days)
print("Plus 30 days:", start + timedelta(days=30))`],
    hints:['(end - start).days is the gap in days.','end + timedelta(days=30) is the new date; print it directly (it prints as YYYY-MM-DD).','Careful: it is the To date plus 30, and the gap is To minus From.','from datetime import date, timedelta\n\nstart = date.fromisoformat(input("From: "))\nend = date.fromisoformat(input("To: "))\nprint("Days between:", (end - start).days)\nprint("Plus 30 days:", end + timedelta(days=30))']},
  power:{can:['Count days between dates','Add and subtract time spans safely'],
    expand:'Print the weekday of the "Plus 30 days" date.',
    where:'Deadlines, subscriptions, ages and booking windows are all timedelta jobs.',
    next:'Next: formatting and parsing dates.'},
  codex:{title:'timedelta',body:'date - date -> timedelta (.days). date + timedelta(days=n) -> date. Can be negative.',snip:R`(end - start).days`}
},
{
  id:'r9-21', realm:9, n:21, title:'strftime and strptime: dates to text and back',
  teaches:['strftime'], requires:['timedelta'],
  story:`"The Guildmaster writes dates as 23/10/2026. The ledger wants 2026-10-23. A third guild writes *Friday, 23 October 2026*," Master Cog sighs. "Two spell-words translate any of them."`,
  concept:{
    html:`\`\`\`\nfrom datetime import datetime\n\nd = datetime.strptime("23/10/2026", "%d/%m/%Y").date()   # TEXT -> date (parse)\nd.strftime("%A, %d %B %Y")                               # date -> TEXT (format)\n# 'Friday, 23 October 2026'\n\`\`\`\n\n- **s**trp**time** = *string parse time*: text in, date out. **strf**time = *string format time*: date in, text out.\n- Codes: \`%Y\` 4-digit year, \`%y\` 2-digit, \`%m\` month number, \`%B\` month name, \`%b\` short name (Oct), \`%d\` day (zero-padded), \`%A\` weekday name, \`%a\` short (Fri), \`%H:%M\` 24h time.\n- The format must match the text **exactly**. If not, \`ValueError\`.\n- \`strptime\` returns a **datetime**; add \`.date()\` for a date.\n- Names depend on the computer's language settings; in this course they are English.`,
    analogy:`strptime is a translator reading a foreign date; strftime writes it out in whatever style you choose.`,
    example:R`from datetime import datetime

d = datetime.strptime("23/10/2026", "%d/%m/%Y").date()
print(d.isoformat())
print(d.strftime("%A, %d %B %Y"))`},
  predict:{code:R`from datetime import date
print(date(2026, 10, 23).strftime("%b %d"))`, q:'What prints?', opts:['Oct 23','October 23','10 23'], ans:0, why:'%b is the short month name, %d the zero-padded day.'},
  cast:{code:R`from datetime import datetime

d = datetime.strptime("23/10/2026", "%d/%m/%Y").date()
print(d.isoformat())
print(d.strftime("%A, %d %B %Y"))`, task:'Cast it.'},
  bug:{broken:R`from datetime import datetime
d = datetime.strptime("2026-10-23", "%d/%m/%Y")
print(d.strftime("%d %b %Y"))`, task:'ValueError: the format does not match the text. Fix the format. Expected: 23 Oct 2026',
    cases:[{inputs:[],tests:[['Right','lines==["23 Oct 2026"]']]}],
    sol:R`from datetime import datetime
d = datetime.strptime("2026-10-23", "%Y-%m-%d")
print(d.strftime("%d %b %Y"))`, wrong:[R`from datetime import datetime
d = datetime.strptime("2026-10-23", "%d/%m/%Y")
print(d.strftime("%d %b %Y"))`]},
  write:{prompt:'Ask `Date (DD/MM/YYYY): `. If it cannot be parsed print `Invalid date`. Otherwise print `ISO: <YYYY-MM-DD>` and `Long: <Weekday>, <DD> <Month> <YYYY>` (e.g. `Friday, 23 October 2026`). Use `strptime` and `strftime`.',
    starter:R`from datetime import datetime

text = input("Date (DD/MM/YYYY): ")
`,
    inputs:['23/10/2026'],
    cases:[{inputs:['23/10/2026'],tests:[['Friday','lines[-2:]==["ISO: 2026-10-23","Long: Friday, 23 October 2026"]']]},{inputs:['29/02/2024'],tests:[['Leap day','lines[-2:]==["ISO: 2024-02-29","Long: Thursday, 29 February 2024"]']]},{inputs:['5/3/2026'],tests:[['Single digits ok','lines[-2:]==["ISO: 2026-03-05","Long: Thursday, 05 March 2026"]']]},{inputs:['31/04/2026'],tests:[['April has 30','lines[-1]=="Invalid date"']]},{inputs:['2026-10-23'],tests:[['Wrong layout','lines[-1]=="Invalid date"'],['Uses strptime','"strptime(" in src and "strftime(" in src']]}],
    sol:R`from datetime import datetime

text = input("Date (DD/MM/YYYY): ")
try:
    d = datetime.strptime(text, "%d/%m/%Y").date()
except ValueError:
    print("Invalid date")
else:
    print("ISO:", d.isoformat())
    print("Long:", d.strftime("%A, %d %B %Y"))`,
    wrong:[R`from datetime import datetime

text = input("Date (DD/MM/YYYY): ")
try:
    d = datetime.strptime(text, "%m/%d/%Y").date()
except ValueError:
    print("Invalid date")
else:
    print("ISO:", d.isoformat())
    print("Long:", d.strftime("%A, %d %B %Y"))`, R`from datetime import datetime

text = input("Date (DD/MM/YYYY): ")
try:
    d = datetime.strptime(text, "%d/%m/%Y").date()
except ValueError:
    print("Invalid date")
else:
    print("ISO:", d.isoformat())
    print("Long:", d.strftime("%a, %d %b %Y"))`],
    hints:['datetime.strptime(text, "%d/%m/%Y").date() parses; wrap in try / except ValueError.','d.isoformat() gives YYYY-MM-DD.','d.strftime("%A, %d %B %Y") gives the long form.','from datetime import datetime\n\ntext = input("Date (DD/MM/YYYY): ")\ntry:\n    d = datetime.strptime(text, "%d/%m/%Y").date()\nexcept ValueError:\n    print("Invalid date")\nelse:\n    print("ISO:", d.isoformat())\n    print("Long:", d.strftime("%A, %d %B %Y"))']},
  power:{can:['Parse dates from any text layout','Format dates for people or for files'],
    expand:'Also accept dates written like 23-10-2026 by trying a second format.',
    where:'Importing spreadsheets, log lines and API data always means parsing dates.',
    next:'Next: datetime, dates with a time of day.'},
  codex:{title:'strptime / strftime',body:'strptime(text, fmt) parses; strftime(fmt) formats. %Y %m %d %B %b %A %a %H %M.',snip:R`datetime.strptime(text, "%d/%m/%Y")`}
},
{
  id:'r9-22', realm:9, n:22, title:'datetime: dates with a time of day',
  teaches:['datetime-arith'], requires:['strftime'],
  story:`"Gate closes at 23:30. The ferry takes 45 minutes. Does the crossing end **tomorrow**?" Master Cog asks. "For this you need dates **and** clock times together."`,
  concept:{
    html:`\`\`\`\nfrom datetime import datetime, timedelta\n\nstart = datetime(2026, 10, 23, 23, 30)         # y, m, d, hour, minute\nend = start + timedelta(minutes=45)\nprint(end)                                       # 2026-10-24 00:15:00\nprint(end.date() > start.date())                 # True: it crossed midnight\n\nstart.strftime("%Y-%m-%d %H:%M")                 # '2026-10-23 23:30'\ndatetime.strptime("2026-10-23 14:30", "%Y-%m-%d %H:%M")\n\`\`\`\n\n- A \`datetime\` has \`.year .month .day .hour .minute .second\`.\n- \`datetime + timedelta\` rolls over hours, days, months and years correctly. Adding a plain number is a \`TypeError\`.\n- \`datetime.date()\` and \`datetime.time()\` split it apart.\n- To test "crossed midnight", compare the **dates**, not just the day number (31 → 1 looks like a decrease!).\n- This is a *naive* datetime (no time zone). Time zones are a later topic.`,
    analogy:`A wall clock and a calendar bolted together: spin the dial and the date turns over by itself.`,
    example:R`from datetime import datetime, timedelta

start = datetime(2026, 10, 23, 23, 30)
end = start + timedelta(minutes=45)
print(end)
print(end.date() > start.date())`},
  predict:{code:R`from datetime import datetime, timedelta
t = datetime(2026, 10, 23, 23, 0) + timedelta(hours=2)
print(t.day, t.hour)`, q:'What prints?', opts:['24 1','23 1','24 25'], ans:0, why:'23:00 plus two hours is 01:00 on the next day.'},
  cast:{code:R`from datetime import datetime, timedelta

start = datetime(2026, 10, 23, 23, 30)
end = start + timedelta(minutes=45)
print(end)
print(end.date() > start.date())`, task:'Cast it.'},
  bug:{broken:R`from datetime import datetime
start = datetime(2026, 10, 23, 14, 30)
print(start + 30)`, task:'TypeError: you can\'t add a plain number. Add a 30-minute timedelta. Expected: 2026-10-23 15:00:00',
    cases:[{inputs:[],tests:[['Right','lines==["2026-10-23 15:00:00"]']]}],
    sol:R`from datetime import datetime, timedelta
start = datetime(2026, 10, 23, 14, 30)
print(start + timedelta(minutes=30))`, wrong:[R`from datetime import datetime
start = datetime(2026, 10, 23, 14, 30)
print(start + 30)`]},
  write:{prompt:'Ask `Start (YYYY-MM-DD HH:MM): ` and `Minutes: `. Print `End: <YYYY-MM-DD HH:MM>` and `Crosses midnight: yes` or `no` (yes if the end date is later than the start date).',
    starter:R`from datetime import datetime, timedelta

start = datetime.strptime(input("Start (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")
minutes = int(input("Minutes: "))
`,
    inputs:['2026-10-23 14:30','90'],
    cases:[{inputs:['2026-10-23 14:30','90'],tests:[['Same day','lines[-2:]==["End: 2026-10-23 16:00","Crosses midnight: no"]']]},{inputs:['2026-10-23 23:30','45'],tests:[['Past midnight','lines[-2:]==["End: 2026-10-24 00:15","Crosses midnight: yes"]']]},{inputs:['2026-12-31 23:59','1'],tests:[['New Year','lines[-2:]==["End: 2027-01-01 00:00","Crosses midnight: yes"]']]},{inputs:['2024-02-28 23:00','120'],tests:[['Leap day','lines[-2:]==["End: 2024-02-29 01:00","Crosses midnight: yes"]']]},{inputs:['2026-01-31 22:00','180'],tests:[['Month end','lines[-2:]==["End: 2026-02-01 01:00","Crosses midnight: yes"]'],['Uses timedelta','"timedelta(" in src']]}],
    sol:R`from datetime import datetime, timedelta

start = datetime.strptime(input("Start (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")
minutes = int(input("Minutes: "))
end = start + timedelta(minutes=minutes)
print("End:", end.strftime("%Y-%m-%d %H:%M"))
print("Crosses midnight:", "yes" if end.date() > start.date() else "no")`,
    wrong:[R`from datetime import datetime, timedelta

start = datetime.strptime(input("Start (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")
minutes = int(input("Minutes: "))
end = start + timedelta(minutes=minutes)
print("End:", end.strftime("%Y-%m-%d %H:%M"))
print("Crosses midnight:", "yes" if end.day > start.day else "no")`, R`from datetime import datetime, timedelta

start = datetime.strptime(input("Start (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")
minutes = int(input("Minutes: "))
end = start + timedelta(hours=minutes)
print("End:", end.strftime("%Y-%m-%d %H:%M"))
print("Crosses midnight:", "yes" if end.date() > start.date() else "no")`],
    hints:['end = start + timedelta(minutes=minutes).','Format it with end.strftime("%Y-%m-%d %H:%M").','Compare end.date() with start.date(), not the day numbers.','from datetime import datetime, timedelta\n\nstart = datetime.strptime(input("Start (YYYY-MM-DD HH:MM): "), "%Y-%m-%d %H:%M")\nminutes = int(input("Minutes: "))\nend = start + timedelta(minutes=minutes)\nprint("End:", end.strftime("%Y-%m-%d %H:%M"))\nprint("Crosses midnight:", "yes" if end.date() > start.date() else "no")']},
  power:{can:['Do arithmetic with dates and clock times','Detect day rollovers correctly'],
    expand:'Print how many minutes remain until the next midnight after the End time.',
    where:'Schedules, timers, shift planners and log analysis all need datetime arithmetic.',
    next:'Next: the pathlib module. Files and folders the modern way.'},
  codex:{title:'datetime',body:'datetime(y,m,d,h,mi) + timedelta rolls over correctly. Compare .date() values for midnight crossings.',snip:R`end = start + timedelta(minutes=45)`}
}
);
