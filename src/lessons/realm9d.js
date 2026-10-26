// REALM 9 — THE WORKSHOP — part D (lessons 34-42: logging, JSON dates, heapq, bisect, decimal, shlex, three missions)
LESSONS.push(
{
  id:'r9-34', realm:9, n:34, title:'logging: print() for grown-ups',
  teaches:['logging-basic'], requires:['mission9a'],
  story:`The Workshop's machines mutter in the night. "Debug prints are fine for a day," Master Cog says, "but a real machine needs a **logbook**: levels of importance, timestamps if you want them, and switches to hush the chatter."`,
  concept:{
    html:`\`logging\` writes messages with a **level**:\n\n| Level | Use |\n|---|---|\n| DEBUG | tiny details for fixing bugs |\n| INFO | normal progress ("started", "saved") |\n| WARNING | something odd but fine |\n| ERROR | something failed |\n| CRITICAL | the program may not go on |\n\n\`\`\`\nimport logging, sys\n\nlogging.basicConfig(\n    stream=sys.stdout,                       # default is stderr\n    level=logging.INFO,                      # show INFO and above\n    format="%(levelname)s: %(message)s",     # how each line looks\n    force=True,                              # replace any earlier setup\n)\n\nlogging.debug("hidden at INFO level")\nlogging.info("Checking %s", "apple")         # INFO: Checking apple\nlogging.warning("Low stock")\n\`\`\`\n\n- The default level is **WARNING**, so \`info\` and \`debug\` are hidden until you set a level.\n- Pass values as **arguments** (\`"Checking %s", item\`) rather than building the string yourself; logging only formats it if the message is shown.\n- Common format pieces: \`%(asctime)s\` (time), \`%(levelname)s\`, \`%(name)s\`, \`%(message)s\`.\n- Why not \`print\`? Levels can be switched off in production, messages can go to **files**, and every line is timestamped consistently.\n- \`force=True\` is handy in notebooks and in this app, where setup may run again.`,
    analogy:`A ship's logbook: routine entries, warnings and alarms, and the captain decides how much to read.`,
    example:R`import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(levelname)s: %(message)s", force=True)

logging.debug("hidden")
logging.info("Checking %s", "apple")
logging.warning("Low stock")`},
  predict:{code:R`import logging, sys
logging.basicConfig(stream=sys.stdout, level=logging.WARNING,
                    format="%(levelname)s: %(message)s", force=True)
logging.info("a")
logging.warning("b")`, q:'What prints?', opts:['WARNING: b','INFO: a\nWARNING: b','Nothing'], ans:0, why:'At WARNING level, INFO is hidden.'},
  cast:{code:R`import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(levelname)s: %(message)s", force=True)

logging.debug("hidden")
logging.info("Checking %s", "apple")
logging.warning("Low stock")`, task:'Cast it. Then change level to logging.DEBUG.'},
  bug:{broken:R`import logging
import sys
logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(message)s", force=True)
logging.info("started")`, task:'Nothing prints: the default level is WARNING. Set the level so the info message shows. Expected: INFO: started',
    cases:[{inputs:[],tests:[['Shown','lines==["INFO: started"]']]}],
    sol:R`import logging
import sys
logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True)
logging.info("started")`, wrong:[R`import logging
import sys
logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(message)s", force=True)
logging.info("started")`]},
  write:{prompt:'Configure logging to print to `sys.stdout` at `INFO` level in the form `LEVEL: message`. Write `check_stock(item)` for `stock = {"apple": 10, "pear": 3, "plum": 0}`: first `logging.debug` the line `Stock table has 3 items` (hidden at INFO level), then `logging.info` `Checking <item>`. Unknown item → `logging.error` `Unknown item: <item>`. Quantity 0 → `logging.error` `Out of stock: <item>`. Quantity under 5 → `logging.warning` `Low stock: <item> (<qty>)`. Ask `Item: ` and call it.',
    starter:R`import logging
import sys

stock = {"apple": 10, "pear": 3, "plum": 0}
`,
    inputs:['pear'],
    cases:[{inputs:['pear'],tests:[['Low stock','lines[-2:]==["INFO: Checking pear","WARNING: Low stock: pear (3)"]'],['Debug used','"debug(" in src'],['Debug hidden at INFO','"DEBUG" not in out']]},{inputs:['apple'],tests:[['Fine','lines[-1]=="INFO: Checking apple"']]},{inputs:['plum'],tests:[['Empty','lines[-2:]==["INFO: Checking plum","ERROR: Out of stock: plum"]']]},{inputs:['kiwi'],tests:[['Unknown','lines[-2:]==["INFO: Checking kiwi","ERROR: Unknown item: kiwi"]']]}],
    sol:R`import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO,
                    format="%(levelname)s: %(message)s", force=True)

stock = {"apple": 10, "pear": 3, "plum": 0}

def check_stock(item):
    logging.debug("Stock table has %d items", len(stock))
    logging.info("Checking %s", item)
    if item not in stock:
        logging.error("Unknown item: %s", item)
    elif stock[item] == 0:
        logging.error("Out of stock: %s", item)
    elif stock[item] < 5:
        logging.warning("Low stock: %s (%d)", item, stock[item])

check_stock(input("Item: "))`,
    wrong:[R`import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG,
                    format="%(levelname)s: %(message)s", force=True)

stock = {"apple": 10, "pear": 3, "plum": 0}

def check_stock(item):
    logging.debug("Stock table has %d items", len(stock))
    logging.info("Checking %s", item)
    if item not in stock:
        logging.error("Unknown item: %s", item)
    elif stock[item] == 0:
        logging.error("Out of stock: %s", item)
    elif stock[item] < 5:
        logging.warning("Low stock: %s (%d)", item, stock[item])

check_stock(input("Item: "))`, R`import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO, force=True)

stock = {"apple": 10, "pear": 3, "plum": 0}

def check_stock(item):
    logging.debug("Stock table has %d items", len(stock))
    logging.info("Checking %s", item)
    if item not in stock:
        logging.error("Unknown item: %s", item)
    elif stock[item] == 0:
        logging.error("Out of stock: %s", item)
    elif stock[item] < 5:
        logging.warning("Low stock: %s (%d)", item, stock[item])

check_stock(input("Item: "))`],
    hints:['logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s", force=True).','In check_stock: debug first, then info, then an if / elif chain for unknown, empty and low.','logging.warning("Low stock: %s (%d)", item, stock[item]).','import logging\nimport sys\n\nlogging.basicConfig(stream=sys.stdout, level=logging.INFO,\n                    format="%(levelname)s: %(message)s", force=True)\n\nstock = {"apple": 10, "pear": 3, "plum": 0}\n\ndef check_stock(item):\n    logging.debug("Stock table has %d items", len(stock))\n    logging.info("Checking %s", item)\n    if item not in stock:\n        logging.error("Unknown item: %s", item)\n    elif stock[item] == 0:\n        logging.error("Out of stock: %s", item)\n    elif stock[item] < 5:\n        logging.warning("Low stock: %s (%d)", item, stock[item])\n\ncheck_stock(input("Item: "))']},
  power:{can:['Log at the right level','Configure the level and the format'],
    expand:'Add %(asctime)s to the format and see the timestamp (it changes every run, so it isn\'t good for tests!).',
    where:'Every server, bot and scheduled job relies on logs to explain what happened last night.',
    next:'Next: saving dates in JSON.'},
  codex:{title:'logging',body:'basicConfig(level=, format=, stream=, force=True). debug/info/warning/error/critical. Default level WARNING. Pass values as arguments.',snip:R`logging.info("Checking %s", item)`}
},
{
  id:'r9-35', realm:9, n:35, title:'JSON and dates: saving what JSON can\'t hold',
  teaches:['json-dates'], requires:['logging-basic'],
  story:`Master Cog tries to post a festival calendar to the Archive. The courier shrugs. "**JSON has no date type.** Numbers, text, lists, dictionaries: yes. A date object? It won't carry it."`,
  concept:{
    html:`\`json.dumps\` cannot handle \`date\`, \`datetime\`, \`Decimal\`, \`set\` or your own objects:\n\n\`\`\`\njson.dumps({"d": date(2026, 10, 23)})\n# TypeError: Object of type date is not JSON serializable\n\`\`\`\n\n**Save:** turn them into text. The quick way is \`default=str\`, a function used for anything JSON doesn't understand:\n\n\`\`\`\njson.dumps({"d": date(2026, 10, 23)}, default=str)   # '{"d": "2026-10-23"}'\n\`\`\`\n\nFor dates this gives ISO text (\`YYYY-MM-DD\`), which sorts correctly and round-trips.\n\n**Load:** JSON hands back **plain strings**. Convert them yourself:\n\n\`\`\`\nevent["when"] = date.fromisoformat(event["when"])\n\`\`\`\n\n- For more control write your own: \`default=lambda o: o.isoformat() if isinstance(o, date) else str(o)\`.\n- Lesson: keep a clear **boundary**. Dates inside your program are objects; dates in files are ISO text.`,
    analogy:`Posting a parcel: you must pack the date object into a standard box (text) and unpack it at the other end.`,
    example:R`import json
from datetime import date

text = json.dumps({"d": date(2026, 10, 23)}, default=str)
print(text)
back = json.loads(text)
print(date.fromisoformat(back["d"]).year)`},
  predict:{code:R`import json
from datetime import date
print(json.dumps({"d": date(2026, 1, 1)}, default=str))`, q:'What prints?', opts:['{"d": "2026-01-01"}','{"d": 2026-01-01}','TypeError'], ans:0, why:'default=str turns the date into the text "2026-01-01".'},
  cast:{code:R`import json
from datetime import date

text = json.dumps({"d": date(2026, 10, 23)}, default=str)
print(text)
back = json.loads(text)
print(date.fromisoformat(back["d"]).year)`, task:'Cast it.'},
  bug:{broken:R`import json
from datetime import date
print(json.dumps({"when": date(2026, 10, 23)}))`, task:'TypeError: a date is not JSON serializable. Tell dumps how to convert it. Expected: {"when": "2026-10-23"}',
    cases:[{inputs:[],tests:[['Saved','lines==["{\\"when\\": \\"2026-10-23\\"}"]']]}],
    sol:R`import json
from datetime import date
print(json.dumps({"when": date(2026, 10, 23)}, default=str))`, wrong:[R`import json
from datetime import date
print(json.dumps({"when": date(2026, 10, 23)}))`]},
  write:{prompt:'Write `save_events(events, path)` (JSON file, `indent=2`, dates become ISO text) and `load_events(path)` (reads it back and turns each event\'s `"when"` back into a `date`). Save the given `events` to `events.json`, print `Saved <n> events`, load them back and print `Gap: <days between the first and second event> days`.',
    starter:R`import json
from datetime import date

events = [
    {"title": "Harvest Fair", "when": date(2026, 10, 23)},
    {"title": "Gear Festival", "when": date(2026, 12, 1)},
]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["Saved 2 events","Gap: 39 days"]'],['File holds ISO text','json.loads(read("events.json"))[0]["when"]=="2026-10-23"'],['Round trip','(lambda d: (g["save_events"]([{"title":"x","when":d}],"t.json"), g["load_events"]("t.json")[0]["when"]==d and g["load_events"]("t.json")[0]["title"]=="x")[1])(__import__("datetime").date(2024,2,29))'],['Indented','"\\n  " in read("events.json")']]}],
    sol:R`import json
from datetime import date

events = [
    {"title": "Harvest Fair", "when": date(2026, 10, 23)},
    {"title": "Gear Festival", "when": date(2026, 12, 1)},
]

def save_events(events, path):
    with open(path, "w") as f:
        json.dump(events, f, default=str, indent=2)

def load_events(path):
    with open(path) as f:
        events = json.load(f)
    for event in events:
        event["when"] = date.fromisoformat(event["when"])
    return events

save_events(events, "events.json")
print("Saved", len(events), "events")
loaded = load_events("events.json")
print("Gap:", (loaded[1]["when"] - loaded[0]["when"]).days, "days")`,
    wrong:[R`import json
from datetime import date

events = [
    {"title": "Harvest Fair", "when": date(2026, 10, 23)},
    {"title": "Gear Festival", "when": date(2026, 12, 1)},
]

def save_events(events, path):
    with open(path, "w") as f:
        json.dump(events, f, indent=2)

def load_events(path):
    with open(path) as f:
        events = json.load(f)
    for event in events:
        event["when"] = date.fromisoformat(event["when"])
    return events

save_events(events, "events.json")
print("Saved", len(events), "events")
loaded = load_events("events.json")
print("Gap:", (loaded[1]["when"] - loaded[0]["when"]).days, "days")`, R`import json
from datetime import date

events = [
    {"title": "Harvest Fair", "when": date(2026, 10, 23)},
    {"title": "Gear Festival", "when": date(2026, 12, 1)},
]

def save_events(events, path):
    with open(path, "w") as f:
        json.dump(events, f, default=str, indent=2)

def load_events(path):
    with open(path) as f:
        return json.load(f)

save_events(events, "events.json")
print("Saved", len(events), "events")
loaded = load_events("events.json")
print("Gap:", (date.fromisoformat(loaded[1]["when"]) - date.fromisoformat(loaded[0]["when"])).days, "days")`],
    hints:['json.dump(events, f, default=str, indent=2) inside a with open(path, "w") block.','load_events: json.load, then loop and set event["when"] = date.fromisoformat(event["when"]).','Gap: subtract the two dates and take .days.','import json\nfrom datetime import date\n\nevents = [\n    {"title": "Harvest Fair", "when": date(2026, 10, 23)},\n    {"title": "Gear Festival", "when": date(2026, 12, 1)},\n]\n\ndef save_events(events, path):\n    with open(path, "w") as f:\n        json.dump(events, f, default=str, indent=2)\n\ndef load_events(path):\n    with open(path) as f:\n        events = json.load(f)\n    for event in events:\n        event["when"] = date.fromisoformat(event["when"])\n    return events\n\nsave_events(events, "events.json")\nprint("Saved", len(events), "events")\nloaded = load_events("events.json")\nprint("Gap:", (loaded[1]["when"] - loaded[0]["when"]).days, "days")']},
  power:{can:['Save dates (and other non-JSON types) as text','Convert them back when loading'],
    expand:'Write a custom default function that turns dates into isoformat and sets into sorted lists.',
    where:'APIs and config files all pass dates as text; converting at the boundary prevents bugs.',
    next:'Next: heapq, always grabbing the smallest.'},
  codex:{title:'JSON + dates',body:'json.dumps(obj, default=str) writes dates as ISO text. json.loads gives strings back: use date.fromisoformat.',snip:R`json.dump(data, f, default=str)`}
},
{
  id:'r9-36', realm:9, n:36, title:'heapq: always grab the smallest',
  teaches:['heapq-mod'], requires:['json-dates'],
  story:`A queue of jobs snakes through the Workshop, each with a number: **1** is urgent, **9** can wait. Master Cog doesn't sort the whole queue every time a job arrives. "A **heap** keeps the smallest on top, cheaply."`,
  concept:{
    html:`A **heap** is a list arranged so the smallest item is always first and adding or removing stays fast. \`heapq\` provides it:\n\n\`\`\`\nimport heapq\n\nh = []\nheapq.heappush(h, (3, "sleep"))\nheapq.heappush(h, (1, "eat"))\nheapq.heappush(h, (2, "code"))\n\nheapq.heappop(h)          # (1, 'eat')   smallest first\nh[0]                      # peek at the smallest without removing it\n\nheapq.nsmallest(2, [5, 1, 9, 3])   # [1, 3]\nheapq.nlargest(2, [5, 1, 9, 3])    # [9, 5]\n\`\`\`\n\n- Items are **tuples** \`(priority, task)\`: tuples compare item by item, so the lowest priority number wins, and ties fall back to the task text.\n- Always build with **\`heappush\`** (or \`heapify(list)\`). Using \`list.append\` breaks the heap order.\n- \`heappop\` on an **empty** heap raises \`IndexError\`: check \`if h:\` first.\n- Need the biggest on top? Push **negative** numbers.\n- Use a heap for: job queues, "top N" lists, Dijkstra's shortest path, schedulers.`,
    analogy:`A hospital waiting room where the most urgent patient is always seen next.`,
    example:R`import heapq

h = []
heapq.heappush(h, (3, "sleep"))
heapq.heappush(h, (1, "eat"))
heapq.heappush(h, (2, "code"))
print(heapq.heappop(h))
print(heapq.nsmallest(2, [5, 1, 9, 3]))`},
  predict:{code:R`import heapq
h = []
for n in (5, 1, 3):
    heapq.heappush(h, n)
print(heapq.heappop(h))`, q:'What prints?', opts:['1','5','3'], ans:0, why:'heappop always returns the smallest item.'},
  cast:{code:R`import heapq

h = []
heapq.heappush(h, (3, "sleep"))
heapq.heappush(h, (1, "eat"))
heapq.heappush(h, (2, "code"))
print(heapq.heappop(h))
print(heapq.nsmallest(2, [5, 1, 9, 3]))`, task:'Cast it.'},
  bug:{broken:R`import heapq
prices = [5, 1, 9, 3, 2]
print(heapq.nlargest(3, prices))`, task:'We want the 3 CHEAPEST prices, in order, but nlargest gives the dearest. Expected: [1, 2, 3]',
    cases:[{inputs:[],tests:[['Cheapest','lines==["[1, 2, 3]"]']]}],
    sol:R`import heapq
prices = [5, 1, 9, 3, 2]
print(heapq.nsmallest(3, prices))`, wrong:[R`import heapq
prices = [5, 1, 9, 3, 2]
print(heapq.nlargest(3, prices))`]},
  write:{prompt:'A task queue. Loop asking `> `. `add <priority> <task>` (priority is a whole number, the task may contain spaces) stores the task. `next` prints the task with the **lowest priority number** and removes it (ties: alphabetical), or `Nothing to do` if the queue is empty. `quit` stops. Use `heapq`.',
    starter:R`import heapq

queue = []
`,
    inputs:['add 3 sleep','add 1 eat','next','quit'],
    cases:[{inputs:['add 3 sleep','add 1 eat','add 2 code','next','next','next','next','quit'],tests:[['Priority order','[l for l in lines if not l.startswith("> ")]==["eat","code","sleep","Nothing to do"]']]},{inputs:['add 1 b','add 1 a','next','next','quit'],tests:[['Ties alphabetical','[l for l in lines if not l.startswith("> ")]==["a","b"]']]},{inputs:['add 2 write the report','add 9 nap','next','quit'],tests:[['Task with spaces','[l for l in lines if not l.startswith("> ")]==["write the report"]']]},{inputs:['next','quit'],tests:[['Empty','[l for l in lines if not l.startswith("> ")]==["Nothing to do"]']]},{inputs:['add 5 e','add 4 d','add 3 c','add 2 b','add 1 a','next','next','quit'],tests:[['Reverse arrival','[l for l in lines if not l.startswith("> ")]==["a","b"] and "heappush" in src and "heappop" in src']]}],
    sol:R`import heapq

queue = []
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command.startswith("add "):
        _, priority, task = command.split(maxsplit=2)
        heapq.heappush(queue, (int(priority), task))
    elif command == "next":
        if queue:
            print(heapq.heappop(queue)[1])
        else:
            print("Nothing to do")`,
    wrong:[R`import heapq

queue = []
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command.startswith("add "):
        _, priority, task = command.split(maxsplit=2)
        queue.append((int(priority), task))
    elif command == "next":
        if queue:
            print(heapq.heappop(queue)[1])
        else:
            print("Nothing to do")`, R`import heapq

queue = []
while True:
    command = input("> ")
    if command == "quit":
        break
    elif command.startswith("add "):
        _, priority, task = command.split(maxsplit=2)
        heapq.heappush(queue, (-int(priority), task))
    elif command == "next":
        if queue:
            print(heapq.heappop(queue)[1])
        else:
            print("Nothing to do")`],
    hints:['command.split(maxsplit=2) on "add 2 write report" gives ["add", "2", "write report"].','heapq.heappush(queue, (int(priority), task)) keeps the lowest number first.','On next: if queue, print(heapq.heappop(queue)[1]); else Nothing to do.','import heapq\n\nqueue = []\nwhile True:\n    command = input("> ")\n    if command == "quit":\n        break\n    elif command.startswith("add "):\n        _, priority, task = command.split(maxsplit=2)\n        heapq.heappush(queue, (int(priority), task))\n    elif command == "next":\n        if queue:\n            print(heapq.heappop(queue)[1])\n        else:\n            print("Nothing to do")']},
  power:{can:['Keep a priority queue with heapq','Get the N smallest or largest quickly'],
    expand:'Add a `peek` command that shows the next task without removing it (use queue[0]).',
    where:'Schedulers, game AI and route finding all use heaps.',
    next:'Next: bisect, fast searching in sorted lists.'},
  codex:{title:'heapq',body:'heappush / heappop keep the smallest first. Items are (priority, task) tuples. nsmallest / nlargest for top N. Never append directly.',snip:R`heapq.heappush(queue, (priority, task))`}
},
{
  id:'r9-37', realm:9, n:37, title:'bisect: fast lookups in sorted lists',
  teaches:['bisect-mod'], requires:['heapq-mod'],
  story:`"Report cards," Master Cog sighs, handing you a stack. "Fifty if-elif lines to turn a score into a letter? Please. A **sorted list of boundaries** and one clever call do it all."`,
  concept:{
    html:`\`bisect\` finds **where a value fits** in a **sorted** list:\n\n\`\`\`\nimport bisect\n\nbreaks = [60, 70, 80, 90]\nbisect.bisect_right(breaks, 75)    # 2  (75 sits between 70 and 80)\nbisect.bisect_right(breaks, 90)    # 4  (a tie goes to the RIGHT of equal values)\nbisect.bisect_left(breaks, 90)     # 3  (a tie goes to the LEFT)\n\nscores = [10, 20, 40]\nbisect.insort(scores, 30)           # [10, 20, 30, 40] (insert, staying sorted)\n\`\`\`\n\nThe grade trick: the position **is** the answer.\n\n\`\`\`\nletters = "FDCBA"\nletters[bisect.bisect_right(breaks, score)]\n\`\`\`\n\n- **The list must be sorted first.** On an unsorted list the answer is meaningless (and gives no error).\n- It is *very* fast: about 20 steps to search a million items (binary search).\n- \`bisect_right\` is what you want for "score 90 and above is an A".`,
    analogy:`Finding a word in a dictionary by opening to the middle and halving each time.`,
    example:R`import bisect

breaks = [60, 70, 80, 90]
letters = "FDCBA"
for score in (95, 90, 75, 40):
    print(score, letters[bisect.bisect_right(breaks, score)])`},
  predict:{code:R`import bisect
print(bisect.bisect_left([10, 20, 30], 20))`, q:'What prints?', opts:['1','2','0'], ans:0, why:'bisect_left puts the new 20 BEFORE the existing 20, at index 1.'},
  cast:{code:R`import bisect

breaks = [60, 70, 80, 90]
letters = "FDCBA"
for score in (95, 90, 75, 40):
    print(score, letters[bisect.bisect_right(breaks, score)])`, task:'Cast it.'},
  bug:{broken:R`import bisect
data = [5, 1, 3]
print(bisect.bisect(data, 2))`, task:'bisect needs a SORTED list, so this answer is wrong (it says 2). Sort first. Expected: 1',
    cases:[{inputs:[],tests:[['Right place','lines==["1"]']]}],
    sol:R`import bisect
data = sorted([5, 1, 3])
print(bisect.bisect(data, 2))`, wrong:[R`import bisect
data = [5, 1, 3]
print(bisect.bisect(data, 2))`]},
  write:{prompt:'Grades: below 60 is `F`, 60-69 `D`, 70-79 `C`, 80-89 `B`, 90+ `A`. Write `grade(score)` using `bisect.bisect_right` with a breakpoints list and `"FDCBA"`. Write `insert_score(scores, score)` that inserts into a sorted list in place with `bisect.insort`. Ask `Score: ` (whole number) and print `Grade: <letter>`.',
    starter:R`import bisect

BREAKS = [60, 70, 80, 90]
LETTERS = "FDCBA"

score = int(input("Score: "))
`,
    inputs:['85'],
    cases:[{inputs:['85'],tests:[['B','lines[-1]=="Grade: B"'],['insort in place','(lambda s: (g["insert_score"](s, 6), s)[1])([1,5,9])==[1,5,6,9]'],['insort keeps duplicates','(lambda s: (g["insert_score"](s, 5), s)[1])([1,5,9])==[1,5,5,9]']]},{inputs:['90'],tests:[['Boundary A','lines[-1]=="Grade: A"']]},{inputs:['89'],tests:[['Just under','lines[-1]=="Grade: B"']]},{inputs:['60'],tests:[['Boundary D','lines[-1]=="Grade: D"']]},{inputs:['59'],tests:[['F','lines[-1]=="Grade: F"']]},{inputs:['0'],tests:[['Zero','lines[-1]=="Grade: F"']]},{inputs:['100'],tests:[['Top','lines[-1]=="Grade: A"'],['Uses bisect','"bisect_right(" in src and "insort(" in src']]}],
    sol:R`import bisect

BREAKS = [60, 70, 80, 90]
LETTERS = "FDCBA"

def grade(score):
    return LETTERS[bisect.bisect_right(BREAKS, score)]

def insert_score(scores, score):
    bisect.insort(scores, score)

score = int(input("Score: "))
print("Grade:", grade(score))`,
    wrong:[R`import bisect

BREAKS = [60, 70, 80, 90]
LETTERS = "FDCBA"

def grade(score):
    return LETTERS[bisect.bisect_left(BREAKS, score)]

def insert_score(scores, score):
    bisect.insort(scores, score)

score = int(input("Score: "))
print("Grade:", grade(score))`, R`import bisect

BREAKS = [60, 70, 80, 90]
LETTERS = "FDCBA"

def grade(score):
    return LETTERS[bisect.bisect_right(BREAKS, score)]

def insert_score(scores, score):
    scores.append(score)

score = int(input("Score: "))
print("Grade: " + grade(score))`],
    hints:['bisect.bisect_right(BREAKS, score) gives 0..4.','Use that number as an index into LETTERS.','insert_score: bisect.insort(scores, score).','import bisect\n\nBREAKS = [60, 70, 80, 90]\nLETTERS = "FDCBA"\n\ndef grade(score):\n    return LETTERS[bisect.bisect_right(BREAKS, score)]\n\ndef insert_score(scores, score):\n    bisect.insort(scores, score)\n\nscore = int(input("Score: "))\nprint("Grade:", grade(score))']},
  power:{can:['Turn thresholds into answers with bisect_right','Keep a list sorted as you add to it'],
    expand:'Use the same trick to turn an age into "child", "teen", "adult", "senior".',
    where:'Tax brackets, shipping tiers and grade bands are all breakpoint lookups.',
    next:'Next: exact money maths with Decimal.'},
  codex:{title:'bisect',body:'bisect_right(sorted_list, x) gives the insert position (ties go right). insort inserts in place. The list must be sorted.',snip:R`LETTERS[bisect.bisect_right(BREAKS, score)]`}
},
{
  id:'r9-38', realm:9, n:38, title:'Decimal and Fraction: exact numbers',
  teaches:['decimal-mod'], requires:['bisect-mod'],
  story:`The Workshop's till is off by a cent every day. "Floats," Master Cog growls. "For money, never floats. Use **Decimal**: it counts in tenths and hundredths the way people do."`,
  concept:{
    html:`\`\`\`\nfrom decimal import Decimal, ROUND_HALF_UP\nfrom fractions import Fraction\n\nDecimal("0.1") + Decimal("0.2") == Decimal("0.3")     # True!\nDecimal(0.1)           # ⚠️ built from a FLOAT: 0.1000000000000000055511...\nDecimal("0.1")         # ✅ build from a STRING\n\nCENT = Decimal("0.01")\n(Decimal("2.00") * Decimal("0.0825")).quantize(CENT, rounding=ROUND_HALF_UP)   # Decimal('0.17')\n\nFraction(1, 3) + Fraction(1, 6)     # Fraction(1, 2): exact fractions\n\`\`\`\n\n- **Always create a Decimal from a string** (or an int), never from a float.\n- **\`quantize\`** rounds to a set number of places. The default rule is *half-to-even*, so **pass \`rounding=ROUND_HALF_UP\`** for normal shop rounding: 0.165 → 0.17.\n- You can add Decimals to Decimals and multiply by ints, but mixing with floats is a \`TypeError\`.\n- \`sum(prices, Decimal("0"))\` — give the start value so an empty list still works.\n- **Fraction** keeps exact ratios (\`1/3\`) with no rounding at all.\n- Rule of thumb: money → Decimal (or whole cents as ints); science → float; exact ratios → Fraction.`,
    analogy:`Counting coins instead of weighing sand.`,
    example:R`from decimal import Decimal, ROUND_HALF_UP

print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))
tax = (Decimal("2.00") * Decimal("0.0825")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(tax)`},
  predict:{code:R`from fractions import Fraction
print(Fraction(1, 3) + Fraction(1, 6))`, q:'What prints?', opts:['1/2','0.5','2/9'], ans:0, why:'1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2, and Fraction prints it in lowest terms.'},
  cast:{code:R`from decimal import Decimal, ROUND_HALF_UP

print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))
tax = (Decimal("2.00") * Decimal("0.0825")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
print(tax)`, task:'Cast it. Then try Decimal(0.1) (no quotes) and look at the long number.'},
  bug:{broken:R`from decimal import Decimal
print(Decimal(0.1) + Decimal(0.2) == Decimal(0.3))`, task:'Decimals built from floats inherit the float error, so this prints False. Build them from strings. Expected: True',
    cases:[{inputs:[],tests:[['True','lines==["True"]']]}],
    sol:R`from decimal import Decimal
print(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))`, wrong:[R`from decimal import Decimal
print(Decimal(0.1) + Decimal(0.2) == Decimal(0.3))`]},
  write:{prompt:'Ask `Prices: ` (space-separated, like `3.33 3.33 3.34`). The `prices` list is already made from strings. Print `Subtotal: <sum>`, `Tax: <8.25% of the subtotal, rounded half up to the cent>` and `Total: <subtotal + tax>`, all with exactly 2 decimals. No prices means `0.00` everywhere.',
    starter:R`from decimal import Decimal, ROUND_HALF_UP

CENT = Decimal("0.01")
RATE = Decimal("0.0825")
prices = [Decimal(p) for p in input("Prices: ").split()]
`,
    inputs:['3.33 3.33 3.34'],
    cases:[{inputs:['3.33 3.33 3.34'],tests:[['Round half up','lines[-3:]==["Subtotal: 10.00","Tax: 0.83","Total: 10.83"]']]},{inputs:['2.00'],tests:[['Exact half cent','lines[-3:]==["Subtotal: 2.00","Tax: 0.17","Total: 2.17"]']]},{inputs:['19.99'],tests:[['One item','lines[-3:]==["Subtotal: 19.99","Tax: 1.65","Total: 21.64"]']]},{inputs:['0.10 0.20 0.30'],tests:[['No float error','lines[-3:]==["Subtotal: 0.60","Tax: 0.05","Total: 0.65"]']]},{inputs:[''],tests:[['Empty','lines[-3:]==["Subtotal: 0.00","Tax: 0.00","Total: 0.00"]']]},{inputs:['5'],tests:[['Whole number','lines[-3:]==["Subtotal: 5.00","Tax: 0.41","Total: 5.41"]'],['Uses quantize','"quantize(" in src and "ROUND_HALF_UP" in src']]}],
    sol:R`from decimal import Decimal, ROUND_HALF_UP

CENT = Decimal("0.01")
RATE = Decimal("0.0825")
prices = [Decimal(p) for p in input("Prices: ").split()]

subtotal = sum(prices, Decimal("0")).quantize(CENT)
tax = (subtotal * RATE).quantize(CENT, rounding=ROUND_HALF_UP)
total = subtotal + tax
print("Subtotal:", subtotal)
print("Tax:", tax)
print("Total:", total)`,
    wrong:[R`from decimal import Decimal, ROUND_HALF_UP

CENT = Decimal("0.01")
RATE = Decimal("0.0825")
prices = [Decimal(p) for p in input("Prices: ").split()]

subtotal = sum(prices, Decimal("0")).quantize(CENT)
tax = (subtotal * RATE).quantize(CENT)
total = subtotal + tax
print("Subtotal:", subtotal)
print("Tax:", tax)
print("Total:", total)`, R`from decimal import Decimal, ROUND_DOWN

CENT = Decimal("0.01")
RATE = Decimal("0.0825")
prices = [Decimal(p) for p in input("Prices: ").split()]

subtotal = sum(prices, Decimal("0")).quantize(CENT)
tax = (subtotal * RATE).quantize(CENT, rounding=ROUND_DOWN)
total = subtotal + tax
print("Subtotal:", subtotal)
print("Tax:", tax)
print("Total:", total)`],
    hints:['subtotal = sum(prices, Decimal("0")) (the start value makes empty input work), then .quantize(CENT).','tax = (subtotal * RATE).quantize(CENT, rounding=ROUND_HALF_UP).','Print subtotal, tax and total: Decimals already print with 2 decimals once quantized.','from decimal import Decimal, ROUND_HALF_UP\n\nCENT = Decimal("0.01")\nRATE = Decimal("0.0825")\nprices = [Decimal(p) for p in input("Prices: ").split()]\n\nsubtotal = sum(prices, Decimal("0")).quantize(CENT)\ntax = (subtotal * RATE).quantize(CENT, rounding=ROUND_HALF_UP)\ntotal = subtotal + tax\nprint("Subtotal:", subtotal)\nprint("Tax:", tax)\nprint("Total:", total)']},
  power:{can:['Do exact money arithmetic with Decimal','Round half up to cents deliberately'],
    expand:'Add a 10% tip line, rounded the same way.',
    where:'Invoices, shops, payroll and banking code must never use float for money.',
    next:'Next: shlex, splitting command lines properly.'},
  codex:{title:'Decimal',body:'Decimal("0.1") from strings. quantize(CENT, rounding=ROUND_HALF_UP). Fraction(1,3) is exact. Money: Decimal or int cents.',snip:R`tax = (sub * RATE).quantize(CENT, rounding=ROUND_HALF_UP)`}
},
{
  id:'r9-39', realm:9, n:39, title:'shlex.split: splitting like a shell',
  teaches:['shlex-mod'], requires:['decimal-mod'],
  story:`A customer types: add "red apple" 3. "Split on spaces and you get *red* and *apple* separately," Master Cog groans. "A shell keeps quoted pieces together. So does **shlex**."`,
  concept:{
    html:`\`str.split()\` cuts at every space, even inside quotes. \`shlex.split\` follows the rules of a command line:\n\n\`\`\`\nimport shlex\n\n'add "red apple" 3'.split()        # ['add', '"red', 'apple"', '3']   ✗\nshlex.split('add "red apple" 3')  # ['add', 'red apple', '3']      ✓\nshlex.split("say 'it is' ok")     # ['say', 'it is', 'ok']\n\`\`\`\n\n- Quotes (single or double) group words; the quotes themselves are removed.\n- A backslash escapes the next character.\n- **Unbalanced quotes** raise \`ValueError: No closing quotation\`. Catch it when the text comes from a user.\n- An empty string gives \`[]\`.\n- The reverse: \`shlex.quote(text)\` makes text safe to paste into a shell command.\n- Use it for mini command languages (like chat bots and game consoles) and for reading simple config lines.`,
    analogy:`A reader who understands that "red apple" in quotes is one thing, not two.`,
    example:R`import shlex

print('add "red apple" 3'.split())
print(shlex.split('add "red apple" 3'))`},
  predict:{code:R`import shlex
print(shlex.split('a "b c" d'))`, q:'What prints?', opts:["['a', 'b c', 'd']","['a', '\"b', 'c\"', 'd']","['a', '\"b c\"', 'd']"], ans:0, why:'Quoted words stay together and the quote marks are dropped.'},
  cast:{code:R`import shlex

print('add "red apple" 3'.split())
print(shlex.split('add "red apple" 3'))`, task:'Cast it.'},
  bug:{broken:R`line = 'copy "my file.txt" backup'
print(line.split())`, task:'It breaks "my file.txt" into two pieces. Split like a shell. Expected: [\'copy\', \'my file.txt\', \'backup\']',
    cases:[{inputs:[],tests:[['Together','lines==["[\'copy\', \'my file.txt\', \'backup\']"]']]}],
    sol:R`import shlex
line = 'copy "my file.txt" backup'
print(shlex.split(line))`, wrong:[R`line = 'copy "my file.txt" backup'
print(line.split())`]},
  write:{prompt:'Ask `Command: `. Split it with `shlex.split`. If it is empty print `Empty command`. If the quotes are unbalanced print `Parse error`. Otherwise print `Command: <first word>` and then `Arg 1: ...`, `Arg 2: ...` for the rest (if any).',
    starter:R`import shlex

line = input("Command: ")
`,
    inputs:['add "red apple" 3'],
    cases:[{inputs:['add "red apple" 3'],tests:[['Quoted arg','lines[-3:]==["Command: add","Arg 1: red apple","Arg 2: 3"]']]},{inputs:['quit'],tests:[['No args','lines[-1]=="Command: quit"']]},{inputs:["say 'it is' ok"],tests:[['Single quotes','lines[-3:]==["Command: say","Arg 1: it is","Arg 2: ok"]']]},{inputs:[''],tests:[['Empty','lines[-1]=="Empty command"']]},{inputs:['   '],tests:[['Spaces only','lines[-1]=="Empty command"']]},{inputs:['add "oops'],tests:[['Unbalanced','lines[-1]=="Parse error"'],['Uses shlex','"shlex.split(" in src']]}],
    sol:R`import shlex

line = input("Command: ")
try:
    parts = shlex.split(line)
except ValueError:
    print("Parse error")
else:
    if not parts:
        print("Empty command")
    else:
        print("Command:", parts[0])
        for number, arg in enumerate(parts[1:], 1):
            print(f"Arg {number}: {arg}")`,
    wrong:[R`line = input("Command: ")
parts = line.split()
if not parts:
    print("Empty command")
else:
    print("Command:", parts[0])
    for number, arg in enumerate(parts[1:], 1):
        print(f"Arg {number}: {arg}")`, R`import shlex

line = input("Command: ")
parts = shlex.split(line)
if not parts:
    print("Empty command")
else:
    print("Command:", parts[0])
    for number, arg in enumerate(parts[1:], 1):
        print(f"Arg {number}: {arg}")`],
    hints:['parts = shlex.split(line) inside try / except ValueError.','Empty list means Empty command.','parts[0] is the command; enumerate(parts[1:], 1) numbers the arguments.','import shlex\n\nline = input("Command: ")\ntry:\n    parts = shlex.split(line)\nexcept ValueError:\n    print("Parse error")\nelse:\n    if not parts:\n        print("Empty command")\n    else:\n        print("Command:", parts[0])\n        for number, arg in enumerate(parts[1:], 1):\n            print(f"Arg {number}: {arg}")']},
  power:{can:['Split command lines with quotes correctly','Catch unbalanced-quote errors'],
    expand:'Make `add "red apple" 3` actually add 3 to a stock dict.',
    where:'Chat bots, game consoles and admin tools parse commands like this.',
    next:'Next: three real-world missions using many modules at once.'},
  codex:{title:'shlex',body:'shlex.split(text) keeps quoted pieces together and removes the quotes. Unbalanced quotes raise ValueError.',snip:R`shlex.split('add "red apple" 3')`}
},
{
  id:'r9-40', realm:9, n:40, title:'Real-World Mission: The Deadline Tracker',
  teaches:['mission9b'], requires:['shlex-mod','csv-dictreader','timedelta'],
  story:`The Workshop's foreman waves a crumpled spreadsheet. "Jobs slip, and I only notice when a customer shouts. Read **tasks.csv** and tell me what's late and what's due this week. And let me say what day it is, so I can test it on any date."`,
  concept:{
    html:`This mission combines **\`csv\`** (read the file), **\`datetime\`** (dates and gaps), **sorting** and **string formatting**.\n\nA design tip that makes date code testable: **don't call \`date.today()\` inside your logic**. Take "today" as an **input** so any day can be tested, and pass the real date in production.\n\nPlan:\n\n1. Read the rows with \`csv.DictReader\`.\n2. Count the done tasks.\n3. For each not-done task: \`days = (due - today).days\`.\n4. \`days < 0\` is **overdue** (\`-days\` days late); \`0..7\` is **due soon**.\n5. Sort by due date, then by task name, using tuples \`(date, name)\`.\n\nA tidy way to print a list or a placeholder:\n\n\`\`\`\nprint("\\n".join(lines) if lines else "- (none)")\n\`\`\``,
    analogy:`A foreman's whiteboard that sorts itself every morning.`,
    example:R`from datetime import date

today = date(2026, 10, 23)
due = date(2026, 10, 20)
print((due - today).days)`},
  predict:{code:R`from datetime import date, timedelta
print(date(2026, 10, 23) + timedelta(days=7))`, q:'What prints?', opts:['2026-10-30','2026-10-29','2026-11-07'], ans:0, why:'Adding seven days to October 23 gives October 30.'},
  cast:{code:R`import csv

with open("tasks.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["task"], row["due"], row["done"])`, task:'Cast it to see the data you will use.', files:{'tasks.csv':'task,due,done\nShip wares,2026-10-20,no\nFix gears,2026-10-25,no\nOrder oil,2026-10-23,no\nPaint sign,2026-11-30,no\nSweep floor,2026-10-01,yes\n'}},
  bug:{broken:R`due = "2026-10-20"
today = "2026-10-23"
print((today - due).days)`, task:'TypeError: these are strings, not dates. Convert them with date.fromisoformat. Expected: 3',
    cases:[{inputs:[],tests:[['Three','lines==["3"]']]}],
    sol:R`from datetime import date
due = date.fromisoformat("2026-10-20")
today = date.fromisoformat("2026-10-23")
print((today - due).days)`, wrong:[R`due = "2026-10-20"
today = "2026-10-23"
print((today - due).days)`]},
  write:{prompt:'Read `tasks.csv` (`task,due,done`; `done` is `yes` or `no`). Ask `Today (YYYY-MM-DD): `. For tasks **not done**, sorted by due date (then name), print the section `Overdue:` with lines `- <task> (<n> days late)` and the section `Due soon:` (due today up to 7 days ahead) with lines `- <task> (due today)` or `- <task> (due in <n> days)`. An empty section prints `- (none)`. Finish with `Done: <k> of <total>`.',
    starter:R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
`,
    inputs:['2026-10-23'],
    files:{'tasks.csv':'task,due,done\nShip wares,2026-10-20,no\nFix gears,2026-10-25,no\nOrder oil,2026-10-23,no\nPaint sign,2026-11-30,no\nSweep floor,2026-10-01,yes\n'},
    cases:[{inputs:['2026-10-23'],tests:[['Mid month','lines[-6:]==["Overdue:","- Ship wares (3 days late)","Due soon:","- Order oil (due today)","- Fix gears (due in 2 days)","Done: 1 of 5"]']]},{inputs:['2026-11-30'],tests:[['Late month','lines[-7:]==["Overdue:","- Ship wares (41 days late)","- Order oil (38 days late)","- Fix gears (36 days late)","Due soon:","- Paint sign (due today)","Done: 1 of 5"]']]},{inputs:['2026-10-15'],tests:[['Early','lines[-5:]==["Overdue:","- (none)","Due soon:","- Ship wares (due in 5 days)","Done: 1 of 5"]']]},{inputs:['2026-10-16'],tests:[['Seven day boundary','lines[-6:]==["Overdue:","- (none)","Due soon:","- Ship wares (due in 4 days)","- Order oil (due in 7 days)","Done: 1 of 5"]']]},{inputs:['2026-10-23'],files:{'tasks.csv':'task,due,done\n'},tests:[['Empty file','lines[-5:]==["Overdue:","- (none)","Due soon:","- (none)","Done: 0 of 0"]']]},{inputs:['2026-10-23'],files:{'tasks.csv':'task,due,done\nA,2026-10-22,no\nB,2026-10-22,no\nC,2026-10-22,yes\n'},tests:[['Ties by name, done ignored','lines[-6:]==["Overdue:","- A (1 days late)","- B (1 days late)","Due soon:","- (none)","Done: 1 of 3"]'],['Uses csv and dates','"DictReader" in src and "fromisoformat" in src']]}],
    sol:R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
with open("tasks.csv", newline="") as f:
    rows = list(csv.DictReader(f))

done = sum(1 for row in rows if row["done"] == "yes")
open_rows = sorted((date.fromisoformat(row["due"]), row["task"]) for row in rows if row["done"] != "yes")

overdue = []
soon = []
for due, task in open_rows:
    days = (due - today).days
    if days < 0:
        overdue.append(f"- {task} ({-days} days late)")
    elif days <= 7:
        label = "due today" if days == 0 else f"due in {days} days"
        soon.append(f"- {task} ({label})")

print("Overdue:")
print("\n".join(overdue) if overdue else "- (none)")
print("Due soon:")
print("\n".join(soon) if soon else "- (none)")
print(f"Done: {done} of {len(rows)}")`,
    wrong:[R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
with open("tasks.csv", newline="") as f:
    rows = list(csv.DictReader(f))

done = sum(1 for row in rows if row["done"] == "yes")
open_rows = sorted((date.fromisoformat(row["due"]), row["task"]) for row in rows)

overdue = []
soon = []
for due, task in open_rows:
    days = (due - today).days
    if days < 0:
        overdue.append(f"- {task} ({-days} days late)")
    elif days <= 7:
        label = "due today" if days == 0 else f"due in {days} days"
        soon.append(f"- {task} ({label})")

print("Overdue:")
print("\n".join(overdue) if overdue else "- (none)")
print("Due soon:")
print("\n".join(soon) if soon else "- (none)")
print(f"Done: {done} of {len(rows)}")`, R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
with open("tasks.csv", newline="") as f:
    rows = list(csv.DictReader(f))

done = sum(1 for row in rows if row["done"] == "yes")
open_rows = sorted((date.fromisoformat(row["due"]), row["task"]) for row in rows if row["done"] != "yes")

overdue = []
soon = []
for due, task in open_rows:
    days = (due - today).days
    if days < 0:
        overdue.append(f"- {task} ({-days} days late)")
    elif days < 7:
        label = "due today" if days == 0 else f"due in {days} days"
        soon.append(f"- {task} ({label})")

print("Overdue:")
print("\n".join(overdue) if overdue else "- (none)")
print("Due soon:")
print("\n".join(soon) if soon else "- (none)")
print(f"Done: {done} of {len(rows)}")`, R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
with open("tasks.csv", newline="") as f:
    rows = list(csv.DictReader(f))

done = sum(1 for row in rows if row["done"] == "yes")
open_rows = sorted((row["task"], date.fromisoformat(row["due"])) for row in rows if row["done"] != "yes")

overdue = []
soon = []
for task, due in open_rows:
    days = (due - today).days
    if days < 0:
        overdue.append(f"- {task} ({-days} days late)")
    elif days <= 7:
        label = "due today" if days == 0 else f"due in {days} days"
        soon.append(f"- {task} ({label})")

print("Overdue:")
print("\n".join(overdue) if overdue else "- (none)")
print("Due soon:")
print("\n".join(soon) if soon else "- (none)")
print(f"Done: {done} of {len(rows)}")`],
    hints:['Read rows with csv.DictReader, then count done with row["done"] == "yes".','Build sorted((date.fromisoformat(row["due"]), row["task"]) ...) for the not-done rows, then days = (due - today).days.','Negative days = overdue (-days late); 0 to 7 = due soon. Print "- (none)" for empty sections.','import csv\nfrom datetime import date\n\ntoday = date.fromisoformat(input("Today (YYYY-MM-DD): "))\nwith open("tasks.csv", newline="") as f:\n    rows = list(csv.DictReader(f))\n\ndone = sum(1 for row in rows if row["done"] == "yes")\nopen_rows = sorted((date.fromisoformat(row["due"]), row["task"]) for row in rows if row["done"] != "yes")\n\noverdue = []\nsoon = []\nfor due, task in open_rows:\n    days = (due - today).days\n    if days < 0:\n        overdue.append(f"- {task} ({-days} days late)")\n    elif days <= 7:\n        label = "due today" if days == 0 else f"due in {days} days"\n        soon.append(f"- {task} ({label})")\n\nprint("Overdue:")\nprint("\\n".join(overdue) if overdue else "- (none)")\nprint("Due soon:")\nprint("\\n".join(soon) if soon else "- (none)")\nprint(f"Done: {done} of {len(rows)}")']},
  power:{can:['Combine csv and datetime into a working report','Make date code testable by passing "today" in'],
    expand:'Add an `Upcoming:` section for tasks due after the 7-day window, and write the report to report.txt.',
    where:'Deadline trackers, subscription renewals and maintenance schedules all work this way.',
    next:'Next: analysing a server log.'},
  codex:{title:'Mission: Deadline Tracker',body:'csv.DictReader + date.fromisoformat + (due - today).days. Sort (date, name) tuples. Pass today in so it can be tested.',snip:R`days = (due - today).days`}
},
{
  id:'r9-41', realm:9, n:41, title:'Real-World Mission: The Log Analyzer',
  teaches:['mission9c'], requires:['mission9b','collections-counter'],
  story:`At 3 a.m. the Workshop's gate-engine screams. "It wrote a thousand lines into **server.log** before it died," the night guard says. "What happened? **Who** hit errors? **When** was it busiest?"`,
  concept:{
    html:`Logs are everywhere, and they're usually *almost* regular text. This mission combines **\`re\`** (pull fields out of each line), **\`collections.Counter\`** (counting), **sets** (unique users), **\`json\`** (write the summary) and **error tolerance** (skip junk).\n\nA line looks like:\n\n\`\`\`\n2026-10-23 09:40:00 ERROR user=cy action=upload code=503\n\`\`\`\n\nA compiled pattern with groups does the parsing:\n\n\`\`\`\nPATTERN = re.compile(r"(\\d{4}-\\d{2}-\\d{2}) (\\d{2}):\\d{2}:\\d{2} (\\w+) user=(\\w+)")\nmatch = PATTERN.match(line)\nif match:\n    date_text, hour, level, user = match.groups()\n\`\`\`\n\nRules for this mission:\n\n- **Blank lines** are ignored. Lines that **don't match** are *skipped* (and counted).\n- The **busiest hour** is the hour with the most lines; a tie goes to the **earliest** hour. Use \`min(hours, key=lambda h: (-hours[h], h))\`.\n- Remember \`most_common\` keeps ties in first-seen order, which is not what we want.`,
    analogy:`A detective turning a mountain of scribbled notes into five clear facts.`,
    example:R`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")
m = PATTERN.match("2026-10-23 09:40:00 ERROR user=cy action=upload code=503")
print(m.groups())`},
  predict:{code:R`from collections import Counter
print(Counter(["INFO", "ERROR", "INFO"])["ERROR"])`, q:'What prints?', opts:['1','2','0'], ans:0, why:'ERROR appears once.'},
  cast:{code:R`import re

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")
with open("server.log") as f:
    for line in f:
        m = PATTERN.match(line.strip())
        print(m.groups() if m else "skip")`, task:'Cast it to see the parsing.', files:{'server.log':'2026-10-23 08:15:02 INFO user=ada action=login\n2026-10-23 08:17:45 ERROR user=bo action=upload code=500\nthis line is garbage\n'}},
  bug:{broken:R`lines = ["INFO a", "ERROR b", "INFO c"]
levels = {}
for line in lines:
    level = line.split()[0]
    levels[level] += 1
print(levels)`, task:'KeyError: the first INFO has no count yet. Use a Counter and print it as a normal dict. Expected: {\'INFO\': 2, \'ERROR\': 1}',
    cases:[{inputs:[],tests:[['Counted','lines==["{\'INFO\': 2, \'ERROR\': 1}"]']]}],
    sol:R`from collections import Counter
lines = ["INFO a", "ERROR b", "INFO c"]
levels = Counter()
for line in lines:
    level = line.split()[0]
    levels[level] += 1
print(dict(levels))`, wrong:[R`lines = ["INFO a", "ERROR b", "INFO c"]
levels = {}
for line in lines:
    level = line.split()[0]
    levels[level] += 1
print(levels)`]},
  write:{prompt:'Read `server.log`. Parse each line with the pattern from the lesson (ignore blank lines; lines that do not match count as skipped). Print `Lines: <parsed>`, `Skipped: <n>`, `Errors: <ERROR lines>` and `Busiest hour: <HH or none>` (tie: earliest). Also write `summary.json` with `total`, `skipped`, `levels` (level → count), `busiest_hour` (text or `null`) and `error_users` (sorted, unique).',
    starter:R`import json
import re
from collections import Counter

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")
`,
    files:{'server.log':'2026-10-23 08:15:02 INFO user=ada action=login\n2026-10-23 08:17:45 ERROR user=bo action=upload code=500\n2026-10-23 09:01:10 INFO user=cy action=login\n2026-10-23 09:05:33 WARNING user=ada action=slow-query\n2026-10-23 09:40:00 ERROR user=cy action=upload code=503\nthis line is garbage\n2026-10-23 09:59:59 ERROR user=bo action=download code=500\n2026-10-23 10:30:00 INFO user=ada action=logout\n'},
    cases:[{inputs:[],files:{'server.log':'2026-10-23 08:15:02 INFO user=ada action=login\n2026-10-23 08:17:45 ERROR user=bo action=upload code=500\n2026-10-23 09:01:10 INFO user=cy action=login\n2026-10-23 09:05:33 WARNING user=ada action=slow-query\n2026-10-23 09:40:00 ERROR user=cy action=upload code=503\nthis line is garbage\n2026-10-23 09:59:59 ERROR user=bo action=download code=500\n2026-10-23 10:30:00 INFO user=ada action=logout\n'},tests:[['Printed','lines==["Lines: 7","Skipped: 1","Errors: 3","Busiest hour: 09"]'],['Summary file','json.loads(read("summary.json"))=={"total":7,"skipped":1,"levels":{"INFO":3,"ERROR":3,"WARNING":1},"busiest_hour":"09","error_users":["bo","cy"]}']]},{inputs:[],files:{'server.log':'2026-01-01 11:00:00 ERROR user=b action=y code=1\n\n2026-01-01 10:00:00 INFO user=a action=x\n'},tests:[['Tie goes to the earliest hour, blanks ignored','lines==["Lines: 2","Skipped: 0","Errors: 1","Busiest hour: 10"]'],['Summary','json.loads(read("summary.json"))=={"total":2,"skipped":0,"levels":{"ERROR":1,"INFO":1},"busiest_hour":"10","error_users":["b"]}']]},{inputs:[],files:{'server.log':'nothing useful here\n'},tests:[['Nothing parsed','lines==["Lines: 0","Skipped: 1","Errors: 0","Busiest hour: none"]'],['Summary','json.loads(read("summary.json"))=={"total":0,"skipped":1,"levels":{},"busiest_hour":None,"error_users":[]}']]},{inputs:[],files:{'server.log':''},tests:[['Empty file','lines==["Lines: 0","Skipped: 0","Errors: 0","Busiest hour: none"]'],['Uses Counter and json','"Counter" in src and "json.dump" in src']]}],
    sol:R`import json
import re
from collections import Counter

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")

levels = Counter()
hours = Counter()
error_users = set()
skipped = 0

with open("server.log") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        match = PATTERN.match(line)
        if not match:
            skipped += 1
            continue
        _, hour, level, user = match.groups()
        levels[level] += 1
        hours[hour] += 1
        if level == "ERROR":
            error_users.add(user)

total = sum(levels.values())
busiest = min(hours, key=lambda h: (-hours[h], h)) if hours else None
summary = {
    "total": total,
    "skipped": skipped,
    "levels": dict(levels),
    "busiest_hour": busiest,
    "error_users": sorted(error_users),
}
with open("summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print("Lines:", total)
print("Skipped:", skipped)
print("Errors:", levels["ERROR"])
print("Busiest hour:", busiest if busiest else "none")`,
    wrong:[R`import json
import re
from collections import Counter

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")

levels = Counter()
hours = Counter()
error_users = set()
skipped = 0

with open("server.log") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        match = PATTERN.match(line)
        if not match:
            skipped += 1
            continue
        _, hour, level, user = match.groups()
        levels[level] += 1
        hours[hour] += 1
        if level == "ERROR":
            error_users.add(user)

total = sum(levels.values())
busiest = hours.most_common(1)[0][0] if hours else None
summary = {
    "total": total,
    "skipped": skipped,
    "levels": dict(levels),
    "busiest_hour": busiest,
    "error_users": sorted(error_users),
}
with open("summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print("Lines:", total)
print("Skipped:", skipped)
print("Errors:", levels["ERROR"])
print("Busiest hour:", busiest if busiest else "none")`, R`import json
import re
from collections import Counter

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")

levels = Counter()
hours = Counter()
error_users = []
skipped = 0

with open("server.log") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        match = PATTERN.match(line)
        if not match:
            skipped += 1
            continue
        _, hour, level, user = match.groups()
        levels[level] += 1
        hours[hour] += 1
        if level == "ERROR":
            error_users.append(user)

total = sum(levels.values())
busiest = min(hours, key=lambda h: (-hours[h], h)) if hours else None
summary = {
    "total": total,
    "skipped": skipped,
    "levels": dict(levels),
    "busiest_hour": busiest,
    "error_users": error_users,
}
with open("summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print("Lines:", total)
print("Skipped:", skipped)
print("Errors:", levels["ERROR"])
print("Busiest hour:", busiest if busiest else "none")`, R`import json
import re
from collections import Counter

PATTERN = re.compile(r"(\d{4}-\d{2}-\d{2}) (\d{2}):\d{2}:\d{2} (\w+) user=(\w+)")

levels = Counter()
hours = Counter()
error_users = set()
skipped = 0
count = 0

with open("server.log") as f:
    for line in f:
        line = line.strip()
        count += 1
        match = PATTERN.match(line)
        if not match:
            skipped += 1
            continue
        _, hour, level, user = match.groups()
        levels[level] += 1
        hours[hour] += 1
        if level == "ERROR":
            error_users.add(user)

total = count
busiest = min(hours, key=lambda h: (-hours[h], h)) if hours else None
summary = {
    "total": total,
    "skipped": skipped,
    "levels": dict(levels),
    "busiest_hour": busiest,
    "error_users": sorted(error_users),
}
with open("summary.json", "w") as f:
    json.dump(summary, f, indent=2)

print("Lines:", total)
print("Skipped:", skipped)
print("Errors:", levels["ERROR"])
print("Busiest hour:", busiest if busiest else "none")`],
    hints:['Loop over the file, strip each line, skip blanks, then PATTERN.match(line). No match means skipped += 1.','match.groups() gives (date, hour, level, user). Count levels and hours with Counter and collect error users in a set.','busiest = min(hours, key=lambda h: (-hours[h], h)) if hours else None. Write the dict with json.dump.','import json\nimport re\nfrom collections import Counter\n\nPATTERN = re.compile(r"(\\d{4}-\\d{2}-\\d{2}) (\\d{2}):\\d{2}:\\d{2} (\\w+) user=(\\w+)")\n\nlevels = Counter()\nhours = Counter()\nerror_users = set()\nskipped = 0\n\nwith open("server.log") as f:\n    for line in f:\n        line = line.strip()\n        if not line:\n            continue\n        match = PATTERN.match(line)\n        if not match:\n            skipped += 1\n            continue\n        _, hour, level, user = match.groups()\n        levels[level] += 1\n        hours[hour] += 1\n        if level == "ERROR":\n            error_users.add(user)\n\ntotal = sum(levels.values())\nbusiest = min(hours, key=lambda h: (-hours[h], h)) if hours else None\nsummary = {\n    "total": total,\n    "skipped": skipped,\n    "levels": dict(levels),\n    "busiest_hour": busiest,\n    "error_users": sorted(error_users),\n}\nwith open("summary.json", "w") as f:\n    json.dump(summary, f, indent=2)\n\nprint("Lines:", total)\nprint("Skipped:", skipped)\nprint("Errors:", levels["ERROR"])\nprint("Busiest hour:", busiest if busiest else "none")']},
  power:{can:['Turn messy log text into clean statistics','Combine re, Counter, sets and json in one tool'],
    expand:'Add a `Top user:` line using another Counter.',
    where:'Every ops team builds log summarisers like this one.',
    next:'Next: the capstone, an expense tracker using almost everything in this Realm.'},
  codex:{title:'Mission: Log Analyzer',body:'compile a regex with groups; skip junk lines; Counter for counts; set for unique; min with (-count, key) for fair ties; json.dump the summary.',snip:R`busiest = min(hours, key=lambda h: (-hours[h], h))`}
},
{
  id:'r9-42', realm:9, n:42, title:'Capstone Mission: The Expense Tracker',
  teaches:['mission9d'], requires:['mission9c','decimal-mod','json-dates'],
  story:`The Workshop's treasurer stares at a year of receipts. "I need a **monthly report**: where did the money go, what was the total, and which single day hurt most? And it must be *exact*, to the cent, and saved so the auditors can read it."`,
  concept:{
    html:`This capstone brings together the whole Realm: **\`csv\`** (read), **\`datetime\`** (validate the month), **\`decimal\`** (exact money), **\`collections.defaultdict\`** (totals by category and by day), **\`json\`** with \`default=str\` (save) and careful **error handling**.\n\nPlan:\n\n1. Ask for a month like \`2026-10\`. Validate it with \`datetime.strptime(month, "%Y-%m")\`, **and** make sure it round-trips (\`"2026-1"\` is accepted by strptime but is not the format we want).\n2. Read \`expenses.csv\` (\`date,category,amount,note\`). Keep rows whose date starts with the month. **Skip rows whose amount isn't a number** (\`decimal.InvalidOperation\`).\n3. Add amounts with \`defaultdict(Decimal)\` per category and per day.\n4. Rank categories by total (largest first, then name). Biggest day: largest total, earliest on a tie.\n5. Show money with 2 decimals (\`quantize\`), and save \`summary.json\` using \`default=str\` so the Decimals become text.\n\nIf the month has **no** expenses, print a message and **do not** write the summary.`,
    analogy:`A treasurer's ledger that adds itself up and never misplaces a cent.`,
    example:R`from collections import defaultdict
from decimal import Decimal

totals = defaultdict(Decimal)
totals["food"] += Decimal("12.50")
totals["food"] += Decimal("8.00")
print(totals["food"])`},
  predict:{code:R`from datetime import datetime
parsed = datetime.strptime("2026-1", "%Y-%m")
print(parsed.strftime("%Y-%m"))`, q:'What prints?', opts:['2026-01','2026-1','ValueError'], ans:0, why:'strptime accepts the short month, but strftime writes it back with a leading zero. Comparing the two catches sloppy input.'},
  cast:{code:R`import csv

with open("expenses.csv", newline="") as f:
    for row in csv.DictReader(f):
        print(row["date"], row["category"], row["amount"])`, task:'Cast it to see the data.', files:{'expenses.csv':'date,category,amount,note\n2026-10-01,food,12.50,lunch\n2026-10-02,transport,3.20,bus\n2026-10-02,food,8.00,snack\n2026-10-05,fun,25.00,cinema\n2026-11-01,food,40.00,market\n2026-11-03,rent,500.00,\n'}},
  bug:{broken:R`from collections import defaultdict
from decimal import Decimal
totals = defaultdict(float)
for amount in ["0.10", "0.20", "0.30"]:
    totals["x"] += Decimal(amount)
print(totals["x"])`, task:'TypeError: you cannot add a Decimal to a float. Make the defaultdict hold Decimals. Expected: 0.60',
    cases:[{inputs:[],tests:[['Exact','lines==["0.60"]']]}],
    sol:R`from collections import defaultdict
from decimal import Decimal
totals = defaultdict(Decimal)
for amount in ["0.10", "0.20", "0.30"]:
    totals["x"] += Decimal(amount)
print(totals["x"])`, wrong:[R`from collections import defaultdict
from decimal import Decimal
totals = defaultdict(float)
for amount in ["0.10", "0.20", "0.30"]:
    totals["x"] += Decimal(amount)
print(totals["x"])`]},
  write:{prompt:'Build the monthly report from `expenses.csv`. Ask `Month (YYYY-MM): `. An invalid month (including `2026-1`) prints `Invalid month`. A month with no expenses prints `No expenses for <month>` and writes **no** summary. Otherwise print one line per category `<category>: <total>` (largest first, ties by name), then `Total: <sum>` and `Biggest day: <date> (<sum>)` (tie: earliest date). All money has 2 decimals. Rows with an unreadable amount are skipped. Save `summary.json` with `month`, `total` (text), `by_category` (category → text amount, in ranking order) and `biggest_day`.',
    starter:R`import csv
import json
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, InvalidOperation

CENT = Decimal("0.01")

month = input("Month (YYYY-MM): ")
`,
    inputs:['2026-10'],
    files:{'expenses.csv':'date,category,amount,note\n2026-10-01,food,12.50,lunch\n2026-10-02,transport,3.20,bus\n2026-10-02,food,8.00,snack\n2026-10-05,fun,25.00,cinema\n2026-11-01,food,40.00,market\n2026-11-03,rent,500.00,\n'},
    cases:[{inputs:['2026-10'],tests:[['October','lines[-5:]==["fun: 25.00","food: 20.50","transport: 3.20","Total: 48.70","Biggest day: 2026-10-05 (25.00)"]'],['Summary','json.loads(read("summary.json"))=={"month":"2026-10","total":"48.70","by_category":{"fun":"25.00","food":"20.50","transport":"3.20"},"biggest_day":"2026-10-05"}']]},{inputs:['2026-11'],tests:[['November','lines[-4:]==["rent: 500.00","food: 40.00","Total: 540.00","Biggest day: 2026-11-03 (500.00)"]']]},{inputs:['2026-12'],tests:[['Empty month','lines[-1]=="No expenses for 2026-12"'],['No summary written','not exists("summary.json")']]},{inputs:['2026-13'],tests:[['Bad month','lines[-1]=="Invalid month"'],['No summary','not exists("summary.json")']]},{inputs:['2026-1'],tests:[['Sloppy month','lines[-1]=="Invalid month"']]},{inputs:['abc'],tests:[['Not a month','lines[-1]=="Invalid month"']]},{inputs:['2026-10'],files:{'expenses.csv':'date,category,amount,note\n2026-10-01,food,12.5,lunch\n2026-10-04,food,abc,oops\n2026-10-04,fun,,nothing\n2026-10-05,fun,25,cinema\n'},tests:[['Bad rows skipped and money normalised','lines[-4:]==["fun: 25.00","food: 12.50","Total: 37.50","Biggest day: 2026-10-05 (25.00)"]'],['Summary strings','json.loads(read("summary.json"))["total"]=="37.50" and json.loads(read("summary.json"))["by_category"]=={"fun":"25.00","food":"12.50"}']]},{inputs:['2026-10'],files:{'expenses.csv':'date,category,amount,note\n2026-10-03,b,5.00,\n2026-10-02,a,5.00,\n2026-10-02,c,1.00,\n'},tests:[['Ties by name and by earliest day','lines[-5:]==["a: 5.00","b: 5.00","c: 1.00","Total: 11.00","Biggest day: 2026-10-02 (6.00)"]'],['Biggest day earliest on tie','lines[-1]=="Biggest day: 2026-10-02 (6.00)"'],['Uses decimal and json','"Decimal" in src and "default=str" in src']]}],
    sol:R`import csv
import json
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, InvalidOperation

CENT = Decimal("0.01")

def money(value):
    return value.quantize(CENT)

month = input("Month (YYYY-MM): ")
try:
    parsed = datetime.strptime(month, "%Y-%m")
    if parsed.strftime("%Y-%m") != month:
        raise ValueError("sloppy month")
except ValueError:
    print("Invalid month")
else:
    by_category = defaultdict(Decimal)
    by_day = defaultdict(Decimal)
    with open("expenses.csv", newline="") as f:
        for row in csv.DictReader(f):
            if not row["date"].startswith(month):
                continue
            try:
                amount = Decimal(row["amount"])
            except InvalidOperation:
                continue
            by_category[row["category"]] += amount
            by_day[row["date"]] += amount

    if not by_category:
        print("No expenses for", month)
    else:
        total = sum(by_category.values(), Decimal("0"))
        ranked = sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0]))
        for category, amount in ranked:
            print(f"{category}: {money(amount)}")
        print("Total:", money(total))
        day = min(by_day, key=lambda d: (-by_day[d], d))
        print(f"Biggest day: {day} ({money(by_day[day])})")
        summary = {
            "month": month,
            "total": money(total),
            "by_category": {c: money(a) for c, a in ranked},
            "biggest_day": day,
        }
        with open("summary.json", "w") as f:
            json.dump(summary, f, indent=2, default=str)`,
    wrong:[R`import csv
import json
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, InvalidOperation

CENT = Decimal("0.01")

def money(value):
    return value.quantize(CENT)

month = input("Month (YYYY-MM): ")
try:
    parsed = datetime.strptime(month, "%Y-%m")
except ValueError:
    print("Invalid month")
else:
    by_category = defaultdict(Decimal)
    by_day = defaultdict(Decimal)
    with open("expenses.csv", newline="") as f:
        for row in csv.DictReader(f):
            if not row["date"].startswith(month):
                continue
            try:
                amount = Decimal(row["amount"])
            except InvalidOperation:
                continue
            by_category[row["category"]] += amount
            by_day[row["date"]] += amount

    if not by_category:
        print("No expenses for", month)
    else:
        total = sum(by_category.values(), Decimal("0"))
        ranked = sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0]))
        for category, amount in ranked:
            print(f"{category}: {money(amount)}")
        print("Total:", money(total))
        day = min(by_day, key=lambda d: (-by_day[d], d))
        print(f"Biggest day: {day} ({money(by_day[day])})")
        summary = {
            "month": month,
            "total": money(total),
            "by_category": {c: money(a) for c, a in ranked},
            "biggest_day": day,
        }
        with open("summary.json", "w") as f:
            json.dump(summary, f, indent=2, default=str)`, R`import csv
import json
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, InvalidOperation

CENT = Decimal("0.01")

def money(value):
    return value.quantize(CENT)

month = input("Month (YYYY-MM): ")
try:
    parsed = datetime.strptime(month, "%Y-%m")
    if parsed.strftime("%Y-%m") != month:
        raise ValueError("sloppy month")
except ValueError:
    print("Invalid month")
else:
    by_category = defaultdict(Decimal)
    by_day = defaultdict(Decimal)
    with open("expenses.csv", newline="") as f:
        for row in csv.DictReader(f):
            if not row["date"].startswith(month):
                continue
            amount = Decimal(row["amount"])
            by_category[row["category"]] += amount
            by_day[row["date"]] += amount

    if not by_category:
        print("No expenses for", month)
    else:
        total = sum(by_category.values(), Decimal("0"))
        ranked = sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0]))
        for category, amount in ranked:
            print(f"{category}: {money(amount)}")
        print("Total:", money(total))
        day = min(by_day, key=lambda d: (-by_day[d], d))
        print(f"Biggest day: {day} ({money(by_day[day])})")
        summary = {
            "month": month,
            "total": money(total),
            "by_category": {c: money(a) for c, a in ranked},
            "biggest_day": day,
        }
        with open("summary.json", "w") as f:
            json.dump(summary, f, indent=2, default=str)`, R`import csv
import json
from collections import defaultdict
from datetime import datetime
from decimal import Decimal, InvalidOperation

CENT = Decimal("0.01")

def money(value):
    return value.quantize(CENT)

month = input("Month (YYYY-MM): ")
try:
    parsed = datetime.strptime(month, "%Y-%m")
    if parsed.strftime("%Y-%m") != month:
        raise ValueError("sloppy month")
except ValueError:
    print("Invalid month")
else:
    by_category = defaultdict(Decimal)
    by_day = defaultdict(Decimal)
    with open("expenses.csv", newline="") as f:
        for row in csv.DictReader(f):
            if not row["date"].startswith(month):
                continue
            try:
                amount = Decimal(row["amount"])
            except InvalidOperation:
                continue
            by_category[row["category"]] += amount
            by_day[row["date"]] += amount

    if not by_category:
        print("No expenses for", month)
    else:
        total = sum(by_category.values(), Decimal("0"))
        ranked = sorted(by_category.items(), key=lambda kv: kv[0])
        for category, amount in ranked:
            print(f"{category}: {money(amount)}")
        print("Total:", money(total))
        day = min(by_day, key=lambda d: (-by_day[d], d))
        print(f"Biggest day: {day} ({money(by_day[day])})")
        summary = {
            "month": month,
            "total": money(total),
            "by_category": {c: money(a) for c, a in ranked},
            "biggest_day": day,
        }
        with open("summary.json", "w") as f:
            json.dump(summary, f, indent=2, default=str)`],
    hints:['Validate the month: strptime(month, "%Y-%m") and also check parsed.strftime("%Y-%m") == month.','Read the CSV; keep rows whose date startswith(month); try Decimal(row["amount"]) except InvalidOperation: continue. Add into two defaultdict(Decimal)s.','Rank with sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0])); biggest day with min(by_day, key=lambda d: (-by_day[d], d)). Quantize every printed amount.','import csv\nimport json\nfrom collections import defaultdict\nfrom datetime import datetime\nfrom decimal import Decimal, InvalidOperation\n\nCENT = Decimal("0.01")\n\ndef money(value):\n    return value.quantize(CENT)\n\nmonth = input("Month (YYYY-MM): ")\ntry:\n    parsed = datetime.strptime(month, "%Y-%m")\n    if parsed.strftime("%Y-%m") != month:\n        raise ValueError("sloppy month")\nexcept ValueError:\n    print("Invalid month")\nelse:\n    by_category = defaultdict(Decimal)\n    by_day = defaultdict(Decimal)\n    with open("expenses.csv", newline="") as f:\n        for row in csv.DictReader(f):\n            if not row["date"].startswith(month):\n                continue\n            try:\n                amount = Decimal(row["amount"])\n            except InvalidOperation:\n                continue\n            by_category[row["category"]] += amount\n            by_day[row["date"]] += amount\n\n    if not by_category:\n        print("No expenses for", month)\n    else:\n        total = sum(by_category.values(), Decimal("0"))\n        ranked = sorted(by_category.items(), key=lambda kv: (-kv[1], kv[0]))\n        for category, amount in ranked:\n            print(f"{category}: {money(amount)}")\n        print("Total:", money(total))\n        day = min(by_day, key=lambda d: (-by_day[d], d))\n        print(f"Biggest day: {day} ({money(by_day[day])})")\n        summary = {\n            "month": month,\n            "total": money(total),\n            "by_category": {c: money(a) for c, a in ranked},\n            "biggest_day": day,\n        }\n        with open("summary.json", "w") as f:\n            json.dump(summary, f, indent=2, default=str)']},
  power:{can:['Build a complete report tool from csv, datetime, decimal, defaultdict and json','Handle bad months, empty months and bad rows without crashing'],
    expand:'Add a command-line style loop: keep asking for months until the user types `quit`.',
    where:'This is the skeleton of every finance, billing and analytics script you will ever write.',
    next:'Next: the Workshop Boss, the Cog Colossus.'},
  codex:{title:'Capstone: Expense Tracker',body:'Validate input; read csv; Decimal sums via defaultdict(Decimal); rank with (-total, name); json.dump(default=str); skip bad rows; no output file for empty results.',snip:R`json.dump(summary, f, default=str)`}
}
);
