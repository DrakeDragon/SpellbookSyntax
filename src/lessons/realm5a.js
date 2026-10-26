// REALM 5 — SCROLLS & INK — part A (lessons 1-8)
LESSONS.push(
{
  id:'r5-01', realm:5, n:1, title:'Text is a row of letters',
  teaches:['str-seq'], requires:['realm4-gap','slicing'],
  story:`Beyond the Bazaar lies the **Scriptorium**, a hall of whispering scrolls. Turing's Ghost floats between the shelves, a quill in one translucent hand. "Welcome, Journeyman. Everything here is text. And text, as it turns out, is just a **list in disguise**."`,
  concept:{
    html:`A text value (a **string**) is a row of characters. Everything you learned about lists works on it:\n\n\`\`\`\nword = "python"\nword[0]       # 'p'   first\nword[-1]      # 'n'   last\nword[1:4]     # 'yth' slice\nlen(word)     # 6\nfor ch in word:\n    print(ch)\n\`\`\`\n\nSpaces, digits and punctuation are characters too. \`"a b"\` has **3** characters.`,
    analogy:`Beads on a string, each in a numbered slot.`,
    example:R`word = "python"
print(word[0], word[-1])
print(word[1:4])
print(len(word))`},
  predict:{code:R`w = "wizard"
print(w[1:3])`, q:'What prints?', opts:['iz','izar','wi'], ans:0, why:'Positions 1 and 2: i and z. The stop is excluded.'},
  cast:{code:R`word = "python"
print(word[0], word[-1])
print(word[1:4])
print(len(word))`, task:'Cast it. Try your own word.'},
  bug:{broken:R`word = "python"
print(word[6])`, task:'IndexError: the last position of a 6-letter word is 5. Print the last letter in a way that always works.',
    cases:[{inputs:[],tests:[['Prints n','out.strip()=="n"'],['Uses -1','"[-1]" in src']]}],
    sol:R`word = "python"
print(word[-1])`, wrong:[R`word = "python"
print(word[6])`]},
  write:{prompt:'Ask `Word: ` (at least 3 letters). Print `First: x`, `Last: y`, `Length: n` and `Middle: z` (everything except the first and last letter).',
    starter:R`w = input("Word: ")
`,
    inputs:['python'],
    cases:[{inputs:['python'],tests:[['python','lines[1:]==["First: p","Last: n","Length: 6","Middle: ytho"]']]},{inputs:['abc'],tests:[['abc','lines[1:]==["First: a","Last: c","Length: 3","Middle: b"]']]},{inputs:['wizard'],tests:[['wizard','lines[1:]==["First: w","Last: d","Length: 6","Middle: izar"]']]}],
    sol:R`w = input("Word: ")
print("First:", w[0])
print("Last:", w[-1])
print("Length:", len(w))
print("Middle:", w[1:-1])`,
    wrong:[R`w = input("Word: ")
print("First: p")
print("Last: n")
print("Length: 6")
print("Middle: ytho")`, R`w = input("Word: ")
print("First:", w[0])
print("Last:", w[-2])
print("Length:", len(w))
print("Middle:", w[1:-1])`],
    hints:['w[0] is the first letter, w[-1] the last.','len(w) is the length. The middle is w[1:-1].','Print each with its label.','w = input("Word: ")\nprint("First:", w[0])\nprint("Last:", w[-1])\nprint("Length:", len(w))\nprint("Middle:", w[1:-1])']},
  power:{can:['Pick out any letter or chunk of a text','Reuse all your list skills on text'],
    expand:'Print every second letter with w[::2], or loop over the letters and count the vowels.',
    where:'Initials, file extensions, ID prefixes and postcodes are all slices of text.',
    next:'Next: why you cannot change a letter in place.'},
  codex:{title:'Strings are sequences',body:'Index, slice, len and for-loops all work on text.',snip:R`word[0]  word[-1]  word[1:4]  len(word)`}
},
{
  id:'r5-02', realm:5, n:2, title:'Text cannot be edited in place',
  teaches:['str-immut'], requires:['str-seq','mutability'],
  story:`"Try fixing a typo directly on the scroll," Turing's Ghost whispers. The ink refuses, hissing. "Scrolls are **sealed**. To fix one you write a *new* scroll."`,
  concept:{
    html:`Strings are **immutable**: you can read a letter but not overwrite it.\n\n\`\`\`\nword = "cat"\nword[0] = "b"     # TypeError: 'str' object does not support item assignment\n\`\`\`\n\nInstead **build a new string** and assign it back:\n\n\`\`\`\nword = "b" + word[1:]     # 'bat'\n\`\`\`\n\nEvery string method returns a **new** string; the original is unchanged until *you* assign the result.`,
    analogy:`A printed page: you cannot erase one letter, you print a fresh page.`,
    example:R`word = "cat"
new = "b" + word[1:]
print(word, new)`},
  predict:{code:R`s = "hello"
s.upper()
print(s)`, q:'What prints?', opts:['hello','HELLO','Error'], ans:0, why:'upper() returns a new string, but nothing saved it. s is unchanged.'},
  cast:{code:R`word = "cat"
word[0] = "b"`, task:'Cast it and read the error.', expectError:true},
  bug:{broken:R`word = "cat"
word[0] = "b"
print(word)`, task:'TypeError. Build the new word "bat" with a slice instead.',
    cases:[{inputs:[],tests:[['Prints bat','out.strip()=="bat"'],['No item assignment','"[0] =" not in src']]}],
    sol:R`word = "cat"
word = "b" + word[1:]
print(word)`, wrong:[R`word = "cat"
word[0] = "b"
print(word)`]},
  write:{prompt:'Ask `Word: ` and print it with the **first letter replaced by X** (build a new string with a slice).',
    starter:R`w = input("Word: ")
`,
    inputs:['level'],
    cases:[{inputs:['level'],tests:[['level','lines[-1]=="Xevel"']]},{inputs:['a'],tests:[['single letter','lines[-1]=="X"']]},{inputs:['banana'],tests:[['banana','lines[-1]=="Xanana"']]}],
    sol:R`w = input("Word: ")
print("X" + w[1:])`,
    wrong:[R`w = input("Word: ")
print(w.replace(w[0], "X"))`, R`w = input("Word: ")
print("Xevel")`],
    hints:['You cannot assign to w[0].','Everything after the first letter is w[1:].','"X" + w[1:]','w = input("Word: ")\nprint("X" + w[1:])']},
  power:{can:['Edit text by building a new string','Predict when a method result is thrown away'],
    expand:'Swap the first and last letters of a word using slices.',
    where:'Masking card numbers ("****1234") and censoring words use this trick.',
    next:'Next: the case-changing spells.'},
  codex:{title:'Immutable strings',body:'You cannot change a letter in place. Build a new string and assign it.',snip:R`word = "b" + word[1:]`}
},
{
  id:'r5-03', realm:5, n:3, title:'Upper, lower and title',
  teaches:['str-case'], requires:['str-immut'],
  story:`A scroll arrives with the name *aDa lOvElAcE* scrawled on it. "Sloppy capitals," sighs Turing's Ghost. "Clean text is the first spell every scribe learns."`,
  concept:{
    html:`Case methods return a **new** string:\n\n| Method | Result for \`"aDa lOve"\` |\n|---|---|\n| \`.upper()\` | \`ADA LOVE\` |\n| \`.lower()\` | \`ada love\` |\n| \`.title()\` | \`Ada Love\` |\n| \`.capitalize()\` | \`Ada love\` |\n\n**Comparing without caring about case:** lower both sides.\n\n\`\`\`\nif answer.lower() == "yes":\n\`\`\``,
    analogy:`A text-flavoured dimmer switch.`,
    example:R`name = "aDa lOvElAcE"
print(name.title())
print(name.upper())
print(name.lower())`},
  predict:{code:R`print("hello world".title())`, q:'What prints?', opts:['Hello World','Hello world','HELLO WORLD'], ans:0, why:'title() capitalises every word.'},
  cast:{code:R`name = "aDa lOvElAcE"
print(name.title())
print(name.upper())
print(name.lower())`, task:'Cast it.'},
  bug:{broken:R`answer = "YES"
if answer == "yes":
    print("Agreed")
else:
    print("Disagreed")`, task:'It says Disagreed for "YES". Make the comparison ignore case.',
    cases:[{inputs:[],tests:[['Agreed','out.strip()=="Agreed"'],['Uses lower','".lower()" in src']]}],
    sol:R`answer = "YES"
if answer.lower() == "yes":
    print("Agreed")
else:
    print("Disagreed")`, wrong:[R`answer = "YES"
if answer == "yes":
    print("Agreed")
else:
    print("Disagreed")`]},
  write:{prompt:'Ask `Name: ` and print `Title: ...`, `Upper: ...` and `Lower: ...` versions.',
    starter:R`name = input("Name: ")
`,
    inputs:['aDa lOvElAcE'],
    cases:[{inputs:['aDa lOvElAcE'],tests:[['Ada','lines[1:]==["Title: Ada Lovelace","Upper: ADA LOVELACE","Lower: ada lovelace"]']]},{inputs:['hOPPER'],tests:[['Hopper','lines[1:]==["Title: Hopper","Upper: HOPPER","Lower: hopper"]']]}],
    sol:R`name = input("Name: ")
print("Title:", name.title())
print("Upper:", name.upper())
print("Lower:", name.lower())`,
    wrong:[R`name = input("Name: ")
print("Title:", name.capitalize())
print("Upper:", name.upper())
print("Lower:", name.lower())`, R`name = input("Name: ")
print("Title: Ada Lovelace")
print("Upper: ADA LOVELACE")
print("Lower: ada lovelace")`],
    hints:['name.title(), name.upper(), name.lower()','Each returns a new string; print them.','Use a label before each.','name = input("Name: ")\nprint("Title:", name.title())\nprint("Upper:", name.upper())\nprint("Lower:", name.lower())']},
  power:{can:['Normalise capitalisation','Make comparisons case-insensitive'],
    expand:'Make a yes/no question accept "y", "Y", "YES" and "yes".',
    where:'Usernames, emails and search all rely on lowercasing before comparing.',
    next:'Next: trimming stray spaces.'},
  codex:{title:'Case methods',body:'upper, lower, title, capitalize return new strings. Use lower() to compare ignoring case.',snip:R`answer.lower() == "yes"`}
},
{
  id:'r5-04', realm:5, n:4, title:'Trimming: strip the edges',
  teaches:['str-strip'], requires:['str-case'],
  story:`Every scroll from the visiting scribes has stray spaces around the edges. "Whitespace is invisible ink," Turing's Ghost grumbles. "It ruins comparisons and you cannot even see why."`,
  concept:{
    html:`\`.strip()\` removes whitespace (spaces, tabs, newlines) from **both ends**. It does not touch the middle.\n\n\`\`\`\n"  Ada  ".strip()     # 'Ada'\n"  Ada  ".lstrip()    # 'Ada  '  (left only)\n"  Ada  ".rstrip()    # '  Ada'  (right only)\n"a  b".strip()        # 'a  b'    (middle stays)\n\`\`\`\n\nPass characters to strip those instead: \`"##hi##".strip("#")\` → \`'hi'\`.\n\nA spell you will use constantly: \`name = input("Name: ").strip()\``,
    analogy:`Trimming the crusts off a sandwich.`,
    example:R`raw = "   Ada   "
print("[" + raw.strip() + "]")
print("[" + raw.lstrip() + "]")
print("[" + "##hi##".strip("#") + "]")`},
  predict:{code:R`print("[" + "  a b  ".strip() + "]")`, q:'What prints?', opts:['[a b]','[ab]','[  a b  ]'], ans:0, why:'Only the ends are trimmed. The middle space stays.'},
  cast:{code:R`raw = "   Ada   "
print("[" + raw.strip() + "]")
print("[" + raw.lstrip() + "]")
print("[" + "##hi##".strip("#") + "]")`, task:'Cast it. The brackets make the spaces visible.'},
  bug:{broken:R`name = "  ada  "
if name == "ada":
    print("Found")
else:
    print("Missing")`, task:'Invisible spaces break the match. Trim before comparing.',
    cases:[{inputs:[],tests:[['Found','out.strip()=="Found"'],['Uses strip','".strip()" in src']]}],
    sol:R`name = "  ada  "
if name.strip() == "ada":
    print("Found")
else:
    print("Missing")`, wrong:[R`name = "  ada  "
if name == "ada":
    print("Found")
else:
    print("Missing")`]},
  write:{prompt:'Ask `Name: `. Strip it. If nothing is left print `Empty`, otherwise print the stripped name inside brackets, like `[Ada]`.',
    starter:R`raw = input("Name: ")
`,
    inputs:['  Ada  '],
    cases:[{inputs:['  Ada  '],tests:[['Ada','lines[-1]=="[Ada]"']]},{inputs:['   '],tests:[['Only spaces','lines[-1]=="Empty"']]},{inputs:['Bo'],tests:[['No spaces','lines[-1]=="[Bo]"']]},{inputs:['  Ada Lovelace '],tests:[['Middle space kept','lines[-1]=="[Ada Lovelace]"']]}],
    sol:R`raw = input("Name: ")
name = raw.strip()
if name == "":
    print("Empty")
else:
    print(f"[{name}]")`,
    wrong:[R`raw = input("Name: ")
name = raw.lstrip()
if name == "":
    print("Empty")
else:
    print(f"[{name}]")`, R`raw = input("Name: ")
if raw == "":
    print("Empty")
else:
    print(f"[{raw}]")`],
    hints:['name = raw.strip()','If name == "" then nothing was left.','Print f"[{name}]" otherwise.','raw = input("Name: ")\nname = raw.strip()\nif name == "":\n    print("Empty")\nelse:\n    print(f"[{name}]")']},
  power:{can:['Clean user input','Detect "blank" answers made of spaces'],
    expand:'Combine strip() and lower() in one line: raw.strip().lower().',
    where:'Every real form cleans its input with strip() before using it.',
    next:'Next: replacing pieces of text.'},
  codex:{title:'strip',body:'strip() removes whitespace from both ends; lstrip/rstrip from one end. Pass characters to strip those.',snip:R`name = input("Name: ").strip()`}
},
{
  id:'r5-05', realm:5, n:5, title:'Replace: swap pieces of text',
  teaches:['str-replace'], requires:['str-strip'],
  story:`A censor-spirit wants every "bad" in a scroll turned into "good". "Find and replace," says Turing's Ghost. "The oldest scribe's spell."`,
  concept:{
    html:`\`.replace(old, new)\` swaps **every** occurrence:\n\n\`\`\`\n"bad bad day".replace("bad", "good")      # 'good good day'\n"bad bad day".replace("bad", "good", 1)   # 'good bad day' (only the first)\n"a-b-c".replace("-", "")                  # 'abc' (delete by replacing with nothing)\n\`\`\`\n\nIt is **case-sensitive** and returns a **new** string. \`.count(x)\` tells you how many there were before you replace.`,
    analogy:`Find and Replace in a word processor.`,
    example:R`text = "bad bad day"
print(text.replace("bad", "good"))
print(text.count("bad"))`},
  predict:{code:R`print("a-b-c".replace("-", ""))`, q:'What prints?', opts:['abc','a b c','a-b-c'], ans:0, why:'Replacing with an empty string deletes the pieces.'},
  cast:{code:R`text = "bad bad day"
print(text.replace("bad", "good"))
print(text.count("bad"))`, task:'Cast it.'},
  bug:{broken:R`text = "bad day"
text.replace("bad", "good")
print(text)`, task:'It prints "bad day". The result of replace was thrown away.',
    cases:[{inputs:[],tests:[['good day','out.strip()=="good day"']]}],
    sol:R`text = "bad day"
text = text.replace("bad", "good")
print(text)`, wrong:[R`text = "bad day"
text.replace("bad", "good")
print(text)`]},
  write:{prompt:'Ask `Text: `. Print the text with every `bad` replaced by `good`, then `Replaced: n` where n is how many were replaced.',
    starter:R`text = input("Text: ")
`,
    inputs:['bad bad day'],
    cases:[{inputs:['bad bad day'],tests:[['Two','lines[1:]==["good good day","Replaced: 2"]']]},{inputs:['nothing here'],tests:[['None','lines[1:]==["nothing here","Replaced: 0"]']]},{inputs:['a bad deal'],tests:[['One','lines[1:]==["a good deal","Replaced: 1"]']]}],
    sol:R`text = input("Text: ")
print(text.replace("bad", "good"))
print("Replaced:", text.count("bad"))`,
    wrong:[R`text = input("Text: ")
print(text.replace("bad", "good", 1))
print("Replaced:", text.count("bad"))`, R`text = input("Text: ")
print("good good day")
print("Replaced: 2")`],
    hints:['text.replace("bad", "good") swaps all of them.','text.count("bad") counts how many there are.','Count from the original text.','text = input("Text: ")\nprint(text.replace("bad", "good"))\nprint("Replaced:", text.count("bad"))']},
  power:{can:['Find and replace programmatically','Delete characters by replacing with nothing'],
    expand:'Remove all spaces and dashes from a phone number with two replace() calls.',
    where:'Cleaning phone numbers, prices ("$1,200" → "1200") and templates all use replace.',
    next:'Next: searching inside text.'},
  codex:{title:'replace and count',body:'replace(old, new) swaps all occurrences (returns a new string). count(x) counts them.',snip:R`text.replace(" ", "")`}
},
{
  id:'r5-06', realm:5, n:6, title:'Searching: find, startswith, endswith',
  teaches:['str-find'], requires:['str-replace'],
  story:`"Which scrolls are spells and which are shopping lists?" Turing's Ghost asks. "Look at the **name** on the spine."`,
  concept:{
    html:`Questions you can ask a string:\n\n\`\`\`\nname = "test_app.py"\nname.startswith("test_")   # True\nname.endswith(".py")       # True\n"app" in name              # True (anywhere inside)\nname.find("app")           # 5  (position, or -1 if missing)\nname.count(".")            # 1\n\`\`\`\n\n- \`startswith\` / \`endswith\` check the **ends** exactly. Use them instead of \`in\` when position matters (\`"happy.txt"\` **contains** \`"py"\` but does not end with \`".py"\`).\n- \`find\` returns \`-1\` when not found (it never crashes).`,
    analogy:`Reading the label on a jar instead of opening it.`,
    example:R`name = "test_app.py"
print(name.startswith("test_"))
print(name.endswith(".py"))
print(name.find("app"))
print(name.count("."))`},
  predict:{code:R`print("happy.txt".endswith(".py"))`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'It ends with ".txt". The "py" in the middle does not matter.'},
  cast:{code:R`name = "test_app.py"
print(name.startswith("test_"))
print(name.endswith(".py"))
print(name.find("app"))
print(name.count("."))`, task:'Cast it.'},
  bug:{broken:R`name = "happy.txt"
if "py" in name:
    print("Python file")
else:
    print("Other file")`, task:'"happy.txt" is not Python! Check the END of the name.',
    cases:[{inputs:[],tests:[['Other file','out.strip()=="Other file"'],['Uses endswith','".endswith(" in src']]}],
    sol:R`name = "happy.txt"
if name.endswith(".py"):
    print("Python file")
else:
    print("Other file")`, wrong:[R`name = "happy.txt"
if "py" in name:
    print("Python file")
else:
    print("Other file")`]},
  write:{prompt:'Ask `File: `. Print `Python: True/False` (ends with .py), `Test: True/False` (starts with test_) and `Dots: n` (how many dots).',
    starter:R`name = input("File: ")
`,
    inputs:['test_app.py'],
    cases:[{inputs:['test_app.py'],tests:[['test_app.py','lines[1:]==["Python: True","Test: True","Dots: 1"]']]},{inputs:['happy.txt'],tests:[['happy.txt','lines[1:]==["Python: False","Test: False","Dots: 1"]']]},{inputs:['a.b.py'],tests:[['a.b.py','lines[1:]==["Python: True","Test: False","Dots: 2"]']]},{inputs:['my_test_a.py'],tests:[['my_test_a.py','lines[1:]==["Python: True","Test: False","Dots: 1"]']]},{inputs:['test_notes.md'],tests:[['md','lines[1:]==["Python: False","Test: True","Dots: 1"]']]}],
    sol:R`name = input("File: ")
print("Python:", name.endswith(".py"))
print("Test:", name.startswith("test_"))
print("Dots:", name.count("."))`,
    wrong:[R`name = input("File: ")
print("Python:", "py" in name)
print("Test:", name.startswith("test_"))
print("Dots:", name.count("."))`, R`name = input("File: ")
print("Python:", name.endswith(".py"))
print("Test:", "test_" in name)
print("Dots:", name.count("."))`],
    hints:['name.endswith(".py") gives True or False.','name.startswith("test_") and name.count(".").','Print each with its label.','name = input("File: ")\nprint("Python:", name.endswith(".py"))\nprint("Test:", name.startswith("test_"))\nprint("Dots:", name.count("."))']},
  power:{can:['Ask yes/no questions about the shape of text','Pick startswith/endswith over `in` when position matters'],
    expand:'Print the extension of a filename using name[name.rfind(".") + 1:].',
    where:'File-type checks, URL routing ("starts with /api/") and ID prefixes use these.',
    next:'Next: chopping text into pieces with split.'},
  codex:{title:'Searching text',body:'startswith, endswith, in, find (-1 if missing), count.',snip:R`name.endswith(".py")`}
},
{
  id:'r5-07', realm:5, n:7, title:'Split: text into a list',
  teaches:['str-split'], requires:['str-find','unpack'],
  story:`A scroll arrives as one long line: *ada,36,london*. "One string, three facts," says Turing's Ghost. "Cut along the commas and you get a list you already know how to use."`,
  concept:{
    html:`\`.split(sep)\` cuts a string at every separator and returns a **list**:\n\n\`\`\`\n"ada,36,london".split(",")    # ['ada', '36', 'london']\n"red green  blue".split()     # ['red', 'green', 'blue']\n\`\`\`\n\n- With **no argument**, split cuts on any whitespace (and ignores extra spaces). Perfect for sentences.\n- Pieces are still **text**. Convert numbers with \`int()\`.\n- Unpack straight into names: \`name, age, city = line.split(",")\`.`,
    analogy:`Cutting a ribbon at every red mark.`,
    example:R`line = "ada,36,london"
name, age, city = line.split(",")
print(name, int(age) + 1, city)
print("one  two three".split())`},
  predict:{code:R`print("a,b,,c".split(","))`, q:'What prints?', opts:["['a', 'b', '', 'c']","['a', 'b', 'c']","['a,b,,c']"], ans:0, why:'Two commas in a row leave an empty string between them.'},
  cast:{code:R`line = "ada,36,london"
name, age, city = line.split(",")
print(name, int(age) + 1, city)
print("one  two three".split())`, task:'Cast it.'},
  bug:{broken:R`line = "ada,36,london"
name, age, city = line.split()
print(name)`, task:'ValueError: split() with no argument cuts on spaces, but this line uses commas.',
    cases:[{inputs:[],tests:[['Prints ada','out.strip()=="ada"']]}],
    sol:R`line = "ada,36,london"
name, age, city = line.split(",")
print(name)`, wrong:[R`line = "ada,36,london"
name, age, city = line.split()
print(name)`]},
  write:{prompt:'Ask `Line: ` in the form `name,age,city`. Print `Name: ...`, `Next year: ...` (age plus one) and `City: ...`.',
    starter:R`line = input("Line: ")
`,
    inputs:['ada,36,london'],
    cases:[{inputs:['ada,36,london'],tests:[['ada','lines[1:]==["Name: ada","Next year: 37","City: london"]']]},{inputs:['bo,9,paris'],tests:[['bo','lines[1:]==["Name: bo","Next year: 10","City: paris"]']]},{inputs:['cy,99,rome'],tests:[['cy','lines[1:]==["Name: cy","Next year: 100","City: rome"]']]}],
    sol:R`line = input("Line: ")
name, age, city = line.split(",")
print("Name:", name)
print("Next year:", int(age) + 1)
print("City:", city)`,
    wrong:[R`line = input("Line: ")
name, age, city = line.split(",")
print("Name:", name)
print("Next year:", age + 1)
print("City:", city)`, R`line = input("Line: ")
print("Name: ada")
print("Next year: 37")
print("City: london")`],
    hints:['name, age, city = line.split(",")','age is still text: use int(age) + 1.','Print each with its label.','line = input("Line: ")\nname, age, city = line.split(",")\nprint("Name:", name)\nprint("Next year:", int(age) + 1)\nprint("City:", city)']},
  power:{can:['Turn a line of text into data','Unpack the pieces straight into variables'],
    expand:'Split a sentence with split() and print how many words it has.',
    where:'CSV files, log lines and command parsing all begin with split().',
    next:'Next: the reverse. Joining a list back into text.'},
  codex:{title:'split',body:'text.split(",") returns a list. split() with no argument splits on whitespace.',snip:R`name, age = line.split(",")`}
},
{
  id:'r5-08', realm:5, n:8, title:'Join: a list back into text',
  teaches:['str-join'], requires:['str-split'],
  story:`"Now the reverse," Turing's Ghost says, gathering loose words from the air. "You cut the ribbon. Now stitch it back, with whatever thread you like."`,
  concept:{
    html:`\`separator.join(list)\` glues a list of **strings** into one text:\n\n\`\`\`\nwords = ["red", "green", "blue"]\n"-".join(words)      # 'red-green-blue'\n", ".join(words)     # 'red, green, blue'\n"".join(words)       # 'redgreenblue'\n\`\`\`\n\nThe **separator comes first**, then \`.join(\`. The list must hold **strings**, so convert numbers first:\n\n\`\`\`\n", ".join([str(n) for n in nums])\n\`\`\`\n\nSplit and join together are a classic: \`"-".join(text.split())\` turns spaces into dashes.`,
    analogy:`Threading beads onto a string with a spacer between each.`,
    example:R`words = ["red", "green", "blue"]
print("-".join(words))
print(", ".join(sorted(words)))`},
  predict:{code:R`print("+".join(["a", "b", "c"]))`, q:'What prints?', opts:['a+b+c','abc','+a+b+c'], ans:0, why:'The separator goes between items only.'},
  cast:{code:R`words = ["red", "green", "blue"]
print("-".join(words))
print(", ".join(sorted(words)))`, task:'Cast it.'},
  bug:{broken:R`nums = [1, 2, 3]
print(", ".join(nums))`, task:'TypeError: join needs strings. Convert each number first.',
    cases:[{inputs:[],tests:[['1, 2, 3','out.strip()=="1, 2, 3"']]}],
    sol:R`nums = [1, 2, 3]
print(", ".join([str(n) for n in nums]))`, wrong:[R`nums = [1, 2, 3]
print(", ".join(nums))`]},
  write:{prompt:'Ask `Words: ` (space-separated). Print the words joined with `-`, then the words **sorted** and joined with `, `.',
    starter:R`words = input("Words: ").split()
`,
    inputs:['pear apple fig'],
    cases:[{inputs:['pear apple fig'],tests:[['pear apple fig','lines[1:]==["pear-apple-fig","apple, fig, pear"]']]},{inputs:['c b a'],tests:[['c b a','lines[1:]==["c-b-a","a, b, c"]']]},{inputs:['solo'],tests:[['single','lines[1:]==["solo","solo"]']]}],
    sol:R`words = input("Words: ").split()
print("-".join(words))
print(", ".join(sorted(words)))`,
    wrong:[R`words = input("Words: ").split()
print("-".join(words))
print(", ".join(words))`, R`words = input("Words: ").split()
print("pear-apple-fig")
print("apple, fig, pear")`],
    hints:['"-".join(words) joins with dashes.','sorted(words) gives a sorted copy.','", ".join(sorted(words))','words = input("Words: ").split()\nprint("-".join(words))\nprint(", ".join(sorted(words)))']},
  power:{can:['Turn lists into readable sentences','Rebuild text after cleaning it'],
    expand:'Turn "hello big world" into "Hello Big World" with a join and title(), without using title() on the whole text.',
    where:'URLs ("-".join), CSV output and breadcrumb trails use join.',
    next:'Next: tidy columns and alignment with f-strings.'},
  codex:{title:'join',body:'sep.join(list_of_strings). Separator first. Items must be strings.',snip:R`", ".join(words)`}
}
);
