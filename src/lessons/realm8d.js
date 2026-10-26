// REALM 8 — THE ARCHIVE — part D (lessons 31-40: JSON)
LESSONS.push(
{
  id:'r8-31', realm:8, n:31, title:'JSON: the language of the web',
  teaches:['json-basics'], requires:['mission8b'],
  story:`Orrin opens a window onto the Great Wire, the web, where a hundred thousand machines chatter all at once. "They all speak one tongue for data: **JSON**. It looks like Python dicts and lists wearing a different coat."`,
  concept:{
    html:`**JSON** (JavaScript Object Notation) is the standard text format for data on the web:\n\n\`\`\`\n{"name": "Ada", "level": 3, "alive": true, "items": ["lamp", "key"]}\n\`\`\`\n\nPython's \`json\` module converts both ways:\n\n\`\`\`\nimport json\n\ntext = json.dumps({"name": "Ada", "level": 3})   # dict -> JSON text (a string)\ndata = json.loads(text)                            # JSON text -> dict\n\`\`\`\n\n- \`dumps\` = *dump to string*. \`loads\` = *load from string*.\n- Always use \`json.dumps\` rather than building the text by hand: it escapes quotes, newlines and Unicode correctly.\n- The text is a **string**; the data is a dict/list you can use.`,
    analogy:`A shipping box: dumps packs your data for travel, loads unpacks it.`,
    example:R`import json

data = {"name": "Ada", "level": 3, "alive": True}
text = json.dumps(data)
print(text)
print(json.loads(text)["level"] + 1)`},
  predict:{code:R`import json
print(json.dumps({"a": True, "b": None}))`, q:'What prints?', opts:['{"a": true, "b": null}','{"a": True, "b": None}','{\'a\': True, \'b\': None}'], ans:0, why:'JSON writes true and null in lower case, with double quotes.'},
  cast:{code:R`import json

data = {"name": "Ada", "level": 3, "alive": True}
text = json.dumps(data)
print(text)
print(json.loads(text)["level"] + 1)`, task:'Cast it.'},
  bug:{broken:R`import json
text = '{"level": 3}'
print(text["level"] + 1)`, task:'TypeError: text is a string, not a dict. Parse it first. Expected: 4',
    cases:[{inputs:[],tests:[['Four','lines==["4"]']]}],
    sol:R`import json
text = '{"level": 3}'
print(json.loads(text)["level"] + 1)`, wrong:[R`import json
text = '{"level": 3}'
print(text["level"] + 1)`]},
  write:{prompt:'Ask `Name: ` and `Level: ` (a whole number). Build a dict `{"name": ..., "level": ..., "alive": True}` and print it as JSON text with `json.dumps`. Then parse that text back with `json.loads` and print `Next level: <level + 1>`.',
    starter:R`import json
name = input("Name: ")
level = int(input("Level: "))
`,
    inputs:['Ada','3'],
    cases:[{inputs:['Ada','3'],tests:[['JSON text','[l for l in lines if l.startswith("{")]==["{\\"name\\": \\"Ada\\", \\"level\\": 3, \\"alive\\": true}"]'],['Next','lines[-1]=="Next level: 4"']]},{inputs:['Say "hi"','9'],tests:[['Quotes escaped','[l for l in lines if l.startswith("{")]==["{\\"name\\": \\"Say \\\\\\"hi\\\\\\"\\", \\"level\\": 9, \\"alive\\": true}"] and lines[-1]=="Next level: 10"']]},{inputs:['Zoë','1'],tests:[['Unicode default escaped','"\\\\u00eb" in out and lines[-1]=="Next level: 2"'],['Uses json','"json.dumps" in src and "json.loads" in src']]}],
    sol:R`import json
name = input("Name: ")
level = int(input("Level: "))
data = {"name": name, "level": level, "alive": True}
text = json.dumps(data)
print(text)
back = json.loads(text)
print("Next level:", back["level"] + 1)`,
    wrong:[R`name = input("Name: ")
level = int(input("Level: "))
text = '{"name": "' + name + '", "level": ' + str(level) + ', "alive": true}'
print(text)
print("Next level:", level + 1)`, R`import json
name = input("Name: ")
level = int(input("Level: "))
data = {"name": name, "level": level, "alive": True}
print(data)
print("Next level:", data["level"] + 1)`],
    hints:['Build the dict, then text = json.dumps(data) and print it.','back = json.loads(text) gives a dict again.','Print back["level"] + 1 after the label.','import json\nname = input("Name: ")\nlevel = int(input("Level: "))\ndata = {"name": name, "level": level, "alive": True}\ntext = json.dumps(data)\nprint(text)\nback = json.loads(text)\nprint("Next level:", back["level"] + 1)']},
  power:{can:['Convert Python data to JSON text and back','Let json handle quotes and escaping'],
    expand:'Add a list of items to the dict and print the JSON.',
    where:'Web APIs, config files and databases like MongoDB all speak JSON.',
    next:'Next: what JSON can and cannot hold.'},
  codex:{title:'dumps / loads',body:'json.dumps(data) gives a JSON string. json.loads(text) gives Python data. Never build JSON by hand.',snip:R`text = json.dumps(data)
data = json.loads(text)`}
},
{
  id:'r8-32', realm:8, n:32, title:'What survives the trip',
  teaches:['json-types'], requires:['json-basics'],
  story:`"Not everything fits in the shipping box," Orrin warns. "Some things change shape on the way. Know what changes **before** it bites you."`,
  concept:{
    html:`JSON only has: objects, arrays, strings, numbers, \`true\`/\`false\`, \`null\`. Python data maps like this:\n\n| Python | JSON | Back in Python |\n|---|---|---|\n| dict | object | dict |\n| list **and tuple** | array | **list** |\n| str | string | str |\n| int, float | number | int, float |\n| True / False | true / false | True / False |\n| None | null | None |\n\nGotchas:\n- A **tuple** comes back as a **list**.\n- Dict **keys** must be strings: \`{1: "a"}\` becomes \`{"1": "a"}\`.\n- **Sets**, **dates** and your own objects are not JSON-able: \`TypeError\` (convert them first: \`sorted(my_set)\`, \`str(date)\`).\n- \`NaN\` and \`Infinity\` are not valid JSON.\n\nA **round trip** \`json.loads(json.dumps(x))\` is not always equal to \`x\`.`,
    analogy:`Customs: some goods get repacked, some are refused at the border.`,
    example:R`import json

data = {"id": 7, "tags": ("a", "b"), 3: "three"}
back = json.loads(json.dumps(data))
print(back)
print(back == data)`},
  predict:{code:R`import json
print(json.loads(json.dumps((1, 2))))`, q:'What prints?', opts:['[1, 2]','(1, 2)','"1, 2"'], ans:0, why:'JSON has no tuples; arrays come back as lists.'},
  cast:{code:R`import json

data = {"id": 7, "tags": ("a", "b"), 3: "three"}
back = json.loads(json.dumps(data))
print(back)
print(back == data)`, task:'Cast it.'},
  bug:{broken:R`import json
tags = {"red", "blue"}
print(json.dumps({"tags": tags}))`, task:'TypeError: a set is not JSON serializable. Convert it to a sorted list first. Expected: {"tags": ["blue", "red"]}',
    cases:[{inputs:[],tests:[['Sorted list','lines==["{\\"tags\\": [\\"blue\\", \\"red\\"]}"]']]}],
    sol:R`import json
tags = {"red", "blue"}
print(json.dumps({"tags": sorted(tags)}))`, wrong:[R`import json
tags = {"red", "blue"}
print(json.dumps({"tags": tags}))`]},
  write:{prompt:'Write `roundtrip(data)` returning `json.loads(json.dumps(data))`. Use it on `{"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}`: print the result, then print `Same: <True or False>` comparing it to the original.',
    starter:R`import json

original = {"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}
`,
    cases:[{inputs:[],tests:[['Printed','lines==["{\'id\': 7, \'tags\': [\'a\', \'b\'], \'note\': None, \'ok\': True, \'3\': \'three\'}","Same: False"]'],['Tuple to list','g["roundtrip"]((1,2))==[1,2]'],['Int key to str','g["roundtrip"]({1:"a"})=={"1":"a"}'],['Plain data same','g["roundtrip"]({"a":[1,{"b":None}]})=={"a":[1,{"b":None}]}'],['Uses json','"json.loads" in src and "json.dumps" in src']]}],
    sol:R`import json

original = {"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}

def roundtrip(data):
    return json.loads(json.dumps(data))

back = roundtrip(original)
print(back)
print("Same:", back == original)`,
    wrong:[R`import json

original = {"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}

def roundtrip(data):
    return data

back = roundtrip(original)
print(back)
print("Same:", back == original)`, R`import json

original = {"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}

def roundtrip(data):
    return json.dumps(data)

back = roundtrip(original)
print(back)
print("Same:", back == original)`],
    hints:['roundtrip is one line: dumps then loads.','Call it on the original dict and print the result.','Print "Same:" with the comparison back == original.','import json\n\noriginal = {"id": 7, "tags": ("a", "b"), "note": None, "ok": True, 3: "three"}\n\ndef roundtrip(data):\n    return json.loads(json.dumps(data))\n\nback = roundtrip(original)\nprint(back)\nprint("Same:", back == original)']},
  power:{can:['Predict how Python data changes through JSON','Convert sets and other odd types before saving'],
    expand:'Round-trip a nested structure and find every difference.',
    where:'Knowing the type mapping prevents subtle bugs when you save and reload data.',
    next:'Next: saving JSON to a file.'},
  codex:{title:'JSON types',body:'tuple→list, int keys→strings, set/date unsupported, None→null, True→true.',snip:R`json.dumps({"tags": sorted(tags)})`}
},
{
  id:'r8-33', realm:8, n:33, title:'Saving and loading JSON files',
  teaches:['json-file'], requires:['json-types'],
  story:`"Now give the shipping box a shelf," Orrin says. "Write the JSON to a **file**, and any program, in any language, anywhere, can read it later."`,
  concept:{
    html:`\`json.dump\` and \`json.load\` (no **s**) work with **files**:\n\n\`\`\`\nimport json\n\ndef save_game(path, state):\n    with open(path, "w") as f:\n        json.dump(state, f)\n\ndef load_game(path):\n    with open(path) as f:\n        return json.load(f)\n\`\`\`\n\n| Function | From / to |\n|---|---|\n| \`dumps(x)\` / \`loads(text)\` | **s**trings |\n| \`dump(x, f)\` / \`load(f)\` | open **f**iles |\n\n- Don't write \`str(state)\` to a file: that is Python's notation (\`'a': True\`), **not** JSON.\n- The file holds **one** JSON value (usually a dict or list).`,
    analogy:`dump / load without the s is the same box, but going straight to the shelf.`,
    example:R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}
with open("game.json", "w") as f:
    json.dump(state, f)
with open("game.json") as f:
    print(json.load(f))`},
  predict:{code:R`import json
with open("t.json", "w") as f:
    json.dump([1, 2], f)
print(open("t.json").read())`, q:'What prints?', opts:['[1, 2]','(1, 2)','1 2'], ans:0, why:'The file holds the JSON text for the list.'},
  cast:{code:R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}
with open("game.json", "w") as f:
    json.dump(state, f)
with open("game.json") as f:
    print(json.load(f))`, task:'Cast it.'},
  bug:{broken:R`import json
state = {"alive": True}
with open("s.json", "w") as f:
    f.write(str(state))
with open("s.json") as f:
    print(json.load(f))`, task:'JSONDecodeError: str(state) writes Python notation (single quotes, True). Use json.dump.',
    cases:[{inputs:[],tests:[['Loaded','lines==["{\'alive\': True}"]']]}],
    sol:R`import json
state = {"alive": True}
with open("s.json", "w") as f:
    json.dump(state, f)
with open("s.json") as f:
    print(json.load(f))`, wrong:[R`import json
state = {"alive": True}
with open("s.json", "w") as f:
    f.write(str(state))
with open("s.json") as f:
    print(json.load(f))`]},
  write:{prompt:'Write `save_game(path, state)` and `load_game(path)` using `json.dump` and `json.load`. Save `{"name": "Ada", "level": 3, "items": ["lamp", "key"]}` to `game.json`, load it back, and print `Loaded <name> level <level> with <n> items`.',
    starter:R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Loaded Ada level 3 with 2 items"]'],['File is JSON','json.loads(read("game.json"))=={"name":"Ada","level":3,"items":["lamp","key"]}'],['save_game works','(g["save_game"]("x.json",{"a":[1,True]}), json.loads(read("x.json")))[1]=={"a":[1,True]}'],['load_game works','(g["save_game"]("y.json",{"k":None}), g["load_game"]("y.json"))[1]=={"k":None}'],['Uses dump/load','"json.dump(" in src and "json.load(" in src']]}],
    sol:R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}

def save_game(path, state):
    with open(path, "w") as f:
        json.dump(state, f)

def load_game(path):
    with open(path) as f:
        return json.load(f)

save_game("game.json", state)
loaded = load_game("game.json")
print(f"Loaded {loaded['name']} level {loaded['level']} with {len(loaded['items'])} items")`,
    wrong:[R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}

def save_game(path, state):
    with open(path, "w") as f:
        f.write(str(state))

def load_game(path):
    with open(path) as f:
        return eval(f.read())

save_game("game.json", state)
loaded = load_game("game.json")
print(f"Loaded {loaded['name']} level {loaded['level']} with {len(loaded['items'])} items")`, R`import json

state = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}

def save_game(path, state):
    with open(path, "w") as f:
        json.dump(state, f)

def load_game(path):
    with open(path) as f:
        return json.loads(f.read())

save_game("game.json", state)
loaded = load_game("game.json")
print(f"Loaded {loaded['name']} level {loaded['level']} with {len(loaded['items'])} items")`],
    hints:['save_game: with open(path, "w") as f: json.dump(state, f).','load_game: with open(path) as f: return json.load(f).','Call save then load, then print using an f-string (use single quotes inside the brackets).','import json\n\nstate = {"name": "Ada", "level": 3, "items": ["lamp", "key"]}\n\ndef save_game(path, state):\n    with open(path, "w") as f:\n        json.dump(state, f)\n\ndef load_game(path):\n    with open(path) as f:\n        return json.load(f)\n\nsave_game("game.json", state)\nloaded = load_game("game.json")\nprint(f"Loaded {loaded[\'name\']} level {loaded[\'level\']} with {len(loaded[\'items\'])} items")']},
  power:{can:['Save any JSON-able data to a file','Load it back as Python data'],
    expand:'Add a high-score list to the saved state.',
    where:'Game saves, app settings and caches are usually JSON files.',
    next:'Next: making JSON readable.'},
  codex:{title:'dump / load',body:'json.dump(data, f) writes to a file. json.load(f) reads from one. Never write str(data).',snip:R`json.dump(state, f)
state = json.load(f)`}
},
{
  id:'r8-34', realm:8, n:34, title:'Pretty JSON',
  teaches:['json-pretty'], requires:['json-file'],
  story:`"A machine can read a single squashed line," Orrin says, "but a **person** will edit this file at midnight. Be kind. Lay it out neatly."`,
  concept:{
    html:`Options for \`dump\` / \`dumps\`:\n\n\`\`\`\njson.dumps(data, indent=2)                    # multi-line, 2 spaces\njson.dumps(data, indent=2, sort_keys=True)    # keys in alphabetical order\njson.dumps(data, ensure_ascii=False)          # keep é, 日本語 as they are\n\`\`\`\n\n\`\`\`\n{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}\n\`\`\`\n\n- \`indent\` makes it readable and friendly to version control.\n- \`sort_keys=True\` gives **stable** output: the same data always makes the same text.\n- By default non-ASCII characters are escaped (\`"\\u00e9"\`). \`ensure_ascii=False\` keeps them readable (open the file with \`encoding="utf-8"\` when you write it).`,
    analogy:`The difference between a squashed receipt and a tidy invoice.`,
    example:R`import json

data = {"b": [1, 2], "a": 1}
print(json.dumps(data, indent=2, sort_keys=True))`},
  predict:{code:R`import json
print(json.dumps({"b": 1, "a": 2}, sort_keys=True))`, q:'What prints?', opts:['{"a": 2, "b": 1}','{"b": 1, "a": 2}','{"a": 1, "b": 2}'], ans:0, why:'Keys are sorted alphabetically; each keeps its value.'},
  cast:{code:R`import json

data = {"b": [1, 2], "a": 1}
print(json.dumps(data, indent=2, sort_keys=True))`, task:'Cast it.'},
  bug:{broken:R`import json
print(json.dumps({"city": "Zürich"}))`, task:'The ü is printed as \\u00fc. Keep it readable. Expected: {"city": "Zürich"}',
    cases:[{inputs:[],tests:[['Readable','lines==["{\\"city\\": \\"Zürich\\"}"]']]}],
    sol:R`import json
print(json.dumps({"city": "Zürich"}, ensure_ascii=False))`, wrong:[R`import json
print(json.dumps({"city": "Zürich"}))`]},
  write:{prompt:'Write `pretty(data)` that returns the JSON text indented by 2 spaces, keys sorted, non-ASCII kept as is. Save `{"name": "Zoë", "levels": [3, 1], "alive": True}` to `config.json` using `pretty` (end the file with a newline), then print the file.',
    starter:R`import json
`,
    cases:[{inputs:[],tests:[['Pretty output','g["pretty"]({"b":[1,2],"a":1})=="{\\n  \\"a\\": 1,\\n  \\"b\\": [\\n    1,\\n    2\\n  ]\\n}"'],['Unicode kept','g["pretty"]({"n":"é"})=="{\\n  \\"n\\": \\"é\\"\\n}"'],['File','read("config.json")=="{\\n  \\"alive\\": true,\\n  \\"levels\\": [\\n    3,\\n    1\\n  ],\\n  \\"name\\": \\"Zoë\\"\\n}\\n"'],['Printed','lines[0]=="{" and lines[-1]=="}"']]}],
    sol:R`import json

def pretty(data):
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)

data = {"name": "Zoë", "levels": [3, 1], "alive": True}
with open("config.json", "w", encoding="utf-8") as f:
    f.write(pretty(data) + "\n")

with open("config.json", encoding="utf-8") as f:
    print(f.read(), end="")`,
    wrong:[R`import json

def pretty(data):
    return json.dumps(data, indent=2, sort_keys=True)

data = {"name": "Zoë", "levels": [3, 1], "alive": True}
with open("config.json", "w", encoding="utf-8") as f:
    f.write(pretty(data) + "\n")

with open("config.json", encoding="utf-8") as f:
    print(f.read(), end="")`, R`import json

def pretty(data):
    return json.dumps(data, indent=2, ensure_ascii=False)

data = {"name": "Zoë", "levels": [3, 1], "alive": True}
with open("config.json", "w", encoding="utf-8") as f:
    f.write(pretty(data) + "\n")

with open("config.json", encoding="utf-8") as f:
    print(f.read(), end="")`],
    hints:['json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)','Write pretty(data) + "\\n" to the file, opened with encoding="utf-8".','Read the file back and print it with end="".','import json\n\ndef pretty(data):\n    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=False)\n\ndata = {"name": "Zoë", "levels": [3, 1], "alive": True}\nwith open("config.json", "w", encoding="utf-8") as f:\n    f.write(pretty(data) + "\\n")\n\nwith open("config.json", encoding="utf-8") as f:\n    print(f.read(), end="")']},
  power:{can:['Produce neat, stable, human-friendly JSON','Keep international characters readable'],
    expand:'Try indent=4 and indent="\\t".',
    where:'Config files in version control are always pretty-printed with sorted keys.',
    next:'Next: digging into nested data.'},
  codex:{title:'Pretty JSON',body:'indent=2, sort_keys=True, ensure_ascii=False. Add encoding="utf-8" when writing files.',snip:R`json.dumps(data, indent=2, sort_keys=True)`}
},
{
  id:'r8-35', realm:8, n:35, title:'Digging into nested JSON',
  teaches:['json-nested'], requires:['json-pretty'],
  story:`A merchant hands Orrin a thick JSON scroll. "It's boxes in boxes," Orrin mutters. "A shop, with an owner, with a city, and a list of items inside **that**. Read it path by path."`,
  concept:{
    html:`Real JSON nests dicts and lists. Follow it with keys and indexes, and loop over lists of dicts:\n\n\`\`\`\n{"shop": "Lamps",\n "owner": {"name": "Ada", "city": "Oslo"},\n "items": [{"name": "lamp", "price": 12.5, "stock": 3},\n           {"name": "wick", "price": 0.5, "stock": 0}]}\n\`\`\`\n\n\`\`\`\ndata["owner"]["city"]            # 'Oslo'\ndata["items"][0]["name"]         # 'lamp'\nfor item in data["items"]:\n    value += item["price"] * item["stock"]\n\`\`\`\n\n- Read the structure **from the outside in**: dict → key → list → item → key.\n- Print \`data\` with \`json.dumps(data, indent=2)\` if you are lost; it shows the shape.\n- Check what you have: \`type(x)\`, \`list(x.keys())\`.`,
    analogy:`Russian dolls: open each one to find the next.`,
    example:R`data = {"owner": {"city": "Oslo"}, "items": [{"name": "lamp"}]}
print(data["owner"]["city"], data["items"][0]["name"])`},
  predict:{code:R`d = {"a": {"b": [10, 20, 30]}}
print(d["a"]["b"][-1])`, q:'What prints?', opts:['30','10','[10, 20, 30]'], ans:0, why:'d["a"] is a dict, ["b"] is the list, [-1] is its last item.'},
  cast:{code:R`import json

with open("shop.json") as f:
    data = json.load(f)

print(data["owner"]["city"])
print(len(data["items"]))`, task:'Cast it.', files:{'shop.json':'{"shop": "Lamps", "owner": {"name": "Ada", "city": "Oslo"}, "items": [{"name": "lamp", "price": 12.5, "stock": 3}, {"name": "wick", "price": 0.5, "stock": 0}]}'}},
  bug:{broken:R`data = {"items": [{"name": "lamp", "price": 12.5}]}
print(data["items"]["name"])`, task:'TypeError: items is a list, so it needs an index before the key. Print the first item\'s name.',
    cases:[{inputs:[],tests:[['Name','lines==["lamp"]']]}],
    sol:R`data = {"items": [{"name": "lamp", "price": 12.5}]}
print(data["items"][0]["name"])`, wrong:[R`data = {"items": [{"name": "lamp", "price": 12.5}]}
print(data["items"]["name"])`]},
  write:{prompt:'Load `shop.json`. Print `Shop: <shop> (owner <name>, <city>)`, `Items: <n>`, `Stock value: <sum of price × stock>` (2 decimals), and then `Out of stock: <name>` for each item with stock 0.',
    starter:R`import json
`,
    files:{'shop.json':'{"shop": "Lamps", "owner": {"name": "Ada", "city": "Oslo"}, "items": [{"name": "lamp", "price": 12.5, "stock": 3}, {"name": "wick", "price": 0.5, "stock": 0}, {"name": "oil", "price": 4, "stock": 5}]}'},
    cases:[{inputs:[],files:{'shop.json':'{"shop": "Lamps", "owner": {"name": "Ada", "city": "Oslo"}, "items": [{"name": "lamp", "price": 12.5, "stock": 3}, {"name": "wick", "price": 0.5, "stock": 0}, {"name": "oil", "price": 4, "stock": 5}]}'},tests:[['Report','lines==["Shop: Lamps (owner Ada, Oslo)","Items: 3","Stock value: 57.50","Out of stock: wick"]']]},{inputs:[],files:{'shop.json':'{"shop": "Tiny", "owner": {"name": "Bo", "city": "Rome"}, "items": []}'},tests:[['No items','lines==["Shop: Tiny (owner Bo, Rome)","Items: 0","Stock value: 0.00"]']]},{inputs:[],files:{'shop.json':'{"shop": "P", "owner": {"name": "Q", "city": "R"}, "items": [{"name": "low", "price": 3, "stock": 2}]}'},tests:[['Low stock is not out of stock','lines==["Shop: P (owner Q, R)","Items: 1","Stock value: 6.00"]']]},{inputs:[],files:{'shop.json':'{"shop": "S", "owner": {"name": "C", "city": "D"}, "items": [{"name": "a", "price": 1, "stock": 0}, {"name": "b", "price": 2, "stock": 0}]}'},tests:[['All out','lines==["Shop: S (owner C, D)","Items: 2","Stock value: 0.00","Out of stock: a","Out of stock: b"]']]}],
    sol:R`import json

with open("shop.json") as f:
    data = json.load(f)

owner = data["owner"]
print(f"Shop: {data['shop']} (owner {owner['name']}, {owner['city']})")
print("Items:", len(data["items"]))
value = sum(item["price"] * item["stock"] for item in data["items"])
print(f"Stock value: {value:.2f}")
for item in data["items"]:
    if item["stock"] == 0:
        print("Out of stock:", item["name"])`,
    wrong:[R`import json

with open("shop.json") as f:
    data = json.load(f)

owner = data["owner"]
print(f"Shop: {data['shop']} (owner {owner['name']}, {owner['city']})")
print("Items:", len(data["items"]))
value = sum(item["price"] for item in data["items"])
print(f"Stock value: {value:.2f}")
for item in data["items"]:
    if item["stock"] == 0:
        print("Out of stock:", item["name"])`, R`import json

with open("shop.json") as f:
    data = json.load(f)

owner = data["owner"]
print(f"Shop: {data['shop']} (owner {owner['name']}, {owner['city']})")
print("Items:", len(data["items"]))
value = sum(item["price"] * item["stock"] for item in data["items"])
print(f"Stock value: {value:.2f}")
for item in data["items"]:
    if item["stock"] < 3:
        print("Out of stock:", item["name"])`],
    hints:['data = json.load(f). owner = data["owner"].','Total value: sum(item["price"] * item["stock"] for item in data["items"]).','Loop the items; print the name when stock == 0.','import json\n\nwith open("shop.json") as f:\n    data = json.load(f)\n\nowner = data["owner"]\nprint(f"Shop: {data[\'shop\']} (owner {owner[\'name\']}, {owner[\'city\']})")\nprint("Items:", len(data["items"]))\nvalue = sum(item["price"] * item["stock"] for item in data["items"])\nprint(f"Stock value: {value:.2f}")\nfor item in data["items"]:\n    if item["stock"] == 0:\n        print("Out of stock:", item["name"])']},
  power:{can:['Navigate nested dicts and lists','Compute over lists of records inside JSON'],
    expand:'Print the most valuable item (price × stock).',
    where:'API responses are nested like this; reading them is a daily skill.',
    next:'Next: surviving missing keys.'},
  codex:{title:'Nested JSON',body:'data["a"]["b"][0]["c"]: key, key, index, key. Use json.dumps(data, indent=2) to see the shape.',snip:R`data["items"][0]["name"]`}
},
{
  id:'r8-36', realm:8, n:36, title:'Missing keys and default data',
  teaches:['json-missing'], requires:['json-nested'],
  story:`"The merchant said every shop has an owner," Orrin says, holding a scroll with no owner. "Never trust a scroll. **Ask for the key politely** and have a default ready."`,
  concept:{
    html:`Real JSON is incomplete. \`data["key"]\` raises \`KeyError\` if it is missing, so use \`.get\`:\n\n\`\`\`\nvolume = settings.get("volume", 5)                       # default 5\nvolume = settings.get("audio", {}).get("volume", 5)      # nested: default the middle too\n\`\`\`\n\nAnd a file that does not exist yet should give a **default structure** (a first run):\n\n\`\`\`\ndef load_or_default(path, default):\n    try:\n        with open(path) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return dict(default)\n\`\`\`\n\n- Return a **copy** of the default (\`dict(default)\`, or \`copy.deepcopy\` for nested data) so callers cannot change the shared one.\n- \`get\` returns \`None\` if you give no default.\n- Beware: a key present with value \`null\` returns \`None\` from \`.get\`, not the default.`,
    analogy:`Having a spare key under the mat.`,
    example:R`settings = {"audio": {}}
print(settings.get("audio", {}).get("volume", 5))
print(settings.get("video", {}).get("fps", 30))`},
  predict:{code:R`d = {"a": None}
print(d.get("a", 5))`, q:'What prints?', opts:['None','5','Error'], ans:0, why:'The key exists (with the value None), so the default is not used.'},
  cast:{code:R`settings = {"audio": {}}
print(settings.get("audio", {}).get("volume", 5))
print(settings.get("video", {}).get("fps", 30))`, task:'Cast it.'},
  bug:{broken:R`settings = {"name": "Ada"}
print(settings["volume"])`, task:'KeyError: volume. Use .get with a default of 5.',
    cases:[{inputs:[],tests:[['Default','lines==["5"]']]}],
    sol:R`settings = {"name": "Ada"}
print(settings.get("volume", 5))`, wrong:[R`settings = {"name": "Ada"}
print(settings["volume"])`]},
  write:{prompt:'Write `get_volume(settings)` returning `settings["audio"]["volume"]`, but `5` if either key is missing. Write `load_or_default(path, default)` returning the JSON in the file, or a **copy** of `default` if the file does not exist. Load `settings.json` with default `{"name": "Hero"}`, then print `Volume: <v>` and `Name: <name>`.',
    starter:R`import json

# define get_volume and load_or_default, then use them
`,
    files:{'settings.json':'{"name": "Ada", "audio": {"volume": 9}}'},
    cases:[{inputs:[],files:{'settings.json':'{"name": "Ada", "audio": {"volume": 9}}'},tests:[['Present','lines==["Volume: 9","Name: Ada"]']]},{inputs:[],files:{'settings.json':'{"name": "Bo"}'},tests:[['No audio','lines==["Volume: 5","Name: Bo"]']]},{inputs:[],files:{'settings.json':'{"audio": {}}'},tests:[['No volume, no name','lines[0]=="Volume: 5"']]},{inputs:[],files:{},tests:[['No file','lines==["Volume: 5","Name: Hero"]'],['Copy not shared','(lambda d: (g["load_or_default"]("nope.json", d).__setitem__("x", 1), "x" in d)[1])({"a": 1}) is False'],['get_volume direct','g["get_volume"]({})==5 and g["get_volume"]({"audio": {"volume": 0}})==0']]}],
    sol:R`import json

def get_volume(settings):
    return settings.get("audio", {}).get("volume", 5)

def load_or_default(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return dict(default)

settings = load_or_default("settings.json", {"name": "Hero"})
print("Volume:", get_volume(settings))
print("Name:", settings.get("name", "Hero"))`,
    wrong:[R`import json

def get_volume(settings):
    return settings["audio"]["volume"]

def load_or_default(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return dict(default)

settings = load_or_default("settings.json", {"name": "Hero"})
print("Volume:", get_volume(settings))
print("Name:", settings.get("name", "Hero"))`, R`import json

def get_volume(settings):
    return settings.get("audio", {}).get("volume", 5) or 5

def load_or_default(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return default

settings = load_or_default("settings.json", {"name": "Hero"})
print("Volume:", get_volume(settings))
print("Name:", settings.get("name", "Hero"))`],
    hints:['get_volume: settings.get("audio", {}).get("volume", 5).','load_or_default: try to open and json.load; on FileNotFoundError return dict(default).','Print the name with settings.get("name", "Hero") in case it is missing too.','import json\n\ndef get_volume(settings):\n    return settings.get("audio", {}).get("volume", 5)\n\ndef load_or_default(path, default):\n    try:\n        with open(path) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return dict(default)\n\nsettings = load_or_default("settings.json", {"name": "Hero"})\nprint("Volume:", get_volume(settings))\nprint("Name:", settings.get("name", "Hero"))']},
  power:{can:['Read optional keys safely with .get','Treat a missing file as a first run with defaults'],
    expand:'Fill in all missing settings from a defaults dict in one loop.',
    where:'Every config loader, API client and save system uses these defaults.',
    next:'Next: corrupted JSON.'},
  codex:{title:'Safe access',body:'d.get(key, default), nested: d.get("a", {}).get("b", default). Copy defaults before returning them.',snip:R`settings.get("audio", {}).get("volume", 5)`}
},
{
  id:'r8-37', realm:8, n:37, title:'When the JSON is broken',
  teaches:['json-errors'], requires:['json-missing'],
  story:`A scroll arrives half-burnt. Orrin sniffs it. "Someone edited this by hand at midnight and lost a bracket. A good program does not **panic** at bad data. It says so, and carries on safely."`,
  concept:{
    html:`Invalid JSON raises \`json.JSONDecodeError\`, a kind of \`ValueError\`:\n\n\`\`\`\nimport json\ntry:\n    data = json.loads('{"a": 1')       # missing }\nexcept json.JSONDecodeError as e:\n    print("Bad JSON:", e.msg)\n\`\`\`\n\nCommon causes: a missing bracket, a trailing comma, single quotes, an empty file.\n\nA sturdy loader handles **both** problems:\n\n\`\`\`\ndef load_json(path, default):\n    try:\n        with open(path) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return dict(default)\n    except json.JSONDecodeError:\n        print("Corrupt file, using defaults")\n        return dict(default)\n\`\`\`\n\nIn real apps you would also keep a **backup copy** of the bad file for later inspection.`,
    analogy:`A pharmacist who says "I can't read this prescription" rather than guessing.`,
    example:R`import json

try:
    json.loads('{"a": 1')
except json.JSONDecodeError as e:
    print("Bad JSON:", e.msg)`},
  predict:{code:R`import json
try:
    json.loads("{'a': 1}")
except ValueError:
    print("bad")`, q:'What prints?', opts:['bad','{\'a\': 1}','Nothing'], ans:0, why:'JSON needs double quotes. JSONDecodeError is a ValueError, so this handler catches it.'},
  cast:{code:R`import json

try:
    json.loads('{"a": 1')
except json.JSONDecodeError as e:
    print("Bad JSON:", e.msg)`, task:'Cast it.'},
  bug:{broken:R`import json
text = '{"level": 3,}'
data = json.loads(text)
print(data["level"])`, task:'The trailing comma makes it invalid JSON. Catch the error and print Bad JSON instead of crashing.',
    cases:[{inputs:[],tests:[['Handled','lines==["Bad JSON"]']]}],
    sol:R`import json
text = '{"level": 3,}'
try:
    data = json.loads(text)
    print(data["level"])
except json.JSONDecodeError:
    print("Bad JSON")`, wrong:[R`import json
text = '{"level": 3,}'
data = json.loads(text)
print(data["level"])`]},
  write:{prompt:'Write `load_json(path, default)`: return the file\'s data; if the file is missing return a copy of `default`; if it holds invalid JSON print `Corrupt file, using defaults` and return a copy of `default`. Use it on `game.json` with default `{"level": 1}` and print `Level: <n>`.',
    starter:R`import json

# define load_json, then use it
`,
    files:{'game.json':'{"level": 7}'},
    cases:[{inputs:[],files:{'game.json':'{"level": 7}'},tests:[['Good file','lines==["Level: 7"]']]},{inputs:[],files:{},tests:[['Missing','lines==["Level: 1"]']]},{inputs:[],files:{'game.json':'{"level": 7'},tests:[['Corrupt','lines==["Corrupt file, using defaults","Level: 1"]']]},{inputs:[],files:{'game.json':''},tests:[['Empty file is corrupt','lines==["Corrupt file, using defaults","Level: 1"]']]},{inputs:[],files:{'game.json':'x'},tests:[['Copy of default','(lambda d: (g["load_json"]("game.json", d).__setitem__("z", 1), "z" in d)[1])({"level": 1}) is False']]}],
    sol:R`import json

def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return dict(default)
    except json.JSONDecodeError:
        print("Corrupt file, using defaults")
        return dict(default)

data = load_json("game.json", {"level": 1})
print("Level:", data["level"])`,
    wrong:[R`import json

def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        return dict(default)

data = load_json("game.json", {"level": 1})
print("Level:", data["level"])`, R`import json

def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        print("Corrupt file, using defaults")
        return dict(default)

data = load_json("game.json", {"level": 1})
print("Level:", data["level"])`],
    hints:['Two except clauses: FileNotFoundError (silent default) and json.JSONDecodeError (print, then default).','Return dict(default) so callers get a copy.','Then data = load_json("game.json", {"level": 1}) and print the level.','import json\n\ndef load_json(path, default):\n    try:\n        with open(path) as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return dict(default)\n    except json.JSONDecodeError:\n        print("Corrupt file, using defaults")\n        return dict(default)\n\ndata = load_json("game.json", {"level": 1})\nprint("Level:", data["level"])']},
  power:{can:['Handle corrupt JSON without crashing','Combine multiple except clauses for different problems'],
    expand:'Rename the corrupt file to game.json.bak before returning defaults.',
    where:'Every production loader has to expect hand-edited or truncated files.',
    next:'Next: a small database of records.'},
  codex:{title:'JSONDecodeError',body:'json.JSONDecodeError (a ValueError) means invalid JSON. Handle it separately from FileNotFoundError.',snip:R`except json.JSONDecodeError:`}
},
{
  id:'r8-38', realm:8, n:38, title:'A tiny database: records in JSON',
  teaches:['json-records'], requires:['json-errors','sort-key'],
  story:`"Keep the best scores of the realm," Orrin says. "Three names. When a new score beats one, bump the lowest off. And remember them, **forever**."`,
  concept:{
    html:`A **list of dicts** in a JSON file is a tiny database. The loop is always the same: **load → change → save**.\n\n\`\`\`\ndef add_score(scores, name, points):\n    scores.append({"name": name, "points": points})\n    scores.sort(key=lambda s: (-s["points"], s["name"]))\n    del scores[3:]                       # keep the top 3\n    return scores\n\`\`\`\n\n- \`del scores[3:]\` removes everything after the third item.\n- The sort key \`(-points, name)\` gives highest first and breaks ties alphabetically.\n- Write small helper functions (\`load_scores\`, \`save_scores\`, \`add_score\`) so each does one job.\n- Because the list is saved after every change, a crash loses nothing.`,
    analogy:`The arcade high-score board.`,
    example:R`scores = [{"name": "Ada", "points": 50}]
scores.append({"name": "Bo", "points": 70})
scores.sort(key=lambda s: (-s["points"], s["name"]))
print([s["name"] for s in scores])`},
  predict:{code:R`items = [1, 2, 3, 4, 5]
del items[3:]
print(items)`, q:'What prints?', opts:['[1, 2, 3]','[4, 5]','[1, 2, 3, 4]'], ans:0, why:'del items[3:] removes index 3 and beyond.'},
  cast:{code:R`scores = [{"name": "Ada", "points": 50}]
scores.append({"name": "Bo", "points": 70})
scores.sort(key=lambda s: (-s["points"], s["name"]))
print([s["name"] for s in scores])`, task:'Cast it.'},
  bug:{broken:R`scores = [{"name": "Bo", "points": 50}, {"name": "Cy", "points": 60}]
scores.append({"name": "Ada", "points": 50})
scores.sort(key=lambda s: -s["points"])
print([s["name"] for s in scores])`, task:'Ada and Bo tie on 50, and Ada should come first alphabetically. Make the tie-break fair. Expected: [\'Cy\', \'Ada\', \'Bo\']',
    cases:[{inputs:[],tests:[['Fair','lines==["[\'Cy\', \'Ada\', \'Bo\']"]']]}],
    sol:R`scores = [{"name": "Bo", "points": 50}, {"name": "Cy", "points": 60}]
scores.append({"name": "Ada", "points": 50})
scores.sort(key=lambda s: (-s["points"], s["name"]))
print([s["name"] for s in scores])`, wrong:[R`scores = [{"name": "Bo", "points": 50}, {"name": "Cy", "points": 60}]
scores.append({"name": "Ada", "points": 50})
scores.sort(key=lambda s: -s["points"])
print([s["name"] for s in scores])`]},
  write:{prompt:'Write `load_scores()` (reads `scores.json`, an empty list if missing), `save_scores(scores)` and `add_score(scores, name, points)` (keeps only the **top 3**, highest first, ties A-Z). Ask `Name: ` and `Points: `, add the score, save, and print the board as `<rank>. <name> - <points>`.',
    starter:R`import json

# define the three helpers, then run
`,
    inputs:['Zed','65'],
    files:{'scores.json':'[{"name": "Ada", "points": 90}, {"name": "Bo", "points": 60}, {"name": "Cy", "points": 40}]'},
    cases:[{inputs:['Zed','65'],files:{'scores.json':'[{"name": "Ada", "points": 90}, {"name": "Bo", "points": 60}, {"name": "Cy", "points": 40}]'},tests:[['Board','[l for l in lines if l[:1].isdigit() and ". " in l]==["1. Ada - 90","2. Zed - 65","3. Bo - 60"]'],['Saved top three','json.loads(read("scores.json"))==[{"name":"Ada","points":90},{"name":"Zed","points":65},{"name":"Bo","points":60}]']]},{inputs:['Neo','10'],files:{},tests:[['First score ever','[l for l in lines if l.startswith("1.")]==["1. Neo - 10"] and json.loads(read("scores.json"))==[{"name":"Neo","points":10}]']]},{inputs:['Amy','60'],files:{'scores.json':'[{"name": "Bo", "points": 60}, {"name": "Cy", "points": 40}]'},tests:[['Tie goes A-Z','[l for l in lines if l[:1].isdigit() and ". " in l]==["1. Amy - 60","2. Bo - 60","3. Cy - 40"]']]},{inputs:['Low','1'],files:{'scores.json':'[{"name": "A", "points": 9}, {"name": "B", "points": 8}, {"name": "C", "points": 7}]'},tests:[['Too low to enter','[l for l in lines if l[:1].isdigit() and ". " in l]==["1. A - 9","2. B - 8","3. C - 7"]']]},{inputs:['x','5'],files:{'scores.json':'[]'},tests:[['Helpers','g["add_score"]([{"name":"a","points":1},{"name":"b","points":2},{"name":"c","points":3}],"d",9)[0]=={"name":"d","points":9}']]}],
    sol:R`import json

def load_scores():
    try:
        with open("scores.json") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_scores(scores):
    with open("scores.json", "w") as f:
        json.dump(scores, f)

def add_score(scores, name, points):
    scores.append({"name": name, "points": points})
    scores.sort(key=lambda s: (-s["points"], s["name"]))
    del scores[3:]
    return scores

name = input("Name: ")
points = int(input("Points: "))
scores = add_score(load_scores(), name, points)
save_scores(scores)
for rank, s in enumerate(scores, 1):
    print(f"{rank}. {s['name']} - {s['points']}")`,
    wrong:[R`import json

def load_scores():
    try:
        with open("scores.json") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_scores(scores):
    with open("scores.json", "w") as f:
        json.dump(scores, f)

def add_score(scores, name, points):
    scores.append({"name": name, "points": points})
    scores.sort(key=lambda s: -s["points"])
    del scores[3:]
    return scores

name = input("Name: ")
points = int(input("Points: "))
scores = add_score(load_scores(), name, points)
save_scores(scores)
for rank, s in enumerate(scores, 1):
    print(f"{rank}. {s['name']} - {s['points']}")`, R`import json

def load_scores():
    try:
        with open("scores.json") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

def save_scores(scores):
    with open("scores.json", "w") as f:
        json.dump(scores, f)

def add_score(scores, name, points):
    scores.append({"name": name, "points": points})
    scores.sort(key=lambda s: (-s["points"], s["name"]))
    return scores

name = input("Name: ")
points = int(input("Points: "))
scores = add_score(load_scores(), name, points)
save_scores(scores)
for rank, s in enumerate(scores, 1):
    print(f"{rank}. {s['name']} - {s['points']}")`],
    hints:['load_scores: try json.load, except FileNotFoundError: return []. save_scores: json.dump.','add_score: append the dict, sort by (-points, name), then del scores[3:].','Print each entry with enumerate(scores, 1) and an f-string.','import json\n\ndef load_scores():\n    try:\n        with open("scores.json") as f:\n            return json.load(f)\n    except FileNotFoundError:\n        return []\n\ndef save_scores(scores):\n    with open("scores.json", "w") as f:\n        json.dump(scores, f)\n\ndef add_score(scores, name, points):\n    scores.append({"name": name, "points": points})\n    scores.sort(key=lambda s: (-s["points"], s["name"]))\n    del scores[3:]\n    return scores\n\nname = input("Name: ")\npoints = int(input("Points: "))\nscores = add_score(load_scores(), name, points)\nsave_scores(scores)\nfor rank, s in enumerate(scores, 1):\n    print(f"{rank}. {s[\'name\']} - {s[\'points\']}")']},
  power:{can:['Use a JSON file as a small database','Follow the load → change → save pattern'],
    expand:'Also store the date of each score and show it on the board.',
    where:'Leaderboards, inventories and notes apps are all this pattern.',
    next:'Next: the Contact Book mission.'},
  codex:{title:'Load-change-save',body:'Load the list, change it with small functions, save it every time. del items[n:] keeps the first n.',snip:R`del scores[3:]`}
},
{
  id:'r8-39', realm:8, n:39, title:'Real-World Mission: The Contact Book',
  teaches:['mission8c'], requires:['json-records'],
  story:`A nervous courier waves a bundle of address cards. "Phone numbers, scribbled everywhere. Build me a **contact book** that keeps them safe, even after I close the program."`,
  concept:{
    html:`**Mission brief:** a contact book stored in \`contacts.json\` as a dict of \`name → phone\` (names in **lower case**). Loop asking \`Cmd: \`:\n\n| Command | Output |\n|---|---|\n| \`add <name> <phone>\` | \`Saved <name>\` (new) or \`Updated <name>\` (exists) |\n| \`find <name>\` | \`<name>: <phone>\` or \`Not found\` |\n| \`list\` | each \`<name>: <phone>\`, A-Z, or \`No contacts\` |\n| \`delete <name>\` | \`Deleted <name>\` or \`Not found\` |\n| \`quit\` | \`Bye\` and stop |\n| wrong word count / unknown word | \`Usage: add <name> <phone>\` for a bad \`add\`, otherwise \`Unknown command\` |\n\nNames are case-insensitive (\`ADA\` and \`ada\` are the same person). Load the file at the start (missing **or corrupt** file means an empty book) and save after every change.`,
    analogy:`A pocket address book that never gets lost.`,
    example:R`contacts = {"ada": "555-0101"}
name = "ADA".lower()
print(contacts.get(name, "Not found"))`},
  predict:{code:R`parts = "add ada 555".split()
print(parts[0], len(parts))`, q:'What prints?', opts:['add 3','add 2','ada 3'], ans:0, why:'split() gives ["add", "ada", "555"], with 3 parts.'},
  cast:{code:R`contacts = {"ada": "555-0101"}
name = "ADA".lower()
print(contacts.get(name, "Not found"))`, task:'Cast it.'},
  bug:{broken:R`contacts = {"ada": "555"}
name = "Ada"
if name in contacts:
    print("Found")
else:
    print("Not found")`, task:'Names are stored in lower case, so "Ada" is not found. Normalise the name before looking it up. Expected: Found',
    cases:[{inputs:[],tests:[['Found','lines==["Found"]']]}],
    sol:R`contacts = {"ada": "555"}
name = "Ada".lower()
if name in contacts:
    print("Found")
else:
    print("Not found")`, wrong:[R`contacts = {"ada": "555"}
name = "Ada"
if name in contacts:
    print("Found")
else:
    print("Not found")`]},
  write:{prompt:'Build the Contact Book exactly as the brief says. Persist to `contacts.json`.',
    starter:R`import json

# load contacts.json, then run the Cmd: loop
`,
    inputs:['add Ada 555-0101','find ada','list','quit'],
    files:{'contacts.json':'{"zed": "555-0999"}'},
    cases:[{inputs:['add Ada 555-0101','add ADA 555-0202','find ada','find bob','list','delete zed','delete zed','list','add x','dance','quit'],files:{'contacts.json':'{"zed": "555-0999"}'},tests:[['Session','[l for l in lines if not l.startswith("Cmd: ")]==["Saved ada","Updated ada","ada: 555-0202","Not found","ada: 555-0202","zed: 555-0999","Deleted zed","Not found","ada: 555-0202","Usage: add <name> <phone>","Unknown command","Bye"]'],['Saved file','json.loads(read("contacts.json"))=={"ada":"555-0202"}']]},{inputs:['list','quit'],files:{},tests:[['No file','[l for l in lines if not l.startswith("Cmd: ")]==["No contacts","Bye"]']]},{inputs:['list','add a 1','quit'],files:{'contacts.json':'{"broken'},tests:[['Corrupt file starts empty','[l for l in lines if not l.startswith("Cmd: ")]==["No contacts","Saved a","Bye"] and json.loads(read("contacts.json"))=={"a":"1"}']]},{inputs:['find','delete','add a b c','find a b','quit'],files:{},tests:[['Wrong word counts','[l for l in lines if not l.startswith("Cmd: ")]==["Unknown command","Unknown command","Usage: add <name> <phone>","Unknown command","Bye"]']]},{inputs:['add Bo 7','list','quit'],files:{'contacts.json':'{"cy": "9", "al": "3"}'},tests:[['Sorted list','[l for l in lines if not l.startswith("Cmd: ")]==["Saved bo","al: 3","bo: 7","cy: 9","Bye"]']]}],
    sol:R`import json

def load_contacts():
    try:
        with open("contacts.json") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_contacts(contacts):
    with open("contacts.json", "w") as f:
        json.dump(contacts, f)

contacts = load_contacts()
while True:
    parts = input("Cmd: ").split()
    command = parts[0].lower() if parts else ""
    if command == "quit" and len(parts) == 1:
        print("Bye")
        break
    elif command == "add":
        if len(parts) != 3:
            print("Usage: add <name> <phone>")
        else:
            name = parts[1].lower()
            verb = "Updated" if name in contacts else "Saved"
            contacts[name] = parts[2]
            save_contacts(contacts)
            print(verb, name)
    elif command == "find" and len(parts) == 2:
        name = parts[1].lower()
        if name in contacts:
            print(f"{name}: {contacts[name]}")
        else:
            print("Not found")
    elif command == "list" and len(parts) == 1:
        if not contacts:
            print("No contacts")
        for name in sorted(contacts):
            print(f"{name}: {contacts[name]}")
    elif command == "delete" and len(parts) == 2:
        name = parts[1].lower()
        if name in contacts:
            del contacts[name]
            save_contacts(contacts)
            print("Deleted", name)
        else:
            print("Not found")
    else:
        print("Unknown command")`,
    wrong:[R`import json

def load_contacts():
    try:
        with open("contacts.json") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_contacts(contacts):
    with open("contacts.json", "w") as f:
        json.dump(contacts, f)

contacts = load_contacts()
while True:
    parts = input("Cmd: ").split()
    command = parts[0].lower() if parts else ""
    if command == "quit" and len(parts) == 1:
        print("Bye")
        break
    elif command == "add":
        if len(parts) != 3:
            print("Usage: add <name> <phone>")
        else:
            name = parts[1]
            verb = "Updated" if name in contacts else "Saved"
            contacts[name] = parts[2]
            save_contacts(contacts)
            print(verb, name)
    elif command == "find" and len(parts) == 2:
        name = parts[1]
        if name in contacts:
            print(f"{name}: {contacts[name]}")
        else:
            print("Not found")
    elif command == "list" and len(parts) == 1:
        if not contacts:
            print("No contacts")
        for name in sorted(contacts):
            print(f"{name}: {contacts[name]}")
    elif command == "delete" and len(parts) == 2:
        name = parts[1]
        if name in contacts:
            del contacts[name]
            save_contacts(contacts)
            print("Deleted", name)
        else:
            print("Not found")
    else:
        print("Unknown command")`, R`import json

def load_contacts():
    try:
        with open("contacts.json") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_contacts(contacts):
    with open("contacts.json", "w") as f:
        json.dump(contacts, f)

contacts = load_contacts()
while True:
    parts = input("Cmd: ").split()
    command = parts[0].lower() if parts else ""
    if command == "quit" and len(parts) == 1:
        print("Bye")
        break
    elif command == "add":
        if len(parts) != 3:
            print("Usage: add <name> <phone>")
        else:
            name = parts[1].lower()
            verb = "Updated" if name in contacts else "Saved"
            contacts[name] = parts[2]
            save_contacts(contacts)
            print(verb, name)
    elif command == "find" and len(parts) == 2:
        name = parts[1].lower()
        if name in contacts:
            print(f"{name}: {contacts[name]}")
        else:
            print("Not found")
    elif command == "list" and len(parts) == 1:
        if not contacts:
            print("No contacts")
        for name in sorted(contacts):
            print(f"{name}: {contacts[name]}")
    elif command == "delete" and len(parts) == 2:
        name = parts[1].lower()
        if name in contacts:
            del contacts[name]
            save_contacts(contacts)
            print("Deleted", name)
        else:
            print("Not found")
    else:
        print("Unknown command")`],
    hints:['load_contacts returns {} for a missing file OR corrupt JSON: except (FileNotFoundError, json.JSONDecodeError).','Split each line; check the command word and the number of parts. Lower-case every name before using it as a key.','Save with json.dump after every add and delete. Updating an existing name prints Updated instead of Saved.','import json\n\ndef load_contacts():\n    try:\n        with open("contacts.json") as f:\n            return json.load(f)\n    except (FileNotFoundError, json.JSONDecodeError):\n        return {}\n\ndef save_contacts(contacts):\n    with open("contacts.json", "w") as f:\n        json.dump(contacts, f)\n\ncontacts = load_contacts()\nwhile True:\n    parts = input("Cmd: ").split()\n    command = parts[0].lower() if parts else ""\n    if command == "quit" and len(parts) == 1:\n        print("Bye")\n        break\n    elif command == "add":\n        if len(parts) != 3:\n            print("Usage: add <name> <phone>")\n        else:\n            name = parts[1].lower()\n            verb = "Updated" if name in contacts else "Saved"\n            contacts[name] = parts[2]\n            save_contacts(contacts)\n            print(verb, name)\n    elif command == "find" and len(parts) == 2:\n        name = parts[1].lower()\n        if name in contacts:\n            print(f"{name}: {contacts[name]}")\n        else:\n            print("Not found")\n    elif command == "list" and len(parts) == 1:\n        if not contacts:\n            print("No contacts")\n        for name in sorted(contacts):\n            print(f"{name}: {contacts[name]}")\n    elif command == "delete" and len(parts) == 2:\n        name = parts[1].lower()\n        if name in contacts:\n            del contacts[name]\n            save_contacts(contacts)\n            print("Deleted", name)\n        else:\n            print("Not found")\n    else:\n        print("Unknown command")']},
  power:{can:['Build a program whose data survives restarts','Combine JSON, dicts, validation and command loops'],
    expand:'Add a `search <text>` command that finds names containing the text.',
    where:'Contacts, notes, bookmarks and settings are all stored like this.',
    next:'Next: converting CSV to JSON.'},
  codex:{title:'Contact book',body:'dict persisted as JSON. Lower-case names. Load tolerant (missing/corrupt = empty). Save after each change.',snip:R`except (FileNotFoundError, json.JSONDecodeError):
    return {}`}
},
{
  id:'r8-40', realm:8, n:40, title:'Real-World Mission: The Converter',
  teaches:['mission8d'], requires:['mission8c'],
  story:`A tall engineer from the Great Wire frowns at your CSV. "Our systems only take **JSON**. Convert this staff list, and be careful: ages must be numbers, flags must be real true/false, and bad rows must **not** be passed along."`,
  concept:{
    html:`**Mission brief:** convert \`people.csv\` (\`name,age,city,active\`) into \`people.json\`.\n\n- \`age\` must become an **int**. A row with a missing or non-whole-number age is **skipped**.\n- \`active\` becomes **True** if the text (any case, spaces ignored) is \`yes\`, \`true\` or \`1\`; otherwise **False**.\n- \`name\` and \`city\` are stripped of spaces. A blank name means the row is skipped.\n- Keep the keys in the order \`name, age, city, active\`.\n- Write the JSON with \`indent=2\` (and a final newline).\n\nPrint \`Converted <n> rows\` and \`Skipped <k> rows\`. A missing \`people.csv\` prints \`No people.csv\` and writes nothing.`,
    analogy:`A translator between two systems.`,
    example:R`text = " Yes "
print(text.strip().lower() in ("yes", "true", "1"))`},
  predict:{code:R`for t in ["YES", "no", "1", ""]:
    print(t.strip().lower() in ("yes", "true", "1"), end=" ")`, q:'What prints?', opts:['True False True False','True True True False','False False True False'], ans:0, why:'Only yes, true and 1 (any case) count as true.'},
  cast:{code:R`for t in ["YES", "no", "1", ""]:
    print(t.strip().lower() in ("yes", "true", "1"), end=" ")`, task:'Cast it.'},
  bug:{broken:R`import json
row = {"name": "Ada", "age": "30"}
print(json.dumps(row))`, task:'The age is the text "30", which JSON writes as "30" in quotes. Convert it to a number first. Expected: {"name": "Ada", "age": 30}',
    cases:[{inputs:[],tests:[['Number','lines==["{\\"name\\": \\"Ada\\", \\"age\\": 30}"]']]}],
    sol:R`import json
row = {"name": "Ada", "age": "30"}
row["age"] = int(row["age"])
print(json.dumps(row))`, wrong:[R`import json
row = {"name": "Ada", "age": "30"}
print(json.dumps(row))`]},
  write:{prompt:'Build the Converter exactly as the brief says.',
    starter:R`import csv
import json

# convert people.csv into people.json
`,
    files:{'people.csv':'name,age,city,active\nAda,30,Oslo,yes\n  Bo ,x,Rome,no\nCy,41, Lima ,TRUE\n,20,Pune,1\nDi,,Kyiv,yes\nEd,25,Nice,maybe\n'},
    cases:[{inputs:[],files:{'people.csv':'name,age,city,active\nAda,30,Oslo,yes\n  Bo ,x,Rome,no\nCy,41, Lima ,TRUE\n,20,Pune,1\nDi,,Kyiv,yes\nEd,25,Nice,maybe\n'},tests:[['Messages','lines==["Converted 3 rows","Skipped 3 rows"]'],['JSON file','read("people.json")==json.dumps([{"name":"Ada","age":30,"city":"Oslo","active":True},{"name":"Cy","age":41,"city":"Lima","active":True},{"name":"Ed","age":25,"city":"Nice","active":False}], indent=2)+"\\n"']]},{inputs:[],files:{},tests:[['No input file','lines==["No people.csv"] and not exists("people.json")']]},{inputs:[],files:{'people.csv':'name,age,city,active\n'},tests:[['Header only','lines==["Converted 0 rows","Skipped 0 rows"] and read("people.json")=="[]\\n"']]},{inputs:[],files:{'people.csv':'name,age,city,active\nZoë,7,"Aix, FR",1\n'},tests:[['Quoted comma','json.loads(read("people.json"))==[{"name":"Zoë","age":7,"city":"Aix, FR","active":True}]']]},{inputs:[],files:{'people.csv':'name,age,city,active\nA,-3,X,no\nB,2.5,Y,no\n'},tests:[['Negative ok, decimal skipped','json.loads(read("people.json"))==[{"name":"A","age":-3,"city":"X","active":False}] and lines[-1]=="Skipped 1 rows"']]}],
    sol:R`import csv
import json

people = []
skipped = 0
try:
    with open("people.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = (row.get("name") or "").strip()
            city = (row.get("city") or "").strip()
            active_text = (row.get("active") or "").strip().lower()
            try:
                age = int((row.get("age") or "").strip())
            except ValueError:
                skipped += 1
                continue
            if name == "":
                skipped += 1
                continue
            people.append({"name": name, "age": age, "city": city, "active": active_text in ("yes", "true", "1")})
except FileNotFoundError:
    print("No people.csv")
else:
    with open("people.json", "w", encoding="utf-8") as out:
        out.write(json.dumps(people, indent=2, ensure_ascii=False) + "\n")
    print("Converted", len(people), "rows")
    print("Skipped", skipped, "rows")`,
    wrong:[R`import csv
import json

people = []
skipped = 0
try:
    with open("people.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = (row.get("name") or "").strip()
            city = (row.get("city") or "").strip()
            active_text = (row.get("active") or "").strip().lower()
            try:
                age = int((row.get("age") or "").strip())
            except ValueError:
                skipped += 1
                continue
            if name == "":
                skipped += 1
                continue
            people.append({"name": name, "age": age, "city": city, "active": active_text != "no"})
except FileNotFoundError:
    print("No people.csv")
else:
    with open("people.json", "w", encoding="utf-8") as out:
        out.write(json.dumps(people, indent=2, ensure_ascii=False) + "\n")
    print("Converted", len(people), "rows")
    print("Skipped", skipped, "rows")`, R`import csv
import json

people = []
skipped = 0
try:
    with open("people.csv", newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = (row.get("name") or "").strip()
            city = (row.get("city") or "").strip()
            active_text = (row.get("active") or "").strip().lower()
            try:
                age = int((row.get("age") or "").strip())
            except ValueError:
                skipped += 1
                continue
            if name == "":
                skipped += 1
                continue
            people.append({"name": name, "age": age, "city": city, "active": active_text in ("yes", "true", "1")})
except FileNotFoundError:
    print("No people.csv")
else:
    with open("people.json", "w", encoding="utf-8") as out:
        out.write(json.dumps(people) + "\n")
    print("Converted", len(people), "rows")
    print("Skipped", skipped, "rows")`],
    hints:['Read with DictReader. Per row: strip name and city, int() the age in a try (skip on ValueError), skip blank names.','active is True when text.strip().lower() is in ("yes", "true", "1").','Write json.dumps(people, indent=2) + "\\n" to people.json. Wrap the reading in try/except FileNotFoundError and use else for the writing and the messages.','import csv\nimport json\n\npeople = []\nskipped = 0\ntry:\n    with open("people.csv", newline="", encoding="utf-8") as f:\n        for row in csv.DictReader(f):\n            name = (row.get("name") or "").strip()\n            city = (row.get("city") or "").strip()\n            active_text = (row.get("active") or "").strip().lower()\n            try:\n                age = int((row.get("age") or "").strip())\n            except ValueError:\n                skipped += 1\n                continue\n            if name == "":\n                skipped += 1\n                continue\n            people.append({"name": name, "age": age, "city": city, "active": active_text in ("yes", "true", "1")})\nexcept FileNotFoundError:\n    print("No people.csv")\nelse:\n    with open("people.json", "w", encoding="utf-8") as out:\n        out.write(json.dumps(people, indent=2, ensure_ascii=False) + "\\n")\n    print("Converted", len(people), "rows")\n    print("Skipped", skipped, "rows")']},
  power:{can:['Convert between CSV and JSON safely','Clean and type data while converting'],
    expand:'Convert the JSON back to CSV and check you get the same rows.',
    where:'Moving data between systems is the core of data engineering.',
    next:'Boss: the Ledger Wyrm guards the Archive.'},
  codex:{title:'CSV → JSON',body:'DictReader → clean + convert types → list of dicts → json.dumps(indent=2). Skip and count bad rows.',snip:R`{"age": int(row["age"]), "active": text in ("yes", "true", "1")}`}
}
);
