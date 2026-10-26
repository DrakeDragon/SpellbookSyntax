// REALM 6 — THE SPELL FORGE (functions) — part A (lessons 1-9)
LESSONS.push(
{
  id:'r6-01', realm:6, n:1, title:'Your first function: def and call',
  teaches:['fn-def'], requires:['realm5-gap'],
  story:`Past the Scriptorium a furnace roars. **Ada**, the forge-mistress, hammers a glowing rune into a plate. "Journeyman! Till now you've cast every spell by hand, line by line. Here we **forge** spells once and cast them forever."`,
  concept:{
    html:`A **function** is a named, reusable block of code.\n\n\`\`\`\ndef banner():\n    print("=====")\n    print("FORGE")\n    print("=====")\n\nbanner()\nbanner()\n\`\`\`\n\n- \`def name():\` **defines** the function. The indented lines are its **body**.\n- Defining does **not** run it. Nothing prints until you **call** it with \`name()\`.\n- Call it as many times as you like.\n\nFunction names follow variable rules: lowercase, underscores, no spaces.`,
    analogy:`A recipe card: writing it down is not cooking; each call is one cooking.`,
    example:R`def banner():
    print("=====")
    print("FORGE")
    print("=====")

banner()
banner()`},
  predict:{code:R`def hi():
    print("Hi")

print("start")`, q:'What prints?', opts:['start','Hi\nstart','start\nHi'], ans:0, why:'hi() is defined but never called, so "Hi" never prints.'},
  cast:{code:R`def banner():
    print("=====")
    print("FORGE")
    print("=====")

banner()
banner()`, task:'Cast it. Add a third call.'},
  bug:{broken:R`def hello():
    print("Hi")
`, task:'Nothing prints because hello() is never called. Call it twice.',
    cases:[{inputs:[],tests:[['Prints Hi twice','lines==["Hi","Hi"]']]}],
    sol:R`def hello():
    print("Hi")

hello()
hello()`, wrong:[R`def hello():
    print("Hi")
`, R`def hello():
    print("Hi")

hello()`]},
  write:{prompt:'Define a function `banner()` that prints three lines: `=====`, `SPELL FORGE`, `=====`. Then call it **twice**.',
    starter:R`# define banner() here, then call it twice
`,
    cases:[{inputs:[],tests:[['Six lines','lines==["=====","SPELL FORGE","====="]*2'],['banner exists','callable(g.get("banner"))'],['Defined and called twice','src.count("banner()")>=3']]}],
    sol:R`def banner():
    print("=====")
    print("SPELL FORGE")
    print("=====")

banner()
banner()`,
    wrong:[R`print("=====")
print("SPELL FORGE")
print("=====")
print("=====")
print("SPELL FORGE")
print("=====")`, R`def banner():
    print("=====")
    print("SPELL FORGE")
    print("=====")

banner()`],
    hints:['def banner(): then indent the three print lines.','After the definition (not indented) write banner() on its own line.','Call it twice.','def banner():\n    print("=====")\n    print("SPELL FORGE")\n    print("=====")\n\nbanner()\nbanner()']},
  power:{can:['Name a block of code and reuse it','Tell defining from calling'],
    expand:'Write a function that prints a 4-line welcome message, and call it from three places.',
    where:'Every real program is built from named functions, so each can be tested and reused.',
    next:'Next: give your function inputs with parameters.'},
  codex:{title:'def and call',body:'def name(): defines. name() calls. Defining alone runs nothing.',snip:R`def banner():
    print("=====")
banner()`}
},
{
  id:'r6-02', realm:6, n:2, title:'Parameters: functions that take input',
  teaches:['fn-params'], requires:['fn-def'],
  story:`"A function that does the same thing every time is a stamp," Ada says. "A function that takes **input** is a *tool*." She slides a blank rune into a hole in the anvil, and the anvil hums out a different word.`,
  concept:{
    html:`A **parameter** is a variable the function receives when called:\n\n\`\`\`\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Ada")\ngreet("Sudo")\n\`\`\`\n\n- \`name\` in the \`def\` line is the **parameter**.\n- \`"Ada"\` in the call is the **argument** that fills it.\n- The parameter exists **only inside** the function.\n\nCalling with the wrong number of arguments is a \`TypeError\`.`,
    analogy:`A mould with a slot: whatever you drop in takes the shape.`,
    example:R`def greet(name):
    print(f"Hello, {name}!")

greet("Ada")
greet("Sudo")`},
  predict:{code:R`def show(x):
    print(x * 2)

show(4)
show("ab")`, q:'What prints?', opts:['8\nabab','8\n8','4\nab'], ans:0, why:'x * 2 is 8 for the number 4, and "abab" for the text "ab".'},
  cast:{code:R`def greet(name):
    print(f"Hello, {name}!")

greet("Ada")
greet("Sudo")`, task:'Cast it. Greet yourself.'},
  bug:{broken:R`def greet(name):
    print(f"Hello, {name}!")

greet()`, task:'TypeError: greet needs one argument. Greet "Ada".',
    cases:[{inputs:[],tests:[['Hello, Ada!','out.strip()=="Hello, Ada!"']]}],
    sol:R`def greet(name):
    print(f"Hello, {name}!")

greet("Ada")`, wrong:[R`def greet(name):
    print(f"Hello, {name}!")

greet()`]},
  write:{prompt:'Define `shout(word)` that prints the word in capitals followed by `!`. Then ask `Word: ` and call `shout` with the answer.',
    starter:R`# define shout(word) first
`,
    inputs:['fire'],
    cases:[{inputs:['fire'],tests:[['fire','lines[-1]=="FIRE!"'],['Has a parameter','"def shout(word)" in src']]},{inputs:['ice'],tests:[['ice','lines[-1]=="ICE!"']]},{inputs:['Wind'],tests:[['Wind','lines[-1]=="WIND!"']]}],
    sol:R`def shout(word):
    print(word.upper() + "!")

shout(input("Word: "))`,
    wrong:[R`def shout(word):
    print("FIRE!")

shout(input("Word: "))`, R`word = input("Word: ")
print(word.upper() + "!")`],
    hints:['def shout(word): and indent the body.','Inside print word.upper() + "!".','Call it with shout(input("Word: ")).','def shout(word):\n    print(word.upper() + "!")\n\nshout(input("Word: "))']},
  power:{can:['Pass data into a function','Reuse one function with different values'],
    expand:'Write welcome(name, city) that prints a greeting using both.',
    where:'Parameters make functions flexible: one definition, endless uses.',
    next:'Next: handing a value back with return.'},
  codex:{title:'Parameters',body:'def f(x): x is the parameter. f(5) passes the argument 5.',snip:R`def greet(name):
    print(name)`}
},
{
  id:'r6-03', realm:6, n:3, title:'Return: hand a value back',
  teaches:['fn-return'], requires:['fn-params'],
  story:`"Printing shows a result," Ada says. "But a real tool **gives** you something to keep." She hammers a plate and it clangs onto the bench in front of you. "That's a return value."`,
  concept:{
    html:`\`return\` sends a value **back to the caller** and ends the function:\n\n\`\`\`\ndef double(n):\n    return n * 2\n\nx = double(5)        # x is 10\nprint(double(7))     # 14\nprint(double(2) + 1) # 5\n\`\`\`\n\nBecause the value comes back you can store it, print it, or use it in more maths.\n\nAnything written **after** a \`return\` in the same path never runs.`,
    analogy:`A vending machine: you put money in and something comes out for you to take.`,
    example:R`def double(n):
    return n * 2

x = double(5)
print(x)
print(double(2) + 1)`},
  predict:{code:R`def add(a, b):
    return a + b
    print("never")

print(add(2, 3))`, q:'What prints?', opts:['5','5\nnever','never'], ans:0, why:'The function ends at return, so the print inside never runs.'},
  cast:{code:R`def double(n):
    return n * 2

x = double(5)
print(x)
print(double(2) + 1)`, task:'Cast it.'},
  bug:{broken:R`def area(w, h):
    w * h

print(area(3, 4))`, task:'It prints None: the product is never handed back. Return it.',
    cases:[{inputs:[],tests:[['Prints 12','out.strip()=="12"'],['Uses return','"return" in src']]}],
    sol:R`def area(w, h):
    return w * h

print(area(3, 4))`, wrong:[R`def area(w, h):
    w * h

print(area(3, 4))`]},
  write:{prompt:'Define `area(w, h)` that **returns** the area. Then print `area(3, 4)` and `area(5, 5)` on separate lines.',
    starter:R`# define area(w, h) first
`,
    cases:[{inputs:[],tests:[['Prints 12 and 25','lines==["12","25"]'],['area(2, 7)','g["area"](2,7)==14'],['area(1, 1)','g["area"](1,1)==1']]}],
    sol:R`def area(w, h):
    return w * h

print(area(3, 4))
print(area(5, 5))`,
    wrong:[R`def area(w, h):
    return 12

print(area(3, 4))
print(25)`, R`def area(w, h):
    print(w * h)

area(3, 4)
area(5, 5)`],
    hints:['def area(w, h): return w * h','Do the calls outside the function.','Print the result of each call: print(area(3, 4)).','def area(w, h):\n    return w * h\n\nprint(area(3, 4))\nprint(area(5, 5))']},
  power:{can:['Build functions that compute and hand back results','Chain function results into other maths'],
    expand:'Write perimeter(w, h) and print area(3, 4) / perimeter(3, 4).',
    where:'Nearly every function you ever write will end in a return.',
    next:'Next: the print vs return trap that catches everyone once.'},
  codex:{title:'return',body:'return sends a value back and ends the function. Functions without return give back None.',snip:R`def double(n):
    return n * 2`}
},
{
  id:'r6-04', realm:6, n:4, title:'Print vs return: the classic trap',
  teaches:['print-vs-return'], requires:['fn-return','none'],
  story:`Ada holds up two plates that look identical. "One was **shown**, one was **given**. Only the second can be used again. Confuse them and your code quietly breaks."`,
  concept:{
    html:`\`print\` **shows** a value to the person. \`return\` **gives** it to the program.\n\n\`\`\`\ndef add_print(a, b):\n    print(a + b)       # shows 5, returns None\n\ndef add_return(a, b):\n    return a + b       # gives back 5\n\nx = add_print(2, 3)    # x is None!\ny = add_return(2, 3)   # y is 5\n\`\`\`\n\nA function with no \`return\` returns \`None\`, so \`add_print(2, 3) * 2\` is a \`TypeError\`.\n\n**Rule of thumb:** functions that *compute* should **return**; only the outer program should **print**.`,
    analogy:`Showing someone a cake vs handing them the cake.`,
    example:R`def add_print(a, b):
    print(a + b)

def add_return(a, b):
    return a + b

print(add_print(2, 3))
print(add_return(2, 3))`},
  predict:{code:R`def f(x):
    x + 1

print(f(1))`, q:'What prints?', opts:['None','2','1'], ans:0, why:'No return statement, so the function returns None.'},
  cast:{code:R`def add_print(a, b):
    print(a + b)

def add_return(a, b):
    return a + b

print(add_print(2, 3))
print(add_return(2, 3))`, task:'Cast it. Notice the None.'},
  bug:{broken:R`def add(a, b):
    print(a + b)

total = add(2, 3) * 2
print(total)`, task:'TypeError: None * 2. Make add return the sum.',
    cases:[{inputs:[],tests:[['Prints 10','out.strip()=="10"'],['Uses return','"return" in src']]}],
    sol:R`def add(a, b):
    return a + b

total = add(2, 3) * 2
print(total)`, wrong:[R`def add(a, b):
    print(a + b)

total = add(2, 3) * 2
print(total)`]},
  write:{prompt:'Define `average(nums)` that **returns** the mean of a list. Then print `Average: ` followed by `average(scores)` with 1 decimal.',
    starter:R`scores = [10, 20, 30]
`,
    cases:[{inputs:[],tests:[['Prints Average: 20.0','lines[-1]=="Average: 20.0"'],['average([2, 4])','g["average"]([2,4])==3'],['average([5])','g["average"]([5])==5'],['Returns not prints','g["average"]([1,2,3]) is not None']]}],
    sol:R`scores = [10, 20, 30]

def average(nums):
    return sum(nums) / len(nums)

print(f"Average: {average(scores):.1f}")`,
    wrong:[R`scores = [10, 20, 30]

def average(nums):
    print(sum(nums) / len(nums))

average(scores)
print("Average: 20.0")`, R`scores = [10, 20, 30]

def average(nums):
    return 20

print(f"Average: {average(scores):.1f}")`],
    hints:['def average(nums): return sum(nums) / len(nums)','Return it, do not print inside.','Format with f"Average: {average(scores):.1f}".','scores = [10, 20, 30]\n\ndef average(nums):\n    return sum(nums) / len(nums)\n\nprint(f"Average: {average(scores):.1f}")']},
  power:{can:['Choose print or return correctly','Spot the None bug at a glance'],
    expand:'Add a function percent(part, whole) that returns a number, and format it outside.',
    where:'Mixing these up is one of the most common beginner bugs, and you now cannot be fooled.',
    next:'Next: functions with several parameters.'},
  codex:{title:'print vs return',body:'print shows to the person. return gives to the program. No return means None.',snip:R`return a + b   # not print(a + b)`}
},
{
  id:'r6-05', realm:6, n:5, title:'Several parameters, and their order',
  teaches:['fn-multi'], requires:['print-vs-return'],
  story:`"Arguments land in parameters **in order**," Ada warns, setting two plates in the wrong slots. The forge spits a weak, bent blade. "Order matters."`,
  concept:{
    html:`With several parameters, arguments are matched **by position**:\n\n\`\`\`\ndef bmi(weight_kg, height_m):\n    return weight_kg / height_m ** 2\n\nbmi(70, 1.75)    # weight 70, height 1.75  → 22.857...\nbmi(1.75, 70)    # swapped: nonsense!\n\`\`\`\n\nGive parameters **clear names** and keep the order in your head, or use keyword arguments (next lesson).\n\nThe count must match too: \`bmi(70)\` is a \`TypeError\` (missing argument).`,
    analogy:`Seats on a train: the first ticket goes to seat one.`,
    example:R`def bmi(weight_kg, height_m):
    return weight_kg / height_m ** 2

print(round(bmi(70, 1.75), 1))`},
  predict:{code:R`def sub(a, b):
    return a - b

print(sub(10, 3), sub(3, 10))`, q:'What prints?', opts:['7 -7','7 7','-7 7'], ans:0, why:'The first argument goes to a, the second to b.'},
  cast:{code:R`def bmi(weight_kg, height_m):
    return weight_kg / height_m ** 2

print(round(bmi(70, 1.75), 1))`, task:'Cast it. Swap the arguments and see what happens.'},
  bug:{broken:R`def bmi(weight_kg, height_m):
    return round(weight_kg / height_m ** 2, 1)

print(bmi(1.75, 70))`, task:'The arguments are in the wrong order. Fix the call (the answer should be 22.9).',
    cases:[{inputs:[],tests:[['Prints 22.9','out.strip()=="22.9"']]}],
    sol:R`def bmi(weight_kg, height_m):
    return round(weight_kg / height_m ** 2, 1)

print(bmi(70, 1.75))`, wrong:[R`def bmi(weight_kg, height_m):
    return round(weight_kg / height_m ** 2, 1)

print(bmi(1.75, 70))`]},
  write:{prompt:'Define `bmi(weight_kg, height_m)` that returns the BMI rounded to 1 decimal. Print `bmi(70, 1.75)`.',
    starter:R`# define bmi first
`,
    cases:[{inputs:[],tests:[['Prints 22.9','lines==["22.9"]'],['bmi(50, 1.6)','g["bmi"](50,1.6)==19.5'],['bmi(90, 1.8)','g["bmi"](90,1.8)==27.8']]}],
    sol:R`def bmi(weight_kg, height_m):
    return round(weight_kg / height_m ** 2, 1)

print(bmi(70, 1.75))`,
    wrong:[R`def bmi(weight_kg, height_m):
    return 22.9

print(bmi(70, 1.75))`, R`def bmi(height_m, weight_kg):
    return round(weight_kg / height_m ** 2, 1)

print(bmi(70, 1.75))`],
    hints:['weight / height ** 2, then round(..., 1).','Parameters in the order the question lists them: weight_kg, height_m.','return the rounded value, then print the call.','def bmi(weight_kg, height_m):\n    return round(weight_kg / height_m ** 2, 1)\n\nprint(bmi(70, 1.75))']},
  power:{can:['Write functions with several inputs','Keep argument order straight'],
    expand:'Write discount(price, percent) and print discount(80, 25).',
    where:'Calculators, converters and game formulas all take several inputs.',
    next:'Next: default values so callers can leave things out.'},
  codex:{title:'Several parameters',body:'Arguments match parameters by position. The count must match.',snip:R`def bmi(weight_kg, height_m):`}
},
{
  id:'r6-06', realm:6, n:6, title:'Default values for optional inputs',
  teaches:['fn-defaults'], requires:['fn-multi'],
  story:`"Most people want the standard blade," Ada says, "so I don't make them ask for it." She pins a note to the anvil: *unless told otherwise, use steel.*`,
  concept:{
    html:`Give a parameter a **default** with \`=\`:\n\n\`\`\`\ndef price_with_tax(price, rate=0.2):\n    return round(price * (1 + rate), 2)\n\nprice_with_tax(100)        # uses 0.2 → 120.0\nprice_with_tax(100, 0.1)   # overrides  → 110.0\n\`\`\`\n\n- Parameters **with** defaults must come **after** those without.\n- Defaults make the common case easy and the rare case possible.\n- Use simple defaults: numbers, text, \`True/False\`, \`None\`.`,
    analogy:`"Medium fries unless you say otherwise."`,
    example:R`def price_with_tax(price, rate=0.2):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))
print(price_with_tax(100, 0.1))`},
  predict:{code:R`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}"

print(greet("Ada"))`, q:'What prints?', opts:['Hello, Ada','Ada, Hello','TypeError'], ans:0, why:'greeting was left out so it uses its default "Hello".'},
  cast:{code:R`def price_with_tax(price, rate=0.2):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))
print(price_with_tax(100, 0.1))`, task:'Cast it.'},
  bug:{broken:R`def price_with_tax(price, rate):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))`, task:'TypeError: missing argument. Give rate a default of 0.2.',
    cases:[{inputs:[],tests:[['Prints 120.0','out.strip()=="120.0"'],['Default in def','"rate=0.2" in src']]}],
    sol:R`def price_with_tax(price, rate=0.2):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))`, wrong:[R`def price_with_tax(price, rate):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))`]},
  write:{prompt:'Define `price_with_tax(price, rate=0.2)` returning the price plus tax, rounded to 2 decimals. Print `price_with_tax(100)` then `price_with_tax(100, 0.1)`.',
    starter:R`# define price_with_tax first
`,
    cases:[{inputs:[],tests:[['Prints both','lines==["120.0","110.0"]'],['One argument','g["price_with_tax"](50)==60.0'],['Two arguments','g["price_with_tax"](200,0.5)==300.0']]}],
    sol:R`def price_with_tax(price, rate=0.2):
    return round(price * (1 + rate), 2)

print(price_with_tax(100))
print(price_with_tax(100, 0.1))`,
    wrong:[R`def price_with_tax(price, rate):
    return round(price * (1 + rate), 2)

print(price_with_tax(100, 0.2))
print(price_with_tax(100, 0.1))`, R`def price_with_tax(price, rate=0.2):
    return round(price * 1.2, 2)

print(price_with_tax(100))
print(price_with_tax(100, 0.1))`],
    hints:['def price_with_tax(price, rate=0.2):','return round(price * (1 + rate), 2)','Call with one argument, then with two.','def price_with_tax(price, rate=0.2):\n    return round(price * (1 + rate), 2)\n\nprint(price_with_tax(100))\nprint(price_with_tax(100, 0.1))']},
  power:{can:['Make parameters optional','Design friendly function interfaces'],
    expand:'Write tip(bill, percent=15) and call it with and without the percent.',
    where:'Libraries use defaults everywhere (print has sep=" " and end="\\n").',
    next:'Next: naming arguments in the call.'},
  codex:{title:'Defaults',body:'def f(a, b=5): b is optional. Defaults come after required parameters.',snip:R`def f(price, rate=0.2):`}
},
{
  id:'r6-07', realm:6, n:7, title:'Keyword arguments',
  teaches:['fn-kwargs'], requires:['fn-defaults'],
  story:`"What if you want to change only the *third* setting?" Ada asks. She taps a label on each lever. "Call them by name. Then order stops mattering."`,
  concept:{
    html:`In a call you can pass arguments **by name**:\n\n\`\`\`\ndef make_tag(text, tag="p", cls=""):\n    if cls:\n        return f'<{tag} class="{cls}">{text}</{tag}>'\n    return f"<{tag}>{text}</{tag}>"\n\nmake_tag("hi")                  # <p>hi</p>\nmake_tag("hi", tag="b")         # <b>hi</b>\nmake_tag("hi", cls="big")       # <p class="big">hi</p>\nmake_tag(cls="big", text="hi")  # order no longer matters\n\`\`\`\n\n- Positional arguments come **first**, keyword ones after.\n- Keywords make calls **self-explaining** (\`round(x, ndigits=2)\`).\n- You've used them already: \`print(a, b, sep="-")\`, \`sorted(x, key=len)\`.`,
    analogy:`Ordering with labels: "no onions, extra cheese" instead of position.`,
    example:R`def make_tag(text, tag="p", cls=""):
    if cls:
        return f'<{tag} class="{cls}">{text}</{tag}>'
    return f"<{tag}>{text}</{tag}>"

print(make_tag("hi"))
print(make_tag("hi", tag="b"))
print(make_tag("hi", cls="big"))`},
  predict:{code:R`def f(a, b=2, c=3):
    return a + b + c

print(f(1, c=10))`, q:'What prints?', opts:['13','6','14'], ans:0, why:'a=1, b=2 (default), c=10 → 13.'},
  cast:{code:R`def make_tag(text, tag="p", cls=""):
    if cls:
        return f'<{tag} class="{cls}">{text}</{tag}>'
    return f"<{tag}>{text}</{tag}>"

print(make_tag("hi"))
print(make_tag("hi", tag="b"))
print(make_tag("hi", cls="big"))`, task:'Cast it.'},
  bug:{broken:R`def f(a, b=2, c=3):
    return a + b + c

print(f(1, 10))`, task:'We wanted c to be 10 but 10 went into b. Name the argument so the answer is 13.',
    cases:[{inputs:[],tests:[['Prints 13','out.strip()=="13"'],['Uses c=','"c=10" in src']]}],
    sol:R`def f(a, b=2, c=3):
    return a + b + c

print(f(1, c=10))`, wrong:[R`def f(a, b=2, c=3):
    return a + b + c

print(f(1, 10))`]},
  write:{prompt:'Define `make_tag(text, tag="p", cls="")` returning `<p>text</p>`. If `cls` is given the opening tag becomes `<p class="cls">`. Print `make_tag("hi")` and `make_tag("hi", tag="b", cls="big")`.',
    starter:R`# define make_tag first
`,
    cases:[{inputs:[],tests:[['Prints both','lines==["<p>hi</p>","<b class=\\"big\\">hi</b>"]'],['Tag only','g["make_tag"]("x", tag="h1")=="<h1>x</h1>"'],['Class only','g["make_tag"]("x", cls="c")==\'<p class="c">x</p>\''],['Calls make_tag','src.count("make_tag(")>=3']]}],
    sol:R`def make_tag(text, tag="p", cls=""):
    if cls:
        return f'<{tag} class="{cls}">{text}</{tag}>'
    return f"<{tag}>{text}</{tag}>"

print(make_tag("hi"))
print(make_tag("hi", tag="b", cls="big"))`,
    wrong:[R`def make_tag(text, tag="p", cls=""):
    return f"<{tag}>{text}</{tag}>"

print(make_tag("hi"))
print(make_tag("hi", tag="b", cls="big"))`, R`def make_tag(text, tag="p", cls=""):
    if cls:
        return f'<{tag} class="{cls}">{text}</{tag}>'
    return f"<{tag}>{text}</{tag}>"

print("<p>hi</p>")
print('<b class="big">hi</b>')`],
    hints:['Use an if cls: branch for the class version.','Build with f-strings: f"<{tag}>{text}</{tag}>".','Class version: f\'<{tag} class="{cls}">{text}</{tag}>\'.','def make_tag(text, tag="p", cls=""):\n    if cls:\n        return f\'<{tag} class="{cls}">{text}</{tag}>\'\n    return f"<{tag}>{text}</{tag}>"\n\nprint(make_tag("hi"))\nprint(make_tag("hi", tag="b", cls="big"))']},
  power:{can:['Call functions with named arguments','Skip optional inputs you do not need'],
    expand:'Add an id parameter and call make_tag with only text and id.',
    where:'Real APIs have dozens of options and use keyword arguments for almost all of them.',
    next:'Next: returning more than one value.'},
  codex:{title:'Keyword arguments',body:'f(a, c=10) passes by name. Positional first, keywords after.',snip:R`make_tag("hi", cls="big")`}
},
{
  id:'r6-08', realm:6, n:8, title:'Returning several values',
  teaches:['fn-return-multi'], requires:['fn-kwargs','unpack'],
  story:`"Sometimes one result isn't enough," Ada says, lifting a sword and its sheath together. "Return both as a pair, and the caller can take them apart."`,
  concept:{
    html:`A function can return several values separated by commas. Python packs them into a **tuple**:\n\n\`\`\`\ndef min_max(nums):\n    return min(nums), max(nums)\n\nlow, high = min_max([4, 9, 2])    # unpack on the way out\nprint(low, high)                  # 2 9\n\`\`\`\n\n- The caller **unpacks** into matching names (you learned this with tuples).\n- Or keep the tuple: \`result = min_max(...)\` then \`result[0]\`.\n- The number of names must match the number of values.`,
    analogy:`A shop handing you a bag containing two items: you take them out separately.`,
    example:R`def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([4, 9, 2])
print(low, high)`},
  predict:{code:R`def f():
    return 1, 2

print(f())`, q:'What prints?', opts:['(1, 2)','1 2','[1, 2]'], ans:0, why:'Several return values become one tuple.'},
  cast:{code:R`def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([4, 9, 2])
print(low, high)`, task:'Cast it.'},
  bug:{broken:R`def min_max(nums):
    return min(nums), max(nums)

low, high, mid = min_max([4, 9, 2])
print(low, high)`, task:'ValueError: the function returns 2 values but three names are waiting. Fix the unpacking.',
    cases:[{inputs:[],tests:[['Prints 2 9','out.strip()=="2 9"']]}],
    sol:R`def min_max(nums):
    return min(nums), max(nums)

low, high = min_max([4, 9, 2])
print(low, high)`, wrong:[R`def min_max(nums):
    return min(nums), max(nums)

low, high, mid = min_max([4, 9, 2])
print(low, high)`]},
  write:{prompt:'Define `stats(nums)` returning `(lowest, highest, average)` with the average rounded to 2 decimals. Use it on `data` and print `Low: ..`, `High: ..`, `Avg: ..` on separate lines.',
    starter:R`data = [4, 8, 6]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Low: 4","High: 8","Avg: 6.0"]'],['stats([1, 9, 2])','g["stats"]([1,9,2])==(1,9,4.0)'],['stats([2, 2])','g["stats"]([2,2])==(2,2,2.0)'],['stats([1, 2])','g["stats"]([1,2])==(1,2,1.5)'],['Rounds to 2','g["stats"]([1,2,2])==(1,2,1.67)']]}],
    sol:R`data = [4, 8, 6]

def stats(nums):
    return min(nums), max(nums), round(sum(nums) / len(nums), 2)

low, high, avg = stats(data)
print("Low:", low)
print("High:", high)
print("Avg:", avg)`,
    wrong:[R`data = [4, 8, 6]

def stats(nums):
    return 4, 8, 6.0

low, high, avg = stats(data)
print("Low:", low)
print("High:", high)
print("Avg:", avg)`, R`data = [4, 8, 6]

def stats(nums):
    return min(nums), max(nums), sum(nums) / len(nums)

low, high, avg = stats(data)
print("Low:", low)
print("High:", high)
print("Avg:", avg)`],
    hints:['return min(nums), max(nums), and the rounded average.','round(sum(nums) / len(nums), 2)','Unpack the result into three names, then print each.','data = [4, 8, 6]\n\ndef stats(nums):\n    return min(nums), max(nums), round(sum(nums) / len(nums), 2)\n\nlow, high, avg = stats(data)\nprint("Low:", low)\nprint("High:", high)\nprint("Avg:", avg)']},
  power:{can:['Return several results at once','Unpack results cleanly'],
    expand:'Write divide(a, b) returning (quotient, remainder) using // and %.',
    where:'divmod(), min/max pairs and (success, message) results all use this pattern.',
    next:'Next: functions calling other functions.'},
  codex:{title:'Multiple returns',body:'return a, b gives a tuple. Unpack with x, y = f().',snip:R`low, high = min_max(nums)`}
},
{
  id:'r6-09', realm:6, n:9, title:'Functions calling functions',
  teaches:['fn-compose'], requires:['fn-return-multi'],
  story:`"Big spells are small spells in a chain," Ada says. She clamps a hammer, tongs and quench-bucket into one motion. "Each function does **one job**. A bigger function conducts them."`,
  concept:{
    html:`Functions can call other functions you've defined:\n\n\`\`\`\ndef is_even(n):\n    return n % 2 == 0\n\ndef count_evens(nums):\n    count = 0\n    for n in nums:\n        if is_even(n):\n            count += 1\n    return count\n\`\`\`\n\n**Why split like this?**\n- Each piece has one clear job and a clear name.\n- You can test a small piece on its own.\n- Reading \`if is_even(n)\` is easier than \`if n % 2 == 0\`.\n\nPython reads \`def\` lines top to bottom, but a function only needs another function to exist **by the time it is called**.`,
    analogy:`A kitchen: one cook chops, another fries, the head chef calls them in order.`,
    example:R`def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens([1, 2, 4, 7]))`},
  predict:{code:R`def sq(n):
    return n * n

def sum_sq(a, b):
    return sq(a) + sq(b)

print(sum_sq(3, 4))`, q:'What prints?', opts:['25','7','49'], ans:0, why:'9 + 16 = 25.'},
  cast:{code:R`def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens([1, 2, 4, 7]))`, task:'Cast it.'},
  bug:{broken:R`def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens([1, 2, 4, 7]))`, task:'NameError: is_even does not exist. Define it (returns True for even numbers) above its first use.',
    cases:[{inputs:[],tests:[['Prints 2','out.strip()=="2"'],['is_even defined','callable(g.get("is_even"))']]}],
    sol:R`def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens([1, 2, 4, 7]))`, wrong:[R`def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens([1, 2, 4, 7]))`]},
  write:{prompt:'Define `is_even(n)` returning True/False and `count_evens(nums)` that **uses `is_even`** to count even numbers. Print `count_evens(data)`.',
    starter:R`data = [1, 2, 4, 7, 10]
`,
    cases:[{inputs:[],tests:[['Prints 3','lines==["3"]'],['count_evens([1, 3])','g["count_evens"]([1,3])==0'],['count_evens([2, 4, 6])','g["count_evens"]([2,4,6])==3'],['is_even(4)','g["is_even"](4) is True and g["is_even"](5) is False'],['count_evens uses is_even','src.count("is_even(")>=2']]}],
    sol:R`data = [1, 2, 4, 7, 10]

def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    count = 0
    for n in nums:
        if is_even(n):
            count += 1
    return count

print(count_evens(data))`,
    wrong:[R`data = [1, 2, 4, 7, 10]

def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    count = 0
    for n in nums:
        if n % 2 == 0:
            count += 1
    return count

print(count_evens(data))`, R`data = [1, 2, 4, 7, 10]

def is_even(n):
    return n % 2 == 0

def count_evens(nums):
    return 3

print(count_evens(data))`],
    hints:['is_even(n) is just return n % 2 == 0.','In count_evens loop and call is_even(n) in the if.','Return the count; print count_evens(data) outside.','data = [1, 2, 4, 7, 10]\n\ndef is_even(n):\n    return n % 2 == 0\n\ndef count_evens(nums):\n    count = 0\n    for n in nums:\n        if is_even(n):\n            count += 1\n    return count\n\nprint(count_evens(data))']},
  power:{can:['Break work into small named steps','Reuse helper functions inside bigger ones'],
    expand:'Add is_positive(n) and count_positive_evens(nums) using both helpers.',
    where:'Real codebases are thousands of small functions calling each other.',
    next:'Next: documenting and naming your functions well.'},
  codex:{title:'Helper functions',body:'Small functions with one job, called from bigger ones.',snip:R`if is_even(n):`}
}
);
