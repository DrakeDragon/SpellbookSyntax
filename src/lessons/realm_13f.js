// REALM 13 — THE INTERVIEW ARENA — part F (lessons 52-58: docs, portfolio, boss, gap)
{
const s52 = R`def average(numbers: list[float]) -> float:
    """Return the mean of the numbers, or 0.0 for an empty list."""
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)


text = input("Numbers: ").split()
print(f"Average: {average([float(x) for x in text]):.2f}")`;
const s53 = R`def make_readme(name, tagline, features, install):
    lines = [f"# {name}", "", tagline, ""]
    if features:
        lines += ["## Features", ""] + [f"- {item}" for item in features] + [""]
    if install:
        lines += ["## Install", "", "~~~"] + install + ["~~~", ""]
    return "\n".join(lines).rstrip() + "\n"


name = input("Name: ").strip()
tagline = input("Tagline: ").strip()
features = [f.strip() for f in input("Features: ").split(",") if f.strip()]
install = [c.strip() for c in input("Install: ").split(";") if c.strip()]
print(make_readme(name, tagline, features, install), end="")`;
const s54 = R`def parse_version(text):
    return tuple(int(part) for part in text.split("."))


best = {}
while True:
    raw = input("Line: ")
    if not raw:
        break
    line = raw.split("#")[0].strip()
    if "==" not in line:
        continue
    name, version = line.split("==", 1)
    name = name.strip().lower().replace("_", "-")
    version = version.strip()
    if name not in best or parse_version(version) > parse_version(best[name]):
        best[name] = version
for name in sorted(best):
    print(f"{name}=={best[name]}")
print("Packages:", len(best))`;
const s55 = R`import re

TYPES = ("feat", "fix", "docs", "refactor", "test", "chore")
PATTERN = re.compile(r"^(\w+)(\([\w-]+\))?: (.+)$")


def check(message):
    match = PATTERN.match(message)
    if not match:
        return "bad format"
    kind, _, subject = match.groups()
    if kind not in TYPES:
        return "unknown type"
    if len(subject) > 50:
        return "subject too long"
    if subject.endswith("."):
        return "no trailing period"
    return None


good = 0
bad = 0
while True:
    message = input("Commit: ")
    if not message:
        break
    problem = check(message)
    if problem is None:
        good += 1
        print("OK", message)
    else:
        bad += 1
        print(f"BAD {message} ({problem})")
print(f"Good: {good}, Bad: {bad}")`;
const s56 = R`import html

owner = input("Owner: ").strip()
projects = []
while True:
    line = input("Project: ")
    if not line:
        break
    parts = line.split("|")
    if len(parts) != 4 or not parts[2].strip().isdigit():
        continue
    name, description, stars, url = (p.strip() for p in parts)
    projects.append((-int(stars), name, description, url))
projects.sort()
print(f"<h1>{html.escape(owner)}'s Portfolio</h1>")
if not projects:
    print("<p>No projects yet.</p>")
else:
    print("<ul>")
    for negative_stars, name, description, url in projects:
        print(f'<li><a href="{html.escape(url)}">{html.escape(name)}</a> ({-negative_stars} stars): {html.escape(description)}</li>')
    print("</ul>")`;
const s57b = R`from collections import Counter

text = input("Text: ")
counts = Counter(text)
for index, ch in enumerate(text):
    if counts[ch] == 1:
        print(f"First unique: {ch} at {index}")
        break
else:
    print("No unique")`;
const s57d = R`from collections import deque


class RateLimiter:
    def __init__(self, limit, window, clock):
        self.limit = limit
        self.window = window
        self.clock = clock
        self.calls = deque()

    def allow(self):
        now = self.clock()
        while self.calls and now - self.calls[0] >= self.window:
            self.calls.popleft()
        if len(self.calls) < self.limit:
            self.calls.append(now)
            return True
        return False


now = 0
limiter = RateLimiter(2, 10, lambda: now)
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "at" and len(parts) == 2:
        now = int(parts[1])
        print("Allowed" if limiter.allow() else "Blocked")
    else:
        print("Unknown command")`;
const s57e = R`n = int(input("Steps: "))
ways = [1] + [0] * n
for step in range(1, n + 1):
    for jump in (1, 2, 3):
        if jump <= step:
            ways[step] += ways[step - jump]
print("Ways:", ways[n])`;
const e52 = R`def average(numbers: list[float]) -> float:
    """Return the mean of the numbers, or 0.0 for an empty list."""
    if not numbers:
        return 0.0
    return sum(numbers) / len(numbers)

print(average([2, 4]))
print(average.__doc__)                   # the docstring is stored on the function
print(average.__annotations__)           # so are the type hints
help(average)                            # help() shows the signature and docstring

def shout(text: str) -> str:
    return text.upper()
print(shout("ok"), shout(5) if False else "hints are NOT enforced at run time")
# a hint is documentation plus tooling (editors, mypy). Python itself does not check it`;
const e53 = R`def make_readme(name, tagline, features):
    lines = [f"# {name}", "", tagline, ""]
    if features:
        lines += ["## Features", ""] + [f"- {item}" for item in features] + [""]
    return "\n".join(lines).rstrip() + "\n"        # exactly one newline at the end

text = make_readme("Spellbook", "Learn Python by playing", ["Offline", "Quests"])
print(text, end="")
print(len(text.splitlines()), repr(text[-1]))
# a README is the front door of a project: name, one-line pitch, features, install, usage`;
const e54 = R`def parse_version(text):
    return tuple(int(part) for part in text.split("."))    # (1, 10, 0): compare NUMBER by number

print(parse_version("1.10.0") > parse_version("1.9.0"))     # True
print("1.10.0" > "1.9.0")                                   # False!  text compares letter by letter
best = {}
for line in ["Requests==2.28.2", "requests==2.31.0", "# a comment", "numpy>=1.0"]:
    line = line.split("#")[0].strip()                       # drop comments
    if "==" not in line:
        continue                                            # only exact pins in this file
    name, version = line.split("==", 1)
    name = name.lower().replace("_", "-")                   # Flask, flask, my_pkg, my-pkg are the same
    if name not in best or parse_version(version) > parse_version(best[name]):
        best[name] = version
print(best)`;
const e55 = R`import re

PATTERN = re.compile(r"^(\w+)(\([\w-]+\))?: (.+)$")      # type(scope): subject
for message in ["feat: add login", "fix(ui): spacing", "Added stuff", "fix:no space"]:
    match = PATTERN.match(message)
    if match:
        kind, scope, subject = match.groups()
        print("ok", kind, scope, subject)
    else:
        print("bad", message)
# small, consistent commit messages make history searchable and releases automatic`;
const e56 = R`import html

name = 'Fast <b>Calc</b> & "friends"'
print(html.escape(name))                 # &lt;b&gt; ... : the browser shows the text, never runs it
print(f'<li><a href="{html.escape("https://x.dev?a=1&b=2")}">{html.escape("Calc")}</a></li>')
projects = [("Alpha", 120), ("Calc", 7), ("Beta", 120)]
projects.sort(key=lambda p: (-p[1], p[0]))      # most stars first, ties A-Z
print(projects)
# ALWAYS escape text you put into HTML: a stray < or & can break the page, or worse`;

const st52 = R`# write average(numbers): add type hints (list[float] in, float out)
# and a one-line docstring that starts with "Return"
def average(numbers):
    pass


text = input("Numbers: ").split()
print(f"Average: {average([float(x) for x in text]):.2f}")`;
const st53 = R`# write make_readme(name, tagline, features, install) -> one string
def make_readme(name, tagline, features, install):
    pass


name = input("Name: ").strip()
tagline = input("Tagline: ").strip()
features = [f.strip() for f in input("Features: ").split(",") if f.strip()]
install = [c.strip() for c in input("Install: ").split(";") if c.strip()]
print(make_readme(name, tagline, features, install), end="")`;
const st54 = R`def parse_version(text):
    pass


best = {}
while True:
    raw = input("Line: ")
    if not raw:
        break
    line = raw.split("#")[0].strip()
`;
const st55 = R`import re

TYPES = ("feat", "fix", "docs", "refactor", "test", "chore")


def check(message):
    # return None when fine, else one of:
    #   "bad format"          (not  type: subject  or  type(scope): subject)
    #   "unknown type"        (type not in TYPES)
    #   "subject too long"    (subject over 50 characters)
    #   "no trailing period"  (subject ends with ".")
    # check them in that order
    pass


good = 0
bad = 0
while True:
    message = input("Commit: ")
    if not message:
        break
    problem = check(message)
    if problem is None:
        good += 1
        print("OK", message)
    else:
        bad += 1
        print(f"BAD {message} ({problem})")
print(f"Good: {good}, Bad: {bad}")`;
const st56 = R`import html

owner = input("Owner: ").strip()
projects = []
while True:
    line = input("Project: ")
    if not line:
        break
`;
const eqQ = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const msgs55 = ['feat: add login', 'fix(auth): handle empty token', 'Added stuff', 'wip: half done', 'docs: update readme.', 'feat: ' + 'a'.repeat(50), 'feat: ' + 'a'.repeat(51), 'fix:no space', 'chore: tidy imports', ''];
const out55 = ['OK feat: add login', 'OK fix(auth): handle empty token', 'BAD Added stuff (bad format)', 'BAD wip: half done (unknown type)', 'BAD docs: update readme. (no trailing period)', 'OK feat: ' + 'a'.repeat(50), 'BAD feat: ' + 'a'.repeat(51) + ' (subject too long)', 'BAD fix:no space (bad format)', 'OK chore: tidy imports', 'Good: 4, Bad: 5'];
const sess57d = ['at 0', 'at 1', 'at 2', 'at 9', 'at 10', 'at 11', 'at 12', 'at 21', 'dance', 'quit'];
const out57d = ['Allowed', 'Allowed', 'Blocked', 'Blocked', 'Allowed', 'Allowed', 'Blocked', 'Allowed', 'Unknown command'];
const st57d = R`from collections import deque


class RateLimiter:
    # RateLimiter(limit, window, clock): allow() is True when fewer than limit calls
    # happened in the last window time units (a call exactly window ago no longer counts).
    # Blocked calls are not recorded. clock() gives the current time.
    pass


now = 0
limiter = RateLimiter(2, 10, lambda: now)
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "at" and len(parts) == 2:
        now = int(parts[1])
        print("Allowed" if limiter.allow() else "Blocked")
    else:
        print("Unknown command")`;
const readmeFull = ['# Spellbook', '', 'Learn Python by playing', '', '## Features', '', '- Offline', '- Quests', '', '## Install', '', '~~~', 'pip install spellbook', 'spellbook run', '~~~'];

LESSONS.push(
{
  id:'r13-52', realm:13, n:52, title:'Explaining your code: docstrings and type hints',
  teaches:['int-docs'], requires:['mock2'],
  story:`An interviewer reads your solution in silence. "Fine," she says. "Now explain what this function promises, without reading the body." Quill coughs. "Promises go in the **docstring**. Types go in the **hints**. Do it right and the code explains itself."`,
  concept:{
    html:`Readable code explains **what** a function promises before anyone reads **how** it works.\n\n\`\`\`\ndef average(numbers: list[float]) -> float:\n    """Return the mean of the numbers, or 0.0 for an empty list."""\n    if not numbers:\n        return 0.0\n    return sum(numbers) / len(numbers)\n\`\`\`\n\n- **Docstring**: a string right under the \`def\`. First line: a short sentence starting with a verb ("Return ...", "Compute ..."). Mention edge cases and what is returned.\n- **Type hints**: \`numbers: list[float]\` (parameter) and \`-> float\` (return). \`list[float]\`, \`dict[str, int]\`, \`int | None\` describe the shape.\n- Python **does not enforce** hints. \`double("ab")\` still runs. Their value: editors autocomplete, tools like **mypy** catch mistakes before running, and humans understand faster.\n- Both are stored on the function: \`average.__doc__\` and \`average.__annotations__\`, which is also what \`help(average)\` prints.\n- Comments explain **why**; docstrings explain **what**; names explain **which**.\n- Don't comment the obvious (\`i += 1  # add one\`). Good names beat comments.\n- Handle the empty input: the interviewer will ask "what if the list is empty?"`,
    analogy:`The label on a jar: you know what is inside and how to use it without opening it.`,
    example:e52},
  predict:{code:R`def double(n: int) -> int:
    """Return n doubled."""
    return n * 2

print(double("ab"))`, q:'What prints?', opts:['abab','Error: wrong type','4'], ans:0, why:'Type hints are not enforced: "ab" * 2 is "abab".'},
  cast:{code:e52, task:'Cast it.'},
  bug:{broken:R`def add(a: int, b: int) -> int:
    return a + b

print(add("2", "3"))`, task:'The hints do not convert anything: this prints 23 (joined text). Convert the inputs to numbers before calling. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['Converted','"add(int(" in src']]}],
    sol:R`def add(a: int, b: int) -> int:
    return a + b

print(add(int("2"), int("3")))`, wrong:[R`print(5)`]},
  write:{prompt:'Write `average(numbers)`. Give it **type hints** (`list[float]` in, `float` out) and a **docstring** starting with `Return`. An empty list averages `0.0`. The program at the bottom prints `Average: <2 decimals>`.',
    starter:st52,
    inputs:['1 2 6'],
    cases:[{inputs:['1 2 6'],tests:[['Mean',eqL(['Average: 3.00'])],['Has a docstring','bool(g["average"].__doc__) and g["average"].__doc__.strip().startswith("Return")'],['Has hints','g["average"].__annotations__=={"numbers": list[float], "return": float}']]},{inputs:[''],tests:[['Empty list',eqL(['Average: 0.00'])],['Empty returns 0.0','g["average"]([])==0.0']]},{inputs:['2.5 3'],tests:[['Decimals',eqL(['Average: 2.75'])]]},{inputs:['1 2'],tests:[['Not integer division',eqL(['Average: 1.50'])]]}],
    sol:s52,
    wrong:[s52.replace('    """Return the mean of the numbers, or 0.0 for an empty list."""\n',''),s52.replace('(numbers: list[float]) -> float:','(numbers):'),s52.replace('list[float]','list'),s52.replace('sum(numbers) / len(numbers)','sum(numbers) // len(numbers)'),s52.replace('    if not numbers:\n        return 0.0\n','')],
    hints:['Annotate the parameter: numbers: list[float], and the result: -> float.','The first line under def is a triple-quoted docstring starting with "Return".','Return 0.0 for an empty list, otherwise sum(numbers) / len(numbers).',s52]},
  power:{can:['Document functions with docstrings','Add type hints that tools can check'],
    expand:'Add a second function `median` with the same documentation style.',
    where:'Code reviewers, new teammates and your future self all read your docstrings first.',
    next:'Next: writing a README that sells your project.'},
  codex:{title:'Docstrings and hints',body:'def f(x: int) -> str: then a """Return ...""" docstring on the next line. Hints are not enforced but power editors and mypy. Stored in __doc__ and __annotations__; help(f) shows them. Comments say why, names say what.',snip:R`def average(numbers: list[float]) -> float:
    """Return the mean, or 0.0 when empty."""`}
},
{
  id:'r13-53', realm:13, n:53, title:'Portfolio: the README that sells your project',
  teaches:['int-readme'], requires:['int-docs'],
  story:`"A recruiter gives your repository thirty seconds," Quill says. "They read the title, one sentence, and a list. If those three do not make them curious, your best code stays unread. The README is your front door."`,
  concept:{
    html:`A great README is short and scannable. The order that works:\n\n1. **Name** as a heading (\`# Spellbook\`).\n2. **One-line pitch**: what it does and for whom.\n3. **Features**: 3 to 6 bullets (\`- Works offline\`).\n4. **Install / run**: commands in a fenced block.\n5. Then screenshot, usage, tests, licence.\n\nThis is Markdown. A function can generate it:\n\n\`\`\`\ndef make_readme(name, tagline, features, install):\n    lines = [f"# {name}", "", tagline, ""]\n    if features:\n        lines += ["## Features", ""] + [f"- {f}" for f in features] + [""]\n    if install:\n        lines += ["## Install", "", "~~~"] + install + ["~~~", ""]\n    return "\\n".join(lines).rstrip() + "\\n"\n\`\`\`\n\n- Markdown needs a **blank line** between blocks. Headings start with \`#\`/\`##\`; bullets with \`- \`.\n- Code fences use three backticks; **tildes** \`~~~\` work the same and are easier to type in a string.\n- Skip a section if it has nothing in it (no empty "Features" heading).\n- End the file with **exactly one newline**: \`.rstrip() + "\\n"\`.\n- Show **results**, not just tools: "Parses 1M log lines in 2 seconds" beats "uses pandas".\n- Link to a live demo and the best 2 or 3 source files.`,
    analogy:`A shop window: it does not show everything, just enough to make people come in.`,
    example:e53},
  predict:{code:R`lines = ["# Tiny", "", "A tagline", ""]
print(repr("\n".join(lines).rstrip() + "\n"))`, q:'What prints?', opts:["'# Tiny\\n\\nA tagline\\n'","'# Tiny\\n\\nA tagline\\n\\n'","'# Tiny\\nA tagline'"], ans:0, why:'The trailing blank line is removed by rstrip, and exactly one newline is added back.'},
  cast:{code:e53, task:'Cast it.'},
  bug:{broken:R`features = []
lines = ["# Tiny"]
lines += ["## Features", ""] + [f"- {f}" for f in features]
print("\n".join(lines))`, task:'An empty Features heading looks sloppy. Only add the section when there are features. Expected: # Tiny',
    cases:[{inputs:[],tests:[['Works','lines==["# Tiny"]'],['Guarded','"if features" in src']]}],
    sol:R`features = []
lines = ["# Tiny"]
if features:
    lines += ["## Features", ""] + [f"- {f}" for f in features]
print("\n".join(lines))`, wrong:[R`print("# Tiny")`]},
  write:{prompt:'Write `make_readme(name, tagline, features, install)` returning the Markdown text: `# name`, a blank line, the tagline, then (only if non-empty) `## Features` with `- ` bullets, then (only if non-empty) `## Install` with the commands between `~~~` lines. Blank line between blocks, **one** newline at the end. The program that asks for the details and prints it is given.',
    starter:st53,
    inputs:['Spellbook','Learn Python by playing','Offline,Quests','pip install spellbook;spellbook run'],
    cases:[{inputs:['Spellbook','Learn Python by playing','Offline,Quests','pip install spellbook;spellbook run'],tests:[['Full README','lines[4:]=='+JSON.stringify(readmeFull)],['Exact text','g["make_readme"]("X","t",[],[])=="# X\\n\\nt\\n"']]},{inputs:['Tiny','Just a tagline','',''],tests:[['Only the essentials','lines[4:]==["# Tiny","","Just a tagline"]']]},{inputs:['Feat','tag','One',''],tests:[['Features only','lines[4:]==["# Feat","","tag","","## Features","","- One"]']]},{inputs:['Inst','tag','','make'],tests:[['Install only','lines[4:]==["# Inst","","tag","","## Install","","~~~","make","~~~"]']]}],
    sol:s53,
    wrong:[s53.replace('[f"- {item}" for item in features]','[item for item in features]'),s53.replace('    if features:\n        lines +=','    if True:\n        lines +='),s53.replace('.rstrip() + "\\n"','+ "\\n"'),s53.replace('"~~~"] + install + ["~~~", ""]','"~~~"] + install + ["~~~"]').replace('.rstrip() + "\\n"','.rstrip()'),s53.replace('["# {name}"','["# {name}"').replace('f"# {name}"','f"## {name}"')],
    hints:['Start with lines = [f"# {name}", "", tagline, ""].','If features is non-empty add "## Features", "", the "- " bullets and a blank line. Same idea for Install with ~~~ fences.','Join with "\\n", rstrip(), then add one "\\n".',s53]},
  power:{can:['Generate Markdown with code','Know the sections a README needs'],
    expand:'Add a `Usage` section and a `Licence` line when they are given.',
    where:'Every portfolio project needs a README that survives the thirty-second test.',
    next:'Next: dependencies and version pinning.'},
  codex:{title:'README',body:'Name heading, one-line pitch, features bullets, install/run in a fenced block (~~~ works), then usage, tests, licence. Blank lines between blocks, skip empty sections, exactly one trailing newline. Show results, link a demo.',snip:R`lines = [f"# {name}", "", tagline, ""]`}
},
{
  id:'r13-54', realm:13, n:54, title:'Portfolio: dependencies and version pinning',
  teaches:['int-deps'], requires:['int-readme'],
  story:`Quill opens a project that worked last year. It does not run today. "Somebody upgraded a library," Quill sighs. "A project must say EXACTLY which versions it was built with. That list is called requirements."`,
  concept:{
    html:`A **requirements.txt** lists the packages (and versions) a project needs, so anyone can recreate your setup:\n\n\`\`\`\nrequests==2.31.0\nflask==3.0.0\nmy-pkg==1.10.0   # inline comments are allowed\n\`\`\`\n\n- \`==\` **pins** an exact version: reproducible builds. \`>=\` allows newer ones.\n- Package names are **case-insensitive** and \`_\` equals \`-\`: \`Flask\`, \`flask\`, \`my_pkg\` and \`my-pkg\` are the same package. Normalise: \`name.lower().replace("_", "-")\`.\n- Merging two lists that mention the same package: keep the **newest** version.\n- **Compare versions as numbers, never as text**: \`"1.10.0" > "1.9.0"\` is False as text! Convert: \`tuple(int(p) for p in v.split("."))\` gives \`(1, 10, 0) > (1, 9, 0)\` = True.\n- Ignore comment lines (\`#\`), blank lines and lines that are not exact pins.\n- Print sorted, so the file is stable in version control.\n- Commit the requirements file, never the virtual environment folder (\`venv/\`). Add it to \`.gitignore\`.\n- Pro tip: \`pip freeze > requirements.txt\` records what is installed right now.`,
    analogy:`A recipe that names the exact brand and size of each ingredient, so it tastes the same next year.`,
    example:e54},
  predict:{code:R`print("1.10.0" > "1.9.0", (1, 10, 0) > (1, 9, 0))`, q:'What prints?', opts:['False True','True True','True False'], ans:0, why:'As text "1.1..." sorts before "1.9", but as number tuples 10 is bigger than 9.'},
  cast:{code:e54, task:'Cast it.'},
  bug:{broken:R`versions = ["1.9.0", "1.10.0"]
print(max(versions))`, task:'Text comparison thinks 1.9.0 is newest. Compare version numbers instead. Expected: 1.10.0',
    cases:[{inputs:[],tests:[['Works','lines==["1.10.0"]'],['Numeric key','"key=" in src and "int(" in src']]}],
    sol:R`versions = ["1.9.0", "1.10.0"]
print(max(versions, key=lambda v: tuple(int(p) for p in v.split("."))))`, wrong:[R`print("1.10.0")`]},
  write:{prompt:'Read requirement lines (`Line: `) until a blank line. Ignore everything after `#`, lines without `==`. Normalise names (lower-case, `_` to `-`). If a package appears more than once keep the **highest version** (compare as numbers). Print the packages sorted as `name==version`, then `Packages: <count>`. `parse_version` turns `1.10.0` into `(1, 10, 0)`.',
    starter:st54,
    inputs:['requests==2.28.2','Flask==3.0.0','# pinned','requests==2.31.0  # newer','my_pkg==1.10.0','my-pkg==1.9.0','numpy>=1.0',''],
    cases:[{inputs:['requests==2.28.2','Flask==3.0.0','# pinned','requests==2.31.0  # newer','my_pkg==1.10.0','my-pkg==1.9.0','numpy>=1.0',''],tests:[['Merged list',eqQ(['flask==3.0.0','my-pkg==1.10.0','requests==2.31.0','Packages: 3'],'Line: ')],['Numbers, not text','g["parse_version"]("1.10.0")>g["parse_version"]("1.9.0")']]},{inputs:[''],tests:[['Nothing',eqQ(['Packages: 0'],'Line: ')]]},{inputs:['A==1.9.0','a==1.10.0','B==2.0',''],tests:[['Case and versions',eqQ(['a==1.10.0','b==2.0','Packages: 2'],'Line: ')]]},{inputs:['z==1.0','z==1.0','y==0.1.5','y==0.1.10',''],tests:[['Duplicates and patch numbers',eqQ(['y==0.1.10','z==1.0','Packages: 2'],'Line: ')]]},{inputs:['# only comments','   ','x>=2',''],tests:[['No pins',eqQ(['Packages: 0'],'Line: ')]]}],
    sol:s54,
    wrong:[s54.replace('return tuple(int(part) for part in text.split("."))','return text'),s54.replace('.lower().replace("_", "-")',''),s54.replace('line = raw.split("#")[0].strip()','line = raw.strip()'),s54.replace('> parse_version(best[name])','< parse_version(best[name])'),s54.replace('for name in sorted(best):','for name in best:')],
    hints:['parse_version returns tuple(int(p) for p in text.split(".")).','Strip comments with split("#")[0], skip lines without "==", normalise the name.','Keep the bigger parse_version per name; print sorted names and the count.',s54]},
  power:{can:['Parse and merge requirement files','Compare version numbers correctly'],
    expand:'Support `~=` and `>=` lines by copying them through unchanged.',
    where:'Reproducible builds are a first thing hiring managers check in a project.',
    next:'Next: commit messages that tell a story.'},
  codex:{title:'Requirements',body:'name==version pins. Normalise names (lower, _ -> -). Merge: keep the highest version, compared as int tuples (never text). Strip # comments, skip non-pins, print sorted. Commit requirements.txt, ignore venv/.',snip:R`tuple(int(p) for p in version.split("."))`}
},
{
  id:'r13-55', realm:13, n:55, title:'Portfolio: clean git history and commit messages',
  teaches:['int-commits'], requires:['int-deps'],
  story:`Quill scrolls a repository history: "fix", "fix2", "stuff", "asdf", "final", "final REAL". "A recruiter reads your commits like a diary," Quill says. "Make it a story they want to finish."`,
  concept:{
    html:`Your **git history** is part of your portfolio. A widely used convention is **Conventional Commits**:\n\n\`\`\`\ntype(scope): subject\nfeat: add login page\nfix(auth): handle an empty token\ndocs: explain how to install\n\`\`\`\n\n- **type**: \`feat\` (new feature), \`fix\` (bug), \`docs\`, \`refactor\`, \`test\`, \`chore\` (upkeep).\n- **scope** (optional): the part of the code, in brackets.\n- **subject**: short, in the imperative ("add", not "added"), **no trailing full stop**, at most 50 characters.\n- Exactly **one space after the colon**.\n- One logical change per commit. Commit often; each commit should leave the code working.\n- Tools can then build a changelog and pick the next version number for you (feat → minor, fix → patch).\n\nA checker uses a **regular expression**:\n\n\`\`\`\nPATTERN = re.compile(r"^(\\w+)(\\([\\w-]+\\))?: (.+)$")\nmatch = PATTERN.match(message)\nkind, scope, subject = match.groups()\n\`\`\`\n\n- Check in a fixed order so each message gets **one** clear problem: format, type, length, full stop.\n- \`re.match\` anchors at the start; \`^\` and \`$\` make the whole message match.\n- A good \`git\` workflow also means: branches for features, small pull requests, a clean \`.gitignore\`, no secrets in history.`,
    analogy:`A ship's log: terse, consistent entries that anyone can follow later.`,
    example:e55},
  predict:{code:R`import re
print(bool(re.match(r"^(\w+): (.+)$", "fix: x")), bool(re.match(r"^(\w+): (.+)$", "fix:x")))`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'The pattern needs a space after the colon, so "fix:x" does not match.'},
  cast:{code:e55, task:'Cast it.'},
  bug:{broken:R`message = "docs: update readme."
subject = message.split(": ", 1)[1]
print(subject.endswith("."), len(subject) < 5)`, task:'This prints True False, but the second check is meant to flag subjects LONGER than 10 characters. Fix the comparison and the number. Expected: True True',
    cases:[{inputs:[],tests:[['Works','lines==["True True"]'],['Longer than 10','"> 10" in src']]}],
    sol:R`message = "docs: update readme."
subject = message.split(": ", 1)[1]
print(subject.endswith("."), len(subject) > 10)`, wrong:[R`print("True True")`]},
  write:{prompt:'Write `check(message)` returning `None` when the message is fine, otherwise the **first** problem in this order: `bad format` (not `type: subject` or `type(scope): subject`), `unknown type` (allowed: feat fix docs refactor test chore), `subject too long` (over 50 characters), `no trailing period`. The program that reads messages and prints a summary is given.',
    starter:st55,
    inputs:msgs55,
    cases:[{inputs:msgs55,tests:[['Whole session',eqQ(out55,'Commit: ')],['Fine message','g["check"]("feat(ui): add button") is None'],['Format first','g["check"]("Wip. stuff")=="bad format"'],['Type before length','g["check"]("oops: "+"x"*60)=="unknown type"'],['Length before period','g["check"]("fix: "+"x"*59+".")=="subject too long"']]},{inputs:['test: cover edge case','refactor(core): split module','feat(): empty scope',''],tests:[['More messages',eqQ(['OK test: cover edge case','OK refactor(core): split module','BAD feat(): empty scope (bad format)','Good: 2, Bad: 1'],'Commit: ')]]},{inputs:[''],tests:[['Nothing',eqQ(['Good: 0, Bad: 0'],'Commit: ')]]}],
    sol:s55,
    wrong:[s55.replace('if len(subject) > 50:','if len(subject) >= 50:'),s55.replace('    if kind not in TYPES:\n        return "unknown type"\n',''),s55.replace('    if subject.endswith("."):\n        return "no trailing period"\n',''),s55.replace('(\\([\\w-]+\\))?: ','(\\([\\w-]+\\))?:'),s55.replace('    if len(subject) > 50:\n        return "subject too long"\n    if subject.endswith("."):\n        return "no trailing period"\n','    if subject.endswith("."):\n        return "no trailing period"\n    if len(subject) > 50:\n        return "subject too long"\n')],
    hints:['PATTERN = re.compile(r"^(\\w+)(\\([\\w-]+\\))?: (.+)$") captures type, scope, subject.','No match -> "bad format". Then check kind in TYPES, then len(subject) > 50, then endswith(".").','Return None at the end when nothing is wrong.',s55]},
  power:{can:['Validate commit messages with a regex','Explain why history matters'],
    expand:'Add a `Co-authored` line check or require the subject to start with a lowercase letter.',
    where:'Teams enforce this in CI to automate changelogs and releases.',
    next:'Next: Real-World Mission, your portfolio page.'},
  codex:{title:'Commit messages',body:'type(scope): subject. Types feat/fix/docs/refactor/test/chore. Imperative, <= 50 chars, no trailing period, one space after the colon. Check in fixed order: format, type, length, period. Small commits that each work.',snip:R`PATTERN = re.compile(r"^(\w+)(\([\w-]+\))?: (.+)$")`}
},
{
  id:'r13-56', realm:13, n:56, title:'Real-World Mission: Your Portfolio Page',
  teaches:['mission13e'], requires:['int-commits'],
  story:`"Time to show the world what you can do," Quill says, unrolling a blank page. "Give me a list of your projects and I will turn it into a web page. But beware: if a project's description contains a sneaky <script>, a careless page would run it. Escape everything."`,
  concept:{
    html:`Turn data into a safe web page, the last skill of a developer who ships.\n\nInput: an owner name and project lines \`name|description|stars|url\`.\n\n\`\`\`\nparts = line.split("|")\nif len(parts) != 4 or not parts[2].strip().isdigit():\n    continue                                  # skip malformed lines, don't crash\nname, description, stars, url = (p.strip() for p in parts)\nprojects.append((-int(stars), name, description, url))\nprojects.sort()                              # most stars first, ties A-Z by name\n\`\`\`\n\n- Store **\`-int(stars)\`** so one ascending sort gives "most stars first, then name". Sorting stars as **text** puts "7" above "120"!\n- **\`html.escape(text)\`** turns \`<\`, \`>\`, \`&\`, quotes into safe entities. Use it on **every** piece of user text: owner, name, description and the URL inside \`href="..."\`.\n- Without escaping, a description like \`<script>steal()</script>\` runs in every visitor's browser: **cross-site scripting (XSS)**, one of the most common web attacks.\n- Empty list: show a friendly \`<p>No projects yet.</p>\` instead of an empty list.\n- Output:\n\n\`\`\`\n<h1>Ada's Portfolio</h1>\n<ul>\n<li><a href="URL">NAME</a> (120 stars): DESCRIPTION</li>\n</ul>\n\`\`\`\n\n- Save the result in a \`.html\` file and you have a page you can host free. The game's **Export** button builds your learning portfolio the same way.`,
    analogy:`A museum label printer that refuses to print anything that could set off the fire alarm.`,
    example:e56},
  predict:{code:R`import html
print(html.escape("<b>R&D</b>"))`, q:'What prints?', opts:['&lt;b&gt;R&amp;D&lt;/b&gt;','<b>R&D</b>','&lt;b&gt;R&D&lt;/b&gt;'], ans:0, why:'Both angle brackets and the ampersand are escaped.'},
  cast:{code:e56, task:'Cast it.'},
  bug:{broken:R`projects = [("a", 7), ("b", 120)]
projects.sort(key=lambda p: str(p[1]), reverse=True)
print([p[0] for p in projects])`, task:'Sorting the star counts as text puts "7" above "120". Sort the numbers. Expected: [\'b\', \'a\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'b\', \'a\']"]'],['Numbers','"str(" not in src and "sort(" in src and "p[1]" in src']]}],
    sol:R`projects = [("a", 7), ("b", 120)]
projects.sort(key=lambda p: p[1], reverse=True)
print([p[0] for p in projects])`, wrong:[R`print(['b', 'a'])`]},
  write:{prompt:'Ask `Owner: `, then read `Project: ` lines (`name|description|stars|url`) until a blank line. Skip malformed lines (not 4 parts, or stars not whole digits). Print `<h1>OWNER\'s Portfolio</h1>`, then either `<p>No projects yet.</p>` or `<ul>`, one `<li><a href="URL">NAME</a> (N stars): DESCRIPTION</li>` per project (most stars first, ties by name A-Z) and `</ul>`. **Escape** owner, name, description and URL with `html.escape`.',
    starter:st56,
    inputs:['Ada','Spellbook|Learn Python|120|https://x.dev/spellbook','Calc|A <fast> calculator|7|https://x.dev/calc?a=1&b=2','Alpha|First|120|https://x.dev/a',''],
    cases:[{inputs:['Ada','Spellbook|Learn Python|120|https://x.dev/spellbook','Calc|A <fast> calculator|7|https://x.dev/calc?a=1&b=2','Alpha|First|120|https://x.dev/a',''],tests:[['Full page',eqQ(["<h1>Ada's Portfolio</h1>",'<ul>','<li><a href="https://x.dev/a">Alpha</a> (120 stars): First</li>','<li><a href="https://x.dev/spellbook">Spellbook</a> (120 stars): Learn Python</li>','<li><a href="https://x.dev/calc?a=1&amp;b=2">Calc</a> (7 stars): A &lt;fast&gt; calculator</li>','</ul>'],'Project: ').replace('[l for l in lines if not l.startswith("Project: ")]','[l for l in lines if not l.startswith("Project: ") and not l.startswith("Owner: ")]')]]},{inputs:['Bo',''],tests:[['No projects',eqL(["<h1>Bo's Portfolio</h1>",'<p>No projects yet.</p>'])]]},{inputs:['Cy','broken line','X|d|abc|u','Ok|fine|3|u','Nine|d|9|u','Hundred|d|100|u',''],tests:[['Malformed lines skipped, numeric sort',eqL(["<h1>Cy's Portfolio</h1>",'<ul>','<li><a href="u">Hundred</a> (100 stars): d</li>','<li><a href="u">Nine</a> (9 stars): d</li>','<li><a href="u">Ok</a> (3 stars): fine</li>','</ul>'])]]},{inputs:['R&D <team>','P|d|1|u',''],tests:[['Owner is escaped',eqL(["<h1>R&amp;D &lt;team&gt;'s Portfolio</h1>",'<ul>','<li><a href="u">P</a> (1 stars): d</li>','</ul>'])]]}],
    sol:s56,
    wrong:[s56.replace('html.escape(description)','description'),s56.replace('html.escape(url)','url'),s56.replace('projects.append((-int(stars), name, description, url))','projects.append((int(stars), name, description, url))'),s56.replace('projects.append((-int(stars), name, description, url))','projects.append((name, -int(stars), description, url))').replace('for negative_stars, name, description, url in projects:','for name, negative_stars, description, url in projects:'),s56.replace(' or not parts[2].strip().isdigit()',''),s56.replace("{html.escape(owner)}","{owner}")],
    hints:['Skip any line without exactly 4 parts or where stars is not digits.','Store (-int(stars), name, description, url) and sort: most stars first, then name.','Wrap owner, name, description and url in html.escape. Print the empty message when there are no projects.',s56]},
  power:{can:['Generate a safe HTML page from data','Escape untrusted text to prevent XSS'],
    expand:'Add a footer with the number of projects and the total stars.',
    where:'This is the page you can host free and put at the top of your CV.',
    next:'The final trial: the Interview Arena boss.'},
  codex:{title:'Portfolio page',body:'Parse name|description|stars|url, skip bad lines, sort by (-stars, name), build <li> items, and html.escape EVERY piece of user text (including href). Empty state: a friendly message. Unescaped text = XSS.',snip:R`print(f'<li><a href="{html.escape(url)}">{html.escape(name)}</a></li>')`}
},
{
  id:'r13-57', realm:13, n:57, title:'Boss: The Interview Dragon', kind:'boss',
  teaches:['realm13-boss'], requires:['mission13e'],
  story:`The Arena doors slam shut and a **dragon made of whiteboards** unfolds from the rafters, scales covered in half-erased Big-O notation. "A dragon of FIVE questions," Quill announces. "Interviewers have asked every one of them. Think aloud, test the edges, and strike when you are sure."`,
  boss:{name:'The Interview Dragon', hp:5},
  phases:[
    {type:'mcq', code:R`def f(n):
    total = 0
    for i in range(n):
        for j in range(n):
            total += 1
    return total

print(f(6))`, q:'Strike 1: How many times does total += 1 run? (and what does that make the Big-O?)', opts:['36','12','6'], ans:0,
     why:'A loop inside a loop runs n x n times: 36 for n = 6. That growth is O(n squared).', tags:['r13-03']},
    {type:'write', prompt:'Strike 2: Ask `Text: `. Print `First unique: <character> at <index>` for the first character that appears **exactly once**, or `No unique` if there is none. It must be fast for long text.',
     starter:R`text = input("Text: ")
`,
     inputs:['leetcode'],
     cases:[{inputs:['leetcode'],tests:[['First unique',eqL(['First unique: l at 0'])]]},{inputs:['loveleetcode'],tests:[['Later',eqL(['First unique: v at 2'])]]},{inputs:['aabb'],tests:[['None',eqL(['No unique'])]]},{inputs:[''],tests:[['Empty',eqL(['No unique'])]]},{inputs:['z'],tests:[['One char',eqL(['First unique: z at 0'])]]},{inputs:['aabbc'],tests:[['At the end',eqL(['First unique: c at 4'])]]}],
     sol:s57b,
     wrong:[s57b.replace('counts[ch] == 1','counts[ch] > 1'),s57b.replace('for index, ch in enumerate(text):','for index, ch in enumerate(reversed(text)):'),s57b.replace('    print("No unique")','    print("First unique: none at -1")'),s57b.replace('print(f"First unique: {ch} at {index}")','print(f"First unique: {ch} at {text.index(ch) + 1}")')],
     hints:['Count every character first (Counter).','Walk the text in order and stop at the first character whose count is 1.','for ... else: print "No unique" when the loop finds nothing.',s57b],
     tags:['r13-04','r13-22']},
    {type:'mcq', code:R`import heapq

h = []
for word in ["pear", "fig", "apple"]:
    heapq.heappush(h, (len(word), word))
print(heapq.heappop(h)[1])`, q:'Strike 3: What prints?', opts:['fig','pear','apple'], ans:0,
     why:'The heap pops the smallest tuple first. (3, "fig") beats (4, "pear") and (5, "apple").', tags:['r13-12']},
    {type:'write', prompt:'Strike 4: Write `RateLimiter(limit, window, clock)`. `allow()` is `True` when fewer than `limit` allowed calls happened in the last `window` time units (a call exactly `window` ago no longer counts) and records the call; blocked calls are not recorded. It must use the injected `clock()`. The command loop is given.',
     starter:st57d,
     inputs:sess57d,
     cases:[{inputs:sess57d,tests:[['Whole session',eqQ(out57d,'> ')],['Uses the injected clock','(lambda r: (r.allow(), r.allow(), r.allow()))(g["RateLimiter"](2, 5, lambda: 3))==(True, True, False)']]},{inputs:['at 100','at 100','at 100','quit'],tests:[['Same moment',eqQ(['Allowed','Allowed','Blocked'],'> ')]]},{inputs:['at 0','at 5','at 10','at 10','quit'],tests:[['Slide with time',eqQ(['Allowed','Allowed','Allowed','Blocked'],'> ')]]}],
     sol:s57d,
     wrong:[s57d.replace('now - self.calls[0] >= self.window','now - self.calls[0] > self.window'),s57d.replace('        if len(self.calls) < self.limit:\n            self.calls.append(now)\n            return True\n        return False','        self.calls.append(now)\n        return len(self.calls) <= self.limit'),s57d.replace('self.clock = clock','self.clock = lambda: 0'),s57d.replace('        while self.calls and now - self.calls[0] >= self.window:\n            self.calls.popleft()\n',''),s57d.replace('len(self.calls) < self.limit','len(self.calls) <= self.limit')],
     hints:['Keep a deque of the times of allowed calls.','At each call: now = self.clock(); drop old times while now - oldest >= window.','If fewer than limit remain, record now and return True; else return False without recording.',s57d],
     tags:['r13-10','r13-29','r13-37']},
    {type:'write', prompt:'Strike 5: Ask `Steps: `. A climber takes 1, 2 or 3 steps at a time. Print `Ways: <number of different ways to climb exactly that many steps>` (0 steps has 1 way). 300 steps must finish at once.',
     starter:R`n = int(input("Steps: "))
`,
     inputs:['4'],
     cases:[{inputs:['0'],tests:[['Zero',eqL(['Ways: 1'])]]},{inputs:['1'],tests:[['One',eqL(['Ways: 1'])]]},{inputs:['2'],tests:[['Two',eqL(['Ways: 2'])]]},{inputs:['3'],tests:[['Three',eqL(['Ways: 4'])]]},{inputs:['4'],tests:[['Four',eqL(['Ways: 7'])]]},{inputs:['10'],tests:[['Ten',eqL(['Ways: 274'])]]},{inputs:['300'],tests:[['300 steps (needs DP)',eqL(['Ways: 15350287614359738671843506567023635268924281173051801861566524609184461020990367'])]]}],
     sol:s57e,
     wrong:[s57e.replace('for jump in (1, 2, 3):','for jump in (1, 2):'),s57e.replace('ways = [1] + [0] * n','ways = [0] * (n + 1)'),s57e.replace('if jump <= step:','if jump < step:'),s57e.replace('ways[step] += ways[step - jump]','ways[step] = ways[step - jump] + 1'),R`import sys
n = int(input("Steps: "))
def ways(k):
    if k < 0:
        return 0
    if k == 0:
        return 1
    return ways(k - 1) + ways(k - 2) + ways(k - 3)
print("Ways:", ways(n))`],
     hints:['ways[0] = 1 (do nothing). ways[step] adds the ways for step-1, step-2 and step-3 (when they exist).','Fill a list from 1 up to n, trying each jump of 1, 2, 3.','Print Ways: with ways[n].',s57e],
     tags:['r13-43','r13-45']}
  ],
  power:{can:['Reason about Big-O, data structures, patterns and DP under pressure','Combine heaps, deques, dependency injection and counting in small solutions'],
    expand:'Pick the strike you found hardest and rebuild it from memory on a blank page, talking aloud.',
    where:'These five question shapes cover a large share of real coding interviews.',
    next:'One more gate: the Interview Arena Gap Check.'},
  codex:{title:'Realm 13 boss',body:'You reasoned about growth rates, counted with hash maps, ranked with heaps, built an injected rate limiter and solved a counting DP. The interview toolkit works.',snip:R`ways[step] += ways[step - jump]`}
},
{
  id:'r13-58', realm:13, n:58, title:'Gap Check: the Interview Arena Trial', kind:'gap', passPct:80,
  teaches:['realm13-gap'], requires:['realm13-boss'],
  story:`The dragon folds back into a stack of clean whiteboards. Quill wipes one and writes a single line: *Eighty percent opens the Archmage's door.* "Behind it," Quill says, "is the end of the road and the start of your career."`,
  phases:[
    {type:'mcq', code:R`data = list(range(1, 101))
steps = 0
for x in data:
    steps += 1
    if x == 40:
        break
print(steps)`, q:'What prints?', opts:['40','100','39'], ans:0, why:'A linear search stops at the 40th item: 40 steps.', tags:['r13-01']},
    {type:'mcq', code:R`count = 0
for i in range(5):
    for j in range(i):
        count += 1
print(count)`, q:'What prints?', opts:['10','25','15'], ans:0, why:'The inner loop runs 0 + 1 + 2 + 3 + 4 = 10 times.', tags:['r13-03']},
    {type:'mcq', code:R`print(len({1, 2, 2, 3}), len([1, 2, 2, 3]))`, q:'What prints?', opts:['3 4','4 4','3 3'], ans:0, why:'A set drops the duplicate 2; the list keeps it.', tags:['r13-04']},
    {type:'mcq', code:R`lo, hi, probes = 0, 16, 0
while lo < hi:
    mid = (lo + hi) // 2
    probes += 1
    hi = mid
print(probes)`, q:'What prints?', opts:['5','16','4'], ans:0, why:'hi halves each time: 16, 8, 4, 2, 1, 0. That is five probes: binary search is logarithmic.', tags:['r13-05']},
    {type:'mcq', code:R`stack = []
for ch in "ab":
    stack.append(ch)
print(stack.pop() + stack.pop())`, q:'What prints?', opts:['ba','ab','b'], ans:0, why:'Last in, first out: b comes off first, then a.', tags:['r13-09']},
    {type:'mcq', code:R`from collections import deque

d = deque([1, 2])
d.appendleft(0)
d.pop()
print(list(d))`, q:'What prints?', opts:['[0, 1]','[1, 2]','[0, 1, 2]'], ans:0, why:'appendleft makes [0, 1, 2]; pop removes the right end (2).', tags:['r13-10']},
    {type:'mcq', code:R`import heapq

h = []
heapq.heappush(h, (2, "b"))
heapq.heappush(h, (1, "z"))
heapq.heappush(h, (1, "a"))
print(heapq.heappop(h)[1])`, q:'What prints?', opts:['a','z','b'], ans:0, why:'Priority 1 beats 2; between the two priority-1 tuples "a" sorts before "z".', tags:['r13-12']},
    {type:'mcq', code:R`class Node:
    def __init__(self, v):
        self.v, self.left, self.right = v, None, None

def add(node, v):
    if node is None:
        return Node(v)
    if v < node.v:
        node.left = add(node.left, v)
    else:
        node.right = add(node.right, v)
    return node

def walk(node):
    return [] if node is None else walk(node.left) + [node.v] + walk(node.right)

root = None
for v in [4, 2, 6, 1, 3]:
    root = add(root, v)
print(walk(root))`, q:'What prints?', opts:['[1, 2, 3, 4, 6]','[4, 2, 1, 3, 6]','[4, 2, 6, 1, 3]'], ans:0, why:'In-order traversal of a binary search tree visits the values in sorted order.', tags:['r13-14']},
    {type:'mcq', code:R`from collections import deque

graph = {"a": ["c", "b"], "b": ["d"], "c": ["d"], "d": []}
order, queue, seen = [], deque(["a"]), {"a"}
while queue:
    node = queue.popleft()
    order.append(node)
    for nxt in graph[node]:
        if nxt not in seen:
            seen.add(nxt)
            queue.append(nxt)
print(order)`, q:'What prints?', opts:["['a', 'c', 'b', 'd']","['a', 'b', 'c', 'd']","['a', 'c', 'd', 'b']"], ans:0, why:'Breadth first follows neighbour order: a, then c and b (as listed), then d.', tags:['r13-15']},
    {type:'mcq', code:R`from collections import OrderedDict

d = OrderedDict(a=1, b=2)
d.move_to_end("a")
print(next(iter(d)))`, q:'What prints?', opts:['b','a','1'], ans:0, why:'Moving a to the end leaves b first: it is now the least recently used.', tags:['r13-17']},
    {type:'mcq', code:R`from functools import lru_cache

calls = 0

@lru_cache(maxsize=None)
def f(n):
    global calls
    calls += 1
    return n * 2

f(3)
f(3)
f(4)
print(calls)`, q:'What prints?', opts:['2','3','1'], ans:0, why:'f(3) is computed once and then served from the cache; f(4) is new.', tags:['r13-20']},
    {type:'mcq', code:R`g = (x * x for x in range(4))
print(sum(g), sum(g))`, q:'What prints?', opts:['14 0','14 14','0 0'], ans:0, why:'A generator is used up after one pass, so the second sum sees nothing.', tags:['r13-21']},
    {type:'mcq', code:R`class AppError(Exception):
    pass

class Low(AppError):
    pass

try:
    raise Low("x")
except Low:
    print("low")
except AppError:
    print("app")`, q:'What prints?', opts:['low','app','Error'], ans:0, why:'The first matching except clause wins, and Low matches before AppError.', tags:['r13-32']},
    {type:'mcq', code:R`class Greeter:
    def __init__(self, name_source):
        self.name_source = name_source

    def hello(self):
        return "Hi " + self.name_source()

print(Greeter(lambda: "Bo").hello())`, q:'What prints?', opts:['Hi Bo','Hi lambda','Error'], ans:0, why:'The injected function is called inside hello and supplies the name.', tags:['r13-29']},
    {type:'mcq', code:R`numbers = [1, 2, 4, 7]
target = 9
left, right = 0, len(numbers) - 1
while left < right:
    total = numbers[left] + numbers[right]
    if total == target:
        break
    elif total < target:
        left += 1
    else:
        right -= 1
print(left, right)`, q:'What prints?', opts:['1 3','0 3','2 3'], ans:0, why:'1 + 7 is 8 (too small, move left); then 2 + 7 is 9: found at positions 1 and 3.', tags:['r13-35']},
    {type:'mcq', code:R`pairs = sorted([(2, 4), (1, 3), (6, 7)])
merged = []
for start, end in pairs:
    if merged and start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
print(merged)`, q:'What prints?', opts:['[[1, 4], [6, 7]]','[[1, 3], [2, 4], [6, 7]]','[[1, 7]]'], ans:0, why:'Sorted: 1-3, 2-4 overlap and merge into 1-4; 6-7 stays separate.', tags:['r13-39']},
    {type:'mcq', code:R`coins = [4, 3, 1]
amount = 6
count = 0
for coin in coins:
    count += amount // coin
    amount %= coin
print(count)`, q:'What prints? (is it really the fewest coins?)', opts:['3','2','1'], ans:0, why:'Greedy takes 4 + 1 + 1 = 3 coins, but 3 + 3 uses only 2. Greedy is not always optimal; DP finds the true minimum.', tags:['r13-43','r13-46']},
    {type:'mcq', code:R`temps = [3, 1, 2, 4]
waits = [0] * 4
stack = []
for day, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        earlier = stack.pop()
        waits[earlier] = day - earlier
    stack.append(day)
print(waits)`, q:'What prints?', opts:['[3, 1, 1, 0]','[1, 1, 1, 0]','[3, 1, 2, 0]'], ans:0, why:'Day 3 (4) is the first warmer day for day 0 (3 days later), for day 2 (1 day) ; day 1 waits only until day 2.', tags:['r13-48']},
    {type:'mcq', code:R`def double(n: int) -> int:
    return n * 2

print(double("ab"))`, q:'What prints?', opts:['abab','Error','4'], ans:0, why:'Type hints are not enforced at run time.', tags:['r13-52']},
    {type:'mcq', code:R`print(max(["1.9", "1.10"], key=lambda v: tuple(int(p) for p in v.split("."))))`, q:'What prints?', opts:['1.10','1.9','Error'], ans:0, why:'Version numbers compare as number tuples: (1, 10) beats (1, 9).', tags:['r13-54']},
    {type:'mcq', code:R`import html

print(html.escape("<b>"))`, q:'What prints?', opts:['&lt;b&gt;','<b>','&amp;b&amp;'], ans:0, why:'html.escape turns the angle brackets into entities, so a browser shows the text instead of running it.', tags:['r13-56']}
  ],
  power:{can:['Predict output across Big-O, data structures, patterns, architecture and portfolio topics','Spot greedy traps and unenforced type hints'],
    expand:'Pick any wrong answer and write the bug-free version in a file of your own.',
    where:'Reading code accurately under time pressure is half of every interview.',
    next:'The Archmage waits beyond the final door.'},
  codex:{title:'Realm 13 gap check',body:'Big-O, stacks and queues, heaps and trees, BFS, caches, generators, layers and errors, two pointers, intervals, DP, greedy traps, monotonic stacks, hints, version compare and HTML escaping: all verified.',snip:R`print(sorted(items, key=lambda p: (-p[1], p[0])))`}
}
);
}
