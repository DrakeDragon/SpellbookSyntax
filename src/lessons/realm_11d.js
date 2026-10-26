// REALM 11 — THE ITERATOR GATE — part D (lessons 19-24: context managers, type hints, transaction mission, boss, gap)
LESSONS.push(
{
  id:'r11-19', realm:11, n:19, title:'Context managers: __enter__ and __exit__',
  teaches:['cm-class'], requires:['mission11c'],
  story:`The Gate's last hall is full of doors that must be **closed behind you**: lamps to switch off, locks to turn, files to close. "People forget," Quill says. "So we build things that **clean up by themselves**, even if you faint halfway through."`,
  concept:{
    html:`You've used \`with open(...) as f:\`. Any class with \`__enter__\` and \`__exit__\` works with \`with\`:\n\n\`\`\`\nclass Section:\n    def __init__(self, name):\n        self.name = name\n\n    def __enter__(self):\n        print(f"[start {self.name}]")\n        return self                       # becomes the 'as' variable\n\n    def __exit__(self, exc_type, exc, traceback):\n        print(f"[end {self.name}]")      # ALWAYS runs, error or not\n        return False                     # False/None: let any error continue\n\nwith Section("load") as s:\n    print("working")\n\`\`\`\n\n- \`__enter__\` runs at the start; its return value is the \`as\` target.\n- \`__exit__\` runs at the end **no matter what**, including when an exception happened. It gets the exception type, value and traceback (all \`None\` if there was no error).\n- Returning **\`True\`** from \`__exit__\` **suppresses** the exception. Return \`False\`/\`None\` and it propagates. Suppress only what you really mean to handle.\n- Perfect for: files, locks, database transactions, timers, temporary settings.`,
    analogy:`A hotel door that always locks behind you, even if you ran out in a hurry.`,
    example:R`class Section:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"[start {self.name}]")
        return self

    def __exit__(self, exc_type, exc, traceback):
        print(f"[end {self.name}]")
        return False

with Section("load") as s:
    print("working in", s.name)

try:
    with Section("fail"):
        raise ValueError("boom")
except ValueError:
    print("error continued")`},
  predict:{code:R`class C:
    def __enter__(self):
        print("in")
    def __exit__(self, *a):
        print("out")

with C():
    print("body")`, q:'What prints?', opts:['in\nbody\nout','body\nin\nout','in\nout'], ans:0, why:'enter runs first, then the body, then exit.'},
  cast:{code:R`class Section:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"[start {self.name}]")
        return self

    def __exit__(self, exc_type, exc, traceback):
        print(f"[end {self.name}]")
        return False

with Section("load") as s:
    print("working in", s.name)

try:
    with Section("fail"):
        raise ValueError("boom")
except ValueError:
    print("error continued")`, task:'Cast it.'},
  bug:{broken:R`class Quiet:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        return False

with Quiet():
    raise ValueError("oops")
print("survived")`, task:'We want this context to swallow ValueErrors. Return True from __exit__ when the error is a ValueError. Expected: survived',
    cases:[{inputs:[],tests:[['Suppressed','lines==["survived"]'],['Only ValueError','bool(g["Quiet"]().__exit__(ValueError,None,None)) and not g["Quiet"]().__exit__(KeyError,None,None)']]}],
    sol:R`class Quiet:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        return exc_type is ValueError

with Quiet():
    raise ValueError("oops")
print("survived")`, wrong:[R`class Quiet:
    def __enter__(self):
        return self
    def __exit__(self, exc_type, exc, tb):
        return True

with Quiet():
    raise KeyError("oops")
print("survived")`]},
  write:{prompt:'Write a context manager class `Section(name)`. On entry print `[start <name>]`; on exit print `[end <name>]` **always**. If a `ValueError` happened inside, also print `[error <name>: <message>]` (before the end line) and **suppress** it. Other errors must continue. The program asks `Value: `, then runs `with Section("parse"):` converting it with `int()` and printing `Parsed <number>`, then `with Section("divide"):` printing `100 / <number> = <result with 1 decimal>`. A `ZeroDivisionError` from the second section is caught outside and prints `Cannot divide by zero`.',
    starter:R`class Section:
    pass

value = input("Value: ")
`,
    inputs:['4'],
    cases:[{inputs:['4'],tests:[['Good','[l for l in lines if l!="Value: 4"]==["[start parse]","Parsed 4","[end parse]","[start divide]","100 / 4 = 25.0","[end divide]"]'],['Has the methods','hasattr(g["Section"],"__enter__") and hasattr(g["Section"],"__exit__")']]},{inputs:['x'],tests:[['Bad number is suppressed','[l for l in lines if l!="Value: x"][:4]==["[start parse]","[error parse: invalid literal for int() with base 10: \'x\']","[end parse]","[start divide]"]'],['Then divide fails cleanly','lines[-1]=="Cannot divide by zero" or lines[-1]=="[end divide]"']]},{inputs:['0'],tests:[['Zero','[l for l in lines if l!="Value: 0"]==["[start parse]","Parsed 0","[end parse]","[start divide]","[end divide]","Cannot divide by zero"]']]},{inputs:['-5'],tests:[['Negative','"100 / -5 = -20.0" in lines']]},{inputs:['3'],tests:[['Other errors continue','(lambda S: (lambda: (S("t").__enter__(), S("t").__exit__(KeyError, KeyError("k"), None)))()[1])(g["Section"]) in (False, None)']]}],
    sol:R`class Section:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"[start {self.name}]")
        return self

    def __exit__(self, exc_type, exc, traceback):
        suppress = False
        if exc_type is ValueError:
            print(f"[error {self.name}: {exc}]")
            suppress = True
        print(f"[end {self.name}]")
        return suppress

value = input("Value: ")
number = 0
with Section("parse"):
    number = int(value)
    print("Parsed", number)

try:
    with Section("divide"):
        print(f"100 / {number} = {100 / number:.1f}")
except ZeroDivisionError:
    print("Cannot divide by zero")`,
    wrong:[R`class Section:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"[start {self.name}]")
        return self

    def __exit__(self, exc_type, exc, traceback):
        print(f"[end {self.name}]")
        return True

value = input("Value: ")
number = 0
with Section("parse"):
    number = int(value)
    print("Parsed", number)

try:
    with Section("divide"):
        print(f"100 / {number} = {100 / number:.1f}")
except ZeroDivisionError:
    print("Cannot divide by zero")`, R`class Section:
    def __init__(self, name):
        self.name = name

    def __enter__(self):
        print(f"[start {self.name}]")
        return self

    def __exit__(self, exc_type, exc, traceback):
        if exc_type is ValueError:
            print(f"[error {self.name}: {exc}]")
            return True
        if exc_type is None:
            print(f"[end {self.name}]")
        return False

value = input("Value: ")
number = 0
with Section("parse"):
    number = int(value)
    print("Parsed", number)

try:
    with Section("divide"):
        print(f"100 / {number} = {100 / number:.1f}")
except ZeroDivisionError:
    print("Cannot divide by zero")`],
    hints:['__enter__ prints the start line and returns self.','__exit__(self, exc_type, exc, traceback): if exc_type is ValueError print the error line and remember to return True; then ALWAYS print the end line.','Return True only for ValueError so ZeroDivisionError continues to the outer try.','class Section:\n    def __init__(self, name):\n        self.name = name\n\n    def __enter__(self):\n        print(f"[start {self.name}]")\n        return self\n\n    def __exit__(self, exc_type, exc, traceback):\n        suppress = False\n        if exc_type is ValueError:\n            print(f"[error {self.name}: {exc}]")\n            suppress = True\n        print(f"[end {self.name}]")\n        return suppress\n\nvalue = input("Value: ")\nnumber = 0\nwith Section("parse"):\n    number = int(value)\n    print("Parsed", number)\n\ntry:\n    with Section("divide"):\n        print(f"100 / {number} = {100 / number:.1f}")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")']},
  power:{can:['Write a class-based context manager','Decide whether to suppress or propagate errors from __exit__'],
    expand:'Add a `Timer` context manager that stores the elapsed seconds on itself.',
    where:'Files, database connections, locks and temporary directories all use context managers.',
    next:'Next: contextlib, context managers from a single generator function.'},
  codex:{title:'Context managers',body:'__enter__ (returns the as-value) and __exit__(exc_type, exc, tb) which ALWAYS runs. Return True to suppress the error, False/None to let it propagate.',snip:R`def __exit__(self, exc_type, exc, tb):
    print("cleanup")
    return False`}
},
{
  id:'r11-20', realm:11, n:20, title:'contextlib: @contextmanager in one function',
  teaches:['cm-gen'], requires:['cm-class'],
  story:`"Two methods and a class, just to switch a lamp on and off?" the apprentice groans. Quill grins. "There's a shortcut: **one generator function with a single yield**. Everything before the yield is *enter*, everything after is *exit*."`,
  concept:{
    html:`\`@contextmanager\` turns a generator into a context manager:\n\n\`\`\`\nfrom contextlib import contextmanager\n\n@contextmanager\ndef section(name):\n    print(f"[start {name}]")\n    try:\n        yield name                # the 'as' value; the with-body runs here\n    finally:\n        print(f"[end {name}]")    # cleanup, even after an error\n\nwith section("load") as n:\n    print("working", n)\n\`\`\`\n\n- Code **before** \`yield\` = setup. The yielded value = the \`as\` target. Code **after** = teardown.\n- ⚠️ Wrap the \`yield\` in **\`try / finally\`**, otherwise cleanup is skipped when the body raises.\n- To *suppress* an exception, catch it around the yield: \`except ValueError: ...\`.\n- Handy ready-made ones in \`contextlib\`: \`suppress(KeyError)\` (ignore listed errors), \`redirect_stdout(buffer)\` (capture prints), \`closing\`, \`ExitStack\`.\n\n\`\`\`\nfrom contextlib import suppress, redirect_stdout\nimport io\n\nwith suppress(FileNotFoundError):\n    open("missing.txt")           # error ignored\n\nbuf = io.StringIO()\nwith redirect_stdout(buf):\n    print("hidden")\nbuf.getvalue()                    # 'hidden\\n'\n\`\`\``,
    analogy:`A bookmarked recipe: everything before the bookmark is prep, everything after is cleaning up.`,
    example:R`from contextlib import contextmanager, suppress, redirect_stdout
import io

@contextmanager
def section(name):
    print(f"[start {name}]")
    try:
        yield name
    finally:
        print(f"[end {name}]")

with section("load") as n:
    print("working", n)

with suppress(KeyError):
    {}["missing"]
print("still here")

buf = io.StringIO()
with redirect_stdout(buf):
    print("hidden")
print(repr(buf.getvalue()))`},
  predict:{code:R`from contextlib import contextmanager

@contextmanager
def cm():
    print("a")
    yield
    print("b")

with cm():
    print("c")`, q:'What prints?', opts:['a\nc\nb','a\nb\nc','c\na\nb'], ans:0, why:'Before yield = enter, the with-body, then after yield = exit.'},
  cast:{code:R`from contextlib import contextmanager, suppress, redirect_stdout
import io

@contextmanager
def section(name):
    print(f"[start {name}]")
    try:
        yield name
    finally:
        print(f"[end {name}]")

with section("load") as n:
    print("working", n)

with suppress(KeyError):
    {}["missing"]
print("still here")

buf = io.StringIO()
with redirect_stdout(buf):
    print("hidden")
print(repr(buf.getvalue()))`, task:'Cast it.'},
  bug:{broken:R`from contextlib import contextmanager

@contextmanager
def lamp():
    print("on")
    yield
    print("off")

try:
    with lamp():
        raise ValueError("oops")
except ValueError:
    pass`, task:'The lamp stays on when the body fails (off never prints). Wrap the yield in try/finally. Expected: on then off',
    cases:[{inputs:[],tests:[['Cleanup runs','lines==["on","off"]'],['finally','"finally" in src']]}],
    sol:R`from contextlib import contextmanager

@contextmanager
def lamp():
    print("on")
    try:
        yield
    finally:
        print("off")

try:
    with lamp():
        raise ValueError("oops")
except ValueError:
    pass`, wrong:[R`print("on")
print("off")`]},
  write:{prompt:'Write a context manager function `capture()` using `@contextmanager` and `redirect_stdout`: it yields a **list** that, after the `with` block ends, holds the lines that were printed inside it. (Fill the list in the cleanup step.) The program asks `Words: ` (space-separated). Inside `with capture() as lines:` call `shout(word)` for each word, where `shout` **prints** the word in uppercase followed by `!`. Then **outside** the block print `Captured <n> lines`, and the captured lines joined with ` | ` (`Lines: A! | B!`). If there are no words print `Lines: -`. The shouts must not appear on the screen directly.',
    starter:R`from contextlib import contextmanager, redirect_stdout
import io

def shout(word):
    print(word.upper() + "!")

words = input("Words: ").split()
`,
    inputs:['hi there'],
    cases:[{inputs:['hi there'],tests:[['Captured','[l for l in lines if l!="Words: hi there"]==["Captured 2 lines","Lines: HI! | THERE!"]'],['Is a context manager','hasattr(g["capture"](),"__enter__")'],['Works alone','(lambda: (lambda cm: (cm.__enter__(), cm.__exit__(None,None,None))[0])(g["capture"]()))() == [] or True'],['Uses redirect_stdout','"redirect_stdout(" in src and "@contextmanager" in src']]},{inputs:[''],tests:[['None','[l for l in lines if l!="Words: "]==["Captured 0 lines","Lines: -"]']]},{inputs:['a'],tests:[['One','[l for l in lines if l!="Words: a"]==["Captured 1 lines","Lines: A!"]']]},{inputs:['x y z'],tests:[['Three','lines[-2:]==["Captured 3 lines","Lines: X! | Y! | Z!"]']]}],
    sol:R`from contextlib import contextmanager, redirect_stdout
import io

def shout(word):
    print(word.upper() + "!")

@contextmanager
def capture():
    buffer = io.StringIO()
    captured = []
    try:
        with redirect_stdout(buffer):
            yield captured
    finally:
        captured.extend(buffer.getvalue().splitlines())

words = input("Words: ").split()
with capture() as caught:
    for word in words:
        shout(word)
print(f"Captured {len(caught)} lines")
print("Lines:", " | ".join(caught) if caught else "-")`,
    wrong:[R`from contextlib import contextmanager, redirect_stdout
import io

def shout(word):
    print(word.upper() + "!")

@contextmanager
def capture():
    captured = []
    yield captured

words = input("Words: ").split()
with capture() as caught:
    for word in words:
        shout(word)
        caught.append(word.upper() + "!")
print(f"Captured {len(caught)} lines")
print("Lines:", " | ".join(caught) if caught else "-")`, R`from contextlib import contextmanager, redirect_stdout
import io

def shout(word):
    print(word.upper() + "!")

@contextmanager
def capture():
    buffer = io.StringIO()
    captured = []
    with redirect_stdout(buffer):
        yield captured
    captured.extend(buffer.getvalue().splitlines())

words = input("Words: ").split()
with capture() as caught:
    for word in words:
        shout(word)
print(f"Captured {len(caught)} lines")
print("Lines:", " | ".join(caught))`],
    hints:['Make an io.StringIO() buffer and a list; with redirect_stdout(buffer): yield the list.','After the with block ends, fill the list: captured.extend(buffer.getvalue().splitlines()). Put that in finally.','Outside the block print the count and the joined lines (use "-" when empty).','from contextlib import contextmanager, redirect_stdout\nimport io\n\ndef shout(word):\n    print(word.upper() + "!")\n\n@contextmanager\ndef capture():\n    buffer = io.StringIO()\n    captured = []\n    try:\n        with redirect_stdout(buffer):\n            yield captured\n    finally:\n        captured.extend(buffer.getvalue().splitlines())\n\nwords = input("Words: ").split()\nwith capture() as caught:\n    for word in words:\n        shout(word)\nprint(f"Captured {len(caught)} lines")\nprint("Lines:", " | ".join(caught) if caught else "-")']},
  power:{can:['Write context managers with @contextmanager','Use suppress and redirect_stdout'],
    expand:'Write `@contextmanager def cd(path)` that changes the working directory and restores it afterwards.',
    where:'Testing tools capture output and patch settings with exactly this pattern.',
    next:'Next: type hints, documenting what code expects.'},
  codex:{title:'contextlib',body:'@contextmanager: code before yield = enter, the yielded value = as-target, code after = exit (put the yield in try/finally). suppress(Err) ignores errors; redirect_stdout(buf) captures prints.',snip:R`@contextmanager
def section(name):
    print("start")
    try:
        yield name
    finally:
        print("end")`}
},
{
  id:'r11-21', realm:11, n:21, title:'Type hints: say what your code expects',
  teaches:['typing-basic'], requires:['cm-gen'],
  story:`A crumpled scroll arrives with no label. "Is this a number? A name? A list of names?" Quill says. "In a big guild code base you answer that with **type hints**, short labels on every function."`,
  concept:{
    html:`Type hints are **labels**, not rules. Python ignores them at run time, but editors, linters and **mypy** use them to catch bugs before you run the code:\n\n\`\`\`\ndef total(prices: list[float], tax: float = 0.2) -> float:\n    return sum(prices) * (1 + tax)\n\ndef find(names: list[str], wanted: str) -> int | None:     # int OR None\n    return names.index(wanted) if wanted in names else None\n\nage: int = 30\nscores: dict[str, int] = {}\npoint: tuple[int, int] = (3, 4)\n\`\`\`\n\n- \`name: type\` for parameters, \`-> type\` for the return value; \`-> None\` if it returns nothing.\n- Containers: \`list[int]\`, \`dict[str, float]\`, \`tuple[int, str]\`, \`set[str]\`.\n- **Optional**: \`str | None\` (older style: \`Optional[str]\`). A function that may return None must say so.\n- \`Callable\`, \`Iterable\`, \`Any\` come from \`typing\` / \`collections.abc\`.\n- Hints are stored in \`func.__annotations__\`. They are never enforced: \`total("x")\` still runs and fails inside.\n- Hints make code self-documenting and make autocomplete far better. Add them to public functions first.`,
    analogy:`Labels on storage boxes: they don't stop you putting the wrong thing in, but they make mistakes obvious.`,
    example:R`def total(prices: list[float], tax: float = 0.2) -> float:
    return sum(prices) * (1 + tax)

def find(names: list[str], wanted: str) -> int | None:
    return names.index(wanted) if wanted in names else None

print(total([10.0, 20.0]))
print(find(["a", "b"], "b"), find(["a"], "z"))
print(total.__annotations__)`},
  predict:{code:R`def double(x: int) -> int:
    return x * 2

print(double("ab"))`, q:'What prints?', opts:['abab','Error','ab'], ans:0, why:'Hints are not enforced; "ab" * 2 works at run time.'},
  cast:{code:R`def total(prices: list[float], tax: float = 0.2) -> float:
    return sum(prices) * (1 + tax)

def find(names: list[str], wanted: str) -> int | None:
    return names.index(wanted) if wanted in names else None

print(total([10.0, 20.0]))
print(find(["a", "b"], "b"), find(["a"], "z"))
print(total.__annotations__)`, task:'Cast it.'},
  bug:{broken:R`def first_word(text: str) -> str:
    words = text.split()
    if words:
        return words[0]

print(first_word("") + "!")`, task:'The hint says str but the empty case returns None, so the + fails. Return an empty string in that case and fix the hint if needed. Expected: !',
    cases:[{inputs:[],tests:[['Works','lines==["!"]'],['Fixed the function','"def first_word" in src']]}],
    sol:R`def first_word(text: str) -> str:
    words = text.split()
    if words:
        return words[0]
    return ""

print(first_word("") + "!")`, wrong:[R`print("!")`]},
  write:{prompt:'Write fully type-hinted functions: `average(numbers: list[float]) -> float | None` (None when empty), `longest(words: list[str]) -> str | None` (first longest word; None when empty) and `describe(name: str, age: int = 0) -> str` returning `<name> (<age>)`, or just `<name>` when age is 0. Ask `Numbers: ` and `Words: ` (space-separated; numbers may be decimals) and `Name: `. Print `Average: <value with 2 decimals>` or `Average: none`, `Longest: <word>` or `Longest: none`, and `Hero: <describe(name, 7)>`.',
    starter:R`def average(numbers):
    pass

numbers = [float(w) for w in input("Numbers: ").split()]
words = input("Words: ").split()
name = input("Name: ")
`,
    inputs:['1 2 4','cat horse ox','Ada'],
    cases:[{inputs:['1 2 4','cat horse ox','Ada'],tests:[['Output','lines[-3:]==["Average: 2.33","Longest: horse","Hero: Ada (7)"]'],['Hints exist','all(len(g[n].__annotations__)>0 for n in ("average","longest","describe"))'],['Return hints','all("return" in g[n].__annotations__ for n in ("average","longest","describe"))'],['Params hinted','set(g["describe"].__annotations__)>={"name","age","return"}'],['Behaviour','g["describe"]("Bo")=="Bo" and g["describe"]("Bo",3)=="Bo (3)" and g["average"]([])is None and g["longest"]([]) is None']]},{inputs:['','','Zed'],tests:[['Empty inputs','lines[-3:]==["Average: none","Longest: none","Hero: Zed (7)"]']]},{inputs:['5','a bb cc','X'],tests:[['First longest wins','lines[-3:]==["Average: 5.00","Longest: bb","Hero: X (7)"]']]},{inputs:['0 0','a','Q'],tests:[['Zero average is not none','lines[-3]=="Average: 0.00"']]}],
    sol:R`def average(numbers: list[float]) -> float | None:
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

def longest(words: list[str]) -> str | None:
    if not words:
        return None
    return max(words, key=len)

def describe(name: str, age: int = 0) -> str:
    return f"{name} ({age})" if age else name

numbers = [float(w) for w in input("Numbers: ").split()]
words = input("Words: ").split()
name = input("Name: ")
avg = average(numbers)
print("Average:", f"{avg:.2f}" if avg is not None else "none")
word = longest(words)
print("Longest:", word if word is not None else "none")
print("Hero:", describe(name, 7))`,
    wrong:[R`def average(numbers: list[float]) -> float | None:
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

def longest(words: list[str]) -> str | None:
    if not words:
        return None
    return max(words, key=len)

def describe(name: str, age: int = 0) -> str:
    return f"{name} ({age})" if age else name

numbers = [float(w) for w in input("Numbers: ").split()]
words = input("Words: ").split()
name = input("Name: ")
avg = average(numbers)
print("Average:", f"{avg:.2f}" if avg else "none")
word = longest(words)
print("Longest:", word if word is not None else "none")
print("Hero:", describe(name, 7))`, R`def average(numbers):
    if not numbers:
        return None
    return sum(numbers) / len(numbers)

def longest(words):
    if not words:
        return None
    return max(words, key=len)

def describe(name, age=0):
    return f"{name} ({age})" if age else name

numbers = [float(w) for w in input("Numbers: ").split()]
words = input("Words: ").split()
name = input("Name: ")
avg = average(numbers)
print("Average:", f"{avg:.2f}" if avg is not None else "none")
word = longest(words)
print("Longest:", word if word is not None else "none")
print("Hero:", describe(name, 7))`],
    hints:['Annotate parameters (numbers: list[float]) and returns (-> float | None).','Return None for empty input, then check `is not None` (not just truthiness, since 0.0 is falsy!).','max(words, key=len) gives the first longest word.','def average(numbers: list[float]) -> float | None:\n    if not numbers:\n        return None\n    return sum(numbers) / len(numbers)\n\ndef longest(words: list[str]) -> str | None:\n    if not words:\n        return None\n    return max(words, key=len)\n\ndef describe(name: str, age: int = 0) -> str:\n    return f"{name} ({age})" if age else name\n\nnumbers = [float(w) for w in input("Numbers: ").split()]\nwords = input("Words: ").split()\nname = input("Name: ")\navg = average(numbers)\nprint("Average:", f"{avg:.2f}" if avg is not None else "none")\nword = longest(words)\nprint("Longest:", word if word is not None else "none")\nprint("Hero:", describe(name, 7))']},
  power:{can:['Annotate functions, containers and optional values','Explain that hints are labels, not enforcement'],
    expand:'Install mypy on your own machine and run it on this file to catch a deliberate type error.',
    where:'Professional code bases require type hints; they power autocomplete and catch bugs early.',
    next:'Next: Real-World Mission: the Transaction.'},
  codex:{title:'Type hints',body:'def f(x: int, y: str = "a") -> bool. list[int], dict[str, int], tuple[int, str], int | None. Not enforced at run time; used by editors and mypy. Stored in __annotations__.',snip:R`def find(names: list[str], wanted: str) -> int | None:
    ...`}
},
{
  id:'r11-22', realm:11, n:22, title:'Real-World Mission: The Transaction',
  teaches:['mission11d'], requires:['typing-basic','cm-class'],
  story:`The Gate's treasury updates its ledger in **batches**: "set rent 40; set food 25; remove gold". If any step in a batch fails, the *whole batch* must be undone: no half-finished ledgers. "Build me a **Transaction**," Quill says, "a context manager that rolls back on any error."`,
  concept:{
    html:`A **transaction** is the classic use of a context manager:\n\n\`\`\`\nclass Transaction:\n    def __init__(self, store: dict[str, int]):\n        self.store = store\n\n    def __enter__(self):\n        self.snapshot = dict(self.store)       # remember the state (a COPY)\n        return self.store\n\n    def __exit__(self, exc_type, exc, tb):\n        if exc_type is not None:\n            self.store.clear()\n            self.store.update(self.snapshot)   # roll back IN PLACE\n        return False                           # the error still propagates\n\`\`\`\n\n- Snapshot with \`dict(store)\` (a **copy**). A plain \`snapshot = store\` would just be a second name for the same dict.\n- Roll back **in place** (\`clear()\` + \`update()\`) so every other reference to the dict sees the restored data.\n- Success = do nothing (changes stay); failure = restore, and let the error continue to be handled by the caller.\n- Same pattern as database \`BEGIN / COMMIT / ROLLBACK\`.\n\nBatch syntax for this mission: commands separated by \`;\`:\n\`set <key> <number>\`, \`add <key> <number>\` (key must exist), \`remove <key>\` (key must exist).`,
    analogy:`An undo button for a group of actions: all or nothing.`,
    example:R`class Transaction:
    def __init__(self, store):
        self.store = store

    def __enter__(self):
        self.snapshot = dict(self.store)
        return self.store

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None:
            self.store.clear()
            self.store.update(self.snapshot)
        return False

ledger = {"gold": 5}
try:
    with Transaction(ledger) as data:
        data["gold"] = 99
        raise ValueError("oops")
except ValueError:
    pass
print(ledger)`},
  predict:{code:R`a = {"x": 1}
b = a
c = dict(a)
a["x"] = 2
print(b["x"], c["x"])`, q:'What prints?', opts:['2 1','2 2','1 1'], ans:0, why:'b is the same dict; c is an independent copy.'},
  cast:{code:R`class Transaction:
    def __init__(self, store):
        self.store = store

    def __enter__(self):
        self.snapshot = dict(self.store)
        return self.store

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None:
            self.store.clear()
            self.store.update(self.snapshot)
        return False

ledger = {"gold": 5}
try:
    with Transaction(ledger) as data:
        data["gold"] = 99
        raise ValueError("oops")
except ValueError:
    pass
print(ledger)`, task:'Cast it.'},
  bug:{broken:R`ledger = {"gold": 5}
snapshot = ledger
try:
    ledger["gold"] = 99
    raise ValueError("oops")
except ValueError:
    ledger = snapshot
print(ledger["gold"])`, task:'snapshot is not a copy, it is the same dict, so the rollback restores nothing. Copy the dict. Expected: 5',
    cases:[{inputs:[],tests:[['Rolled back','lines==["5"]'],['Real copy','"dict(" in src or ".copy()" in src']]}],
    sol:R`ledger = {"gold": 5}
snapshot = dict(ledger)
try:
    ledger["gold"] = 99
    raise ValueError("oops")
except ValueError:
    ledger = snapshot
print(ledger["gold"])`, wrong:[R`ledger = {"gold": 5}
snapshot = ledger
try:
    ledger["gold"] = 99
    raise ValueError("oops")
except ValueError:
    ledger = snapshot
print(5)`]},
  write:{prompt:'Write a context manager class `Transaction(store)` that snapshots the dict on entry and, if an exception happens inside, **restores the original contents in place** (the error then continues). Commands arrive as batches in lines: `set <key> <number>`, `add <key> <number>` (key must exist; adds), `remove <key>` (key must exist) joined by `;`. For each input line (prompt `Batch: `, blank line ends) run all the commands inside `with Transaction(ledger)`. Bad commands, missing keys and non-numbers raise `ValueError` with a message: `Unknown command: <text>`, `Missing key: <key>`, `Bad number: <text>`. On success print `Committed <n> changes`. On failure print `Rolled back: <message>`. After all batches print `Ledger: <key=value pairs sorted by key, space-separated>` (or `Ledger: empty`).',
    starter:R`class Transaction:
    pass

ledger = {}
`,
    inputs:['set rent 40; set food 25','add rent 5; remove gold','remove food; set tea 3',''],
    cases:[{inputs:['set rent 40; set food 25','add rent 5; remove gold','remove food; set tea 3',''],tests:[['Session','[l for l in lines if not l.startswith("Batch:")]==["Committed 2 changes","Rolled back: Missing key: gold","Committed 2 changes","Ledger: rent=40 tea=3"] or [l for l in lines if "Batch:" not in l]==["Committed 2 changes","Rolled back: Missing key: gold","Committed 2 changes","Ledger: rent=40 tea=3"]'],['Class works','(lambda d: (lambda t: (t.__enter__(), d.update(x=1), t.__exit__(ValueError, ValueError("e"), None)))(g["Transaction"](d)))({}) is not None'],['Rollback in place','(lambda d: (lambda t: (t.__enter__(), d.update(x=1), t.__exit__(ValueError, ValueError("e"), None), d)[3])(g["Transaction"](d)))({"a":1})=={"a":1}'],['Success keeps changes','(lambda d: (lambda t: (t.__enter__(), d.update(x=1), t.__exit__(None, None, None), d)[3])(g["Transaction"](d)))({})=={"x":1}']]},{inputs:[''],tests:[['No batches','[l for l in lines if "Batch:" not in l]==["Ledger: empty"]']]},{inputs:['set a 1; dance','set b 2',''],tests:[['Unknown command rolls back whole batch','[l for l in lines if "Batch:" not in l]==["Rolled back: Unknown command: dance","Committed 1 changes","Ledger: b=2"]']]},{inputs:['set a x',''],tests:[['Bad number','[l for l in lines if "Batch:" not in l]==["Rolled back: Bad number: x","Ledger: empty"]']]},{inputs:['set a 1; add b 2','add a 5',''],tests:[['Earlier steps undone','[l for l in lines if "Batch:" not in l]==["Rolled back: Missing key: b","Rolled back: Missing key: a","Ledger: empty"]']]},{inputs:['set a 1','set a 2; set b 3; remove zzz','add a 10',''],tests:[['Partial changes undone','[l for l in lines if "Batch:" not in l]==["Committed 1 changes","Rolled back: Missing key: zzz","Committed 1 changes","Ledger: a=11"]']]}],
    sol:R`class Transaction:
    def __init__(self, store: dict[str, int]):
        self.store = store

    def __enter__(self):
        self.snapshot = dict(self.store)
        return self.store

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None:
            self.store.clear()
            self.store.update(self.snapshot)
        return False

def number(text: str) -> int:
    try:
        return int(text)
    except ValueError:
        raise ValueError(f"Bad number: {text}")

def run(ledger: dict[str, int], command: str) -> None:
    parts = command.split()
    if len(parts) == 3 and parts[0] == "set":
        ledger[parts[1]] = number(parts[2])
    elif len(parts) == 3 and parts[0] == "add":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        ledger[parts[1]] += number(parts[2])
    elif len(parts) == 2 and parts[0] == "remove":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        del ledger[parts[1]]
    else:
        raise ValueError(f"Unknown command: {command.strip()}")

ledger = {}
while True:
    line = input("Batch: ")
    if not line.strip():
        break
    commands = [c.strip() for c in line.split(";") if c.strip()]
    try:
        with Transaction(ledger) as data:
            for command in commands:
                run(data, command)
        print(f"Committed {len(commands)} changes")
    except ValueError as error:
        print("Rolled back:", error)

print("Ledger:", " ".join(f"{k}={v}" for k, v in sorted(ledger.items())) or "empty")`,
    wrong:[R`class Transaction:
    def __init__(self, store: dict[str, int]):
        self.store = store

    def __enter__(self):
        self.snapshot = self.store
        return self.store

    def __exit__(self, exc_type, exc, tb):
        if exc_type is not None:
            self.store.clear()
            self.store.update(self.snapshot)
        return False

def number(text: str) -> int:
    try:
        return int(text)
    except ValueError:
        raise ValueError(f"Bad number: {text}")

def run(ledger: dict[str, int], command: str) -> None:
    parts = command.split()
    if len(parts) == 3 and parts[0] == "set":
        ledger[parts[1]] = number(parts[2])
    elif len(parts) == 3 and parts[0] == "add":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        ledger[parts[1]] += number(parts[2])
    elif len(parts) == 2 and parts[0] == "remove":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        del ledger[parts[1]]
    else:
        raise ValueError(f"Unknown command: {command.strip()}")

ledger = {}
while True:
    line = input("Batch: ")
    if not line.strip():
        break
    commands = [c.strip() for c in line.split(";") if c.strip()]
    try:
        with Transaction(ledger) as data:
            for command in commands:
                run(data, command)
        print(f"Committed {len(commands)} changes")
    except ValueError as error:
        print("Rolled back:", error)

print("Ledger:", " ".join(f"{k}={v}" for k, v in sorted(ledger.items())) or "empty")`, R`class Transaction:
    def __init__(self, store: dict[str, int]):
        self.store = store

    def __enter__(self):
        self.snapshot = dict(self.store)
        return self.store

    def __exit__(self, exc_type, exc, tb):
        return True

def number(text: str) -> int:
    try:
        return int(text)
    except ValueError:
        raise ValueError(f"Bad number: {text}")

def run(ledger: dict[str, int], command: str) -> None:
    parts = command.split()
    if len(parts) == 3 and parts[0] == "set":
        ledger[parts[1]] = number(parts[2])
    elif len(parts) == 3 and parts[0] == "add":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        ledger[parts[1]] += number(parts[2])
    elif len(parts) == 2 and parts[0] == "remove":
        if parts[1] not in ledger:
            raise ValueError(f"Missing key: {parts[1]}")
        del ledger[parts[1]]
    else:
        raise ValueError(f"Unknown command: {command.strip()}")

ledger = {}
while True:
    line = input("Batch: ")
    if not line.strip():
        break
    commands = [c.strip() for c in line.split(";") if c.strip()]
    try:
        with Transaction(ledger) as data:
            for command in commands:
                run(data, command)
        print(f"Committed {len(commands)} changes")
    except ValueError as error:
        print("Rolled back:", error)

print("Ledger:", " ".join(f"{k}={v}" for k, v in sorted(ledger.items())) or "empty")`],
    hints:['__enter__: self.snapshot = dict(self.store) (a copy!) and return self.store.','__exit__: if exc_type is not None: self.store.clear(); self.store.update(self.snapshot). Return False so the error continues.','A helper run(ledger, command) raises ValueError for bad commands; the loop wraps the whole batch in `with Transaction(ledger) as data:` inside try / except ValueError.','class Transaction:\n    def __init__(self, store):\n        self.store = store\n\n    def __enter__(self):\n        self.snapshot = dict(self.store)\n        return self.store\n\n    def __exit__(self, exc_type, exc, tb):\n        if exc_type is not None:\n            self.store.clear()\n            self.store.update(self.snapshot)\n        return False\n\ndef number(text):\n    try:\n        return int(text)\n    except ValueError:\n        raise ValueError(f"Bad number: {text}")\n\ndef run(ledger, command):\n    parts = command.split()\n    if len(parts) == 3 and parts[0] == "set":\n        ledger[parts[1]] = number(parts[2])\n    elif len(parts) == 3 and parts[0] == "add":\n        if parts[1] not in ledger:\n            raise ValueError(f"Missing key: {parts[1]}")\n        ledger[parts[1]] += number(parts[2])\n    elif len(parts) == 2 and parts[0] == "remove":\n        if parts[1] not in ledger:\n            raise ValueError(f"Missing key: {parts[1]}")\n        del ledger[parts[1]]\n    else:\n        raise ValueError(f"Unknown command: {command.strip()}")\n\nledger = {}\nwhile True:\n    line = input("Batch: ")\n    if not line.strip():\n        break\n    commands = [c.strip() for c in line.split(";") if c.strip()]\n    try:\n        with Transaction(ledger) as data:\n            for command in commands:\n                run(data, command)\n        print(f"Committed {len(commands)} changes")\n    except ValueError as error:\n        print("Rolled back:", error)\n\nprint("Ledger:", " ".join(f"{k}={v}" for k, v in sorted(ledger.items())) or "empty")']},
  power:{can:['Implement all-or-nothing updates with a context manager','Snapshot state safely with a real copy'],
    expand:'Make the Transaction nestable: an inner failure rolls back only the inner batch.',
    where:'Databases, config updates and game-state saves all use transactional rollback.',
    next:'Next: the Realm 11 boss.'},
  codex:{title:'Mission: Transaction',body:'Snapshot with a COPY on entry; on error clear()+update() the original in place; return False so the error continues. All-or-nothing batches.',snip:R`def __exit__(self, exc_type, exc, tb):
    if exc_type is not None:
        self.store.clear()
        self.store.update(self.snapshot)
    return False`}
},
{
  id:'r11-23', realm:11, n:23, title:'Boss: The Gatekeeper Golem', kind:'boss',
  teaches:['realm11-boss'], requires:['mission11d'],
  story:`The great arch grinds open and a **Gatekeeper Golem** steps through, built of stacked ledgers, rolling conveyor belts and clasped decorators. "Show me you can **stream, wrap and clean up**," it rumbles. "Five tests, five strikes."`,
  boss:{name:'The Gatekeeper Golem', hp:5},
  phases:[
    {type:'mcq', code:R`def gen():
    yield 1
    yield 2

g = gen()
print(list(g), list(g))`, q:'Strike 1: What prints?', opts:['[1, 2] []','[1, 2] [1, 2]','[] []'], ans:0,
     why:'A generator is used up after one pass.', tags:['r11-08']},
    {type:'write', prompt:'Strike 2: Define a frozen, ordered dataclass `Card(rank: int, suit: str)`. Ask `Cards: ` (like `10H 3S 10C`: a rank number then a one-letter suit). Skip anything that isn\'t a number followed by a letter. With no valid cards print `No cards`. Otherwise print `Best: <rank><suit>` (highest rank; equal ranks compare by suit letter, higher letter wins) and `Distinct: <how many different cards>`.',
     starter:R`from dataclasses import dataclass

words = input("Cards: ").split()
`,
     inputs:['10H 3S 10C'],
     cases:[{inputs:['10H 3S 10C'],tests:[['Best','lines[-2:]==["Best: 10H","Distinct: 3"]'],['Frozen and ordered','__import__("unittest").TestCase().assertRaises(Exception, setattr, g["Card"](1,"a"), "rank", 2) is None and g["Card"](2,"a")<g["Card"](2,"b")']]},{inputs:['5S 5S'],tests:[['Duplicates','lines[-2:]==["Best: 5S","Distinct: 1"]']]},{inputs:['x 9 AB 7D'],tests:[['Junk skipped','lines[-2:]==["Best: 7D","Distinct: 1"]']]},{inputs:[''],tests:[['None','lines[-1]=="No cards"']]},{inputs:['2H 12D'],tests:[['Numeric rank','lines[-2:]==["Best: 12D","Distinct: 2"]']]}],
     sol:R`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Card:
    rank: int
    suit: str

words = input("Cards: ").split()
cards = []
for word in words:
    digits, suit = word[:-1], word[-1:]
    if digits.isdigit() and suit.isalpha():
        cards.append(Card(int(digits), suit))

if not cards:
    print("No cards")
else:
    best = max(cards)
    print(f"Best: {best.rank}{best.suit}")
    print("Distinct:", len(set(cards)))`,
     wrong:[R`from dataclasses import dataclass

@dataclass(order=True)
class Card:
    rank: int
    suit: str

words = input("Cards: ").split()
cards = []
for word in words:
    digits, suit = word[:-1], word[-1:]
    if digits.isdigit() and suit.isalpha():
        cards.append(Card(int(digits), suit))

if not cards:
    print("No cards")
else:
    best = max(cards)
    print(f"Best: {best.rank}{best.suit}")
    print("Distinct:", len(cards))`, R`from dataclasses import dataclass

@dataclass(frozen=True, order=True)
class Card:
    rank: str
    suit: str

words = input("Cards: ").split()
cards = []
for word in words:
    digits, suit = word[:-1], word[-1:]
    if digits.isdigit() and suit.isalpha():
        cards.append(Card(digits, suit))

if not cards:
    print("No cards")
else:
    best = max(cards)
    print(f"Best: {best.rank}{best.suit}")
    print("Distinct:", len(set(cards)))`],
     hints:['@dataclass(frozen=True, order=True) with rank: int first, then suit: str: field order is the sort order.','Split each word: digits = word[:-1], suit = word[-1:]; keep it if digits.isdigit() and suit.isalpha().','max(cards) uses the generated ordering; len(set(cards)) works because frozen dataclasses are hashable.','from dataclasses import dataclass\n\n@dataclass(frozen=True, order=True)\nclass Card:\n    rank: int\n    suit: str\n\nwords = input("Cards: ").split()\ncards = []\nfor word in words:\n    digits, suit = word[:-1], word[-1:]\n    if digits.isdigit() and suit.isalpha():\n        cards.append(Card(int(digits), suit))\n\nif not cards:\n    print("No cards")\nelse:\n    best = max(cards)\n    print(f"Best: {best.rank}{best.suit}")\n    print("Distinct:", len(set(cards)))'],
     tags:['r11-03']},
    {type:'mcq', code:R`def deco(f):
    def wrapper(*a):
        return f(*a)
    return wrapper

@deco
def work():
    pass

print(work.__name__)`, q:'Strike 3: What prints?', opts:['wrapper','work','deco'], ans:0,
     why:'Without functools.wraps the decorated name is the wrapper.', tags:['r11-15']},
    {type:'write', prompt:'Strike 4: Write a decorator factory `bounded(low, high)` that checks the **first positional argument** of the wrapped function is between `low` and `high` inclusive. If not, the call returns the string `Out of range: <value>` without running the function. Keep the function name (wraps). Decorate `def square(n): return n * n` with `@bounded(0, 10)`. Ask `Numbers: ` (whole numbers) and print each result on its own line; then print `Name: <square.__name__>`.',
     starter:R`from functools import wraps

def bounded(low, high):
    pass

numbers = [int(w) for w in input("Numbers: ").split()]
`,
     inputs:['3 11 -1 10'],
     cases:[{inputs:['3 11 -1 10'],tests:[['Results','[l for l in lines if l!="Numbers: 3 11 -1 10"]==["9","Out of range: 11","Out of range: -1","100","Name: square"]'],['Factory','g["bounded"](1,2)(lambda n: n)(5)=="Out of range: 5" and g["bounded"](1,2)(lambda n: n)(2)==2'],['Name kept','"wraps(" in src']]},{inputs:[''],tests:[['None','[l for l in lines if l!="Numbers: "]==["Name: square"]']]},{inputs:['0'],tests:[['Lower edge','"0" in lines']]},{inputs:['5 5'],tests:[['Twice','[l for l in lines if l!="Numbers: 5 5"]==["25","25","Name: square"]']]}],
     sol:R`from functools import wraps

def bounded(low, high):
    def decorator(func):
        @wraps(func)
        def wrapper(value, *args, **kwargs):
            if not low <= value <= high:
                return f"Out of range: {value}"
            return func(value, *args, **kwargs)
        return wrapper
    return decorator

@bounded(0, 10)
def square(n):
    return n * n

numbers = [int(w) for w in input("Numbers: ").split()]
for n in numbers:
    print(square(n))
print("Name:", square.__name__)`,
     wrong:[R`from functools import wraps

def bounded(low, high):
    def decorator(func):
        @wraps(func)
        def wrapper(value, *args, **kwargs):
            if not low < value < high:
                return f"Out of range: {value}"
            return func(value, *args, **kwargs)
        return wrapper
    return decorator

@bounded(0, 10)
def square(n):
    return n * n

numbers = [int(w) for w in input("Numbers: ").split()]
for n in numbers:
    print(square(n))
print("Name:", square.__name__)`, R`def bounded(low, high):
    def decorator(func):
        def wrapper(value, *args, **kwargs):
            if not low <= value <= high:
                return f"Out of range: {value}"
            return func(value, *args, **kwargs)
        return wrapper
    return decorator

@bounded(0, 10)
def square(n):
    return n * n

numbers = [int(w) for w in input("Numbers: ").split()]
for n in numbers:
    print(square(n))
print("Name:", square.__name__)`],
     hints:['Three layers: bounded(low, high) -> decorator(func) -> wrapper(value, *args, **kwargs).','Return the "Out of range: ..." string when not low <= value <= high; otherwise return func(value, *args, **kwargs).','Put @wraps(func) on the wrapper so square.__name__ stays "square".','from functools import wraps\n\ndef bounded(low, high):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(value, *args, **kwargs):\n            if not low <= value <= high:\n                return f"Out of range: {value}"\n            return func(value, *args, **kwargs)\n        return wrapper\n    return decorator\n\n@bounded(0, 10)\ndef square(n):\n    return n * n\n\nnumbers = [int(w) for w in input("Numbers: ").split()]\nfor n in numbers:\n    print(square(n))\nprint("Name:", square.__name__)'],
     tags:['r11-16']},
    {type:'write', prompt:'Strike 5: Write a generator pipeline over the lines of a text. Ask `Lines: ` (lines separated by `|`). Stage 1 `clean(lines)` strips each line; stage 2 `keep_words(lines)` yields only lines that are made of letters and spaces (non-empty); stage 3 `title_case(lines)` yields each line in Title Case. Print the results, one per line, then `Count: <how many>`. Use generators for all three stages and wrap the work in a `with` block of a context manager `section("lines")` (from contextlib) that prints `[start lines]` before and `[end lines]` after.',
     starter:R`from contextlib import contextmanager

raw = input("Lines: ").split("|")
`,
     inputs:['  hello world | 42 | ready  |'],
     cases:[{inputs:['  hello world | 42 | ready  |'],tests:[['Pipeline','[l for l in lines if l!="Lines:   hello world | 42 | ready  |"]==["[start lines]","Hello World","Ready","Count: 2","[end lines]"] or [l for l in lines if not l.startswith("Lines:")]==["[start lines]","Hello World","Ready","[end lines]"]'],['Generators','all(__import__("inspect").isgeneratorfunction(g[n]) for n in ("clean","keep_words","title_case"))']]},{inputs:['abc'],tests:[['One','"[start lines]" in lines and "Abc" in lines and "[end lines]" in lines']]},{inputs:['1|2|3'],tests:[['None qualify','[l for l in lines if not l.startswith("Lines:")]==["[start lines]","Count: 0","[end lines]"] or [l for l in lines if not l.startswith("Lines:")]==["[start lines]","[end lines]"]']]},{inputs:['a b|c-d'],tests:[['Hyphen rejected','"A B" in lines and "C-D" not in lines and "C-d" not in lines']]}],
     sol:R`from contextlib import contextmanager

@contextmanager
def section(name):
    print(f"[start {name}]")
    try:
        yield
    finally:
        print(f"[end {name}]")

def clean(lines):
    for line in lines:
        yield line.strip()

def keep_words(lines):
    for line in lines:
        if line and all(c.isalpha() or c == " " for c in line):
            yield line

def title_case(lines):
    for line in lines:
        yield line.title()

raw = input("Lines: ").split("|")
with section("lines"):
    results = list(title_case(keep_words(clean(raw))))
    for line in results:
        print(line)
    print("Count:", len(results))`,
     wrong:[R`from contextlib import contextmanager

@contextmanager
def section(name):
    print(f"[start {name}]")
    try:
        yield
    finally:
        print(f"[end {name}]")

def clean(lines):
    for line in lines:
        yield line.strip()

def keep_words(lines):
    for line in lines:
        if line and all(c.isalpha() or c in " -" for c in line):
            yield line

def title_case(lines):
    for line in lines:
        yield line.title()

raw = input("Lines: ").split("|")
with section("lines"):
    results = list(title_case(keep_words(clean(raw))))
    for line in results:
        print(line)
    print("Count:", len(results))`, R`from contextlib import contextmanager

@contextmanager
def section(name):
    print(f"[start {name}]")
    yield
    print(f"[end {name}]")

def clean(lines):
    return [line.strip() for line in lines]

def keep_words(lines):
    return [line for line in lines if line and all(c.isalpha() or c == " " for c in line)]

def title_case(lines):
    return [line.title() for line in lines]

raw = input("Lines: ").split("|")
with section("lines"):
    results = list(title_case(keep_words(clean(raw))))
    for line in results:
        print(line)
    print("Count:", len(results))`],
     hints:['Three generator functions each with for ... yield. keep_words keeps non-empty lines whose characters are all letters or spaces.','section is a @contextmanager generator: print start, try: yield, finally: print end.','Inside with section("lines"): collect list(title_case(keep_words(clean(raw)))), print each, then print Count.','from contextlib import contextmanager\n\n@contextmanager\ndef section(name):\n    print(f"[start {name}]")\n    try:\n        yield\n    finally:\n        print(f"[end {name}]")\n\ndef clean(lines):\n    for line in lines:\n        yield line.strip()\n\ndef keep_words(lines):\n    for line in lines:\n        if line and all(c.isalpha() or c == " " for c in line):\n            yield line\n\ndef title_case(lines):\n    for line in lines:\n        yield line.title()\n\nraw = input("Lines: ").split("|")\nwith section("lines"):\n    results = list(title_case(keep_words(clean(raw))))\n    for line in results:\n        print(line)\n    print("Count:", len(results))'],
     tags:['r11-11','r11-20']}
  ],
  power:{can:['Combine dataclasses, decorators, generators and context managers','Spot the classic traps: used-up generators and missing wraps'],
    expand:'Turn strikes 2 to 5 into one small card-game toolkit module.',
    where:'These four tools appear in almost every professional Python project.',
    next:'One more gate: the Gap Check for the Iterator Gate.'},
  codex:{title:'Realm 11 boss',body:'You can write records with dataclasses, stream data with generators, wrap behaviour with decorators and guarantee clean-up with context managers.',snip:R`@dataclass(frozen=True, order=True)
class Card:
    rank: int
    suit: str`}
},
{
  id:'r11-24', realm:11, n:24, title:'Gap Check: the Iterator Gate Trial', kind:'gap', passPct:80,
  teaches:['realm11-gap'], requires:['realm11-boss'],
  story:`The Golem folds into a stack of tidy, sealed envelopes. Quill breaks the wax on the top one. "Eighty percent opens the **Master Gate**. Beyond it lie modules, packages, tests, and the tools real teams use to ship Python."`,
  phases:[
    {type:'mcq', code:R`from dataclasses import dataclass

@dataclass
class P:
    x: int
    y: int = 0

print(P(1))`, q:'What prints?', opts:['P(x=1, y=0)','P(1)','<P object>'], ans:0, why:'@dataclass generates a readable repr from the fields.', tags:['r11-01']},
    {type:'mcq', code:R`from dataclasses import dataclass, field

@dataclass
class B:
    xs: list = field(default_factory=list)

a, b = B(), B()
a.xs.append(1)
print(b.xs)`, q:'What prints?', opts:['[]','[1]','Error'], ans:0, why:'default_factory builds a separate list for each object.', tags:['r11-02']},
    {type:'mcq', code:R`from dataclasses import dataclass

@dataclass(frozen=True)
class P:
    x: int

p = P(1)
try:
    p.x = 2
except Exception as error:
    print(type(error).__name__)`, q:'What prints?', opts:['FrozenInstanceError','AttributeError','Nothing'], ans:0, why:'Assigning to a field of a frozen dataclass raises FrozenInstanceError.', tags:['r11-03']},
    {type:'mcq', code:R`from dataclasses import dataclass

@dataclass
class A:
    x: int
    def __post_init__(self):
        self.x += 1

print(A(1).x)`, q:'What prints?', opts:['2','1','Error'], ans:0, why:'__post_init__ runs right after the generated __init__.', tags:['r11-04']},
    {type:'mcq', code:R`from dataclasses import dataclass, asdict

@dataclass
class P:
    x: int
    y: int

print(asdict(P(1, 2)))`, q:'What prints?', opts:["{'x': 1, 'y': 2}","(1, 2)","P(x=1, y=2)"], ans:0, why:'asdict returns a dict of the fields.', tags:['r11-05']},
    {type:'mcq', code:R`from enum import Enum

class C(Enum):
    RED = "r"

print(C("r").name)`, q:'What prints?', opts:['RED','r','C'], ans:0, why:'Lookup by value returns the member; .name is RED.', tags:['r11-06']},
    {type:'mcq', code:R`def gen():
    for i in range(3):
        yield i

g = gen()
next(g)
print(list(g))`, q:'What prints?', opts:['[1, 2]','[0, 1, 2]','[2]'], ans:0, why:'next(g) consumed 0; list takes the rest.', tags:['r11-08']},
    {type:'mcq', code:R`from itertools import islice

def nat():
    n = 0
    while True:
        yield n
        n += 1

print(list(islice(nat(), 3)))`, q:'What prints?', opts:['[0, 1, 2]','Hangs forever','[1, 2, 3]'], ans:0, why:'islice takes just three values from the infinite stream.', tags:['r11-09']},
    {type:'mcq', code:R`g = (n * 2 for n in [1, 2, 3])
print(sum(g), sum(g))`, q:'What prints?', opts:['12 0','12 12','6 6'], ans:0, why:'A generator expression is used up after the first sum.', tags:['r11-10']},
    {type:'mcq', code:R`def make(n):
    def add(x):
        return x + n
    return add

print(make(3)(4))`, q:'What prints?', opts:['7','12','Error'], ans:0, why:'add remembers n = 3 from make.', tags:['r11-13']},
    {type:'mcq', code:R`def deco(f):
    def wrapper(*a):
        f(*a)
    return wrapper

@deco
def add(a, b):
    return a + b

print(add(1, 2))`, q:'What prints?', opts:['None','3','Error'], ans:0, why:'The wrapper forgot to return the result.', tags:['r11-14']},
    {type:'mcq', code:R`def repeat(n):
    def deco(f):
        def w():
            for _ in range(n):
                f()
        return w
    return deco

@repeat(2)
def hi():
    print("hi")

hi()`, q:'How many times is hi printed?', opts:['2','1','0'], ans:0, why:'repeat(2) builds a decorator that calls the function twice.', tags:['r11-16']},
    {type:'mcq', code:R`class C:
    def __enter__(self):
        print("a")
        return self
    def __exit__(self, *args):
        print("c")

with C():
    print("b")`, q:'What prints?', opts:['a\nb\nc','b\na\nc','a\nc\nb'], ans:0, why:'enter, body, exit.', tags:['r11-19']},
    {type:'mcq', code:R`def f(x: int) -> int:
    return x + 1

print(f("a"))`, q:'What happens?', opts:['TypeError at run time (str + int)','Python refuses before running','"a1"'], ans:0, why:'Hints are not enforced; the failure comes from "a" + 1 inside the function.', tags:['r11-21']}
  ],
  power:{can:['Use dataclasses, enums, generators, decorators, context managers and type hints','Pass the Iterator Gate trial'],
    expand:'Rebuild the weakest phases as your own mini-lessons and quiz yourself.',
    where:'These idioms make the difference between beginner scripts and professional Python.',
    next:'Next: Realm 12, the Master Gate.'},
  codex:{title:'Realm 11 gap check',body:'Dataclasses, enums, generators, expressions, pipelines, closures, decorators (with wraps and arguments), context managers and type hints: all checked.',snip:R`@dataclass
class P:
    x: int`}
}
);
