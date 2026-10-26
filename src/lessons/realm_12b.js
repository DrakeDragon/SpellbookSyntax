// REALM 12 — THE MASTER GATE — part B (lessons 7-13: git, the time machine)
const gB07 = R`import hashlib

def blob_id(text):
    data = text.encode()
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()

a = input("Text A: ") + "\n"
b = input("Text B: ") + "\n"
id_a = blob_id(a)
id_b = blob_id(b)
print("Id A:", id_a[:7])
print("Id B:", id_b[:7])
print("Same content:", "yes" if id_a == id_b else "no")`;
const eB07 = R`import hashlib

def blob_id(text):
    data = text.encode()
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()

full = blob_id("hello\n")
print(full)
print(full[:7])
print(blob_id("hello\n") == blob_id("hello\n"), blob_id("hello\n") == blob_id("Hello\n"))`;

const gB08 = R`import hashlib, json

def make_id(parent, msg, snapshot):
    data = json.dumps([parent, msg, snapshot], sort_keys=True)
    return hashlib.sha1(data.encode()).hexdigest()[:7]

commits = []
staged = {}
for cmd in input("Commands: ").split(";"):
    cmd = cmd.strip()
    if cmd.startswith("add "):
        name, _, text = cmd[4:].partition("=")
        staged[name.strip()] = text
        print("Staged", name.strip())
    elif cmd.startswith("commit "):
        if not staged:
            print("Nothing to commit")
            continue
        parent = commits[-1][0] if commits else ""
        snapshot = dict(commits[-1][2]) if commits else {}
        snapshot.update(staged)
        cid = make_id(parent, cmd[7:], snapshot)
        commits.append((cid, cmd[7:], snapshot))
        staged = {}
        print(f"[{cid}] {cmd[7:]}")
    elif cmd == "files":
        names = sorted(commits[-1][2]) if commits else []
        print("Files:", ", ".join(names) or "none")
    elif cmd == "log":
        if not commits:
            print("No commits yet")
        for cid, msg, _ in reversed(commits):
            print(cid, msg)`;
const eB08 = R`import hashlib, json

def make_id(parent, msg, snapshot):
    data = json.dumps([parent, msg, snapshot], sort_keys=True)
    return hashlib.sha1(data.encode()).hexdigest()[:7]

snap1 = {"a": "1"}
id1 = make_id("", "first", snap1)

snap2 = dict(snap1)          # copy, then change the copy
snap2["b"] = "2"
id2 = make_id(id1, "second", snap2)

print(len(id1), len(id2), id1 != id2)
print(sorted(snap1), sorted(snap2))`;

const gB09 = R`import difflib

def line_diff(old, new):
    result = []
    matcher = difflib.SequenceMatcher(None, old, new)
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal":
            result += [("=", line) for line in old[i1:i2]]
        else:
            result += [("-", line) for line in old[i1:i2]]
            result += [("+", line) for line in new[j1:j2]]
    return result

old = [line for line in input("Old: ").split(";") if line]
new = [line for line in input("New: ").split(";") if line]
changes = line_diff(old, new)
for mark, line in changes:
    print(mark, line)
added = sum(1 for mark, _ in changes if mark == "+")
removed = sum(1 for mark, _ in changes if mark == "-")
print(f"Added: {added}, Removed: {removed}")`;
const eB09 = R`import difflib

old = ["a", "b", "c"]
new = ["a", "x", "c", "d"]
matcher = difflib.SequenceMatcher(None, old, new)
for tag, i1, i2, j1, j2 in matcher.get_opcodes():
    print(tag, old[i1:i2], new[j1:j2])
print(round(matcher.ratio(), 2))`;

const gB10 = R`def ancestors(parent, start):
    chain = []
    while start is not None:
        chain.append(start)
        start = parent.get(start)
    return chain

parent = {}
for pair in input("Graph: ").split(";"):
    if ">" in pair:
        p, _, c = pair.partition(">")
        parent[c.strip()] = p.strip()
a = input("A: ").strip()
b = input("B: ").strip()
chain_a = ancestors(parent, a)
chain_b = ancestors(parent, b)
base = next((c for c in chain_a if c in chain_b), None)
ahead_a = chain_a.index(base) if base else len(chain_a)
ahead_b = chain_b.index(base) if base else len(chain_b)
print("Merge base:", base or "none")
print("A ahead:", ahead_a)
print("B ahead:", ahead_b)
print("Fast-forward:", "yes" if base in (a, b) else "no")`;
const eB10 = R`parent = {"c2": "c1", "c3": "c2", "c4": "c2"}

def ancestors(start):
    chain = []
    while start is not None:
        chain.append(start)
        start = parent.get(start)
    return chain

print(ancestors("c3"))
print(ancestors("c4"))
common = [c for c in ancestors("c3") if c in ancestors("c4")]
print("merge base:", common[0])`;

const gB11 = R`from fnmatch import fnmatchcase

def rule_matches(pattern, path):
    parts = path.split("/")
    if pattern.endswith("/"):
        name = pattern.rstrip("/")
        return any(fnmatchcase(part, name) for part in parts[:-1])
    if "/" in pattern:
        pattern = pattern.lstrip("/")
        return fnmatchcase(path, pattern) or path.startswith(pattern.rstrip("/") + "/")
    return any(fnmatchcase(part, pattern) for part in parts)

def is_ignored(rules, path):
    ignored = False
    for rule in rules:
        negate = rule.startswith("!")
        pattern = rule[1:] if negate else rule
        if rule_matches(pattern, path):
            ignored = not negate
    return ignored

rules = [r.strip() for r in input("Rules: ").split(";") if r.strip() and not r.strip().startswith("#")]
paths = input("Paths: ").split()
count = 0
for path in paths:
    if is_ignored(rules, path):
        print("ignore", path)
        count += 1
    else:
        print("keep", path)
print(f"Ignored: {count}, kept: {len(paths) - count}")`;
const eB11 = R`from fnmatch import fnmatchcase

print(fnmatchcase("x/y.log", "*.log"), fnmatchcase("y.LOG", "*.log"))
print(fnmatchcase("data1.csv", "data?.csv"), fnmatchcase("data10.csv", "data?.csv"))
print(fnmatchcase("a.py", "[ab].py"), fnmatchcase("c.py", "[ab].py"))`;

const gB12 = R`import re

def parse_tag(tag):
    m = re.fullmatch(r"v(\d+)\.(\d+)\.(\d+)", tag)
    return tuple(int(x) for x in m.groups()) if m else None

def bump(version, kind):
    major, minor, patch = version
    if kind == "major":
        return (major + 1, 0, 0)
    if kind == "minor":
        return (major, minor + 1, 0)
    if kind == "patch":
        return (major, minor, patch + 1)
    raise ValueError(f"unknown bump {kind}")

tags = input("Tags: ").split()
kind = input("Bump: ").strip()
valid = [parse_tag(t) for t in tags if parse_tag(t)]
invalid = [t for t in tags if not parse_tag(t)]
try:
    latest = max(valid) if valid else (0, 0, 0)
    nxt = bump(latest, kind)
except ValueError as error:
    print("Error:", error)
else:
    print("Valid:", len(valid))
    print("Invalid:", " ".join(invalid) or "none")
    print("Latest:", "v%d.%d.%d" % latest if valid else "none")
    print("Next:", "v%d.%d.%d" % nxt)`;
const eB12 = R`import re

def parse_tag(tag):
    m = re.fullmatch(r"v(\d+)\.(\d+)\.(\d+)", tag)
    return tuple(int(x) for x in m.groups()) if m else None

tags = ["v1.9.9", "v1.10.0", "v1.2.3", "nightly"]
versions = [parse_tag(t) for t in tags if parse_tag(t)]
print(max(versions))
print(max(tags))
major, minor, patch = max(versions)
print(f"v{major}.{minor + 1}.0")`;

const gB13 = R`import hashlib, json

def make_id(parent, msg, snapshot):
    data = json.dumps([parent, msg, snapshot], sort_keys=True)
    return hashlib.sha1(data.encode()).hexdigest()[:7]

commits = {}
branches = {"main": None}
current = "main"
staged = {}

def history(head):
    chain = []
    while head is not None:
        chain.append(head)
        head = commits[head][0]
    return chain

for cmd in input("Commands: ").split(";"):
    cmd = cmd.strip()
    word, _, arg = cmd.partition(" ")
    arg = arg.strip()
    head = branches[current]
    if word == "add":
        name, _, text = arg.partition("=")
        staged[name.strip()] = text
        print("Staged", name.strip())
    elif word == "commit":
        if not staged:
            print("Nothing to commit")
            continue
        snapshot = dict(commits[head][2]) if head else {}
        snapshot.update(staged)
        cid = make_id(head or "", arg, snapshot)
        commits[cid] = (head, arg, snapshot)
        branches[current] = cid
        staged = {}
        print(f"[{current} {cid}] {arg}")
    elif word == "branch":
        if arg in branches:
            print("Branch exists:", arg)
        else:
            branches[arg] = head
            print("Created branch", arg)
    elif word == "checkout":
        if arg in branches:
            current = arg
            print("Switched to", arg)
        else:
            print("No such branch:", arg)
    elif word == "log":
        if head is None:
            print("No commits yet")
        for cid in history(head):
            print(cid, commits[cid][1])
    elif word == "files":
        names = sorted(commits[head][2]) if head else []
        print("Files:", ", ".join(names) or "none")
    elif word == "merge":
        if arg not in branches:
            print("No such branch:", arg)
            continue
        target = branches[arg]
        if target is None or target in history(head):
            print("Already up to date")
        elif head is None or head in history(target):
            branches[current] = target
            print(f"Fast-forwarded {current} to {target}")
        else:
            print("Cannot fast-forward")`;
const eB13 = R`branches = {"main": "x"}
branches["dev"] = branches["main"]
branches["main"] = "y"
print(branches)

commits = {"y": "x", "x": None}
head = "y"
chain = []
while head is not None:
    chain.append(head)
    head = commits[head]
print(chain)`;

LESSONS.push(
{
  id:'r12-07', realm:12, n:7, title:'Git begins: everything is a hash',
  teaches:['git-hash'], requires:['mission12a'],
  story:`"Now the great time machine," Orrin says, leading you to a vault of sealed scrolls. Each is labelled with a long strange code. "Git never names a scroll. It names it by what is **inside**. Change one letter and the name changes."`,
  concept:{
    html:`**Git** records the history of your project. Its core trick is **content addressing**: every stored object is named by the **SHA-1 hash of its content**.\n\n\`\`\`\nimport hashlib\nhashlib.sha1(b"abc").hexdigest()      # 40 hex characters\n\`\`\`\n\n- Same content always gives the **same id**; one changed character gives a **completely different** id.\n- Git hashes a small header too: \`"blob <size>\\0" + content\`. The size is the number of **bytes**, not characters (\`"é"\` is 2 bytes).\n- Hash functions need **bytes**: \`text.encode()\`.\n- Ids are shown shortened (7 characters) in daily use.\n- Two files with identical content are stored once, which is why git is so compact.\n\nSo "has this file changed?" becomes "is its hash different?"`,
    analogy:`A fingerprint for text: identical text, identical fingerprint; one typo, a stranger.`,
    example:eB07},
  predict:{code:R`import hashlib
a = hashlib.sha1(b"a").hexdigest()
print(a == hashlib.sha1(b"a").hexdigest(), a == hashlib.sha1(b"b").hexdigest())`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'Same bytes give the same hash; different bytes give a different one.'},
  cast:{code:eB07, task:'Cast it.'},
  bug:{broken:R`import hashlib
print(hashlib.sha1("hello").hexdigest()[:7])`, task:'TypeError: hashing needs bytes. Encode the text first. Expected: aaf4c61',
    cases:[{inputs:[],tests:[['Works','lines==["aaf4c61"]'],['Real hash','"hashlib" in src and "sha1" in src']]}],
    sol:R`import hashlib
print(hashlib.sha1("hello".encode()).hexdigest()[:7])`, wrong:[R`print("aaf4c61")`]},
  write:{prompt:'Write `blob_id(text)` returning the 40-character git blob id: the SHA-1 of `"blob <number of BYTES>\\0"` followed by the content, as hex. Ask `Text A: ` and `Text B: `; treat each as a file with a trailing newline added. Print `Id A: <first 7>`, `Id B: <first 7>` and `Same content: yes/no`.',
    starter:R`import hashlib

def blob_id(text):
    pass

a = input("Text A: ") + "\n"
b = input("Text B: ") + "\n"
`,
    inputs:['hello','hello'],
    cases:[{inputs:['hello','hello'],tests:[['Ids','lines[-3:]==["Id A: ce01362","Id B: ce01362","Same content: yes"]'],['Full id','g["blob_id"]("hello\\n")=="ce013625030ba8dba906f756967f9e9ca394464a"'],['Bytes not characters','g["blob_id"]("é")==__import__("hashlib").sha1(b"blob 2\\0"+"é".encode()).hexdigest()']]},{inputs:['hello','Hello'],tests:[['Different','lines[-1]=="Same content: no" and lines[-3]!=lines[-2].replace("Id B","Id A")']]},{inputs:['',''],tests:[['Empty file','lines[-3]=="Id A: 8b137891"[:11] or lines[-3].startswith("Id A: 8b13789")']]}],
    sol:gB07,
    wrong:[gB07.replace('header + data','data'),gB07.replace('len(data)','len(text)'),gB07.replace('.hexdigest()\n','.hexdigest()[:7]\n')],
    hints:['hashlib.sha1(...) needs bytes: use text.encode().','The header is f"blob {len(data)}\\0" encoded too; hash header + data together.','len(data) counts bytes (data = text.encode()), not characters.',gB07]},
  power:{can:['Explain content-addressed storage','Compute git-style blob ids with hashlib'],
    expand:'Check your function against the real `git hash-object` on your own computer.',
    where:'Git, Docker images and package lock files all identify things by hash.',
    next:'Next: staging and commits, building a commit chain.'},
  codex:{title:'Content hashes',body:'hashlib.sha1(bytes).hexdigest() gives a 40-char id. Same content, same id. Git hashes "blob <bytes>\\0" + content. Use text.encode() and count bytes.',snip:R`header = f"blob {len(data)}\0".encode()
hashlib.sha1(header + data).hexdigest()`}
},
{
  id:'r12-08', realm:12, n:8, title:'Staging and commits: the chain',
  teaches:['git-commit'], requires:['git-hash'],
  story:`"A commit is a snapshot with a **memory**," Orrin says. "Each one remembers its parent. Pull on the newest and the whole history follows like a chain."`,
  concept:{
    html:`Git's daily loop:\n\n\`\`\`\ngit add notes.txt        # put changes in the STAGING area\ngit commit -m "Add notes" # turn staged changes into a snapshot\ngit log                   # list commits, newest first\n\`\`\`\n\n- The **staging area** is a waiting room: only staged changes go into the next commit.\n- A **commit** stores: the full **snapshot** of files, a **message**, and its **parent** commit id.\n- The commit's own id is a hash of all that, so changing history changes every id after it.\n- A new snapshot starts from the **previous snapshot** and applies the staged files on top (unchanged files carry over).\n- After committing, the staging area is **empty** again. Committing with nothing staged does nothing.\n\nCareful: \`snap2 = snap1\` shares one dict. Use \`dict(snap1)\` (a copy) so old snapshots never change.`,
    analogy:`Packing a box: staging is choosing items, committing is sealing and labelling the box, each new box points to the previous one.`,
    example:eB08},
  predict:{code:R`snap1 = {"a": 1}
snap2 = dict(snap1)
snap2["b"] = 2
print(sorted(snap1), sorted(snap2))`, q:'What prints?', opts:["['a'] ['a', 'b']","['a', 'b'] ['a', 'b']","['a'] ['b']"], ans:0, why:'dict() made a copy, so snap1 is unchanged.'},
  cast:{code:eB08, task:'Cast it.'},
  bug:{broken:R`snap1 = {"a": "1"}
snap2 = snap1
snap2["b"] = "2"
print(sorted(snap1))`, task:'Making commit 2 changed commit 1 too (shared dict). Copy it. Expected: ![\'a\']'.replace('![','[').replace("\\'","'"),
    cases:[{inputs:[],tests:[['Old snapshot intact','lines==["[\'a\']"]'],['Copied','"copy" in src or "dict(" in src']]}],
    sol:R`snap1 = {"a": "1"}
snap2 = dict(snap1)
snap2["b"] = "2"
print(sorted(snap1))`, wrong:[R`print(['a'])`]},
  write:{prompt:'Build a tiny git. Ask `Commands: ` (separated by `;`). Commands: `add <file>=<text>` prints `Staged <file>`; `commit <message>` (message may contain spaces) prints `[<id>] <message>` or `Nothing to commit` when nothing is staged; `files` prints `Files: a, b` (sorted names in the latest snapshot, or `none`); `log` prints `<id> <message>` newest first, or `No commits yet`. The id is `make_id(parent_id, message, snapshot)` (provided; parent is `""` for the first commit). Each snapshot builds on the previous one, and staging is cleared by a commit.',
    starter:R`import hashlib, json

def make_id(parent, msg, snapshot):
    data = json.dumps([parent, msg, snapshot], sort_keys=True)
    return hashlib.sha1(data.encode()).hexdigest()[:7]

commits = []     # (id, message, snapshot), oldest first
staged = {}
for cmd in input("Commands: ").split(";"):
    cmd = cmd.strip()
`,
    inputs:['add a=1;commit first;add b=2;commit second;commit third;files;log'],
    cases:[{inputs:['add a=1;commit first;add b=2;commit second;commit third;files;log'],tests:[['Session','(lambda L: L[0]=="Staged a" and re.fullmatch(r"\\[[0-9a-f]{7}\\] first",L[1]) and L[2]=="Staged b" and re.fullmatch(r"\\[[0-9a-f]{7}\\] second",L[3]) and L[4]=="Nothing to commit" and L[5]=="Files: a, b" and L[6].split()[0]==L[3][1:8] and L[6].endswith(" second") and L[7].split()[0]==L[1][1:8] and L[7].endswith(" first"))(lines[-8:])']]},{inputs:['log;files'],tests:[['Empty','lines[-2:]==["No commits yet","Files: none"]']]},{inputs:['add a=1;commit x;add a=2;commit x;files;log'],tests:[['Different ids, overwrite','(lambda L: L[5]=="Files: a" and L[6].split()[0]!=L[7].split()[0])(lines[-8:])']]},{inputs:['add a=1;add b=2;commit both;files'],tests:[['Both staged','lines[-3]=="Staged b" and lines[-1]=="Files: a, b"']]},{inputs:['add a=1;commit fix the bug;log'],tests:[['Multi-word message','lines[-1].endswith(" fix the bug") and lines[-2].endswith("] fix the bug")']]},{inputs:['commit oops'],tests:[['Nothing','lines[-1]=="Nothing to commit"']]}],
    sol:gB08,
    wrong:[gB08.replace('        staged = {}\n',''),gB08.replace('dict(commits[-1][2]) if commits else {}','{}'),gB08.replace('reversed(commits)','commits'),gB08.replaceAll('cmd[7:]','cmd.split()[1]')],
    hints:['Keep a list of (id, message, snapshot). A commit copies the last snapshot with dict(...) then update(staged).','Nothing staged means print "Nothing to commit" and skip. After a commit set staged = {}.','Message = cmd[7:] (everything after "commit "). log walks reversed(commits).',gB08]},
  power:{can:['Explain staging vs committing','Build a commit chain where each snapshot builds on the last'],
    expand:'Add a `show <id>` command that prints the files of any past commit.',
    where:'Every git workflow, from solo scripts to huge teams, is this loop.',
    next:'Next: diffs, seeing exactly what changed.'},
  codex:{title:'Commits',body:'Stage with add, snapshot with commit. A commit = snapshot + message + parent id; its id hashes all of it. New snapshot = copy of old (dict(old)) + staged files. Clear staging after commit.',snip:R`snapshot = dict(commits[-1][2]) if commits else {}
snapshot.update(staged)`}
},
{
  id:'r12-09', realm:12, n:9, title:'Diffs with difflib',
  teaches:['git-diff'], requires:['git-commit'],
  story:`"Which lines did my colleague change?" The quartermaster slides two scrolls together. Red ink where words vanished, green where they appeared. "That is a **diff**. You are going to write one."`,
  concept:{
    html:`A **diff** shows the smallest set of line edits that turns the old text into the new text. Python ships the engine: \`difflib\`.\n\n\`\`\`\nimport difflib\nm = difflib.SequenceMatcher(None, old_lines, new_lines)\nfor tag, i1, i2, j1, j2 in m.get_opcodes():\n    ...    # tag: 'equal', 'delete', 'insert' or 'replace'\n\`\`\`\n\n- \`old[i1:i2]\` and \`new[j1:j2]\` are the affected slices.\n- \`equal\`: same lines. \`delete\`: only in old. \`insert\`: only in new. \`replace\`: old lines swapped for new lines.\n- \`m.ratio()\` is a similarity score from 0 to 1.\n- Sets are the **wrong tool**: they forget order and duplicates.\n- The classic text output has \`-\` for removed, \`+\` for added lines. \`difflib.unified_diff(old, new, lineterm="")\` produces the git-style version.`,
    analogy:`Track-changes in a document: strike-through for removals, underline for additions.`,
    example:eB09},
  predict:{code:R`import difflib
print(round(difflib.SequenceMatcher(None, "abcd", "abxd").ratio(), 2))`, q:'What prints?', opts:['0.75','0.5','1.0'], ans:0, why:'3 of the 4 characters match: 2*3/(4+4) = 0.75.'},
  cast:{code:eB09, task:'Cast it.'},
  bug:{broken:R`old = ["a", "b", "a"]
new = ["a", "b"]
removed = set(old) - set(new)
print(len(removed))`, task:'One "a" was removed but the set approach says 0. Count properly (sets drop duplicates). Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['Not a set','"set(" not in src and "old" in src and "new" in src']]}],
    sol:R`from collections import Counter
old = ["a", "b", "a"]
new = ["a", "b"]
removed = Counter(old) - Counter(new)
print(sum(removed.values()))`, wrong:[R`print(1)`]},
  write:{prompt:'Write `line_diff(old, new)` returning a list of `(mark, line)` tuples (`"="` same, `"-"` removed, `"+"` added) using `difflib.SequenceMatcher` opcodes (removed lines before added lines for a replace). Ask `Old: ` and `New: ` (lines separated by `;`, empty means no lines). Print each as `<mark> <line>`, then `Added: <n>, Removed: <m>`.',
    starter:R`import difflib

def line_diff(old, new):
    pass

old = [line for line in input("Old: ").split(";") if line]
new = [line for line in input("New: ").split(";") if line]
`,
    inputs:['a;b;c','a;x;c;d'],
    cases:[{inputs:['a;b;c','a;x;c;d'],tests:[['Diff','lines[-6:]==["= a","- b","+ x","= c","+ d","Added: 2, Removed: 1"]'],['Function','g["line_diff"](["a"],["b"])==[("-","a"),("+","b")]']]},{inputs:['a;a;b','a;b'],tests:[['Duplicates','lines[-4:]==["- a","= a","= b","Added: 0, Removed: 1"]']]},{inputs:['a;b','a;b'],tests:[['Same','lines[-3:]==["= a","= b","Added: 0, Removed: 0"]']]},{inputs:['','x;y'],tests:[['New file','lines[-3:]==["+ x","+ y","Added: 2, Removed: 0"]']]},{inputs:['x',''],tests:[['Deleted file','lines[-2:]==["- x","Added: 0, Removed: 1"]']]}],
    sol:gB09,
    wrong:[gB09.replace('result += [("=", line) for line in old[i1:i2]]','pass'),gB09.replace('("-", line) for line in old','("+", line) for line in old'),gB09.replace('SequenceMatcher(None, old, new)','SequenceMatcher(None, sorted(old), sorted(new))')],
    hints:['Loop over matcher.get_opcodes(); each gives tag and the slices old[i1:i2], new[j1:j2].','For "equal" emit ("=", line) for old[i1:i2]; otherwise emit "-" lines from old[i1:i2], then "+" lines from new[j1:j2].','Count marks with sum(1 for mark, _ in changes if mark == "+").',gB09]},
  power:{can:['Produce a line-by-line diff of two texts','Use SequenceMatcher opcodes'],
    expand:'Switch to `difflib.unified_diff` to print git-style `@@` hunks.',
    where:'Code review tools, merge tools and "compare documents" features are all diffs.',
    next:'Next: branches and the merge base.'},
  codex:{title:'difflib',body:'SequenceMatcher(None, a, b).get_opcodes() yields (tag, i1, i2, j1, j2) with tags equal/delete/insert/replace. ratio() is similarity 0-1. Do not use sets for diffs: they lose order and duplicates.',snip:R`for tag, i1, i2, j1, j2 in matcher.get_opcodes():
    ...`}
},
{
  id:'r12-10', realm:12, n:10, title:'Branches and the merge base',
  teaches:['git-branch'], requires:['git-diff'],
  story:`"A branch is just a **sticky note** on a commit," Orrin laughs, pointing at a tree of scrolls. "Two notes, two futures. Before they can join, you must find where they last agreed."`,
  concept:{
    html:`A **branch** is only a **name pointing at a commit**. Creating one costs nothing.\n\n\`\`\`\n c1 - c2 - c3          <- main\n        \\\n         c4 - c5       <- feature\n\`\`\`\n\n- Each commit knows only its **parent**, so history is a chain you walk **backwards**: \`while c is not None: c = parent.get(c)\`.\n- The **merge base** is the **nearest common ancestor** of two branches: the last commit they share (here, \`c2\`).\n- "Ahead by N" = how many commits you must walk back from the tip to reach the merge base.\n- If the merge base **is** one of the tips, that branch can simply slide forward: a **fast-forward**. Otherwise real merging is needed.\n- Store the graph as a dict \`{child: parent}\`. \`.get(c)\` returns \`None\` at the root, which ends the walk.`,
    analogy:`Two hikers who split at a fork: the fork is the merge base, each hiker is some steps ahead.`,
    example:eB10},
  predict:{code:R`parent = {"b": "a"}
print(parent.get("a"), parent.get("b"))`, q:'What prints?', opts:['None a','a None','KeyError'], ans:0, why:'"a" is the root (no parent), "b" has parent "a". .get avoids KeyError.'},
  cast:{code:eB10, task:'Cast it.'},
  bug:{broken:R`parent = {"c2": "c1", "c3": "c2"}
start = "c3"
chain = []
while start:
    chain.append(start)
    start = parent[start]
print(chain)`, task:"KeyError at the root commit. Use .get so the walk ends. Expected: ['c3', 'c2', 'c1']",
    cases:[{inputs:[],tests:[['Works','lines==["[\'c3\', \'c2\', \'c1\']"]'],['Uses graph','"parent" in src and ("get" in src or " in parent" in src)']]}],
    sol:R`parent = {"c2": "c1", "c3": "c2"}
start = "c3"
chain = []
while start:
    chain.append(start)
    start = parent.get(start)
print(chain)`, wrong:[R`print(['c3', 'c2', 'c1'])`]},
  write:{prompt:'Ask `Graph: ` (pairs `parent>child` separated by `;`; each commit has at most one parent), then `A: ` and `B: ` (two branch tips). Print `Merge base: <nearest common ancestor or none>`, `A ahead: <n>`, `B ahead: <n>` (commits between the tip and the base, not counting the base; if there is no base, the whole chain length) and `Fast-forward: yes/no` (yes when the base is one of the two tips).',
    starter:R`parent = {}
for pair in input("Graph: ").split(";"):
    pass
a = input("A: ").strip()
b = input("B: ").strip()
`,
    inputs:['c1>c2;c2>c3;c2>c4','c3','c4'],
    cases:[{inputs:['c1>c2;c2>c3;c2>c4','c3','c4'],tests:[['Diverged','lines[-4:]==["Merge base: c2","A ahead: 1","B ahead: 1","Fast-forward: no"]']]},{inputs:['c1>c2;c2>c3;c3>c4','c2','c4'],tests:[['Fast-forward','lines[-4:]==["Merge base: c2","A ahead: 0","B ahead: 2","Fast-forward: yes"]']]},{inputs:['c1>c2;c2>c3;c3>c4','c4','c2'],tests:[['Reverse FF','lines[-4:]==["Merge base: c2","A ahead: 2","B ahead: 0","Fast-forward: yes"]']]},{inputs:['a>b;x>y','b','y'],tests:[['Unrelated','lines[-4:]==["Merge base: none","A ahead: 2","B ahead: 2","Fast-forward: no"]']]},{inputs:['a>b','b','b'],tests:[['Same tip','lines[-4:]==["Merge base: b","A ahead: 0","B ahead: 0","Fast-forward: yes"]']]},{inputs:['r>a;a>b;b>c;a>d;d>e','c','e'],tests:[['Deeper','lines[-4:]==["Merge base: a","A ahead: 2","B ahead: 2","Fast-forward: no"]']]}],
    sol:gB10,
    wrong:[gB10.replace('for c in chain_a if','for c in reversed(chain_a) if'),gB10.replace('chain_a.index(base) if base','chain_a.index(base) + 1 if base'),gB10.replace('base in (a, b)','base == a')],
    hints:['Build parent[child] = parent from each "p>c" pair, then write ancestors(start): walk with parent.get until None.','The merge base is the first commit in A\'s chain (tip first) that also appears in B\'s chain.','Ahead = chain.index(base) (or len(chain) with no base). Fast-forward when base is a or b.',gB10]},
  power:{can:['Model branches as names pointing at commits','Find the merge base and tell when a fast-forward is possible'],
    expand:'Let commits have two parents (a real merge commit) and rework ancestors().',
    where:'Every pull request starts by finding the merge base of your branch and main.',
    next:'Next: .gitignore rules with fnmatch.'},
  codex:{title:'Branches',body:'A branch is a name pointing to a commit. History = parent links walked backwards. Merge base = nearest common ancestor. If the base is a tip, a merge is just a fast-forward.',snip:R`base = next((c for c in chain_a if c in chain_b), None)`}
},
{
  id:'r12-11', realm:12, n:11, title:'.gitignore rules with fnmatch',
  teaches:['git-ignore'], requires:['git-branch'],
  story:`"Some scrolls must never enter the vault," Orrin warns: "secret keys, build dust, your cat's footprints. A list of **ignore rules** stands guard at the door."`,
  concept:{
    html:`A \`.gitignore\` lists patterns of files git must not track. Pattern matching uses **wildcards** (not regex), available in \`fnmatch\`:\n\n| Wildcard | Matches |\n|---|---|\n| \`*\` | any characters |\n| \`?\` | exactly one character |\n| \`[ab]\` | one of the listed characters |\n\n\`\`\`\nfrom fnmatch import fnmatchcase     # case-sensitive (fnmatch.fnmatch depends on the OS)\nfnmatchcase("app.log", "*.log")     # True\n\`\`\`\n\nRules (simplified):\n\n- Blank lines and lines starting with \`#\` are ignored.\n- \`*.pyc\`, \`.env\`, \`node_modules\` (no slash): match **any path component** anywhere.\n- \`build/\` (trailing slash): matches a **directory** of that name anywhere, so everything inside it.\n- \`/build\` or \`docs/*.md\` (slash inside or at the start): matched against the **path from the project root**.\n- \`!keep.log\` **un-ignores**. The **last matching rule wins**, so order matters.`,
    analogy:`A bouncer with a list: names on it are turned away, a "!" line means "except this one".`,
    example:eB11},
  predict:{code:R`from fnmatch import fnmatchcase
print(fnmatchcase("x/y.log", "*.log"), fnmatchcase("y.LOG", "*.log"))`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'* also matches "/" in fnmatch; fnmatchcase is case-sensitive.'},
  cast:{code:eB11, task:'Cast it.'},
  bug:{broken:R`path = "app.log"
pattern = "*.log"
print(pattern in path)`, task:'A wildcard is not a substring! Use fnmatch. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Uses fnmatch','"fnmatch" in src']]}],
    sol:R`from fnmatch import fnmatch
path = "app.log"
pattern = "*.log"
print(fnmatch(path, pattern))`, wrong:[R`print(True)`]},
  write:{prompt:'Write `is_ignored(rules, path)` (rules = list of pattern strings) following the rules above: trailing-slash rules match a parent directory component, rules with another slash match from the root (a leading `/` is removed; a rule also covers everything inside a matching directory), other rules match any path component; `!` un-ignores; the last matching rule decides. Ask `Rules: ` (separated by `;`, skip blank and `#` lines) and `Paths: ` (space-separated). Print `ignore <path>` or `keep <path>` for each, then `Ignored: <n>, kept: <m>`.',
    starter:R`from fnmatch import fnmatchcase

def is_ignored(rules, path):
    pass

rules = [r.strip() for r in input("Rules: ").split(";") if r.strip() and not r.strip().startswith("#")]
paths = input("Paths: ").split()
`,
    inputs:['*.pyc;__pycache__/;/build;node_modules;docs/*.md;!docs/keep.md;.env','main.py app/util.pyc __pycache__/x.py src/__pycache__/y.txt build/out.o src/build/x.py web/node_modules/a.js docs/a.md docs/keep.md .env config/.env'],
    cases:[{inputs:['*.pyc;__pycache__/;/build;node_modules;docs/*.md;!docs/keep.md;.env','main.py app/util.pyc __pycache__/x.py src/__pycache__/y.txt build/out.o src/build/x.py web/node_modules/a.js docs/a.md docs/keep.md .env config/.env'],tests:[['Rules','lines[-12:]==["keep main.py","ignore app/util.pyc","ignore __pycache__/x.py","ignore src/__pycache__/y.txt","ignore build/out.o","keep src/build/x.py","ignore web/node_modules/a.js","ignore docs/a.md","keep docs/keep.md","ignore .env","ignore config/.env","Ignored: 8, kept: 3"]'],['Function','g["is_ignored"](["*.log","!keep.log"],"keep.log") is False and g["is_ignored"](["*.log"],"a/b.log") is True']]},{inputs:['#c;*.log;;!a.log;*.log','a.log b.txt'],tests:[['Order matters, comments skipped','lines[-3:]==["ignore a.log","keep b.txt","Ignored: 1, kept: 1"]']]},{inputs:['','a b'],tests:[['No rules','lines[-3:]==["keep a","keep b","Ignored: 0, kept: 2"]']]},{inputs:['dist/','dist dist/x pkg/dist/y'],tests:[['Directory rule needs a parent dir','lines[-4:]==["keep dist","ignore dist/x","ignore pkg/dist/y","Ignored: 2, kept: 1"]']]}],
    sol:gB11,
    wrong:[gB11.replace('ignored = not negate','ignored = True'),gB11.replace('if "/" in pattern:','if "/" in pattern.strip("/"):'),gB11.replace('any(fnmatchcase(part, pattern) for part in parts)','fnmatchcase(parts[-1], pattern)'),gB11.replace('parts[:-1]','parts')],
    hints:['Split the path into components with path.split("/"). Check each rule in order and keep a running ignored flag.','Rule kinds: ends with "/" -> match parent directories only; contains "/" -> match from root (lstrip "/", also match path.startswith(pattern + "/")); else any component.','A rule starting with "!" sets ignored = False when it matches; otherwise True. The last matching rule wins.',gB11]},
  power:{can:['Write wildcard matching rules with fnmatch','Apply ordered rules where the last match wins'],
    expand:'Support `**` (any number of directories) in patterns.',
    where:'.gitignore, .dockerignore and build-tool exclude lists all work this way.',
    next:'Next: semantic version tags.'},
  codex:{title:'fnmatch rules',body:'fnmatchcase(name, pattern): * any chars, ? one char, [ab] set. Case-sensitive. Ignore rules: ordered, last match wins, ! un-ignores, trailing / = directory, slash = anchored to root.',snip:R`from fnmatch import fnmatchcase
fnmatchcase("app.log", "*.log")`}
},
{
  id:'r12-12', realm:12, n:12, title:'Version tags and semantic versioning',
  teaches:['git-semver'], requires:['git-ignore'],
  story:`"Release day," Orrin says, hanging a brass tag on a finished scroll: **v1.4.2**. "Those three numbers promise things to everyone who uses your work. Learn what each one means."`,
  concept:{
    html:`A git **tag** names a release commit. The convention is **semantic versioning**: \`vMAJOR.MINOR.PATCH\`.\n\n| Bump | When | Result |\n|---|---|---|\n| **major** | breaking change | \`1.4.2 -> 2.0.0\` |\n| **minor** | new feature, still compatible | \`1.4.2 -> 1.5.0\` |\n| **patch** | bug fix only | \`1.4.2 -> 1.4.3\` |\n\nBumping a number **resets** every number to its right to 0.\n\n- Parse with a strict regex: \`re.fullmatch(r"v(\\d+)\\.(\\d+)\\.(\\d+)", tag)\`. \`fullmatch\` rejects extras like \`v1.2.3-rc1\`.\n- Compare versions as **integer tuples**, never as text: \`"v1.9.9" > "v1.10.0"\` is wrongly True.\n- Tags that don't match (like \`nightly\`) are simply not versions: ignore them but report them.`,
    analogy:`Edition numbers on a book: new chapter = new minor edition, rewritten book = new major.`,
    example:eB12},
  predict:{code:R`print((1, 10, 0) > (1, 9, 9), "v1.10.0" > "v1.9.9")`, q:'What prints?', opts:['True False','True True','False True'], ans:0, why:'Tuples compare numbers; strings compare character by character ("1" < "9").'},
  cast:{code:eB12, task:'Cast it.'},
  bug:{broken:R`major, minor, patch = 1, 4, 7
print(f"v{major}.{minor + 1}.{patch}")`, task:'A minor bump must reset the patch number to 0. Expected: v1.5.0',
    cases:[{inputs:[],tests:[['Works','lines==["v1.5.0"]'],['Real bump','"minor + 1" in src']]}],
    sol:R`major, minor, patch = 1, 4, 7
print(f"v{major}.{minor + 1}.0")`, wrong:[R`print("v1.5.0")`]},
  write:{prompt:'Ask `Tags: ` (space-separated git tags) and `Bump: ` (`major`, `minor` or `patch`). A valid tag is exactly `v<int>.<int>.<int>`. If the bump word is unknown print only `Error: unknown bump <word>`. Otherwise print `Valid: <count>`, `Invalid: <invalid tags space-separated, or none>`, `Latest: <highest valid tag or none>` and `Next: <latest bumped; with no valid tags start from v0.0.0>`.',
    starter:R`import re

tags = input("Tags: ").split()
kind = input("Bump: ").strip()
`,
    inputs:['v1.2.3 v1.10.4 v1.9.9 beta 1.2.3 v2.0 v1.2.3-rc1','minor'],
    cases:[{inputs:['v1.2.3 v1.10.4 v1.9.9 beta 1.2.3 v2.0 v1.2.3-rc1','minor'],tests:[['Minor','lines[-4:]==["Valid: 3","Invalid: beta 1.2.3 v2.0 v1.2.3-rc1","Latest: v1.10.4","Next: v1.11.0"]']]},{inputs:['v1.2.3 v1.10.4 v1.9.9','major'],tests:[['Major','lines[-2:]==["Latest: v1.10.4","Next: v2.0.0"]']]},{inputs:['v1.2.3 v1.10.4 v1.9.9','patch'],tests:[['Patch','lines[-3:]==["Invalid: none","Latest: v1.10.4","Next: v1.10.5"]']]},{inputs:['','patch'],tests:[['No tags','lines[-4:]==["Valid: 0","Invalid: none","Latest: none","Next: v0.0.1"]']]},{inputs:['nightly','minor'],tests:[['Only junk','lines[-4:]==["Valid: 0","Invalid: nightly","Latest: none","Next: v0.1.0"]']]},{inputs:['v1.0.0','huge'],tests:[['Bad bump','lines[-1]=="Error: unknown bump huge" and not any(l.startswith("Valid") for l in lines)']]}],
    sol:gB12,
    wrong:[gB12.replace('(major, minor + 1, 0)','(major, minor + 1, patch)'),gB12.replace('re.fullmatch','re.match'),gB12.replace('max(valid)','max(valid, key=str)')],
    hints:['parse_tag: re.fullmatch(r"v(\\d+)\\.(\\d+)\\.(\\d+)", tag) then tuple(int(x) for x in m.groups()), or None.','Latest = max of the tuples (starts from (0, 0, 0) with no tags). Compare tuples, not strings.','bump: major -> (M+1,0,0); minor -> (M,m+1,0); patch -> (M,m,p+1). Unknown -> raise ValueError and print the Error line instead.',gB12]},
  power:{can:['Parse and compare semantic version tags','Compute the next release number'],
    expand:'Add `rc` pre-release tags (v1.2.3-rc1 sorts before v1.2.3).',
    where:'Release scripts and CI pipelines compute the next version this way.',
    next:'Next: Real-World Mission: your own mini-git.'},
  codex:{title:'Semantic versions',body:'vMAJOR.MINOR.PATCH. Bump resets the numbers to its right. Parse with re.fullmatch, compare as int tuples, never as text.',snip:R`m = re.fullmatch(r"v(\d+)\.(\d+)\.(\d+)", tag)`}
},
{
  id:'r12-13', realm:12, n:13, title:'Real-World Mission: Mini-Git',
  teaches:['mission12b'], requires:['git-semver'],
  story:`Orrin crosses his arms. "Everything you've learned: hashes, commits, branches. Put them in one machine. A working version-control system, small enough to fit in your head. Build it, and git will never be magic again."`,
  concept:{
    html:`Your mini-git has a few moving parts:\n\n- \`commits\`: dict \`{id: (parent, message, snapshot)}\`\n- \`branches\`: dict \`{name: head commit id}\` (\`None\` before the first commit)\n- \`current\`: the checked-out branch name; \`staged\`: files waiting to be committed\n\nCommands and rules:\n\n- \`commit\` moves **only the current branch** to the new commit.\n- \`branch x\` creates a name at the current commit; \`checkout x\` switches (staged files stay staged).\n- \`merge x\` (fast-forward only):\n  - target is the same as, or an ancestor of, the current head: **Already up to date**\n  - current head is an ancestor of the target: move the branch: **Fast-forwarded**\n  - otherwise: **Cannot fast-forward**\n- Walk history with \`while head is not None: head = commits[head][0]\`.\n\nThis is genuinely how git works inside.`,
    analogy:`A train network: branches are tracks, commits are stations, a fast-forward is a train sliding down a track that has no junction.`,
    example:eB13},
  predict:{code:R`branches = {"main": "x"}
branches["dev"] = branches["main"]
branches["main"] = "y"
print(branches)`, q:'What prints?', opts:["{'main': 'y', 'dev': 'x'}","{'main': 'y', 'dev': 'y'}","{'main': 'x', 'dev': 'x'}"], ans:0, why:'dev copied the id "x" when it was created; moving main later does not move dev.'},
  cast:{code:eB13, task:'Cast it.'},
  bug:{broken:R`branches = {"main": "c1"}
current = "main"
branches["dev"] = "c1"
branches["main"] = "c2"
print(branches["dev"])`, task:'We wanted the commit to move only the CURRENT branch (dev), but it moved main. Fix it so the output is: c2',
    cases:[{inputs:[],tests:[['Works','lines==["c2"]'],['Uses current','"branches[current]" in src']]}],
    sol:R`branches = {"main": "c1"}
current = "dev"
branches["dev"] = "c1"
branches[current] = "c2"
print(branches["dev"])`, wrong:[R`print("c2")`]},
  write:{prompt:'Build mini-git. Ask `Commands: ` (separated by `;`). Start on branch `main` with no commits. Commands and exact outputs: `add f=text` -> `Staged f`; `commit msg` -> `[<branch> <id>] msg` (id = `make_id(parent, msg, snapshot)`, parent `""` at the root) or `Nothing to commit`; `branch n` -> `Created branch n` or `Branch exists: n`; `checkout n` -> `Switched to n` or `No such branch: n`; `log` -> `<id> <msg>` newest first for the current branch, or `No commits yet`; `files` -> `Files: a, b` / `Files: none`; `merge n` -> `Already up to date`, `Fast-forwarded <current> to <id>`, `Cannot fast-forward`, or `No such branch: n`.',
    starter:R`import hashlib, json

def make_id(parent, msg, snapshot):
    data = json.dumps([parent, msg, snapshot], sort_keys=True)
    return hashlib.sha1(data.encode()).hexdigest()[:7]

commits = {}
branches = {"main": None}
current = "main"
staged = {}
for cmd in input("Commands: ").split(";"):
    cmd = cmd.strip()
`,
    inputs:['add a=1;commit one;branch dev;checkout dev;add b=2;commit two;log;checkout main;log;files;merge dev;files;log'],
    cases:[{inputs:['add a=1;commit one;branch dev;checkout dev;add b=2;commit two;log;checkout main;log;files;merge dev;files;log'],tests:[['Full flow','(lambda L: L[0]=="Staged a" and L[1].startswith("[main ") and L[1].endswith("] one") and L[2]=="Created branch dev" and L[3]=="Switched to dev" and L[4]=="Staged b" and L[5].startswith("[dev ") and L[5].endswith("] two") and L[6].split()[0]==L[5].split()[1][:-1] and L[6].endswith(" two") and L[7].split()[0]==L[1].split()[1][:-1] and L[7].endswith(" one") and L[8]=="Switched to main" and L[9]==L[7] and L[10]=="Files: a" and L[11]=="Fast-forwarded main to "+L[6].split()[0] and L[12]=="Files: a, b" and L[13]==L[6] and L[14]==L[7])(lines[-15:])']]},{inputs:['add a=1;commit one;branch dev;add b=1;commit main2;checkout dev;add c=1;commit dev2;merge main'],tests:[['Diverged','lines[-1]=="Cannot fast-forward"']]},{inputs:['add a=1;commit one;branch dev;merge dev'],tests:[['Equal','lines[-1]=="Already up to date"']]},{inputs:['add a=1;commit one;branch dev;checkout dev;add b=1;commit two;merge main'],tests:[['Target behind','lines[-1]=="Already up to date"']]},{inputs:['merge zzz;checkout zzz;branch main'],tests:[['Unknown names','lines[-3:]==["No such branch: zzz","No such branch: zzz","Branch exists: main"]']]},{inputs:['log;files;commit nope'],tests:[['Empty repo','lines[-3:]==["No commits yet","Files: none","Nothing to commit"]']]},{inputs:['add a=1;commit one;commit two'],tests:[['Staging cleared','lines[-1]=="Nothing to commit"']]},{inputs:['add a=1;commit one;branch dev;checkout dev;add b=1;commit two;checkout main;add c=1;commit three;files;log'],tests:[['Branches are independent','(lambda L: L[0]=="Files: a, c" and L[1].endswith(" three") and L[2].endswith(" one"))(lines[-3:])']]}],
    sol:gB13,
    wrong:[gB13.replace('branches[current] = cid','branches["main"] = cid'),gB13.replace('head in history(target)','True'),gB13.replace('        staged = {}\n',''),gB13.replace('dict(commits[head][2]) if head else {}','{}')],
    hints:['State: commits {id: (parent, msg, snapshot)}, branches {name: head}, current, staged. head = branches[current] at the top of each command.','commit: snapshot = copy of head snapshot + staged; branches[current] = new id; clear staged. branch/checkout just manage the names.','merge: target = branches[n]. If target is None or in history(head) -> up to date; elif head is None or head in history(target) -> fast-forward; else cannot.',gB13]},
  power:{can:['Explain how git branches, commits and merges work internally','Build a working version-control model from scratch'],
    expand:'Add a `tag <name>` command and make `log` show tags next to commit ids.',
    where:'This is the mental model behind every git command you will ever type.',
    next:'Next: Realm 12 continues with testing: proving your code works.'},
  codex:{title:'Mini-Git',body:'commits {id:(parent,msg,snapshot)}; branches {name:head}; commit moves only the current branch; fast-forward when head is an ancestor of target; walk parents with a while loop.',snip:R`branches[current] = cid
staged = {}`}
}
);
