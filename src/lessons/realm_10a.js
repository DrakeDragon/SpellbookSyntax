// REALM 10 — THE GUILDHALL — part A (lessons 1-10: classes and objects)
LESSONS.push(
{
  id:'r10-01', realm:10, n:1, title:'Your first class',
  teaches:['class-basic'], requires:['realm9-gap'],
  story:`Past the Workshop rises the **Guildhall**, a hall of banners, each embroidered with a different creature. Guildmistress Vael taps a banner. "Until now you used types other people made: lists, dicts, dates. A guild builds **its own**. A **class** is a blueprint. Each thing built from it is an **object**."`,
  concept:{
    html:`A **class** describes a kind of thing. An **object** (or *instance*) is one particular thing of that kind.\n\n\`\`\`\nclass Hero:\n    pass              # an empty blueprint for now\n\na = Hero()            # build one object: call the class like a function\nb = Hero()            # build another\n\na.name = "Ada"        # attach data to the object: an attribute\nb.name = "Bo"\nprint(a.name, b.name) # Ada Bo\n\`\`\`\n\n- \`Hero\` is the **class** (capital first letter by convention). \`a\` and \`b\` are **objects**, each with its own attributes.\n- An attribute is a variable that lives **inside** an object, reached with a dot.\n- \`type(a)\` is the class; \`isinstance(a, Hero)\` is \`True\`.\n- Setting an attribute on \`a\` does **not** affect \`b\`.\n- \`pass\` means "nothing here yet". A class body can't be empty.`,
    analogy:`A cookie cutter (class) and the cookies (objects) you stamp out with it.`,
    example:R`class Hero:
    pass

a = Hero()
b = Hero()
a.name = "Ada"
b.name = "Bo"
print(a.name, b.name)
print(isinstance(a, Hero))`},
  predict:{code:R`class Dog:
    pass

a = Dog()
b = Dog()
a.name = "Rex"
print(hasattr(b, "name"))`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'The attribute was set on a only; b is a separate object.'},
  cast:{code:R`class Hero:
    pass

a = Hero()
b = Hero()
a.name = "Ada"
b.name = "Bo"
print(a.name, b.name)
print(isinstance(a, Hero))`, task:'Cast it.'},
  bug:{broken:R`class Hero:

h = Hero()
h.name = "Ada"
print(h.name)`, task:'IndentationError: a class body cannot be empty. Fill it with pass. Expected: Ada',
    cases:[{inputs:[],tests:[['Works','lines==["Ada"]']]}],
    sol:R`class Hero:
    pass

h = Hero()
h.name = "Ada"
print(h.name)`, wrong:[R`class Hero:

h = Hero()
h.name = "Ada"
print(h.name)`]},
  write:{prompt:'Define an empty class `Hero`. Make two heroes, `a` and `b`. Give `a` the name `Ada` and `b` the name `Bo` (as attributes). Print `Ada meets Bo`, taking both names from the objects.',
    starter:R`# define Hero, then build a and b
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Ada meets Bo"]'],['Hero is a class','isinstance(g["Hero"], type)'],['Two separate objects','g["a"] is not g["b"] and g["a"].name=="Ada" and g["b"].name=="Bo"'],['Right type','isinstance(g["a"], g["Hero"]) and isinstance(g["b"], g["Hero"])']]}],
    sol:R`class Hero:
    pass

a = Hero()
b = Hero()
a.name = "Ada"
b.name = "Bo"
print(a.name, "meets", b.name)`,
    wrong:[R`class Hero:
    pass

a = Hero()
b = a
a.name = "Ada"
b.name = "Bo"
print(a.name, "meets", b.name)`, R`a = {"name": "Ada"}
b = {"name": "Bo"}
print(a["name"], "meets", b["name"])`],
    hints:['class Hero: with pass inside, then a = Hero() and b = Hero().','Attributes: a.name = "Ada" and b.name = "Bo".','Use two separate objects (b = Hero(), not b = a).','class Hero:\n    pass\n\na = Hero()\nb = Hero()\na.name = "Ada"\nb.name = "Bo"\nprint(a.name, "meets", b.name)']},
  power:{can:['Define a class and build objects from it','Store data on an object with attributes'],
    expand:'Give each hero a `hp` attribute and print both.',
    where:'Almost every Python library hands you objects: dates, files, requests, database rows.',
    next:'Next: __init__, building objects that start with data.'},
  codex:{title:'class',body:'class Name: defines a blueprint. Name() builds an object. obj.attr = value stores data. Each object has its own attributes.',snip:R`class Hero:
    pass
a = Hero()`}
},
{
  id:'r10-02', realm:10, n:2, title:'__init__ and self: objects that start ready',
  teaches:['class-init'], requires:['class-basic'],
  story:`"Setting attributes one at a time after building an object is clumsy and easy to forget," Vael says. "A proper hero should **arrive ready**: name, hit points, power, all set at birth."`,
  concept:{
    html:`\`__init__\` is a special method Python calls **automatically** when you build an object. It sets up the starting data:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, hp=20, power=5):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\nada = Hero("Ada")                 # hp=20, power=5 (defaults)\nboss = Hero("Boss", 50, 9)\nprint(ada.name, ada.hp, boss.power)\n\`\`\`\n\n- **\`self\`** is the object being built. Python passes it in automatically as the first argument. You never type it when **calling**, but you always write it when **defining** a method.\n- \`self.name = name\` stores the argument on the object (left: the attribute, right: the parameter).\n- Parameters can have **defaults**, just like any function.\n- Forgetting \`self\` in the definition is a classic \`TypeError\` ("takes 1 positional argument but 2 were given").`,
    analogy:`__init__ is the birth certificate form: fill in the fields and the new hero arrives with them.`,
    example:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

ada = Hero("Ada")
boss = Hero("Boss", 50, 9)
print(ada.name, ada.hp, boss.power)`},
  predict:{code:R`class Thing:
    def __init__(self):
        print("made")

Thing()
Thing()`, q:'What prints?', opts:['made made (two lines)','made (one line)','Nothing'], ans:0, why:'__init__ runs every time an object is built.'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

ada = Hero("Ada")
boss = Hero("Boss", 50, 9)
print(ada.name, ada.hp, boss.power)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(name):
        self.name = name

h = Hero("Ada")
print(h.name)`, task:'TypeError: the method definition has no self. Add it. Expected: Ada',
    cases:[{inputs:[],tests:[['Works','lines==["Ada"]']]}],
    sol:R`class Hero:
    def __init__(self, name):
        self.name = name

h = Hero("Ada")
print(h.name)`, wrong:[R`class Hero:
    def __init__(name):
        self.name = name

h = Hero("Ada")
print(h.name)`]},
  write:{prompt:'Define `Hero` with `__init__(self, name, hp=20, power=5)` that stores all three. Ask `Name: `, build `hero = Hero(name)` and print `<name>: <hp> HP, <power> power`. Then build `boss = Hero("Boss", 50, 9)` and print it the same way.',
    starter:R`class Hero:
    pass

name = input("Name: ")
`,
    inputs:['Ada'],
    cases:[{inputs:['Ada'],tests:[['Both lines','lines[-2:]==["Ada: 20 HP, 5 power","Boss: 50 HP, 9 power"]'],['Attributes','(lambda h: (h.name,h.hp,h.power))(g["Hero"]("Z"))==("Z",20,5) and (lambda h: (h.name,h.hp,h.power))(g["Hero"]("B",50,9))==("B",50,9)']]},{inputs:['Bo'],tests:[['Another name','lines[-2:]==["Bo: 20 HP, 5 power","Boss: 50 HP, 9 power"]'],['Keyword args work','g["Hero"]("K", power=7).power==7 and g["Hero"]("K", power=7).hp==20']]}],
    sol:R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = hp
        self.power = power

name = input("Name: ")
hero = Hero(name)
print(f"{hero.name}: {hero.hp} HP, {hero.power} power")
boss = Hero("Boss", 50, 9)
print(f"{boss.name}: {boss.hp} HP, {boss.power} power")`,
    wrong:[R`class Hero:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

name = input("Name: ")
hero = Hero(name, 20, 5)
print(f"{hero.name}: {hero.hp} HP, {hero.power} power")
boss = Hero("Boss", 50, 9)
print(f"{boss.name}: {boss.hp} HP, {boss.power} power")`, R`class Hero:
    def __init__(self, name, hp=20, power=5):
        self.name = name
        self.hp = power
        self.power = hp

name = input("Name: ")
hero = Hero(name)
print(f"{hero.name}: {hero.hp} HP, {hero.power} power")
boss = Hero("Boss", 50, 9)
print(f"{boss.name}: {boss.hp} HP, {boss.power} power")`],
    hints:['def __init__(self, name, hp=20, power=5): then self.name = name and so on.','hero = Hero(name) uses the defaults; boss = Hero("Boss", 50, 9) overrides them.','Print each with an f-string: f"{hero.name}: {hero.hp} HP, {hero.power} power".','class Hero:\n    def __init__(self, name, hp=20, power=5):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\nname = input("Name: ")\nhero = Hero(name)\nprint(f"{hero.name}: {hero.hp} HP, {hero.power} power")\nboss = Hero("Boss", 50, 9)\nprint(f"{boss.name}: {boss.hp} HP, {boss.power} power")']},
  power:{can:['Build objects that start with data','Use self and default parameters in __init__'],
    expand:'Add a `hero.max_hp` attribute that starts equal to `hp`.',
    where:'Every class you meet in a library has an __init__ that sets up its starting state.',
    next:'Next: methods, giving objects behaviour.'},
  codex:{title:'__init__ and self',body:'__init__(self, ...) runs when an object is built. self is the new object: store data with self.name = name. Defaults work as usual.',snip:R`def __init__(self, name, hp=20):
    self.name = name`}
},
{
  id:'r10-03', realm:10, n:3, title:'Methods: objects that do things',
  teaches:['class-method'], requires:['class-init'],
  story:`"A hero who only holds numbers is a statue," Vael says. "Give them **actions**: take a hit, drink a potion, check if they're still standing. Actions that belong to an object are called **methods**."`,
  concept:{
    html:`A **method** is a function defined inside a class. Its first parameter is \`self\`, which lets it read and **change the object's own data**:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, max_hp):\n        self.name = name\n        self.max_hp = max_hp\n        self.hp = max_hp\n\n    def take_damage(self, amount):\n        self.hp = max(0, self.hp - amount)         # never below 0\n\n    def heal(self, amount):\n        self.hp = min(self.max_hp, self.hp + amount)   # never above max\n\n    def is_alive(self):\n        return self.hp > 0\n\nh = Hero("Ada", 20)\nh.take_damage(7)\nprint(h.hp, h.is_alive())    # 13 True\n\`\`\`\n\n- Call a method with a dot: \`h.take_damage(7)\`. Python passes \`h\` in as \`self\`.\n- \`h.take_damage(7)\` is the same as \`Hero.take_damage(h, 7)\`.\n- To change the object you must assign to **\`self.something\`**. A plain local variable (\`hp = self.hp + 1\`) disappears when the method ends.\n- Methods can **return** values (\`is_alive\`) or just change state (\`heal\`).\n- A method that changes state usually returns nothing (\`None\`).`,
    analogy:`The class is a character sheet with buttons. Each button is a method that edits that sheet.`,
    example:R`class Hero:
    def __init__(self, name, max_hp):
        self.name = name
        self.max_hp = max_hp
        self.hp = max_hp

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def is_alive(self):
        return self.hp > 0

h = Hero("Ada", 20)
h.take_damage(7)
print(h.hp, h.is_alive())`},
  predict:{code:R`class A:
    def hi(self):
        return "hi"

a = A()
print(a.hi() == A.hi(a))`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'a.hi() is shorthand for A.hi(a).'},
  cast:{code:R`class Hero:
    def __init__(self, name, max_hp):
        self.name = name
        self.max_hp = max_hp
        self.hp = max_hp

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def is_alive(self):
        return self.hp > 0

h = Hero("Ada", 20)
h.take_damage(7)
print(h.hp, h.is_alive())`, task:'Cast it. Try take_damage(50).'},
  bug:{broken:R`class Hero:
    def __init__(self, hp):
        self.hp = hp

    def heal(self, amount):
        hp = self.hp + amount

h = Hero(10)
h.heal(5)
print(h.hp)`, task:'The heal does nothing: it changes a local variable, not the object. Expected: 15',
    cases:[{inputs:[],tests:[['Healed','lines==["15"]']]}],
    sol:R`class Hero:
    def __init__(self, hp):
        self.hp = hp

    def heal(self, amount):
        self.hp = self.hp + amount

h = Hero(10)
h.heal(5)
print(h.hp)`, wrong:[R`class Hero:
    def __init__(self, hp):
        self.hp = hp

    def heal(self, amount):
        hp = self.hp + amount

h = Hero(10)
h.heal(5)
print(h.hp)`]},
  write:{prompt:'Write `Hero(name, max_hp)` with `hp` starting at `max_hp`, and methods `take_damage(amount)` (hp never below 0), `heal(amount)` (hp never above `max_hp`) and `is_alive()`. Then: build `Hero("Ada", 20)`, ask `Damage: `, apply it and print `HP: <hp>` and `Alive: yes` or `no`. Finally heal 5 and print `After heal: <hp>`.',
    starter:R`class Hero:
    pass

hero = Hero("Ada", 20)
`,
    inputs:['7'],
    cases:[{inputs:['7'],tests:[['Normal hit','lines[-3:]==["HP: 13","Alive: yes","After heal: 18"]']]},{inputs:['30'],tests:[['Overkill','lines[-3:]==["HP: 0","Alive: no","After heal: 5"]']]},{inputs:['0'],tests:[['No damage heal is capped','lines[-3:]==["HP: 20","Alive: yes","After heal: 20"]']]},{inputs:['19'],tests:[['Barely alive','lines[-3:]==["HP: 1","Alive: yes","After heal: 6"]'],['Class works alone','(lambda h: (h.take_damage(3), h.heal(50), h.hp)[2])(g["Hero"]("Q", 10))==10 and g["Hero"]("Q", 10).is_alive() is True']]}],
    sol:R`class Hero:
    def __init__(self, name, max_hp):
        self.name = name
        self.max_hp = max_hp
        self.hp = max_hp

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)

    def is_alive(self):
        return self.hp > 0

hero = Hero("Ada", 20)
hero.take_damage(int(input("Damage: ")))
print("HP:", hero.hp)
print("Alive:", "yes" if hero.is_alive() else "no")
hero.heal(5)
print("After heal:", hero.hp)`,
    wrong:[R`class Hero:
    def __init__(self, name, max_hp):
        self.name = name
        self.max_hp = max_hp
        self.hp = max_hp

    def take_damage(self, amount):
        self.hp = self.hp - amount

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)

    def is_alive(self):
        return self.hp > 0

hero = Hero("Ada", 20)
hero.take_damage(int(input("Damage: ")))
print("HP:", hero.hp)
print("Alive:", "yes" if hero.is_alive() else "no")
hero.heal(5)
print("After heal:", hero.hp)`, R`class Hero:
    def __init__(self, name, max_hp):
        self.name = name
        self.max_hp = max_hp
        self.hp = max_hp

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def heal(self, amount):
        self.hp = self.hp + amount

    def is_alive(self):
        return self.hp > 0

hero = Hero("Ada", 20)
hero.take_damage(int(input("Damage: ")))
print("HP:", hero.hp)
print("Alive:", "yes" if hero.is_alive() else "no")
hero.heal(5)
print("After heal:", hero.hp)`],
    hints:['__init__ stores name, max_hp and hp = max_hp.','take_damage: self.hp = max(0, self.hp - amount). heal: self.hp = min(self.max_hp, self.hp + amount).','is_alive returns self.hp > 0. Print with "yes" if ... else "no".','class Hero:\n    def __init__(self, name, max_hp):\n        self.name = name\n        self.max_hp = max_hp\n        self.hp = max_hp\n\n    def take_damage(self, amount):\n        self.hp = max(0, self.hp - amount)\n\n    def heal(self, amount):\n        self.hp = min(self.max_hp, self.hp + amount)\n\n    def is_alive(self):\n        return self.hp > 0\n\nhero = Hero("Ada", 20)\nhero.take_damage(int(input("Damage: ")))\nprint("HP:", hero.hp)\nprint("Alive:", "yes" if hero.is_alive() else "no")\nhero.heal(5)\nprint("After heal:", hero.hp)']},
  power:{can:['Give objects behaviour with methods','Change an object\'s state through self'],
    expand:'Add `attack(self, other)` that makes `other` take `self.power` damage.',
    where:'Bank accounts, game characters, shopping carts, UI widgets: all objects with methods that change state.',
    next:'Next: data shared by the whole class.'},
  codex:{title:'Methods',body:'def method(self, ...). Change state with self.attr = .... Call with obj.method(). Local variables vanish; self attributes persist.',snip:R`def heal(self, n):
    self.hp = min(self.max_hp, self.hp + n)`}
},
{
  id:'r10-04', realm:10, n:4, title:'Class attributes: data shared by every object',
  teaches:['class-attrs'], requires:['class-method'],
  story:`"How many heroes has the guild trained? Each hero can't know. That number belongs to the **guild itself**, not to any one hero," Vael says, tallying marks on the wall.`,
  concept:{
    html:`Data written **inside the class** (outside any method) is a **class attribute**, shared by all objects:\n\n\`\`\`\nclass Hero:\n    species = "human"          # shared by every Hero\n    count = 0                  # also shared: a counter\n\n    def __init__(self, name):\n        self.name = name       # instance attribute: one per object\n        Hero.count += 1        # update the shared counter\n\na = Hero("Ada")\nb = Hero("Bo")\nprint(Hero.count)              # 2\nprint(a.species, b.species)    # human human\n\`\`\`\n\n- **Instance attribute**: \`self.x\`, one copy per object.\n- **Class attribute**: written in the class body, one copy for all. Read it via the class (\`Hero.count\`) or any object.\n- To **change** a shared value, use the class name: \`Hero.count += 1\`.\n- ⚠️ \`a.count = 5\` does **not** change the shared value. It creates a *new instance attribute* on \`a\` that hides it. Then \`Hero.count\` is unchanged.\n- Good uses: constants (\`MAX_LEVEL = 99\`), counters, default settings.`,
    analogy:`A guild noticeboard everyone can read, versus each hero's private notebook.`,
    example:R`class Hero:
    species = "human"
    count = 0

    def __init__(self, name):
        self.name = name
        Hero.count += 1

a = Hero("Ada")
b = Hero("Bo")
print(Hero.count)
print(a.species, b.species)`},
  predict:{code:R`class A:
    x = 1

a = A()
a.x = 5
print(A.x, a.x)`, q:'What prints?', opts:['1 5','5 5','1 1'], ans:0, why:'a.x = 5 creates a new instance attribute on a. The class attribute stays 1.'},
  cast:{code:R`class Hero:
    species = "human"
    count = 0

    def __init__(self, name):
        self.name = name
        Hero.count += 1

a = Hero("Ada")
b = Hero("Bo")
print(Hero.count)
print(a.species, b.species)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self):
        self.count = 0
        self.count += 1

a = Hero()
b = Hero()
print(Hero.count)`, task:'AttributeError: count lives on each object, so Hero.count does not exist. Make it a shared class attribute. Expected: 2',
    cases:[{inputs:[],tests:[['Two','lines==["2"]']]}],
    sol:R`class Hero:
    count = 0

    def __init__(self):
        Hero.count += 1

a = Hero()
b = Hero()
print(Hero.count)`, wrong:[R`class Hero:
    def __init__(self):
        self.count = 0
        self.count += 1

a = Hero()
b = Hero()
print(Hero.count)`]},
  write:{prompt:'Define `Hero` with a class attribute `count = 0` (heroes created so far) and `species = "human"`, and `__init__(self, name)`. Ask `Names: ` (space-separated), build one `Hero` per name and print `Created: <n>` and `Species: <species>`.',
    starter:R`class Hero:
    pass

names = input("Names: ").split()
`,
    inputs:['Ada Bo Cy'],
    cases:[{inputs:['Ada Bo Cy'],tests:[['Three','lines[-2:]==["Created: 3","Species: human"]'],['Shared counter','g["Hero"].count==3']]},{inputs:[''],tests:[['None','lines[-2:]==["Created: 0","Species: human"]'],['Counter zero','g["Hero"].count==0']]},{inputs:['Solo'],tests:[['One','lines[-2:]==["Created: 1","Species: human"]'],['Class attribute not instance','"count" not in vars(g["Hero"]("x"))']]}],
    sol:R`class Hero:
    species = "human"
    count = 0

    def __init__(self, name):
        self.name = name
        Hero.count += 1

names = input("Names: ").split()
for name in names:
    Hero(name)
print("Created:", Hero.count)
print("Species:", Hero.species)`,
    wrong:[R`class Hero:
    species = "human"

    def __init__(self, name):
        self.name = name
        self.count = 0
        self.count += 1

names = input("Names: ").split()
heroes = [Hero(name) for name in names]
print("Created:", len(heroes))
print("Species:", Hero.species)`, R`class Hero:
    species = "human"
    count = 0

    def __init__(self, name):
        self.name = name
        self.count = self.count + 1

names = input("Names: ").split()
for name in names:
    Hero(name)
print("Created:", Hero.count)
print("Species:", Hero.species)`],
    hints:['Put count = 0 and species = "human" directly inside the class body.','In __init__, add one to the shared counter with Hero.count += 1.','Loop over names, build Hero(name), then print Hero.count.','class Hero:\n    species = "human"\n    count = 0\n\n    def __init__(self, name):\n        self.name = name\n        Hero.count += 1\n\nnames = input("Names: ").split()\nfor name in names:\n    Hero(name)\nprint("Created:", Hero.count)\nprint("Species:", Hero.species)']},
  power:{can:['Share data across all objects with class attributes','Avoid the instance-attribute shadowing trap'],
    expand:'Add a class constant `MAX_HP = 100` and use it as the default for hp.',
    where:'Constants, registries and counters are class attributes in nearly every codebase.',
    next:'Next: __str__ and __repr__, so objects print nicely.'},
  codex:{title:'Class attributes',body:'Defined in the class body, shared by all. Change with ClassName.attr. obj.attr = x creates a separate instance attribute that hides it.',snip:R`Hero.count += 1`}
},
{
  id:'r10-05', realm:10, n:5, title:'__str__ and __repr__: objects that print nicely',
  teaches:['class-str'], requires:['class-attrs'],
  story:`Vael hands you a hero card and it reads: **\`<__main__.Hero object at 0x7f3a>\`**. "Useless! Teach your objects to introduce themselves."`,
  concept:{
    html:`By default, printing an object shows an ugly address. Two special methods fix it:\n\n\`\`\`\nclass Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __str__(self):             # for people: print(p), f"{p}"\n        return f"({self.x}, {self.y})"\n\n    def __repr__(self):            # for programmers: the REPL, lists, debugging\n        return f"Point({self.x}, {self.y})"\n\np = Point(3, 4)\nprint(p)           # (3, 4)\nprint(repr(p))     # Point(3, 4)\nprint([p])         # [Point(3, 4)]   (lists show repr)\n\`\`\`\n\n- Both methods must **return** a string (not print one).\n- \`print(obj)\` and \`str(obj)\` use \`__str__\`. If it is missing, Python falls back to \`__repr__\`.\n- A good \`__repr__\` looks like the code that would rebuild the object.\n- If you only write one, write **\`__repr__\`**.`,
    analogy:`__str__ is the name badge for guests; __repr__ is the technical label for the engineers.`,
    example:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 4)
print(p)
print(repr(p))
print([p])`},
  predict:{code:R`class P:
    def __repr__(self):
        return "P!"

print(P())`, q:'What prints?', opts:['P!','<__main__.P object ...>','Error'], ans:0, why:'With no __str__, print falls back to __repr__.'},
  cast:{code:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

p = Point(3, 4)
print(p)
print(repr(p))
print([p])`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def __str__(self):
        print(f"{self.name} (HP {self.hp})")

print(Hero("Ada", 20))`, task:'TypeError: __str__ must RETURN a string, not print one. Expected: Ada (HP 20)',
    cases:[{inputs:[],tests:[['Right','lines==["Ada (HP 20)"]']]}],
    sol:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def __str__(self):
        return f"{self.name} (HP {self.hp})"

print(Hero("Ada", 20))`, wrong:[R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def __str__(self):
        print(f"{self.name} (HP {self.hp})")

print(Hero("Ada", 20))`]},
  write:{prompt:'Define `Point(x, y)` with `__str__` returning `(x, y)` and `__repr__` returning `Point(x, y)`. Ask `X: ` and `Y: ` (whole numbers), build the point and print it, then `repr` of it, then a list holding it.',
    starter:R`class Point:
    pass

x = int(input("X: "))
y = int(input("Y: "))
`,
    inputs:['3','4'],
    cases:[{inputs:['3','4'],tests:[['Three lines','lines[-3:]==["(3, 4)","Point(3, 4)","[Point(3, 4)]"]'],['Methods return strings','str(g["Point"](1,2))=="(1, 2)" and repr(g["Point"](1,2))=="Point(1, 2)"']]},{inputs:['-1','0'],tests:[['Negative','lines[-3:]==["(-1, 0)","Point(-1, 0)","[Point(-1, 0)]"]']]}],
    sol:R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

x = int(input("X: "))
y = int(input("Y: "))
p = Point(x, y)
print(p)
print(repr(p))
print([p])`,
    wrong:[R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

x = int(input("X: "))
y = int(input("Y: "))
p = Point(x, y)
print(p)
print(repr(p))
print([p])`, R`class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return f"({self.x}, {self.y})"

x = int(input("X: "))
y = int(input("Y: "))
p = Point(x, y)
print(p)
print(repr(p))
print([p])`],
    hints:['__init__ stores x and y.','__str__ returns f"({self.x}, {self.y})" and __repr__ returns f"Point({self.x}, {self.y})". Return, not print.','print(p), print(repr(p)), print([p]).','class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n\n    def __repr__(self):\n        return f"Point({self.x}, {self.y})"\n\nx = int(input("X: "))\ny = int(input("Y: "))\np = Point(x, y)\nprint(p)\nprint(repr(p))\nprint([p])']},
  power:{can:['Make objects print readable text','Know the difference between __str__ and __repr__'],
    expand:'Add `__str__` to a `Hero` so `print(hero)` shows `Ada (20/20 HP)`.',
    where:'Good reprs make debugging and logging far easier; every serious class has one.',
    next:'Next: collections of objects.'},
  codex:{title:'__str__ and __repr__',body:'__str__ for people (print), __repr__ for programmers (lists, debugging). Both RETURN strings. repr is the fallback if str is missing.',snip:R`def __repr__(self):
    return f"Point({self.x}, {self.y})"`}
},
{
  id:'r10-06', realm:10, n:6, title:'Lists of objects: sorting and searching',
  teaches:['class-lists'], requires:['class-str'],
  story:`The Guildhall roll-call: dozens of heroes, each an object. "A guild is a **collection** of objects," Vael says. "Sorting, searching, totalling: you already know how, only now the items have attributes."`,
  concept:{
    html:`Objects go in lists like any other value. Use **\`key=\`** to say *which attribute* to sort or compare by:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nparty = [Hero("Ada", 20), Hero("Bo", 35), Hero("Cy", 35)]\n\nstrongest = max(party, key=lambda h: h.hp)\nordered = sorted(party, key=lambda h: (-h.hp, h.name))   # hp desc, then name\ntotal = sum(h.hp for h in party)\nnames = [h.name for h in party if h.hp > 25]\n\`\`\`\n\n- \`sorted(party)\` with no key is a **TypeError**: Python doesn't know how to order Heroes (we fix that properly with \`__lt__\` later).\n- \`(-h.hp, h.name)\` is the tuple trick for "biggest first, then A–Z".\n- \`max\`/\`min\` also take \`key=\`. On a tie they return the **first** one.\n- Attributes work in comprehensions and generators like any other value.`,
    analogy:`A roll-call sheet: the same list, ordered by whichever column you pick.`,
    example:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = [Hero("Ada", 20), Hero("Bo", 35), Hero("Cy", 35)]
ordered = sorted(party, key=lambda h: (-h.hp, h.name))
print([h.name for h in ordered])
print(sum(h.hp for h in party))`},
  predict:{code:R`class H:
    def __init__(self, hp):
        self.hp = hp

heroes = [H(5), H(9), H(9)]
best = max(heroes, key=lambda h: h.hp)
print(best is heroes[1])`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'On a tie, max returns the first one it met (index 1 here).'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = [Hero("Ada", 20), Hero("Bo", 35), Hero("Cy", 35)]
ordered = sorted(party, key=lambda h: (-h.hp, h.name))
print([h.name for h in ordered])
print(sum(h.hp for h in party))`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = [Hero("Ada", 20), Hero("Bo", 35)]
print([h.name for h in sorted(party)])`, task:'TypeError: Python can\'t compare Heroes. Sort by hp with a key. Expected: [\'Ada\', \'Bo\']',
    cases:[{inputs:[],tests:[['Sorted','lines==["[\'Ada\', \'Bo\']"]'],['Uses key','"key=" in src']]}],
    sol:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = [Hero("Ada", 20), Hero("Bo", 35)]
print([h.name for h in sorted(party, key=lambda h: h.hp)])`, wrong:[R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = [Hero("Ada", 20), Hero("Bo", 35)]
print([h.name for h in sorted(party)])`]},
  write:{prompt:'The `Hero` class is given. Ask `Heroes: ` as `name:hp` pairs (like `Ada:20 Bo:35`). For no heroes print `No heroes`. Otherwise print `Order: <names, strongest first, ties alphabetical, joined by ", ">` and `Total HP: <sum>`.',
    starter:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = []
for pair in input("Heroes: ").split():
    name, hp = pair.split(":")
    party.append(Hero(name, int(hp)))
`,
    inputs:['Ada:20 Bo:35 Cy:35'],
    cases:[{inputs:['Ada:20 Bo:35 Cy:35'],tests:[['Ties alphabetical','lines[-2:]==["Order: Bo, Cy, Ada","Total HP: 90"]']]},{inputs:['Cy:35 Bo:35 Ada:20'],tests:[['Different arrival order, same result','lines[-2:]==["Order: Bo, Cy, Ada","Total HP: 90"]']]},{inputs:['Solo:7'],tests:[['One','lines[-2:]==["Order: Solo","Total HP: 7"]']]},{inputs:[''],tests:[['None','lines[-1]=="No heroes"'],['Uses key sorting','"sorted(" in src and "key=" in src']]}],
    sol:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = []
for pair in input("Heroes: ").split():
    name, hp = pair.split(":")
    party.append(Hero(name, int(hp)))

if not party:
    print("No heroes")
else:
    ordered = sorted(party, key=lambda h: (-h.hp, h.name))
    print("Order:", ", ".join(h.name for h in ordered))
    print("Total HP:", sum(h.hp for h in party))`,
    wrong:[R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = []
for pair in input("Heroes: ").split():
    name, hp = pair.split(":")
    party.append(Hero(name, int(hp)))

if not party:
    print("No heroes")
else:
    ordered = sorted(party, key=lambda h: -h.hp)
    print("Order:", ", ".join(h.name for h in ordered))
    print("Total HP:", sum(h.hp for h in party))`, R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

party = []
for pair in input("Heroes: ").split():
    name, hp = pair.split(":")
    party.append(Hero(name, int(hp)))

if not party:
    print("No heroes")
else:
    ordered = sorted(party, key=lambda h: (h.hp, h.name))
    print("Order:", ", ".join(h.name for h in ordered))
    print("Total HP:", sum(h.hp for h in party))`],
    hints:['Check for an empty party first.','sorted(party, key=lambda h: (-h.hp, h.name)) puts the highest hp first, then A-Z.','", ".join(h.name for h in ordered) and sum(h.hp for h in party).','class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nparty = []\nfor pair in input("Heroes: ").split():\n    name, hp = pair.split(":")\n    party.append(Hero(name, int(hp)))\n\nif not party:\n    print("No heroes")\nelse:\n    ordered = sorted(party, key=lambda h: (-h.hp, h.name))\n    print("Order:", ", ".join(h.name for h in ordered))\n    print("Total HP:", sum(h.hp for h in party))']},
  power:{can:['Sort, search and total lists of objects with key=','Use the (-value, name) tie-break trick'],
    expand:'Print only the heroes with hp above the average.',
    where:'Leaderboards, product lists, search results: everything is a list of objects.',
    next:'Next: objects that refuse bad data.'},
  codex:{title:'Lists of objects',body:'sorted / max / min with key=lambda o: o.attr. (-o.score, o.name) for biggest first then A-Z. sorted(objects) alone is a TypeError.',snip:R`sorted(party, key=lambda h: (-h.hp, h.name))`}
},
{
  id:'r10-07', realm:10, n:7, title:'Validation: objects that refuse bad data',
  teaches:['class-validate'], requires:['class-lists'],
  story:`"A bank account with a **negative balance** at birth? Withdrawing money that isn't there?" Vael frowns at a ledger. "A good class **protects itself**. Bad data should never get in."`,
  concept:{
    html:`Put the rules inside the class, and raise \`ValueError\` when they're broken:\n\n\`\`\`\nclass Account:\n    def __init__(self, owner, balance=0):\n        if balance < 0:\n            raise ValueError("Balance cannot be negative")\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n\`\`\`\n\n- Check **before** changing anything, so a failed call leaves the object **unchanged**.\n- The caller handles the error: \`try: acct.withdraw(50) except ValueError as e: print(e)\`.\n- Withdrawing **exactly** the balance is allowed: the test is \`amount > balance\`, not \`>=\`.\n- Raise the right type: \`ValueError\` for a bad value, \`TypeError\` for a wrong kind of value.\n- If the constructor raises, **no object is created**.`,
    analogy:`A bank teller who checks every slip before touching the money.`,
    example:R`class Account:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

acct = Account("Ada", 100)
try:
    acct.withdraw(500)
except ValueError as error:
    print("Error:", error)
print(acct.balance)`},
  predict:{code:R`class A:
    def __init__(self, n):
        if n < 0:
            raise ValueError("neg")
        self.n = n

try:
    a = A(-1)
except ValueError:
    print("caught")
print("a" in dir())`, q:'What prints?', opts:['caught, then False','caught, then True','caught only'], ans:0, why:'The constructor raised, so no object was created and the name a was never assigned.'},
  cast:{code:R`class Account:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

acct = Account("Ada", 100)
try:
    acct.withdraw(500)
except ValueError as error:
    print("Error:", error)
print(acct.balance)`, task:'Cast it.'},
  bug:{broken:R`class Account:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        self.balance -= amount
        if self.balance < 0:
            raise ValueError("Insufficient funds")

acct = Account(10)
try:
    acct.withdraw(50)
except ValueError:
    pass
print(acct.balance)`, task:'The error is raised AFTER the money was already taken, so the balance is wrong (-40). Check first. Expected: 10',
    cases:[{inputs:[],tests:[['Unchanged','lines==["10"]']]}],
    sol:R`class Account:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

acct = Account(10)
try:
    acct.withdraw(50)
except ValueError:
    pass
print(acct.balance)`, wrong:[R`class Account:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        self.balance -= amount
        if self.balance < 0:
            raise ValueError("Insufficient funds")

acct = Account(10)
try:
    acct.withdraw(50)
except ValueError:
    pass
print(acct.balance)`]},
  write:{prompt:'Write `Account(owner, balance=0)` (a negative starting balance raises `ValueError("Balance cannot be negative")`) with `deposit(amount)` and `withdraw(amount)`. Both raise `ValueError("Amount must be positive")` for amounts of 0 or less. `withdraw` raises `ValueError("Insufficient funds")` if the amount is more than the balance (exactly the balance is fine). Build `Account("Ada", 100)`, ask `Deposit: ` then `Withdraw: ` (whole numbers); if either raises, print `Error: <message>` and carry on. Finally print `Balance: <n>`.',
    starter:R`class Account:
    pass

acct = Account("Ada", 100)
`,
    inputs:['50','30'],
    cases:[{inputs:['50','30'],tests:[['Normal','[l for l in lines if l.startswith(("Error","Balance"))]==["Balance: 120"]'],['Constructor rule','__import__("unittest").TestCase().assertRaises(ValueError, g["Account"], "x", -1) is None']]},{inputs:['-5','10'],tests:[['Bad deposit','[l for l in lines if l.startswith(("Error","Balance"))]==["Error: Amount must be positive","Balance: 90"]']]},{inputs:['10','500'],tests:[['Too much','[l for l in lines if l.startswith(("Error","Balance"))]==["Error: Insufficient funds","Balance: 110"]']]},{inputs:['0','100'],tests:[['Exactly the balance','[l for l in lines if l.startswith(("Error","Balance"))]==["Error: Amount must be positive","Balance: 0"]']]},{inputs:['5','0'],tests:[['Zero withdrawal','[l for l in lines if l.startswith(("Error","Balance"))]==["Error: Amount must be positive","Balance: 105"]'],['Failed call changes nothing','(lambda a: (__import__("contextlib").suppress(ValueError).__enter__(), a)[1])(g["Account"]("q", 5)).balance==5']]}],
    sol:R`class Account:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.owner = owner
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

acct = Account("Ada", 100)
for label, action in (("Deposit", acct.deposit), ("Withdraw", acct.withdraw)):
    try:
        action(int(input(label + ": ")))
    except ValueError as error:
        print("Error:", error)
print("Balance:", acct.balance)`,
    wrong:[R`class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        self.balance -= amount

acct = Account("Ada", 100)
acct.deposit(int(input("Deposit: ")))
acct.withdraw(int(input("Withdraw: ")))
print("Balance:", acct.balance)`, R`class Account:
    def __init__(self, owner, balance=0):
        if balance < 0:
            raise ValueError("Balance cannot be negative")
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount >= self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

acct = Account("Ada", 100)
for label, action in (("Deposit", acct.deposit), ("Withdraw", acct.withdraw)):
    try:
        action(int(input(label + ": ")))
    except ValueError as error:
        print("Error:", error)
print("Balance:", acct.balance)`],
    hints:['Check the rules at the top of each method and raise ValueError with the exact message.','withdraw: amount <= 0 is "Amount must be positive"; amount > self.balance is "Insufficient funds".','In the program wrap each call in try / except ValueError as error and print "Error:", error.','class Account:\n    def __init__(self, owner, balance=0):\n        if balance < 0:\n            raise ValueError("Balance cannot be negative")\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount <= 0:\n            raise ValueError("Amount must be positive")\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount\n\nacct = Account("Ada", 100)\nfor label, action in (("Deposit", acct.deposit), ("Withdraw", acct.withdraw)):\n    try:\n        action(int(input(label + ": ")))\n    except ValueError as error:\n        print("Error:", error)\nprint("Balance:", acct.balance)']},
  power:{can:['Make a class protect its own rules','Check first so failures leave the object unchanged'],
    expand:'Add a `transfer(self, other, amount)` method that moves money between two accounts safely.',
    where:'Any object that guards money, inventory or permissions validates in its methods.',
    next:'Next: aliasing: when two names are one object.'},
  codex:{title:'Validation in classes',body:'Check inputs first, raise ValueError with a clear message, change state only after the checks pass. A raising __init__ builds no object.',snip:R`if amount > self.balance:
    raise ValueError("Insufficient funds")`}
},
{
  id:'r10-08', realm:10, n:8, title:'References and copies: one object, many names',
  teaches:['class-ref'], requires:['class-validate'],
  story:`Two guards swear they've each got their own sword. Vael checks the armoury: **there is only one sword**, and both of them are holding it.`,
  concept:{
    html:`Variables don't contain objects. They **point** to them. Assigning an object to a new name makes a second pointer, **not a copy**:\n\n\`\`\`\na = Hero("Ada", 1)\nb = a            # b points to the SAME object\nb.level = 9\nprint(a.level)   # 9 !\nprint(a is b)    # True\n\`\`\`\n\nTo get an independent object, **copy** it:\n\n\`\`\`\nimport copy\nc = copy.copy(a)         # a new Hero with the same attribute values\nc.level = 1\nprint(a.level)           # still 9\n\`\`\`\n\n- **\`is\`** asks "same object?". **\`==\`** asks "equal?" (for your own classes, \`==\` is \`is\` until you teach it more, in a later lesson).\n- A function that **mutates** an object (\`hero.level += 1\`) changes the caller's object too. A function that just **reassigns** its parameter (\`hero = Hero(...)\`) does not.\n- \`copy.copy\` is *shallow*: attributes that are themselves lists or objects are still shared. \`copy.deepcopy\` copies those too.\n- Lists behave the same way: \`b = a\` is not a copy, \`b = a[:]\` or \`list(a)\` is.`,
    analogy:`Two keys to the same house, versus two houses built from the same plan.`,
    example:R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

a = Hero("Ada", 1)
b = a
c = copy.copy(a)
a.level = 9
print(a.level, b.level, c.level)
print(a is b, a is c)`},
  predict:{code:R`class A:
    pass

a = A()
b = a
b.x = 9
print(a.x)`, q:'What prints?', opts:['9','Error','Nothing (None)'], ans:0, why:'b and a are the same object, so setting b.x also sets a.x.'},
  cast:{code:R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

a = Hero("Ada", 1)
b = a
c = copy.copy(a)
a.level = 9
print(a.level, b.level, c.level)
print(a is b, a is c)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, level):
        self.level = level

a = Hero(1)
backup = a
a.level = 5
print(backup.level)`, task:'backup is meant to keep the OLD level (1), but it is the same object. Make a real copy before changing a. Expected: 1',
    cases:[{inputs:[],tests:[['Backup kept','lines==["1"]']]}],
    sol:R`import copy

class Hero:
    def __init__(self, level):
        self.level = level

a = Hero(1)
backup = copy.copy(a)
a.level = 5
print(backup.level)`, wrong:[R`class Hero:
    def __init__(self, level):
        self.level = level

a = Hero(1)
backup = a
a.level = 5
print(backup.level)`]},
  write:{prompt:'`Hero(name, level)` is given. Write `level_up(hero)` that adds 1 to the hero\'s level **in place** (returns nothing) and `clone(hero)` that returns an **independent copy** (use `copy.copy`). Then: `a = Hero("Ada", 1)`, `b = a`, `c = clone(a)`, `level_up(a)`, and print `a.level`, `b.level`, `c.level` on one line separated by spaces.',
    starter:R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level
`,
    cases:[{inputs:[],tests:[['Printed','lines==["2 2 1"]'],['level_up in place','(lambda h: (g["level_up"](h), h.level)[1])(g["Hero"]("x", 4))==5 and g["level_up"](g["Hero"]("x", 4)) is None'],['clone independent','(lambda h: (lambda c: c is not h and c.name=="x" and c.level==4 and (setattr(c,"level",9), h.level)[1]==4)(g["clone"](h)))(g["Hero"]("x", 4))'],['clone is a Hero','isinstance(g["clone"](g["Hero"]("x",1)), g["Hero"])']]}],
    sol:R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

def level_up(hero):
    hero.level += 1

def clone(hero):
    return copy.copy(hero)

a = Hero("Ada", 1)
b = a
c = clone(a)
level_up(a)
print(a.level, b.level, c.level)`,
    wrong:[R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

def level_up(hero):
    hero.level += 1

def clone(hero):
    return hero

a = Hero("Ada", 1)
b = a
c = clone(a)
level_up(a)
print(a.level, b.level, c.level)`, R`import copy

class Hero:
    def __init__(self, name, level):
        self.name = name
        self.level = level

def level_up(hero):
    hero = Hero(hero.name, hero.level + 1)

def clone(hero):
    return copy.copy(hero)

a = Hero("Ada", 1)
b = a
c = clone(a)
level_up(a)
print(a.level, b.level, c.level)`],
    hints:['level_up should change the object it was given: hero.level += 1 (no return).','clone: return copy.copy(hero) gives a new object with the same values.','After the calls, a and b are the same object (2 2) and c is separate (1).','import copy\n\nclass Hero:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\ndef level_up(hero):\n    hero.level += 1\n\ndef clone(hero):\n    return copy.copy(hero)\n\na = Hero("Ada", 1)\nb = a\nc = clone(a)\nlevel_up(a)\nprint(a.level, b.level, c.level)']},
  power:{can:['Explain that names point to objects','Copy objects with copy.copy when you need independence'],
    expand:'Add a list attribute `items` to Hero and show that copy.copy shares it but copy.deepcopy does not.',
    where:'Aliasing bugs (changing "my" data changes everyone\'s) are among the most common real-world Python bugs.',
    next:'Next: inspecting objects with getattr, hasattr and vars.'},
  codex:{title:'References',body:'b = a is the same object (a is b). copy.copy gives a shallow independent copy; deepcopy copies nested objects too. Mutating inside a function changes the caller\'s object.',snip:R`import copy
c = copy.copy(a)`}
},
{
  id:'r10-09', realm:10, n:9, title:'getattr, hasattr and vars: looking inside objects',
  teaches:['class-getattr'], requires:['class-ref'],
  story:`A stranger drops a sealed chest on Vael's desk. "I don't know what's in it. **Ask the object what it holds**, without crashing if it holds nothing."`,
  concept:{
    html:`Python lets you inspect and use attributes by **name stored in a variable**:\n\n\`\`\`\nh = Hero("Ada")\n\nhasattr(h, "name")             # True: does it have this attribute?\ngetattr(h, "name")             # 'Ada'  same as h.name\ngetattr(h, "luck", 0)          # 0   (default instead of AttributeError)\nsetattr(h, "luck", 3)          # same as h.luck = 3\nvars(h)                        # {'name': 'Ada', 'luck': 3}  the attribute dict\n\`\`\`\n\n- \`getattr(obj, name, default)\` is the safe way to read an attribute that **might not exist**.\n- Use it when the attribute name is in a **variable**: \`for stat in ("hp", "power"): print(getattr(h, stat))\`.\n- \`vars(obj)\` shows an object's own data as a dict (attributes set on that instance).\n- Sort for stable output: \`dict(sorted(vars(h).items()))\`.\n- Don't overuse these. Plain \`h.name\` is clearer when the name is known.`,
    analogy:`Asking "does this chest hold a key?" instead of reaching in blindly.`,
    example:R`class Hero:
    def __init__(self, name, hp=20):
        self.name = name
        self.hp = hp

h = Hero("Ada")
print(hasattr(h, "hp"), hasattr(h, "luck"))
print(getattr(h, "luck", 0))
print(vars(h))`},
  predict:{code:R`class A:
    def __init__(self):
        self.x = 1

a = A()
setattr(a, "y", 2)
print(sorted(vars(a)))`, q:'What prints?', opts:["['x', 'y']","['y']","['x']"], ans:0, why:'setattr adds y; vars lists both attributes.'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp=20):
        self.name = name
        self.hp = hp

h = Hero("Ada")
print(hasattr(h, "hp"), hasattr(h, "luck"))
print(getattr(h, "luck", 0))
print(vars(h))`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self):
        self.hp = 20

h = Hero()
print(getattr(h, "luck"))`, task:'AttributeError: there is no luck. Give getattr a default of 0. Expected: 0',
    cases:[{inputs:[],tests:[['Zero','lines==["0"]']]}],
    sol:R`class Hero:
    def __init__(self):
        self.hp = 20

h = Hero()
print(getattr(h, "luck", 0))`, wrong:[R`class Hero:
    def __init__(self):
        self.hp = 20

h = Hero()
print(getattr(h, "luck"))`]},
  write:{prompt:'`Hero(name, hp, power)` is given. Write `describe(obj)` returning the object\'s attributes as a dict **sorted by attribute name**, and `get_stat(obj, name, default=0)` using `getattr`. Print `describe` of `Hero("Ada", 20, 5)`, then `get_stat(h, "power")`, then `get_stat(h, "luck")` — one per line.',
    starter:R`class Hero:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

h = Hero("Ada", 20, 5)
`,
    cases:[{inputs:[],tests:[['Printed',"lines==[\"{'hp': 20, 'name': 'Ada', 'power': 5}\",\"5\",\"0\"]"],['describe is sorted dict','list(g["describe"](g["h"]))==["hp","name","power"] and isinstance(g["describe"](g["h"]), dict)'],['get_stat default','g["get_stat"](g["h"],"luck",7)==7 and g["get_stat"](g["h"],"hp")==20'],['Works on any object','(lambda o: (setattr(o,"z",1), g["describe"](o))[1])(type("T",(),{})())=={"z":1}']]}],
    sol:R`class Hero:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

def describe(obj):
    return dict(sorted(vars(obj).items()))

def get_stat(obj, name, default=0):
    return getattr(obj, name, default)

h = Hero("Ada", 20, 5)
print(describe(h))
print(get_stat(h, "power"))
print(get_stat(h, "luck"))`,
    wrong:[R`class Hero:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

def describe(obj):
    return vars(obj)

def get_stat(obj, name, default=0):
    return getattr(obj, name, default)

h = Hero("Ada", 20, 5)
print(describe(h))
print(get_stat(h, "power"))
print(get_stat(h, "luck"))`, R`class Hero:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

def describe(obj):
    return dict(sorted(vars(obj).items()))

def get_stat(obj, name, default=0):
    return getattr(obj, name)

h = Hero("Ada", 20, 5)
print(describe(h))
print(get_stat(h, "power"))
print(get_stat(h, "luck"))`],
    hints:['vars(obj) is the attribute dict; sort it with dict(sorted(vars(obj).items())).','get_stat returns getattr(obj, name, default).','Print describe(h), then the two stats.','class Hero:\n    def __init__(self, name, hp, power):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\ndef describe(obj):\n    return dict(sorted(vars(obj).items()))\n\ndef get_stat(obj, name, default=0):\n    return getattr(obj, name, default)\n\nh = Hero("Ada", 20, 5)\nprint(describe(h))\nprint(get_stat(h, "power"))\nprint(get_stat(h, "luck"))']},
  power:{can:['Inspect objects with vars, hasattr and getattr','Read attributes by name with a safe default'],
    expand:'Write `show(obj)` that prints every attribute as `name = value`, sorted.',
    where:'Serialisers, debuggers, config loaders and test tools inspect objects this way.',
    next:'Next: the Stack, your first real data-structure class.'},
  codex:{title:'Inspecting objects',body:'hasattr(o, n), getattr(o, n, default), setattr(o, n, v), vars(o) (the attribute dict). Sort items for stable output.',snip:R`getattr(obj, "luck", 0)`}
},
{
  id:'r10-10', realm:10, n:10, title:'Build a Stack: a data structure as a class',
  teaches:['class-stack'], requires:['class-getattr'],
  story:`Vael stacks shields in the armoury: only the **top** one can be reached. "Last in, first out. You'll meet this shape everywhere: undo buttons, browser history, matching brackets. Let's build it yourself."`,
  concept:{
    html:`A **stack** is a last-in, first-out pile with a few operations:\n\n\`\`\`\nclass Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        self.items.append(item)\n\n    def pop(self):\n        if not self.items:\n            raise IndexError("stack is empty")\n        return self.items.pop()\n\n    def peek(self):\n        return self.items[-1]\n\n    def is_empty(self):\n        return not self.items\n\n    def size(self):\n        return len(self.items)\n\`\`\`\n\n- The list is an **implementation detail** hidden inside. Users call push/pop and don't care it's a list.\n- Notice \`self.items = []\` lives in \`__init__\`: each stack gets its **own** list. (Writing \`items = []\` in the class body would share one list between all stacks, a nasty bug.)\n- Classic use: **matching brackets**. Push every opener; when a closer arrives, the most recent opener (the top) must match it.\n- A failed \`pop\` on an empty stack should raise a clear error, not return garbage.`,
    analogy:`A stack of plates: you only ever add or take the top one.`,
    example:R`class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("stack is empty")
        return self.items.pop()

    def is_empty(self):
        return not self.items

s = Stack()
s.push("a")
s.push("b")
print(s.pop(), s.pop(), s.is_empty())`},
  predict:{code:R`class Box:
    items = []

a = Box()
b = Box()
a.items.append(1)
print(b.items)`, q:'What prints?', opts:['[1]','[]','Error'], ans:0, why:'items is a class attribute: one list shared by every Box.'},
  cast:{code:R`class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("stack is empty")
        return self.items.pop()

    def is_empty(self):
        return not self.items

s = Stack()
s.push("a")
s.push("b")
print(s.pop(), s.pop(), s.is_empty())`, task:'Cast it.'},
  bug:{broken:R`class Stack:
    items = []

    def push(self, item):
        self.items.append(item)

a = Stack()
b = Stack()
a.push(1)
print(len(b.items))`, task:'b has an item it never received: the list is shared by every Stack. Give each stack its own list. Expected: 0',
    cases:[{inputs:[],tests:[['Separate','lines==["0"]']]}],
    sol:R`class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

a = Stack()
b = Stack()
a.push(1)
print(len(b.items))`, wrong:[R`class Stack:
    items = []

    def push(self, item):
        self.items.append(item)

a = Stack()
b = Stack()
a.push(1)
print(len(b.items))`]},
  write:{prompt:'Build `Stack` with `push`, `pop` (raises `IndexError` if empty), `peek`, `is_empty` and `size`. Then use it: ask `Text: ` and print `Balanced` if every `(`, `[` and `{` is closed in the right order, otherwise `Unbalanced`. Other characters are ignored.',
    starter:R`class Stack:
    pass

PAIRS = {")": "(", "]": "[", "}": "{"}
text = input("Text: ")
`,
    inputs:['([]{})'],
    cases:[{inputs:['([]{})'],tests:[['Balanced','lines[-1]=="Balanced"'],['LIFO order','(lambda s: (s.push(1), s.push(2), (s.pop(), s.pop(), s.is_empty())[0:3])[2])(g["Stack"]())==(2,1,True)'],['Separate stacks','(lambda a,b: (a.push(1), b.size())[1])(g["Stack"](),g["Stack"]())==0'],['peek and size','(lambda s: (s.push("x"), s.push("y"), (s.peek(), s.size()))[2])(g["Stack"]())==("y",2)'],['Pop empty raises','__import__("unittest").TestCase().assertRaises(IndexError, g["Stack"]().pop) is None']]},{inputs:['(]'],tests:[['Wrong closer','lines[-1]=="Unbalanced"']]},{inputs:['(('],tests:[['Never closed','lines[-1]=="Unbalanced"']]},{inputs:[')'],tests:[['Closer first','lines[-1]=="Unbalanced"']]},{inputs:['a(b)c[d]'],tests:[['Ignores other characters','lines[-1]=="Balanced"']]},{inputs:[''],tests:[['Empty','lines[-1]=="Balanced"'],['Uses Stack','"Stack(" in src']]}],
    sol:R`class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("stack is empty")
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return not self.items

    def size(self):
        return len(self.items)

PAIRS = {")": "(", "]": "[", "}": "{"}
text = input("Text: ")
stack = Stack()
ok = True
for ch in text:
    if ch in "([{":
        stack.push(ch)
    elif ch in PAIRS:
        if stack.is_empty() or stack.pop() != PAIRS[ch]:
            ok = False
            break
print("Balanced" if ok and stack.is_empty() else "Unbalanced")`,
    wrong:[R`class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("stack is empty")
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return not self.items

    def size(self):
        return len(self.items)

PAIRS = {")": "(", "]": "[", "}": "{"}
text = input("Text: ")
stack = Stack()
ok = True
for ch in text:
    if ch in "([{":
        stack.push(ch)
    elif ch in PAIRS:
        if stack.is_empty() or stack.pop() != PAIRS[ch]:
            ok = False
            break
print("Balanced" if ok else "Unbalanced")`, R`class Stack:
    items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.items:
            raise IndexError("stack is empty")
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return not self.items

    def size(self):
        return len(self.items)

PAIRS = {")": "(", "]": "[", "}": "{"}
text = input("Text: ")
stack = Stack()
ok = True
for ch in text:
    if ch in "([{":
        stack.push(ch)
    elif ch in PAIRS:
        if stack.is_empty() or stack.pop() != PAIRS[ch]:
            ok = False
            break
print("Balanced" if ok and stack.is_empty() else "Unbalanced")`],
    hints:['Stack keeps self.items = [] in __init__ so each stack has its own list.','pop: raise IndexError if empty, otherwise self.items.pop().','For each character: push openers; for a closer, the popped opener must match PAIRS[ch]. At the end the stack must be empty.','class Stack:\n    def __init__(self):\n        self.items = []\n\n    def push(self, item):\n        self.items.append(item)\n\n    def pop(self):\n        if not self.items:\n            raise IndexError("stack is empty")\n        return self.items.pop()\n\n    def peek(self):\n        return self.items[-1]\n\n    def is_empty(self):\n        return not self.items\n\n    def size(self):\n        return len(self.items)\n\nPAIRS = {")": "(", "]": "[", "}": "{"}\ntext = input("Text: ")\nstack = Stack()\nok = True\nfor ch in text:\n    if ch in "([{":\n        stack.push(ch)\n    elif ch in PAIRS:\n        if stack.is_empty() or stack.pop() != PAIRS[ch]:\n            ok = False\n            break\nprint("Balanced" if ok and stack.is_empty() else "Unbalanced")']},
  power:{can:['Build a data structure as a class','Use a stack to check nested brackets'],
    expand:'Add an `undo` feature to a text editor idea: push every edit onto a stack and pop to undo.',
    where:'Undo systems, browser back buttons, expression evaluators and parsers are built on stacks.',
    next:'Next: encapsulation and @property.'},
  codex:{title:'Stack',body:'LIFO: push, pop, peek, is_empty, size. Create the list in __init__ (never as a class attribute). Raise IndexError when popping an empty stack.',snip:R`self.items = []`}
}
);
