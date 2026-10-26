// REALM 4 — THE SATCHEL — part C (lessons 23-33)
LESSONS.push(
{
  id:'r4-23', realm:4, n:23, title:'Dictionaries: look things up by name',
  teaches:['dicts'], requires:['zip'],
  story:`A list is great when position matters. But Hopper's stall has a wall of labelled drawers: *Rope. Map. Torch.* "Nobody asks for drawer number three," she says. "They ask for **the map**." Welcome to the most-used structure in real Python.`,
  concept:{
    html:`A **dictionary** (dict) stores **key: value** pairs. You look up a value by its **key**, not by position.\n\n\`\`\`\nprices = {"rope": 4, "map": 9}\nprint(prices["map"])     # 9\n\`\`\`\n\n- Curly braces, with \`key: value\` pairs separated by commas\n- Keys are usually text or numbers and must be **unique**\n- \`{}\` is an empty dict\n- Printing shows \`{'rope': 4, 'map': 9}\`\n\nDicts keep the order you inserted items in.`,
    analogy:`A dictionary or phone book: look up the name, get the number.`,
    example:R`prices = {"rope": 4, "map": 9}
print(prices["map"])
print(prices)`},
  predict:{code:R`prices = {"rope": 4, "map": 9}
print(prices["rope"])`, q:'What prints?', opts:['4','9','rope'], ans:0,
    why:'The key "rope" maps to the value 4.'},
  cast:{code:R`prices = {"rope": 4, "map": 9}
print(prices["map"])
print(prices)`, task:'Cast it. Add "torch": 3 to the dict.'},
  bug:{broken:R`prices = ["rope": 4, "map": 9]
print(prices["map"])`, task:'Key: value pairs need curly braces, not square brackets. Fix it.',
    cases:[{inputs:[],tests:[['Prints 9','out.strip()=="9"'],['prices is a dict','g.get("prices")=={"rope":4,"map":9}']]}],
    sol:R`prices = {"rope": 4, "map": 9}
print(prices["map"])`, wrong:[R`prices = ["rope": 4, "map": 9]
print(prices["map"])`]},
  write:{prompt:'Create a dict `hero` with `"name": "Ada"`, `"hp": 30` and `"level": 3`. Print the hero\'s name, then the hero\'s hp.',
    starter:R`# make the dict, then look values up by key
`,
    cases:[{inputs:[],tests:[['hero is right','g.get("hero")=={"name":"Ada","hp":30,"level":3}'],['Prints Ada then 30','lines==["Ada","30"]'],['Looks up by key','"hero[\\"name\\"]" in src or "hero[\'name\']" in src']]}],
    sol:R`hero = {"name": "Ada", "hp": 30, "level": 3}
print(hero["name"])
print(hero["hp"])`,
    wrong:[R`hero = ["Ada", 30, 3]
print(hero[0])
print(hero[1])`, R`hero = {"name": "Ada", "hp": 30, "level": 3}
print("Ada")
print(30)`],
    hints:['A dict uses curly braces and key: value pairs.','hero = {"name": "Ada", "hp": 30, "level": 3}','Look up with hero["name"] and hero["hp"].','hero = {"name": "Ada", "hp": 30, "level": 3}\nprint(hero["name"])\nprint(hero["hp"])']},
  power:{can:['Store labelled data','Look values up by key'],
    expand:'Make a dict describing your favourite game: title, genre, rating.',
    where:'JSON from web services, config files and database rows all look like dictionaries.',
    next:'Next: adding and changing entries.'},
  codex:{title:'Dictionaries',body:'{key: value} pairs. d[key] looks up a value. Keys are unique.',snip:R`prices = {"rope": 4}
print(prices["rope"])`}
},
{
  id:'r4-24', realm:4, n:24, title:'Adding and changing entries',
  teaches:['dict-edit'], requires:['dicts'],
  story:`"New stock!" Hopper chalks a new drawer label. Same move to add a drawer as to change what's in one.`,
  concept:{
    html:`Assign to a key to **add or change** an entry:\n\n\`\`\`\nstock = {"rope": 3}\nstock["gem"] = 5        # add a new key\nstock["rope"] += 2      # change an existing one\nprint(stock)            # {'rope': 5, 'gem': 5}\n\`\`\`\n\nIf the key exists the value is replaced; if not, a new entry is created. There's **no error** either way. (Careful: \`stock["rope"] += 2\` DOES error if "rope" isn't there yet; that's next lesson.)`,
    analogy:`Writing on a drawer's label: new label if none, overwrite if there is one.`,
    example:R`stock = {"rope": 3}
stock["gem"] = 5
stock["rope"] += 2
print(stock)`},
  predict:{code:R`d = {"a": 1}
d["b"] = 2
d["a"] = 9
print(d)`, q:'What prints?', opts:["{'a': 9, 'b': 2}","{'a': 1, 'b': 2}","{'a': 9}"], ans:0,
    why:'"b" is added, and "a" is overwritten with 9.'},
  cast:{code:R`stock = {"rope": 3}
stock["gem"] = 5
stock["rope"] += 2
print(stock)`, task:'Cast it. Add another item.'},
  bug:{broken:R`stock = {"rope": 3, "map": 1}
stock["rope"] = 2
print(stock["rope"])`, task:'We BOUGHT 2 more rope, so the total should be 5. You overwrote it instead. Fix it.',
    cases:[{inputs:[],tests:[['Prints 5','out.strip()=="5"'],['Changed by adding','"+=" in src or "+" in src']]}],
    sol:R`stock = {"rope": 3, "map": 1}
stock["rope"] += 2
print(stock["rope"])`, wrong:[R`stock = {"rope": 3, "map": 1}
stock["rope"] = 2
print(stock["rope"])`]},
  write:{prompt:'`stock` is given. Add a new entry `"gem"` with value `5`, and raise `"rope"` by 2. Print the dict.',
    starter:R`stock = {"rope": 3, "map": 1}
`,
    cases:[{inputs:[],tests:[['stock is right','g.get("stock")=={"rope":5,"map":1,"gem":5}'],['Prints the dict','lines==["{\'rope\': 5, \'map\': 1, \'gem\': 5}"]'],['Edits by key','"stock[" in src']]}],
    sol:R`stock = {"rope": 3, "map": 1}
stock["gem"] = 5
stock["rope"] += 2
print(stock)`,
    wrong:[R`stock = {"rope": 3, "map": 1}
stock["gem"] = 5
print(stock)`, R`stock = {"rope": 5, "map": 1, "gem": 5}
print(stock)`],
    hints:['stock["gem"] = 5 adds a new key.','stock["rope"] += 2 updates the existing one.','Then print(stock).','stock = {"rope": 3, "map": 1}\nstock["gem"] = 5\nstock["rope"] += 2\nprint(stock)']},
  power:{can:['Add and update dictionary entries','Use += on a value'],
    expand:'Add three new stock items from three input() calls.',
    where:'Updating a user profile, a score table or a settings page.',
    next:'Next: the KeyError monster and the safe lookup .get().'},
  codex:{title:'Editing dicts',body:'d[key] = value adds or replaces. d[key] += 1 changes an existing value.',snip:R`stock["gem"] = 5`}
},
{
  id:'r4-25', realm:4, n:25, title:'KeyError and .get(): safe lookups',
  teaches:['dict-get'], requires:['dict-edit'],
  story:`You ask the drawer wall for *Sword*. There is no such drawer. The wall lunges: a snapping, key-toothed beast. "**KeyError!**" Hopper laughs. "Bribe it with a default."`,
  concept:{
    html:`Asking for a key that is not there raises a **KeyError**:\n\n\`\`\`\nprices = {"rope": 4}\nprint(prices["gem"])   # KeyError: 'gem'\n\`\`\`\n\nSafer ways:\n\n- \`prices.get("gem")\` gives \`None\` if missing\n- \`prices.get("gem", 0)\` gives your **default** (0) if missing\n- \`if "gem" in prices:\` checks keys\n\nUse \`.get(key, default)\` whenever a missing key is normal.`,
    analogy:`Asking the stall "do you have this?" instead of reaching into an empty drawer.`,
    example:R`prices = {"rope": 4}
print(prices.get("gem", "Not sold"))
print(prices.get("rope", "Not sold"))`},
  predict:{code:R`prices = {"rope": 4}
print(prices.get("gem", 0))`, q:'What prints?', opts:['0','None','KeyError'], ans:0,
    why:'The default value 0 is returned because the key is missing.'},
  cast:{code:R`prices = {"rope": 4}
print(prices["gem"])`, task:'Cast it on purpose and read the KeyError message.', expectError:true},
  bug:{broken:R`prices = {"rope": 4, "map": 9}
print(prices["torch"])`, task:'torch is not sold, so this crashes. Print the price, or 0 when it is missing.',
    cases:[{inputs:[],tests:[['Prints 0','out.strip()=="0"'],['No direct lookup crash','".get(" in src']]}],
    sol:R`prices = {"rope": 4, "map": 9}
print(prices.get("torch", 0))`, wrong:[R`prices = {"rope": 4, "map": 9}
print(prices["torch"])`]},
  write:{prompt:'Ask `Item: `. Print its price from `prices`, or `Not sold` when it is not there. Use `.get`.',
    starter:R`prices = {"rope": 4, "map": 9, "torch": 3}
item = input("Item: ")
`,
    inputs:['map'],
    cases:[{inputs:['map'],tests:[['map costs 9','lines[-1]=="9"'],['Uses .get','".get(" in src']]},{inputs:['gem'],tests:[['gem is not sold','lines[-1]=="Not sold"']]},{inputs:['rope'],tests:[['rope costs 4','lines[-1]=="4"']]}],
    sol:R`prices = {"rope": 4, "map": 9, "torch": 3}
item = input("Item: ")
print(prices.get(item, "Not sold"))`,
    wrong:[R`prices = {"rope": 4, "map": 9, "torch": 3}
item = input("Item: ")
print(prices[item])`, R`prices = {"rope": 4, "map": 9, "torch": 3}
item = input("Item: ")
print(prices.get(item))`],
    hints:['prices.get(item) looks up safely.','Give it a second argument as the default.','print(prices.get(item, "Not sold"))','prices = {"rope": 4, "map": 9, "torch": 3}\nitem = input("Item: ")\nprint(prices.get(item, "Not sold"))']},
  power:{can:['Survive a KeyError','Look up with a default'],
    expand:'Look up a typed command in a dict of command descriptions, with "Unknown command" as default.',
    where:'Settings with defaults, user lookups and any "might not exist" data use .get().',
    next:'Next: removing entries and checking keys.'},
  codex:{title:'.get()',body:'d[key] raises KeyError if missing. d.get(key, default) does not.',snip:R`d.get("gem", 0)`}
},
{
  id:'r4-26', realm:4, n:26, title:'Removing entries and checking keys',
  teaches:['dict-remove'], requires:['dict-get'],
  story:`"Sold out!" Hopper rubs a drawer label off the wall. "Remove it, but check first. The wall bites back."`,
  concept:{
    html:`Remove entries:\n\n- \`del d[key]\` removes the entry (**KeyError** if missing)\n- \`d.pop(key)\` removes **and returns** the value\n- \`d.pop(key, default)\` never errors\n\nCheck **keys** with \`in\` (it checks keys, not values):\n\n\`\`\`\nif "torch" in stock:\n    del stock["torch"]\n\`\`\`\n\n\`len(d)\` is the number of entries.`,
    analogy:`Wiping a label off a drawer, after checking the drawer exists.`,
    example:R`stock = {"rope": 3, "torch": 2}
if "torch" in stock:
    del stock["torch"]
print(stock)
print(len(stock))`},
  predict:{code:R`d = {"a": 1, "b": 2}
x = d.pop("a")
print(x, d)`, q:'What prints?', opts:["1 {'b': 2}","a {'b': 2}","1 {'a': 1, 'b': 2}"], ans:0,
    why:'pop removes the key "a" and returns its value 1.'},
  cast:{code:R`stock = {"rope": 3, "torch": 2}
if "torch" in stock:
    del stock["torch"]
print(stock)
print(len(stock))`, task:'Cast it. Try removing "gem" with .pop("gem", 0).'},
  bug:{broken:R`stock = {"rope": 3}
del stock["torch"]
print(stock)`, task:'KeyError! Only delete torch if it is in the stock.',
    cases:[{inputs:[],tests:[['stock unchanged','g.get("stock")=={"rope":3}'],['Uses in','" in stock" in src']]}],
    sol:R`stock = {"rope": 3}
if "torch" in stock:
    del stock["torch"]
print(stock)`, wrong:[R`stock = {"rope": 3}
del stock["torch"]
print(stock)`]},
  write:{prompt:'Ask `Remove: `. If the item is in `stock`, delete it and print `Removed <item>`; otherwise print `No <item>`. Finally print the stock dict.',
    starter:R`stock = {"rope": 3, "torch": 2, "map": 1}
item = input("Remove: ")
`,
    inputs:['torch'],
    cases:[{inputs:['torch'],tests:[['Remove torch','lines[-2:]==["Removed torch","{\'rope\': 3, \'map\': 1}"]']]},{inputs:['gem'],tests:[['gem is missing','lines[-2:]==["No gem","{\'rope\': 3, \'torch\': 2, \'map\': 1}"]']]}],
    sol:R`stock = {"rope": 3, "torch": 2, "map": 1}
item = input("Remove: ")
if item in stock:
    del stock[item]
    print(f"Removed {item}")
else:
    print(f"No {item}")
print(stock)`,
    wrong:[R`stock = {"rope": 3, "torch": 2, "map": 1}
item = input("Remove: ")
del stock[item]
print(f"Removed {item}")
print(stock)`, R`stock = {"rope": 3, "torch": 2, "map": 1}
item = input("Remove: ")
if item in stock:
    print(f"Removed {item}")
else:
    print(f"No {item}")
print(stock)`],
    hints:['Check item in stock first.','Inside: del stock[item] and print Removed.','else: print No ... then print the dict after.','stock = {"rope": 3, "torch": 2, "map": 1}\nitem = input("Remove: ")\nif item in stock:\n    del stock[item]\n    print(f"Removed {item}")\nelse:\n    print(f"No {item}")\nprint(stock)']},
  power:{can:['Remove dictionary entries safely','Check whether a key exists'],
    expand:'Use pop(item, None) so one line removes safely.',
    where:'Deleting a user, clearing a cache key or removing a cart item.',
    next:'Next: looping over dictionaries.'},
  codex:{title:'Removing keys',body:'del d[k] or d.pop(k, default). "k" in d checks keys.',snip:R`if k in d:
    del d[k]`}
},
{
  id:'r4-27', realm:4, n:27, title:'Looping over dictionaries',
  teaches:['dict-loop'], requires:['dict-remove'],
  story:`"Show me everything in the stall," a customer says. Hopper doesn't open every drawer by hand. She asks the wall to list itself: keys, values, or both.`,
  concept:{
    html:`Three ways to loop a dict:\n\n\`\`\`\nfor k in d:               # keys (the default)\nfor v in d.values():      # values only\nfor k, v in d.items():    # both, unpacked\n\`\`\`\n\n\`items()\` is the one you'll use most:\n\n\`\`\`\nfor item, price in prices.items():\n    print(f"{item}: {price}")\n\`\`\`\n\nUseful one-liners: \`sum(d.values())\`, \`max(d.values())\`, \`sorted(d)\` (sorted keys).`,
    analogy:`Walking along the drawer wall reading each label and its contents.`,
    example:R`prices = {"rope": 4, "map": 9}
for item, price in prices.items():
    print(f"{item}: {price}")
print(sum(prices.values()))`},
  predict:{code:R`d = {"a": 1, "b": 2}
for k in d:
    print(k)`, q:'What prints?', opts:['a then b','1 then 2','a: 1 then b: 2'], ans:0,
    why:'Looping a dict directly gives its keys.'},
  cast:{code:R`prices = {"rope": 4, "map": 9}
for item, price in prices.items():
    print(f"{item}: {price}")
print(sum(prices.values()))`, task:'Cast it. Print only the values with .values().'},
  bug:{broken:R`prices = {"rope": 4, "map": 9}
for item, price in prices:
    print(f"{item}: {price}")`, task:'ValueError: looping a dict gives only keys. Use the method that gives key AND value.',
    cases:[{inputs:[],tests:[['Prints both lines','lines==["rope: 4","map: 9"]']]}],
    sol:R`prices = {"rope": 4, "map": 9}
for item, price in prices.items():
    print(f"{item}: {price}")`, wrong:[R`prices = {"rope": 4, "map": 9}
for item, price in prices:
    print(f"{item}: {price}")`]},
  write:{prompt:'Print each `item: price` pair from `prices`, then print `Total: ` and the sum of all prices (use `.values()`).',
    starter:R`prices = {"rope": 4, "map": 9, "torch": 3}
`,
    cases:[{inputs:[],tests:[['Lines and total','lines==["rope: 4","map: 9","torch: 3","Total: 16"]'],['Uses items and values','".items()" in src and ".values()" in src']]}],
    sol:R`prices = {"rope": 4, "map": 9, "torch": 3}
for item, price in prices.items():
    print(f"{item}: {price}")
print("Total:", sum(prices.values()))`,
    wrong:[R`prices = {"rope": 4, "map": 9, "torch": 3}
for item in prices:
    print(item)
print("Total:", sum(prices.values()))`, R`prices = {"rope": 4, "map": 9, "torch": 3}
for item, price in prices.items():
    print(f"{item}: {price}")
print("Total: 16")`],
    hints:['for item, price in prices.items():','Print f"{item}: {price}" inside.','After the loop: print("Total:", sum(prices.values()))','prices = {"rope": 4, "map": 9, "torch": 3}\nfor item, price in prices.items():\n    print(f"{item}: {price}")\nprint("Total:", sum(prices.values()))']},
  power:{can:['Walk keys, values or pairs','Total up a dict of numbers'],
    expand:'Find the most expensive item using a loop that tracks the max.',
    where:'Reports, invoices and summaries are loops over dictionaries.',
    next:'Next: the classic counting pattern.'},
  codex:{title:'Looping dicts',body:'for k in d: keys. d.values() values. d.items() gives (key, value) pairs.',snip:R`for k, v in d.items():
    print(k, v)`}
},
{
  id:'r4-28', realm:4, n:28, title:'Counting with dictionaries',
  teaches:['dict-count'], requires:['dict-loop'],
  story:`Hopper tosses a bag of mixed coins on the counter. "How many of *each* kind?" she asks. "That's the most useful dictionary trick there is: **a tally.**"`,
  concept:{
    html:`To count how often things appear, use a dict as a **tally**:\n\n\`\`\`\ncounts = {}\nfor ch in "banana":\n    counts[ch] = counts.get(ch, 0) + 1\nprint(counts)    # {'b': 1, 'a': 3, 'n': 2}\n\`\`\`\n\nThe magic line: \`counts[key] = counts.get(key, 0) + 1\`\n\n- first time: get returns 0, so the key becomes 1\n- after that: adds 1 each time\n\nThis counts words, votes, errors, anything. (A shortcut, \`collections.Counter\`, comes later.)`,
    analogy:`Tally marks, one column per kind of coin.`,
    example:R`counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`},
  predict:{code:R`counts = {}
for w in ["a", "b", "a"]:
    counts[w] = counts.get(w, 0) + 1
print(counts)`, q:'What prints?', opts:["{'a': 2, 'b': 1}","{'a': 1, 'b': 1}","{'a': 3}"], ans:0,
    why:'a appears twice, b once.'},
  cast:{code:R`counts = {}
for ch in "banana":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`, task:'Cast it. Change the word.'},
  bug:{broken:R`counts = {}
for ch in "aab":
    counts[ch] += 1
print(counts)`, task:'KeyError the first time a letter appears. Use .get with a default of 0.',
    cases:[{inputs:[],tests:[['counts is a:2 b:1','g.get("counts")=={"a":2,"b":1}']]}],
    sol:R`counts = {}
for ch in "aab":
    counts[ch] = counts.get(ch, 0) + 1
print(counts)`, wrong:[R`counts = {}
for ch in "aab":
    counts[ch] += 1
print(counts)`]},
  write:{prompt:'Ask for a `Word: `. Count how often each letter appears and print one line per letter, in the order first seen: `b: 1`, `a: 3`, ...',
    starter:R`word = input("Word: ")
`,
    inputs:['banana'],
    cases:[{inputs:['banana'],tests:[['banana tally','lines[1:]==["b: 1","a: 3","n: 2"]']]},{inputs:['aab'],tests:[['aab tally','lines[1:]==["a: 2","b: 1"]']]},{inputs:['x'],tests:[['single letter','lines[1:]==["x: 1"]']]}],
    sol:R`word = input("Word: ")
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
for letter, n in counts.items():
    print(f"{letter}: {n}")`,
    wrong:[R`word = input("Word: ")
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
for letter in sorted(counts):
    print(f"{letter}: {counts[letter]}")`, R`word = input("Word: ")
for ch in word:
    print(f"{ch}: 1")`],
    hints:['Build a counts dict with counts[ch] = counts.get(ch, 0) + 1.','Then loop over counts.items().','Print f"{letter}: {n}".','word = input("Word: ")\ncounts = {}\nfor ch in word:\n    counts[ch] = counts.get(ch, 0) + 1\nfor letter, n in counts.items():\n    print(f"{letter}: {n}")']},
  power:{can:['Tally anything with a dict','Use .get(key, 0) + 1'],
    expand:'Count how often each number appears in a list of dice rolls.',
    where:'Word frequencies, votes, error counts and analytics all use this pattern.',
    next:'Next: dicts holding lists and other dicts.'},
  codex:{title:'Tally pattern',body:'counts[k] = counts.get(k, 0) + 1 counts anything.',snip:R`counts[x] = counts.get(x, 0) + 1`}
},
{
  id:'r4-29', realm:4, n:29, title:'Dicts inside dicts, lists inside dicts',
  teaches:['dict-nested'], requires:['dict-count'],
  story:`A hero is more than one value. Name, stats, a bag of items. "Real things nest," Hopper says, drawing a drawer within a drawer.`,
  concept:{
    html:`Dict values can be **anything**, including lists and other dicts:\n\n\`\`\`\nhero = {\n    "name": "Ada",\n    "stats": {"hp": 30, "mp": 10},\n    "items": ["rope"],\n}\nprint(hero["stats"]["hp"])      # 30\nhero["items"].append("map")\nhero["stats"]["hp"] += 5\n\`\`\`\n\nChain the lookups one step at a time: first the outer key, then the inner. This is exactly the shape of JSON data from web services.`,
    analogy:`Drawers with smaller boxes and lists inside.`,
    example:R`hero = {"name": "Ada", "stats": {"hp": 30}, "items": ["rope"]}
print(hero["stats"]["hp"])
hero["items"].append("map")
print(hero["items"])`},
  predict:{code:R`hero = {"stats": {"hp": 30, "mp": 10}}
print(hero["stats"]["mp"])`, q:'What prints?', opts:['10','30','stats'], ans:0,
    why:'First get the inner dict, then ask it for "mp".'},
  cast:{code:R`hero = {"name": "Ada", "stats": {"hp": 30}, "items": ["rope"]}
print(hero["stats"]["hp"])
hero["items"].append("map")
print(hero["items"])`, task:'Cast it. Add a "gold" key to the stats dict.'},
  bug:{broken:R`hero = {"name": "Ada", "stats": {"hp": 30}}
print(hero["hp"])`, task:'KeyError: hp lives inside "stats". Look up the outer key first.',
    cases:[{inputs:[],tests:[['Prints 30','out.strip()=="30"']]}],
    sol:R`hero = {"name": "Ada", "stats": {"hp": 30}}
print(hero["stats"]["hp"])`, wrong:[R`hero = {"name": "Ada", "stats": {"hp": 30}}
print(hero["hp"])`]},
  write:{prompt:'Give the hero +5 hp (inside `stats`) and add `"map"` to the `items` list. Print the new hp, then the items.',
    starter:R`hero = {"name": "Ada", "stats": {"hp": 30, "mp": 10}, "items": ["rope"]}
`,
    cases:[{inputs:[],tests:[['hp is 35','g.get("hero")["stats"]["hp"]==35'],['items are rope, map','g.get("hero")["items"]==["rope","map"]'],['Prints 35 then the list','lines==["35","[\'rope\', \'map\']"]']]}],
    sol:R`hero = {"name": "Ada", "stats": {"hp": 30, "mp": 10}, "items": ["rope"]}
hero["stats"]["hp"] += 5
hero["items"].append("map")
print(hero["stats"]["hp"])
print(hero["items"])`,
    wrong:[R`hero = {"name": "Ada", "stats": {"hp": 30, "mp": 10}, "items": ["rope"]}
hero["hp"] = 35
hero["items"].append("map")
print(hero["hp"])
print(hero["items"])`, R`hero = {"name": "Ada", "stats": {"hp": 30, "mp": 10}, "items": ["rope"]}
hero["stats"]["hp"] += 5
print(hero["stats"]["hp"])
print(hero["items"])`],
    hints:['hero["stats"]["hp"] += 5','hero["items"].append("map")','Print hero["stats"]["hp"] then hero["items"].','hero = {"name": "Ada", "stats": {"hp": 30, "mp": 10}, "items": ["rope"]}\nhero["stats"]["hp"] += 5\nhero["items"].append("map")\nprint(hero["stats"]["hp"])\nprint(hero["items"])']},
  power:{can:['Read and change nested data','Understand the shape of JSON'],
    expand:'Add a "party" list of dicts to the hero, each with a name and a role.',
    where:'Almost all web API data is nested dicts and lists.',
    next:'Next: lists of dicts, the "records" pattern.'},
  codex:{title:'Nested data',body:'Chain lookups: d["a"]["b"]. Values can be lists, dicts, anything.',snip:R`hero["stats"]["hp"]`}
},
{
  id:'r4-30', realm:4, n:30, title:'Lists of dicts: records',
  teaches:['records'], requires:['dict-nested'],
  story:`Hopper's ledger holds one line per customer: name, balance, favourite stall. "A **list of dicts**," she says. "Every row is a record. This is how nearly all real data looks."`,
  concept:{
    html:`A **list of dicts** is a table where each dict is a **record** (row):\n\n\`\`\`\nstudents = [\n    {"name": "Ada", "score": 95},\n    {"name": "Bo", "score": 60},\n]\nfor s in students:\n    print(s["name"], s["score"])\n\`\`\`\n\nAdd a record with \`append\`. Filter, total and average using the loop patterns you already know:\n\n\`\`\`\ntotal = 0\nfor s in students:\n    total += s["score"]\n\`\`\``,
    analogy:`A spreadsheet where each row is a labelled card.`,
    example:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
for s in students:
    print(s["name"], s["score"])`},
  predict:{code:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
print(students[1]["name"])`, q:'What prints?', opts:['Bo','Ada','60'], ans:0,
    why:'students[1] is the second record; ["name"] picks its name.'},
  cast:{code:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
for s in students:
    print(s["name"], s["score"])`, task:'Cast it. Append a third student first.'},
  bug:{broken:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
total = 0
for s in students:
    total += s
print(total)`, task:'TypeError: s is a whole record, not a number. Add the score.',
    cases:[{inputs:[],tests:[['Prints 155','out.strip()=="155"']]}],
    sol:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
total = 0
for s in students:
    total += s["score"]
print(total)`, wrong:[R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}]
total = 0
for s in students:
    total += s
print(total)`]},
  write:{prompt:'Ask `Limit: `. Print `name: score` for every student whose score is **at or above** the limit, then print `Average: ` (all students, 2 decimals).',
    starter:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}, {"name": "Cy", "score": 78}]
limit = int(input("Limit: "))
`,
    inputs:['70'],
    cases:[{inputs:['70'],tests:[['70 limit','lines[-3:]==["Ada: 95","Cy: 78","Average: 77.67"]'],['Computes the average','"len(" in src']]},{inputs:['90'],tests:[['90 limit','lines[-2:]==["Ada: 95","Average: 77.67"]']]},{inputs:['78'],tests:[['78 is included','lines[-3:]==["Ada: 95","Cy: 78","Average: 77.67"]']]}],
    sol:R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}, {"name": "Cy", "score": 78}]
limit = int(input("Limit: "))
total = 0
for s in students:
    total += s["score"]
    if s["score"] >= limit:
        print(f"{s['name']}: {s['score']}")
print(f"Average: {total / len(students):.2f}")`,
    wrong:[R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}, {"name": "Cy", "score": 78}]
limit = int(input("Limit: "))
total = 0
for s in students:
    total += s["score"]
    if s["score"] > limit:
        print(f"{s['name']}: {s['score']}")
print(f"Average: {total / len(students):.2f}")`, R`students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}, {"name": "Cy", "score": 78}]
limit = int(input("Limit: "))
for s in students:
    if s["score"] >= limit:
        print(f"{s['name']}: {s['score']}")
print("Average: 77.67")`],
    hints:['Loop over the records; keep a running total of scores.','If s["score"] >= limit, print the name and score.','After the loop, average = total / len(students) with :.2f.','students = [{"name": "Ada", "score": 95}, {"name": "Bo", "score": 60}, {"name": "Cy", "score": 78}]\nlimit = int(input("Limit: "))\ntotal = 0\nfor s in students:\n    total += s["score"]\n    if s["score"] >= limit:\n        print(f"{s[\'name\']}: {s[\'score\']}")\nprint(f"Average: {total / len(students):.2f}")']},
  power:{can:['Model tables as lists of dicts','Filter and summarise records'],
    expand:'Find the student with the highest score and print their name.',
    where:'Customer lists, orders, products, employees and API results are all lists of records.',
    next:'Next: sets, collections of unique items.'},
  codex:{title:'Records',body:'A list of dicts is a table. Loop it, read fields with s["field"].',snip:R`for s in students:
    print(s["name"])`}
},
{
  id:'r4-31', realm:4, n:31, title:'Sets: unique items',
  teaches:['sets'], requires:['records'],
  story:`The Bazaar's guest book is full of repeats: the same name signed again and again. "I only want each person **once**," Hopper sighs. "Tip it all in a set."`,
  concept:{
    html:`A **set** holds **unique** items with **no order** and no indexes.\n\n\`\`\`\ntags = ["fire", "ice", "fire", "wind"]\nunique = set(tags)\nprint(sorted(unique))    # ['fire', 'ice', 'wind']\n\`\`\`\n\n- Make one with \`set(list)\` or \`{1, 2, 3}\`\n- **\`{}\` is an empty dict**, so use \`set()\` for an empty set\n- \`add(x)\`, \`remove(x)\`, \`x in s\` (very fast)\n- Order is not guaranteed, so use \`sorted(s)\` when you print\n\nSetting a list to a set **removes duplicates**.`,
    analogy:`A guest book that politely refuses a second signature from the same person.`,
    example:R`tags = ["fire", "ice", "fire", "wind"]
unique = set(tags)
print(len(unique))
print(sorted(unique))`},
  predict:{code:R`print(len({1, 2, 2, 3, 3, 3}))`, q:'What prints?', opts:['3','6','2'], ans:0,
    why:'Duplicates collapse, leaving {1, 2, 3}.'},
  cast:{code:R`tags = ["fire", "ice", "fire", "wind"]
unique = set(tags)
print(len(unique))
print(sorted(unique))`, task:'Cast it. Add "ice" to a set with .add and see nothing change.'},
  bug:{broken:R`empty = {}
empty.add(1)
print(empty)`, task:'AttributeError: {} makes an empty DICT, not a set. Create an empty set properly.',
    cases:[{inputs:[],tests:[['empty is the set {1}','g.get("empty")=={1} and type(g.get("empty")) is set']]}],
    sol:R`empty = set()
empty.add(1)
print(empty)`, wrong:[R`empty = {}
empty.add(1)
print(empty)`]},
  write:{prompt:'`tags` has repeats. Create `unique` as a sorted list of the distinct tags and print how many there are, then the list.',
    starter:R`tags = ["fire", "ice", "fire", "wind", "ice"]
`,
    cases:[{inputs:[],tests:[['unique is sorted distinct','g.get("unique")==["fire","ice","wind"]'],['Prints count then list','lines==["3","[\'fire\', \'ice\', \'wind\']"]'],['Uses set','"set(" in src']]}],
    sol:R`tags = ["fire", "ice", "fire", "wind", "ice"]
unique = sorted(set(tags))
print(len(unique))
print(unique)`,
    wrong:[R`tags = ["fire", "ice", "fire", "wind", "ice"]
unique = sorted(tags)
print(len(unique))
print(unique)`, R`tags = ["fire", "ice", "fire", "wind", "ice"]
unique = ["fire", "ice", "wind"]
print(len(unique))
print(unique)`],
    hints:['set(tags) removes duplicates.','sorted(set(tags)) gives a sorted list.','Print len(unique) then unique.','tags = ["fire", "ice", "fire", "wind", "ice"]\nunique = sorted(set(tags))\nprint(len(unique))\nprint(unique)']},
  power:{can:['Remove duplicates','Test membership quickly'],
    expand:'Count how many different words are in a sentence of your own.',
    where:'Unique visitors, distinct tags and de-duplicating email lists.',
    next:'Next: combining sets: overlap, difference, union.'},
  codex:{title:'Sets',body:'Unique, unordered. set(list) removes duplicates. {} is a dict; set() is empty set.',snip:R`unique = sorted(set(items))`}
},
{
  id:'r4-32', realm:4, n:32, title:'Set operations: overlap, difference, union',
  teaches:['set-ops'], requires:['sets'],
  story:`Two guest lists lie on the counter. "Who's on **both**?" Hopper asks. "Who's on only one? Who's on **either**?" Sets answer each in a symbol.`,
  concept:{
    html:`Sets support **Venn diagram** operations:\n\n- \`a & b\` **intersection**: in both\n- \`a | b\` **union**: in either\n- \`a - b\` **difference**: in a but not b\n- \`a ^ b\` **symmetric difference**: in one but not both\n\n\`\`\`\na = {"Ada", "Bo", "Cy"}\nb = {"Bo", "Cy", "Dee"}\nprint(sorted(a & b))   # ['Bo', 'Cy']\nprint(sorted(a - b))   # ['Ada']\nprint(sorted(a | b))   # ['Ada', 'Bo', 'Cy', 'Dee']\n\`\`\``,
    analogy:`Two overlapping circles: the middle, the left only, or both circles together.`,
    example:R`a = {"Ada", "Bo", "Cy"}
b = {"Bo", "Cy", "Dee"}
print(sorted(a & b))
print(sorted(a - b))
print(sorted(a | b))`},
  predict:{code:R`a = {1, 2, 3}
b = {2, 3, 4}
print(sorted(a - b))`, q:'What prints?', opts:['[1]','[2, 3]','[1, 4]'], ans:0,
    why:'a - b keeps items that are in a but not in b: just 1.'},
  cast:{code:R`a = {"Ada", "Bo", "Cy"}
b = {"Bo", "Cy", "Dee"}
print(sorted(a & b))
print(sorted(a - b))
print(sorted(a | b))`, task:'Cast it. Try a ^ b too.'},
  bug:{broken:R`a = {"Ada", "Bo", "Cy"}
b = {"Bo", "Cy", "Dee"}
print(sorted(a | b))`, task:'We want only the people on BOTH lists. Fix the operator.',
    cases:[{inputs:[],tests:[['Prints [\'Bo\', \'Cy\']','out.strip()=="[\'Bo\', \'Cy\']"']]}],
    sol:R`a = {"Ada", "Bo", "Cy"}
b = {"Bo", "Cy", "Dee"}
print(sorted(a & b))`, wrong:[R`a = {"Ada", "Bo", "Cy"}
b = {"Bo", "Cy", "Dee"}
print(sorted(a | b))`]},
  write:{prompt:'Make `both` (on both lists), `only_mon` (only on Monday\'s list) and `everyone` (on either). Print each as a sorted list on its own line.',
    starter:R`mon = {"Ada", "Bo", "Cy"}
tue = {"Bo", "Cy", "Dee"}
`,
    cases:[{inputs:[],tests:[['both','g.get("both")=={"Bo","Cy"}'],['only_mon','g.get("only_mon")=={"Ada"}'],['everyone','g.get("everyone")=={"Ada","Bo","Cy","Dee"}'],['Prints three sorted lists','lines==["[\'Bo\', \'Cy\']","[\'Ada\']","[\'Ada\', \'Bo\', \'Cy\', \'Dee\']"]']]}],
    sol:R`mon = {"Ada", "Bo", "Cy"}
tue = {"Bo", "Cy", "Dee"}
both = mon & tue
only_mon = mon - tue
everyone = mon | tue
print(sorted(both))
print(sorted(only_mon))
print(sorted(everyone))`,
    wrong:[R`mon = {"Ada", "Bo", "Cy"}
tue = {"Bo", "Cy", "Dee"}
both = mon | tue
only_mon = mon - tue
everyone = mon | tue
print(sorted(both))
print(sorted(only_mon))
print(sorted(everyone))`, R`mon = {"Ada", "Bo", "Cy"}
tue = {"Bo", "Cy", "Dee"}
both = mon & tue
only_mon = tue - mon
everyone = mon | tue
print(sorted(both))
print(sorted(only_mon))
print(sorted(everyone))`],
    hints:['& for both, - for one-side-only, | for either.','both = mon & tue; only_mon = mon - tue; everyone = mon | tue','Print sorted(...) for each.','mon = {"Ada", "Bo", "Cy"}\ntue = {"Bo", "Cy", "Dee"}\nboth = mon & tue\nonly_mon = mon - tue\neveryone = mon | tue\nprint(sorted(both))\nprint(sorted(only_mon))\nprint(sorted(everyone))']},
  power:{can:['Compare groups with Venn operations','Find overlaps and differences'],
    expand:'Find which email addresses are on a newsletter list but not on a customer list.',
    where:'Comparing users, permissions, tags and inventories uses set maths constantly.',
    next:'Mission time: an inventory tracker for the Bazaar.'},
  codex:{title:'Set operations',body:'& both, | either, - only-first, ^ exactly-one.',snip:R`a & b
a | b
a - b`}
},
{
  id:'r4-33', realm:4, n:33, title:'Real-World Mission: Inventory Tracker',
  teaches:['mission4a'], requires:['set-ops','menu-loop'],
  story:`Hopper pushes a dusty ledger across the counter. "I lose track of stock every week," she says. "Build me a tracker. Add, remove, show. A real one." Ada, at the door, nods: *this is what a job looks like.*`,
  concept:{
    html:`**Mission brief:** a menu-driven inventory tracker.\n\nA \`while True\` loop asks \`Command (add/remove/show/quit): \`.\n\n- \`add\`: ask \`Item: \` and \`Qty: \`, add to the stock (**counting with .get**), print \`Added 3 rope\`\n- \`remove\`: ask \`Item: \`; if present delete and print \`Removed rope\`, else print \`No rope\`\n- \`show\`: if empty print \`Inventory is empty\`, else one \`item: qty\` line per item, **alphabetical**\n- \`quit\`: print \`Goodbye\` and stop\n- anything else: print \`Unknown command\`\n\nEverything you need: a dict, a menu loop, \`.get\`, \`in\`, \`del\`, \`sorted\`.`,
    analogy:`A shop ledger with a menu on top.`,
    example:R`inventory = {}
item = "rope"
inventory[item] = inventory.get(item, 0) + 3
print(inventory)`},
  predict:{code:R`inventory = {}
for item in ["rope", "map", "rope"]:
    inventory[item] = inventory.get(item, 0) + 1
print(inventory)`, q:'What prints?', opts:["{'rope': 2, 'map': 1}","{'rope': 1, 'map': 1}","{'rope': 3}"], ans:0,
    why:'rope is counted twice, map once.'},
  cast:{code:R`inventory = {}
while True:
    cmd = input("Command (add/remove/show/quit): ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "add":
        item = input("Item: ")
        qty = int(input("Qty: "))
        inventory[item] = inventory.get(item, 0) + qty
        print(f"Added {qty} {item}")
    elif cmd == "show":
        for name in sorted(inventory):
            print(f"{name}: {inventory[name]}")
    else:
        print("Unknown command")`, task:'Cast it with these lines in the Inputs box: add, rope, 3, show, quit', inputs:['add','rope','3','show','quit']},
  bug:{broken:R`inventory = {}
for i in range(2):
    item = input("Item: ")
    inventory[item] += 1
print(inventory)`, task:'Counting stock crashes with a KeyError on the first item. Use .get with a default.',
    cases:[{inputs:['rope','rope'],tests:[['Two ropes counted','g.get("inventory")=={"rope":2}']]},{inputs:['rope','map'],tests:[['Two items counted','g.get("inventory")=={"rope":1,"map":1}']]}],
    sol:R`inventory = {}
for i in range(2):
    item = input("Item: ")
    inventory[item] = inventory.get(item, 0) + 1
print(inventory)`, wrong:[R`inventory = {}
for i in range(2):
    item = input("Item: ")
    inventory[item] += 1
print(inventory)`]},
  write:{prompt:'Build the tracker described in the brief. Use `inventory = {}` and the exact messages.',
    starter:R`inventory = {}
`,
    inputs:['add','rope','3','show','quit'],
    cases:[{inputs:['add','rope','3','add','rope','2','add','map','1','show','remove','map','show','remove','gem','quit'],tests:[['Full session','[l for l in lines if l.startswith(("Added","Removed","No ","Unknown","Inventory","Goodbye")) or (re.fullmatch(r"\\w+: \\d+", l) and not l.startswith("Qty"))]==["Added 3 rope","Added 2 rope","Added 1 map","map: 1","rope: 5","Removed map","rope: 5","No gem","Goodbye"]']]},{inputs:['show','dance','quit'],tests:[['Empty and unknown','[l for l in lines if l.startswith(("Added","Removed","No ","Unknown","Inventory","Goodbye"))]==["Inventory is empty","Unknown command","Goodbye"]']]},{inputs:['add','gem','2','remove','gem','show','quit'],tests:[['Add then remove then empty','[l for l in lines if l.startswith(("Added","Removed","No ","Unknown","Inventory","Goodbye"))]==["Added 2 gem","Removed gem","Inventory is empty","Goodbye"]']]}],
    sol:R`inventory = {}
while True:
    cmd = input("Command (add/remove/show/quit): ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "add":
        item = input("Item: ")
        qty = int(input("Qty: "))
        inventory[item] = inventory.get(item, 0) + qty
        print(f"Added {qty} {item}")
    elif cmd == "remove":
        item = input("Item: ")
        if item in inventory:
            del inventory[item]
            print(f"Removed {item}")
        else:
            print(f"No {item}")
    elif cmd == "show":
        if not inventory:
            print("Inventory is empty")
        for name in sorted(inventory):
            print(f"{name}: {inventory[name]}")
    else:
        print("Unknown command")`,
    wrong:[R`inventory = {}
while True:
    cmd = input("Command (add/remove/show/quit): ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "add":
        item = input("Item: ")
        qty = int(input("Qty: "))
        inventory[item] = qty
        print(f"Added {qty} {item}")
    elif cmd == "remove":
        item = input("Item: ")
        if item in inventory:
            del inventory[item]
            print(f"Removed {item}")
        else:
            print(f"No {item}")
    elif cmd == "show":
        if not inventory:
            print("Inventory is empty")
        for name in sorted(inventory):
            print(f"{name}: {inventory[name]}")
    else:
        print("Unknown command")`, R`inventory = {}
while True:
    cmd = input("Command (add/remove/show/quit): ")
    if cmd == "quit":
        print("Goodbye")
        break
    elif cmd == "add":
        item = input("Item: ")
        qty = int(input("Qty: "))
        inventory[item] = inventory.get(item, 0) + qty
        print(f"Added {qty} {item}")
    elif cmd == "show":
        if not inventory:
            print("Inventory is empty")
        for name in sorted(inventory):
            print(f"{name}: {inventory[name]}")
    else:
        print("Unknown command")`],
    hints:['A while True loop with if/elif for add, remove, show, quit and an else.','add: inventory[item] = inventory.get(item, 0) + qty. remove: check in, then del.','show: if not inventory print the empty message; then loop over sorted(inventory).','inventory = {}\nwhile True:\n    cmd = input("Command (add/remove/show/quit): ")\n    if cmd == "quit":\n        print("Goodbye")\n        break\n    elif cmd == "add":\n        item = input("Item: ")\n        qty = int(input("Qty: "))\n        inventory[item] = inventory.get(item, 0) + qty\n        print(f"Added {qty} {item}")\n    elif cmd == "remove":\n        item = input("Item: ")\n        if item in inventory:\n            del inventory[item]\n            print(f"Removed {item}")\n        else:\n            print(f"No {item}")\n    elif cmd == "show":\n        if not inventory:\n            print("Inventory is empty")\n        for name in sorted(inventory):\n            print(f"{name}: {inventory[name]}")\n    else:\n        print("Unknown command")']},
  power:{can:['Build a complete menu-driven data app','Combine dicts, loops, validation and formatting'],
    expand:'Add an "update" command, a low-stock warning at 2 or fewer, and a total item count.',
    where:'Inventory trackers, expense logs and to-do apps are the starting point for countless small-business tools.',
    next:'Next: the comprehension, a one-line way to build lists.'},
  codex:{title:'Mission: inventory',body:'A menu loop plus a dict is a complete app. Count with .get, delete with del, list with sorted().',snip:R`inventory[item] = inventory.get(item, 0) + qty`}
}
);
