// REALM 13 — THE INTERVIEW ARENA — part D (lessons 26-33: clean architecture)
{
const eqP = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);

// ---- 26 single responsibility
const s26 = R`def parse(line):
    parts = line.split(",")
    if len(parts) != 2:
        return None
    name, raw = parts[0].strip(), parts[1].strip()
    if not name or not raw.isdigit() or int(raw) > 100:
        return None
    return name, int(raw)


def grade(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    return "F"


def render(name, score):
    return f"{name}: {score} ({grade(score)})"


while True:
    line = input("Line: ")
    if not line:
        break
    result = parse(line)
    print("Invalid line" if result is None else render(*result))`;
const st26 = R`def parse(line):
    # return (name, score) or None when the line is not "name,score" (score 0-100)
    pass


def grade(score):
    # 90+ A, 80+ B, 70+ C, otherwise F
    pass


def render(name, score):
    pass


while True:
    line = input("Line: ")
    if not line:
        break
    result = parse(line)
    print("Invalid line" if result is None else render(*result))`;
const sess26 = ['Ada,95','Bo, 80','Cy,69','x','Dee,101',',50','Fay,7,8','Gus,abc','Hal,70','Ivy,90','Jo,79',''];
const out26 = ['Ada: 95 (A)','Bo: 80 (B)','Cy: 69 (F)','Invalid line','Invalid line','Invalid line','Invalid line','Invalid line','Hal: 70 (C)','Ivy: 90 (A)','Jo: 79 (C)'];
const e26 = R`# one job per function: parse, decide, display
def parse(line):
    name, raw = line.split(",")
    return name.strip(), int(raw)

def grade(score):
    return "pass" if score >= 50 else "fail"

def render(name, score):
    return f"{name}: {score} ({grade(score)})"

print(render(*parse("Ada, 72")))
print(grade(10), grade(50))
# each function can be tested alone, reused elsewhere, and changed without touching the rest`;

// ---- 27 modules
const shapes27 = R`def area(width, height):
    return width * height


def perimeter(width, height):
    return 2 * (width + height)


if __name__ == "__main__":
    print("self-test:", area(2, 3))
`;
const s27 = R`import shapes

width = int(input("Width: "))
height = int(input("Height: "))
print("Area:", shapes.area(width, height))
print("Perimeter:", shapes.perimeter(width, height))`;
const e27 = R`import math, os.path                  # standard-library modules
from collections import Counter      # import just one name
import json as js                    # give a module a shorter name

print(math.sqrt(16), os.path.basename("a/b/c.txt"))
print(Counter("aab").most_common(1), js.dumps({"ok": True}))
print(__name__)                      # "__main__" when this file is the one being run
if __name__ == "__main__":
    print("running directly")        # skipped when another file IMPORTS this one
# your own file helpers.py becomes a module: import helpers`;

// ---- 28 layers
const st28 = R`class Repo:
    # storage only: get(name) -> balance or None, save(name, balance)
    pass


class Service:
    # business rules only: open(name), deposit(name, amount), balance(name)
    pass


`;
const ui28 = R`service = Service(Repo())
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    try:
        if parts[0] == "open" and len(parts) == 2:
            service.open(parts[1])
            print("Opened", parts[1])
        elif parts[0] == "deposit" and len(parts) == 3:
            print("Balance:", service.deposit(parts[1], int(parts[2])))
        elif parts[0] == "balance" and len(parts) == 2:
            print("Balance:", service.balance(parts[1]))
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`;
const c28 = R`class Repo:
    def __init__(self):
        self.accounts = {}

    def get(self, name):
        return self.accounts.get(name)

    def save(self, name, balance):
        self.accounts[name] = balance


class Service:
    def __init__(self, repo):
        self.repo = repo

    def open(self, name):
        if self.repo.get(name) is not None:
            raise ValueError("Account exists")
        self.repo.save(name, 0)

    def deposit(self, name, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        balance = self.repo.get(name)
        if balance is None:
            raise ValueError("No such account")
        self.repo.save(name, balance + amount)
        return balance + amount

    def balance(self, name):
        balance = self.repo.get(name)
        if balance is None:
            raise ValueError("No such account")
        return balance


`;
const sess28 = ['open ann','open ann','deposit ann 50','deposit ann -5','deposit ghost 10','balance ann','balance ghost','open bob','deposit bob 0','deposit ann 25','balance ann','dance','quit'];
const out28 = ['Opened ann','Error: Account exists','Balance: 50','Error: Amount must be positive','Error: No such account','Balance: 50','Error: No such account','Opened bob','Error: Amount must be positive','Balance: 75','Balance: 75','Unknown command'];
const e28 = R`class Repo:                              # layer 1: where data lives
    def __init__(self):
        self.items = {}
    def get(self, key):
        return self.items.get(key)
    def save(self, key, value):
        self.items[key] = value

class Service:                           # layer 2: the rules (knows nothing about print or input)
    def __init__(self, repo):
        self.repo = repo
    def rename(self, key, new):
        if self.repo.get(key) is None:
            raise ValueError("No such item")
        self.repo.save(new, self.repo.get(key))

def main():                              # layer 3: talks to the user
    service = Service(Repo())
    service.repo.save("a", 1)
    try:
        service.rename("zzz", "b")
    except ValueError as error:
        print("Error:", error)
    service.rename("a", "b")
    print(service.repo.get("b"))

main()`;

// ---- 29 dependency injection
const hd29 = R`PRICES = {"apple": 3, "bread": 5, "milk": 4}


class Checkout:
    # __init__(self, price_of, discount_percent=0)
    # total(items): add up price_of(item) for each item, raise ValueError("Unknown item: x")
    # when price_of gives None, then take discount_percent off the WHOLE total
    # (use whole-number maths: total * (100 - discount_percent) // 100)
    pass


`;
const pr29 = R`PRICES = {"apple": 3, "bread": 5, "milk": 4}


`;
const hn29 = R`items = input("Items: ").split()
discount = int(input("Discount: "))
checkout = Checkout(PRICES.get, discount)
try:
    print("Total:", checkout.total(items))
except ValueError as error:
    print("Error:", error)`;
const c29 = R`class Checkout:
    def __init__(self, price_of, discount_percent=0):
        self.price_of = price_of
        self.discount_percent = discount_percent

    def total(self, items):
        total = 0
        for item in items:
            price = self.price_of(item)
            if price is None:
                raise ValueError(f"Unknown item: {item}")
            total += price
        return total * (100 - self.discount_percent) // 100


`;
const e29 = R`class Greeter:
    def __init__(self, get_name):         # the dependency is PASSED IN, not hard-wired
        self.get_name = get_name
    def hello(self):
        return "Hello, " + self.get_name()

print(Greeter(lambda: "Ada").hello())     # a real source
print(Greeter(lambda: "TestUser").hello())    # a fake one for testing: no input() needed
def make_greeter(source):
    return Greeter(source)
print(make_greeter(lambda: "Bo").hello())
# a class that creates its own database / clock / input can never be tested in isolation`;

// ---- 30 tests
const hd30 = R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


def check(name, func, args, expected):
    # call func(*args); return "PASS name", or "FAIL name: expected X, got Y",
    # or "ERROR name: ExceptionName" when the call raises
    pass


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
`;
const hn30 = R`results = [check(*case) for case in tests]
for line in results:
    print(line)
passed = sum(1 for line in results if line.startswith("PASS"))
print(f"Summary: {passed} passed, {len(results) - passed} failed")`;
const c30 = R`def check(name, func, args, expected):
    try:
        got = func(*args)
    except Exception as error:
        return f"ERROR {name}: {type(error).__name__}"
    if got == expected:
        return f"PASS {name}"
    return f"FAIL {name}: expected {expected}, got {got}"


`;
const e30 = R`def double(n):
    return n * 2

assert double(4) == 8                    # silent when true
try:
    assert double(2) == 5, "double(2) should be 4"
except AssertionError as error:
    print("caught:", error)             # raises AssertionError when false
tests = [(1, 2), (5, 10), (0, 0), (-3, -6)]
for given, expected in tests:
    status = "PASS" if double(given) == expected else "FAIL"
    print(status, given)
# test the normal case, the boundaries (0, empty, negative) and the failures`;

// ---- 31 refactor
const s31 = R`RATES = {"local": 5, "national": 9, "world": 20}


def shipping_cost(weight, zone, express=False):
    if zone not in RATES:
        raise ValueError("Unknown zone")
    cost = RATES[zone] + 2 * max(0, weight - 1)
    return cost * 2 if express else cost


weight = int(input("Weight: "))
zone = input("Zone: ").strip()
express = input("Express: ").strip() == "yes"
try:
    print("Cost:", shipping_cost(weight, zone, express))
except ValueError as error:
    print("Error:", error)`;
const hd31 = R`def shipping_cost(weight, zone, express=False):
    # base rate: local 5, national 9, world 20.
    # plus 2 for every kilo beyond the first. Express doubles the total.
    # an unknown zone raises ValueError("Unknown zone")
    pass


weight = int(input("Weight: "))
zone = input("Zone: ").strip()
express = input("Express: ").strip() == "yes"
try:
    print("Cost:", shipping_cost(weight, zone, express))
except ValueError as error:
    print("Error:", error)`;
const e31 = R`# BEFORE: copy-pasted branches, magic numbers
def price_before(kind, qty):
    if kind == "small":
        return qty * 3
    elif kind == "medium":
        return qty * 5
    elif kind == "large":
        return qty * 8
    return 0

# AFTER: the data is separated from the logic
UNIT_PRICE = {"small": 3, "medium": 5, "large": 8}

def price_after(kind, qty):
    return qty * UNIT_PRICE.get(kind, 0)

for kind in ["small", "large", "huge"]:
    assert price_before(kind, 4) == price_after(kind, 4)
print("same answers:", price_after("large", 4))
# refactoring changes the SHAPE of code, never the BEHAVIOUR`;
const shipCheck = R`all(g["shipping_cost"](w, z, e) == ({"local": 5, "national": 9, "world": 20}[z] + 2 * max(0, w - 1)) * (2 if e else 1) for w in range(0, 12) for z in ("local", "national", "world") for e in (True, False))`;

// ---- 32 exceptions
const st32 = R`stock = {"tea": [3, 2], "cola": [5, 1], "gum": [2, 0]}    # item: [price, how many left]


class AppError(Exception):
    pass


# write UnknownItem and OutOfStock (both AppError) and NotEnoughMoney (AppError with a .short attribute)

class Vending:
    # __init__(stock), buy(item, money) -> change
    # checks in this order: unknown item, sold out, not enough money. Stock drops only on success.
    pass


`;
const hn32 = R`machine = Vending(stock)
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "buy" and len(parts) == 3:
        try:
            print("Enjoy", parts[1], "- change", machine.buy(parts[1], int(parts[2])))
        except NotEnoughMoney as error:
            print("Need", error.short, "more")
        except AppError as error:
            print("Error:", error)
    else:
        print("Unknown command")`;
const c32 = R`stock = {"tea": [3, 2], "cola": [5, 1], "gum": [2, 0]}    # item: [price, how many left]


class AppError(Exception):
    pass


class UnknownItem(AppError):
    pass


class OutOfStock(AppError):
    pass


class NotEnoughMoney(AppError):
    def __init__(self, short):
        super().__init__(f"Need {short} more")
        self.short = short


class Vending:
    def __init__(self, stock):
        self.stock = stock

    def buy(self, item, money):
        if item not in self.stock:
            raise UnknownItem("Unknown item")
        price, left = self.stock[item]
        if left == 0:
            raise OutOfStock("Sold out")
        if money < price:
            raise NotEnoughMoney(price - money)
        self.stock[item][1] -= 1
        return money - price


`;
const sess32 = ['buy tea 5','buy tea 3','buy tea 3','buy cola 4','buy gum 9','buy beer 1','buy cola 5','quit'];
const out32 = ['Enjoy tea - change 2','Enjoy tea - change 0','Error: Sold out','Need 1 more','Error: Sold out','Error: Unknown item','Enjoy cola - change 0'];
const e32 = R`class AppError(Exception):                 # one base class for everything YOUR app raises
    pass

class OutOfCoffee(AppError):
    pass

class TooHot(AppError):
    def __init__(self, degrees):
        super().__init__(f"{degrees} degrees is too hot")
        self.degrees = degrees        # carry useful data on the exception

for problem in [OutOfCoffee("empty"), TooHot(99)]:
    try:
        raise problem
    except TooHot as error:           # catch the specific one first
        print("hot:", error.degrees)
    except AppError as error:         # then the general family
        print("app error:", error)
print(issubclass(TooHot, AppError), issubclass(TooHot, Exception))`;

// ---- 33 mission
const st33 = R`class Storage:
    # holds name -> quantity. get(name) gives 0 when unknown, set(name, qty) removes the item when qty is 0, all() gives a dict copy
    pass


class Inventory:
    # __init__(storage); add(name, qty) -> new quantity; remove(name, qty) -> quantity left
    # report() -> sorted list of "name: qty"; low(limit) -> sorted names with qty below limit
    # ValueError messages: "Quantity must be positive", "No such item", "Only <n> in stock"
    pass


`;
const hn33 = R`inventory = Inventory(Storage())
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    try:
        if parts[0] == "add" and len(parts) == 3:
            print("Stock:", inventory.add(parts[1], int(parts[2])))
        elif parts[0] == "remove" and len(parts) == 3:
            print("Stock:", inventory.remove(parts[1], int(parts[2])))
        elif parts[0] == "report":
            print("; ".join(inventory.report()) or "(empty)")
        elif parts[0] == "low" and len(parts) == 2:
            print(", ".join(inventory.low(int(parts[1]))) or "none")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`;
const c33 = R`class Storage:
    def __init__(self):
        self.items = {}

    def get(self, name):
        return self.items.get(name, 0)

    def set(self, name, qty):
        if qty == 0:
            self.items.pop(name, None)
        else:
            self.items[name] = qty

    def all(self):
        return dict(self.items)


class Inventory:
    def __init__(self, storage):
        self.storage = storage

    def add(self, name, qty):
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        total = self.storage.get(name) + qty
        self.storage.set(name, total)
        return total

    def remove(self, name, qty):
        if qty <= 0:
            raise ValueError("Quantity must be positive")
        have = self.storage.get(name)
        if have == 0:
            raise ValueError("No such item")
        if qty > have:
            raise ValueError(f"Only {have} in stock")
        self.storage.set(name, have - qty)
        return have - qty

    def report(self):
        return [f"{name}: {qty}" for name, qty in sorted(self.storage.all().items())]

    def low(self, limit):
        return sorted(name for name, qty in self.storage.all().items() if qty < limit)


`;
const sess33 = ['add bolt 10','add nut 3','add bolt 5','remove nut 3','remove nut 1','remove bolt 20','remove bolt 4','add gear 0','add gear 2','report','low 12','low 5','low 1','dance','quit'];
const out33 = ['Stock: 10','Stock: 3','Stock: 15','Stock: 0','Error: No such item','Error: Only 15 in stock','Stock: 11','Error: Quantity must be positive','Stock: 2','bolt: 11; gear: 2','bolt, gear','gear','none','Unknown command'];
const e33 = R`# the shape of every real application, in miniature
class Storage:
    def __init__(self):
        self.items = {}

class Service:
    def __init__(self, storage):          # dependency injected
        self.storage = storage
    def add(self, name, qty):
        if qty <= 0:
            raise ValueError("Quantity must be positive")   # rules live here
        self.storage.items[name] = self.storage.items.get(name, 0) + qty

def ui(service, commands):                # the only layer that prints
    for name, qty in commands:
        try:
            service.add(name, qty)
            print("ok", name)
        except ValueError as error:
            print("error:", error)

ui(Service(Storage()), [("bolt", 3), ("nut", 0)])`;

LESSONS.push(
{
  id:'r13-26', realm:13, n:26, title:'One job per function: separation of concerns',
  teaches:['arch-srp'], requires:['mission13c'],
  story:`Quill shows you a single enormous spell scroll: it reads the input, checks it, grades it and decorates the answer, all in one tangle. "When the grading rules change, you must wade through the printing code," Quill says. "Cut it into small spells that each do **one job**."`,
  concept:{
    html:`**Single responsibility**: each function (or class) should have **one reason to change**.\n\nA tangled script mixes three jobs:\n- **parse**: turn raw text into clean data (or say it is invalid)\n- **decide**: apply the rules (is this an A?)\n- **render**: turn the result into text for the user\n\n\`\`\`\ndef parse(line): ...            # returns (name, score) or None\ndef grade(score): ...           # pure rule, no printing\ndef render(name, score): ...    # builds a string, returns it\n\`\`\`\n\n- Functions that **return** values are easy to test and reuse. Functions that \`print\` are not.\n- Let one small piece, the loop at the bottom, do the \`input\` and \`print\`. Everything else stays **pure**.\n- **Return \`None\`** (or raise) for invalid input rather than guessing.\n- Name functions with **verbs**: \`parse\`, \`grade\`, \`render\`.\n- Boundaries matter: 90 is an A, 89 is not. Test the edges.\n- Smaller pieces mean smaller bugs: when "Ivy: 90 (B)" appears you know it is in \`grade\`, not in the parsing.`,
    analogy:`A kitchen with stations: one chef chops, one cooks, one plates, so you can fix one without upsetting the others.`,
    example:e26},
  predict:{code:R`def f(x):
    x * 2

print(f(4))`, q:'What prints?', opts:['None','8','4'], ans:0, why:'The function calculates x * 2 but never returns it, so the call gives None.'},
  cast:{code:e26, task:'Cast it.'},
  bug:{broken:R`def double(n):
    print(n * 2)

result = double(4)
print(result + 1)`, task:'double prints instead of returning, so result is None and result + 1 crashes. Return the value. Expected: 9',
    cases:[{inputs:[],tests:[['Works','lines==["9"]'],['Returns','"return" in src']]}],
    sol:R`def double(n):
    return n * 2

result = double(4)
print(result + 1)`, wrong:[R`print(9)`]},
  write:{prompt:'Finish the three functions. `parse(line)` returns `(name, score)` for lines like `Ada, 95` (exactly one comma, a non-empty name, a whole-number score from 0 to 100, spaces around parts ignored) otherwise `None`. `grade(score)`: 90+ `A`, 80+ `B`, 70+ `C`, else `F`. `render(name, score)` returns `Ada: 95 (A)`. The loop at the bottom is given.',
    starter:st26,
    inputs:['Ada,95',''],
    cases:[{inputs:sess26,tests:[['Whole session',eqP(out26,'Line: ')],['Grade edges','g["grade"](89)=="B" and g["grade"](90)=="A" and g["grade"](69)=="F" and g["grade"](70)=="C"'],['parse returns data','g["parse"]("a,5")==("a",5) and g["parse"]("x") is None'],['render returns text','g["render"]("Z",70)=="Z: 70 (C)"']]},{inputs:['Zed , 100',''],tests:[['Top score and spaces',eqP(['Zed: 100 (A)'],'Line: ')]]},{inputs:['Q,0',''],tests:[['Zero is valid',eqP(['Q: 0 (F)'],'Line: ')]]}],
    sol:s26,
    wrong:[s26.replace('score >= 90','score > 90'),s26.replace(' or int(raw) > 100',''),s26.replace('parts[0].strip(), parts[1].strip()','parts[0], parts[1]'),s26.replace('return f"{name}: {score} ({grade(score)})"','return f"{name}: {score}"'),s26.replace('if not name or ','if ')],
    hints:['parse splits on "," and checks there are exactly two parts, a non-empty name and a digit score no bigger than 100.','grade is a simple chain of if / return from 90 down.','render returns an f-string; do not print inside it.',s26]},
  power:{can:['Split a script into parse, decide and render','Return values instead of printing inside logic'],
    expand:'Add a `summary(results)` function that returns the average score as text.',
    where:'Every maintainable codebase is made of small single-purpose functions.',
    next:'Next: modules, splitting code across files.'},
  codex:{title:'Single responsibility',body:'One reason to change per function. parse (raw -> data or None), decide (pure rules), render (data -> string). Return values; only the outermost loop prints/inputs. Verb names. Test the boundary values.',snip:R`def render(name, score):
    return f"{name}: {score} ({grade(score)})"`}
},
{
  id:'r13-27', realm:13, n:27, title:'Modules and the __main__ guard',
  teaches:['arch-modules'], requires:['arch-srp'],
  story:`The Arena library has a rule: no scroll may be longer than a page. Big spells are split across several scrolls, and a spell calls another by name. "That is a **module**," Quill says. "A file of tools that other files borrow."`,
  concept:{
    html:`Any \`.py\` file is a **module**. Another file borrows from it with \`import\`:\n\n\`\`\`\n# shapes.py\ndef area(w, h):\n    return w * h\n\n# main.py\nimport shapes\nprint(shapes.area(2, 3))\n# or:  from shapes import area\n\`\`\`\n\n- **Standard library** modules (\`math\`, \`json\`, \`collections\`) and **your own files** import the same way; Python searches the current folder first.\n- \`import x as y\` gives it a shorter name.\n- When a file is **run directly**, \`__name__\` is \`"__main__"\`. When it is **imported**, \`__name__\` is the module's name.\n- So a module can hold a demo or self-test that does not run on import:\n\n\`\`\`\nif __name__ == "__main__":\n    print("self-test:", area(2, 3))\n\`\`\`\n\n- Importing runs the module's top-level code **once**.\n- Keep modules **focused** (shapes, storage, report) and import only what you need.\n- Avoid **circular imports** (a imports b imports a): put shared code in a third module.\n- Packages are just folders of modules with an \`__init__.py\`.`,
    analogy:`A toolbox in the garage: you fetch the one tool you need, not the whole workshop.`,
    example:e27},
  predict:{code:R`import math
print(math.floor(2.9), math.ceil(2.1))`, q:'What prints?', opts:['2 3','3 3','2 2'], ans:0, why:'floor rounds down (2) and ceil rounds up (3).'},
  cast:{code:e27, task:'Cast it.'},
  bug:{broken:R`import math
print(math.squareroot(16))`, task:'There is no squareroot in math. The function is called sqrt. Expected: 4.0',
    cases:[{inputs:[],tests:[['Works','lines==["4.0"]'],['Right name','"math.sqrt" in src']]}],
    sol:R`import math
print(math.sqrt(16))`, wrong:[R`print(4.0)`]},
  write:{prompt:'The module `shapes.py` already exists next to your code. It has `area(width, height)` and `perimeter(width, height)`, and prints a self-test only when run directly. Ask `Width: ` and `Height: ` and **import it** (do not rewrite the formulas). Print `Area: <n>` and `Perimeter: <n>`.',
    starter:R`# shapes.py (already here) holds:
#   def area(width, height): ...
#   def perimeter(width, height): ...
# its self-test must NOT run when you import it.
`,
    inputs:['4','3'],
    cases:[{inputs:['4','3'],files:{'shapes.py':shapes27},tests:[['Output',eqL(['Area: 12','Perimeter: 14'])],['Imported, not copied','"import shapes" in src or "from shapes import" in src'],['Guard works','"self-test" not in out']]},{inputs:['10','1'],files:{'shapes.py':shapes27},tests:[['Another rectangle',eqL(['Area: 10','Perimeter: 22'])]]},{inputs:['0','5'],files:{'shapes.py':shapes27},tests:[['Zero width',eqL(['Area: 0','Perimeter: 10'])]]}],
    sol:s27,
    wrong:[R`width = int(input("Width: "))
height = int(input("Height: "))
print("Area:", width * height)
print("Perimeter:", 2 * (width + height))`,s27.replace('shapes.area(width, height)','shapes.perimeter(width, height)'),s27.replace('shapes.perimeter(width, height)','shapes.area(width, height)'),s27.replace('import shapes\n','import shapes\nshapes.__name__ = "x"\nprint("self-test: 6")\n')],
    hints:['import shapes at the top, then call shapes.area(...) and shapes.perimeter(...).','You do not need the formulas: the module has them.','Print "Area:" with the area and "Perimeter:" with the perimeter.',s27]},
  power:{can:['Import your own modules','Use the __main__ guard so imports stay quiet'],
    expand:'Add `from shapes import area as rect_area` and call it by the short name.',
    where:'Every project is many modules; the guard lets a file be both a library and a script.',
    next:'Next: layers, storage, rules and user interface.'},
  codex:{title:'Modules',body:'Any .py file is a module: import name / from name import fn / import name as short. Own files import like library ones (current folder first). if __name__ == "__main__": guards demo code that should not run on import. Avoid circular imports.',snip:R`import shapes
if __name__ == "__main__":
    main()`}
},
{
  id:'r13-28', realm:13, n:28, title:'Layers: storage, rules, interface',
  teaches:['arch-layers'], requires:['arch-modules'],
  story:`The Arena bank has three doors. The front desk talks to customers, the clerk enforces the rules, and the vault holds the coins. "The desk never touches the vault," Quill says. "If we swap the vault for a bigger one, the desk won't even notice."`,
  concept:{
    html:`Real applications are organised in **layers**, each talking only to the one below:\n\n1. **Interface** (UI): reads commands, prints results. No rules, no storage.\n2. **Service** (business rules): validates, decides, raises errors. No \`print\`, no \`input\`.\n3. **Repository** (storage): saves and loads data. No rules.\n\n\`\`\`\nclass Repo:\n    def get(self, name): ...\n    def save(self, name, balance): ...\n\nclass Service:\n    def __init__(self, repo):\n        self.repo = repo\n    def deposit(self, name, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        ...\n\`\`\`\n\n- The service receives its repository in \`__init__\` (so you can swap a dict for a database later).\n- The service **raises** errors; the interface **catches** them and shows a message.\n- Put each check once, in the right layer: the repository trusts the service, the service trusts nothing from the user.\n- **Order of checks** is part of the behaviour: validate the amount before looking up the account.\n- Benefit: changing where data lives, or what the screen looks like, touches only one layer.`,
    analogy:`A restaurant: the waiter takes the order, the chef applies the recipe, the pantry stores the ingredients.`,
    example:e28},
  predict:{code:R`class Repo:
    def __init__(self):
        self.d = {}
    def get(self, k):
        return self.d.get(k)

r = Repo()
print(r.get("a"), r.get("a") is None)`, q:'What prints?', opts:['None True','0 False','None False'], ans:0, why:'dict.get returns None for a missing key, and None is None.'},
  cast:{code:e28, task:'Cast it.'},
  bug:{broken:R`class Service:
    def __init__(self):
        self.repo = repo

s = Service()
print("ok")`, task:'Service uses a repo that does not exist. Pass the repo in as a parameter. Expected: ok',
    cases:[{inputs:[],tests:[['Works','lines==["ok"]'],['Injected','"def __init__(self, repo)" in src']]}],
    sol:R`class Service:
    def __init__(self, repo):
        self.repo = repo

s = Service({})
print("ok")`, wrong:[R`print("ok")`]},
  write:{prompt:'Write `Repo` (storage only: `get(name)` returns the balance or `None`; `save(name, balance)`) and `Service(repo)`. `open(name)` fails with `ValueError("Account exists")` when it exists. `deposit(name, amount)` checks the amount first (`"Amount must be positive"` when 0 or less), then the account (`"No such account"`), saves and returns the new balance. `balance(name)` returns it or raises `"No such account"`. The interface loop is given.',
    starter:st28 + ui28,
    inputs:sess28,
    cases:[{inputs:sess28,tests:[['Whole session',eqP(out28,'> ')]]},{inputs:['balance x','deposit x 1','open x','balance x','quit'],tests:[['Missing then created',eqP(['Error: No such account','Error: No such account','Opened x','Balance: 0'],'> ')]]},{inputs:['open a','deposit a 5','deposit a 5','deposit a 5','quit'],tests:[['Repeated deposits',eqP(['Opened a','Balance: 5','Balance: 10','Balance: 15'],'> ')]]},{inputs:['deposit ghost 0','quit'],tests:[['Amount is checked first',eqP(['Error: Amount must be positive'],'> ')]]}],
    sol:c28 + ui28,
    wrong:[(c28 + ui28).replace('        self.repo.save(name, balance + amount)\n        return balance + amount','        return balance + amount'),(c28 + ui28).replace('        if self.repo.get(name) is not None:\n            raise ValueError("Account exists")\n',''),(c28 + ui28).replace('if amount <= 0:','if amount < 0:'),(c28 + ui28).replace('        balance = self.repo.get(name)\n        if balance is None:\n            raise ValueError("No such account")\n        return balance\n','        return self.repo.get(name)\n'),(c28 + ui28).replace('        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        balance = self.repo.get(name)\n        if balance is None:\n            raise ValueError("No such account")','        balance = self.repo.get(name)\n        if balance is None:\n            raise ValueError("No such account")\n        if amount <= 0:\n            raise ValueError("Amount must be positive")')],
    hints:['Repo is a thin wrapper around a dict: get returns None when missing, save stores.','Service raises ValueError with the exact messages; it never prints.','deposit: check amount > 0 first, then the account, then save balance + amount and return it.',c28 + ui28]},
  power:{can:['Separate storage, rules and interface','Inject a repository into a service'],
    expand:'Add a `withdraw` rule that refuses to go below zero with "Insufficient funds".',
    where:'This three-layer shape is behind web apps, mobile apps and most business software.',
    next:'Next: dependency injection for testable code.'},
  codex:{title:'Layers',body:'Interface (input/print) -> Service (rules, raises) -> Repository (get/save). The service takes the repo as a parameter and never prints. Errors flow up; the interface catches them. Each layer changes independently. Order of validation is behaviour.',snip:R`class Service:
    def __init__(self, repo):
        self.repo = repo`}
},
{
  id:'r13-29', realm:13, n:29, title:'Dependency injection: code you can test',
  teaches:['arch-di'], requires:['arch-layers'],
  story:`Quill wants to test the Arena shop, but the till fetches prices straight from the royal vault, which is guarded by dragons. "Don't hard-wire the vault into the till," Quill says. "Hand the till a **price-finder** when you build it. In real life give it the vault; in tests give it a notepad."`,
  concept:{
    html:`**Dependency injection** = a class receives what it needs (a database, a clock, a price list) as **parameters**, instead of creating or importing it itself.\n\n\`\`\`\nclass Checkout:\n    def __init__(self, price_of, discount_percent=0):\n        self.price_of = price_of          # a function: item -> price\n        self.discount_percent = discount_percent\n\n    def total(self, items):\n        ...\n\n# real use:\nCheckout(PRICES.get)\n# in a test:\nCheckout(lambda item: 10)\n\`\`\`\n\n- Functions are values, so you can pass a **function** as the dependency.\n- A class that reads a global \`PRICES\` directly can only ever use that one price list; one that is **injected** works with any.\n- Tests pass in a **fake** (a lambda, a stub) so they run fast and need no network, files or dragons.\n- Money maths: use **whole numbers** and integer division. \`total * (100 - percent) // 100\` takes a percent off the whole basket once. Discounting each item separately rounds differently!\n- Raise a clear error (\`ValueError\`) for unknown items so mistakes are loud.\n- Rule of thumb: **\`new\`/open/connect in \`main\`, pass things down.**`,
    analogy:`A lamp with a plug: it works with any socket you give it, rather than being wired into one wall.`,
    example:e29},
  predict:{code:R`class Greeter:
    def __init__(self, name_source):
        self.name_source = name_source
    def hello(self):
        return "Hi " + self.name_source()

print(Greeter(lambda: "Ada").hello())`, q:'What prints?', opts:['Hi Ada','Hi lambda','Hi <function>'], ans:0, why:'The lambda is called inside hello and returns "Ada".'},
  cast:{code:e29, task:'Cast it.'},
  bug:{broken:R`class Clock:
    def __init__(self):
        self.now = 12

class Alarm:
    def __init__(self):
        self.clock = Clock()
    def ring(self):
        return self.clock.now == 7

clock = Clock()
clock.now = 7
print(Alarm(clock).ring())`, task:'Alarm builds its own Clock, so the test clock is never used. Let Alarm accept the clock as a parameter. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Injected','"def __init__(self, clock)" in src']]}],
    sol:R`class Clock:
    def __init__(self):
        self.now = 12

class Alarm:
    def __init__(self, clock):
        self.clock = clock
    def ring(self):
        return self.clock.now == 7

clock = Clock()
clock.now = 7
print(Alarm(clock).ring())`, wrong:[R`print(True)`]},
  write:{prompt:'Write class `Checkout(price_of, discount_percent=0)`. `total(items)` adds `price_of(item)` for every item (use the injected function, never `PRICES` directly), raises `ValueError("Unknown item: <name>")` if it returns `None`, then takes the percentage off the **whole** total using whole numbers: `total * (100 - discount_percent) // 100`. The program at the bottom is given.',
    starter:hd29 + hn29,
    inputs:['apple bread apple','0'],
    cases:[{inputs:['apple bread apple','0'],tests:[['No discount',eqL(['Total: 11'])],['Injected fake price','g["Checkout"](lambda n: 10).total(["x","y"])==20'],['Never uses the global list','g["Checkout"](lambda n: 7).total(["zzz"])==7']]},{inputs:['apple apple apple','10'],tests:[['Discount on the whole total',eqL(['Total: 8'])],['Discount with fake','g["Checkout"](lambda n: 10, 50).total(["x","y"])==10']]},{inputs:['milk pear','0'],tests:[['Unknown item',eqL(['Error: Unknown item: pear'])]]},{inputs:['','25'],tests:[['Empty basket',eqL(['Total: 0'])]]},{inputs:['bread milk','100'],tests:[['Everything free',eqL(['Total: 0'])]]}],
    sol:pr29 + c29 + hn29,
    wrong:[(pr29 + c29 + hn29).replace('self.price_of(item)','PRICES.get(item)'),(pr29 + c29 + hn29).replace('            total += price\n        return total * (100 - self.discount_percent) // 100','            total += price * (100 - self.discount_percent) // 100\n        return total'),(pr29 + c29 + hn29).replace('(100 - self.discount_percent)','(100 + self.discount_percent)'),(pr29 + c29 + hn29).replace('f"Unknown item: {item}"','"Unknown item"'),(pr29 + c29 + hn29).replace('discount_percent=0','discount_percent=5')],
    hints:['Store price_of and discount_percent on self in __init__.','Loop over items, call self.price_of(item); None means raise ValueError(f"Unknown item: {item}").','Return total * (100 - self.discount_percent) // 100 once, after the loop.',pr29 + c29 + hn29]},
  power:{can:['Inject dependencies as parameters','Test classes with fake dependencies'],
    expand:'Add a `tax_of` function dependency and apply it after the discount.',
    where:'Injection is how professional teams test code that touches databases, clocks and payment services.',
    next:'Next: writing tests as code.'},
  codex:{title:'Dependency injection',body:'Pass collaborators (function, db, clock) into __init__ instead of building or importing them inside. Real code gets the real one; tests get a lambda or stub. Functions are values. Do money in whole numbers; apply a percentage to the total once.',snip:R`checkout = Checkout(PRICES.get, 10)
fake = Checkout(lambda item: 10)`}
},
{
  id:'r13-30', realm:13, n:30, title:'Tests as code: assert and a mini test runner',
  teaches:['arch-tests'], requires:['arch-di'],
  story:`Quill holds up a tiny golden bell. "Every time you change a spell, ring this bell: it runs a hundred little checks in a blink and tells you which ones broke. A spell without tests is a promise. A spell with tests is a **receipt**."`,
  concept:{
    html:`A **test** calls your code with known input and compares the result with the expected answer.\n\n\`\`\`\nassert double(4) == 8          # silent if true\nassert double(2) == 5, "message"   # raises AssertionError if false\n\`\`\`\n\nA tiny runner records **PASS**, **FAIL** and **ERROR** instead of stopping at the first problem:\n\n\`\`\`\ndef check(name, func, args, expected):\n    try:\n        got = func(*args)\n    except Exception as error:\n        return f"ERROR {name}: {type(error).__name__}"\n    if got == expected:\n        return f"PASS {name}"\n    return f"FAIL {name}: expected {expected}, got {got}"\n\`\`\`\n\n- **FAIL** = it ran but gave the wrong answer. **ERROR** = it crashed.\n- \`func(*args)\` unpacks a tuple into arguments.\n- Test the **normal case**, the **edges** (0, empty, negative, huge) and the **failure paths** (does it raise what it should?).\n- One behaviour per test, with a **name** that says what broke.\n- Real projects use \`pytest\`, which works on exactly this idea: functions named \`test_...\` with \`assert\`.\n- Run tests **after every change**; fix failing tests first.`,
    analogy:`A smoke alarm: silent when all is well, loud and specific the moment something burns.`,
    example:e30},
  predict:{code:R`def add(a, b):
    return a + b

assert add(2, 2) == 4
print("done")`, q:'What prints?', opts:['done','AssertionError','Nothing'], ans:0, why:'The assert is true, so it passes silently and the program carries on.'},
  cast:{code:e30, task:'Cast it.'},
  bug:{broken:R`def add(a, b):
    return a + b

assert add(2, 2) == 5, "2 + 2 should be 4"
print("done")`, task:'The test itself is wrong: 2 + 2 is 4. Correct the expectation. Expected: done',
    cases:[{inputs:[],tests:[['Works','lines==["done"]'],['Still tests','"assert add(2, 2) == 4" in src']]}],
    sol:R`def add(a, b):
    return a + b

assert add(2, 2) == 4, "2 + 2 should be 4"
print("done")`, wrong:[R`print("done")`]},
  write:{prompt:'Write `check(name, func, args, expected)`. Call `func(*args)`. Return `PASS <name>` when it equals `expected`; `FAIL <name>: expected <expected>, got <got>` when it does not; and `ERROR <name>: <ExceptionName>` if the call raises. The table of tests and the printing are given.',
    starter:hd30 + hn30,
    inputs:[],
    cases:[{inputs:[],tests:[['Full report',eqL(['PASS shout works','PASS add works','FAIL add wrong expectation: expected 5, got 4','PASS divide ok','ERROR divide by zero errors: ZeroDivisionError','Summary: 3 passed, 2 failed'])],['PASS','g["check"]("n", lambda a: a, (1,), 1)=="PASS n"'],['FAIL','g["check"]("n", lambda: 2, (), 3)=="FAIL n: expected 3, got 2"'],['ERROR','g["check"]("n", lambda a: 1 // a, (0,), 1)=="ERROR n: ZeroDivisionError"'],['Other error type','g["check"]("k", lambda: {}["x"], (), 1)=="ERROR k: KeyError"']]}],
    sol:c30.replace('def check','def check') + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30,
    wrong:[(c30 + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30).replace('    except Exception as error:\n        return f"ERROR {name}: {type(error).__name__}"','    except ZeroDivisionError:\n        return f"ERROR {name}: ZeroDivisionError"'),(c30 + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30).replace('f"FAIL {name}: expected {expected}, got {got}"','f"FAIL {name}: expected {got}, got {expected}"'),(c30 + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30).replace('func(*args)','func(args)'),(c30 + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30).replace('    if got == expected:\n        return f"PASS {name}"\n','    if got is not None:\n        return f"PASS {name}"\n')],
    hints:['Call the function inside try; an exception turns into "ERROR name: ExceptionName" using type(error).__name__.','Compare got with expected: equal gives "PASS name".','Otherwise return "FAIL name: expected X, got Y".',c30 + R`def shout(text):
    return text.upper() + "!"

def add(a, b):
    return a + b

def divide(n):
    return 10 // n


tests = [
    ("shout works", shout, ("hi",), "HI!"),
    ("add works", add, (2, 3), 5),
    ("add wrong expectation", add, (2, 2), 5),
    ("divide ok", divide, (2,), 5),
    ("divide by zero errors", divide, (0,), 5),
]
` + hn30]},
  power:{can:['Write assert-based tests','Build a tiny PASS/FAIL/ERROR runner'],
    expand:'Print the failing tests first, then the passing ones.',
    where:'pytest, unittest and every CI pipeline are this idea at scale.',
    next:'Next: refactoring safely.'},
  codex:{title:'Tests as code',body:'assert cond, "message" raises AssertionError when false. A runner: try func(*args); PASS if equal, FAIL with expected/got if not, ERROR with the exception name if it raised. Test normal, edge and failure cases. pytest = test_ functions + assert.',snip:R`assert slugify("A B") == "a-b"`}
},
{
  id:'r13-31', realm:13, n:31, title:'Refactoring: same behaviour, better shape',
  teaches:['arch-refactor'], requires:['arch-tests'],
  story:`The old shipping clerk wrote a spell with nine copy-pasted branches. Add a new zone and you must copy-paste again, and he always forgets one. "Refactoring is tidying while keeping the answers **exactly the same**," Quill says. "The tests are your safety rope."`,
  concept:{
    html:`**Refactoring** = changing the structure of code **without changing what it does**.\n\nCommon moves:\n- **Replace a chain of if/elif with a table** (dict). Data goes in the table, logic stays small.\n- **Give magic numbers a name** (\`RATES\`, \`EXTRA_PER_KILO\`).\n- **Remove duplication**: if you copy-paste, make it a function.\n- **Guard clauses**: handle the bad case first and \`raise\`/\`return\` early, so the main path is not nested.\n- **Rename** for clarity.\n\n\`\`\`\nRATES = {"local": 5, "national": 9, "world": 20}\n\ndef shipping_cost(weight, zone, express=False):\n    if zone not in RATES:\n        raise ValueError("Unknown zone")\n    cost = RATES[zone] + 2 * max(0, weight - 1)\n    return cost * 2 if express else cost\n\`\`\`\n\n- \`max(0, weight - 1)\` = "every kilo beyond the first, never negative".\n- **Tests first**: refactor only when tests pass, and run them after every small step.\n- Adding a new zone is now one line in the table, not a new branch.\n- Do not mix refactoring with adding features: one at a time.`,
    analogy:`Tidying a workshop: every tool still works the same, but you can finally find them.`,
    example:e31},
  predict:{code:R`RATES = {"a": 1, "b": 2}
print(RATES.get("b", 0), RATES.get("z", 0))`, q:'What prints?', opts:['2 0','2 None','0 0'], ans:0, why:'get with a default returns 0 for the missing key "z".'},
  cast:{code:e31, task:'Cast it.'},
  bug:{broken:R`def extra(weight):
    return 2 * (weight - 1)

print(extra(0))`, task:'A weight of 0 gives a negative charge. Never charge less than 0 extra. Expected: 0',
    cases:[{inputs:[],tests:[['Works','lines==["0"]'],['Clamped','"max(0" in src']]}],
    sol:R`def extra(weight):
    return 2 * max(0, weight - 1)

print(extra(0))`, wrong:[R`print(0)`]},
  write:{prompt:'Write `shipping_cost(weight, zone, express=False)`: base rate local 5, national 9, world 20; plus 2 for every kilo beyond the first (never negative); express doubles the total; an unknown zone raises `ValueError("Unknown zone")`. Use a dictionary, not an if/elif chain. The program at the bottom is given.',
    starter:hd31,
    inputs:['3','national','no'],
    cases:[{inputs:['3','national','no'],tests:[['Heavier parcel',eqL(['Cost: 13'])],['Matches the rule everywhere',shipCheck]]},{inputs:['1','local','yes'],tests:[['Express',eqL(['Cost: 10'])]]},{inputs:['5','world','yes'],tests:[['World express',eqL(['Cost: 56'])]]},{inputs:['2','moon','no'],tests:[['Unknown zone',eqL(['Error: Unknown zone'])]]},{inputs:['0','local','no'],tests:[['Zero weight is not negative',eqL(['Cost: 5'])]]}],
    sol:s31,
    wrong:[s31.replace('2 * max(0, weight - 1)','2 * weight'),s31.replace('cost * 2 if express else cost','cost + 2 if express else cost'),s31.replace('RATES[zone] + 2 * max(0, weight - 1)','RATES[zone] + 2 * (weight - 1)'),s31.replace('"world": 20','"world": 15'),s31.replace('    if zone not in RATES:\n        raise ValueError("Unknown zone")\n','')],
    hints:['RATES = {"local": 5, "national": 9, "world": 20} holds the data.','Guard first: unknown zone raises ValueError("Unknown zone"). Then cost = RATES[zone] + 2 * max(0, weight - 1).','Return cost * 2 for express, else cost.',s31]},
  power:{can:['Replace if-chains with tables','Use guard clauses and named constants'],
    expand:'Add a "moon" zone costing 50 with a single new line.',
    where:'Real codebases spend most of their life being refactored, not written.',
    next:'Next: custom exceptions.'},
  codex:{title:'Refactoring',body:'Change shape, not behaviour. Tests first. if/elif chains -> dict tables; magic numbers -> named constants; copy-paste -> function; guard clauses raise/return early. max(0, x) clamps negatives. One change at a time.',snip:R`RATES = {"local": 5, "national": 9}
cost = RATES[zone]`}
},
{
  id:'r13-32', realm:13, n:32, title:'Designing your own exceptions',
  teaches:['arch-errors'], requires:['arch-refactor'],
  story:`The Arena vending machine says only "Error" whatever goes wrong: empty, wrong coin, unknown snack. "A good error is a good map," Quill says. "Make a different kind of error for each problem and the caller can react to each properly."`,
  concept:{
    html:`Create your own exception types by subclassing \`Exception\`:\n\n\`\`\`\nclass AppError(Exception):          # base for everything this app raises\n    pass\n\nclass OutOfStock(AppError):\n    pass\n\nclass NotEnoughMoney(AppError):\n    def __init__(self, short):\n        super().__init__(f"Need {short} more")\n        self.short = short          # carry data for the caller\n\`\`\`\n\n- **One base class** (\`AppError\`) lets callers catch "anything from my app" with one \`except\`.\n- Catch the **specific** exceptions first, then the general family:\n\n\`\`\`\ntry:\n    machine.buy("tea", 1)\nexcept NotEnoughMoney as error:\n    print("Need", error.short, "more")\nexcept AppError as error:\n    print("Error:", error)\n\`\`\`\n\n- \`super().__init__(message)\` sets the text that \`str(error)\` shows.\n- Check order matters: unknown item → sold out → not enough money.\n- **Change state only after every check passes**; otherwise a failed purchase would still use up the stock.\n- Name errors for the **problem** (\`OutOfStock\`), not the place.`,
    analogy:`Warning lights on a dashboard: a different light for fuel, oil and temperature, not one light that just says "problem".`,
    example:e32},
  predict:{code:R`class AppError(Exception):
    pass
class Sold(AppError):
    pass

try:
    raise Sold("gone")
except AppError as e:
    print("caught", e)`, q:'What prints?', opts:['caught gone','Nothing','Sold'], ans:0, why:'Sold is an AppError, so the general handler catches it and prints its message.'},
  cast:{code:e32, task:'Cast it.'},
  bug:{broken:R`class AppError(Exception):
    pass

class OutOfStock:
    pass

try:
    raise OutOfStock("gone")
except AppError:
    print("handled")`, task:'OutOfStock must be a kind of AppError (and of Exception). Add the parent. Expected: handled',
    cases:[{inputs:[],tests:[['Works','lines==["handled"]'],['Subclass','"class OutOfStock(AppError)" in src']]}],
    sol:R`class AppError(Exception):
    pass

class OutOfStock(AppError):
    pass

try:
    raise OutOfStock("gone")
except AppError:
    print("handled")`, wrong:[R`print("handled")`]},
  write:{prompt:'Define `UnknownItem` and `OutOfStock` (both `AppError`) and `NotEnoughMoney(AppError)` which stores `.short`. Write `Vending(stock)` with `buy(item, money)`: raise `UnknownItem("Unknown item")`, then `OutOfStock("Sold out")`, then `NotEnoughMoney(price - money)`; only on success reduce the stock by one and return the change. The command loop is given.',
    starter:st32 + hn32,
    inputs:sess32,
    cases:[{inputs:sess32,tests:[['Whole session',eqP(out32,'> ')],['Family tree','issubclass(g["NotEnoughMoney"], g["AppError"]) and issubclass(g["OutOfStock"], g["AppError"]) and issubclass(g["UnknownItem"], g["AppError"])']]},{inputs:['buy tea 1','buy tea 3','buy tea 3','buy tea 3','quit'],tests:[['A failed buy does not use stock',eqP(['Need 2 more','Enjoy tea - change 0','Enjoy tea - change 0','Error: Sold out'],'> ')]]},{inputs:['buy gum 1','buy cola 100','buy cola 1','quit'],tests:[['Order of checks',eqP(['Error: Sold out','Enjoy cola - change 95','Error: Sold out'],'> ')]]},{inputs:['hello','buy','quit'],tests:[['Bad commands',eqP(['Unknown command','Unknown command'],'> ')]]}],
    sol:c32 + hn32,
    wrong:[(c32 + hn32).replace('class UnknownItem(AppError):','class UnknownItem(Exception):'),(c32 + hn32).replace('        self.stock[item][1] -= 1\n        return money - price','        return money - price'),(c32 + hn32).replace('        if left == 0:\n            raise OutOfStock("Sold out")\n        if money < price:\n            raise NotEnoughMoney(price - money)','        if money < price:\n            raise NotEnoughMoney(price - money)\n        if left == 0:\n            raise OutOfStock("Sold out")'),(c32 + hn32).replace('NotEnoughMoney(price - money)','NotEnoughMoney(money)'),(c32 + hn32).replace('        if money < price:','        if money <= price:')],
    hints:['class UnknownItem(AppError): pass, the same for OutOfStock. NotEnoughMoney stores short in __init__.','buy: unknown item first, then sold out, then too little money.','Only after all three checks, lower the stock count and return money - price.',c32 + hn32]},
  power:{can:['Create exception hierarchies','Catch specific then general errors'],
    expand:'Give OutOfStock an `.item` attribute and print "<item> is sold out".',
    where:'Libraries like requests and Django ship with their own exception families for exactly this reason.',
    next:'Next: Real-World Mission, the Arena Inventory app.'},
  codex:{title:'Custom exceptions',body:'class AppError(Exception); class Specific(AppError). super().__init__(msg) sets the text; store extra data as attributes. Catch specific first, then AppError. Validate everything BEFORE changing state.',snip:R`class NotEnoughMoney(AppError):
    def __init__(self, short):
        super().__init__(f"Need {short} more")
        self.short = short`}
},
{
  id:'r13-33', realm:13, n:33, title:'Real-World Mission: The Arena Inventory',
  teaches:['mission13d'], requires:['arch-errors'],
  story:`The Arena armoury is a mess: nobody knows how many bolts, nuts and gears remain. Quill unrolls a blueprint with three boxes: **Storage**, **Inventory** rules and a **command line**. "Build it clean," Quill says. "In a year, someone else will have to change it."`,
  concept:{
    html:`This mission brings the whole level together: layers, injection, clear errors and testable pieces.\n\n- **Storage**: holds \`name -> quantity\`. \`get\` returns 0 for unknown items. \`set\` with quantity 0 **removes** the item (so reports never list zero stock). \`all()\` returns a **copy** so callers cannot damage the data.\n- **Inventory(storage)**: the rules.\n  - \`add(name, qty)\` and \`remove(name, qty)\` both reject \`qty <= 0\` ("Quantity must be positive").\n  - \`remove\` of an item that is not stocked → "No such item"; removing more than exists → "Only <n> in stock".\n  - They return the new quantity.\n  - \`report()\` is a **sorted** list of \`"name: qty"\`; \`low(limit)\` is the sorted names with quantity **below** the limit.\n- The command loop is the only layer that prints, and it turns \`ValueError\` into \`Error: ...\`.\n\n\`\`\`\ninventory = Inventory(Storage())      # injected\n\`\`\`\n\nWhen the boss asks for a database instead, you replace \`Storage\` and **nothing else changes**.`,
    analogy:`A well-run shop: the shelves, the stock rules and the till are three separate things.`,
    example:e33},
  predict:{code:R`items = {"b": 2, "a": 1}
print([f"{k}: {v}" for k, v in sorted(items.items())])`, q:'What prints?', opts:["['a: 1', 'b: 2']","['b: 2', 'a: 1']","[('a', 1), ('b', 2)]"], ans:0, why:'sorted orders the (name, qty) pairs by name, then the f-string formats each.'},
  cast:{code:e33, task:'Cast it.'},
  bug:{broken:R`class Storage:
    def __init__(self):
        self.items = {"a": 1}
    def all(self):
        return self.items

copy = Storage().all()
copy["b"] = 2
s = Storage()
print(len(s.all()) == len(Storage().all()), s.all() is s.items)`, task:'all() hands out the real dict, so callers can damage it. Return a copy. Expected: True False',
    cases:[{inputs:[],tests:[['Works','lines==["True False"]'],['Copy','"dict(self.items)" in src or "self.items.copy()" in src']]}],
    sol:R`class Storage:
    def __init__(self):
        self.items = {"a": 1}
    def all(self):
        return dict(self.items)

copy = Storage().all()
copy["b"] = 2
s = Storage()
print(len(s.all()) == len(Storage().all()), s.all() is s.items)`, wrong:[R`print(True, False)`]},
  write:{prompt:'Write `Storage` (`get(name)` gives 0 for unknown; `set(name, qty)` removes the item when `qty` is 0; `all()` returns a **copy**) and `Inventory(storage)` with `add`, `remove` (both return the new quantity), `report()` and `low(limit)`. Errors are `ValueError`s with the exact messages `Quantity must be positive`, `No such item` and `Only <n> in stock`. The command loop is given.',
    starter:st33 + hn33,
    inputs:sess33,
    cases:[{inputs:sess33,tests:[['Whole session',eqP(out33,'> ')]]},{inputs:['report','low 3','quit'],tests:[['all() returns a copy','(lambda s: (s.set("a", 1), s.all().__setitem__("b", 2), s.all())[2])(g["Storage"]())=={"a": 1}'],['Empty shop',eqP(['(empty)','none'],'> ')]]},{inputs:['add a 1','remove a 1','report','add a 2','remove a 5','quit'],tests:[['Emptied items vanish',eqP(['Stock: 1','Stock: 0','(empty)','Stock: 2','Error: Only 2 in stock'],'> ')]]},{inputs:['add z 4','add a 4','add m 1','report','low 4','quit'],tests:[['Sorted, strictly below',eqP(['Stock: 4','Stock: 4','Stock: 1','a: 4; m: 1; z: 4','m'],'> ')]]},{inputs:['remove q -1','add q -1','quit'],tests:[['Quantity checked first',eqP(['Error: Quantity must be positive','Error: Quantity must be positive'],'> ')]]}],
    sol:c33 + hn33,
    wrong:[(c33 + hn33).replace('return dict(self.items)','return self.items').replace("a: 4; m: 1; z: 4","a: 4; m: 1; z: 4"),(c33 + hn33).replace('if qty == 0:\n            self.items.pop(name, None)\n        else:\n            self.items[name] = qty','self.items[name] = qty'),(c33 + hn33).replace('if qty < limit','if qty <= limit'),(c33 + hn33).replace('sorted(self.storage.all().items())','self.storage.all().items()'),(c33 + hn33).replace('        if qty > have:\n            raise ValueError(f"Only {have} in stock")\n',''),(c33 + hn33).replace('        if have == 0:\n            raise ValueError("No such item")\n','')],
    hints:['Storage keeps a dict; set pops the item when qty is 0; all() returns dict(self.items).','add: validate qty > 0, add to storage.get(name), store, return the total. remove validates qty, then missing, then too many.','report: sorted(...) of "name: qty"; low: sorted names with qty < limit.',c33 + hn33]},
  power:{can:['Design a layered application','Keep storage, rules and interface independent'],
    expand:'Add a `rename old new` command that moves the stock to a new name.',
    where:'This blueprint is the skeleton of nearly every business app you will build or inherit.',
    next:'Next: the interview itself.'},
  codex:{title:'Layered app blueprint',body:'Storage (get/set/all copy), Inventory(storage) (validate, rules, return new values, sorted reports), a thin command loop that prints and catches ValueError. Validate qty first; delete zero-stock items; inject the storage.',snip:R`inventory = Inventory(Storage())`}
}
);
}
