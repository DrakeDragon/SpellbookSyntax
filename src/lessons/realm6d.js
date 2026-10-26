// REALM 6 — THE SPELL FORGE — part D (lessons 28-36)
LESSONS.push(
{
  id:'r6-28', realm:6, n:28, title:'Table-driven tests',
  teaches:['fn-table-tests'], requires:['fn-assert'],
  story:`"One assert per case is slow," Ada says, rolling out a long scroll of numbers. "Write the cases as a *table* and let a loop do the striking."`,
  concept:{
    html:`When you have many cases, put them in a **list of (input, expected) pairs** and test them in a loop:\n\n\`\`\`\ncases = [(2, 4), (3, 9), (-4, 16), (0, 0)]\n\ndef failures(func, cases):\n    bad = []\n    for given, expected in cases:\n        if func(given) != expected:\n            bad.append((given, expected))\n    return bad\n\`\`\`\n\n- Adding a case is one line, not three.\n- The function **returns** the failures so you can print or count them.\n- This idea powers every testing tool (you'll meet \`pytest\` later).`,
    analogy:`A spreadsheet of "if I feed this in, I expect that out".`,
    example:R`def square(n):
    return n * n

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]
bad = [c for c in cases if square(c[0]) != c[1]]
print(bad)`},
  predict:{code:R`cases = [(1, 2), (2, 4)]
f = lambda n: n * 2
print([c for c in cases if f(c[0]) != c[1]])`, q:'What prints?', opts:['[]','[(1, 2)]','[(2, 4)]'], ans:0, why:'f doubles correctly in both cases, so there are no failures.'},
  cast:{code:R`def square(n):
    return n * n

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]
bad = [c for c in cases if square(c[0]) != c[1]]
print(bad)`, task:'Cast it. Break square on purpose and watch it report failures.'},
  bug:{broken:R`def failures(func, cases):
    bad = []
    for given, expected in cases:
        if func(given) == expected:
            bad.append((given, expected))
    return bad

print(failures(lambda n: n * 2, [(1, 2), (2, 5)]))`, task:'It lists the PASSING cases. Expected [(2, 5)].',
    cases:[{inputs:[],tests:[['Prints the failing case','lines==["[(2, 5)]"]']]}],
    sol:R`def failures(func, cases):
    bad = []
    for given, expected in cases:
        if func(given) != expected:
            bad.append((given, expected))
    return bad

print(failures(lambda n: n * 2, [(1, 2), (2, 5)]))`, wrong:[R`def failures(func, cases):
    bad = []
    for given, expected in cases:
        if func(given) == expected:
            bad.append((given, expected))
    return bad

print(failures(lambda n: n * 2, [(1, 2), (2, 5)]))`]},
  write:{prompt:'Define `failures(func, cases)` returning the list of `(input, expected)` pairs the function gets wrong. Then print `square: N failed` and `bad_square: N failed` using the cases and functions given.',
    starter:R`def square(n):
    return n * n

def bad_square(n):
    return n * 2

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["square: 0 failed","bad_square: 2 failed"]'],['Works generally','g["failures"](lambda x: x + 1, [(1, 2), (2, 5)])==[(2, 5)]'],['All pass gives empty','g["failures"](str, [(1, "1")])==[]'],['Uses the helper','src.count("failures(")>=3']]}],
    sol:R`def square(n):
    return n * n

def bad_square(n):
    return n * 2

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]

def failures(func, cases):
    bad = []
    for given, expected in cases:
        if func(given) != expected:
            bad.append((given, expected))
    return bad

print(f"square: {len(failures(square, cases))} failed")
print(f"bad_square: {len(failures(bad_square, cases))} failed")`,
    wrong:[R`def square(n):
    return n * n

def bad_square(n):
    return n * 2

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]

def failures(func, cases):
    return []

print(f"square: {len(failures(square, cases))} failed")
print(f"bad_square: {len(failures(bad_square, cases))} failed")`, R`def square(n):
    return n * n

def bad_square(n):
    return n * 2

cases = [(2, 4), (3, 9), (-4, 16), (0, 0)]

print("square: 0 failed")
print("bad_square: 2 failed")`],
    hints:['Loop over cases; each is a (given, expected) pair.','Append the pair to a list when func(given) != expected.','Print len(failures(...)) for each function.','def failures(func, cases):\n    bad = []\n    for given, expected in cases:\n        if func(given) != expected:\n            bad.append((given, expected))\n    return bad\n\nprint(f"square: {len(failures(square, cases))} failed")\nprint(f"bad_square: {len(failures(bad_square, cases))} failed")']},
  power:{can:['Test a function against many cases at once','Pass a function and a table into a test helper'],
    expand:'Add a case that reveals bad_square is also wrong for 1.',
    where:'This is exactly how professional test suites are organised.',
    next:'Next: hunting bugs inside functions.'},
  codex:{title:'Table tests',body:'cases = [(input, expected), ...] and a loop that collects the failures.',snip:R`for given, expected in cases: ...`}
},
{
  id:'r6-29', realm:6, n:29, title:'Debugging functions',
  teaches:['fn-debug'], requires:['fn-table-tests'],
  story:`Three crooked blades hang on the wall. "Each has one flaw," Ada says. "A good smith doesn't guess; she tests, finds the crack, and fixes **only** the crack."`,
  concept:{
    html:`A method for debugging any function:\n\n1. **Reproduce**: find an input that gives the wrong answer.\n2. **Read** the error's last line (\`TypeError: f() missing 1 required positional argument\`).\n3. **Shrink**: test the smallest input that still fails.\n4. **Look inside**: add a \`print\` of the variables at each step.\n5. **Fix one thing**, then re-run all your tests.\n\nFunction-specific errors:\n\n| Error | Usually means |\n|---|---|\n| \`TypeError: f() takes 2 positional arguments but 3 were given\` | wrong number of arguments |\n| \`UnboundLocalError\` | assigning to a name that is also global |\n| result is \`None\` | missing \`return\` |\n| works once, wrong the second time | mutable default or shared state |`,
    analogy:`A mechanic who isolates the noise before replacing parts.`,
    example:R`def second_largest(nums):
    return sorted(nums)[-2]

print(second_largest([4, 9, 2, 7]))`},
  predict:{code:R`def f(a, b):
    return a + b

f(1, 2, 3)`, q:'Which error appears?', opts:['TypeError','NameError','ValueError'], ans:0, why:'Too many arguments is a TypeError.'},
  cast:{code:R`def f(a, b):
    return a + b

print(f(1, 2, 3))`, task:'Cast it and read the error.', expectError:true},
  bug:{broken:R`def second_largest(nums):
    return sorted(nums)[1]

print(second_largest([4, 9, 2, 7]))`, task:'It returns the second SMALLEST. Fix it so the answer is 7.',
    cases:[{inputs:[],tests:[['Prints 7','out.strip()=="7"']]}],
    sol:R`def second_largest(nums):
    return sorted(nums)[-2]

print(second_largest([4, 9, 2, 7]))`, wrong:[R`def second_largest(nums):
    return sorted(nums)[1]

print(second_largest([4, 9, 2, 7]))`]},
  write:{prompt:'Three functions below each have one bug. Fix all three: `count_vowels` must ignore case, `second_largest` must return the second-biggest, `is_sorted` must be True for ascending lists. The print lines are already there.',
    starter:R`def count_vowels(text):
    count = 0
    for ch in text:
        if ch in "aeiou":
            count += 1
    return count

def second_largest(nums):
    return sorted(nums)[1]

def is_sorted(nums):
    return nums == sorted(nums, reverse=True)

print(count_vowels("Education"))
print(second_largest([4, 9, 2, 7]))
print(is_sorted([1, 2, 3]))
`,
    cases:[{inputs:[],tests:[['Printed','lines==["5","7","True"]'],['count_vowels','g["count_vowels"]("AEIOU xyz")==5 and g["count_vowels"]("")==0'],['second_largest','g["second_largest"]([1,2,3])==2 and g["second_largest"]([9,1])==1'],['is_sorted','g["is_sorted"]([1,2,3]) is True and g["is_sorted"]([3,1]) is False and g["is_sorted"]([]) is True and g["is_sorted"]([2,2]) is True']]}],
    sol:R`def count_vowels(text):
    count = 0
    for ch in text.lower():
        if ch in "aeiou":
            count += 1
    return count

def second_largest(nums):
    return sorted(nums)[-2]

def is_sorted(nums):
    return nums == sorted(nums)

print(count_vowels("Education"))
print(second_largest([4, 9, 2, 7]))
print(is_sorted([1, 2, 3]))`,
    wrong:[R`def count_vowels(text):
    count = 0
    for ch in text:
        if ch in "aeiou":
            count += 1
    return count

def second_largest(nums):
    return sorted(nums)[-2]

def is_sorted(nums):
    return nums == sorted(nums)

print(count_vowels("Education"))
print(second_largest([4, 9, 2, 7]))
print(is_sorted([1, 2, 3]))`, R`def count_vowels(text):
    count = 0
    for ch in text.lower():
        if ch in "aeiou":
            count += 1
    return count

def second_largest(nums):
    return sorted(nums)[-2]

def is_sorted(nums):
    return nums == sorted(nums, reverse=True)

print(count_vowels("Education"))
print(second_largest([4, 9, 2, 7]))
print(is_sorted([1, 2, 3]))`],
    hints:['count_vowels: loop over text.lower().','second_largest: the second-last item of the sorted list is [-2].','is_sorted: compare with sorted(nums), not reverse sorted.','def count_vowels(text):\n    count = 0\n    for ch in text.lower():\n        if ch in "aeiou":\n            count += 1\n    return count\n\ndef second_largest(nums):\n    return sorted(nums)[-2]\n\ndef is_sorted(nums):\n    return nums == sorted(nums)\n\nprint(count_vowels("Education"))\nprint(second_largest([4, 9, 2, 7]))\nprint(is_sorted([1, 2, 3]))']},
  power:{can:['Debug a function systematically','Recognise function-specific errors'],
    expand:'Write two asserts per function to guard against these bugs coming back.',
    where:'Debugging is the skill employers value most, and it is a method, not a talent.',
    next:'Next: type hints, notes that document what goes in and out.'},
  codex:{title:'Debugging method',body:'Reproduce, read the last line, shrink, print inside, fix one thing, re-test.',snip:R`print(type(x), x)`}
},
{
  id:'r6-30', realm:6, n:30, title:'Type hints: documenting inputs and outputs',
  teaches:['fn-hints'], requires:['fn-debug'],
  story:`Ada stamps each blade with a tiny label: *takes steel, gives sword*. "Python won't read it," she says. "But the next smith will. And so will the tools that check your work."`,
  concept:{
    html:`**Type hints** label what a function expects and returns:\n\n\`\`\`\ndef area(w: float, h: float) -> float:\n    return w * h\n\`\`\`\n\n- \`w: float\` says the parameter should be a float.\n- \`-> float\` says the function returns a float.\n- Python **does not enforce** them. \`area("a", 2)\` still runs.\n- Editors and checkers (like \`mypy\`) use them to catch mistakes **before** you run.\n\nCommon hints: \`int\`, \`float\`, \`str\`, \`bool\`, \`list[int]\`, \`dict[str, int]\`, \`None\`.\n\nDefaults go after the hint: \`def greet(name: str, polite: bool = True) -> str:\``,
    analogy:`Labels on boxes: nothing stops you putting socks in the "tools" box, but the label helps.`,
    example:R`def area(w: float, h: float) -> float:
    return w * h

print(area(2.5, 4))
print(area.__annotations__)`},
  predict:{code:R`def f(x: int) -> str:
    return str(x)

print(f("hello"))`, q:'What prints?', opts:['hello','TypeError','0'], ans:0, why:'Hints are not enforced. str("hello") is "hello".'},
  cast:{code:R`def area(w: float, h: float) -> float:
    return w * h

print(area(2.5, 4))
print(area.__annotations__)`, task:'Cast it.'},
  bug:{broken:R`def greet(name: str) -> str:
    print("Hello, " + name)

print(greet("Ada"))`, task:'The hint says it returns a str but it returns None (it prints instead). Make it really return the greeting.',
    cases:[{inputs:[],tests:[['Prints once','lines==["Hello, Ada"]'],['Returns a string','g["greet"]("Bo")=="Hello, Bo"']]}],
    sol:R`def greet(name: str) -> str:
    return "Hello, " + name

print(greet("Ada"))`, wrong:[R`def greet(name: str) -> str:
    print("Hello, " + name)

print(greet("Ada"))`]},
  write:{prompt:'Write `tax(price: float, rate: float = 0.2) -> float` returning the tax amount rounded to 2 decimals, with type hints and a docstring. Print `tax(50)`.',
    starter:R`# write tax with type hints
`,
    cases:[{inputs:[],tests:[['Prints 10.0','lines==["10.0"]'],['Annotated','g["tax"].__annotations__=={"price": float, "rate": float, "return": float}'],['Default rate','g["tax"](100)==20.0 and g["tax"](100, 0.1)==10.0'],['Docstring','bool(g["tax"].__doc__)']]}],
    sol:R`def tax(price: float, rate: float = 0.2) -> float:
    """Return the tax due on a price."""
    return round(price * rate, 2)

print(tax(50))`,
    wrong:[R`def tax(price, rate=0.2):
    """Return the tax due on a price."""
    return round(price * rate, 2)

print(tax(50))`, R`def tax(price: float, rate: float = 0.2) -> float:
    return round(price * rate, 2)

print(tax(50))`],
    hints:['def tax(price: float, rate: float = 0.2) -> float:','Add a triple-quoted docstring as the first line inside.','return round(price * rate, 2)','def tax(price: float, rate: float = 0.2) -> float:\n    """Return the tax due on a price."""\n    return round(price * rate, 2)\n\nprint(tax(50))']},
  power:{can:['Annotate functions','Read other people\'s hinted code'],
    expand:'Add hints to every function in your converter mission.',
    where:'Modern Python teams hint almost everything; it prevents a whole class of bugs.',
    next:'Mission time: build a text toolkit.'},
  codex:{title:'Type hints',body:'def f(x: int) -> str. Not enforced at runtime, used by editors and checkers.',snip:R`def area(w: float, h: float) -> float:`}
},
{
  id:'r6-31', realm:6, n:31, title:'Real-World Mission: The Text Toolkit',
  teaches:['mission6b'], requires:['fn-hints','str-check'],
  story:`The Scriptorium's librarian has come down to the forge, her arms full of tools labelled in her own handwriting. "I keep re-writing the same five helpers," Turing's Ghost says. "Forge them into one **toolkit**."`,
  concept:{
    html:`**Mission brief:** a text toolkit of five small, tested functions.\n\n- \`slugify(text)\` → lowercase, keep only letters, digits and spaces, tidy spaces, join words with \`-\`\n- \`title_words(text)\` → every word starts with a capital, the rest lowercase\n- \`count_vowels(text)\` → vowels \`aeiou\`, ignoring case\n- \`is_palindrome(text)\` → ignoring case and anything that is not a letter or digit\n- \`caesar(text, shift)\` → shift letters forward (negative shifts go back), keep case, leave other characters alone\n\nThen ask \`Text: \` and print:\n\n\`\`\`\nSlug: hello-world\nTitle: Hello World\nVowels: 3\nPalindrome: False\nCaesar: Khoor Zruog\n\`\`\`\n\n(the Caesar line shifts by **3**). Put the printing in \`main()\`.`,
    analogy:`A multi-tool: five blades, one handle.`,
    example:R`def title_words(text):
    return " ".join(w.capitalize() for w in text.split())

print(title_words("hELLO   wORLD"))`},
  predict:{code:R`print("hELLO".capitalize())`, q:'What prints?', opts:['Hello','HELLO','hELLO'], ans:0, why:'capitalize makes the first letter upper and the rest lower.'},
  cast:{code:R`def title_words(text):
    return " ".join(w.capitalize() for w in text.split())

print(title_words("hELLO   wORLD"))`, task:'Cast it.'},
  bug:{broken:R`def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            result += chr((ord(ch) - 97 + shift) % 26 + 97)
        else:
            result += ch
    return result

print(caesar("Abc", 3))`, task:'Capital letters get mangled. Keep the case: use the right base (65 or 97). Expected Def.',
    cases:[{inputs:[],tests:[['Prints Def','out.strip()=="Def"']]}],
    sol:R`def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            result += chr((ord(ch) - base + shift) % 26 + base)
        else:
            result += ch
    return result

print(caesar("Abc", 3))`, wrong:[R`def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            result += chr((ord(ch) - 97 + shift) % 26 + 97)
        else:
            result += ch
    return result

print(caesar("Abc", 3))`]},
  write:{prompt:'Build the toolkit from the brief: the five functions and a `main()` that asks `Text: ` and prints the five lines. Call `main()`.',
    starter:R`import re
`,
    inputs:['Hello World'],
    cases:[{inputs:['Hello World'],tests:[['Output','lines[-5:]==["Slug: hello-world","Title: Hello World","Vowels: 3","Palindrome: False","Caesar: Khoor Zruog"]'],['slugify','g["slugify"]("  Hello,   World! ")=="hello-world" and g["slugify"]("A  B")=="a-b"'],['title_words','g["title_words"]("hELLO   wORLD")=="Hello World"'],['count_vowels','g["count_vowels"]("Education")==5 and g["count_vowels"]("xyz")==0'],['is_palindrome','g["is_palindrome"]("A man, a plan, a canal: Panama") is True and g["is_palindrome"]("ab") is False'],['caesar','g["caesar"]("Abc xyz!", 3)=="Def abc!" and g["caesar"]("def", -3)=="abc"']]},{inputs:['Racecar'],tests:[['Palindrome','lines[-5:]==["Slug: racecar","Title: Racecar","Vowels: 3","Palindrome: True","Caesar: Udfhfdu"]']]}],
    sol:R`import re

def slugify(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return "-".join(text.split())

def title_words(text):
    return " ".join(w.capitalize() for w in text.split())

def count_vowels(text):
    return sum(1 for ch in text.lower() if ch in "aeiou")

def is_palindrome(text):
    cleaned = "".join(c for c in text.lower() if c.isalnum())
    return cleaned == cleaned[::-1]

def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            result += chr((ord(ch) - base + shift) % 26 + base)
        else:
            result += ch
    return result

def main():
    text = input("Text: ")
    print("Slug:", slugify(text))
    print("Title:", title_words(text))
    print("Vowels:", count_vowels(text))
    print("Palindrome:", is_palindrome(text))
    print("Caesar:", caesar(text, 3))

main()`,
    wrong:[R`import re

def slugify(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return "-".join(text.split())

def title_words(text):
    return " ".join(w.capitalize() for w in text.split())

def count_vowels(text):
    return sum(1 for ch in text if ch in "aeiou")

def is_palindrome(text):
    cleaned = "".join(c for c in text.lower() if c.isalnum())
    return cleaned == cleaned[::-1]

def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            result += chr((ord(ch) - base + shift) % 26 + base)
        else:
            result += ch
    return result

def main():
    text = input("Text: ")
    print("Slug:", slugify(text))
    print("Title:", title_words(text))
    print("Vowels:", count_vowels(text))
    print("Palindrome:", is_palindrome(text))
    print("Caesar:", caesar(text, 3))

main()`, R`import re

def slugify(text):
    text = re.sub(r"[^a-z0-9\s]", "", text.lower())
    return "-".join(text.split())

def title_words(text):
    return " ".join(w.capitalize() for w in text.split())

def count_vowels(text):
    return sum(1 for ch in text.lower() if ch in "aeiou")

def is_palindrome(text):
    return text == text[::-1]

def caesar(text, shift):
    result = ""
    for ch in text:
        if ch.isalpha():
            base = 65 if ch.isupper() else 97
            result += chr((ord(ch) - base + shift) % 26 + base)
        else:
            result += ch
    return result

def main():
    text = input("Text: ")
    print("Slug:", slugify(text))
    print("Title:", title_words(text))
    print("Vowels:", count_vowels(text))
    print("Palindrome:", is_palindrome(text))
    print("Caesar:", caesar(text, 3))

main()`],
    hints:['Reuse earlier lessons: re.sub for slugify, capitalize for titles, the cleaned-reverse trick for palindromes.','caesar: choose base 65 for capitals and 97 for lowercase, then (ord(ch) - base + shift) % 26 + base.','main(): ask Text, print the five labelled lines, caesar shift 3.','import re\n\ndef slugify(text):\n    text = re.sub(r"[^a-z0-9\\s]", "", text.lower())\n    return "-".join(text.split())\n\ndef title_words(text):\n    return " ".join(w.capitalize() for w in text.split())\n\ndef count_vowels(text):\n    return sum(1 for ch in text.lower() if ch in "aeiou")\n\ndef is_palindrome(text):\n    cleaned = "".join(c for c in text.lower() if c.isalnum())\n    return cleaned == cleaned[::-1]\n\ndef caesar(text, shift):\n    result = ""\n    for ch in text:\n        if ch.isalpha():\n            base = 65 if ch.isupper() else 97\n            result += chr((ord(ch) - base + shift) % 26 + base)\n        else:\n            result += ch\n    return result\n\ndef main():\n    text = input("Text: ")\n    print("Slug:", slugify(text))\n    print("Title:", title_words(text))\n    print("Vowels:", count_vowels(text))\n    print("Palindrome:", is_palindrome(text))\n    print("Caesar:", caesar(text, 3))\n\nmain()']},
  power:{can:['Build a reusable function library','Test each helper on its own'],
    expand:'Save these functions as your personal toolkit and reuse them in later missions.',
    where:'Every developer carries a personal toolkit of helpers like these.',
    next:'Next mission: a bank that uses functions and a dict of accounts.'},
  codex:{title:'Mission: text toolkit',body:'Five small tested functions plus a main() that demonstrates them.',snip:R`def slugify(text): ...`}
},
{
  id:'r6-32', realm:6, n:32, title:'Real-World Mission: The Little Bank',
  teaches:['mission6c'], requires:['mission6b','dict-edit'],
  story:`A merchant slides a ledger across the bench. "My customers keep their coins with me, but I do the sums on my fingers. Make me a **bank**." Ada nods at you. "Dicts for accounts, functions for rules."`,
  concept:{
    html:`**Mission brief:** a command-line bank. Keep \`accounts\` as a dict of name → balance. Loop asking \`Command: \`. Commands are split on spaces:\n\n| Command | Output |\n|---|---|\n| \`open ada\` | \`Opened ada\` (or \`Already exists\`) |\n| \`deposit ada 50\` | \`ada balance: 50.00\` |\n| \`withdraw ada 20\` | \`ada balance: 30.00\` or \`Insufficient funds\` |\n| \`balance ada\` | \`ada balance: 30.00\` |\n| \`quit\` | \`Bye\` then stop |\n\n**Errors:** unknown account → \`No such account\`; amount not a positive number → \`Invalid amount\`; anything else (wrong word, wrong number of parts) → \`Unknown command\`.\n\nAn amount is valid if, with one dot removed, it is all digits and greater than zero. Build it from small functions: \`is_amount(text)\`, \`deposit(accounts, name, amount)\`, \`withdraw(...)\` and a \`main()\` loop.`,
    analogy:`A shop ledger that talks back.`,
    example:R`accounts = {"ada": 0}
accounts["ada"] += 50
print(f"ada balance: {accounts['ada']:.2f}")`},
  predict:{code:R`print("12.5".replace(".", "", 1).isdigit(), "1.2.3".replace(".", "", 1).isdigit())`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'Removing one dot leaves digits for 12.5, but 1.2.3 still has a dot.'},
  cast:{code:R`accounts = {"ada": 0}
accounts["ada"] += 50
print(f"ada balance: {accounts['ada']:.2f}")`, task:'Cast it.'},
  bug:{broken:R`accounts = {"ada": 30.0}
amount = 50.0
if accounts["ada"] > amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")
accounts["ada"] = 50.0
amount = 50.0
if accounts["ada"] > amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")`, task:'Withdrawing exactly the whole balance should work (the second block should print ok). Fix the comparison in both.',
    cases:[{inputs:[],tests:[['Insufficient then ok','lines==["Insufficient funds","ok"]']]}],
    sol:R`accounts = {"ada": 30.0}
amount = 50.0
if accounts["ada"] >= amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")
accounts["ada"] = 50.0
amount = 50.0
if accounts["ada"] >= amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")`, wrong:[R`accounts = {"ada": 30.0}
amount = 50.0
if accounts["ada"] > amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")
accounts["ada"] = 50.0
amount = 50.0
if accounts["ada"] > amount:
    accounts["ada"] -= amount
    print("ok")
else:
    print("Insufficient funds")`]},
  write:{prompt:'Build the bank from the brief. Use exact messages. Keep the helpers small.',
    starter:R`accounts = {}
`,
    inputs:['open ada','deposit ada 50','withdraw ada 20','balance ada','quit'],
    cases:[{inputs:['open ada','deposit ada 50','withdraw ada 20','balance ada','quit'],tests:[['Happy path','[l for l in lines if not l.startswith("Command: ")]==["Opened ada","ada balance: 50.00","ada balance: 30.00","ada balance: 30.00","Bye"]']]},{inputs:['open ada','open ada','withdraw ada 5','deposit bo 5','deposit ada x','deposit ada -5','hello','quit'],tests:[['Errors','[l for l in lines if not l.startswith("Command: ")]==["Opened ada","Already exists","Insufficient funds","No such account","Invalid amount","Invalid amount","Unknown command","Bye"]']]},{inputs:['open bo','deposit bo 0','deposit bo 12.5','withdraw bo 12.5','deposit bo','','balance zed','quit'],tests:[['Edge cases','[l for l in lines if not l.startswith("Command: ")]==["Opened bo","Invalid amount","bo balance: 12.50","bo balance: 0.00","Unknown command","Unknown command","No such account","Bye"]']]},{inputs:['quit'],tests:[['Quit at once','[l for l in lines if not l.startswith("Command: ")]==["Bye"]']]}],
    sol:R`accounts = {}

def is_amount(text):
    return text.replace(".", "", 1).isdigit() and float(text) > 0

def show(name):
    print(f"{name} balance: {accounts[name]:.2f}")

def deposit(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    else:
        accounts[name] += float(text)
        show(name)

def withdraw(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    elif float(text) > accounts[name]:
        print("Insufficient funds")
    else:
        accounts[name] -= float(text)
        show(name)

def main():
    while True:
        parts = input("Command: ").split()
        if parts == ["quit"]:
            print("Bye")
            break
        if len(parts) == 2 and parts[0] == "open":
            if parts[1] in accounts:
                print("Already exists")
            else:
                accounts[parts[1]] = 0.0
                print("Opened", parts[1])
        elif len(parts) == 3 and parts[0] == "deposit":
            deposit(parts[1], parts[2])
        elif len(parts) == 3 and parts[0] == "withdraw":
            withdraw(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "balance":
            if parts[1] in accounts:
                show(parts[1])
            else:
                print("No such account")
        else:
            print("Unknown command")

main()`,
    wrong:[R`accounts = {}

def is_amount(text):
    return text.replace(".", "", 1).isdigit()

def show(name):
    print(f"{name} balance: {accounts[name]:.2f}")

def deposit(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    else:
        accounts[name] += float(text)
        show(name)

def withdraw(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    elif float(text) > accounts[name]:
        print("Insufficient funds")
    else:
        accounts[name] -= float(text)
        show(name)

def main():
    while True:
        parts = input("Command: ").split()
        if parts == ["quit"]:
            print("Bye")
            break
        if len(parts) == 2 and parts[0] == "open":
            if parts[1] in accounts:
                print("Already exists")
            else:
                accounts[parts[1]] = 0.0
                print("Opened", parts[1])
        elif len(parts) == 3 and parts[0] == "deposit":
            deposit(parts[1], parts[2])
        elif len(parts) == 3 and parts[0] == "withdraw":
            withdraw(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "balance":
            if parts[1] in accounts:
                show(parts[1])
            else:
                print("No such account")
        else:
            print("Unknown command")

main()`, R`accounts = {}

def is_amount(text):
    return text.replace(".", "", 1).isdigit() and float(text) > 0

def show(name):
    print(f"{name} balance: {accounts[name]:.2f}")

def deposit(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    else:
        accounts[name] += float(text)
        show(name)

def withdraw(name, text):
    if name not in accounts:
        print("No such account")
    elif not is_amount(text):
        print("Invalid amount")
    elif float(text) >= accounts[name]:
        print("Insufficient funds")
    else:
        accounts[name] -= float(text)
        show(name)

def main():
    while True:
        parts = input("Command: ").split()
        if parts == ["quit"]:
            print("Bye")
            break
        if len(parts) == 2 and parts[0] == "open":
            if parts[1] in accounts:
                print("Already exists")
            else:
                accounts[parts[1]] = 0.0
                print("Opened", parts[1])
        elif len(parts) == 3 and parts[0] == "deposit":
            deposit(parts[1], parts[2])
        elif len(parts) == 3 and parts[0] == "withdraw":
            withdraw(parts[1], parts[2])
        elif len(parts) == 2 and parts[0] == "balance":
            if parts[1] in accounts:
                show(parts[1])
            else:
                print("No such account")
        else:
            print("Unknown command")

main()`],
    hints:['accounts is a dict name → balance. is_amount checks digits after removing one dot, and > 0.','Write deposit and withdraw helpers that check: account exists, amount valid, enough money.','main(): split the command; test the word and the number of parts; else Unknown command.','accounts = {}\n\ndef is_amount(text):\n    return text.replace(".", "", 1).isdigit() and float(text) > 0\n\ndef show(name):\n    print(f"{name} balance: {accounts[name]:.2f}")\n\ndef deposit(name, text):\n    if name not in accounts:\n        print("No such account")\n    elif not is_amount(text):\n        print("Invalid amount")\n    else:\n        accounts[name] += float(text)\n        show(name)\n\ndef withdraw(name, text):\n    if name not in accounts:\n        print("No such account")\n    elif not is_amount(text):\n        print("Invalid amount")\n    elif float(text) > accounts[name]:\n        print("Insufficient funds")\n    else:\n        accounts[name] -= float(text)\n        show(name)\n\ndef main():\n    while True:\n        parts = input("Command: ").split()\n        if parts == ["quit"]:\n            print("Bye")\n            break\n        if len(parts) == 2 and parts[0] == "open":\n            if parts[1] in accounts:\n                print("Already exists")\n            else:\n                accounts[parts[1]] = 0.0\n                print("Opened", parts[1])\n        elif len(parts) == 3 and parts[0] == "deposit":\n            deposit(parts[1], parts[2])\n        elif len(parts) == 3 and parts[0] == "withdraw":\n            withdraw(parts[1], parts[2])\n        elif len(parts) == 2 and parts[0] == "balance":\n            if parts[1] in accounts:\n                show(parts[1])\n            else:\n                print("No such account")\n        else:\n            print("Unknown command")\n\nmain()']},
  power:{can:['Model a real system with a dict and functions','Validate every command and report clear errors'],
    expand:'Add a transfer command: transfer ada bo 10.',
    where:'This is the shape of real order systems, inventory tools and games.',
    next:'Next: functions that remember, with closures.'},
  codex:{title:'Mission: bank',body:'A dict of accounts, small helper functions for rules, and a command loop in main().',snip:R`parts = input("Command: ").split()`}
},
{
  id:'r6-33', realm:6, n:33, title:'Closures: functions that remember',
  teaches:['fn-closure'], requires:['mission6c'],
  story:`Ada dips a blank blade in a mould and it comes out with a pattern built in. "You can have a function **make** other functions," she says, "and each remembers the mould it came from."`,
  concept:{
    html:`A function can **return another function**. The inner function **remembers** the variables around it:\n\n\`\`\`\ndef make_multiplier(n):\n    def multiply(x):\n        return x * n       # n is remembered\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\ndouble(5)    # 10\ntriple(5)    # 15\n\`\`\`\n\n- \`make_multiplier\` is a **function factory**.\n- Each call builds a new function with its own \`n\`.\n- This remembered environment is a **closure**.\n\nNotice we returned \`multiply\` (no brackets): we hand back the function itself.`,
    analogy:`A stamp-maker: each stamp it produces has its own pattern baked in.`,
    example:R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))`},
  predict:{code:R`def make_adder(n):
    def add(x):
        return x + n
    return add

a = make_adder(10)
print(a(1))`, q:'What prints?', opts:['11','10','1'], ans:0, why:'a remembers n=10, so a(1) is 11.'},
  cast:{code:R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)
print(double(5), triple(5))`, task:'Cast it.'},
  bug:{broken:R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply(1)

double = make_multiplier(2)
print(double(5))`, task:'TypeError: it returned a RESULT (multiply(1)) not the function. Return the function itself.',
    cases:[{inputs:[],tests:[['Prints 10','out.strip()=="10"']]}],
    sol:R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

double = make_multiplier(2)
print(double(5))`, wrong:[R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply(1)

double = make_multiplier(2)
print(double(5))`]},
  write:{prompt:'Define `make_greeter(greeting)` that returns a function taking a name and returning `greeting + ", " + name + "!"`. Create `hello = make_greeter("Hello")` and `hey = make_greeter("Hey")`, then print `hello("Ada")` and `hey("Bo")`.',
    starter:R`# define make_greeter
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Hello, Ada!","Hey, Bo!"]'],['Factory','g["make_greeter"]("Yo")("Cy")=="Yo, Cy!"'],['Independent','g["make_greeter"]("A")("x")=="A, x!" and g["make_greeter"]("B")("x")=="B, x!"']]}],
    sol:R`def make_greeter(greeting):
    def greet(name):
        return greeting + ", " + name + "!"
    return greet

hello = make_greeter("Hello")
hey = make_greeter("Hey")
print(hello("Ada"))
print(hey("Bo"))`,
    wrong:[R`def make_greeter(greeting):
    def greet(name):
        return "Hello, " + name + "!"
    return greet

hello = make_greeter("Hello")
hey = make_greeter("Hey")
print(hello("Ada"))
print(hey("Bo"))`, R`def make_greeter(greeting):
    return greeting

hello = make_greeter("Hello")
print("Hello, Ada!")
print("Hey, Bo!")`],
    hints:['Define an inner function that takes name.','The inner function uses greeting from outside; return the inner function without brackets.','Make two greeters and call them.','def make_greeter(greeting):\n    def greet(name):\n        return greeting + ", " + name + "!"\n    return greet\n\nhello = make_greeter("Hello")\nhey = make_greeter("Hey")\nprint(hello("Ada"))\nprint(hey("Bo"))']},
  power:{can:['Return functions from functions','Build customised function factories'],
    expand:'Write make_power(exp) so cube = make_power(3) and cube(2) is 8.',
    where:'Decorators, callbacks and configuration helpers are built on closures.',
    next:'Next: a dispatch table, replacing long if/elif chains.'},
  codex:{title:'Closures',body:'An inner function remembers the outer variables. Return it without brackets.',snip:R`def make_adder(n):
    def add(x): return x + n
    return add`}
},
{
  id:'r6-34', realm:6, n:34, title:'Dispatch tables: a dict of functions',
  teaches:['fn-dispatch'], requires:['fn-closure','dict-get'],
  story:`"A long chain of if and elif is a signpost with forty arrows," Ada says. She hangs a board of labelled hooks, each holding a tool. "Look up the label, grab the tool, use it."`,
  concept:{
    html:`Instead of a long \`if/elif\` chain, map **names to functions** in a dict:\n\n\`\`\`\ndef add(a, b): return a + b\ndef sub(a, b): return a - b\n\nOPS = {"+": add, "-": sub}\n\nop = "+"\nif op in OPS:\n    print(OPS[op](3, 4))     # look up, then call\nelse:\n    print("Unknown operator")\n\`\`\`\n\n- \`OPS[op]\` is the function; \`OPS[op](3, 4)\` calls it.\n- Adding a feature = one function + one dict entry.\n- Use \`.get(op)\` to get \`None\` instead of a KeyError.\n\nThis is called a **dispatch table**, and it keeps code flat and easy to extend.`,
    analogy:`A switchboard: dial a label, get connected to the right worker.`,
    example:R`def add(a, b):
    return a + b

def sub(a, b):
    return a - b

OPS = {"+": add, "-": sub}
print(OPS["+"](3, 4))
print(OPS.get("*"))`},
  predict:{code:R`ops = {"up": str.upper, "low": str.lower}
print(ops["up"]("abc"))`, q:'What prints?', opts:['ABC','abc','up'], ans:0, why:'ops["up"] is str.upper, which is then called on "abc".'},
  cast:{code:R`def add(a, b):
    return a + b

def sub(a, b):
    return a - b

OPS = {"+": add, "-": sub}
print(OPS["+"](3, 4))
print(OPS.get("*"))`, task:'Cast it.'},
  bug:{broken:R`def add(a, b):
    return a + b

OPS = {"+": add}
print(OPS["+"](2, 3))
print(OPS["*"](2, 3))`, task:'KeyError for "*". Only call it if the operator exists; otherwise print Unknown operator. Expected: 5 then Unknown operator.',
    cases:[{inputs:[],tests:[['Printed','lines==["5","Unknown operator"]']]}],
    sol:R`def add(a, b):
    return a + b

OPS = {"+": add}
print(OPS["+"](2, 3))
if "*" in OPS:
    print(OPS["*"](2, 3))
else:
    print("Unknown operator")`, wrong:[R`def add(a, b):
    return a + b

OPS = {"+": add}
print(OPS["+"](2, 3))
print(OPS["*"](2, 3))`]},
  write:{prompt:'Build a calculator with a dispatch table. Define `add`, `sub`, `mul`, `div` and a dict `OPS` for `+ - * /`. Ask `Expr: ` like `3 + 4`. Print `Result: 7.0`. Division by zero prints `Cannot divide by zero`; an unknown operator prints `Unknown operator`. **No `elif` allowed.**',
    starter:R`# define add, sub, mul, div and OPS
`,
    inputs:['3 + 4'],
    cases:[{inputs:['3 + 4'],tests:[['Add','lines[-1]=="Result: 7.0"'],['OPS table','g["OPS"]["+"](2,3)==5 and g["OPS"]["-"](5,2)==3 and g["OPS"]["*"](2,3)==6 and g["OPS"]["/"](6,3)==2'],['No elif','"elif" not in src']]},{inputs:['10 / 4'],tests:[['Divide','lines[-1]=="Result: 2.5"']]},{inputs:['6 * 7'],tests:[['Multiply','lines[-1]=="Result: 42.0"']]},{inputs:['9 - 12'],tests:[['Negative','lines[-1]=="Result: -3.0"']]},{inputs:['5 / 0'],tests:[['Zero','lines[-1]=="Cannot divide by zero"']]},{inputs:['2 ^ 3'],tests:[['Unknown','lines[-1]=="Unknown operator"']]}],
    sol:R`def add(a, b):
    return a + b

def sub(a, b):
    return a - b

def mul(a, b):
    return a * b

def div(a, b):
    return a / b

OPS = {"+": add, "-": sub, "*": mul, "/": div}

a, op, b = input("Expr: ").split()
a, b = float(a), float(b)
if op not in OPS:
    print("Unknown operator")
else:
    if op == "/" and b == 0:
        print("Cannot divide by zero")
    else:
        print("Result:", OPS[op](a, b))`,
    wrong:[R`def add(a, b):
    return a + b

def sub(a, b):
    return a - b

def mul(a, b):
    return a * b

def div(a, b):
    return a / b

OPS = {"+": add, "-": sub, "*": mul, "/": div}

a, op, b = input("Expr: ").split()
a, b = float(a), float(b)
if op not in OPS:
    print("Unknown operator")
elif b == 0:
    print("Cannot divide by zero")
else:
    print("Result:", OPS[op](a, b))`, R`def add(a, b):
    return a + b

def sub(a, b):
    return a - b

def mul(a, b):
    return a * b

def div(a, b):
    return a / b

OPS = {"+": add, "-": sub, "*": mul, "/": div}

a, op, b = input("Expr: ").split()
a, b = float(a), float(b)
if op == "+":
    print("Result:", add(a, b))
elif op == "-":
    print("Result:", sub(a, b))
else:
    print("Unknown operator")`],
    hints:['Each operation is a tiny function; OPS maps the symbol to the function.','Split the input into a, op, b and convert a and b to float.','Check: unknown operator, then divide-by-zero, then print OPS[op](a, b). That uses plain if / elif only for errors... use nested ifs or `if/if/else` instead of elif.','def add(a, b):\n    return a + b\n\ndef sub(a, b):\n    return a - b\n\ndef mul(a, b):\n    return a * b\n\ndef div(a, b):\n    return a / b\n\nOPS = {"+": add, "-": sub, "*": mul, "/": div}\n\na, op, b = input("Expr: ").split()\na, b = float(a), float(b)\nif op not in OPS:\n    print("Unknown operator")\nelse:\n    if op == "/" and b == 0:\n        print("Cannot divide by zero")\n    else:\n        print("Result:", OPS[op](a, b))']},
  power:{can:['Replace if/elif chains with a lookup table','Add features by adding dict entries'],
    expand:'Add a "**" power operator and a "%" remainder with two lines.',
    where:'Command routers, plugin systems and state machines all use dispatch tables.',
    next:'Boss time: the Tangled Anvil.'},
  codex:{title:'Dispatch table',body:'Map names to functions in a dict, look up and call. Use `in` to guard unknown names.',snip:R`OPS[op](a, b)`}
},
{
  id:'r6-35', realm:6, n:35, title:'Boss: The Tangled Anvil', kind:'boss',
  teaches:['realm6-boss'], requires:['fn-dispatch','fn-mutdef','fn-args'],
  story:`The forge roars out of control. Hammers swing themselves, tongs snap, and from the coals climbs the **Tangled Anvil**: a giant knot of half-finished functions that call each other in circles. "Every spell you ever forged is in there," Ada shouts. "Untangle it, one clean function at a time!"`,
  boss:{name:'The Tangled Anvil', hp:5},
  phases:[
    {type:'mcq', code:R`def f(x):
    x * 2

print(f(4))`, q:'Strike 1: What prints?', opts:['None','8','4'], ans:0,
     why:'No return statement, so the function gives back None.', tags:['r6-03','r6-04']},
    {type:'write', prompt:'Strike 2: Ask `Numbers: ` (whole numbers separated by spaces). Define `summary(*nums)` returning `(lowest, highest, total)`. Print `Low: a High: b Total: c`.',
     starter:R`# define summary(*nums)
text = input("Numbers: ")
`,
     inputs:['4 9 2 7'],
     cases:[{inputs:['4 9 2 7'],tests:[['Mixed','lines[-1]=="Low: 2 High: 9 Total: 22"'],['summary works','g["summary"](3,1,2)==(1,3,6)']]},{inputs:['5'],tests:[['Single','lines[-1]=="Low: 5 High: 5 Total: 5"']]},{inputs:['-3 8'],tests:[['Negative','lines[-1]=="Low: -3 High: 8 Total: 5"']]}],
     sol:R`def summary(*nums):
    return min(nums), max(nums), sum(nums)

text = input("Numbers: ")
nums = [int(n) for n in text.split()]
low, high, total = summary(*nums)
print(f"Low: {low} High: {high} Total: {total}")`,
     wrong:[R`def summary(*nums):
    return min(nums), max(nums), sum(nums)

text = input("Numbers: ")
nums = [int(n) for n in text.split()]
low, high, total = summary(nums)
print(f"Low: {low} High: {high} Total: {total}")`, R`def summary(nums):
    return min(nums), max(nums), sum(nums)

text = input("Numbers: ")
nums = [int(n) for n in text.split()]
low, high, total = summary(nums)
print(f"Low: {low} High: {high} Total: {total}")`],
     hints:['Use def summary(*nums) so any count works.','Convert the input to ints, then call summary(*nums) to unpack.','Unpack the returned tuple into low, high, total.','def summary(*nums):\n    return min(nums), max(nums), sum(nums)\n\ntext = input("Numbers: ")\nnums = [int(n) for n in text.split()]\nlow, high, total = summary(*nums)\nprint(f"Low: {low} High: {high} Total: {total}")'], tags:['r6-19','r6-08']},
    {type:'mcq', code:R`def f(x, items=[]):
    items.append(x)
    return items

f(1)
print(f(2))`, q:'Strike 3: What prints?', opts:['[1, 2]','[2]','[1]'], ans:0,
     why:'The default list is created once and shared by every call.', tags:['r6-21']},
    {type:'write', prompt:'Strike 4: Ask `Words: ` (space-separated). Print the words sorted by **length, then A-Z**, joined with spaces. Use `sorted` with a `lambda` key.',
     starter:R`words = input("Words: ").split()
`,
     inputs:['pear fig apple kiwi date'],
     cases:[{inputs:['pear fig apple kiwi date'],tests:[['Sorted','lines[-1]=="fig date kiwi pear apple"'],['Uses lambda','"lambda" in src']]},{inputs:['b a'],tests:[['Ties A-Z','lines[-1]=="a b"']]},{inputs:['ccc a bb'],tests:[['By length','lines[-1]=="a bb ccc"']]},{inputs:['solo'],tests:[['One word','lines[-1]=="solo"']]}],
     sol:R`words = input("Words: ").split()
print(" ".join(sorted(words, key=lambda w: (len(w), w))))`,
     wrong:[R`words = input("Words: ").split()
print(" ".join(sorted(words, key=len)))`, R`words = input("Words: ").split()
print(" ".join(sorted(words)))`],
     hints:['sorted(words, key=...) with a tuple key.','key=lambda w: (len(w), w)','Join with spaces and print.','words = input("Words: ").split()\nprint(" ".join(sorted(words, key=lambda w: (len(w), w))))'], tags:['r6-23','r4-38']},
    {type:'mcq', code:R`def make_adder(n):
    def add(x):
        return x + n
    return add

add5 = make_adder(5)
print(add5(10))`, q:'Strike 5: What prints?', opts:['15','5','10'], ans:0,
     why:'add5 remembers n=5, so add5(10) is 15.', tags:['r6-33']}
  ],
  power:{can:['Write, test and combine functions with confidence','Spot the classic function traps'],
    expand:'Rebuild strike 2 with a docstring, type hints and three assert tests.',
    where:'Functions are the unit of work in every language you will ever learn.',
    next:'One more gate: the Gap Check for the Spell Forge.'},
  codex:{title:'Realm 6 boss',body:'You can design functions with parameters, defaults, *args, closures and tests, and avoid the classic traps.',snip:R`def summary(*nums): ...`}
},
{
  id:'r6-36', realm:6, n:36, title:'Gap Check: the Forge Trial', kind:'gap', passPct:80,
  teaches:['realm6-gap'], requires:['realm6-boss'],
  story:`The Anvil quiets into a heap of neat, labelled tools. Ada lays a slate on the bench. "Eighty percent. Then you are ready for the **Wards**, where programs learn to fail gracefully, and to call themselves."`,
  phases:[
    {type:'mcq', code:R`def hello():
    print("Hi")

print("start")`, q:'What prints?', opts:['start','Hi\nstart','start\nHi'], ans:0, why:'hello is defined but never called.', tags:['r6-01']},
    {type:'mcq', code:R`def add(a, b):
    print(a + b)

x = add(2, 3)
print(x)`, q:'What does the LAST line print?', opts:['None','5','Error'], ans:0, why:'add prints but returns nothing, so x is None.', tags:['r6-04']},
    {type:'mcq', code:R`def greet(name, greeting="Hi"):
    return f"{greeting}, {name}"

print(greet("Ada"))`, q:'What prints?', opts:['Hi, Ada','Ada, Hi','TypeError'], ans:0, why:'greeting uses its default.', tags:['r6-06']},
    {type:'mcq', code:R`def f(a, b=2, c=3):
    return a + b + c

print(f(1, c=10))`, q:'What prints?', opts:['13','6','14'], ans:0, why:'a=1, b=2 (default), c=10.', tags:['r6-07']},
    {type:'mcq', code:R`def f():
    return 1, 2

a, b = f()
print(b)`, q:'What prints?', opts:['2','1','(1, 2)'], ans:0, why:'The tuple is unpacked into a and b.', tags:['r6-08']},
    {type:'mcq', code:R`def f():
    inside = 5

f()
print(inside)`, q:'What happens?', opts:['NameError','5','None'], ans:0, why:'inside is local to f.', tags:['r6-11']},
    {type:'mcq', code:R`def f(*items):
    return len(items)

print(f(4, 5, 6))`, q:'What prints?', opts:['3','1','6'], ans:0, why:'items is the tuple (4, 5, 6).', tags:['r6-19']},
    {type:'mcq', code:R`def f(x, items=[]):
    items.append(x)
    return items

print(f(1), f(2))`, q:'What prints?', opts:['[1, 2] [1, 2]','[1] [2]','[1] [1, 2]'], ans:0, why:'Both calls share and return the SAME default list, which ends as [1, 2].', tags:['r6-21']},
    {type:'mcq', code:R`words = ["bb", "a", "ccc"]
print(sorted(words, key=lambda w: -len(w)))`, q:'What prints?', opts:["['ccc', 'bb', 'a']","['a', 'bb', 'ccc']","['bb', 'a', 'ccc']"], ans:0, why:'Negative length sorts longest first.', tags:['r6-23']},
    {type:'mcq', code:R`print(list(map(lambda n: n + 1, [1, 2, 3])))`, q:'What prints?', opts:['[2, 3, 4]','[1, 2, 3]','<map object>'], ans:0, why:'map applies the function to every item; list() shows the results.', tags:['r6-24']},
    {type:'write', pts:2, prompt:'Final trial: define `ask_choice(prompt, options)` that keeps asking until the answer, after `.strip().lower()`, is in `options`, printing `Try again` after each bad answer, and **returns** the cleaned answer. Use it: `color = ask_choice("Colour: ", ["red", "green", "blue"])` then `print("You chose", color)`.',
     starter:R`# define ask_choice, then use it
`,
     inputs:['purple','  RED '],
     cases:[{inputs:['purple','  RED '],tests:[['One retry','lines.count("Try again")==1 and lines[-1]=="You chose red"']]},{inputs:['blue'],tests:[['Straight in','lines[-1]=="You chose blue" and "Try again" not in lines']]},{inputs:['x','y','GREEN'],tests:[['Two retries','lines.count("Try again")==2 and lines[-1]=="You chose green"']]},{inputs:['  Blue  '],tests:[['Trims','lines[-1]=="You chose blue"']]}],
     sol:R`def ask_choice(prompt, options):
    while True:
        answer = input(prompt).strip().lower()
        if answer in options:
            return answer
        print("Try again")

color = ask_choice("Colour: ", ["red", "green", "blue"])
print("You chose", color)`,
     wrong:[R`def ask_choice(prompt, options):
    while True:
        answer = input(prompt).strip()
        if answer in options:
            return answer
        print("Try again")

color = ask_choice("Colour: ", ["red", "green", "blue"])
print("You chose", color)`, R`def ask_choice(prompt, options):
    answer = input(prompt).strip().lower()
    if answer in options:
        return answer
    print("Try again")

color = ask_choice("Colour: ", ["red", "green", "blue"])
print("You chose", color)`],
     hints:['A while True loop that asks and cleans the answer: input(prompt).strip().lower().','If answer in options: return answer. Otherwise print Try again.','Call it with the colour list and print the result.','def ask_choice(prompt, options):\n    while True:\n        answer = input(prompt).strip().lower()\n        if answer in options:\n            return answer\n        print("Try again")\n\ncolor = ask_choice("Colour: ", ["red", "green", "blue"])\nprint("You chose", color)'], tags:['r6-16','r5-04','r5-03']}
  ],
  power:{can:['Design, document and test reusable functions','Avoid the classic function bugs'],
    expand:'Retake any lesson from the Training Grounds to sharpen your weakest spot.',
    where:'You now write code the way professionals do: in small, named, testable pieces. A true Smith.',
    next:'Realm 7: the Wards - recursion and graceful failure.'},
  codex:{title:'Forge Trial passed',body:'Functions are the building block of every program: parameters, returns, scope, defaults, *args, lambdas, closures and tests.',snip:R`def ask_choice(prompt, options): ...`}
}
);
