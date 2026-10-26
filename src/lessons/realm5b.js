// REALM 5 — SCROLLS & INK — part B (lessons 9-16)
LESSONS.push(
{
  id:'r5-09', realm:5, n:9, title:'Alignment: neat columns with f-strings',
  teaches:['fmt-align'], requires:['str-join'],
  story:`The Scriptorium keeps a ledger, and its columns are a mess. "Ugly output makes people distrust good data," says Turing's Ghost. "Pad it. Align it."`,
  concept:{
    html:`Inside an f-string, \`{value:format}\` controls how it looks:\n\n\`\`\`\nf"{name:<10}"    # left-align in 10 spaces\nf"{name:>10}"    # right-align in 10 spaces\nf"{name:^10}"    # centre in 10 spaces\nf"{name:*^10}"   # centre, filled with *\n\`\`\`\n\nThe number is the **width**. If the text is longer than the width, nothing is cut off.\n\nPlain-string helpers do the same: \`name.ljust(10)\`, \`name.rjust(10)\`, \`name.center(10)\`.\n\nNumbers align **right** by default, text **left**.`,
    analogy:`Lining up a receipt: item on the left, price on the right.`,
    example:R`print(f"{'rope':<10}{12:>6}")
print(f"{'lantern':<10}{250:>6}")
print(f"{'MENU':*^14}")`},
  predict:{code:R`print(f"[{'ab':>5}]")`, q:'What prints?', opts:['[   ab]','[ab   ]','[ab]'], ans:0, why:'> right-aligns "ab" inside 5 characters.'},
  cast:{code:R`print(f"{'rope':<10}{12:>6}")
print(f"{'lantern':<10}{250:>6}")
print(f"{'MENU':*^14}")`, task:'Cast it. Change the widths.'},
  bug:{broken:R`item = "rope"
price = 12
print(item + str(price))`, task:'The columns are jammed together. Align the item left in 10 and the price right in 6.',
    cases:[{inputs:[],tests:[['Aligned','out.rstrip("\\n")=="rope".ljust(10)+"12".rjust(6)'],['Uses < and >','":<" in src and ":>" in src']]}],
    sol:R`item = "rope"
price = 12
print(f"{item:<10}{price:>6}")`, wrong:[R`item = "rope"
price = 12
print(item + str(price))`]},
  write:{prompt:'Ask `Item: ` and `Price: ` (a whole number). Print one line: the item left-aligned in **10** characters, then the price right-aligned in **6**.',
    starter:R`item = input("Item: ")
price = int(input("Price: "))
`,
    inputs:['rope','12'],
    cases:[{inputs:['rope','12'],tests:[['rope','lines[-1]=="rope".ljust(10)+"12".rjust(6)']]},{inputs:['lantern','250'],tests:[['lantern','lines[-1]=="lantern".ljust(10)+"250".rjust(6)']]},{inputs:['map','5'],tests:[['map','lines[-1]=="map".ljust(10)+"5".rjust(6)']]}],
    sol:R`item = input("Item: ")
price = int(input("Price: "))
print(f"{item:<10}{price:>6}")`,
    wrong:[R`item = input("Item: ")
price = int(input("Price: "))
print(item + str(price))`, R`item = input("Item: ")
price = int(input("Price: "))
print("rope      " + "    12")`],
    hints:['Use {item:<10} for the left-aligned column.','Use {price:>6} for the right-aligned column.','Put both in one f-string.','item = input("Item: ")\nprice = int(input("Price: "))\nprint(f"{item:<10}{price:>6}")']},
  power:{can:['Print tidy columns and tables','Centre titles and draw banners'],
    expand:'Print a 3-row receipt using a loop and the same widths, then a total row.',
    where:'Receipts, reports, CLI tables and logs all rely on alignment.',
    next:'Next: formatting numbers - decimals, commas and percentages.'},
  codex:{title:'f-string alignment',body:'{x:<10} left, {x:>10} right, {x:^10} centre, {x:*^10} centre with fill.',snip:R`f"{name:<10}{price:>6}"`}
},
{
  id:'r5-10', realm:5, n:10, title:'Formatting numbers: decimals, commas, percents',
  teaches:['fmt-num'], requires:['fmt-align'],
  story:`"Raw numbers are rude," says Turing's Ghost, holding up *1234567.891*. "Show the reader 1,234,567.89 and they will thank you."`,
  concept:{
    html:`More format codes after the colon:\n\n| Code | Meaning | Example |\n|---|---|---|\n| \`:.2f\` | 2 decimals | \`3.14159\` → \`3.14\` |\n| \`:,\` | thousands commas | \`1234567\` → \`1,234,567\` |\n| \`:,.2f\` | both | \`1234.5\` → \`1,234.50\` |\n| \`:.1%\` | percent | \`0.256\` → \`25.6%\` |\n| \`:06d\` | zero-pad to 6 digits | \`42\` → \`000042\` |\n| \`:+d\` | always show sign | \`5\` → \`+5\` |\n\n\`:.2f\` **rounds** for display but does not change the variable.`,
    analogy:`A price tag printer: same number, tidy presentation.`,
    example:R`amount = 1234567.891
print(f"{amount:,.2f}")
print(f"{0.256:.1%}")
print(f"{42:06d}")`},
  predict:{code:R`print(f"{3.14159:.2f}")`, q:'What prints?', opts:['3.14','3.15','3.1'], ans:0, why:'Two decimals, rounded: 3.14.'},
  cast:{code:R`amount = 1234567.891
print(f"{amount:,.2f}")
print(f"{0.256:.1%}")
print(f"{42:06d}")`, task:'Cast it.'},
  bug:{broken:R`total = 1234.5
print(f"Total: {total:.2}")`, task:'It prints "1.2e+03". The "f" is missing from the format code.',
    cases:[{inputs:[],tests:[['Total: 1234.50','out.strip()=="Total: 1234.50"']]}],
    sol:R`total = 1234.5
print(f"Total: {total:.2f}")`, wrong:[R`total = 1234.5
print(f"Total: {total:.2}")`]},
  write:{prompt:'Ask `Amount: ` (a decimal number). Print `Total: ` with commas and 2 decimals, `Share: ` with the amount divided by 1000 shown as a percent with 1 decimal, and `ID: ` with the whole part zero-padded to 6 digits.',
    starter:R`amt = float(input("Amount: "))
`,
    inputs:['1250'],
    cases:[{inputs:['1250'],tests:[['1250','lines[1:]==["Total: 1,250.00","Share: 125.0%","ID: 001250"]']]},{inputs:['500'],tests:[['500','lines[1:]==["Total: 500.00","Share: 50.0%","ID: 000500"]']]},{inputs:['1234567.891'],tests:[['big','lines[1:]==["Total: 1,234,567.89","Share: 123456.8%","ID: 1234567"]']]}],
    sol:R`amt = float(input("Amount: "))
print(f"Total: {amt:,.2f}")
print(f"Share: {amt / 1000:.1%}")
print(f"ID: {int(amt):06d}")`,
    wrong:[R`amt = float(input("Amount: "))
print(f"Total: {amt:.2f}")
print(f"Share: {amt / 1000:.1%}")
print(f"ID: {int(amt):06d}")`, R`amt = float(input("Amount: "))
print("Total: 1,250.00")
print("Share: 125.0%")
print("ID: 001250")`],
    hints:['Commas and 2 decimals: {amt:,.2f}','Percent: {amt / 1000:.1%}. Zero pad: {int(amt):06d}.','Three print lines with labels.','amt = float(input("Amount: "))\nprint(f"Total: {amt:,.2f}")\nprint(f"Share: {amt / 1000:.1%}")\nprint(f"ID: {int(amt):06d}")']},
  power:{can:['Show money, percentages and IDs correctly','Round for display without changing the data'],
    expand:'Print a list of prices with commas, right-aligned to 12 characters: {p:>12,.2f}.',
    where:'Invoices, dashboards and statistics reports all format numbers like this.',
    next:'Next: special characters - newlines, tabs and quotes.'},
  codex:{title:'Number formats',body:':.2f decimals, :, commas, :.1% percent, :06d zero pad. Display only, the value is unchanged.',snip:R`f"{x:,.2f}"`}
},
{
  id:'r5-11', realm:5, n:11, title:'Escapes and multi-line text',
  teaches:['str-escape'], requires:['fmt-num'],
  story:`"How do you put a quote *inside* a quote?" Turing's Ghost challenges. "Or a line break inside a single scroll line? That's what **escapes** are for."`,
  concept:{
    html:`A backslash \`\\\` starts a special character:\n\n| Escape | Meaning |\n|---|---|\n| \`\\n\` | new line |\n| \`\\t\` | tab |\n| \`\\"\` | a double quote inside "..." |\n| \`\\\\\` | one real backslash |\n\n\`\`\`\nprint("Line 1\\nLine 2")\nprint("She said \\"hi\\"")\n\`\`\`\n\nFor many lines use **triple quotes**:\n\n\`\`\`\nnote = """Dear Ada,\nSee you soon."""\n\`\`\`\n\nOr switch quote style: \`'She said "hi"'\`. And \`print(a, b, sep="-", end="!")\` changes the separator and the ending.`,
    analogy:`Stage directions in a script: *[new line]*, *[tab]*.`,
    example:R`print("Line 1\nLine 2")
print('She said "hi"')
print("a", "b", "c", sep="-")`},
  predict:{code:R`print("a\tb")`, q:'What does the \\t do?', opts:['Inserts a tab gap between a and b','Prints a backslash and t','Starts a new line'], ans:0, why:'\\t is the tab character.'},
  cast:{code:R`print("Line 1\nLine 2")
print('She said "hi"')
print("a", "b", "c", sep="-")`, task:'Cast it.'},
  bug:{broken:R`print("She said "hi"")`, task:'SyntaxError: the quote inside ends the text early. Fix it (escape or change quote style).',
    cases:[{inputs:[],tests:[['Prints quote','out.strip()=="She said \\"hi\\""']]}],
    sol:R`print('She said "hi"')`, wrong:[R`print("She said "hi"")`]},
  write:{prompt:'Ask `Name: `. Using ONE `print`, output three lines: `Dear NAME,` then a line that starts with a tab and says `Your scroll awaits.` then `Signed: Ghost`.',
    starter:R`name = input("Name: ")
`,
    inputs:['Ada'],
    cases:[{inputs:['Ada'],tests:[['Ada','lines[1:]==["Dear Ada,","\\tYour scroll awaits.","Signed: Ghost"]'],['One print','src.count("print(")==1']]},{inputs:['Bo'],tests:[['Bo','lines[1:]==["Dear Bo,","\\tYour scroll awaits.","Signed: Ghost"]']]}],
    sol:R`name = input("Name: ")
print(f"Dear {name},\n\tYour scroll awaits.\nSigned: Ghost")`,
    wrong:[R`name = input("Name: ")
print(f"Dear {name},")
print("\tYour scroll awaits.")
print("Signed: Ghost")`, R`name = input("Name: ")
print("Dear Ada,\n\tYour scroll awaits.\nSigned: Ghost")`],
    hints:['\\n is a new line, \\t is a tab, both inside the text.','Use an f-string so the name goes into the first line.','One print with \\n between the three lines.','name = input("Name: ")\nprint(f"Dear {name},\\n\\tYour scroll awaits.\\nSigned: Ghost")']},
  power:{can:['Print multi-line text in one call','Put quotes and backslashes inside text'],
    expand:'Use triple quotes to build a 4-line letter and print it.',
    where:'File paths on Windows ("C:\\\\Users"), messages and templates need escapes.',
    next:'Next: letters are numbers underneath. Ciphers!'},
  codex:{title:'Escapes',body:'\\n new line, \\t tab, \\" quote, \\\\ backslash. Triple quotes span lines. print(sep=, end=) tune the output.',snip:R`print("a\nb")`}
},
{
  id:'r5-12', realm:5, n:12, title:'Letters are numbers: ord, chr and ciphers',
  teaches:['ord-chr'], requires:['str-escape','loop-text'],
  story:`"Every letter has a secret number," Turing's Ghost whispers. "A is 65, a is 97. Once you know that, you can lock a message in a code that kept armies guessing."`,
  concept:{
    html:`\`ord(ch)\` turns a character into its number, \`chr(n)\` turns it back.\n\n\`\`\`\nord("a")      # 97\nchr(98)       # 'b'\n\`\`\`\n\nLetters are numbered in order, so \`ord("b") - ord("a")\` is 1. A **Caesar cipher** shifts every letter along:\n\n\`\`\`\nshifted = chr((ord(ch) - 97 + 1) % 26 + 97)\n\`\`\`\n\n- subtract 97 → position 0 to 25\n- add the shift\n- \`% 26\` wraps \`z\` around to \`a\`\n- add 97 → back to a letter\n\nOnly shift letters; leave spaces and punctuation alone (\`ch.isalpha()\`).`,
    analogy:`A rotating dial: after z, the dial wraps back to a.`,
    example:R`print(ord("a"), chr(98))
ch = "z"
print(chr((ord(ch) - 97 + 1) % 26 + 97))`},
  predict:{code:R`print(chr(ord("a") + 2))`, q:'What prints?', opts:['c','b','99'], ans:0, why:'a is 97, plus 2 is 99, which is c.'},
  cast:{code:R`print(ord("a"), chr(98))
ch = "z"
print(chr((ord(ch) - 97 + 1) % 26 + 97))`, task:'Cast it. Notice z wraps to a.'},
  bug:{broken:R`ch = "z"
print(chr(ord(ch) + 1))`, task:'It prints "{" instead of wrapping to a. Wrap with % 26.',
    cases:[{inputs:[],tests:[['Wraps to a','out.strip()=="a"'],['Uses %','"%" in src']]}],
    sol:R`ch = "z"
print(chr((ord(ch) - 97 + 1) % 26 + 97))`, wrong:[R`ch = "z"
print(chr(ord(ch) + 1))`]},
  write:{prompt:'Ask `Text: ` (lowercase letters and spaces). Print it with every letter shifted forward by 1 (`z` wraps to `a`). Spaces stay as they are.',
    starter:R`text = input("Text: ")
`,
    inputs:['abc xyz'],
    cases:[{inputs:['abc xyz'],tests:[['abc xyz','lines[-1]=="bcd yza"']]},{inputs:['hello world'],tests:[['hello world','lines[-1]=="ifmmp xpsme"']]},{inputs:['z'],tests:[['z','lines[-1]=="a"']]},{inputs:['a b'],tests:[['a b','lines[-1]=="b c"']]}],
    sol:R`text = input("Text: ")
result = ""
for ch in text:
    if ch.isalpha():
        result += chr((ord(ch) - 97 + 1) % 26 + 97)
    else:
        result += ch
print(result)`,
    wrong:[R`text = input("Text: ")
result = ""
for ch in text:
    if ch.isalpha():
        result += chr(ord(ch) + 1)
    else:
        result += ch
print(result)`, R`text = input("Text: ")
result = ""
for ch in text:
    result += chr((ord(ch) - 97 + 1) % 26 + 97)
print(result)`],
    hints:['Loop over each character. Build up result.','If ch.isalpha(): shift it; else keep it.','chr((ord(ch) - 97 + 1) % 26 + 97)','text = input("Text: ")\nresult = ""\nfor ch in text:\n    if ch.isalpha():\n        result += chr((ord(ch) - 97 + 1) % 26 + 97)\n    else:\n        result += ch\nprint(result)']},
  power:{can:['Convert between letters and numbers','Write a working cipher'],
    expand:'Add a second input for the shift amount, then write the decoder (shift by -n).',
    where:'ord/chr appear in hashing, encoding, games (letter grids) and text processing.',
    next:'Next: ask questions about characters - letters? digits? palindromes?'},
  codex:{title:'ord and chr',body:'ord("a") = 97, chr(97) = "a". Shift with (ord(ch) - 97 + n) % 26 + 97.',snip:R`chr((ord(ch) - 97 + 1) % 26 + 97)`}
},
{
  id:'r5-13', realm:5, n:13, title:'Text checks: isalpha, isdigit and palindromes',
  teaches:['str-check'], requires:['ord-chr','comp-if','str-join'],
  story:`"Is it a word? A number? Is it the same backwards?" Turing's Ghost points to a shelf of mirror-scrolls. "Questions of shape, not meaning."`,
  concept:{
    html:`Boolean checks on text:\n\n| Method | True when |\n|---|---|\n| \`.isalpha()\` | all letters, not empty |\n| \`.isdigit()\` | all digits, not empty |\n| \`.isalnum()\` | all letters or digits |\n| \`.isupper()\` / \`.islower()\` | all caps / all lower |\n| \`.isspace()\` | only whitespace |\n\nTo **reverse** text use the slice \`[::-1]\`:\n\n\`\`\`\n"stressed"[::-1]     # 'desserts'\n\`\`\`\n\nA **palindrome** reads the same both ways. Clean first (lowercase, keep only letters/digits), then compare:\n\n\`\`\`\ncleaned = "".join([c for c in text.lower() if c.isalnum()])\ncleaned == cleaned[::-1]\n\`\`\``,
    analogy:`Holding a word up to a mirror.`,
    example:R`print("abc".isalpha(), "123".isdigit(), "a1".isalnum())
word = "stressed"
print(word[::-1])
text = "Racecar"
cleaned = "".join([c for c in text.lower() if c.isalnum()])
print(cleaned == cleaned[::-1])`},
  predict:{code:R`print("abc1".isalpha())`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'The 1 is not a letter.'},
  cast:{code:R`print("abc".isalpha(), "123".isdigit(), "a1".isalnum())
word = "stressed"
print(word[::-1])
text = "Racecar"
cleaned = "".join([c for c in text.lower() if c.isalnum()])
print(cleaned == cleaned[::-1])`, task:'Cast it.'},
  bug:{broken:R`text = "Racecar"
if text == text[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")`, task:'"Racecar" is a palindrome but capital R breaks it. Lowercase before comparing.',
    cases:[{inputs:[],tests:[['Palindrome','out.strip()=="Palindrome"']]}],
    sol:R`text = "Racecar"
text = text.lower()
if text == text[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")`, wrong:[R`text = "Racecar"
if text == text[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")`]},
  write:{prompt:'Ask `Text: `. Ignore case, spaces and punctuation (keep only letters and digits). Print `Palindrome` or `Not a palindrome`.',
    starter:R`text = input("Text: ")
`,
    inputs:['Racecar'],
    cases:[{inputs:['Racecar'],tests:[['Racecar','lines[-1]=="Palindrome"']]},{inputs:['A man, a plan, a canal: Panama'],tests:[['Panama','lines[-1]=="Palindrome"']]},{inputs:['hello'],tests:[['hello','lines[-1]=="Not a palindrome"']]},{inputs:['Was it a car or a cat I saw?'],tests:[['Was it','lines[-1]=="Palindrome"']]},{inputs:['ab'],tests:[['ab','lines[-1]=="Not a palindrome"']]}],
    sol:R`text = input("Text: ")
cleaned = "".join([c for c in text.lower() if c.isalnum()])
if cleaned == cleaned[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")`,
    wrong:[R`text = input("Text: ")
cleaned = text.lower()
if cleaned == cleaned[::-1]:
    print("Palindrome")
else:
    print("Not a palindrome")`, R`text = input("Text: ")
print("Palindrome")`],
    hints:['Build a cleaned string: lowercase, keep only letters and digits.','"".join([c for c in text.lower() if c.isalnum()])','Compare cleaned with cleaned[::-1].','text = input("Text: ")\ncleaned = "".join([c for c in text.lower() if c.isalnum()])\nif cleaned == cleaned[::-1]:\n    print("Palindrome")\nelse:\n    print("Not a palindrome")']},
  power:{can:['Validate what kind of characters text holds','Reverse text and detect palindromes'],
    expand:'Write a password checker: at least 8 characters with a digit and an uppercase letter.',
    where:'Form validation, password rules and data cleaning are all character checks.',
    next:'Next: counting words and finding the common ones.'},
  codex:{title:'Character checks',body:'isalpha, isdigit, isalnum, isupper, islower, isspace. s[::-1] reverses.',snip:R`cleaned == cleaned[::-1]`}
},
{
  id:'r5-14', realm:5, n:14, title:'Word statistics',
  teaches:['word-stats'], requires:['str-check','dict-count'],
  story:`A scribe drops a whole paragraph on your desk. "How many words? Which is longest? Which does he repeat?" asks Turing's Ghost. "A scribe measures text."`,
  concept:{
    html:`Combine your tools:\n\n1. \`words = text.lower().split()\` - lowercase so "Apple" and "apple" match, then split.\n2. \`len(words)\` - the word count.\n3. \`max(words, key=len)\` - the longest word (the first one wins a tie).\n4. A **tally** dict for how often each word appears.\n\n\`\`\`\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\ncommon = max(counts, key=counts.get)\n\`\`\`\n\n\`max(counts, key=counts.get)\` returns the **key** with the biggest value (first one wins a tie).`,
    analogy:`A librarian's tally sheet for a book.`,
    example:R`words = "the cat and the hat".split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(len(words))
print(max(counts, key=counts.get))`},
  predict:{code:R`print(max(["a", "bbb", "cc"], key=len))`, q:'What prints?', opts:['bbb','cc','a'], ans:0, why:'The longest word.'},
  cast:{code:R`words = "the cat and the hat".split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(len(words))
print(max(counts, key=counts.get))`, task:'Cast it.'},
  bug:{broken:R`words = "Apple banana apple".split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts["apple"])`, task:'It prints 1. "Apple" and "apple" count separately. Lowercase first so the answer is 2.',
    cases:[{inputs:[],tests:[['Prints 2','out.strip()=="2"'],['Uses lower','".lower()" in src']]}],
    sol:R`words = "Apple banana apple".lower().split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts["apple"])`, wrong:[R`words = "Apple banana apple".split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
print(counts["apple"])`]},
  write:{prompt:'Ask `Sentence: ` (no punctuation). Print `Words: n`, `Longest: w` and `Most common: w (n)`. Ignore case. Ties go to the word seen first.',
    starter:R`text = input("Sentence: ")
`,
    inputs:['the cat and the hat'],
    cases:[{inputs:['the cat and the hat'],tests:[['the cat','lines[1:]==["Words: 5","Longest: the","Most common: the (2)"]']]},{inputs:['Apple banana apple'],tests:[['Apple','lines[1:]==["Words: 3","Longest: banana","Most common: apple (2)"]']]},{inputs:['one'],tests:[['one','lines[1:]==["Words: 1","Longest: one","Most common: one (1)"]']]},{inputs:['a bb a bb ccc'],tests:[['tie','lines[1:]==["Words: 5","Longest: ccc","Most common: a (2)"]']]}],
    sol:R`text = input("Sentence: ")
words = text.lower().split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
common = max(counts, key=counts.get)
print("Words:", len(words))
print("Longest:", max(words, key=len))
print(f"Most common: {common} ({counts[common]})")`,
    wrong:[R`text = input("Sentence: ")
words = text.split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
common = max(counts, key=counts.get)
print("Words:", len(words))
print("Longest:", max(words, key=len))
print(f"Most common: {common} ({counts[common]})")`, R`text = input("Sentence: ")
words = text.lower().split()
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
common = min(counts, key=counts.get)
print("Words:", len(words))
print("Longest:", max(words, key=len))
print(f"Most common: {common} ({counts[common]})")`],
    hints:['words = text.lower().split(), then tally into a dict.','max(words, key=len) is the longest; max(counts, key=counts.get) is the most common.','Print with f"Most common: {common} ({counts[common]})".','text = input("Sentence: ")\nwords = text.lower().split()\ncounts = {}\nfor w in words:\n    counts[w] = counts.get(w, 0) + 1\ncommon = max(counts, key=counts.get)\nprint("Words:", len(words))\nprint("Longest:", max(words, key=len))\nprint(f"Most common: {common} ({counts[common]})")']},
  power:{can:['Measure any piece of text','Find the most frequent word'],
    expand:'Print the top 3 words using sorted(counts.items(), key=lambda p: p[1], reverse=True)[:3].',
    where:'Word clouds, SEO tools, spam filters and chat analytics begin with word counts.',
    next:'Next: pattern magic - regular expressions.'},
  codex:{title:'Word statistics',body:'text.lower().split(), tally with a dict, max(..., key=len) and max(counts, key=counts.get).',snip:R`max(counts, key=counts.get)`}
},
{
  id:'r5-15', realm:5, n:15, title:'Regex 1: finding a pattern with re.search',
  teaches:['re-search'], requires:['word-stats','none','import'],
  story:`Turing's Ghost opens a drawer of glowing glass lenses. "Plain search finds a *known* word. A **regular expression** finds a *shape*: any number, any date, any email. This is the sharpest quill in the Scriptorium."`,
  concept:{
    html:`A **regular expression** (regex) is a pattern for text. Python's \`re\` module runs it:\n\n\`\`\`\nimport re\nm = re.search(r"\\d+", "room 42 ahead")\nif m:\n    print(m.group())     # '42'\n\`\`\`\n\n- \`r"..."\` is a **raw string**: backslashes are kept as typed. Always use it for patterns.\n- \`\\d\` means one digit. \`+\` means "one or more". So \`\\d+\` is a whole number.\n- \`re.search\` finds the **first** match anywhere. It returns a **match object** or \`None\`.\n- \`m.group()\` is the matched text. Always check \`if m:\` before using it.\n\nPlain letters match themselves: \`re.search(r"cat", text)\`.`,
    analogy:`A stencil: slide it over the text until the shape fits.`,
    example:R`import re
m = re.search(r"\d+", "room 42 ahead")
if m:
    print(m.group())
print(re.search(r"\d+", "no digits"))`},
  predict:{code:R`import re
print(re.search(r"\d", "abc") is None)`, q:'What prints?', opts:['True','False','abc'], ans:0, why:'No digit exists, so search returns None.'},
  cast:{code:R`import re
m = re.search(r"\d+", "room 42 ahead")
if m:
    print(m.group())
print(re.search(r"\d+", "no digits"))`, task:'Cast it.'},
  bug:{broken:R`import re
m = re.search(r"\d+", "no digits here")
print(m.group())`, task:'AttributeError: search returned None. Check before using the match.',
    cases:[{inputs:[],tests:[['Prints No number','out.strip()=="No number"']]}],
    sol:R`import re
m = re.search(r"\d+", "no digits here")
if m:
    print(m.group())
else:
    print("No number")`, wrong:[R`import re
m = re.search(r"\d+", "no digits here")
print(m.group())`]},
  write:{prompt:'Ask `Text: `. Use `re.search` to find the **first whole number**. Print `Found: 42` or `No number`.',
    starter:R`import re
text = input("Text: ")
`,
    inputs:['room 42 ahead'],
    cases:[{inputs:['room 42 ahead'],tests:[['42','lines[-1]=="Found: 42"']]},{inputs:['no digits'],tests:[['none','lines[-1]=="No number"']]},{inputs:['a1b22'],tests:[['first number only','lines[-1]=="Found: 1"']]},{inputs:['100 and 7'],tests:[['100','lines[-1]=="Found: 100"']]}],
    sol:R`import re
text = input("Text: ")
m = re.search(r"\d+", text)
if m:
    print("Found:", m.group())
else:
    print("No number")`,
    wrong:[R`import re
text = input("Text: ")
m = re.search(r"\d", text)
if m:
    print("Found:", m.group())
else:
    print("No number")`, R`import re
text = input("Text: ")
m = re.search(r"\d+", text)
print("Found:", m.group())`],
    hints:['m = re.search(r"\\d+", text) - \\d+ is one or more digits.','Check if m: before using m.group().','Else print No number.','import re\ntext = input("Text: ")\nm = re.search(r"\\d+", text)\nif m:\n    print("Found:", m.group())\nelse:\n    print("No number")']},
  power:{can:['Find any number-shaped thing in text','Handle the "no match" case safely'],
    expand:'Find the first word of 4 letters with r"[a-z]{4}" (previewing the next lesson).',
    where:'Extracting order numbers, versions and dates from messy text is regex territory.',
    next:'Next: character classes and counts - the full toolbox.'},
  codex:{title:'re.search',body:'re.search(r"pattern", text) returns a match or None. m.group() is the text. \\d = digit, + = one or more.',snip:R`m = re.search(r"\d+", text)`}
},
{
  id:'r5-16', realm:5, n:16, title:'Regex 2: classes, counts and anchors',
  teaches:['re-classes'], requires:['re-search'],
  story:`"One digit, many digits... what about *exactly* three?" Turing's Ghost presses a crystal into your palm. "Now you can describe shapes with precision."`,
  concept:{
    html:`The regex toolbox:\n\n| Piece | Matches |\n|---|---|\n| \`\\d\` | a digit |\n| \`\\w\` | a letter, digit or underscore |\n| \`\\s\` | whitespace |\n| \`.\` | any one character |\n| \`[A-Z]\` | any one capital |\n| \`[a-z0-9]\` | a lowercase letter or digit |\n| \`+\` / \`*\` / \`?\` | one-or-more / zero-or-more / optional |\n| \`{3}\` / \`{2,4}\` | exactly 3 / between 2 and 4 |\n| \`^\` / \`$\` | start / end of the text |\n\n\`re.fullmatch(pattern, text)\` requires the **whole text** to match - ideal for validating input.\n\n\`\`\`\nre.fullmatch(r"[A-Z]{2}\\d{3}", "AB123")   # match\nre.fullmatch(r"[A-Z]{2}\\d{3}", "AB1234")  # None (too long)\n\`\`\``,
    analogy:`A mould: the dough only fits if every part lines up.`,
    example:R`import re
print(bool(re.fullmatch(r"[A-Z]{2}\d{3}", "AB123")))
print(bool(re.fullmatch(r"[A-Z]{2}\d{3}", "AB1234")))`},
  predict:{code:R`import re
print(bool(re.fullmatch(r"\d{3}", "12")))`, q:'What prints?', opts:['False','True','None'], ans:0, why:'Exactly 3 digits are required, and the text only has 2.'},
  cast:{code:R`import re
print(bool(re.fullmatch(r"[A-Z]{2}\d{3}", "AB123")))
print(bool(re.fullmatch(r"[A-Z]{2}\d{3}", "AB1234")))`, task:'Cast it.'},
  bug:{broken:R`import re
code = "AB1234"
if re.search(r"[A-Z]{2}\d{3}", code):
    print("Valid")
else:
    print("Invalid")`, task:'"AB1234" has 4 digits, so it should be Invalid. search finds a match anywhere. Require the WHOLE text to match.',
    cases:[{inputs:[],tests:[['Invalid','out.strip()=="Invalid"'],['Uses fullmatch','"fullmatch" in src']]}],
    sol:R`import re
code = "AB1234"
if re.fullmatch(r"[A-Z]{2}\d{3}", code):
    print("Valid")
else:
    print("Invalid")`, wrong:[R`import re
code = "AB1234"
if re.search(r"[A-Z]{2}\d{3}", code):
    print("Valid")
else:
    print("Invalid")`]},
  write:{prompt:'Ask `Code: `. A valid code is **2 capital letters followed by 3 digits**, nothing else. Print `Valid` or `Invalid`.',
    starter:R`import re
code = input("Code: ")
`,
    inputs:['AB123'],
    cases:[{inputs:['AB123'],tests:[['AB123','lines[-1]=="Valid"']]},{inputs:['ab123'],tests:[['lowercase','lines[-1]=="Invalid"']]},{inputs:['ABC12'],tests:[['wrong shape','lines[-1]=="Invalid"']]},{inputs:['AB1234'],tests:[['too long','lines[-1]=="Invalid"']]},{inputs:['AB12'],tests:[['too short','lines[-1]=="Invalid"']]},{inputs:['XZ999'],tests:[['XZ999','lines[-1]=="Valid"']]}],
    sol:R`import re
code = input("Code: ")
if re.fullmatch(r"[A-Z]{2}\d{3}", code):
    print("Valid")
else:
    print("Invalid")`,
    wrong:[R`import re
code = input("Code: ")
if re.search(r"[A-Z]{2}\d{3}", code):
    print("Valid")
else:
    print("Invalid")`, R`import re
code = input("Code: ")
if re.fullmatch(r"[A-Z]+\d+", code):
    print("Valid")
else:
    print("Invalid")`],
    hints:['Pattern: two capitals [A-Z]{2} then three digits \\d{3}.','Use re.fullmatch so the whole text must match.','if re.fullmatch(...): print Valid, else Invalid.','import re\ncode = input("Code: ")\nif re.fullmatch(r"[A-Z]{2}\\d{3}", code):\n    print("Valid")\nelse:\n    print("Invalid")']},
  power:{can:['Validate formats like IDs and codes','Describe text shapes precisely'],
    expand:'Validate a UK-style postcode or a simple date r"\\d{4}-\\d{2}-\\d{2}".',
    where:'Form validation, log parsing and data cleaning use classes and counts constantly.',
    next:'Next: groups - pulling the parts out of a match.'},
  codex:{title:'Regex toolbox',body:'\\d \\w \\s . [A-Z] + * ? {n} ^ $. fullmatch for whole-text validation.',snip:R`re.fullmatch(r"[A-Z]{2}\d{3}", code)`}
}
);
