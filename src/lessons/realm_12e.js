// REALM 12 — THE MASTER GATE — part E (lessons 31-37: command-line tools with argparse)
const eqF = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const hE = R`import argparse, io, contextlib, shlex

def parse(parser, line):
    """Parse a command-line string. Returns the Namespace, or the exit code if argparse rejected it."""
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            return parser.parse_args(shlex.split(line))
    except SystemExit as stop:
        return stop.code if stop.code is not None else 0
`;

// ---------- 31 greet
const bp31 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="greet")
    parser.add_argument("name")
    parser.add_argument("--shout", action="store_true")
    parser.add_argument("--times", type=int, default=1)
    return parser
`;
const t31 = R`
args = parse(build_parser(), input("Args: "))
if isinstance(args, int):
    print("Error: bad arguments")
else:
    for _ in range(args.times):
        text = f"Hello, {args.name}!"
        print(text.upper() if args.shout else text)
`;
const e31 = R`import argparse

parser = argparse.ArgumentParser(prog="greet")
parser.add_argument("name")                           # positional: required
parser.add_argument("--shout", action="store_true")   # flag: False unless given
parser.add_argument("--times", type=int, default=1)   # option with a type and a default

args = parser.parse_args(["Ada", "--times", "2", "--shout"])
print(args)
print(args.name, args.times, args.shout)
print(parser.parse_args(["Bob"]))`;

// ---------- 32 dice options
const bp32 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="dice")
    parser.add_argument("--sides", type=int, choices=[4, 6, 8, 12, 20], default=6)
    parser.add_argument("-n", "--count", type=int, default=1)
    parser.add_argument("-v", "--verbose", action="count", default=0)
    parser.add_argument("--tag", action="append", default=[])
    return parser
`;
const t32 = R`
args = parse(build_parser(), input("Args: "))
if isinstance(args, int):
    print("Error: bad arguments")
else:
    print(f"sides={args.sides} count={args.count} verbose={args.verbose} tags={args.tag}")
`;
const e32 = R`import argparse

parser = argparse.ArgumentParser(prog="dice")
parser.add_argument("--sides", type=int, choices=[4, 6, 20], default=6)
parser.add_argument("-v", "--verbose", action="count", default=0)
parser.add_argument("--tag", action="append", default=[])

print(parser.parse_args(["-vv", "--sides", "20", "--tag", "a", "--tag", "b"]))
print(parser.parse_args([]))`;

// ---------- 33 subcommands
const bp33 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="todo")
    sub = parser.add_subparsers(dest="cmd", required=True)
    add = sub.add_parser("add")
    add.add_argument("text")
    done = sub.add_parser("done")
    done.add_argument("id", type=int)
    show = sub.add_parser("list")
    show.add_argument("--all", action="store_true")
    return parser
`;
const t33 = R`
tasks = []
for line in input("Commands: ").split(";"):
    args = parse(build_parser(), line.strip())
    if isinstance(args, int):
        print("Error: bad command")
    elif args.cmd == "add":
        tasks.append([args.text, False])
        print(f"Added {len(tasks)}: {args.text}")
    elif args.cmd == "done":
        if 1 <= args.id <= len(tasks):
            tasks[args.id - 1][1] = True
            print(f"Done {args.id}")
        else:
            print(f"No task {args.id}")
    elif args.cmd == "list":
        shown = [(i, t) for i, t in enumerate(tasks, 1) if args.all or not t[1]]
        if not shown:
            print("Nothing to show")
        for i, (text, done) in shown:
            mark = "x" if done else " "
            print(f"{i} [{mark}] {text}")
`;
const e33 = R`import argparse

parser = argparse.ArgumentParser(prog="todo")
sub = parser.add_subparsers(dest="cmd", required=True)

add = sub.add_parser("add")
add.add_argument("text")

done = sub.add_parser("done")
done.add_argument("id", type=int)

print(parser.parse_args(["add", "Buy milk"]))
print(parser.parse_args(["done", "3"]))`;

// ---------- 34 exit codes
const t34 = R`import argparse, io, contextlib, shlex

def main(argv):
    pass

code = main(shlex.split(input("Args: ")))
print("exit code:", code)
`;
const g34 = R`import argparse, io, contextlib, shlex

def main(argv):
    parser = argparse.ArgumentParser(prog="check")
    parser.add_argument("value", type=int)
    parser.add_argument("--min", type=int, default=0)
    parser.add_argument("--max", type=int, default=100)
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            args = parser.parse_args(argv)
    except SystemExit as stop:
        return stop.code
    if args.value < args.min:
        print("Too small")
        return 1
    if args.value > args.max:
        print("Too big")
        return 1
    print("OK")
    return 0

code = main(shlex.split(input("Args: ")))
print("exit code:", code)
`;
const e34 = R`import argparse, io, contextlib

def main(argv):
    parser = argparse.ArgumentParser(prog="demo")
    parser.add_argument("n", type=int)
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            args = parser.parse_args(argv)
    except SystemExit as stop:
        return stop.code            # argparse exits with 2 for usage errors
    return 0 if args.n >= 0 else 1

print(main(["5"]), main(["-1"]), main(["x"]), main([]))`;

// ---------- 35 file search
const bp35 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="find")
    parser.add_argument("pattern")
    parser.add_argument("files", nargs="+")
    parser.add_argument("-i", "--ignore-case", action="store_true")
    parser.add_argument("-n", "--line-numbers", action="store_true")
    parser.add_argument("-c", "--count", action="store_true")
    return parser
`;
const se35 = R`def search(args):
    status = 0
    needle = args.pattern.lower() if args.ignore_case else args.pattern
    for name in args.files:
        try:
            with open(name) as handle:
                lines = handle.read().splitlines()
        except FileNotFoundError:
            print(f"{name}: no such file")
            status = 1
            continue
        hits = []
        for number, line in enumerate(lines, start=1):
            hay = line.lower() if args.ignore_case else line
            if needle in hay:
                hits.append((number, line))
        if args.count:
            print(f"{name}:{len(hits)}")
        else:
            for number, line in hits:
                prefix = f"{name}:{number}:" if args.line_numbers else f"{name}:"
                print(prefix + line)
    return status
`;
const t35 = R`
args = parse(build_parser(), input("Args: "))
if isinstance(args, int):
    print("exit code: 2")
else:
    print("exit code:", search(args))
`;
const e35 = R`import argparse

parser = argparse.ArgumentParser(prog="find")
parser.add_argument("pattern")
parser.add_argument("files", nargs="+")          # one or more
parser.add_argument("-i", "--ignore-case", action="store_true")
parser.add_argument("-c", "--count", action="store_true")

args = parser.parse_args(["-ic", "error", "a.log", "b.log"])
print(args.pattern, args.files, args.ignore_case, args.count)
print(args)`;
const ff35 = {'notes.txt': 'Alpha\nbeta\nALPHA beta\n', 'log.txt': 'error: disk\nok\nError: net\n'};

// ---------- 36 logging levels
const h36 = R`import argparse, io, contextlib, shlex, logging, sys

def parse(parser, line):
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            return parser.parse_args(shlex.split(line))
    except SystemExit as stop:
        return stop.code if stop.code is not None else 0

logger = logging.getLogger("tool")

def setup(level):
    logger.handlers.clear()
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
    logger.addHandler(handler)
    logger.setLevel(level)
    logger.propagate = False

`;
const lv36 = R`def level_for(verbose, quiet):
    if quiet:
        return logging.ERROR
    if verbose >= 2:
        return logging.DEBUG
    if verbose == 1:
        return logging.INFO
    return logging.WARNING
`;
const bp36 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="tool")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-v", "--verbose", action="count", default=0)
    group.add_argument("-q", "--quiet", action="store_true")
    return parser
`;
const t36 = R`
args = parse(build_parser(), input("Args: "))
if isinstance(args, int):
    print("Error: bad arguments")
else:
    level = level_for(args.verbose, args.quiet)
    setup(level)
    print("Level:", logging.getLevelName(level))
    logger.debug("details")
    logger.info("starting")
    logger.warning("low disk")
    logger.error("crashed")
`;
const e36 = R`import logging, sys

log = logging.getLogger("demo")
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
log.addHandler(handler)
log.propagate = False

log.setLevel(logging.INFO)
log.debug("hidden: below INFO")
log.info("starting")
log.warning("low disk")
print(logging.DEBUG, logging.INFO, logging.WARNING, logging.ERROR)`;

// ---------- 37 mission task cli
const h37 = R`import argparse, io, contextlib, json, os, shlex

PATH = "tasks.json"

def parse(parser, line):
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            return parser.parse_args(shlex.split(line))
    except SystemExit as stop:
        return stop.code if stop.code is not None else 0

def load():
    if os.path.exists(PATH):
        with open(PATH) as handle:
            return json.load(handle)
    return []

def save(tasks):
    with open(PATH, "w") as handle:
        json.dump(tasks, handle)

PRIORITY_ORDER = {"high": 0, "normal": 1, "low": 2}
`;
const bp37 = R`def build_parser():
    parser = argparse.ArgumentParser(prog="tasks")
    sub = parser.add_subparsers(dest="cmd", required=True)
    add = sub.add_parser("add")
    add.add_argument("text")
    add.add_argument("--priority", choices=["low", "normal", "high"], default="normal")
    show = sub.add_parser("list")
    show.add_argument("--all", action="store_true")
    show.add_argument("--priority", choices=["low", "normal", "high"])
    for name in ("done", "remove"):
        one = sub.add_parser(name)
        one.add_argument("id", type=int)
    sub.add_parser("stats")
    return parser
`;
const run37 = R`def run(args, tasks):
    if args.cmd == "add":
        new_id = max((t["id"] for t in tasks), default=0) + 1
        tasks.append({"id": new_id, "text": args.text, "priority": args.priority, "done": False})
        print(f"Added #{new_id}: {args.text}")
        return 0
    if args.cmd == "list":
        shown = [t for t in tasks
                 if (args.all or not t["done"])
                 and (args.priority is None or t["priority"] == args.priority)]
        shown.sort(key=lambda t: (PRIORITY_ORDER[t["priority"]], t["id"]))
        if not shown:
            print("No tasks")
        for t in shown:
            mark = "x" if t["done"] else " "
            print(f"#{t['id']} [{mark}] ({t['priority']}) {t['text']}")
        return 0
    if args.cmd in ("done", "remove"):
        for t in tasks:
            if t["id"] == args.id:
                if args.cmd == "done":
                    t["done"] = True
                    print(f"Done #{args.id}")
                else:
                    tasks.remove(t)
                    print(f"Removed #{args.id}")
                return 0
        print(f"No such task #{args.id}")
        return 1
    done = sum(1 for t in tasks if t["done"])
    print(f"Open: {len(tasks) - done}, done: {done}")
    return 0
`;
const t37 = R`
def main(line):
    args = parse(build_parser(), line)
    if isinstance(args, int):
        print("usage error")
        return 2
    tasks = load()
    code = run(args, tasks)
    save(tasks)
    return code

for line in input("Commands: ").split(";"):
    print("->", main(line.strip()))
`;
const e37 = R`import json, os

PATH = "tasks.json"
tasks = [{"id": 1, "text": "demo", "done": False}]
with open(PATH, "w") as handle:
    json.dump(tasks, handle)

with open(PATH) as handle:
    loaded = json.load(handle)
print(loaded == tasks, os.path.exists(PATH))
print(max((t["id"] for t in loaded), default=0) + 1)
print(max((t["id"] for t in []), default=0) + 1)`;
const cmd37 = 'add "Write tests" --priority high;add Relax --priority low;add Plan;list;done 1;list;list --all;stats;remove 2;done 9;list --all --priority low;add;oops;stats';
const out37 = ["Added #1: Write tests","-> 0","Added #2: Relax","-> 0","Added #3: Plan","-> 0","#1 [ ] (high) Write tests","#3 [ ] (normal) Plan","#2 [ ] (low) Relax","-> 0","Done #1","-> 0","#3 [ ] (normal) Plan","#2 [ ] (low) Relax","-> 0","#1 [x] (high) Write tests","#3 [ ] (normal) Plan","#2 [ ] (low) Relax","-> 0","Open: 2, done: 1","-> 0","Removed #2","-> 0","No such task #9","-> 1","No tasks","-> 0","usage error","-> 2","usage error","-> 2","Open: 1, done: 1","-> 0"];

LESSONS.push(
{
  id:'r12-31', realm:12, n:31, title:'argparse: your first command-line tool',
  teaches:['cli-parse'], requires:['mission12d'],
  story:`"Spells you can only cast from inside the book are curiosities," Orrin says. "A **command** is a spell anyone can cast from the doorway: a name, a few words after it, maybe some switches."`,
  concept:{
    html:`Command-line programs take **arguments** after their name: \`greet Ada --times 2 --shout\`. Python's \`argparse\` parses them for you, generates \`--help\`, and rejects bad input with a clear error.\n\n\`\`\`\nimport argparse\n\nparser = argparse.ArgumentParser(prog="greet")\nparser.add_argument("name")                          # positional: required\nparser.add_argument("--shout", action="store_true")   # flag: False unless present\nparser.add_argument("--times", type=int, default=1)   # option with a value\n\nargs = parser.parse_args(["Ada", "--times", "2"])     # real programs: parse_args() reads sys.argv\nargs.name, args.times, args.shout                     # 'Ada', 2, False\n\`\`\`\n\n- **Positional** arguments have no dashes and are required. **Optional** ones start with \`--\`.\n- \`type=int\` converts the text and rejects anything that isn't a whole number.\n- \`action="store_true"\` makes a switch with no value.\n- \`--name-with-dashes\` becomes \`args.name_with_dashes\`.\n- Passing a list to \`parse_args(list)\` makes your tool **testable**; a plain string would be treated as a list of characters!\n- On bad input argparse prints usage to stderr and exits with code **2** (\`SystemExit\`). The lesson harness catches that and gives you the code.`,
    analogy:`A restaurant order form: the table number is required, the extras are optional ticks.`,
    example:e31},
  predict:{code:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("--n", type=int, default=3)
print(p.parse_args([]).n, p.parse_args(["--n", "5"]).n)`, q:'What prints?', opts:['3 5','3 3','5 5'], ans:0, why:'No --n uses the default 3; --n 5 overrides it.'},
  cast:{code:e31, task:'Cast it.'},
  bug:{broken:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("--n", type=int, default=3)
print(p.parse_args("--n 5").n)`, task:'parse_args wants a LIST of words, not a string. Split it. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['List','"split" in src or "[" in src.split("parse_args")[1]']]}],
    sol:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("--n", type=int, default=3)
print(p.parse_args("--n 5".split()).n)`, wrong:[R`print(5)`]},
  write:{prompt:'Write `build_parser()` for a `greet` tool: a required positional `name`, a flag `--shout` (no value) and an option `--times` (whole number, default 1). The rest of the program is given: it prints the greeting `times` times, upper-cased when shouting, or `Error: bad arguments` if the arguments are rejected.',
    starter:hE + R`
def build_parser():
    pass
` + t31,
    inputs:['Ada'],
    cases:[{inputs:['Ada'],tests:[['Plain','lines[-1]=="Hello, Ada!"']]},{inputs:['Ada --times 2 --shout'],tests:[['Both options','lines[-2:]==["HELLO, ADA!","HELLO, ADA!"]']]},{inputs:['--shout Ada'],tests:[['Flag first','lines[-1]=="HELLO, ADA!"']]},{inputs:['"Ada Lovelace"'],tests:[['Quoted','lines[-1]=="Hello, Ada Lovelace!"']]},{inputs:['--times 2'],tests:[['Missing name','lines[-1]=="Error: bad arguments"']]},{inputs:['Ada --times x'],tests:[['Bad number','lines[-1]=="Error: bad arguments"']]},{inputs:['Ada Bob'],tests:[['Extra argument','lines[-1]=="Error: bad arguments"']]}],
    sol:hE + '\n' + bp31 + t31,
    wrong:[hE + '\n' + bp31.replace('type=int, ','') + t31, hE + '\n' + bp31.replace('action="store_true"','action="store"') + t31, hE + '\n' + bp31.replace('default=1','default=0') + t31],
    hints:['parser.add_argument("name") makes a required positional. Names with -- are optional.','--shout is a switch: action="store_true". --times needs type=int and default=1.','Remember to return the parser. The attribute names are args.name, args.shout, args.times.',hE + '\n' + bp31 + t31]},
  power:{can:['Build a command-line interface with argparse','Handle positional arguments, flags and typed options'],
    expand:'Add `-s` as a short alias for `--shout`: `add_argument("-s", "--shout", ...)`.',
    where:'Every command-line tool you use (git, pip, pytest) is parsed like this.',
    next:'Next: choices, counters, repeated options.'},
  codex:{title:'argparse basics',body:'ArgumentParser(prog=...); add_argument("name") positional; "--flag" with action="store_true"; "--opt" with type=int, default=...; parse_args(list). Errors exit with code 2.',snip:R`parser.add_argument("--times", type=int, default=1)
args = parser.parse_args(["Ada", "--times", "2"])`}
},
{
  id:'r12-32', realm:12, n:32, title:'Options: choices, counters, repeats',
  teaches:['cli-options'], requires:['cli-parse'],
  story:`"Good tools guard their own doors," Orrin says. "Only certain dice exist. Only some switches combine. Let the parser refuse nonsense before your code ever sees it."`,
  concept:{
    html:`argparse has a rich set of option behaviours:\n\n| Feature | Example | Result |\n|---|---|---|\n| allowed values | \`choices=[4, 6, 20]\` | anything else is rejected |\n| short + long names | \`"-n", "--count"\` | both set \`args.count\` |\n| counter | \`"-v", action="count", default=0\` | \`-vv\` gives 2 |\n| repeatable | \`"--tag", action="append", default=[]\` | \`--tag a --tag b\` gives \`['a', 'b']\` |\n| several values | \`nargs="+"\` or \`nargs=2\` | list |\n| help text | \`help="..."\` | shown by \`--help\` |\n\n- Short flags can be **bundled**: \`-vv\`, or \`-vn 3\`.\n- With \`type=int\` **and** \`choices=[...]\`, choices are compared **after** conversion (so use ints in the list).\n- \`action="append"\` needs \`default=[]\` if you want a list (not \`None\`) when the option is never given.\n- Every error path ends with exit code 2: bad type, value not in choices, unknown option.`,
    analogy:`A vending machine with labelled buttons: only certain coins, and pressing "extra sugar" twice means more sugar.`,
    example:e32},
  predict:{code:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("-v", action="count", default=0)
print(p.parse_args(["-vv"]).v)`, q:'What prints?', opts:['2','True','1'], ans:0, why:'Each v adds one to the counter.'},
  cast:{code:e32, task:'Cast it.'},
  bug:{broken:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("--tag", action="append")
print(p.parse_args([]).tag)`, task:'With no --tag the value is None, not an empty list. Give it a default list. Expected: []',
    cases:[{inputs:[],tests:[['Works','lines==["[]"]'],['Default','"default" in src']]}],
    sol:R`import argparse
p = argparse.ArgumentParser()
p.add_argument("--tag", action="append", default=[])
print(p.parse_args([]).tag)`, wrong:[R`print([])`]},
  write:{prompt:'Write `build_parser()` for a `dice` tool: `--sides` (whole number, one of 4, 6, 8, 12, 20, default 6), `-n` / `--count` (whole number, default 1), `-v` / `--verbose` (a counter, default 0) and `--tag` (repeatable, giving a list, default empty). The program prints the settings or `Error: bad arguments`.',
    starter:hE + R`
def build_parser():
    pass
` + t32,
    inputs:['-vv -n 3 --sides 20 --tag a --tag b'],
    cases:[{inputs:['-vv -n 3 --sides 20 --tag a --tag b'],tests:[['Everything',"lines[-1]==\"sides=20 count=3 verbose=2 tags=['a', 'b']\""]]},{inputs:[''],tests:[['Defaults','lines[-1]=="sides=6 count=1 verbose=0 tags=[]"']]},{inputs:['--sides 7'],tests:[['Bad choice','lines[-1]=="Error: bad arguments"']]},{inputs:['-n x'],tests:[['Bad number','lines[-1]=="Error: bad arguments"']]},{inputs:['--count 4 -v'],tests:[['Long name and single v','lines[-1]=="sides=6 count=4 verbose=1 tags=[]"']]},{inputs:['-vvv --sides 4'],tests:[['Many v','lines[-1]=="sides=4 count=1 verbose=3 tags=[]"']]},{inputs:['--unknown'],tests:[['Unknown option','lines[-1]=="Error: bad arguments"']]}],
    sol:hE + '\n' + bp32 + t32,
    wrong:[hE + '\n' + bp32.replace(', choices=[4, 6, 8, 12, 20]','') + t32, hE + '\n' + bp32.replace('action="count"','action="store_true"') + t32, hE + '\n' + bp32.replace(', default=[]','') + t32, hE + '\n' + bp32.replace('"-n", ','') + t32],
    hints:['--sides: type=int, choices=[4, 6, 8, 12, 20], default=6.','-n and --count are two names for one option: add_argument("-n", "--count", ...). -v is action="count" with default=0.','--tag: action="append", default=[] so it is a list even when never given.',hE + '\n' + bp32 + t32]},
  power:{can:['Restrict option values with choices','Use counters, repeated options and short/long names'],
    expand:'Add `help=` text to every option and call `parser.format_help()` to see it.',
    where:'Tools like ssh (-vvv) and docker (-e A=1 -e B=2) rely on exactly these patterns.',
    next:'Next: subcommands, like git add / git commit.'},
  codex:{title:'argparse options',body:'choices=[...] limits values (after type conversion). action="count" for -vv. action="append", default=[] for repeats. "-n", "--count" aliases. Bad input exits 2.',snip:R`parser.add_argument("-v", "--verbose", action="count", default=0)
parser.add_argument("--tag", action="append", default=[])`}
},
{
  id:'r12-33', realm:12, n:33, title:'Subcommands: one tool, many verbs',
  teaches:['cli-sub'], requires:['cli-options'],
  story:`"One command per verb gets messy," Orrin says. "So the big tools do it like git: **one door, many verbs**. git add, git commit, git push: each with its own arguments."`,
  concept:{
    html:`**Subcommands** let one program have several actions, each with its own arguments.\n\n\`\`\`\nparser = argparse.ArgumentParser(prog="todo")\nsub = parser.add_subparsers(dest="cmd", required=True)\n\nadd = sub.add_parser("add")            # todo add "Buy milk"\nadd.add_argument("text")\n\ndone = sub.add_parser("done")          # todo done 3\ndone.add_argument("id", type=int)\n\nlst = sub.add_parser("list")           # todo list --all\nlst.add_argument("--all", action="store_true")\n\`\`\`\n\n- \`dest="cmd"\` stores the chosen verb in \`args.cmd\`; then dispatch with \`if args.cmd == "add": ...\`.\n- \`required=True\` makes a missing verb an error (otherwise \`args.cmd\` is \`None\` and nothing happens!).\n- Each sub-parser is a full parser: its own positionals, options, types and choices.\n- Arguments for the verb come **after** it. Quote multi-word values: \`add "Buy milk"\`.\n- An unknown verb or bad arguments exit with code 2.`,
    analogy:`A swiss army knife: one handle, each blade with its own use.`,
    example:e33},
  predict:{code:R`import argparse
p = argparse.ArgumentParser()
sub = p.add_subparsers(dest="cmd")
a = sub.add_parser("add")
a.add_argument("text")
print(p.parse_args(["add", "x"]).cmd)`, q:'What prints?', opts:['add','x','None'], ans:0, why:'dest="cmd" records which verb was chosen.'},
  cast:{code:e33, task:'Cast it.'},
  bug:{broken:R`import argparse
p = argparse.ArgumentParser()
sub = p.add_subparsers(dest="cmd")
sub.add_parser("list")
args = p.parse_args([])
print(args.cmd)`, task:'A missing verb silently gives None. Make the verb required so the parser rejects it, then catch SystemExit and print "missing". Expected: missing',
    cases:[{inputs:[],tests:[['Works','lines==["missing"]'],['Required','"required=True" in src.replace(" ", "")']]}],
    sol:R`import argparse, io, contextlib
p = argparse.ArgumentParser()
sub = p.add_subparsers(dest="cmd", required=True)
sub.add_parser("list")
try:
    with contextlib.redirect_stderr(io.StringIO()):
        args = p.parse_args([])
    print(args.cmd)
except SystemExit:
    print("missing")`, wrong:[R`print("missing")`]},
  write:{prompt:'Write `build_parser()` for a `todo` tool with subcommands stored in `args.cmd`: `add TEXT`, `done ID` (whole number) and `list` with an `--all` flag. A verb is required. The program (given) runs a `;`-separated session of commands against a task list.',
    starter:hE + R`
def build_parser():
    pass
` + t33,
    inputs:['add "Buy milk";add Sleep;done 1;list;list --all;done 9;oops;done x'],
    cases:[{inputs:['add "Buy milk";add Sleep;done 1;list;list --all;done 9;oops;done x'],tests:[['Session','lines[-9:]==["Added 1: Buy milk","Added 2: Sleep","Done 1","2 [ ] Sleep","1 [x] Buy milk","2 [ ] Sleep","No task 9","Error: bad command","Error: bad command"]']]},{inputs:['list;add x; ;list --all'],tests:[['Blank command is an error','lines[-4:]==["Nothing to show","Added 1: x","Error: bad command","1 [ ] x"]']]},{inputs:['add a;done 0;done -1'],tests:[['Out of range ids','lines[-3:]==["Added 1: a","No task 0","No task -1"]']]},{inputs:['add'],tests:[['Missing argument','lines[-1]=="Error: bad command"']]}],
    sol:hE + '\n' + bp33 + t33,
    wrong:[hE + '\n' + bp33.replace(', required=True','') + t33, hE + '\n' + bp33.replace('done.add_argument("id", type=int)','done.add_argument("id")') + t33, hE + '\n' + bp33.replace('show.add_argument("--all", action="store_true")','show.add_argument("--all")') + t33],
    hints:['parser.add_subparsers(dest="cmd", required=True) gives you sub; then sub.add_parser("add") etc.','Each sub-parser gets its own arguments: add -> text; done -> id with type=int; list -> --all (a flag).','Return the main parser. required=True is what makes an empty command an error.',hE + '\n' + bp33 + t33]},
  power:{can:['Build git-style CLIs with subcommands','Dispatch on the chosen verb'],
    expand:'Add a `remove ID` subcommand and its handler.',
    where:'git, docker, pip, kubectl, aws: all are sub-command tools.',
    next:'Next: exit codes, how tools talk to scripts.'},
  codex:{title:'Subcommands',body:'sub = parser.add_subparsers(dest="cmd", required=True); p = sub.add_parser("add"); p.add_argument(...). Dispatch on args.cmd. required=True rejects a missing verb.',snip:R`sub = parser.add_subparsers(dest="cmd", required=True)
add = sub.add_parser("add")`}
},
{
  id:'r12-34', realm:12, n:34, title:'Exit codes: how programs report success',
  teaches:['cli-exit'], requires:['cli-sub'],
  story:`"When a guard speaks to a guard, no words are wasted," Orrin says. "Success is **0**. Anything else means trouble. Scripts and pipelines read that single number and decide whether to continue."`,
  concept:{
    html:`Every program ends with an **exit code** (a small integer) that tells the caller what happened.\n\n| Code | Convention |\n|---|---|\n| \`0\` | success |\n| \`1\` | general failure (a check failed) |\n| \`2\` | usage error (bad arguments): argparse uses this |\n\n\`\`\`\nimport sys\n\ndef main(argv):\n    ...\n    return 0              # return the code instead of exiting in the middle\n\nif __name__ == "__main__":\n    sys.exit(main(sys.argv[1:]))\n\`\`\`\n\n- \`sys.exit(n)\` raises \`SystemExit(n)\`; you can **catch** it: \`except SystemExit as e: e.code\`.\n- argparse calls \`sys.exit(2)\` after printing the problem to **stderr**.\n- Put the logic in \`main(argv)\` returning a code and the exit call only at the very end. That makes your tool trivial to test.\n- Shells use it: \`tool && next\` only runs \`next\` if the code was 0. CI marks a job failed on non-zero.\n- Normal results go to **stdout**; errors and warnings go to **stderr**.`,
    analogy:`A traffic light for scripts: green (0) go on, red (anything else) stop.`,
    example:e34},
  predict:{code:R`try:
    raise SystemExit(3)
except SystemExit as e:
    print(e.code)`, q:'What prints?', opts:['3','None','SystemExit'], ans:0, why:'SystemExit stores the exit code in .code.'},
  cast:{code:e34, task:'Cast it.'},
  bug:{broken:R`import argparse, io, contextlib
p = argparse.ArgumentParser()
p.add_argument("n", type=int)
with contextlib.redirect_stderr(io.StringIO()):
    args = p.parse_args(["abc"])
print(args.n)`, task:'argparse exits the program on bad input. Catch SystemExit and print its code. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Catches','"SystemExit" in src']]}],
    sol:R`import argparse, io, contextlib
p = argparse.ArgumentParser()
p.add_argument("n", type=int)
try:
    with contextlib.redirect_stderr(io.StringIO()):
        args = p.parse_args(["abc"])
    print(args.n)
except SystemExit as stop:
    print(stop.code)`, wrong:[R`print(2)`]},
  write:{prompt:'Write `main(argv)` for a `check` tool: positional `value` (whole number), `--min` (default 0), `--max` (default 100). Print `OK` and return 0 when `min <= value <= max`; print `Too small` or `Too big` and return 1 otherwise. If the arguments are invalid, return argparse\'s exit code (2) without printing anything else (hide the usage message with `contextlib.redirect_stderr`). The given code prints the exit code.',
    starter:t34,
    inputs:['50'],
    cases:[{inputs:['50'],tests:[['OK','lines[-2:]==["OK","exit code: 0"]']]},{inputs:['150'],tests:[['Too big','lines[-2:]==["Too big","exit code: 1"]']]},{inputs:['-5'],tests:[['Negative value','lines[-2:]==["Too small","exit code: 1"]']]},{inputs:['abc'],tests:[['Usage error','lines[-1]=="exit code: 2"']]},{inputs:[''],tests:[['Nothing given','lines[-1]=="exit code: 2"']]},{inputs:['10 --min 20'],tests:[['Below custom min','lines[-2:]==["Too small","exit code: 1"]']]},{inputs:['10 --min 5 --max 8'],tests:[['Above custom max','lines[-2:]==["Too big","exit code: 1"]']]},{inputs:['5 --min 5 --max 5'],tests:[['Edges are inside','lines[-2:]==["OK","exit code: 0"]']]}],
    sol:g34,
    wrong:[g34.replace('return stop.code','return 0'),g34.replace('args.value < args.min','args.value <= args.min'),g34.replace('print("Too big")\n        return 1','print("Too big")\n        return 0')],
    hints:['Build the parser inside main. Wrap parse_args(argv) in try/except SystemExit as stop and return stop.code.','Check value < min first (print "Too small", return 1), then value > max ("Too big", return 1).','Otherwise print "OK" and return 0. Edges are allowed: use < and >, not <= and >=.',g34]},
  power:{can:['Return meaningful exit codes','Catch SystemExit and structure programs as main(argv) -> int'],
    expand:'Add `--quiet` to suppress the OK message but keep the exit code.',
    where:'CI pipelines, git hooks and cron jobs all run on exit codes.',
    next:'Next: tools that read files.'},
  codex:{title:'Exit codes',body:'0 success, 1 failure, 2 usage error (argparse). main(argv) returns the code; sys.exit(main()) at the end. SystemExit.code holds the number. Results to stdout, errors to stderr.',snip:R`except SystemExit as stop:
    return stop.code`}
},
{
  id:'r12-35', realm:12, n:35, title:'A file-searching tool',
  teaches:['cli-io'], requires:['cli-exit'],
  story:`"Time for a real one," Orrin says, pointing to a shelf of scroll-files. "A tool that **searches many files for a phrase**. Every sysadmin has written this once. It teaches how arguments become actions on real files."`,
  concept:{
    html:`Command-line tools mostly **read files given as arguments**. The recipe:\n\n1. \`nargs="+"\` collects one or more file names: \`parser.add_argument("files", nargs="+")\`\n2. Open each; a missing file raises \`FileNotFoundError\`, so catch it, **report it, and keep going**\n3. Remember that something failed and finish with exit code 1\n4. Print results in a stable, script-friendly format, e.g. \`file:line:text\`\n\nGood details:\n\n- Short flags combine: \`-ic\` means \`-i -c\`.\n- Case-insensitive matching: compare \`lower()\` of **both** sides, but print the original line.\n- \`enumerate(lines, start=1)\` for 1-based line numbers (humans count from 1).\n- \`handle.read().splitlines()\` drops line endings.\n- One bad file should never stop the other files from being searched.\n\nYou're building a small \`grep\` clone. Patterns here are plain text, not regex.`,
    analogy:`A librarian checking many shelves for a word and noting every spot where it appears.`,
    example:e35},
  predict:{code:R`print("alpha" in "ALPHA", "alpha" in "ALPHA".lower())`, q:'What prints?', opts:['False True','True True','False False'], ans:0, why:'Case matters until you lower-case.'},
  cast:{code:e35, task:'Cast it.'},
  bug:{broken:R`lines = ["first", "second"]
for number, line in enumerate(lines):
    print(f"{number}:{line}")`, task:'Humans count lines from 1. Fix the numbering. Expected: 1:first then 2:second',
    cases:[{inputs:[],tests:[['Works','lines==["1:first","2:second"]'],['start=1','"start=1" in src.replace(" ", "") or ", 1)" in src']]}],
    sol:R`lines = ["first", "second"]
for number, line in enumerate(lines, start=1):
    print(f"{number}:{line}")`, wrong:[R`print("1:first")
print("2:second")`]},
  write:{prompt:'Write `build_parser()` (positional `pattern`, one or more `files`, flags `-i/--ignore-case`, `-n/--line-numbers`, `-c/--count`) and `search(args)` returning the exit code. For each file print every line containing the pattern as `<file>:<line>` (with `-n`: `<file>:<number>:<line>`, numbers from 1); with `-c` print only `<file>:<number of matching lines>`. A missing file prints `<file>: no such file`, is skipped, and makes the exit code 1 (otherwise 0). `-i` ignores case but prints the original text.',
    starter:hE + R`
def build_parser():
    pass

def search(args):
    pass
` + t35,
    inputs:['-i alpha notes.txt'],
    cases:[{inputs:['alpha notes.txt'],files:ff35,tests:[['No case-sensitive match','[l for l in lines if not l.startswith("Args:")]==["exit code: 0"]']]},{inputs:['-i alpha notes.txt'],files:ff35,tests:[['Ignore case','[l for l in lines if not l.startswith("Args:")]==["notes.txt:Alpha","notes.txt:ALPHA beta","exit code: 0"]']]},{inputs:['-i ALPHA notes.txt'],files:ff35,tests:[['Pattern case folded too','[l for l in lines if not l.startswith("Args:")]==["notes.txt:Alpha","notes.txt:ALPHA beta","exit code: 0"]']]},{inputs:['-in alpha notes.txt'],files:ff35,tests:[['Line numbers','[l for l in lines if not l.startswith("Args:")]==["notes.txt:1:Alpha","notes.txt:3:ALPHA beta","exit code: 0"]']]},{inputs:['-c error notes.txt log.txt'],files:ff35,tests:[['Count','[l for l in lines if not l.startswith("Args:")]==["notes.txt:0","log.txt:1","exit code: 0"]']]},{inputs:['-ci error log.txt'],files:ff35,tests:[['Count ignoring case','[l for l in lines if not l.startswith("Args:")]==["log.txt:2","exit code: 0"]']]},{inputs:['x nofile.txt notes.txt'],files:ff35,tests:[['Missing file','[l for l in lines if not l.startswith("Args:")]==["nofile.txt: no such file","exit code: 1"]']]},{inputs:['beta'],files:ff35,tests:[['No files','[l for l in lines if not l.startswith("Args:")]==["exit code: 2"]']]},{inputs:['beta nofile.txt notes.txt log.txt'],files:ff35,tests:[['Keeps going after a missing file','[l for l in lines if not l.startswith("Args:")]==["nofile.txt: no such file","notes.txt:beta","notes.txt:ALPHA beta","exit code: 1"]']]}],
    sol:hE + '\n' + bp35 + '\n' + se35 + t35,
    wrong:[hE + '\n' + bp35 + '\n' + se35.replace('args.pattern.lower() if args.ignore_case else args.pattern','args.pattern') + t35, hE + '\n' + bp35 + '\n' + se35.replace('enumerate(lines, start=1)','enumerate(lines)') + t35, hE + '\n' + bp35 + '\n' + se35.replace('            status = 1\n','            pass\n') + t35, hE + '\n' + bp35 + '\n' + se35.replace('            continue\n        hits','            return 1\n        hits') + t35, hE + '\n' + bp35 + '\n' + se35.replace('hits.append((number, line))','hits.append((number, line.lower()))') + t35],
    hints:['Parser: positional pattern, positional files with nargs="+", and three store_true flags.','In search: loop over files; try to open each, on FileNotFoundError print "<file>: no such file", set status = 1 and continue.','Collect (number, line) hits with enumerate(..., start=1); for -i compare lower-cased needle and line, but store the original line.',hE + '\n' + bp35 + '\n' + se35 + t35]},
  power:{can:['Process files named on the command line','Keep going after a failing file and report it in the exit code'],
    expand:'Support `-r` to search every file in a directory with `pathlib`.',
    where:'grep, wc, cat, head: the Unix toolbox is mostly this pattern.',
    next:'Next: logging and the main() pattern.'},
  codex:{title:'File tools',body:'files nargs="+"; open each in try/except FileNotFoundError; report, remember failure, continue; exit 1 at the end if any failed. enumerate(start=1) for line numbers; lower() both sides for -i.',snip:R`parser.add_argument("files", nargs="+")
for number, line in enumerate(lines, start=1):`}
},
{
  id:'r12-36', realm:12, n:36, title:'Logging and mutually exclusive flags',
  teaches:['cli-main'], requires:['cli-io'],
  story:`"Imagine a night guard who shouts every footstep," Orrin says, then whispers: "or one who says nothing even when the castle burns. The right amount of noise is **a dial the user controls**."`,
  concept:{
    html:`Replace scattered \`print\` debugging with the \`logging\` module. Messages have a **level**; the logger shows only those at or above its threshold:\n\n| Level | Number | Use |\n|---|---|---|\n| \`DEBUG\` | 10 | developer details |\n| \`INFO\` | 20 | normal progress |\n| \`WARNING\` | 30 | something odd (the **default** threshold) |\n| \`ERROR\` | 40 | something failed |\n\n\`\`\`\nlog = logging.getLogger("tool")\nlog.setLevel(logging.INFO)\nlog.info("starting")        # shown\nlog.debug("details")        # hidden\n\`\`\`\n\nThe standard CLI mapping: nothing = WARNING, \`-v\` = INFO, \`-vv\` = DEBUG, \`-q\` = ERROR.\n\n- \`-v\` is a **counter** (\`action="count"\`).\n- \`-v\` and \`-q\` make no sense together, so declare them **mutually exclusive**:\n\n\`\`\`\ngroup = parser.add_mutually_exclusive_group()\ngroup.add_argument("-v", "--verbose", action="count", default=0)\ngroup.add_argument("-q", "--quiet", action="store_true")\n\`\`\`\n\n- Logs normally go to **stderr** so they never mix with the program's real output. This lesson prints to stdout so you can see them.\n- Level names to numbers: \`logging.getLevelName(logging.INFO)\` is \`'INFO'\`.`,
    analogy:`A volume knob with labelled clicks, plus a mute button that can't be pressed together with "louder".`,
    example:e36},
  predict:{code:R`import logging
print(logging.DEBUG < logging.INFO < logging.WARNING < logging.ERROR, logging.WARNING)`, q:'What prints?', opts:['True 30','True 20','False 30'], ans:0, why:'Levels increase in severity; WARNING is 30.'},
  cast:{code:e36, task:'Cast it.'},
  bug:{broken:R`import logging, sys
log = logging.getLogger("demo")
log.addHandler(logging.StreamHandler(sys.stdout))
log.propagate = False
log.info("starting")
log.warning("careful")`, task:'The INFO message never shows because the logger is at the default threshold. Set the level to INFO. Expected: starting then careful',
    cases:[{inputs:[],tests:[['Works','lines==["starting","careful"]'],['setLevel','"setLevel" in src']]}],
    sol:R`import logging, sys
log = logging.getLogger("demo")
log.addHandler(logging.StreamHandler(sys.stdout))
log.propagate = False
log.setLevel(logging.INFO)
log.info("starting")
log.warning("careful")`, wrong:[R`print("starting")
print("careful")`]},
  write:{prompt:'Write `level_for(verbose, quiet)` (quiet gives ERROR; otherwise 2 or more `-v` gives DEBUG, one gives INFO, none gives WARNING) and `build_parser()` with `-v/--verbose` (counter) and `-q/--quiet` (flag) **in a mutually exclusive group**. The rest is given: it sets up logging and emits four messages.',
    starter:h36 + R`def level_for(verbose, quiet):
    pass

def build_parser():
    pass
` + t36,
    inputs:['-v'],
    cases:[{inputs:[''],tests:[['Default','[l for l in lines if not l.startswith("Args:")]==["Level: WARNING","WARNING: low disk","ERROR: crashed"]']]},{inputs:['-v'],tests:[['Info','[l for l in lines if not l.startswith("Args:")]==["Level: INFO","INFO: starting","WARNING: low disk","ERROR: crashed"]']]},{inputs:['-vv'],tests:[['Debug','[l for l in lines if not l.startswith("Args:")]==["Level: DEBUG","DEBUG: details","INFO: starting","WARNING: low disk","ERROR: crashed"]']]},{inputs:['-vvv'],tests:[['More v still debug','lines[-5]=="Level: DEBUG"']]},{inputs:['-q'],tests:[['Quiet','[l for l in lines if not l.startswith("Args:")]==["Level: ERROR","ERROR: crashed"]']]},{inputs:['-v -q'],tests:[['Exclusive','lines[-1]=="Error: bad arguments"']]},{inputs:['--verbose --verbose'],tests:[['Long names','lines[-5]=="Level: DEBUG"']]}],
    sol:h36 + lv36 + '\n' + bp36 + t36,
    wrong:[h36 + lv36.replace('verbose >= 2','verbose == 2') + '\n' + bp36 + t36, h36 + lv36 + '\n' + bp36.replace('group = parser.add_mutually_exclusive_group()','group = parser') + t36, h36 + lv36.replace('if quiet:\n        return logging.ERROR','if quiet:\n        return logging.CRITICAL') + '\n' + bp36 + t36, h36 + lv36.replace('return logging.WARNING','return logging.INFO') + '\n' + bp36 + t36],
    hints:['level_for: check quiet first, then verbose >= 2, verbose == 1, otherwise WARNING.','build_parser: group = parser.add_mutually_exclusive_group(), then add -v/--verbose and -q/--quiet to the GROUP, not the parser.','-v is action="count", default=0; -q is action="store_true". Return the parser.',h36 + lv36 + '\n' + bp36 + t36]},
  power:{can:['Use logging levels instead of print debugging','Map -v / -q flags to log levels with a mutually exclusive group'],
    expand:'Send logs to stderr and results to stdout, and see why pipelines love that.',
    where:'Every serious CLI offers -v / -q; every server uses logging.',
    next:'Next: Real-World Mission: a persistent task manager.'},
  codex:{title:'logging + exclusive groups',body:'Levels DEBUG 10 < INFO 20 < WARNING 30 < ERROR 40. logger.setLevel. -v counts verbosity, -q quiets; add_mutually_exclusive_group() forbids combining them. Logs go to stderr in real tools.',snip:R`group = parser.add_mutually_exclusive_group()
group.add_argument("-v", action="count", default=0)`}
},
{
  id:'r12-37', realm:12, n:37, title:'Real-World Mission: The Task Keeper',
  teaches:['mission12e'], requires:['cli-main'],
  story:`"One last tool for this wing," Orrin says, "and it's one real people use daily: a **task manager that remembers**. Each command is a separate run of the program, so everything must be saved to disk in between."`,
  concept:{
    html:`A real command-line tool runs once per command and **forgets everything** when it ends. To remember, it **stores state in a file**. Each invocation:\n\n1. parse the arguments (usage errors exit with 2)\n2. **load** the saved data\n3. do the action and print the result\n4. **save** the data\n5. return an exit code\n\nHere the storage is a JSON file (\`json.load\` / \`json.dump\`); the helpers are provided. Your job: the parser and the actions.\n\n| Command | Behaviour |\n|---|---|\n| \`add TEXT [--priority low\\|normal\\|high]\` | new task, id = highest existing id + 1 |\n| \`list [--all] [--priority P]\` | open tasks only unless \`--all\`; sorted high, normal, low, then id |\n| \`done ID\` / \`remove ID\` | exit 1 and a message if the id doesn't exist |\n| \`stats\` | \`Open: n, done: m\` |\n\n\`max((t["id"] for t in tasks), default=0) + 1\` handles the empty list. The \`default=0\` keyword stops \`max\` from crashing on an empty sequence.`,
    analogy:`A notebook that you close between sessions: the tool is only as good as what it wrote down before exiting.`,
    example:e37},
  predict:{code:R`print(max([], default=0) + 1)`, q:'What prints?', opts:['1','0','ValueError'], ans:0, why:'default=0 avoids the error on an empty list, giving 0 + 1.'},
  cast:{code:e37, task:'Cast it.'},
  bug:{broken:R`tasks = []
print(max(t["id"] for t in tasks) + 1)`, task:'max() of an empty sequence raises ValueError. Give it a default so the first id is 1. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['default','"default" in src']]}],
    sol:R`tasks = []
print(max((t["id"] for t in tasks), default=0) + 1)`, wrong:[R`print(1)`]},
  write:{prompt:'Finish the Task Keeper: write `build_parser()` (subcommands in `args.cmd`: `add TEXT --priority`, `list --all --priority`, `done ID`, `remove ID`, `stats`; priority choices low/normal/high, default `normal` for add and none for list; ids are whole numbers) and `run(args, tasks)` returning the exit code. Formats: `Added #<id>: <text>`, `#<id> [ ] (<priority>) <text>` (`[x]` when done), `No tasks`, `Done #<id>`, `Removed #<id>`, `No such task #<id>` (exit 1), `Open: <n>, done: <m>`. Persistence and the command loop are given.',
    starter:h37 + R`
def build_parser():
    pass

def run(args, tasks):
    pass
` + t37,
    inputs:[cmd37],
    cases:[{inputs:[cmd37],tests:[['Whole session',eqF(out37,'Commands:')]]},{inputs:['add a;add b;remove 1;add c;list'],tests:[['Ids and persistence',eqF(["Added #1: a","-> 0","Added #2: b","-> 0","Removed #1","-> 0","Added #3: c","-> 0","#2 [ ] (normal) b","#3 [ ] (normal) c","-> 0"],'Commands:')]]},{inputs:['list;done 1;stats'],tests:[['Empty store',eqF(["No tasks","-> 0","No such task #1","-> 1","Open: 0, done: 0","-> 0"],'Commands:')]]},{inputs:['list --priority urgent;add x --priority urgent'],tests:[['Bad choices',eqF(["usage error","-> 2","usage error","-> 2"],'Commands:')]]},{inputs:['add "Buy milk" --priority high;done 1;list;list --all'],tests:[['Done tasks are hidden by default',eqF(["Added #1: Buy milk","-> 0","Done #1","-> 0","No tasks","-> 0","#1 [x] (high) Buy milk","-> 0"],'Commands:')]]}],
    sol:h37 + '\n' + bp37 + '\n' + run37 + t37,
    wrong:[h37 + '\n' + bp37 + '\n' + run37 + t37.replace('    save(tasks)\n','    pass\n'), h37 + '\n' + bp37 + '\n' + run37.replace('(PRIORITY_ORDER[t["priority"]], t["id"])','t["id"]') + t37, h37 + '\n' + bp37 + '\n' + run37.replace('(args.all or not t["done"])','True') + t37, h37 + '\n' + bp37.replace(', choices=["low", "normal", "high"], default="normal"',', default="normal"') + '\n' + run37 + t37, h37 + '\n' + bp37 + '\n' + run37.replace('        print(f"No such task #{args.id}")\n        return 1','        print(f"No such task #{args.id}")\n        return 0') + t37, h37 + '\n' + bp37 + '\n' + run37.replace('max((t["id"] for t in tasks), default=0) + 1','len(tasks) + 1') + t37, h37 + '\n' + bp37.replace('sub.add_parser("stats")','sub.add_parser("count")') + '\n' + run37 + t37],
    hints:['Parser: add (text, --priority choices default normal), list (--all, --priority choices), done and remove (id as int), stats.','run(): add computes max id + 1; list filters (open unless --all, optional priority) and sorts by (PRIORITY_ORDER, id); done/remove search by id, returning 1 with "No such task" if missing.','stats counts done tasks. Every branch returns an exit code (0 or 1).',h37 + '\n' + bp37 + '\n' + run37 + t37]},
  power:{can:['Build a complete, persistent command-line application','Combine argparse, file storage, sorting and exit codes'],
    expand:'Add `edit ID TEXT` and a `--due` date option stored as an ISO date string.',
    where:'Task managers, note apps and deploy tools are all this shape.',
    next:'Next: talking to the web: URLs, JSON and HTTP.'},
  codex:{title:'Persistent CLI',body:'Per run: parse -> load -> act -> save -> exit code. JSON file storage with json.load/json.dump. ids: max(..., default=0)+1. Sort with key tuples. Usage errors return 2, missing items 1.',snip:R`tasks = load()
code = run(args, tasks)
save(tasks)`}
}
);
