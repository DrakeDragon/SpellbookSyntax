// REALM 0 — THE AWAKENING (12 lessons)
LESSONS.push(
{
  id:'r0-01', realm:0, n:1, title:'What code is',
  teaches:['code'], requires:[],
  story:`The Hollow Market smells of rain and old paper. You were hauling crates when a book tumbled off a stall and landed open at your feet. On its cover sits a ferret in a crooked wizard hat. "I'm **Sudo**," he says. "Don't touch the--" You touch it. "...Fine. Welcome to magic. It's just very precise instructions."`,
  concept:{
    html:`Code is a list of instructions a computer follows **exactly**, one line at a time, from the top down. No guessing. No "you know what I meant."\n\nPython is the language we'll use. It is readable, powerful, and used everywhere, from games to space science. A tiny program is called a **spell** here.\n\nYour first spell uses \`print()\`. It makes text appear on screen.`,
    analogy:`Think of a robot chef that does *exactly* what the recipe says, even when the recipe is silly.`,
    example:R`print("Hello, Verith")`},
  predict:{code:R`print("Hello, Verith")`, q:'What do you think this spell does?',
    opts:['It shows the words Hello, Verith','It deletes the book','It does nothing'], ans:0,
    why:'print() displays text. The words inside the quotes are what appear.'},
  cast:{code:R`print("The Spellbook is open")`, task:'Press **Cast** to run your first spell. Then change the words and cast again.'},
  write:{prompt:'Change the words inside the quotes so the spell displays exactly: `My first spell works`',
    starter:R`print("Hello, Verith")`,
    cases:[{inputs:[],tests:[['Displays exactly: My first spell works','out.strip()=="My first spell works"']]}],
    sol:R`print("My first spell works")`,
    wrong:[R`print("my first spell works")`],
    hints:['Only change what is between the quotation marks.','The capital M matters. Match the text exactly.','print("My first ... works")','print("My first spell works")']},
  power:{can:['Run Python code and see the result','Change a program and re-run it to test an idea'],
    expand:'Make the spell say something different three times. Notice how the output changes each time.',
    where:'Every programmer starts by printing text. It is also how professionals check what their code is doing.',
    next:'Next you will learn what print() really does, and how to make it show several lines.'},
  codex:{title:'Code & spells',body:'Code is precise instructions, run top to bottom. A small program is a spell.',snip:R`print("Hello, Verith")`}
},
{
  id:'r0-02', realm:0, n:2, title:'print(): your first spell',
  teaches:['print'], requires:['code'],
  story:`"Every spell begins the same way," says Sudo, polishing his hat. "You say a word, and the world answers. The word is **print**. Say it with parentheses, or the book gets offended."`,
  concept:{
    html:`\`print(...)\` shows whatever you put between the parentheses.\n\nText must be wrapped in quotes. Each \`print\` starts on a **new line**, so three prints make three lines.\n\nPython runs your lines **in order**, top to bottom. Order matters.`,
    analogy:`Each print is like a person on stage speaking one line. They speak in the order they are lined up.`,
    example:R`print("Ember")
print("Frost")`},
  predict:{code:R`print("Ember")
print("Frost")`, q:'What appears on screen?',
    opts:['Ember and Frost on one line','Ember, then Frost on the next line','Only Frost'], ans:1,
    why:'Each print() starts a new line, and the lines run in order.'},
  cast:{code:R`print("Ember")
print("Frost")
print("Storm")`, task:'Cast it. Then add a fourth element of your own.'},
  bug:{broken:R`print("Fire")
print("Water")
print("Earth")`, task:'Sudo wants the elements in this order: **Water, Fire, Earth**. The spell runs top to bottom. Fix the order.',
    cases:[{inputs:[],tests:[['Prints Water, Fire, Earth in order','lines==["Water","Fire","Earth"]']]}],
    sol:R`print("Water")
print("Fire")
print("Earth")`, wrong:[R`print("Fire")
print("Water")
print("Earth")`]},
  write:{prompt:'Cast a spell that prints two lines: first `Apprentice`, then `Ready`.',
    starter:R`# type your spell below
`,
    cases:[{inputs:[],tests:[['Line 1 is Apprentice','len(lines)>=1 and lines[0]=="Apprentice"'],['Line 2 is Ready','len(lines)==2 and lines[1]=="Ready"']]}],
    sol:R`print("Apprentice")
print("Ready")`,
    wrong:[R`print("Apprentice Ready")`],
    hints:['You need two print() lines, one per line of output.','Each word goes in its own print, inside quotes.','print("Apprentice")\nprint(...)','print("Apprentice")\nprint("Ready")']},
  power:{can:['Show any message you want on screen','Control the order of output by ordering your lines'],
    expand:'Print a 4-line poem of your own, one line per print.',
    where:'Printing is how scripts report progress, results, and problems, from tiny tools to huge data jobs.',
    next:'Next: what actually counts as text, and why quotes matter.'},
  codex:{title:'print()',body:'print(...) displays what is inside the parentheses. Each print starts a new line. Lines run top to bottom.',snip:R`print("Ember")
print("Frost")`}
},
{
  id:'r0-03', realm:0, n:3, title:'Text in quotes (strings)',
  teaches:['strings'], requires:['print'],
  story:`"Quotes," says Sudo, tapping a tiny claw on the page. "They tell Python: *this is just words*. Without them, Python thinks you're naming something it should already know. It does not enjoy being confused."`,
  concept:{
    html:`Text in Python is called a **string**. A string lives inside quotes: \`"double"\` or \`'single'\`. Both work the same.\n\nWhy two kinds? So you can put one kind *inside* the other:\n\n\`'She said "run"'\`\n\nThe quotes are not printed. They just mark where the text starts and ends.`,
    analogy:`Quotes are like gift wrap: they hold the text together. Python unwraps it when printing.`,
    example:R`print("Double quotes")
print('Single quotes')
print("It's fine to mix")`},
  predict:{code:R`print('Ember')
print("Ember")`, q:'How do these two lines differ in output?',
    opts:['They print the same thing','The first is shorter','The second is bold'], ans:0,
    why:'Single and double quotes make the same string. Only the text inside matters.'},
  cast:{code:R`print("Double quotes")
print('Single quotes')
print("It's fine to mix")`, task:'Cast it. Then write a line with an apostrophe in it.'},
  write:{prompt:'Print exactly: `The "Spellbook" is open` (the double quotes are part of the text).',
    starter:R`# hint: wrap the whole thing in single quotes
`,
    cases:[{inputs:[],tests:[['Prints The "Spellbook" is open','out.strip()==\'The "Spellbook" is open\'']]}],
    sol:R`print('The "Spellbook" is open')`,
    wrong:[R`print("The Spellbook is open")`],
    hints:['The text itself contains double quotes, so what should wrap the whole string?','Wrap the string in single quotes instead.','print(\'The "Spellbook" ...\')','print(\'The "Spellbook" is open\')']},
  power:{can:['Print text containing apostrophes and quotation marks','Know why Python needs quotes around text'],
    expand:'Print a line of dialogue with quotes, like: Sudo said "hello".',
    where:'Real programs handle text constantly: names, messages, addresses, file contents.',
    next:'Next: printing several things in one line, and blank lines.'},
  codex:{title:'Strings',body:'A string is text inside quotes. Single or double quotes both work. Use one kind to wrap the other.',snip:R`print('She said "run"')`}
},
{
  id:'r0-04', realm:0, n:4, title:'Printing several things, blank lines',
  teaches:['multiprint'], requires:['strings'],
  story:`"One more trick," says Sudo, "and then the book stops being polite. You can hand print() *several* things at once. It puts a space between each. And if you hand it nothing, it gives you a blank line. Silence has uses."`,
  concept:{
    html:`Separate items with **commas** inside one \`print\`. Python adds a space between them:\n\n\`print("Fire", "and", "Ice")\` prints \`Fire and Ice\`.\n\n\`print()\` with nothing inside prints a **blank line**. Handy for spacing out your output.`,
    analogy:`Commas are like conveyor belts: each item rides along and Python drops a space between them.`,
    example:R`print("Fire", "and", "Ice")
print()
print("Done")`},
  predict:{code:R`print("Fire", "and", "Ice")`, q:'What prints?',
    opts:['FireandIce','Fire and Ice','Fire, and, Ice'], ans:1,
    why:'Commas separate items, and print() puts one space between them.'},
  cast:{code:R`print("Fire", "and", "Ice")
print()
print("Done")`, task:'Cast it. Add a second blank line and see what changes.'},
  bug:{broken:R`print("Welcome")
print("Apprentice")`, task:'There should be a **blank line** between Welcome and Apprentice. Fix it.',
    cases:[{inputs:[],tests:[['Welcome, blank line, Apprentice','lines==["Welcome","","Apprentice"]']]}],
    sol:R`print("Welcome")
print()
print("Apprentice")`, wrong:[R`print("Welcome")
print("Apprentice")`]},
  write:{prompt:'Print `Fire and Ice` using ONE print with three separate strings (use commas). Then a blank line. Then `Done`.',
    starter:R`# your spell here
`,
    cases:[{inputs:[],tests:[['Output is Fire and Ice, blank line, Done','lines==["Fire and Ice","","Done"]'],['Uses commas between separate strings','src.count(",")>=2']]}],
    sol:R`print("Fire", "and", "Ice")
print()
print("Done")`,
    wrong:[R`print("Fire and Ice")
print()
print("Done")`],
    hints:['You need three separate strings inside one print.','print("Fire", ... ) with commas between the three words.','print("Fire", "and", "Ice")\nprint()\n...','print("Fire", "and", "Ice")\nprint()\nprint("Done")']},
  power:{can:['Combine several pieces of text in one line','Add spacing to make output readable'],
    expand:'Print a mini menu with blank lines between sections.',
    where:'Readable output matters: reports, logs, and receipts all rely on clean spacing.',
    next:'Next: Python as a calculator.'},
  codex:{title:'Several items & blank lines',body:'print("a", "b") separates items with a space. print() alone prints a blank line.',snip:R`print("Fire", "and", "Ice")
print()`}
},
{
  id:'r0-05', realm:0, n:5, title:'Python as a calculator',
  teaches:['calc'], requires:['print','strings'],
  story:`"Magic is mostly arithmetic in a nice hat," says Sudo. "Python does the sums. But careful: the same numbers in quotes are just *words that look like numbers*. Python doesn't calculate words."`,
  concept:{
    html:`Python does math. Use \`+\` add, \`-\` subtract, and \`*\` multiply (division comes soon).\n\n\`print(2 + 3)\` prints \`5\`.\n\nBut \`print("2 + 3")\` prints the **text** \`2 + 3\`, because it is in quotes. Quotes mean text. No quotes means "calculate this."`,
    analogy:`A calculator screen versus a sticky note: one computes, the other just displays what is written.`,
    example:R`print(2 + 3)
print("2 + 3")`},
  predict:{code:R`print("2 + 3")
print(2 + 3)`, q:'What are the two lines of output?',
    opts:['5 then 5','2 + 3 then 5','2 + 3 then 2 + 3'], ans:1,
    why:'Inside quotes it is just text. Without quotes, Python calculates.'},
  cast:{code:R`print(5 + 5)
print(8 * 7)
print(100 - 1)`, task:'Cast it. Then try a bigger multiplication.'},
  bug:{broken:R`print("6 * 7")`, task:'Sudo wants the **answer**, 42, not the question. Fix it.',
    cases:[{inputs:[],tests:[['Prints 42','out.strip()=="42"']]}],
    sol:R`print(6 * 7)`, wrong:[R`print("6 * 7")`]},
  write:{prompt:'Print two lines: the result of `12 * 7`, then the result of `100 - 37`.',
    starter:R`# calculate, don't type the answers
`,
    cases:[{inputs:[],tests:[['Prints 84 then 63','lines==["84","63"]'],['Uses * and - to calculate','"*" in src and "-" in src']]}],
    sol:R`print(12 * 7)
print(100 - 37)`,
    wrong:[R`print(84)
print(63)`],
    hints:['No quotes, so Python calculates.','Two prints, each with a math expression inside.','print(12 * 7)\nprint(...)','print(12 * 7)\nprint(100 - 37)']},
  power:{can:['Use Python as a calculator','Tell the difference between text and numbers'],
    expand:'Work out your monthly bills total using a single print and plus signs.',
    where:'Calculators, budgets, game scoring, and data reports all start with arithmetic.',
    next:'Next: leaving yourself notes with comments.'},
  codex:{title:'Calculator basics',body:'+ adds, - subtracts, * multiplies. Quotes make it text; no quotes means calculate.',snip:R`print(12 * 7)`}
},
{
  id:'r0-06', realm:0, n:6, title:'Comments: notes to future you',
  teaches:['comments'], requires:['print'],
  story:`"Here's a secret the best mages know," Sudo whispers. "In six months you will not remember why you wrote that spell. Leave notes. Python will ignore them completely. It's like writing in the margin of a book that cannot read."`,
  concept:{
    html:`A **comment** starts with \`#\`. Python ignores everything after it on that line.\n\nUse comments to explain *why* you did something, or to temporarily switch a line off.\n\n\`# print("Fire")\` does nothing, because the whole line is a comment.`,
    analogy:`A sticky note on a recipe. The chef robot never reads it, but the next human does.`,
    example:R`# This line is a note
print("Ice")  # notes can also sit at the end`},
  predict:{code:R`# print("Fire")
print("Ice")`, q:'What prints?',
    opts:['Fire and Ice','Only Ice','Only Fire'], ans:1,
    why:'The first line is a comment. Python skips it.'},
  cast:{code:R`# This is a comment
print("Comments are invisible to Python")  # even here`, task:'Cast it. Then add your own comment line.'},
  bug:{broken:R`# print("Spell complete")
print("Oops")`, task:'Sudo wants only `Spell complete` to print. Fix the comments.',
    cases:[{inputs:[],tests:[['Only Spell complete prints','lines==["Spell complete"]']]}],
    sol:R`print("Spell complete")
# print("Oops")`, wrong:[R`# print("Spell complete")
print("Oops")`]},
  write:{prompt:'Write a comment line (starting with #) explaining the spell, then print `Fireball`.',
    starter:R`# your comment and spell here
`,
    cases:[{inputs:[],tests:[['Prints Fireball','lines==["Fireball"]'],['Has a comment line starting with #','any(l.strip().startswith("#") for l in src.splitlines() if l.strip()!="# your comment and spell here")']]}],
    sol:R`# This spell prints a fireball
print("Fireball")`,
    wrong:[R`print("Fireball")`],
    hints:['A comment starts with the # symbol.','Put the comment on its own line above the print.','# Explain it\nprint(...)','# This spell prints a fireball\nprint("Fireball")']},
  power:{can:['Document your code so you understand it later','Temporarily disable lines while testing'],
    expand:'Take any earlier spell and add a comment above each line explaining it.',
    where:'Teams rely on comments to explain tricky code. Disabling lines with # is a daily debugging habit.',
    next:'Next: how picky Python is about capitals and spelling.'},
  codex:{title:'Comments',body:'# starts a comment. Python ignores the rest of the line. Use it for notes and to switch lines off.',snip:R`# a note
print("Ice")`}
},
{
  id:'r0-07', realm:0, n:7, title:'Case and spelling matter',
  teaches:['case'], requires:['strings','print'],
  story:`"Python," says Sudo, "has the personality of a very strict librarian. It will not guess. *Print* and *print* are different words. 'ember' and 'Ember' are different text."`,
  concept:{
    html:`Python is **case-sensitive**. \`print\` works. \`Print\` and \`PRINT\` do not.\n\nInside strings, capitals matter too: \`"Ember"\` and \`"ember"\` print differently.\n\nSpelling matters. Punctuation matters. This is not Python being rude; computers need precision.`,
    analogy:`Like a password: one wrong capital and the door stays shut.`,
    example:R`print("Ember")
print("ember")`},
  predict:{code:R`print("Ember")
print("ember")`, q:'What prints?',
    opts:['Ember then ember','Ember then Ember','ember then ember'], ans:0,
    why:'Text prints exactly as typed, capitals included.'},
  cast:{code:R`print("Hello")
print("hello")
print("HELLO")`, task:'Cast it and notice each line prints exactly as typed.'},
  bug:{broken:R`print("hello, verith")`, task:'Sudo insists the greeting is `Hello, Verith`, with capitals. Fix it.',
    cases:[{inputs:[],tests:[['Prints Hello, Verith','out.strip()=="Hello, Verith"']]}],
    sol:R`print("Hello, Verith")`, wrong:[R`print("hello, verith")`]},
  write:{prompt:'Print exactly: `Sudo says: BEWARE of the Null`',
    starter:R`# match capitals exactly
`,
    cases:[{inputs:[],tests:[['Prints Sudo says: BEWARE of the Null','out.strip()=="Sudo says: BEWARE of the Null"']]}],
    sol:R`print("Sudo says: BEWARE of the Null")`,
    wrong:[R`print("Sudo says: beware of the null")`],
    hints:['Copy the text carefully, capitals included.','print("...") with the exact sentence inside the quotes.','print("Sudo says: BEWARE ...")','print("Sudo says: BEWARE of the Null")']},
  power:{can:['Match text exactly','Avoid the #1 beginner mistake: wrong capitals'],
    expand:'Print your name three ways: lowercase, Capitalized, and UPPERCASE.',
    where:'Usernames, file names, and passwords all depend on exact case.',
    next:'Next: what happens when Python can\'t run your code. Time to read your first error.'},
  codex:{title:'Case-sensitive',body:'Python distinguishes capitals: print works, Print does not. Text prints exactly as typed.',snip:R`print("Ember")
print("ember")`}
},
{
  id:'r0-08', realm:0, n:8, title:'Your first error: reading red text',
  teaches:['errors-read'], requires:['case','print'],
  story:`The page flashes red. Sudo does not flinch. "Good! That's the book *talking to you*. Errors are not failure; they're directions. Beginners panic at red text. Mages read it. Bottom line first."`,
  concept:{
    html:`When Python can't run a line, it stops and shows a **traceback**. Read it from the **bottom up**.\n\nThe **last line** names the error and explains it. The line above shows **which line number** broke.\n\n\`\`\`\nTraceback (most recent call last):\n  File "<spell>", line 2, in <module>\nNameError: name 'Print' is not defined\n\`\`\`\n\n\`NameError\` means: "I don't know that word." Often a typo or wrong capital.`,
    analogy:`An error is a GPS saying "recalculating" and telling you where you went wrong. It is help, not punishment.`,
    example:R`print("Before the error")
Print("This line breaks")`},
  predict:{code:R`Print("Hello")`, q:'Python says: NameError: name \'Print\' is not defined. What is the fix?',
    opts:['Use a lowercase p: print','Add more quotes','Delete the line'], ans:0,
    why:'Python only knows print, all lowercase. Capital P is an unknown name.'},
  cast:{code:R`print("Before the error")
Print("This line breaks")
print("This line never runs")`, task:'Cast it on purpose. Read the red text. Which line number broke?', expectError:true},
  bug:{broken:R`Print("Fixed!")`, task:'Read the error, then fix the spell so it prints `Fixed!`.',
    cases:[{inputs:[],tests:[['Prints Fixed!','out.strip()=="Fixed!"']]}],
    sol:R`print("Fixed!")`, wrong:[R`Print("Fixed!")`]},
  write:{prompt:'Cast a spell that prints: `I can read the red text`',
    starter:R`# type your spell below
`,
    cases:[{inputs:[],tests:[['Prints I can read the red text','out.strip()=="I can read the red text"']]}],
    sol:R`print("I can read the red text")`,
    wrong:[R`Print("I can read the red text")`],
    hints:['Lowercase print, parentheses, and quotes.','print("...")','print("I can read ...")','print("I can read the red text")']},
  power:{can:['Read a traceback and find the line number','Understand that an error is guidance, not failure'],
    expand:'Break a spell on purpose in three different ways. Read each message.',
    where:'Professional developers read error messages all day. It is the core debugging skill.',
    next:'Next: SyntaxError, the "I can\'t even understand this sentence" error.'},
  codex:{title:'Reading errors',body:'Read tracebacks bottom-up. The last line names the error. The line number tells you where. NameError means an unknown word.',snip:R`NameError: name 'Print' is not defined`}
},
{
  id:'r0-09', realm:0, n:9, title:'SyntaxError: quotes and parentheses',
  teaches:['syntaxerror'], requires:['errors-read'],
  story:`"Some mistakes are so bad," says Sudo, "that Python refuses to *start*. That's a **SyntaxError**. The sentence is so broken the book can't parse it. Nothing runs, not even the good lines. Harsh, but fair."`,
  concept:{
    html:`A **SyntaxError** means the structure is broken. Python found it *before running anything*, so even earlier lines don't run.\n\nCommon causes:\n- a quote that never closes: \`print("Hello)\`\n- a missing parenthesis: \`print("Hello"\`\n\nPython often points with a \`^\` near the problem. The real mistake may be **a line above**.`,
    analogy:`A sentence missing its full stop: you can't read it properly until it is fixed.`,
    example:R`print("Hello"`},
  predict:{code:R`print("Hello)`, q:'What happens when you cast this?',
    opts:['SyntaxError: the quote never closes','It prints Hello','NameError'], ans:0,
    why:'The opening quote has no matching closing quote, so Python cannot understand the line.'},
  cast:{code:R`print("Opening the book")
print("The quote never closes)`, task:'Cast it and see: does the first line print? Why not?', expectError:true},
  bug:{broken:R`print("Alpha")
print("Beta"
print("Gamma")`, task:'One parenthesis is missing. Find it and fix it so all three lines print.',
    cases:[{inputs:[],tests:[['Prints Alpha, Beta, Gamma','lines==["Alpha","Beta","Gamma"]']]}],
    sol:R`print("Alpha")
print("Beta")
print("Gamma")`, wrong:[R`print("Alpha")
print("Beta"
print("Gamma")`]},
  write:{prompt:'Print exactly (with the parentheses): `(Ready)`. Text inside quotes can contain anything.',
    starter:R`# type your spell below
`,
    cases:[{inputs:[],tests:[['Prints (Ready)','out.strip()=="(Ready)"']]}],
    sol:R`print("(Ready)")`,
    wrong:[R`print((Ready))`],
    hints:['The parentheses to print go INSIDE the quotes.','print("...") with (Ready) inside the quotes.','print("(...)")','print("(Ready)")']},
  power:{can:['Spot unclosed quotes and missing parentheses','Know that syntax errors stop everything before it runs'],
    expand:'Break a spell three ways: missing quote, missing bracket, extra bracket. Read the message each time.',
    where:'Syntax errors are the most common bug in every language. Quickly spotting them saves hours.',
    next:'Next: how Python runs a whole script from top to bottom.'},
  codex:{title:'SyntaxError',body:'The code structure is broken, so nothing runs. Look for unclosed quotes or missing parentheses, often just above the line shown.',snip:R`print("Hello"   # missing )`}
},
{
  id:'r0-10', realm:0, n:10, title:'Running a script, top to bottom',
  teaches:['running'], requires:['syntaxerror','print'],
  story:`"Here's how the book reads," Sudo explains, sliding a claw down the page. "Top. To. Bottom. One line at a time. If a line breaks, it stops right there. Everything above already happened. Everything below never will."`,
  concept:{
    html:`A **script** is a whole file of lines. Python reads it **top to bottom**, running each line in turn.\n\nIf a line causes an error, Python **stops there**. Lines above already ran (you saw their output). Lines below never run.\n\nThis is why the order of your lines is part of your program.`,
    analogy:`Like reading a recipe aloud while cooking: if you hit a missing ingredient on step 3, steps 4 and 5 never happen.`,
    example:R`print("One")
print("Two")
Print("Three")
print("Four")`},
  predict:{code:R`print("One")
print("Two")
Print("Three")
print("Four")`, q:'What happens?',
    opts:['One, Two, then an error','Only an error','One, Two, Three, Four'], ans:0,
    why:'Lines run in order. One and Two run. Line 3 fails, so line 4 never runs.'},
  cast:{code:R`print("Packing the bag")
print("Locking the door")
print("Leaving the house")`, task:'Cast it. Then shuffle the lines and see how the story changes.'},
  bug:{broken:R`print("1")
print("2")
print("3")
print("Liftoff!")`, task:'It is a countdown! Fix the order so it prints 3, 2, 1, Liftoff! (one per line).',
    cases:[{inputs:[],tests:[['Prints 3, 2, 1, Liftoff!','lines==["3","2","1","Liftoff!"]']]}],
    sol:R`print("3")
print("2")
print("1")
print("Liftoff!")`, wrong:[R`print("1")
print("2")
print("3")
print("Liftoff!")`]},
  write:{prompt:'Sudo\'s morning runs top to bottom. Print four lines in this order: `Wake`, `Stretch`, `Cast`, `Sleep`.',
    starter:R`# one print per line, in order
`,
    cases:[{inputs:[],tests:[['Prints Wake, Stretch, Cast, Sleep in order','lines==["Wake","Stretch","Cast","Sleep"]']]}],
    sol:R`print("Wake")
print("Stretch")
print("Cast")
print("Sleep")`,
    wrong:[R`print("Sleep")
print("Cast")
print("Stretch")
print("Wake")`],
    hints:['Four prints, one per line.','The first print is Wake.','print("Wake")\nprint("Stretch")\n...','print("Wake")\nprint("Stretch")\nprint("Cast")\nprint("Sleep")']},
  power:{can:['Predict what a script prints by reading it top to bottom','Explain why Python stops at the first error'],
    expand:'Write a 5-step routine with a deliberate error in step 3. Predict the output before running.',
    where:'This is exactly how every script, automation and app startup works: order of execution.',
    next:'Next: indentation, the spaces at the start of a line, and why Python cares.'},
  codex:{title:'Top to bottom',body:'Python runs lines in order. An error stops the script; earlier lines already ran, later lines never run.',snip:R`print("One")
Print("Two")   # stops here`}
},
{
  id:'r0-11', realm:0, n:11, title:'Indentation preview: why spaces matter',
  teaches:['indent'], requires:['running'],
  story:`"One last rule before the first trial," says Sudo, straightening his hat. "Spaces at the *start* of a line mean something in Python. Later, they'll hold whole spells together. For now: don't put them where they don't belong."`,
  concept:{
    html:`Spaces at the **start** of a line are called **indentation**. In Python they carry meaning.\n\nRight now your lines should all start at the left edge. Extra spaces cause an **IndentationError**: "unexpected indent".\n\nSoon you will use indentation on purpose to group lines together. For now, keep everything flush left.`,
    analogy:`Indentation is like bullet-point nesting in an outline. Random indents confuse the outline.`,
    example:R`print("Start")
    print("Indented")`},
  predict:{code:R`print("Start")
    print("Indented")`, q:'What happens?',
    opts:['IndentationError: unexpected indent','Both lines print','Only Start prints'], ans:0,
    why:'Nothing told Python to expect an indented block, so the extra spaces are an error.'},
  cast:{code:R`print("Start")
    print("Indented")`, task:'Cast it and read the error message.', expectError:true},
  bug:{broken:R`print("Alpha")
    print("Beta")
    print("Gamma")`, task:'Remove the extra spaces so all three lines print.',
    cases:[{inputs:[],tests:[['Prints Alpha, Beta, Gamma','lines==["Alpha","Beta","Gamma"]']]}],
    sol:R`print("Alpha")
print("Beta")
print("Gamma")`, wrong:[R`print("Alpha")
    print("Beta")
    print("Gamma")`]},
  write:{prompt:'Print three lines `Alpha`, `Beta`, `Gamma`, all flush left (no indents).',
    starter:R`# keep every line flush left
`,
    cases:[{inputs:[],tests:[['Prints Alpha, Beta, Gamma','lines==["Alpha","Beta","Gamma"]'],['No line starts with a space','all(not l.startswith(" ") for l in src.splitlines())']]}],
    sol:R`print("Alpha")
print("Beta")
print("Gamma")`,
    wrong:[R`print("Alpha")
 print("Beta")
print("Gamma")`],
    hints:['Three prints, all starting in the first column.','Do not put spaces before print.','print("Alpha")\nprint("Beta")\n...','print("Alpha")\nprint("Beta")\nprint("Gamma")']},
  power:{can:['Recognize an IndentationError','Keep your code correctly aligned'],
    expand:'Indent one line on purpose, read the error, then fix it.',
    where:'Python is famous for using indentation as structure. Mastering it early prevents years of annoyance.',
    next:'Next: your first Boss. Light the Lantern.'},
  codex:{title:'Indentation',body:'Spaces at the start of a line matter in Python. Extra indents cause IndentationError. Keep lines flush left unless you are making a block.',snip:R`print("Start")
    print("oops")  # unexpected indent`}
},
{
  id:'r0-12', realm:0, n:12, title:'Boss: Light the Lantern', kind:'boss',
  teaches:['realm0-boss'], requires:['indent','calc','comments','multiprint','case'],
  story:`The Hollow Market's lantern has gone dark, and the Null is creeping between the stalls. "Four trials," says Sudo. "Prove you've learned to speak to the book. Light the lantern, apprentice."`,
  boss:{name:'The Dark Lantern', hp:5},
  phases:[
    {type:'mcq', q:'Which line prints the words Hello exactly?', opts:['print(Hello)','print("Hello")','Print("Hello")','print "Hello"'], ans:1,
     why:'Text needs quotes, and print must be lowercase with parentheses.', tags:['r0-02','r0-03','r0-07']},
    {type:'mcq', code:R`print("5 + 4")
print(5 + 4)`, q:'What are the two lines of output?', opts:['9 and 9','5 + 4 and 9','5 + 4 and 5 + 4'], ans:1,
     why:'Quotes make text. Without them, Python calculates.', tags:['r0-05']},
    {type:'mcq', code:R`print("Dawn"
print("Dusk")`, q:'What does Python do?', opts:['Prints Dawn and Dusk','Shows a SyntaxError and prints nothing','Prints only Dawn'], ans:1,
     why:'A SyntaxError is found before anything runs, so nothing prints.', tags:['r0-09','r0-10']},
    {type:'write', prompt:'Light the lantern: write a comment line, then print `The lantern glows`.',
     starter:R`# your spell
`,
     cases:[{inputs:[],tests:[['Prints The lantern glows','lines==["The lantern glows"]'],['Has a comment','any(l.strip().startswith("#") for l in src.splitlines() if l.strip()!="# your spell")']]}],
     sol:R`# light it up
print("The lantern glows")`,
     wrong:[R`print("The lantern glows")`],
     hints:['Comment line first, then the print.','# note\nprint("...")','# note\nprint("The lantern ...")','# light it up\nprint("The lantern glows")'], tags:['r0-06','r0-07']},
    {type:'write', prompt:'Countdown using calculations: print the results of `10 - 7`, `5 - 3`, `2 - 1` (each on its own line), a blank line, then `Lit`.',
     starter:R`# calculate each number, no typing answers
`,
     cases:[{inputs:[],tests:[['Output is 3, 2, 1, blank, Lit','lines==["3","2","1","","Lit"]'],['Uses minus signs to calculate','src.count("-")>=3']]}],
     sol:R`print(10 - 7)
print(5 - 3)
print(2 - 1)
print()
print("Lit")`,
     wrong:[R`print(3)
print(2)
print(1)
print()
print("Lit")`],
     hints:['Three calculation prints, then a blank print, then Lit.','print(10 - 7)\nprint(...)','print(10 - 7)\nprint(5 - 3)\nprint(2 - 1)\n...','print(10 - 7)\nprint(5 - 3)\nprint(2 - 1)\nprint()\nprint("Lit")'], tags:['r0-04','r0-05']}
  ],
  power:{can:['Write, run, read and fix simple Python spells','Read an error and fix it','Predict what code prints'],
    expand:'Make your own lantern ritual: five print lines with a comment above each.',
    where:'You now have the exact foundations every programmer starts with: output, order, errors.',
    next:'Realm 1: storing values in variables, the thing that makes programs actually useful.'},
  codex:{title:'Realm 0 complete',body:'You can print, calculate, comment, read errors, and know that Python runs top to bottom.',snip:R`print("The lantern glows")`}
}
);
