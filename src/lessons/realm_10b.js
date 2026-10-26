// REALM 10 — THE GUILDHALL — part B (lessons 11-20: properties, class/static methods, equality, ordering, privacy, bank mission)
LESSONS.push(
{
  id:'r10-11', realm:10, n:11, title:'@property: attributes that compute themselves',
  teaches:['class-property'], requires:['class-stack'],
  story:`Vael unrolls a blueprint for a hall. "If the width changes, the **area** must change with it. If you store the area separately, someone will forget to update it, and then your hall lies to you."`,
  concept:{
    html:`A **property** looks like an attribute but runs a method each time you read it:\n\n\`\`\`\nclass Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    @property\n    def area(self):\n        return self.width * self.height\n\n    @property\n    def is_square(self):\n        return self.width == self.height\n\nr = Rect(3, 4)\nprint(r.area)        # 12   (no parentheses!)\nr.width = 10\nprint(r.area)        # 40   always up to date\n\`\`\`\n\n- Use \`@property\` for values that are **derived** from other attributes. **Don't store what you can compute**: stored copies go stale.\n- Read it like an attribute: \`r.area\`. Writing \`r.area()\` is a \`TypeError\` (a number can't be called).\n- A property with **no setter** is read-only: \`r.area = 5\` raises \`AttributeError\`.\n- Properties are cheap to add later: callers never notice the switch from attribute to property.`,
    analogy:`A gauge on a dashboard: it shows the live value; you don't write the number on it yourself.`,
    example:R`class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

r = Rect(3, 4)
print(r.area)
r.width = 10
print(r.area)`},
  predict:{code:R`class Sq:
    def __init__(self, s):
        self.s = s

    @property
    def area(self):
        return self.s * self.s

q = Sq(3)
try:
    q.area = 5
except AttributeError:
    print("locked")`, q:'What prints?', opts:['locked','Nothing','5'], ans:0, why:'A property without a setter is read-only.'},
  cast:{code:R`class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

r = Rect(3, 4)
print(r.area)
r.width = 10
print(r.area)`, task:'Cast it.'},
  bug:{broken:R`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h
        self.area = w * h

r = Rect(4, 2)
r.w = 10
print(r.area)`, task:'The stored area is stale after the width changed. Compute it with a property. Expected: 20',
    cases:[{inputs:[],tests:[['Live','lines==["20"]'],['Uses property','"@property" in src']]}],
    sol:R`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h

    @property
    def area(self):
        return self.w * self.h

r = Rect(4, 2)
r.w = 10
print(r.area)`, wrong:[R`class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h
        self.area = w * h

r = Rect(4, 2)
r.w = 10
print(r.area)`]},
  write:{prompt:'Define `Rect(width, height)` with **properties** `area`, `perimeter` and `is_square`. Ask `W: ` and `H: ` (whole numbers) and print `Area: <n>`, `Perimeter: <n>` and `Square: yes` or `no`.',
    starter:R`class Rect:
    pass

w = int(input("W: "))
h = int(input("H: "))
`,
    inputs:['3','4'],
    cases:[{inputs:['3','4'],tests:[['Rectangle','lines[-3:]==["Area: 12","Perimeter: 14","Square: no"]'],['They are properties','all(isinstance(vars(g["Rect"]).get(n), property) for n in ("area","perimeter","is_square"))'],['Always live','(lambda r: (setattr(r,"width",10), (r.area, r.perimeter, r.is_square))[1])(g["Rect"](3,4))==(40,28,False)'],['Square detected live','(lambda r: (setattr(r,"height",3), r.is_square)[1])(g["Rect"](3,4)) is True']]},{inputs:['5','5'],tests:[['Square','lines[-3:]==["Area: 25","Perimeter: 20","Square: yes"]']]},{inputs:['1','9'],tests:[['Thin','lines[-3:]==["Area: 9","Perimeter: 20","Square: no"]']]}],
    sol:R`class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    @property
    def area(self):
        return self.width * self.height

    @property
    def perimeter(self):
        return 2 * (self.width + self.height)

    @property
    def is_square(self):
        return self.width == self.height

w = int(input("W: "))
h = int(input("H: "))
r = Rect(w, h)
print("Area:", r.area)
print("Perimeter:", r.perimeter)
print("Square:", "yes" if r.is_square else "no")`,
    wrong:[R`class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height
        self.area = width * height
        self.perimeter = 2 * (width + height)
        self.is_square = width == height

w = int(input("W: "))
h = int(input("H: "))
r = Rect(w, h)
print("Area:", r.area)
print("Perimeter:", r.perimeter)
print("Square:", "yes" if r.is_square else "no")`, R`class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def is_square(self):
        return self.width == self.height

w = int(input("W: "))
h = int(input("H: "))
r = Rect(w, h)
print("Area:", r.area())
print("Perimeter:", r.perimeter())
print("Square:", "yes" if r.is_square() else "no")`],
    hints:['Put @property above def area(self): and return the computed value.','perimeter is 2 * (width + height); is_square compares width and height.','Read them without parentheses: r.area.','class Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    @property\n    def area(self):\n        return self.width * self.height\n\n    @property\n    def perimeter(self):\n        return 2 * (self.width + self.height)\n\n    @property\n    def is_square(self):\n        return self.width == self.height\n\nw = int(input("W: "))\nh = int(input("H: "))\nr = Rect(w, h)\nprint("Area:", r.area)\nprint("Perimeter:", r.perimeter)\nprint("Square:", "yes" if r.is_square else "no")']},
  power:{can:['Compute derived values with @property','Avoid stale stored copies'],
    expand:'Add a `diagonal` property using math.hypot.',
    where:'Derived values (totals, ages, full names) are properties in nearly every real class.',
    next:'Next: property setters that validate.'},
  codex:{title:'@property',body:'@property makes a method read like an attribute (no parentheses). Use it for derived values. No setter means read-only.',snip:R`@property
def area(self):
    return self.w * self.h`}
},
{
  id:'r10-12', realm:10, n:12, title:'Property setters: validated attributes',
  teaches:['class-setter'], requires:['class-property'],
  story:`"Nobody may set a temperature below absolute zero," Vael says, nailing a rule to the wall. "But I don't want clumsy \`set_temp()\` methods everywhere. Callers should write \`t.celsius = 20\` and **the rule should still run**."`,
  concept:{
    html:`A **setter** runs code when someone *assigns* to a property. Use it to validate:\n\n\`\`\`\nclass Temperature:\n    def __init__(self, celsius=0.0):\n        self.celsius = celsius            # goes through the setter!\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("Below absolute zero")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9 / 5 + 32\n\n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        self.celsius = (value - 32) * 5 / 9\n\`\`\`\n\n- The real data lives in a **separate name** with an underscore (\`_celsius\`). The leading underscore means "internal, don't touch".\n- ⚠️ Inside the setter, assign to **\`self._celsius\`**. Assigning to \`self.celsius\` would call the setter again: **infinite recursion**.\n- Setting inside \`__init__\` with \`self.celsius = celsius\` makes the **constructor validate too**.\n- The decorator name matches the property: \`@celsius.setter\`.\n- Setters can convert too: \`fahrenheit\` stores nothing, it just writes through to \`celsius\`.`,
    analogy:`A turnstile on a field: you walk in through the normal gate, but the gate checks your ticket.`,
    example:R`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

t = Temperature(20)
try:
    t.celsius = -300
except ValueError as error:
    print("Error:", error)
print(t.celsius)`},
  predict:{code:R`class H:
    def __init__(self):
        self._hp = 0

    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, value):
        self._hp = max(0, value)

h = H()
h.hp = -5
print(h.hp)`, q:'What prints?', opts:['0','-5','Error'], ans:0, why:'The setter clamps negative values to 0.'},
  cast:{code:R`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

t = Temperature(20)
try:
    t.celsius = -300
except ValueError as error:
    print("Error:", error)
print(t.celsius)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, value):
        if value < 0:
            raise ValueError("negative")

h = Hero()
h.hp = 5
print(h.hp)`, task:'AttributeError: the setter validates but never stores the value in self._hp. Store it. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]']]}],
    sol:R`class Hero:
    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, value):
        if value < 0:
            raise ValueError("negative")
        self._hp = value

h = Hero()
h.hp = 5
print(h.hp)`, wrong:[R`class Hero:
    @property
    def hp(self):
        return self._hp

    @hp.setter
    def hp(self, value):
        if value < 0:
            raise ValueError("negative")

h = Hero()
h.hp = 5
print(h.hp)`]},
  write:{prompt:'Define `Temperature(celsius=0.0)` with a validated `celsius` property (anything below `-273.15` raises `ValueError("Below absolute zero")`, even in the constructor) and a `fahrenheit` property **with a setter** that writes through to `celsius`. Ask `Celsius: ` (a number). Try to set `t.celsius`; on `ValueError` print `Error: <message>`. Then print `Fahrenheit: <f>` (2 decimals), set `t.fahrenheit = 212` and print `Celsius now: <c>` (2 decimals).',
    starter:R`class Temperature:
    pass

t = Temperature()
value = float(input("Celsius: "))
`,
    inputs:['100'],
    cases:[{inputs:['100'],tests:[['Boiling','lines[-2:]==["Fahrenheit: 212.00","Celsius now: 100.00"]'],['Constructor validates','__import__("unittest").TestCase().assertRaises(ValueError, g["Temperature"], -300) is None'],['Setter validates','__import__("unittest").TestCase().assertRaises(ValueError, setattr, g["Temperature"](), "celsius", -300) is None'],['Fahrenheit setter','(lambda t: (setattr(t,"fahrenheit",32), t.celsius)[1])(g["Temperature"](50))==0']]},{inputs:['-40'],tests:[['Equal point','lines[-2:]==["Fahrenheit: -40.00","Celsius now: 100.00"]']]},{inputs:['-300'],tests:[['Too cold','lines[-3:]==["Error: Below absolute zero","Fahrenheit: 32.00","Celsius now: 100.00"]']]},{inputs:['-273.15'],tests:[['Exactly absolute zero is allowed','lines[-2:]==["Fahrenheit: -459.67","Celsius now: 100.00"]']]},{inputs:['-273.16'],tests:[['Just below','lines[-3]=="Error: Below absolute zero"'],['Uses setter','"setter" in src']]}],
    sol:R`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

t = Temperature()
value = float(input("Celsius: "))
try:
    t.celsius = value
except ValueError as error:
    print("Error:", error)
print(f"Fahrenheit: {t.fahrenheit:.2f}")
t.fahrenheit = 212
print(f"Celsius now: {t.celsius:.2f}")`,
    wrong:[R`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9

t = Temperature()
value = float(input("Celsius: "))
try:
    t.celsius = value
except ValueError as error:
    print("Error:", error)
print(f"Fahrenheit: {t.fahrenheit:.2f}")
t.fahrenheit = 212
print(f"Celsius now: {t.celsius:.2f}")`, R`class Temperature:
    def __init__(self, celsius=0.0):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

t = Temperature()
value = float(input("Celsius: "))
try:
    t.celsius = value
except ValueError as error:
    print("Error:", error)
print(f"Fahrenheit: {t.fahrenheit:.2f}")
t.fahrenheit = 212
print(f"Celsius now: {t.celsius:.2f}")`],
    hints:['Store the real value in self._celsius. The celsius setter checks value < -273.15 and raises ValueError("Below absolute zero").','In __init__ write self.celsius = celsius so the constructor goes through the setter too.','fahrenheit getter: celsius * 9 / 5 + 32. Its setter: self.celsius = (value - 32) * 5 / 9.','class Temperature:\n    def __init__(self, celsius=0.0):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError("Below absolute zero")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9 / 5 + 32\n\n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        self.celsius = (value - 32) * 5 / 9\n\nt = Temperature()\nvalue = float(input("Celsius: "))\ntry:\n    t.celsius = value\nexcept ValueError as error:\n    print("Error:", error)\nprint(f"Fahrenheit: {t.fahrenheit:.2f}")\nt.fahrenheit = 212\nprint(f"Celsius now: {t.celsius:.2f}")']},
  power:{can:['Validate assignments with property setters','Expose one value in two units'],
    expand:'Add a `kelvin` property with a setter.',
    where:'Every serious class guards its data with validated properties: ages, prices, percentages.',
    next:'Next: derived data in a shopping cart.'},
  codex:{title:'Property setters',body:'@name.setter validates on assignment. Store in self._name; assigning to self.name inside the setter recurses forever. Set via self.name in __init__ to validate construction.',snip:R`@celsius.setter
def celsius(self, value):
    self._celsius = value`}
},
{
  id:'r10-13', realm:10, n:13, title:'Derived data: a cart that never lies',
  teaches:['class-computed'], requires:['class-setter'],
  story:`The guild shop's cart has a habit: add three apples, remove one, and the total is wrong. "It kept its **own copy** of the total," Vael sighs. "Keep the **facts** (what's in the cart) and **compute** everything else."`,
  concept:{
    html:`Design rule: store the **raw facts**, derive the rest with properties.\n\n\`\`\`\nclass Cart:\n    def __init__(self):\n        self.lines = []                     # raw facts: (name, price, qty)\n\n    def add(self, name, price, qty=1):\n        self.lines.append((name, price, qty))\n\n    @property\n    def count(self):                        # derived\n        return sum(qty for _, _, qty in self.lines)\n\n    @property\n    def total(self):                        # derived\n        return sum(price * qty for _, price, qty in self.lines)\n\`\`\`\n\n- If you also kept \`self.total += price\` inside \`add\`, every new feature (remove, discount, change quantity) would have to remember to update it. **One forgotten update = a wrong total.**\n- Derived properties are always right, because they're recalculated from the facts.\n- Computing on demand is fast enough for small data. (For huge data you can cache, carefully: that's an optimisation, not the default.)\n- Unpacking with \`_\` ignores the parts you don't need.`,
    analogy:`A till that adds up the receipt each time, instead of trusting a running total scribbled on the side.`,
    example:R`class Cart:
    def __init__(self):
        self.lines = []

    def add(self, name, price, qty=1):
        self.lines.append((name, price, qty))

    @property
    def total(self):
        return sum(price * qty for _, price, qty in self.lines)

c = Cart()
c.add("apple", 0.5, 4)
c.add("pear", 0.75, 2)
print(c.total)`},
  predict:{code:R`class C:
    def __init__(self):
        self.items = [2, 3]
        self.total = sum(self.items)

c = C()
c.items.append(10)
print(c.total)`, q:'What prints?', opts:['5','15','Error'], ans:0, why:'total was computed once in __init__ and never updated: it is stale.'},
  cast:{code:R`class Cart:
    def __init__(self):
        self.lines = []

    def add(self, name, price, qty=1):
        self.lines.append((name, price, qty))

    @property
    def total(self):
        return sum(price * qty for _, price, qty in self.lines)

c = Cart()
c.add("apple", 0.5, 4)
c.add("pear", 0.75, 2)
print(c.total)`, task:'Cast it.'},
  bug:{broken:R`class Cart:
    def __init__(self):
        self.lines = []
        self.total = 0

    def add(self, price, qty=1):
        self.lines.append((price, qty))
        self.total += price

c = Cart()
c.add(2.0, 3)
print(c.total)`, task:'The running total ignores the quantity (it shows 2.0). Compute the total from the lines instead. Expected: 6.0',
    cases:[{inputs:[],tests:[['Six','lines==["6.0"]'],['Uses property','"@property" in src']]}],
    sol:R`class Cart:
    def __init__(self):
        self.lines = []

    def add(self, price, qty=1):
        self.lines.append((price, qty))

    @property
    def total(self):
        return sum(price * qty for price, qty in self.lines)

c = Cart()
c.add(2.0, 3)
print(c.total)`, wrong:[R`class Cart:
    def __init__(self):
        self.lines = []
        self.total = 0

    def add(self, price, qty=1):
        self.lines.append((price, qty))
        self.total += price

c = Cart()
c.add(2.0, 3)
print(c.total)`]},
  write:{prompt:'Build `Cart` with `add(name, price, qty=1)` and **properties** `count` (total quantity) and `total` (sum of price × qty). The program asks `Item: ` repeatedly, each answer like `apple 0.5 4` (name, price, quantity), until an empty answer. Then print `Items: <count>` and `Total: <total>` (2 decimals).',
    starter:R`class Cart:
    pass

cart = Cart()
`,
    inputs:['apple 0.5 4','pear 0.75 2',''],
    cases:[{inputs:['apple 0.5 4','pear 0.75 2',''],tests:[['Two lines','lines[-2:]==["Items: 6","Total: 3.50"]'],['Live properties','(lambda c: (c.add("x",2.0,3), c.add("y",1.0), (c.count, c.total))[2])(g["Cart"]())==(4,7.0)'],['They are properties','isinstance(vars(g["Cart"]).get("total"), property) and isinstance(vars(g["Cart"]).get("count"), property)']]},{inputs:[''],tests:[['Empty cart','lines[-2:]==["Items: 0","Total: 0.00"]']]},{inputs:['gem 1.25 1',''],tests:[['One','lines[-2:]==["Items: 1","Total: 1.25"]']]},{inputs:['a 2 2','b 3 1','c 10 0',''],tests:[['Zero quantity','lines[-2:]==["Items: 3","Total: 7.00"]']]}],
    sol:R`class Cart:
    def __init__(self):
        self.lines = []

    def add(self, name, price, qty=1):
        self.lines.append((name, price, qty))

    @property
    def count(self):
        return sum(qty for _, _, qty in self.lines)

    @property
    def total(self):
        return sum(price * qty for _, price, qty in self.lines)

cart = Cart()
while True:
    answer = input("Item: ")
    if answer == "":
        break
    name, price, qty = answer.split()
    cart.add(name, float(price), int(qty))
print("Items:", cart.count)
print(f"Total: {cart.total:.2f}")`,
    wrong:[R`class Cart:
    def __init__(self):
        self.lines = []
        self.count = 0
        self.total = 0

    def add(self, name, price, qty=1):
        self.lines.append((name, price, qty))
        self.count += qty
        self.total += price

cart = Cart()
while True:
    answer = input("Item: ")
    if answer == "":
        break
    name, price, qty = answer.split()
    cart.add(name, float(price), int(qty))
print("Items:", cart.count)
print(f"Total: {cart.total:.2f}")`, R`class Cart:
    def __init__(self):
        self.lines = []

    def add(self, name, price, qty=1):
        self.lines.append((name, price, qty))

    def count(self):
        return sum(qty for _, _, qty in self.lines)

    def total(self):
        return sum(price * qty for _, price, qty in self.lines)

cart = Cart()
while True:
    answer = input("Item: ")
    if answer == "":
        break
    name, price, qty = answer.split()
    cart.add(name, float(price), int(qty))
print("Items:", cart.count())
print(f"Total: {cart.total():.2f}")`],
    hints:['Store raw facts: self.lines.append((name, price, qty)).','count: sum(qty for _, _, qty in self.lines). total: sum(price * qty ...). Both with @property.','Loop reading input("Item: ") until it is empty; split into name, price, qty and convert price to float and qty to int.','class Cart:\n    def __init__(self):\n        self.lines = []\n\n    def add(self, name, price, qty=1):\n        self.lines.append((name, price, qty))\n\n    @property\n    def count(self):\n        return sum(qty for _, _, qty in self.lines)\n\n    @property\n    def total(self):\n        return sum(price * qty for _, price, qty in self.lines)\n\ncart = Cart()\nwhile True:\n    answer = input("Item: ")\n    if answer == "":\n        break\n    name, price, qty = answer.split()\n    cart.add(name, float(price), int(qty))\nprint("Items:", cart.count)\nprint(f"Total: {cart.total:.2f}")']},
  power:{can:['Store facts and derive totals with properties','Spot why running totals go stale'],
    expand:'Add a `remove(name)` method. Notice that count and total need no changes at all.',
    where:'Carts, invoices, scoreboards and reports all work best when totals are computed, not stored.',
    next:'Next: alternative constructors with @classmethod.'},
  codex:{title:'Derived data',body:'Store raw facts; compute totals with @property. Duplicated state goes stale and causes wrong answers.',snip:R`@property
def total(self):
    return sum(p * q for _, p, q in self.lines)`}
},
{
  id:'r10-14', realm:10, n:14, title:'@classmethod: alternative constructors',
  teaches:['class-classmethod'], requires:['class-computed'],
  story:`"Heroes arrive as scrolls: *Ada:30:7*," Vael says, holding one up. "Splitting the scroll by hand every time is error-prone. Teach the **class itself** how to build a hero from a scroll."`,
  concept:{
    html:`A **class method** receives the **class** (not an object) as its first argument, conventionally named \`cls\`. It is perfect for **alternative constructors**:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, hp=20, power=5):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\n    @classmethod\n    def from_string(cls, text):\n        name, hp, power = text.split(":")\n        return cls(name, int(hp), int(power))      # cls, not Hero!\n\nh = Hero.from_string("Ada:30:7")\n\`\`\`\n\n- Call it on the class: \`Hero.from_string(...)\`.\n- **Use \`cls(...)\`, not \`Hero(...)\`.** Then a subclass (\`class Mage(Hero)\`) calling \`Mage.from_string(...)\` correctly builds a **Mage**.\n- Forgetting the \`@classmethod\` decorator turns the first parameter into a normal \`self\`, and the call fails with a missing-argument \`TypeError\`.\n- Python itself does this: \`dict.fromkeys\`, \`int.from_bytes\`, \`datetime.fromisoformat\`.\n- Do the **validation** in the constructor path so bad text raises \`ValueError\` cleanly.`,
    analogy:`A factory with several doors: one takes raw parts, one takes a packed kit; both produce the same product.`,
    example:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

    @classmethod
    def from_string(cls, text):
        name, hp, power = text.split(":")
        return cls(name, int(hp), int(power))

h = Hero.from_string("Ada:30:7")
print(h.name, h.hp, h.power)`},
  predict:{code:R`class Base:
    @classmethod
    def make(cls):
        return cls()

class Sub(Base):
    pass

print(type(Sub.make()).__name__)`, q:'What prints?', opts:['Sub','Base','make'], ans:0, why:'cls is the class the method was called on, so Sub.make() builds a Sub.'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

    @classmethod
    def from_string(cls, text):
        name, hp, power = text.split(":")
        return cls(name, int(hp), int(power))

h = Hero.from_string("Ada:30:7")
print(h.name, h.hp, h.power)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, name):
        self.name = name

    def from_text(cls, text):
        return cls(text.strip())

print(Hero.from_text(" Ada ").name)`, task:'TypeError: without @classmethod, cls is treated as a normal argument. Add the decorator. Expected: Ada',
    cases:[{inputs:[],tests:[['Works','lines==["Ada"]']]}],
    sol:R`class Hero:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_text(cls, text):
        return cls(text.strip())

print(Hero.from_text(" Ada ").name)`, wrong:[R`class Hero:
    def __init__(self, name):
        self.name = name

    def from_text(cls, text):
        return cls(text.strip())

print(Hero.from_text(" Ada ").name)`]},
  write:{prompt:'Give `Hero(name, hp=20, power=5)` a `@classmethod` `from_string(cls, text)` that reads `name`, `name:hp` or `name:hp:power` (missing parts use the defaults). An empty name, more than 3 parts, or a non-number raises `ValueError`. Ask `Hero: ` and print `<name> <hp> <power>`, or `Invalid hero` on `ValueError`.',
    starter:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

text = input("Hero: ")
`,
    inputs:['Ada:30:7'],
    cases:[{inputs:['Ada:30:7'],tests:[['Full','lines[-1]=="Ada 30 7"'],['Is a classmethod','isinstance(vars(g["Hero"])["from_string"], classmethod)'],['Subclass is respected','isinstance(type("Mage",(g["Hero"],),{}).from_string("m:1"), type("Mage",(g["Hero"],),{})) or type(type("Mage",(g["Hero"],),{}).from_string("m:1")).__name__=="Mage"']]},{inputs:['Bo'],tests:[['Name only','lines[-1]=="Bo 20 5"']]},{inputs:['Cy:15'],tests:[['Name and hp','lines[-1]=="Cy 15 5"']]},{inputs:['x:abc'],tests:[['Not a number','lines[-1]=="Invalid hero"']]},{inputs:[':5'],tests:[['Empty name','lines[-1]=="Invalid hero"']]},{inputs:['a:1:2:3'],tests:[['Too many parts','lines[-1]=="Invalid hero"'],['Uses cls','"cls(" in src']]}],
    sol:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

    @classmethod
    def from_string(cls, text):
        parts = text.split(":")
        if not parts[0] or len(parts) > 3:
            raise ValueError("bad hero")
        hp = int(parts[1]) if len(parts) > 1 else 20
        power = int(parts[2]) if len(parts) > 2 else 5
        return cls(parts[0], hp, power)

text = input("Hero: ")
try:
    hero = Hero.from_string(text)
except ValueError:
    print("Invalid hero")
else:
    print(hero.name, hero.hp, hero.power)`,
    wrong:[R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

    @classmethod
    def from_string(cls, text):
        parts = text.split(":")
        if not parts[0] or len(parts) > 3:
            raise ValueError("bad hero")
        hp = int(parts[1]) if len(parts) > 1 else 20
        power = int(parts[2]) if len(parts) > 2 else 5
        return Hero(parts[0], hp, power)

text = input("Hero: ")
try:
    hero = Hero.from_string(text)
except ValueError:
    print("Invalid hero")
else:
    print(hero.name, hero.hp, hero.power)`, R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

    @classmethod
    def from_string(cls, text):
        parts = text.split(":")
        hp = int(parts[1]) if len(parts) > 1 else 20
        power = int(parts[2]) if len(parts) > 2 else 5
        return cls(parts[0], hp, power)

text = input("Hero: ")
try:
    hero = Hero.from_string(text)
except ValueError:
    print("Invalid hero")
else:
    print(hero.name, hero.hp, hero.power)`],
    hints:['@classmethod def from_string(cls, text): split on ":" into parts.','Reject an empty name or more than 3 parts with raise ValueError. int() raises ValueError for non-numbers by itself.','Return cls(name, hp, power) (not Hero(...)), using 20 and 5 when parts are missing.','class Hero:\n    def __init__(self, name, hp=20, power=5):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\n    @classmethod\n    def from_string(cls, text):\n        parts = text.split(":")\n        if not parts[0] or len(parts) > 3:\n            raise ValueError("bad hero")\n        hp = int(parts[1]) if len(parts) > 1 else 20\n        power = int(parts[2]) if len(parts) > 2 else 5\n        return cls(parts[0], hp, power)\n\ntext = input("Hero: ")\ntry:\n    hero = Hero.from_string(text)\nexcept ValueError:\n    print("Invalid hero")\nelse:\n    print(hero.name, hero.hp, hero.power)']},
  power:{can:['Build objects from text, dicts or files with alternative constructors','Use cls so subclasses work'],
    expand:'Add a `from_dict(cls, data)` classmethod too.',
    where:'Parsing JSON rows, config lines and API responses into objects is classmethod territory.',
    next:'Next: @staticmethod for helpers that belong to the class.'},
  codex:{title:'@classmethod',body:'@classmethod def make(cls, ...): return cls(...). Called on the class. Use cls so subclasses build themselves.',snip:R`@classmethod
def from_string(cls, text):
    return cls(*text.split(":"))`}
},
{
  id:'r10-15', realm:10, n:15, title:'@staticmethod: helpers that belong to the class',
  teaches:['class-static'], requires:['class-classmethod'],
  story:`"Is *Ada9* a legal hero name?" an apprentice asks. "The rule belongs with the Hero class," Vael says, "but it needs **no particular hero** to answer. It's a **static** helper."`,
  concept:{
    html:`A **static method** is a plain function that lives inside a class for organisation. It gets **no** \`self\` and **no** \`cls\`:\n\n\`\`\`\nclass Hero:\n    @staticmethod\n    def is_valid_name(name):\n        return 2 <= len(name) <= 12 and name.isalpha()\n\n    def __init__(self, name):\n        if not Hero.is_valid_name(name):\n            raise ValueError("bad name")\n        self.name = name\n\nHero.is_valid_name("Ada")      # True: call it on the class\n\`\`\`\n\n| Kind | First parameter | Use it when |\n|---|---|---|\n| instance method | \`self\` | needs the object's data |\n| \`@classmethod\` | \`cls\` | builds or configures the class |\n| \`@staticmethod\` | none | related helper, needs neither |\n\n- Static methods can be called on the class **or** an instance.\n- If you accidentally give a static method a \`self\` parameter, calling \`Hero.is_valid_name("Ada")\` fails because \`self\` swallows the argument.\n- If a function doesn't relate to the class at all, a plain module-level function is often better.`,
    analogy:`A rule poster on the guildhall wall: related to heroes, but it doesn't belong to any one hero.`,
    example:R`class Hero:
    @staticmethod
    def is_valid_name(name):
        return 2 <= len(name) <= 12 and name.isalpha()

    def __init__(self, name):
        if not Hero.is_valid_name(name):
            raise ValueError("bad name")
        self.name = name

print(Hero.is_valid_name("Ada"), Hero.is_valid_name("Ada9"))`},
  predict:{code:R`class U:
    @staticmethod
    def twice(x):
        return x * 2

print(U.twice(4), U().twice(5))`, q:'What prints?', opts:['8 10','8 Error','Error'], ans:0, why:'Static methods work on the class and on instances.'},
  cast:{code:R`class Hero:
    @staticmethod
    def is_valid_name(name):
        return 2 <= len(name) <= 12 and name.isalpha()

    def __init__(self, name):
        if not Hero.is_valid_name(name):
            raise ValueError("bad name")
        self.name = name

print(Hero.is_valid_name("Ada"), Hero.is_valid_name("Ada9"))`, task:'Cast it.'},
  bug:{broken:R`class Util:
    @staticmethod
    def double(self, x):
        return x * 2

print(Util.double(4))`, task:'TypeError: a static method gets no self, so the 4 landed in self and x is missing. Remove self. Expected: 8',
    cases:[{inputs:[],tests:[['Eight','lines==["8"]']]}],
    sol:R`class Util:
    @staticmethod
    def double(x):
        return x * 2

print(Util.double(4))`, wrong:[R`class Util:
    @staticmethod
    def double(self, x):
        return x * 2

print(Util.double(4))`]},
  write:{prompt:'Define `Hero(name)`. Add a **static method** `is_valid_name(name)`: 2 to 12 characters, letters only. `__init__` raises `ValueError` for an invalid name. Ask `Name: ` and print `Welcome <name>` or `Invalid name`.',
    starter:R`class Hero:
    pass

name = input("Name: ")
`,
    inputs:['Ada'],
    cases:[{inputs:['Ada'],tests:[['Valid','lines[-1]=="Welcome Ada"'],['Static','isinstance(vars(g["Hero"])["is_valid_name"], staticmethod)'],['Works on the class','g["Hero"].is_valid_name("Bo") is True and g["Hero"].is_valid_name("B") is False and g["Hero"].is_valid_name("Bo2") is False']]},{inputs:['A'],tests:[['Too short','lines[-1]=="Invalid name"']]},{inputs:['Ada9'],tests:[['Digit','lines[-1]=="Invalid name"']]},{inputs:['Bartholomews'],tests:[['Twelve is fine','lines[-1]=="Welcome Bartholomews"']]},{inputs:['Bartholomewss'],tests:[['Thirteen is too long','lines[-1]=="Invalid name"']]},{inputs:[''],tests:[['Empty','lines[-1]=="Invalid name"'],['Constructor enforces it','__import__("unittest").TestCase().assertRaises(ValueError, g["Hero"], "x1") is None']]}],
    sol:R`class Hero:
    @staticmethod
    def is_valid_name(name):
        return 2 <= len(name) <= 12 and name.isalpha()

    def __init__(self, name):
        if not Hero.is_valid_name(name):
            raise ValueError("bad name")
        self.name = name

name = input("Name: ")
try:
    hero = Hero(name)
except ValueError:
    print("Invalid name")
else:
    print("Welcome", hero.name)`,
    wrong:[R`class Hero:
    def is_valid_name(self, name):
        return 2 <= len(name) <= 12 and name.isalpha()

    def __init__(self, name):
        if not self.is_valid_name(name):
            raise ValueError("bad name")
        self.name = name

name = input("Name: ")
try:
    hero = Hero(name)
except ValueError:
    print("Invalid name")
else:
    print("Welcome", hero.name)`, R`class Hero:
    @staticmethod
    def is_valid_name(name):
        return 2 <= len(name) <= 12 and name.isalpha()

    def __init__(self, name):
        self.name = name

name = input("Name: ")
if Hero.is_valid_name(name):
    print("Welcome", Hero(name).name)
else:
    print("Invalid name")`],
    hints:['@staticmethod def is_valid_name(name): return 2 <= len(name) <= 12 and name.isalpha().','In __init__: if not Hero.is_valid_name(name): raise ValueError(...).','Wrap Hero(name) in try / except ValueError and print Welcome or Invalid name.','class Hero:\n    @staticmethod\n    def is_valid_name(name):\n        return 2 <= len(name) <= 12 and name.isalpha()\n\n    def __init__(self, name):\n        if not Hero.is_valid_name(name):\n            raise ValueError("bad name")\n        self.name = name\n\nname = input("Name: ")\ntry:\n    hero = Hero(name)\nexcept ValueError:\n    print("Invalid name")\nelse:\n    print("Welcome", hero.name)']},
  power:{can:['Group related helper functions inside a class','Choose between instance, class and static methods'],
    expand:'Add a static method `clean(name)` that strips spaces and capitalises, and use it in the constructor.',
    where:'Validators and converters that relate to a class but need no instance are static methods.',
    next:'Next: __eq__, deciding when two objects are "the same".'},
  codex:{title:'@staticmethod',body:'A plain function inside a class: no self, no cls. Call as Class.helper(x). Use for related helpers that need no object data.',snip:R`@staticmethod
def is_valid_name(name):
    return name.isalpha()`}
},
{
  id:'r10-16', realm:10, n:16, title:'__eq__ and __hash__: when are two objects equal?',
  teaches:['class-eq'], requires:['class-static'],
  story:`Two scouts each report a trap at (3, 4). "Same trap, or two traps?" Vael asks. By default Python says **different**: they're two objects. "Teach it that **same position means same point**."`,
  concept:{
    html:`By default \`==\` on your objects is \`is\`: true only for the **very same object**. Define \`__eq__\` to compare by **value**:\n\n\`\`\`\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return NotImplemented              # let Python try something else\n        return (self.x, self.y) == (other.x, other.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\nPoint(1, 2) == Point(1, 2)      # True\nlen({Point(1, 2), Point(1, 2)}) # 1: sets and dict keys work\n\`\`\`\n\n- Check the **type** first and return \`NotImplemented\` for strangers, so \`Point(1, 2) == 5\` is \`False\` instead of crashing.\n- ⚠️ **Defining \`__eq__\` removes the default \`__hash__\`**, so your objects can't go in sets or be dict keys (\`TypeError: unhashable type\`). Define \`__hash__\` from the **same fields** you compare.\n- Rule: **equal objects must have equal hashes.**\n- Use only **immutable** data in the hash. If a hashed object's fields change, it gets lost inside sets and dicts.\n- \`x in list\` uses \`==\` too.`,
    analogy:`Two driving licences are "the same person" if the details match, even though they are different plastic cards.`,
    example:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

print(Point(1, 2) == Point(1, 2))
print(len({Point(1, 2), Point(1, 2), Point(2, 1)}))`},
  predict:{code:R`class P:
    pass

print(P() == P())`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'Without __eq__, == means "same object", and these are two objects.'},
  cast:{code:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

print(Point(1, 2) == Point(1, 2))
print(len({Point(1, 2), Point(1, 2), Point(2, 1)}))`, task:'Cast it.'},
  bug:{broken:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

print(Point(1, 2) == Point(1, 2))`, task:'It says False because == compares identity. Teach Point what equal means. Expected: True',
    cases:[{inputs:[],tests:[['Equal','lines==["True"]']]}],
    sol:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        return (self.x, self.y) == (other.x, other.y)

print(Point(1, 2) == Point(1, 2))`, wrong:[R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

print(Point(1, 2) == Point(1, 2))`]},
  write:{prompt:'Define `Point(x, y)` with `__eq__` (by value; a non-Point is simply not equal) and a matching `__hash__`. Ask `Points: ` (like `1,2 3,4 1,2`, may be empty). Build the points, then print `Unique: <how many different points, using a set>` and `Has origin: yes` or `no` (is `Point(0, 0)` in the list).',
    starter:R`class Point:
    pass

points = []
for text in input("Points: ").split():
    x, y = text.split(",")
    points.append(Point(int(x), int(y)))
`,
    inputs:['1,2 3,4 1,2'],
    cases:[{inputs:['1,2 3,4 1,2'],tests:[['Duplicates collapse','lines[-2:]==["Unique: 2","Has origin: no"]'],['Equal by value','g["Point"](1,2)==g["Point"](1,2) and g["Point"](1,2)!=g["Point"](2,1)'],['Other types','(g["Point"](1,2)==5) is False and (g["Point"](1,2)=="x") is False'],['Hash matches equality','hash(g["Point"](1,2))==hash(g["Point"](1,2))'],['Usable as dict keys','{g["Point"](1,2):"a"}[g["Point"](1,2)]=="a"']]},{inputs:['0,0'],tests:[['Origin','lines[-2:]==["Unique: 1","Has origin: yes"]']]},{inputs:[''],tests:[['None','lines[-2:]==["Unique: 0","Has origin: no"]']]},{inputs:['1,2 2,1'],tests:[['Order matters','lines[-2:]==["Unique: 2","Has origin: no"]']]},{inputs:['1,2 1,3 1,2'],tests:[['Same x, different y','lines[-2:]==["Unique: 2","Has origin: no"]']]}],
    sol:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

    def __hash__(self):
        return hash((self.x, self.y))

points = []
for text in input("Points: ").split():
    x, y = text.split(",")
    points.append(Point(int(x), int(y)))

print("Unique:", len(set(points)))
print("Has origin:", "yes" if Point(0, 0) in points else "no")`,
    wrong:[R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return (self.x, self.y) == (other.x, other.y)

points = []
for text in input("Points: ").split():
    x, y = text.split(",")
    points.append(Point(int(x), int(y)))

print("Unique:", len(set(points)))
print("Has origin:", "yes" if Point(0, 0) in points else "no")`, R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x

    def __hash__(self):
        return hash(self.x)

points = []
for text in input("Points: ").split():
    x, y = text.split(",")
    points.append(Point(int(x), int(y)))

print("Unique:", len(set(points)))
print("Has origin:", "yes" if Point(0, 0) in points else "no")`],
    hints:['__eq__: return NotImplemented for non-Points, otherwise compare (self.x, self.y) with (other.x, other.y).','__hash__: return hash((self.x, self.y)) so sets work.','len(set(points)) is the unique count; Point(0, 0) in points uses __eq__.','class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)\n\n    def __hash__(self):\n        return hash((self.x, self.y))\n\npoints = []\nfor text in input("Points: ").split():\n    x, y = text.split(",")\n    points.append(Point(int(x), int(y)))\n\nprint("Unique:", len(set(points)))\nprint("Has origin:", "yes" if Point(0, 0) in points else "no")']},
  power:{can:['Define value equality with __eq__','Keep __hash__ consistent so sets and dict keys work'],
    expand:'Use your Point as a dictionary key to store a name for each map location.',
    where:'Coordinates, money, IDs and versions need value equality to work in sets, dicts and tests.',
    next:'Next: ordering objects with __lt__.'},
  codex:{title:'__eq__ and __hash__',body:'__eq__ compares by value (return NotImplemented for other types). Defining __eq__ removes __hash__: add __hash__ from the same fields. Equal objects must hash equal.',snip:R`def __hash__(self):
    return hash((self.x, self.y))`}
},
{
  id:'r10-17', realm:10, n:17, title:'__lt__ and total_ordering: sortable objects',
  teaches:['class-order'], requires:['class-eq'],
  story:`"Which is newer, 1.9.3 or 1.10.0?" Vael asks. Sorting the version **text** says 1.10.0 comes *first*. "Text sorts character by character, so '1' comes before '9'. Teach versions to compare **as numbers**."`,
  concept:{
    html:`Define \`__lt__\` ("less than") and \`sorted\`, \`min\`, \`max\` and \`<\` all work on your objects. \`functools.total_ordering\` then **fills in** \`<=\`, \`>\` and \`>=\` from \`__eq__\` and \`__lt__\`:\n\n\`\`\`\nfrom functools import total_ordering\n\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        self.text = text\n        self.parts = tuple(int(p) for p in text.split("."))\n\n    def __eq__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts == other.parts\n\n    def __lt__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts < other.parts\n\n    def __str__(self):\n        return self.text\n\nVersion("1.10.0") > Version("1.9.3")      # True (tuples compare number by number)\nsorted([Version("1.10.0"), Version("1.9.3")])\n\`\`\`\n\n- **Tuples compare element by element**, so \`(1, 10, 0) > (1, 9, 3)\`. That's the trick for versions, dates and multi-field sorting.\n- Text compares letter by letter: \`"1.10.0" < "1.9.3"\` is \`True\`, which is wrong for versions.\n- Return \`NotImplemented\` for foreign types.\n- Without \`__lt__\`, \`sorted(objects)\` raises \`TypeError\` (you saw this earlier).`,
    analogy:`A librarian who knows 10 comes after 9, unlike an alphabetical shelf.`,
    example:R`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.text = text
        self.parts = tuple(int(p) for p in text.split("."))

    def __eq__(self, other):
        return self.parts == other.parts

    def __lt__(self, other):
        return self.parts < other.parts

    def __str__(self):
        return self.text

print(Version("1.10.0") > Version("1.9.3"))
print(", ".join(str(v) for v in sorted([Version("1.10.0"), Version("1.9.3")])))`},
  predict:{code:R`print(sorted(["10", "9", "100"]))`, q:'What prints?', opts:["['10', '100', '9']","['9', '10', '100']","['100', '10', '9']"], ans:0, why:'Text sorts character by character: "10" < "100" < "9".'},
  cast:{code:R`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        self.text = text
        self.parts = tuple(int(p) for p in text.split("."))

    def __eq__(self, other):
        return self.parts == other.parts

    def __lt__(self, other):
        return self.parts < other.parts

    def __str__(self):
        return self.text

print(Version("1.10.0") > Version("1.9.3"))
print(", ".join(str(v) for v in sorted([Version("1.10.0"), Version("1.9.3")])))`, task:'Cast it.'},
  bug:{broken:R`versions = ["1.9.3", "1.10.0", "1.2.10"]
print(sorted(versions))`, task:'Text sorting puts 1.10.0 first. Sort by the numbers: use a key that turns each version into a tuple of ints. Expected: [\'1.2.10\', \'1.9.3\', \'1.10.0\']',
    cases:[{inputs:[],tests:[['Numeric order','lines==["[\'1.2.10\', \'1.9.3\', \'1.10.0\']"]']]}],
    sol:R`versions = ["1.9.3", "1.10.0", "1.2.10"]
print(sorted(versions, key=lambda v: tuple(int(p) for p in v.split("."))))`, wrong:[R`versions = ["1.9.3", "1.10.0", "1.2.10"]
print(sorted(versions))`]},
  write:{prompt:'Define `Version(text)` for `major.minor.patch` (exactly 3 whole numbers, otherwise `ValueError`) with `__eq__`, `__lt__` (use `@total_ordering`) and `__str__` returning the original text. Ask `Versions: ` (space-separated). With none print `No versions`. If any is invalid print `Invalid version: <text>` (the first bad one). Otherwise print `Newest: <v>` and `Sorted: <oldest to newest, joined by ", ">`.',
    starter:R`from functools import total_ordering

class Version:
    pass

words = input("Versions: ").split()
`,
    inputs:['1.9.3 1.10.0 1.2.10'],
    cases:[{inputs:['1.9.3 1.10.0 1.2.10'],tests:[['Numeric order','lines[-2:]==["Newest: 1.10.0","Sorted: 1.2.10, 1.9.3, 1.10.0"]'],['Comparisons','g["Version"]("1.10.0")>g["Version"]("1.9.9") and g["Version"]("2.0.0")>=g["Version"]("2.0.0") and g["Version"]("1.0.1")<=g["Version"]("1.0.2")'],['Equal by value','g["Version"]("1.2.3")==g["Version"]("1.2.3")'],['Bad text raises','all(__import__("unittest").TestCase().assertRaises(ValueError, g["Version"], t) is None for t in ["1.2","1.x.3","1.2.3.4",""])'],['Uses total_ordering','"@total_ordering" in src']]},{inputs:['2.0.0'],tests:[['One','lines[-2:]==["Newest: 2.0.0","Sorted: 2.0.0"]']]},{inputs:['1.2'],tests:[['Too short','lines[-1]=="Invalid version: 1.2"']]},{inputs:['1.0.0 1.x.3 9.9.9'],tests:[['Bad number','lines[-1]=="Invalid version: 1.x.3"']]},{inputs:[''],tests:[['None','lines[-1]=="No versions"']]}],
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

    def __str__(self):
        return self.text

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = []
    for word in words:
        try:
            versions.append(Version(word))
        except ValueError:
            print("Invalid version:", word)
            break
    else:
        print("Newest:", max(versions))
        print("Sorted:", ", ".join(str(v) for v in sorted(versions)))`,
    wrong:[R`from functools import total_ordering

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
        return self.text < other.text

    def __str__(self):
        return self.text

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = []
    for word in words:
        try:
            versions.append(Version(word))
        except ValueError:
            print("Invalid version:", word)
            break
    else:
        print("Newest:", max(versions))
        print("Sorted:", ", ".join(str(v) for v in sorted(versions)))`, R`from functools import total_ordering

@total_ordering
class Version:
    def __init__(self, text):
        parts = text.split(".")
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

    def __str__(self):
        return self.text

words = input("Versions: ").split()
if not words:
    print("No versions")
else:
    versions = []
    for word in words:
        try:
            versions.append(Version(word))
        except ValueError:
            print("Invalid version:", word)
            break
    else:
        print("Newest:", max(versions))
        print("Sorted:", ", ".join(str(v) for v in sorted(versions)))`],
    hints:['In __init__ split the text on ".", require exactly 3 parts and store tuple(int(p) for p in parts).','__eq__ and __lt__ compare self.parts with other.parts; decorate the class with @total_ordering.','Build the objects in a loop with try / except ValueError and a for-else for the success case; max() and sorted() now work.','from functools import total_ordering\n\n@total_ordering\nclass Version:\n    def __init__(self, text):\n        parts = text.split(".")\n        if len(parts) != 3:\n            raise ValueError("bad version")\n        self.parts = tuple(int(p) for p in parts)\n        self.text = text\n\n    def __eq__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts == other.parts\n\n    def __lt__(self, other):\n        if not isinstance(other, Version):\n            return NotImplemented\n        return self.parts < other.parts\n\n    def __str__(self):\n        return self.text\n\nwords = input("Versions: ").split()\nif not words:\n    print("No versions")\nelse:\n    versions = []\n    for word in words:\n        try:\n            versions.append(Version(word))\n        except ValueError:\n            print("Invalid version:", word)\n            break\n    else:\n        print("Newest:", max(versions))\n        print("Sorted:", ", ".join(str(v) for v in sorted(versions)))']},
  power:{can:['Make your objects sortable with __lt__ and total_ordering','Compare version-like data as tuples of numbers'],
    expand:'Add `__repr__` and print a sorted list of Versions directly.',
    where:'Package managers, release tools and leaderboards all depend on correct ordering.',
    next:'Next: privacy conventions and name mangling.'},
  codex:{title:'Ordering',body:'__lt__ + __eq__ + @total_ordering give <, <=, >, >=, sorted, min, max. Compare tuples for multi-part keys. Text sorts char by char: 10 < 9.',snip:R`@total_ordering
class Version:
    def __lt__(self, other):
        return self.parts < other.parts`}
},
{
  id:'r10-18', realm:10, n:18, title:'Private attributes: _single and __double underscores',
  teaches:['class-private'], requires:['class-order'],
  story:`The guild vault has a combination. "Everyone *can* open the vault door," Vael says, "but a polite person doesn't rummage through someone's **internal parts**. Python marks them with underscores."`,
  concept:{
    html:`Python has no hard \`private\` keyword. It uses **conventions** and one small trick:\n\n\`\`\`\nclass Vault:\n    def __init__(self, secret):\n        self.__secret = secret            # double underscore: name-mangled\n        self._opens = 0                   # single underscore: "internal, please don't touch"\n\n    def check(self, guess):\n        self._opens += 1\n        return guess == self.__secret\n\nv = Vault("swordfish")\nv.check("swordfish")        # use the public interface\nv.__secret                  # AttributeError!\nv._Vault__secret            # 'swordfish'  (mangled name: possible, but rude)\n\`\`\`\n\n- **\`_name\`**: a *convention*: internal detail, not part of the public interface. Nothing stops access.\n- **\`__name\`**: Python rewrites it to \`_ClassName__name\`. It prevents **accidental** clashes (especially in subclasses). It is **not** security.\n- The **public interface** is the methods and properties you want people to use. Hidden parts can change without breaking callers.\n- Don't use double underscores everywhere. Single underscore is the everyday choice.\n- Names with two underscores on **both** sides (\`__init__\`) are special "dunder" names and are *not* mangled.`,
    analogy:`A shop counter: customers use the till (public), staff use the stock room (internal).`,
    example:R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

v = Vault("swordfish")
print(v.check("swordfish"), hasattr(v, "secret"))
print(sorted(vars(v)))`},
  predict:{code:R`class A:
    def __init__(self):
        self.__x = 1

a = A()
print(hasattr(a, "__x"), hasattr(a, "_A__x"))`, q:'What prints?', opts:['False True','True True','False False'], ans:0, why:'__x is stored as _A__x, so the plain name does not exist.'},
  cast:{code:R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

v = Vault("swordfish")
print(v.check("swordfish"), hasattr(v, "secret"))
print(sorted(vars(v)))`, task:'Cast it.'},
  bug:{broken:R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

v = Vault("swordfish")
print(v.__secret == "swordfish")`, task:'AttributeError: the secret is name-mangled. Use the public check method instead. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Uses the interface','".check(" in src']]}],
    sol:R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

v = Vault("swordfish")
print(v.check("swordfish"))`, wrong:[R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

v = Vault("swordfish")
print(v.__secret == "swordfish")`]},
  write:{prompt:'Define `Vault(secret)` that keeps the secret in a **double-underscore** attribute. `check(guess)` returns `True` or `False`. `change(old, new)` replaces the secret only if `old` is right, and returns whether it did. The program builds `Vault("swordfish")`, asks `Guess: ` and prints `Open` or `Locked`, then prints `Changed: <result of change("swordfish", "dragon")>` and `New works: <result of check("dragon")>`.',
    starter:R`class Vault:
    pass

v = Vault("swordfish")
guess = input("Guess: ")
`,
    inputs:['swordfish'],
    cases:[{inputs:['swordfish'],tests:[['Right guess','lines[-3:]==["Open","Changed: True","New works: True"]'],['Secret is hidden','not hasattr(g["v"],"secret") and not hasattr(g["v"],"__secret")'],['Mangled name exists','"_Vault__secret" in vars(g["v"])'],['change refuses a wrong old value','(lambda w: (w.change("nope","x"), w.check("x"), w.check("a"))[1:])(g["Vault"]("a"))==(False,True)']]},{inputs:['wrong'],tests:[['Wrong guess','lines[-3:]==["Locked","Changed: True","New works: True"]']]},{inputs:[''],tests:[['Empty guess','lines[-3:]==["Locked","Changed: True","New works: True"]'],['Returns booleans','g["Vault"]("a").check("a") is True and g["Vault"]("a").change("a","b") is True and g["Vault"]("a").change("z","b") is False']]}],
    sol:R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

    def change(self, old, new):
        if self.check(old):
            self.__secret = new
            return True
        return False

v = Vault("swordfish")
guess = input("Guess: ")
print("Open" if v.check(guess) else "Locked")
print("Changed:", v.change("swordfish", "dragon"))
print("New works:", v.check("dragon"))`,
    wrong:[R`class Vault:
    def __init__(self, secret):
        self.secret = secret

    def check(self, guess):
        return guess == self.secret

    def change(self, old, new):
        if self.check(old):
            self.secret = new
            return True
        return False

v = Vault("swordfish")
guess = input("Guess: ")
print("Open" if v.check(guess) else "Locked")
print("Changed:", v.change("swordfish", "dragon"))
print("New works:", v.check("dragon"))`, R`class Vault:
    def __init__(self, secret):
        self.__secret = secret

    def check(self, guess):
        return guess == self.__secret

    def change(self, old, new):
        self.__secret = new
        return True

v = Vault("swordfish")
guess = input("Guess: ")
print("Open" if v.check(guess) else "Locked")
print("Changed:", v.change("swordfish", "dragon"))
print("New works:", v.check("dragon"))`],
    hints:['Store the secret as self.__secret in __init__.','check compares the guess with self.__secret. change uses check(old) before replacing.','Return True when changed, False otherwise.','class Vault:\n    def __init__(self, secret):\n        self.__secret = secret\n\n    def check(self, guess):\n        return guess == self.__secret\n\n    def change(self, old, new):\n        if self.check(old):\n            self.__secret = new\n            return True\n        return False\n\nv = Vault("swordfish")\nguess = input("Guess: ")\nprint("Open" if v.check(guess) else "Locked")\nprint("Changed:", v.change("swordfish", "dragon"))\nprint("New works:", v.check("dragon"))']},
  power:{can:['Separate a public interface from internal details','Explain _single and __double underscore names'],
    expand:'Add a `_attempts` counter that locks the vault after three wrong guesses.',
    where:'Good libraries expose a small public interface so internals can change safely.',
    next:'Next: a class that manages a whole inventory.'},
  codex:{title:'Private names',body:'_name = internal by convention. __name is mangled to _Class__name (avoids accidents, not security). Use the public methods.',snip:R`self.__secret = secret`}
},
{
  id:'r10-19', realm:10, n:19, title:'A class that manages a collection: Inventory',
  teaches:['class-inventory'], requires:['class-private'],
  story:`The guild storeroom has a ledger, a dozen helpers and no rules. "One object should **own** the stock and enforce the rules," Vael says. "Everyone else just asks it."`,
  concept:{
    html:`Many real classes **wrap a collection** and guard access to it. The outside world uses methods; the dict or list stays hidden inside:\n\n\`\`\`\nclass Inventory:\n    def __init__(self):\n        self.items = {}                     # name -> quantity\n\n    def add(self, name, qty):\n        self.items[name] = self.items.get(name, 0) + qty\n\n    def remove(self, name, qty):\n        if name not in self.items:\n            raise ValueError(f"Unknown item: {name}")\n        if qty > self.items[name]:\n            raise ValueError(f"Not enough {name}")\n        self.items[name] -= qty\n        if self.items[name] == 0:\n            del self.items[name]            # no zero entries\n\n    def report(self):\n        if not self.items:\n            return ["(empty)"]\n        return [f"{n}: {q}" for n, q in sorted(self.items.items())]\n\`\`\`\n\n- The class turns **business rules** (no negative stock, no ghost items, tidy reports) into code in **one place**.\n- \`report()\` **returns** lines; the caller decides how to show them (print, file, web page). That keeps the class reusable.\n- A command loop (\`add\`, \`remove\`, \`report\`, \`quit\`) is a thin layer **outside** the class.\n- Catch \`ValueError\` in the loop and print a friendly message.`,
    analogy:`A storekeeper behind a counter: customers make requests, the keeper checks the shelves.`,
    example:R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty):
        self.items[name] = self.items.get(name, 0) + qty

    def report(self):
        return [f"{n}: {q}" for n, q in sorted(self.items.items())]

inv = Inventory()
inv.add("apple", 5)
inv.add("pear", 2)
inv.add("apple", 1)
print(inv.report())`},
  predict:{code:R`items = {}
items["a"] = items.get("a", 0) + 2
items["a"] = items.get("a", 0) + 3
print(items)`, q:'What prints?', opts:["{'a': 5}","{'a': 3}","{'a': 2}"], ans:0, why:'get(name, 0) gives the current amount (or 0), then we add to it.'},
  cast:{code:R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty):
        self.items[name] = self.items.get(name, 0) + qty

    def report(self):
        return [f"{n}: {q}" for n, q in sorted(self.items.items())]

inv = Inventory()
inv.add("apple", 5)
inv.add("pear", 2)
inv.add("apple", 1)
print(inv.report())`, task:'Cast it.'},
  bug:{broken:R`class Inventory:
    def __init__(self):
        self.items = {}

    def remove(self, name, qty):
        self.items[name] -= qty
        if self.items[name] == 0:
            del self.items[name]

inv = Inventory()
try:
    inv.remove("apple", 1)
except ValueError as error:
    print("Error:", error)`, task:'Removing an unknown item crashes with KeyError. Raise a clear ValueError instead. Expected: Error: Unknown item: apple',
    cases:[{inputs:[],tests:[['Friendly','lines==["Error: Unknown item: apple"]']]}],
    sol:R`class Inventory:
    def __init__(self):
        self.items = {}

    def remove(self, name, qty):
        if name not in self.items:
            raise ValueError(f"Unknown item: {name}")
        self.items[name] -= qty
        if self.items[name] == 0:
            del self.items[name]

inv = Inventory()
try:
    inv.remove("apple", 1)
except ValueError as error:
    print("Error:", error)`, wrong:[R`class Inventory:
    def __init__(self):
        self.items = {}

    def remove(self, name, qty):
        self.items[name] -= qty
        if self.items[name] == 0:
            del self.items[name]

inv = Inventory()
try:
    inv.remove("apple", 1)
except ValueError as error:
    print("Error:", error)`]},
  write:{prompt:'Build `Inventory` with `add(name, qty)`, `remove(name, qty)` and `report()` (a **list of lines**, `name: qty` sorted by name, or `["(empty)"]`). `remove` raises `ValueError("Unknown item: <name>")` for items not held and `ValueError("Not enough <name>")` if the quantity is too large, and deletes items that reach 0. The program loops asking `> `: `add <name> <qty>`, `remove <name> <qty>`, `report` (prints each line), `quit`. Anything else prints `Unknown command`; a `ValueError` prints `Error: <message>`.',
    starter:R`class Inventory:
    pass

inv = Inventory()
`,
    inputs:['add apple 5','add pear 2','remove apple 2','report','quit'],
    cases:[{inputs:['add apple 5','add pear 2','remove apple 2','report','quit'],tests:[['Report','[l for l in lines if not l.startswith("> ")]==["apple: 3","pear: 2"]'],['Class works alone','(lambda i: (i.add("x",2), i.add("x",3), i.report())[2])(g["Inventory"]())==["x: 5"] and g["Inventory"]().report()==["(empty)"]']]},{inputs:['add a 1','remove a 1','report','quit'],tests:[['No zero entries','[l for l in lines if not l.startswith("> ")]==["(empty)"]']]},{inputs:['remove x 1','quit'],tests:[['Unknown item','[l for l in lines if not l.startswith("> ")]==["Error: Unknown item: x"]']]},{inputs:['add a 1','remove a 5','quit'],tests:[['Not enough','[l for l in lines if not l.startswith("> ")]==["Error: Not enough a"]']]},{inputs:['add a 2','add a 3','report','quit'],tests:[['Adds up','[l for l in lines if not l.startswith("> ")]==["a: 5"]']]},{inputs:['add b 1','add a 1','report','dance','quit'],tests:[['Sorted and unknown command','[l for l in lines if not l.startswith("> ")]==["a: 1","b: 1","Unknown command"]']]}],
    sol:R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty):
        self.items[name] = self.items.get(name, 0) + qty

    def remove(self, name, qty):
        if name not in self.items:
            raise ValueError(f"Unknown item: {name}")
        if qty > self.items[name]:
            raise ValueError(f"Not enough {name}")
        self.items[name] -= qty
        if self.items[name] == 0:
            del self.items[name]

    def report(self):
        if not self.items:
            return ["(empty)"]
        return [f"{n}: {q}" for n, q in sorted(self.items.items())]

inv = Inventory()
while True:
    parts = input("> ").split()
    if not parts:
        continue
    command = parts[0]
    if command == "quit":
        break
    try:
        if command == "add":
            inv.add(parts[1], int(parts[2]))
        elif command == "remove":
            inv.remove(parts[1], int(parts[2]))
        elif command == "report":
            for line in inv.report():
                print(line)
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`,
    wrong:[R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty):
        self.items[name] = self.items.get(name, 0) + qty

    def remove(self, name, qty):
        if name not in self.items:
            raise ValueError(f"Unknown item: {name}")
        if qty > self.items[name]:
            raise ValueError(f"Not enough {name}")
        self.items[name] -= qty

    def report(self):
        if not self.items:
            return ["(empty)"]
        return [f"{n}: {q}" for n, q in sorted(self.items.items())]

inv = Inventory()
while True:
    parts = input("> ").split()
    if not parts:
        continue
    command = parts[0]
    if command == "quit":
        break
    try:
        if command == "add":
            inv.add(parts[1], int(parts[2]))
        elif command == "remove":
            inv.remove(parts[1], int(parts[2]))
        elif command == "report":
            for line in inv.report():
                print(line)
        else:
            print("Unknown command")
    except ValueError as error:
        print("Error:", error)`, R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty):
        self.items[name] = self.items.get(name, 0) + qty

    def remove(self, name, qty):
        self.items[name] -= qty
        if self.items[name] == 0:
            del self.items[name]

    def report(self):
        if not self.items:
            return ["(empty)"]
        return [f"{n}: {q}" for n, q in sorted(self.items.items())]

inv = Inventory()
while True:
    parts = input("> ").split()
    if not parts:
        continue
    command = parts[0]
    if command == "quit":
        break
    try:
        if command == "add":
            inv.add(parts[1], int(parts[2]))
        elif command == "remove":
            inv.remove(parts[1], int(parts[2]))
        elif command == "report":
            for line in inv.report():
                print(line)
        else:
            print("Unknown command")
    except (ValueError, KeyError) as error:
        print("Error:", error)`],
    hints:['add: self.items[name] = self.items.get(name, 0) + qty.','remove: raise ValueError for unknown or too large amounts, subtract, and delete the key at zero. report returns a list of "name: qty" lines, or ["(empty)"].','The loop splits each command; wrap the work in try / except ValueError as error and print "Error:", error.','class Inventory:\n    def __init__(self):\n        self.items = {}\n\n    def add(self, name, qty):\n        self.items[name] = self.items.get(name, 0) + qty\n\n    def remove(self, name, qty):\n        if name not in self.items:\n            raise ValueError(f"Unknown item: {name}")\n        if qty > self.items[name]:\n            raise ValueError(f"Not enough {name}")\n        self.items[name] -= qty\n        if self.items[name] == 0:\n            del self.items[name]\n\n    def report(self):\n        if not self.items:\n            return ["(empty)"]\n        return [f"{n}: {q}" for n, q in sorted(self.items.items())]\n\ninv = Inventory()\nwhile True:\n    parts = input("> ").split()\n    if not parts:\n        continue\n    command = parts[0]\n    if command == "quit":\n        break\n    try:\n        if command == "add":\n            inv.add(parts[1], int(parts[2]))\n        elif command == "remove":\n            inv.remove(parts[1], int(parts[2]))\n        elif command == "report":\n            for line in inv.report():\n                print(line)\n        else:\n            print("Unknown command")\n    except ValueError as error:\n        print("Error:", error)']},
  power:{can:['Wrap a dict inside a class that enforces rules','Separate the class from the command loop that drives it'],
    expand:'Add a `total_items()` method and a `low_stock(limit)` method.',
    where:'Warehouses, shopping carts, game inventories and caches are all classes wrapping a collection.',
    next:'Next: a Real-World Mission: the Guild Bank.'},
  codex:{title:'Collection classes',body:'Hide a dict/list inside a class; expose add/remove/report methods that enforce the rules. Return data from methods, print outside.',snip:R`self.items[name] = self.items.get(name, 0) + qty`}
},
{
  id:'r10-20', realm:10, n:20, title:'Real-World Mission: The Guild Bank',
  teaches:['mission10a'], requires:['class-inventory','class-validate'],
  story:`The guild treasurer slides a smoking ledger across the desk. "Members keep money here, and move it between each other. Last week **a transfer took the money from one account and lost it** when the second account didn't exist. Build me a bank that never loses a coin."`,
  concept:{
    html:`This mission uses **two cooperating classes**:\n\n- \`Account\`: one member's balance, with \`deposit\` and \`withdraw\` that validate.\n- \`Bank\`: owns the accounts (a dict by owner) and handles **cross-account** rules like transfers.\n\nThe golden rule of transfers: **check everything before moving anything.** Find *both* accounts first (raising \`No such account: <name>\` if either is missing) and only then take money from one and give it to the other.\n\n\`\`\`\ndef transfer(self, source, target, amount):\n    src = self.get(source)        # raises if missing\n    dst = self.get(target)        # raises if missing\n    src.withdraw(amount)          # raises if too much or not positive\n    dst.deposit(amount)\n\`\`\`\n\nWhen the lookups happen first, a failed transfer leaves **both** accounts untouched.\n\nThe command layer prints \`Error: <message>\` for any \`ValueError\`. All the rules (negative balances, duplicates, missing accounts) live **in the classes**, so the loop stays tiny.`,
    analogy:`A bank teller who checks both account numbers on the slip before touching any cash.`,
    example:R`class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

a = Account(10)
try:
    a.withdraw(50)
except ValueError as error:
    print("Error:", error)`},
  predict:{code:R`accounts = {"ada": 10}
try:
    accounts["bo"]
except KeyError as error:
    print("missing", error)`, q:'What prints?', opts:["missing 'bo'",'missing bo','Nothing'], ans:0, why:'str(KeyError("bo")) shows the key with its quotes.'},
  cast:{code:R`class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

a = Account(10)
try:
    a.withdraw(50)
except ValueError as error:
    print("Error:", error)`, task:'Cast it.'},
  bug:{broken:R`accounts = {"ada": 100}

def transfer(source, target, amount):
    accounts[source] -= amount
    accounts[target] += amount

try:
    transfer("ada", "bo", 30)
except KeyError:
    pass
print(accounts["ada"])`, task:'The money leaves ada before the missing account "bo" is discovered, so 30 coins vanish. Check both accounts BEFORE moving money. Expected: 100',
    cases:[{inputs:[],tests:[['No loss','lines==["100"]']]}],
    sol:R`accounts = {"ada": 100}

def transfer(source, target, amount):
    if source not in accounts or target not in accounts:
        raise KeyError("missing account")
    accounts[source] -= amount
    accounts[target] += amount

try:
    transfer("ada", "bo", 30)
except KeyError:
    pass
print(accounts["ada"])`, wrong:[R`accounts = {"ada": 100}

def transfer(source, target, amount):
    accounts[source] -= amount
    accounts[target] += amount

try:
    transfer("ada", "bo", 30)
except KeyError:
    pass
print(accounts["ada"])`]},
  write:{prompt:'Build the bank. `Account(balance=0)`: `balance` can\'t start negative (`ValueError("Balance cannot be negative")`); `deposit` and `withdraw` raise `ValueError("Amount must be positive")` for amounts of 0 or less, and `withdraw` raises `ValueError("Insufficient funds")` if the amount is above the balance. `Bank`: `open(owner, amount=0)` (`ValueError("Account exists")` if taken), `get(owner)` (`ValueError("No such account: <owner>")`), `transfer(source, target, amount)` (find both accounts first), and `report()` returning lines `owner: balance` sorted by owner followed by `Total: <sum>`, or `["No accounts"]`. Commands (prompt `> `): `open <name> [amount]`, `deposit <name> <amount>`, `transfer <from> <to> <amount>`, `report`, `quit`. A non-number amount prints `Error: Bad number`; an unknown or malformed command prints `Error: Unknown command`; any `ValueError` prints `Error: <message>`.',
    starter:R`class Account:
    pass

class Bank:
    pass

bank = Bank()
`,
    inputs:['open ada 100','open bo','deposit bo 20','transfer ada bo 30','report','quit'],
    cases:[{inputs:['open ada 100','open bo','deposit bo 20','transfer ada bo 30','report','quit'],tests:[['Full session','[l for l in lines if not l.startswith("> ")]==["ada: 70","bo: 50","Total: 120"]'],['Classes alone','(lambda b: (b.open("a",5), b.open("b"), b.transfer("a","b",3), b.report())[3])(g["Bank"]())==["a: 2","b: 3","Total: 5"]'],['Empty bank','g["Bank"]().report()==["No accounts"]']]},{inputs:['open ada 10','open ada 5','quit'],tests:[['Duplicate','[l for l in lines if not l.startswith("> ")]==["Error: Account exists"]']]},{inputs:['transfer a b 5','quit'],tests:[['Missing source','[l for l in lines if not l.startswith("> ")]==["Error: No such account: a"]']]},{inputs:['open a 5','transfer a b 1','quit'],tests:[['Missing target keeps money','[l for l in lines if not l.startswith("> ")]==["Error: No such account: b"]'],['Money untouched','g["bank"].get("a").balance==5']]},{inputs:['open a 5','open b','transfer a b 10','report','quit'],tests:[['Insufficient','[l for l in lines if not l.startswith("> ")]==["Error: Insufficient funds","a: 5","b: 0","Total: 5"]']]},{inputs:['open a 10','open b 10','transfer a b 0','report','quit'],tests:[['Zero transfer','[l for l in lines if not l.startswith("> ")]==["Error: Amount must be positive","a: 10","b: 10","Total: 20"]']]},{inputs:['open a 5','deposit a x','quit'],tests:[['Bad number','[l for l in lines if not l.startswith("> ")]==["Error: Bad number"]']]},{inputs:['open a -5','quit'],tests:[['Negative start','[l for l in lines if not l.startswith("> ")]==["Error: Balance cannot be negative"]']]},{inputs:['dance','open','quit'],tests:[['Unknown and malformed','[l for l in lines if not l.startswith("> ")]==["Error: Unknown command","Error: Unknown command"]']]},{inputs:['report','quit'],tests:[['No accounts','[l for l in lines if not l.startswith("> ")]==["No accounts"]']]}],
    sol:R`class Account:
    def __init__(self, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

class Bank:
    def __init__(self):
        self.accounts = {}

    def open(self, owner, amount=0):
        if owner in self.accounts:
            raise ValueError("Account exists")
        self.accounts[owner] = Account(amount)

    def get(self, owner):
        if owner not in self.accounts:
            raise ValueError(f"No such account: {owner}")
        return self.accounts[owner]

    def transfer(self, source, target, amount):
        src = self.get(source)
        dst = self.get(target)
        src.withdraw(amount)
        dst.deposit(amount)

    def report(self):
        if not self.accounts:
            return ["No accounts"]
        lines = [f"{o}: {a.balance}" for o, a in sorted(self.accounts.items())]
        lines.append("Total: " + str(sum(a.balance for a in self.accounts.values())))
        return lines

def number(text):
    try:
        return int(text)
    except ValueError:
        raise ValueError("Bad number")

bank = Bank()
while True:
    parts = input("> ").split()
    if parts and parts[0] == "quit":
        break
    try:
        if parts and parts[0] == "open" and len(parts) in (2, 3):
            bank.open(parts[1], number(parts[2]) if len(parts) == 3 else 0)
        elif parts and parts[0] == "deposit" and len(parts) == 3:
            bank.get(parts[1]).deposit(number(parts[2]))
        elif parts and parts[0] == "transfer" and len(parts) == 4:
            bank.transfer(parts[1], parts[2], number(parts[3]))
        elif parts and parts[0] == "report" and len(parts) == 1:
            for line in bank.report():
                print(line)
        else:
            raise ValueError("Unknown command")
    except ValueError as error:
        print("Error:", error)`,
    wrong:[R`class Account:
    def __init__(self, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

class Bank:
    def __init__(self):
        self.accounts = {}

    def open(self, owner, amount=0):
        if owner in self.accounts:
            raise ValueError("Account exists")
        self.accounts[owner] = Account(amount)

    def get(self, owner):
        if owner not in self.accounts:
            raise ValueError(f"No such account: {owner}")
        return self.accounts[owner]

    def transfer(self, source, target, amount):
        src = self.get(source)
        src.withdraw(amount)
        self.get(target).deposit(amount)

    def report(self):
        if not self.accounts:
            return ["No accounts"]
        lines = [f"{o}: {a.balance}" for o, a in sorted(self.accounts.items())]
        lines.append("Total: " + str(sum(a.balance for a in self.accounts.values())))
        return lines

def number(text):
    try:
        return int(text)
    except ValueError:
        raise ValueError("Bad number")

bank = Bank()
while True:
    parts = input("> ").split()
    if parts and parts[0] == "quit":
        break
    try:
        if parts and parts[0] == "open" and len(parts) in (2, 3):
            bank.open(parts[1], number(parts[2]) if len(parts) == 3 else 0)
        elif parts and parts[0] == "deposit" and len(parts) == 3:
            bank.get(parts[1]).deposit(number(parts[2]))
        elif parts and parts[0] == "transfer" and len(parts) == 4:
            bank.transfer(parts[1], parts[2], number(parts[3]))
        elif parts and parts[0] == "report" and len(parts) == 1:
            for line in bank.report():
                print(line)
        else:
            raise ValueError("Unknown command")
    except ValueError as error:
        print("Error:", error)`, R`class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

class Bank:
    def __init__(self):
        self.accounts = {}

    def open(self, owner, amount=0):
        if owner in self.accounts:
            raise ValueError("Account exists")
        self.accounts[owner] = Account(amount)

    def get(self, owner):
        if owner not in self.accounts:
            raise ValueError(f"No such account: {owner}")
        return self.accounts[owner]

    def transfer(self, source, target, amount):
        src = self.get(source)
        dst = self.get(target)
        src.withdraw(amount)
        dst.deposit(amount)

    def report(self):
        if not self.accounts:
            return ["No accounts"]
        lines = [f"{o}: {a.balance}" for o, a in sorted(self.accounts.items())]
        lines.append("Total: " + str(sum(a.balance for a in self.accounts.values())))
        return lines

def number(text):
    try:
        return int(text)
    except ValueError:
        raise ValueError("Bad number")

bank = Bank()
while True:
    parts = input("> ").split()
    if parts and parts[0] == "quit":
        break
    try:
        if parts and parts[0] == "open" and len(parts) in (2, 3):
            bank.open(parts[1], number(parts[2]) if len(parts) == 3 else 0)
        elif parts and parts[0] == "deposit" and len(parts) == 3:
            bank.get(parts[1]).deposit(number(parts[2]))
        elif parts and parts[0] == "transfer" and len(parts) == 4:
            bank.transfer(parts[1], parts[2], number(parts[3]))
        elif parts and parts[0] == "report" and len(parts) == 1:
            for line in bank.report():
                print(line)
        else:
            raise ValueError("Unknown command")
    except ValueError as error:
        print("Error:", error)`],
    hints:['Account validates balance and amounts. Bank keeps self.accounts = {} and get() raises ValueError("No such account: ...").','transfer: look up BOTH accounts first (src = self.get(source); dst = self.get(target)), then src.withdraw(amount) and dst.deposit(amount).','In the loop convert numbers with a helper that raises ValueError("Bad number"), and print "Error:", error for any ValueError. report() returns the sorted lines plus the Total line.','class Account:\n    def __init__(self, balance=0):\n        if balance < 0:\n            raise ValueError("Balance cannot be negative")\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n\nclass Bank:\n    def __init__(self):\n        self.accounts = {}\n\n    def open(self, owner, amount=0):\n        if owner in self.accounts:\n            raise ValueError("Account exists")\n        self.accounts[owner] = Account(amount)\n\n    def get(self, owner):\n        if owner not in self.accounts:\n            raise ValueError(f"No such account: {owner}")\n        return self.accounts[owner]\n\n    def transfer(self, source, target, amount):\n        src = self.get(source)\n        dst = self.get(target)\n        src.withdraw(amount)\n        dst.deposit(amount)\n\n    def report(self):\n        if not self.accounts:\n            return ["No accounts"]\n        lines = [f"{o}: {a.balance}" for o, a in sorted(self.accounts.items())]\n        lines.append("Total: " + str(sum(a.balance for a in self.accounts.values())))\n        return lines\n\ndef number(text):\n    try:\n        return int(text)\n    except ValueError:\n        raise ValueError("Bad number")\n\nbank = Bank()\nwhile True:\n    parts = input("> ").split()\n    if parts and parts[0] == "quit":\n        break\n    try:\n        if parts and parts[0] == "open" and len(parts) in (2, 3):\n            bank.open(parts[1], number(parts[2]) if len(parts) == 3 else 0)\n        elif parts and parts[0] == "deposit" and len(parts) == 3:\n            bank.get(parts[1]).deposit(number(parts[2]))\n        elif parts and parts[0] == "transfer" and len(parts) == 4:\n            bank.transfer(parts[1], parts[2], number(parts[3]))\n        elif parts and parts[0] == "report" and len(parts) == 1:\n            for line in bank.report():\n                print(line)\n        else:\n            raise ValueError("Unknown command")\n    except ValueError as error:\n        print("Error:", error)']},
  power:{can:['Design two cooperating classes','Make multi-step operations safe by checking first'],
    expand:'Add a `history` list to each Account that records every deposit and withdrawal.',
    where:'Every payments, booking and inventory system has this shape: accounts, an owner object, and safe transfers.',
    next:'Next: inheritance, building new classes from old ones.'},
  codex:{title:'Mission: Guild Bank',body:'Account validates itself; Bank owns the accounts and coordinates transfers. Look up everything first, then change. Keep rules in the classes and the loop thin.',snip:R`src = self.get(source)
dst = self.get(target)
src.withdraw(amount)
dst.deposit(amount)`}
}
);
