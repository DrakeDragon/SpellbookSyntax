// REALM 6 — THE SPELL FORGE — part B (lessons 10-18)
LESSONS.push(
{
  id:'r6-10', realm:6, n:10, title:'Docstrings and good names',
  teaches:['fn-docs'], requires:['fn-compose'],
  story:`Ada engraves a short note on the handle of every blade she forges. "In a year you won't remember what this does. The note will."`,
  concept:{
    html:`A **docstring** is a triple-quoted string as the **first line** of a function. It explains what the function does:\n\n\`\`\`\ndef clamp(value, low, high):\n    """Limit value to the range low..high."""\n    return max(low, min(value, high))\n\nprint(clamp.__doc__)\n\`\`\`\n\nComments (\`#\`) are ignored by Python. A docstring is **kept** and shows up in \`help(clamp)\` and editors.\n\n**Good names:**\n- functions are **verbs**: \`calculate_tax\`, \`is_valid\`, \`load_names\`\n- \`snake_case\`, no abbreviations you'll forget\n- one function, **one job**; if the name needs "and", split it`,
    analogy:`A label on a tin: you read it instead of opening every tin.`,
    example:R`def clamp(value, low, high):
    """Limit value to the range low..high."""
    return max(low, min(value, high))

print(clamp(15, 0, 10))
print(clamp.__doc__)`},
  predict:{code:R`def f():
    """Say hi."""
    return 1

print(f.__doc__)`, q:'What prints?', opts:['Say hi.','None','1'], ans:0, why:'The docstring is stored on the function as __doc__.'},
  cast:{code:R`def clamp(value, low, high):
    """Limit value to the range low..high."""
    return max(low, min(value, high))

print(clamp(15, 0, 10))
print(clamp.__doc__)`, task:'Cast it.'},
  bug:{broken:R`def clamp(v, low, high):
    # Limit v to the range low..high
    return max(low, min(v, high))

print(clamp.__doc__)`, task:'It prints None: a # comment is not a docstring. Replace it with a real triple-quoted docstring.',
    cases:[{inputs:[],tests:[['Docstring shown','out.strip()!="None" and len(out.strip())>5'],['Triple quotes','"\\"\\"\\"" in src']]}],
    sol:R`def clamp(v, low, high):
    """Limit v to the range low..high."""
    return max(low, min(v, high))

print(clamp.__doc__)`, wrong:[R`def clamp(v, low, high):
    # Limit v to the range low..high
    return max(low, min(v, high))

print(clamp.__doc__)`]},
  write:{prompt:'Define `clamp(value, low, high)` with a docstring, returning value limited to the range. Print `clamp(15, 0, 10)`, `clamp(-5, 0, 10)` and `clamp(5, 0, 10)`.',
    starter:R`# define clamp with a docstring
`,
    cases:[{inputs:[],tests:[['Prints 10, 0, 5','lines==["10","0","5"]'],['Has a docstring','bool(g["clamp"].__doc__) and len(g["clamp"].__doc__.strip())>5'],['clamp(3, 5, 9)','g["clamp"](3,5,9)==5'],['clamp(7, 5, 9)','g["clamp"](7,5,9)==7']]}],
    sol:R`def clamp(value, low, high):
    """Limit value to the range low..high."""
    return max(low, min(value, high))

print(clamp(15, 0, 10))
print(clamp(-5, 0, 10))
print(clamp(5, 0, 10))`,
    wrong:[R`def clamp(value, low, high):
    return max(low, min(value, high))

print(clamp(15, 0, 10))
print(clamp(-5, 0, 10))
print(clamp(5, 0, 10))`, R`def clamp(value, low, high):
    """Limit value."""
    return 10

print(clamp(15, 0, 10))
print(0)
print(5)`],
    hints:['The docstring is the first line inside the function, in triple quotes.','max(low, min(value, high)) clamps a number.','Print the three calls.','def clamp(value, low, high):\n    """Limit value to the range low..high."""\n    return max(low, min(value, high))\n\nprint(clamp(15, 0, 10))\nprint(clamp(-5, 0, 10))\nprint(clamp(5, 0, 10))']},
  power:{can:['Document functions so others (and future you) understand them','Name functions clearly'],
    expand:'Add docstrings to every function you have written in this realm.',
    where:'Teams read docstrings constantly; undocumented code is code nobody dares touch.',
    next:'Next: where variables live - scope.'},
  codex:{title:'Docstrings',body:'A triple-quoted string as the first line of a function. Name functions with verbs.',snip:R`def f():
    """What it does."""`}
},
{
  id:'r6-11', realm:6, n:11, title:'Scope: local variables stay local',
  teaches:['fn-scope'], requires:['fn-docs'],
  story:`"Sparks made inside the forge stay inside the forge," Ada says as a spark fizzles at the door. "Variables are the same. Each function has its own little workshop."`,
  concept:{
    html:`Variables created **inside** a function are **local**: they exist only while the function runs.\n\n\`\`\`\ndef total_cost(price, qty):\n    subtotal = price * qty      # local\n    return subtotal * 1.1\n\ntotal_cost(10, 3)\nprint(subtotal)     # NameError: subtotal is not defined out here\n\`\`\`\n\n- Parameters are local too.\n- Two functions can both use a variable called \`total\`. They never clash.\n- Code **outside** can't peek in. Anything the outside needs must be **returned**.\n\nThis is a feature: it keeps functions independent so you can change one without breaking others.`,
    analogy:`Each function is a room with its own whiteboard; wiping one does not touch the others.`,
    example:R`def total_cost(price, qty):
    subtotal = price * qty
    return round(subtotal * 1.1, 2)

print(total_cost(10, 3))
print("subtotal" in dir())`},
  predict:{code:R`def f():
    x = 5

f()
print("x" in dir())`, q:'What prints?', opts:['False','True','5'], ans:0, why:'x was local to f, so it does not exist outside.'},
  cast:{code:R`def f():
    inside = 5
    return inside

print(f())
print(inside)`, task:'Cast it and read the NameError.', expectError:true},
  bug:{broken:R`def total_cost(price, qty):
    subtotal = price * qty
    return subtotal

total_cost(10, 3)
print(subtotal)`, task:'NameError: subtotal is local. Capture the RETURNED value instead and print it (the answer is 30).',
    cases:[{inputs:[],tests:[['Prints 30','out.strip()=="30"']]}],
    sol:R`def total_cost(price, qty):
    subtotal = price * qty
    return subtotal

result = total_cost(10, 3)
print(result)`, wrong:[R`def total_cost(price, qty):
    subtotal = price * qty
    return subtotal

total_cost(10, 3)
print(subtotal)`]},
  write:{prompt:'Define `total_cost(price, qty)` that works out a local variable `subtotal` and returns `round(subtotal * 1.1, 2)`. Print `total_cost(10, 3)`. `subtotal` must NOT exist outside the function.',
    starter:R`# define total_cost with a local subtotal
`,
    cases:[{inputs:[],tests:[['Prints 33.0','lines==["33.0"]'],['total_cost(2, 5)','g["total_cost"](2,5)==11.0'],['subtotal is not global','"subtotal" not in g'],['Uses a local subtotal','"subtotal =" in src or "subtotal=" in src']]}],
    sol:R`def total_cost(price, qty):
    subtotal = price * qty
    return round(subtotal * 1.1, 2)

print(total_cost(10, 3))`,
    wrong:[R`subtotal = 0
def total_cost(price, qty):
    return round(price * qty * 1.1, 2)

print(total_cost(10, 3))`, R`def total_cost(price, qty):
    return 33.0

print(total_cost(10, 3))`],
    hints:['Inside the function: subtotal = price * qty.','return round(subtotal * 1.1, 2)','Do not create subtotal outside the function.','def total_cost(price, qty):\n    subtotal = price * qty\n    return round(subtotal * 1.1, 2)\n\nprint(total_cost(10, 3))']},
  power:{can:['Predict which names exist where','Keep functions independent'],
    expand:'Write two functions that each use a local variable called result, and show they do not clash.',
    where:'Scope bugs ("it works here but not there") are among the most common in real code.',
    next:'Next: globals, shadowing and why we avoid them.'},
  codex:{title:'Local scope',body:'Variables made inside a function exist only there. Return what the outside needs.',snip:R`def f():
    x = 1   # local`}
},
{
  id:'r6-12', realm:6, n:12, title:'Globals and shadowing',
  teaches:['fn-global'], requires:['fn-scope'],
  story:`"The outside world's variables CAN be read from inside," Ada says. "But try to change one and the forge gets confused." She holds up two identical anvils. "Which one am I hitting?"`,
  concept:{
    html:`A function can **read** a global variable:\n\n\`\`\`\nrate = 0.2\ndef with_tax(price):\n    return price * (1 + rate)     # reads global rate\n\`\`\`\n\nBut **assigning** inside a function creates a **new local** that hides (shadows) the global:\n\n\`\`\`\ncount = 0\ndef bump():\n    count = count + 1     # UnboundLocalError!\n\`\`\`\n\nThe \`global count\` keyword can force it, but it makes code hard to follow. **Prefer** passing values in and returning new ones:\n\n\`\`\`\ndef bump(count):\n    return count + 1\n\ncount = bump(count)\n\`\`\``,
    analogy:`Two people with the same name in a room: shouting "Sam!" gets the closest Sam.`,
    example:R`def bump(count):
    return count + 1

count = 0
count = bump(count)
count = bump(count)
print(count)`},
  predict:{code:R`x = 10
def f():
    x = 99
    return x

print(f(), x)`, q:'What prints?', opts:['99 10','99 99','10 10'], ans:0, why:'The x inside f is a new local. The global x is unchanged.'},
  cast:{code:R`def bump(count):
    return count + 1

count = 0
count = bump(count)
count = bump(count)
print(count)`, task:'Cast it.'},
  bug:{broken:R`count = 0

def bump():
    count = count + 1

bump()
print(count)`, task:'UnboundLocalError. Rewrite bump to take count and return the new value, and assign the result back.',
    cases:[{inputs:[],tests:[['Prints 1','out.strip()=="1"'],['No global keyword','"global " not in src']]}],
    sol:R`count = 0

def bump(count):
    return count + 1

count = bump(count)
print(count)`, wrong:[R`count = 0

def bump():
    count = count + 1

bump()
print(count)`]},
  write:{prompt:'Define `next_id(current)` that **returns** `current + 1`. Start with `id_now = 0` and call it three times, printing `id_now` after each. Do not use the `global` keyword.',
    starter:R`id_now = 0
`,
    cases:[{inputs:[],tests:[['Prints 1, 2, 3','lines==["1","2","3"]'],['next_id(5)','g["next_id"](5)==6'],['No global keyword','"global " not in src']]}],
    sol:R`id_now = 0

def next_id(current):
    return current + 1

id_now = next_id(id_now)
print(id_now)
id_now = next_id(id_now)
print(id_now)
id_now = next_id(id_now)
print(id_now)`,
    wrong:[R`id_now = 0

def next_id(current):
    global id_now
    id_now += 1
    return id_now

next_id(id_now)
print(id_now)
next_id(id_now)
print(id_now)
next_id(id_now)
print(id_now)`, R`id_now = 0
print(1)
print(2)
print(3)`],
    hints:['def next_id(current): return current + 1','Assign the result back: id_now = next_id(id_now).','Print id_now after each call.','id_now = 0\n\ndef next_id(current):\n    return current + 1\n\nid_now = next_id(id_now)\nprint(id_now)\nid_now = next_id(id_now)\nprint(id_now)\nid_now = next_id(id_now)\nprint(id_now)']},
  power:{can:['Avoid UnboundLocalError','Pass values in and return values out instead of using globals'],
    expand:'Rewrite an old script that updated a global score so it passes the score in and out.',
    where:'"No hidden state" is the first rule of testable, reliable code.',
    next:'Next: pure functions - the safest kind.'},
  codex:{title:'Globals and shadowing',body:'Reading a global is fine. Assigning creates a local. Pass in and return instead of using global.',snip:R`count = bump(count)`}
},
{
  id:'r6-13', realm:6, n:13, title:'Pure functions and side effects',
  teaches:['fn-pure'], requires:['fn-global','mutability'],
  story:`"Some tools change what you hand them," Ada says, pointing at a half-melted ingot. "Others hand you a *new* one and leave yours alone. The second kind never surprises you."`,
  concept:{
    html:`A **pure function** gives the same output for the same input and changes nothing outside itself.\n\nLists are **mutable**, so a function that modifies its argument has a **side effect**:\n\n\`\`\`\ndef add_item(items, x):\n    items.append(x)         # changes the caller's list!\n\ndef add_item_pure(items, x):\n    return items + [x]      # builds a new list\n\`\`\`\n\n\`\`\`\nbag = [1, 2]\nadd_item(bag, 3)            # bag is now [1, 2, 3]\nnew = add_item_pure(bag, 4) # bag unchanged\n\`\`\`\n\nSide effects aren't evil (\`list.sort()\`, \`print\` have them). But hidden ones cause bugs, so **prefer returning new values** and make side effects obvious.`,
    analogy:`A photocopier (original untouched) vs a shredder (original gone).`,
    example:R`def add_item_pure(items, x):
    return items + [x]

bag = [1, 2]
bigger = add_item_pure(bag, 3)
print(bag, bigger)`},
  predict:{code:R`def f(items):
    items.append(9)

a = [1]
f(a)
print(a)`, q:'What prints?', opts:['[1, 9]','[1]','None'], ans:0, why:'The function modified the very same list the caller holds.'},
  cast:{code:R`def add_item_pure(items, x):
    return items + [x]

bag = [1, 2]
bigger = add_item_pure(bag, 3)
print(bag, bigger)`, task:'Cast it.'},
  bug:{broken:R`def add_item(items, x):
    items.append(x)

bag = [1, 2]
bigger = add_item(bag, 3)
print(bag)
print(bigger)`, task:'bag was changed and bigger is None. Make add_item pure: return a NEW list so the output is [1, 2] then [1, 2, 3].',
    cases:[{inputs:[],tests:[['Original untouched, new returned','lines==["[1, 2]","[1, 2, 3]"]']]}],
    sol:R`def add_item(items, x):
    return items + [x]

bag = [1, 2]
bigger = add_item(bag, 3)
print(bag)
print(bigger)`, wrong:[R`def add_item(items, x):
    items.append(x)

bag = [1, 2]
bigger = add_item(bag, 3)
print(bag)
print(bigger)`]},
  write:{prompt:'Define a pure function `without(items, x)` that returns a **new list** with every `x` removed, leaving `items` unchanged. Print the original `data` then the result of `without(data, 2)`.',
    starter:R`data = [1, 2, 3, 2, 4]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[1, 2, 3, 2, 4]","[1, 3, 4]"]'],['Original untouched by a call','(lambda o: (g["without"](o,1)==[2,3], o==[1,2,3]))([1,2,3])==(True,True)'],['Nothing to remove','g["without"]([5,6],9)==[5,6]'],['No remove call','".remove(" not in src']]}],
    sol:R`data = [1, 2, 3, 2, 4]

def without(items, x):
    return [i for i in items if i != x]

print(data)
print(without(data, 2))`,
    wrong:[R`data = [1, 2, 3, 2, 4]

def without(items, x):
    while x in items:
        items.remove(x)
    return items

print(data)
print(without(data, 2))`, R`data = [1, 2, 3, 2, 4]

def without(items, x):
    return [1, 3, 4]

print(data)
print(without(data, 2))`],
    hints:['Build a new list of the items you keep.','[i for i in items if i != x]','Return it. Do not touch items itself.','data = [1, 2, 3, 2, 4]\n\ndef without(items, x):\n    return [i for i in items if i != x]\n\nprint(data)\nprint(without(data, 2))']},
  power:{can:['Spot hidden side effects','Write functions that never surprise their callers'],
    expand:'Write sorted_copy(items) that returns a sorted new list without changing the original.',
    where:'Pure functions are trivial to test and safe to reuse, which is why professionals love them.',
    next:'Next: loops inside functions, the workhorse pattern.'},
  codex:{title:'Pure functions',body:'Same input gives same output, nothing outside changes. Return new values instead of mutating arguments.',snip:R`return items + [x]`}
},
{
  id:'r6-14', realm:6, n:14, title:'Loops inside functions',
  teaches:['fn-loops'], requires:['fn-pure','minmax'],
  story:`"Now the forge does *work*," Ada says, feeding a whole rack of ingots in. "A function that loops can process a thousand things with one call."`,
  concept:{
    html:`Most useful functions loop over their input and **return the answer at the end**:\n\n\`\`\`\ndef longest(words):\n    best = None\n    for w in words:\n        if best is None or len(w) > len(best):\n            best = w\n    return best\n\`\`\`\n\nThree habits to build:\n\n1. **Set up** an accumulator before the loop (\`best\`, \`total\`, \`count\`).\n2. **Update** it inside the loop.\n3. **Return after** the loop, not inside it (unless you want to stop early).\n\nDecide what to return for **empty input**; here it returns \`None\`.`,
    analogy:`A tally clerk who counts every sack, then hands you one number.`,
    example:R`def longest(words):
    best = None
    for w in words:
        if best is None or len(w) > len(best):
            best = w
    return best

print(longest(["pear", "fig", "apple"]))
print(longest([]))`},
  predict:{code:R`def total(nums):
    t = 0
    for n in nums:
        t += n
        return t

print(total([1, 2, 3]))`, q:'What prints?', opts:['1','6','0'], ans:0, why:'return is inside the loop, so the function ends after the first item.'},
  cast:{code:R`def longest(words):
    best = None
    for w in words:
        if best is None or len(w) > len(best):
            best = w
    return best

print(longest(["pear", "fig", "apple"]))
print(longest([]))`, task:'Cast it.'},
  bug:{broken:R`def total(nums):
    t = 0
    for n in nums:
        t += n
        return t

print(total([1, 2, 3]))`, task:'It prints 1 not 6. The return is inside the loop; move it out.',
    cases:[{inputs:[],tests:[['Prints 6','out.strip()=="6"']]}],
    sol:R`def total(nums):
    t = 0
    for n in nums:
        t += n
    return t

print(total([1, 2, 3]))`, wrong:[R`def total(nums):
    t = 0
    for n in nums:
        t += n
        return t

print(total([1, 2, 3]))`]},
  write:{prompt:'Define `longest(words)` returning the longest word (the first one wins a tie), or `None` for an empty list. Do not use `max`. Print `longest(["pear", "fig", "apple"])`.',
    starter:R`# define longest
`,
    cases:[{inputs:[],tests:[['Prints apple','lines==["apple"]'],['Tie goes to first','g["longest"](["ab","cd","e"])=="ab"'],['Empty gives None','g["longest"]([]) is None'],['Single','g["longest"](["x"])=="x"'],['No max','"max(" not in src']]}],
    sol:R`def longest(words):
    best = None
    for w in words:
        if best is None or len(w) > len(best):
            best = w
    return best

print(longest(["pear", "fig", "apple"]))`,
    wrong:[R`def longest(words):
    best = None
    for w in words:
        if best is None or len(w) >= len(best):
            best = w
    return best

print(longest(["pear", "fig", "apple"]))`, R`def longest(words):
    return max(words, key=len)

print(longest(["pear", "fig", "apple"]))`],
    hints:['Start with best = None.','Update best when it is None or the word is strictly longer.','Return best AFTER the loop.','def longest(words):\n    best = None\n    for w in words:\n        if best is None or len(w) > len(best):\n            best = w\n    return best\n\nprint(longest(["pear", "fig", "apple"]))']},
  power:{can:['Write the accumulator pattern as a function','Decide what empty input returns'],
    expand:'Write shortest(words) and count_long(words, n) in the same style.',
    where:'Totals, searches and filters are all this pattern wrapped in a function.',
    next:'Next: functions that answer yes or no.'},
  codex:{title:'Loop functions',body:'Set up, update in the loop, return after the loop. Decide what empty input returns.',snip:R`for w in words:
    ...
return best`}
},
{
  id:'r6-15', realm:6, n:15, title:'Yes/no functions: is_prime and friends',
  teaches:['fn-bool'], requires:['fn-loops'],
  story:`"The most-asked questions in a forge are yes-or-no," says Ada. "Is it sharp? Is it hot? Is it prime?" She grins. "A function that answers True or False is called a **predicate**."`,
  concept:{
    html:`A **predicate** returns \`True\` or \`False\` and is usually named \`is_...\` or \`has_...\`:\n\n\`\`\`\ndef is_prime(n):\n    if n < 2:\n        return False\n    for d in range(2, n):\n        if n % d == 0:\n            return False     # found a divisor: stop early\n    return True              # none found\n\`\`\`\n\n- **Early return:** once the answer is known, return immediately.\n- Handle the edge cases first (\`n < 2\`).\n- Then you can filter with it: \`[n for n in range(20) if is_prime(n)]\`.\n\nNever write \`if cond: return True else: return False\`; just \`return cond\`.`,
    analogy:`A bouncer: checks one rule, says yes or no.`,
    example:R`def is_prime(n):
    if n < 2:
        return False
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print([n for n in range(20) if is_prime(n)])`},
  predict:{code:R`def is_big(n):
    return n > 10

print(is_big(3), is_big(30))`, q:'What prints?', opts:['False True','True False','False False'], ans:0, why:'The comparison itself is the returned True/False.'},
  cast:{code:R`def is_prime(n):
    if n < 2:
        return False
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print([n for n in range(20) if is_prime(n)])`, task:'Cast it.'},
  bug:{broken:R`def is_prime(n):
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print(is_prime(1), is_prime(7))`, task:'1 is NOT prime but this says True. Handle numbers below 2 first. Expected: False True.',
    cases:[{inputs:[],tests:[['False True','out.strip()=="False True"']]}],
    sol:R`def is_prime(n):
    if n < 2:
        return False
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print(is_prime(1), is_prime(7))`, wrong:[R`def is_prime(n):
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print(is_prime(1), is_prime(7))`]},
  write:{prompt:'Define `is_prime(n)`. Then print the list of primes from 0 to 19 built with a comprehension that uses it.',
    starter:R`# define is_prime
`,
    cases:[{inputs:[],tests:[['Primes under 20','lines==["[2, 3, 5, 7, 11, 13, 17, 19]"]'],['Small cases','[g["is_prime"](n) for n in (0,1,2,3,4,9)]==[False,False,True,True,False,False]'],['Bigger','g["is_prime"](97) is True and g["is_prime"](91) is False'],['Uses a comprehension','"for" in src and "[" in src and "is_prime(" in src']]}],
    sol:R`def is_prime(n):
    if n < 2:
        return False
    for d in range(2, n):
        if n % d == 0:
            return False
    return True

print([n for n in range(20) if is_prime(n)])`,
    wrong:[R`def is_prime(n):
    return n > 1

print([n for n in range(20) if is_prime(n)])`, R`def is_prime(n):
    if n < 2:
        return False
    for d in range(2, n // 2):
        if n % d == 0:
            return False
    return True

print([n for n in range(20) if is_prime(n)])`],
    hints:['Numbers below 2 are not prime: return False first.','Loop d from 2 to n-1; if n % d == 0 return False.','After the loop return True. Then the comprehension.','def is_prime(n):\n    if n < 2:\n        return False\n    for d in range(2, n):\n        if n % d == 0:\n            return False\n    return True\n\nprint([n for n in range(20) if is_prime(n)])']},
  power:{can:['Write predicates with early returns','Filter lists with your own functions'],
    expand:'Write is_palindrome(text) and is_leap_year(year) the same way.',
    where:'Validation, filtering and business rules are all predicates.',
    next:'Next: input-validating helpers you can reuse everywhere.'},
  codex:{title:'Predicates',body:'Return True/False, name them is_... Return early when the answer is known.',snip:R`def is_prime(n):
    if n < 2:
        return False`}
},
{
  id:'r6-16', realm:6, n:16, title:'A reusable ask_int helper',
  teaches:['fn-validate'], requires:['fn-bool','ask-until-valid'],
  story:`"Every apprentice writes the same 'ask until valid' loop forty times," Ada sighs. "Write it **once**, in a function, and never again."`,
  concept:{
    html:`Wrap a validation loop in a function and you can reuse it for every question:\n\n\`\`\`\ndef ask_int(prompt, low, high):\n    while True:\n        text = input(prompt)\n        if text.isdigit() and low <= int(text) <= high:\n            return int(text)\n        print("Try again")\n\nage = ask_int("Age: ", 1, 120)\nlevel = ask_int("Level: ", 1, 10)\n\`\`\`\n\n- The function **keeps asking** until it can return.\n- \`return\` inside \`while True\` is how it escapes.\n- Parameters (\`prompt\`, \`low\`, \`high\`) make one helper fit many questions.`,
    analogy:`A doorman who keeps asking for ID until it is valid.`,
    example:R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            return int(text)
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`},
  predict:{code:R`def f():
    while True:
        return 5
        print("never")

print(f())`, q:'What prints?', opts:['5','never','Nothing (infinite loop)'], ans:0, why:'return exits the function immediately, even from inside a loop.'},
  cast:{code:R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            return int(text)
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`, task:'Cast it with inputs: abc, 200, 30.', inputs:['abc','200','30']},
  bug:{broken:R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            print(int(text))
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`, task:'It never stops asking when valid. Return the number instead of printing it.',
    cases:[{inputs:['30'],tests:[['Age: 30 and no retry','lines[-1]=="Age: 30" and "Try again" not in lines']]}],
    sol:R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            return int(text)
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`, wrong:[R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            print(int(text))
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`]},
  write:{prompt:'Define `ask_int(prompt, low, high)` that keeps asking until the answer is whole digits within the range (printing `Try again` after each bad answer) and **returns** the int. Use it: `age = ask_int("Age: ", 1, 120)`, then `print("Age:", age)`.',
    starter:R`# define ask_int, then use it
`,
    inputs:['abc','200','30'],
    cases:[{inputs:['abc','200','30'],tests:[['Two retries then 30','lines.count("Try again")==2 and lines[-1]=="Age: 30"']]},{inputs:['25'],tests:[['Straight in','lines[-1]=="Age: 25" and "Try again" not in lines']]},{inputs:['0','1'],tests:[['Zero is below the range','lines.count("Try again")==1 and lines[-1]=="Age: 1"']]},{inputs:['120'],tests:[['Top of range','lines[-1]=="Age: 120"']]},{inputs:['121','5'],tests:[['Over the top','lines.count("Try again")==1 and lines[-1]=="Age: 5"']]}],
    sol:R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit() and low <= int(text) <= high:
            return int(text)
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`,
    wrong:[R`def ask_int(prompt, low, high):
    while True:
        text = input(prompt)
        if text.isdigit():
            return int(text)
        print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`, R`def ask_int(prompt, low, high):
    text = input(prompt)
    if text.isdigit() and low <= int(text) <= high:
        return int(text)
    print("Try again")

age = ask_int("Age: ", 1, 120)
print("Age:", age)`],
    hints:['A while True loop that asks, checks, and returns when valid.','Valid = text.isdigit() and low <= int(text) <= high.','Print Try again at the bottom of each failed pass.','def ask_int(prompt, low, high):\n    while True:\n        text = input(prompt)\n        if text.isdigit() and low <= int(text) <= high:\n            return int(text)\n        print("Try again")\n\nage = ask_int("Age: ", 1, 120)\nprint("Age:", age)']},
  power:{can:['Package a validation loop once and reuse it','Escape a loop with return'],
    expand:'Add ask_choice(prompt, options) that only accepts one of the given words.',
    where:'Every command-line tool has helpers like this.',
    next:'Next: turning a repetitive script into functions.'},
  codex:{title:'Reusable ask helpers',body:'Wrap while True + validation in a function and return the clean value.',snip:R`def ask_int(prompt, low, high):
    while True:
        ...`}
},
{
  id:'r6-17', realm:6, n:17, title:'Refactoring: from repetition to functions',
  teaches:['fn-refactor'], requires:['fn-validate'],
  story:`Ada hands you a scroll of copy-pasted code. "Same twelve lines, three times. When one is wrong they are all wrong. A good smith **refactors**: same result, cleaner shape."`,
  concept:{
    html:`**Refactoring** means restructuring code without changing what it does.\n\nBefore:\n\n\`\`\`\nif s1 >= 90: g1 = "A"\nelif s1 >= 80: g1 = "B"\n...\nif s2 >= 90: g2 = "A"   # the same chain again\n\`\`\`\n\nAfter:\n\n\`\`\`\ndef letter(score):\n    if score >= 90: return "A"\n    if score >= 80: return "B"\n    if score >= 70: return "C"\n    return "F"\n\nfor s in scores:\n    print(s, letter(s))\n\`\`\`\n\n**The rule of three:** the second time you copy code, think; the third time, make a function.\n\nBonus: a fix now needs to be made in **one** place.`,
    analogy:`Writing a recipe once instead of re-explaining it for every dish.`,
    example:R`def letter(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"

for s in [95, 82, 67]:
    print(s, letter(s))`},
  predict:{code:R`def sign(n):
    if n > 0:
        return "+"
    if n < 0:
        return "-"
    return "0"

print(sign(5), sign(-2), sign(0))`, q:'What prints?', opts:['+ - 0','+ + 0','- + 0'], ans:0, why:'Each early return handles one case.'},
  cast:{code:R`def letter(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"

for s in [95, 82, 67]:
    print(s, letter(s))`, task:'Cast it.'},
  bug:{broken:R`def letter(score):
    if score > 90:
        return "A"
    if score > 80:
        return "B"
    if score > 70:
        return "C"
    return "F"

print(letter(90), letter(80), letter(70))`, task:'Boundaries are wrong: exactly 90 is an A, 80 a B, 70 a C. Expected: A B C.',
    cases:[{inputs:[],tests:[['A B C','out.strip()=="A B C"']]}],
    sol:R`def letter(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"

print(letter(90), letter(80), letter(70))`, wrong:[R`def letter(score):
    if score > 90:
        return "A"
    if score > 80:
        return "B"
    if score > 70:
        return "C"
    return "F"

print(letter(90), letter(80), letter(70))`]},
  write:{prompt:'Refactor the repeated chains below into one function `letter(score)` (90+ A, 80+ B, 70+ C, else F) and print each as `95 A`.',
    starter:R`s1, s2, s3 = 95, 82, 67

if s1 >= 90:
    g1 = "A"
elif s1 >= 80:
    g1 = "B"
elif s1 >= 70:
    g1 = "C"
else:
    g1 = "F"
print(s1, g1)

if s2 >= 90:
    g2 = "A"
elif s2 >= 80:
    g2 = "B"
elif s2 >= 70:
    g2 = "C"
else:
    g2 = "F"
print(s2, g2)

if s3 >= 90:
    g3 = "A"
elif s3 >= 80:
    g3 = "B"
elif s3 >= 70:
    g3 = "C"
else:
    g3 = "F"
print(s3, g3)
`,
    cases:[{inputs:[],tests:[['Printed','lines==["95 A","82 B","67 F"]'],['Boundaries','[g["letter"](x) for x in (100,90,89,80,79,70,69,0)]==["A","A","B","B","C","C","F","F"]'],['One chain only','src.count("elif")<=2 and src.count(">= 70")+src.count(">=70")<=1']]}],
    sol:R`s1, s2, s3 = 95, 82, 67

def letter(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"

for s in (s1, s2, s3):
    print(s, letter(s))`,
    wrong:[R`s1, s2, s3 = 95, 82, 67

if s1 >= 90:
    g1 = "A"
elif s1 >= 80:
    g1 = "B"
elif s1 >= 70:
    g1 = "C"
else:
    g1 = "F"
print(s1, g1)

def letter(score):
    return "F"

print(s2, "B")
print(s3, "F")`, R`s1, s2, s3 = 95, 82, 67

def letter(score):
    if score > 90:
        return "A"
    if score > 80:
        return "B"
    if score > 70:
        return "C"
    return "F"

for s in (s1, s2, s3):
    print(s, letter(s))`],
    hints:['Make one function holding a single if-chain with returns.','Return "A" for >= 90, "B" for >= 80, "C" for >= 70, else "F".','Loop over the three scores and print score and letter(score). Delete the old chains.','s1, s2, s3 = 95, 82, 67\n\ndef letter(score):\n    if score >= 90:\n        return "A"\n    if score >= 80:\n        return "B"\n    if score >= 70:\n        return "C"\n    return "F"\n\nfor s in (s1, s2, s3):\n    print(s, letter(s))']},
  power:{can:['Replace copy-pasted code with a function','Fix a rule in exactly one place'],
    expand:'Add a plus/minus variant (A-, B+) by editing only the one function.',
    where:'Refactoring is a daily activity of every professional developer.',
    next:'Mission time: build a unit converter tool from functions.'},
  codex:{title:'Refactoring',body:'Same behaviour, cleaner shape. Repeated code becomes a function.',snip:R`def letter(score): ...`}
},
{
  id:'r6-18', realm:6, n:18, title:'Real-World Mission: The Unit Converter',
  teaches:['mission6a'], requires:['fn-refactor'],
  story:`A traveller bursts in, clutching a passport and a very confused scale. "Kilometres? Miles? Fahrenheit? I can't do this in my head!" Ada passes her the tongs. "Forge her a converter. **Three functions and a menu.**"`,
  concept:{
    html:`**Mission brief:** a unit converter.\n\nDefine three functions that **return** a number:\n\n- \`km_to_miles(km)\` → \`km * 0.621371\`\n- \`kg_to_lb(kg)\` → \`kg * 2.20462\`\n- \`c_to_f(c)\` → \`c * 9 / 5 + 32\`\n\nThen loop forever:\n\n1. print the menu line exactly: \`1) km to miles | 2) kg to lb | 3) C to F | 4) quit\`\n2. ask \`Choice: \`\n3. on \`4\` print \`Bye\` and stop\n4. on \`1\`, \`2\` or \`3\` ask \`Value: \` (a decimal number) and print the result with two decimals:\n   \`10.00 km = 6.21 miles\`, \`2.50 kg = 5.51 lb\`, \`100.00 C = 212.00 F\`\n5. anything else prints \`Unknown choice\`\n\nPut the loop in a function \`main()\` and call it. That is how real tools are shaped.`,
    analogy:`A pocket calculator with three buttons.`,
    example:R`def km_to_miles(km):
    return km * 0.621371

print(f"{10:.2f} km = {km_to_miles(10):.2f} miles")`},
  predict:{code:R`def c_to_f(c):
    return c * 9 / 5 + 32

print(c_to_f(100), c_to_f(0))`, q:'What prints?', opts:['212.0 32.0','212 32','100 0'], ans:0, why:'Division makes floats: 212.0 and 32.0.'},
  cast:{code:R`def km_to_miles(km):
    return km * 0.621371

print(f"{10:.2f} km = {km_to_miles(10):.2f} miles")`, task:'Cast it. One conversion.'},
  bug:{broken:R`def c_to_f(c):
    return c * 9 / 5

print(c_to_f(100))`, task:'It forgets the +32. 100 C should be 212.0 F.',
    cases:[{inputs:[],tests:[['Prints 212.0','out.strip()=="212.0"']]}],
    sol:R`def c_to_f(c):
    return c * 9 / 5 + 32

print(c_to_f(100))`, wrong:[R`def c_to_f(c):
    return c * 9 / 5

print(c_to_f(100))`]},
  write:{prompt:'Build the converter from the brief: three conversion functions, the menu loop inside `main()`, and a call to `main()` at the end.',
    starter:R`# define km_to_miles, kg_to_lb, c_to_f, then main()
`,
    inputs:['1','10','4'],
    cases:[{inputs:['1','10','4'],tests:[['km to miles','[l for l in lines if not l.startswith(("Choice: ","Value: "))]==["1) km to miles | 2) kg to lb | 3) C to F | 4) quit","10.00 km = 6.21 miles","1) km to miles | 2) kg to lb | 3) C to F | 4) quit","Bye"]'],['Functions exist and work','abs(g["km_to_miles"](10)-6.21371)<1e-9 and abs(g["kg_to_lb"](10)-22.0462)<1e-9 and g["c_to_f"](100)==212.0'],['main exists','callable(g.get("main"))']]},{inputs:['3','100','2','2.5','9','4'],tests:[['Mixed','[l for l in lines if not l.startswith(("Choice: ","Value: "))]==["1) km to miles | 2) kg to lb | 3) C to F | 4) quit","100.00 C = 212.00 F","1) km to miles | 2) kg to lb | 3) C to F | 4) quit","2.50 kg = 5.51 lb","1) km to miles | 2) kg to lb | 3) C to F | 4) quit","Unknown choice","1) km to miles | 2) kg to lb | 3) C to F | 4) quit","Bye"]']]},{inputs:['4'],tests:[['Quit at once','[l for l in lines if not l.startswith("Choice: ")]==["1) km to miles | 2) kg to lb | 3) C to F | 4) quit","Bye"]']]},{inputs:['2','0','4'],tests:[['Zero kilograms','"0.00 kg = 0.00 lb" in lines']]}],
    sol:R`def km_to_miles(km):
    return km * 0.621371

def kg_to_lb(kg):
    return kg * 2.20462

def c_to_f(c):
    return c * 9 / 5 + 32

def main():
    while True:
        print("1) km to miles | 2) kg to lb | 3) C to F | 4) quit")
        choice = input("Choice: ")
        if choice == "4":
            print("Bye")
            break
        if choice == "1":
            v = float(input("Value: "))
            print(f"{v:.2f} km = {km_to_miles(v):.2f} miles")
        elif choice == "2":
            v = float(input("Value: "))
            print(f"{v:.2f} kg = {kg_to_lb(v):.2f} lb")
        elif choice == "3":
            v = float(input("Value: "))
            print(f"{v:.2f} C = {c_to_f(v):.2f} F")
        else:
            print("Unknown choice")

main()`,
    wrong:[R`def km_to_miles(km):
    return km * 0.621371

def kg_to_lb(kg):
    return kg * 2.20462

def c_to_f(c):
    return c * 9 / 5 + 32

def main():
    while True:
        print("1) km to miles | 2) kg to lb | 3) C to F | 4) quit")
        choice = input("Choice: ")
        if choice == "4":
            print("Bye")
            break
        v = float(input("Value: "))
        if choice == "1":
            print(f"{v:.2f} km = {km_to_miles(v):.2f} miles")
        elif choice == "2":
            print(f"{v:.2f} kg = {kg_to_lb(v):.2f} lb")
        elif choice == "3":
            print(f"{v:.2f} C = {c_to_f(v):.2f} F")
        else:
            print("Unknown choice")

main()`, R`def km_to_miles(km):
    return km * 0.621371

def kg_to_lb(kg):
    return kg * 2.20462

def c_to_f(c):
    return c * 9 / 5

def main():
    while True:
        print("1) km to miles | 2) kg to lb | 3) C to F | 4) quit")
        choice = input("Choice: ")
        if choice == "4":
            print("Bye")
            break
        if choice == "1":
            v = float(input("Value: "))
            print(f"{v:.2f} km = {km_to_miles(v):.2f} miles")
        elif choice == "2":
            v = float(input("Value: "))
            print(f"{v:.2f} kg = {kg_to_lb(v):.2f} lb")
        elif choice == "3":
            v = float(input("Value: "))
            print(f"{v:.2f} C = {c_to_f(v):.2f} F")
        else:
            print("Unknown choice")

main()`],
    hints:['Three tiny functions that just return the maths.','main() holds the while True loop: print menu, ask Choice, break on 4.','Inside, ask Value only for choices 1-3, print with :.2f formats, else print Unknown choice.','def km_to_miles(km):\n    return km * 0.621371\n\ndef kg_to_lb(kg):\n    return kg * 2.20462\n\ndef c_to_f(c):\n    return c * 9 / 5 + 32\n\ndef main():\n    while True:\n        print("1) km to miles | 2) kg to lb | 3) C to F | 4) quit")\n        choice = input("Choice: ")\n        if choice == "4":\n            print("Bye")\n            break\n        if choice == "1":\n            v = float(input("Value: "))\n            print(f"{v:.2f} km = {km_to_miles(v):.2f} miles")\n        elif choice == "2":\n            v = float(input("Value: "))\n            print(f"{v:.2f} kg = {kg_to_lb(v):.2f} lb")\n        elif choice == "3":\n            v = float(input("Value: "))\n            print(f"{v:.2f} C = {c_to_f(v):.2f} F")\n        else:\n            print("Unknown choice")\n\nmain()']},
  power:{can:['Structure a tool as small functions plus a main()','Build a menu-driven app'],
    expand:'Add a fourth conversion (litres to gallons) by writing one function and one menu entry.',
    where:'Adding a feature means adding a function. That is what good structure buys you.',
    next:'Next: functions that accept any number of arguments.'},
  codex:{title:'Mission: converter',body:'Small conversion functions, a menu loop inside main(), call main().',snip:R`def main():
    while True: ...
main()`}
}
);
