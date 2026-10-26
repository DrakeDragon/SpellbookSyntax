// REALM 13 — THE INTERVIEW ARENA — part C (lessons 19-25: measuring and optimizing)
{
const s19 = R`import time

size = int(input("Size: "))
data = list(range(size))
lookup = set(data)
targets = [size - 1] * 300
start = time.perf_counter()
for t in targets:
    t in data
list_time = time.perf_counter() - start
start = time.perf_counter()
for t in targets:
    t in lookup
set_time = time.perf_counter() - start
print("Set is faster:", set_time < list_time)
print("Lookups:", len(targets))`;
const e19 = R`import time

start = time.perf_counter()              # a high-resolution stopwatch
total = 0
for n in range(200000):
    total += n
elapsed = time.perf_counter() - start    # ALWAYS: end minus start
print(total, elapsed >= 0)
data = list(range(10000))
lookup = set(data)
start = time.perf_counter()
for _ in range(200):
    9999 in data                         # scans the list every time
slow = time.perf_counter() - start
start = time.perf_counter()
for _ in range(200):
    9999 in lookup                       # one hash lookup
fast = time.perf_counter() - start
print("set wins:", fast < slow)
# never trust a guess: measure, change ONE thing, measure again`;

const s20 = R`from functools import lru_cache

rows = int(input("Rows: "))
cols = int(input("Cols: "))

@lru_cache(maxsize=None)
def paths(r, c):
    if r == 0 or c == 0:
        return 1
    return paths(r - 1, c) + paths(r, c - 1)

print("Paths:", paths(rows, cols))
print("Cached calls:", paths.cache_info().currsize)`;
const h20 = R`rows = int(input("Rows: "))
cols = int(input("Cols: "))

def paths(r, c):
    if r == 0 or c == 0:
        return 1
    return paths(r - 1, c) + paths(r, c - 1)

`;
const e20 = R`from functools import lru_cache

calls = 0

@lru_cache(maxsize=None)                 # remember every answer by its arguments
def fib(n):
    global calls
    calls += 1
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(30), calls)                    # only 31 real calls instead of 1.6 million
print(fib.cache_info().hits, fib.cache_info().misses)
fib.cache_clear()                        # forget everything (useful in tests)
# works only for PURE functions: same arguments must always give the same answer`;

const s21 = R`def evens_squared(limit):
    for n in range(limit):
        if n % 2 == 0:
            yield n * n

limit = int(input("Limit: "))
print("Total:", sum(evens_squared(limit)))`;
const e21 = R`def squares(limit):
    for n in range(limit):
        yield n * n                      # hand back ONE value, pause, resume later

gen = squares(5)
print(next(gen), next(gen), next(gen))   # 0 1 4
print(list(gen))                         # what is left: [9, 16]
print(list(gen))                         # a generator is spent after one pass: []
print(sum(n * n for n in range(1000000)))     # no list of a million items is ever built
big_list = [n for n in range(1000000)]   # this one holds ALL million in memory
print(len(big_list))`;

const s22 = R`from collections import Counter

words = input("Words: ").lower().split()
k = int(input("Top: "))
counts = Counter(words)
ranked = sorted(counts.items(), key=lambda pair: (-pair[1], pair[0]))
for word, n in ranked[:k]:
    print(f"{word}: {n}")
print("Distinct:", len(counts))`;
const e22 = R`from collections import Counter

counts = Counter("mississippi")
print(counts.most_common(2))             # [('i', 4), ('s', 4)]
words = ["pear", "fig", "apple", "kiwi"]
print(sorted(words, key=len))            # key= says WHAT to sort by
print(sorted(words, key=lambda w: (-len(w), w)))   # tuples: longest first, then A-Z
print(max(words, key=len), min(words))
print(sum(len(w) for w in words), any(len(w) > 4 for w in words), all(w for w in words))
print(", ".join(words))                  # join builds a string in one go
# built-ins are written in C: they beat hand-written loops almost every time`;

const h23 = R`step = int(input("Step: "))
words = [f"w{(i * 7) % 20011}" for i in range(60000)]
blocked = [f"w{i}" for i in range(0, 20011, step)]
`;
const s23 = h23 + R`blocked_set = set(blocked)
allowed = sum(1 for w in words if w not in blocked_set)
print("Allowed:", allowed)
print("Blocked entries:", len(blocked))`;
const e23 = R`words = ["a", "b", "c", "d"] * 5
blocked = ["b", "d"]
blocked_set = set(blocked)               # build the set ONCE, outside the loop
print(sum(1 for w in words if w not in blocked_set))
# the same idea, three more times:
square = 7 * 7                           # hoist work that never changes out of the loop
cache = {}
cache["x"] = cache.get("x", 0) + 1       # remember results instead of recomputing
unique = set(words)                      # dedupe
print(len(unique), square, cache)
# slow: "if w in blocked_list" scans the whole list for every word`;

const h24 = R`import bisect

q = int(input("Queries: "))
prices = sorted((i * i * 31) % 5003 for i in range(50000))
total = 0
last = 0
`;
const s24 = h24 + R`for i in range(q):
    lo = (i * 13) % 5003
    hi = lo + (i * 7) % 300
    last = bisect.bisect_right(prices, hi) - bisect.bisect_left(prices, lo)
    total += last
print("Total:", total)
print("Last:", last)`;
const e24 = R`import bisect

data = [1, 3, 3, 5, 7]                   # MUST be sorted
print(bisect.bisect_left(data, 3))       # first position where 3 could go: 1
print(bisect.bisect_right(data, 3))      # just after the last 3: 3
print(bisect.bisect_right(data, 6) - bisect.bisect_left(data, 3))   # how many in [3, 6]: 3
bisect.insort(data, 4)                   # insert and stay sorted
print(data)
# each bisect is O(log n): 1,000,000 sorted items need only ~20 steps`;

const h25 = R`n = int(input("Events: "))
limit = int(input("Limit: "))
events = [(f"user{(i * i) % 997}", (i * 37) % 500) for i in range(n)]
`;
const s25 = h25 + R`from collections import defaultdict

totals = defaultdict(int)
for user, amount in events:
    totals[user] += amount
ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0]))
print("Users:", len(totals))
for user, total in ranked[:3]:
    print(f"{user}: {total}")
print("Big spenders:", sum(1 for t in totals.values() if t > limit))`;
const e25 = R`from collections import defaultdict

events = [("ana", 5), ("bo", 2), ("ana", 7)]
totals = defaultdict(int)                # missing keys start at 0
for user, amount in events:
    totals[user] += amount               # ONE pass, no searching
print(dict(totals))
ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0]))
print(ranked[0])
print(sum(1 for t in totals.values() if t > 6))
# slow way: for every user, loop over ALL events again: users x events steps`;

LESSONS.push(
{
  id:'r13-19', realm:13, n:19, title:'Measure first: timing with perf_counter',
  teaches:['opt-measure'], requires:['mission13b'],
  story:`Quill points at a sluggish contraption. "Everyone has a theory about what is slow," Quill says, "and most theories are wrong. Pros don't guess. They put a **stopwatch** on it."`,
  concept:{
    html:`**Premature optimization is the root of all evil** — but so is guessing. First **measure**.\n\n\`\`\`\nimport time\nstart = time.perf_counter()\n... the code you suspect ...\nelapsed = time.perf_counter() - start     # end minus start!\n\`\`\`\n\n- \`time.perf_counter()\` is the right stopwatch for timing code (not \`time.time()\`).\n- Change **one thing at a time**, then measure again.\n- Run the test **more than once**: the first run can be slower (warm-up) and other programs add noise. Use many repetitions of a tiny operation (e.g. 300 lookups) so the difference is big.\n- Compare **big** differences (a set vs a list is a thousand times, not 5%).\n- Never print the raw seconds in tests or docs: they change every run. Print a conclusion like \`faster: True\`.\n- \`timeit\` and \`cProfile\` do this at scale: \`cProfile\` shows **which function** eats the time.\n- Order of work: **correct first, measured second, optimized third.**`,
    analogy:`A doctor takes your temperature before prescribing: you don't guess the illness.`,
    example:e19},
  predict:{code:R`data = [1, 2, 3]
lookup = set(data)
print(3 in data, 3 in lookup)`, q:'What prints?', opts:['True True','True False','False True'], ans:0, why:'Both containers hold 3; the difference is how fast they find it, not the answer.'},
  cast:{code:e19, task:'Cast it.'},
  bug:{broken:R`import time

start = time.perf_counter()
total = sum(range(1000))
elapsed = start - time.perf_counter()
print("Elapsed ok:", elapsed >= 0)`, task:'The elapsed time is negative because the subtraction is backwards. It must be end minus start. Expected: Elapsed ok: True',
    cases:[{inputs:[],tests:[['Works','lines==["Elapsed ok: True"]'],['End minus start','"time.perf_counter() - start" in src']]}],
    sol:R`import time

start = time.perf_counter()
total = sum(range(1000))
elapsed = time.perf_counter() - start
print("Elapsed ok:", elapsed >= 0)`, wrong:[R`print("Elapsed ok: True")`]},
  write:{prompt:'Ask `Size: `. Make `data = list(range(size))` and a `set` of the same numbers. Time 300 lookups of the **last** number in the list, then 300 lookups in the set, using `time.perf_counter()`. Print `Set is faster: <True/False>` and `Lookups: 300`.',
    starter:R`import time

size = int(input("Size: "))
data = list(range(size))
`,
    inputs:['20000'],
    cases:[{inputs:['20000'],tests:[['Set wins',eqL(['Set is faster: True','Lookups: 300'])],['Really timed','"perf_counter" in src']]},{inputs:['50000'],tests:[['Bigger data',eqL(['Set is faster: True','Lookups: 300'])]]}],
    sol:s19,
    wrong:[s19.replace('set_time < list_time','list_time < set_time'),R`print("Set is faster: True")
print("Lookups: 300")`,s19.replace('[size - 1] * 300','[size - 1] * 30')],
    hints:['Make lookup = set(data) and targets = [size - 1] * 300.','Wrap each loop: start = time.perf_counter() ... time.perf_counter() - start.','Print "Set is faster:" with set_time < list_time, then "Lookups:" and len(targets).',s19]},
  power:{can:['Time code with perf_counter','Compare two approaches fairly'],
    expand:'Time sorted() against list.sort() on 100,000 numbers and print which is faster.',
    where:'Profiling tells you where the time really goes before you rewrite anything.',
    next:'Next: caching, never solve the same problem twice.'},
  codex:{title:'Measure first',body:'start = time.perf_counter(); ...; elapsed = time.perf_counter() - start (end minus start). Repeat small operations, change one thing at a time, print conclusions not raw seconds. cProfile finds the slow function. Correct, then measured, then optimized.',snip:R`start = time.perf_counter()
elapsed = time.perf_counter() - start`}
},
{
  id:'r13-20', realm:13, n:20, title:'Caching with lru_cache',
  teaches:['opt-cache'], requires:['opt-measure'],
  story:`A scribe at the Arena keeps answering the same question over and over, working it out from scratch each time. Quill hands him a notebook. "Write the answer down the first time. Next time, just read it."`,
  concept:{
    html:`**Memoization** = remember a function's results by its arguments. Python does it with one line:\n\n\`\`\`\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef paths(r, c):\n    if r == 0 or c == 0:\n        return 1\n    return paths(r - 1, c) + paths(r, c - 1)\n\`\`\`\n\n- Plain recursion like Fibonacci or grid paths re-solves the same sub-problems **exponentially** many times. With a cache each sub-problem is solved **once**.\n- \`paths(16, 16)\` without a cache makes hundreds of millions of calls; with it, 288.\n- \`fn.cache_info()\` shows \`hits\`, \`misses\` and \`currsize\` (entries stored). \`fn.cache_clear()\` empties it.\n- Only use it on **pure** functions (same arguments → same answer, no side effects), with **hashable** arguments (numbers, strings, tuples; not lists).\n- \`maxsize=None\` keeps everything; a number keeps only the most recently used.\n- This is the top-down version of **dynamic programming** (coming up).`,
    analogy:`A notebook of answers: work it out once, then look it up forever.`,
    example:e20},
  predict:{code:R`from functools import lru_cache
calls = 0

@lru_cache(maxsize=None)
def f(n):
    global calls
    calls += 1
    return n * 2

f(3); f(3); f(4)
print(calls)`, q:'What prints?', opts:['2','3','1'], ans:0, why:'f(3) runs once and is then cached; f(4) is new. Two real calls.'},
  cast:{code:e20, task:'Cast it.'},
  bug:{broken:R`@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))`, task:'NameError: lru_cache was never imported. Import it from functools. Expected: 55',
    cases:[{inputs:[],tests:[['Works','lines==["55"]'],['Import','"from functools import lru_cache" in src']]}],
    sol:R`from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))`, wrong:[R`print(55)`]},
  write:{prompt:'Count the routes across a grid moving only up or left. `paths(r, c)` is 1 when either number is 0, else `paths(r-1, c) + paths(r, c-1)`. The slow version is given. Add `lru_cache` so `Rows: 16`, `Cols: 16` answers instantly. Print `Paths: <n>` and `Cached calls: <how many results the cache holds>` (use `cache_info().currsize`).',
    starter:h20 + R`print("Paths:", paths(rows, cols))
`,
    inputs:['2','2'],
    cases:[{inputs:['2','2'],tests:[['Small grid',eqL(['Paths: 6','Cached calls: 8'])]]},{inputs:['1','1'],tests:[['One by one',eqL(['Paths: 2','Cached calls: 3'])]]},{inputs:['0','5'],tests:[['Zero rows',eqL(['Paths: 1','Cached calls: 1'])]]},{inputs:['16','16'],tests:[['Needs a cache or it times out',eqL(['Paths: 601080390','Cached calls: 288'])]]}],
    sol:s20,
    wrong:[s20.replace('@lru_cache(maxsize=None)\n',''),s20.replace('        return 1','        return 2'),s20.replace('paths(r - 1, c) + paths(r, c - 1)','paths(r - 1, c) * paths(r, c - 1)'),s20.replace('paths.cache_info().currsize','0')],
    hints:['Import lru_cache from functools and put @lru_cache(maxsize=None) on the line above def paths.','The recursion stays exactly the same: the decorator does the remembering.','Print Paths: with paths(rows, cols), then Cached calls: with paths.cache_info().currsize.',s20]},
  power:{can:['Memoize recursive functions with lru_cache','Turn exponential time into linear'],
    expand:'Print cache_info().hits too and explain why it is so large.',
    where:'Caching is the cheapest big speed-up in software: web pages, database queries and game AI all use it.',
    next:'Next: generators, working through data without holding all of it.'},
  codex:{title:'lru_cache',body:'from functools import lru_cache; @lru_cache(maxsize=None) above a PURE function with hashable args. cache_info() -> hits, misses, currsize; cache_clear() empties it. Turns repeated sub-problems from exponential into one-time work.',snip:R`@lru_cache(maxsize=None)
def solve(n): ...`}
},
{
  id:'r13-21', realm:13, n:21, title:'Generators: lazy data without the memory bill',
  teaches:['opt-generator'], requires:['opt-cache'],
  story:`The Arena has a corridor of a million scrolls. A greedy clerk carries every scroll to his desk before reading the first. "He wastes his back and the whole morning," Quill sighs. "Fetch ONE scroll, read it, and fetch the next."`,
  concept:{
    html:`A **generator** produces values **one at a time, on demand**, instead of building a whole list.\n\n\`\`\`\ndef evens_squared(limit):\n    for n in range(limit):\n        if n % 2 == 0:\n            yield n * n          # hand back a value, pause here\n\ntotal = sum(evens_squared(1000000))\n\`\`\`\n\n- \`yield\` makes the function a generator. Each \`next()\` runs until the next \`yield\`.\n- A generator **expression** is a list comprehension in round brackets: \`(n * n for n in range(10))\`.\n- Memory: a list of a million items needs megabytes; a generator needs a few bytes because only one item exists at a time.\n- A generator can be used **only once**. A second \`sum()\` over the same generator gets 0, because it is already used up.\n- \`sum\`, \`max\`, \`min\`, \`any\`, \`all\`, \`for\` and \`sorted\` all accept generators.\n- Use a list when you need indexing, \`len\` or several passes; use a generator for a one-pass stream (big files, endless sequences, pipelines).`,
    analogy:`A tap versus a bucket: the tap gives water when you ask; the bucket makes you carry it all first.`,
    example:e21},
  predict:{code:R`g = (n for n in range(3))
print(next(g), next(g), list(g))`, q:'What prints?', opts:['0 1 [2]','0 1 [0, 1, 2]','0 1 []'], ans:0, why:'Two values were taken with next; list(g) gets whatever is left: [2].'},
  cast:{code:e21, task:'Cast it.'},
  bug:{broken:R`squares = (n * n for n in range(4))
print(sum(squares))
print(sum(squares))`, task:'A generator is used up after one pass, so the second sum is 0. Make it a list so it can be reused. Expected: 14 then 14',
    cases:[{inputs:[],tests:[['Works','lines==["14","14"]'],['List not generator','"[n * n" in src or "list(" in src']]}],
    sol:R`squares = [n * n for n in range(4)]
print(sum(squares))
print(sum(squares))`, wrong:[R`print(14)
print(14)`]},
  write:{prompt:'Write a **generator function** `evens_squared(limit)` that yields `n * n` for each even `n` below `limit`. Ask `Limit: ` and print `Total: <sum of the generator>`. It must work for 1,000,000 without building a list.',
    starter:R`def evens_squared(limit):
    pass

limit = int(input("Limit: "))
`,
    inputs:['10'],
    cases:[{inputs:['10'],tests:[['Small',eqL(['Total: 120'])],['Is a generator','"yield" in src']]},{inputs:['0'],tests:[['Zero',eqL(['Total: 0'])]]},{inputs:['1'],tests:[['Only zero',eqL(['Total: 0'])]]},{inputs:['1000000'],tests:[['A million',eqL(['Total: 166666166667000000'])]]}],
    sol:s21,
    wrong:[s21.replace('def evens_squared(limit):\n    for n in range(limit):\n        if n % 2 == 0:\n            yield n * n','def evens_squared(limit):\n    return [n * n for n in range(limit) if n % 2 == 0]'),s21.replace('n % 2 == 0','n % 2 == 1'),s21.replace('range(limit)','range(limit + 1)')],
    hints:['Inside the function loop for n in range(limit).','Only when n % 2 == 0, yield n * n.','Call sum(evens_squared(limit)) and print "Total:" with it.',s21]},
  power:{can:['Write generator functions with yield','Process streams without storing them'],
    expand:'Write a generator `countdown(n)` that yields n, n-1, ... 1 and loop over it.',
    where:'Reading huge files line by line, streaming API pages and data pipelines are all generators.',
    next:'Next: built-ins and the standard library are faster than your loops.'},
  codex:{title:'Generators',body:'yield makes a function lazy: values are produced one at a time. (expr for x in data) is a generator expression. One pass only: used up after. Feed them to sum/max/min/any/all/for. Use a list when you need len, indexing or reuse.',snip:R`def stream(n):
    for i in range(n):
        yield i * i`}
},
{
  id:'r13-22', realm:13, n:22, title:'Let the built-ins do the heavy lifting',
  teaches:['opt-builtins'], requires:['opt-generator'],
  story:`Quill watches you count words with three nested loops and smiles. "Python's toolbox was written in C by people who care about speed. Before you build a machine, check whether the Arena already owns one."`,
  concept:{
    html:`Built-in tools run in fast compiled code. Your own loops run in slow Python. Prefer:\n\n- \`Counter(items)\` to count; \`.most_common(k)\` for the top k.\n- \`sorted(items, key=...)\`: \`key\` says **what to sort by**. A tuple key sorts by several things: \`key=lambda p: (-p[1], p[0])\` = biggest count first, ties **A to Z**.\n- \`max(items, key=len)\`, \`min\`, \`sum\`, \`any\`, \`all\`.\n- \`", ".join(parts)\` to build a string (not \`+=\` in a loop).\n- \`set\` for unique and fast membership; \`dict.get\` for safe lookups.\n- \`enumerate\`, \`zip\`, comprehensions instead of manual index counting.\n\nTie-breaking matters: **always give your sort a deterministic tie-break** (like the word itself) so answers never depend on arrival order.\n\nNormalise input first (\`.lower()\`) so "The" and "the" are one word.\n\nThe skill that interviewers like to see: *know the standard library before reinventing it*.`,
    analogy:`A professional workshop: before you hand-carve a screw, check the drawer of ready-made ones.`,
    example:e22},
  predict:{code:R`from collections import Counter
print(Counter("hello").most_common(1))`, q:'What prints?', opts:["[('l', 2)]","[('h', 1)]","('l', 2)"], ans:0, why:"most_common(1) gives a list with the single (item, count) pair: l appears twice."},
  cast:{code:e22, task:'Cast it.'},
  bug:{broken:R`from collections import Counter
counts = Counter("abbccc")
print(sorted(counts, key=counts.get)[0])`, task:'This prints the LEAST common letter. We want the most common. Expected: c',
    cases:[{inputs:[],tests:[['Works','lines==["c"]'],['Uses the right tool','"reverse" in src or "most_common" in src or "max(" in src']]}],
    sol:R`from collections import Counter
counts = Counter("abbccc")
print(counts.most_common(1)[0][0])`, wrong:[R`print("c")`]},
  write:{prompt:'Ask `Words: ` (lower-case them) and `Top: `. Count with `Counter`. Print the `Top` most frequent as `<word>: <count>`, most frequent first and **alphabetical** among equal counts. Then print `Distinct: <number of different words>`.',
    starter:R`from collections import Counter

words = input("Words: ").lower().split()
k = int(input("Top: "))
`,
    inputs:['the cat the dog The end','2'],
    cases:[{inputs:['the cat the dog The end','2'],tests:[['Top two',eqL(['the: 3','cat: 1','Distinct: 4'])]]},{inputs:['b a b a c','2'],tests:[['Ties alphabetical',eqL(['a: 2','b: 2','Distinct: 3'])]]},{inputs:['','3'],tests:[['Nothing',eqL(['Distinct: 0'])]]},{inputs:['x','5'],tests:[['Top larger than distinct',eqL(['x: 1','Distinct: 1'])]]},{inputs:['A a B','1'],tests:[['Case does not matter',eqL(['a: 2','Distinct: 2'])]]}],
    sol:s22,
    wrong:[s22.replace('key=lambda pair: (-pair[1], pair[0])','key=lambda pair: (pair[1], pair[0])'),s22.replace('key=lambda pair: (-pair[1], pair[0])','key=lambda pair: -pair[1]'),s22.replace('print("Distinct:", len(counts))','print("Distinct:", sum(counts.values()))'),s22.replace('.lower()','')],
    hints:['counts = Counter(words) then sort counts.items().','Use key=lambda pair: (-pair[1], pair[0]) so biggest count comes first and ties go A to Z.','Loop over ranked[:k] to print "word: n"; finish with Distinct: len(counts).',s22]},
  power:{can:['Use Counter and sorted with a key','Break ties deterministically'],
    expand:'Add a `Min length:` question and ignore shorter words.',
    where:'Word clouds, log summaries and analytics all start with count-then-rank.',
    next:'Next: stop repeating work inside loops.'},
  codex:{title:'Built-ins first',body:'Counter + most_common; sorted(key=...), tuple keys with -count then name for deterministic ties; max/min(key=); sum/any/all; "sep".join(list); set for unique and fast `in`. Normalise with lower() first.',snip:R`ranked = sorted(counts.items(), key=lambda p: (-p[1], p[0]))`}
},
{
  id:'r13-23', realm:13, n:23, title:'Stop repeating work: the right container',
  teaches:['opt-hoist'], requires:['opt-builtins'],
  story:`The Arena gatekeeper checks every visitor against a scroll of banned names. Each time he unrolls the WHOLE scroll and reads from the top. A queue of sixty thousand people stretches out the door. "Index the banned names once," Quill says. "Then each check takes a blink."`,
  concept:{
    html:`The most common real-world slowdown: **doing the same expensive thing inside a loop.**\n\n\`\`\`\n# slow: scans the whole list for EVERY word    (words x blocked steps)\nallowed = sum(1 for w in words if w not in blocked)\n\n# fast: build the set ONCE, then each check is O(1)\nblocked_set = set(blocked)\nallowed = sum(1 for w in words if w not in blocked_set)\n\`\`\`\n\nFour habits that remove most slowness:\n1. **Right container**: membership tests belong on a \`set\` or \`dict\`, not a \`list\`.\n2. **Hoist**: compute anything that does not change **outside** the loop.\n3. **Remember**: store results in a dict so you never compute twice.\n4. **Dedupe**: \`set(items)\` before looping if repeats are pointless.\n\nSixty thousand words against five thousand blocked entries is **300 million** comparisons as a list, and **60 thousand** as a set.\n\nThe answer must **not change**: faster code that gives a different result is just broken. That is why the tests check the output.`,
    analogy:`An index at the back of a book instead of reading every page to find a word.`,
    example:e23},
  predict:{code:R`print(len(set([1, 2, 2, 3, 3, 3])))`, q:'What prints?', opts:['3','6','1'], ans:0, why:'A set keeps one of each: 1, 2 and 3.'},
  cast:{code:e23, task:'Cast it.'},
  bug:{broken:R`seen = {}
for w in ["a", "b", "a"]:
    seen.add(w)
print(len(seen))`, task:'{} makes an empty DICT, which has no .add. Make an empty set. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['A real set','"set()" in src']]}],
    sol:R`seen = set()
for w in ["a", "b", "a"]:
    seen.add(w)
print(len(seen))`, wrong:[R`print(2)`]},
  write:{prompt:'Ask `Step: `. The list `words` (60,000 words) and the list `blocked` are made for you. Count the words that are **not** blocked. Print `Allowed: <n>` and `Blocked entries: <len(blocked)>`. With a list the check takes about 200 million steps and times out, so use a set.',
    starter:h23,
    inputs:['4'],
    cases:[{inputs:['4'],tests:[['Step 4 (needs a set)',eqL(['Allowed: 45000','Blocked entries: 5003'])]]},{inputs:['1'],tests:[['Everything blocked',eqL(['Allowed: 0','Blocked entries: 20011'])]]},{inputs:['20011'],tests:[['Almost nothing blocked',eqL(['Allowed: 59997','Blocked entries: 1'])]]},{inputs:['3'],tests:[['Step 3',eqL(['Allowed: 39998','Blocked entries: 6671'])]]}],
    sol:s23,
    wrong:[h23 + R`allowed = sum(1 for w in words if w not in blocked)
print("Allowed:", allowed)
print("Blocked entries:", len(blocked))`,s23.replace('if w not in blocked_set','if w in blocked_set'),s23.replace('len(blocked))','len(blocked_set) - 1)')],
    hints:['The slowness is "w not in blocked" on a list. Turn blocked into a set first.','blocked_set = set(blocked) once, outside the loop.','allowed = sum(1 for w in words if w not in blocked_set); print both lines.',s23]},
  power:{can:['Spot repeated work inside loops','Switch to a set for O(1) membership'],
    expand:'Also print how many DIFFERENT allowed words there are using a set.',
    where:'Filtering against banlists, permission checks and deduplication all depend on this.',
    next:'Next: sorted data and binary search with bisect.'},
  codex:{title:'Stop repeating work',body:'Membership tests -> set/dict, never list. Hoist unchanging work out of loops. Remember results in a dict. Dedupe with set(). Build lookup structures ONCE before the loop. Always check the answer stayed the same.',snip:R`blocked_set = set(blocked)
if w in blocked_set: ...`}
},
{
  id:'r13-24', realm:13, n:24, title:'Sorted data and bisect',
  teaches:['opt-bisect'], requires:['opt-hoist'],
  story:`The Arena price board is already in order from cheap to dear. "Customers keep asking how many items cost between two numbers," Quill says. "Don't count them one by one. Find where the range starts, find where it ends, and subtract."`,
  concept:{
    html:`When data is **sorted**, the \`bisect\` module finds positions in **O(log n)** with binary search.\n\n\`\`\`\nimport bisect\ndata = [1, 3, 3, 5, 7]\nbisect.bisect_left(data, 3)     # 1: the first spot where 3 could go\nbisect.bisect_right(data, 3)    # 3: just after the last 3\n\`\`\`\n\n**Count items in a range [lo, hi]** (both ends included):\n\n\`\`\`\nbisect.bisect_right(prices, hi) - bisect.bisect_left(prices, lo)\n\`\`\`\n\n- \`bisect_left\` for the **start** (includes values equal to lo); \`bisect_right\` for the **end** (includes values equal to hi). Swap them and equal values are miscounted.\n- \`bisect.insort(data, x)\` inserts while keeping order.\n- The list **must already be sorted**. On unsorted data, bisect silently gives garbage.\n- Sort **once**, then answer thousands of queries cheaply: 30,000 queries over 50,000 numbers is 1.5 billion steps by scanning, and about 500,000 with bisect.\n- Cost: sorting once is O(n log n); each query is O(log n).`,
    analogy:`Finding a word in a dictionary by opening to the middle, not reading from page one.`,
    example:e24},
  predict:{code:R`import bisect
d = [1, 3, 5, 7]
print(bisect.bisect_left(d, 5), bisect.bisect_right(d, 5))`, q:'What prints?', opts:['2 3','2 2','3 3'], ans:0, why:'5 sits at index 2; bisect_left returns 2, bisect_right returns just past it: 3.'},
  cast:{code:e24, task:'Cast it.'},
  bug:{broken:R`import bisect
data = [9, 1, 5, 3]
print(bisect.bisect_left(data, 3))`, task:'bisect needs sorted data. Sort first. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['Sorted','"sorted(" in src or ".sort(" in src']]}],
    sol:R`import bisect
data = sorted([9, 1, 5, 3])
print(bisect.bisect_left(data, 3))`, wrong:[R`print(1)`]},
  write:{prompt:'`prices` (50,000 sorted numbers with many repeats) is made for you. Ask `Queries: `. For `i` in `0..q-1`: `lo = (i * 13) % 5003`, `hi = lo + (i * 7) % 300`; count prices with `lo <= price <= hi` using `bisect` (no scanning). Print `Total: <sum of all counts>` and `Last: <the final count>` (0 if no queries).',
    starter:h24,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['Three queries',eqL(['Total: 208','Last: 178'])]]},{inputs:['0'],tests:[['None',eqL(['Total: 0','Last: 0'])]]},{inputs:['1'],tests:[['One query',eqL(['Total: 10','Last: 10'])]]},{inputs:['30000'],tests:[['Many queries (bisect or timeout)',eqL(['Total: 44285488','Last: 2479'])]]}],
    sol:s24,
    wrong:[s24.replace('bisect.bisect_left(prices, lo)','bisect.bisect_right(prices, lo)'),s24.replace('bisect.bisect_right(prices, hi)','bisect.bisect_left(prices, hi)'),s24.replace('last = bisect.bisect_right(prices, hi) - bisect.bisect_left(prices, lo)','last = sum(1 for p in prices if lo <= p <= hi)'),s24.replace('    total += last\n','')],
    hints:['For each query compute lo and hi with the given formulas.','Count = bisect_right(prices, hi) - bisect_left(prices, lo).','Add each count to total and remember the latest one in last.',s24]},
  power:{can:['Answer range queries with bisect','Combine sort-once with many fast queries'],
    expand:'Add a `Median price:` line using the sorted list.',
    where:'Leaderboards, time-range searches and price filters are bisect in disguise.',
    next:'Next: Real-World Mission, the Lag Hunt.'},
  codex:{title:'bisect',body:'Needs SORTED data. bisect_left(x) = first spot for x; bisect_right(x) = past the last x; count in [lo, hi] = bisect_right(hi) - bisect_left(lo). insort inserts and keeps order. O(log n) per query; sort once.',snip:R`count = bisect.bisect_right(data, hi) - bisect.bisect_left(data, lo)`}
},
{
  id:'r13-25', realm:13, n:25, title:'Real-World Mission: The Lag Hunt',
  teaches:['mission13c'], requires:['opt-bisect'],
  story:`The Arena billing report takes eleven minutes to run, and every night the team groans. Quill drops the ledger on the table. "A hundred thousand events. Find who spends the most. Do it in one pass, and make it finish before the kettle boils."`,
  concept:{
    html:`This mission uses everything from the optimizing level:\n\n1. **Measure** which part is slow (here: scanning all events once per user).\n2. **Right container**: a \`defaultdict(int)\` totals each user in **one pass**.\n3. **Built-ins**: \`sorted(..., key=lambda p: (-p[1], p[0]))\` ranks with deterministic ties.\n4. **Verify** the answer matches the slow version on small input.\n\n\`\`\`\ntotals = defaultdict(int)\nfor user, amount in events:\n    totals[user] += amount\n\`\`\`\n\n- \`defaultdict(int)\` gives missing keys the value 0, so \`+=\` just works.\n- One pass over n events is **O(n)**. The slow way (a pass per user) is **O(users × n)**.\n- Ranking the users afterwards is a small sort, because there are far fewer users than events.\n- \`Big spenders\` counts users whose total is **strictly greater** than the limit.\n- Always test the **empty** case (no events).\n\nThis exact pattern (group, total, rank) is the core of data analysis.`,
    analogy:`One walk down the till roll with a tally sheet, instead of re-reading the roll once per customer.`,
    example:e25},
  predict:{code:R`from collections import defaultdict
d = defaultdict(int)
d["x"] += 2
print(d["x"], d["y"], len(d))`, q:'What prints?', opts:['2 0 2','2 0 1','2 None 1'], ans:0, why:'Reading d["y"] creates it with the default 0, so there are two keys.'},
  cast:{code:e25, task:'Cast it.'},
  bug:{broken:R`totals = {}
for user, amount in [("a", 1), ("b", 2), ("a", 3)]:
    totals[user] += amount
print(totals)`, task:'A plain dict raises KeyError for a new user. Start missing users at 0. Expected: {\'a\': 4, \'b\': 2}',
    cases:[{inputs:[],tests:[['Works','lines==["{\'a\': 4, \'b\': 2}"]'],['Handles new keys','"defaultdict" in src or ".get(" in src or "setdefault" in src']]}],
    sol:R`from collections import defaultdict

totals = defaultdict(int)
for user, amount in [("a", 1), ("b", 2), ("a", 3)]:
    totals[user] += amount
print(dict(totals))`, wrong:[R`print({'a': 4, 'b': 2})`]},
  write:{prompt:'`events` (a list of `(user, amount)`) and `limit` are made for you. In **one pass** total each user. Print `Users: <count>`, then the **top 3** users as `<user>: <total>` (highest total first, ties alphabetical, fewer lines if fewer users), then `Big spenders: <users whose total is more than Limit>`. It must handle 100,000 events.',
    starter:h25,
    inputs:['10','100'],
    cases:[{inputs:['10','100'],tests:[['Ten events',eqL(['Users: 10','user81: 333','user64: 296','user49: 259','Big spenders: 7'])]]},{inputs:['0','10'],tests:[['No events',eqL(['Users: 0','Big spenders: 0'])]]},{inputs:['100000','51879'],tests:[['Big, two above the limit',eqL(['Users: 499','user169: 51881','user603: 51880','user501: 51879','Big spenders: 2'])]]},{inputs:['100000','0'],tests:[['Big, everyone',eqL(['Users: 499','user169: 51881','user603: 51880','user501: 51879','Big spenders: 499'])]]},{inputs:['2','0'],tests:[['Two events, fewer than three users',eqL(['Users: 2','user1: 37','user0: 0','Big spenders: 1'])]]}],
    sol:s25,
    wrong:[h25 + R`users = sorted(set(u for u, a in events))
totals = {u: sum(a for name, a in events if name == u) for u in users}
ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0]))
print("Users:", len(totals))
for user, total in ranked[:3]:
    print(f"{user}: {total}")
print("Big spenders:", sum(1 for t in totals.values() if t > limit))`,s25.replace('(-pair[1], pair[0])','(pair[1], pair[0])'),s25.replace('if t > limit','if t >= limit'),s25.replace('ranked[:3]','ranked[:2]')],
    hints:['Use totals = defaultdict(int) and add each amount in a single loop over events.','ranked = sorted(totals.items(), key=lambda pair: (-pair[1], pair[0])), then print the first three.','Big spenders: sum(1 for t in totals.values() if t > limit). Print Users: len(totals) first.',s25]},
  power:{can:['Group and total large data in one pass','Rank results deterministically'],
    expand:'Add the average amount per event for the top user.',
    where:'Sales reports, log analysis and dashboards all use group-total-rank.',
    next:'Next: from clever code to clean, well-organised code.'},
  codex:{title:'Group, total, rank',body:'defaultdict(int); one pass: totals[key] += value; sort items with key=(-total, name); take [:k]; count with a generator. O(n) instead of O(users x n). Test the empty case.',snip:R`totals = defaultdict(int)
for user, amount in events:
    totals[user] += amount`}
}
);
}
