// REALM 11 — THE ITERATOR GATE — part C (lessons 13-18: closures, decorators, wraps, decorator factories, practical decorators, command registry)
LESSONS.push(
{
  id:'r11-13', realm:11, n:13, title:'Closures: functions that remember',
  teaches:['dec-closure'], requires:['mission11b'],
  story:`In the Gate's workshop a tinker builds **tiny machines that build machines**. "A function can make *another function*," Quill says, "and the new one **remembers** the numbers it was born with. This is the secret behind every decorator."`,
  concept:{
    html:`Functions are **values**: you can pass them, return them and store them. A function defined **inside** another can use the outer function's variables, even after the outer function has finished. That remembered environment is a **closure**:\n\n\`\`\`\ndef make_multiplier(factor):\n    def multiply(x):\n        return x * factor         # 'factor' is remembered\n    return multiply               # return the function itself (no parentheses!)\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\ndouble(10), triple(10)            # (20, 30)\n\ndef make_counter():\n    count = 0\n    def tick():\n        nonlocal count            # allow ASSIGNING to the outer variable\n        count += 1\n        return count\n    return tick\n\`\`\`\n\n- \`return multiply\` hands back the function; \`return multiply(2)\` would call it.\n- Each call to \`make_multiplier\` creates a **separate** closure with its own \`factor\`.\n- Reading an outer variable just works. To **rebind** it (\`count += 1\`) you need \`nonlocal\`, otherwise \`UnboundLocalError\`.\n- Closures give you private state without writing a class.`,
    analogy:`A pre-set remote control: built for one TV (the remembered setting) but it is a separate gadget.`,
    example:R`def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

double = make_multiplier(2)
print(double(10), make_multiplier(3)(10))
c = make_counter()
print(c(), c(), c())`},
  predict:{code:R`def outer():
    x = 5
    def inner():
        return x
    return inner

f = outer()
print(f())`, q:'What prints?', opts:['5','Error','None'], ans:0, why:'inner remembers x from outer even after outer finished.'},
  cast:{code:R`def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply

def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

double = make_multiplier(2)
print(double(10), make_multiplier(3)(10))
c = make_counter()
print(c(), c(), c())`, task:'Cast it.'},
  bug:{broken:R`def make_counter():
    count = 0
    def tick():
        count += 1
        return count
    return tick

c = make_counter()
print(c())`, task:'UnboundLocalError: tick assigns to count, so Python treats it as local. Declare it nonlocal. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['nonlocal','"nonlocal" in src']]}],
    sol:R`def make_counter():
    count = 0
    def tick():
        nonlocal count
        count += 1
        return count
    return tick

c = make_counter()
print(c())`, wrong:[R`print(1)`]},
  write:{prompt:'Write `make_adder(n)` returning a function that adds `n` to its argument, and `make_counter(step=1)` returning a function that on each call adds `step` to a private running total and returns it. Ask `N: ` and `Step: ` (whole numbers). Print `Add: <make_adder(N)(10)>`, then call a counter built with that step three times and print `Counter: <the three results separated by spaces>`. Also print `Independent: yes` if two counters built separately do not share their totals.',
    starter:R`def make_adder(n):
    pass

n = int(input("N: "))
step = int(input("Step: "))
`,
    inputs:['5','3'],
    cases:[{inputs:['5','3'],tests:[['Output','lines[-3:]==["Add: 15","Counter: 3 6 9","Independent: yes"]'],['Closures remember','g["make_adder"](7)(1)==8 and g["make_adder"](1)(1)==2'],['Counters separate','(lambda a, b: (a(), a(), b()))(g["make_counter"](), g["make_counter"]())==(1,2,1)'],['Default step','g["make_counter"]()()==1'],['Uses nonlocal','"nonlocal" in src']]},{inputs:['-2','0'],tests:[['Zero step','lines[-3:]==["Add: 8","Counter: 0 0 0","Independent: yes"]']]},{inputs:['0','-1'],tests:[['Negative step','lines[-3:]==["Add: 10","Counter: -1 -2 -3","Independent: yes"]']]}],
    sol:R`def make_adder(n):
    def add(x):
        return x + n
    return add

def make_counter(step=1):
    total = 0
    def tick():
        nonlocal total
        total += step
        return total
    return tick

n = int(input("N: "))
step = int(input("Step: "))
print("Add:", make_adder(n)(10))
counter = make_counter(step)
print("Counter:", counter(), counter(), counter())
a, b = make_counter(), make_counter()
a()
a()
print("Independent:", "yes" if b() == 1 else "no")`,
    wrong:[R`total = 0

def make_adder(n):
    def add(x):
        return x + n
    return add

def make_counter(step=1):
    def tick():
        global total
        total += step
        return total
    return tick

n = int(input("N: "))
step = int(input("Step: "))
print("Add:", make_adder(n)(10))
counter = make_counter(step)
print("Counter:", counter(), counter(), counter())
a, b = make_counter(), make_counter()
a()
a()
print("Independent:", "yes" if b() == 1 else "no")`, R`def make_adder(n):
    def add(x):
        return x + 5
    return add

def make_counter(step=1):
    total = 0
    def tick():
        nonlocal total
        total += step
        return total
    return tick

n = int(input("N: "))
step = int(input("Step: "))
print("Add:", make_adder(n)(10))
counter = make_counter(step)
print("Counter:", counter(), counter(), counter())
a, b = make_counter(), make_counter()
a()
a()
print("Independent:", "yes" if b() == 1 else "no")`],
    hints:['make_adder defines add(x) inside and returns add (no parentheses).','make_counter keeps total = 0 in the outer function; the inner function uses nonlocal total and adds step.','Each call to make_counter creates its own total, so two counters are independent.','def make_adder(n):\n    def add(x):\n        return x + n\n    return add\n\ndef make_counter(step=1):\n    total = 0\n    def tick():\n        nonlocal total\n        total += step\n        return total\n    return tick\n\nn = int(input("N: "))\nstep = int(input("Step: "))\nprint("Add:", make_adder(n)(10))\ncounter = make_counter(step)\nprint("Counter:", counter(), counter(), counter())\na, b = make_counter(), make_counter()\na()\na()\nprint("Independent:", "yes" if b() == 1 else "no")']},
  power:{can:['Return functions from functions','Keep private state in a closure with nonlocal'],
    expand:'Write `make_greeter(greeting)` that returns a function taking a name.',
    where:'Callbacks, event handlers and every decorator are closures.',
    next:'Next: your first decorator.'},
  codex:{title:'Closures',body:'An inner function remembers the outer variables. Return the function itself (no parentheses). nonlocal lets it rebind an outer variable. Each outer call makes a separate closure.',snip:R`def make_multiplier(factor):
    def multiply(x):
        return x * factor
    return multiply`}
},
{
  id:'r11-14', realm:11, n:14, title:'Your first decorator',
  teaches:['dec-basic'], requires:['dec-closure'],
  story:`"Every spell in the guild must be **logged**," says the clerk, "but nobody wants to add a log line inside every spell." Quill produces a golden wrapper. "Wrap the function once, and **every call is logged**."`,
  concept:{
    html:`A **decorator** is a function that takes a function and returns a (usually wrapped) function:\n\n\`\`\`\ndef shout(func):\n    def wrapper(*args, **kwargs):\n        result = func(*args, **kwargs)\n        return result.upper()\n    return wrapper\n\n@shout                         # same as:  greet = shout(greet)\ndef greet(name):\n    return "hello " + name\n\ngreet("ada")                   # 'HELLO ADA'\n\`\`\`\n\n- \`@shout\` above \`def greet\` is **shorthand** for \`greet = shout(greet)\`.\n- The \`wrapper\` accepts **any** arguments (\`*args, **kwargs\`) and passes them on, so it works for any function.\n- ⚠️ The wrapper must **return** the function's result, or the decorated function returns \`None\`.\n- A decorator adds behaviour **before / after** the call (logging, timing, checks) without touching the original function's code.\n- The decorator runs **once**, when the function is defined. The wrapper runs **every call**.`,
    analogy:`Gift wrap: the present inside is the same, but you handle the wrapped version.`,
    example:R`def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return "hello " + name

print(greet("ada"))`},
  predict:{code:R`def deco(f):
    def wrapper(*a):
        print("before")
        return f(*a)
    return wrapper

@deco
def hi():
    print("hi")

hi()`, q:'What prints?', opts:['before\nhi','hi\nbefore','hi'], ans:0, why:'The wrapper prints before, then calls the original.'},
  cast:{code:R`def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return "hello " + name

print(greet("ada"))`, task:'Cast it.'},
  bug:{broken:R`def loud(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

print(add(2, 3))`, task:'The wrapper forgot to return the result, so add() gives None. Return it. Expected: 5',
    cases:[{inputs:[],tests:[['Five','lines==["5"]']]}],
    sol:R`def loud(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

print(add(2, 3))`, wrong:[R`def loud(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
    return wrapper

@loud
def add(a, b):
    return a + b

print(add(2, 3))`]},
  write:{prompt:'Write a decorator `log_calls` that prints `Calling <function name>(<args>)` before each call (arguments separated by `, `, using `repr` for each positional argument), calls the function, prints `<name> returned <result>` and returns the result. Decorate `add(a, b)` and `greet(name)`. Ask `A: `, `B: ` (whole numbers) and `Name: `. Call `add(A, B)` and `greet(Name)`; print their results as `Result: <value>`.',
    starter:R`def log_calls(func):
    pass

a = int(input("A: "))
b = int(input("B: "))
name = input("Name: ")
`,
    inputs:['2','3','Ada'],
    cases:[{inputs:['2','3','Ada'],tests:[['Logs and results','[l for l in lines if not l.startswith(("A:","B:","Name:"))]==["Calling add(2, 3)","add returned 5","Result: 5","Calling greet(\'Ada\')","greet returned Hello, Ada","Result: Hello, Ada"]'],['Works on any function','(lambda f: f(4, 5))(g["log_calls"](lambda x, y: x * y))==20'],['Returns results','g["add"](1,1)==2']]},{inputs:['-1','1','Bo'],tests:[['Negative','"Calling add(-1, 1)" in lines and "add returned 0" in lines']]},{inputs:['0','0',''],tests:[['Empty name','"Calling greet(\'\')" in lines and "greet returned Hello, " in lines']]}],
    sol:R`def log_calls(func):
    def wrapper(*args, **kwargs):
        shown = ", ".join(repr(a) for a in args)
        print(f"Calling {func.__name__}({shown})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def greet(name):
    return "Hello, " + name

a = int(input("A: "))
b = int(input("B: "))
name = input("Name: ")
print("Result:", add(a, b))
print("Result:", greet(name))`,
    wrong:[R`def log_calls(func):
    def wrapper(*args, **kwargs):
        shown = ", ".join(repr(a) for a in args)
        print(f"Calling {func.__name__}({shown})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def greet(name):
    return "Hello, " + name

a = int(input("A: "))
b = int(input("B: "))
name = input("Name: ")
print("Result:", add(a, b))
print("Result:", greet(name))`, R`def log_calls(func):
    def wrapper(*args, **kwargs):
        shown = ", ".join(str(a) for a in args)
        print(f"Calling {func.__name__}({shown})")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result}")
        return result
    return wrapper

@log_calls
def add(a, b):
    return a + b

@log_calls
def greet(name):
    return "Hello, " + name

a = int(input("A: "))
b = int(input("B: "))
name = input("Name: ")
print("Result:", add(a, b))
print("Result:", greet(name))`],
    hints:['log_calls(func) defines wrapper(*args, **kwargs) and returns wrapper.','Inside: print "Calling", call func(*args, **kwargs), print "returned", and RETURN the result.','Join the arguments with ", ".join(repr(a) for a in args); func.__name__ is the function name.','def log_calls(func):\n    def wrapper(*args, **kwargs):\n        shown = ", ".join(repr(a) for a in args)\n        print(f"Calling {func.__name__}({shown})")\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} returned {result}")\n        return result\n    return wrapper\n\n@log_calls\ndef add(a, b):\n    return a + b\n\n@log_calls\ndef greet(name):\n    return "Hello, " + name\n\na = int(input("A: "))\nb = int(input("B: "))\nname = input("Name: ")\nprint("Result:", add(a, b))\nprint("Result:", greet(name))']},
  power:{can:['Write a decorator with *args and **kwargs','Add behaviour around a function without editing it'],
    expand:'Also log keyword arguments, e.g. `power=3`.',
    where:'Logging, auth checks, timing and caching are all done with decorators.',
    next:'Next: functools.wraps, keeping the original name and docs.'},
  codex:{title:'Decorators',body:'@deco is func = deco(func). The wrapper takes *args, **kwargs, calls the original, RETURNS its result. The decorator runs once at definition; the wrapper every call.',snip:R`def deco(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper`}
},
{
  id:'r11-15', realm:11, n:15, title:'functools.wraps: keep the original identity',
  teaches:['dec-wraps'], requires:['dec-basic'],
  story:`A debugger asks the decorated spell "Who are you?" and gets the answer "**wrapper**". "Every wrapped function lost its name and its notes," Quill says. "Put the name tag back."`,
  concept:{
    html:`After decoration, \`greet.__name__\` is \`"wrapper"\` and the docstring is gone. That breaks debugging, help() and tools. Fix it with \`functools.wraps\`:\n\n\`\`\`\nfrom functools import wraps\n\ndef shout(func):\n    @wraps(func)                      # copies __name__, __doc__ ... from func\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@shout\ndef greet(name):\n    "Say hello."\n    return "hello " + name\n\ngreet.__name__    # 'greet'   (without wraps: 'wrapper')\ngreet.__doc__     # 'Say hello.'\ngreet.__wrapped__ # the original function (handy in tests)\n\`\`\`\n\n- **Always** use \`@wraps(func)\` on the inner wrapper of every decorator you write. It's a one-line habit.\n- \`wraps\` is itself a decorator **with an argument**; you'll write those next lesson.\n- Tracebacks and logging also show the right function name.`,
    analogy:`A name badge: the wrapper wears the badge of the function it wraps.`,
    example:R`from functools import wraps

def shout(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    "Say hello."
    return "hello " + name

print(greet.__name__, "|", greet.__doc__)
print(greet("ada"))`},
  predict:{code:R`def deco(f):
    def wrapper(*a):
        return f(*a)
    return wrapper

@deco
def work():
    pass

print(work.__name__)`, q:'What prints?', opts:['wrapper','work','deco'], ans:0, why:'Without wraps the decorated function is the inner wrapper.'},
  cast:{code:R`from functools import wraps

def shout(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    "Say hello."
    return "hello " + name

print(greet.__name__, "|", greet.__doc__)
print(greet("ada"))`, task:'Cast it.'},
  bug:{broken:R`def twice(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper

@twice
def ping():
    "Send a ping."
    return "pong"

print(ping.__name__)`, task:'The decorated function lost its name. Add @wraps(func). Expected: ping',
    cases:[{inputs:[],tests:[['Name kept','lines==["ping"]'],['Uses wraps','"wraps" in src']]}],
    sol:R`from functools import wraps

def twice(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper

@twice
def ping():
    "Send a ping."
    return "pong"

print(ping.__name__)`, wrong:[R`print("ping")`]},
  write:{prompt:'Write a decorator `counted` that counts how many times a function is called, keeps the function\'s name and docstring (use `wraps`) and exposes the count as an attribute `calls` on the wrapper (`func.calls`). Decorate `def roll(): "Roll the dice."; return 4`. Ask `Rolls: ` (a whole number), call `roll()` that many times, and print `Name: <roll.__name__>`, `Doc: <roll.__doc__>` and `Calls: <roll.calls>`.',
    starter:R`from functools import wraps

def counted(func):
    pass

n = int(input("Rolls: "))
`,
    inputs:['3'],
    cases:[{inputs:['3'],tests:[['Output','lines[-3:]==["Name: roll","Doc: Roll the dice.","Calls: 3"]'],['wraps used','"wraps(" in src'],['Counts independently','(lambda f, h: (f(), f(), h(), (f.calls, h.calls))[3])(g["counted"](lambda: 1), g["counted"](lambda: 2))==(2,1)'],['Result passes through','g["roll"]()==4']]},{inputs:['0'],tests:[['Zero','lines[-1]=="Calls: 0"']]},{inputs:['1'],tests:[['One','lines[-1]=="Calls: 1"']]},{inputs:['10'],tests:[['Ten','lines[-1]=="Calls: 10"']]}],
    sol:R`from functools import wraps

def counted(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def roll():
    "Roll the dice."
    return 4

n = int(input("Rolls: "))
for _ in range(n):
    roll()
print("Name:", roll.__name__)
print("Doc:", roll.__doc__)
print("Calls:", roll.calls)`,
    wrong:[R`def counted(func):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def roll():
    "Roll the dice."
    return 4

n = int(input("Rolls: "))
for _ in range(n):
    roll()
print("Name:", roll.__name__)
print("Doc:", roll.__doc__)
print("Calls:", roll.calls)`, R`from functools import wraps

calls = 0

def counted(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        global calls
        calls += 1
        wrapper.calls = calls
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def roll():
    "Roll the dice."
    return 4

n = int(input("Rolls: "))
for _ in range(n):
    roll()
print("Name:", roll.__name__)
print("Doc:", roll.__doc__)
print("Calls:", roll.calls)`],
    hints:['Put @wraps(func) on the inner wrapper.','Functions can have attributes: set wrapper.calls = 0 after defining the wrapper, and do wrapper.calls += 1 inside it.','Return func(*args, **kwargs) from the wrapper so results still come through.','from functools import wraps\n\ndef counted(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@counted\ndef roll():\n    "Roll the dice."\n    return 4\n\nn = int(input("Rolls: "))\nfor _ in range(n):\n    roll()\nprint("Name:", roll.__name__)\nprint("Doc:", roll.__doc__)\nprint("Calls:", roll.calls)']},
  power:{can:['Preserve names and docstrings with functools.wraps','Attach state (like a call counter) to a wrapper'],
    expand:'Add a `reset()` function attribute that sets calls back to 0.',
    where:'Frameworks like Flask and pytest rely on wraps to find your functions by name.',
    next:'Next: decorators that take arguments.'},
  codex:{title:'functools.wraps',body:'@wraps(func) on the wrapper copies __name__, __doc__ and sets __wrapped__. Always use it. Functions can carry attributes such as wrapper.calls.',snip:R`from functools import wraps

def deco(func):
    @wraps(func)
    def wrapper(*a, **k):
        return func(*a, **k)
    return wrapper`}
},
{
  id:'r11-16', realm:11, n:16, title:'Decorators with arguments: @repeat(3)',
  teaches:['dec-args'], requires:['dec-wraps'],
  story:`"Retry **three** times," says the captain. "Retry **five** times for the dragon." Quill nods. "A decorator that takes a setting needs **one more layer**: a function that builds the decorator."`,
  concept:{
    html:`To write \`@repeat(3)\`, \`repeat(3)\` must **return a decorator**. That makes three nested layers:\n\n\`\`\`\nfrom functools import wraps\n\ndef repeat(times):                    # layer 1: takes the setting\n    def decorator(func):              # layer 2: takes the function\n        @wraps(func)\n        def wrapper(*args, **kwargs):  # layer 3: runs on every call\n            result = None\n            for _ in range(times):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(3)                            # = say = repeat(3)(say)\ndef say(word):\n    print(word)\n\`\`\`\n\n- \`@repeat(3)\` first **calls** \`repeat(3)\`, then uses the returned decorator on the function.\n- ⚠️ \`@repeat\` without parentheses would pass the *function* as \`times\`. Always write \`@repeat(3)\`.\n- Validate the setting early (\`if times < 1: raise ValueError\`) so mistakes show when the function is **defined**, not when it is first called.\n- Read it as: setting → decorator → wrapper.`,
    analogy:`A machine for making stamps: first you choose the stamp size (the argument), then you stamp documents.`,
    example:R`from functools import wraps

def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say(word):
    print(word)

say("hi")`},
  predict:{code:R`def mult(k):
    def deco(f):
        def wrapper(x):
            return f(x) * k
        return wrapper
    return deco

@mult(3)
def one(x):
    return x

print(one(5))`, q:'What prints?', opts:['15','5','Error'], ans:0, why:'mult(3) builds a decorator that multiplies the result by 3.'},
  cast:{code:R`from functools import wraps

def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = None
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def say(word):
    print(word)

say("hi")`, task:'Cast it.'},
  bug:{broken:R`def repeat(times):
    def wrapper(*args, **kwargs):
        pass
    return wrapper

@repeat(3)
def say():
    print("hi")

say()`, task:'TypeError: @repeat(3) must return a decorator that takes the function. Add the middle layer and actually run the function 3 times. Expected: hi printed three times',
    cases:[{inputs:[],tests:[['Three times','lines==["hi","hi","hi"]'],['Three layers','"def decorator" in src or src.count("def ")>=4']]}],
    sol:R`def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                func(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def say():
    print("hi")

say()`, wrong:[R`print("hi")
print("hi")
print("hi")`]},
  write:{prompt:'Write a decorator **factory** `limit_calls(max_calls)` that allows a function to run at most `max_calls` times; after that every call returns the string `Limit reached`. A `max_calls` below 1 raises `ValueError("max_calls must be at least 1")` immediately when the decorator is applied. Keep the function name (use `wraps`). Apply `@limit_calls(2)` to `def hit(): return "hit"`. Ask `Presses: ` (a whole number) and print each press\'s result on its own line. Then print `Name: <hit.__name__>`.',
    starter:R`from functools import wraps

def limit_calls(max_calls):
    pass

n = int(input("Presses: "))
`,
    inputs:['4'],
    cases:[{inputs:['4'],tests:[['Limit','lines[-6:]==["hit","hit","Limit reached","Limit reached","Name: hit"] or [l for l in lines if l!="Presses: 4"]==["hit","hit","Limit reached","Limit reached","Name: hit"]'],['Factory validation','__import__("unittest").TestCase().assertRaises(ValueError, g["limit_calls"], 0) is None'],['Independent limits','(lambda a, b: (a(), a(), a(), b()))(g["limit_calls"](1)(lambda: "x"), g["limit_calls"](1)(lambda: "y"))==("x","Limit reached","Limit reached","y")'],['Uses wraps','"wraps(" in src']]},{inputs:['1'],tests:[['One press','[l for l in lines if l!="Presses: 1"]==["hit","Name: hit"]']]},{inputs:['0'],tests:[['No presses','[l for l in lines if l!="Presses: 0"]==["Name: hit"]']]},{inputs:['2'],tests:[['Exactly at limit','[l for l in lines if l!="Presses: 2"]==["hit","hit","Name: hit"]']]}],
    sol:R`from functools import wraps

def limit_calls(max_calls):
    if max_calls < 1:
        raise ValueError("max_calls must be at least 1")
    def decorator(func):
        used = 0
        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal used
            if used >= max_calls:
                return "Limit reached"
            used += 1
            return func(*args, **kwargs)
        return wrapper
    return decorator

@limit_calls(2)
def hit():
    return "hit"

n = int(input("Presses: "))
for _ in range(n):
    print(hit())
print("Name:", hit.__name__)`,
    wrong:[R`from functools import wraps

used = 0

def limit_calls(max_calls):
    if max_calls < 1:
        raise ValueError("max_calls must be at least 1")
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            global used
            if used >= max_calls:
                return "Limit reached"
            used += 1
            return func(*args, **kwargs)
        return wrapper
    return decorator

@limit_calls(2)
def hit():
    return "hit"

n = int(input("Presses: "))
for _ in range(n):
    print(hit())
print("Name:", hit.__name__)`, R`from functools import wraps

def limit_calls(max_calls):
    def decorator(func):
        used = 0
        @wraps(func)
        def wrapper(*args, **kwargs):
            nonlocal used
            if used >= max_calls:
                return "Limit reached"
            used += 1
            return func(*args, **kwargs)
        return wrapper
    return decorator

@limit_calls(2)
def hit():
    return "hit"

n = int(input("Presses: "))
for _ in range(n):
    print(hit())
print("Name:", hit.__name__)`],
    hints:['Three layers: limit_calls(max_calls) -> decorator(func) -> wrapper(*args, **kwargs).','Keep a counter `used` in decorator and use nonlocal in wrapper. Validate max_calls in the outer layer.','Once used >= max_calls return "Limit reached" instead of calling the function.','from functools import wraps\n\ndef limit_calls(max_calls):\n    if max_calls < 1:\n        raise ValueError("max_calls must be at least 1")\n    def decorator(func):\n        used = 0\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            nonlocal used\n            if used >= max_calls:\n                return "Limit reached"\n            used += 1\n            return func(*args, **kwargs)\n        return wrapper\n    return decorator\n\n@limit_calls(2)\ndef hit():\n    return "hit"\n\nn = int(input("Presses: "))\nfor _ in range(n):\n    print(hit())\nprint("Name:", hit.__name__)']},
  power:{can:['Write decorator factories with three layers','Validate decorator settings at definition time'],
    expand:'Write `@require_role("admin")` that checks the first argument\'s `role` attribute.',
    where:'Flask routes (@app.route("/")), pytest fixtures and retry libraries are decorator factories.',
    next:'Next: practical decorators: caching and retrying.'},
  codex:{title:'Decorator factories',body:'@deco(arg) = deco(arg)(func): three layers (setting -> decorator -> wrapper). Always write the parentheses. Validate settings in the outer layer. State lives in the middle layer (nonlocal).',snip:R`def repeat(times):
    def decorator(func):
        def wrapper(*a, **k):
            ...
        return wrapper
    return decorator`}
},
{
  id:'r11-17', realm:11, n:17, title:'Practical decorators: caching and retrying',
  teaches:['dec-practical'], requires:['dec-args'],
  story:`"Two decorators will save you more time than any others," Quill says, lifting a bottle and a stopwatch. "**Cache** the answers you've already worked out, and **retry** the things that fail by bad luck."`,
  concept:{
    html:`**Memoisation**: remember results by their arguments so repeated calls are instant:\n\n\`\`\`\nfrom functools import wraps, lru_cache\n\ndef memoize(func):\n    cache = {}\n    @wraps(func)\n    def wrapper(*args):\n        if args not in cache:          # args is a tuple: hashable\n            cache[args] = func(*args)\n        return cache[args]\n    return wrapper\n\n@lru_cache(maxsize=None)               # the standard-library version (also @functools.cache)\ndef fib(n):\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\`\`\`\n\n**Retry**: call again when a *specific* error happens, give up after a limit:\n\n\`\`\`\ndef retry(times):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except ConnectionError:\n                    if attempt == times:\n                        raise          # out of attempts: let the error through\n        return wrapper\n    return decorator\n\`\`\`\n\n- Only cache **pure** functions (same inputs, same output, no side effects).\n- Catch only the errors that make sense to retry; never a bare \`except:\`.\n- Re-raise with a bare \`raise\` on the last attempt so the real error isn't hidden.`,
    analogy:`A notebook of answers you've already worked out; and a polite "try again" at a busy phone line.`,
    example:R`from functools import lru_cache

calls = 0

@lru_cache(maxsize=None)
def slow_square(n):
    global calls
    calls += 1
    return n * n

print(slow_square(4), slow_square(4), slow_square(5))
print("computed", calls, "times")`},
  predict:{code:R`from functools import lru_cache

@lru_cache(maxsize=None)
def f(x):
    print("computing")
    return x

f(1)
f(1)`, q:'How many times is "computing" printed?', opts:['1','2','0'], ans:0, why:'The second call is answered from the cache.'},
  cast:{code:R`from functools import lru_cache

calls = 0

@lru_cache(maxsize=None)
def slow_square(n):
    global calls
    calls += 1
    return n * n

print(slow_square(4), slow_square(4), slow_square(5))
print("computed", calls, "times")`, task:'Cast it.'},
  bug:{broken:R`def retry(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except ValueError:
                    pass
        return wrapper
    return decorator

@retry(2)
def always_fails():
    raise ValueError("nope")

try:
    always_fails()
    print("silent")
except ValueError as error:
    print("Error:", error)`, task:'After the last attempt the error is swallowed and the function silently returns None. Re-raise on the final attempt. Expected: Error: nope',
    cases:[{inputs:[],tests:[['Error shown','lines==["Error: nope"]'],['Re-raises','"raise" in src.split("def always_fails")[0]']]}],
    sol:R`def retry(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except ValueError:
                    if attempt == times - 1:
                        raise
        return wrapper
    return decorator

@retry(2)
def always_fails():
    raise ValueError("nope")

try:
    always_fails()
    print("silent")
except ValueError as error:
    print("Error:", error)`, wrong:[R`print("Error: nope")`]},
  write:{prompt:'Write two decorators. `memoize` caches results by positional arguments. `retry(times)` retries a function that raises `ConnectionError`, up to `times` attempts in total, re-raising the error after the last one. Use them like this: a `slow_double(n)` (decorated with `memoize`) that counts real computations in a global `computed`, and a `flaky(fail_times)` ... keep it simpler: ask `Numbers: ` (space-separated whole numbers), call `slow_double` on each and print `Doubles: <results>` and `Computed: <how many real computations>` (repeats are cached). Then ask `Failures: ` (a whole number): a function `unstable()` raises `ConnectionError("down")` that many times (tracked by a counter) before returning `up`, decorated with `@retry(3)`. Print `Status: up` or `Status: gave up (<error>)`.',
    starter:R`from functools import wraps

computed = 0

def memoize(func):
    pass

numbers = [int(w) for w in input("Numbers: ").split()]
failures = int(input("Failures: "))
`,
    inputs:['3 4 3 4 5','2'],
    cases:[{inputs:['3 4 3 4 5','2'],tests:[['Cache and retry','lines[-3:]==["Doubles: 6 8 6 8 10","Computed: 3","Status: up"]'],['Memoize works generally','(lambda f: (f(2), f(2), f(3)))(g["memoize"](lambda x: x+1))==(3,3,4)'],['retry only the right error','(lambda f: __import__("unittest").TestCase().assertRaises(ValueError, f) is None)(g["retry"](5)(lambda: (_ for _ in ()).throw(ValueError("x"))))']]},{inputs:['1 1 1','3'],tests:[['Gives up','lines[-3:]==["Doubles: 2 2 2","Computed: 1","Status: gave up (down)"]']]},{inputs:['','0'],tests:[['No numbers, no failures','lines[-3:]==["Doubles:","Computed: 0","Status: up"]']]},{inputs:['7','3'],tests:[['Third attempt fails too','lines[-1]=="Status: gave up (down)"']]},{inputs:['7','2'],tests:[['Third attempt works','lines[-1]=="Status: up"']]}],
    sol:R`from functools import wraps

computed = 0

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    if attempt == times:
                        raise
        return wrapper
    return decorator

@memoize
def slow_double(n):
    global computed
    computed += 1
    return n * 2

numbers = [int(w) for w in input("Numbers: ").split()]
failures = int(input("Failures: "))
print("Doubles:", *[slow_double(n) for n in numbers])
print("Computed:", computed)

remaining = failures

@retry(3)
def unstable():
    global remaining
    if remaining > 0:
        remaining -= 1
        raise ConnectionError("down")
    return "up"

try:
    print("Status:", unstable())
except ConnectionError as error:
    print(f"Status: gave up ({error})")`,
    wrong:[R`from functools import wraps

computed = 0

def memoize(func):
    @wraps(func)
    def wrapper(*args):
        return func(*args)
    return wrapper

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    if attempt == times:
                        raise
        return wrapper
    return decorator

@memoize
def slow_double(n):
    global computed
    computed += 1
    return n * 2

numbers = [int(w) for w in input("Numbers: ").split()]
failures = int(input("Failures: "))
print("Doubles:", *[slow_double(n) for n in numbers])
print("Computed:", computed)

remaining = failures

@retry(3)
def unstable():
    global remaining
    if remaining > 0:
        remaining -= 1
        raise ConnectionError("down")
    return "up"

try:
    print("Status:", unstable())
except ConnectionError as error:
    print(f"Status: gave up ({error})")`, R`from functools import wraps

computed = 0

def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper

def retry(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    pass
        return wrapper
    return decorator

@memoize
def slow_double(n):
    global computed
    computed += 1
    return n * 2

numbers = [int(w) for w in input("Numbers: ").split()]
failures = int(input("Failures: "))
print("Doubles:", *[slow_double(n) for n in numbers])
print("Computed:", computed)

remaining = failures

@retry(3)
def unstable():
    global remaining
    if remaining > 0:
        remaining -= 1
        raise ConnectionError("down")
    return "up"

try:
    print("Status:", unstable())
except ConnectionError as error:
    print(f"Status: gave up ({error})")`],
    hints:['memoize keeps a dict `cache` keyed by the args tuple; compute only when args is not in the cache.','retry loops attempt 1..times, returns on success, catches ConnectionError, and re-raises (bare `raise`) when attempt == times.','The unstable() function uses a counter to fail `failures` times first. @retry(3) allows three attempts in total.','from functools import wraps\n\ncomputed = 0\n\ndef memoize(func):\n    cache = {}\n    @wraps(func)\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = func(*args)\n        return cache[args]\n    return wrapper\n\ndef retry(times):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except ConnectionError:\n                    if attempt == times:\n                        raise\n        return wrapper\n    return decorator\n\n@memoize\ndef slow_double(n):\n    global computed\n    computed += 1\n    return n * 2\n\nnumbers = [int(w) for w in input("Numbers: ").split()]\nfailures = int(input("Failures: "))\nprint("Doubles:", *[slow_double(n) for n in numbers])\nprint("Computed:", computed)\n\nremaining = failures\n\n@retry(3)\ndef unstable():\n    global remaining\n    if remaining > 0:\n        remaining -= 1\n        raise ConnectionError("down")\n    return "up"\n\ntry:\n    print("Status:", unstable())\nexcept ConnectionError as error:\n    print(f"Status: gave up ({error})")']},
  power:{can:['Cache pure functions with memoize or lru_cache','Retry flaky operations and re-raise after the last attempt'],
    expand:'Add `time.sleep(delay)` between retries with exponential back-off.',
    where:'Network clients, API wrappers and expensive calculations rely on exactly these two decorators.',
    next:'Next: Real-World Mission: a command registry.'},
  codex:{title:'Cache and retry',body:'Memoise pure functions (functools.lru_cache / cache). Retry only specific errors, re-raise on the final attempt with a bare raise. Never use a bare except.',snip:R`@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n-1) + fib(n-2)`}
},
{
  id:'r11-18', realm:11, n:18, title:'Real-World Mission: The Command Registry',
  teaches:['mission11c'], requires:['dec-practical'],
  story:`The Gate's control room has 40 commands and one giant \`if / elif\` chain nobody dares touch. "Add a command by **decorating** a function," Quill proposes, "and let a **registry** find it. No more chains."`,
  concept:{
    html:`A **registry** is a dict filled by a decorator. Each decorated function is stored under its command name, and *returned unchanged*:\n\n\`\`\`\nCOMMANDS = {}\n\ndef command(name, min_args=0):\n    def decorator(func):\n        COMMANDS[name] = (func, min_args)\n        return func                      # return the original function\n    return decorator\n\n@command("greet", 1)\ndef greet(name):\n    return f"Hello, {name}!"\n\n# the dispatcher:\nfunc, min_args = COMMANDS[word]\nfunc(*args)\n\`\`\`\n\n- Adding a new command = writing a function + one decorator line. The dispatcher **never changes** (open for extension).\n- Registration happens at **import/definition time**.\n- This is how Flask routes, CLI frameworks (click, argparse sub-commands) and plugin systems work.\n- Combine with other decorators: a \`@requires_args\` guard, logging, permissions.`,
    analogy:`A switchboard where each new line plugs itself in as it is installed.`,
    example:R`COMMANDS = {}

def command(name):
    def decorator(func):
        COMMANDS[name] = func
        return func
    return decorator

@command("greet")
def greet(who):
    return f"Hello, {who}!"

print(sorted(COMMANDS), COMMANDS["greet"]("Ada"))`},
  predict:{code:R`REG = []

def register(f):
    REG.append(f.__name__)
    return f

@register
def a(): pass

@register
def b(): pass

print(REG)`, q:'What prints?', opts:["['a', 'b']","[]","['register']"], ans:0, why:'Each decoration runs once at definition time and appends the name.'},
  cast:{code:R`COMMANDS = {}

def command(name):
    def decorator(func):
        COMMANDS[name] = func
        return func
    return decorator

@command("greet")
def greet(who):
    return f"Hello, {who}!"

print(sorted(COMMANDS), COMMANDS["greet"]("Ada"))`, task:'Cast it.'},
  bug:{broken:R`COMMANDS = {}

def command(name):
    def decorator(func):
        COMMANDS[name] = func
    return decorator

@command("hi")
def hi():
    return "hello"

print(hi())`, task:"TypeError: 'NoneType' is not callable: the decorator forgot to return the function, so hi became None. Return func. Expected: hello",
    cases:[{inputs:[],tests:[['Works','lines==["hello"]'],['Returns func','"return func" in src']]}],
    sol:R`COMMANDS = {}

def command(name):
    def decorator(func):
        COMMANDS[name] = func
        return func
    return decorator

@command("hi")
def hi():
    return "hello"

print(hi())`, wrong:[R`print("hello")`]},
  write:{prompt:'Build a command system with a **registry decorator** `command(name, min_args=0)`. Register these commands: `add a b` (sum, needs 2), `shout text...` (upper-case the words joined by spaces, needs 1), `count words...` (how many words, no minimum), `help` (list of all registered command names sorted, comma-separated: `Commands: add, count, help, shout`). Each command function **returns** its output text. The loop (prompt `> `) reads a line, splits it and dispatches. Unknown commands print `Unknown command: <word>`; too few arguments print `Usage: <name> needs <n> argument(s)`; bad numbers for `add` print `Error: numbers only`. Blank lines are ignored; `quit` ends. Do **not** use an if/elif chain on the command names.',
    starter:R`COMMANDS = {}

def command(name, min_args=0):
    pass

while True:
    line = input("> ").split()
`,
    inputs:['add 2 3','shout hello world','count a b c','help','quit'],
    cases:[{inputs:['add 2 3','shout hello world','count a b c','help','quit'],tests:[['Session','[l for l in lines if not l.startswith("> ")]==["5","HELLO WORLD","3","Commands: add, count, help, shout"]'],['Registry filled by decorator','sorted(g["COMMANDS"])==["add","count","help","shout"]'],['Functions still callable','g["add"]("1","2")=="3" if "add" in g else True'],['No if-chain on names','src.count("== \\"add\\"")==0 and src.count("== \\"shout\\"")==0']]},{inputs:['dance','quit'],tests:[['Unknown','[l for l in lines if not l.startswith("> ")]==["Unknown command: dance"]']]},{inputs:['add 1','shout','quit'],tests:[['Usage','[l for l in lines if not l.startswith("> ")]==["Usage: add needs 2 argument(s)","Usage: shout needs 1 argument(s)"]']]},{inputs:['add x 2','quit'],tests:[['Numbers only','[l for l in lines if not l.startswith("> ")]==["Error: numbers only"]']]},{inputs:['','count','quit'],tests:[['Blank and empty count','[l for l in lines if not l.startswith("> ")]==["0"]']]},{inputs:['add -4 10','add 1 2 3','quit'],tests:[['Negative, extra args','[l for l in lines if not l.startswith("> ")]==["6","3"]']]}],
    sol:R`COMMANDS = {}

def command(name, min_args=0):
    def decorator(func):
        COMMANDS[name] = (func, min_args)
        return func
    return decorator

@command("add", 2)
def add(a, b, *rest):
    try:
        return str(int(a) + int(b))
    except ValueError:
        return "Error: numbers only"

@command("shout", 1)
def shout(*words):
    return " ".join(words).upper()

@command("count")
def count(*words):
    return str(len(words))

@command("help")
def help_(*args):
    return "Commands: " + ", ".join(sorted(COMMANDS))

while True:
    line = input("> ").split()
    if not line:
        continue
    word, args = line[0], line[1:]
    if word == "quit":
        break
    if word not in COMMANDS:
        print("Unknown command:", word)
        continue
    func, min_args = COMMANDS[word]
    if len(args) < min_args:
        print(f"Usage: {word} needs {min_args} argument(s)")
    else:
        print(func(*args))`,
    wrong:[R`COMMANDS = {}

def command(name, min_args=0):
    def decorator(func):
        COMMANDS[name] = (func, min_args)
        return func
    return decorator

@command("add", 2)
def add(a, b, *rest):
    return str(int(a) + int(b))

@command("shout", 1)
def shout(*words):
    return " ".join(words).upper()

@command("count")
def count(*words):
    return str(len(words))

@command("help")
def help_(*args):
    return "Commands: " + ", ".join(sorted(COMMANDS))

while True:
    line = input("> ").split()
    if not line:
        continue
    word, args = line[0], line[1:]
    if word == "quit":
        break
    if word not in COMMANDS:
        print("Unknown command:", word)
        continue
    func, min_args = COMMANDS[word]
    if len(args) < min_args:
        print(f"Usage: {word} needs {min_args} argument(s)")
    else:
        print(func(*args))`, R`COMMANDS = {}

def command(name, min_args=0):
    def decorator(func):
        COMMANDS[name] = (func, min_args)
        return func
    return decorator

@command("add", 2)
def add(a, b, *rest):
    try:
        return str(int(a) + int(b))
    except ValueError:
        return "Error: numbers only"

@command("shout", 1)
def shout(*words):
    return " ".join(words).upper()

@command("count")
def count(*words):
    return str(len(words))

@command("help")
def help_(*args):
    return "Commands: " + ", ".join(COMMANDS)

while True:
    line = input("> ").split()
    if not line:
        continue
    word, args = line[0], line[1:]
    if word == "quit":
        break
    if word not in COMMANDS:
        print("Unknown command:", word)
        continue
    func, min_args = COMMANDS[word]
    if len(args) < min_args:
        print(f"Usage: {word} needs {min_args} argument(s)")
    else:
        print(func(*args))`, R`def add(a, b):
    return str(int(a) + int(b))

while True:
    line = input("> ").split()
    if not line:
        continue
    word, args = line[0], line[1:]
    if word == "quit":
        break
    elif word == "add" and len(args) >= 2:
        print(add(*args[:2]))
    elif word == "shout":
        print(" ".join(args).upper())
    elif word == "count":
        print(len(args))
    elif word == "help":
        print("Commands: add, count, help, shout")
    else:
        print("Unknown command:", word)`],
    hints:['command(name, min_args) returns a decorator that stores (func, min_args) in COMMANDS[name] and returns func.','Decorate each function with @command("add", 2) and so on. help just returns the sorted keys of COMMANDS.','The loop: split, look the word up in COMMANDS, check len(args) >= min_args, then print(func(*args)).','COMMANDS = {}\n\ndef command(name, min_args=0):\n    def decorator(func):\n        COMMANDS[name] = (func, min_args)\n        return func\n    return decorator\n\n@command("add", 2)\ndef add(a, b, *rest):\n    try:\n        return str(int(a) + int(b))\n    except ValueError:\n        return "Error: numbers only"\n\n@command("shout", 1)\ndef shout(*words):\n    return " ".join(words).upper()\n\n@command("count")\ndef count(*words):\n    return str(len(words))\n\n@command("help")\ndef help_(*args):\n    return "Commands: " + ", ".join(sorted(COMMANDS))\n\nwhile True:\n    line = input("> ").split()\n    if not line:\n        continue\n    word, args = line[0], line[1:]\n    if word == "quit":\n        break\n    if word not in COMMANDS:\n        print("Unknown command:", word)\n        continue\n    func, min_args = COMMANDS[word]\n    if len(args) < min_args:\n        print(f"Usage: {word} needs {min_args} argument(s)")\n    else:\n        print(func(*args))']},
  power:{can:['Build a plugin-style registry with a decorator','Dispatch commands through a dict instead of if/elif chains'],
    expand:'Add a `@command("repeat", 2)` that repeats a word N times.',
    where:'Web frameworks, CLIs, test runners and bots all register handlers this way.',
    next:'Next: context managers: with statements you write yourself.'},
  codex:{title:'Mission: Command Registry',body:'A decorator factory fills a dict and returns the function unchanged. The dispatcher looks commands up and checks argument counts. New commands need no change to the loop.',snip:R`def command(name, min_args=0):
    def decorator(func):
        COMMANDS[name] = (func, min_args)
        return func
    return decorator`}
}
);
