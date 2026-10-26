// REALM 7 — THE WARDS (recursion + errors) — part A (lessons 1-9)
LESSONS.push(
{
  id:'r7-01', realm:7, n:1, title:'A function that calls itself',
  teaches:['rec-idea'], requires:['realm6-gap'],
  story:`Beyond the forge lies the **Hall of Mirrors**: two enormous mirrors facing each other, reflecting a corridor with no end. **Hopper** the ward-keeper steps out of one of them. "Welcome to the Wards, Journeyman. Here a spell can cast **itself** to solve a smaller version of the same problem."`,
  concept:{
    html:`**Recursion** means a function **calls itself**.\n\n\`\`\`\ndef count_down(n):\n    if n == 0:\n        print("Liftoff!")\n    else:\n        print(n)\n        count_down(n - 1)\n\ncount_down(3)\n\`\`\`\n\nThe function prints \`3\`, then asks *itself* to handle the smaller problem \`2\`, then \`1\`, then \`0\`.\n\nA working recursive function has two parts:\n1. A **base case**: the simplest version, answered directly (here \`n == 0\`).\n2. A **recursive case**: do a bit of work, then call itself on a **smaller** problem (\`n - 1\`).`,
    analogy:`Russian nesting dolls: open one, find a smaller copy of the same thing, until the tiny solid doll.`,
    example:R`def count_down(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)
        count_down(n - 1)

count_down(3)`},
  predict:{code:R`def f(n):
    if n == 0:
        print("done")
    else:
        print(n)
        f(n - 1)

f(2)`, q:'What prints?', opts:['2\n1\ndone','done','2\ndone'], ans:0, why:'f(2) prints 2 and calls f(1), which prints 1 and calls f(0), which prints done.'},
  cast:{code:R`def count_down(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)
        count_down(n - 1)

count_down(3)`, task:'Cast it. Change the starting number.'},
  bug:{broken:R`def count_down(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)

count_down(3)`, task:'It prints only 3. The function never calls itself on the smaller problem. Expected 3, 2, 1, Liftoff!',
    cases:[{inputs:[],tests:[['Full countdown','lines==["3","2","1","Liftoff!"]']]}],
    sol:R`def count_down(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)
        count_down(n - 1)

count_down(3)`, wrong:[R`def count_down(n):
    if n == 0:
        print("Liftoff!")
    else:
        print(n)

count_down(3)`]},
  write:{prompt:'Write a **recursive** `count_up(n, i=1)` that prints `i` up to `n` and then `Go!`. The extra parameter `i` tracks where you are. No loops allowed. Call `count_up(4)`.',
    starter:R`# define count_up(n, i=1) recursively
`,
    cases:[{inputs:[],tests:[['Printed','lines==["1","2","3","4","Go!"]'],['No loops','"for " not in src and "while " not in src'],['Calls itself','src.count("count_up(")>=3']]}],
    sol:R`def count_up(n, i=1):
    if i > n:
        print("Go!")
    else:
        print(i)
        count_up(n, i + 1)

count_up(4)`,
    wrong:[R`def count_up(n):
    for i in range(1, n + 1):
        print(i)
    print("Go!")

count_up(4)`, R`def count_up(n):
    print(1)
    print(2)
    print(3)
    print(4)
    print("Go!")

count_up(4)`],
    hints:['Base case: i > n prints Go!','Otherwise print i, then call count_up(n, i + 1).','The counter grows toward n instead of shrinking to 0.','def count_up(n, i=1):\n    if i > n:\n        print("Go!")\n    else:\n        print(i)\n        count_up(n, i + 1)\n\ncount_up(4)']},
  power:{can:['Read and write a simple recursive function','Spot the base case and the recursive case'],
    expand:'Print the numbers on the way down AND on the way back up, in the same function.',
    where:'Recursion naturally fits folders inside folders, menus inside menus and trees of all kinds.',
    next:'Next: what happens when there is no base case.'},
  codex:{title:'Recursion',body:'A function calling itself on a smaller problem. Needs a base case and a recursive case.',snip:R`def f(n):
    if n == 0: return
    f(n - 1)`}
},
{
  id:'r7-02', realm:7, n:2, title:'The base case: how recursion stops',
  teaches:['rec-base'], requires:['rec-idea'],
  story:`Hopper points at a mirror that reflects itself forever. "A recursion with no ending is a house of mirrors you never leave. Python protects you: after about a thousand reflections it **breaks the glass**."`,
  concept:{
    html:`Without a base case (or with one that is never reached) the function calls itself forever. Python stops it with a **RecursionError**:\n\n\`\`\`\ndef forever(n):\n    print(n)\n    forever(n - 1)      # never stops\n\nforever(3)    # RecursionError: maximum recursion depth exceeded\n\`\`\`\n\nChecklist for every recursive function:\n\n1. Is there a **base case** that returns without recursing?\n2. Does each recursive call get **closer** to the base case?\n3. Does it handle the **smallest input** (0, empty list, empty text)?\n\nThe stack of unfinished calls is the **call stack**; Python caps it (about 1000 deep).`,
    analogy:`Walking down a staircase: you need a bottom step, and every step must go down.`,
    example:R`def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(4))`},
  predict:{code:R`def f(n):
    if n <= 0:
        return 0
    return n + f(n - 1)

print(f(3))`, q:'What prints?', opts:['6','3','0'], ans:0, why:'3 + 2 + 1 + 0 = 6.'},
  cast:{code:R`def forever(n):
    print(n)
    forever(n - 1)

forever(3)`, task:'Cast it and read the RecursionError.', expectError:true},
  bug:{broken:R`def sum_to(n):
    return n + sum_to(n - 1)

print(sum_to(4))`, task:'RecursionError: there is no base case. Add one so sum_to(4) is 10.',
    cases:[{inputs:[],tests:[['Prints 10','out.strip()=="10"']]}],
    sol:R`def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(4))`, wrong:[R`def sum_to(n):
    return n + sum_to(n - 1)

print(sum_to(4))`]},
  write:{prompt:'Write a recursive `sum_to(n)` that returns `1 + 2 + ... + n` (and `0` for `n` of 0 or less). Do not use loops or `sum`. Print `sum_to(10)`.',
    starter:R`# define sum_to recursively
`,
    cases:[{inputs:[],tests:[['Prints 55','lines==["55"]'],['sum_to(0)','g["sum_to"](0)==0'],['sum_to(100)','g["sum_to"](100)==5050'],['sum_to(1)','g["sum_to"](1)==1'],['No loops or sum','"for " not in src and "while " not in src and "sum(" not in src'],['Calls itself','src.count("sum_to(")>=3']]}],
    sol:R`def sum_to(n):
    if n <= 0:
        return 0
    return n + sum_to(n - 1)

print(sum_to(10))`,
    wrong:[R`def sum_to(n):
    return n * (n + 1) // 2

print(sum_to(10))`, R`def sum_to(n):
    if n == 1:
        return 1
    return n + sum_to(n - 1)

print(sum_to(10))`],
    hints:['Base case: n <= 0 returns 0.','Recursive case: n plus sum_to(n - 1).','Use return, not print, inside.','def sum_to(n):\n    if n <= 0:\n        return 0\n    return n + sum_to(n - 1)\n\nprint(sum_to(10))']},
  power:{can:['Always include a base case','Recognise and read a RecursionError'],
    expand:'Predict how deep sum_to(5) goes, then draw the call stack on paper.',
    where:'RecursionError is the classic sign of a missing or unreachable base case.',
    next:'Next: the famous factorial.'},
  codex:{title:'Base case',body:'Every recursive function needs a base case and must move toward it. Otherwise: RecursionError.',snip:R`if n <= 0:
    return 0`}
},
{
  id:'r7-03', realm:7, n:3, title:'Factorial: recursion with a return',
  teaches:['rec-fact'], requires:['rec-base'],
  story:`"The classic," Hopper says, a number appearing in each mirror. "5! means 5 × 4 × 3 × 2 × 1. And notice: 5! is just 5 times 4!"`,
  concept:{
    html:`The **factorial** \`n!\` is \`n × (n-1) × ... × 1\`. It has a recursive definition:\n\n- \`0! = 1\` and \`1! = 1\` (base case)\n- \`n! = n × (n-1)!\` (recursive case)\n\n\`\`\`\ndef factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\`\`\`\n\nHow \`factorial(3)\` unfolds:\n\n\`\`\`\nfactorial(3) = 3 * factorial(2)\n             = 3 * (2 * factorial(1))\n             = 3 * (2 * 1)\n             = 6\n\`\`\`\n\nEach call **waits** for the next one to return, then multiplies.`,
    analogy:`A chain of people each saying "I'll tell you after I ask the next person".`,
    example:R`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`},
  predict:{code:R`def f(n):
    if n <= 1:
        return 1
    return n * f(n - 1)

print(f(4))`, q:'What prints?', opts:['24','10','4'], ans:0, why:'4 × 3 × 2 × 1 = 24.'},
  cast:{code:R`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`, task:'Cast it.'},
  bug:{broken:R`def factorial(n):
    if n <= 1:
        return 1
    return n + factorial(n - 1)

print(factorial(5))`, task:'It adds instead of multiplying. Expected 120.',
    cases:[{inputs:[],tests:[['Prints 120','out.strip()=="120"']]}],
    sol:R`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`, wrong:[R`def factorial(n):
    if n <= 1:
        return 1
    return n + factorial(n - 1)

print(factorial(5))`]},
  write:{prompt:'Define a recursive `factorial(n)` (no `math`). Then for `n` from 1 to 5 print lines like `5! = 120`.',
    starter:R`# define factorial recursively
`,
    cases:[{inputs:[],tests:[['Printed','lines==["1! = 1","2! = 2","3! = 6","4! = 24","5! = 120"]'],['factorial(10)','g["factorial"](10)==3628800'],['factorial(0)','g["factorial"](0)==1'],['No math and recursive','"math" not in src and src.count("factorial(")>=3']]}],
    sol:R`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for n in range(1, 6):
    print(f"{n}! = {factorial(n)}")`,
    wrong:[R`def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

for n in range(1, 6):
    print(f"{n}! = {factorial(n)}")`, R`def factorial(n):
    return n * factorial(n - 1)

for n in range(1, 6):
    print(f"{n}! = {factorial(n)}")`],
    hints:['Base case: n <= 1 returns 1.','Recursive case: n * factorial(n - 1).','Loop n from 1 to 5 and print with an f-string.','def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nfor n in range(1, 6):\n    print(f"{n}! = {factorial(n)}")']},
  power:{can:['Build a value up on the way back out of the recursion','Trace nested calls by hand'],
    expand:'Compute 20! and watch how fast it grows.',
    where:'Factorials count arrangements and show up in probability and algorithms.',
    next:'Next: a recursion that calls itself twice - Fibonacci.'},
  codex:{title:'Factorial',body:'n! = n * (n-1)!, base case 1. Each call waits for the smaller one.',snip:R`return n * factorial(n - 1)`}
},
{
  id:'r7-04', realm:7, n:4, title:'Fibonacci: two recursive calls',
  teaches:['rec-fib'], requires:['rec-fact','comp-list'],
  story:`Two mirrors reflect twice as many reflections. "Some problems split into **two** smaller copies," Hopper says. "The Fibonacci numbers: each is the sum of the two before it."`,
  concept:{
    html:`The Fibonacci sequence: \`0, 1, 1, 2, 3, 5, 8, 13, ...\` Each number is the sum of the previous two.\n\n\`\`\`\ndef fib(n):\n    if n < 2:\n        return n          # fib(0)=0, fib(1)=1\n    return fib(n - 1) + fib(n - 2)\n\n[fib(i) for i in range(10)]\n\`\`\`\n\nEach call makes **two** more calls, so the number of calls **doubles** roughly each step: a tree of calls. \`fib(30)\` is already over a million calls.\n\nThis is correct but slow. The next-but-two lesson fixes that with a cache.`,
    analogy:`Rabbits breeding: each pair spawns the next generation from the two before.`,
    example:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])`},
  predict:{code:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(5))`, q:'What prints?', opts:['5','8','3'], ans:0, why:'0, 1, 1, 2, 3, 5: fib(5) is 5.'},
  cast:{code:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])`, task:'Cast it.'},
  bug:{broken:R`def fib(n):
    if n < 2:
        return 1
    return fib(n - 1) + fib(n - 2)

print(fib(6))`, task:'The base case is wrong: fib(0) is 0, fib(1) is 1. Expected 8.',
    cases:[{inputs:[],tests:[['Prints 8','out.strip()=="8"']]}],
    sol:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(6))`, wrong:[R`def fib(n):
    if n < 2:
        return 1
    return fib(n - 1) + fib(n - 2)

print(fib(6))`]},
  write:{prompt:'Write a recursive `fib(n)` and print the first 10 Fibonacci numbers as a list using a comprehension.',
    starter:R`# define fib recursively
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]"]'],['fib(12)','g["fib"](12)==144'],['fib(0) and fib(1)','g["fib"](0)==0 and g["fib"](1)==1'],['Recursive','src.count("fib(")>=4']]}],
    sol:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print([fib(i) for i in range(10)])`,
    wrong:[R`def fib(n):
    a, b = 0, 1
    for i in range(n):
        a, b = b, a + b
    return a

print([fib(i) for i in range(10)])`, R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 1)

print([fib(i) for i in range(10)])`],
    hints:['Base case: if n < 2 return n.','Recursive case: fib(n - 1) + fib(n - 2).','Print [fib(i) for i in range(10)].','def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(10)])']},
  power:{can:['Write a recursion that branches into two calls','Understand why that gets slow'],
    expand:'Count how many calls fib(10) makes using a global counter, then try fib(15).',
    where:'Branching recursion is the heart of search, games and divide-and-conquer.',
    next:'Next: recursion on lists and text.'},
  codex:{title:'Fibonacci',body:'fib(n) = fib(n-1) + fib(n-2), base cases 0 and 1. Two calls per step: it grows quickly.',snip:R`return fib(n - 1) + fib(n - 2)`}
},
{
  id:'r7-05', realm:7, n:5, title:'Recursion on lists and text',
  teaches:['rec-seq'], requires:['rec-fib'],
  story:`"Lists and text are recursive too," Hopper says, peeling the first letter off a scroll. "A list is *one item plus a smaller list*. Handle the first, hand the rest to yourself."`,
  concept:{
    html:`A list or string is **its first item plus the rest**. Slices make that easy:\n\n\`\`\`\ndef total(nums):\n    if not nums:             # empty list → base case\n        return 0\n    return nums[0] + total(nums[1:])\n\`\`\`\n\n\`nums[0]\` is the first item and \`nums[1:]\` is everything after it, a **smaller** list each time, ending at \`[]\`.\n\nText works the same:\n\n\`\`\`\ndef reverse(text):\n    if text == "":\n        return ""\n    return reverse(text[1:]) + text[0]\n\`\`\`\n\nBase case: the **empty** sequence. Recursive case: first item + recursion on the rest.`,
    analogy:`Counting a queue: "I'm one person, plus however many are behind me".`,
    example:R`def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

def reverse(text):
    if text == "":
        return ""
    return reverse(text[1:]) + text[0]

print(total([1, 2, 3]))
print(reverse("abc"))`},
  predict:{code:R`def f(s):
    if s == "":
        return ""
    return f(s[1:]) + s[0]

print(f("ab"))`, q:'What prints?', opts:['ba','ab','b'], ans:0, why:'f("ab") = f("b") + "a" = ("" + "b") + "a" = "ba".'},
  cast:{code:R`def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

def reverse(text):
    if text == "":
        return ""
    return reverse(text[1:]) + text[0]

print(total([1, 2, 3]))
print(reverse("abc"))`, task:'Cast it.'},
  bug:{broken:R`def total(nums):
    return nums[0] + total(nums[1:])

print(total([1, 2, 3]))`, task:'IndexError on the empty list: there is no base case. Add one. Expected 6.',
    cases:[{inputs:[],tests:[['Prints 6','out.strip()=="6"']]}],
    sol:R`def total(nums):
    if not nums:
        return 0
    return nums[0] + total(nums[1:])

print(total([1, 2, 3]))`, wrong:[R`def total(nums):
    return nums[0] + total(nums[1:])

print(total([1, 2, 3]))`]},
  write:{prompt:'Write recursive `reverse(text)` and `my_len(items)`. **No** `[::-1]`, `len`, `reversed`, `join` or loops. Print `reverse("stressed")` then `my_len([4, 5, 6])`.',
    starter:R`# define reverse and my_len recursively
`,
    cases:[{inputs:[],tests:[['Printed','lines==["desserts","3"]'],['reverse empty','g["reverse"]("")==""'],['reverse one','g["reverse"]("a")=="a"'],['my_len empty','g["my_len"]([])==0'],['my_len five','g["my_len"]([1,1,1,1,1])==5'],['No cheating','"[::-1]" not in src and "len(" not in src.replace("my_len(","") and "reversed" not in src and "join" not in src and "for " not in src and "while " not in src']]}],
    sol:R`def reverse(text):
    if text == "":
        return ""
    return reverse(text[1:]) + text[0]

def my_len(items):
    if not items:
        return 0
    return 1 + my_len(items[1:])

print(reverse("stressed"))
print(my_len([4, 5, 6]))`,
    wrong:[R`def reverse(text):
    return text[::-1]

def my_len(items):
    return len(items)

print(reverse("stressed"))
print(my_len([4, 5, 6]))`, R`def reverse(text):
    if text == "":
        return ""
    return text[0] + reverse(text[1:])

def my_len(items):
    if not items:
        return 0
    return 1 + my_len(items[1:])

print(reverse("stressed"))
print(my_len([4, 5, 6]))`],
    hints:['reverse: base case is the empty string.','Recursive case: reverse the rest, THEN add the first letter at the end.','my_len: base case empty list returns 0; else 1 + my_len(items[1:]).','def reverse(text):\n    if text == "":\n        return ""\n    return reverse(text[1:]) + text[0]\n\ndef my_len(items):\n    if not items:\n        return 0\n    return 1 + my_len(items[1:])\n\nprint(reverse("stressed"))\nprint(my_len([4, 5, 6]))']},
  power:{can:['Break a list or string into first + rest','Write base cases for empty input'],
    expand:'Write a recursive count_char(text, ch) that counts how often ch appears.',
    where:'This first-and-rest view is the foundation of functional programming.',
    next:'Next: when a loop is better, and when recursion is.'},
  codex:{title:'Recursion on sequences',body:'first + recursion on the rest. Base case is the empty list or string.',snip:R`nums[0] + total(nums[1:])`}
},
{
  id:'r7-06', realm:7, n:6, title:'Recursion or loop? GCD and power',
  teaches:['rec-vs-loop'], requires:['rec-seq'],
  story:`"Not every problem needs a mirror," Hopper says. "But some are *born* recursive. The ancients' oldest algorithm is one of them."`,
  concept:{
    html:`Any recursion can be written as a loop, and vice versa. Choose by clarity.\n\n**Euclid's GCD** (greatest common divisor) is naturally recursive:\n\n\`\`\`\ndef gcd(a, b):\n    if b == 0:\n        return a\n    return gcd(b, a % b)\n\ngcd(48, 18)    # 6\n\`\`\`\n\n**Power** by repeated multiplication:\n\n\`\`\`\ndef power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n\`\`\`\n\n**Prefer a loop** when it is simpler or when the depth could be huge (Python stops around 1000). **Prefer recursion** for trees, nested data and "divide the problem" tasks.`,
    analogy:`You can climb stairs by recursion ("go up one, then climb the rest") or a loop; the stairs are the same.`,
    example:R`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(48, 18))`},
  predict:{code:R`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(12, 8))`, q:'What prints?', opts:['4','2','8'], ans:0, why:'gcd(12,8) → gcd(8,4) → gcd(4,0) → 4.'},
  cast:{code:R`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

print(gcd(48, 18))`, task:'Cast it.'},
  bug:{broken:R`def power(base, exp):
    if exp == 0:
        return 0
    return base * power(base, exp - 1)

print(power(2, 3))`, task:'Anything to the power 0 is 1, not 0. Expected 8.',
    cases:[{inputs:[],tests:[['Prints 8','out.strip()=="8"']]}],
    sol:R`def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(power(2, 3))`, wrong:[R`def power(base, exp):
    if exp == 0:
        return 0
    return base * power(base, exp - 1)

print(power(2, 3))`]},
  write:{prompt:'Write recursive `gcd(a, b)` and `power(base, exp)` (no `**`, `pow` or `math`). Print `gcd(48, 18)` and `power(2, 10)`.',
    starter:R`# define gcd and power recursively
`,
    cases:[{inputs:[],tests:[['Printed','lines==["6","1024"]'],['gcd(17, 5)','g["gcd"](17,5)==1'],['gcd(0, 5)','g["gcd"](0,5)==5'],['power(5, 0)','g["power"](5,0)==1'],['power(3, 3)','g["power"](3,3)==27'],['No cheating','"**" not in src and "pow(" not in src and "math" not in src and "for " not in src and "while " not in src']]}],
    sol:R`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def power(base, exp):
    if exp == 0:
        return 1
    return base * power(base, exp - 1)

print(gcd(48, 18))
print(power(2, 10))`,
    wrong:[R`def gcd(a, b):
    while b:
        a, b = b, a % b
    return a

def power(base, exp):
    return base ** exp

print(gcd(48, 18))
print(power(2, 10))`, R`def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def power(base, exp):
    if exp == 1:
        return base
    return base * power(base, exp - 1)

print(gcd(48, 18))
print(power(2, 10))`],
    hints:['gcd base case: b == 0 returns a. Else gcd(b, a % b).','power base case: exp == 0 returns 1.','Recursive power: base * power(base, exp - 1).','def gcd(a, b):\n    if b == 0:\n        return a\n    return gcd(b, a % b)\n\ndef power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n\nprint(gcd(48, 18))\nprint(power(2, 10))']},
  power:{can:['Choose between a loop and recursion','Write the classic Euclid algorithm'],
    expand:'Use gcd to reduce a fraction like 48/18 to its lowest terms.',
    where:'Euclid\'s algorithm is 2,300 years old and still used in cryptography.',
    next:'Next: making slow recursion fast with a cache.'},
  codex:{title:'Recursion or loop',body:'Same power, different shape. Use recursion for self-similar problems, loops for plain repetition.',snip:R`return gcd(b, a % b)`}
},
{
  id:'r7-07', realm:7, n:7, title:'Memoization: remember the answers',
  teaches:['rec-memo'], requires:['rec-vs-loop','dict-get'],
  story:`"Fibonacci's mirrors multiply," Hopper warns, as a million reflections flicker. "Why recompute a mirror you've already seen? **Write the answer down** the first time."`,
  concept:{
    html:`Naive \`fib\` recomputes the same values again and again. A **cache** (a dict) remembers answers:\n\n\`\`\`\ncache = {}\n\ndef fib(n):\n    if n in cache:\n        return cache[n]\n    if n < 2:\n        result = n\n    else:\n        result = fib(n - 1) + fib(n - 2)\n    cache[n] = result\n    return result\n\nfib(50)     # instant\n\`\`\`\n\nThree steps every time:\n1. **Look up** the answer in the cache first.\n2. **Compute** it only if missing.\n3. **Store** it before returning.\n\nThis technique is called **memoization**. It turns an impossibly slow \`fib(50)\` into an instant one.`,
    analogy:`Writing answers in the margin so you never solve the same sum twice.`,
    example:R`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        result = n
    else:
        result = fib(n - 1) + fib(n - 2)
    cache[n] = result
    return result

print(fib(50))`},
  predict:{code:R`cache = {}
def f(n):
    if n in cache:
        return "cached"
    cache[n] = 1
    return "new"

print(f(1), f(1))`, q:'What prints?', opts:['new cached','new new','cached cached'], ans:0, why:'The first call stores 1; the second finds it.'},
  cast:{code:R`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        result = n
    else:
        result = fib(n - 1) + fib(n - 2)
    cache[n] = result
    return result

print(fib(50))`, task:'Cast it. Try it without the cache lines and watch it time out.'},
  bug:{broken:R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))`, task:'This takes forever (SpellTimeout). Add a cache dict so fib(50) is instant. Expected 12586269025.',
    cases:[{inputs:[],tests:[['Prints fib(50)','out.strip()=="12586269025"'],['Uses a cache dict','"cache" in src or "memo" in src']]}],
    sol:R`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        result = n
    else:
        result = fib(n - 1) + fib(n - 2)
    cache[n] = result
    return result

print(fib(50))`, wrong:[R`def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))`]},
  write:{prompt:'Write a **memoized** recursive `fib(n)` using a dict named `cache`. Print `fib(50)` and `fib(80)`.',
    starter:R`cache = {}
`,
    cases:[{inputs:[],tests:[['Printed','lines==["12586269025","23416728348467685"]'],['fib(10)','g["fib"](10)==55'],['fib(0), fib(1)','g["fib"](0)==0 and g["fib"](1)==1'],['Cache filled','len(g["cache"])>=50'],['Recursive','src.count("fib(")>=4']]}],
    sol:R`cache = {}

def fib(n):
    if n in cache:
        return cache[n]
    if n < 2:
        result = n
    else:
        result = fib(n - 1) + fib(n - 2)
    cache[n] = result
    return result

print(fib(50))
print(fib(80))`,
    wrong:[R`cache = {}

def fib(n):
    a, b = 0, 1
    for i in range(n):
        a, b = b, a + b
    return a

print(fib(50))
print(fib(80))`, R`cache = {}

def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(50))
print(fib(80))`],
    hints:['At the top: if n in cache: return cache[n].','Compute result (base case or two recursive calls).','Store cache[n] = result, then return result.','cache = {}\n\ndef fib(n):\n    if n in cache:\n        return cache[n]\n    if n < 2:\n        result = n\n    else:\n        result = fib(n - 1) + fib(n - 2)\n    cache[n] = result\n    return result\n\nprint(fib(50))\nprint(fib(80))']},
  power:{can:['Speed up recursion dramatically with a cache','Use a dict as memory'],
    expand:'Look up functools.lru_cache: Python can memoize for you with one line.',
    where:'Caching is everywhere: web servers, databases, compilers and games.',
    next:'Next: splitting a problem in half - binary search.'},
  codex:{title:'Memoization',body:'Check the cache, compute if missing, store, return. Turns exponential into linear.',snip:R`if n in cache:
    return cache[n]`}
},
{
  id:'r7-08', realm:7, n:8, title:'Divide and conquer: recursive binary search',
  teaches:['rec-divide'], requires:['rec-memo'],
  story:`"Searching a thousand-page ledger? Open to the middle," Hopper says. "Too early or too late? You've just thrown away **half**. Repeat with the half that's left."`,
  concept:{
    html:`In a **sorted** list, you can find an item by repeatedly halving the search area:\n\n\`\`\`\ndef bsearch(items, target, lo=0, hi=None):\n    if hi is None:\n        hi = len(items) - 1\n    if lo > hi:\n        return -1                 # nowhere left to look\n    mid = (lo + hi) // 2\n    if items[mid] == target:\n        return mid\n    if items[mid] < target:\n        return bsearch(items, target, mid + 1, hi)\n    return bsearch(items, target, lo, mid - 1)\n\`\`\`\n\nEach call discards **half** of what remains: a list of a million needs only about **20** steps. A plain loop through a million items takes up to a million.\n\nThe list must be **sorted** first.`,
    analogy:`Guessing a number from 1 to 100: "50? higher. 75? lower..." you find it in about 7 guesses.`,
    example:R`def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid + 1, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch([2, 4, 6, 8, 10, 12], 10))`},
  predict:{code:R`print((0 + 9) // 2, (3 + 4) // 2)`, q:'What prints?', opts:['4 3','5 4','4 4'], ans:0, why:'Integer division rounds down: 9//2 = 4 and 7//2 = 3.'},
  cast:{code:R`def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid + 1, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch([2, 4, 6, 8, 10, 12], 10))`, task:'Cast it. Search for a missing number.'},
  bug:{broken:R`def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch([1, 3], 3))`, task:'RecursionError: searching right should skip the middle (mid + 1). Fix it so the answer is 1.',
    cases:[{inputs:[],tests:[['Prints 1','out.strip()=="1"']]}],
    sol:R`def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid + 1, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch([1, 3], 3))`, wrong:[R`def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch([1, 3], 3))`]},
  write:{prompt:'Write a recursive `bsearch(items, target, lo=0, hi=None)` returning the index of `target` in a sorted list, or `-1`. Do not use `.index()`, `in` on the list, or loops. Print `bsearch(data, 10)` then `bsearch(data, 5)`.',
    starter:R`data = [2, 4, 6, 8, 10, 12]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["4","-1"]'],['Every position','[g["bsearch"]([1,3,5,7,9],x) for x in (1,3,5,7,9)]==[0,1,2,3,4]'],['Missing values','[g["bsearch"]([1,3,5,7,9],x) for x in (0,4,10)]==[-1,-1,-1]'],['Empty list','g["bsearch"]([],3)==-1'],['Single','g["bsearch"]([7],7)==0'],['No cheating','".index(" not in src and "for " not in src.replace("for x in","") and "while " not in src']]}],
    sol:R`data = [2, 4, 6, 8, 10, 12]

def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid + 1, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch(data, 10))
print(bsearch(data, 5))`,
    wrong:[R`data = [2, 4, 6, 8, 10, 12]

def bsearch(items, target, lo=0, hi=None):
    if target in items:
        return items.index(target)
    return -1

print(bsearch(data, 10))
print(bsearch(data, 5))`, R`data = [2, 4, 6, 8, 10, 12]

def bsearch(items, target, lo=0, hi=None):
    if hi is None:
        hi = len(items) - 1
    if lo >= hi:
        return -1
    mid = (lo + hi) // 2
    if items[mid] == target:
        return mid
    if items[mid] < target:
        return bsearch(items, target, mid + 1, hi)
    return bsearch(items, target, lo, mid - 1)

print(bsearch(data, 10))
print(bsearch(data, 5))`],
    hints:['Set hi to len(items) - 1 when it is None. Base case: lo > hi means not found.','mid = (lo + hi) // 2. Found? return mid.','Too small? search (mid + 1, hi). Too big? search (lo, mid - 1).','data = [2, 4, 6, 8, 10, 12]\n\ndef bsearch(items, target, lo=0, hi=None):\n    if hi is None:\n        hi = len(items) - 1\n    if lo > hi:\n        return -1\n    mid = (lo + hi) // 2\n    if items[mid] == target:\n        return mid\n    if items[mid] < target:\n        return bsearch(items, target, mid + 1, hi)\n    return bsearch(items, target, lo, mid - 1)\n\nprint(bsearch(data, 10))\nprint(bsearch(data, 5))']},
  power:{can:['Halve a problem with each recursive call','Search a sorted list in a handful of steps'],
    expand:'Count how many comparisons a list of 1000 needs (it is at most 10).',
    where:'Databases, version-control "bisect" and dictionaries rely on this idea.',
    next:'Next: recursion over nested data.'},
  codex:{title:'Binary search',body:'Check the middle, discard the wrong half, repeat. Needs a sorted list. About log2(n) steps.',snip:R`mid = (lo + hi) // 2`}
},
{
  id:'r7-09', realm:7, n:9, title:'Nested data: flatten a list of lists',
  teaches:['rec-nested'], requires:['rec-divide','nested-list'],
  story:`Hopper opens a mirrored box: inside it, another box, inside that another, and another. "How deep does it go? You don't know. That's what recursion is **for**."`,
  concept:{
    html:`When data nests to **unknown depth** (lists inside lists, folders inside folders), recursion is the natural tool:\n\n\`\`\`\ndef flatten(items):\n    result = []\n    for item in items:\n        if isinstance(item, list):\n            result.extend(flatten(item))     # go deeper\n        else:\n            result.append(item)\n    return result\n\nflatten([1, [2, [3, 4]], 5])    # [1, 2, 3, 4, 5]\n\`\`\`\n\n- \`isinstance(item, list)\` asks "is this item a list?"\n- \`result.extend(other)\` adds **all** items of another list.\n- Base case: an item that is **not** a list.\n- Recursive case: an item that **is** a list gets flattened too.`,
    analogy:`Opening nested boxes until you reach the actual gifts.`,
    example:R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], 5]))`},
  predict:{code:R`print(isinstance([1], list), isinstance("a", list))`, q:'What prints?', opts:['True False','False True','True True'], ans:0, why:'[1] is a list; "a" is text.'},
  cast:{code:R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], 5]))`, task:'Cast it.'},
  bug:{broken:R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.append(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3]]]))`, task:'append puts the flattened list in as one item. Use extend so the answer is [1, 2, 3].',
    cases:[{inputs:[],tests:[['Prints [1, 2, 3]','lines==["[1, 2, 3]"]']]}],
    sol:R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3]]]))`, wrong:[R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.append(flatten(item))
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3]]]))`]},
  write:{prompt:'Write recursive `flatten(items)` returning a flat list from arbitrarily nested lists, and `depth(items)` returning how deeply lists are nested (`[]` and `[1, 2]` are depth 1; `[1, [2]]` is 2). Print `flatten([1, [2, [3, [4]]], 5])` then `depth([1, [2, [3, [4]]], 5])`.',
    starter:R`# define flatten and depth
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[1, 2, 3, 4, 5]","4"]'],['flatten empty','g["flatten"]([])==[]'],['flatten nested empties','g["flatten"]([[],[[]],1])==[1]'],['flatten flat','g["flatten"]([1,2])==[1,2]'],['depth values','[g["depth"](x) for x in ([],[1,2],[1,[2]],[[[[1]]]])]==[1,1,2,4]'],['Recursive','src.count("flatten(")>=3 and src.count("depth(")>=3']]}],
    sol:R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

def depth(items):
    deepest = 0
    for item in items:
        if isinstance(item, list):
            deepest = max(deepest, depth(item))
    return 1 + deepest

data = [1, [2, [3, [4]]], 5]
print(flatten(data))
print(depth(data))`,
    wrong:[R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

def depth(items):
    return 1

data = [1, [2, [3, [4]]], 5]
print(flatten(data))
print(depth(data))`, R`def flatten(items):
    return [1, 2, 3, 4, 5]

def depth(items):
    return 4

data = [1, [2, [3, [4]]], 5]
print(flatten(data))
print(depth(data))`],
    hints:['flatten: loop the items; lists are flattened (extend), other items appended.','depth: 1 plus the deepest depth among the items that are lists (0 if none).','Use max(deepest, depth(item)).','def flatten(items):\n    result = []\n    for item in items:\n        if isinstance(item, list):\n            result.extend(flatten(item))\n        else:\n            result.append(item)\n    return result\n\ndef depth(items):\n    deepest = 0\n    for item in items:\n        if isinstance(item, list):\n            deepest = max(deepest, depth(item))\n    return 1 + deepest\n\ndata = [1, [2, [3, [4]]], 5]\nprint(flatten(data))\nprint(depth(data))']},
  power:{can:['Handle data of unknown depth','Use isinstance to tell lists from other values'],
    expand:'Count how many numbers are inside a nested list, at any depth.',
    where:'JSON, file systems, HTML and org charts are all nested data walked recursively.',
    next:'Next: the other half of the Wards - handling errors on purpose.'},
  codex:{title:'Nested recursion',body:'isinstance(x, list) decides to recurse or collect. extend adds all items.',snip:R`result.extend(flatten(item))`}
}
);
