// REALM 9 — THE WORKSHOP — part E (lessons 43-44: boss and gap check)
LESSONS.push(
{
  id:'r9-43', realm:9, n:43, title:'Boss: The Cog Colossus', kind:'boss',
  teaches:['realm9-boss'], requires:['mission9d'],
  story:`Every spare gear in the Workshop rattles loose and clamps together into the **Cog Colossus**: a clanking giant with a clock for a face and a hundred dials for fists. "It only fears people who use the **right tool**," Master Cog yells over the grinding. "Pick the right module, and every strike lands."`,
  boss:{name:'The Cog Colossus', hp:5},
  phases:[
    {type:'mcq', code:R`print(round(2.5), round(3.5))`, q:'Strike 1: What prints?', opts:['2 4','3 4','2 3'], ans:0,
     why:'round() uses half-to-even: 2.5 goes to 2 and 3.5 goes to 4.', tags:['r9-05']},
    {type:'write', prompt:'Strike 2: Ask `Moves: ` (space-separated words). If there are none print `No moves`. Otherwise print `Last: <the last 3 moves joined with " > ">` (use a `deque`) and `Common: <the most common move>` (use `Counter`; ties go alphabetical).',
     starter:R`from collections import Counter, deque

moves = input("Moves: ").split()
`,
     inputs:['up up down left up right'],
     cases:[{inputs:['up up down left up right'],tests:[['Last and common','lines[-2:]==["Last: left > up > right","Common: up"]']]},{inputs:['b a'],tests:[['Tie is alphabetical','lines[-2:]==["Last: b > a","Common: a"]']]},{inputs:['x'],tests:[['One move','lines[-2:]==["Last: x","Common: x"]']]},{inputs:[''],tests:[['None','lines[-1]=="No moves"'],['Uses both','"deque" in src and "Counter" in src']]}],
     sol:R`from collections import Counter, deque

moves = input("Moves: ").split()
if not moves:
    print("No moves")
else:
    recent = deque(moves, maxlen=3)
    counts = Counter(moves)
    common = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
    print("Last:", " > ".join(recent))
    print("Common:", common)`,
     wrong:[R`from collections import Counter, deque

moves = input("Moves: ").split()
if not moves:
    print("No moves")
else:
    recent = deque(moves, maxlen=3)
    counts = Counter(moves)
    common = counts.most_common(1)[0][0]
    print("Last:", " > ".join(recent))
    print("Common:", common)`, R`from collections import Counter, deque

moves = input("Moves: ").split()
if not moves:
    print("No moves")
else:
    recent = deque(moves)
    counts = Counter(moves)
    common = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
    print("Last:", " > ".join(recent))
    print("Common:", common)`],
     hints:['deque(moves, maxlen=3) keeps only the last three automatically.','Counter(moves) counts; sort its items by (-count, name) so ties are alphabetical.','Handle empty input first with if not moves.','from collections import Counter, deque\n\nmoves = input("Moves: ").split()\nif not moves:\n    print("No moves")\nelse:\n    recent = deque(moves, maxlen=3)\n    counts = Counter(moves)\n    common = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]\n    print("Last:", " > ".join(recent))\n    print("Common:", common)'],
     tags:['r9-08','r9-10']},
    {type:'mcq', code:R`from datetime import date
print((date(2024, 3, 1) - date(2024, 2, 1)).days)`, q:'Strike 3: What prints?', opts:['29','28','30'], ans:0,
     why:'2024 is a leap year, so February has 29 days.', tags:['r9-20']},
    {type:'write', prompt:'Strike 4: Ask `Scores: ` (space-separated whole numbers). With none print `No scores`. Otherwise print `Top: <the 3 largest, biggest first, space-separated>` (fewer if there are fewer scores). Use `heapq.nlargest`.',
     starter:R`import heapq

scores = [int(s) for s in input("Scores: ").split()]
`,
     inputs:['5 9 1 7 3'],
     cases:[{inputs:['5 9 1 7 3'],tests:[['Top three','lines[-1]=="Top: 9 7 5"']]},{inputs:['2 2'],tests:[['Few and equal','lines[-1]=="Top: 2 2"']]},{inputs:['4'],tests:[['One','lines[-1]=="Top: 4"']]},{inputs:['-1 -5 -3 -2'],tests:[['Negatives','lines[-1]=="Top: -1 -2 -3"']]},{inputs:[''],tests:[['None','lines[-1]=="No scores"'],['Uses heapq','"heapq.nlargest" in src']]}],
     sol:R`import heapq

scores = [int(s) for s in input("Scores: ").split()]
if not scores:
    print("No scores")
else:
    print("Top:", *heapq.nlargest(3, scores))`,
     wrong:[R`import heapq

scores = [int(s) for s in input("Scores: ").split()]
if not scores:
    print("No scores")
else:
    print("Top:", *heapq.nsmallest(3, scores))`, R`scores = [int(s) for s in input("Scores: ").split()]
if not scores:
    print("No scores")
else:
    print("Top:", *sorted(scores, reverse=True)[:3])`],
     hints:['heapq.nlargest(3, scores) returns up to three items, biggest first.','Spread them into print with * so they are space-separated.','Check for empty input first.','import heapq\n\nscores = [int(s) for s in input("Scores: ").split()]\nif not scores:\n    print("No scores")\nelse:\n    print("Top:", *heapq.nlargest(3, scores))'],
     tags:['r9-36']},
    {type:'write', prompt:'Strike 5: A plugin may or may not be installed. Try to `import plugin`. If it is missing print `No plugin`. Otherwise print whatever `plugin.run()` returns.',
     starter:R`# try the import
`,
     files:{'plugin.py':'def run():\n    return "plugin says hi"\n'},
     cases:[{inputs:[],files:{'plugin.py':'def run():\n    return "plugin says hi"\n'},tests:[['Installed','lines==["plugin says hi"]']]},{inputs:[],files:{},tests:[['Missing','lines==["No plugin"]']]},{inputs:[],files:{'plugin.py':'def run():\n    return 42\n'},tests:[['Another plugin','lines==["42"]'],['Catches the right error','"ModuleNotFoundError" in src or "ImportError" in src']]}],
     sol:R`try:
    import plugin
except ModuleNotFoundError:
    print("No plugin")
else:
    print(plugin.run())`,
     wrong:[R`import plugin
print(plugin.run())`, R`try:
    import plugin
except ModuleNotFoundError:
    print("No plugin")
else:
    print("plugin says hi")`],
     hints:['Wrap import plugin in try / except ModuleNotFoundError.','Missing: print No plugin.','Use else: for the working case and print(plugin.run()).','try:\n    import plugin\nexcept ModuleNotFoundError:\n    print("No plugin")\nelse:\n    print(plugin.run())'],
     tags:['r9-29']}
  ],
  power:{can:['Pick the right standard-library tool for the job','Combine collections, heapq, dates and imports in small programs'],
    expand:'Rebuild strike 2 as two functions, `last_moves(moves)` and `common_move(moves)`, each with a docstring.',
    where:'The standard library is why Python programmers get so much done with so little code.',
    next:'One more gate: the Gap Check for the Workshop.'},
  codex:{title:'Realm 9 boss',body:'You can pull the right tool out of the standard library, write your own modules, and combine them into working programs.',snip:R`from collections import Counter, deque
import heapq`}
},
{
  id:'r9-44', realm:9, n:44, title:'Gap Check: the Workshop Trial', kind:'gap', passPct:80,
  teaches:['realm9-gap'], requires:['realm9-boss'],
  story:`The Colossus folds into a tidy stack of brass plates, each stamped with a tool name. Master Cog polishes a small silver spanner and presses it into your hand. "Eighty percent opens the next gate: **objects and classes**, where you stop *using* other people's types and start **making your own**."`,
  phases:[
    {type:'mcq', code:R`from math import sqrt
print(math.pi)`, q:'What happens?', opts:['NameError','3.14159...','None'], ans:0, why:'Only sqrt was imported; the name math was never defined.', tags:['r9-02']},
    {type:'mcq', code:R`import math
print(0.1 + 0.2 == 0.3, math.isclose(0.1 + 0.2, 0.3))`, q:'What prints?', opts:['False True','True True','False False'], ans:0, why:'The float sum is slightly off, so == is False; isclose allows for the tiny error.', tags:['r9-05']},
    {type:'mcq', code:R`import random
cards = [1, 2, 3]
print(random.shuffle(cards))`, q:'What prints?', opts:['None','[1, 2, 3] in some order','1'], ans:0, why:'shuffle changes the list in place and returns None.', tags:['r9-07']},
    {type:'mcq', code:R`from collections import defaultdict
d = defaultdict(list)
d["a"]
print(len(d))`, q:'What prints?', opts:['1','0','KeyError'], ans:0, why:'Reading a missing key on a defaultdict creates it.', tags:['r9-09']},
    {type:'mcq', code:R`from collections import deque
d = deque([1, 2, 3], maxlen=3)
d.append(4)
print(list(d))`, q:'What prints?', opts:['[2, 3, 4]','[1, 2, 3, 4]','[1, 2, 3]'], ans:0, why:'maxlen=3 pushes the oldest item out when a fourth arrives.', tags:['r9-10']},
    {type:'mcq', code:R`from itertools import groupby
print(len([k for k, _ in groupby([1, 1, 2, 1])]))`, q:'What prints?', opts:['3','2','4'], ans:0, why:'groupby only joins neighbours: runs are 1,1 then 2 then 1.', tags:['r9-14']},
    {type:'mcq', code:R`from functools import lru_cache

@lru_cache(maxsize=None)
def total(nums):
    return sum(nums)

print(total([1, 2]))`, q:'What happens?', opts:['TypeError: unhashable list','3','[1, 2]'], ans:0, why:'Cached functions need hashable arguments; a list is not. Pass a tuple.', tags:['r9-16']},
    {type:'mcq', code:R`from datetime import datetime
d = datetime.strptime("23/10/2026", "%d/%m/%Y")
print(d.strftime("%b %d"))`, q:'What prints?', opts:['Oct 23','23 Oct','October 23'], ans:0, why:'%b is the short month name and %d the day.', tags:['r9-21']},
    {type:'mcq', code:R`def f():
    return 1

if __name__ == "__main__":
    print("run")
print(__name__)`, q:'When this file is run directly, what prints?', opts:['run, then __main__','__main__ only','run only'], ans:0, why:'Run directly, __name__ is "__main__", so the guarded line runs and the last print shows the name.', tags:['r9-27']},
    {type:'mcq', code:R`from decimal import Decimal
print(Decimal(0.1) == Decimal("0.1"))`, q:'What prints?', opts:['False','True','Error'], ans:0, why:'Decimal(0.1) carries the float error; only the string version is exactly 0.1.', tags:['r9-38']},
    {type:'write', pts:2, prompt:'Final trial: read `events.csv` (`name,date`, dates like `2026-11-05`). Ask `Today (YYYY-MM-DD): `. Find the next event on or after today (earliest date; ties alphabetical) and print `Next: <name> in <n> days`. If there is none print `No upcoming events`.',
     starter:R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
`,
     inputs:['2026-10-23'],
     files:{'events.csv':'name,date\nGear Fair,2026-11-05\nOil Day,2026-10-25\nOld Fete,2026-09-01\n'},
     cases:[{inputs:['2026-10-23'],files:{'events.csv':'name,date\nGear Fair,2026-11-05\nOil Day,2026-10-25\nOld Fete,2026-09-01\n'},tests:[['Next one','lines[-1]=="Next: Oil Day in 2 days"']]},{inputs:['2026-11-05'],files:{'events.csv':'name,date\nGear Fair,2026-11-05\nOil Day,2026-10-25\nOld Fete,2026-09-01\n'},tests:[['Today counts','lines[-1]=="Next: Gear Fair in 0 days"']]},{inputs:['2026-12-01'],files:{'events.csv':'name,date\nGear Fair,2026-11-05\nOil Day,2026-10-25\n'},tests:[['All past','lines[-1]=="No upcoming events"']]},{inputs:['2026-10-23'],files:{'events.csv':'name,date\n'},tests:[['Empty','lines[-1]=="No upcoming events"']]},{inputs:['2026-01-01'],files:{'events.csv':'name,date\nZeta,2026-02-01\nAlpha,2026-02-01\n'},tests:[['Tie is alphabetical','lines[-1]=="Next: Alpha in 31 days"'],['Uses csv and dates','"csv." in src and "fromisoformat" in src']]}],
     sol:R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
upcoming = []
with open("events.csv", newline="") as f:
    for row in csv.DictReader(f):
        when = date.fromisoformat(row["date"])
        if when >= today:
            upcoming.append((when, row["name"]))

if not upcoming:
    print("No upcoming events")
else:
    when, name = min(upcoming)
    print(f"Next: {name} in {(when - today).days} days")`,
     wrong:[R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
upcoming = []
with open("events.csv", newline="") as f:
    for row in csv.DictReader(f):
        when = date.fromisoformat(row["date"])
        upcoming.append((when, row["name"]))

if not upcoming:
    print("No upcoming events")
else:
    when, name = min(upcoming)
    print(f"Next: {name} in {(when - today).days} days")`, R`import csv
from datetime import date

today = date.fromisoformat(input("Today (YYYY-MM-DD): "))
upcoming = []
with open("events.csv", newline="") as f:
    for row in csv.DictReader(f):
        when = date.fromisoformat(row["date"])
        if when > today:
            upcoming.append((when, row["name"]))

if not upcoming:
    print("No upcoming events")
else:
    when, name = min(upcoming)
    print(f"Next: {name} in {(when - today).days} days")`],
     hints:['Read with csv.DictReader and convert each date with date.fromisoformat.','Keep only events where when >= today as (when, name) tuples.','min(upcoming) gives the earliest date, ties alphabetical. Days = (when - today).days.','import csv\nfrom datetime import date\n\ntoday = date.fromisoformat(input("Today (YYYY-MM-DD): "))\nupcoming = []\nwith open("events.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        when = date.fromisoformat(row["date"])\n        if when >= today:\n            upcoming.append((when, row["name"]))\n\nif not upcoming:\n    print("No upcoming events")\nelse:\n    when, name = min(upcoming)\n    print(f"Next: {name} in {(when - today).days} days")'],
     tags:['r9-20','r9-40']}
  ],
  power:{can:['Use the standard library confidently','Write and import your own modules'],
    expand:'Pick the question you missed and write a similar one yourself.',
    where:'Knowing what the standard library offers is half of being a fast Python developer.',
    next:'Next: classes and objects: making your own types.'},
  codex:{title:'Realm 9 gap check',body:'Imports (import, from, as), math, random, collections, itertools, functools, datetime, pathlib, own modules and packages, logging, Decimal.',snip:R`from collections import Counter
import heapq`}
}
);
