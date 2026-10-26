// REALM 7 — THE WARDS — part D (lessons 27-28: boss and gap check)
LESSONS.push(
{
  id:'r7-27', realm:7, n:27, title:'Boss: The Mirror Warden', kind:'boss',
  teaches:['realm7-boss'], requires:['mission7c'],
  story:`Every mirror in the hall turns to face you. From the glass steps the **Mirror Warden**: a tall figure made of reflections of your own mistakes, each one calling itself again and again. "You can recurse," it whispers, "and you can catch. **But can you do both when it counts?**"`,
  boss:{name:'The Mirror Warden', hp:5},
  phases:[
    {type:'mcq', code:R`def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)

print(f(3))`, q:'Strike 1: What prints?', opts:['6','3','0'], ans:0,
     why:'f(3) = 3 + f(2) = 3 + 2 + f(1) = 3 + 2 + 1 + f(0) = 6.', tags:['r7-02','r7-03']},
    {type:'write', prompt:'Strike 2: Ask `Items: ` (comma-separated). Add up every item that is a whole number (negatives allowed, spaces allowed). Skip the rest. Print `Skipped: n` then `Total: t`.',
     starter:R`items = input("Items: ").split(",")
`,
     inputs:['4,x,5,,7'],
     cases:[{inputs:['4,x,5,,7'],tests:[['Mixed','lines[-2:]==["Skipped: 2","Total: 16"]']]},{inputs:['1,2'],tests:[['Clean','lines[-2:]==["Skipped: 0","Total: 3"]']]},{inputs:['-3, 8 ,2.5'],tests:[['Negative and decimal','lines[-2:]==["Skipped: 1","Total: 5"]']]},{inputs:['a,b'],tests:[['All bad','lines[-2:]==["Skipped: 2","Total: 0"]']]}],
     sol:R`items = input("Items: ").split(",")
total = 0
skipped = 0
for item in items:
    try:
        total += int(item)
    except ValueError:
        skipped += 1
print("Skipped:", skipped)
print("Total:", total)`,
     wrong:[R`items = input("Items: ").split(",")
total = 0
skipped = 0
for item in items:
    if item.isdigit():
        total += int(item)
    else:
        skipped += 1
print("Skipped:", skipped)
print("Total:", total)`, R`items = input("Items: ").split(",")
total = 0
skipped = 0
try:
    for item in items:
        total += int(item)
except ValueError:
    skipped += 1
print("Skipped:", skipped)
print("Total:", total)`],
     hints:['Loop over the items with a counter for total and one for skipped.','Inside the loop: try: total += int(item). except ValueError: skipped += 1.','Print Skipped first, then Total.','items = input("Items: ").split(",")\ntotal = 0\nskipped = 0\nfor item in items:\n    try:\n        total += int(item)\n    except ValueError:\n        skipped += 1\nprint("Skipped:", skipped)\nprint("Total:", total)'], tags:['r7-10','r7-18']},
    {type:'mcq', code:R`try:
    print("a")
    int("x")
    print("b")
except ValueError:
    print("c")
else:
    print("d")
finally:
    print("e")`, q:'Strike 3: What prints (in order)?', opts:['a c e','a b d e','a c d e'], ans:0,
     why:'"a" prints, int("x") raises, "b" is skipped, except prints "c", else is skipped (there was an error), finally prints "e".', tags:['r7-12']},
    {type:'write', prompt:'Strike 4: Define a **recursive** `sum_digits(n)` for a whole number 0 or more (`sum_digits(2024)` is 8). Ask `N: `, print `Digit sum: <result>`.',
     starter:R`# define recursive sum_digits
n = int(input("N: "))
`,
     inputs:['2024'],
     cases:[{inputs:['2024'],tests:[['2024','lines[-1]=="Digit sum: 8"'],['Is recursive','"sum_digits(" in src.split("def sum_digits")[1].split("\\n",1)[1].split("\\nn = ")[0]']]},{inputs:['7'],tests:[['Single digit','lines[-1]=="Digit sum: 7"']]},{inputs:['999'],tests:[['999','lines[-1]=="Digit sum: 27"']]},{inputs:['0'],tests:[['Zero','lines[-1]=="Digit sum: 0"'],['Direct','g["sum_digits"](505)==10']]}],
     sol:R`def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(n // 10)

n = int(input("N: "))
print("Digit sum:", sum_digits(n))`,
     wrong:[R`def sum_digits(n):
    return sum(int(d) for d in str(n))

n = int(input("N: "))
print("Digit sum:", sum_digits(n))`, R`def sum_digits(n):
    total = 0
    while n > 0:
        total += n % 10
        n //= 10
    return total

n = int(input("N: "))
print("Digit sum:", sum_digits(n))`],
     hints:['Base case: a number below 10 is its own digit sum.','The last digit is n % 10. The rest is n // 10.','Return the last digit plus sum_digits of the rest.','def sum_digits(n):\n    if n < 10:\n        return n\n    return n % 10 + sum_digits(n // 10)\n\nn = int(input("N: "))\nprint("Digit sum:", sum_digits(n))'], tags:['r7-03','r7-05']},
    {type:'mcq', code:R`try:
    [1, 2][5]
except Exception as e:
    print(type(e).__name__)`, q:'Strike 5: What prints?', opts:['IndexError','KeyError','ValueError'], ans:0,
     why:'Indexing a list past its end raises IndexError.', tags:['r7-17']}
  ],
  power:{can:['Combine recursion, validation and exception handling','Read code and predict its flow, even through errors'],
    expand:'Rebuild strike 2 as a function that returns (total, skipped), with a docstring and asserts.',
    where:'Robust parsing and recursive structures are everywhere: configs, files, APIs, compilers.',
    next:'One more gate: the Gap Check for the Wards.'},
  codex:{title:'Realm 7 boss',body:'You can write recursive functions with base cases, and handle failures with try / except / else / finally and raise.',snip:R`try: ...
except ValueError: ...
else: ...
finally: ...`}
},
{
  id:'r7-28', realm:7, n:28, title:'Gap Check: the Ward Trial', kind:'gap', passPct:80,
  teaches:['realm7-gap'], requires:['realm7-boss'],
  story:`The glass shatters into a thousand small reflections, each one showing a version of you who finished the trial. Hopper smiles. "Eighty percent. Then the Archive opens: **files, modules and real data**."`,
  phases:[
    {type:'mcq', code:R`def f(n):
    if n == 0:
        return "done"
    return f(n - 1)

print(f(2))`, q:'What prints?', opts:['done','2','None'], ans:0, why:'f(2) calls f(1), which calls f(0), which returns "done"; each level passes it back.', tags:['r7-01','r7-02']},
    {type:'mcq', code:R`def fact(n):
    if n <= 1:
        return 1
    return n * fact(n - 1)

print(fact(4))`, q:'What prints?', opts:['24','10','4'], ans:0, why:'4 * 3 * 2 * 1 = 24.', tags:['r7-03']},
    {type:'mcq', code:R`cache = {}
def sq(n):
    if n in cache:
        return cache[n]
    cache[n] = n * n
    return cache[n]

sq(3)
sq(3)
print(len(cache))`, q:'What prints?', opts:['1','2','0'], ans:0, why:'The second call finds 3 in the cache and adds nothing.', tags:['r7-07']},
    {type:'mcq', code:R`def depth(x):
    if not isinstance(x, list):
        return 0
    return 1 + max([depth(i) for i in x], default=0)

print(depth([1, [2]]))`, q:'What prints?', opts:['2','1','3'], ans:0, why:'The outer list adds 1, and the inner list [2] adds 1 more.', tags:['r7-09']},
    {type:'mcq', code:R`try:
    print("start")
    print(1 / 0)
except ZeroDivisionError:
    print("oops")
print("end")`, q:'What prints (in order)?', opts:['start oops end','start end','start oops'], ans:0, why:'The error jumps to except, then the program carries on to "end".', tags:['r7-10']},
    {type:'mcq', code:R`try:
    int("x")
except ZeroDivisionError:
    print("zero")
print("after")`, q:'What happens?', opts:['A ValueError crashes the program','zero then after','after'], ans:0, why:'The except only catches ZeroDivisionError. int("x") raises ValueError, which nothing catches.', tags:['r7-11']},
    {type:'mcq', code:R`try:
    x = 1
except ValueError:
    print("E")
else:
    print("else")
finally:
    print("fin")`, q:'What prints?', opts:['else fin','E fin','fin'], ans:0, why:'No error: else runs, then finally always runs.', tags:['r7-12']},
    {type:'mcq', code:R`def f(x):
    if x < 0:
        raise ValueError("negative")
    return x

try:
    f(-1)
except ValueError as e:
    print(e)`, q:'What prints?', opts:['negative','-1','ValueError'], ans:0, why:'print(e) shows the message passed to ValueError.', tags:['r7-13']},
    {type:'mcq', code:R`d = {"a": 1}
try:
    print(d["b"])
except KeyError:
    print("missing")`, q:'What prints?', opts:['missing','None','1'], ans:0, why:'Looking up a missing key raises KeyError, which is caught.', tags:['r7-15']},
    {type:'mcq', q:'When reading a Python traceback, where do you look first to learn WHAT went wrong?', opts:['The last line','The first line','The line in the middle'], ans:0, why:'The final line holds the error type and message. The frames above show where it happened and how the program got there.', tags:['r7-18']},
    {type:'write', pts:2, prompt:'Final trial: define `to_int(text, default=0)` that returns `int(text)`, or `default` if the text is not a whole number. Use `try/except ValueError`. Then print `to_int("42")`, `to_int("x")`, `to_int("x", -1)`, `to_int(" 7 ")` and `to_int("3.5")`.',
     starter:R`# define to_int, then print five results
`,
     cases:[{inputs:[],tests:[['Printed','lines==["42","0","-1","7","0"]'],['Negative','g["to_int"]("-5")==-5'],['Empty','g["to_int"]("")==0'],['Custom default','g["to_int"]("q", None) is None'],['Uses try','"try:" in src and "except ValueError" in src']]}],
     sol:R`def to_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default

print(to_int("42"))
print(to_int("x"))
print(to_int("x", -1))
print(to_int(" 7 "))
print(to_int("3.5"))`,
     wrong:[R`def to_int(text, default=0):
    if text.isdigit():
        return int(text)
    return default

print(to_int("42"))
print(to_int("x"))
print(to_int("x", -1))
print(to_int(" 7 "))
print(to_int("3.5"))`, R`def to_int(text, default=0):
    return int(text)

print(to_int("42"))
print(to_int("x"))
print(to_int("x", -1))
print(to_int(" 7 "))
print(to_int("3.5"))`],
     hints:['Put return int(text) inside a try block.','except ValueError: return default.','Call it five times, one print each.','def to_int(text, default=0):\n    try:\n        return int(text)\n    except ValueError:\n        return default\n\nprint(to_int("42"))\nprint(to_int("x"))\nprint(to_int("x", -1))\nprint(to_int(" 7 "))\nprint(to_int("3.5"))'], tags:['r7-10','r7-16']}
  ],
  power:{can:['Trace recursive calls and spot base cases','Predict try / except / else / finally flow','Raise and catch errors with confidence'],
    expand:'Pick the question you missed and write a similar one yourself.',
    where:'Recursion and error handling are what separate scripts from real software.',
    next:'Next stage: the Archive, where programs read and write files.'},
  codex:{title:'Realm 7 gap check',body:'Recursion: base case plus smaller problem. Errors: try, except, else, finally, raise.',snip:R`def to_int(text, default=0):
    try:
        return int(text)
    except ValueError:
        return default`}
}
);
