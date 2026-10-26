// REALM 4 — THE SATCHEL: COLLECTIONS (44 lessons) — part A (lessons 1-11)
LESSONS.push(
{
  id:'r4-01', realm:4, n:1, title:'Lists: a satchel of values',
  teaches:['lists'], requires:['realm3-gap'],
  story:`The Apprentice Seal hums against your chest as you step into the Bazaar of Many Pockets. Hopper, the stall-keeper, drops a worn leather satchel into your arms. "One variable, one value. That's a poor way to carry a life," she says. "Here. Put **many things in one place.**"`,
  concept:{
    html:`A **list** holds many values in one variable, in order. Use square brackets and commas:\n\n\`items = ["sword", "shield", "potion"]\`\n\n- A list can hold any mix: text, numbers, even other lists\n- \`[]\` is an **empty list**\n- Printing a list shows the brackets and quotes: \`['sword', 'shield', 'potion']\`\n\nForget a comma and Python quietly glues two strings together, so count your commas.`,
    analogy:`A satchel with numbered pockets: many items, one bag.`,
    example:R`items = ["sword", "shield", "potion"]
print(items)
print(type(items))`},
  predict:{code:R`items = ["sword", "shield"]
print(items)`, q:'What prints?', opts:["['sword', 'shield']",'sword shield','[sword, shield]'], ans:0,
    why:'print shows a list exactly as Python writes it: square brackets, quotes around text, commas between.'},
  cast:{code:R`items = ["sword", "shield", "potion"]
print(items)
print(type(items))`, task:'Cast it. Add a fourth item and cast again.'},
  bug:{broken:R`items = ["sword", "shield" "potion"]
print(items)`, task:'This satchel should hold three items but only has two (a comma is missing, so two words got glued together). Fix it.',
    cases:[{inputs:[],tests:[['Three separate items','g.get("items")==["sword","shield","potion"]']]}],
    sol:R`items = ["sword", "shield", "potion"]
print(items)`, wrong:[R`items = ["sword", "shield" "potion"]
print(items)`]},
  write:{prompt:'Create a list called `satchel` holding the three texts `"rope"`, `"map"` and `"torch"`, then print it.',
    starter:R`# make the list, then print it
`,
    cases:[{inputs:[],tests:[['satchel is the right list','g.get("satchel")==["rope","map","torch"]'],['Prints the list','lines==["[\'rope\', \'map\', \'torch\']"]']]}],
    sol:R`satchel = ["rope", "map", "torch"]
print(satchel)`,
    wrong:[R`satchel = ("rope", "map", "torch")
print(satchel)`, R`satchel = "rope, map, torch"
print(satchel)`],
    hints:['A list uses square brackets [ ].','Separate the three texts with commas.','satchel = [..., ..., ...]','satchel = ["rope", "map", "torch"]\nprint(satchel)']},
  power:{can:['Store many values in one variable','Read a printed list'],
    expand:'Make a list of your five favourite foods and print it.',
    where:'Shopping carts, playlists, search results, to-do items and every table row in software are lists.',
    next:'Next: pull one item out of the list by its position.'},
  codex:{title:'Lists',body:'A list holds many values in order: [a, b, c]. Empty list is []. Commas matter.',snip:R`items = ["sword", "shield"]`}
},
{
  id:'r4-02', realm:4, n:2, title:'Indexing: positions start at zero',
  teaches:['indexing'], requires:['lists'],
  story:`"Which pocket is the map in?" Hopper asks. You point at the first one. "Pocket zero," she corrects. "Programmers count from nothing. You'll get used to it. Eventually. Probably."`,
  concept:{
    html:`Each item in a list has a **position** called an **index**, and indexes **start at 0**.\n\n\`\`\`\nnames = ["Ada", "Hopper", "Pip"]\nprint(names[0])   # Ada\nprint(names[1])   # Hopper\nprint(names[2])   # Pip\n\`\`\`\n\nPut the index in square brackets right after the list's name. A list of 3 items has indexes 0, 1 and 2, never 3.`,
    analogy:`Floors in some countries: the ground floor is 0, the next up is 1.`,
    example:R`names = ["Ada", "Hopper", "Pip"]
print(names[0])
print(names[2])`},
  predict:{code:R`names = ["Ada", "Hopper", "Pip"]
print(names[1])`, q:'What prints?', opts:['Ada','Hopper','Pip'], ans:1,
    why:'Index 0 is Ada, index 1 is Hopper.'},
  cast:{code:R`names = ["Ada", "Hopper", "Pip"]
print(names[0])
print(names[2])`, task:'Cast it. Print names[1] too.'},
  bug:{broken:R`names = ["Ada", "Hopper", "Pip"]
print(names[1])`, task:'Sudo wants the FIRST name, Ada. Fix the index.',
    cases:[{inputs:[],tests:[['Prints Ada','out.strip()=="Ada"'],['Uses an index','"names[" in src']]}],
    sol:R`names = ["Ada", "Hopper", "Pip"]
print(names[0])`, wrong:[R`names = ["Ada", "Hopper", "Pip"]
print(names[1])`, R`names = ["Ada", "Hopper", "Pip"]
print("Ada")`]},
  write:{prompt:'`gear` is a list of four items. Print the **second** item and then the **fourth** item, one per line, using indexes.',
    starter:R`gear = ["helmet", "sword", "boots", "shield"]
`,
    cases:[{inputs:[],tests:[['Prints sword then shield','lines==["sword","shield"]'],['Uses indexes','"gear[1]" in src and "gear[3]" in src']]}],
    sol:R`gear = ["helmet", "sword", "boots", "shield"]
print(gear[1])
print(gear[3])`,
    wrong:[R`gear = ["helmet", "sword", "boots", "shield"]
print(gear[2])
print(gear[4])`, R`gear = ["helmet", "sword", "boots", "shield"]
print("sword")
print("shield")`],
    hints:['The second item is at index 1.','The fourth item is at index 3.','print(gear[1]) then print(gear[3])','gear = ["helmet", "sword", "boots", "shield"]\nprint(gear[1])\nprint(gear[3])']},
  power:{can:['Fetch one item from a list by position','Count from zero without panic'],
    expand:'Print the first, third and fifth item of any five-item list.',
    where:'Reading one row, one result or one setting out of many is indexing.',
    next:'Next: counting from the END of the list.'},
  codex:{title:'Indexing',body:'list[0] is the first item. A list of n items has indexes 0 to n-1.',snip:R`names[0]`}
},
{
  id:'r4-03', realm:4, n:3, title:'Negative indexes: counting from the end',
  teaches:['neg-index'], requires:['indexing'],
  story:`"Last pocket," Hopper says. You start counting: zero, one, two, three... "Or," she says, flicking the satchel round, "**start from the back.**"`,
  concept:{
    html:`Negative indexes count **from the end**:\n\n- \`-1\` is the **last** item\n- \`-2\` is the second to last\n\n\`\`\`\nscores = [10, 20, 30, 40]\nprint(scores[-1])   # 40\nprint(scores[-2])   # 30\n\`\`\`\n\nThis is the easy way to get the last item without knowing how long the list is.`,
    analogy:`Counting seats from the back of a bus.`,
    example:R`scores = [10, 20, 30, 40]
print(scores[-1])
print(scores[-2])`},
  predict:{code:R`letters = ["a", "b", "c", "d"]
print(letters[-1])`, q:'What prints?', opts:['a','d','c'], ans:1,
    why:'-1 is always the last item.'},
  cast:{code:R`scores = [10, 20, 30, 40]
print(scores[-1])
print(scores[-2])`, task:'Cast it. Add another score to the list; -1 still finds the last.'},
  bug:{broken:R`scores = [10, 20, 30, 40]
print(scores[0])`, task:'Sudo wants the LAST score, whatever the length. Use a negative index.',
    cases:[{inputs:[],tests:[['Prints 40','out.strip()=="40"'],['Uses a negative index','"[-" in src']]}],
    sol:R`scores = [10, 20, 30, 40]
print(scores[-1])`, wrong:[R`scores = [10, 20, 30, 40]
print(scores[0])`, R`scores = [10, 20, 30, 40]
print(scores[3])`]},
  write:{prompt:'From the list `days`, print the last day and then the second-to-last day using **negative indexes**.',
    starter:R`days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
`,
    cases:[{inputs:[],tests:[['Prints Fri then Thu','lines==["Fri","Thu"]'],['Uses -1 and -2','"[-1]" in src and "[-2]" in src']]}],
    sol:R`days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
print(days[-1])
print(days[-2])`,
    wrong:[R`days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
print(days[4])
print(days[3])`, R`days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
print(days[-2])
print(days[-1])`],
    hints:['-1 is the last item.','-2 is the one before it.','print(days[-1]) then print(days[-2])','days = ["Mon", "Tue", "Wed", "Thu", "Fri"]\nprint(days[-1])\nprint(days[-2])']},
  power:{can:['Grab the last items of a list directly','Write code that works whatever the length'],
    expand:'Print the last three items of a list one by one using -1, -2, -3.',
    where:'Latest message, most recent order, newest log line: all "last item" jobs.',
    next:'Next: what happens when you ask for a pocket that does not exist.'},
  codex:{title:'Negative indexes',body:'list[-1] is the last item, list[-2] the one before.',snip:R`items[-1]`}
},
{
  id:'r4-04', realm:4, n:4, title:'IndexError: the pocket that is not there',
  teaches:['indexerror'], requires:['neg-index'],
  story:`You reach into pocket number five. There is no pocket five. The satchel snaps shut and something chitters in the dark: a thin, many-legged shape. Sudo whispers, "**IndexError.** Don't panic. It only bites if you reach too far."`,
  concept:{
    html:`Ask for an index that does not exist and Python raises an **IndexError**:\n\n\`\`\`\nitems = ["a", "b", "c"]\nprint(items[3])      # IndexError: list index out of range\n\`\`\`\n\nA list of 3 has indexes 0, 1, 2 (and -1, -2, -3). Anything outside is out of range.\n\nGuard against it with \`len()\`:\n\n\`\`\`\nif 0 <= i < len(items):\n    print(items[i])\n\`\`\``,
    analogy:`Pressing a lift button for a floor the building does not have.`,
    example:R`items = ["rope", "map", "torch"]
i = 1
if 0 <= i < len(items):
    print(items[i])
else:
    print("No such slot")`},
  predict:{code:R`items = ["a", "b", "c"]
print(items[3])`, q:'What happens?', opts:['Prints c','Prints a','IndexError'], ans:2,
    why:'The last valid index is 2. Index 3 is out of range.'},
  cast:{code:R`items = ["a", "b", "c"]
print(items[3])`, task:'Cast this on purpose and read the error. Which line, which message?', expectError:true},
  bug:{broken:R`items = ["a", "b", "c"]
print(items[3])`, task:'Sudo wants the LAST item (c). Fix the index so it does not crash.',
    cases:[{inputs:[],tests:[['Prints c','out.strip()=="c"'],['Uses an index','"items[" in src']]}],
    sol:R`items = ["a", "b", "c"]
print(items[2])`, wrong:[R`items = ["a", "b", "c"]
print(items[3])`, R`items = ["a", "b", "c"]
print("c")`]},
  write:{prompt:'`items` has three entries. Ask `Slot: ` for a whole number. If it is a valid index (0 up to the last), print that item. Otherwise print `No such slot`.',
    starter:R`items = ["rope", "map", "torch"]
idx = int(input("Slot: "))
`,
    inputs:['1'],
    cases:[{inputs:['1'],tests:[['Slot 1 is map','lines[-1]=="map"']]},{inputs:['0'],tests:[['Slot 0 is rope','lines[-1]=="rope"']]},{inputs:['3'],tests:[['Slot 3 does not exist','lines[-1]=="No such slot"']]},{inputs:['7'],tests:[['Slot 7 does not exist','lines[-1]=="No such slot"']]}],
    sol:R`items = ["rope", "map", "torch"]
idx = int(input("Slot: "))
if 0 <= idx < len(items):
    print(items[idx])
else:
    print("No such slot")`,
    wrong:[R`items = ["rope", "map", "torch"]
idx = int(input("Slot: "))
print(items[idx])`, R`items = ["rope", "map", "torch"]
idx = int(input("Slot: "))
if idx < len(items) + 1:
    print(items[idx])
else:
    print("No such slot")`],
    hints:['Valid indexes are 0 up to len(items) - 1.','if 0 <= idx < len(items):','else prints No such slot.','items = ["rope", "map", "torch"]\nidx = int(input("Slot: "))\nif 0 <= idx < len(items):\n    print(items[idx])\nelse:\n    print("No such slot")']},
  power:{can:['Read an IndexError calmly','Guard a list lookup with len()'],
    expand:'Make a function-free helper in your head: "safe get" that returns None when the index is bad.',
    where:'IndexError is one of the most common crashes in real programs. Guarding against it separates apprentices from journeymen.',
    next:'Next: change what is inside a pocket.'},
  codex:{title:'IndexError',body:'Index outside 0..len-1 (or -len..-1) raises IndexError. Check with len() when unsure.',snip:R`if 0 <= i < len(items):
    print(items[i])`}
},
{
  id:'r4-05', realm:4, n:5, title:'Changing items',
  teaches:['change-item'], requires:['indexerror'],
  story:`"Lists aren't carved in stone," Hopper says, swapping the torch in pocket two for a lantern. "You can **replace** anything, any time."`,
  concept:{
    html:`Assign to an index to **replace** an item:\n\n\`\`\`\nparty = ["Ada", "Bo", "Cy"]\nparty[1] = "Dee"\nprint(party)     # ['Ada', 'Dee', 'Cy']\n\`\`\`\n\nThe list is changed **in place**. Lists are **mutable** (changeable). You can also do maths on an item: \`scores[0] += 5\`.\n\nThe index must already exist: you cannot create new pockets this way.`,
    analogy:`Swapping the item in one pocket without touching the rest.`,
    example:R`party = ["Ada", "Bo", "Cy"]
party[1] = "Dee"
print(party)`},
  predict:{code:R`scores = [10, 20, 30]
scores[0] += 5
print(scores)`, q:'What prints?', opts:['[15, 20, 30]','[10, 20, 35]','[5, 20, 30]'], ans:0,
    why:'scores[0] += 5 changes only the first item, 10 + 5 = 15.'},
  cast:{code:R`party = ["Ada", "Bo", "Cy"]
party[1] = "Dee"
print(party)`, task:'Cast it. Replace the last item using -1.'},
  bug:{broken:R`party = ["Ada", "Bo", "Cy"]
party[3] = "Dee"
print(party)`, task:'Replace Cy (the LAST member) with Dee. There is no index 3. Fix it.',
    cases:[{inputs:[],tests:[['Party is Ada, Bo, Dee','g.get("party")==["Ada","Bo","Dee"]']]}],
    sol:R`party = ["Ada", "Bo", "Cy"]
party[2] = "Dee"
print(party)`, wrong:[R`party = ["Ada", "Bo", "Cy"]
party[3] = "Dee"
print(party)`, R`party = ["Ada", "Bo", "Cy"]
party[1] = "Dee"
print(party)`]},
  write:{prompt:'`prices` holds three prices. Raise the **middle** price by 2 (use `+=` on its index), then print the list.',
    starter:R`prices = [5, 8, 12]
`,
    cases:[{inputs:[],tests:[['prices is [5, 10, 12]','g.get("prices")==[5,10,12]'],['Prints the list','lines==["[5, 10, 12]"]'],['Changes by index','"prices[1]" in src']]}],
    sol:R`prices = [5, 8, 12]
prices[1] += 2
print(prices)`,
    wrong:[R`prices = [5, 8, 12]
prices[0] += 2
print(prices)`, R`prices = [5, 10, 12]
print(prices)`],
    hints:['The middle item of three is index 1.','prices[1] += 2','Then print(prices).','prices = [5, 8, 12]\nprices[1] += 2\nprint(prices)']},
  power:{can:['Update a single item in place','Use += on a list item'],
    expand:'Double every price in a three-item list using three separate lines.',
    where:'Updating a score, a stock count or one cell in a table.',
    next:'Next: grow the list with append and insert.'},
  codex:{title:'Changing items',body:'list[i] = value replaces an item. Lists are mutable.',snip:R`party[1] = "Dee"`}
},
{
  id:'r4-06', realm:4, n:6, title:'append and insert: growing the list',
  teaches:['append'], requires:['change-item'],
  story:`The satchel is never full. "Every time you find something," Hopper says, "**add it**." She tosses in a coin. The bag does not bulge.`,
  concept:{
    html:`Two ways to add:\n\n- \`items.append(x)\` adds to the **end**\n- \`items.insert(i, x)\` adds at **position i**, pushing others along\n\n\`\`\`\nloot = []\nloot.append("gold")\nloot.append("gem")\nloot.insert(0, "map")\nprint(loot)   # ['map', 'gold', 'gem']\n\`\`\`\n\nThese are **methods**: actions attached to the list with a dot. \`append\` takes **exactly one** value.`,
    analogy:`append = tossing something to the back of the bag. insert = slipping it in at a chosen pocket.`,
    example:R`loot = []
loot.append("gold")
loot.append("gem")
loot.insert(0, "map")
print(loot)`},
  predict:{code:R`loot = ["gold"]
loot.append("gem")
loot.insert(0, "map")
print(loot)`, q:'What prints?', opts:["['map', 'gold', 'gem']","['gold', 'gem', 'map']","['gold', 'map', 'gem']"], ans:0,
    why:'append puts gem at the end, then insert(0, ...) puts map at the front.'},
  cast:{code:R`loot = []
loot.append("gold")
loot.append("gem")
loot.insert(0, "map")
print(loot)`, task:'Cast it. Append one more item.'},
  bug:{broken:R`loot = []
loot.append("gold", "gem")
print(loot)`, task:'append takes ONE value. Add both items so loot is ["gold", "gem"].',
    cases:[{inputs:[],tests:[['loot is gold and gem','g.get("loot")==["gold","gem"]']]}],
    sol:R`loot = []
loot.append("gold")
loot.append("gem")
print(loot)`, wrong:[R`loot = []
loot.append("gold", "gem")
print(loot)`, R`loot = []
loot.append(["gold", "gem"])
print(loot)`]},
  write:{prompt:'Start with an empty list `loot`. Append `"gold"`, append `"gem"`, then **insert** `"map"` at the very front. Print the list.',
    starter:R`loot = []
`,
    cases:[{inputs:[],tests:[['loot is map, gold, gem','g.get("loot")==["map","gold","gem"]'],['Prints it','lines==["[\'map\', \'gold\', \'gem\']"]'],['Uses append and insert','".append(" in src and ".insert(" in src']]}],
    sol:R`loot = []
loot.append("gold")
loot.append("gem")
loot.insert(0, "map")
print(loot)`,
    wrong:[R`loot = ["map", "gold", "gem"]
print(loot)`, R`loot = []
loot.append("map")
loot.append("gold")
loot.append("gem")
print(loot)`],
    hints:['loot.append("gold") adds to the end.','loot.insert(0, "map") puts map at the front.','Print the list at the end.','loot = []\nloot.append("gold")\nloot.append("gem")\nloot.insert(0, "map")\nprint(loot)']},
  power:{can:['Grow a list one item at a time','Choose the end or a chosen position'],
    expand:'Build a to-do list by appending three tasks, then insert an urgent one first.',
    where:'Every app that collects things as you go (carts, logs, results) appends.',
    next:'Next: len() and in for lists.'},
  codex:{title:'append / insert',body:'list.append(x) adds at the end. list.insert(i, x) adds at position i.',snip:R`loot.append("gold")
loot.insert(0, "map")`}
},
{
  id:'r4-07', realm:4, n:7, title:'len and in: how many, is it there',
  teaches:['list-len-in'], requires:['append'],
  story:`"How many things are in the satchel?" Hopper asks. "Is the lantern in there?" Two questions, both answerable in one word.`,
  concept:{
    html:`Two everyday questions about a list:\n\n- \`len(items)\` is **how many** items are in it\n- \`x in items\` is **True if x is somewhere in the list** (\`not in\` for the opposite)\n\n\`\`\`\nitems = ["rope", "map"]\nprint(len(items))        # 2\nprint("map" in items)    # True\nprint("sword" in items)  # False\n\`\`\`\n\nUnlike text, \`in\` on a list checks for a **whole item**, not a piece of one: \`"ma" in ["rope", "map"]\` is False.`,
    analogy:`Counting the items in the bag, or rummaging to see if one is there.`,
    example:R`items = ["rope", "map"]
print(len(items))
print("map" in items)
print("ma" in items)`},
  predict:{code:R`items = ["rope", "map"]
print("ma" in items)`, q:'What prints?', opts:['True','False','Error'], ans:1,
    why:'For a list, in looks for a whole matching item. "ma" is not an item, "map" is.'},
  cast:{code:R`items = ["rope", "map"]
print(len(items))
print("map" in items)
print("ma" in items)`, task:'Cast it. Add "lamp" to the list and recast.'},
  bug:{broken:R`items = ["rope", "map", "torch"]
if "Map" in items:
    print("Found it")
else:
    print("Missing")`, task:'The map IS in the satchel but it says Missing. Case matters. Fix the check.',
    cases:[{inputs:[],tests:[['Prints Found it','lines==["Found it"]']]}],
    sol:R`items = ["rope", "map", "torch"]
if "map" in items:
    print("Found it")
else:
    print("Missing")`, wrong:[R`items = ["rope", "map", "torch"]
if "Map" in items:
    print("Found it")
else:
    print("Missing")`]},
  write:{prompt:'Ask for an `Item: `. Print `Yes, you have it` if it is in `satchel`, otherwise `No`. Then print `Items: ` and how many things the satchel holds.',
    starter:R`satchel = ["rope", "map", "torch"]
item = input("Item: ")
`,
    inputs:['map'],
    cases:[{inputs:['map'],tests:[['map is there','"Yes, you have it" in lines'],['Count is 3','lines[-1]=="Items: 3"']]},{inputs:['sword'],tests:[['sword is not','"No" in lines'],['Count is 3','lines[-1]=="Items: 3"']]},{inputs:['ma'],tests:[['Part of a word is not an item','"No" in lines']]}],
    sol:R`satchel = ["rope", "map", "torch"]
item = input("Item: ")
if item in satchel:
    print("Yes, you have it")
else:
    print("No")
print("Items:", len(satchel))`,
    wrong:[R`satchel = ["rope", "map", "torch"]
item = input("Item: ")
print("Yes, you have it")
print("Items:", len(satchel))`, R`satchel = ["rope", "map", "torch"]
item = input("Item: ")
if item in "rope map torch":
    print("Yes, you have it")
else:
    print("No")
print("Items:", len(satchel))`],
    hints:['Use item in satchel in an if.','Print the count with len(satchel) at the end.','Two prints at the end: the answer, then Items: and the length.','satchel = ["rope", "map", "torch"]\nitem = input("Item: ")\nif item in satchel:\n    print("Yes, you have it")\nelse:\n    print("No")\nprint("Items:", len(satchel))']},
  power:{can:['Count a list with len()','Check if an item is present'],
    expand:'Check a typed command against a list of valid commands.',
    where:'"Is this username taken?" and "how many results?" are in and len.',
    next:'Next: removing items safely.'},
  codex:{title:'len and in',body:'len(list) counts items. x in list is True if some item equals x.',snip:R`if "map" in items:
    print(len(items))`}
},
{
  id:'r4-08', realm:4, n:8, title:'remove, pop and del',
  teaches:['remove-pop'], requires:['list-len-in'],
  story:`The satchel is getting heavy. "Take things out," Hopper says. "Three ways. Pick the one that fits what you know: the **name**, the **position**, or just *the last one.*"`,
  concept:{
    html:`Three ways to remove:\n\n- \`items.remove(x)\` removes the **first item equal to x** (error if missing)\n- \`items.pop()\` removes and **returns the last** item. \`items.pop(i)\` takes index i\n- \`del items[i]\` removes by index (no value returned)\n\n\`\`\`\nbag = ["rope", "map", "torch", "gem"]\nbag.remove("map")\ntaken = bag.pop()\nprint(bag)     # ['rope', 'torch']\nprint(taken)   # gem\n\`\`\`\n\n\`remove\` on something not there raises a **ValueError**, so check with \`in\` first.`,
    analogy:`remove = take out the item called "map". pop = grab whatever is on top.`,
    example:R`bag = ["rope", "map", "torch", "gem"]
bag.remove("map")
taken = bag.pop()
print(bag)
print(taken)`},
  predict:{code:R`bag = ["a", "b", "c"]
x = bag.pop()
print(x)
print(bag)`, q:'What prints?', opts:["c then ['a', 'b']","a then ['b', 'c']","c then ['a', 'b', 'c']"], ans:0,
    why:'pop removes the last item and hands it back, so x is c and the bag keeps a and b.'},
  cast:{code:R`bag = ["rope", "map", "torch", "gem"]
bag.remove("map")
taken = bag.pop()
print(bag)
print(taken)`, task:'Cast it. Use del bag[0] on the result.'},
  bug:{broken:R`bag = ["rope", "torch"]
bag.remove("sword")
print(bag)`, task:'remove crashes because there is no sword. Only remove it if it is in the bag.',
    cases:[{inputs:[],tests:[['No crash and bag unchanged','g.get("bag")==["rope","torch"]'],['Uses an in check','" in bag" in src']]}],
    sol:R`bag = ["rope", "torch"]
if "sword" in bag:
    bag.remove("sword")
print(bag)`, wrong:[R`bag = ["rope", "torch"]
bag.remove("sword")
print(bag)`]},
  write:{prompt:'`bag` starts with four items. Remove `"map"` by name, then `pop` the last item into a variable `taken`. Print `bag` and then `taken`.',
    starter:R`bag = ["rope", "map", "torch", "gem"]
`,
    cases:[{inputs:[],tests:[['bag is rope, torch','g.get("bag")==["rope","torch"]'],['taken is gem','g.get("taken")=="gem"'],['Prints both','lines==["[\'rope\', \'torch\']","gem"]'],['Uses remove and pop','".remove(" in src and ".pop(" in src']]}],
    sol:R`bag = ["rope", "map", "torch", "gem"]
bag.remove("map")
taken = bag.pop()
print(bag)
print(taken)`,
    wrong:[R`bag = ["rope", "map", "torch", "gem"]
bag.remove("map")
bag.remove("gem")
taken = "gem"
print(bag)
print(taken)`, R`bag = ["rope", "map", "torch", "gem"]
taken = bag.pop(0)
bag.remove("map")
print(bag)
print(taken)`],
    hints:['bag.remove("map") deletes by value.','taken = bag.pop() removes and keeps the last item.','Print bag, then taken.','bag = ["rope", "map", "torch", "gem"]\nbag.remove("map")\ntaken = bag.pop()\nprint(bag)\nprint(taken)']},
  power:{can:['Remove by value, by position or the last item','Avoid ValueError with an in check'],
    expand:'Build a tiny stack: append three items, then pop them one at a time.',
    where:'Undo stacks, queues of jobs and shopping cart removals use these methods.',
    next:'Next: loop over every item.'},
  codex:{title:'remove / pop / del',body:'remove(x) by value, pop() last (or pop(i)), del list[i] by index. remove of a missing item raises ValueError.',snip:R`bag.remove("map")
taken = bag.pop()`}
},
{
  id:'r4-09', realm:4, n:9, title:'Looping over a list',
  teaches:['loop-list'], requires:['remove-pop','for-range'],
  story:`"You don't walk the Bazaar one stall at a time by number," Hopper says. "You just walk it." She hands you a list of stalls, and a rule: *for each stall, do this.*`,
  concept:{
    html:`\`for\` can walk straight through a list, item by item, with **no index needed**:\n\n\`\`\`\nitems = ["rope", "map", "torch"]\nfor item in items:\n    print("-", item)\n\`\`\`\n\nThe loop variable (\`item\`) takes each value in order. Use a **singular** name for the item and a **plural** for the list: \`for gem in gems\`.\n\nThe accumulator and filter patterns from Realm 3 work exactly the same way here.`,
    analogy:`A tour guide walking along a row of stalls, stopping at each in turn.`,
    example:R`items = ["rope", "map", "torch"]
for item in items:
    print("-", item)`},
  predict:{code:R`nums = [3, 5, 8]
total = 0
for n in nums:
    total += n
print(total)`, q:'What prints?', opts:['16','8','3'], ans:0,
    why:'The loop adds 3, then 5, then 8: 16.'},
  cast:{code:R`items = ["rope", "map", "torch"]
for item in items:
    print("-", item)`, task:'Cast it. Add a fourth item to the list.'},
  bug:{broken:R`items = ["rope", "map", "torch"]
for item in items:
    print(items)`, task:'It prints the whole list three times. Print each item instead.',
    cases:[{inputs:[],tests:[['Prints each item','lines==["rope","map","torch"]']]}],
    sol:R`items = ["rope", "map", "torch"]
for item in items:
    print(item)`, wrong:[R`items = ["rope", "map", "torch"]
for item in items:
    print(items)`]},
  write:{prompt:'`stock` is a list of numbers. Loop over it and print the **total** with `Total: ` in front.',
    starter:R`stock = [12, 7, 30, 4]
`,
    cases:[{inputs:[],tests:[['Total is 53','lines==["Total: 53"]'],['Uses a for loop over the list','re.search(r"for \\w+ in stock", src) is not None']]}],
    sol:R`stock = [12, 7, 30, 4]
total = 0
for n in stock:
    total += n
print("Total:", total)`,
    wrong:[R`stock = [12, 7, 30, 4]
print("Total:", 53)`, R`stock = [12, 7, 30, 4]
total = 0
for n in stock:
    total = n
print("Total:", total)`],
    hints:['Start total at 0 before the loop.','for n in stock: total += n','Print after the loop.','stock = [12, 7, 30, 4]\ntotal = 0\nfor n in stock:\n    total += n\nprint("Total:", total)']},
  power:{can:['Visit every item in a list','Combine loops with accumulators'],
    expand:'Print only the stock numbers above 10.',
    where:'Processing every order, row, file or message in a collection.',
    next:'Next: get the position along with the item.'},
  codex:{title:'for over a list',body:'for item in items: visits each item in order. No index needed.',snip:R`for item in items:
    print(item)`}
},
{
  id:'r4-10', realm:4, n:10, title:'enumerate: position and value together',
  teaches:['enumerate'], requires:['loop-list'],
  story:`Hopper wants a numbered receipt. "Line one, line two..." You'd need a counter *and* the item. "Or," she says, producing a tiny brass gadget, "let Python hand you **both.**"`,
  concept:{
    html:`\`enumerate(items)\` gives you **(position, item)** pairs as you loop:\n\n\`\`\`\nfor i, item in enumerate(items):\n    print(i, item)\n\`\`\`\n\nTwo names before \`in\`: the first catches the position, the second the item. By default positions start at 0. Start at 1 for human-friendly numbering:\n\n\`for i, item in enumerate(items, 1):\`\n\nWhat's going on with two names? Each pair is a **tuple**, a pair that gets *unpacked* into the two names. You'll meet tuples properly in a few lessons.`,
    analogy:`A receipt printer that numbers each line as it prints it.`,
    example:R`items = ["rope", "map", "torch"]
for i, item in enumerate(items, 1):
    print(f"{i}. {item}")`},
  predict:{code:R`items = ["a", "b"]
for i, item in enumerate(items):
    print(i, item)`, q:'What prints?', opts:['0 a then 1 b','1 a then 2 b','a 0 then b 1'], ans:0,
    why:'enumerate starts counting at 0 unless you give a start value.'},
  cast:{code:R`items = ["rope", "map", "torch"]
for i, item in enumerate(items, 1):
    print(f"{i}. {item}")`, task:'Cast it. Remove the 1 and see what changes.'},
  bug:{broken:R`items = ["rope", "map", "torch"]
for i, item in enumerate(items):
    print(f"{i}. {item}")`, task:'The numbering starts at 0 but receipts start at 1. Fix it.',
    cases:[{inputs:[],tests:[['Numbered from 1','lines==["1. rope","2. map","3. torch"]']]}],
    sol:R`items = ["rope", "map", "torch"]
for i, item in enumerate(items, 1):
    print(f"{i}. {item}")`, wrong:[R`items = ["rope", "map", "torch"]
for i, item in enumerate(items):
    print(f"{i}. {item}")`]},
  write:{prompt:'Print the `quests` as a numbered list: `1. Find the key`, `2. Cross the bridge`, ... using `enumerate`.',
    starter:R`quests = ["Find the key", "Cross the bridge", "Face the Null"]
`,
    cases:[{inputs:[],tests:[['Numbered quests','lines==["1. Find the key","2. Cross the bridge","3. Face the Null"]'],['Uses enumerate','"enumerate(" in src']]}],
    sol:R`quests = ["Find the key", "Cross the bridge", "Face the Null"]
for i, quest in enumerate(quests, 1):
    print(f"{i}. {quest}")`,
    wrong:[R`quests = ["Find the key", "Cross the bridge", "Face the Null"]
for quest in quests:
    print(quest)`, R`quests = ["Find the key", "Cross the bridge", "Face the Null"]
n = 0
for quest in quests:
    n += 1
    print(f"{n}. {quest}")`],
    hints:['Loop with two names: for i, quest in enumerate(quests, 1).','The 1 makes numbering start at 1.','Print an f-string: f"{i}. {quest}"','quests = ["Find the key", "Cross the bridge", "Face the Null"]\nfor i, quest in enumerate(quests, 1):\n    print(f"{i}. {quest}")']},
  power:{can:['Number items as you loop','Get position and value at once'],
    expand:'Print only the items at even positions.',
    where:'Menus, receipts, leaderboards and any numbered listing.',
    next:'Next: slicing, taking a piece of a list.'},
  codex:{title:'enumerate',body:'for i, item in enumerate(items, start): gives position and item.',snip:R`for i, x in enumerate(items, 1):
    print(i, x)`}
},
{
  id:'r4-11', realm:4, n:11, title:'Slicing: taking a piece',
  teaches:['slicing'], requires:['enumerate','neg-index'],
  story:`"Show me the first three things," Hopper says, "and the last two. And every other one." You could write a loop. Or you could use a slicing rune, a tiny incantation of colons.`,
  concept:{
    html:`A **slice** takes a piece of a list (or text): \`items[start:stop]\`.\n\n- \`items[1:3]\` is positions 1 and 2 (the **stop is not included**)\n- \`items[:2]\` is the first two\n- \`items[2:]\` is from position 2 to the end\n- \`items[-2:]\` is the last two\n- \`items[::2]\` is every second item\n- \`items[::-1]\` is the list **reversed**\n\nA slice makes a **new** list. The original is untouched. Slices never raise IndexError; too-big numbers just stop at the end.`,
    analogy:`Cutting a few slices of bread off a loaf: the loaf stays whole.`,
    example:R`nums = [10, 20, 30, 40, 50, 60]
print(nums[1:3])
print(nums[:2])
print(nums[-2:])
print(nums[::2])`},
  predict:{code:R`nums = [10, 20, 30, 40, 50]
print(nums[1:3])`, q:'What prints?', opts:['[20, 30]','[10, 20, 30]','[20, 30, 40]'], ans:0,
    why:'Positions 1 and 2. The stop (3) is not included.'},
  cast:{code:R`nums = [10, 20, 30, 40, 50, 60]
print(nums[1:3])
print(nums[:2])
print(nums[-2:])
print(nums[::2])
print(nums[::-1])`, task:'Cast it. Try nums[2:5] and nums[:].'},
  bug:{broken:R`nums = [10, 20, 30, 40, 50]
print(nums[1:3])`, task:'Sudo wants the middle three items (20, 30, 40). The stop is off by one. Fix the slice.',
    cases:[{inputs:[],tests:[['Prints [20, 30, 40]','out.strip()=="[20, 30, 40]"']]}],
    sol:R`nums = [10, 20, 30, 40, 50]
print(nums[1:4])`, wrong:[R`nums = [10, 20, 30, 40, 50]
print(nums[1:3])`]},
  write:{prompt:'From `nums`, create `first_three` (the first three items), `last_two` (the last two items) and `every_other` (positions 0, 2, 4 ...). Print all three on separate lines.',
    starter:R`nums = [1, 2, 3, 4, 5, 6]
`,
    cases:[{inputs:[],tests:[['first_three','g.get("first_three")==[1,2,3]'],['last_two','g.get("last_two")==[5,6]'],['every_other','g.get("every_other")==[1,3,5]'],['Prints three lines','lines==["[1, 2, 3]","[5, 6]","[1, 3, 5]"]'],['Uses slices','src.count(":")>=3']]}],
    sol:R`nums = [1, 2, 3, 4, 5, 6]
first_three = nums[:3]
last_two = nums[-2:]
every_other = nums[::2]
print(first_three)
print(last_two)
print(every_other)`,
    wrong:[R`nums = [1, 2, 3, 4, 5, 6]
first_three = nums[:2]
last_two = nums[-2:]
every_other = nums[::2]
print(first_three)
print(last_two)
print(every_other)`, R`nums = [1, 2, 3, 4, 5, 6]
first_three = [1, 2, 3]
last_two = [5, 6]
every_other = [1, 3, 5]
print(first_three)
print(last_two)
print(every_other)`],
    hints:['first_three = nums[:3]','last_two = nums[-2:]; every_other = nums[::2]','Print all three variables.','nums = [1, 2, 3, 4, 5, 6]\nfirst_three = nums[:3]\nlast_two = nums[-2:]\nevery_other = nums[::2]\nprint(first_three)\nprint(last_two)\nprint(every_other)']},
  power:{can:['Cut any piece out of a list','Reverse a list with [::-1]','Take the first or last few items'],
    expand:'Print the top 3 scores from a sorted list and the bottom 3.',
    where:'Pagination ("results 11-20"), recent items, previews and chunked processing.',
    next:'Next: build lists as you loop.'},
  codex:{title:'Slicing',body:'list[start:stop:step]. Stop is excluded. [:n] first n, [-n:] last n, [::-1] reversed.',snip:R`nums[1:3]
nums[-2:]
nums[::-1]`}
}
);
