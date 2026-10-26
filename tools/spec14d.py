from gen14 import *
import json

L = []
PREV = 'mission14c'

# ---------------------------------------------------------------- 31 dataclass
s31 = r'''from dataclasses import dataclass

@dataclass(frozen=True)
class Item:
    name: str
    price: float
    qty: int = 1

    def __post_init__(self):
        if self.qty <= 0:
            raise ValueError("qty must be positive")

    @property
    def total(self):
        return self.price * self.qty

parts = input("Item: ").split()
try:
    item = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)
except ValueError as e:
    print("Invalid:", e)
else:
    print(item)
    print(f"Total: {item.total:.2f}")
    print("Equal to a copy:", item == Item(item.name, item.price, item.qty))
    try:
        item.qty = 99
    except Exception as e:
        print("Frozen:", type(e).__name__)'''
L.append(lesson('r14-31', 31, 'Dataclasses: classes without the boilerplate', ['craft-dataclass'], [PREV],
 "The fourth and last door of the Hall of Four Doors is carved with tiny tools. \"The Craft Guild,\" Quill says, \"is where code stops being a script and becomes a **product**. Their first trick saves you from typing the same twelve lines of class boilerplate ever again.\"",
 "Classes that just hold data need `__init__`, `__repr__` and `__eq__`. The **`@dataclass`** decorator writes them for you from type-annotated fields:\n\n```\nfrom dataclasses import dataclass\n\n@dataclass(frozen=True)\nclass Item:\n    name: str\n    price: float\n    qty: int = 1                 # a default value\n\n    def __post_init__(self):     # runs right after __init__\n        if self.qty <= 0:\n            raise ValueError(\"qty must be positive\")\n\n    @property\n    def total(self):             # looks like an attribute, computed on demand\n        return self.price * self.qty\n```\n\n- You get `Item('pen', 1.5, 4)`, a readable `repr` (`Item(name='pen', price=1.5, qty=4)`) and `==` that compares field by field.\n- Fields with defaults must come **after** fields without.\n- **`frozen=True`** makes instances read-only: assigning raises `FrozenInstanceError`. Frozen objects are safer to share and can be dictionary keys.\n- **`__post_init__`** is the place to **validate**: reject bad values as early as possible.\n- Mutable defaults like `[]` are forbidden directly; use `field(default_factory=list)`.\n- **`@property`** exposes a computed value without parentheses.\n- Related tools: `order=True` (sortable), `asdict()`, `replace()` (copy with changes).",
 "A form with labelled boxes: you describe the boxes once and the printing press produces forms, copies and comparisons for you.",
 r'''from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int = 0

print(Point(3), Point(3) == Point(3, 0))''',
 predict(r'''from dataclasses import dataclass

@dataclass
class P:
    x: int
    y: int = 0

print(P(1) == P(1, 0))''', 'What prints?', ['True', 'False', 'P(x=1, y=0)'], 0, 'A dataclass compares all fields, and P(1) fills in the default y=0, so the two are equal.'),
 dict(broken=r'''from dataclasses import dataclass

@dataclass
class Pet:
    name: str
    age: int

print(Pet("Rex"))''', task='`Pet("Rex")` crashes because `age` is required. Give `age` a **default** of 1 so the program prints `Pet(name=\'Rex\', age=1)`.',
  sol=r'''from dataclasses import dataclass

@dataclass
class Pet:
    name: str
    age: int = 1

print(Pet("Rex"))''', extra=[('Default added', '"age: int = 1" in src')], wrong=[r'''print("Pet(name='Rex', age=1)")''']),
 dict(prompt='Ask `Item: ` (like `pen 1.5 4`; the quantity is optional). The program builds an `Item` and prints it, its total, equality with a copy and what happens when you assign to a field. Write the **dataclass** `Item`: fields `name` (text), `price` (number) and `qty` (whole number, default 1); it must be **frozen**; creating one with `qty` of 0 or less raises `ValueError("qty must be positive")`; and a `total` **property** gives `price * qty`.',
  starter=r'''from dataclasses import dataclass

# write the Item dataclass here

parts = input("Item: ").split()
try:
    item = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)
except ValueError as e:
    print("Invalid:", e)
else:
    print(item)
    print(f"Total: {item.total:.2f}")
    print("Equal to a copy:", item == Item(item.name, item.price, item.qty))
    try:
        item.qty = 99
    except Exception as e:
        print("Frozen:", type(e).__name__)''',
  cases=[dict(inputs=['pen 1.5 4'], name='Normal', extra=[('Default quantity', 'g["Item"]("x", 1.0).qty == 1')]), dict(inputs=['cup 3'], name='Default quantity'), dict(inputs=['bag 9.99 0'], name='Zero quantity'), dict(inputs=['tea 2 -3'], name='Negative quantity'), dict(inputs=['fig 0.25 12'], name='Many')],
  sol=s31,
  wrong=[('@dataclass(frozen=True)', '@dataclass'), ('    qty: int = 1\n', '    qty: int\n'), ('if self.qty <= 0:', 'if self.qty < 0:'), ('return self.price * self.qty', 'return self.price'), ('    @property\n    def total(self):', '    def total(self):'), ('raise ValueError("qty must be positive")', 'raise ValueError("bad qty")')],
  hints=['Decorate with @dataclass(frozen=True) and list the fields with type hints; qty gets = 1.', 'def __post_init__(self): raise ValueError("qty must be positive") when self.qty <= 0.', 'Add @property def total(self): return self.price * self.qty.']),
 dict(can=['Define data classes in a few lines', 'Validate in __post_init__ and freeze objects'], expand='Add `order=True` and sort a list of items by price; add a `discounted(percent)` method that returns a new item with `dataclasses.replace`.', where='Config objects, API records and parsed rows are all natural dataclasses; libraries like `pydantic` build on the same idea.', next='Next: a safe way to name choices and branch on shapes.'),
 dict(title='Dataclasses', body='@dataclass writes __init__, __repr__, __eq__ from annotated fields. Defaults after non-defaults. frozen=True = read-only. __post_init__ validates. field(default_factory=list) for mutable defaults. @property = computed attribute.', snip='@dataclass(frozen=True)\nclass Item:\n    name: str\n    qty: int = 1')))

# ---------------------------------------------------------------- 32 enum + match
s32 = r'''from enum import Enum

class Status(Enum):
    NEW = 1
    PAID = 2
    SHIPPED = 3
    DONE = 4
    CANCELLED = 5

def step(status, event):
    match (status, event):
        case (Status.NEW, "pay"):
            return Status.PAID
        case (Status.PAID, "ship"):
            return Status.SHIPPED
        case (Status.SHIPPED, "deliver"):
            return Status.DONE
        case (Status.NEW | Status.PAID, "cancel"):
            return Status.CANCELLED
        case _:
            raise ValueError(f"cannot {event} when {status.name}")

status = Status.NEW
while True:
    event = input("Event: ")
    if not event:
        break
    try:
        new_status = step(status, event)
    except ValueError as e:
        print("Error:", e)
    else:
        print(f"{status.name} -> {new_status.name}")
        status = new_status
print("Final:", status.name)'''
L.append(lesson('r14-32', 32, 'Enums and match: a safe state machine', ['craft-enum-match'], ['craft-dataclass'],
 "A parcel moves through the Guild's warehouse: *new, paid, shipped, delivered*. Quill frowns at a box labelled with the word `\"shiped\"`. \"Strings let typos in,\" the Archmage says. \"Use an **enum** for the states and `match` for the rules. A misspelling then becomes an error at once.\"",
 "An **Enum** is a fixed set of named choices:\n\n```\nclass Status(Enum):\n    NEW = 1\n    PAID = 2\n    ...\nStatus.NEW.name       # 'NEW'\nStatus.PAID.value     # 2\nStatus['PAID']        # look up by name\n```\n\n- `Status.PAID` can't be mistyped silently: `Status.PAD` raises `AttributeError` immediately, whereas the string `\"pad\"` just sits there being wrong.\n- Compare enum members with `is` or `==`, never with their numbers.\n\nThe **`match`** statement (Python 3.10+) chooses by **shape**:\n\n```\nmatch (status, event):\n    case (Status.NEW, \"pay\"):\n        return Status.PAID\n    case (Status.NEW | Status.PAID, \"cancel\"):     # | means \"either\"\n        return Status.CANCELLED\n    case _:                                         # the catch-all\n        raise ValueError(f\"cannot {event} when {status.name}\")\n```\n\n- A **state machine** lists which (state, event) pairs are legal; everything else is rejected. This is far safer than scattered `if` statements.\n- Dotted names like `Status.NEW` in a `case` are compared by value. A bare name such as `new` would instead **capture** the value into a variable, a classic trap.\n- `case _` matches anything; put it last.\n- Cancelling after shipping is not allowed here: the rules are the documentation.",
 "A subway map: you can only travel along drawn lines, and anything else is a clear \"no\".",
 r'''from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2

c = Color.GREEN
print(c.name, c.value, c is Color.GREEN)''',
 predict(r'''from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2

print(Color(2).name)''', 'What prints?', ['GREEN', 'RED', '2'], 0, 'Color(2) looks the member up by value, and .name gives its label.'),
 dict(broken=r'''def kind(command):
    match command:
        case "go":
            return "move"
        case "stop":
            return "halt"

print(kind("jump"))''', task='`kind("jump")` returns `None` because no case matches. Add a catch-all `case _:` that returns `"unknown"`. Expected: `unknown`',
  sol=r'''def kind(command):
    match command:
        case "go":
            return "move"
        case "stop":
            return "halt"
        case _:
            return "unknown"

print(kind("jump"))''', extra=[('Has a catch-all', '"case _" in src')], wrong=[r'''print("unknown")''']),
 dict(prompt='An order moves through `Status` (NEW, PAID, SHIPPED, DONE, CANCELLED). Write `step(status, event)` with a **`match`** statement: `pay` takes NEW to PAID; `ship` takes PAID to SHIPPED; `deliver` takes SHIPPED to DONE; `cancel` takes NEW **or** PAID to CANCELLED. Anything else raises `ValueError("cannot <event> when <STATUS NAME>")`. The loop that reads events (until a blank line) is given.',
  starter=r'''from enum import Enum

class Status(Enum):
    NEW = 1
    PAID = 2
    SHIPPED = 3
    DONE = 4
    CANCELLED = 5

# write step(status, event) here with a match statement

status = Status.NEW
while True:
    event = input("Event: ")
    if not event:
        break
    try:
        new_status = step(status, event)
    except ValueError as e:
        print("Error:", e)
    else:
        print(f"{status.name} -> {new_status.name}")
        status = new_status
print("Final:", status.name)''',
  cases=[dict(inputs=['pay', 'ship', 'deliver', ''], name='Happy path', extra=[('Uses match', '"match" in src and "case" in src')]), dict(inputs=['cancel', 'pay', ''], name='Cancelled is final'), dict(inputs=['pay', 'cancel', ''], name='Cancel after paying'), dict(inputs=['pay', 'ship', 'cancel', ''], name='Too late to cancel'), dict(inputs=['ship', 'deliver', 'pay', 'pay', ''], name='Out of order'), dict(inputs=['pay', 'ship', 'deliver', 'deliver', 'cancel', ''], name='After done'), dict(inputs=[''], name='Nothing happens')],
  sol=s32,
  wrong=[('case (Status.NEW | Status.PAID, "cancel"):', 'case (Status.NEW | Status.PAID | Status.SHIPPED, "cancel"):'), ('case (Status.NEW | Status.PAID, "cancel"):', 'case (Status.NEW, "cancel"):'), ('case (Status.PAID, "ship"):\n            return Status.SHIPPED', 'case (Status.NEW, "ship"):\n            return Status.SHIPPED'), ('return Status.DONE', 'return Status.SHIPPED'), ('cannot {event} when {status.name}', 'cannot {event}'), ('        case _:\n            raise ValueError(f"cannot {event} when {status.name}")', '        case _:\n            return status')],
  hints=['match (status, event): with one case per allowed pair, e.g. case (Status.NEW, "pay"): return Status.PAID.', 'Use | inside the pattern for either state: case (Status.NEW | Status.PAID, "cancel").', 'Finish with case _: raise ValueError(f"cannot {event} when {status.name}").']),
 dict(can=['Name fixed choices with an Enum', 'Write a state machine with match'], expand='Add a `return` event that takes DONE back to NEW only within the first 7 days, using a guard: `case (Status.DONE, "return") if days <= 7:`.', where='Order tracking, game levels, traffic lights and protocol parsers are all state machines.', next='Next: tell Python (and your teammates) what types you expect.'),
 dict(title='Enum and match', body='Enum: fixed named choices (Status.PAID, .name, .value). match: case patterns by shape; | = either; case _ = catch-all; dotted names compare, bare names capture. A state machine lists legal (state, event) pairs and rejects the rest.', snip='match (status, event):\n    case (Status.NEW, "pay"):\n        return Status.PAID\n    case _:\n        raise ValueError("illegal")')))

# ---------------------------------------------------------------- 33 type hints
s33 = r'''def average(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)

def longest(words: list[str], default: str = "") -> str:
    return max(words, key=len) if words else default

def describe(maybe: int | None) -> str:
    return "nothing" if maybe is None else f"value {maybe}"

numbers = [float(x) for x in input("Numbers: ").split()]
print(describe(average(numbers)) if False else average(numbers))
words = input("Words: ").split()
print(longest(words, "none"))
print(describe(len(words) or None))'''
s33 = s33.replace('print(describe(average(numbers)) if False else average(numbers))', 'print(average(numbers))')
st33 = s33.replace('def average(values: list[float]) -> float | None:', 'def average(values):').replace('def longest(words: list[str], default: str = "") -> str:', 'def longest(words, default=""):').replace('def describe(maybe: int | None) -> str:', 'def describe(maybe):')
L.append(lesson('r14-33', 33, 'Type hints: telling people what you expect', ['craft-types'], ['craft-enum-match'],
 "Quill hands you a function with no labels at all: `def merge(a, b, c)`. \"What are these? Numbers? Files? A rocket?\" the Archmage sighs. \"Type hints are **labels on the jars**. Python ignores them when running, but your teammates, your editor and checkers like `mypy` read them eagerly.\"",
 "**Type hints** document what goes in and what comes out:\n\n```\ndef average(values: list[float]) -> float | None:\n    if not values:\n        return None\n    return sum(values) / len(values)\n\ndef longest(words: list[str], default: str = \"\") -> str:\n    ...\n```\n\n- `name: type` annotates a parameter; `-> type` annotates the return value; `= value` after it sets a default.\n- Built-in generics: `list[int]`, `dict[str, float]`, `tuple[int, int]`, `set[str]`.\n- **`X | None`** (read \"X or nothing\") says a value may be missing: a promise to callers that they must check for `None`.\n- **Python does not enforce hints.** `add(\"2\", \"3\")` still runs (and gives `\"23\"`). They are *documentation that tools can check*: run `mypy` or let your editor underline mistakes.\n- Hints live in `func.__annotations__`, a dict you can inspect.\n- Good habits: annotate every public function; use `X | None` whenever `None` is possible; keep types simple.\n- Aliases such as `Callable`, `Protocol` and `TypedDict` (from `typing`) describe functions and dict shapes; learn them as you need them.",
 "Labels on storage jars: the lid doesn't stop you putting salt in the sugar, but everyone knows what should be there.",
 r'''def add(a: int, b: int) -> int:
    return a + b

print(add.__annotations__)''',
 predict(r'''def f(x: int) -> str:
    return x

print(f(5))''', 'What prints?', ['5', "'5'", 'TypeError'], 0, 'Python ignores hints while running. f returns the int 5 even though the hint says str.'),
 dict(broken=r'''def add(a: int, b: int) -> int:
    return a + b

print(add("2", "3"))''', task='Hints do not convert or check anything, so this prints `23`. Convert the two texts to numbers when calling `add`. Expected: `5`',
  sol=r'''def add(a: int, b: int) -> int:
    return a + b

print(add(int("2"), int("3")))''', extra=[('Converts the inputs', 'src.count("int(") >= 3 and \'int("2")\' in src')], wrong=[r'''print(5)''']),
 dict(prompt='Three working functions have no hints. Add **type hints** without changing their behaviour: `average(values)` takes a list of floats and returns a float **or None**; `longest(words, default="")` takes a list of strings and a string default and returns a string; `describe(maybe)` takes an int **or None** and returns a string. The program at the bottom runs them.',
  starter=st33,
  cases=[dict(inputs=['1 2 3 4', 'apple fig banana'], name='Normal', extra=[('average hints', 'g["average"].__annotations__ == {"values": list[float], "return": float | None}'), ('longest hints', 'g["longest"].__annotations__ == {"words": list[str], "default": str, "return": str}'), ('describe hints', 'g["describe"].__annotations__ == {"maybe": int | None, "return": str}'), ('Default kept', 'g["longest"]([]) == ""')]), dict(inputs=['', 'a'], name='Empty numbers'), dict(inputs=['2.5', ''], name='No words')],
  sol=s33,
  wrong=[('-> float | None:', '-> float:'), ('values: list[float]', 'values: list[int]'), ('default: str = ""', 'default = ""'), ('maybe: int | None', 'maybe: int'), ('-> str:\n    return "nothing"', '-> int:\n    return "nothing"'), ('words: list[str]', 'words: list')],
  hints=['def average(values: list[float]) -> float | None:', 'longest(words: list[str], default: str = "") -> str. Keep the default value.', 'def describe(maybe: int | None) -> str: the | None says the value may be missing.']),
 dict(can=['Annotate functions with parameter and return types', 'Mark values that may be None'], expand='Install `mypy` on your computer and run `mypy yourfile.py` to see it catch a wrong call before you run the program.', where='Large codebases at companies require hints so that thousands of functions stay understandable.', next='Next: tidy resource handling with your own `with` blocks.'),
 dict(title='Type hints', body='def f(x: int, y: str = "a") -> float | None. list[int], dict[str, float]. Not enforced at runtime; checked by mypy/editors; stored in __annotations__. X | None = may be missing.', snip='def average(values: list[float]) -> float | None:')))

# ---------------------------------------------------------------- 34 context managers
s34 = r'''from contextlib import contextmanager

account = {"balance": 100}

@contextmanager
def transaction(acct):
    snapshot = dict(acct)
    try:
        yield acct
    except Exception:
        acct.clear()
        acct.update(snapshot)
        raise

def apply(amounts):
    with transaction(account) as acct:
        for amount in amounts:
            if acct["balance"] + amount < 0:
                raise ValueError(f"cannot apply {amount}")
            acct["balance"] += amount

amounts = list(map(int, input("Amounts: ").split()))
try:
    apply(amounts)
    print("Committed")
except ValueError as e:
    print("Rolled back:", e)
print("Balance:", account["balance"])'''
L.append(lesson('r14-34', 34, 'Write your own with-blocks (context managers)', ['craft-ctx'], ['craft-types'],
 "A bank clerk transfers money in three steps and the quill snaps after step two. Half the transfer happened. \"Disaster,\" Quill says. \"We need a promise: **either everything in this block succeeds, or nothing happens at all.** Python has a tool for promises: the `with` statement.\"",
 "You have used `with open(...)`. You can make your own with **`@contextmanager`**:\n\n```\nfrom contextlib import contextmanager\n\n@contextmanager\ndef transaction(acct):\n    snapshot = dict(acct)          # setup: remember the starting state\n    try:\n        yield acct                 # the body of the with-block runs here\n    except Exception:\n        acct.clear()\n        acct.update(snapshot)      # failure: put everything back\n        raise                      # and still report the error\n```\n\n- Code **before** `yield` is setup. Code **after** is cleanup. The `with` body runs *at* the `yield`.\n- `with transaction(account) as acct:` receives the yielded value as `acct`.\n- If the body raises, the exception is **thrown in at the `yield`**, so a `try/except` around it can undo the damage.\n- **Re-raise** with a bare `raise`. Swallowing the error would let callers think everything worked.\n- Use `try/finally` (not `except`) for cleanup that must happen **every** time, e.g. closing a file or releasing a lock.\n- This *commit or roll back* pattern is how databases work. Python's `sqlite3` connection is itself a context manager that commits or rolls back.\n- `dict(acct)` copies the dictionary; `clear()` then `update(snapshot)` restores it **in place**, keeping other references valid.",
 "An undo button wrapped around a block of work: if anything goes wrong, the page returns to how it was.",
 r'''from contextlib import contextmanager

@contextmanager
def tag(name):
    print("<" + name + ">")
    yield
    print("</" + name + ">")

with tag("b"):
    print("hello")''',
 predict(r'''from contextlib import contextmanager

@contextmanager
def box():
    print("open", end=" ")
    yield
    print("close", end=" ")

with box():
    print("body", end=" ")''', 'What prints (on one line, with trailing space)?', ['open body close ', 'body open close ', 'open close body '], 0, 'Code before yield runs first, then the with-body, then the code after yield.'),
 dict(broken=r'''from contextlib import contextmanager

@contextmanager
def guard():
    try:
        yield
    except ValueError:
        print("cleaned up")

try:
    with guard():
        raise ValueError("boom")
except ValueError:
    print("caller saw the error")''', task='The guard cleans up but swallows the error, so the caller never hears about it. After printing `cleaned up`, **re-raise** the error. Expected: `cleaned up`, then `caller saw the error`.',
  sol=r'''from contextlib import contextmanager

@contextmanager
def guard():
    try:
        yield
    except ValueError:
        print("cleaned up")
        raise

try:
    with guard():
        raise ValueError("boom")
except ValueError:
    print("caller saw the error")''', extra=[('Re-raises', '"        raise\\n" in src')], wrong=[r'''print("cleaned up")
print("caller saw the error")''']),
 dict(prompt='Ask `Amounts: ` (whole numbers like `10 20 -5`). `account` holds a balance of 100 and `apply(amounts)` changes it, raising `ValueError` if the balance would go below zero. Write the context manager `transaction(acct)`: remember a copy of the starting state; if the block raises an error, **restore** the account to that state and **re-raise** the error; otherwise leave the changes.',
  starter=r'''from contextlib import contextmanager

account = {"balance": 100}

# write the transaction context manager here

def apply(amounts):
    with transaction(account) as acct:
        for amount in amounts:
            if acct["balance"] + amount < 0:
                raise ValueError(f"cannot apply {amount}")
            acct["balance"] += amount

amounts = list(map(int, input("Amounts: ").split()))
try:
    apply(amounts)
    print("Committed")
except ValueError as e:
    print("Rolled back:", e)
print("Balance:", account["balance"])''',
  cases=[dict(inputs=['10 20 -5'], name='Commits'), dict(inputs=['-50 -60'], name='Fails halfway: rolled back'), dict(inputs=[''], name='Nothing to apply'), dict(inputs=['-100'], name='Exactly to zero'), dict(inputs=['30 -200 40'], name='Early change undone')],
  sol=s34,
  wrong=[('        raise\n\ndef apply', '        pass\n\ndef apply'), ('        acct.clear()\n        acct.update(snapshot)\n', ''), ('    except Exception:\n        acct.clear()\n        acct.update(snapshot)\n        raise', '    finally:\n        acct.clear()\n        acct.update(snapshot)'), ('snapshot = dict(acct)', 'snapshot = acct'), ('        yield acct', '        yield {}')],
  hints=['Decorate with @contextmanager. First line: snapshot = dict(acct).', 'try: yield acct. except Exception: put the snapshot back (acct.clear() then acct.update(snapshot)).', 'End the except block with a bare raise so the caller still sees the error.']),
 dict(can=['Write your own with-blocks', 'Make a block all-or-nothing'], expand='Make `transaction` also print `BEGIN`, `COMMIT` or `ROLLBACK`, and nest two transactions.', where='Database sessions, temporary directories, locks, timers and test fixtures all use context managers.', next='Next: wrap functions in retries.'),
 dict(title='Context managers', body='@contextmanager: setup, yield, cleanup. Exceptions are thrown in at the yield: try/except to undo then bare raise; try/finally for cleanup that must always run. Used with "with x as y".', snip='@contextmanager\ndef transaction(acct):\n    snapshot = dict(acct)\n    try:\n        yield acct\n    except Exception:\n        restore(acct, snapshot)\n        raise')))

# ---------------------------------------------------------------- 35 retry decorator
s35 = r'''import functools

def retry(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ValueError:
                    print(f"Attempt {attempt} failed")
                    if attempt == times:
                        raise
        return wrapper
    return decorator

failures = int(input("Failures: "))
calls = {"n": 0}

@retry(3)
def flaky():
    calls["n"] += 1
    if calls["n"] <= failures:
        raise ValueError("boom")
    return "ok"

@retry(3)
def broken():
    raise KeyError("nope")

try:
    print("Result:", flaky())
except ValueError:
    print("Gave up")
try:
    broken()
except KeyError:
    print("KeyError not retried")'''
L.append(lesson('r14-35', 35, 'A retry decorator (with functools.wraps)', ['craft-retry'], ['craft-ctx'],
 "Networks hiccup. \"A request fails once in a while, for no reason at all,\" Quill says. \"Smart programs **try again**, a few times, but only for the kinds of failure that retrying can fix. A decorator keeps that logic out of every function.\"",
 "A decorator that takes an argument has **three layers**:\n\n```\ndef retry(times):                          # 1. configuration\n    def decorator(func):                   # 2. receives the function\n        @functools.wraps(func)             # 3. keep name and docstring\n        def wrapper(*args, **kwargs):      #    runs on every call\n            for attempt in range(1, times + 1):\n                try:\n                    return func(*args, **kwargs)\n                except ValueError:\n                    print(f\"Attempt {attempt} failed\")\n                    if attempt == times:\n                        raise              # out of tries: tell the caller\n        return wrapper\n    return decorator\n```\n\n- `*args, **kwargs` lets the wrapper accept and forward **any** arguments.\n- **`functools.wraps(func)`** copies `__name__` and the docstring onto the wrapper. Without it every decorated function is called `wrapper`, confusing logs and debuggers.\n- Catch only **expected, temporary** errors (`ValueError` here, `ConnectionError` or `TimeoutError` in reality). A `KeyError` is a bug: retrying only hides it. Never write a bare `except:`.\n- On the **last** attempt, re-raise so the caller learns it failed.\n- Real retry code waits between tries and doubles the wait each time (**exponential backoff**), often with randomness to avoid every client retrying together.",
 "A postal worker who rings a doorbell three times, but doesn't keep ringing if the address doesn't exist.",
 r'''import functools

def shout(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs).upper()
    return wrapper

@shout
def greet(name):
    return "hi " + name

print(greet("ada"), greet.__name__)''',
 predict(r'''def deco(func):
    def wrapper():
        return func()
    return wrapper

@deco
def hello():
    return 1

print(hello.__name__)''', 'What prints?', ['wrapper', 'hello', 'deco'], 0, 'Without functools.wraps the decorated name points at the inner function, whose name is "wrapper".'),
 dict(broken=r'''def twice(func):
    def wrapper(x):
        func(x)
        func(x)
    return wrapper

@twice
def double(x):
    return x * 2

print(double(4))''', task='The wrapper calls `func` twice but throws the results away, so `double(4)` prints `None`. Return the result of the **last** call. Expected: `8`',
  sol=r'''def twice(func):
    def wrapper(x):
        func(x)
        return func(x)
    return wrapper

@twice
def double(x):
    return x * 2

print(double(4))''', extra=[('Returns a result', '"return func(x)" in src')], wrong=[r'''print(8)''']),
 dict(prompt='Ask `Failures: ` (how many times `flaky` fails before it succeeds). Write the decorator `retry(times)`: call the function up to `times` times; when it raises `ValueError`, print `Attempt <n> failed` and try again; after the last failed attempt re-raise. Other errors must **not** be retried. Keep the original function name with `functools.wraps`.',
  starter=r'''import functools

# write the retry decorator here

failures = int(input("Failures: "))
calls = {"n": 0}

@retry(3)
def flaky():
    calls["n"] += 1
    if calls["n"] <= failures:
        raise ValueError("boom")
    return "ok"

@retry(3)
def broken():
    raise KeyError("nope")

try:
    print("Result:", flaky())
except ValueError:
    print("Gave up")
try:
    broken()
except KeyError:
    print("KeyError not retried")''',
  cases=[dict(inputs=['0'], name='No failures', extra=[('Name preserved', 'g["flaky"].__name__ == "flaky"')]), dict(inputs=['2'], name='Succeeds on the third try'), dict(inputs=['3'], name='Gives up'), dict(inputs=['1'], name='One hiccup'), dict(inputs=['10'], name='Hopeless')],
  sol=s35,
  wrong=[('except ValueError:', 'except Exception:'), ('range(1, times + 1)', 'range(1, times)'), ('                    if attempt == times:\n                        raise', '                    if attempt == times:\n                        return None'), ('        @functools.wraps(func)\n', ''), ('return func(*args, **kwargs)', 'func(*args, **kwargs)'), ('range(1, times + 1)', 'range(times)')],
  hints=['Three layers: retry(times) -> decorator(func) -> wrapper(*args, **kwargs).', 'for attempt in range(1, times + 1): try: return func(*args, **kwargs); except ValueError: print the attempt line.', 'On the last attempt re-raise; add @functools.wraps(func) above wrapper.']),
 dict(can=['Write decorators that take arguments', 'Retry only the failures that are worth retrying'], expand='Add `delay` and `backoff` parameters and compute the waiting time (print it; do not really sleep) for each retry.', where='API clients, database drivers and job queues retry like this every second of the day.', next='Next: logging instead of print.'),
 dict(title='Retry decorator', body='retry(times) -> decorator(func) -> wrapper(*args, **kwargs); @functools.wraps(func); catch only expected errors; re-raise on the last attempt; never bare except. Real code adds backoff.', snip='@functools.wraps(func)\ndef wrapper(*args, **kwargs):\n    return func(*args, **kwargs)')))

# ---------------------------------------------------------------- 36 logging
s36 = r'''import logging
import sys

def setup(level_name):
    logging.basicConfig(stream=sys.stdout, level=getattr(logging, level_name.upper()),
                        format="%(levelname)s:%(message)s", force=True)

log = logging.getLogger("shop")

def process(amount):
    log.debug("checking %s", amount)
    if amount < 0:
        log.error("negative amount %s", amount)
        return False
    if amount > 1000:
        log.warning("large amount %s", amount)
    log.info("accepted %s", amount)
    return True

setup(input("Level: "))
amounts = list(map(int, input("Amounts: ").split()))
accepted = sum(1 for a in amounts if process(a))
print("Accepted:", accepted)'''
L.append(lesson('r14-36', 36, 'Logging: print for grown-ups', ['craft-log'], ['craft-retry'],
 "In the Craft Guild's engine room, hundreds of `print` calls scream at once. \"When something breaks at three in the morning,\" Quill says, \"you want to turn the chatter **up or down**, and know how serious each line is. That is what `logging` is for.\"",
 "`print` is all-or-nothing. **`logging`** gives every message a **level** and lets you choose which to show:\n\n| Level | Use for |\n|---|---|\n| `DEBUG` | detail for developers |\n| `INFO` | normal events |\n| `WARNING` | something odd, but we carry on |\n| `ERROR` | an operation failed |\n| `CRITICAL` | the program may not continue |\n\n```\nimport logging, sys\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO,\n                    format=\"%(levelname)s:%(message)s\", force=True)\nlog = logging.getLogger(\"shop\")\nlog.info(\"accepted %s\", amount)     # pass values as arguments\n```\n\n- Only messages **at or above** the configured level appear: with `WARNING` you see warnings and errors, not info or debug.\n- `getattr(logging, \"INFO\")` turns the text `\"INFO\"` into the number 20.\n- `%(levelname)s` and `%(message)s` are format fields; others include `%(asctime)s` (time) and `%(name)s` (logger name).\n- Use **`log.info(\"x %s\", value)`** (arguments) rather than f-strings: the text is only built if the message is actually shown.\n- Give each module its own logger: `logging.getLogger(__name__)`.\n- `log.exception(\"...\")` inside `except` records the full traceback.\n- Production logs go to files or services; `stream=sys.stdout` simply keeps them visible here.",
 "A volume dial for your program's voice: whisper only the emergencies, or narrate everything.",
 r'''import logging
print(logging.INFO, logging.WARNING)''',
 predict(r'''import logging
print(logging.getLevelName(30))''', 'What prints?', ['WARNING', 'INFO', 'ERROR'], 0, 'Level number 30 is WARNING (DEBUG 10, INFO 20, WARNING 30, ERROR 40, CRITICAL 50).'),
 dict(broken=r'''import logging, sys
logging.basicConfig(stream=sys.stdout, level=logging.WARNING, format="%(levelname)s:%(message)s", force=True)
logging.info("server started")
logging.error("disk full")''', task='"disk full" must show, but `server started` should show too. Lower the configured level so that INFO messages are displayed. Expected: `INFO:server started` then `ERROR:disk full`.',
  sol=r'''import logging, sys
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s:%(message)s", force=True)
logging.info("server started")
logging.error("disk full")''', extra=[('Level lowered', '"level=logging.INFO" in src')], wrong=[r'''print("INFO:server started")
print("ERROR:disk full")''']),
 dict(prompt='Ask `Level: ` (DEBUG, INFO, WARNING or ERROR, any case) and `Amounts: `. Write `setup(level_name)` using `logging.basicConfig` (stream `sys.stdout`, that level, format `%(levelname)s:%(message)s`, `force=True`) and `process(amount)`: log `checking <amount>` at DEBUG; for a **negative** amount log `negative amount <amount>` at ERROR and return `False`; for an amount **over 1000** log `large amount <amount>` at WARNING (still accepted); then log `accepted <amount>` at INFO and return `True`. The loop is given.',
  starter=r'''import logging
import sys

log = logging.getLogger("shop")

# write setup(level_name) and process(amount) here

setup(input("Level: "))
amounts = list(map(int, input("Amounts: ").split()))
accepted = sum(1 for a in amounts if process(a))
print("Accepted:", accepted)''',
  cases=[dict(inputs=['DEBUG', '50 -5 2000'], name='Everything'), dict(inputs=['info', '50 -5 2000'], name='Info and above'), dict(inputs=['WARNING', '50 -5 2000'], name='Warnings and above'), dict(inputs=['ERROR', '50 -5 2000'], name='Errors only'), dict(inputs=['INFO', ''], name='Nothing to process'), dict(inputs=['WARNING', '1000 1001'], name='Boundary at 1000')],
  sol=s36,
  wrong=[('log.debug("checking %s", amount)', 'log.info("checking %s", amount)'), ('log.error("negative amount %s", amount)', 'log.warning("negative amount %s", amount)'), ('    if amount > 1000:', '    if amount >= 1000:'), ('level=getattr(logging, level_name.upper())', 'level=logging.INFO'), ('format="%(levelname)s:%(message)s"', 'format="%(message)s"'), ('        log.warning("large amount %s", amount)\n', '        log.warning("large amount %s", amount)\n        return False\n')],
  hints=['basicConfig(stream=sys.stdout, level=getattr(logging, level_name.upper()), format="%(levelname)s:%(message)s", force=True).', 'process: log.debug first; negative -> log.error and return False.', 'Over 1000 -> log.warning; then log.info("accepted %s", amount) and return True.']),
 dict(can=['Replace print with levelled logging', 'Choose how much your program says'], expand='Add `%(asctime)s` to the format and a second logger named `shop.payments`.', where='Every server and every scheduled job writes logs; they are how people debug what happened last night.', next='Next: tools from the standard library that replace loops.'),
 dict(title='logging', body='Levels DEBUG<INFO<WARNING<ERROR<CRITICAL; only messages at/above the configured level show. basicConfig(level, format, stream, force). log = getLogger(__name__); log.info("x %s", v). log.exception inside except.', snip='log = logging.getLogger(__name__)\nlog.info("accepted %s", amount)')))

# ---------------------------------------------------------------- 37 itertools
s37 = r'''from itertools import groupby, accumulate, islice

sales = []
for part in input("Sales: ").split():
    category, amount = part.split(":")
    sales.append((category, int(amount)))

sales.sort(key=lambda s: s[0])
for category, group in groupby(sales, key=lambda s: s[0]):
    print(category, sum(amount for _, amount in group))

amounts = [amount for _, amount in sales]
print("Running:", list(accumulate(amounts)))
print("First two:", list(islice(amounts, 2)))'''
L.append(lesson('r14-37', 37, 'itertools: loops you never have to write', ['craft-itertools'], ['craft-log'],
 "On the Craft Guild's workbench lie small, shiny tools with strange names: *groupby, accumulate, islice*. \"Every one replaces a loop you would write badly,\" Quill says. \"Learn their names and you will write half as much code.\"",
 "The **`itertools`** module offers lazy building blocks:\n\n```\nfrom itertools import groupby, accumulate, islice, chain\n\naccumulate([1, 2, 3, 4])             # 1, 3, 6, 10   running total\nislice(items, 2)                     # the first 2 only (works on generators too)\nchain([1, 2], [3])                   # 1, 2, 3     glue iterables together\nfor key, group in groupby(sales, key=lambda s: s[0]):\n    ...                              # one group per run of equal keys\n```\n\n- **`groupby` only groups *neighbours*.** If equal keys are scattered, you get several groups for the same key. **Sort by the same key first.** This is the number-one `groupby` bug.\n- Each `group` is a one-shot iterator: use it (e.g. `sum(...)`) before moving to the next key.\n- `accumulate(values)` gives running totals; pass `func=max` for a running maximum.\n- `islice(iterable, n)` takes the first `n` items without building the whole list: perfect for huge or endless streams.\n- Most `itertools` functions return **iterators**: wrap in `list(...)` to see them.\n- Others worth knowing: `product` (all combinations), `permutations`, `combinations`, `zip_longest`, `pairwise` (Python 3.10+), `batched` (3.12+).\n- Related: `functools.reduce` and `functools.partial` fix some arguments of a function in advance.",
 "A kitchen of single-purpose gadgets: an apple corer and an egg slicer beat a knife for those jobs.",
 r'''from itertools import accumulate
print(list(accumulate([1, 2, 3, 4])))''',
 predict(r'''from itertools import islice
print(list(islice("abcdef", 2)))''', 'What prints?', ["['a', 'b']", "['a', 'b', 'c']", "['b', 'c']"], 0, 'islice takes the first 2 items of the sequence.'),
 dict(broken=r'''from itertools import groupby
words = ["apple", "banana", "avocado", "blueberry"]
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, len(list(group)))''', task='`groupby` only joins **neighbours**, so `a` and `b` each appear twice. Sort the words by the same key first so the output is `a 2` then `b 2`.',
  sol=r'''from itertools import groupby
words = ["apple", "banana", "avocado", "blueberry"]
words.sort(key=lambda w: w[0])
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, len(list(group)))''', extra=[('Sorts first', '".sort(" in src or "sorted(" in src')], wrong=[r'''print("a 2")
print("b 2")''']),
 dict(prompt='Ask `Sales: ` (words like `fruit:5 veg:3`). The list of `(category, amount)` pairs is built. Sort it by category, then print one line per category `<category> <total>` using `groupby`. Then print `Running: <running totals of the sorted amounts>` using `accumulate` and `First two: <the first two sorted amounts>` using `islice`.',
  starter=r'''from itertools import groupby, accumulate, islice

sales = []
for part in input("Sales: ").split():
    category, amount = part.split(":")
    sales.append((category, int(amount)))
''',
  cases=[dict(inputs=['fruit:5 veg:3 fruit:2 meat:9 veg:1'], name='Scattered categories'), dict(inputs=['a:1 b:2 c:3'], name='Already distinct'), dict(inputs=['x:10'], name='One sale'), dict(inputs=['b:4 a:4 b:4 a:4'], name='Alternating')],
  sol=s37,
  wrong=[('sales.sort(key=lambda s: s[0])\n', ''), ('list(accumulate(amounts))', 'list(amounts)'), ('islice(amounts, 2)', 'islice(amounts, 3)'), ('sum(amount for _, amount in group)', 'len(list(group))'), ('sales.sort(key=lambda s: s[0])', 'sales.sort(key=lambda s: s[1])'), ('amounts = [amount for _, amount in sales]', 'amounts = [amount for _, amount in sales][::-1]')],
  hints=['sales.sort(key=lambda s: s[0]) comes first, then groupby with the same key.', 'Inside the loop, sum(amount for _, amount in group) gives the category total.', 'amounts = [a for _, a in sales]; list(accumulate(amounts)); list(islice(amounts, 2)).']),
 dict(can=['Group, accumulate and slice data without hand-written loops', 'Avoid the sorted-keys trap of groupby'], expand='Use `itertools.chain.from_iterable` to flatten a list of lists, and `itertools.pairwise` to print the difference between neighbouring amounts.', where='Report builders and ETL pipelines are full of group-and-total steps.', next='Next: tests that invent their own examples.'),
 dict(title='itertools', body='groupby groups only neighbours: sort by the same key first. accumulate = running totals. islice = first n lazily. chain glues iterables. Results are iterators: wrap in list().', snip='data.sort(key=k)\nfor key, grp in groupby(data, key=k):\n    ...')))

# ---------------------------------------------------------------- 38 property testing
s38 = r'''import random

def good_sort(items):
    return sorted(items)

def buggy_sort(items):
    return sorted(set(items))

def lazy_sort(items):
    return items if len(items) > 4 else sorted(items)

def picky_sort(items):
    return items if items.count(3) >= 3 else sorted(items)

def find_counterexample(fn, trials):
    rng = random.Random(42)
    for _ in range(trials):
        items = [rng.randint(0, 4) for _ in range(rng.randint(0, 6))]
        if fn(list(items)) != sorted(items):
            return items
    return None

for fn in (good_sort, buggy_sort, lazy_sort, picky_sort):
    example = find_counterexample(fn, 300)
    if example is None:
        print(fn.__name__, "OK")
    else:
        print(fn.__name__, "FAILED", "reproduces:", fn(list(example)) != sorted(example))'''
L.append(lesson('r14-38', 38, 'Property tests: let the computer invent the examples', ['craft-fuzz'], ['craft-itertools'],
 "\"My sort passes all five tests I wrote!\" a junior boasts. Quill hands over a list with duplicates in it, and the sort quietly **deletes** them. \"You test the cases you *thought of*,\" the Archmage says. \"Bugs live in the cases you did not. So let the machine think up thousands.\"",
 "**Property-based testing** checks a *rule that must always hold* on many random inputs, instead of a few hand-picked examples.\n\nA rule for sorting: *for any list, `my_sort(items)` must equal `sorted(items)`*.\n\n```\ndef find_counterexample(fn, trials):\n    rng = random.Random(42)                       # a seeded generator: repeatable\n    for _ in range(trials):\n        items = [rng.randint(0, 4) for _ in range(rng.randint(0, 6))]\n        if fn(list(items)) != sorted(items):      # pass a COPY\n            return items                          # a counterexample!\n    return None\n```\n\n- **Seed the generator** (`random.Random(42)`) so any failure can be reproduced exactly.\n- Generate **small values** (`0..4`) so duplicates happen often, and **varied lengths** including empty lists: bugs hide at edges.\n- Pass `list(items)` (a copy) so a function that mutates its input can't corrupt your check.\n- Return the **first failing input**: a short, concrete example you can debug.\n- If random inputs miss a case (e.g. never long enough), the test is blind: choose the input ranges carefully.\n- The library **Hypothesis** does this professionally, including *shrinking* a failing example to the smallest one.\n- Other good properties: *reversing twice gives the original*, *encode then decode returns the input*, *the output length never exceeds the input length*.",
 "A crash-test lab: instead of one gentle push, throw hundreds of random bumps at the car and keep the first one that breaks it.",
 r'''import random
rng = random.Random(1)
print([rng.randint(0, 9) for _ in range(5)])''',
 predict(r'''import random
a = random.Random(7).randint(0, 100)
b = random.Random(7).randint(0, 100)
print(a == b)''', 'What prints?', ['True', 'False', '7'], 0, 'Two generators with the same seed produce the same numbers, which is what makes failures reproducible.'),
 dict(broken=r'''def my_sort(items):
    items.sort()
    return items

original = [3, 1, 2]
my_sort(original)
print(original)''', task='A property-test must not let the function change the original list. Pass a **copy** (`list(original)` or `original[:]`) so `original` stays `[3, 1, 2]`. Expected: `[3, 1, 2]`',
  sol=r'''def my_sort(items):
    items.sort()
    return items

original = [3, 1, 2]
my_sort(list(original))
print(original)''', extra=[('Passes a copy', '"list(original)" in src or "original[:]" in src')], wrong=[r'''print([3, 1, 2])''']),
 dict(prompt='Four sort functions are given: one correct, one that drops duplicates, one that gives up on long lists and one that fails only when the number 3 appears three or more times. Write `find_counterexample(fn, trials)`: use `random.Random(42)`; for each trial build a list of 0 to 6 random numbers from 0 to 4; call `fn` on a **copy**; if the result differs from `sorted(items)` return that list; after all trials return `None`.',
  starter=r'''import random

def good_sort(items):
    return sorted(items)

def buggy_sort(items):
    return sorted(set(items))

def lazy_sort(items):
    return items if len(items) > 4 else sorted(items)

def picky_sort(items):
    return items if items.count(3) >= 3 else sorted(items)

# write find_counterexample(fn, trials) here

for fn in (good_sort, buggy_sort, lazy_sort, picky_sort):
    example = find_counterexample(fn, 300)
    if example is None:
        print(fn.__name__, "OK")
    else:
        print(fn.__name__, "FAILED", "reproduces:", fn(list(example)) != sorted(example))''',
  cases=[dict(inputs=[], name='Finds the real bugs', extra=[('Returns None for a correct function', 'g["find_counterexample"](sorted, 50) is None'), ('Returns a failing list', 'g["find_counterexample"](lambda x: x, 200) is not None')])],
  sol=s38,
  wrong=[('        if fn(list(items)) != sorted(items):\n            return items', '        if fn(list(items)) == sorted(items):\n            return items'), ('rng.randint(0, 6)', 'rng.randint(0, 3)'), ('rng.randint(0, 4) for', 'rng.randint(0, 1000) for'), ('range(rng.randint(0, 6))', 'range(1)'), ('    return None\n\nfor fn', '    return []\n\nfor fn'), ('for _ in range(trials):', 'for _ in range(1):')],
  hints=['rng = random.Random(42), then loop trials times.', 'items = [rng.randint(0, 4) for _ in range(rng.randint(0, 6))]', 'if fn(list(items)) != sorted(items): return items. After the loop return None.']),
 dict(can=['Test a rule on hundreds of random inputs', 'Find bugs hand-written examples miss'], expand='Add a property that `len(fn(items)) == len(items)` and report which rule failed.', where='Compilers, databases and serialization libraries are tested this way because hand-written cases are never enough.', next='Next: objects that announce things to other objects.'),
 dict(title='Property tests', body='Check a rule on many seeded random inputs: random.Random(seed); small values and varied lengths (include empty) to hit edges; pass copies; return the first counterexample. Library: Hypothesis (with shrinking).', snip='rng = random.Random(42)\nif fn(list(items)) != sorted(items):\n    return items')))

# ---------------------------------------------------------------- 39 observer
s39 = r'''class EventBus:
    def __init__(self):
        self.handlers = {}

    def subscribe(self, topic, handler):
        self.handlers.setdefault(topic, []).append(handler)

    def unsubscribe(self, topic, handler):
        if handler in self.handlers.get(topic, []):
            self.handlers[topic].remove(handler)

    def publish(self, topic, message):
        for handler in list(self.handlers.get(topic, [])):
            try:
                handler(message)
            except Exception as e:
                print(f"handler error: {e}")

def make_listener(name):
    def listener(message):
        if message == "bad":
            raise ValueError(f"{name} dislikes {message}")
        print(f"{name} got: {message}")
    return listener

bus = EventBus()
listeners = {}
while True:
    line = input("> ")
    if line == "quit":
        break
    command, *args = line.split()
    if command == "sub":
        name, topic = args
        listener = listeners.setdefault(name, make_listener(name))
        bus.subscribe(topic, listener)
    elif command == "unsub":
        name, topic = args
        bus.unsubscribe(topic, listeners.setdefault(name, make_listener(name)))
    elif command == "pub":
        bus.publish(args[0], " ".join(args[1:]))'''
L.append(lesson('r14-39', 39, 'The observer pattern: an event bus', ['craft-observer'], ['craft-fuzz'],
 "A town crier stands on the Guild steps. He does not know who is listening and he does not care: whoever *subscribed* to \"news\" hears the news. \"That is the **observer pattern**,\" Quill says, \"and it lets big programs stay loosely tied together.\"",
 "An **event bus** lets parts of a program talk without knowing about each other:\n\n```\nclass EventBus:\n    def __init__(self):\n        self.handlers = {}                       # topic -> list of functions\n    def subscribe(self, topic, handler):\n        self.handlers.setdefault(topic, []).append(handler)\n    def publish(self, topic, message):\n        for handler in list(self.handlers.get(topic, [])):\n            try:\n                handler(message)\n            except Exception as e:\n                print(f\"handler error: {e}\")   # one bad listener must not stop the rest\n```\n\n- **Publishers** announce; **subscribers** react. Neither imports the other: you can add a new listener without touching the sender.\n- Functions are values: store them in lists and call them later.\n- `dict.setdefault(key, [])` returns the existing list or creates an empty one: no `if key not in` needed.\n- `self.handlers.get(topic, [])` avoids a `KeyError` when nobody subscribed.\n- **Iterate over a copy** (`list(...)`) so a handler that unsubscribes itself during the loop can't skip others.\n- **Isolate failures**: one listener raising an error must not stop the remaining listeners or crash the publisher.\n- Real uses: GUI clicks, game events, webhooks, `Django` signals, and message brokers such as Kafka or RabbitMQ.",
 "A radio station: it broadcasts on a frequency, and anyone tuned in hears it, without the station knowing who they are.",
 r'''handlers = []
handlers.append(lambda m: print("A:", m))
handlers.append(lambda m: print("B:", m))
for h in handlers:
    h("hi")''',
 predict(r'''d = {}
d.setdefault("x", []).append(1)
d.setdefault("x", []).append(2)
print(d["x"])''', 'What prints?', ['[1, 2]', '[2]', '[1]'], 0, 'setdefault returns the existing list the second time, so both values land in the same list.'),
 dict(broken=r'''handlers = {"news": [print]}
for h in handlers["sport"]:
    h("goal")
print("done")''', task='Nobody subscribed to `sport`, so `handlers["sport"]` raises `KeyError`. Use `.get` with an empty list as the fallback so the loop simply does nothing. Expected: `done`',
  sol=r'''handlers = {"news": [print]}
for h in handlers.get("sport", []):
    h("goal")
print("done")''', extra=[('Uses get', '".get(" in src')], wrong=[r'''print("done")''']),
 dict(prompt='Commands (until `quit`): `sub <name> <topic>`, `unsub <name> <topic>`, `pub <topic> <message words>`. A subscriber prints `<name> got: <message>`, except that the message `bad` makes it raise an error. Write the class `EventBus` with `subscribe(topic, handler)`, `unsubscribe(topic, handler)` (ignore handlers that are not subscribed) and `publish(topic, message)`: call every subscriber of the topic in subscription order; if one raises, print `handler error: <error text>` and **continue** with the others. Publishing to a topic nobody listens to does nothing.',
  starter=r'''# write the EventBus class here

def make_listener(name):
    def listener(message):
        if message == "bad":
            raise ValueError(f"{name} dislikes {message}")
        print(f"{name} got: {message}")
    return listener

bus = EventBus()
listeners = {}
while True:
    line = input("> ")
    if line == "quit":
        break
    command, *args = line.split()
    if command == "sub":
        name, topic = args
        listener = listeners.setdefault(name, make_listener(name))
        bus.subscribe(topic, listener)
    elif command == "unsub":
        name, topic = args
        bus.unsubscribe(topic, listeners.setdefault(name, make_listener(name)))
    elif command == "pub":
        bus.publish(args[0], " ".join(args[1:]))''',
  cases=[dict(inputs=['sub ann news', 'sub bob news', 'pub news hello world', 'pub sport goal', 'unsub ann news', 'pub news again', 'quit'], name='Subscribe, publish, unsubscribe'), dict(inputs=['sub ann news', 'sub bob news', 'sub cy news', 'pub news bad', 'pub news ok', 'quit'], name='Everyone fails, nobody blocks the rest'), dict(inputs=['unsub ann news', 'pub news hi', 'sub ann a', 'sub ann b', 'pub a one', 'pub b two', 'quit'], name='Unsubscribing a stranger'), dict(inputs=['sub ann x', 'sub ann x', 'pub x twice', 'quit'], name='Subscribed twice'), dict(inputs=['quit'], name='Nothing')],
  sol=s39,
  wrong=[('self.handlers.setdefault(topic, []).append(handler)', 'self.handlers[topic] = [handler]'), ('            self.handlers[topic].remove(handler)', '            self.handlers[topic].clear()'), ('        if handler in self.handlers.get(topic, []):\n            self.handlers[topic].remove(handler)', '        self.handlers[topic].remove(handler)'), ('            try:\n                handler(message)\n            except Exception as e:\n                print(f"handler error: {e}")', '            handler(message)'), ('for handler in list(self.handlers.get(topic, [])):', 'for handler in self.handlers[topic]:'), ('for handler in list(self.handlers.get(topic, [])):', 'for handler in reversed(self.handlers.get(topic, [])):')],
  hints=['self.handlers = {} maps topic -> list of functions. subscribe: setdefault(topic, []).append(handler).', 'unsubscribe: only remove if handler is in the topic list (use .get(topic, [])).', 'publish: loop over list(self.handlers.get(topic, [])) and wrap each call in try/except Exception as e: print(f"handler error: {e}").']),
 dict(can=['Decouple code with publish/subscribe', 'Keep one failing listener from breaking the rest'], expand='Support wildcard topics so `subscribe("news.*", ...)` receives `news.sport` and `news.world`.', where='GUI frameworks, game engines, webhooks and message queues are all event buses at heart.', next='Mission time: a task tracker that ties the Craft Guild together.'),
 dict(title='Event bus', body='handlers = {topic: [functions]}; subscribe via setdefault(...).append; publish over list(handlers.get(topic, [])) in try/except so one failure does not stop others; unsubscribe only if present.', snip='for handler in list(self.handlers.get(topic, [])):\n    try:\n        handler(message)\n    except Exception as e:\n        print(f"handler error: {e}")')))

# ---------------------------------------------------------------- 40 mission
TASKS_JSON = json.dumps([
    {"id": 1, "title": "write report", "priority": "HIGH", "done": False},
    {"id": 2, "title": "buy milk", "priority": "LOW", "done": True},
    {"id": 7, "title": "call mum", "priority": "MEDIUM", "done": False},
], indent=2)
s40 = r'''import json
from dataclasses import dataclass
from enum import Enum

class Priority(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3

@dataclass
class Task:
    id: int
    title: str
    priority: Priority
    done: bool = False

def load(path):
    with open(path) as f:
        raw = json.load(f)
    return [Task(t["id"], t["title"], Priority[t["priority"]], t["done"]) for t in raw]

def save(path, tasks):
    raw = [{"id": t.id, "title": t.title, "priority": t.priority.name, "done": t.done} for t in tasks]
    with open(path, "w") as f:
        json.dump(raw, f, indent=2)

def handle(tasks, command):
    match command.split():
        case ["add", level, *words] if words and level.upper() in Priority.__members__:
            task = Task(max((t.id for t in tasks), default=0) + 1, " ".join(words), Priority[level.upper()])
            tasks.append(task)
            return f"Added #{task.id}: {task.title}"
        case ["done", number] if number.isdigit():
            for task in tasks:
                if task.id == int(number):
                    task.done = True
                    return f"Done #{task.id}"
            return f"No task #{number}"
        case ["list"]:
            ordered = sorted(tasks, key=lambda t: (t.done, -t.priority.value, t.id))
            lines = [f"{'x' if t.done else ' '} #{t.id} [{t.priority.name}] {t.title}" for t in ordered]
            return "\n".join(lines) or "No tasks"
        case ["stats"]:
            finished = sum(t.done for t in tasks)
            return f"{finished}/{len(tasks)} done"
        case _:
            return "Unknown command"

tasks = load("tasks.json")
while True:
    line = input("> ")
    if line == "quit":
        break
    print(handle(tasks, line))
save("tasks.json", tasks)
print(open("tasks.json").read())'''
st40 = s40[:s40.index('def load')] + '''# write load(path), save(path, tasks) and handle(tasks, command) here

tasks = load("tasks.json")
while True:
    line = input("> ")
    if line == "quit":
        break
    print(handle(tasks, line))
save("tasks.json", tasks)
print(open("tasks.json").read())'''
L.append(lesson('r14-40', 40, 'Real-World Mission: The Task Tracker Core', ['mission14d'], ['craft-observer'],
 "The Craft Guild's master hands you a worn wooden board covered in sticky notes. \"Every developer builds a task tracker once,\" she says. \"Do it properly: data classes, enums, `match` for commands, JSON on disk. When you finish, you will have written the core of a real product.\"",
 "This mission combines the Craft Guild's tools into one small application:\n\n- A **`Priority` enum** and a **`Task` dataclass** model the data.\n- **`load`** reads `tasks.json` and converts each record into a `Task` (the priority name becomes an enum member with `Priority[\"HIGH\"]`).\n- **`save`** writes the tasks back as JSON: convert enums to their **names** (`t.priority.name`) because JSON cannot store an enum; use `json.dump(raw, f, indent=2)`.\n- **`handle`** uses **`match`** on `command.split()`:\n\n```\nmatch command.split():\n    case [\"add\", level, *words] if words and level.upper() in Priority.__members__:\n        ...\n    case [\"done\", number] if number.isdigit():\n        ...\n    case [\"list\"]:\n        ...\n    case _:\n        return \"Unknown command\"\n```\n\n- A pattern like `[\"add\", level, *words]` matches a list that starts with `add` and captures the rest. The **`if` guard** adds extra conditions.\n- New ids come from `max(ids, default=0) + 1` (never reused, even after completing tasks).\n- Sort for display with a key tuple: unfinished first (`t.done` is `False` < `True`), then highest priority (`-t.priority.value`), then id.\n- `Priority.__members__` is a dict of names, so `\"HIGH\" in Priority.__members__` validates user input.\n- Finish by saving: data you don't write down is lost.",
 "A tidy desk: a labelled box for every kind of note, rules for adding and ticking them off, and a filing cabinet at night.",
 r'''from enum import Enum
class P(Enum):
    LOW = 1
    HIGH = 3
print(P["HIGH"].value, "LOW" in P.__members__, "MID" in P.__members__)''',
 predict(r'''match "add milk now".split():
    case ["add", *words]:
        print(" ".join(words))''', 'What prints?', ['milk now', 'add milk now', "['milk', 'now']"], 0, '*words captures everything after "add" as a list, and join glues it back into text.'),
 dict(broken=r'''tasks = [{"id": 1}, {"id": 5}]
new_id = len(tasks) + 1
print("Next id:", new_id)''', task='Ids must keep growing even if tasks were deleted: the next id is **one more than the biggest id**, not the list length. Fix it. Expected: `Next id: 6`',
  sol=r'''tasks = [{"id": 1}, {"id": 5}]
new_id = max((t["id"] for t in tasks), default=0) + 1
print("Next id:", new_id)''', extra=[('Uses max', '"max(" in src')], wrong=[r'''print("Next id: 6")''']),
 dict(prompt='`tasks.json` holds a list of tasks `{"id", "title", "priority", "done"}`. `Priority` (LOW, MEDIUM, HIGH) and the `Task` dataclass are given. Write `load(path)` (a list of `Task`), `save(path, tasks)` (JSON with `indent=2`, keys in the order id, title, priority NAME, done) and `handle(tasks, command)` using `match`: `add <priority> <title words>` -> `Added #<id>: <title>` (new id = highest id + 1; priority in any case; bad priority or no title -> `Unknown command`); `done <number>` -> `Done #<id>` or `No task #<number>`; `list` -> one line per task: `x`/space, `#id`, `[PRIORITY]`, title, sorted unfinished first, then by priority high to low, then id (`No tasks` if empty); `stats` -> `<finished>/<total> done`; anything else -> `Unknown command`. The command loop is given.',
  starter=st40.replace('def load', 'def load') if False else s40[:s40.index('def load')].rstrip('\n') + '''

# write load(path), save(path, tasks) and handle(tasks, command) here

tasks = load("tasks.json")
while True:
    line = input("> ")
    if line == "quit":
        break
    print(handle(tasks, line))
save("tasks.json", tasks)
print(open("tasks.json").read())''',
  files={'tasks.json': TASKS_JSON},
  cases=[dict(inputs=['list', 'add high ship stage nine', 'add urgent nonsense', 'add low', 'done 1', 'done 9', 'done x', 'stats', 'list', 'dance', 'quit'], name='Full tour'), dict(inputs=['stats', 'quit'], name='Stats only'), dict(inputs=['add MEDIUM water plants', 'add Low read a book', 'list', 'quit'], name='Case and ordering'), dict(inputs=['done 2', 'done 7', 'list', 'stats', 'quit'], name='Finish things'), dict(inputs=['quit'], name='Saved file unchanged')],
  sol=s40,
  wrong=[('max((t.id for t in tasks), default=0) + 1', 'len(tasks) + 1'), ('key=lambda t: (t.done, -t.priority.value, t.id)', 'key=lambda t: (t.done, t.priority.value, t.id)'), ('key=lambda t: (t.done, -t.priority.value, t.id)', 'key=lambda t: (-t.priority.value, t.id)'), ('"priority": t.priority.name', '"priority": t.priority.value'), ('json.dump(raw, f, indent=2)', 'json.dump(raw, f)'), ('and level.upper() in Priority.__members__', ''), ('case ["done", number] if number.isdigit():', 'case ["done", number]:'), ('finished = sum(t.done for t in tasks)', 'finished = len(tasks)'), ('Priority[level.upper()])\n            tasks.append(task)', 'Priority[level])\n            tasks.append(task)')],
  hints=['load: Task(t["id"], t["title"], Priority[t["priority"]], t["done"]) for each record in the JSON list.', 'save: build dicts with priority as t.priority.name and dump them with indent=2.', 'handle: match command.split() with one case per command; use guards for add/done and finish with case _.']),
 dict(can=['Combine dataclasses, enums, match and JSON into a real tool', 'Design a command interpreter with guards'], expand='Add `undo` (remember the last change) using the `transaction` idea, and `remove <id>`.', where='Todo apps, ticket systems and command-line tools you build next will look just like this core.', next='Final challenge: the Four Doors boss.'),
 dict(title='Task tracker core', body='Enum for choices, dataclass for records, JSON load/save (enum -> name), match on command.split() with guards and a catch-all, new id = max + 1, sort with a key tuple.', snip='match command.split():\n    case ["done", number] if number.isdigit():\n        ...')))

if __name__ == '__main__':
    emit('realm_14d.js', 'REALM 14 - THE HALL OF FOUR DOORS - part D (lessons 31-40: Craft Guild). Generated by tools/spec14d.py', L)
