// REALM 7 — THE WARDS — part C (lessons 19-26)
LESSONS.push(
{
  id:'r7-19', realm:7, n:19, title:'Retry, but not forever',
  teaches:['err-retry'], requires:['err-traceback'],
  story:`"A ward that retries forever is a trap for the keeper too," Hopper says. "Give every retry a **limit**, and decide what happens when it runs out."`,
  concept:{
    html:`An unlimited \`while True\` retry can lock a program (or a user) in forever. Add a **counter**:\n\n\`\`\`\ndef ask_int(prompt, tries=3):\n    for attempt in range(tries):\n        text = input(prompt)\n        try:\n            return int(text)\n        except ValueError:\n            print("Invalid")\n    return None          # ran out of tries\n\`\`\`\n\nThe caller then handles the "gave up" case:\n\n\`\`\`\nn = ask_int("Number: ")\nif n is None:\n    print("Giving up")\nelse:\n    print("Got", n)\n\`\`\`\n\nReal systems do this with networks too: try 3 times, wait a little longer each time, then report failure.`,
    analogy:`Three attempts at a lock before the alarm sounds.`,
    example:R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")
    return None

n = ask_int("Number: ")
print("Got", n)`},
  predict:{code:R`def f():
    for i in range(3):
        if i == 5:
            return "found"
    return None

print(f())`, q:'What prints?', opts:['None','found','Error'], ans:0, why:'The loop ends without returning, so the final return None runs.'},
  cast:{code:R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")
    return None

n = ask_int("Number: ")
print("Got", n)`, task:'Cast it with inputs: a, b, 7.', inputs:['a','b','7']},
  bug:{broken:R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")

n = ask_int("Number: ")
if n is None:
    print("Giving up")
else:
    print("Got", n)`, task:'This is fine, but the last line prints Got instead of Giving up when tries run out? Run it with the three bad inputs and see; then make the function return None explicitly.',
    cases:[{inputs:['a','b','c'],tests:[['Gives up','lines[-1]=="Giving up"'],['Explicit return None','"return None" in src']]}],
    sol:R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")
    return None

n = ask_int("Number: ")
if n is None:
    print("Giving up")
else:
    print("Got", n)`, wrong:[R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")

n = ask_int("Number: ")
if n is None:
    print("Giving up")
else:
    print("Got", n)`]},
  write:{prompt:'Write `ask_int(prompt, tries=3)`: ask up to `tries` times, printing `Invalid` after each bad answer; return the int, or `None` if every try failed. Then `n = ask_int("Number: ")` and print `Got <n>` or `Giving up`.',
    starter:R`# define ask_int, then use it
`,
    inputs:['a','b','7'],
    cases:[{inputs:['a','b','7'],tests:[['Success on 3rd','[l for l in lines if not l.startswith("Number: ")]==["Invalid","Invalid","Got 7"]']]},{inputs:['a','b','c'],tests:[['Gives up','[l for l in lines if not l.startswith("Number: ")]==["Invalid","Invalid","Invalid","Giving up"]']]},{inputs:['5'],tests:[['First time','lines[-1]=="Got 5" and "Invalid" not in lines']]},{inputs:['x','x','x','9'],tests:[['Limit respected','lines[-1]=="Giving up"']]},{inputs:['-2'],tests:[['Negative','lines[-1]=="Got -2"']]}],
    sol:R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")
    return None

n = ask_int("Number: ")
if n is None:
    print("Giving up")
else:
    print("Got", n)`,
    wrong:[R`def ask_int(prompt, tries=3):
    while True:
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")

n = ask_int("Number: ")
print("Got", n)`, R`def ask_int(prompt, tries=3):
    for attempt in range(tries):
        text = input(prompt)
        try:
            return int(text)
        except ValueError:
            print("Invalid")
    return 0

n = ask_int("Number: ")
if n is None:
    print("Giving up")
else:
    print("Got", n)`],
    hints:['for attempt in range(tries): ask, then try: return int(text).','except ValueError: print("Invalid"). After the loop: return None.','Caller: if n is None → Giving up, else Got n.','def ask_int(prompt, tries=3):\n    for attempt in range(tries):\n        text = input(prompt)\n        try:\n            return int(text)\n        except ValueError:\n            print("Invalid")\n    return None\n\nn = ask_int("Number: ")\nif n is None:\n    print("Giving up")\nelse:\n    print("Got", n)']},
  power:{can:['Retry safely with a limit','Return None to mean "gave up" and handle it'],
    expand:'Add a wait (time.sleep) that doubles after each failure.',
    where:'API clients, downloaders and database drivers all retry with limits.',
    next:'Next: defending your functions against bad input.'},
  codex:{title:'Limited retry',body:'for attempt in range(tries): try; return on success. Return None when out of tries.',snip:R`for attempt in range(tries):
    try: return int(text)
    except ValueError: ...
return None`}
},
{
  id:'r7-20', realm:7, n:20, title:'Defensive functions',
  teaches:['err-defensive'], requires:['err-retry'],
  story:`"Trust no input," Hopper says, bolting a plate over a hatch. "A defensive function checks its **preconditions** at the door and refuses nonsense with a clear message."`,
  concept:{
    html:`A **precondition** is something that must be true before a function can do its job. Check it first and \`raise\`:\n\n\`\`\`\ndef mean(nums):\n    if len(nums) == 0:\n        raise ValueError("No numbers")\n    for n in nums:\n        if not isinstance(n, (int, float)):\n            raise TypeError("Numbers only")\n    return sum(nums) / len(nums)\n\`\`\`\n\n- Fail **early** and **loudly**, near the cause.\n- \`isinstance(x, (int, float))\` checks a value's type.\n- Use \`raise\` for bad **input from outside**. Use \`assert\` for things that should *never* happen if your own code is right: \`assert total >= 0\`.\n\nDon't catch the error inside the same function that raises it: let the **caller** decide what to do.`,
    analogy:`A bouncer at the door instead of a medic at the party.`,
    example:R`def mean(nums):
    if len(nums) == 0:
        raise ValueError("No numbers")
    for n in nums:
        if not isinstance(n, (int, float)):
            raise TypeError("Numbers only")
    return sum(nums) / len(nums)

print(mean([2, 4, 9]))`},
  predict:{code:R`print(isinstance(5, (int, float)), isinstance("5", (int, float)))`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'5 is an int; "5" is a string.'},
  cast:{code:R`def mean(nums):
    if len(nums) == 0:
        raise ValueError("No numbers")
    for n in nums:
        if not isinstance(n, (int, float)):
            raise TypeError("Numbers only")
    return sum(nums) / len(nums)

print(mean([2, 4, 9]))`, task:'Cast it. Then call mean([]).'},
  bug:{broken:R`def mean(nums):
    return sum(nums) / len(nums)

try:
    print(mean([]))
except ValueError as e:
    print("Error:", e)`, task:'An empty list gives ZeroDivisionError, which is not caught and is unclear. Make mean raise ValueError("No numbers") itself.',
    cases:[{inputs:[],tests:[['Clear message','lines==["Error: No numbers"]']]}],
    sol:R`def mean(nums):
    if len(nums) == 0:
        raise ValueError("No numbers")
    return sum(nums) / len(nums)

try:
    print(mean([]))
except ValueError as e:
    print("Error:", e)`, wrong:[R`def mean(nums):
    return sum(nums) / len(nums)

try:
    print(mean([]))
except ValueError as e:
    print("Error:", e)`]},
  write:{prompt:'Write `mean(nums)` that raises `ValueError("No numbers")` for an empty list and `TypeError("Numbers only")` if any item is not an int or float. Then print `mean([2, 4, 9])`, and catch the errors for `[]` and `[1, "a"]`, printing `Error: <message>`.',
    starter:R`# define mean, then try three lists
`,
    cases:[{inputs:[],tests:[['Printed','lines==["5.0","Error: No numbers","Error: Numbers only"]'],['Plain','g["mean"]([1,2])==1.5'],['Float items','g["mean"]([0.5,1.5])==1.0'],['Raises ValueError','__import__("unittest").TestCase().assertRaises(ValueError, g["mean"], []) is None'],['Raises TypeError','__import__("unittest").TestCase().assertRaises(TypeError, g["mean"], [1,"2"]) is None'],['Uses isinstance','"isinstance" in src']]}],
    sol:R`def mean(nums):
    if len(nums) == 0:
        raise ValueError("No numbers")
    for n in nums:
        if not isinstance(n, (int, float)):
            raise TypeError("Numbers only")
    return sum(nums) / len(nums)

print(mean([2, 4, 9]))
for data in ([], [1, "a"]):
    try:
        print(mean(data))
    except (ValueError, TypeError) as e:
        print("Error:", e)`,
    wrong:[R`def mean(nums):
    if len(nums) == 0:
        return None
    return sum(nums) / len(nums)

print(mean([2, 4, 9]))
print("Error: No numbers")
print("Error: Numbers only")`, R`def mean(nums):
    try:
        return sum(nums) / len(nums)
    except Exception as e:
        print("Error:", e)

print(mean([2, 4, 9]))
mean([])
mean([1, "a"])`],
    hints:['First line of mean: if len(nums) == 0: raise ValueError("No numbers").','Loop the items: if not isinstance(n, (int, float)): raise TypeError("Numbers only").','Callers use except (ValueError, TypeError) as e.','def mean(nums):\n    if len(nums) == 0:\n        raise ValueError("No numbers")\n    for n in nums:\n        if not isinstance(n, (int, float)):\n            raise TypeError("Numbers only")\n    return sum(nums) / len(nums)\n\nprint(mean([2, 4, 9]))\nfor data in ([], [1, "a"]):\n    try:\n        print(mean(data))\n    except (ValueError, TypeError) as e:\n        print("Error:", e)']},
  power:{can:['Check preconditions at the top of a function','Fail early with a precise message'],
    expand:'Add an assert that the result is within min and max of the list.',
    where:'Library authors write these checks in nearly every public function.',
    next:'Next: a method for hunting bugs.'},
  codex:{title:'Defensive code',body:'Check preconditions first and raise clear errors. Let callers decide what to do. isinstance checks types.',snip:R`if not isinstance(n, (int, float)):
    raise TypeError("Numbers only")`}
},
{
  id:'r7-21', realm:7, n:21, title:'Hunting bugs with a method',
  teaches:['dbg-strategy'], requires:['err-defensive'],
  story:`Hopper leans over your shoulder. "Beginners change code at random until it works. Wardens work like **detectives**: reproduce, isolate, look at the actual values, then fix."`,
  concept:{
    html:`A reliable debugging routine:\n\n1. **Reproduce**: find a small input that fails every time.\n2. **Predict**: say what the code *should* give.\n3. **Look**: \`print\` the real values in the middle (\`print("DEBUG", x)\`).\n4. **Find** the first place reality differs from your prediction. The bug is just before it.\n5. **Fix one thing**, run again, **remove** the debug prints.\n\n\`\`\`\ndef second_largest(nums):\n    s = sorted(nums)\n    print("DEBUG", s)       # [3, 5, 9]  → the largest is LAST\n    return s[1]              # wrong index!\n\`\`\`\n\nOther moves: read the error from the bottom, test the smallest case, **rubber-duck** it (explain line by line to a toy), and bisect by commenting out half the code.`,
    analogy:`A doctor: symptoms → tests → diagnosis → treatment. Not random pills.`,
    example:R`def second_largest(nums):
    s = sorted(nums)
    print("DEBUG", s)
    return s[1]

print(second_largest([3, 9, 5]))`},
  predict:{code:R`print(sorted([3, 9, 5]))`, q:'What prints?', opts:['[3, 5, 9]','[9, 5, 3]','[3, 9, 5]'], ans:0, why:'sorted goes smallest to largest.'},
  cast:{code:R`def second_largest(nums):
    s = sorted(nums)
    print("DEBUG", s)
    return s[1]

print(second_largest([3, 9, 5]))`, task:'Cast it. The DEBUG line shows the real list: the answer 5 is right here by luck. Try [1, 2, 3, 4].'},
  bug:{broken:R`def second_largest(nums):
    return sorted(nums)[1]

print(second_largest([1, 2, 3, 4]))`, task:'Expected 3 (second largest of 1,2,3,4). Print the sorted list to see why it gives 2, then fix the index.',
    cases:[{inputs:[],tests:[['Right answer','out.strip().splitlines()[-1]=="3"']]}],
    sol:R`def second_largest(nums):
    return sorted(nums)[-2]

print(second_largest([1, 2, 3, 4]))`, wrong:[R`def second_largest(nums):
    return sorted(nums)[1]

print(second_largest([1, 2, 3, 4]))`]},
  write:{prompt:'`second_largest(nums)` should return the second largest **distinct** value, or `None` if there are fewer than 2 distinct values. The starter is wrong. Debug it with prints, fix it, and remove the prints.',
    starter:R`def second_largest(nums):
    return sorted(nums)[1]

print(second_largest([3, 9, 5]))
`,
    cases:[{inputs:[],tests:[['Example','lines==["5"]'],['Another','g["second_largest"]([1,2,3,4])==3'],['Duplicates of max','g["second_largest"]([9,9,4])==4'],['All same','g["second_largest"]([7,7]) is None'],['Single','g["second_largest"]([1]) is None'],['Empty','g["second_largest"]([]) is None'],['Negatives','g["second_largest"]([-5,-1,-3])==-3'],['No debug left','"DEBUG" not in out']]}],
    sol:R`def second_largest(nums):
    distinct = sorted(set(nums))
    if len(distinct) < 2:
        return None
    return distinct[-2]

print(second_largest([3, 9, 5]))`,
    wrong:[R`def second_largest(nums):
    return sorted(nums)[-2]

print(second_largest([3, 9, 5]))`, R`def second_largest(nums):
    distinct = sorted(set(nums))
    return distinct[-2]

print(second_largest([3, 9, 5]))`],
    hints:['Print sorted(nums) for [9, 9, 4]. What goes wrong with duplicates?','set(nums) removes duplicates. sorted(...) orders them smallest to largest.','If there are fewer than 2 distinct values, return None. Otherwise return the second from the end.','def second_largest(nums):\n    distinct = sorted(set(nums))\n    if len(distinct) < 2:\n        return None\n    return distinct[-2]\n\nprint(second_largest([3, 9, 5]))']},
  power:{can:['Debug by method instead of by luck','Use print to find the first wrong value'],
    expand:'Write down three small failing inputs before fixing any bug.',
    where:'Every engineer spends a large share of their time debugging. The routine is the skill.',
    next:'Next: a Real-World Mission, the Safe Calculator.'},
  codex:{title:'Debug routine',body:'Reproduce → predict → look at real values → find the first difference → fix one thing → clean up.',snip:R`print("DEBUG", x)`}
},
{
  id:'r7-22', realm:7, n:22, title:'Real-World Mission: The Safe Calculator',
  teaches:['mission7a'], requires:['dbg-strategy'],
  story:`A guard hands you a scorched brass calculator. "It explodes whenever someone types nonsense. Build a **calculator that cannot be broken**."`,
  concept:{
    html:`**Mission brief:** a console calculator. Loop asking \`Calc: \`. Each line looks like \`3 + 4\` (three parts separated by spaces).\n\n| Input | Output |\n|---|---|\n| \`3 + 4\` | \`7.00\` |\n| \`7 / 2\` | \`3.50\` |\n| \`1 / 0\` | \`Cannot divide by zero\` |\n| \`2 ^ 3\` | \`Unknown operator\` |\n| \`x + 1\` or \`1 +\` or empty | \`Invalid expression\` |\n| \`quit\` | \`Bye\` then stop |\n\nOperators: \`+ - * /\`. Numbers may be negative or decimal. Check in this order: wrong number of parts, non-numbers, operator, divide by zero.\n\nWrite \`calculate(a, op, b)\` that **raises** \`ValueError("Unknown operator")\` for a bad operator (and lets \`ZeroDivisionError\` happen naturally). The loop catches and prints.`,
    analogy:`A calculator with a bomb-disposal suit.`,
    example:R`def calculate(a, op, b):
    if op == "+":
        return a + b
    raise ValueError("Unknown operator")

print(calculate(3.0, "+", 4.0))`},
  predict:{code:R`print("3 + 4".split(), len("1 +".split()))`, q:'What prints?', opts:["['3', '+', '4'] 2","['3', '+', '4'] 3",'Error'], ans:0, why:'split() splits on spaces; "1 +" has two parts.'},
  cast:{code:R`def calculate(a, op, b):
    if op == "+":
        return a + b
    raise ValueError("Unknown operator")

print(calculate(3.0, "+", 4.0))`, task:'Cast it.'},
  bug:{broken:R`line = "3 + x"
parts = line.split()
a = float(parts[0])
b = float(parts[2])
print(a + b)`, task:'It crashes on the bad number. Catch the ValueError and print Invalid expression.',
    cases:[{inputs:[],tests:[['Handled','lines==["Invalid expression"]']]}],
    sol:R`line = "3 + x"
parts = line.split()
try:
    a = float(parts[0])
    b = float(parts[2])
    print(a + b)
except ValueError:
    print("Invalid expression")`, wrong:[R`line = "3 + x"
parts = line.split()
a = float(parts[0])
b = float(parts[2])
print(a + b)`]},
  write:{prompt:'Build the Safe Calculator exactly as the brief says, with `calculate(a, op, b)` and the `Calc: ` loop.',
    starter:R`def calculate(a, op, b):
    pass

`,
    inputs:['3 + 4','7 / 2','1 / 0','2 ^ 3','x + 1','quit'],
    cases:[{inputs:['3 + 4','7 / 2','1 / 0','2 ^ 3','x + 1','1 +','-3 + 4','2.5 * 2','10 - 20','','quit'],tests:[['All outputs','[l for l in lines if not l.startswith("Calc: ")]==["7.00","3.50","Cannot divide by zero","Unknown operator","Invalid expression","Invalid expression","1.00","5.00","-10.00","Invalid expression","Bye"]']]},{inputs:['quit'],tests:[['Quits at once','[l for l in lines if not l.startswith("Calc: ")]==["Bye"]']]},{inputs:['6 / 4','quit'],tests:[['Division','"1.50" in lines'],['calculate works','g["calculate"](6.0,"*",7.0)==42.0 and g["calculate"](1.0,"-",3.0)==-2.0'],['calculate raises','__import__("unittest").TestCase().assertRaises(ValueError, g["calculate"], 1.0, "%", 2.0) is None'],['Divide raises','__import__("unittest").TestCase().assertRaises(ZeroDivisionError, g["calculate"], 1.0, "/", 0.0) is None'],['Uses try','"try:" in src']]}],
    sol:R`def calculate(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        return a / b
    raise ValueError("Unknown operator")

while True:
    line = input("Calc: ")
    if line == "quit":
        print("Bye")
        break
    parts = line.split()
    if len(parts) != 3:
        print("Invalid expression")
        continue
    try:
        a = float(parts[0])
        b = float(parts[2])
    except ValueError:
        print("Invalid expression")
        continue
    try:
        print(f"{calculate(a, parts[1], b):.2f}")
    except ValueError:
        print("Unknown operator")
    except ZeroDivisionError:
        print("Cannot divide by zero")`,
    wrong:[R`def calculate(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        return a / b
    raise ValueError("Unknown operator")

while True:
    line = input("Calc: ")
    if line == "quit":
        print("Bye")
        break
    parts = line.split()
    if len(parts) == 3 and parts[0].isdigit() and parts[2].isdigit():
        try:
            print(f"{calculate(float(parts[0]), parts[1], float(parts[2])):.2f}")
        except ValueError:
            print("Unknown operator")
        except ZeroDivisionError:
            print("Cannot divide by zero")
    else:
        print("Invalid expression")`, R`def calculate(a, op, b):
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op == "*":
        return a * b
    if op == "/":
        return a / b
    raise ValueError("Unknown operator")

while True:
    line = input("Calc: ")
    if line == "quit":
        print("Bye")
        break
    parts = line.split()
    if len(parts) != 3:
        print("Invalid expression")
        continue
    try:
        a = float(parts[0])
        b = float(parts[2])
        print(f"{calculate(a, parts[1], b):.2f}")
    except ValueError:
        print("Invalid expression")
    except ZeroDivisionError:
        print("Cannot divide by zero")`],
    hints:['calculate: one if per operator; after them raise ValueError("Unknown operator").','Loop: quit → Bye and break. Wrong part count → Invalid expression. float() inside a try for the numbers.','Second try around calculate: except ValueError → Unknown operator; except ZeroDivisionError → Cannot divide by zero. Print with :.2f.','def calculate(a, op, b):\n    if op == "+":\n        return a + b\n    if op == "-":\n        return a - b\n    if op == "*":\n        return a * b\n    if op == "/":\n        return a / b\n    raise ValueError("Unknown operator")\n\nwhile True:\n    line = input("Calc: ")\n    if line == "quit":\n        print("Bye")\n        break\n    parts = line.split()\n    if len(parts) != 3:\n        print("Invalid expression")\n        continue\n    try:\n        a = float(parts[0])\n        b = float(parts[2])\n    except ValueError:\n        print("Invalid expression")\n        continue\n    try:\n        print(f"{calculate(a, parts[1], b):.2f}")\n    except ValueError:\n        print("Unknown operator")\n    except ZeroDivisionError:\n        print("Cannot divide by zero")']},
  power:{can:['Build a console tool that survives any input','Combine functions, loops, raise and try/except'],
    expand:'Add a % operator and a "last" command that repeats the previous answer.',
    where:'This shape (parse → validate → act → report) is every command-line tool.',
    next:'Next: a CSV summarizer that survives dirty data.'},
  codex:{title:'Safe tool shape',body:'Loop → split → validate → act in try/except → print a clear message. Never crash.',snip:R`try: ...
except ValueError: ...
except ZeroDivisionError: ...`}
},
{
  id:'r7-23', realm:7, n:23, title:'Real-World Mission: The Dirty Data Summarizer',
  teaches:['mission7b'], requires:['mission7a','parse-csv'],
  story:`A clerk drops a crate of crumpled score sheets on the bench. "Half the rows are rubbish. **Keep the good rows, report the bad ones, and give me the average.**"`,
  concept:{
    html:`**Mission brief:** read rows until an empty line, asking \`Row: \`. Each row should be \`name,score\`.\n\nWrite \`parse_row(row)\` that returns \`(name, score)\`, with the name stripped and the score an int from 0 to 100. It **raises \`ValueError\`** if the row doesn't have exactly two parts, the name is empty, or the score isn't a whole number from 0 to 100.\n\nThe main loop prints \`Bad row: <row>\` for each failure and keeps the good ones.\n\nAfter the empty line print:\n\n- \`Valid: <count>\`\n- \`Average: <x.xx>\` (or \`No valid rows\` if none were valid)`,
    analogy:`A sieve: gold stays, gravel is reported.`,
    example:R`def parse_row(row):
    parts = row.split(",")
    if len(parts) != 2:
        raise ValueError("wrong parts")
    return parts[0].strip(), int(parts[1])

print(parse_row("ada,90"))`},
  predict:{code:R`print("a,b,c".split(","), int(" 5 "))`, q:'What prints?', opts:["['a', 'b', 'c'] 5","['a', 'b', 'c'] Error","['abc'] 5"], ans:0, why:'int() ignores spaces around the digits.'},
  cast:{code:R`def parse_row(row):
    parts = row.split(",")
    if len(parts) != 2:
        raise ValueError("wrong parts")
    return parts[0].strip(), int(parts[1])

print(parse_row("ada,90"))`, task:'Cast it.'},
  bug:{broken:R`def parse_row(row):
    name, score = row.split(",")
    return name, int(score)

for row in ["ada,90", "bob,1,2"]:
    try:
        print(parse_row(row))
    except ValueError:
        print("Bad row:", row)`, task:'Both ValueErrors are caught, but look at the output: it should say Bad row for bob. Run it. Then change the code so a 0-100 range check is added: also reject "cy,150". Test with ["ada,90", "cy,150"].',
    cases:[{inputs:[],tests:[['Range check','lines==["(\'ada\', 90)","Bad row: cy,150"]']]}],
    sol:R`def parse_row(row):
    name, score = row.split(",")
    score = int(score)
    if not 0 <= score <= 100:
        raise ValueError("range")
    return name, score

for row in ["ada,90", "cy,150"]:
    try:
        print(parse_row(row))
    except ValueError:
        print("Bad row:", row)`, wrong:[R`def parse_row(row):
    name, score = row.split(",")
    return name, int(score)

for row in ["ada,90", "cy,150"]:
    try:
        print(parse_row(row))
    except ValueError:
        print("Bad row:", row)`]},
  write:{prompt:'Build the Dirty Data Summarizer as the brief says, with `parse_row(row)` and the `Row: ` loop.',
    starter:R`def parse_row(row):
    pass

`,
    inputs:['ada,90','bob,x','cy,70',''],
    cases:[{inputs:['ada,90','bob,x','cy,70',',50','dee,101','eve,1,2',''],tests:[['Full','[l for l in lines if not l.startswith("Row: ")]==["Bad row: bob,x","Bad row: ,50","Bad row: dee,101","Bad row: eve,1,2","Valid: 2","Average: 80.00"]']]},{inputs:['x','y,',''],tests:[['None valid','[l for l in lines if not l.startswith("Row: ")]==["Bad row: x","Bad row: y,","Valid: 0","No valid rows"]']]},{inputs:[''],tests:[['Empty','[l for l in lines if not l.startswith("Row: ")]==["Valid: 0","No valid rows"]']]},{inputs:['a, 55','b,-1','c,100',''],tests:[['Edges','"Bad row: b,-1" in lines and "Valid: 2" in lines and "Average: 77.50" in lines'],['parse_row good','g["parse_row"](" ann , 55")==("ann",55)'],['parse_row bad','all((lambda r: __import__("unittest").TestCase().assertRaises(ValueError, g["parse_row"], r) is None)(r) for r in ["a,b,c","x,","," + "5","a,200","a,-1","nocomma","a,1.5"])']]}],
    sol:R`def parse_row(row):
    parts = row.split(",")
    if len(parts) != 2:
        raise ValueError("wrong number of parts")
    name = parts[0].strip()
    if name == "":
        raise ValueError("empty name")
    score = int(parts[1])
    if not 0 <= score <= 100:
        raise ValueError("score out of range")
    return name, score

scores = []
while True:
    row = input("Row: ")
    if row == "":
        break
    try:
        name, score = parse_row(row)
        scores.append(score)
    except ValueError:
        print("Bad row:", row)

print("Valid:", len(scores))
if scores:
    print(f"Average: {sum(scores) / len(scores):.2f}")
else:
    print("No valid rows")`,
    wrong:[R`def parse_row(row):
    parts = row.split(",")
    if len(parts) != 2:
        raise ValueError("wrong number of parts")
    name = parts[0].strip()
    score = int(parts[1])
    if not 0 <= score <= 100:
        raise ValueError("score out of range")
    return name, score

scores = []
while True:
    row = input("Row: ")
    if row == "":
        break
    try:
        name, score = parse_row(row)
        scores.append(score)
    except ValueError:
        print("Bad row:", row)

print("Valid:", len(scores))
if scores:
    print(f"Average: {sum(scores) / len(scores):.2f}")
else:
    print("No valid rows")`, R`def parse_row(row):
    parts = row.split(",")
    if len(parts) != 2:
        raise ValueError("wrong number of parts")
    name = parts[0].strip()
    if name == "":
        raise ValueError("empty name")
    return name, int(parts[1])

scores = []
while True:
    row = input("Row: ")
    if row == "":
        break
    try:
        name, score = parse_row(row)
        scores.append(score)
    except ValueError:
        print("Bad row:", row)

print("Valid:", len(scores))
if scores:
    print(f"Average: {sum(scores) / len(scores):.2f}")
else:
    print("No valid rows")`],
    hints:['parse_row: split on ","; check len(parts) == 2; strip the name and reject empty; int() the score and check 0..100.','Raise ValueError for each problem. int() itself raises ValueError for non-numbers.','Loop: empty row → break. try parse_row; collect scores; except ValueError → print Bad row.','def parse_row(row):\n    parts = row.split(",")\n    if len(parts) != 2:\n        raise ValueError("wrong number of parts")\n    name = parts[0].strip()\n    if name == "":\n        raise ValueError("empty name")\n    score = int(parts[1])\n    if not 0 <= score <= 100:\n        raise ValueError("score out of range")\n    return name, score\n\nscores = []\nwhile True:\n    row = input("Row: ")\n    if row == "":\n        break\n    try:\n        name, score = parse_row(row)\n        scores.append(score)\n    except ValueError:\n        print("Bad row:", row)\n\nprint("Valid:", len(scores))\nif scores:\n    print(f"Average: {sum(scores) / len(scores):.2f}")\nelse:\n    print("No valid rows")']},
  power:{can:['Clean real-world messy data safely','Report problems without stopping the work'],
    expand:'Also print the best name, using a dict of name → score.',
    where:'Data cleaning is a huge part of every data and backend job.',
    next:'Next: a bug-hunt through several functions.'},
  codex:{title:'Dirty data',body:'Parse each row in a function that raises ValueError. The caller keeps good rows and reports bad ones.',snip:R`try:
    name, score = parse_row(row)
except ValueError:
    print("Bad row:", row)`}
},
{
  id:'r7-24', realm:7, n:24, title:'The Bug Hunt',
  teaches:['bug-hunt'], requires:['mission7b'],
  story:`Hopper pins three scrolls to the wall. "Three functions, one bug each, and each hides in a different way. **Use the method.**"`,
  concept:{
    html:`Three classic bug families to hunt:\n\n- **Off-by-one**: an index or range is one too big or too small (\`text.split(" ")[len(...)]\`).\n- **Wrong order**: a value is used *before* it is updated.\n- **Wrong branch**: an \`if\` sends a case to the wrong result.\n\nFor each function: run it on a tiny input, **predict** the output, compare, and **print** in the middle if needed.\n\nFix one bug, re-run, then the next.`,
    analogy:`Three leaks in one boat: patch them one at a time.`,
    example:R`def last_word(text):
    words = text.split(" ")
    return words[-1]

print(last_word("one two three"))`},
  predict:{code:R`words = ["a", "b", "c"]
print(words[len(words) - 1])`, q:'What prints?', opts:['c','a','Error'], ans:0, why:'len is 3, so index 2 is the last item.'},
  cast:{code:R`def last_word(text):
    words = text.split(" ")
    return words[-1]

print(last_word("one two three"))`, task:'Cast it.'},
  bug:{broken:R`def running_total(values):
    out = []
    total = 0
    for v in values:
        out.append(total)
        total += v
    return out

print(running_total([1, 2, 3]))`, task:'Expected [1, 3, 6]. The total is appended BEFORE it is updated. Fix the order.',
    cases:[{inputs:[],tests:[['Right','lines==["[1, 3, 6]"]']]}],
    sol:R`def running_total(values):
    out = []
    total = 0
    for v in values:
        total += v
        out.append(total)
    return out

print(running_total([1, 2, 3]))`, wrong:[R`def running_total(values):
    out = []
    total = 0
    for v in values:
        out.append(total)
        total += v
    return out

print(running_total([1, 2, 3]))`]},
  write:{prompt:'Three functions, one bug each. Fix them all: `clamp_all` (values below `low` must become `low`), `running_total` (cumulative sums), `last_word` (last word of a sentence; `""` for an empty/blank string).',
    starter:R`def clamp_all(values, low, high):
    result = []
    for v in values:
        if v < low:
            result.append(high)
        elif v > high:
            result.append(high)
        else:
            result.append(v)
    return result

def running_total(values):
    out = []
    total = 0
    for v in values:
        out.append(total)
        total += v
    return out

def last_word(text):
    words = text.split(" ")
    return words[len(words)]

print(clamp_all([-5, 5, 50], 0, 10))
print(running_total([1, 2, 3]))
print(last_word("one two three"))
`,
    cases:[{inputs:[],tests:[['Output','lines==["[0, 5, 10]","[1, 3, 6]","three"]'],['clamp low','g["clamp_all"]([-1,-9],0,3)==[0,0]'],['clamp keep','g["clamp_all"]([2],0,3)==[2]'],['clamp high','g["clamp_all"]([9],0,3)==[3]'],['total empty','g["running_total"]([])==[]'],['total negatives','g["running_total"]([5,-2,1])==[5,3,4]'],['word one','g["last_word"]("hi")=="hi"'],['word blank','g["last_word"]("")=="" and g["last_word"]("   ")==""'],['word spaces','g["last_word"]("a b  ")=="b"']]}],
    sol:R`def clamp_all(values, low, high):
    result = []
    for v in values:
        if v < low:
            result.append(low)
        elif v > high:
            result.append(high)
        else:
            result.append(v)
    return result

def running_total(values):
    out = []
    total = 0
    for v in values:
        total += v
        out.append(total)
    return out

def last_word(text):
    words = text.split()
    if not words:
        return ""
    return words[-1]

print(clamp_all([-5, 5, 50], 0, 10))
print(running_total([1, 2, 3]))
print(last_word("one two three"))`,
    wrong:[R`def clamp_all(values, low, high):
    result = []
    for v in values:
        if v < low:
            result.append(low)
        elif v > high:
            result.append(high)
        else:
            result.append(v)
    return result

def running_total(values):
    out = []
    total = 0
    for v in values:
        total += v
        out.append(total)
    return out

def last_word(text):
    words = text.split(" ")
    return words[-1]

print(clamp_all([-5, 5, 50], 0, 10))
print(running_total([1, 2, 3]))
print(last_word("one two three"))`, R`def clamp_all(values, low, high):
    result = []
    for v in values:
        if v < low:
            result.append(high)
        elif v > high:
            result.append(high)
        else:
            result.append(v)
    return result

def running_total(values):
    out = []
    total = 0
    for v in values:
        total += v
        out.append(total)
    return out

def last_word(text):
    words = text.split()
    if not words:
        return ""
    return words[-1]

print(clamp_all([-5, 5, 50], 0, 10))
print(running_total([1, 2, 3]))
print(last_word("one two three"))`],
    hints:['clamp_all: the "below low" branch appends the wrong bound.','running_total: update total first, then append.','last_word: the last index is -1, and split() with no argument ignores extra spaces. Guard against an empty list.','def clamp_all(values, low, high):\n    result = []\n    for v in values:\n        if v < low:\n            result.append(low)\n        elif v > high:\n            result.append(high)\n        else:\n            result.append(v)\n    return result\n\ndef running_total(values):\n    out = []\n    total = 0\n    for v in values:\n        total += v\n        out.append(total)\n    return out\n\ndef last_word(text):\n    words = text.split()\n    if not words:\n        return ""\n    return words[-1]\n\nprint(clamp_all([-5, 5, 50], 0, 10))\nprint(running_total([1, 2, 3]))\nprint(last_word("one two three"))']},
  power:{can:['Find several bugs with a repeatable method','Recognise off-by-one, wrong order and wrong branch'],
    expand:'Write a failing test for each bug before you fix it.',
    where:'Code review and maintenance are mostly bug hunts like this.',
    next:'Next: recursion and errors together.'},
  codex:{title:'Bug families',body:'Off-by-one, wrong order, wrong branch. Predict, run, compare, fix one thing at a time.',snip:R`words[-1]   # last item`}
},
{
  id:'r7-25', realm:7, n:25, title:'Recursion meets errors',
  teaches:['rec-err-mix'], requires:['bug-hunt','rec-fact'],
  story:`"Recursion with no guard walks off the edge of the mirror hall," Hopper warns. "Guard the **door** once, then recurse in peace."`,
  concept:{
    html:`Validate the input **once**, then recurse on trusted values:\n\n\`\`\`\ndef fact(n):\n    if not isinstance(n, int):\n        raise TypeError("n must be an int")\n    if n < 0:\n        raise ValueError("n must be >= 0")\n    if n == 0:\n        return 1\n    return n * fact(n - 1)\n\`\`\`\n\nWithout the checks, \`fact(-1)\` would recurse forever and end in \`RecursionError\`; \`fact(2.5)\` would walk to \`-0.5\` and never hit the base case.\n\nPython allows about 1000 nested calls. For deep work, prefer a **loop**.`,
    analogy:`Check the ticket at the gate, not on every step of the ride.`,
    example:R`def fact(n):
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:
        return 1
    return n * fact(n - 1)

print(fact(5))`},
  predict:{code:R`def f(n):
    if n == 0:
        return 0
    return 1 + f(n - 1)

try:
    print(f(-1))
except RecursionError:
    print("too deep")`, q:'What prints?', opts:['too deep','0','-1'], ans:0, why:'-1 never reaches the base case 0, so Python stops it with RecursionError.'},
  cast:{code:R`def fact(n):
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:
        return 1
    return n * fact(n - 1)

print(fact(5))`, task:'Cast it. Try fact(-1).'},
  bug:{broken:R`def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)

countdown(-1)`, task:'This recurses until Python gives up. Add a guard that raises ValueError("n must be >= 0") and catch it to print Error: n must be >= 0.',
    cases:[{inputs:[],tests:[['Guarded','lines==["Error: n must be >= 0"]']]}],
    sol:R`def countdown(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)

try:
    countdown(-1)
except ValueError as e:
    print("Error:", e)`, wrong:[R`def countdown(n):
    if n == 0:
        print("Go!")
        return
    print(n)
    countdown(n - 1)

countdown(-1)`]},
  write:{prompt:'Write recursive `fact(n)` that raises `TypeError("n must be an int")` for non-ints and `ValueError("n must be >= 0")` for negatives. Print `fact(5)`, then for `-1`, `2.5` and `0` print the result or `Error: <message>`.',
    starter:R`# define fact, then try the values
`,
    cases:[{inputs:[],tests:[['Printed','lines==["120","Error: n must be >= 0","Error: n must be an int","1"]'],['Ten','g["fact"](10)==3628800'],['One','g["fact"](1)==1'],['Is recursive','"fact(" in src.split("def fact")[1].split("\\nprint")[0].split("\\n",1)[1]'],['TypeError raised','__import__("unittest").TestCase().assertRaises(TypeError, g["fact"], "3") is None'],['ValueError raised','__import__("unittest").TestCase().assertRaises(ValueError, g["fact"], -3) is None']]}],
    sol:R`def fact(n):
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:
        return 1
    return n * fact(n - 1)

print(fact(5))
for value in (-1, 2.5, 0):
    try:
        print(fact(value))
    except (ValueError, TypeError) as e:
        print("Error:", e)`,
    wrong:[R`def fact(n):
    if n < 0:
        raise ValueError("n must be >= 0")
    if n == 0:
        return 1
    return n * fact(n - 1)

print(fact(5))
for value in (-1, 2.5, 0):
    try:
        print(fact(value))
    except (ValueError, TypeError) as e:
        print("Error:", e)`, R`def fact(n):
    if not isinstance(n, int):
        raise TypeError("n must be an int")
    if n < 0:
        raise ValueError("n must be >= 0")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

print(fact(5))
for value in (-1, 2.5, 0):
    try:
        print(fact(value))
    except (ValueError, TypeError) as e:
        print("Error:", e)`],
    hints:['Guards first: not isinstance(n, int) → TypeError; n < 0 → ValueError.','Then the base case n == 0 → 1, and the recursive step n * fact(n - 1).','The loop catches both error types with a tuple.','def fact(n):\n    if not isinstance(n, int):\n        raise TypeError("n must be an int")\n    if n < 0:\n        raise ValueError("n must be >= 0")\n    if n == 0:\n        return 1\n    return n * fact(n - 1)\n\nprint(fact(5))\nfor value in (-1, 2.5, 0):\n    try:\n        print(fact(value))\n    except (ValueError, TypeError) as e:\n        print("Error:", e)']},
  power:{can:['Guard recursive functions','Explain why unguarded recursion fails'],
    expand:'Catch RecursionError around fact(5000) and print a friendly message.',
    where:'Parsers and tree walkers always guard their input before recursing.',
    next:'Next: the Journeyman Project, a text adventure engine.'},
  codex:{title:'Guarded recursion',body:'Validate input once, then recurse. Missing base cases end in RecursionError.',snip:R`if n < 0: raise ValueError(...)`}
},
{
  id:'r7-26', realm:7, n:26, title:'Journeyman Project: The Text Adventure',
  teaches:['mission7c'], requires:['rec-err-mix','dict-edit'],
  story:`The mirrors fall silent. Hopper opens a door you have not seen before. "Journeyman's trial: build a **world** from dicts, lists, functions and a loop. Rooms to walk, things to carry. It is your first real program."`,
  concept:{
    html:`**Journeyman project:** a tiny text adventure. Use this world (copy it):\n\n\`\`\`\nrooms = {\n    "hall": {"items": ["lamp"], "exits": {"north": "library", "east": "kitchen"}},\n    "library": {"items": ["key", "book"], "exits": {"south": "hall"}},\n    "kitchen": {"items": [], "exits": {"west": "hall"}},\n}\n\`\`\`\n\nStart in the \`hall\` with an empty inventory. Loop with the prompt \`> \`:\n\n| Command | Output |\n|---|---|\n| \`look\` | \`You are in <room>.\` / \`Items: a, b\` (or \`Items: none\`) / \`Exits: x, y\` (sorted) |\n| \`go <dir>\` | \`You walk <dir> to <room>.\` or \`You can't go that way.\` |\n| \`take <item>\` | \`Taken: <item>\` (moves it to your inventory) or \`No such item here.\` |\n| \`inventory\` | \`You carry: a, b\` (sorted) or \`You carry nothing.\` |\n| \`quit\` | \`Farewell.\` then stop |\n| anything else | \`Unknown command.\` |\n\nItems are listed in the order they sit in the room. A command with the wrong number of words (like just \`go\`) is \`Unknown command.\``,
    analogy:`A tiny game engine: the world is data, the loop is the engine.`,
    example:R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library"}},
    "library": {"items": [], "exits": {"south": "hall"}},
}
here = "hall"
print("You are in", here)
print(sorted(rooms[here]["exits"]))`},
  predict:{code:R`room = {"items": ["a", "b"]}
room["items"].remove("a")
print(room["items"])`, q:'What prints?', opts:["['b']","['a']","['a', 'b']"], ans:0, why:'remove deletes the first matching item from the list in place.'},
  cast:{code:R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library"}},
    "library": {"items": [], "exits": {"south": "hall"}},
}
here = "hall"
print("You are in", here)
print(sorted(rooms[here]["exits"]))`, task:'Cast it.'},
  bug:{broken:R`room = {"items": ["lamp", "key"]}
inventory = []
item = "key"
if item in room["items"]:
    inventory.append(item)
    print("Taken:", item)
print(room["items"])`, task:'The key is taken but is still in the room. Remove it from the room as well. Expected last line: [\'lamp\'].',
    cases:[{inputs:[],tests:[['Moved','lines==["Taken: key","[\'lamp\']"]']]}],
    sol:R`room = {"items": ["lamp", "key"]}
inventory = []
item = "key"
if item in room["items"]:
    room["items"].remove(item)
    inventory.append(item)
    print("Taken:", item)
print(room["items"])`, wrong:[R`room = {"items": ["lamp", "key"]}
inventory = []
item = "key"
if item in room["items"]:
    inventory.append(item)
    print("Taken:", item)
print(room["items"])`]},
  write:{prompt:'Build the text adventure exactly as the brief says. The `rooms` dict is given.',
    starter:R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library", "east": "kitchen"}},
    "library": {"items": ["key", "book"], "exits": {"south": "hall"}},
    "kitchen": {"items": [], "exits": {"west": "hall"}},
}
here = "hall"
inventory = []

`,
    inputs:['look','take lamp','go north','look','quit'],
    cases:[{inputs:['look','take lamp','take lamp','go north','take key','inventory','go north','go south','go east','look','dance','go','quit'],tests:[['Full walkthrough',`[l for l in lines if not l.startswith("> ")]==["You are in hall.","Items: lamp","Exits: east, north","Taken: lamp","No such item here.","You walk north to library.","Taken: key","You carry: key, lamp","You can't go that way.","You walk south to hall.","You walk east to kitchen.","You are in kitchen.","Items: none","Exits: west","Unknown command.","Unknown command.","Farewell."]`]]},{inputs:['take book','go north','take book','take book','inventory','look','quit'],tests:[['Second walkthrough',`[l for l in lines if not l.startswith("> ")]==["No such item here.","You walk north to library.","Taken: book","No such item here.","You carry: book","You are in library.","Items: key","Exits: south","Farewell."]`]]},{inputs:['inventory','quit'],tests:[['Empty inventory','[l for l in lines if not l.startswith("> ")]==["You carry nothing.","Farewell."]']]},{inputs:['go west','go up','quit'],tests:[['Bad directions',`[l for l in lines if not l.startswith("> ")]==["You can't go that way.","You can't go that way.","Farewell."]`],['World is a dict','isinstance(g["rooms"], dict)']]}],
    sol:R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library", "east": "kitchen"}},
    "library": {"items": ["key", "book"], "exits": {"south": "hall"}},
    "kitchen": {"items": [], "exits": {"west": "hall"}},
}
here = "hall"
inventory = []

while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        print("Farewell.")
        break
    elif parts == ["look"]:
        room = rooms[here]
        print(f"You are in {here}.")
        if room["items"]:
            print("Items:", ", ".join(room["items"]))
        else:
            print("Items: none")
        print("Exits:", ", ".join(sorted(room["exits"])))
    elif len(parts) == 2 and parts[0] == "go":
        exits = rooms[here]["exits"]
        if parts[1] in exits:
            here = exits[parts[1]]
            print(f"You walk {parts[1]} to {here}.")
        else:
            print("You can't go that way.")
    elif len(parts) == 2 and parts[0] == "take":
        items = rooms[here]["items"]
        if parts[1] in items:
            items.remove(parts[1])
            inventory.append(parts[1])
            print("Taken:", parts[1])
        else:
            print("No such item here.")
    elif parts == ["inventory"]:
        if inventory:
            print("You carry:", ", ".join(sorted(inventory)))
        else:
            print("You carry nothing.")
    else:
        print("Unknown command.")`,
    wrong:[R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library", "east": "kitchen"}},
    "library": {"items": ["key", "book"], "exits": {"south": "hall"}},
    "kitchen": {"items": [], "exits": {"west": "hall"}},
}
here = "hall"
inventory = []

while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        print("Farewell.")
        break
    elif parts == ["look"]:
        room = rooms[here]
        print(f"You are in {here}.")
        if room["items"]:
            print("Items:", ", ".join(room["items"]))
        else:
            print("Items: none")
        print("Exits:", ", ".join(sorted(room["exits"])))
    elif len(parts) == 2 and parts[0] == "go":
        exits = rooms[here]["exits"]
        if parts[1] in exits:
            here = exits[parts[1]]
            print(f"You walk {parts[1]} to {here}.")
        else:
            print("You can't go that way.")
    elif len(parts) == 2 and parts[0] == "take":
        items = rooms[here]["items"]
        if parts[1] in items:
            inventory.append(parts[1])
            print("Taken:", parts[1])
        else:
            print("No such item here.")
    elif parts == ["inventory"]:
        if inventory:
            print("You carry:", ", ".join(sorted(inventory)))
        else:
            print("You carry nothing.")
    else:
        print("Unknown command.")`, R`rooms = {
    "hall": {"items": ["lamp"], "exits": {"north": "library", "east": "kitchen"}},
    "library": {"items": ["key", "book"], "exits": {"south": "hall"}},
    "kitchen": {"items": [], "exits": {"west": "hall"}},
}
here = "hall"
inventory = []

while True:
    parts = input("> ").split()
    if parts == ["quit"]:
        print("Farewell.")
        break
    elif parts == ["look"]:
        room = rooms[here]
        print(f"You are in {here}.")
        if room["items"]:
            print("Items:", ", ".join(room["items"]))
        else:
            print("Items: none")
        print("Exits:", ", ".join(room["exits"]))
    elif len(parts) == 2 and parts[0] == "go":
        exits = rooms[here]["exits"]
        if parts[1] in exits:
            here = exits[parts[1]]
            print(f"You walk {parts[1]} to {here}.")
        else:
            print("You can't go that way.")
    elif len(parts) == 2 and parts[0] == "take":
        items = rooms[here]["items"]
        if parts[1] in items:
            items.remove(parts[1])
            inventory.append(parts[1])
            print("Taken:", parts[1])
        else:
            print("No such item here.")
    elif parts == ["inventory"]:
        if inventory:
            print("You carry:", ", ".join(sorted(inventory)))
        else:
            print("You carry nothing.")
    else:
        print("Unknown command.")`],
    hints:['Read a line with input("> ").split(). Handle quit, look and inventory as exact lists; go and take need exactly 2 words.','look: print the room name, its items (or none) and sorted(exits). go: use here = exits[direction]. take: items.remove(item) and inventory.append(item).','Everything else, including a bare "go", falls to the final else: Unknown command.','while True:\n    parts = input("> ").split()\n    if parts == ["quit"]:\n        print("Farewell.")\n        break\n    elif parts == ["look"]:\n        room = rooms[here]\n        print(f"You are in {here}.")\n        if room["items"]:\n            print("Items:", ", ".join(room["items"]))\n        else:\n            print("Items: none")\n        print("Exits:", ", ".join(sorted(room["exits"])))\n    elif len(parts) == 2 and parts[0] == "go":\n        exits = rooms[here]["exits"]\n        if parts[1] in exits:\n            here = exits[parts[1]]\n            print(f"You walk {parts[1]} to {here}.")\n        else:\n            print("You can\'t go that way.")\n    elif len(parts) == 2 and parts[0] == "take":\n        items = rooms[here]["items"]\n        if parts[1] in items:\n            items.remove(parts[1])\n            inventory.append(parts[1])\n            print("Taken:", parts[1])\n        else:\n            print("No such item here.")\n    elif parts == ["inventory"]:\n        if inventory:\n            print("You carry:", ", ".join(sorted(inventory)))\n        else:\n            print("You carry nothing.")\n    else:\n        print("Unknown command.")']},
  power:{can:['Model a world with nested dicts and lists','Build an interactive program from data and a command loop'],
    expand:'Add a locked library door that needs the key, and a win condition.',
    where:'Game engines, chatbots and CLI tools are all this shape: state plus a command loop.',
    next:'Boss: the Mirror Warden waits.'},
  codex:{title:'State + command loop',body:'Keep the world in data (dicts, lists). Loop: read a command, update the data, print the result.',snip:R`parts = input("> ").split()`}
}
);
