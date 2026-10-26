// REALM 6 — THE SPELL FORGE — part C (lessons 19-27)
LESSONS.push(
{
  id:'r6-19', realm:6, n:19, title:'*args: any number of arguments',
  teaches:['fn-args'], requires:['mission6a'],
  story:`"How many ingots in a batch?" Ada shrugs. "Two, ten, a hundred. A good tool takes **however many** you bring." She sweeps an armful onto the bench and the forge counts them all.`,
  concept:{
    html:`A parameter starting with \`*\` collects **all extra positional arguments** into a tuple:\n\n\`\`\`\ndef average(*nums):\n    return sum(nums) / len(nums)\n\naverage(2, 4, 6)       # nums is (2, 4, 6) → 4.0\naverage(10)            # 10.0\n\`\`\`\n\nThe reverse also works: **unpack a list into arguments** with \`*\` in the call:\n\n\`\`\`\nscores = [2, 4, 6]\naverage(*scores)       # same as average(2, 4, 6)\n\`\`\`\n\nYou've used this: \`print("a", "b", "c")\` takes any number of items. The name \`args\` is just convention.`,
    analogy:`A bag that expands to hold whatever you put in.`,
    example:R`def average(*nums):
    return sum(nums) / len(nums)

print(average(2, 4, 6))
scores = [10, 20]
print(average(*scores))`},
  predict:{code:R`def f(*items):
    return len(items)

print(f(), f(1), f(1, 2, 3))`, q:'What prints?', opts:['0 1 3','1 1 3','0 1 1'], ans:0, why:'items collects every argument given; with none it is an empty tuple.'},
  cast:{code:R`def average(*nums):
    return sum(nums) / len(nums)

print(average(2, 4, 6))
scores = [10, 20]
print(average(*scores))`, task:'Cast it.'},
  bug:{broken:R`def average(*nums):
    return sum(nums) / len(nums)

scores = [2, 4, 6]
print(average(scores))`, task:'TypeError: the whole list was passed as ONE argument. Unpack it into separate arguments.',
    cases:[{inputs:[],tests:[['Prints 4.0','out.strip()=="4.0"'],['Uses *','"average(*" in src']]}],
    sol:R`def average(*nums):
    return sum(nums) / len(nums)

scores = [2, 4, 6]
print(average(*scores))`, wrong:[R`def average(*nums):
    return sum(nums) / len(nums)

scores = [2, 4, 6]
print(average(scores))`]},
  write:{prompt:'Define `biggest(*nums)` that returns the largest of any number of arguments (without using `max`). Print `biggest(3, 9, 4)` then `biggest(*data)`.',
    starter:R`data = [5, 12, 7, 1]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["9","12"]'],['One argument','g["biggest"](7)==7'],['Negatives','g["biggest"](-5,-2,-9)==-2'],['No max','"max(" not in src']]}],
    sol:R`data = [5, 12, 7, 1]

def biggest(*nums):
    best = nums[0]
    for n in nums:
        if n > best:
            best = n
    return best

print(biggest(3, 9, 4))
print(biggest(*data))`,
    wrong:[R`data = [5, 12, 7, 1]

def biggest(*nums):
    best = 0
    for n in nums:
        if n > best:
            best = n
    return best

print(biggest(3, 9, 4))
print(biggest(*data))`, R`data = [5, 12, 7, 1]

def biggest(*nums):
    return max(nums)

print(biggest(3, 9, 4))
print(biggest(*data))`],
    hints:['def biggest(*nums): nums is a tuple.','Start best at nums[0] (not 0, so negatives work).','Loop and update; call with biggest(*data) for the list.','data = [5, 12, 7, 1]\n\ndef biggest(*nums):\n    best = nums[0]\n    for n in nums:\n        if n > best:\n            best = n\n    return best\n\nprint(biggest(3, 9, 4))\nprint(biggest(*data))']},
  power:{can:['Accept any number of arguments','Unpack a list into a call'],
    expand:'Write join_all(sep, *words) that joins any number of words with sep.',
    where:'Wrapper functions, loggers and math helpers all use *args.',
    next:'Next: the keyword twin, **kwargs.'},
  codex:{title:'*args',body:'def f(*args) collects extra positional arguments into a tuple. f(*my_list) unpacks a list.',snip:R`def f(*nums): ...
f(*data)`}
},
{
  id:'r6-20', realm:6, n:20, title:'**kwargs: any named options',
  teaches:['fn-kwargs2'], requires:['fn-args'],
  story:`"Now the labelled tags," Ada says, pinning a dozen paper tags to a plate. "A function that accepts **any** options by name."`,
  concept:{
    html:`A parameter starting with \`**\` collects extra **keyword arguments** into a dict:\n\n\`\`\`\ndef describe(**info):\n    for key, value in info.items():\n        print(key, "=", value)\n\ndescribe(name="Ada", level=5)\n\`\`\`\n\n- \`info\` is \`{'name': 'Ada', 'level': 5}\`.\n- Unpack a dict into a call with \`**\`: \`describe(**my_dict)\`.\n- Order is the order given.\n\nCommon pattern: \`def f(required, *args, **options)\`. Use it when the options can't be listed ahead of time.`,
    analogy:`A form with a "notes" area where people add their own labelled fields.`,
    example:R`def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

describe(name="Ada", level=5)`},
  predict:{code:R`def f(**kw):
    return sorted(kw)

print(f(b=1, a=2))`, q:'What prints?', opts:["['a', 'b']","['b', 'a']","[1, 2]"], ans:0, why:'kw is a dict; sorted(dict) sorts its keys.'},
  cast:{code:R`def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

describe(name="Ada", level=5)`, task:'Cast it.'},
  bug:{broken:R`def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

describe("Ada", 5)`, task:'TypeError: **info only accepts NAMED arguments. Call it with name= and level=.',
    cases:[{inputs:[],tests:[['Printed','lines==["name = Ada","level = 5"]']]}],
    sol:R`def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

describe(name="Ada", level=5)`, wrong:[R`def describe(**info):
    for key, value in info.items():
        print(key, "=", value)

describe("Ada", 5)`]},
  write:{prompt:'Define `build_url(base, **params)` that returns `base` followed by `?` and the params as `key=value` joined with `&`. With no params return just `base`. Print `build_url("shop.com/items", sort="price", page=2)`.',
    starter:R`# define build_url
`,
    cases:[{inputs:[],tests:[['Printed','lines==["shop.com/items?sort=price&page=2"]'],['No params','g["build_url"]("x.com")=="x.com"'],['One param','g["build_url"]("x.com", a=1)=="x.com?a=1"'],['Two params','g["build_url"]("x.com", a=1, b="y")=="x.com?a=1&b=y"']]}],
    sol:R`def build_url(base, **params):
    if not params:
        return base
    pairs = [f"{k}={v}" for k, v in params.items()]
    return base + "?" + "&".join(pairs)

print(build_url("shop.com/items", sort="price", page=2))`,
    wrong:[R`def build_url(base, **params):
    pairs = [f"{k}={v}" for k, v in params.items()]
    return base + "?" + "&".join(pairs)

print(build_url("shop.com/items", sort="price", page=2))`, R`def build_url(base, **params):
    return "shop.com/items?sort=price&page=2"

print(build_url("shop.com/items", sort="price", page=2))`],
    hints:['params is a dict. Turn each pair into "key=value".','"&".join(list_of_pairs), then base + "?" + that.','Return just base when params is empty.','def build_url(base, **params):\n    if not params:\n        return base\n    pairs = [f"{k}={v}" for k, v in params.items()]\n    return base + "?" + "&".join(pairs)\n\nprint(build_url("shop.com/items", sort="price", page=2))']},
  power:{can:['Accept arbitrary named options','Build flexible APIs'],
    expand:'Pass a dict into build_url with build_url("x.com", **opts).',
    where:'Web requests, configuration and logging libraries are driven by **kwargs.',
    next:'Next: the infamous mutable default argument trap.'},
  codex:{title:'**kwargs',body:'def f(**kw) collects extra named arguments into a dict. f(**d) unpacks a dict into names.',snip:R`def f(**options):
    for k, v in options.items(): ...`}
},
{
  id:'r6-21', realm:6, n:21, title:'The mutable default trap',
  teaches:['fn-mutdef'], requires:['fn-kwargs2','fn-pure'],
  story:`Ada points at a jar that keeps overflowing no matter how often she empties it. "Never put a *shared* jar in the instructions," she says. "Everyone who uses the recipe pours into the same one."`,
  concept:{
    html:`A default value is created **once**, when the function is defined, not each call. For a list or dict that means every call **shares** it:\n\n\`\`\`\ndef add_tag(tag, tags=[]):     # DANGER\n    tags.append(tag)\n    return tags\n\nadd_tag("a")    # ['a']\nadd_tag("b")    # ['a', 'b']   ← surprise!\n\`\`\`\n\n**The fix:** default to \`None\` and make a fresh list inside.\n\n\`\`\`\ndef add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    return tags + [tag]\n\`\`\`\n\nNumbers, text, \`True/False\` and \`None\` are safe defaults because they can't be changed in place.`,
    analogy:`A shared tip jar by the door, versus giving each customer their own cup.`,
    example:R`def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    return tags + [tag]

print(add_tag("a"))
print(add_tag("b"))`},
  predict:{code:R`def f(x, items=[]):
    items.append(x)
    return items

f(1)
print(f(2))`, q:'What prints?', opts:['[1, 2]','[2]','[1]'], ans:0, why:'The same default list is reused, so the 1 from the first call is still there.'},
  cast:{code:R`def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    return tags + [tag]

print(add_tag("a"))
print(add_tag("b"))`, task:'Cast it. Each call gets a fresh list.'},
  bug:{broken:R`def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags

print(add_tag("a"))
print(add_tag("b"))`, task:'The second call prints [\'a\', \'b\']. Use the None pattern so the output is [\'a\'] then [\'b\'].',
    cases:[{inputs:[],tests:[['Independent calls','lines==["[\'a\']","[\'b\']"]'],['No list default','"tags=[])" not in src.replace(" ","")']]}],
    sol:R`def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags

print(add_tag("a"))
print(add_tag("b"))`, wrong:[R`def add_tag(tag, tags=[]):
    tags.append(tag)
    return tags

print(add_tag("a"))
print(add_tag("b"))`]},
  write:{prompt:'Define `add_tag(tag, tags=None)` that returns a **new** list with the tag added (never modify the list passed in, never share a default). Print `add_tag("a")` and `add_tag("b")`.',
    starter:R`# define add_tag
`,
    cases:[{inputs:[],tests:[['Independent calls','lines==["[\'a\']","[\'b\']"]'],['Fresh each time','[g["add_tag"]("a"), g["add_tag"]("b")]==[["a"],["b"]]'],['Extends a given list without changing it','(lambda o: (g["add_tag"]("c",o)==["x","c"], o==["x"]))(["x"])==(True,True)'],['Uses None default','"tags=None" in src.replace(" ","")']]}],
    sol:R`def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    return tags + [tag]

print(add_tag("a"))
print(add_tag("b"))`,
    wrong:[R`def add_tag(tag, tags=None):
    if tags is None:
        tags = []
    tags.append(tag)
    return tags

print(add_tag("a"))
print(add_tag("b"))`, R`def add_tag(tag, tags=[]):
    return tags + [tag]

print(add_tag("a"))
print(add_tag("b"))`],
    hints:['Default tags to None.','Inside: if tags is None: tags = [].','Return tags + [tag] so the caller\'s list is untouched.','def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    return tags + [tag]\n\nprint(add_tag("a"))\nprint(add_tag("b"))']},
  power:{can:['Avoid one of Python\'s most famous gotchas','Use None as a "no value given" marker'],
    expand:'Fix a function with a mutable default dict (counts={}) the same way.',
    where:'This question appears in many interviews, and in real bugs that took days to find.',
    next:'Next: treating functions as values you can pass around.'},
  codex:{title:'Mutable defaults',body:'Never default a parameter to [] or {}. Use None and create the list inside.',snip:R`def f(x, items=None):
    if items is None:
        items = []`}
},
{
  id:'r6-22', realm:6, n:22, title:'Functions are values too',
  teaches:['fn-first-class'], requires:['fn-mutdef'],
  story:`"A hammer is a thing you can hand to someone," Ada says, passing you the hammer by its handle. "In Python a *function* is the same: a thing you can name, store and pass."`,
  concept:{
    html:`In Python, functions are **values**, just like numbers and text. You can pass them to other functions:\n\n\`\`\`\ndef double(n):\n    return n * 2\n\ndef apply_twice(func, x):\n    return func(func(x))\n\napply_twice(double, 3)    # double(double(3)) → 12\n\`\`\`\n\nNote: \`double\` (no brackets) is the function itself. \`double(3)\` **calls** it.\n\nYou've already done this: \`sorted(words, key=len)\` passes the function \`len\`.\n\nStore them in lists or dicts, too:\n\n\`\`\`\nops = [double, str, len]\n\`\`\``,
    analogy:`Handing someone a tool vs using the tool yourself.`,
    example:R`def double(n):
    return n * 2

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double, 3))
print(sorted(["fig", "apple"], key=len))`},
  predict:{code:R`def f(x):
    return x + 1

g = f
print(g(1))`, q:'What prints?', opts:['2','f','Error'], ans:0, why:'g is another name for the same function, so g(1) is f(1).'},
  cast:{code:R`def double(n):
    return n * 2

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double, 3))
print(sorted(["fig", "apple"], key=len))`, task:'Cast it.'},
  bug:{broken:R`def double(n):
    return n * 2

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double(), 3))`, task:'TypeError: double() CALLS it with no argument. Pass the function itself (no brackets). Expect 12.',
    cases:[{inputs:[],tests:[['Prints 12','out.strip()=="12"']]}],
    sol:R`def double(n):
    return n * 2

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double, 3))`, wrong:[R`def double(n):
    return n * 2

def apply_twice(func, x):
    return func(func(x))

print(apply_twice(double(), 3))`]},
  write:{prompt:'Define `apply_twice(func, x)` returning `func(func(x))`, and `add_ten(n)`. Print `apply_twice(add_ten, 5)` and `apply_twice(str.upper, "hi")`.',
    starter:R`# define apply_twice and add_ten
`,
    cases:[{inputs:[],tests:[['Printed','lines==["25","HI"]'],['With a lambda','g["apply_twice"](lambda n: n * 3, 2)==18'],['With len-ish','g["apply_twice"](lambda s: s + "!", "a")=="a!!"']]}],
    sol:R`def apply_twice(func, x):
    return func(func(x))

def add_ten(n):
    return n + 10

print(apply_twice(add_ten, 5))
print(apply_twice(str.upper, "hi"))`,
    wrong:[R`def apply_twice(func, x):
    return func(x)

def add_ten(n):
    return n + 10

print(apply_twice(add_ten, 5))
print(apply_twice(str.upper, "hi"))`, R`def apply_twice(func, x):
    return 25

def add_ten(n):
    return n + 10

print(apply_twice(add_ten, 5))
print("HI")`],
    hints:['apply_twice takes a function and a value.','Return func(func(x)).','add_ten(n) returns n + 10. Pass add_ten WITHOUT brackets.','def apply_twice(func, x):\n    return func(func(x))\n\ndef add_ten(n):\n    return n + 10\n\nprint(apply_twice(add_ten, 5))\nprint(apply_twice(str.upper, "hi"))']},
  power:{can:['Pass functions to functions','Tell func from func()'],
    expand:'Store three functions in a list and call each on the same value in a loop.',
    where:'Callbacks, sorting keys and event handlers all pass functions around.',
    next:'Next: lambda, tiny throwaway functions.'},
  codex:{title:'Functions as values',body:'f is the function. f() calls it. Pass f to other functions.',snip:R`apply_twice(double, 3)`}
},
{
  id:'r6-23', realm:6, n:23, title:'Lambda: tiny throwaway functions',
  teaches:['fn-lambda'], requires:['fn-first-class','sort-key'],
  story:`"Not every tool needs a name and a plaque," Ada says, snapping off a tiny wedge of metal and using it once. "Sometimes the job is so small you just make it on the spot."`,
  concept:{
    html:`A **lambda** is a one-line function with no name:\n\n\`\`\`\ndouble = lambda n: n * 2         # same as def double(n): return n * 2\n(lambda n: n * 2)(5)             # 10\n\`\`\`\n\nShape: \`lambda parameters: expression\`. The expression's value is returned automatically.\n\nTheir real home is as an argument:\n\n\`\`\`\nwords = ["pear", "fig", "apple", "kiwi"]\nsorted(words, key=lambda w: (len(w), w))     # sort by length, then A-Z\n\`\`\`\n\nA tuple key sorts by the first item, then ties by the second.\n\n**When to use def instead:** anything longer than one simple expression, or anything you use in several places.`,
    analogy:`A sticky note instead of a printed manual.`,
    example:R`words = ["pear", "fig", "apple", "kiwi", "date"]
print(sorted(words, key=lambda w: (len(w), w)))
print((lambda n: n * 2)(5))`},
  predict:{code:R`f = lambda a, b: a + b
print(f(2, 3))`, q:'What prints?', opts:['5','23','Error'], ans:0, why:'The lambda returns a + b.'},
  cast:{code:R`words = ["pear", "fig", "apple", "kiwi", "date"]
print(sorted(words, key=lambda w: (len(w), w)))
print((lambda n: n * 2)(5))`, task:'Cast it.'},
  bug:{broken:R`words = ["pear", "fig", "apple", "kiwi", "date"]
print(sorted(words, key=len))`, task:'Ties keep their old order: we want shortest first, and equal lengths in A-Z order. Expected [\'fig\', \'date\', \'kiwi\', \'pear\', \'apple\'].',
    cases:[{inputs:[],tests:[['Sorted by length then A-Z','lines==["[\'fig\', \'date\', \'kiwi\', \'pear\', \'apple\']"]'],['Uses lambda','"lambda" in src']]}],
    sol:R`words = ["pear", "fig", "apple", "kiwi", "date"]
print(sorted(words, key=lambda w: (len(w), w)))`, wrong:[R`words = ["pear", "fig", "apple", "kiwi", "date"]
print(sorted(words, key=len))`]},
  write:{prompt:'Sort `people` (tuples of name and age) **oldest first**, and equal ages by name A-Z. Print the list of names only.',
    starter:R`people = [("Cy", 30), ("Ada", 41), ("Bo", 30), ("Di", 25)]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[\'Ada\', \'Bo\', \'Cy\', \'Di\']"]'],['Uses lambda and sorted','"lambda" in src and "sorted(" in src']]}],
    sol:R`people = [("Cy", 30), ("Ada", 41), ("Bo", 30), ("Di", 25)]
ordered = sorted(people, key=lambda p: (-p[1], p[0]))
print([name for name, age in ordered])`,
    wrong:[R`people = [("Cy", 30), ("Ada", 41), ("Bo", 30), ("Di", 25)]
ordered = sorted(people, key=lambda p: p[1], reverse=True)
print([name for name, age in ordered])`, R`people = [("Cy", 30), ("Ada", 41), ("Bo", 30), ("Di", 25)]
print(["Ada", "Bo", "Cy", "Di"])`],
    hints:['key=lambda p: (-p[1], p[0]) sorts by age descending then name.','Negating the age flips the order for numbers.','Print just the names with a comprehension.','people = [("Cy", 30), ("Ada", 41), ("Bo", 30), ("Di", 25)]\nordered = sorted(people, key=lambda p: (-p[1], p[0]))\nprint([name for name, age in ordered])']},
  power:{can:['Write one-line throwaway functions','Sort by several fields at once'],
    expand:'Use max with a lambda to find the oldest person.',
    where:'Sort keys, quick callbacks and data pipelines use lambdas constantly.',
    next:'Next: map and filter, the functional pair.'},
  codex:{title:'lambda',body:'lambda args: expression is a nameless one-line function. A tuple key sorts by several fields.',snip:R`sorted(x, key=lambda w: (len(w), w))`}
},
{
  id:'r6-24', realm:6, n:24, title:'map and filter',
  teaches:['fn-map-filter'], requires:['fn-lambda','comp-if'],
  story:`"Two classic hammers," Ada says. "One reshapes every ingot. One throws out the flawed ones. Both take a *function* as the instruction."`,
  concept:{
    html:`\`map(func, items)\` applies a function to **every** item. \`filter(func, items)\` keeps items where the function returns True. Both are lazy, so wrap in \`list(...)\` to see results:\n\n\`\`\`\nnums = [1, 2, 3, 4]\nlist(map(lambda n: n * n, nums))          # [1, 4, 9, 16]\nlist(filter(lambda n: n % 2 == 0, nums))  # [2, 4]\nlist(map(str.upper, ["a", "b"]))          # ['A', 'B']\n\`\`\`\n\nThey equal comprehensions:\n\n\`\`\`\n[n * n for n in nums]\n[n for n in nums if n % 2 == 0]\n\`\`\`\n\n**Which to use?** Comprehensions are usually clearer. Use map/filter when you already have a named function to pass (\`map(str.upper, words)\`).`,
    analogy:`An assembly line: map reshapes each piece, filter rejects the bad ones.`,
    example:R`nums = [1, 2, 3, 4]
print(list(map(lambda n: n * n, nums)))
print(list(filter(lambda n: n % 2 == 0, nums)))
print(list(map(str.upper, ["a", "b"])))`},
  predict:{code:R`print(list(filter(lambda s: len(s) > 2, ["a", "abc", "xy", "hello"])))`, q:'What prints?', opts:["['abc', 'hello']","['a', 'xy']","[3, 5]"], ans:0, why:'filter keeps items for which the lambda is True.'},
  cast:{code:R`nums = [1, 2, 3, 4]
print(list(map(lambda n: n * n, nums)))
print(list(filter(lambda n: n % 2 == 0, nums)))
print(list(map(str.upper, ["a", "b"])))`, task:'Cast it.'},
  bug:{broken:R`nums = [1, 2, 3, 4]
print(map(lambda n: n * n, nums))`, task:'It prints a map object, not the values. Wrap it so the list [1, 4, 9, 16] prints.',
    cases:[{inputs:[],tests:[['Prints the list','lines==["[1, 4, 9, 16]"]']]}],
    sol:R`nums = [1, 2, 3, 4]
print(list(map(lambda n: n * n, nums)))`, wrong:[R`nums = [1, 2, 3, 4]
print(map(lambda n: n * n, nums))`]},
  write:{prompt:'From `nums`, use `filter` to keep the even numbers and `map` to square them. Print the resulting list.',
    starter:R`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["[4, 16, 36, 64, 100]"]'],['Uses map and filter','"map(" in src and "filter(" in src']]}],
    sol:R`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = list(map(lambda n: n * n, filter(lambda n: n % 2 == 0, nums)))
print(result)`,
    wrong:[R`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
print([n * n for n in nums if n % 2 == 0])`, R`nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
result = list(map(lambda n: n * n, nums))
print(result)`],
    hints:['filter first: filter(lambda n: n % 2 == 0, nums).','Then map(lambda n: n * n, ...) over the filtered result.','Wrap in list(...) and print.','nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nresult = list(map(lambda n: n * n, filter(lambda n: n % 2 == 0, nums)))\nprint(result)']},
  power:{can:['Read and write map/filter pipelines','Choose between them and comprehensions'],
    expand:'Rewrite your result as a comprehension and compare readability.',
    where:'You will meet map/filter in older code and in data libraries.',
    next:'Next: any() and all(), instant yes/no over a whole list.'},
  codex:{title:'map and filter',body:'map(f, items) transforms all, filter(f, items) keeps matches. Wrap in list().',snip:R`list(map(lambda n: n * n, nums))`}
},
{
  id:'r6-25', realm:6, n:25, title:'any() and all()',
  teaches:['fn-any-all'], requires:['fn-map-filter'],
  story:`"Does *any* ingot crack? Are *all* of them sound?" Ada runs her hand along the rack. "Two questions so common that Python answers them in one word each."`,
  concept:{
    html:`\`any(...)\` is True if **at least one** item is true. \`all(...)\` is True only if **every** item is true:\n\n\`\`\`\nnums = [3, 8, 12]\nany(n > 10 for n in nums)    # True (12)\nall(n > 10 for n in nums)    # False\n\`\`\`\n\nThe \`n > 10 for n in nums\` part looks like a comprehension without brackets. It produces True/False for each item.\n\nUseful for validation:\n\n\`\`\`\nany(ch.isdigit() for ch in password)\nall(ch.isalpha() for ch in name)\n\`\`\`\n\nEmpty list: \`any([])\` is False, \`all([])\` is True.`,
    analogy:`"Is anyone here?" vs "Is everyone here?"`,
    example:R`nums = [3, 8, 12]
print(any(n > 10 for n in nums))
print(all(n > 10 for n in nums))
print(any(ch.isdigit() for ch in "abc1"))`},
  predict:{code:R`print(all(n > 0 for n in [1, 2, -3]))`, q:'What prints?', opts:['False','True','-3'], ans:0, why:'-3 is not positive, so not all are.'},
  cast:{code:R`nums = [3, 8, 12]
print(any(n > 10 for n in nums))
print(all(n > 10 for n in nums))
print(any(ch.isdigit() for ch in "abc1"))`, task:'Cast it.'},
  bug:{broken:R`def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
        else:
            return False

print(has_digit("a1"))`, task:'It returns False for "a1": it gives up after the first letter. Use any() instead.',
    cases:[{inputs:[],tests:[['Prints True','out.strip()=="True"'],['Uses any','"any(" in src']]}],
    sol:R`def has_digit(text):
    return any(ch.isdigit() for ch in text)

print(has_digit("a1"))`, wrong:[R`def has_digit(text):
    for ch in text:
        if ch.isdigit():
            return True
        else:
            return False

print(has_digit("a1"))`]},
  write:{prompt:'Define `is_valid_password(pw)`: at least 8 characters, and it contains a digit, an uppercase letter **and** a lowercase letter. Use `any()` for the three character checks. Print `is_valid_password("Abcdef12")`.',
    starter:R`# define is_valid_password
`,
    cases:[{inputs:[],tests:[['Prints True','lines==["True"]'],['No uppercase','g["is_valid_password"]("abcdefg1") is False'],['No lowercase','g["is_valid_password"]("ABCDEFG1") is False'],['No digit','g["is_valid_password"]("Abcdefgh") is False'],['Too short','g["is_valid_password"]("Ab1") is False'],['Good one','g["is_valid_password"]("xYz98765") is True'],['Uses any three times','src.count("any(")>=3']]}],
    sol:R`def is_valid_password(pw):
    return (len(pw) >= 8
            and any(c.isdigit() for c in pw)
            and any(c.isupper() for c in pw)
            and any(c.islower() for c in pw))

print(is_valid_password("Abcdef12"))`,
    wrong:[R`def is_valid_password(pw):
    return len(pw) >= 8 and any(c.isdigit() for c in pw) and any(c.isupper() for c in pw)

print(is_valid_password("Abcdef12"))`, R`def is_valid_password(pw):
    return True

print(is_valid_password("Abcdef12"))`],
    hints:['Four rules joined with and.','any(c.isdigit() for c in pw), same with isupper and islower.','Check len(pw) >= 8 too.','def is_valid_password(pw):\n    return (len(pw) >= 8\n            and any(c.isdigit() for c in pw)\n            and any(c.isupper() for c in pw)\n            and any(c.islower() for c in pw))\n\nprint(is_valid_password("Abcdef12"))']},
  power:{can:['Validate with one-line rules','Replace flag-variable loops with any/all'],
    expand:'Add a rule requiring at least one symbol from "!@#$%".',
    where:'Password rules, form validation and data checks all use any/all.',
    next:'Next: how to break a big problem into helper functions.'},
  codex:{title:'any and all',body:'any(cond for x in items): at least one. all(...): every one.',snip:R`any(c.isdigit() for c in pw)`}
},
{
  id:'r6-26', realm:6, n:26, title:'Decomposition: break the problem down',
  teaches:['fn-decompose'], requires:['fn-any-all','word-stats'],
  story:`"The biggest spells aren't hard," Ada says, laying out a sword in pieces. "They're just *many small ones* in the right order. Never forge it all at once."`,
  concept:{
    html:`**Decomposition**: split a big problem into small functions, each with one job.\n\nProblem: *"Report the number of words and the most common word in a sentence."*\n\n\`\`\`\ndef clean(text):\n    """Lowercase, drop punctuation, tidy spaces."""\n\ndef count_words(text):\n    """How many words?"""\n\ndef top_word(words):\n    """Most common word (first wins ties)."""\n\ndef main():\n    text = clean(input("Sentence: "))\n    ...\n\`\`\`\n\nWork in this order:\n1. Write the **function names and docstrings** first.\n2. Fill them **one at a time**, testing each.\n3. Last, wire them together in \`main()\`.\n\nEach piece is small enough to hold in your head.`,
    analogy:`Building with LEGO: small bricks, clear instructions, a big model.`,
    example:R`import re

def clean(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return " ".join(text.split())

print(clean("  Hi, THERE!  "))`},
  predict:{code:R`def clean(t):
    return " ".join(t.lower().split())

print(clean("  A   B "))`, q:'What prints?', opts:['a b','A B','a   b'], ans:0, why:'Lowercase, split on any whitespace, join with single spaces.'},
  cast:{code:R`import re

def clean(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return " ".join(text.split())

print(clean("  Hi, THERE!  "))`, task:'Cast it. One helper of the pipeline.'},
  bug:{broken:R`def clean(text):
    return text.lower()

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) > words.count(best):
            best = w
    return best

print(top_word(clean("the cat and the hat").split()))`, task:'This works. Now add a main() that does the whole job: change the last line to call main(), which prints the top word. (It must still print "the".)',
    cases:[{inputs:[],tests:[['Prints the','out.strip()=="the"'],['main exists and is called','callable(g.get("main")) and "main()" in src.split("def main")[1]'],['main called at the bottom','src.strip().endswith("main()")']]}],
    sol:R`def clean(text):
    return text.lower()

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) > words.count(best):
            best = w
    return best

def main():
    print(top_word(clean("the cat and the hat").split()))

main()`, wrong:[R`def clean(text):
    return text.lower()

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) > words.count(best):
            best = w
    return best

print(top_word(clean("the cat and the hat").split()))`]},
  write:{prompt:'Decompose it: define `clean(text)` (lowercase, remove everything except letters, digits and spaces, tidy spaces), `top_word(words)` (most common word, first wins a tie, `None` if empty) and `main()`. `main()` asks `Sentence: ` and prints `Words: n` and `Top: w`. Call `main()`.',
    starter:R`import re
`,
    inputs:['The cat and THE hat!'],
    cases:[{inputs:['The cat and THE hat!'],tests:[['Report','lines[-2:]==["Words: 5","Top: the"]'],['clean works','g["clean"]("  Hi, THERE! ")=="hi there"'],['top_word ties','g["top_word"](["b","a","b","a"])=="b"'],['top_word empty','g["top_word"]([]) is None']]},{inputs:['one'],tests:[['Single word','lines[-2:]==["Words: 1","Top: one"]']]},{inputs:['a, b; a?'],tests:[['Punctuation','lines[-2:]==["Words: 3","Top: a"]']]}],
    sol:R`import re

def clean(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return " ".join(text.split())

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) > words.count(best):
            best = w
    return best

def main():
    words = clean(input("Sentence: ")).split()
    print("Words:", len(words))
    print("Top:", top_word(words))

main()`,
    wrong:[R`import re

def clean(text):
    return text.lower()

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) > words.count(best):
            best = w
    return best

def main():
    words = clean(input("Sentence: ")).split()
    print("Words:", len(words))
    print("Top:", top_word(words))

main()`, R`import re

def clean(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return " ".join(text.split())

def top_word(words):
    best = None
    for w in words:
        if best is None or words.count(w) >= words.count(best):
            best = w
    return best

def main():
    words = clean(input("Sentence: ")).split()
    print("Words:", len(words))
    print("Top:", top_word(words))

main()`],
    hints:['clean: re.sub(r"[^a-z0-9\\s]", "", text.lower()) then " ".join(text.split()).','top_word: keep best; replace it only when words.count(w) is strictly bigger.','main: words = clean(input(...)).split(), print the two lines, then call main().','import re\n\ndef clean(text):\n    text = re.sub(r"[^a-z0-9\\s]", "", text.lower())\n    return " ".join(text.split())\n\ndef top_word(words):\n    best = None\n    for w in words:\n        if best is None or words.count(w) > words.count(best):\n            best = w\n    return best\n\ndef main():\n    words = clean(input("Sentence: ")).split()\n    print("Words:", len(words))\n    print("Top:", top_word(words))\n\nmain()']},
  power:{can:['Split a program into helper functions','Write main() to wire the pieces together'],
    expand:'Add a longest_word(words) helper and report it too, changing only main() and one new function.',
    where:'This is how every real program from a script to a web service is organised.',
    next:'Next: prove your functions work with assert.'},
  codex:{title:'Decomposition',body:'Name the small jobs first, fill each, test each, then wire them in main().',snip:R`def main():
    ...
main()`}
},
{
  id:'r6-27', realm:6, n:27, title:'assert: tests that shout when wrong',
  teaches:['fn-assert'], requires:['fn-decompose'],
  story:`"I never trust a blade until I strike it," Ada says, hitting a sword against the anvil. "Programmers do it with **tests**. If the ring is wrong, they know at once."`,
  concept:{
    html:`\`assert condition\` does nothing if the condition is True, and raises \`AssertionError\` if it is False:\n\n\`\`\`\ndef is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nassert is_leap(2000) == True\nassert is_leap(1900) == False\nassert is_leap(2024) == True\nassert is_leap(2023) == False\nprint("All tests passed")\n\`\`\`\n\nAdd a message to explain failures: \`assert is_leap(1900) == False, "1900 is not a leap year"\`.\n\n**What to test:** a normal case, the edges (0, empty, the boundary), and a case that once broke. A function is only as trustworthy as its tests.`,
    analogy:`A smoke alarm: silent when fine, loud when not.`,
    example:R`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

assert is_leap(2000) == True
assert is_leap(1900) == False
print("All tests passed")`},
  predict:{code:R`assert 1 + 1 == 3, "maths is broken"`, q:'What happens?', opts:['AssertionError with the message','Nothing','It prints False'], ans:0, why:'A false assert raises AssertionError and shows the message.'},
  cast:{code:R`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

assert is_leap(2000) == True
assert is_leap(1900) == False
print("All tests passed")`, task:'Cast it.'},
  bug:{broken:R`def is_leap(year):
    return year % 4 == 0

assert is_leap(2000) == True
assert is_leap(1900) == False
print("All tests passed")`, task:'The assert caught a bug: 1900 is divisible by 4 but not a leap year. Fix is_leap so all tests pass.',
    cases:[{inputs:[],tests:[['Passes','out.strip()=="All tests passed"']]}],
    sol:R`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

assert is_leap(2000) == True
assert is_leap(1900) == False
print("All tests passed")`, wrong:[R`def is_leap(year):
    return year % 4 == 0

assert is_leap(2000) == True
assert is_leap(1900) == False
print("All tests passed")`]},
  write:{prompt:'Define `is_leap(year)` (divisible by 4, except centuries, except every 400 years). Add at least **four `assert` lines** covering 2000, 1900, 2024 and 2023, then print `All tests passed`.',
    starter:R`# define is_leap, then assert
`,
    cases:[{inputs:[],tests:[['Printed','lines==["All tests passed"]'],['Correct','[g["is_leap"](y) for y in (2000,1900,2024,2023,2100,1996)]==[True,False,True,False,False,True]'],['At least 4 asserts','src.count("assert ")>=4']]}],
    sol:R`def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

assert is_leap(2000) == True
assert is_leap(1900) == False
assert is_leap(2024) == True
assert is_leap(2023) == False
print("All tests passed")`,
    wrong:[R`def is_leap(year):
    return year % 4 == 0

print("All tests passed")`, R`def is_leap(year):
    return year % 4 == 0 and year % 100 != 0

assert is_leap(1900) == False
assert is_leap(2023) == False
assert is_leap(2024) == True
assert is_leap(1996) == True
print("All tests passed")`],
    hints:['Leap: divisible by 4 AND (not divisible by 100 OR divisible by 400).','return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)','Write four asserts for 2000, 1900, 2024, 2023.','def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nassert is_leap(2000) == True\nassert is_leap(1900) == False\nassert is_leap(2024) == True\nassert is_leap(2023) == False\nprint("All tests passed")']},
  power:{can:['Write simple automatic tests','Catch bugs the moment they appear'],
    expand:'Write asserts for is_prime from earlier, including 0, 1 and 2.',
    where:'Automated tests are what lets teams change code without fear.',
    next:'Next: table-driven tests - many cases, one loop.'},
  codex:{title:'assert',body:'assert cond, "message" raises AssertionError if cond is False. Test normal cases and edges.',snip:R`assert is_leap(1900) == False`}
}
);
