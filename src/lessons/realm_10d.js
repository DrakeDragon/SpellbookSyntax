// REALM 10 — THE GUILDHALL — part D (lessons 29-35: magic methods, library mission, boss, gap)
LESSONS.push(
{
  id:'r10-29', realm:10, n:29, title:'__len__, __getitem__, __contains__: container behaviour',
  teaches:['class-container'], requires:['mission10b'],
  story:`The guild's card deck is a plain object, and apprentices keep asking "how many cards?" and "is the Dragon card in there?" Vael taps the cover. "Teach it to answer to **len()**, **[ ]** and **in**, like any list."`,
  concept:{
    html:`**Magic (dunder) methods** let your objects work with Python's built-in syntax:\n\n| You write | Python calls |\n|---|---|\n| \`len(x)\` | \`x.__len__()\` |\n| \`x[i]\` | \`x.__getitem__(i)\` |\n| \`item in x\` | \`x.__contains__(item)\` |\n| \`bool(x)\` / \`if x:\` | \`x.__bool__()\` (or \`__len__\`) |\n\n\`\`\`\nclass Deck:\n    def __init__(self, cards):\n        self._cards = list(cards)\n\n    def __len__(self):\n        return len(self._cards)\n\n    def __getitem__(self, index):\n        return self._cards[index]          # also gives you slicing and negative indexes\n\n    def __contains__(self, card):\n        return card in self._cards\n\nd = Deck(["ace", "king", "queen"])\nlen(d), d[0], d[-1], "king" in d\n\`\`\`\n\n- Never call dunders yourself (\`d.__len__()\`); use the built-in (\`len(d)\`).\n- If you define \`__len__\` an empty object is falsy: \`if deck:\` works.\n- With \`__getitem__\` alone, a \`for\` loop already works (Python tries 0, 1, 2 ... until \`IndexError\`).\n- Delegating to the inner list gives slicing, negative indexes and errors for free.`,
    analogy:`A uniform: dress your object like a list and it gets treated like a list.`,
    example:R`class Deck:
    def __init__(self, cards):
        self._cards = list(cards)

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, index):
        return self._cards[index]

    def __contains__(self, card):
        return card in self._cards

d = Deck(["ace", "king", "queen"])
print(len(d), d[0], d[-1], "king" in d, "joker" in d)
print(d[0:2])`},
  predict:{code:R`class Bag:
    def __len__(self):
        return 0

print(bool(Bag()))`, q:'What prints?', opts:['False','True','0'], ans:0, why:'With __len__ returning 0 the object is falsy.'},
  cast:{code:R`class Deck:
    def __init__(self, cards):
        self._cards = list(cards)

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, index):
        return self._cards[index]

    def __contains__(self, card):
        return card in self._cards

d = Deck(["ace", "king", "queen"])
print(len(d), d[0], d[-1], "king" in d, "joker" in d)
print(d[0:2])`, task:'Cast it.'},
  bug:{broken:R`class Deck:
    def __init__(self, cards):
        self.cards = list(cards)

d = Deck(["a", "b"])
print(len(d))`, task:'TypeError: Deck has no length. Teach it with __len__. Expected: 2',
    cases:[{inputs:[],tests:[['Two','lines==["2"]']]}],
    sol:R`class Deck:
    def __init__(self, cards):
        self.cards = list(cards)

    def __len__(self):
        return len(self.cards)

d = Deck(["a", "b"])
print(len(d))`, wrong:[R`class Deck:
    def __init__(self, cards):
        self.cards = list(cards)

d = Deck(["a", "b"])
print(len(d))`]},
  write:{prompt:'Build `Deck(cards)` supporting `len()`, indexing/slicing (`[ ]`) and `in`. Ask `Cards: ` (space-separated). Print `Count: <len>`; with no cards print `Empty deck` and stop. Otherwise print `First: <first>`, `Last: <last>`. Then ask `Find: ` and print `Found` or `Missing`.',
    starter:R`class Deck:
    pass

deck = Deck(input("Cards: ").split())
`,
    inputs:['ace king queen','king'],
    cases:[{inputs:['ace king queen','king'],tests:[['Full','lines[-4:]==["Count: 3","First: ace","Last: queen","Found"] or [l for l in lines if not l.endswith(("ace king queen","king"))][-4:]==["Count: 3","First: ace","Last: queen","Found"]'],['len works','len(g["Deck"](["a","b"]))==2'],['Indexing and slices','g["Deck"](["a","b","c"])[1]=="b" and g["Deck"](["a","b","c"])[-1]=="c" and g["Deck"](["a","b","c"])[0:2]==["a","b"]'],['in works','("a" in g["Deck"](["a"])) and ("z" not in g["Deck"](["a"]))'],['Truthiness','not g["Deck"]([]) and bool(g["Deck"](["a"]))'],['Has __contains__','"__contains__" in vars(g["Deck"])']]},{inputs:['ace','joker'],tests:[['Missing','lines[-1]=="Missing"']]},{inputs:['','x'],tests:[['Empty','"Empty deck" in lines and "Count: 0" in lines']]}],
    sol:R`class Deck:
    def __init__(self, cards):
        self._cards = list(cards)

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, index):
        return self._cards[index]

    def __contains__(self, card):
        return card in self._cards

deck = Deck(input("Cards: ").split())
print("Count:", len(deck))
if not deck:
    print("Empty deck")
else:
    print("First:", deck[0])
    print("Last:", deck[-1])
    print("Found" if input("Find: ") in deck else "Missing")`,
    wrong:[R`class Deck:
    def __init__(self, cards):
        self._cards = list(cards)

    def count(self):
        return len(self._cards)

    def first(self):
        return self._cards[0]

    def last(self):
        return self._cards[-1]

    def has(self, card):
        return card in self._cards

deck = Deck(input("Cards: ").split())
print("Count:", deck.count())
if deck.count() == 0:
    print("Empty deck")
else:
    print("First:", deck.first())
    print("Last:", deck.last())
    print("Found" if deck.has(input("Find: ")) else "Missing")`, R`class Deck:
    def __init__(self, cards):
        self._cards = list(cards)

    def __len__(self):
        return len(self._cards)

    def __getitem__(self, index):
        return self._cards[index]

deck = Deck(input("Cards: ").split())
print("Count:", len(deck))
if len(deck) == 0:
    print("Empty deck")
else:
    print("First:", deck[0])
    print("Last:", deck[-1])
    print("Found" if input("Find: ") in deck else "Missing")`],
    hints:['__len__ returns len(self._cards); __getitem__ returns self._cards[index]; __contains__ returns card in self._cards.','Then len(deck), deck[0], deck[-1] and `in deck` all work.','if not deck: works because __len__ gives truthiness.','class Deck:\n    def __init__(self, cards):\n        self._cards = list(cards)\n\n    def __len__(self):\n        return len(self._cards)\n\n    def __getitem__(self, index):\n        return self._cards[index]\n\n    def __contains__(self, card):\n        return card in self._cards\n\ndeck = Deck(input("Cards: ").split())\nprint("Count:", len(deck))\nif not deck:\n    print("Empty deck")\nelse:\n    print("First:", deck[0])\n    print("Last:", deck[-1])\n    print("Found" if input("Find: ") in deck else "Missing")']},
  power:{can:['Make objects work with len, [ ] and in','Understand how Python syntax maps to dunder methods'],
    expand:'Add `__setitem__` and `__delitem__` so cards can be replaced and removed.',
    where:'Pandas DataFrames, NumPy arrays and Django QuerySets all use these same methods.',
    next:'Next: operator overloading with __add__ and friends.'},
  codex:{title:'Container dunders',body:'__len__ -> len(x) and truthiness. __getitem__ -> x[i] and slices. __contains__ -> `in`. Use the built-ins, never call dunders directly.',snip:R`def __len__(self):
    return len(self._cards)`}
},
{
  id:'r10-30', realm:10, n:30, title:'Operator overloading: __add__, __mul__, __eq__',
  teaches:['class-operators'], requires:['class-container'],
  story:`Two scouts report vectors on the map: (2, 3) and (1, 4). "Where do they end up together?" Vael asks. "I want to write \`a + b\`, not \`add_vectors(a, b)\`."`,
  concept:{
    html:`Arithmetic operators are methods too:\n\n| Expression | Method |\n|---|---|\n| \`a + b\` | \`a.__add__(b)\` |\n| \`a - b\` | \`__sub__\` |\n| \`a * 3\` | \`a.__mul__(3)\` |\n| \`3 * a\` | \`a.__rmul__(3)\` (when the left side doesn't know how) |\n| \`-a\` | \`__neg__\` |\n| \`abs(a)\` | \`__abs__\` |\n\n\`\`\`\nclass Vec:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __add__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return Vec(self.x + other.x, self.y + other.y)     # returns a NEW object\n\n    def __mul__(self, k):\n        if not isinstance(k, (int, float)):\n            return NotImplemented\n        return Vec(self.x * k, self.y * k)\n\n    __rmul__ = __mul__                                     # makes 3 * v work too\n\n    def __repr__(self):\n        return f"Vec({self.x}, {self.y})"\n\`\`\`\n\n- **Return a new object**; don't change \`self\`: \`a + b\` shouldn't alter \`a\`.\n- Return \`NotImplemented\` (not raise) for types you can't handle: Python then tries the other side and finally raises a clear \`TypeError\`.\n- Use these where the operator reads **naturally** (vectors, money, times). Don't make \`+\` do something surprising.`,
    analogy:`Teaching a new language to count: once it knows "plus", the sum sign just works.`,
    example:R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return Vec(self.x + other.x, self.y + other.y)

    def __mul__(self, k):
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Vec(self.x * k, self.y * k)

    __rmul__ = __mul__

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

a, b = Vec(2, 3), Vec(1, 4)
print(a + b, a * 3, 2 * b)`},
  predict:{code:R`class N:
    def __init__(self, v): self.v = v
    def __add__(self, o): return N(self.v + o.v)

a = N(1)
b = a + N(2)
print(a.v, b.v)`, q:'What prints?', opts:['1 3','3 3','1 2'], ans:0, why:'+ returns a new object; a is unchanged.'},
  cast:{code:R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return Vec(self.x + other.x, self.y + other.y)

    def __mul__(self, k):
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Vec(self.x * k, self.y * k)

    __rmul__ = __mul__

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

a, b = Vec(2, 3), Vec(1, 4)
print(a + b, a * 3, 2 * b)`, task:'Cast it.'},
  bug:{broken:R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        self.x += other.x
        self.y += other.y
        return self

a = Vec(1, 1)
b = a + Vec(2, 2)
print(a.x, b.x)`, task:'a + b changed a! Return a NEW Vec and leave self alone. Expected: 1 3',
    cases:[{inputs:[],tests:[['a unchanged','lines==["1 3"]']]}],
    sol:R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vec(self.x + other.x, self.y + other.y)

a = Vec(1, 1)
b = a + Vec(2, 2)
print(a.x, b.x)`, wrong:[R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        self.x += other.x
        self.y += other.y
        return self

a = Vec(1, 1)
b = a + Vec(2, 2)
print(a.x, b.x)`]},
  write:{prompt:'Define `Vec(x, y)` with `+`, `-`, `*` by a number (both `v * 2` and `2 * v`), unary `-` and `==`, plus `__repr__` as `Vec(x, y)`. Ask `A: ` and `B: ` as `x y` (whole numbers) and print `Sum: ...`, `Diff: ...`, `Double A: ...`, `Triple B: ...` (written `3 * B`), `Negated A: ...` and `Equal: True/False` (via `==`).',
    starter:R`class Vec:
    pass

ax, ay = map(int, input("A: ").split())
bx, by = map(int, input("B: ").split())
a, b = Vec(ax, ay), Vec(bx, by)
`,
    inputs:['2 3','1 4'],
    cases:[{inputs:['2 3','1 4'],tests:[['All','lines[-6:]==["Sum: Vec(3, 7)","Diff: Vec(1, -1)","Double A: Vec(4, 6)","Triple B: Vec(3, 12)","Negated A: Vec(-2, -3)","Equal: False"]'],['Immutable add','(lambda a: (a+g["Vec"](1,1), (a.x,a.y))[1])(g["Vec"](5,5))==(5,5)'],['Strangers','__import__("unittest").TestCase().assertRaises(TypeError, lambda: g["Vec"](1,1)+5) is None'],['Equality','g["Vec"](1,2)==g["Vec"](1,2) and (g["Vec"](1,2)==5) is False']]},{inputs:['1 1','1 1'],tests:[['Equal','lines[-1]=="Equal: True"']]},{inputs:['0 0','0 0'],tests:[['Zeros','lines[-6:]==["Sum: Vec(0, 0)","Diff: Vec(0, 0)","Double A: Vec(0, 0)","Triple B: Vec(0, 0)","Negated A: Vec(0, 0)","Equal: True"]']]}],
    sol:R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return Vec(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return Vec(self.x - other.x, self.y - other.y)

    def __mul__(self, k):
        if not isinstance(k, (int, float)):
            return NotImplemented
        return Vec(self.x * k, self.y * k)

    __rmul__ = __mul__

    def __neg__(self):
        return Vec(-self.x, -self.y)

    def __eq__(self, other):
        if not isinstance(other, Vec):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

ax, ay = map(int, input("A: ").split())
bx, by = map(int, input("B: ").split())
a, b = Vec(ax, ay), Vec(bx, by)
print("Sum:", a + b)
print("Diff:", a - b)
print("Double A:", a * 2)
print("Triple B:", 3 * b)
print("Negated A:", -a)
print("Equal:", a == b)`,
    wrong:[R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        self.x += other.x
        self.y += other.y
        return self

    def __sub__(self, other):
        return Vec(self.x - other.x, self.y - other.y)

    def __mul__(self, k):
        return Vec(self.x * k, self.y * k)

    __rmul__ = __mul__

    def __neg__(self):
        return Vec(-self.x, -self.y)

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

ax, ay = map(int, input("A: ").split())
bx, by = map(int, input("B: ").split())
a, b = Vec(ax, ay), Vec(bx, by)
print("Sum:", a + b)
print("Diff:", a - b)
print("Double A:", a * 2)
print("Triple B:", 3 * b)
print("Negated A:", -a)
print("Equal:", a == b)`, R`class Vec:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return Vec(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vec(self.x - other.x, self.y - other.y)

    def __mul__(self, k):
        return Vec(self.x * k, self.y * k)

    def __neg__(self):
        return Vec(-self.x, -self.y)

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

    def __repr__(self):
        return f"Vec({self.x}, {self.y})"

ax, ay = map(int, input("A: ").split())
bx, by = map(int, input("B: ").split())
a, b = Vec(ax, ay), Vec(bx, by)
print("Sum:", a + b)
print("Diff:", a - b)
print("Double A:", a * 2)
print("Triple B:", b * 3)
print("Negated A:", -a)
print("Equal:", a == b)`],
    hints:['__add__ and __sub__ return a new Vec built from the coordinates. Return NotImplemented for non-Vecs.','__mul__ handles v * 2; add __rmul__ = __mul__ so 3 * v works. __neg__ negates both parts.','__eq__ compares the coordinate tuples; __repr__ gives Vec(x, y).','class Vec:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n\n    def __add__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return Vec(self.x + other.x, self.y + other.y)\n\n    def __sub__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return Vec(self.x - other.x, self.y - other.y)\n\n    def __mul__(self, k):\n        if not isinstance(k, (int, float)):\n            return NotImplemented\n        return Vec(self.x * k, self.y * k)\n\n    __rmul__ = __mul__\n\n    def __neg__(self):\n        return Vec(-self.x, -self.y)\n\n    def __eq__(self, other):\n        if not isinstance(other, Vec):\n            return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\n    def __repr__(self):\n        return f"Vec({self.x}, {self.y})"\n\nax, ay = map(int, input("A: ").split())\nbx, by = map(int, input("B: ").split())\na, b = Vec(ax, ay), Vec(bx, by)\nprint("Sum:", a + b)\nprint("Diff:", a - b)\nprint("Double A:", a * 2)\nprint("Triple B:", 3 * b)\nprint("Negated A:", -a)\nprint("Equal:", a == b)']},
  power:{can:['Overload +, -, * and == for your own types','Return NotImplemented for unsupported operands'],
    expand:'Add `__abs__` returning the vector\'s length, so `abs(v)` works.',
    where:'Money, durations, matrices, colours and physics vectors all want operator support.',
    next:'Next: making objects iterable with __iter__.'},
  codex:{title:'Operator overloading',body:'__add__, __sub__, __mul__, __rmul__, __neg__, __eq__. Return NEW objects. Return NotImplemented for unknown types. __rmul__ makes 3 * v work.',snip:R`def __add__(self, other):
    return Vec(self.x + other.x, self.y + other.y)`}
},
{
  id:'r10-31', realm:10, n:31, title:'__iter__ and __next__: objects you can loop over',
  teaches:['class-iter'], requires:['class-operators'],
  story:`"Every spell in the grimoire, one after another," Vael says. "A \`for\` loop works on lists, files, dicts. Teach your **Grimoire** to join the club."`,
  concept:{
    html:`A \`for\` loop calls \`iter(x)\` to get an **iterator**, then calls \`next()\` on it until it raises \`StopIteration\`.\n\nThe easiest way to make your own class iterable: define \`__iter__\` and return an iterator. Often that is simply \`iter()\` of an inner list, or a **generator** (\`yield\`):\n\n\`\`\`\nclass Grimoire:\n    def __init__(self, spells):\n        self._spells = list(spells)\n\n    def __iter__(self):\n        return iter(self._spells)          # delegate\n\n# or write __iter__ as a generator:\n    def __iter__(self):\n        for spell in self._spells:\n            yield spell.upper()\n\`\`\`\n\nThe full manual way: a separate iterator object with \`__next__\`:\n\n\`\`\`\nclass Countdown:\n    def __init__(self, start):\n        self.n = start\n\n    def __iter__(self):\n        return self                        # the object is its own iterator\n\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1\n\`\`\`\n\n- Once iterable, you get \`for\`, \`list()\`, \`sorted()\`, \`sum()\`, \`in\`, unpacking ... for free.\n- ⚠️ A "self-iterator" like Countdown is **used up** after one pass. A container (Grimoire) should return a **fresh** iterator from \`__iter__\` each time.`,
    analogy:`A turnstile that hands out the next ticket each time you push, and locks when tickets run out.`,
    example:R`class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

print(list(Countdown(3)))
for x in Countdown(2):
    print(x)`},
  predict:{code:R`it = iter([1, 2])
print(next(it), next(it))
try:
    next(it)
except StopIteration:
    print("done")`, q:'What prints?', opts:['1 2\ndone','1 2','done'], ans:0, why:'A third next() raises StopIteration, which we catch.'},
  cast:{code:R`class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

print(list(Countdown(3)))
for x in Countdown(2):
    print(x)`, task:'Cast it.'},
  bug:{broken:R`class Team:
    def __init__(self, names):
        self.names = list(names)

for name in Team(["Ann", "Bo"]):
    print(name)`, task:'TypeError: Team is not iterable. Add __iter__. Expected: Ann then Bo',
    cases:[{inputs:[],tests:[['Names','lines==["Ann","Bo"]']]}],
    sol:R`class Team:
    def __init__(self, names):
        self.names = list(names)

    def __iter__(self):
        return iter(self.names)

for name in Team(["Ann", "Bo"]):
    print(name)`, wrong:[R`class Team:
    def __init__(self, names):
        self.names = list(names)

for name in Team(["Ann", "Bo"]):
    print(name)`]},
  write:{prompt:'Build `Grimoire(spells)`, **iterable** (use `__iter__`), where iterating yields each spell in **UPPERCASE**. A second class `Countdown(start)` is its own iterator with `__next__`, counting `start, start-1, ... 1`. Ask `Spells: ` (space-separated) and print them one per line via a `for` loop over the Grimoire. Print `Count: <n>` using `len(list(grimoire))`, then ask `Start: ` (whole number) and print `Countdown: ` followed by the numbers separated by spaces (or `Countdown: -` if nothing).',
    starter:R`class Grimoire:
    pass

class Countdown:
    pass

grimoire = Grimoire(input("Spells: ").split())
`,
    inputs:['fire ice','3'],
    cases:[{inputs:['fire ice','3'],tests:[['Spells and countdown','[l for l in lines if l not in ("Spells: fire ice","Start: 3")]==["FIRE","ICE","Count: 2","Countdown: 3 2 1"]'],['Reusable Grimoire','(lambda gr: (list(gr), list(gr)))(g["Grimoire"](["a"]))==(["A"],["A"])'],['Countdown is an iterator','list(g["Countdown"](2))==[2,1] and list(g["Countdown"](0))==[]'],['Has __next__','hasattr(g["Countdown"],"__next__")']]},{inputs:['','0'],tests:[['Nothing','[l for l in lines if not l.startswith(("Spells:","Start:"))]==["Count: 0","Countdown: -"]']]},{inputs:['x','1'],tests:[['One','[l for l in lines if not l.startswith(("Spells:","Start:"))]==["X","Count: 1","Countdown: 1"]']]},{inputs:['a b c','-2'],tests:[['Negative start','lines[-1]=="Countdown: -"']]}],
    sol:R`class Grimoire:
    def __init__(self, spells):
        self._spells = list(spells)

    def __iter__(self):
        for spell in self._spells:
            yield spell.upper()

class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

grimoire = Grimoire(input("Spells: ").split())
for spell in grimoire:
    print(spell)
print("Count:", len(list(grimoire)))
numbers = list(Countdown(int(input("Start: "))))
print("Countdown:", " ".join(str(n) for n in numbers) if numbers else "-")`,
    wrong:[R`class Grimoire:
    def __init__(self, spells):
        self._spells = list(spells)
        self._pos = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._pos >= len(self._spells):
            raise StopIteration
        self._pos += 1
        return self._spells[self._pos - 1].upper()

class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

grimoire = Grimoire(input("Spells: ").split())
for spell in grimoire:
    print(spell)
print("Count:", len(list(grimoire)))
numbers = list(Countdown(int(input("Start: "))))
print("Countdown:", " ".join(str(n) for n in numbers) if numbers else "-")`, R`class Grimoire:
    def __init__(self, spells):
        self._spells = list(spells)

    def __iter__(self):
        for spell in self._spells:
            yield spell

class Countdown:
    def __init__(self, start):
        self.n = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.n <= 0:
            raise StopIteration
        self.n -= 1
        return self.n + 1

grimoire = Grimoire(input("Spells: ").split())
for spell in grimoire:
    print(spell.upper())
print("Count:", len(list(grimoire)))
numbers = list(Countdown(int(input("Start: "))))
print("Countdown:", " ".join(str(n) for n in numbers) if numbers else "-")`],
    hints:['Grimoire.__iter__ can be a generator: for spell in self._spells: yield spell.upper().','Countdown.__iter__ returns self; __next__ raises StopIteration at 0, otherwise decrements and returns the old value.','list(Countdown(n)) collects the numbers; print "-" when the list is empty.','class Grimoire:\n    def __init__(self, spells):\n        self._spells = list(spells)\n\n    def __iter__(self):\n        for spell in self._spells:\n            yield spell.upper()\n\nclass Countdown:\n    def __init__(self, start):\n        self.n = start\n\n    def __iter__(self):\n        return self\n\n    def __next__(self):\n        if self.n <= 0:\n            raise StopIteration\n        self.n -= 1\n        return self.n + 1\n\ngrimoire = Grimoire(input("Spells: ").split())\nfor spell in grimoire:\n    print(spell)\nprint("Count:", len(list(grimoire)))\nnumbers = list(Countdown(int(input("Start: "))))\nprint("Countdown:", " ".join(str(n) for n in numbers) if numbers else "-")']},
  power:{can:['Make a class iterable with __iter__','Write a manual iterator with __next__ and StopIteration'],
    expand:'Make `Grimoire.__iter__` skip any spell that starts with an underscore.',
    where:'Database cursors, file readers and API paginators are iterable objects.',
    next:'Next: __call__ and __bool__: objects that act like functions.'},
  codex:{title:'Iteration protocol',body:'for calls iter(x), then next() until StopIteration. Make a class iterable with __iter__ (return iter(inner) or yield). A self-iterator with __next__ is used up after one pass; containers should return fresh iterators.',snip:R`def __iter__(self):
    for spell in self._spells:
        yield spell.upper()`}
},
{
  id:'r10-32', realm:10, n:32, title:'__call__ and __bool__: callable, truthy objects',
  teaches:['class-call'], requires:['class-iter'],
  story:`"A **Multiplier** that remembers its factor," Vael muses. "I want to write \`double(21)\` like a function, yet carry **state**. And I want \`if double:\` to say whether it's switched on."`,
  concept:{
    html:`\`__call__\` makes an instance **callable** like a function. \`__bool__\` decides truthiness:\n\n\`\`\`\nclass Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n        self.calls = 0\n\n    def __call__(self, value):\n        self.calls += 1\n        return value * self.factor\n\n    def __bool__(self):\n        return self.factor != 0\n\ndouble = Multiplier(2)\ndouble(21)          # 42\ndouble.calls        # 1\nbool(Multiplier(0)) # False\n\`\`\`\n\n- A callable object is a **function with memory**: counters, caches, configuration.\n- \`callable(x)\` tells you if something can be called.\n- \`__bool__\` falls back to \`__len__\`, then to \`True\`.\n- This is how many decorators, validators and strategy objects are written.\n- Plain closures can do the same job; classes win when you need **several** methods or attributes.`,
    analogy:`A vending machine: you call it like a function ("press B4"), but it also remembers its stock.`,
    example:R`class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0

    def __call__(self, value):
        self.calls += 1
        return value * self.factor

    def __bool__(self):
        return self.factor != 0

double = Multiplier(2)
print(double(21), double(5), double.calls)
print(callable(double), bool(Multiplier(0)))`},
  predict:{code:R`class C:
    def __call__(self):
        return "hi"

print(C()(), callable(C()), callable(C))`, q:'What prints?', opts:['hi True True','hi True False','Error'], ans:0, why:'Instances are callable via __call__, and classes themselves are callable too.'},
  cast:{code:R`class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0

    def __call__(self, value):
        self.calls += 1
        return value * self.factor

    def __bool__(self):
        return self.factor != 0

double = Multiplier(2)
print(double(21), double(5), double.calls)
print(callable(double), bool(Multiplier(0)))`, task:'Cast it.'},
  bug:{broken:R`class Doubler:
    def apply(self, x):
        return x * 2

d = Doubler()
print(d(4))`, task:"TypeError: 'Doubler' object is not callable. Make instances callable with __call__. Expected: 8",
    cases:[{inputs:[],tests:[['Eight','lines==["8"]']]}],
    sol:R`class Doubler:
    def __call__(self, x):
        return x * 2

d = Doubler()
print(d(4))`, wrong:[R`class Doubler:
    def apply(self, x):
        return x * 2

d = Doubler()
print(d(4))`]},
  write:{prompt:'Define `Multiplier(factor)`: callable (returns `value * factor`), counts its `calls`, and is falsy when `factor == 0`. Ask `Factor: ` and `Values: ` (space-separated whole numbers). If the multiplier is falsy print `Disabled`. Otherwise print `Results: <each value times the factor, space-separated>` (use `map`) and `Calls: <calls>`.',
    starter:R`class Multiplier:
    pass

m = Multiplier(int(input("Factor: ")))
values = [int(v) for v in input("Values: ").split()]
`,
    inputs:['3','1 2 3'],
    cases:[{inputs:['3','1 2 3'],tests:[['Triple','lines[-2:]==["Results: 3 6 9","Calls: 3"]'],['Callable','g["Multiplier"](5)(2)==10 and callable(g["Multiplier"](1))'],['Counts calls','(lambda m: (m(1), m(2), m.calls)[2])(g["Multiplier"](2))==2'],['Truthiness','bool(g["Multiplier"](2)) and not bool(g["Multiplier"](0))']]},{inputs:['0','1 2'],tests:[['Disabled','lines[-1]=="Disabled"'],['Not run','"Results" not in out']]},{inputs:['-2','4 -1'],tests:[['Negative factor','lines[-2:]==["Results: -8 2","Calls: 2"]']]},{inputs:['2',''],tests:[['No values','lines[-2:]==["Results:","Calls: 0"]']]}],
    sol:R`class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0

    def __call__(self, value):
        self.calls += 1
        return value * self.factor

    def __bool__(self):
        return self.factor != 0

m = Multiplier(int(input("Factor: ")))
values = [int(v) for v in input("Values: ").split()]
if not m:
    print("Disabled")
else:
    results = list(map(m, values))
    print("Results:", *results)
    print("Calls:", m.calls)`,
    wrong:[R`class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0

    def __call__(self, value):
        return value * self.factor

    def __bool__(self):
        return self.factor != 0

m = Multiplier(int(input("Factor: ")))
values = [int(v) for v in input("Values: ").split()]
if not m:
    print("Disabled")
else:
    results = list(map(m, values))
    print("Results:", *results)
    print("Calls:", len(values))`, R`class Multiplier:
    def __init__(self, factor):
        self.factor = factor
        self.calls = 0

    def __call__(self, value):
        self.calls += 1
        return value * self.factor

m = Multiplier(int(input("Factor: ")))
values = [int(v) for v in input("Values: ").split()]
if m.factor == 0:
    print("Disabled")
else:
    results = list(map(m, values))
    print("Results:", *results)
    print("Calls:", m.calls)`],
    hints:['__call__(self, value) increments self.calls and returns value * self.factor.','__bool__ returns self.factor != 0, so `if not m:` works.','map(m, values) calls your object once per value. print("Results:", *results) spaces them out.','class Multiplier:\n    def __init__(self, factor):\n        self.factor = factor\n        self.calls = 0\n\n    def __call__(self, value):\n        self.calls += 1\n        return value * self.factor\n\n    def __bool__(self):\n        return self.factor != 0\n\nm = Multiplier(int(input("Factor: ")))\nvalues = [int(v) for v in input("Values: ").split()]\nif not m:\n    print("Disabled")\nelse:\n    results = list(map(m, values))\n    print("Results:", *results)\n    print("Calls:", m.calls)']},
  power:{can:['Make objects callable with __call__','Control truthiness with __bool__'],
    expand:'Add a `reset()` method that zeroes the call counter.',
    where:'Decorators, validators, event handlers and strategy objects are often callable classes.',
    next:'Next: Real-World Mission: the Guild Library.'},
  codex:{title:'__call__ and __bool__',body:'__call__ lets obj(args) run code with remembered state. __bool__ controls `if obj:` (falls back to __len__, then True). callable(x) checks.',snip:R`def __call__(self, value):
    self.calls += 1
    return value * self.factor`}
},
{
  id:'r10-33', realm:10, n:33, title:'Real-World Mission: The Guild Library',
  teaches:['mission10c'], requires:['class-call','class-inventory'],
  story:`The guild library has 40,000 scrolls and no way to know who borrowed what. "A lender needs three things," says the librarian, "**books, members, and loans**, and a promise that nobody borrows a book that's already out."`,
  concept:{
    html:`This mission ties the realm together: **classes that hold other classes**, validation, properties and magic methods.\n\n- \`Book(title)\`: has a \`borrower\` (None when on the shelf) and a property \`available\`.\n- \`Library\`: owns the books (a dict by title) and enforces the rules: \`add\`, \`borrow\`, \`give_back\`.\n- Members are tracked by name. A member may have **at most 2** books.\n- Make \`Library\` support \`len(lib)\` (number of books) and \`title in lib\` using magic methods.\n\n\`\`\`\ndef borrow(self, title, member):\n    book = self._find(title)           # raises if unknown\n    if not book.available:\n        raise ValueError(f"{title} is already borrowed")\n    if self.count_for(member) >= 2:\n        raise ValueError(f"{member} has too many books")\n    book.borrower = member\n\`\`\`\n\nRules live in the **Library**, validation errors are **ValueErrors**, and the command loop just prints \`Error: <message>\`.`,
    analogy:`A librarian's ledger: each loan is checked against every rule before it is written down.`,
    example:R`class Book:
    def __init__(self, title):
        self.title = title
        self.borrower = None

    @property
    def available(self):
        return self.borrower is None

b = Book("Dragons")
print(b.available)
b.borrower = "Ada"
print(b.available)`},
  predict:{code:R`books = {"a": None, "b": "Ann", "c": "Ann"}
print(sum(1 for who in books.values() if who == "Ann"))`, q:'What prints?', opts:['2','1','3'], ans:0, why:'Two entries are held by Ann.'},
  cast:{code:R`class Book:
    def __init__(self, title):
        self.title = title
        self.borrower = None

    @property
    def available(self):
        return self.borrower is None

b = Book("Dragons")
print(b.available)
b.borrower = "Ada"
print(b.available)`, task:'Cast it.'},
  bug:{broken:R`loans = {"Dragons": "Ann"}

def borrow(title, member):
    loans[title] = member

borrow("Dragons", "Bo")
print(loans["Dragons"])`, task:'Bo just stole Ann\'s book: borrow overwrites without checking. Only borrow when nobody has it. Expected: Ann',
    cases:[{inputs:[],tests:[['Ann keeps it','lines==["Ann"]']]}],
    sol:R`loans = {"Dragons": "Ann"}

def borrow(title, member):
    if title in loans:
        return
    loans[title] = member

borrow("Dragons", "Bo")
print(loans["Dragons"])`, wrong:[R`loans = {"Dragons": "Ann"}

def borrow(title, member):
    loans[title] = member

borrow("Dragons", "Bo")
print(loans["Dragons"])`]},
  write:{prompt:'Build the library. `Book(title)` with `borrower` and property `available`. `Library` supports `add(title)` (`ValueError("<title> already exists")` if present), `borrow(title, member)` (`ValueError("No such book: <title>")`, `ValueError("<title> is already borrowed")`, `ValueError("<member> has too many books")` for a 3rd book), `give_back(title)` (`ValueError("No such book: <title>")`, `ValueError("<title> was not borrowed")`), `len(lib)` and `title in lib`. Commands (prompt `> `): `add <title>`, `borrow <title> <member>`, `return <title>`, `status`, `quit`. `status` prints `Books: <n>, Available: <n>`. Unknown commands print `Unknown command`; every `ValueError` prints `Error: <message>`. Titles have no spaces.',
    starter:R`class Book:
    pass

class Library:
    pass

lib = Library()
`,
    inputs:['add Dragons','add Maps','borrow Dragons Ann','status','return Dragons','status','quit'],
    cases:[{inputs:['add Dragons','add Maps','borrow Dragons Ann','status','return Dragons','status','quit'],tests:[['Session','[l for l in lines if not l.startswith("> ")]==["Books: 2, Available: 1","Books: 2, Available: 2"]'],['len and in','(lambda l: (l.add("x"), (len(l), "x" in l, "y" in l))[1])(g["Library"]())==(1,True,False)'],['Book property','isinstance(vars(g["Book"]).get("available"), property)']]},{inputs:['add A','add A','quit'],tests:[['Duplicate','[l for l in lines if not l.startswith("> ")]==["Error: A already exists"]']]},{inputs:['borrow Z Ann','quit'],tests:[['Unknown','[l for l in lines if not l.startswith("> ")]==["Error: No such book: Z"]']]},{inputs:['add A','borrow A Ann','borrow A Bo','quit'],tests:[['Already out','[l for l in lines if not l.startswith("> ")]==["Error: A is already borrowed"]']]},{inputs:['add A','add B','add C','borrow A Ann','borrow B Ann','borrow C Ann','status','quit'],tests:[['Limit','[l for l in lines if not l.startswith("> ")]==["Error: Ann has too many books","Books: 3, Available: 1"]']]},{inputs:['add A','return A','return Q','quit'],tests:[['Not borrowed','[l for l in lines if not l.startswith("> ")]==["Error: A was not borrowed","Error: No such book: Q"]']]},{inputs:['add A','add B','add C','borrow A Ann','borrow B Ann','return A','borrow C Ann','status','quit'],tests:[['Limit frees up','[l for l in lines if not l.startswith("> ")]==["Books: 3, Available: 1"]']]},{inputs:['dance','borrow A','quit'],tests:[['Unknown command','[l for l in lines if not l.startswith("> ")]==["Unknown command","Unknown command"]']]}],
    sol:R`class Book:
    def __init__(self, title):
        self.title = title
        self.borrower = None

    @property
    def available(self):
        return self.borrower is None

class Library:
    def __init__(self):
        self._books = {}

    def __len__(self):
        return len(self._books)

    def __contains__(self, title):
        return title in self._books

    def _find(self, title):
        if title not in self._books:
            raise ValueError(f"No such book: {title}")
        return self._books[title]

    def add(self, title):
        if title in self._books:
            raise ValueError(f"{title} already exists")
        self._books[title] = Book(title)

    def count_for(self, member):
        return sum(1 for b in self._books.values() if b.borrower == member)

    def available_count(self):
        return sum(1 for b in self._books.values() if b.available)

    def borrow(self, title, member):
        book = self._find(title)
        if not book.available:
            raise ValueError(f"{title} is already borrowed")
        if self.count_for(member) >= 2:
            raise ValueError(f"{member} has too many books")
        book.borrower = member

    def give_back(self, title):
        book = self._find(title)
        if book.available:
            raise ValueError(f"{title} was not borrowed")
        book.borrower = None

lib = Library()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 2 and parts[0] == "add":
            lib.add(parts[1])
        elif len(parts) == 3 and parts[0] == "borrow":
            lib.borrow(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "return":
            lib.give_back(parts[1])
        elif parts == ["status"]:
            print(f"Books: {len(lib)}, Available: {lib.available_count()}")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`,
    wrong:[R`class Book:
    def __init__(self, title):
        self.title = title
        self.borrower = None

    @property
    def available(self):
        return self.borrower is None

class Library:
    def __init__(self):
        self._books = {}

    def __len__(self):
        return len(self._books)

    def __contains__(self, title):
        return title in self._books

    def _find(self, title):
        if title not in self._books:
            raise ValueError(f"No such book: {title}")
        return self._books[title]

    def add(self, title):
        if title in self._books:
            raise ValueError(f"{title} already exists")
        self._books[title] = Book(title)

    def count_for(self, member):
        return sum(1 for b in self._books.values() if b.borrower == member)

    def available_count(self):
        return sum(1 for b in self._books.values() if b.available)

    def borrow(self, title, member):
        book = self._find(title)
        if not book.available:
            raise ValueError(f"{title} is already borrowed")
        book.borrower = member

    def give_back(self, title):
        book = self._find(title)
        if book.available:
            raise ValueError(f"{title} was not borrowed")
        book.borrower = None

lib = Library()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 2 and parts[0] == "add":
            lib.add(parts[1])
        elif len(parts) == 3 and parts[0] == "borrow":
            lib.borrow(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "return":
            lib.give_back(parts[1])
        elif parts == ["status"]:
            print(f"Books: {len(lib)}, Available: {lib.available_count()}")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`, R`class Book:
    def __init__(self, title):
        self.title = title
        self.borrower = None

    @property
    def available(self):
        return self.borrower is None

class Library:
    def __init__(self):
        self._books = {}

    def __len__(self):
        return len(self._books)

    def __contains__(self, title):
        return title in self._books

    def _find(self, title):
        if title not in self._books:
            raise ValueError(f"No such book: {title}")
        return self._books[title]

    def add(self, title):
        if title in self._books:
            raise ValueError(f"{title} already exists")
        self._books[title] = Book(title)

    def count_for(self, member):
        return sum(1 for b in self._books.values() if b.borrower == member)

    def available_count(self):
        return sum(1 for b in self._books.values() if b.available)

    def borrow(self, title, member):
        book = self._find(title)
        if self.count_for(member) >= 2:
            raise ValueError(f"{member} has too many books")
        if not book.available:
            raise ValueError(f"{title} is already borrowed")
        book.borrower = member

    def give_back(self, title):
        book = self._find(title)
        book.borrower = None

lib = Library()
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    try:
        if len(parts) == 2 and parts[0] == "add":
            lib.add(parts[1])
        elif len(parts) == 3 and parts[0] == "borrow":
            lib.borrow(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "return":
            lib.give_back(parts[1])
        elif parts == ["status"]:
            print(f"Books: {len(lib)}, Available: {lib.available_count()}")
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`],
    hints:['Library keeps self._books = {} (title -> Book). A helper _find(title) raises ValueError("No such book: ...").','borrow checks availability and the 2-book limit (count books whose borrower == member) before setting book.borrower. give_back refuses books that are not borrowed.','__len__ returns len(self._books); __contains__ checks the dict. The loop prints "Error:", error for every ValueError.','class Book:\n    def __init__(self, title):\n        self.title = title\n        self.borrower = None\n\n    @property\n    def available(self):\n        return self.borrower is None\n\nclass Library:\n    def __init__(self):\n        self._books = {}\n\n    def __len__(self):\n        return len(self._books)\n\n    def __contains__(self, title):\n        return title in self._books\n\n    def _find(self, title):\n        if title not in self._books:\n            raise ValueError(f"No such book: {title}")\n        return self._books[title]\n\n    def add(self, title):\n        if title in self._books:\n            raise ValueError(f"{title} already exists")\n        self._books[title] = Book(title)\n\n    def count_for(self, member):\n        return sum(1 for b in self._books.values() if b.borrower == member)\n\n    def available_count(self):\n        return sum(1 for b in self._books.values() if b.available)\n\n    def borrow(self, title, member):\n        book = self._find(title)\n        if not book.available:\n            raise ValueError(f"{title} is already borrowed")\n        if self.count_for(member) >= 2:\n            raise ValueError(f"{member} has too many books")\n        book.borrower = member\n\n    def give_back(self, title):\n        book = self._find(title)\n        if book.available:\n            raise ValueError(f"{title} was not borrowed")\n        book.borrower = None\n\nlib = Library()\nwhile True:\n    parts = input("> ").split()\n    if parts == ["quit"]:\n        break\n    try:\n        if len(parts) == 2 and parts[0] == "add":\n            lib.add(parts[1])\n        elif len(parts) == 3 and parts[0] == "borrow":\n            lib.borrow(parts[1], parts[2])\n        elif len(parts) == 2 and parts[0] == "return":\n            lib.give_back(parts[1])\n        elif parts == ["status"]:\n            print(f"Books: {len(lib)}, Available: {lib.available_count()}")\n        else:\n            print("Unknown command")\n    except ValueError as error:\n        print("Error:", error)']},
  power:{can:['Model books, members and rules as cooperating classes','Combine properties, magic methods and validation in one system'],
    expand:'Add a `due_date` to each loan and a `late()` report using the datetime module.',
    where:'Booking, rental and ticketing systems share this exact shape.',
    next:'Next: the Realm 10 boss.'},
  codex:{title:'Mission: Guild Library',body:'The container class enforces all the rules (existence, availability, limits). Items expose state via properties. Magic methods give len() and `in`. Errors are ValueErrors printed by the thin command loop.',snip:R`if not book.available:
    raise ValueError(f"{title} is already borrowed")`}
},
{
  id:'r10-34', realm:10, n:34, title:'Boss: The Hydra of Hidden State', kind:'boss',
  teaches:['realm10-boss'], requires:['mission10c'],
  story:`Behind the library, shelves tremble. A many-headed beast uncoils: the **Hydra of Hidden State**. Each head is a bug every young class-builder meets: shared lists, forgotten \`super()\`, stale totals. "Cut each head with the **right class design**," Vael calls.`,
  boss:{name:'The Hydra of Hidden State', hp:5},
  phases:[
    {type:'mcq', code:R`class Bag:
    items = []
    def add(self, x):
        self.items.append(x)

a, b = Bag(), Bag()
a.add(1)
print(b.items)`, q:'Head 1: What prints?', opts:['[1]','[]','Error'], ans:0,
     why:'items is a class attribute: one list shared by every Bag.', tags:['r10-04']},
    {type:'write', prompt:'Head 2: Build `Counter2` with a **property** `double` that returns twice `n`, a validated `n` (negative raises `ValueError("n cannot be negative")`, also in the constructor), and `__str__` returning `Counter2(<n>)`. Ask `n: ` and print `str(obj)` and `obj.double`, or `Error: <message>` on `ValueError`.',
     starter:R`class Counter2:
    pass

text = input("n: ")
`,
     inputs:['4'],
     cases:[{inputs:['4'],tests:[['Works','lines[-2:]==["Counter2(4)","8"]'],['Property','isinstance(vars(g["Counter2"]).get("double"), property)'],['Constructor validates','__import__("unittest").TestCase().assertRaises(ValueError, g["Counter2"], -1) is None'],['Setter validates','__import__("unittest").TestCase().assertRaises(ValueError, setattr, g["Counter2"](1), "n", -5) is None']]},{inputs:['-3'],tests:[['Negative','lines[-1]=="Error: n cannot be negative"']]},{inputs:['0'],tests:[['Zero','lines[-2:]==["Counter2(0)","0"]']]}],
     sol:R`class Counter2:
    def __init__(self, n=0):
        self.n = n

    @property
    def n(self):
        return self._n

    @n.setter
    def n(self, value):
        if value < 0:
            raise ValueError("n cannot be negative")
        self._n = value

    @property
    def double(self):
        return self._n * 2

    def __str__(self):
        return f"Counter2({self._n})"

text = input("n: ")
try:
    obj = Counter2(int(text))
except ValueError as error:
    print("Error:", error)
else:
    print(str(obj))
    print(obj.double)`,
     wrong:[R`class Counter2:
    def __init__(self, n=0):
        self.n = n

    @property
    def double(self):
        return self.n * 2

    def __str__(self):
        return f"Counter2({self.n})"

text = input("n: ")
try:
    obj = Counter2(int(text))
except ValueError as error:
    print("Error:", error)
else:
    print(str(obj))
    print(obj.double)`, R`class Counter2:
    def __init__(self, n=0):
        if n < 0:
            raise ValueError("n cannot be negative")
        self.n = n
        self.double = n * 2

    def __str__(self):
        return f"Counter2({self.n})"

text = input("n: ")
try:
    obj = Counter2(int(text))
except ValueError as error:
    print("Error:", error)
else:
    print(str(obj))
    print(obj.double)`],
     hints:['n needs a property and a @n.setter that raises ValueError; store in self._n.','__init__ sets self.n = n so the constructor validates too.','double is a read-only @property returning self._n * 2.','class Counter2:\n    def __init__(self, n=0):\n        self.n = n\n\n    @property\n    def n(self):\n        return self._n\n\n    @n.setter\n    def n(self, value):\n        if value < 0:\n            raise ValueError("n cannot be negative")\n        self._n = value\n\n    @property\n    def double(self):\n        return self._n * 2\n\n    def __str__(self):\n        return f"Counter2({self._n})"\n\ntext = input("n: ")\ntry:\n    obj = Counter2(int(text))\nexcept ValueError as error:\n    print("Error:", error)\nelse:\n    print(str(obj))\n    print(obj.double)'],
     tags:['r10-12']},
    {type:'mcq', code:R`class A:
    def __init__(self):
        self.x = 1

class B(A):
    def __init__(self):
        self.y = 2

print(hasattr(B(), "x"))`, q:'Head 3: What prints?', opts:['False','True','Error'], ans:0,
     why:'B.__init__ never called super().__init__(), so x was never set.', tags:['r10-22']},
    {type:'write', prompt:'Head 4: Define `Animal(name)` whose `speak()` raises `NotImplementedError("Subclasses must implement speak()")`, and `Dog`, `Cat` (`Meow`) subclasses. Dog says `Woof`. Ask `Animals: ` like `dog:Rex cat:Tom fish:Bob` and print `<name> says <sound>` for each, in order. Unknown kinds create a plain `Animal` and print `<name> says nothing`. Use a dict of classes, not a chain of ifs.',
     starter:R`class Animal:
    pass

KINDS = {}
`,
     inputs:['dog:Rex cat:Tom fish:Bob'],
     cases:[{inputs:['dog:Rex cat:Tom fish:Bob'],tests:[['Zoo','lines[-3:]==["Rex says Woof","Tom says Meow","Bob says nothing"]'],['Contract','__import__("unittest").TestCase().assertRaises(NotImplementedError, g["Animal"]("x").speak) is None'],['Subclasses','issubclass(g["Dog"],g["Animal"]) and issubclass(g["Cat"],g["Animal"])']]},{inputs:['cat:Z'],tests:[['One','lines[-1]=="Z says Meow"']]},{inputs:[''],tests:[['None','out.strip()=="Animals:"']]}],
     sol:R`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"

KINDS = {"dog": Dog, "cat": Cat}
for word in input("Animals: ").split():
    kind, name = word.split(":")
    animal = KINDS.get(kind, Animal)(name)
    try:
        print(animal.name, "says", animal.speak())
    except NotImplementedError:
        print(animal.name, "says nothing")`,
     wrong:[R`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"

KINDS = {"dog": Dog, "cat": Cat}
for word in input("Animals: ").split():
    kind, name = word.split(":")
    animal = KINDS.get(kind, Animal)(name)
    try:
        print(animal.name, "says", animal.speak())
    except NotImplementedError:
        print(animal.name, "says nothing")`, R`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError("Subclasses must implement speak()")

class Dog(Animal):
    pass

class Cat(Animal):
    pass

KINDS = {"dog": Dog, "cat": Cat}
for word in input("Animals: ").split():
    kind, name = word.split(":")
    animal = KINDS.get(kind, Animal)(name)
    try:
        print(animal.name, "says", animal.speak())
    except NotImplementedError:
        print(animal.name, "says nothing")`],
     hints:['Animal.speak raises NotImplementedError; Dog and Cat override speak.','KINDS = {"dog": Dog, "cat": Cat}; KINDS.get(kind, Animal)(name) picks the class.','Catch NotImplementedError around animal.speak() and print "says nothing".','class Animal:\n    def __init__(self, name):\n        self.name = name\n\n    def speak(self):\n        raise NotImplementedError("Subclasses must implement speak()")\n\nclass Dog(Animal):\n    def speak(self):\n        return "Woof"\n\nclass Cat(Animal):\n    def speak(self):\n        return "Meow"\n\nKINDS = {"dog": Dog, "cat": Cat}\nfor word in input("Animals: ").split():\n    kind, name = word.split(":")\n    animal = KINDS.get(kind, Animal)(name)\n    try:\n        print(animal.name, "says", animal.speak())\n    except NotImplementedError:\n        print(animal.name, "says nothing")'],
     tags:['r10-23','r10-25']},
    {type:'write', prompt:'Head 5: Build `Version(text)` (like `1.2.3`, exactly 3 whole numbers) that compares and sorts **numerically** (`@total_ordering`). Ask `Versions: ` (space-separated; may be empty) and print `Newest: <v>` (the text of the largest) or `None` when empty.',
     starter:R`from functools import total_ordering

class Version:
    pass

words = input("Versions: ").split()
`,
     inputs:['1.9.0 1.10.0 1.2.0'],
     cases:[{inputs:['1.9.0 1.10.0 1.2.0'],tests:[['Numeric','lines[-1]=="Newest: 1.10.0"'],['Equal','g["Version"]("1.0.0")==g["Version"]("1.0.0")'],['Ordering','g["Version"]("1.10.0")>g["Version"]("1.9.0")']]},{inputs:['2.0.0'],tests:[['One','lines[-1]=="Newest: 2.0.0"']]},{inputs:[''],tests:[['None','lines[-1]=="None"']]},{inputs:['0.0.9 0.0.10'],tests:[['Patch','lines[-1]=="Newest: 0.0.10"']]}],
     sol:R`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        parts = text.split(".")
        if len(parts) != 3:
            raise ValueError("bad version")
        self.parts = tuple(int(p) for p in parts)
        self.text = text

    def __eq__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts == other.parts

    def __lt__(self, other):
        if not isinstance(other, Version):
            return NotImplemented
        return self.parts < other.parts

words = input("Versions: ").split()
if not words:
    print("None")
else:
    print("Newest:", max(Version(w) for w in words).text)`,
     wrong:[R`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.text = text

    def __eq__(self, other):
        return self.text == other.text

    def __lt__(self, other):
        return self.text < other.text

words = input("Versions: ").split()
if not words:
    print("None")
else:
    print("Newest:", max(Version(w) for w in words).text)`, R`words = input("Versions: ").split()
if not words:
    print("None")
else:
    print("Newest:", max(words))`],
     hints:['Store tuple(int(p) for p in text.split(".")) and compare the tuples.','__eq__ and __lt__ compare self.parts; @total_ordering fills in the rest.','max(Version(w) for w in words).text gives the newest text.','from functools import total_ordering\n\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        parts = text.split(".")\n        if len(parts) != 3:\n            raise ValueError("bad version")\n        self.parts = tuple(int(p) for p in parts)\n        self.text = text\n\n    def __eq__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts == other.parts\n\n    def __lt__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts < other.parts\n\nwords = input("Versions: ").split()\nif not words:\n    print("None")\nelse:\n    print("Newest:", max(Version(w) for w in words).text)'],
     tags:['r10-17']}
  ],
  power:{can:['Design classes with validation, inheritance and contracts','Avoid shared-state and stale-data traps'],
    expand:'Combine strikes 2 and 5 into a `Release` class that has a version property and a validated name.',
    where:'These heads are the exact bugs reviewers catch in real pull requests.',
    next:'One more gate: the Gap Check for the Guildhall.'},
  codex:{title:'Realm 10 boss',body:'You can build classes with validated properties, inheritance with super(), polymorphism, contracts and ordering. And you know the traps: shared class attributes and forgotten super().',snip:R`class Child(Parent):
    def __init__(self, *args):
        super().__init__(*args)`}
},
{
  id:'r10-35', realm:10, n:35, title:'Gap Check: the Guildhall Trial', kind:'gap', passPct:80,
  teaches:['realm10-gap'], requires:['realm10-boss'],
  story:`The Hydra collapses into a heap of neat index cards, one per head. Vael stamps the stack with the guild seal. "Eighty percent opens the **Iterator Gate**: dataclasses, generators, decorators and context managers, the tools that make classes and functions *elegant*."`,
  phases:[
    {type:'mcq', code:R`class Hero:
    def __init__(self, name):
        name = name

print(hasattr(Hero("Ada"), "name"))`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'Without self., name is just a local variable that vanishes.', tags:['r10-02']},
    {type:'mcq', code:R`class Hero:
    def heal(self, amount):
        return amount

print(Hero().heal())`, q:'What happens?', opts:['TypeError: missing argument','0','None'], ans:0, why:'self is filled in automatically, but amount still needs a value.', tags:['r10-03']},
    {type:'mcq', code:R`class Hero:
    def __init__(self, name):
        self.name = name

print(Hero("Ada"))`, q:'What does it look like?', opts:['<__main__.Hero object at 0x...>','Ada','Hero(Ada)'], ans:0, why:'Without __str__/__repr__, the default text shows the class and memory address.', tags:['r10-05']},
    {type:'mcq', code:R`a = [1, 2]
b = a
b.append(3)
print(a)`, q:'What prints?', opts:['[1, 2, 3]','[1, 2]','[3]'], ans:0, why:'b and a are the same list; names are references.', tags:['r10-08']},
    {type:'mcq', code:R`class R:
    def __init__(self, w, h):
        self.w, self.h = w, h
    @property
    def area(self):
        return self.w * self.h

r = R(2, 3)
r.w = 5
print(r.area)`, q:'What prints?', opts:['15','6','Error'], ans:0, why:'A property recomputes from the current attributes each time.', tags:['r10-11']},
    {type:'mcq', code:R`class H:
    @classmethod
    def make(cls):
        return cls()
class M(H):
    pass
print(type(M.make()).__name__)`, q:'What prints?', opts:['M','H','make'], ans:0, why:'cls is the class the method was called on.', tags:['r10-14']},
    {type:'mcq', code:R`class P:
    def __init__(self, x):
        self.x = x
    def __eq__(self, other):
        return self.x == other.x

try:
    print({P(1)})
except TypeError:
    print("unhashable")`, q:'What prints?', opts:['unhashable','{P}','Nothing'], ans:0, why:'Defining __eq__ without __hash__ makes the class unhashable.', tags:['r10-16']},
    {type:'mcq', code:R`class V:
    def __init__(self):
        self.__s = 1
v = V()
print(hasattr(v, "__s"), hasattr(v, "_V__s"))`, q:'What prints?', opts:['False True','True True','False False'], ans:0, why:'Double underscore names are mangled to _Class__name.', tags:['r10-18']},
    {type:'mcq', code:R`class A:
    def who(self): return "A"
class B(A):
    def who(self): return "B" + super().who()
print(B().who())`, q:'What prints?', opts:['BA','B','A'], ans:0, why:'super().who() runs the parent version, which returns "A".', tags:['r10-22','r10-23']},
    {type:'mcq', code:R`class Shape:
    def area(self):
        raise NotImplementedError

class Tri(Shape):
    pass

try:
    Tri().area()
except NotImplementedError:
    print("override me")`, q:'What prints?', opts:['override me','Nothing','Error'], ans:0, why:'Tri never overrode area, so the base version raised.', tags:['r10-25']},
    {type:'mcq', code:R`class A:
    def hi(self): return "A"
class B:
    def hi(self): return "B"
class C(B, A):
    pass
print(C().hi())`, q:'What prints?', opts:['B','A','Error'], ans:0, why:'The MRO searches B before A.', tags:['r10-27']},
    {type:'mcq', code:R`class Bag:
    def __init__(self):
        self.items = [1, 2]
    def __len__(self):
        return len(self.items)

print(len(Bag()), bool(Bag()))`, q:'What prints?', opts:['2 True','2 False','Error'], ans:0, why:'len works via __len__, and a non-empty object is truthy.', tags:['r10-29']},
    {type:'mcq', code:R`class N:
    def __init__(self, v): self.v = v
    def __add__(self, o): return N(self.v + o.v)

print((N(1) + N(2)).v)`, q:'What prints?', opts:['3','12','Error'], ans:0, why:'+ calls __add__, which returns a new N(3).', tags:['r10-30']}
  ],
  power:{can:['Design and debug classes with confidence','Pass the Guildhall trial'],
    expand:'Pick the phases you found hardest and rebuild them from scratch without looking.',
    where:'Object-oriented design is the vocabulary of professional Python teams.',
    next:'Next: Realm 11, the Iterator Gate.'},
  codex:{title:'Realm 10 gap check',body:'Self, __init__, methods, class attributes, str/repr, references, properties, classmethod, eq/hash, privacy, super, MRO, abstract methods and dunders: all checked.',snip:R`class Hero:
    def __init__(self, name):
        self.name = name`}
}
);
