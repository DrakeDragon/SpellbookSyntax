// REALM 10 — THE GUILDHALL — part C (lessons 21-28: inheritance, super, polymorphism, abstract, composition, mixins, RPG mission)
LESSONS.push(
{
  id:'r10-21', realm:10, n:21, title:'Inheritance: classes that build on classes',
  teaches:['class-inherit'], requires:['mission10a'],
  story:`Vael leads you to the barracks. "Warriors, mages, archers: all are **heroes**. They share a name and hit points. Do we write that three times? No. We write **Hero** once, and let the others *inherit* it."`,
  concept:{
    html:`A **subclass** inherits everything from its **parent** (base) class and may add or change things:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def describe(self):\n        return f"{self.name} ({self.hp} HP)"\n\nclass Mage(Hero):                 # Mage IS-A Hero\n    def cast(self):\n        return f"{self.name} casts a spell!"\n\nm = Mage("Mira", 18)\nprint(m.describe())               # inherited\nprint(m.cast())                   # its own\n\`\`\`\n\n- Syntax: \`class Child(Parent):\`.\n- If the child defines no \`__init__\`, the **parent's** is used.\n- Use inheritance for a true **"is-a"** relationship: a Mage *is a* Hero. (For "has-a", see composition soon.)\n- Every class ultimately inherits from \`object\`.\n- Methods are looked up on the object's class first, then up the parent chain.`,
    analogy:`A family recipe book: the child kitchen has every recipe of the parent, plus its own specials.`,
    example:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def cast(self):
        return f"{self.name} casts a spell!"

m = Mage("Mira", 18)
print(m.describe())
print(m.cast())`},
  predict:{code:R`class A:
    def hi(self):
        return "A"

class B(A):
    pass

print(B().hi())`, q:'What prints?', opts:['A','Error','B'], ans:0, why:'B inherits hi from A.'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def cast(self):
        return f"{self.name} casts a spell!"

m = Mage("Mira", 18)
print(m.describe())
print(m.cast())`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage:
    def cast(self):
        return self.name + " casts!"

print(Mage("Mira").cast())`, task:'TypeError: Mage does not inherit from Hero. Make it a subclass. Expected: Mira casts!',
    cases:[{inputs:[],tests:[['Works','lines==["Mira casts!"]']]}],
    sol:R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage(Hero):
    def cast(self):
        return self.name + " casts!"

print(Mage("Mira").cast())`, wrong:[R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage:
    def cast(self):
        return self.name + " casts!"

print(Mage("Mira").cast())`]},
  write:{prompt:'Define `Hero(name, hp)` with `describe()` returning `<name> (<hp> HP)`. Define `Mage(Hero)` with `cast()` returning `<name> casts a spell!`, and `Warrior(Hero)` with `strike()` returning `<name> swings a sword!`. Ask `Class: ` (`mage` or `warrior`) and `Name: `; build a hero with 20 HP. Print the description, then the class action. Anything else prints `Unknown class`.',
    starter:R`class Hero:
    pass

kind = input("Class: ")
name = input("Name: ")
`,
    inputs:['mage','Mira'],
    cases:[{inputs:['mage','Mira'],tests:[['Mage','lines[-2:]==["Mira (20 HP)","Mira casts a spell!"]'],['Subclasses','issubclass(g["Mage"],g["Hero"]) and issubclass(g["Warrior"],g["Hero"])'],['Describe is inherited','"describe" not in vars(g["Mage"]) and "describe" not in vars(g["Warrior"])']]},{inputs:['warrior','Bo'],tests:[['Warrior','lines[-2:]==["Bo (20 HP)","Bo swings a sword!"]']]},{inputs:['bard','Cy'],tests:[['Unknown','lines[-1]=="Unknown class"']]},{inputs:['MAGE','Di'],tests:[['Exact match only','lines[-1]=="Unknown class"']]}],
    sol:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def cast(self):
        return f"{self.name} casts a spell!"

class Warrior(Hero):
    def strike(self):
        return f"{self.name} swings a sword!"

kind = input("Class: ")
name = input("Name: ")
if kind == "mage":
    hero = Mage(name, 20)
    print(hero.describe())
    print(hero.cast())
elif kind == "warrior":
    hero = Warrior(name, 20)
    print(hero.describe())
    print(hero.strike())
else:
    print("Unknown class")`,
    wrong:[R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

    def cast(self):
        return f"{self.name} casts a spell!"

class Warrior:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

    def strike(self):
        return f"{self.name} swings a sword!"

kind = input("Class: ")
name = input("Name: ")
if kind == "mage":
    hero = Mage(name, 20)
    print(hero.describe())
    print(hero.cast())
elif kind == "warrior":
    hero = Warrior(name, 20)
    print(hero.describe())
    print(hero.strike())
else:
    print("Unknown class")`],
    hints:['Write Hero once with __init__ and describe.','class Mage(Hero): and class Warrior(Hero): each add one method.','Pick the class from the input; build it with (name, 20).','class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def describe(self):\n        return f"{self.name} ({self.hp} HP)"\n\nclass Mage(Hero):\n    def cast(self):\n        return f"{self.name} casts a spell!"\n\nclass Warrior(Hero):\n    def strike(self):\n        return f"{self.name} swings a sword!"\n\nkind = input("Class: ")\nname = input("Name: ")\nif kind == "mage":\n    hero = Mage(name, 20)\n    print(hero.describe())\n    print(hero.cast())\nelif kind == "warrior":\n    hero = Warrior(name, 20)\n    print(hero.describe())\n    print(hero.strike())\nelse:\n    print("Unknown class")']},
  power:{can:['Create subclasses that inherit behaviour','Share code instead of copying it'],
    expand:'Add an `Archer(Hero)` with a `shoot()` method.',
    where:'Frameworks (Django views, game entities, UI widgets) are built on inheritance.',
    next:'Next: super(), extending the parent\'s __init__.'},
  codex:{title:'Inheritance',body:'class Child(Parent): inherits all attributes and methods. Use for is-a relationships. Lookup goes child first, then parents.',snip:R`class Mage(Hero):
    def cast(self):
        ...`}
},
{
  id:'r10-22', realm:10, n:22, title:'super(): extending the parent',
  teaches:['class-super'], requires:['class-inherit'],
  story:`Mages need **mana** on top of a name and HP. "Don't copy the parent's setup," Vael warns. "**Ask the parent to do its part first**, then add yours."`,
  concept:{
    html:`When a subclass defines its own \`__init__\`, the parent's is **not** run automatically. Call it with \`super()\`:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\nclass Mage(Hero):\n    def __init__(self, name, hp, mana):\n        super().__init__(name, hp)       # parent sets name and hp\n        self.mana = mana                 # Mage adds its own\n\`\`\`\n\n- \`super()\` means "the parent class, for this object". No \`self\` is passed to \`super().__init__\`.\n- ⚠️ Forget \`super().__init__()\` and the parent's attributes **never exist**: \`AttributeError: 'Mage' object has no attribute 'name'\`.\n- \`super()\` works for **any** method, not just \`__init__\`: \`super().describe()\` runs the parent's version so you can extend it.\n- Call it first, so the parent's setup is ready before yours.`,
    analogy:`Taking over a restaurant: keep the old kitchen setup (super), then add your own station.`,
    example:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

class Mage(Hero):
    def __init__(self, name, hp, mana):
        super().__init__(name, hp)
        self.mana = mana

m = Mage("Mira", 18, 30)
print(m.name, m.hp, m.mana)`},
  predict:{code:R`class A:
    def __init__(self):
        self.x = 1

class B(A):
    def __init__(self):
        self.y = 2

print(hasattr(B(), "x"))`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'B.__init__ replaced A.__init__ and never called it, so x was never set.'},
  cast:{code:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

class Mage(Hero):
    def __init__(self, name, hp, mana):
        super().__init__(name, hp)
        self.mana = mana

m = Mage("Mira", 18, 30)
print(m.name, m.hp, m.mana)`, task:'Cast it.'},
  bug:{broken:R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage(Hero):
    def __init__(self, name, mana):
        self.mana = mana

m = Mage("Mira", 30)
print(m.name, m.mana)`, task:'AttributeError: the parent __init__ never ran. Call super().__init__(name). Expected: Mira 30',
    cases:[{inputs:[],tests:[['Works','lines==["Mira 30"]'],['Uses super','"super()" in src']]}],
    sol:R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage(Hero):
    def __init__(self, name, mana):
        super().__init__(name)
        self.mana = mana

m = Mage("Mira", 30)
print(m.name, m.mana)`, wrong:[R`class Hero:
    def __init__(self, name):
        self.name = name

class Mage(Hero):
    def __init__(self, name, mana):
        self.mana = mana

m = Mage("Mira", 30)
print(m.name, m.mana)`]},
  write:{prompt:'Define `Hero(name, hp)` with `describe()` returning `<name> (<hp> HP)`. Define `Mage(Hero)` with extra `mana`; its `describe()` must **call the parent\'s** and add ` [<mana> mana]`. Ask `Name: `, `HP: `, `Mana: ` (whole numbers) and print the mage\'s description.',
    starter:R`class Hero:
    pass

name = input("Name: ")
hp = int(input("HP: "))
mana = int(input("Mana: "))
`,
    inputs:['Mira','18','30'],
    cases:[{inputs:['Mira','18','30'],tests:[['Description','lines[-1]=="Mira (18 HP) [30 mana]"'],['Uses super','src.count("super()")>=2'],['Hero unchanged','g["Hero"]("a",1).describe()=="a (1 HP)"'],['Subclass','issubclass(g["Mage"],g["Hero"])']]},{inputs:['Bo','5','0'],tests:[['Zero mana','lines[-1]=="Bo (5 HP) [0 mana]"']]},{inputs:['Zed','100','7'],tests:[['Other','lines[-1]=="Zed (100 HP) [7 mana]"']]}],
    sol:R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def __init__(self, name, hp, mana):
        super().__init__(name, hp)
        self.mana = mana

    def describe(self):
        return super().describe() + f" [{self.mana} mana]"

name = input("Name: ")
hp = int(input("HP: "))
mana = int(input("Mana: "))
print(Mage(name, hp, mana).describe())`,
    wrong:[R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def __init__(self, name, hp, mana):
        self.name = name
        self.hp = hp
        self.mana = mana

    def describe(self):
        return f"{self.name} ({self.hp} HP) [{self.mana} mana]"

name = input("Name: ")
hp = int(input("HP: "))
mana = int(input("Mana: "))
print(Mage(name, hp, mana).describe())`, R`class Hero:
    def __init__(self, name, hp):
        self.name = name
        self.hp = hp

    def describe(self):
        return f"{self.name} ({self.hp} HP)"

class Mage(Hero):
    def __init__(self, name, hp, mana):
        self.mana = mana

    def describe(self):
        return super().describe() + f" [{self.mana} mana]"

name = input("Name: ")
hp = int(input("HP: "))
mana = int(input("Mana: "))
print(Mage(name, hp, mana).describe())`],
    hints:['In Mage.__init__ call super().__init__(name, hp) first, then set self.mana.','In Mage.describe return super().describe() plus the mana text.','Read the three inputs and print Mage(name, hp, mana).describe().','class Hero:\n    def __init__(self, name, hp):\n        self.name = name\n        self.hp = hp\n\n    def describe(self):\n        return f"{self.name} ({self.hp} HP)"\n\nclass Mage(Hero):\n    def __init__(self, name, hp, mana):\n        super().__init__(name, hp)\n        self.mana = mana\n\n    def describe(self):\n        return super().describe() + f" [{self.mana} mana]"\n\nname = input("Name: ")\nhp = int(input("HP: "))\nmana = int(input("Mana: "))\nprint(Mage(name, hp, mana).describe())']},
  power:{can:['Extend a parent __init__ with super()','Extend (not replace) inherited methods'],
    expand:'Add a `Warrior(Hero)` with `armor` and a describe that extends the parent.',
    where:'Every framework subclass calls super().__init__(...) to keep the parent working.',
    next:'Next: overriding and polymorphism.'},
  codex:{title:'super()',body:'super().__init__(...) runs the parent setup; super().method() runs the parent version. Forgetting it leaves parent attributes missing.',snip:R`def __init__(self, name, hp, mana):
    super().__init__(name, hp)
    self.mana = mana`}
},
{
  id:'r10-23', realm:10, n:23, title:'Overriding and polymorphism',
  teaches:['class-poly'], requires:['class-super'],
  story:`Three heroes march into battle. Vael shouts "**Attack!**" and each acts differently: the warrior slashes, the mage burns, the archer shoots. "One command, many behaviours," she smiles. "That is **polymorphism**."`,
  concept:{
    html:`A subclass can **override** a method: define one with the **same name**. Code that calls the method doesn't need to know which kind of object it has:\n\n\`\`\`\nclass Hero:\n    def __init__(self, name):\n        self.name = name\n    def attack(self):\n        return f"{self.name} punches"\n\nclass Warrior(Hero):\n    def attack(self):\n        return f"{self.name} slashes"\n\nclass Mage(Hero):\n    def attack(self):\n        return f"{self.name} casts fire"\n\nparty = [Warrior("Bo"), Mage("Mira"), Hero("Rookie")]\nfor hero in party:\n    print(hero.attack())      # same call, different behaviour\n\`\`\`\n\n- **Polymorphism** = "many shapes": one interface, many implementations.\n- The loop has **no \`if kind == ...\`** branches. Adding a new hero type means writing a new class, not editing the loop.\n- The base class method works as a **default** for subclasses that don't override.\n- Python decides which version to run by the **object's actual class**, at run time.`,
    analogy:`A "play" button: it works on a song, a video or a podcast, each in its own way.`,
    example:R`class Hero:
    def __init__(self, name):
        self.name = name
    def attack(self):
        return f"{self.name} punches"

class Warrior(Hero):
    def attack(self):
        return f"{self.name} slashes"

class Mage(Hero):
    def attack(self):
        return f"{self.name} casts fire"

for hero in [Warrior("Bo"), Mage("Mira"), Hero("Rookie")]:
    print(hero.attack())`},
  predict:{code:R`class A:
    def who(self):
        return "A"
    def show(self):
        return self.who()

class B(A):
    def who(self):
        return "B"

print(B().show())`, q:'What prints?', opts:['B','A','Error'], ans:0, why:'self is a B, so self.who() finds B\'s override even when called from A\'s show().'},
  cast:{code:R`class Hero:
    def __init__(self, name):
        self.name = name
    def attack(self):
        return f"{self.name} punches"

class Warrior(Hero):
    def attack(self):
        return f"{self.name} slashes"

class Mage(Hero):
    def attack(self):
        return f"{self.name} casts fire"

for hero in [Warrior("Bo"), Mage("Mira"), Hero("Rookie")]:
    print(hero.attack())`, task:'Cast it.'},
  bug:{broken:R`class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speek(self):
        return "Woof"

print(Dog().speak())`, task:'The override has a typo, so the parent version runs. Fix the method name. Expected: Woof',
    cases:[{inputs:[],tests:[['Woof','lines==["Woof"]']]}],
    sol:R`class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof"

print(Dog().speak())`, wrong:[R`class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speek(self):
        return "Woof"

print(Dog().speak())`]},
  write:{prompt:'Define `Hero(name)` with `attack()` returning `<name> punches`, `Warrior` (`<name> slashes`), `Mage` (`<name> casts fire`) and `Archer` (`<name> shoots`), each overriding `attack`. Ask `Party: ` like `warrior:Bo mage:Mira archer:Ann other:Zed` (words of `kind:name`). Build the party and print each hero\'s attack in order, using **one loop with no if on the kind inside it** (look the class up in a dict first). Unknown kinds become plain `Hero`s.',
    starter:R`class Hero:
    pass

CLASSES = {}
party = []
`,
    inputs:['warrior:Bo mage:Mira archer:Ann other:Zed'],
    cases:[{inputs:['warrior:Bo mage:Mira archer:Ann other:Zed'],tests:[['All four','lines[-4:]==["Bo slashes","Mira casts fire","Ann shoots","Zed punches"]'],['Overrides','all("attack" in vars(g[c]) for c in ("Warrior","Mage","Archer"))'],['Subclasses','all(issubclass(g[c],g["Hero"]) for c in ("Warrior","Mage","Archer"))']]},{inputs:['mage:Mira'],tests:[['One','lines[-1]=="Mira casts fire"']]},{inputs:[''],tests:[['Empty party prints nothing','out.strip()=="Party:"']]},{inputs:['archer:A archer:B'],tests:[['Twice','lines[-2:]==["A shoots","B shoots"]']]}],
    sol:R`class Hero:
    def __init__(self, name):
        self.name = name
    def attack(self):
        return f"{self.name} punches"

class Warrior(Hero):
    def attack(self):
        return f"{self.name} slashes"

class Mage(Hero):
    def attack(self):
        return f"{self.name} casts fire"

class Archer(Hero):
    def attack(self):
        return f"{self.name} shoots"

CLASSES = {"warrior": Warrior, "mage": Mage, "archer": Archer}
party = []
for word in input("Party: ").split():
    kind, name = word.split(":")
    party.append(CLASSES.get(kind, Hero)(name))

for hero in party:
    print(hero.attack())`,
    wrong:[R`class Hero:
    def __init__(self, name):
        self.name = name
    def attack(self):
        return f"{self.name} punches"

class Warrior(Hero):
    def attack(self):
        return f"{self.name} slashes"

class Mage(Hero):
    def attack(self):
        return f"{self.name} casts fire"

class Archer(Hero):
    def attack(self):
        return f"{self.name} shoots"

CLASSES = {"warrior": Warrior, "mage": Mage, "archer": Archer}
party = []
for word in input("Party: ").split():
    kind, name = word.split(":")
    party.append(Hero(name))

for hero in party:
    print(hero.attack())`, R`class Hero:
    def __init__(self, name):
        self.name = name
    def attack(self):
        return f"{self.name} punches"

class Warrior(Hero):
    pass

class Mage(Hero):
    pass

class Archer(Hero):
    pass

CLASSES = {"warrior": Warrior, "mage": Mage, "archer": Archer}
party = []
for word in input("Party: ").split():
    kind, name = word.split(":")
    party.append(CLASSES.get(kind, Hero)(name))

for hero in party:
    print(hero.attack())`],
    hints:['Each subclass defines its own attack(self) with the same name.','CLASSES = {"warrior": Warrior, ...}; CLASSES.get(kind, Hero)(name) builds the right object (classes are values!).','Loop: for hero in party: print(hero.attack()).','class Hero:\n    def __init__(self, name):\n        self.name = name\n    def attack(self):\n        return f"{self.name} punches"\n\nclass Warrior(Hero):\n    def attack(self):\n        return f"{self.name} slashes"\n\nclass Mage(Hero):\n    def attack(self):\n        return f"{self.name} casts fire"\n\nclass Archer(Hero):\n    def attack(self):\n        return f"{self.name} shoots"\n\nCLASSES = {"warrior": Warrior, "mage": Mage, "archer": Archer}\nparty = []\nfor word in input("Party: ").split():\n    kind, name = word.split(":")\n    party.append(CLASSES.get(kind, Hero)(name))\n\nfor hero in party:\n    print(hero.attack())']},
  power:{can:['Override methods in subclasses','Write one loop that handles many types'],
    expand:'Add a `Healer` that overrides attack with a pun.',
    where:'Plugins, payment providers and file exporters all use polymorphism: same call, different class.',
    next:'Next: isinstance and issubclass.'},
  codex:{title:'Polymorphism',body:'Same-named methods in subclasses override the parent. Calling code works on any of them without type checks. Classes can be stored in dicts and called like functions.',snip:R`CLASSES = {"warrior": Warrior}
CLASSES.get(kind, Hero)(name)`}
},
{
  id:'r10-24', realm:10, n:24, title:'isinstance, issubclass and type',
  teaches:['class-isinstance'], requires:['class-poly'],
  story:`"Heal everyone who is a **Hero**," says the cleric, "but leave the monsters alone." Vael nods. "Sometimes you must **ask** an object what it is."`,
  concept:{
    html:`\`\`\`\nisinstance(m, Mage)        # True if m is a Mage OR a subclass of Mage\nisinstance(m, Hero)        # True: a Mage is a Hero\nissubclass(Mage, Hero)     # True (classes, not objects)\ntype(m) is Mage            # exact class only; subclasses fail this\ntype(m).__name__           # 'Mage'\n\`\`\`\n\n- Prefer **\`isinstance\`** over \`type(x) == Class\`: it respects inheritance.\n- \`isinstance(x, (int, float))\` accepts a **tuple** of classes.\n- ⚠️ \`isinstance(True, int)\` is \`True\`: \`bool\` is a subclass of \`int\`. Check \`bool\` first if you care.\n- Don't overuse it: if you find yourself writing long \`if isinstance ...\` chains, **polymorphism** (an overridden method) is usually cleaner.\n- Good uses: **input validation** and **filtering** a mixed list.`,
    analogy:`A bouncer checking "are you a member?", and club members of every level count.`,
    example:R`class Hero: pass
class Mage(Hero): pass
class Orc: pass

things = [Mage(), Orc(), Hero()]
print([isinstance(t, Hero) for t in things])
print(issubclass(Mage, Hero), type(things[0]) is Hero)`},
  predict:{code:R`print(isinstance(True, int), isinstance(3, bool))`, q:'What prints?', opts:['True False','False False','True True'], ans:0, why:'bool is a subclass of int, but 3 is not a bool.'},
  cast:{code:R`class Hero: pass
class Mage(Hero): pass
class Orc: pass

things = [Mage(), Orc(), Hero()]
print([isinstance(t, Hero) for t in things])
print(issubclass(Mage, Hero), type(things[0]) is Hero)`, task:'Cast it.'},
  bug:{broken:R`class Hero: pass
class Mage(Hero): pass

m = Mage()
print(type(m) == Hero)`, task:'type() == fails for subclasses. Use isinstance so a Mage counts as a Hero. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Uses isinstance','"isinstance" in src']]}],
    sol:R`class Hero: pass
class Mage(Hero): pass

m = Mage()
print(isinstance(m, Hero))`, wrong:[R`class Hero: pass
class Mage(Hero): pass

m = Mage()
print(type(m) == Hero)`]},
  write:{prompt:'Define `Hero`, `Mage(Hero)`, `Warrior(Hero)` and `Orc` (not a Hero). The program builds `[Mage(), Orc(), Warrior(), Hero(), Orc()]`, then prints `Heroes: <how many are Heroes>`, `Mages: <how many are exactly Mage>` and `Monsters: <how many are Orcs>`. Then ask `Value: ` and print `whole number`, `decimal number`, `text` or `other` for the typed input: use `int(...)` when it parses, else `float(...)`, else text (never use `isinstance(True, ...)` shortcuts; just test the parsed value\'s type for `int`/`float`/`str`).',
    starter:R`class Hero:
    pass

squad = []
raw = input("Value: ")
`,
    inputs:['42'],
    cases:[{inputs:['42'],tests:[['Counts','lines[-5:-2]==["Heroes: 3","Mages: 1","Monsters: 2"]'],['Classification','lines[-1]=="whole number"'],['Inheritance','issubclass(g["Mage"],g["Hero"]) and issubclass(g["Warrior"],g["Hero"]) and not issubclass(g["Orc"],g["Hero"])'],['Uses isinstance','"isinstance" in src']]},{inputs:['3.5'],tests:[['Decimal','lines[-1]=="decimal number"']]},{inputs:['hello'],tests:[['Text','lines[-1]=="text"']]},{inputs:['-7'],tests:[['Negative','lines[-1]=="whole number"']]},{inputs:[''],tests:[['Empty is text','lines[-1]=="text"']]}],
    sol:R`class Hero: pass
class Mage(Hero): pass
class Warrior(Hero): pass
class Orc: pass

squad = [Mage(), Orc(), Warrior(), Hero(), Orc()]
print("Heroes:", sum(isinstance(x, Hero) for x in squad))
print("Mages:", sum(type(x) is Mage for x in squad))
print("Monsters:", sum(isinstance(x, Orc) for x in squad))

raw = input("Value: ")
try:
    value = int(raw)
except ValueError:
    try:
        value = float(raw)
    except ValueError:
        value = raw

if isinstance(value, int):
    print("whole number")
elif isinstance(value, float):
    print("decimal number")
elif isinstance(value, str):
    print("text")
else:
    print("other")`,
    wrong:[R`class Hero: pass
class Mage(Hero): pass
class Warrior(Hero): pass
class Orc: pass

squad = [Mage(), Orc(), Warrior(), Hero(), Orc()]
print("Heroes:", sum(type(x) is Hero for x in squad))
print("Mages:", sum(type(x) is Mage for x in squad))
print("Monsters:", sum(isinstance(x, Orc) for x in squad))

raw = input("Value: ")
try:
    value = int(raw)
except ValueError:
    try:
        value = float(raw)
    except ValueError:
        value = raw

if isinstance(value, int):
    print("whole number")
elif isinstance(value, float):
    print("decimal number")
elif isinstance(value, str):
    print("text")
else:
    print("other")`, R`class Hero: pass
class Mage(Hero): pass
class Warrior(Hero): pass
class Orc: pass

squad = [Mage(), Orc(), Warrior(), Hero(), Orc()]
print("Heroes:", sum(isinstance(x, Hero) for x in squad))
print("Mages:", sum(type(x) is Mage for x in squad))
print("Monsters:", sum(isinstance(x, Orc) for x in squad))

raw = input("Value: ")
try:
    value = float(raw)
except ValueError:
    value = raw

if isinstance(value, int):
    print("whole number")
elif isinstance(value, float):
    print("decimal number")
else:
    print("text")`],
    hints:['isinstance(x, Hero) counts Mages and Warriors too; type(x) is Mage is exact.','sum(isinstance(x, Orc) for x in squad) counts the True values.','Try int(raw), then float(raw), else keep the text; then classify with isinstance.','class Hero: pass\nclass Mage(Hero): pass\nclass Warrior(Hero): pass\nclass Orc: pass\n\nsquad = [Mage(), Orc(), Warrior(), Hero(), Orc()]\nprint("Heroes:", sum(isinstance(x, Hero) for x in squad))\nprint("Mages:", sum(type(x) is Mage for x in squad))\nprint("Monsters:", sum(isinstance(x, Orc) for x in squad))\n\nraw = input("Value: ")\ntry:\n    value = int(raw)\nexcept ValueError:\n    try:\n        value = float(raw)\n    except ValueError:\n        value = raw\n\nif isinstance(value, int):\n    print("whole number")\nelif isinstance(value, float):\n    print("decimal number")\nelif isinstance(value, str):\n    print("text")\nelse:\n    print("other")']},
  power:{can:['Ask objects what they are with isinstance and issubclass','Filter mixed collections by type'],
    expand:'Write `heal_all(things)` that heals only the Hero objects in a mixed list.',
    where:'Validation code and serializers ask isinstance constantly.',
    next:'Next: abstract base classes: contracts for subclasses.'},
  codex:{title:'isinstance',body:'isinstance(x, Class) includes subclasses; type(x) is Class is exact. isinstance(x, (A, B)) takes a tuple. issubclass compares classes. bool is a subclass of int.',snip:R`isinstance(m, Hero)
issubclass(Mage, Hero)`}
},
{
  id:'r10-25', realm:10, n:25, title:'Abstract methods: a contract for subclasses',
  teaches:['class-abstract'], requires:['class-isinstance'],
  story:`"Every **Shape** has an area," Vael says, "but a bare 'shape' has no area; it's an idea. Make the base class **demand** that every real shape provides one."`,
  concept:{
    html:`A base class can declare a method that subclasses **must** override, by raising \`NotImplementedError\`:\n\n\`\`\`\nclass Shape:\n    def area(self):\n        raise NotImplementedError("Subclasses must implement area()")\n\n    def describe(self):                      # shared code uses the contract\n        return f"{type(self).__name__} with area {self.area():.2f}"\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2\n\nclass Square(Shape):\n    def __init__(self, s):\n        self.s = s\n    def area(self):\n        return self.s ** 2\n\`\`\`\n\n- Calling \`Shape().area()\` raises a **clear** error instead of silently returning nothing.\n- The shared \`describe\` method works for **every** subclass: **template method** pattern.\n- A subclass that forgets to override \`area\` fails loudly the first time it's used.\n- Python's \`abc\` module (\`ABC\`, \`@abstractmethod\`) is the stricter version: it blocks creating the object at all. The \`NotImplementedError\` style is simple and common.`,
    analogy:`A job description with a blank line: "Duties: ______". Every hire must fill it in.`,
    example:R`class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

print(Square(3).describe())
try:
    Shape().describe()
except NotImplementedError as error:
    print("Error:", error)`},
  predict:{code:R`class A:
    def run(self):
        raise NotImplementedError

class B(A):
    pass

try:
    B().run()
except NotImplementedError:
    print("not done")`, q:'What prints?', opts:['not done','Nothing','Error'], ans:0, why:'B never overrode run, so the base version raised.'},
  cast:{code:R`class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

print(Square(3).describe())
try:
    Shape().describe()
except NotImplementedError as error:
    print("Error:", error)`, task:'Cast it.'},
  bug:{broken:R`class Shape:
    def area(self):
        pass

class Blob(Shape):
    pass

print(Blob().area() * 2)`, task:'The base area() silently returns None, causing a confusing TypeError later. Make the base method raise NotImplementedError and catch it, printing "no area". Expected: no area',
    cases:[{inputs:[],tests:[['Clear failure','lines==["no area"]'],['Raises in base','"NotImplementedError" in src']]}],
    sol:R`class Shape:
    def area(self):
        raise NotImplementedError

class Blob(Shape):
    pass

try:
    print(Blob().area() * 2)
except NotImplementedError:
    print("no area")`, wrong:[R`class Shape:
    def area(self):
        pass

class Blob(Shape):
    pass

print(Blob().area() * 2)`]},
  write:{prompt:'Define `Shape` whose `area()` raises `NotImplementedError("Subclasses must implement area()")`, and whose `describe()` returns `<ClassName> with area <area to 2 decimals>`. Add `Circle(r)` (area `3.14159 * r ** 2`), `Rect(w, h)` and `Square(Rect)`? No: make `Square(s)` a plain `Shape` subclass. Ask `Shape: ` like `circle 2`, `rect 3 4`, `square 5` or `blob`. Print the description. `blob` creates a plain `Shape` and should print `Error: Subclasses must implement area()`. Anything else prints `Unknown shape`.',
    starter:R`class Shape:
    pass

parts = input("Shape: ").split()
`,
    inputs:['circle 2'],
    cases:[{inputs:['circle 2'],tests:[['Circle','lines[-1]=="Circle with area 12.57"'],['Base raises','__import__("unittest").TestCase().assertRaises(NotImplementedError, g["Shape"]().area) is None'],['Subclasses','all(issubclass(g[c],g["Shape"]) for c in ("Circle","Rect","Square"))'],['Describe is inherited','all("describe" not in vars(g[c]) for c in ("Circle","Rect","Square"))']]},{inputs:['rect 3 4'],tests:[['Rect','lines[-1]=="Rect with area 12.00"']]},{inputs:['square 5'],tests:[['Square','lines[-1]=="Square with area 25.00"']]},{inputs:['blob'],tests:[['Abstract','lines[-1]=="Error: Subclasses must implement area()"']]},{inputs:['hexagon 3'],tests:[['Unknown','lines[-1]=="Unknown shape"']]}],
    sol:R`class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def area(self):
        return self.w * self.h

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

parts = input("Shape: ").split()
shape = None
if parts == ["blob"]:
    shape = Shape()
elif parts and parts[0] == "circle":
    shape = Circle(float(parts[1]))
elif parts and parts[0] == "rect":
    shape = Rect(float(parts[1]), float(parts[2]))
elif parts and parts[0] == "square":
    shape = Square(float(parts[1]))

if shape is None:
    print("Unknown shape")
else:
    try:
        print(shape.describe())
    except NotImplementedError as error:
        print("Error:", error)`,
    wrong:[R`class Shape:
    def area(self):
        return 0

    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def area(self):
        return self.w * self.h

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2

parts = input("Shape: ").split()
shape = None
if parts == ["blob"]:
    shape = Shape()
elif parts and parts[0] == "circle":
    shape = Circle(float(parts[1]))
elif parts and parts[0] == "rect":
    shape = Rect(float(parts[1]), float(parts[2]))
elif parts and parts[0] == "square":
    shape = Square(float(parts[1]))

if shape is None:
    print("Unknown shape")
else:
    try:
        print(shape.describe())
    except NotImplementedError as error:
        print("Error:", error)`, R`class Shape:
    def area(self):
        raise NotImplementedError("Subclasses must implement area()")

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return 3.14159 * self.r ** 2
    def describe(self):
        return f"Circle with area {self.area():.2f}"

class Rect(Shape):
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def area(self):
        return self.w * self.h
    def describe(self):
        return f"Rect with area {self.area():.2f}"

class Square(Shape):
    def __init__(self, s):
        self.s = s
    def area(self):
        return self.s ** 2
    def describe(self):
        return f"Square with area {self.area():.2f}"

parts = input("Shape: ").split()
shape = None
if parts and parts[0] == "circle":
    shape = Circle(float(parts[1]))
elif parts and parts[0] == "rect":
    shape = Rect(float(parts[1]), float(parts[2]))
elif parts and parts[0] == "square":
    shape = Square(float(parts[1]))

if shape is None:
    print("Unknown shape")
else:
    print(shape.describe())`],
    hints:['Shape.area raises NotImplementedError("Subclasses must implement area()"). Shape.describe uses self.area() and type(self).__name__.','Each subclass defines only __init__ and area. Do NOT redefine describe.','Build the right object from the input; wrap shape.describe() in try / except NotImplementedError.','class Shape:\n    def area(self):\n        raise NotImplementedError("Subclasses must implement area()")\n\n    def describe(self):\n        return f"{type(self).__name__} with area {self.area():.2f}"\n\nclass Circle(Shape):\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2\n\nclass Rect(Shape):\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    def area(self):\n        return self.w * self.h\n\nclass Square(Shape):\n    def __init__(self, s):\n        self.s = s\n    def area(self):\n        return self.s ** 2\n\nparts = input("Shape: ").split()\nshape = None\nif parts == ["blob"]:\n    shape = Shape()\nelif parts and parts[0] == "circle":\n    shape = Circle(float(parts[1]))\nelif parts and parts[0] == "rect":\n    shape = Rect(float(parts[1]), float(parts[2]))\nelif parts and parts[0] == "square":\n    shape = Square(float(parts[1]))\n\nif shape is None:\n    print("Unknown shape")\nelse:\n    try:\n        print(shape.describe())\n    except NotImplementedError as error:\n        print("Error:", error)']},
  power:{can:['Define a contract that subclasses must fulfil','Share one describe() across all subclasses'],
    expand:'Add a `perimeter()` to the contract and a `Triangle` class.',
    where:'Plugin systems, database drivers and test frameworks define base classes with required methods.',
    next:'Next: composition, objects that HAVE other objects.'},
  codex:{title:'Abstract methods',body:'raise NotImplementedError in the base method to force subclasses to override. Shared methods call the contract (template method). abc.ABC is the stricter option.',snip:R`def area(self):
    raise NotImplementedError("Subclasses must implement area()")`}
},
{
  id:'r10-26', realm:10, n:26, title:'Composition: has-a beats is-a',
  teaches:['class-compose'], requires:['class-abstract'],
  story:`"Should a **Hero** inherit from **Backpack**?" an apprentice asks. Vael laughs. "A hero *is not* a backpack; a hero **has** one. When it's 'has-a', put the object **inside** the object."`,
  concept:{
    html:`**Composition** means an object holds other objects as attributes and delegates work to them:\n\n\`\`\`\nclass Weapon:\n    def __init__(self, name, damage):\n        self.name = name\n        self.damage = damage\n\nclass Hero:\n    def __init__(self, name, weapon=None):\n        self.name = name\n        self.weapon = weapon              # a Hero HAS a Weapon\n\n    @property\n    def power(self):\n        return 1 + (self.weapon.damage if self.weapon else 0)\n\nh = Hero("Ada", Weapon("Sword", 7))\nprint(h.power)            # 8\n\`\`\`\n\n| Relationship | Tool | Test |\n|---|---|---|\n| X **is a** Y | inheritance | "a Mage is a Hero" ✔ |\n| X **has a** Y | composition | "a Hero has a Weapon" ✔ |\n\n- Composition is **more flexible**: swap the weapon at run time (\`h.weapon = Weapon(...)\`), give a hero *no* weapon (\`None\`), or several.\n- Inheritance couples classes tightly; deep hierarchies get brittle. Experienced developers say: **"favour composition over inheritance."**\n- Guard the optional parts: \`self.weapon.damage\` when \`weapon\` is \`None\` raises \`AttributeError\`.`,
    analogy:`A car has an engine. Swap the engine without redesigning the car.`,
    example:R`class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Hero:
    def __init__(self, name, weapon=None):
        self.name = name
        self.weapon = weapon

    @property
    def power(self):
        return 1 + (self.weapon.damage if self.weapon else 0)

h = Hero("Ada", Weapon("Sword", 7))
print(h.power)
h.weapon = None
print(h.power)`},
  predict:{code:R`class E:
    def __init__(self):
        self.hp = 5

class Car:
    def __init__(self):
        self.engine = E()

print(Car().engine.hp)`, q:'What prints?', opts:['5','Error','E'], ans:0, why:'car.engine is an E object; .hp reads its attribute.'},
  cast:{code:R`class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Hero:
    def __init__(self, name, weapon=None):
        self.name = name
        self.weapon = weapon

    @property
    def power(self):
        return 1 + (self.weapon.damage if self.weapon else 0)

h = Hero("Ada", Weapon("Sword", 7))
print(h.power)
h.weapon = None
print(h.power)`, task:'Cast it.'},
  bug:{broken:R`class Weapon:
    def __init__(self, damage):
        self.damage = damage

class Hero:
    def __init__(self, weapon=None):
        self.weapon = weapon

    def power(self):
        return 1 + self.weapon.damage

print(Hero().power())`, task:'AttributeError: an unarmed hero has weapon=None. Only add the damage when there is a weapon. Expected: 1',
    cases:[{inputs:[],tests:[['One','lines==["1"]']]}],
    sol:R`class Weapon:
    def __init__(self, damage):
        self.damage = damage

class Hero:
    def __init__(self, weapon=None):
        self.weapon = weapon

    def power(self):
        return 1 + (self.weapon.damage if self.weapon else 0)

print(Hero().power())`, wrong:[R`class Weapon:
    def __init__(self, damage):
        self.damage = damage

class Hero:
    def __init__(self, weapon=None):
        self.weapon = weapon

    def power(self):
        return 1 + self.weapon.damage

print(Hero().power())`]},
  write:{prompt:'Define `Weapon(name, damage)` and `Armor(name, defense)`. `Hero(name)` HAS an optional `weapon` and `armor` (both start as `None`) and **properties** `attack` (`1 +` the weapon\'s damage) and `defense` (`0 +` the armor\'s defense). Commands (prompt `> `): `weapon <name> <damage>`, `armor <name> <defense>`, `unequip weapon`, `unequip armor`, `status`, `quit`. `status` prints `Attack: <n> Defense: <n>`. Unknown commands print `Unknown command`.',
    starter:R`class Weapon:
    pass

hero = None
`,
    inputs:['status','weapon Sword 7','armor Shield 3','status','unequip weapon','status','quit'],
    cases:[{inputs:['status','weapon Sword 7','armor Shield 3','status','unequip weapon','status','quit'],tests:[['Session','[l for l in lines if not l.startswith("> ")]==["Attack: 1 Defense: 0","Attack: 8 Defense: 3","Attack: 1 Defense: 3"]'],['Composition','(lambda h: (setattr(h,"weapon",g["Weapon"]("x",4)), h.attack)[1])(g["Hero"]("a"))==5'],['Properties','isinstance(vars(g["Hero"]).get("attack"), property) and isinstance(vars(g["Hero"]).get("defense"), property)'],['Hero is not a subclass','not issubclass(g["Hero"],g["Weapon"]) and not issubclass(g["Hero"],g["Armor"])']]},{inputs:['armor Plate 9','unequip armor','status','quit'],tests:[['Unequip armor','[l for l in lines if not l.startswith("> ")]==["Attack: 1 Defense: 0"]']]},{inputs:['weapon Axe 5','weapon Bow 2','status','quit'],tests:[['Replace','[l for l in lines if not l.startswith("> ")]==["Attack: 3 Defense: 0"]']]},{inputs:['dance','unequip','quit'],tests:[['Unknown','[l for l in lines if not l.startswith("> ")]==["Unknown command","Unknown command"]']]}],
    sol:R`class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Armor:
    def __init__(self, name, defense):
        self.name = name
        self.defense = defense

class Hero:
    def __init__(self, name):
        self.name = name
        self.weapon = None
        self.armor = None

    @property
    def attack(self):
        return 1 + (self.weapon.damage if self.weapon else 0)

    @property
    def defense(self):
        return 0 + (self.armor.defense if self.armor else 0)

hero = Hero("Ada")
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    if len(parts) == 3 and parts[0] == "weapon":
        hero.weapon = Weapon(parts[1], int(parts[2]))
    elif len(parts) == 3 and parts[0] == "armor":
        hero.armor = Armor(parts[1], int(parts[2]))
    elif parts == ["unequip", "weapon"]:
        hero.weapon = None
    elif parts == ["unequip", "armor"]:
        hero.armor = None
    elif parts == ["status"]:
        print(f"Attack: {hero.attack} Defense: {hero.defense}")
    else:
        print("Unknown command")`,
    wrong:[R`class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Armor:
    def __init__(self, name, defense):
        self.name = name
        self.defense = defense

class Hero:
    def __init__(self, name):
        self.name = name
        self.weapon = None
        self.armor = None

    @property
    def attack(self):
        return 1 + self.weapon.damage

    @property
    def defense(self):
        return 0 + self.armor.defense

hero = Hero("Ada")
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    if len(parts) == 3 and parts[0] == "weapon":
        hero.weapon = Weapon(parts[1], int(parts[2]))
    elif len(parts) == 3 and parts[0] == "armor":
        hero.armor = Armor(parts[1], int(parts[2]))
    elif parts == ["unequip", "weapon"]:
        hero.weapon = None
    elif parts == ["unequip", "armor"]:
        hero.armor = None
    elif parts == ["status"]:
        print(f"Attack: {hero.attack} Defense: {hero.defense}")
    else:
        print("Unknown command")`, R`class Weapon:
    def __init__(self, name, damage):
        self.name = name
        self.damage = damage

class Armor:
    def __init__(self, name, defense):
        self.name = name
        self.defense = defense

class Hero:
    def __init__(self, name):
        self.name = name
        self.weapon = None
        self.armor = None
        self.attack = 1
        self.defense = 0

hero = Hero("Ada")
while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        break
    if len(parts) == 3 and parts[0] == "weapon":
        hero.weapon = Weapon(parts[1], int(parts[2]))
        hero.attack = 1 + hero.weapon.damage
    elif len(parts) == 3 and parts[0] == "armor":
        hero.armor = Armor(parts[1], int(parts[2]))
        hero.defense = hero.armor.defense
    elif parts == ["unequip", "weapon"]:
        hero.weapon = None
    elif parts == ["unequip", "armor"]:
        hero.armor = None
    elif parts == ["status"]:
        print(f"Attack: {hero.attack} Defense: {hero.defense}")
    else:
        print("Unknown command")`],
    hints:['Hero.__init__ sets self.weapon = None and self.armor = None.','attack: 1 + (self.weapon.damage if self.weapon else 0), as a @property. defense is the same idea.','Commands just assign hero.weapon / hero.armor to a new object or None.','class Weapon:\n    def __init__(self, name, damage):\n        self.name = name\n        self.damage = damage\n\nclass Armor:\n    def __init__(self, name, defense):\n        self.name = name\n        self.defense = defense\n\nclass Hero:\n    def __init__(self, name):\n        self.name = name\n        self.weapon = None\n        self.armor = None\n\n    @property\n    def attack(self):\n        return 1 + (self.weapon.damage if self.weapon else 0)\n\n    @property\n    def defense(self):\n        return 0 + (self.armor.defense if self.armor else 0)\n\nhero = Hero("Ada")\nwhile True:\n    parts = input("> ").split()\n    if parts == ["quit"]:\n        break\n    if len(parts) == 3 and parts[0] == "weapon":\n        hero.weapon = Weapon(parts[1], int(parts[2]))\n    elif len(parts) == 3 and parts[0] == "armor":\n        hero.armor = Armor(parts[1], int(parts[2]))\n    elif parts == ["unequip", "weapon"]:\n        hero.weapon = None\n    elif parts == ["unequip", "armor"]:\n        hero.armor = None\n    elif parts == ["status"]:\n        print(f"Attack: {hero.attack} Defense: {hero.defense}")\n    else:\n        print("Unknown command")']},
  power:{can:['Model has-a relationships with composition','Swap parts at run time and handle missing parts'],
    expand:'Let a hero carry a list of potions and add a `use_potion()` method.',
    where:'Modern designs (game entity components, dependency injection, strategy objects) are composition.',
    next:'Next: mixins and the method resolution order.'},
  codex:{title:'Composition',body:'"has-a" = an attribute holding another object. More flexible than inheritance; guard optional parts with None checks. Favour composition over inheritance.',snip:R`self.weapon = weapon
return 1 + (self.weapon.damage if self.weapon else 0)`}
},
{
  id:'r10-27', realm:10, n:27, title:'Mixins and the MRO',
  teaches:['class-mixin'], requires:['class-compose'],
  story:`Some skills belong to *many* kinds of creatures: swimming, flying, invisibility. "Don't build a hero hierarchy around them," Vael says. "Make **tiny add-on classes** and mix them in."`,
  concept:{
    html:`A class may inherit from **several** parents. A **mixin** is a small class that adds one capability and is never used alone:\n\n\`\`\`\nclass FlyMixin:\n    def fly(self):\n        return f"{self.name} flies"\n\nclass SwimMixin:\n    def swim(self):\n        return f"{self.name} swims"\n\nclass Creature:\n    def __init__(self, name):\n        self.name = name\n\nclass Duck(Creature, FlyMixin, SwimMixin):\n    pass\n\nclass Fish(Creature, SwimMixin):\n    pass\n\`\`\`\n\n- Mixins assume the host class provides what they need (here, \`self.name\`).\n- **MRO** (Method Resolution Order) is the order Python searches the parents. See it with \`Duck.__mro__\` or \`Duck.mro()\`. **Left to right, children before parents.**\n- If two parents define the same method, the **leftmost** wins.\n- \`super()\` follows the MRO, so cooperating classes can chain calls.\n- Keep mixins **small and single-purpose**. Complicated multiple inheritance gets confusing fast; when in doubt, use composition.`,
    analogy:`Clip-on gadgets for a backpack: each adds one thing and you pick which to attach.`,
    example:R`class FlyMixin:
    def fly(self):
        return f"{self.name} flies"

class SwimMixin:
    def swim(self):
        return f"{self.name} swims"

class Creature:
    def __init__(self, name):
        self.name = name

class Duck(Creature, FlyMixin, SwimMixin):
    pass

d = Duck("Don")
print(d.fly(), "/", d.swim())
print([c.__name__ for c in Duck.__mro__])`},
  predict:{code:R`class A:
    def who(self): return "A"
class B:
    def who(self): return "B"
class C(A, B):
    pass
print(C().who())`, q:'What prints?', opts:['A','B','Error'], ans:0, why:'The MRO searches A before B (left to right).'},
  cast:{code:R`class FlyMixin:
    def fly(self):
        return f"{self.name} flies"

class SwimMixin:
    def swim(self):
        return f"{self.name} swims"

class Creature:
    def __init__(self, name):
        self.name = name

class Duck(Creature, FlyMixin, SwimMixin):
    pass

d = Duck("Don")
print(d.fly(), "/", d.swim())
print([c.__name__ for c in Duck.__mro__])`, task:'Cast it.'},
  bug:{broken:R`class A:
    def hello(self):
        return "A"

class B:
    def hello(self):
        return "B"

class C(A, B):
    pass

print(C().hello())`, task:'We wanted B\'s hello, but A is searched first. Swap the parent order. Expected: B',
    cases:[{inputs:[],tests:[['B','lines==["B"]']]}],
    sol:R`class A:
    def hello(self):
        return "A"

class B:
    def hello(self):
        return "B"

class C(B, A):
    pass

print(C().hello())`, wrong:[R`class A:
    def hello(self):
        return "A"

class B:
    def hello(self):
        return "B"

class C(A, B):
    pass

print(C().hello())`]},
  write:{prompt:'Create `Creature(name)`, mixins `FlyMixin` (`fly()` → `<name> flies`), `SwimMixin` (`swim()` → `<name> swims`) and `WalkMixin` (`walk()` → `<name> walks`). Build `Duck` (fly, swim, walk), `Fish` (swim) and `Dog` (walk, swim). Ask `Animal: ` and `Name: `, then print each ability the animal has in the order **fly, swim, walk** (one per line). Unknown animals print `Unknown animal`. Finally print `MRO: ` followed by the class names of that animal\'s MRO joined with ` > `.',
    starter:R`class Creature:
    pass

kind = input("Animal: ")
name = input("Name: ")
`,
    inputs:['duck','Don'],
    cases:[{inputs:['duck','Don'],tests:[['Duck','lines[-4:-1]==["Don flies","Don swims","Don walks"]'],['MRO printed','lines[-1].startswith("MRO: Duck > Creature")'],['Mixins are separate','not hasattr(g["Creature"],"fly") and hasattr(g["FlyMixin"],"fly") and not hasattr(g["SwimMixin"],"walk")']]},{inputs:['fish','Finn'],tests:[['Fish','lines[-2]=="Finn swims" and lines[-3]=="Fish" or lines[-2:-1]==["Finn swims"]'],['Only swims','out.count("flies")==0 and out.count("walks")==0']]},{inputs:['dog','Rex'],tests:[['Dog','"Rex swims" in lines and "Rex walks" in lines and "Rex flies" not in lines'],['Order','lines.index("Rex swims")<lines.index("Rex walks")']]},{inputs:['cat','Tom'],tests:[['Unknown','lines[-1]=="Unknown animal"']]}],
    sol:R`class Creature:
    def __init__(self, name):
        self.name = name

class FlyMixin:
    def fly(self):
        return f"{self.name} flies"

class SwimMixin:
    def swim(self):
        return f"{self.name} swims"

class WalkMixin:
    def walk(self):
        return f"{self.name} walks"

class Duck(Creature, FlyMixin, SwimMixin, WalkMixin):
    pass

class Fish(Creature, SwimMixin):
    pass

class Dog(Creature, WalkMixin, SwimMixin):
    pass

ANIMALS = {"duck": Duck, "fish": Fish, "dog": Dog}
kind = input("Animal: ")
name = input("Name: ")
if kind not in ANIMALS:
    print("Unknown animal")
else:
    animal = ANIMALS[kind](name)
    for ability in ("fly", "swim", "walk"):
        if hasattr(animal, ability):
            print(getattr(animal, ability)())
    print("MRO: " + " > ".join(c.__name__ for c in type(animal).__mro__))`,
    wrong:[R`class Creature:
    def __init__(self, name):
        self.name = name

class FlyMixin:
    def fly(self):
        return f"{self.name} flies"

class SwimMixin:
    def swim(self):
        return f"{self.name} swims"

class WalkMixin:
    def walk(self):
        return f"{self.name} walks"

class Duck(Creature, FlyMixin, SwimMixin, WalkMixin):
    pass

class Fish(Creature, SwimMixin):
    pass

class Dog(Creature, WalkMixin, SwimMixin):
    pass

ANIMALS = {"duck": Duck, "fish": Fish, "dog": Dog}
kind = input("Animal: ")
name = input("Name: ")
if kind not in ANIMALS:
    print("Unknown animal")
else:
    animal = ANIMALS[kind](name)
    for ability in ("walk", "swim", "fly"):
        if hasattr(animal, ability):
            print(getattr(animal, ability)())
    print("MRO: " + " > ".join(c.__name__ for c in type(animal).__mro__))`, R`class Creature:
    def __init__(self, name):
        self.name = name

    def fly(self):
        return f"{self.name} flies"

    def swim(self):
        return f"{self.name} swims"

    def walk(self):
        return f"{self.name} walks"

class Duck(Creature):
    pass

class Fish(Creature):
    pass

class Dog(Creature):
    pass

ANIMALS = {"duck": Duck, "fish": Fish, "dog": Dog}
kind = input("Animal: ")
name = input("Name: ")
if kind not in ANIMALS:
    print("Unknown animal")
else:
    animal = ANIMALS[kind](name)
    for ability in ("fly", "swim", "walk"):
        if hasattr(animal, ability):
            print(getattr(animal, ability)())
    print("MRO: " + " > ".join(c.__name__ for c in type(animal).__mro__))`],
    hints:['Three tiny mixin classes, each with one method that uses self.name.','Duck(Creature, FlyMixin, SwimMixin, WalkMixin) inherits from all of them.','hasattr(animal, "fly") tells you which abilities exist; type(animal).__mro__ lists the search order.','class Creature:\n    def __init__(self, name):\n        self.name = name\n\nclass FlyMixin:\n    def fly(self):\n        return f"{self.name} flies"\n\nclass SwimMixin:\n    def swim(self):\n        return f"{self.name} swims"\n\nclass WalkMixin:\n    def walk(self):\n        return f"{self.name} walks"\n\nclass Duck(Creature, FlyMixin, SwimMixin, WalkMixin):\n    pass\n\nclass Fish(Creature, SwimMixin):\n    pass\n\nclass Dog(Creature, WalkMixin, SwimMixin):\n    pass\n\nANIMALS = {"duck": Duck, "fish": Fish, "dog": Dog}\nkind = input("Animal: ")\nname = input("Name: ")\nif kind not in ANIMALS:\n    print("Unknown animal")\nelse:\n    animal = ANIMALS[kind](name)\n    for ability in ("fly", "swim", "walk"):\n        if hasattr(animal, ability):\n            print(getattr(animal, ability)())\n    print("MRO: " + " > ".join(c.__name__ for c in type(animal).__mro__))']},
  power:{can:['Add abilities to classes with mixins','Read a class\'s MRO'],
    expand:'Add a `FireMixin` and make a `Dragon` that flies and breathes fire.',
    where:'Django, DRF and many libraries ship mixins you combine to get features.',
    next:'Next: Real-World Mission: the RPG Battle Arena.'},
  codex:{title:'Mixins and MRO',body:'class C(A, B) inherits both; the MRO searches left to right, children before parents (C.__mro__). Mixins are tiny one-purpose helper classes. Prefer composition when it gets complicated.',snip:R`class Duck(Creature, FlyMixin, SwimMixin):
    pass`}
},
{
  id:'r10-28', realm:10, n:28, title:'Real-World Mission: The Battle Arena',
  teaches:['mission10b'], requires:['class-mixin','class-isinstance'],
  story:`The arena horn sounds. "Two fighters enter," the announcer cries. Vael hands you a quill. "Build the arena engine: **fighters with different styles, a fair turn order, and a clear winner.** No randomness, so the crowd can replay any fight."`,
  concept:{
    html:`This mission combines inheritance, overriding, \`super()\` and composition:\n\n- \`Fighter(name, hp, power)\`: the base class with \`attack(target)\` and an \`is_alive\` property.\n- Subclasses **override** how damage is calculated: \`Knight\` takes half damage (rounded down), \`Rogue\` hits for double on the **first** attack only.\n- A \`fight(a, b)\` function alternates turns (**a** first) until someone drops to 0 HP or below, returning the **winner**.\n\n\`\`\`\ndef take_damage(self, amount):           # overridable hook\n    self.hp = max(0, self.hp - amount)\n\ndef attack(self, target):\n    target.take_damage(self.power)\n\`\`\`\n\nDesign tip: put the **varying** part (how damage is taken or dealt) into a small method (a hook) that subclasses override, and keep the **fight loop** free of \`if isinstance\` checks.`,
    analogy:`A tournament referee runs the same rules for every fighter; each fighter brings their own style.`,
    example:R`class Fighter:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

    @property
    def is_alive(self):
        return self.hp > 0

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def attack(self, target):
        target.take_damage(self.power)

a = Fighter("A", 10, 4)
b = Fighter("B", 10, 3)
a.attack(b)
print(b.hp)`},
  predict:{code:R`hp = 3
hp = max(0, hp - 10)
print(hp)`, q:'What prints?', opts:['0','-7','3'], ans:0, why:'max(0, ...) stops HP going below zero.'},
  cast:{code:R`class Fighter:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

    @property
    def is_alive(self):
        return self.hp > 0

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def attack(self, target):
        target.take_damage(self.power)

a = Fighter("A", 10, 4)
b = Fighter("B", 10, 3)
a.attack(b)
print(b.hp)`, task:'Cast it.'},
  bug:{broken:R`def fight(a_hp, b_hp):
    rounds = 0
    while a_hp > 0 or b_hp > 0:
        a_hp -= 3
        b_hp -= 3
        rounds += 1
    return rounds

print(fight(9, 3))`, task:'The fight keeps going after one fighter is already down. Stop as soon as EITHER fighter is out. Expected: 1',
    cases:[{inputs:[],tests:[['One round','lines==["1"]']]}],
    sol:R`def fight(a_hp, b_hp):
    rounds = 0
    while a_hp > 0 and b_hp > 0:
        a_hp -= 3
        b_hp -= 3
        rounds += 1
    return rounds

print(fight(9, 3))`, wrong:[R`def fight(a_hp, b_hp):
    rounds = 0
    while a_hp > 0 or b_hp > 0:
        a_hp -= 3
        b_hp -= 3
        rounds += 1
        if rounds > 5:
            break
    return rounds

print(fight(9, 3))`]},
  write:{prompt:'Build the arena. `Fighter(name, hp, power)` with `is_alive` (property), `take_damage(amount)` (HP never below 0) and `attack(target)`. `Knight` takes **half** damage rounded down (`amount // 2`). `Rogue` deals **double** damage on its **first** attack only (use `super().attack` carefully or adjust power). `fight(a, b)` alternates turns, **a first**, stops as soon as someone is at 0 HP and **returns the winner**. The program asks `Fighter 1: ` and `Fighter 2: ` as `kind name hp power` (kind is `fighter`, `knight` or `rogue`) and prints one line per attack `<attacker> hits <target> (<target hp> HP left)` then `Winner: <name>`. A bad line prints `Bad fighter` and stops.',
    starter:R`class Fighter:
    pass

def fight(a, b):
    pass

line1 = input("Fighter 1: ")
line2 = input("Fighter 2: ")
`,
    inputs:['fighter Ann 10 4','fighter Bo 10 3'],
    cases:[{inputs:['fighter Ann 10 4','fighter Bo 10 3'],tests:[['Plain fight','lines[-5:]==["Ann hits Bo (6 HP left)","Bo hits Ann (7 HP left)","Ann hits Bo (2 HP left)","Bo hits Ann (4 HP left)","Ann hits Bo (0 HP left)"] or lines[-1]=="Winner: Ann"'],['Winner','lines[-1]=="Winner: Ann"'],['Hook exists','hasattr(g["Fighter"],"take_damage") and issubclass(g["Knight"],g["Fighter"]) and issubclass(g["Rogue"],g["Fighter"])'],['Knight halves damage','(lambda k: (k.take_damage(7), k.hp)[1])(g["Knight"]("k",20,1))==17'],['HP floor','(lambda f: (f.take_damage(99), f.hp)[1])(g["Fighter"]("f",5,1))==0']]},{inputs:['knight Kay 20 3','fighter Bo 10 6'],tests:[['Knight wins','lines[-1]=="Winner: Kay"'],['Knight takes half','"Bo hits Kay (17 HP left)" in lines']]},{inputs:['rogue Rae 10 2','fighter Bo 6 1'],tests:[['Rogue first hit doubled','[l for l in lines if " hits " in l][0]=="Rae hits Bo (2 HP left)"'],['Then normal','"Rae hits Bo (0 HP left)" in lines or lines[-1]=="Winner: Rae"']]},{inputs:['wizard X 1 1','fighter Bo 10 3'],tests:[['Bad kind','lines[-1]=="Bad fighter"']]},{inputs:['fighter A x 3','fighter B 5 3'],tests:[['Bad number','lines[-1]=="Bad fighter"']]},{inputs:['fighter Ann 5 5','fighter Bo 10 3'],tests:[['A wins in one blow? no','lines[-1]=="Winner: Bo" or lines[-1]=="Winner: Ann"'],['Turn order','[l for l in lines if " hits " in l][0]=="Ann hits Bo (5 HP left)"']]}],
    sol:R`class Fighter:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

    @property
    def is_alive(self):
        return self.hp > 0

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def attack(self, target):
        target.take_damage(self.power)

class Knight(Fighter):
    def take_damage(self, amount):
        super().take_damage(amount // 2)

class Rogue(Fighter):
    def __init__(self, name, hp, power):
        super().__init__(name, hp, power)
        self.first = True

    def attack(self, target):
        if self.first:
            self.first = False
            target.take_damage(self.power * 2)
        else:
            target.take_damage(self.power)

def fight(a, b):
    attacker, defender = a, b
    while a.is_alive and b.is_alive:
        attacker.attack(defender)
        print(f"{attacker.name} hits {defender.name} ({defender.hp} HP left)")
        attacker, defender = defender, attacker
    return a if a.is_alive else b

KINDS = {"fighter": Fighter, "knight": Knight, "rogue": Rogue}

def build(text):
    parts = text.split()
    if len(parts) != 4 or parts[0] not in KINDS:
        return None
    try:
        return KINDS[parts[0]](parts[1], int(parts[2]), int(parts[3]))
    except ValueError:
        return None

line1 = input("Fighter 1: ")
line2 = input("Fighter 2: ")
first = build(line1)
second = build(line2)
if first is None or second is None:
    print("Bad fighter")
else:
    print("Winner:", fight(first, second).name)`,
    wrong:[R`class Fighter:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

    @property
    def is_alive(self):
        return self.hp > 0

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def attack(self, target):
        target.take_damage(self.power)

class Knight(Fighter):
    def take_damage(self, amount):
        super().take_damage(amount)

class Rogue(Fighter):
    def __init__(self, name, hp, power):
        super().__init__(name, hp, power)
        self.first = True

    def attack(self, target):
        if self.first:
            self.first = False
            target.take_damage(self.power * 2)
        else:
            target.take_damage(self.power)

def fight(a, b):
    attacker, defender = a, b
    while a.is_alive and b.is_alive:
        attacker.attack(defender)
        print(f"{attacker.name} hits {defender.name} ({defender.hp} HP left)")
        attacker, defender = defender, attacker
    return a if a.is_alive else b

KINDS = {"fighter": Fighter, "knight": Knight, "rogue": Rogue}

def build(text):
    parts = text.split()
    if len(parts) != 4 or parts[0] not in KINDS:
        return None
    try:
        return KINDS[parts[0]](parts[1], int(parts[2]), int(parts[3]))
    except ValueError:
        return None

line1 = input("Fighter 1: ")
line2 = input("Fighter 2: ")
first = build(line1)
second = build(line2)
if first is None or second is None:
    print("Bad fighter")
else:
    print("Winner:", fight(first, second).name)`, R`class Fighter:
    def __init__(self, name, hp, power):
        self.name = name
        self.hp = hp
        self.power = power

    @property
    def is_alive(self):
        return self.hp > 0

    def take_damage(self, amount):
        self.hp = max(0, self.hp - amount)

    def attack(self, target):
        target.take_damage(self.power)

class Knight(Fighter):
    def take_damage(self, amount):
        super().take_damage(amount // 2)

class Rogue(Fighter):
    def attack(self, target):
        target.take_damage(self.power)

def fight(a, b):
    attacker, defender = a, b
    while a.is_alive and b.is_alive:
        attacker.attack(defender)
        print(f"{attacker.name} hits {defender.name} ({defender.hp} HP left)")
        attacker, defender = defender, attacker
    return a if a.is_alive else b

KINDS = {"fighter": Fighter, "knight": Knight, "rogue": Rogue}

def build(text):
    parts = text.split()
    if len(parts) != 4 or parts[0] not in KINDS:
        return None
    try:
        return KINDS[parts[0]](parts[1], int(parts[2]), int(parts[3]))
    except ValueError:
        return None

line1 = input("Fighter 1: ")
line2 = input("Fighter 2: ")
first = build(line1)
second = build(line2)
if first is None or second is None:
    print("Bad fighter")
else:
    print("Winner:", fight(first, second).name)`],
    hints:['Fighter: take_damage uses max(0, hp - amount); attack calls target.take_damage(self.power).','Knight overrides take_damage and passes amount // 2 to super(). Rogue keeps a first flag and doubles its first attack.','fight alternates attacker and defender (swap with attacker, defender = defender, attacker), prints each hit, and returns whichever fighter is still alive.','class Fighter:\n    def __init__(self, name, hp, power):\n        self.name = name\n        self.hp = hp\n        self.power = power\n\n    @property\n    def is_alive(self):\n        return self.hp > 0\n\n    def take_damage(self, amount):\n        self.hp = max(0, self.hp - amount)\n\n    def attack(self, target):\n        target.take_damage(self.power)\n\nclass Knight(Fighter):\n    def take_damage(self, amount):\n        super().take_damage(amount // 2)\n\nclass Rogue(Fighter):\n    def __init__(self, name, hp, power):\n        super().__init__(name, hp, power)\n        self.first = True\n\n    def attack(self, target):\n        if self.first:\n            self.first = False\n            target.take_damage(self.power * 2)\n        else:\n            target.take_damage(self.power)\n\ndef fight(a, b):\n    attacker, defender = a, b\n    while a.is_alive and b.is_alive:\n        attacker.attack(defender)\n        print(f"{attacker.name} hits {defender.name} ({defender.hp} HP left)")\n        attacker, defender = defender, attacker\n    return a if a.is_alive else b\n\nKINDS = {"fighter": Fighter, "knight": Knight, "rogue": Rogue}\n\ndef build(text):\n    parts = text.split()\n    if len(parts) != 4 or parts[0] not in KINDS:\n        return None\n    try:\n        return KINDS[parts[0]](parts[1], int(parts[2]), int(parts[3]))\n    except ValueError:\n        return None\n\nline1 = input("Fighter 1: ")\nline2 = input("Fighter 2: ")\nfirst = build(line1)\nsecond = build(line2)\nif first is None or second is None:\n    print("Bad fighter")\nelse:\n    print("Winner:", fight(first, second).name)']},
  power:{can:['Combine inheritance, overriding and super() in one design','Use small hook methods so loops stay generic'],
    expand:'Add a `Healer` that restores 2 HP to itself each time it attacks.',
    where:'Game engines, simulations and rule systems are built from this pattern of hooks and subclasses.',
    next:'Next: magic methods, making objects behave like built-ins.'},
  codex:{title:'Mission: Battle Arena',body:'A base class with overridable hooks (take_damage, attack), subclasses for styles, and a generic fight loop without type checks. super() extends hooks.',snip:R`class Knight(Fighter):
    def take_damage(self, amount):
        super().take_damage(amount // 2)`}
}
);
