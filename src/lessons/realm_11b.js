// REALM 11 — THE ITERATOR GATE — part B (lessons 8-12: generators, lazy streams, pipelines, log mission)
LESSONS.push(
{
  id:'r11-08', realm:11, n:8, title:'yield: functions that pause and resume',
  teaches:['gen-yield'], requires:['mission11a'],
  story:`Beyond the arch, a river of numbers runs through the hall. "You can't carry a river in a bucket," Quill says. "A list holds **everything at once**. A **generator** hands out one value at a time and *remembers where it was*."`,
  concept:{
    html:`A function with \`yield\` is a **generator function**. Calling it returns a **generator object** without running anything yet:\n\n\`\`\`\ndef countdown(n):\n    while n > 0:\n        yield n            # hand out a value, then PAUSE here\n        n -= 1\n    # falling off the end stops the generator\n\ng = countdown(3)\nnext(g)       # 3   (runs until the first yield)\nnext(g)       # 2   (resumes right after the yield)\nlist(g)       # [1]  (collects what is left)\nfor x in countdown(3):\n    print(x)\n\`\`\`\n\n- \`yield\` ≠ \`return\`: the function's **local variables and position are kept** between values.\n- When the generator finishes, \`next()\` raises \`StopIteration\` (a \`for\` loop handles that for you).\n- A generator is an **iterator**: it works in \`for\`, \`list()\`, \`sum()\`, \`sorted()\`, \`join()\` ...\n- ⚠️ A generator is **used up** after one pass. Looping over it a second time gives nothing. Call the generator function again for a fresh one.\n- It's lazy: nothing is computed until someone asks for the next value.`,
    analogy:`A dispenser that gives one sweet each time you press the button, and remembers how many are left.`,
    example:R`def countdown(n):
    while n > 0:
        yield n
        n -= 1

g = countdown(3)
print(next(g), next(g))
print(list(g))
print(list(g))`},
  predict:{code:R`def gen():
    yield 1
    yield 2

g = gen()
print(list(g), list(g))`, q:'What prints?', opts:['[1, 2] []','[1, 2] [1, 2]','[] []'], ans:0, why:'A generator is used up after one pass.'},
  cast:{code:R`def countdown(n):
    while n > 0:
        yield n
        n -= 1

g = countdown(3)
print(next(g), next(g))
print(list(g))
print(list(g))`, task:'Cast it.'},
  bug:{broken:R`def evens(limit):
    out = []
    for n in range(0, limit, 2):
        out.append(n)
        return out

print(list(evens(7)))`, task:'The return exits after the first even number. Turn it into a generator with yield. Expected: [0, 2, 4, 6]',
    cases:[{inputs:[],tests:[['All evens','lines==["[0, 2, 4, 6]"]'],['Uses yield','"yield" in src']]}],
    sol:R`def evens(limit):
    for n in range(0, limit, 2):
        yield n

print(list(evens(7)))`, wrong:[R`def evens(limit):
    out = []
    for n in range(0, limit, 2):
        out.append(n)
    return out

print(list(evens(7)))`]},
  write:{prompt:'Write a **generator** `fib(n)` that yields the first `n` Fibonacci numbers (`0, 1, 1, 2, 3, 5, ...`). Ask `N: ` (whole number). Print `Fib: ` followed by the numbers separated by spaces; for `0` or less print `Fib: -`. Then print `Sum: <sum of those numbers>`.',
    starter:R`def fib(n):
    pass

n = int(input("N: "))
`,
    inputs:['7'],
    cases:[{inputs:['7'],tests:[['Seven','lines[-2:]==["Fib: 0 1 1 2 3 5 8","Sum: 20"]'],['Is a generator function','__import__("inspect").isgeneratorfunction(g["fib"])'],['Lazy','(lambda gen: (next(gen), next(gen), next(gen))) (g["fib"](1000))==(0,1,1)']]},{inputs:['1'],tests:[['One','lines[-2:]==["Fib: 0","Sum: 0"]']]},{inputs:['0'],tests:[['Zero','lines[-2:]==["Fib: -","Sum: 0"]']]},{inputs:['-3'],tests:[['Negative','lines[-2:]==["Fib: -","Sum: 0"]']]},{inputs:['12'],tests:[['Twelve','lines[-2:]==["Fib: 0 1 1 2 3 5 8 13 21 34 55 89","Sum: 232"]']]}],
    sol:R`def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

n = int(input("N: "))
numbers = list(fib(n))
print("Fib:", *numbers if numbers else ["-"])
print("Sum:", sum(numbers))`,
    wrong:[R`def fib(n):
    out = []
    a, b = 0, 1
    for _ in range(n):
        out.append(a)
        a, b = b, a + b
    return out

n = int(input("N: "))
numbers = list(fib(n))
print("Fib:", *numbers if numbers else ["-"])
print("Sum:", sum(numbers))`, R`def fib(n):
    a, b = 0, 1
    for _ in range(n):
        yield b
        a, b = b, a + b

n = int(input("N: "))
numbers = list(fib(n))
print("Fib:", *numbers if numbers else ["-"])
print("Sum:", sum(numbers))`],
    hints:['Keep two variables a, b = 0, 1 and loop n times.','yield a, then a, b = b, a + b.','Collect with list(fib(n)); print "-" if it is empty.','def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nn = int(input("N: "))\nnumbers = list(fib(n))\nprint("Fib:", *numbers if numbers else ["-"])\nprint("Sum:", sum(numbers))']},
  power:{can:['Write generator functions with yield','Explain why generators are used up after one pass'],
    expand:'Write a generator `squares(limit)` and print them with a for loop.',
    where:'Generators stream big files, database rows and API pages without loading everything.',
    next:'Next: lazy and infinite streams.'},
  codex:{title:'yield',body:'A function with yield returns a generator: next() runs to the next yield and pauses, keeping its state. Used up after one pass. Works anywhere an iterable does.',snip:R`def countdown(n):
    while n > 0:
        yield n
        n -= 1`}
},
{
  id:'r11-09', realm:11, n:9, title:'Lazy and infinite streams',
  teaches:['gen-lazy'], requires:['gen-yield'],
  story:`"How many prime numbers are there?" an apprentice asks. "Infinitely many," Quill smiles. "So a **list** of primes is impossible, but a **stream** of primes is easy: it never has to finish."`,
  concept:{
    html:`A generator can run **forever**, because it only computes a value when asked:\n\n\`\`\`\ndef naturals():\n    n = 1\n    while True:            # infinite loop is fine inside a generator\n        yield n\n        n += 1\n\nfrom itertools import islice, takewhile\n\nlist(islice(naturals(), 5))                  # [1, 2, 3, 4, 5]   first 5\nlist(takewhile(lambda n: n < 4, naturals())) # [1, 2, 3]          until a condition fails\nnext(x for x in naturals() if x % 7 == 0)    # 7                  first match\n\`\`\`\n\n- ⚠️ Never call \`list()\` on an infinite generator: it never finishes (and eats memory).\n- \`itertools.islice(gen, n)\` takes the first **n** items; \`takewhile\` takes items **while a test is true**.\n- \`next(gen, default)\` gets the next item, or the default when there are none.\n- Laziness also means **side effects happen on demand**: if the generator prints, the prints appear as values are requested.`,
    analogy:`A tap, not a bucket: you take what you need and the water keeps coming.`,
    example:R`from itertools import islice

def naturals():
    n = 1
    while True:
        yield n
        n += 1

print(list(islice(naturals(), 5)))
print(next(x for x in naturals() if x % 7 == 0))`},
  predict:{code:R`def gen():
    print("start")
    yield 1

g = gen()
print("made")
next(g)`, q:'What prints?', opts:['made\nstart','start\nmade','made'], ans:0, why:'Calling gen() runs nothing. The body starts at the first next().'},
  cast:{code:R`from itertools import islice

def naturals():
    n = 1
    while True:
        yield n
        n += 1

print(list(islice(naturals(), 5)))
print(next(x for x in naturals() if x % 7 == 0))`, task:'Cast it.'},
  bug:{broken:R`from itertools import islice

def naturals():
    n = 1
    while True:
        yield n
        n += 1

print(list(naturals())[:3])`, task:'list() on an infinite generator never ends. Take the first 3 lazily with islice. Expected: [1, 2, 3]',
    cases:[{inputs:[],tests:[['Three','lines==["[1, 2, 3]"]'],['islice','"islice" in src']]}],
    sol:R`from itertools import islice

def naturals():
    n = 1
    while True:
        yield n
        n += 1

print(list(islice(naturals(), 3)))`, wrong:[R`print([1, 2, 3])`]},
  write:{prompt:'Write an **infinite generator** `primes()` yielding 2, 3, 5, 7, ... in order. Ask `Count: ` and print `First <count>: ` followed by that many primes separated by spaces (use `islice`; for 0 or less print `First <count>: -`). Then ask `Limit: ` and print `Below <limit>: <how many primes are smaller than the limit>` using `takewhile`.',
    starter:R`from itertools import islice, takewhile

def primes():
    pass

count = int(input("Count: "))
limit = int(input("Limit: "))
`,
    inputs:['6','30'],
    cases:[{inputs:['6','30'],tests:[['Primes','lines[-2:]==["First 6: 2 3 5 7 11 13","Below 30: 10"]'],['Generator','__import__("inspect").isgeneratorfunction(g["primes"])'],['Lazy and infinite','(lambda gen: [next(gen) for _ in range(8)])(g["primes"]())==[2,3,5,7,11,13,17,19]'],['Uses islice and takewhile','"islice(" in src and "takewhile(" in src']]},{inputs:['0','2'],tests:[['None','lines[-2:]==["First 0: -","Below 2: 0"]']]},{inputs:['1','3'],tests:[['Edge','lines[-2:]==["First 1: 2","Below 3: 1"]']]},{inputs:['10','100'],tests:[['Hundred','lines[-2:]==["First 10: 2 3 5 7 11 13 17 19 23 29","Below 100: 25"]']]},{inputs:['3','2'],tests:[['Limit is exclusive','lines[-1]=="Below 2: 0"']]}],
    sol:R`from itertools import islice, takewhile

def primes():
    n = 2
    while True:
        if all(n % d for d in range(2, int(n ** 0.5) + 1)):
            yield n
        n += 1

count = int(input("Count: "))
limit = int(input("Limit: "))
first = list(islice(primes(), max(count, 0)))
print(f"First {count}:", *first if first else ["-"])
print(f"Below {limit}:", len(list(takewhile(lambda p: p < limit, primes()))))`,
    wrong:[R`from itertools import islice, takewhile

def primes():
    n = 2
    while True:
        if all(n % d for d in range(2, int(n ** 0.5) + 1)):
            yield n
        n += 1

count = int(input("Count: "))
limit = int(input("Limit: "))
first = list(islice(primes(), max(count, 0)))
print(f"First {count}:", *first if first else ["-"])
print(f"Below {limit}:", len(list(takewhile(lambda p: p <= limit, primes()))))`, R`from itertools import islice, takewhile

def primes():
    n = 1
    while True:
        if all(n % d for d in range(2, int(n ** 0.5) + 1)):
            yield n
        n += 1

count = int(input("Count: "))
limit = int(input("Limit: "))
first = list(islice(primes(), max(count, 0)))
print(f"First {count}:", *first if first else ["-"])
print(f"Below {limit}:", len(list(takewhile(lambda p: p < limit, primes()))))`],
    hints:['Loop n from 2 upward forever; yield n when no d from 2 to sqrt(n) divides it.','list(islice(primes(), count)) takes the first few; guard negative counts with max(count, 0).','takewhile(lambda p: p < limit, primes()) stops at the first prime that is not below the limit.','from itertools import islice, takewhile\n\ndef primes():\n    n = 2\n    while True:\n        if all(n % d for d in range(2, int(n ** 0.5) + 1)):\n            yield n\n        n += 1\n\ncount = int(input("Count: "))\nlimit = int(input("Limit: "))\nfirst = list(islice(primes(), max(count, 0)))\nprint(f"First {count}:", *first if first else ["-"])\nprint(f"Below {limit}:", len(list(takewhile(lambda p: p < limit, primes()))))']},
  power:{can:['Write infinite generators safely','Take part of a stream with islice, takewhile and next'],
    expand:'Print the first prime greater than 1000 using `next(p for p in primes() if p > 1000)`.',
    where:'Event streams, sensor feeds and paginated APIs are naturally infinite generators.',
    next:'Next: generator expressions.'},
  codex:{title:'Lazy streams',body:'Generators compute on demand and can be infinite. Never list() an infinite one: use itertools.islice(g, n), takewhile(test, g) or next(x for x in g if cond).',snip:R`list(islice(primes(), 10))
next(x for x in naturals() if x % 7 == 0)`}
},
{
  id:'r11-10', realm:11, n:10, title:'Generator expressions: one-line lazy loops',
  teaches:['gen-expr'], requires:['gen-lazy'],
  story:`"You know list comprehensions," Quill says. "Swap the square brackets for round ones and you get the lazy twin: it makes **no list at all**."`,
  concept:{
    html:`\`\`\`\nsquares_list = [n * n for n in range(5)]   # builds the whole list now\nsquares_gen  = (n * n for n in range(5))   # builds nothing yet: a generator\n\nsum(n * n for n in range(1_000_000))        # no giant list in memory!\nany(n > 100 for n in nums)                  # stops at the FIRST match\nall(n > 0 for n in nums)                    # stops at the first failure\nmax(len(w) for w in words)                  # no brackets needed inside a call\n", ".join(str(n) for n in nums)               # join accepts any iterable\n\`\`\`\n\n- When a generator expression is the **only argument**, the extra parentheses can be dropped: \`sum(x for x in nums)\`.\n- \`any\`/\`all\` **short-circuit**: they stop as soon as the answer is known, so they work even on infinite streams.\n- Use a **list** when you need to loop twice, index, or print the contents. Use a **generator expression** when you consume it once.\n- Like all generators, it's used up after one pass.`,
    analogy:`A list is a printed menu; a generator expression is a waiter who tells you each dish only when you ask.`,
    example:R`nums = [3, 8, 1, 12]
print(sum(n * n for n in nums))
print(any(n > 10 for n in nums), all(n > 0 for n in nums))
print(", ".join(str(n) for n in nums if n % 2 == 0))
gen = (n for n in nums)
print(list(gen), list(gen))`},
  predict:{code:R`g = (n for n in [1, 2, 3])
print(sum(g), sum(g))`, q:'What prints?', opts:['6 0','6 6','0 0'], ans:0, why:'The generator is used up by the first sum.'},
  cast:{code:R`nums = [3, 8, 1, 12]
print(sum(n * n for n in nums))
print(any(n > 10 for n in nums), all(n > 0 for n in nums))
print(", ".join(str(n) for n in nums if n % 2 == 0))
gen = (n for n in nums)
print(list(gen), list(gen))`, task:'Cast it.'},
  bug:{broken:R`words = ["a", "bb", "ccc"]
lengths = (len(w) for w in words)
print(max(lengths), min(lengths))`, task:'ValueError: max() used up the generator, so min() has nothing. Make lengths a list. Expected: 3 1',
    cases:[{inputs:[],tests:[['Both work','lines==["3 1"]']]}],
    sol:R`words = ["a", "bb", "ccc"]
lengths = [len(w) for w in words]
print(max(lengths), min(lengths))`, wrong:[R`words = ["a", "bb", "ccc"]
lengths = (len(w) for w in words)
print(max(lengths), min(lengths))`]},
  write:{prompt:'Ask `Numbers: ` (space-separated whole numbers). With none print `No numbers`. Otherwise print, each computed with a **generator expression** (no list brackets): `Sum of squares: <sum>`, `Any big: yes/no` (any number above 100), `All positive: yes/no`, `Evens: <even numbers joined with ", ", or none>`.',
    starter:R`nums = [int(w) for w in input("Numbers: ").split()]
`,
    inputs:['3 8 1 12'],
    cases:[{inputs:['3 8 1 12'],tests:[['Full','lines[-4:]==["Sum of squares: 218","Any big: no","All positive: yes","Evens: 8, 12"]'],['Generator expressions','src.count("for")>=4 and "sum(" in src and "any(" in src and "all(" in src']]},{inputs:['-5 200'],tests:[['Big and negative','lines[-4:]==["Sum of squares: 40025","Any big: yes","All positive: no","Evens: 200"]']]},{inputs:['7'],tests:[['No evens','lines[-4:]==["Sum of squares: 49","Any big: no","All positive: yes","Evens: none"]']]},{inputs:[''],tests:[['None','lines[-1]=="No numbers"']]},{inputs:['100'],tests:[['Exactly 100 is not above','lines[-3]=="Any big: no"']]},{inputs:['0 5'],tests:[['Zero is not positive','lines[-2]=="All positive: no"']]}],
    sol:R`nums = [int(w) for w in input("Numbers: ").split()]
if not nums:
    print("No numbers")
else:
    print("Sum of squares:", sum(n * n for n in nums))
    print("Any big:", "yes" if any(n > 100 for n in nums) else "no")
    print("All positive:", "yes" if all(n > 0 for n in nums) else "no")
    evens = ", ".join(str(n) for n in nums if n % 2 == 0)
    print("Evens:", evens or "none")`,
    wrong:[R`nums = [int(w) for w in input("Numbers: ").split()]
if not nums:
    print("No numbers")
else:
    print("Sum of squares:", sum(n * n for n in nums))
    print("Any big:", "yes" if any(n >= 100 for n in nums) else "no")
    print("All positive:", "yes" if all(n > 0 for n in nums) else "no")
    evens = ", ".join(str(n) for n in nums if n % 2 == 0)
    print("Evens:", evens or "none")`, R`nums = [int(w) for w in input("Numbers: ").split()]
if not nums:
    print("No numbers")
else:
    print("Sum of squares:", sum(n * n for n in nums))
    print("Any big:", "yes" if any(n > 100 for n in nums) else "no")
    print("All positive:", "yes" if all(n >= 0 for n in nums) else "no")
    evens = ", ".join(str(n) for n in nums if n % 2 == 0)
    print("Evens:", evens or "none")`],
    hints:['sum(n * n for n in nums): no brackets needed inside a function call.','any(n > 100 for n in nums) and all(n > 0 for n in nums) return True or False.','", ".join(str(n) for n in nums if n % 2 == 0), and `or "none"` for the empty case.','nums = [int(w) for w in input("Numbers: ").split()]\nif not nums:\n    print("No numbers")\nelse:\n    print("Sum of squares:", sum(n * n for n in nums))\n    print("Any big:", "yes" if any(n > 100 for n in nums) else "no")\n    print("All positive:", "yes" if all(n > 0 for n in nums) else "no")\n    evens = ", ".join(str(n) for n in nums if n % 2 == 0)\n    print("Evens:", evens or "none")']},
  power:{can:['Use generator expressions with sum, any, all, max and join','Choose between a list and a generator'],
    expand:'Use `sum(1 for ...)` as a counter for items that pass a test.',
    where:'Data processing code is full of sum/any/all over generator expressions.',
    next:'Next: pipelines with yield from.'},
  codex:{title:'Generator expressions',body:'(expr for x in items if cond): lazy, one pass. Drop the extra parentheses when it is the only argument. any/all short-circuit. Use a list when you need to reuse the data.',snip:R`sum(n * n for n in nums)
any(n > 100 for n in nums)`}
},
{
  id:'r11-11', realm:11, n:11, title:'Pipelines: chaining generators with yield from',
  teaches:['gen-pipeline'], requires:['gen-expr'],
  story:`"Raw ore goes into the first machine, comes out as bars, goes into the next machine and comes out as tools," Quill says, walking you along a conveyor belt. "Each stage does **one small job** and passes items along. That's a **pipeline**."`,
  concept:{
    html:`Chain small generators so data flows through **one item at a time**:\n\n\`\`\`\ndef strip_lines(lines):\n    for line in lines:\n        yield line.strip()\n\ndef non_empty(lines):\n    for line in lines:\n        if line:\n            yield line\n\ndef to_numbers(lines):\n    for line in lines:\n        if line.lstrip("-").isdigit():\n            yield int(line)\n\ntext = ["  4 ", "", "x", " -2"]\nresult = list(to_numbers(non_empty(strip_lines(text))))   # [4, -2]\n\`\`\`\n\n- Each stage is simple, testable on its own and **memory-friendly**: a 10 GB file flows through line by line.\n- \`yield from other\` hands out everything from another iterable:\n\n\`\`\`\ndef both(a, b):\n    yield from a\n    yield from b\n\`\`\`\n\n- Nothing runs until the **last** stage is consumed (\`list\`, \`for\`, \`sum\`).\n- Files are lazy iterators too: \`for line in open(name)\` reads one line at a time.`,
    analogy:`A factory conveyor belt: every machine does one job on whatever arrives.`,
    example:R`def strip_lines(lines):
    for line in lines:
        yield line.strip()

def non_empty(lines):
    for line in lines:
        if line:
            yield line

def both(a, b):
    yield from a
    yield from b

text = ["  4 ", "", " 5"]
print(list(non_empty(strip_lines(text))))
print(list(both([1, 2], "ab")))`},
  predict:{code:R`def a():
    yield 1
    yield 2

def b():
    yield 0
    yield from a()
    yield 3

print(list(b()))`, q:'What prints?', opts:['[0, 1, 2, 3]','[0, 3]','[1, 2, 0, 3]'], ans:0, why:'yield from a() hands out 1 and 2 in the middle.'},
  cast:{code:R`def strip_lines(lines):
    for line in lines:
        yield line.strip()

def non_empty(lines):
    for line in lines:
        if line:
            yield line

def both(a, b):
    yield from a
    yield from b

text = ["  4 ", "", " 5"]
print(list(non_empty(strip_lines(text))))
print(list(both([1, 2], "ab")))`, task:'Cast it.'},
  bug:{broken:R`def positive(nums):
    for n in nums:
        if n > 0:
            return n

print(list(positive([-1, 2, 3])))`, task:'TypeError: the stage returns one number instead of streaming them. Turn it into a generator. Expected: [2, 3]',
    cases:[{inputs:[],tests:[['Streams','lines==["[2, 3]"]'],['Uses yield','"yield" in src']]}],
    sol:R`def positive(nums):
    for n in nums:
        if n > 0:
            yield n

print(list(positive([-1, 2, 3])))`, wrong:[R`print([2, 3])`]},
write:{prompt:'Build a pipeline of generator functions: `strip_lines(lines)`, `non_comment(lines)` (skips empty lines and lines starting with `#`), and `to_pairs(lines)` (turns `key=value` lines into `(key, int(value))` tuples, skipping lines that are not valid). Ask `Config: ` (lines separated by `;`, like `a=1; #note; b=x; c=3`). Print `Pairs: <list of tuples>` and `Total: <sum of values>`.',
    starter:R`def strip_lines(lines):
    pass

raw = input("Config: ").split(";")
`,
    inputs:['a=1; #note; b=x; c=3'],
    cases:[{inputs:['a=1; #note; b=x; c=3'],tests:[['Pipeline','lines[-2:]==["Pairs: [(\'a\', 1), (\'c\', 3)]","Total: 4"]'],['Three generator stages','all(__import__("inspect").isgeneratorfunction(g[n]) for n in ("strip_lines","non_comment","to_pairs"))'],['Stage alone','list(g["non_comment"](["a","","#x","b"]))==["a","b"]']]},{inputs:[''],tests:[['Empty','lines[-2:]==["Pairs: []","Total: 0"]']]},{inputs:['x=5;y=-2;; # z=9'],tests:[['Negative and comments','lines[-2:]==["Pairs: [(\'x\', 5), (\'y\', -2)]","Total: 3"]']]},{inputs:['noequals; k=; =4'],tests:[['Malformed lines','lines[-2:]==["Pairs: []","Total: 0"]']]},{inputs:['  a = 7  '],tests:[['Spaces around','lines[-2:]==["Pairs: [(\'a\', 7)]","Total: 7"]']]}],
    sol:R`def strip_lines(lines):
    for line in lines:
        yield line.strip()

def non_comment(lines):
    for line in lines:
        if line and not line.startswith("#"):
            yield line

def to_pairs(lines):
    for line in lines:
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if key and value.lstrip("-").isdigit():
            yield key, int(value)

raw = input("Config: ").split(";")
pairs = list(to_pairs(non_comment(strip_lines(raw))))
print("Pairs:", pairs)
print("Total:", sum(value for _, value in pairs))`,
    wrong:[R`def strip_lines(lines):
    for line in lines:
        yield line.strip()

def non_comment(lines):
    for line in lines:
        if not line.startswith("#"):
            yield line

def to_pairs(lines):
    for line in lines:
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if key and value.lstrip("-").isdigit():
            yield key, int(value)

raw = input("Config: ").split(";")
pairs = list(to_pairs(non_comment(strip_lines(raw))))
print("Pairs:", pairs)
print("Total:", sum(value for _, value in pairs))`, R`def strip_lines(lines):
    for line in lines:
        yield line

def non_comment(lines):
    for line in lines:
        if line and not line.startswith("#"):
            yield line

def to_pairs(lines):
    for line in lines:
        if "=" not in line:
            continue
        key, _, value = line.partition("=")
        key, value = key.strip(), value.strip()
        if key and value.lstrip("-").isdigit():
            yield key, int(value)

raw = input("Config: ").split(";")
pairs = list(to_pairs(non_comment(strip_lines(raw))))
print("Pairs:", pairs)
print("Total:", sum(value for _, value in pairs))`],
    hints:['strip_lines yields line.strip() for each line. non_comment skips empty lines and lines starting with "#".','to_pairs: line.partition("=") splits at the first =; keep it only if the key is not empty and the value looks like an integer (value.lstrip("-").isdigit()).','Compose them: to_pairs(non_comment(strip_lines(raw))).','def strip_lines(lines):\n    for line in lines:\n        yield line.strip()\n\ndef non_comment(lines):\n    for line in lines:\n        if line and not line.startswith("#"):\n            yield line\n\ndef to_pairs(lines):\n    for line in lines:\n        if "=" not in line:\n            continue\n        key, _, value = line.partition("=")\n        key, value = key.strip(), value.strip()\n        if key and value.lstrip("-").isdigit():\n            yield key, int(value)\n\nraw = input("Config: ").split(";")\npairs = list(to_pairs(non_comment(strip_lines(raw))))\nprint("Pairs:", pairs)\nprint("Total:", sum(value for _, value in pairs))']},
  power:{can:['Build data pipelines from small generator stages','Use yield from to delegate to another iterable'],
    expand:'Add a `skip_duplicates` stage that yields each key only once.',
    where:'ETL jobs, log processors and streaming parsers are generator pipelines.',
    next:'Next: Real-World Mission: the Log Pipeline.'},
  codex:{title:'Pipelines',body:'Chain small single-purpose generators: to_pairs(non_comment(strip_lines(lines))). Items flow one at a time; nothing runs until consumed. yield from iterable delegates.',snip:R`def both(a, b):
    yield from a
    yield from b`}
},
{
  id:'r11-12', realm:11, n:12, title:'Real-World Mission: The Log Pipeline',
  teaches:['mission11b'], requires:['gen-pipeline'],
  story:`A server in the Gate's cellar has been writing a log for years: millions of lines. "Don't you dare load it all into a list," the Warden warns. "Stream it. Find the errors, count them per service, and tell me **who is failing most**."`,
  concept:{
    html:`This mission is a real log analyser built as a **generator pipeline over a file**:\n\n\`\`\`\n2024-05-01 10:00:03 ERROR db Connection lost\n2024-05-01 10:00:04 INFO web Request ok\n\`\`\`\n\nFormat: \`date time LEVEL service message...\`.\n\nStages:\n1. \`read_lines(path)\`: yield each line (a file is lazy already), stripped.\n2. \`parse(lines)\`: yield a **record** (a small dataclass or tuple) for each valid line; **skip malformed lines** instead of crashing.\n3. \`errors_only(records)\`: keep \`ERROR\` and \`CRITICAL\` records.\n4. Counting: \`collections.Counter(r.service for r in errors)\`.\n\n\`\`\`\nline.split(maxsplit=4)   # date, time, level, service, message (message keeps its spaces)\n\`\`\`\n\nDesign rules for robust parsers: **never trust the input**; one bad line must not stop the stream.`,
    analogy:`A sorting belt at a post office: letters that can't be read go in the "unreadable" bin instead of stopping the line.`,
    example:R`line = "2024-05-01 10:00:03 ERROR db Connection lost"
date, time, level, service, message = line.split(maxsplit=4)
print(level, service, "|", message)`},
  predict:{code:R`from collections import Counter
print(Counter(["db", "web", "db"]).most_common(1))`, q:'What prints?', opts:["[('db', 2)]","('db', 2)","{'db': 2}"], ans:0, why:'most_common(1) returns a list holding the top (item, count) pair.'},
  cast:{code:R`line = "2024-05-01 10:00:03 ERROR db Connection lost"
date, time, level, service, message = line.split(maxsplit=4)
print(level, service, "|", message)`, task:'Cast it.'},
  bug:{broken:R`lines = ["a b c d e", "bad line"]
for line in lines:
    date, time, level, service, message = line.split(maxsplit=4)
    print(level)`, task:'ValueError on the malformed line. Skip lines that don\'t have 5 parts. Expected: c',
    cases:[{inputs:[],tests:[['Skips','lines==["c"]'],['Splits the line','"split(" in src']]}],
    sol:R`lines = ["a b c d e", "bad line"]
for line in lines:
    parts = line.split(maxsplit=4)
    if len(parts) != 5:
        continue
    date, time, level, service, message = parts
    print(level)`, wrong:[R`print("c")`]},
  write:{prompt:'Analyse `app.log`. Write generators `read_lines(path)` (yield stripped, non-empty lines), `parse(lines)` (yield `(level, service, message)` for lines with at least 5 parts; skip malformed lines) and `errors_only(records)` (levels `ERROR` and `CRITICAL`). Print `Lines parsed: <valid record count>`, `Errors: <error count>`, `Worst service: <service with most errors>` (ties: alphabetical), and `Top message: <the most common error message>` (ties: alphabetical). If there are no errors print `Errors: 0` and `All quiet`. If the file is missing print `No log file`. Make sure the whole file is **never stored in one list** before parsing (read it lazily).',
    starter:R`from collections import Counter

def read_lines(path):
    pass
`,
    inputs:[],
    files:{'app.log':'2024-05-01 10:00:03 ERROR db Connection lost\n2024-05-01 10:00:04 INFO web Request ok\n2024-05-01 10:00:05 ERROR web Timeout\n2024-05-01 10:00:06 CRITICAL db Connection lost\n\ngarbage\n2024-05-01 10:00:07 ERROR db Timeout\n'},
    cases:[{inputs:[],files:{'app.log':'2024-05-01 10:00:03 ERROR db Connection lost\n2024-05-01 10:00:04 INFO web Request ok\n2024-05-01 10:00:05 ERROR web Timeout\n2024-05-01 10:00:06 CRITICAL db Connection lost\n\ngarbage\n2024-05-01 10:00:07 ERROR db Timeout\n'},tests:[['Full report','lines==["Lines parsed: 5","Errors: 4","Worst service: db","Top message: Connection lost"]'],['Generators','all(__import__("inspect").isgeneratorfunction(g[n]) for n in ("read_lines","parse","errors_only"))']]},{inputs:[],files:{'app.log':'2024-05-01 10:00:04 INFO web ok\n'},tests:[['All quiet','lines==["Lines parsed: 1","Errors: 0","All quiet"]']]},{inputs:[],files:{},tests:[['Missing file','lines==["No log file"]']]},{inputs:[],files:{'app.log':''},tests:[['Empty file','lines==["Lines parsed: 0","Errors: 0","All quiet"]']]},{inputs:[],files:{'app.log':'d t ERROR b X\nd t ERROR a X\nd t ERROR a Y\nd t ERROR b Y\n'},tests:[['Ties alphabetical','lines==["Lines parsed: 4","Errors: 4","Worst service: a","Top message: X"]']]},{inputs:[],files:{'app.log':'d t ERROR web Disk full now\nd t CRITICAL web Disk full now\nd t WARNING web Slow\n'},tests:[['Messages keep their spaces','lines==["Lines parsed: 3","Errors: 2","Worst service: web","Top message: Disk full now"]'],['Lazy reading','".readlines()" not in src and ".read()" not in src']]}],
    sol:R`from collections import Counter

def read_lines(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                yield line

def parse(lines):
    for line in lines:
        parts = line.split(maxsplit=4)
        if len(parts) == 5:
            yield parts[2], parts[3], parts[4]

def errors_only(records):
    for record in records:
        if record[0] in ("ERROR", "CRITICAL"):
            yield record

try:
    records = list(parse(read_lines("app.log")))
except FileNotFoundError:
    print("No log file")
else:
    errors = list(errors_only(records))
    print("Lines parsed:", len(records))
    print("Errors:", len(errors))
    if not errors:
        print("All quiet")
    else:
        by_service = Counter(service for _, service, _ in errors)
        by_message = Counter(message for _, _, message in errors)
        worst = sorted(by_service.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        top = sorted(by_message.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        print("Worst service:", worst)
        print("Top message:", top)`,
    wrong:[R`from collections import Counter

def read_lines(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                yield line

def parse(lines):
    for line in lines:
        parts = line.split(maxsplit=4)
        if len(parts) == 5:
            yield parts[2], parts[3], parts[4]

def errors_only(records):
    for record in records:
        if record[0] == "ERROR":
            yield record

try:
    records = list(parse(read_lines("app.log")))
except FileNotFoundError:
    print("No log file")
else:
    errors = list(errors_only(records))
    print("Lines parsed:", len(records))
    print("Errors:", len(errors))
    if not errors:
        print("All quiet")
    else:
        by_service = Counter(service for _, service, _ in errors)
        by_message = Counter(message for _, _, message in errors)
        worst = sorted(by_service.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        top = sorted(by_message.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        print("Worst service:", worst)
        print("Top message:", top)`, R`from collections import Counter

def read_lines(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                yield line

def parse(lines):
    for line in lines:
        parts = line.split(maxsplit=4)
        if len(parts) == 5:
            yield parts[2], parts[3], parts[4]

def errors_only(records):
    for record in records:
        if record[0] in ("ERROR", "CRITICAL"):
            yield record

try:
    records = list(parse(read_lines("app.log")))
except FileNotFoundError:
    print("No log file")
else:
    errors = list(errors_only(records))
    print("Lines parsed:", len(records))
    print("Errors:", len(errors))
    if not errors:
        print("All quiet")
    else:
        by_service = Counter(service for _, service, _ in errors)
        by_message = Counter(message for _, _, message in errors)
        print("Worst service:", by_service.most_common(1)[0][0])
        print("Top message:", by_message.most_common(1)[0][0])`, R`from collections import Counter

def read_lines(path):
    with open(path) as f:
        for line in f:
            line = line.strip()
            if line:
                yield line

def parse(lines):
    for line in lines:
        parts = line.split()
        if len(parts) == 5:
            yield parts[2], parts[3], parts[4]

def errors_only(records):
    for record in records:
        if record[0] in ("ERROR", "CRITICAL"):
            yield record

try:
    records = list(parse(read_lines("app.log")))
except FileNotFoundError:
    print("No log file")
else:
    errors = list(errors_only(records))
    print("Lines parsed:", len(records))
    print("Errors:", len(errors))
    if not errors:
        print("All quiet")
    else:
        by_service = Counter(service for _, service, _ in errors)
        by_message = Counter(message for _, _, message in errors)
        worst = sorted(by_service.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        top = sorted(by_message.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
        print("Worst service:", worst)
        print("Top message:", top)`],
    hints:['read_lines opens the file with `with open(path) as f:` and yields each stripped, non-empty line (iterating f is lazy).','parse: parts = line.split(maxsplit=4); if len(parts) == 5 yield (level, service, message) = parts[2], parts[3], parts[4].','Collect records with list(parse(read_lines("app.log"))) inside try / except FileNotFoundError. Counter plus sorted(..., key=lambda kv: (-kv[1], kv[0])) handles ties.','from collections import Counter\n\ndef read_lines(path):\n    with open(path) as f:\n        for line in f:\n            line = line.strip()\n            if line:\n                yield line\n\ndef parse(lines):\n    for line in lines:\n        parts = line.split(maxsplit=4)\n        if len(parts) == 5:\n            yield parts[2], parts[3], parts[4]\n\ndef errors_only(records):\n    for record in records:\n        if record[0] in ("ERROR", "CRITICAL"):\n            yield record\n\ntry:\n    records = list(parse(read_lines("app.log")))\nexcept FileNotFoundError:\n    print("No log file")\nelse:\n    errors = list(errors_only(records))\n    print("Lines parsed:", len(records))\n    print("Errors:", len(errors))\n    if not errors:\n        print("All quiet")\n    else:\n        by_service = Counter(service for _, service, _ in errors)\n        by_message = Counter(message for _, _, message in errors)\n        worst = sorted(by_service.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]\n        top = sorted(by_message.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]\n        print("Worst service:", worst)\n        print("Top message:", top)']},
  power:{can:['Process files lazily with a generator pipeline','Parse messy input without crashing on bad lines'],
    expand:'Add a `--level` style input so the user can choose which levels count as errors.',
    where:'This is how real log analysers, ETL jobs and monitoring scripts are structured.',
    next:'Next: decorators. Functions that wrap functions.'},
  codex:{title:'Mission: Log Pipeline',body:'read_lines -> parse -> filter, all generators; split(maxsplit=4) keeps the message intact; skip malformed lines; Counter for statistics; tie-break with sorted(key=(-count, name)).',snip:R`parts = line.split(maxsplit=4)
if len(parts) == 5:
    yield parts[2], parts[3], parts[4]`}
}
);
