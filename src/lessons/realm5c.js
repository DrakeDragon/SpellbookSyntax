// REALM 5 — SCROLLS & INK — part C (lessons 17-24)
LESSONS.push(
{
  id:'r5-17', realm:5, n:17, title:'Regex 3: groups and findall',
  teaches:['re-groups'], requires:['re-classes'],
  story:`"A match is a lump," says Turing's Ghost, "but sometimes you want the *pieces*. Put brackets round the parts you care about and the pattern hands them to you separately."`,
  concept:{
    html:`**Groups.** Round brackets capture parts of a match:\n\n\`\`\`\nm = re.fullmatch(r"(\\d{4})-(\\d{2})-(\\d{2})", "2026-10-23")\nm.group(1)     # '2026'\nm.group(2)     # '10'\nm.group(3)     # '23'\nm.group()      # '2026-10-23'  (whole match)\n\`\`\`\n\n**findall.** \`re.findall(pattern, text)\` returns a **list of every match**:\n\n\`\`\`\nre.findall(r"\\d+", "a1b22c333")     # ['1', '22', '333']\n\`\`\`\n\nWith one group it returns just that group's text; with several groups it returns a list of tuples.\n\nBrackets for grouping use \`( )\`; to match a literal bracket escape it: \`\\(\`.`,
    analogy:`A form with boxes: the whole page is the match, each box is a group.`,
    example:R`import re
m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", "2026-10-23")
print(m.group(1), m.group(2), m.group(3))
print(re.findall(r"\d+", "a1b22c333"))`},
  predict:{code:R`import re
print(re.findall(r"\d+", "a1b22c333"))`, q:'What prints?', opts:["['1', '22', '333']","['1', '2', '2', '3', '3', '3']","['a1b22c333']"], ans:0, why:'Every run of digits is one match.'},
  cast:{code:R`import re
m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", "2026-10-23")
print(m.group(1), m.group(2), m.group(3))
print(re.findall(r"\d+", "a1b22c333"))`, task:'Cast it.'},
  bug:{broken:R`import re
m = re.fullmatch(r"(\d{4})-(\d{2})", "2026-10")
print(m.group())`, task:'It prints the whole match. Print only the year (group 1).',
    cases:[{inputs:[],tests:[['Prints 2026','out.strip()=="2026"'],['Uses group(1)','"group(1)" in src']]}],
    sol:R`import re
m = re.fullmatch(r"(\d{4})-(\d{2})", "2026-10")
print(m.group(1))`, wrong:[R`import re
m = re.fullmatch(r"(\d{4})-(\d{2})", "2026-10")
print(m.group())`]},
  write:{prompt:'Ask `Date: ` in the form `2026-10-23`. Print `Year: 2026`, `Month: 10`, `Day: 23`. If it does not match exactly 4-2-2 digits, print `Bad date`.',
    starter:R`import re
text = input("Date: ")
`,
    inputs:['2026-10-23'],
    cases:[{inputs:['2026-10-23'],tests:[['Good','lines[1:]==["Year: 2026","Month: 10","Day: 23"]']]},{inputs:['1999-01-05'],tests:[['Another','lines[1:]==["Year: 1999","Month: 01","Day: 05"]']]},{inputs:['10-23-2026'],tests:[['Wrong order','lines[1:]==["Bad date"]']]},{inputs:['2026-1-5'],tests:[['Short parts','lines[1:]==["Bad date"]']]},{inputs:['x2026-10-23'],tests:[['Extra text','lines[1:]==["Bad date"]']]}],
    sol:R`import re
text = input("Date: ")
m = re.fullmatch(r"(\d{4})-(\d{2})-(\d{2})", text)
if m:
    print("Year:", m.group(1))
    print("Month:", m.group(2))
    print("Day:", m.group(3))
else:
    print("Bad date")`,
    wrong:[R`import re
text = input("Date: ")
year, month, day = text.split("-")
print("Year:", year)
print("Month:", month)
print("Day:", day)`, R`import re
text = input("Date: ")
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", text)
if m:
    print("Year:", m.group(1))
    print("Month:", m.group(2))
    print("Day:", m.group(3))
else:
    print("Bad date")`],
    hints:['Pattern with three groups: (\\d{4})-(\\d{2})-(\\d{2}).','Use re.fullmatch and check if m.','m.group(1), m.group(2), m.group(3).','import re\ntext = input("Date: ")\nm = re.fullmatch(r"(\\d{4})-(\\d{2})-(\\d{2})", text)\nif m:\n    print("Year:", m.group(1))\n    print("Month:", m.group(2))\n    print("Day:", m.group(3))\nelse:\n    print("Bad date")']},
  power:{can:['Pull the parts out of structured text','Collect every match with findall'],
    expand:'Use findall to list all the 4-digit years in a paragraph.',
    where:'Parsing dates, versions, URLs and log lines uses groups every day.',
    next:'Next: search-and-replace with patterns.'},
  codex:{title:'Groups and findall',body:'(...) captures. m.group(1) is the first group. re.findall returns every match as a list.',snip:R`re.findall(r"\d+", text)`}
},
{
  id:'r5-18', realm:5, n:18, title:'Regex 4: re.sub, re.split and flags',
  teaches:['re-sub'], requires:['re-groups','str-replace'],
  story:`"Replace works on exact text," Turing's Ghost says. "But what about *every number*, or *any run of spaces*? For that, replace gets a pattern."`,
  concept:{
    html:`\`re.sub(pattern, replacement, text)\` is **replace for patterns**:\n\n\`\`\`\nre.sub(r"\\d+", "#", "a22b333")      # 'a#b#'\nre.sub(r"\\s+", " ", "a   b \\n c")  # 'a b c'  (collapse whitespace)\n\`\`\`\n\n\`re.split(pattern, text)\` splits on a pattern:\n\n\`\`\`\nre.split(r"[,;]\\s*", "a, b;c")      # ['a', 'b', 'c']\n\`\`\`\n\n**Flags** change matching rules. The most common is ignoring case:\n\n\`\`\`\nre.sub(r"cat", "dog", "Cat cat", flags=re.IGNORECASE)   # 'dog dog'\n\`\`\`\n\nThe pattern \`\\d+\` takes the **whole** run of digits as one match; \`\\d\` would replace each digit separately.`,
    analogy:`Find-and-Replace with a wildcard.`,
    example:R`import re
print(re.sub(r"\d+", "#", "a22b333"))
print(re.sub(r"\s+", " ", "a   b    c"))
print(re.split(r"[,;]\s*", "a, b;c"))`},
  predict:{code:R`import re
print(re.sub(r"cat", "dog", "Cat cat", flags=re.IGNORECASE))`, q:'What prints?', opts:['dog dog','Cat dog','Cat cat'], ans:0, why:'IGNORECASE makes "Cat" match too.'},
  cast:{code:R`import re
print(re.sub(r"\d+", "#", "a22b333"))
print(re.sub(r"\s+", " ", "a   b    c"))
print(re.split(r"[,;]\s*", "a, b;c"))`, task:'Cast it.'},
  bug:{broken:R`import re
print(re.sub(r"\d", "#", "a22b333"))`, task:'It prints a##b###. Make each whole run of digits become a single #.',
    cases:[{inputs:[],tests:[['Prints a#b#','out.strip()=="a#b#"']]}],
    sol:R`import re
print(re.sub(r"\d+", "#", "a22b333"))`, wrong:[R`import re
print(re.sub(r"\d", "#", "a22b333"))`]},
  write:{prompt:'Ask `Text: `. First replace every run of digits with `#`, then collapse every run of whitespace into a single space. Print the result.',
    starter:R`import re
text = input("Text: ")
`,
    inputs:['call   555 1234  now'],
    cases:[{inputs:['call   555 1234  now'],tests:[['call','lines[-1]=="call # # now"']]},{inputs:['a1b22c333'],tests:[['digits','lines[-1]=="a#b#c#"']]},{inputs:['no digits   here'],tests:[['spaces','lines[-1]=="no digits here"']]},{inputs:['x'],tests:[['plain','lines[-1]=="x"']]}],
    sol:R`import re
text = input("Text: ")
text = re.sub(r"\d+", "#", text)
text = re.sub(r"\s+", " ", text)
print(text)`,
    wrong:[R`import re
text = input("Text: ")
text = re.sub(r"\d", "#", text)
text = re.sub(r"\s+", " ", text)
print(text)`, R`import re
text = input("Text: ")
text = re.sub(r"\d+", "#", text)
print(text)`],
    hints:['re.sub(r"\\d+", "#", text) handles the digits.','A second re.sub with r"\\s+" and " " collapses whitespace.','Print the final text.','import re\ntext = input("Text: ")\ntext = re.sub(r"\\d+", "#", text)\ntext = re.sub(r"\\s+", " ", text)\nprint(text)']},
  power:{can:['Search-and-replace by pattern','Normalise messy whitespace','Split on several separators at once'],
    expand:'Use re.sub with groups: re.sub(r"(\\w+)@(\\w+)", r"\\2 at \\1", text).',
    where:'Cleaning scraped data, masking secrets in logs and normalising input all use re.sub.',
    next:'Next: parsing comma-separated rows safely.'},
  codex:{title:'re.sub and re.split',body:'re.sub(pattern, repl, text) replaces by pattern. re.split splits by pattern. flags=re.IGNORECASE ignores case.',snip:R`re.sub(r"\s+", " ", text)`}
},
{
  id:'r5-19', realm:5, n:19, title:'Parsing CSV-style rows safely',
  teaches:['parse-csv'], requires:['re-sub','validate-if'],
  story:`The scribes send data as rows: *name,score*. Some rows are broken. "Never trust a row," warns Turing's Ghost. "Split it, clean it, **check it**, and keep count of what you had to skip."`,
  concept:{
    html:`A safe parser follows four steps for every row:\n\n1. **Split**: \`parts = line.split(",")\`\n2. **Clean**: \`parts = [p.strip() for p in parts]\`\n3. **Check**: right number of parts? is the score all digits?\n4. **Use or skip**: good rows are processed; bad rows are counted and skipped.\n\n\`\`\`\nparts = [p.strip() for p in line.split(",")]\nif len(parts) == 2 and parts[1].isdigit():\n    total += int(parts[1])\nelse:\n    skipped += 1\n\`\`\`\n\nBad data is normal. A program that crashes on one bad row is a program nobody trusts.`,
    analogy:`A customs desk: every parcel is opened, checked and either passed or set aside.`,
    example:R`line = " ada , 95 "
parts = [p.strip() for p in line.split(",")]
print(parts)
print(len(parts) == 2 and parts[1].isdigit())`},
  predict:{code:R`parts = [p.strip() for p in " a , 5 ".split(",")]
print(parts)`, q:'What prints?', opts:["['a', '5']","[' a ', ' 5 ']","['a, 5']"], ans:0, why:'Split on commas then strip each piece.'},
  cast:{code:R`line = " ada , 95 "
parts = [p.strip() for p in line.split(",")]
print(parts)
print(len(parts) == 2 and parts[1].isdigit())`, task:'Cast it.'},
  bug:{broken:R`line = "bo,abc"
name, score = line.split(",")
total = int(score)
print(total)`, task:'ValueError: "abc" is not a number. Check with isdigit() and print "Skipped" when it is not.',
    cases:[{inputs:[],tests:[['Skipped','out.strip()=="Skipped"'],['Uses isdigit','".isdigit()" in src']]}],
    sol:R`line = "bo,abc"
name, score = line.split(",")
if score.isdigit():
    print(int(score))
else:
    print("Skipped")`, wrong:[R`line = "bo,abc"
name, score = line.split(",")
total = int(score)
print(total)`]},
  write:{prompt:'Ask `Rows: ` for how many rows, then read that many lines (`Row: `) in the form `name,score`. Add up the valid scores. A row is valid only if it has exactly 2 parts and the score is all digits (ignore stray spaces). Print `Total: n` and `Skipped: k`.',
    starter:R`n = int(input("Rows: "))
`,
    inputs:['3','ada, 95','bo,abc','cy,60'],
    cases:[{inputs:['3','ada, 95','bo,abc','cy,60'],tests:[['Mixed','lines[-2:]==["Total: 155","Skipped: 1"]']]},{inputs:['2','ada,10','bad line'],tests:[['No comma','lines[-2:]==["Total: 10","Skipped: 1"]']]},{inputs:['0'],tests:[['No rows','lines[-2:]==["Total: 0","Skipped: 0"]']]},{inputs:['2',' bo , 7 ','cy,3'],tests:[['Spaces ok','lines[-2:]==["Total: 10","Skipped: 0"]']]},{inputs:['1','a,b,5'],tests:[['Three parts','lines[-2:]==["Total: 0","Skipped: 1"]']]}],
    sol:R`n = int(input("Rows: "))
total = 0
skipped = 0
for i in range(n):
    line = input("Row: ")
    parts = [p.strip() for p in line.split(",")]
    if len(parts) == 2 and parts[1].isdigit():
        total += int(parts[1])
    else:
        skipped += 1
print("Total:", total)
print("Skipped:", skipped)`,
    wrong:[R`n = int(input("Rows: "))
total = 0
skipped = 0
for i in range(n):
    line = input("Row: ")
    parts = line.split(",")
    if len(parts) == 2 and parts[1].isdigit():
        total += int(parts[1])
    else:
        skipped += 1
print("Total:", total)
print("Skipped:", skipped)`, R`n = int(input("Rows: "))
total = 0
skipped = 0
for i in range(n):
    line = input("Row: ")
    parts = [p.strip() for p in line.split(",")]
    total += int(parts[1])
print("Total:", total)
print("Skipped:", skipped)`],
    hints:['For each row: parts = [p.strip() for p in line.split(",")].','Valid when len(parts) == 2 and parts[1].isdigit(): add to total, otherwise skipped += 1.','Print Total and Skipped after the loop.','n = int(input("Rows: "))\ntotal = 0\nskipped = 0\nfor i in range(n):\n    line = input("Row: ")\n    parts = [p.strip() for p in line.split(",")]\n    if len(parts) == 2 and parts[1].isdigit():\n        total += int(parts[1])\n    else:\n        skipped += 1\nprint("Total:", total)\nprint("Skipped:", skipped)']},
  power:{can:['Read messy delimited data without crashing','Report how much data was rejected'],
    expand:'Store the good rows as a list of dicts and sort them by score.',
    where:'Importing spreadsheets, logs and user uploads always needs this defensive pattern.',
    next:'Mission time: pull contact details out of a messy paragraph.'},
  codex:{title:'Safe row parsing',body:'Split, strip, check length and types, then use or skip. Count what you skip.',snip:R`parts = [p.strip() for p in line.split(",")]`}
},
{
  id:'r5-20', realm:5, n:20, title:'Real-World Mission: Contact Extractor',
  teaches:['mission5a'], requires:['parse-csv','sets'],
  story:`A tired recruiter slumps beside the scrolls, a mountain of messy emails on her desk. "I need every email address and phone number out of these," she groans. Turing's Ghost smiles. "That is a regex job. **Your first one.**"`,
  concept:{
    html:`**Mission brief:** a contact extractor.\n\nAsk \`Text: \` (one messy line). Find:\n\n- **emails**: letters, digits, dots or underscores, then \`@\`, then a domain with at least one dot. Pattern: \`[\\w.]+@[\\w.]+\\.\\w+\`\n- **phones**: format \`555-123-4567\` (3-3-4 digits). Pattern: \`\\d{3}-\\d{3}-\\d{4}\`\n\nPrint **each distinct value once, in the order first seen**:\n\n\`\`\`\nEmails: 2\n- ada@lab.org\n- bo.k@mail.co.uk\nPhones: 1\n- 555-123-4567\n\`\`\`\n\nUse \`re.findall\`, a \`seen\` set (or \`not in\` a list) and the f-string you know.`,
    analogy:`A metal detector for contact details.`,
    example:R`import re
text = "write to ada@lab.org or call 555-123-4567"
print(re.findall(r"[\w.]+@[\w.]+\.\w+", text))
print(re.findall(r"\d{3}-\d{3}-\d{4}", text))`},
  predict:{code:R`import re
print(len(re.findall(r"\d{3}-\d{4}", "555-1234 and 555-9876")))`, q:'What prints?', opts:['2','1','0'], ans:0, why:'Two phone-shaped pieces exist.'},
  cast:{code:R`import re
text = "write to ada@lab.org or call 555-123-4567"
print(re.findall(r"[\w.]+@[\w.]+\.\w+", text))
print(re.findall(r"\d{3}-\d{3}-\d{4}", text))`, task:'Cast it. This is the heart of the mission.'},
  bug:{broken:R`import re
text = "mail bo.k@mail.co.uk now"
print(re.findall(r"\w+@\w+\.\w+", text))`, task:'It misses the address: dots in the name and domain are not covered by \\w. Allow dots.',
    cases:[{inputs:[],tests:[['Found full address','out.strip()=="[\'bo.k@mail.co.uk\']"']]}],
    sol:R`import re
text = "mail bo.k@mail.co.uk now"
print(re.findall(r"[\w.]+@[\w.]+\.\w+", text))`, wrong:[R`import re
text = "mail bo.k@mail.co.uk now"
print(re.findall(r"\w+@\w+\.\w+", text))`]},
  write:{prompt:'Build the contact extractor from the brief. Use the exact output format shown. If nothing is found, still print `Emails: 0` and `Phones: 0`.',
    starter:R`import re
text = input("Text: ")
`,
    inputs:['Mail ada@lab.org or bo.k@mail.co.uk, call 555-123-4567 or 555-987-6543.'],
    cases:[{inputs:['Mail ada@lab.org or bo.k@mail.co.uk, call 555-123-4567 or 555-987-6543.'],tests:[['Full','lines[1:]==["Emails: 2","- ada@lab.org","- bo.k@mail.co.uk","Phones: 2","- 555-123-4567","- 555-987-6543"]']]},{inputs:['no contact info'],tests:[['Nothing','lines[1:]==["Emails: 0","Phones: 0"]']]},{inputs:['a@b.io a@b.io 555-111-2222 555-111-2222'],tests:[['Duplicates once','lines[1:]==["Emails: 1","- a@b.io","Phones: 1","- 555-111-2222"]']]},{inputs:['call 555-111-2222 today'],tests:[['Phone only','lines[1:]==["Emails: 0","Phones: 1","- 555-111-2222"]']]}],
    sol:R`import re
text = input("Text: ")
emails = []
for e in re.findall(r"[\w.]+@[\w.]+\.\w+", text):
    if e not in emails:
        emails.append(e)
phones = []
for p in re.findall(r"\d{3}-\d{3}-\d{4}", text):
    if p not in phones:
        phones.append(p)
print("Emails:", len(emails))
for e in emails:
    print("-", e)
print("Phones:", len(phones))
for p in phones:
    print("-", p)`,
    wrong:[R`import re
text = input("Text: ")
emails = re.findall(r"[\w.]+@[\w.]+\.\w+", text)
phones = re.findall(r"\d{3}-\d{3}-\d{4}", text)
print("Emails:", len(emails))
for e in emails:
    print("-", e)
print("Phones:", len(phones))
for p in phones:
    print("-", p)`, R`import re
text = input("Text: ")
emails = []
for e in re.findall(r"\w+@\w+\.\w+", text):
    if e not in emails:
        emails.append(e)
phones = []
for p in re.findall(r"\d{3}-\d{3}-\d{4}", text):
    if p not in phones:
        phones.append(p)
print("Emails:", len(emails))
for e in emails:
    print("-", e)
print("Phones:", len(phones))
for p in phones:
    print("-", p)`],
    hints:['re.findall with the email pattern and the phone pattern from the brief.','Remove duplicates but keep the order: only append when not already in the list.','Print the count, then each item with "- " in front.','import re\ntext = input("Text: ")\nemails = []\nfor e in re.findall(r"[\\w.]+@[\\w.]+\\.\\w+", text):\n    if e not in emails:\n        emails.append(e)\nphones = []\nfor p in re.findall(r"\\d{3}-\\d{3}-\\d{4}", text):\n    if p not in phones:\n        phones.append(p)\nprint("Emails:", len(emails))\nfor e in emails:\n    print("-", e)\nprint("Phones:", len(phones))\nfor p in phones:\n    print("-", p)']},
  power:{can:['Extract structured contact data from messy text','Combine regex, lists and loops in a useful tool'],
    expand:'Also extract web links with r"https?://\\S+" and print them under a Links: heading.',
    where:'Lead generation, log analysis and data-cleaning scripts do exactly this.',
    next:'Next mission: a neat printed receipt.'},
  codex:{title:'Mission: contact extractor',body:'re.findall for each pattern, de-duplicate keeping order, print counts and bullet lines.',snip:R`re.findall(r"[\w.]+@[\w.]+\.\w+", text)`}
},
{
  id:'r5-21', realm:5, n:21, title:'Real-World Mission: The Receipt Printer',
  teaches:['mission5b'], requires:['mission5a','fmt-align','fmt-num'],
  story:`A market stallholder pushes a stack of crumpled slips across the desk. "Customers want proper receipts," she says. "Aligned columns, two decimals, a clean total." Turing's Ghost nudges you. "Tools: split, strip, f-string formats. Make it beautiful."`,
  concept:{
    html:`**Mission brief:** a receipt printer.\n\nAsk \`Items: \` for a count, then read that many lines (\`Line: \`) like \`rope,2,12.5\` (item, quantity, unit price). Print:\n\n\`\`\`\nItem        Qty     Total\nrope          2     25.00\nlantern       1    250.00\n-------------------------\nTOTAL            275.00\n\`\`\`\n\n- item left-aligned in **10**, qty right-aligned in **5**, total right-aligned in **10** with commas and 2 decimals\n- the dashed line is **25** dashes\n- the TOTAL label is left-aligned in **15**, the grand total right-aligned in **10**\n\nThe rows may have stray spaces. Strip each piece.`,
    analogy:`The little printer at a till, built from your own formatting spells.`,
    example:R`item, qty, price = "rope,2,12.5".split(",")
total = int(qty) * float(price)
print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")`},
  predict:{code:R`print(f"{1500 * 3:>10,.2f}")`, q:'What prints?', opts:['  4,500.00','4500','  4500.00'], ans:0, why:'Commas, 2 decimals, right-aligned in 10.'},
  cast:{code:R`item, qty, price = "rope,2,12.5".split(",")
total = int(qty) * float(price)
print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")`, task:'Cast it. One row of the receipt.'},
  bug:{broken:R`item, qty, price = "rope,2,12.5".split(",")
total = int(qty) * float(price)
print(f"{item:<10}{int(qty):>5}{total:>10}")`, task:'The total shows 25.0 but a receipt needs 2 decimals (and commas for big values).',
    cases:[{inputs:[],tests:[['Formatted','out.rstrip("\\n")=="rope".ljust(10)+"2".rjust(5)+"25.00".rjust(10)'],['Uses a format spec','".2f" in src']]}],
    sol:R`item, qty, price = "rope,2,12.5".split(",")
total = int(qty) * float(price)
print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")`, wrong:[R`item, qty, price = "rope,2,12.5".split(",")
total = int(qty) * float(price)
print(f"{item:<10}{int(qty):>5}{total:>10}")`]},
  write:{prompt:'Build the receipt printer from the brief. Print the header, one row per item, the dashed line, then the TOTAL row.',
    starter:R`n = int(input("Items: "))
`,
    inputs:['2','rope,2,12.5','lantern,1,250'],
    cases:[{inputs:['2','rope,2,12.5','lantern,1,250'],tests:[['Receipt','[l for l in lines if not l.startswith(("Line: ","Items: "))]==["Item".ljust(10)+"Qty".rjust(5)+"Total".rjust(10),"rope".ljust(10)+"2".rjust(5)+"25.00".rjust(10),"lantern".ljust(10)+"1".rjust(5)+"250.00".rjust(10),"-"*25,"TOTAL".ljust(15)+"275.00".rjust(10)]']]},{inputs:['1',' gem , 3 , 1500'],tests:[['Commas and spaces','[l for l in lines if not l.startswith(("Line: ","Items: "))]==["Item".ljust(10)+"Qty".rjust(5)+"Total".rjust(10),"gem".ljust(10)+"3".rjust(5)+"4,500.00".rjust(10),"-"*25,"TOTAL".ljust(15)+"4,500.00".rjust(10)]']]},{inputs:['0'],tests:[['Empty','[l for l in lines if not l.startswith(("Line: ","Items: "))]==["Item".ljust(10)+"Qty".rjust(5)+"Total".rjust(10),"-"*25,"TOTAL".ljust(15)+"0.00".rjust(10)]']]}],
    sol:R`n = int(input("Items: "))
print(f"{'Item':<10}{'Qty':>5}{'Total':>10}")
grand = 0
for i in range(n):
    line = input("Line: ")
    item, qty, price = [p.strip() for p in line.split(",")]
    total = int(qty) * float(price)
    grand += total
    print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")
print("-" * 25)
print(f"{'TOTAL':<15}{grand:>10,.2f}")`,
    wrong:[R`n = int(input("Items: "))
print(f"{'Item':<10}{'Qty':>5}{'Total':>10}")
grand = 0
for i in range(n):
    line = input("Line: ")
    item, qty, price = [p.strip() for p in line.split(",")]
    total = int(qty) * float(price)
    grand += total
    print(f"{item:<10}{int(qty):>5}{total:>10.2f}")
print("-" * 25)
print(f"{'TOTAL':<15}{grand:>10.2f}")`, R`n = int(input("Items: "))
print(f"{'Item':<10}{'Qty':>5}{'Total':>10}")
grand = 0
for i in range(n):
    line = input("Line: ")
    item, qty, price = line.split(",")
    total = int(qty) * float(price)
    grand += total
    print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")
print("-" * 25)
print(f"{'TOTAL':<15}{grand:>10,.2f}")`],
    hints:['Print the header with f"{\'Item\':<10}{\'Qty\':>5}{\'Total\':>10}".','Per line: split on commas, strip, total = int(qty) * float(price), add to grand, print the row.','After the loop print "-" * 25 and the TOTAL row.','n = int(input("Items: "))\nprint(f"{\'Item\':<10}{\'Qty\':>5}{\'Total\':>10}")\ngrand = 0\nfor i in range(n):\n    line = input("Line: ")\n    item, qty, price = [p.strip() for p in line.split(",")]\n    total = int(qty) * float(price)\n    grand += total\n    print(f"{item:<10}{int(qty):>5}{total:>10,.2f}")\nprint("-" * 25)\nprint(f"{\'TOTAL\':<15}{grand:>10,.2f}")']},
  power:{can:['Produce professional-looking printed reports','Combine parsing, arithmetic and formatting'],
    expand:'Add a tax line (10%) and a discount code, each on its own aligned row.',
    where:'Invoices, shipping labels, daily summaries and CLI dashboards all use these tools.',
    next:'Next: chain everything into a text-cleaning pipeline.'},
  codex:{title:'Mission: receipt printer',body:'Split and strip rows, compute totals, format with alignment, commas and 2 decimals.',snip:R`f"{item:<10}{qty:>5}{total:>10,.2f}"`}
},
{
  id:'r5-22', realm:5, n:22, title:'The text-cleaning pipeline',
  teaches:['text-pipeline'], requires:['mission5b'],
  story:`"Great scribes don't clean text in one swing," Turing's Ghost says, lining up three inkwells. "They run it through a **pipeline**: each step does one small job, and the output of one feeds the next."`,
  concept:{
    html:`A **pipeline** is a chain of small, simple steps:\n\n\`\`\`\nt = raw.lower()                          # 1. same case\nt = re.sub(r"[^a-z0-9\\s]", "", t)       # 2. drop punctuation\nt = " ".join(t.split())                  # 3. tidy spaces\nslug = t.replace(" ", "-")               # 4. make a slug\n\`\`\`\n\n- \`[^...]\` means "anything **except** these".\n- \`" ".join(t.split())\` strips the ends **and** collapses runs of spaces.\n- A **slug** is the clean, dash-separated version used in web addresses.\n\nSmall steps are easy to test and easy to reorder. When a result looks wrong, print after each step.`,
    analogy:`A car wash: rinse, scrub, rinse, dry - each station does one job.`,
    example:R`import re
raw = "  Hello,   WORLD!! 2026  "
t = raw.lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
t = " ".join(t.split())
print(t)
print(t.replace(" ", "-"))`},
  predict:{code:R`import re
print(re.sub(r"[^a-z]", "", "a1b2"))`, q:'What prints?', opts:['ab','12','a1b2'], ans:0, why:'[^a-z] matches everything except lowercase letters, and those are deleted.'},
  cast:{code:R`import re
raw = "  Hello,   WORLD!! 2026  "
t = raw.lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
t = " ".join(t.split())
print(t)
print(t.replace(" ", "-"))`, task:'Cast it. Add a print after each step to watch the text change.'},
  bug:{broken:R`import re
t = "Python & Java".lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
print(t)`, task:'Removing "&" leaves two spaces between the words. Tidy the spaces too.',
    cases:[{inputs:[],tests:[['Single space','out.strip()=="python java"']]}],
    sol:R`import re
t = "Python & Java".lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
t = " ".join(t.split())
print(t)`, wrong:[R`import re
t = "Python & Java".lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
print(t)`]},
  write:{prompt:'Ask `Text: `. Lowercase it, remove everything except letters, digits and whitespace, tidy the spaces, then print `Clean: ...` and `Slug: ...` (words joined with dashes).',
    starter:R`import re
raw = input("Text: ")
`,
    inputs:['  Hello,   WORLD!! 2026  '],
    cases:[{inputs:['  Hello,   WORLD!! 2026  '],tests:[['Hello','lines[1:]==["Clean: hello world 2026","Slug: hello-world-2026"]']]},{inputs:['Python & Java'],tests:[['Python','lines[1:]==["Clean: python java","Slug: python-java"]']]},{inputs:['One'],tests:[['One','lines[1:]==["Clean: one","Slug: one"]']]},{inputs:["It's a   Trap!"],tests:[['Apostrophe removed','lines[1:]==["Clean: its a trap","Slug: its-a-trap"]']]}],
    sol:R`import re
raw = input("Text: ")
t = raw.lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
t = " ".join(t.split())
print("Clean:", t)
print("Slug:", t.replace(" ", "-"))`,
    wrong:[R`import re
raw = input("Text: ")
t = raw.lower()
t = re.sub(r"[^a-z0-9\s]", "", t)
print("Clean:", t.strip())
print("Slug:", t.strip().replace(" ", "-"))`, R`import re
raw = input("Text: ")
t = raw.lower()
t = " ".join(t.split())
print("Clean:", t)
print("Slug:", t.replace(" ", "-"))`],
    hints:['Step 1 lowercase. Step 2 re.sub(r"[^a-z0-9\\s]", "", t). Step 3 " ".join(t.split()).','The slug is the clean text with spaces replaced by dashes.','Print both with labels.','import re\nraw = input("Text: ")\nt = raw.lower()\nt = re.sub(r"[^a-z0-9\\s]", "", t)\nt = " ".join(t.split())\nprint("Clean:", t)\nprint("Slug:", t.replace(" ", "-"))']},
  power:{can:['Design multi-step text cleaners','Make web-friendly slugs'],
    expand:'Add a step that turns "&" into "and" BEFORE removing punctuation.',
    where:'Search indexing, URL slugs and import scripts all start with a cleaning pipeline.',
    next:'Boss time: the Ink Wraith.'},
  codex:{title:'Pipelines',body:'Chain small steps: lower, remove punctuation, tidy spaces, make a slug. Print after each step to debug.',snip:R`t = " ".join(t.split())`}
},
{
  id:'r5-23', realm:5, n:23, title:'Boss: The Ink Wraith', kind:'boss',
  teaches:['realm5-boss'], requires:['text-pipeline','re-groups','str-check'],
  story:`The Scriptorium lamps gutter. Ink bleeds off every shelf, pooling into a towering shape with a hundred smeared faces: the **Ink Wraith**, who rewrites every scroll into nonsense. "Your quill is sharp," whispers Turing's Ghost. "Cut it down with clean text."`,
  boss:{name:'The Ink Wraith', hp:5},
  phases:[
    {type:'mcq', code:R`s = "hello"
t = s.upper()
print(s, t)`, q:'Strike 1: What prints?', opts:['hello HELLO','HELLO HELLO','hello hello'], ans:0,
     why:'upper() returns a new string. s is unchanged.', tags:['r5-02','r5-03']},
    {type:'write', prompt:'Strike 2: Ask `Text: `. Print `Vowels: n` and `Consonants: m`. Count only letters (a-z, any case). `y` counts as a consonant.',
     starter:R`text = input("Text: ")
`,
     inputs:['Hello World'],
     cases:[{inputs:['Hello World'],tests:[['Hello World','lines[-2:]==["Vowels: 3","Consonants: 7"]']]},{inputs:['AEIOU'],tests:[['Vowels only','lines[-2:]==["Vowels: 5","Consonants: 0"]']]},{inputs:['123 !'],tests:[['No letters','lines[-2:]==["Vowels: 0","Consonants: 0"]']]},{inputs:['rhythm'],tests:[['No vowels','lines[-2:]==["Vowels: 0","Consonants: 6"]']]}],
     sol:R`text = input("Text: ")
vowels = 0
consonants = 0
for ch in text.lower():
    if ch.isalpha():
        if ch in "aeiou":
            vowels += 1
        else:
            consonants += 1
print("Vowels:", vowels)
print("Consonants:", consonants)`,
     wrong:[R`text = input("Text: ")
vowels = 0
consonants = 0
for ch in text.lower():
    if ch in "aeiou":
        vowels += 1
    else:
        consonants += 1
print("Vowels:", vowels)
print("Consonants:", consonants)`, R`text = input("Text: ")
vowels = 0
consonants = 0
for ch in text:
    if ch.isalpha():
        if ch in "aeiou":
            vowels += 1
        else:
            consonants += 1
print("Vowels:", vowels)
print("Consonants:", consonants)`],
     hints:['Loop over text.lower(). Only look at letters (isalpha).','If the letter is in "aeiou" add to vowels, otherwise consonants.','Print both counts with labels.','text = input("Text: ")\nvowels = 0\nconsonants = 0\nfor ch in text.lower():\n    if ch.isalpha():\n        if ch in "aeiou":\n            vowels += 1\n        else:\n            consonants += 1\nprint("Vowels:", vowels)\nprint("Consonants:", consonants)'], tags:['r5-01','r5-13','r5-03']},
    {type:'mcq', code:R`print(f"{7:03d}|{2.5:>6.1f}|")`, q:'Strike 3: What prints?', opts:['007|   2.5|','7|2.5|','007|2.5   |'], ans:0,
     why:'03d pads with zeros to 3 digits. >6.1f right-aligns 1 decimal in 6.', tags:['r5-09','r5-10']},
    {type:'write', prompt:'Strike 4: Ask `Text: `. Use `re.findall` to find every word that starts with a capital letter followed by lowercase letters (like `Ada`). Print them joined with `, `, or `none` if there are none.',
     starter:R`import re
text = input("Text: ")
`,
     inputs:['Ada met Bo in Paris'],
     cases:[{inputs:['Ada met Bo in Paris'],tests:[['Three','lines[-1]=="Ada, Bo, Paris"']]},{inputs:['all lower here'],tests:[['None','lines[-1]=="none"']]},{inputs:['Solo'],tests:[['One','lines[-1]=="Solo"']]},{inputs:['we saw Hopper and Turing'],tests:[['Two','lines[-1]=="Hopper, Turing"']]}],
     sol:R`import re
text = input("Text: ")
names = re.findall(r"[A-Z][a-z]+", text)
if names:
    print(", ".join(names))
else:
    print("none")`,
     wrong:[R`import re
text = input("Text: ")
names = re.findall(r"[A-Z]", text)
if names:
    print(", ".join(names))
else:
    print("none")`, R`import re
text = input("Text: ")
names = re.findall(r"[A-Z][a-z]+", text)
print(", ".join(names))`],
     hints:['Pattern: one capital then one or more lowercase letters: [A-Z][a-z]+','names = re.findall(pattern, text). If the list is empty print none.','Otherwise print ", ".join(names).','import re\ntext = input("Text: ")\nnames = re.findall(r"[A-Z][a-z]+", text)\nif names:\n    print(", ".join(names))\nelse:\n    print("none")'], tags:['r5-17','r5-16','r5-08']},
    {type:'mcq', code:R`import re
print(re.sub(r"\s+", "_", "a  b c"))`, q:'Strike 5: What prints?', opts:['a_b_c','a__b_c','a b c'], ans:0,
     why:'\\s+ matches each whole run of whitespace, so the two spaces become one underscore.', tags:['r5-18']}
  ],
  power:{can:['Count, check, format and search text confidently','Reach for regex when the shape of text matters'],
    expand:'Rebuild strike 2 using a list comprehension and sum().',
    where:'Text work is most of real programming: logs, forms, APIs, files and chat.',
    next:'One more gate: the Gap Check for the Scriptorium.'},
  codex:{title:'Realm 5 boss',body:'You can clean, search, format and parse text, with and without regex.',snip:R`re.findall(r"[A-Z][a-z]+", text)`}
},
{
  id:'r5-24', realm:5, n:24, title:'Gap Check: the Scriptorium Trial', kind:'gap', passPct:80,
  teaches:['realm5-gap'], requires:['realm5-boss'],
  story:`The Wraith dissolves into harmless ink and the lamps blaze up golden. Turing's Ghost bows and lifts a slate. "Eighty percent, scribe. Then the path to the **Spell Forge** (functions!) is open."`,
  phases:[
    {type:'mcq', code:R`print("wizard"[1:3])`, q:'What prints?', opts:['iz','wi','izar'], ans:0, why:'Positions 1 and 2.', tags:['r5-01']},
    {type:'mcq', code:R`s = "hi"
s.upper()
print(s)`, q:'What prints?', opts:['hi','HI','Error'], ans:0, why:'upper() returns a new string. Nothing saved it.', tags:['r5-02','r5-03']},
    {type:'mcq', code:R`print(len("  a ".strip()))`, q:'What prints?', opts:['1','4','2'], ans:0, why:'strip() removes the spaces on both ends, leaving "a".', tags:['r5-04']},
    {type:'mcq', code:R`print("banana".replace("a", "o", 2))`, q:'What prints?', opts:['bonona','bonono','banana'], ans:0, why:'The third argument limits the replacements to the first 2.', tags:['r5-05']},
    {type:'mcq', code:R`print("a b  c".split())`, q:'What prints?', opts:["['a', 'b', 'c']","['a', 'b', '', 'c']","['a b  c']"], ans:0, why:'With no argument, split cuts on any whitespace and ignores extra spaces.', tags:['r5-07']},
    {type:'mcq', code:R`print("-".join(["x", "y", "z"]))`, q:'What prints?', opts:['x-y-z','-x-y-z','xyz'], ans:0, why:'The separator goes between items.', tags:['r5-08']},
    {type:'mcq', code:R`print(f"{3.14159:.1f}")`, q:'What prints?', opts:['3.1','3.14','3'], ans:0, why:'One decimal place.', tags:['r5-10']},
    {type:'mcq', code:R`print(chr(ord("c") + 1))`, q:'What prints?', opts:['d','b','100'], ans:0, why:'c is 99, plus 1 is 100, which is d.', tags:['r5-12']},
    {type:'mcq', code:R`import re
print(re.search(r"\d", "abc"))`, q:'What prints?', opts:['None','False','abc'], ans:0, why:'No digit is found, so search returns None.', tags:['r5-15']},
    {type:'mcq', code:R`import re
print(re.fullmatch(r"[a-z]{3}", "abcd"))`, q:'What prints?', opts:['None','abc','abcd'], ans:0, why:'fullmatch needs the whole text to match, but it has 4 letters, not 3.', tags:['r5-16']},
    {type:'write', pts:2, prompt:'Final trial: ask `Name: ` in the form `last, first` (spaces anywhere, any capitalisation). Print `First Last` with each name capitalised properly.',
     starter:R`raw = input("Name: ")
`,
     inputs:['lovelace, ada'],
     cases:[{inputs:['lovelace, ada'],tests:[['Ada','lines[-1]=="Ada Lovelace"']]},{inputs:[' hopper ,GRACE '],tests:[['Grace','lines[-1]=="Grace Hopper"']]},{inputs:['turing,alan'],tests:[['Alan','lines[-1]=="Alan Turing"']]},{inputs:['KNUTH ,  donald'],tests:[['Donald','lines[-1]=="Donald Knuth"']]}],
     sol:R`raw = input("Name: ")
last, first = [p.strip() for p in raw.split(",")]
print(first.title(), last.title())`,
     wrong:[R`raw = input("Name: ")
last, first = raw.split(",")
print(first.title(), last.title())`, R`raw = input("Name: ")
last, first = [p.strip() for p in raw.split(",")]
print(last.title(), first.title())`],
     hints:['Split on the comma and strip each piece.','last, first = [p.strip() for p in raw.split(",")]','Print first.title() then last.title().','raw = input("Name: ")\nlast, first = [p.strip() for p in raw.split(",")]\nprint(first.title(), last.title())'], tags:['r5-07','r5-04','r5-03']}
  ],
  power:{can:['Clean, format, search and parse text','Use regular expressions for real extraction jobs'],
    expand:'Replay any lesson from the Training Grounds to sharpen a weak spot.',
    where:'You can now process the text behind forms, files, logs and web pages. A true Scribe.',
    next:'Realm 6: the Spell Forge - build your own functions!'},
  codex:{title:'Scriptorium Trial passed',body:'Text is a sequence of characters with a rich toolbox: methods, formats and regular expressions.',snip:R`first.title() + " " + last.title()`}
}
);
