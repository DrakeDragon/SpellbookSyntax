// REALM 11 — THE ITERATOR GATE — part A (lessons 1-7: dataclasses, enums, Quest Log mission)
LESSONS.push(
{
  id:'r11-01', realm:11, n:1, title:'@dataclass: classes without the boilerplate',
  teaches:['dc-basic'], requires:['realm10-gap'],
  story:`Warden Quill guards the Iterator Gate, a tall arch carved with tidy little ledgers. "Half of every class you wrote in the Guildhall was **copying**: \`self.name = name\`, a repr, an \`__eq__\`. A **dataclass** writes all of that for you."`,
  concept:{
    html:`\`@dataclass\` generates \`__init__\`, \`__repr__\` and \`__eq__\` from **annotated fields**:\n\n\`\`\`\nfrom dataclasses import dataclass\n\n@dataclass\nclass Hero:\n    name: str\n    hp: int\n    power: int = 5            # a default\n\nh = Hero("Ada", 30)\nprint(h)                      # Hero(name='Ada', hp=30, power=5)\nprint(h == Hero("Ada", 30))   # True\n\`\`\`\n\n- Each \`name: type\` line is a **field**. The order is the order of the constructor arguments.\n- ⚠️ Fields **without** a default must come **before** fields with one (like normal function parameters).\n- The annotations document intent; Python does **not** enforce them at run time (\`Hero("Ada", "lots")\` still builds).\n- You can still add your own methods and properties.\n- Best for classes that mostly **hold data**: points, records, config, results.`,
    analogy:`A pre-printed form: you only fill in the blanks, the layout is already done.`,
    example:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    hp: int
    power: int = 5

h = Hero("Ada", 30)
print(h)
print(h == Hero("Ada", 30), h.power)`},
  predict:{code:R`from dataclasses import dataclass

@dataclass
class P:
    x: int
    y: int

print(P(1, 2) == P(1, 2))`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'@dataclass generates __eq__ comparing the fields.'},
  cast:{code:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    hp: int
    power: int = 5

h = Hero("Ada", 30)
print(h)
print(h == Hero("Ada", 30), h.power)`, task:'Cast it.'},
  bug:{broken:R`from dataclasses import dataclass

@dataclass
class Hero:
    power: int = 5
    name: str

print(Hero("Ada"))`, task:'TypeError: a field without a default cannot follow one with a default. Reorder the fields. Expected: Hero(name=\'Ada\', power=5)',
    cases:[{inputs:[],tests:[['Right order','lines==["Hero(name=\'Ada\', power=5)"]']]}],
    sol:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    power: int = 5

print(Hero("Ada"))`, wrong:[R`from dataclasses import dataclass

@dataclass
class Hero:
    power: int = 5
    name: str = "Ada"

print(Hero())`]},
  write:{prompt:'Define a dataclass `Item` with `name: str`, `price: float` and `qty: int = 1`, plus a method `total()` returning `price * qty`. Ask `Item: ` as `name price [qty]` and print the item\'s repr, then `Total: <total with 2 decimals>`.',
    starter:R`from dataclasses import dataclass

parts = input("Item: ").split()
`,
    inputs:['apple 0.5 4'],
    cases:[{inputs:['apple 0.5 4'],tests:[['Item','lines[-2:]==["Item(name=\'apple\', price=0.5, qty=4)","Total: 2.00"]'],['Is a dataclass','__import__("dataclasses").is_dataclass(g["Item"])'],['Equality','g["Item"]("a",1.0)==g["Item"]("a",1.0,1)']]},{inputs:['gem 12.5'],tests:[['Default qty','lines[-2:]==["Item(name=\'gem\', price=12.5, qty=1)","Total: 12.50"]']]},{inputs:['rope 3 0'],tests:[['Zero qty','lines[-1]=="Total: 0.00"']]}],
    sol:R`from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: float
    qty: int = 1

    def total(self):
        return self.price * self.qty

parts = input("Item: ").split()
item = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)
print(item)
print(f"Total: {item.total():.2f}")`,
    wrong:[R`class Item:
    def __init__(self, name, price, qty=1):
        self.name = name
        self.price = price
        self.qty = qty

    def total(self):
        return self.price * self.qty

parts = input("Item: ").split()
item = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)
print(f"Item(name='{item.name}', price={item.price}, qty={item.qty})")
print(f"Total: {item.total():.2f}")`, R`from dataclasses import dataclass

@dataclass
class Item:
    name: str
    price: float
    qty: int = 1

    def total(self):
        return self.price * self.qty

parts = input("Item: ").split()
item = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)
print(item)
print(f"Total: {item.price:.2f}")`],
    hints:['@dataclass above class Item; fields name: str, price: float, qty: int = 1.','Add def total(self): return self.price * self.qty.','Parse the three words; qty is optional so default it to 1.','from dataclasses import dataclass\n\n@dataclass\nclass Item:\n    name: str\n    price: float\n    qty: int = 1\n\n    def total(self):\n        return self.price * self.qty\n\nparts = input("Item: ").split()\nitem = Item(parts[0], float(parts[1]), int(parts[2]) if len(parts) > 2 else 1)\nprint(item)\nprint(f"Total: {item.total():.2f}")']},
  power:{can:['Create record classes in a few lines','Get __init__, __repr__ and __eq__ for free'],
    expand:'Add a `discounted(percent)` method that returns a new Item.',
    where:'Dataclasses are the standard way to model records in modern Python.',
    next:'Next: defaults for lists and other mutable values.'},
  codex:{title:'@dataclass',body:'@dataclass turns annotated fields into __init__, __repr__ and __eq__. Defaulted fields go last. Annotations are not enforced.',snip:R`@dataclass
class Hero:
    name: str
    hp: int = 20`}
},
{
  id:'r11-02', realm:11, n:2, title:'field(): safe defaults for lists and dicts',
  teaches:['dc-field'], requires:['dc-basic'],
  story:`"Each hero gets their own backpack," Quill says. "Remember the shared-list trap from the Guildhall? Dataclasses **refuse** a plain \`[]\` default for exactly that reason, and give you the right tool."`,
  concept:{
    html:`A mutable default (list, dict, set) would be **shared** by every instance. Dataclasses raise \`ValueError: mutable default ... use default_factory\` to stop you. The fix:\n\n\`\`\`\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass Hero:\n    name: str\n    items: list = field(default_factory=list)       # a NEW list per hero\n    stats: dict = field(default_factory=dict)\n    secret: str = field(default="", repr=False)     # hide from repr\n\`\`\`\n\n- \`default_factory\` takes a **function** (no parentheses!) that is called for every new object.\n- \`field(repr=False)\` hides a field from the printed form; \`field(compare=False)\` ignores it in \`==\`.\n- \`field(init=False)\` means the caller doesn't pass it (set it later or in \`__post_init__\`).\n- Typing: \`list[str]\` tells readers what's inside (not enforced).`,
    analogy:`A factory that stamps out a fresh backpack for every hero instead of handing everyone the same one.`,
    example:R`from dataclasses import dataclass, field

@dataclass
class Hero:
    name: str
    items: list = field(default_factory=list)

a = Hero("Ada")
b = Hero("Bo")
a.items.append("sword")
print(a.items, b.items)`},
  predict:{code:R`from dataclasses import dataclass, field

@dataclass
class B:
    xs: list = field(default_factory=list)

p, q = B(), B()
p.xs.append(1)
print(q.xs)`, q:'What prints?', opts:['[]','[1]','Error'], ans:0, why:'default_factory builds a separate list for each object.'},
  cast:{code:R`from dataclasses import dataclass, field

@dataclass
class Hero:
    name: str
    items: list = field(default_factory=list)

a = Hero("Ada")
b = Hero("Bo")
a.items.append("sword")
print(a.items, b.items)`, task:'Cast it.'},
  bug:{broken:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    items: list = []

print(Hero("Ada"))`, task:'ValueError: mutable default. Use field(default_factory=list). Expected: Hero(name=\'Ada\', items=[])',
    cases:[{inputs:[],tests:[['Fixed','lines==["Hero(name=\'Ada\', items=[])"]']]}],
    sol:R`from dataclasses import dataclass, field

@dataclass
class Hero:
    name: str
    items: list = field(default_factory=list)

print(Hero("Ada"))`, wrong:[R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    items: tuple = ()

print(Hero("Ada"))`]},
  write:{prompt:'Define a dataclass `Party` with `name: str`, `members: list` (own list each time) and `notes: dict` (own dict each time). Give it methods `join(person)` and `leave(person)` (silently ignore people not in it). Ask `Commands: ` like `join Ann join Bo leave Ann` (pairs of words). Print `<party repr>`, where the party is called `Heroes`.',
    starter:R`from dataclasses import dataclass, field

words = input("Commands: ").split()
`,
    inputs:['join Ann join Bo leave Ann'],
    cases:[{inputs:['join Ann join Bo leave Ann'],tests:[['Repr','lines[-1]=="Party(name=\'Heroes\', members=[\'Bo\'], notes={})"'],['Not shared','(lambda a, b: (a.join("x"), b.members)[1])(g["Party"]("a"), g["Party"]("b"))==[]'],['Uses default_factory','"default_factory" in src']]},{inputs:[''],tests:[['Empty','lines[-1]=="Party(name=\'Heroes\', members=[], notes={})"']]},{inputs:['leave Zed join Ann'],tests:[['Leave unknown','lines[-1]=="Party(name=\'Heroes\', members=[\'Ann\'], notes={})"']]},{inputs:['join A join A leave A'],tests:[['Duplicate join','lines[-1]=="Party(name=\'Heroes\', members=[\'A\'], notes={})"']]}],
    sol:R`from dataclasses import dataclass, field

@dataclass
class Party:
    name: str
    members: list = field(default_factory=list)
    notes: dict = field(default_factory=dict)

    def join(self, person):
        self.members.append(person)

    def leave(self, person):
        if person in self.members:
            self.members.remove(person)

words = input("Commands: ").split()
party = Party("Heroes")
for command, person in zip(words[::2], words[1::2]):
    if command == "join":
        party.join(person)
    elif command == "leave":
        party.leave(person)
print(party)`,
    wrong:[R`from dataclasses import dataclass, field

@dataclass
class Party:
    name: str
    members: list = field(default_factory=list)
    notes: dict = field(default_factory=dict)

    def join(self, person):
        self.members.append(person)

    def leave(self, person):
        self.members.remove(person)

words = input("Commands: ").split()
party = Party("Heroes")
for command, person in zip(words[::2], words[1::2]):
    if command == "join":
        party.join(person)
    elif command == "leave":
        party.leave(person)
print(party)`, R`from dataclasses import dataclass, field

@dataclass
class Party:
    name: str
    members: list = field(default_factory=list)
    notes: dict = field(default_factory=dict)

    def join(self, person):
        self.members.append(person)

    def leave(self, person):
        if person in self.members:
            self.members.remove(person)

words = input("Commands: ").split()
party = Party("Heroes")
for command, person in zip(words[::2], words[1::2]):
    if command == "join" and person not in party.members:
        party.join(person)
    elif command == "leave":
        party.leave(person)
print(party)`],
    hints:['members: list = field(default_factory=list); notes: dict = field(default_factory=dict).','join appends. leave removes only if the person is in the list.','Walk the words in pairs: zip(words[::2], words[1::2]).','from dataclasses import dataclass, field\n\n@dataclass\nclass Party:\n    name: str\n    members: list = field(default_factory=list)\n    notes: dict = field(default_factory=dict)\n\n    def join(self, person):\n        self.members.append(person)\n\n    def leave(self, person):\n        if person in self.members:\n            self.members.remove(person)\n\nwords = input("Commands: ").split()\nparty = Party("Heroes")\nfor command, person in zip(words[::2], words[1::2]):\n    if command == "join":\n        party.join(person)\n    elif command == "leave":\n        party.leave(person)\nprint(party)']},
  power:{can:['Give dataclass fields safe mutable defaults','Hide or exclude fields from repr and comparison'],
    expand:'Try `field(repr=False)` on `notes` and see how the printed form changes.',
    where:'Config objects and results with lists inside are everywhere.',
    next:'Next: frozen (immutable) and ordered dataclasses.'},
  codex:{title:'field()',body:'Use field(default_factory=list) for mutable defaults. field(repr=False), compare=False and init=False tune individual fields.',snip:R`items: list = field(default_factory=list)`}
},
{
  id:'r11-03', realm:11, n:3, title:'frozen and order: immutable, sortable records',
  teaches:['dc-frozen'], requires:['dc-field'],
  story:`"A coordinate on the map must never change once it is written," Quill says. "And you should be able to **sort** coordinates without writing comparison code. Two switches on the decorator do both."`,
  concept:{
    html:`\`@dataclass\` takes options:\n\n\`\`\`\n@dataclass(frozen=True)          # assigning to a field raises FrozenInstanceError\nclass Point:\n    x: int\n    y: int\n\np = Point(1, 2)\np.x = 5                         # dataclasses.FrozenInstanceError\n{p: "start"}                    # frozen + eq => hashable: usable as dict key / in sets\n\n@dataclass(order=True)          # generates <, <=, >, >= comparing fields in order\nclass Version:\n    major: int\n    minor: int = 0\n\nsorted([Version(1, 10), Version(1, 9)])   # [Version(1, 9), Version(1, 10)]\n\`\`\`\n\n- **frozen=True** makes instances read-only and (with the default \`eq=True\`) **hashable**, so they work in sets and as dict keys. Use it for values that must not change.\n- To "change" a frozen object, make a **modified copy** with \`dataclasses.replace(p, x=5)\`.\n- **order=True** compares fields **as a tuple, top to bottom**: put the most important sort key first.\n- A non-frozen dataclass with \`eq=True\` is **unhashable** (same hash rule as before).`,
    analogy:`A stamped coin: you can't edit it, but you can mint a new one.`,
    example:R`from dataclasses import dataclass, replace

@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p, p < Point(1, 3))
print(replace(p, x=9))
try:
    p.x = 5
except Exception as error:
    print(type(error).__name__)`},
  predict:{code:R`from dataclasses import dataclass

@dataclass(frozen=True)
class P:
    x: int

print(len({P(1), P(1), P(2)}))`, q:'What prints?', opts:['2','3','Error'], ans:0, why:'Frozen dataclasses are hashable; equal ones collapse in a set.'},
  cast:{code:R`from dataclasses import dataclass, replace

@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int

p = Point(1, 2)
print(p, p < Point(1, 3))
print(replace(p, x=9))
try:
    p.x = 5
except Exception as error:
    print(type(error).__name__)`, task:'Cast it.'},
  bug:{broken:R`from dataclasses import dataclass

@dataclass
class Score:
    points: int

print(sorted([Score(5), Score(2)]))`, task:'TypeError: Score has no ordering. Turn on order=True. Expected: [Score(points=2), Score(points=5)]',
    cases:[{inputs:[],tests:[['Sorted','lines==["[Score(points=2), Score(points=5)]"]'],['Really sorts','"sorted(" in src']]}],
    sol:R`from dataclasses import dataclass

@dataclass(order=True)
class Score:
    points: int

print(sorted([Score(5), Score(2)]))`, wrong:[R`from dataclasses import dataclass

@dataclass
class Score:
    points: int

print([Score(2), Score(5)])`]},
  write:{prompt:'Define a **frozen, ordered** dataclass `Version(major, minor, patch)` (all ints, default minor and patch to 0). Ask `Versions: ` (words like `1.2.3`, `1.10`, `2`; missing parts are 0). Print `Newest: major.minor.patch` and `Unique: <how many different versions>` (use a set). With no input print `No versions`. Then print `Bumped: <newest with minor + 1 and patch 0>` using `replace`.',
    starter:R`from dataclasses import dataclass, replace

words = input("Versions: ").split()
`,
    inputs:['1.2.3 1.10 2 1.2.3'],
    cases:[{inputs:['1.2.3 1.10 2 1.2.3'],tests:[['Full','lines[-3:]==["Newest: 2.0.0","Unique: 3","Bumped: 2.1.0"]'],['Frozen','__import__("unittest").TestCase().assertRaises(Exception, setattr, g["Version"](1), "major", 5) is None'],['Ordered','g["Version"](1,10)>g["Version"](1,9) and g["Version"](1)<g["Version"](1,0,1)'],['Hashable','len({g["Version"](1),g["Version"](1)})==1']]},{inputs:['1.9 1.10'],tests:[['Numeric','lines[-3:]==["Newest: 1.10.0","Unique: 2","Bumped: 1.11.0"]']]},{inputs:[''],tests:[['None','lines[-1]=="No versions"']]},{inputs:['0.0.1'],tests:[['Single','lines[-3:]==["Newest: 0.0.1","Unique: 1","Bumped: 0.1.0"]']]}],
    sol:R`from dataclasses import dataclass, replace

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int = 0
    patch: int = 0

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = [Version(*[int(p) for p in w.split(".")]) for w in words]
    newest = max(versions)
    print(f"Newest: {newest.major}.{newest.minor}.{newest.patch}")
    print("Unique:", len(set(versions)))
    bumped = replace(newest, minor=newest.minor + 1, patch=0)
    print(f"Bumped: {bumped.major}.{bumped.minor}.{bumped.patch}")`,
    wrong:[R`from dataclasses import dataclass, replace

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int = 0
    patch: int = 0

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = [Version(*[int(p) for p in w.split(".")]) for w in words]
    newest = max(versions)
    print(f"Newest: {newest.major}.{newest.minor}.{newest.patch}")
    print("Unique:", len(versions))
    bumped = replace(newest, minor=newest.minor + 1, patch=0)
    print(f"Bumped: {bumped.major}.{bumped.minor}.{bumped.patch}")`, R`from dataclasses import dataclass, replace

@dataclass(frozen=True, order=True)
class Version:
    patch: int = 0
    minor: int = 0
    major: int = 0

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = []
    for w in words:
        parts = [int(p) for p in w.split(".")]
        parts += [0] * (3 - len(parts))
        versions.append(Version(patch=parts[2], minor=parts[1], major=parts[0]))
    newest = max(versions)
    print(f"Newest: {newest.major}.{newest.minor}.{newest.patch}")
    print("Unique:", len(set(versions)))
    bumped = replace(newest, minor=newest.minor + 1, patch=0)
    print(f"Bumped: {bumped.major}.{bumped.minor}.{bumped.patch}")`],
    hints:['@dataclass(frozen=True, order=True) with fields major, minor=0, patch=0 in that order (order matters for sorting).','Version(*[int(p) for p in word.split(".")]) fills missing parts from the defaults.','max(versions), len(set(versions)) and replace(newest, minor=..., patch=0) do the rest.','from dataclasses import dataclass, replace\n\n@dataclass(frozen=True, order=True)\nclass Version:\n    major: int\n    minor: int = 0\n    patch: int = 0\n\nwords = input("Versions: ").split()\nif not words:\n    print("No versions")\nelse:\n    versions = [Version(*[int(p) for p in w.split(".")]) for w in words]\n    newest = max(versions)\n    print(f"Newest: {newest.major}.{newest.minor}.{newest.patch}")\n    print("Unique:", len(set(versions)))\n    bumped = replace(newest, minor=newest.minor + 1, patch=0)\n    print(f"Bumped: {bumped.major}.{bumped.minor}.{bumped.patch}")']},
  power:{can:['Create immutable, hashable records with frozen=True','Sort dataclasses with order=True and copy with replace()'],
    expand:'Add a `__str__` that returns `major.minor.patch` so you can print versions directly.',
    where:'Frozen dataclasses are perfect for coordinates, money amounts, cache keys and config.',
    next:'Next: __post_init__ for validation and computed fields.'},
  codex:{title:'frozen and order',body:'@dataclass(frozen=True) = read-only + hashable. order=True adds <, > comparing fields top to bottom. replace(obj, field=value) makes a modified copy.',snip:R`@dataclass(frozen=True, order=True)
class Point:
    x: int
    y: int`}
},
{
  id:'r11-04', realm:11, n:4, title:'__post_init__: validate and derive',
  teaches:['dc-post'], requires:['dc-frozen'],
  story:`"The generated __init__ copies fields in," Quill says, "but a ledger entry with **negative quantity** is garbage. After the generated setup, Python calls a hook: \`__post_init__\`. Use it to check, clean up and derive."`,
  concept:{
    html:`\`__post_init__\` runs **right after** the generated \`__init__\`:\n\n\`\`\`\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass Order:\n    item: str\n    qty: int\n    price: float\n    total: float = field(init=False)          # computed, not passed in\n\n    def __post_init__(self):\n        if self.qty <= 0:\n            raise ValueError("qty must be positive")\n        self.item = self.item.strip().lower()    # clean input\n        self.total = self.qty * self.price       # derive\n\`\`\`\n\n- Use it for **validation**, **normalising** (strip/lower) and **derived** fields.\n- \`field(init=False)\` keeps a computed field out of the constructor arguments.\n- ⚠️ A derived field set once goes **stale** if \`qty\` changes later. For always-live values prefer a \`@property\` (you saw this in the Guildhall).\n- In a **frozen** dataclass you can't assign normally in \`__post_init__\`; use \`object.__setattr__(self, "total", value)\` (rarely needed).`,
    analogy:`A goods-in desk: the delivery is accepted (init), then checked and labelled (post_init).`,
    example:R`from dataclasses import dataclass, field

@dataclass
class Order:
    item: str
    qty: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        self.item = self.item.strip().lower()
        self.total = self.qty * self.price

o = Order("  Apple ", 3, 0.5)
print(o)`},
  predict:{code:R`from dataclasses import dataclass

@dataclass
class A:
    x: int
    def __post_init__(self):
        self.x = self.x * 2

print(A(4).x)`, q:'What prints?', opts:['8','4','Error'], ans:0, why:'__post_init__ runs after setup and doubles x.'},
  cast:{code:R`from dataclasses import dataclass, field

@dataclass
class Order:
    item: str
    qty: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        self.item = self.item.strip().lower()
        self.total = self.qty * self.price

o = Order("  Apple ", 3, 0.5)
print(o)`, task:'Cast it.'},
  bug:{broken:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    hp: int

    def __post_init__(self):
        if self.hp < 0:
            ValueError("hp cannot be negative")

try:
    Hero("Ada", -5)
    print("built")
except ValueError as error:
    print("Error:", error)`, task:'The ValueError was created but never raised. Add raise. Expected: Error: hp cannot be negative',
    cases:[{inputs:[],tests:[['Raised','lines==["Error: hp cannot be negative"]']]}],
    sol:R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    hp: int

    def __post_init__(self):
        if self.hp < 0:
            raise ValueError("hp cannot be negative")

try:
    Hero("Ada", -5)
    print("built")
except ValueError as error:
    print("Error:", error)`, wrong:[R`from dataclasses import dataclass

@dataclass
class Hero:
    name: str
    hp: int

    def __post_init__(self):
        if self.hp < 0:
            ValueError("hp cannot be negative")

try:
    Hero("Ada", -5)
    print("built")
except ValueError as error:
    print("Error:", error)`]},
  write:{prompt:'Define dataclass `Order(item, qty, price)` with `total` as a field that is **not** an init argument. `__post_init__` strips and lowercases `item`, raises `ValueError("qty must be positive")` if `qty <= 0`, raises `ValueError("price cannot be negative")` if `price < 0`, and sets `total = qty * price`. Ask `Order: ` as `item qty price` (item has no spaces). Print `<item> x<qty> = <total, 2 decimals>`, or `Error: <message>` for a `ValueError` (non-numbers count: print `Error: bad number`).',
    starter:R`from dataclasses import dataclass, field

parts = input("Order: ").split()
`,
    inputs:['Apple 3 0.5'],
    cases:[{inputs:['Apple 3 0.5'],tests:[['Good','lines[-1]=="apple x3 = 1.50"'],['Total is not an init arg','"total" not in __import__("inspect").signature(g["Order"]).parameters'],['Cleans','g["Order"]("  PEAR ",1,1.0).item=="pear"']]},{inputs:['gem 0 5'],tests:[['Zero qty','lines[-1]=="Error: qty must be positive"']]},{inputs:['gem 1 -2'],tests:[['Negative price','lines[-1]=="Error: price cannot be negative"']]},{inputs:['gem x 2'],tests:[['Bad number','lines[-1]=="Error: bad number"']]},{inputs:['rope 2 0'],tests:[['Free is fine','lines[-1]=="rope x2 = 0.00"']]}],
    sol:R`from dataclasses import dataclass, field

@dataclass
class Order:
    item: str
    qty: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        self.item = self.item.strip().lower()
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        if self.price < 0:
            raise ValueError("price cannot be negative")
        self.total = self.qty * self.price

parts = input("Order: ").split()
try:
    try:
        qty, price = int(parts[1]), float(parts[2])
    except (ValueError, IndexError):
        raise ValueError("bad number")
    order = Order(parts[0], qty, price)
except ValueError as error:
    print("Error:", error)
else:
    print(f"{order.item} x{order.qty} = {order.total:.2f}")`,
    wrong:[R`from dataclasses import dataclass, field

@dataclass
class Order:
    item: str
    qty: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        self.item = self.item.strip().lower()
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        self.total = self.qty * self.price

parts = input("Order: ").split()
try:
    try:
        qty, price = int(parts[1]), float(parts[2])
    except (ValueError, IndexError):
        raise ValueError("bad number")
    order = Order(parts[0], qty, price)
except ValueError as error:
    print("Error:", error)
else:
    print(f"{order.item} x{order.qty} = {order.total:.2f}")`, R`from dataclasses import dataclass, field

@dataclass
class Order:
    item: str
    qty: int
    price: float
    total: float = field(init=False)

    def __post_init__(self):
        if self.qty <= 0:
            raise ValueError("qty must be positive")
        if self.price < 0:
            raise ValueError("price cannot be negative")
        self.total = self.qty * self.price

parts = input("Order: ").split()
try:
    try:
        qty, price = int(parts[1]), float(parts[2])
    except (ValueError, IndexError):
        raise ValueError("bad number")
    order = Order(parts[0], qty, price)
except ValueError as error:
    print("Error:", error)
else:
    print(f"{order.item} x{order.qty} = {order.total:.2f}")`],
    hints:['total: float = field(init=False) keeps it out of the constructor.','In __post_init__: clean item, validate qty and price (raise ValueError), then compute total.','Convert qty/price in a try; turn conversion failures into ValueError("bad number").','from dataclasses import dataclass, field\n\n@dataclass\nclass Order:\n    item: str\n    qty: int\n    price: float\n    total: float = field(init=False)\n\n    def __post_init__(self):\n        self.item = self.item.strip().lower()\n        if self.qty <= 0:\n            raise ValueError("qty must be positive")\n        if self.price < 0:\n            raise ValueError("price cannot be negative")\n        self.total = self.qty * self.price\n\nparts = input("Order: ").split()\ntry:\n    try:\n        qty, price = int(parts[1]), float(parts[2])\n    except (ValueError, IndexError):\n        raise ValueError("bad number")\n    order = Order(parts[0], qty, price)\nexcept ValueError as error:\n    print("Error:", error)\nelse:\n    print(f"{order.item} x{order.qty} = {order.total:.2f}")']},
  power:{can:['Validate and normalise dataclass fields in __post_init__','Create computed init=False fields'],
    expand:'Replace the stored `total` with a `@property` and notice it can never go stale.',
    where:'Validated records are the backbone of data pipelines and API models.',
    next:'Next: asdict, astuple and fields: dataclasses meet JSON.'},
  codex:{title:'__post_init__',body:'Runs after the generated __init__: validate (raise ValueError), normalise, derive. field(init=False) for computed fields. Prefer @property for always-live values.',snip:R`def __post_init__(self):
    if self.qty <= 0:
        raise ValueError("qty must be positive")`}
},
{
  id:'r11-05', realm:11, n:5, title:'asdict, replace and fields: dataclasses meet JSON',
  teaches:['dc-tools'], requires:['dc-post'],
  story:`"A record that cannot leave the program is a prisoner," Quill says, handing you a courier satchel. "Turn it into a **dict**, then into **JSON**, send it away, and rebuild it on the other side."`,
  concept:{
    html:`The \`dataclasses\` module has helpers:\n\n\`\`\`\nfrom dataclasses import dataclass, asdict, astuple, fields, replace\nimport json\n\n@dataclass\nclass Hero:\n    name: str\n    hp: int = 20\n\nh = Hero("Ada", 30)\nasdict(h)                    # {'name': 'Ada', 'hp': 30}   (recursive: nested dataclasses too)\nastuple(h)                   # ('Ada', 30)\n[f.name for f in fields(h)]  # ['name', 'hp']\nreplace(h, hp=5)             # a modified COPY\n\ntext = json.dumps(asdict(h)) # to JSON text\nback = Hero(**json.loads(text))   # rebuild: ** unpacks the dict into keyword args\n\`\`\`\n\n- \`Hero(**data)\` works when the dict's keys match the field names exactly. Extra keys raise \`TypeError\`; missing required keys raise \`TypeError\` too.\n- \`asdict\` copies lists and dicts it finds (deep copy of the structure).\n- For loading untrusted data, **validate** (in \`__post_init__\`) and catch \`TypeError\`/\`ValueError\`.`,
    analogy:`Packing a suitcase (asdict + JSON) and unpacking it at the other end (Hero(**data)).`,
    example:R`from dataclasses import dataclass, asdict, replace
import json

@dataclass
class Hero:
    name: str
    hp: int = 20

h = Hero("Ada", 30)
text = json.dumps(asdict(h))
print(text)
back = Hero(**json.loads(text))
print(back == h, replace(h, hp=5))`},
  predict:{code:R`from dataclasses import dataclass, asdict

@dataclass
class P:
    x: int
    y: int

print(asdict(P(1, 2)))`, q:'What prints?', opts:["{'x': 1, 'y': 2}","(1, 2)","P(x=1, y=2)"], ans:0, why:'asdict gives a dict of field names to values.'},
  cast:{code:R`from dataclasses import dataclass, asdict, replace
import json

@dataclass
class Hero:
    name: str
    hp: int = 20

h = Hero("Ada", 30)
text = json.dumps(asdict(h))
print(text)
back = Hero(**json.loads(text))
print(back == h, replace(h, hp=5))`, task:'Cast it.'},
  bug:{broken:R`from dataclasses import dataclass
import json

@dataclass
class Hero:
    name: str
    hp: int = 20

print(json.dumps(Hero("Ada")))`, task:'TypeError: a Hero object is not JSON serializable. Convert it with asdict first. Expected: {"name": "Ada", "hp": 20}',
    cases:[{inputs:[],tests:[['JSON','lines==[\'{"name": "Ada", "hp": 20}\']']]}],
    sol:R`from dataclasses import dataclass, asdict
import json

@dataclass
class Hero:
    name: str
    hp: int = 20

print(json.dumps(asdict(Hero("Ada"))))`, wrong:[R`import json

print(json.dumps({"name": "Ada"}))`]},
  write:{prompt:'Define dataclass `Hero(name, hp=20, items=[] via default_factory)`. Ask `JSON: ` (one line of JSON like `{"name": "Ada", "hp": 30}`). Rebuild a Hero with `Hero(**data)`. Print `Loaded: <repr>`, then print the hero with `hp` increased by 10 using `replace` as JSON text (via `asdict`, `json.dumps`). If the text is not valid JSON print `Invalid JSON`; if the fields don\'t fit the Hero (missing name, unknown key) print `Bad hero`.',
    starter:R`from dataclasses import dataclass, field, asdict, replace
import json

text = input("JSON: ")
`,
    inputs:['{"name": "Ada", "hp": 30}'],
    cases:[{inputs:['{"name": "Ada", "hp": 30}'],tests:[['Loaded','lines[-2:]==["Loaded: Hero(name=\'Ada\', hp=30, items=[])","{\\"name\\": \\"Ada\\", \\"hp\\": 40, \\"items\\": []}"]'],['Own lists','g["Hero"]("a").items is not g["Hero"]("b").items'],['Copies with replace','"hp +=" not in src and "replace(hero" in src']]},{inputs:['{"name": "Bo"}'],tests:[['Defaults','lines[-1]=="{\\"name\\": \\"Bo\\", \\"hp\\": 30, \\"items\\": []}"']]},{inputs:['{"name": "Cy", "items": ["axe"]}'],tests:[['Items','lines[-1]=="{\\"name\\": \\"Cy\\", \\"hp\\": 30, \\"items\\": [\\"axe\\"]}"']]},{inputs:['{"hp": 5}'],tests:[['Missing name','lines[-1]=="Bad hero"']]},{inputs:['{"name": "D", "mana": 3}'],tests:[['Unknown key','lines[-1]=="Bad hero"']]},{inputs:['not json'],tests:[['Not JSON','lines[-1]=="Invalid JSON"']]},{inputs:['[1, 2]'],tests:[['A list is not a hero','lines[-1]=="Bad hero"']]}],
    sol:R`from dataclasses import dataclass, field, asdict, replace
import json

@dataclass
class Hero:
    name: str
    hp: int = 20
    items: list = field(default_factory=list)

text = input("JSON: ")
try:
    data = json.loads(text)
except json.JSONDecodeError:
    print("Invalid JSON")
else:
    try:
        hero = Hero(**data)
    except TypeError:
        print("Bad hero")
    else:
        print("Loaded:", hero)
        print(json.dumps(asdict(replace(hero, hp=hero.hp + 10))))`,
    wrong:[R`from dataclasses import dataclass, field, asdict, replace
import json

@dataclass
class Hero:
    name: str
    hp: int = 20
    items: list = field(default_factory=list)

text = input("JSON: ")
try:
    data = json.loads(text)
except json.JSONDecodeError:
    print("Invalid JSON")
else:
    try:
        hero = Hero(**data)
    except TypeError:
        print("Bad hero")
    else:
        print("Loaded:", hero)
        hero.hp += 10
        print(json.dumps(asdict(hero)))`, R`from dataclasses import dataclass, field, asdict, replace
import json

@dataclass
class Hero:
    name: str
    hp: int = 20
    items: list = field(default_factory=list)

text = input("JSON: ")
try:
    data = json.loads(text)
    hero = Hero(**data)
except json.JSONDecodeError:
    print("Invalid JSON")
else:
    print("Loaded:", hero)
    print(json.dumps(asdict(replace(hero, hp=hero.hp + 10))))`],
    hints:['json.loads raises json.JSONDecodeError for bad text; Hero(**data) raises TypeError for wrong keys (and for a list).','replace(hero, hp=hero.hp + 10) makes the stronger copy; json.dumps(asdict(...)) turns it into text.','Use nested try blocks so each failure prints its own message.','from dataclasses import dataclass, field, asdict, replace\nimport json\n\n@dataclass\nclass Hero:\n    name: str\n    hp: int = 20\n    items: list = field(default_factory=list)\n\ntext = input("JSON: ")\ntry:\n    data = json.loads(text)\nexcept json.JSONDecodeError:\n    print("Invalid JSON")\nelse:\n    try:\n        hero = Hero(**data)\n    except TypeError:\n        print("Bad hero")\n    else:\n        print("Loaded:", hero)\n        print(json.dumps(asdict(replace(hero, hp=hero.hp + 10))))']},
  power:{can:['Convert dataclasses to dicts and JSON and back','Copy records with changes using replace()'],
    expand:'Save a list of heroes to a JSON file and load it back.',
    where:'APIs, config files and saved games all move dataclasses through JSON.',
    next:'Next: Enums, named constants that can\'t be misspelt.'},
  codex:{title:'dataclass helpers',body:'asdict(obj) -> dict (recursive); astuple; fields(obj); replace(obj, f=v) -> modified copy. Rebuild with Cls(**dict). JSON: json.dumps(asdict(obj)).',snip:R`hero = Hero(**json.loads(text))
json.dumps(asdict(hero))`}
},
{
  id:'r11-06', realm:11, n:6, title:'Enum: named choices that cannot be misspelt',
  teaches:['enum-basic'], requires:['dc-tools'],
  story:`A guard shouts "ATTACK!" and the apprentice hears "attack", "Attack" and "atack" in the confusion. "Strings invite typos," Quill sighs. "A fixed set of choices should be an **Enum**."`,
  concept:{
    html:`\`\`\`\nfrom enum import Enum, auto\n\nclass Direction(Enum):\n    NORTH = "n"\n    SOUTH = "s"\n    EAST  = "e"\n    WEST  = "w"\n\nd = Direction.NORTH\nd.name           # 'NORTH'\nd.value          # 'n'\nDirection("s")   # Direction.SOUTH (look up by VALUE; ValueError if unknown)\nDirection["EAST"]# Direction.EAST  (look up by NAME; KeyError if unknown)\nfor d in Direction:     # iterate the members in definition order\n    print(d.name)\n\`\`\`\n\n- Compare with \`is\` or \`==\`: \`d is Direction.NORTH\`.\n- A typo like \`Direction.NORHT\` is an **AttributeError right away**, whereas the string \`"norht"\` would silently never match.\n- \`auto()\` assigns 1, 2, 3 ... when the values don't matter.\n- Members can have methods and properties.\n- Great as dataclass field types: \`direction: Direction\`.\n- \`class Color(str, Enum)\` / \`IntEnum\` make members behave like strings/ints too (handy for JSON).`,
    analogy:`A traffic light: exactly three states, and no way to invent a fourth by mistyping.`,
    example:R`from enum import Enum, auto

class Direction(Enum):
    NORTH = "n"
    SOUTH = "s"

class Level(Enum):
    LOW = auto()
    HIGH = auto()

print(Direction.NORTH.name, Direction.NORTH.value)
print(Direction("s"), Direction["NORTH"])
print([l.value for l in Level])`},
  predict:{code:R`from enum import Enum

class C(Enum):
    RED = 1

try:
    C(5)
except ValueError:
    print("no such value")`, q:'What prints?', opts:['no such value','Nothing','C.RED'], ans:0, why:'Looking up an unknown value raises ValueError.'},
  cast:{code:R`from enum import Enum, auto

class Direction(Enum):
    NORTH = "n"
    SOUTH = "s"

class Level(Enum):
    LOW = auto()
    HIGH = auto()

print(Direction.NORTH.name, Direction.NORTH.value)
print(Direction("s"), Direction["NORTH"])
print([l.value for l in Level])`, task:'Cast it.'},
  bug:{broken:R`from enum import Enum

class Color(Enum):
    RED = "r"
    BLUE = "b"

print(Color.GREEN)`, task:'AttributeError: GREEN does not exist. Add the missing member. Expected: Color.GREEN',
    cases:[{inputs:[],tests:[['Exists','lines==["Color.GREEN"]'],['Real member','"GREEN =" in src']]}],
    sol:R`from enum import Enum

class Color(Enum):
    RED = "r"
    BLUE = "b"
    GREEN = "g"

print(Color.GREEN)`, wrong:[R`from enum import Enum

class Color(Enum):
    RED = "r"
    BLUE = "b"

print("Color.GREEN")`]},
  write:{prompt:'Define Enum `Move` with members `UP="u"`, `DOWN="d"`, `LEFT="l"`, `RIGHT="r"`, and give it a **method** `delta()` returning `(dx, dy)` (`UP` is `(0, 1)`, `DOWN` `(0, -1)`, `LEFT` `(-1, 0)`, `RIGHT` `(1, 0)`). Ask `Moves: ` (letters like `uurd`; a letter that isn\'t a move is skipped). Start at (0, 0), apply each move, and print `Position: (x, y)` and `Moves used: <count of valid moves>`.',
    starter:R`from enum import Enum

text = input("Moves: ")
`,
    inputs:['uurd'],
    cases:[{inputs:['uurd'],tests:[['Walk','lines[-2:]==["Position: (1, 1)","Moves used: 4"]'],['Enum','issubclass(g["Move"],__import__("enum").Enum)'],['Lookup by value','g["Move"]("l").name=="LEFT" and g["Move"].UP.delta()==(0,1)'],['All deltas','[m.delta() for m in g["Move"]]==[(0,1),(0,-1),(-1,0),(1,0)]']]},{inputs:[''],tests:[['No moves','lines[-2:]==["Position: (0, 0)","Moves used: 0"]']]},{inputs:['xuz'],tests:[['Skip invalid','lines[-2:]==["Position: (0, 1)","Moves used: 1"]']]},{inputs:['llll'],tests:[['Left','lines[-2:]==["Position: (-4, 0)","Moves used: 4"]']]},{inputs:['UD'],tests:[['Case sensitive','lines[-2:]==["Position: (0, 0)","Moves used: 0"]']]}],
    sol:R`from enum import Enum

class Move(Enum):
    UP = "u"
    DOWN = "d"
    LEFT = "l"
    RIGHT = "r"

    def delta(self):
        return {"u": (0, 1), "d": (0, -1), "l": (-1, 0), "r": (1, 0)}[self.value]

text = input("Moves: ")
x = y = used = 0
for letter in text:
    try:
        move = Move(letter)
    except ValueError:
        continue
    dx, dy = move.delta()
    x += dx
    y += dy
    used += 1
print(f"Position: ({x}, {y})")
print("Moves used:", used)`,
    wrong:[R`text = input("Moves: ")
x = y = used = 0
for letter in text:
    if letter == "u":
        y += 1
    elif letter == "d":
        y -= 1
    elif letter == "l":
        x -= 1
    elif letter == "r":
        x += 1
    else:
        continue
    used += 1
print(f"Position: ({x}, {y})")
print("Moves used:", used)`, R`from enum import Enum

class Move(Enum):
    UP = "u"
    DOWN = "d"
    LEFT = "l"
    RIGHT = "r"

    def delta(self):
        return {"u": (0, 1), "d": (0, -1), "l": (-1, 0), "r": (1, 0)}[self.value]

text = input("Moves: ")
x = y = used = 0
for letter in text.lower():
    try:
        move = Move(letter)
    except ValueError:
        continue
    dx, dy = move.delta()
    x += dx
    y += dy
    used += 1
print(f"Position: ({x}, {y})")
print("Moves used:", used)`],
    hints:['class Move(Enum): with UP = "u" and so on. Move(letter) looks up by value and raises ValueError if unknown.','delta(self) can use a dict keyed by self.value (or compare self to Move.UP).','try: move = Move(letter) except ValueError: continue.','from enum import Enum\n\nclass Move(Enum):\n    UP = "u"\n    DOWN = "d"\n    LEFT = "l"\n    RIGHT = "r"\n\n    def delta(self):\n        return {"u": (0, 1), "d": (0, -1), "l": (-1, 0), "r": (1, 0)}[self.value]\n\ntext = input("Moves: ")\nx = y = used = 0\nfor letter in text:\n    try:\n        move = Move(letter)\n    except ValueError:\n        continue\n    dx, dy = move.delta()\n    x += dx\n    y += dy\n    used += 1\nprint(f"Position: ({x}, {y})")\nprint("Moves used:", used)']},
  power:{can:['Define fixed sets of choices with Enum','Look members up by name and by value'],
    expand:'Add `Move.parse(text)` as a classmethod returning the member or None.',
    where:'Statuses, roles, directions, HTTP methods and card suits are all enums.',
    next:'Next: Real-World Mission: the Quest Log.'},
  codex:{title:'Enum',body:'class Color(Enum): RED = "r". .name / .value; Color("r") by value (ValueError), Color["RED"] by name (KeyError). Iterate members. auto() numbers them. Typos fail loudly.',snip:R`class Move(Enum):
    UP = "u"
Move("u")`}
},
{
  id:'r11-07', realm:11, n:7, title:'Real-World Mission: The Quest Log',
  teaches:['mission11a'], requires:['enum-basic','dc-tools'],
  story:`The Warden unrolls a tattered quest board. "Quests are scribbled on scraps: *title, difficulty, reward, status*. Build me a **Quest Log** with proper types: a dataclass for each quest, an enum for status, and a log that saves to and loads from JSON."`,
  concept:{
    html:`This mission combines the whole dataclass toolkit:\n\n- \`Status\` Enum: \`OPEN\`, \`ACTIVE\`, \`DONE\`.\n- \`Quest\` dataclass: \`title\`, \`reward\` (validated in \`__post_init__\`), \`status\` (default OPEN).\n- \`QuestLog\` class: holds quests, enforces rules, and converts to/from JSON.\n\nSerialising an Enum: store its **value** (\`quest.status.value\`) and rebuild with \`Status(value)\`.\n\n\`\`\`\ndef to_json(self):\n    return json.dumps([{"title": q.title, "reward": q.reward, "status": q.status.value}\n                       for q in self.quests])\n\n@classmethod\ndef from_json(cls, text):\n    log = cls()\n    for row in json.loads(text):\n        log.add(Quest(row["title"], row["reward"], Status(row["status"])))\n    return log\n\`\`\`\n\nA round trip (\`from_json(to_json())\`) must give back an equal log: test that!`,
    analogy:`A noticeboard with a strict clerk: every notice follows a form and has a stamp from a fixed set.`,
    example:R`from enum import Enum
from dataclasses import dataclass

class Status(Enum):
    OPEN = "open"
    DONE = "done"

@dataclass
class Quest:
    title: str
    reward: int
    status: Status = Status.OPEN

q = Quest("Slay rats", 10)
print(q)
print(Status("done"))`},
  predict:{code:R`from enum import Enum

class S(Enum):
    A = "a"

print(S.A.value, S("a") is S.A)`, q:'What prints?', opts:['a True','A True','a False'], ans:0, why:'value is "a", and lookup by value returns the same member.'},
  cast:{code:R`from enum import Enum
from dataclasses import dataclass

class Status(Enum):
    OPEN = "open"
    DONE = "done"

@dataclass
class Quest:
    title: str
    reward: int
    status: Status = Status.OPEN

q = Quest("Slay rats", 10)
print(q)
print(Status("done"))`, task:'Cast it.'},
  bug:{broken:R`import json
from enum import Enum

class Status(Enum):
    OPEN = "open"

print(json.dumps({"status": Status.OPEN}))`, task:'TypeError: an Enum member is not JSON serializable. Store its value. Expected: {"status": "open"}',
    cases:[{inputs:[],tests:[['Value','lines==[\'{"status": "open"}\']']]}],
    sol:R`import json
from enum import Enum

class Status(Enum):
    OPEN = "open"

print(json.dumps({"status": Status.OPEN.value}))`, wrong:[R`import json

print(json.dumps({"status": "OPEN"}))`]},
  write:{prompt:'Build the quest log. `Status` Enum (`OPEN="open"`, `ACTIVE="active"`, `DONE="done"`). Dataclass `Quest(title, reward, status=Status.OPEN)`; `reward` must be 1 or more (`ValueError("Reward must be positive")`). `QuestLog` with `add(quest)` (`ValueError("Duplicate quest: <title>")`), `start(title)` (only OPEN quests: `ValueError("<title> is not open")`), `finish(title)` (only ACTIVE: `ValueError("<title> is not active")`), `get` (`ValueError("No such quest: <title>")`), `earned()` (total reward of DONE quests), and `to_json()` / classmethod `from_json(text)`. Commands (prompt `> `): `add <title> <reward>`, `start <title>`, `finish <title>`, `list`, `earned`, `save`, `quit`. `list` prints `<title> [<status value>] <reward>` in the order added (or `No quests`). `earned` prints `Earned: <n>`. `save` prints the JSON and then prints `Round trip: OK` only if loading the JSON back gives the same quests. Errors print `Error: <message>`; a non-number reward prints `Error: Bad reward`; anything else `Unknown command`. Titles have no spaces.',
    starter:R`from dataclasses import dataclass
from enum import Enum
import json

class Status(Enum):
    pass

log = None
`,
    inputs:['add Rats 10','add Dragon 100','start Rats','finish Rats','list','earned','quit'],
    cases:[{inputs:['add Rats 10','add Dragon 100','start Rats','finish Rats','list','earned','quit'],tests:[['Session','[l for l in lines if not l.startswith("> ")]==["Rats [done] 10","Dragon [open] 100","Earned: 10"]'],['Quest is a dataclass','__import__("dataclasses").is_dataclass(g["Quest"])'],['Status is an enum','issubclass(g["Status"],__import__("enum").Enum)']]},{inputs:['list','earned','quit'],tests:[['Empty','[l for l in lines if not l.startswith("> ")]==["No quests","Earned: 0"]']]},{inputs:['add A 5','add A 6','quit'],tests:[['Duplicate','[l for l in lines if not l.startswith("> ")]==["Error: Duplicate quest: A"]']]},{inputs:['add A 0','add B x','quit'],tests:[['Rewards','[l for l in lines if not l.startswith("> ")]==["Error: Reward must be positive","Error: Bad reward"]']]},{inputs:['finish Z','start Z','quit'],tests:[['Missing','[l for l in lines if not l.startswith("> ")]==["Error: No such quest: Z","Error: No such quest: Z"]']]},{inputs:['add A 5','finish A','start A','start A','quit'],tests:[['State machine','[l for l in lines if not l.startswith("> ")]==["Error: A is not active","Error: A is not open"]']]},{inputs:['add A 5','start A','save','quit'],tests:[['Save','[l for l in lines if not l.startswith("> ")]==["[{\\"title\\": \\"A\\", \\"reward\\": 5, \\"status\\": \\"active\\"}]","Round trip: OK"]']]},{inputs:['dance','quit'],tests:[['Unknown','[l for l in lines if not l.startswith("> ")]==["Unknown command"]'],['Round trip works alone','(lambda L: (L.add(g["Quest"]("a",3)), L.from_json(L.to_json()).to_json()==L.to_json())[1])(g["QuestLog"]())']]}],
    sol:R`from dataclasses import dataclass
from enum import Enum
import json

class Status(Enum):
    OPEN = "open"
    ACTIVE = "active"
    DONE = "done"

@dataclass
class Quest:
    title: str
    reward: int
    status: Status = Status.OPEN

    def __post_init__(self):
        if self.reward < 1:
            raise ValueError("Reward must be positive")

class QuestLog:
    def __init__(self):
        self.quests = []

    def get(self, title):
        for quest in self.quests:
            if quest.title == title:
                return quest
        raise ValueError(f"No such quest: {title}")

    def add(self, quest):
        if any(q.title == quest.title for q in self.quests):
            raise ValueError(f"Duplicate quest: {quest.title}")
        self.quests.append(quest)

    def start(self, title):
        quest = self.get(title)
        if quest.status is not Status.OPEN:
            raise ValueError(f"{title} is not open")
        quest.status = Status.ACTIVE

    def finish(self, title):
        quest = self.get(title)
        if quest.status is not Status.ACTIVE:
            raise ValueError(f"{title} is not active")
        quest.status = Status.DONE

    def earned(self):
        return sum(q.reward for q in self.quests if q.status is Status.DONE)

    def to_json(self):
        return json.dumps([{"title": q.title, "reward": q.reward, "status": q.status.value}
                           for q in self.quests])

    @classmethod
    def from_json(cls, text):
        log = cls()
        for row in json.loads(text):
            log.add(Quest(row["title"], row["reward"], Status(row["status"])))
        return log

log = QuestLog()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 3 and parts[0] == "add":
            try:
                reward = int(parts[2])
            except ValueError:
                raise ValueError("Bad reward")
            log.add(Quest(parts[1], reward))
        elif len(parts) == 2 and parts[0] == "start":
            log.start(parts[1])
        elif len(parts) == 2 and parts[0] == "finish":
            log.finish(parts[1])
        elif parts == ["list"]:
            if not log.quests:
                print("No quests")
            for q in log.quests:
                print(f"{q.title} [{q.status.value}] {q.reward}")
        elif parts == ["earned"]:
            print("Earned:", log.earned())
        elif parts == ["save"]:
            text = log.to_json()
            print(text)
            print("Round trip: OK" if QuestLog.from_json(text).quests == log.quests else "Round trip: FAILED")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`,
    wrong:[R`from dataclasses import dataclass
from enum import Enum
import json

class Status(Enum):
    OPEN = "open"
    ACTIVE = "active"
    DONE = "done"

@dataclass
class Quest:
    title: str
    reward: int
    status: Status = Status.OPEN

class QuestLog:
    def __init__(self):
        self.quests = []

    def get(self, title):
        for quest in self.quests:
            if quest.title == title:
                return quest
        raise ValueError(f"No such quest: {title}")

    def add(self, quest):
        if any(q.title == quest.title for q in self.quests):
            raise ValueError(f"Duplicate quest: {quest.title}")
        self.quests.append(quest)

    def start(self, title):
        quest = self.get(title)
        if quest.status is not Status.OPEN:
            raise ValueError(f"{title} is not open")
        quest.status = Status.ACTIVE

    def finish(self, title):
        quest = self.get(title)
        if quest.status is not Status.ACTIVE:
            raise ValueError(f"{title} is not active")
        quest.status = Status.DONE

    def earned(self):
        return sum(q.reward for q in self.quests if q.status is Status.DONE)

    def to_json(self):
        return json.dumps([{"title": q.title, "reward": q.reward, "status": q.status.value}
                           for q in self.quests])

    @classmethod
    def from_json(cls, text):
        log = cls()
        for row in json.loads(text):
            log.add(Quest(row["title"], row["reward"], Status(row["status"])))
        return log

log = QuestLog()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 3 and parts[0] == "add":
            try:
                reward = int(parts[2])
            except ValueError:
                raise ValueError("Bad reward")
            log.add(Quest(parts[1], reward))
        elif len(parts) == 2 and parts[0] == "start":
            log.start(parts[1])
        elif len(parts) == 2 and parts[0] == "finish":
            log.finish(parts[1])
        elif parts == ["list"]:
            if not log.quests:
                print("No quests")
            for q in log.quests:
                print(f"{q.title} [{q.status.value}] {q.reward}")
        elif parts == ["earned"]:
            print("Earned:", log.earned())
        elif parts == ["save"]:
            text = log.to_json()
            print(text)
            print("Round trip: OK" if QuestLog.from_json(text).quests == log.quests else "Round trip: FAILED")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`, R`from dataclasses import dataclass
from enum import Enum
import json

class Status(Enum):
    OPEN = "open"
    ACTIVE = "active"
    DONE = "done"

@dataclass
class Quest:
    title: str
    reward: int
    status: Status = Status.OPEN

    def __post_init__(self):
        if self.reward < 1:
            raise ValueError("Reward must be positive")

class QuestLog:
    def __init__(self):
        self.quests = []

    def get(self, title):
        for quest in self.quests:
            if quest.title == title:
                return quest
        raise ValueError(f"No such quest: {title}")

    def add(self, quest):
        if any(q.title == quest.title for q in self.quests):
            raise ValueError(f"Duplicate quest: {quest.title}")
        self.quests.append(quest)

    def start(self, title):
        quest = self.get(title)
        quest.status = Status.ACTIVE

    def finish(self, title):
        quest = self.get(title)
        quest.status = Status.DONE

    def earned(self):
        return sum(q.reward for q in self.quests if q.status is Status.DONE)

    def to_json(self):
        return json.dumps([{"title": q.title, "reward": q.reward, "status": q.status.value}
                           for q in self.quests])

    @classmethod
    def from_json(cls, text):
        log = cls()
        for row in json.loads(text):
            log.add(Quest(row["title"], row["reward"], Status(row["status"])))
        return log

log = QuestLog()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 3 and parts[0] == "add":
            try:
                reward = int(parts[2])
            except ValueError:
                raise ValueError("Bad reward")
            log.add(Quest(parts[1], reward))
        elif len(parts) == 2 and parts[0] == "start":
            log.start(parts[1])
        elif len(parts) == 2 and parts[0] == "finish":
            log.finish(parts[1])
        elif parts == ["list"]:
            if not log.quests:
                print("No quests")
            for q in log.quests:
                print(f"{q.title} [{q.status.value}] {q.reward}")
        elif parts == ["earned"]:
            print("Earned:", log.earned())
        elif parts == ["save"]:
            text = log.to_json()
            print(text)
            print("Round trip: OK" if QuestLog.from_json(text).quests == log.quests else "Round trip: FAILED")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`],
    hints:['Status Enum with three values; Quest dataclass whose __post_init__ rejects rewards below 1.','QuestLog.start/finish check the current status with `is not Status.OPEN` / `ACTIVE` before changing it. get() raises "No such quest".','to_json stores status.value; from_json rebuilds with Status(row["status"]). Dataclass == lets you compare the quest lists for the round-trip check.','from dataclasses import dataclass\nfrom enum import Enum\nimport json\n\nclass Status(Enum):\n    OPEN = "open"\n    ACTIVE = "active"\n    DONE = "done"\n\n@dataclass\nclass Quest:\n    title: str\n    reward: int\n    status: Status = Status.OPEN\n\n    def __post_init__(self):\n        if self.reward < 1:\n            raise ValueError("Reward must be positive")\n\nclass QuestLog:\n    def __init__(self):\n        self.quests = []\n\n    def get(self, title):\n        for quest in self.quests:\n            if quest.title == title:\n                return quest\n        raise ValueError(f"No such quest: {title}")\n\n    def add(self, quest):\n        if any(q.title == quest.title for q in self.quests):\n            raise ValueError(f"Duplicate quest: {quest.title}")\n        self.quests.append(quest)\n\n    def start(self, title):\n        quest = self.get(title)\n        if quest.status is not Status.OPEN:\n            raise ValueError(f"{title} is not open")\n        quest.status = Status.ACTIVE\n\n    def finish(self, title):\n        quest = self.get(title)\n        if quest.status is not Status.ACTIVE:\n            raise ValueError(f"{title} is not active")\n        quest.status = Status.DONE\n\n    def earned(self):\n        return sum(q.reward for q in self.quests if q.status is Status.DONE)\n\n    def to_json(self):\n        return json.dumps([{"title": q.title, "reward": q.reward, "status": q.status.value}\n                           for q in self.quests])\n\n    @classmethod\n    def from_json(cls, text):\n        log = cls()\n        for row in json.loads(text):\n            log.add(Quest(row["title"], row["reward"], Status(row["status"])))\n        return log\n\nlog = QuestLog()\nwhile True:\n    parts = input("> ").split()\n    if parts == ["quit"]:\n        break\n    try:\n        if len(parts) == 3 and parts[0] == "add":\n            try:\n                reward = int(parts[2])\n            except ValueError:\n                raise ValueError("Bad reward")\n            log.add(Quest(parts[1], reward))\n        elif len(parts) == 2 and parts[0] == "start":\n            log.start(parts[1])\n        elif len(parts) == 2 and parts[0] == "finish":\n            log.finish(parts[1])\n        elif parts == ["list"]:\n            if not log.quests:\n                print("No quests")\n            for q in log.quests:\n                print(f"{q.title} [{q.status.value}] {q.reward}")\n        elif parts == ["earned"]:\n            print("Earned:", log.earned())\n        elif parts == ["save"]:\n            text = log.to_json()\n            print(text)\n            print("Round trip: OK" if QuestLog.from_json(text).quests == log.quests else "Round trip: FAILED")\n        else:\n            print("Unknown command")\n    except ValueError as error:\n        print("Error:", error)']},
  power:{can:['Combine dataclasses, enums, validation and JSON in one design','Model a state machine (open, active, done)'],
    expand:'Write the JSON to a file with `save <filename>` and load it with `load <filename>`.',
    where:'Task trackers, order pipelines and game saves all look like this.',
    next:'Next: generators, functions that pause and resume.'},
  codex:{title:'Mission: Quest Log',body:'Enum for states, dataclass for records (validated in __post_init__), a log class enforcing transitions, JSON via .value and Status(value). Test the round trip.',snip:R`"status": q.status.value
Status(row["status"])`}
}
);
