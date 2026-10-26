// REALM 13 — THE INTERVIEW ARENA — part A (lessons 1-8: Big-O)
const eqL = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

const s01 = R`size = int(input("Size: "))
target = int(input("Target: "))
data = list(range(1, size + 1))
steps = 0
found = -1
for index, value in enumerate(data):
    steps += 1
    if value == target:
        found = index
        break
if found >= 0:
    print(f"Found at index {found} (steps: {steps})")
else:
    print(f"Not found (steps: {steps})")`;
const e01 = R`data = list(range(1, 11))        # 1..10
steps = 0
for value in data:
    steps += 1                    # count the work, not the seconds
    if value == 7:
        break
print("found 7 in", steps, "steps")

steps = 0
for value in data:
    steps += 1
print("looked at everything:", steps, "steps")
big = list(range(1, 101))         # ten times more data...
steps = sum(1 for _ in big)
print("...ten times the steps:", steps)`;

const s02 = R`n = int(input("n: "))
total = 0
steps = 0
for i in range(1, n + 1):
    total += i
    steps += 1
print(f"Loop: total={total} steps={steps}")
print(f"Formula: total={max(n, 0) * (max(n, 0) + 1) // 2} steps=1")`;
const e02 = R`def loop_sum(n):
    total = 0
    for i in range(1, n + 1):      # O(n): work grows with n
        total += i
    return total

def formula_sum(n):
    return n * (n + 1) // 2         # O(1): same work for any n

for n in (10, 1000, 1000000):
    print(n, loop_sum(n) == formula_sum(n), formula_sum(n))

items = [10, 20, 30]
print(items[2], len(items))         # O(1): jump straight to a position
items.append(40)                    # O(1) on average
print(30 in items)                  # O(n): has to look through the list`;

const s03 = R`numbers = [int(x) for x in input("Numbers: ").split()]
comparisons = 0
pairs = []
for i in range(len(numbers)):
    for j in range(i + 1, len(numbers)):
        comparisons += 1
        if numbers[i] == numbers[j]:
            pairs.append((i, j))
print("Comparisons:", comparisons)
print("Equal pairs:", len(pairs))
for i, j in pairs:
    print(f"{i},{j}")`;
const e03 = R`def pair_count(n):
    count = 0
    for i in range(n):
        for j in range(i + 1, n):    # a loop inside a loop: n * n / 2
            count += 1
    return count

for n in (4, 10, 100, 1000):
    print(n, pair_count(n), n * (n - 1) // 2)
# 10 times the data -> about 100 times the work: that is O(n squared)
print(pair_count(1000) / pair_count(100))`;

const h04 = R`n = int(input("Size: "))
d = int(input("Repeat: "))
numbers = list(range(1, n + 1)) + [d]
`;
const s04 = R`n = int(input("Size: "))
d = int(input("Repeat: "))
numbers = list(range(1, n + 1)) + [d]
seen = set()
lookups = 0
for n in numbers:
    lookups += 1
    if n in seen:
        print(f"First duplicate: {n} (lookups: {lookups})")
        break
    seen.add(n)
else:
    print(f"All unique (lookups: {lookups})")`;
const e04 = R`seen = set()
for n in [3, 1, 4, 1, 5]:
    if n in seen:                    # O(1) on average: hashing jumps straight to the answer
        print("duplicate", n)
        break
    seen.add(n)

ages = {"ada": 36, "bob": 41}
print(ages["bob"], "ada" in ages)    # dict lookups are O(1) on average, too

import time
big_list = list(range(200000))
big_set = set(big_list)
t = time.perf_counter(); 199999 in big_list; slow = time.perf_counter() - t
t = time.perf_counter(); 199999 in big_set;  fast = time.perf_counter() - t
print("set is faster:", fast < slow)`;

const s05 = R`size = int(input("Size: "))
target = int(input("Target: "))
data = [2 * i for i in range(size)]
low, high = 0, size - 1
probes = 0
while low <= high:
    mid = (low + high) // 2
    probes += 1
    if data[mid] == target:
        print(f"Found at index {mid} (probes: {probes})")
        break
    if data[mid] < target:
        low = mid + 1
    else:
        high = mid - 1
else:
    print(f"Missing (probes: {probes})")`;
const e05 = R`import math

def probes_needed(n):
    steps = 0
    while n > 1:
        n //= 2                # every probe throws away half of what is left
        steps += 1
    return steps + 1

for n in (10, 1000, 1000000, 1000000000):
    print(n, probes_needed(n), math.ceil(math.log2(n + 1)))
# a billion items: about 30 probes. That is O(log n).`;

const s06 = R`numbers = [int(x) for x in input("Numbers: ").split()]
comparisons = 0
for i in range(1, len(numbers)):
    key = numbers[i]
    j = i - 1
    while j >= 0:
        comparisons += 1
        if numbers[j] > key:
            numbers[j + 1] = numbers[j]
            j -= 1
        else:
            break
    numbers[j + 1] = key
print("Comparisons:", comparisons)
print("Sorted:", numbers)`;
const e06 = R`import math

def insertion_comparisons(nums):
    nums, count = list(nums), 0
    for i in range(1, len(nums)):
        key, j = nums[i], i - 1
        while j >= 0:
            count += 1
            if nums[j] > key:
                nums[j + 1] = nums[j]; j -= 1
            else:
                break
        nums[j + 1] = key
    return count

print(insertion_comparisons([1, 2, 3, 4, 5]))        # already sorted: best case, n - 1
print(insertion_comparisons([5, 4, 3, 2, 1]))        # reversed: worst case, about n * n / 2
n = 1000
print(n * n // 2, round(n * math.log2(n)))           # n squared vs n log n
print(sorted([3, 1, 2]))                              # Python's built-in: O(n log n)`;

const sizes07 = (n, q) => { const nums = Array.from({length:n}, (_, i) => (i * 7) % 101); const pre = [0]; for (const v of nums) pre.push(pre[pre.length-1] + v); let sum = 0; for (let i = 0; i < q; i++) { const l = i % 500, r = n - 1 - (i % 500); sum += pre[r+1] - pre[l]; } return sum; };
const s07 = R`n = int(input("Size: "))
q = int(input("Queries: "))
numbers = [(i * 7) % 101 for i in range(n)]
queries = [(i % 500, n - 1 - (i % 500)) for i in range(q)]      # (left, right), both included
prefix = [0]
for value in numbers:
    prefix.append(prefix[-1] + value)
checksum = 0
for left, right in queries:
    checksum += prefix[right + 1] - prefix[left]
print("Queries:", len(queries))
print("Checksum:", checksum)`;
const h07 = R`n = int(input("Size: "))
q = int(input("Queries: "))
numbers = [(i * 7) % 101 for i in range(n)]
queries = [(i % 500, n - 1 - (i % 500)) for i in range(q)]      # (left, right), both included
`;
const e07 = R`numbers = [3, 1, 4, 1, 5]
prefix = [0]                          # prefix[k] = sum of the first k numbers
for value in numbers:
    prefix.append(prefix[-1] + value)
print(prefix)                         # costs O(n) time and O(n) extra memory, once
left, right = 1, 3
print(prefix[right + 1] - prefix[left], sum(numbers[left:right + 1]))   # O(1) per question now
# trade-off: spend memory (the prefix list) to save time on every later query`;

const amounts08 = n => { const c = new Map(); for (let i = 0; i < n; i++) { const a = (i * i) % 9973; c.set(a, (c.get(a) || 0) + 1); } const dups = [...c].filter(([, v]) => v > 1); if (!dups.length) return ['Invoices: ' + n, 'No duplicates']; dups.sort((a, b) => b[1] - a[1] || a[0] - b[0]); let pairs = 0; for (const [, v] of c) pairs += v * (v - 1) / 2; return ['Invoices: ' + n, 'Duplicate amounts: ' + dups.length, 'Most repeated: ' + dups[0][0] + ' (x' + dups[0][1] + ')', 'Equal pairs: ' + pairs]; };
const s08 = R`from collections import Counter

n = int(input("Invoices: "))
amounts = [(i * i) % 9973 for i in range(n)]
counts = Counter(amounts)
repeated = {amount: c for amount, c in counts.items() if c > 1}
print("Invoices:", n)
if not repeated:
    print("No duplicates")
else:
    best = min(repeated, key=lambda amount: (-repeated[amount], amount))
    print("Duplicate amounts:", len(repeated))
    print(f"Most repeated: {best} (x{repeated[best]})")
    print("Equal pairs:", sum(c * (c - 1) // 2 for c in counts.values()))`;
const h08 = R`from collections import Counter

n = int(input("Invoices: "))
amounts = [(i * i) % 9973 for i in range(n)]
`;
const g08 = s08.slice(s08.indexOf('counts = Counter'));
const e08 = R`from collections import Counter

amounts = [5, 3, 5, 5, 3, 9]
counts = Counter(amounts)                 # one pass: O(n)
print(counts.most_common(1))              # [(5, 3)]
print({a for a, c in counts.items() if c > 1})
print(sum(c * (c - 1) // 2 for c in counts.values()))   # equal pairs, without comparing every pair
# the slow way compares every pair: n * (n - 1) / 2 steps. For 40000 invoices that is 800 million.`;

LESSONS.push(
{
  id:'r13-01', realm:13, n:1, title:'Counting steps, not seconds',
  teaches:['bigo-count'], requires:['realm12-gap'],
  story:`Beyond the Master Gate lies the **Interview Arena**, a ring of sand where Archmage Quill sits among scorekeepers. "Interviewers do not ask *does it work?*" Quill says. "They ask *does it still work with a million items?* To answer, we count **steps**, not seconds."`,
  concept:{
    html:`Stopwatches lie: a fast computer makes bad code look good. Programmers instead count **steps** (basic operations) as the **input size** grows.\n\n\`\`\`\nsteps = 0\nfor value in data:\n    steps += 1\n    if value == target:\n        break          # stop as soon as we find it\n\`\`\`\n\n- A **linear search** checks items one by one. If the target is first it takes **1** step; if it is last (or missing) it takes **n** steps.\n- **Best case**, **worst case** and **average case** can differ. Interviews usually ask about the **worst case**.\n- \`break\` ends the loop early: forgetting it makes you do extra work.\n- The question that matters: *if the data is 10 times bigger, how many times more steps?*\n- This idea is called **time complexity**. The notation, **Big-O**, comes next.\n\n💡 You will count steps with a plain counter variable. It is the most honest tool you have.`,
    analogy:`Finding a name in a phone book by reading every line: ten times the book means ten times the reading.`,
    example:e01},
  predict:{code:R`data = [5, 8, 2, 9]
steps = 0
for x in data:
    steps += 1
    if x == 8:
        break
print(steps)`, q:'What prints?', opts:['2','4','1'], ans:0, why:'The loop stops after checking 5 and 8: two steps.'},
  cast:{code:e01, task:'Cast it.'},
  bug:{broken:R`data = [5, 8, 2, 9]
steps = 0
for x in data:
    steps += 1
    if x == 8:
        pass
print(steps)`, task:'The search keeps going after finding 8. Stop early. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Uses break','"break" in src']]}],
    sol:R`data = [5, 8, 2, 9]
steps = 0
for x in data:
    steps += 1
    if x == 8:
        break
print(steps)`, wrong:[R`print(2)`]},
  write:{prompt:'Ask `Size: ` and `Target: `. The data is the list `1, 2, ..., size`. Do a **linear search** for the target, counting one step per item looked at. Print `Found at index <i> (steps: <k>)` or `Not found (steps: <k>)`. Stop as soon as you find it.',
    starter:R`size = int(input("Size: "))
target = int(input("Target: "))
data = list(range(1, size + 1))
`,
    inputs:['10','7'],
    cases:[{inputs:['10','1'],tests:[['First item',eqL(['Found at index 0 (steps: 1)'])]]},{inputs:['10','7'],tests:[['Middle',eqL(['Found at index 6 (steps: 7)'])]]},{inputs:['10','10'],tests:[['Last item',eqL(['Found at index 9 (steps: 10)'])]]},{inputs:['10','11'],tests:[['Missing',eqL(['Not found (steps: 10)'])]]},{inputs:['1000','500'],tests:[['Bigger',eqL(['Found at index 499 (steps: 500)'])]]},{inputs:['0','5'],tests:[['Empty',eqL(['Not found (steps: 0)'])]]},{inputs:['5','-3'],tests:[['Negative target',eqL(['Not found (steps: 5)'])]]}],
    sol:s01,
    wrong:[s01.replace('    steps += 1\n    if value','    if value').replace('        found = index\n','        found = index\n        steps += 1\n'),s01.replace('        break\n',''),s01.replace('steps = 0\nfound','steps = 1\nfound'),s01.replace('range(1, size + 1)','range(size)'),s01.replace('if found >= 0:','if found > 0:')],
    hints:['Loop with enumerate(data); add 1 to steps for every item you look at.','When value == target remember the index and break.','Print "Found at index i (steps: k)" if you found it, otherwise "Not found (steps: k)".',s01]},
  power:{can:['Count steps instead of seconds','Tell best case from worst case'],
    expand:'Count the steps for a missing target at sizes 10, 100 and 1000 and see how they grow.',
    where:'Every performance discussion starts with "how does the work grow with the input?".',
    next:'Next: constant time versus linear time.'},
  codex:{title:'Counting steps',body:'Count basic operations with a counter, not seconds. Linear search: best 1 step, worst n steps. Ask: if the data is 10x bigger, how many times more steps? break ends the work early.',snip:R`steps = 0
for value in data:
    steps += 1
    if value == target:
        break`}
},
{
  id:'r13-02', realm:13, n:2, title:'O(1) and O(n): constant and linear',
  teaches:['bigo-linear'], requires:['bigo-count'],
  story:`Quill sets two hourglasses on the sand. One empties in the same time whether the arena holds ten people or ten thousand. The other takes twice as long when the crowd doubles. "Learn to tell them apart on sight," Quill says.`,
  concept:{
    html:`**Big-O** describes how the number of steps **grows** with the input size **n**, ignoring small details.\n\n| Notation | Name | Example |\n|---|---|---|\n| \`O(1)\` | constant | \`items[2]\`, \`len(items)\`, a formula |\n| \`O(n)\` | linear | loop over all items, \`x in some_list\`, \`sum(items)\` |\n\n\`\`\`\ntotal = 0\nfor i in range(1, n + 1):   # O(n): n steps\n    total += i\nn * (n + 1) // 2              # O(1): one step, any n\n\`\`\`\n\n- **Drop constants**: 3 loops over n items is still O(n); we care about the *shape* of growth.\n- **Drop small terms**: n + 10 is O(n).\n- \`list.append\` is O(1) on average; \`x in list\` and \`list.insert(0, x)\` are O(n).\n- A clever formula can replace a loop: sometimes the best optimisation is maths.\n- Big-O says how it *scales*, not which code is faster for tiny inputs.`,
    analogy:`Reading a book cover to cover (O(n)) versus opening it at the bookmark (O(1)).`,
    example:e02},
  predict:{code:R`print(sum(range(1, 5)), 4 * 5 // 2)`, q:'What prints?', opts:['10 10','15 10','10 20'], ans:0, why:'1+2+3+4 is 10, and the formula 4*5//2 is also 10.'},
  cast:{code:e02, task:'Cast it.'},
  bug:{broken:R`n = 100
print(n * (n + 1) / 2)`, task:'Division with / gives a float (5050.0). Use integer division. Expected: 5050',
    cases:[{inputs:[],tests:[['Works','lines==["5050"]'],['Integer division','"//" in src']]}],
    sol:R`n = 100
print(n * (n + 1) // 2)`, wrong:[R`print("5050")`]},
  write:{prompt:'Ask `n: ` and print two lines: `Loop: total=<sum of 1..n> steps=<iterations>` computed with a loop that counts its iterations, and `Formula: total=<sum> steps=1` using `n*(n+1)//2`. For n below 1 the total is 0.',
    starter:R`n = int(input("n: "))
`,
    inputs:['10'],
    cases:[{inputs:['10'],tests:[['Small',eqL(['Loop: total=55 steps=10','Formula: total=55 steps=1'])]]},{inputs:['1'],tests:[['One',eqL(['Loop: total=1 steps=1','Formula: total=1 steps=1'])]]},{inputs:['0'],tests:[['Zero',eqL(['Loop: total=0 steps=0','Formula: total=0 steps=1'])]]},{inputs:['-5'],tests:[['Negative',eqL(['Loop: total=0 steps=0','Formula: total=0 steps=1'])]]},{inputs:['1000000'],tests:[['A million',eqL(['Loop: total=500000500000 steps=1000000','Formula: total=500000500000 steps=1'])]]}],
    sol:s02,
    wrong:[s02.replace('range(1, n + 1)','range(n)'),s02.replace('(max(n, 0) + 1)','max(n, 0)'),s02.replace('max(n, 0) * (max(n, 0) + 1)','n * (n + 1)'),s02.replace('steps=1")','steps={n}")'),s02.replace('    steps += 1\n','    steps += 2\n')],
    hints:['Loop for i in range(1, n + 1): add i to total and 1 to steps.','The formula is n * (n + 1) // 2; use max(n, 0) so negatives give 0.','Print both lines with f-strings; the formula line always says steps=1.',s02]},
  power:{can:['Recognise O(1) and O(n) work','Replace a loop with a formula'],
    expand:'Try the formula for the sum of squares, `n*(n+1)*(2*n+1)//6`, and check it against a loop.',
    where:'"Can you do it without a loop?" is a classic interview follow-up.',
    next:'Next: nested loops and O(n squared).'},
  codex:{title:'O(1) vs O(n)',body:'O(1): constant (index, len, formula). O(n): linear (loop, x in list, sum). Drop constants and small terms. Big-O is about growth, not exact speed. Sometimes a formula replaces a loop.',snip:R`n * (n + 1) // 2   # O(1)
sum(range(1, n + 1))   # O(n)`}
},
{
  id:'r13-03', realm:13, n:3, title:'Nested loops: O(n squared)',
  teaches:['bigo-quad'], requires:['bigo-linear'],
  story:`Two scorekeepers must make sure no two duelists wear the same number. The slow way: every duelist compares with every other. "Watch the crowd double," Quill says, "and the work **quadruple**."`,
  concept:{
    html:`A loop **inside** a loop multiplies the work.\n\n\`\`\`\nfor i in range(n):\n    for j in range(i + 1, n):     # each pair once\n        compare(items[i], items[j])\n\`\`\`\n\n- The number of unordered pairs is **n x (n - 1) / 2**. Double n and the work is about **4x**; ten times n means **100x**. That is **O(n squared)**, written \`O(n²)\`.\n- Starting the inner loop at \`i + 1\` avoids comparing an item with itself and checking each pair twice.\n- O(n²) is fine for 1,000 items (half a million steps) and painful for 1,000,000 (half a trillion).\n- Spot it: nested loops over the same data, \`x in list\` inside a loop, repeated \`list.insert(0, ...)\`.\n- Three nested loops are O(n³).\n- The fix is usually a better **data structure** (next lesson) or a smarter algorithm.`,
    analogy:`Every guest at a party shaking hands with every other guest.`,
    example:e03},
  predict:{code:R`count = 0
for i in range(4):
    for j in range(i + 1, 4):
        count += 1
print(count)`, q:'What prints?', opts:['6','16','4'], ans:0, why:'Pairs of 4 items: 4*3/2 = 6.'},
  cast:{code:e03, task:'Cast it.'},
  bug:{broken:R`nums = [1, 2, 3]
count = 0
for i in range(len(nums)):
    for j in range(len(nums)):
        count += 1
print(count)`, task:'This compares every item with itself and every pair twice (9 steps). Count each pair once. Expected: 3',
    cases:[{inputs:[],tests:[['Works','lines==["3"]'],['Inner loop starts after i','"i + 1" in src']]}],
    sol:R`nums = [1, 2, 3]
count = 0
for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        count += 1
print(count)`, wrong:[R`print(3)`]},
  write:{prompt:'Ask `Numbers: `. Using two nested loops (each pair of positions `i < j` exactly once), count the comparisons and find equal pairs. Print `Comparisons: <n>`, `Equal pairs: <k>`, then one line `i,j` for each equal pair in loop order.',
    starter:R`numbers = [int(x) for x in input("Numbers: ").split()]
`,
    inputs:['1 2 3 2 1'],
    cases:[{inputs:['1 2 3 2 1'],tests:[['Pairs',eqL(['Comparisons: 10','Equal pairs: 2','0,4','1,3'])]]},{inputs:['7 7 7'],tests:[['All equal',eqL(['Comparisons: 3','Equal pairs: 3','0,1','0,2','1,2'])]]},{inputs:['5'],tests:[['One item',eqL(['Comparisons: 0','Equal pairs: 0'])]]},{inputs:[''],tests:[['Empty',eqL(['Comparisons: 0','Equal pairs: 0'])]]},{inputs:['1 2 3 4'],tests:[['No pairs',eqL(['Comparisons: 6','Equal pairs: 0'])]]}],
    sol:s03,
    wrong:[s03.replace('range(i + 1, len(numbers))','range(i, len(numbers))'),s03.replace('range(i + 1, len(numbers))','range(len(numbers))'),s03.replace('        comparisons += 1\n','').replace('print("Comparisons:", comparisons)','print("Comparisons:", len(numbers) * (len(numbers) - 1) // 2 + 1)'),s03.replace('pairs.append((i, j))','pairs.append((j, i))')],
    hints:['Outer loop i over positions; inner loop j from i + 1.','Add 1 to comparisons every time you compare numbers[i] with numbers[j].','Collect (i, j) when they are equal; print the counts, then each pair as i,j.',s03]},
  power:{can:['Recognise and count O(n squared) work','Count pairs without repeats'],
    expand:'Add a line showing how many comparisons n = 1000 would need (n*(n-1)//2).',
    where:'Accidental O(n²) loops are the number one cause of "it was fine until we got real data".',
    next:'Next: sets and dicts make lookups O(1).'},
  codex:{title:'Nested loops',body:'A loop inside a loop is O(n²): pairs = n*(n-1)/2. Start the inner loop at i + 1 to count each pair once. 10x the data = 100x the work. Fix with a better data structure.',snip:R`for i in range(n):
    for j in range(i + 1, n):
        ...`}
},
{
  id:'r13-04', realm:13, n:4, title:'Sets and dicts: O(1) lookups',
  teaches:['bigo-hash'], requires:['bigo-quad'],
  story:`The scorekeepers stop comparing every pair. Quill hands one of them a **ledger of numbers already seen**. "Look up each newcomer in the ledger," Quill says. "If the ledger answers instantly, the whole check takes **one pass**."`,
  concept:{
    html:`Sets and dicts use **hashing**: Python computes a number from the value and jumps straight to its slot.\n\n\`\`\`\nseen = set()\nfor n in numbers:\n    if n in seen:        # O(1) on average\n        print("duplicate", n)\n        break\n    seen.add(n)          # O(1) on average\n\`\`\`\n\n- \`x in some_set\` and \`key in some_dict\` take about **one step**, whatever the size. \`x in some_list\` takes up to **n** steps.\n- Finding a duplicate by comparing every pair is O(n²); with a set it is **O(n)**: one pass.\n- The price: the set uses extra **memory**. That is the classic time/space trade-off.\n- Only **hashable** values (numbers, strings, tuples) can go in a set or be dict keys, not lists.\n- \`for ... else\`: the \`else\` block runs only if the loop finished **without** \`break\`.\n- Rule of thumb: if you search the same collection repeatedly, convert it to a set first.`,
    analogy:`An index at the back of a book that sends you to the exact page instead of reading every page.`,
    example:e04},
  predict:{code:R`seen = {1, 2, 3}
print(2 in seen, 9 in seen, len(seen))`, q:'What prints?', opts:['True False 3','True True 3','False False 0'], ans:0, why:'2 is in the set, 9 is not, and there are 3 members.'},
  cast:{code:e04, task:'Cast it.'},
  bug:{broken:R`seen = set()
seen.append(3)
print(3 in seen)`, task:'Sets have no append. Use the set method for adding. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['add','".add(" in src']]}],
    sol:R`seen = set()
seen.add(3)
print(3 in seen)`, wrong:[R`print(True)`]},
  write:{prompt:'Ask `Size: ` (n) and `Repeat: ` (d). The list is made for you: the numbers `1..n` followed by one extra `d`. Find the **first duplicate** (the first number that has already appeared earlier) in a single pass using a set, counting one lookup per number you examine. Print `First duplicate: <x> (lookups: <k>)` or `All unique (lookups: <total>)`. It must stay fast for 200,000 numbers.',
    starter:h04,
    inputs:['5','3'],
    cases:[{inputs:['5','3'],tests:[['Duplicate at the end',eqL(['First duplicate: 3 (lookups: 6)'])]]},{inputs:['3','9'],tests:[['Unique',eqL(['All unique (lookups: 4)'])]]},{inputs:['0','7'],tests:[['Only the extra',eqL(['All unique (lookups: 1)'])]]},{inputs:['1','1'],tests:[['Immediate',eqL(['First duplicate: 1 (lookups: 2)'])]]},{inputs:['10','1'],tests:[['First number repeats',eqL(['First duplicate: 1 (lookups: 11)'])]]},{inputs:['200000','1'],tests:[['Fast for 200,000 numbers',eqL(['First duplicate: 1 (lookups: 200001)'])]]}],
    sol:s04,
    wrong:[s04.replace('seen = set()','seen = []').replace('seen.add(n)','seen.append(n)'),s04.replace('    lookups += 1\n',''),s04.replace('if n in seen:','if n not in seen:'),s04.replace('    seen.add(n)\nelse:','    seen.add(n)\nelse:').replace('        break\n','        pass\n')],
    hints:['seen = set(); for each n: count a lookup, check n in seen, then seen.add(n).','On a hit print First duplicate and break; the else of the for loop prints All unique.','A list for seen works but is O(n) per lookup: far too slow for 200,000 numbers.',s04]},
  power:{can:['Use sets and dicts for O(1) lookups','Turn an O(n squared) search into a single pass'],
    expand:'Return all duplicated values (each once, in order of first repeat) using two sets.',
    where:'"Does this list contain duplicates?" is one of the most common interview openers.',
    next:'Next: O(log n) and binary search.'},
  codex:{title:'Hash lookups',body:'set / dict membership is O(1) on average; list membership is O(n). One pass with a seen-set finds duplicates in O(n) at the cost of memory. for...else runs else when no break happened. Only hashable values can be keys.',snip:R`seen = set()
for n in numbers:
    if n in seen:
        break
    seen.add(n)`}
},
{
  id:'r13-05', realm:13, n:5, title:'O(log n): halving the problem',
  teaches:['bigo-log'], requires:['bigo-hash'],
  story:`"Think of a number from one to a thousand," says Quill. "I will find it in ten questions." Every question halves the possibilities. The crowd gasps: a billion numbers would take only thirty.`,
  concept:{
    html:`**Binary search** needs **sorted** data. Look in the middle, discard the wrong half, repeat.\n\n\`\`\`\nlow, high = 0, len(data) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n        return mid\n    if data[mid] < target:\n        low = mid + 1       # target is in the upper half\n    else:\n        high = mid - 1      # target is in the lower half\n\`\`\`\n\n- Every probe halves what is left: that is **O(log n)**. 1,000 items need about 10 probes; 1,000,000 need about 20; a billion about 30.\n- It only works on **sorted** data. Sorting costs more than one linear search, so binary search pays off when you search **many times**.\n- Use \`mid = (low + high) // 2\` (integer division), \`low = mid + 1\` and \`high = mid - 1\`. Writing \`low = mid\` can loop forever.\n- Python has \`bisect\` for this; interviewers still want you to write it by hand.\n- \`while ... else\` runs the else if the loop ended without \`break\`.`,
    analogy:`Guessing a number with "higher or lower" hints: you never need more than a few guesses.`,
    example:e05},
  predict:{code:R`n = 1000
steps = 0
while n > 1:
    n //= 2
    steps += 1
print(steps)`, q:'What prints?', opts:['9','500','1000'], ans:0, why:'1000 halves to 1 in 9 steps (log base 2 of 1000 is about 10).'},
  cast:{code:e05, task:'Cast it.'},
  bug:{broken:R`data = list(range(10))
low, high = 0, 9
mid = (low + high) / 2
print(data[mid])`, task:'/ makes a float, which cannot be a list index. Use integer division. Expected: 4',
    cases:[{inputs:[],tests:[['Works','lines==["4"]'],['Integer division','"//" in src']]}],
    sol:R`data = list(range(10))
low, high = 0, 9
mid = (low + high) // 2
print(data[mid])`, wrong:[R`print(4)`]},
  write:{prompt:'Ask `Size: ` and `Target: `. The sorted data is the even numbers `[0, 2, 4, ...]` with `size` items. Do a **binary search** (middle = `(low + high) // 2`, the lower half when the middle is too big) counting one probe per middle you look at. Print `Found at index <i> (probes: <k>)` or `Missing (probes: <k>)`.',
    starter:R`size = int(input("Size: "))
target = int(input("Target: "))
data = [2 * i for i in range(size)]
`,
    inputs:['10','8'],
    cases:[{inputs:['10','8'],tests:[['Found at first probe',eqL(['Found at index 4 (probes: 1)'])]]},{inputs:['10','0'],tests:[['Left end',eqL(['Found at index 0 (probes: 3)'])]]},{inputs:['10','18'],tests:[['Right end',eqL(['Found at index 9 (probes: 4)'])]]},{inputs:['10','7'],tests:[['Odd is missing',eqL(['Missing (probes: 4)'])]]},{inputs:['10','20'],tests:[['Too big',eqL(['Missing (probes: 4)'])]]},{inputs:['1','0'],tests:[['One item',eqL(['Found at index 0 (probes: 1)'])]]},{inputs:['0','5'],tests:[['Empty',eqL(['Missing (probes: 0)'])]]},{inputs:['1000','500'],tests:[['Thousand',eqL(['Found at index 250 (probes: 9)'])]]},{inputs:['1000000','1'],tests:[['A million, missing',eqL(['Missing (probes: 20)'])]]},{inputs:['1000000','0'],tests:[['A million, left end',eqL(['Found at index 0 (probes: 19)'])]]}],
    sol:s05,
    wrong:[s05.replace('mid = (low + high) // 2\n    probes += 1','mid = (low + high + 1) // 2\n    probes += 1'),s05.replace('        high = mid - 1','        high = mid'),s05.replace('    probes += 1\n',''),s05.replace('while low <= high:','while low < high:'),s05.replace('if data[mid] < target:','if data[mid] > target:').replace('        low = mid + 1\n    else:\n        high = mid - 1','        low = mid + 1\n    else:\n        high = mid - 1')],
    hints:['low, high = 0, size - 1; loop while low <= high.','mid = (low + high) // 2; count a probe; compare data[mid] with the target.','Too small: low = mid + 1. Too big: high = mid - 1. Use while ... else to print Missing.',s05]},
  power:{can:['Write binary search from scratch','Explain why halving gives O(log n)'],
    expand:'Add a second answer: the index where a missing target WOULD be inserted (compare with `bisect.bisect_left`).',
    where:'Binary search is the most-asked algorithm in interviews, and the idea reappears in databases and git bisect.',
    next:'Next: what sorting really costs.'},
  codex:{title:'Binary search',body:'Sorted data only. mid = (low + high) // 2; too small -> low = mid + 1; too big -> high = mid - 1; loop while low <= high. Each probe halves the range: O(log n). while...else for the "missing" branch.',snip:R`while low <= high:
    mid = (low + high) // 2
    if data[mid] == target: return mid
    if data[mid] < target: low = mid + 1
    else: high = mid - 1`}
},
{
  id:'r13-06', realm:13, n:6, title:'Sorting and O(n log n)',
  teaches:['bigo-sort'], requires:['bigo-log'],
  story:`A line of fighters must be arranged by strength. Quill shows the **slow way**: take each fighter and slide him left until he fits. "Fine for ten fighters," Quill says. "Ruinous for ten thousand. Count it."`,
  concept:{
    html:`**Insertion sort**: take the next item (\`key\`) and shift bigger items right until it fits.\n\n\`\`\`\nfor i in range(1, len(nums)):\n    key = nums[i]\n    j = i - 1\n    while j >= 0 and nums[j] > key:\n        nums[j + 1] = nums[j]     # shift right\n        j -= 1\n    nums[j + 1] = key             # drop the key into the gap\n\`\`\`\n\n- Already sorted data: about **n** comparisons (best case). Reverse-sorted data: about **n² / 2** (worst case). So insertion sort is **O(n²)**.\n- The built-in \`sorted()\` / \`list.sort()\` use **Timsort**: **O(n log n)**. For a million items that is roughly 20 million steps instead of 500 billion.\n- \`list.sort()\` sorts **in place and returns None**; \`sorted(x)\` returns a **new** list.\n- Python's sort is **stable**: equal items keep their original order.\n- In interviews: know why n log n is the best a comparison sort can do, and use the built-in unless asked to write one.\n- Almost-sorted data makes insertion sort fast: that is why Timsort uses it for tiny runs.`,
    analogy:`Sorting playing cards in your hand one card at a time.`,
    example:e06},
  predict:{code:R`import math
print(8 * int(math.log2(8)), 8 * 8)`, q:'What prints (n log n and n squared for n = 8)?', opts:['24 64','8 64','24 16'], ans:0, why:'log2(8) is 3, so n log n = 24 while n squared = 64.'},
  cast:{code:e06, task:'Cast it.'},
  bug:{broken:R`numbers = [3, 1, 2]
result = numbers.sort()
print(result)`, task:'list.sort() sorts in place and returns None. Print the sorted list. Expected: [1, 2, 3]',
    cases:[{inputs:[],tests:[['Works','lines==["[1, 2, 3]"]'],['sorted','"sorted(" in src']]}],
    sol:R`numbers = [3, 1, 2]
result = sorted(numbers)
print(result)`, wrong:[R`print("[1, 2, 3]")`]},
  write:{prompt:'Ask `Numbers: `. Sort them with **insertion sort** (shift items while `numbers[j] > key`). Count every evaluation of the comparison `numbers[j] > key`. Print `Comparisons: <k>` then `Sorted: <list>`.',
    starter:R`numbers = [int(x) for x in input("Numbers: ").split()]
comparisons = 0
`,
    inputs:['3 1 2'],
    cases:[{inputs:['3 1 2'],tests:[['Small',eqL(['Comparisons: 3','Sorted: [1, 2, 3]'])]]},{inputs:['1 2 3 4 5'],tests:[['Best case',eqL(['Comparisons: 4','Sorted: [1, 2, 3, 4, 5]'])]]},{inputs:['5 4 3 2 1'],tests:[['Worst case',eqL(['Comparisons: 10','Sorted: [1, 2, 3, 4, 5]'])]]},{inputs:['2 2 2'],tests:[['Equal items',eqL(['Comparisons: 2','Sorted: [2, 2, 2]'])]]},{inputs:['4 1 3 1'],tests:[['Duplicates',eqL(['Comparisons: 6','Sorted: [1, 1, 3, 4]'])]]},{inputs:[''],tests:[['Empty',eqL(['Comparisons: 0','Sorted: []'])]]},{inputs:['7'],tests:[['One',eqL(['Comparisons: 0','Sorted: [7]'])]]}],
    sol:s06,
    wrong:[s06.replace('numbers[j] > key','numbers[j] >= key'),s06.replace('    numbers[j + 1] = key\nprint','    numbers[j] = key\nprint'),s06.replace('        comparisons += 1\n',''),s06.replace('print("Sorted:", numbers)','print("Sorted:", sorted(numbers, reverse=True))'),s06.replace('        else:\n            break\n','        else:\n            comparisons += 1\n            break\n')],
    hints:['For i from 1: key = numbers[i], j = i - 1.','While j >= 0: count a comparison; if numbers[j] > key shift it right and j -= 1, else stop.','Put the key at numbers[j + 1]. Print the count and the list.',s06]},
  power:{can:['Write insertion sort and count its work','Explain why built-in sorting is O(n log n)'],
    expand:'Time `sorted()` on 100,000 random numbers and compare with your insertion sort on 2,000.',
    where:'"Sort this and tell me the complexity" is a standard interview question.',
    next:'Next: space complexity and trading memory for time.'},
  codex:{title:'Sorting cost',body:'Insertion sort: best O(n), worst O(n²). sorted() / list.sort(): Timsort, O(n log n), stable. list.sort() returns None and sorts in place; sorted() returns a new list.',snip:R`ordered = sorted(items, key=lambda x: x[1])`}
},
{
  id:'r13-07', realm:13, n:7, title:'Space complexity and the time/space trade-off',
  teaches:['bigo-space'], requires:['bigo-sort'],
  story:`The scorekeepers answer a thousand questions a day: *what is the total strength of fighters 40 through 900?* Adding them up each time is hopeless. Quill smiles: "Spend a little memory **once**, and every later answer is instant."`,
  concept:{
    html:`**Space complexity** counts the extra memory your algorithm uses. Often you can **trade space for time**.\n\n**Prefix sums**: build once, answer any range sum in one subtraction.\n\n\`\`\`\nprefix = [0]\nfor value in numbers:\n    prefix.append(prefix[-1] + value)   # prefix[k] = sum of the first k numbers\n\n# sum of numbers[left .. right], both included:\nprefix[right + 1] - prefix[left]\n\`\`\`\n\n- Building costs **O(n) time and O(n) extra space**, paid once.\n- Each query is then **O(1)** instead of O(n). With 60,000 queries over 60,000 numbers that is the difference between a blink and a timeout.\n- The \`+ 1\` matters: \`prefix[right + 1]\` includes the right element.\n- Caching, lookup tables, indexes and memoisation all spend memory to save time.\n- The opposite trade (use less memory, more time) is right when memory is the limit.\n- Always say both numbers in an interview: "O(n) time, O(n) space".`,
    analogy:`Writing running totals in the margin so you never have to re-add the page.`,
    example:e07},
  predict:{code:R`prefix = [0]
for v in [3, 1, 4]:
    prefix.append(prefix[-1] + v)
print(prefix, prefix[3] - prefix[1])`, q:'What prints?', opts:['[0, 3, 4, 8] 5','[3, 4, 8] 5','[0, 3, 4, 8] 4'], ans:0, why:'Running totals; prefix[3] - prefix[1] is 8 - 3 = 5, the sum of the last two numbers.'},
  cast:{code:e07, task:'Cast it.'},
  bug:{broken:R`numbers = [3, 1, 4, 1]
prefix = [0, 3, 4, 8, 9]
left, right = 1, 2
print(prefix[right] - prefix[left])`, task:'The right element is missing from the sum of numbers[1..2] (1 + 4). Fix the prefix index. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['right + 1','"right + 1" in src']]}],
    sol:R`numbers = [3, 1, 4, 1]
prefix = [0, 3, 4, 8, 9]
left, right = 1, 2
print(prefix[right + 1] - prefix[left])`, wrong:[R`print(5)`]},
  write:{prompt:'The data is made for you: `numbers` (`size` values) and `queries` (a list of `(left, right)` pairs, both included). Answer every query and print `Queries: <count>` and `Checksum: <sum of all the answers>`. It must stay fast even with 60,000 numbers and 60,000 wide queries, so build **prefix sums** once.',
    starter:h07,
    inputs:['5','3'],
    cases:[{inputs:['5','3'],tests:[['Tiny',eqL(['Queries: 3','Checksum: ' + sizes07(5,3)])]]},{inputs:['1000','5'],tests:[['Medium',eqL(['Queries: 5','Checksum: ' + sizes07(1000,5)])]]},{inputs:['60000','60000'],tests:[['Big and fast',eqL(['Queries: 60000','Checksum: ' + sizes07(60000,60000)])]]}],
    sol:s07,
    wrong:[h07 + R`checksum = 0
for left, right in queries:
    checksum += sum(numbers[left:right + 1])
print("Queries:", len(queries))
print("Checksum:", checksum)`,s07.replace('prefix[right + 1] - prefix[left]','prefix[right] - prefix[left]'),s07.replace('prefix[right + 1] - prefix[left]','prefix[right + 1] - prefix[left + 1]'),s07.replace('print("Queries:", len(queries))','print("Queries:", len(queries) - 1)')],
    hints:['Build prefix = [0] and append prefix[-1] + value for every number.','The sum of numbers[left..right] is prefix[right + 1] - prefix[left].','Add every answer to a running checksum; summing slices is too slow for the big test.',s07]},
  power:{can:['Trade memory for speed with prefix sums','State time and space complexity together'],
    expand:'Make a 2D prefix-sum table so you can answer rectangle sums on a grid in O(1).',
    where:'Range queries power analytics dashboards, game maps and spreadsheet totals.',
    next:'Next: Real-World Mission: the Slow Ledger.'},
  codex:{title:'Space vs time',body:'Space complexity = extra memory. Prefix sums: O(n) build, O(1) query: prefix[right + 1] - prefix[left]. Caches, indexes and lookup tables trade memory for time. Say both: "O(n) time, O(n) space".',snip:R`prefix = [0]
for v in numbers:
    prefix.append(prefix[-1] + v)`}
},
{
  id:'r13-08', realm:13, n:8, title:'Real-World Mission: The Slow Ledger',
  teaches:['mission13a'], requires:['bigo-space'],
  story:`The treasury's duplicate-invoice report takes **nineteen minutes** to run, and it is getting slower every month. The auditors are furious. Quill slides the script across the sand. "Find out why, and make it run in the blink of an eye."`,
  concept:{
    html:`Real optimisation is usually **one idea**, applied where the time goes.\n\nThe slow script compared **every invoice with every other** (O(n²)). With 40,000 invoices that is **800 million** comparisons.\n\nThe fast version counts in **one pass**:\n\n\`\`\`\nfrom collections import Counter\ncounts = Counter(amounts)                 # O(n)\nrepeated = {a: c for a, c in counts.items() if c > 1}\npairs = sum(c * (c - 1) // 2 for c in counts.values())   # equal pairs, by maths\n\`\`\`\n\n- If an amount appears \`c\` times it forms \`c x (c - 1) / 2\` equal pairs. No pair loop needed.\n- \`min(repeated, key=lambda a: (-repeated[a], a))\` picks the most repeated amount, ties going to the **smallest** amount.\n- Always handle the **empty / no duplicates** case with a clear message.\n- Method: **measure first**, find the nested loop, replace it with a hash-based count, and check the output is identical.\n- Save the old and new answers for small inputs and compare them: a faster program that gives different answers is a bug.`,
    analogy:`Counting votes by tallying each ballot once instead of comparing every ballot with every other.`,
    example:e08},
  predict:{code:R`from collections import Counter
c = Counter([5, 3, 5, 5, 3])
print(c.most_common(1), sum(v * (v - 1) // 2 for v in c.values()))`, q:'What prints?', opts:['[(5, 3)] 4','[(5, 3)] 5','[(3, 2)] 4'], ans:0, why:'5 appears 3 times (3 pairs) and 3 appears twice (1 pair): 4 pairs in total.'},
  cast:{code:e08, task:'Cast it.'},
  bug:{broken:R`words = ["a", "b", "a"]
counts = {}
for w in words:
    counts[w] += 1
print(counts)`, task:'First sight of a word: KeyError. Start missing words at 0. Expected: {\'a\': 2, \'b\': 1}',
    cases:[{inputs:[],tests:[['Works','lines==["{\'a\': 2, \'b\': 1}"]'],['Safe counting','".get(" in src or "defaultdict" in src or "in counts" in src']]}],
    sol:R`words = ["a", "b", "a"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts)`, wrong:[R`print({'a': 2, 'b': 1})`]},
  write:{prompt:'Ask `Invoices: ` (a count `n`); the amounts are made for you. Print `Invoices: <n>`. If no amount appears twice print `No duplicates`. Otherwise print `Duplicate amounts: <how many different amounts repeat>`, `Most repeated: <amount> (x<times>)` (ties: the smallest amount) and `Equal pairs: <pairs of invoices with the same amount>`. It must handle 40,000 invoices instantly.',
    starter:h08,
    inputs:['5000'],
    cases:[0,5,100,5000,40000].map(n => ({inputs:[String(n)],tests:[['n = ' + n, eqL(amounts08(n))]]})),
    sol:h08 + g08,
    wrong:[h08 + R`pairs = 0
for i in range(len(amounts)):
    for j in range(i + 1, len(amounts)):
        if amounts[i] == amounts[j]:
            pairs += 1
print("Invoices:", n)
print("Equal pairs:", pairs)`,h08 + g08.replace('(-repeated[amount], amount)','(-repeated[amount], -amount)'),h08 + g08.replace('c * (c - 1) // 2','c * c // 2'),h08 + g08.replace('if c > 1','if c > 2'),h08 + g08.replace('if not repeated:\n    print("No duplicates")\nelse:','if False:\n    pass\nelse:')],
    hints:['counts = Counter(amounts); repeated = amounts that appear more than once.','Most repeated: min(repeated, key=lambda a: (-repeated[a], a)).','Equal pairs: sum(c * (c - 1) // 2 for c in counts.values()). No pair loops!',h08 + g08]},
  power:{can:['Replace a nested loop with a one-pass count','Count pairs by maths instead of brute force'],
    expand:'Add a `Biggest repeated total` line: the amount x times for the repeated amount with the most money.',
    where:'Finding duplicates, fraud candidates and hot items in big data is daily work for data engineers.',
    next:'Next: Realm 13 continues with the data structures every interviewer asks about.'},
  codex:{title:'From O(n²) to O(n)',body:'Spot the nested loop; replace it with Counter / set / dict; pairs = c*(c-1)//2 per group; min(..., key=lambda k: (-count, k)) for count-then-name ties; check against the slow version on small input; handle empty cases.',snip:R`counts = Counter(amounts)
pairs = sum(c * (c - 1) // 2 for c in counts.values())`}
}
);
