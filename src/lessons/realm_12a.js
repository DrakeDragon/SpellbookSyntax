// REALM 12 — THE MASTER GATE — part A (lessons 1-6: environments and dependencies)
LESSONS.push(
{
  id:'r12-01', realm:12, n:1, title:'Virtual environments: a clean room per project',
  teaches:['env-venv'], requires:['realm11-gap'],
  story:`Master Gatewright Orrin swings the great doors wide. Beyond them lies the **Professional Toolbox**. "Before any tool," he says, "a clean workbench. Two projects needing two different versions of the same library will fight each other, unless each has its **own room**."`,
  concept:{
    html:`A **virtual environment** (venv) is a private folder holding its own Python and its own installed packages, so projects never clash.\n\n\`\`\`\npython -m venv .venv            # create it (once per project)\nsource .venv/bin/activate       # activate (Windows: .venv\\Scripts\\activate)\npip install requests            # installs into .venv only\ndeactivate                      # leave it\n\`\`\`\n\n- Every venv contains a small text file, **\`pyvenv.cfg\`**, with \`key = value\` lines:\n\n\`\`\`\nhome = /usr/bin\nversion = 3.12.7\ninclude-system-site-packages = false\n\`\`\`\n\n- Inside Python you can ask where you are: \`sys.prefix\` is the active environment; \`sys.base_prefix\` is the Python it was made from. **They differ inside a venv.**\n- Put \`.venv/\` in \`.gitignore\`; never commit it. Share \`requirements.txt\` instead (next lessons).\n- Rule of thumb: **one venv per project**, created at the start.\n\nIn this Spellbook you can't create a real venv, but you can write the **tools that read** these files, which is what real programs do.`,
    analogy:`A separate toolbox for each job, so the plumber's wrench never ends up in the electrician's kit.`,
    example:R`cfg = """home = /usr/bin
version = 3.12.7
include-system-site-packages = false
"""
settings = {}
for line in cfg.splitlines():
    if "=" in line:
        key, _, value = line.partition("=")
        settings[key.strip()] = value.strip()
print(settings["version"])
print(settings)

def in_venv(prefix, base_prefix):
    return prefix != base_prefix
print(in_venv("/proj/.venv", "/usr"), in_venv("/usr", "/usr"))`},
  predict:{code:R`line = "version = 3.12.7"
key, _, value = line.partition("=")
print(repr(key), repr(value))`, q:'What prints?', opts:["'version ' ' 3.12.7'","'version' '3.12.7'","'version = 3.12.7' ''"], ans:0, why:'partition splits at the first = and keeps the spaces, so strip() them.'},
  cast:{code:R`cfg = """home = /usr/bin
version = 3.12.7
include-system-site-packages = false
"""
settings = {}
for line in cfg.splitlines():
    if "=" in line:
        key, _, value = line.partition("=")
        settings[key.strip()] = value.strip()
print(settings["version"])
print(settings)

def in_venv(prefix, base_prefix):
    return prefix != base_prefix
print(in_venv("/proj/.venv", "/usr"), in_venv("/usr", "/usr"))`, task:'Cast it.'},
  bug:{broken:R`cfg = "home = /usr/bin\nversion = 3.12.7"
settings = {}
for line in cfg.splitlines():
    key, value = line.split("=")
    settings[key] = value
print(settings["version"])`, task:'KeyError: the spaces around = stay in the key and value. Strip both. Expected: 3.12.7',
    cases:[{inputs:[],tests:[['Works','lines==["3.12.7"]'],['strip','"strip" in src']]}],
    sol:R`cfg = "home = /usr/bin\nversion = 3.12.7"
settings = {}
for line in cfg.splitlines():
    key, value = line.split("=")
    settings[key.strip()] = value.strip()
print(settings["version"])`, wrong:[R`print("3.12.7")`]},
  write:{prompt:'Write `parse_cfg(text)` returning a dict from `key = value` lines (ignore blank lines and lines starting with `#`; values may contain `=`; strip spaces) and `in_venv(prefix, base_prefix)`. Ask `Config: ` (lines separated by `;`), `Prefix: ` and `Base: `. Print `Python: <version or unknown>`, `System packages: yes/no` (the `include-system-site-packages` key, `true` means yes; missing means no), `Keys: <count>`, and `In venv: yes/no`.',
    starter:R`def parse_cfg(text):
    pass

text = input("Config: ").replace(";", "\n")
prefix = input("Prefix: ")
base = input("Base: ")
`,
    inputs:['home = /usr/bin;version = 3.12.7;include-system-site-packages = false','/proj/.venv','/usr'],
    cases:[{inputs:['home = /usr/bin;version = 3.12.7;include-system-site-packages = false','/proj/.venv','/usr'],tests:[['Venv','lines[-4:]==["Python: 3.12.7","System packages: no","Keys: 3","In venv: yes"]'],['parse_cfg','g["parse_cfg"]("a = b=c\\n# x\\n\\n d=1")=={"a":"b=c","d":"1"}'],['in_venv','g["in_venv"]("/a","/b") is True and g["in_venv"]("/a","/a") is False']]},{inputs:['# x = y;version=3.11;include-system-site-packages = true','/usr','/usr'],tests:[['System yes','lines[-4:]==["Python: 3.11","System packages: yes","Keys: 2","In venv: no"]']]},{inputs:['','/x','/x'],tests:[['Empty','lines[-4:]==["Python: unknown","System packages: no","Keys: 0","In venv: no"]']]},{inputs:['home = /h;;nokey','/v','/b'],tests:[['Lines without = are skipped','lines[-4:]==["Python: unknown","System packages: no","Keys: 1","In venv: yes"]']]}],
    sol:R`def parse_cfg(text):
    settings = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        settings[key.strip()] = value.strip()
    return settings

def in_venv(prefix, base_prefix):
    return prefix != base_prefix

text = input("Config: ").replace(";", "\n")
prefix = input("Prefix: ")
base = input("Base: ")
cfg = parse_cfg(text)
print("Python:", cfg.get("version", "unknown"))
print("System packages:", "yes" if cfg.get("include-system-site-packages") == "true" else "no")
print("Keys:", len(cfg))
print("In venv:", "yes" if in_venv(prefix, base) else "no")`,
    wrong:[R`def parse_cfg(text):
    settings = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=")
        settings[key.strip()] = value.strip()
    return settings

def in_venv(prefix, base_prefix):
    return prefix != base_prefix

text = input("Config: ").replace(";", "\n")
prefix = input("Prefix: ")
base = input("Base: ")
cfg = parse_cfg(text)
print("Python:", cfg.get("version", "unknown"))
print("System packages:", "yes" if cfg.get("include-system-site-packages") == "true" else "no")
print("Keys:", len(cfg))
print("In venv:", "yes" if in_venv(prefix, base) else "no")`, R`def parse_cfg(text):
    settings = {}
    for line in text.splitlines():
        line = line.strip()
        if not line or "=" not in line:
            continue
        key, _, value = line.partition("=")
        settings[key.strip()] = value.strip()
    return settings

def in_venv(prefix, base_prefix):
    return prefix != base_prefix

text = input("Config: ").replace(";", "\n")
prefix = input("Prefix: ")
base = input("Base: ")
cfg = parse_cfg(text)
print("Python:", cfg.get("version", "unknown"))
print("System packages:", "yes" if cfg.get("include-system-site-packages") == "true" else "no")
print("Keys:", len(cfg))
print("In venv:", "yes" if in_venv(prefix, base) else "no")`],
    hints:['For each stripped line: skip blank lines, lines starting with "#", and lines with no "=".','line.partition("=") splits at the first = only, so values may contain =. strip() key and value.','Then use cfg.get("version", "unknown") and compare include-system-site-packages to "true".','def parse_cfg(text):\n    settings = {}\n    for line in text.splitlines():\n        line = line.strip()\n        if not line or line.startswith("#") or "=" not in line:\n            continue\n        key, _, value = line.partition("=")\n        settings[key.strip()] = value.strip()\n    return settings\n\ndef in_venv(prefix, base_prefix):\n    return prefix != base_prefix\n\ntext = input("Config: ").replace(";", "\\n")\nprefix = input("Prefix: ")\nbase = input("Base: ")\ncfg = parse_cfg(text)\nprint("Python:", cfg.get("version", "unknown"))\nprint("System packages:", "yes" if cfg.get("include-system-site-packages") == "true" else "no")\nprint("Keys:", len(cfg))\nprint("In venv:", "yes" if in_venv(prefix, base) else "no")']},
  power:{can:['Explain why every project gets its own virtual environment','Read key = value config files and detect a venv'],
    expand:'Print `sys.prefix` and `sys.base_prefix` yourself in the Sandbox and compare them.',
    where:'Every professional Python project starts with python -m venv .venv.',
    next:'Next: requirements.txt, the shopping list of a project.'},
  codex:{title:'Virtual environments',body:'python -m venv .venv, activate, pip install inside it. pyvenv.cfg holds key = value settings. sys.prefix != sys.base_prefix inside a venv. Never commit .venv.',snip:R`key, _, value = line.partition("=")
settings[key.strip()] = value.strip()`}
},
{
  id:'r12-02', realm:12, n:2, title:'requirements.txt: the shopping list',
  teaches:['env-req'], requires:['env-venv'],
  story:`"Your colleague downloads your project and it explodes," Orrin says. "Why? She has different library versions. A **requirements file** pins the exact shopping list, so everyone builds the same thing."`,
  concept:{
    html:`\`requirements.txt\` lists the packages a project needs, one per line:\n\n\`\`\`\n# web stuff\nrequests==2.31.0\nflask>=2.3,<3.0\npandas            # any version\npytest~=8.1       # compatible release: >=8.1, <9\n\n-r dev-requirements.txt   # include another file\n\`\`\`\n\n- \`pip install -r requirements.txt\` installs them all. \`pip freeze > requirements.txt\` writes the exact versions currently installed.\n- Lines: **name**, optional **extras** (\`requests[security]\`), optional **version specifier**, optional trailing \`# comment\`.\n- Blank lines and lines starting with \`#\` are ignored. Lines starting with \`-\` are options (like \`-r\`).\n- **Pinned** (\`==\`) = reproducible builds. **Ranges** = flexible but may surprise you.\n\nParsing one line:\n\n\`\`\`\nimport re\nm = re.match(r"^([A-Za-z0-9_.-]+)(\\[.*\\])?\\s*(.*)$", "flask>=2.3,<3.0")\nname, extras, spec = m.groups()    # 'flask', None, '>=2.3,<3.0'\n\`\`\``,
    analogy:`A recipe card: exact ingredients and amounts so anyone can cook the same dish.`,
    example:R`import re

text = """# web stuff
requests==2.31.0
flask>=2.3,<3.0
pandas   # any version

-r dev.txt
"""
for raw in text.splitlines():
    line = raw.split("#")[0].strip()
    if not line or line.startswith("-"):
        continue
    m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*\])?\s*(.*)$", line)
    name, extras, spec = m.groups()
    print(name.lower(), "|", spec or "any")`},
  predict:{code:R`line = "pandas   # any version"
print(repr(line.split("#")[0].strip()))`, q:'What prints?', opts:["'pandas'","'pandas   '","'pandas   # any version'"], ans:0, why:'Cut at # then strip the spaces.'},
  cast:{code:R`import re

text = """# web stuff
requests==2.31.0
flask>=2.3,<3.0
pandas   # any version

-r dev.txt
"""
for raw in text.splitlines():
    line = raw.split("#")[0].strip()
    if not line or line.startswith("-"):
        continue
    m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*\])?\s*(.*)$", line)
    name, extras, spec = m.groups()
    print(name.lower(), "|", spec or "any")`, task:'Cast it.'},
  bug:{broken:R`lines = ["requests==2.31.0", "# comment", ""]
for line in lines:
    name, version = line.split("==")
    print(name, version)`, task:'ValueError on the comment and blank lines. Skip them. Expected: requests 2.31.0',
    cases:[{inputs:[],tests:[['Works','lines==["requests 2.31.0"]'],['Uses split','"split" in src']]}],
    sol:R`lines = ["requests==2.31.0", "# comment", ""]
for line in lines:
    line = line.strip()
    if not line or line.startswith("#"):
        continue
    name, version = line.split("==")
    print(name, version)`, wrong:[R`print("requests 2.31.0")`]},
  write:{prompt:'Write `parse_requirements(text)` returning a list of `(name, spec)` tuples (names lower-cased; `spec` is the version part with spaces removed, `""` when none). Skip blank lines, comments, trailing `# comments`, and option lines starting with `-`. Ignore extras like `[security]`. Ask `Requirements: ` (lines separated by `;`). Print `Count: <n>`, then one line per package `<name> <spec or any>`, then `Pinned: <how many use ==>`.',
    starter:R`import re

def parse_requirements(text):
    pass

text = input("Requirements: ").replace(";", "\n")
`,
    inputs:['requests==2.31.0;Flask>=2.3, <3.0;pandas  # any;-r dev.txt;# note'],
    cases:[{inputs:['requests==2.31.0;Flask>=2.3, <3.0;pandas  # any;-r dev.txt;# note'],tests:[['Parsed','[l for l in lines if not l.startswith("Requirements:")]==["Count: 3","requests ==2.31.0","flask >=2.3,<3.0","pandas any","Pinned: 1"]'],['Function','g["parse_requirements"]("A[x]~=1.2\\n\\n#c\\nb")==[("a","~=1.2"),("b","")]']]},{inputs:[''],tests:[['Empty','[l for l in lines if not l.startswith("Requirements:")]==["Count: 0","Pinned: 0"]']]},{inputs:['a==1;b==2;c==3'],tests:[['All pinned','lines[-1]=="Pinned: 3"']]},{inputs:['-e .;--index-url x;x!=1.0'],tests:[['Options skipped','[l for l in lines if not l.startswith("Requirements:")]==["Count: 1","x !=1.0","Pinned: 0"]']]},{inputs:['Django[argon2]>=4.2'],tests:[['Extras','"django >=4.2" in lines']]}],
    sol:R`import re

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((name.lower(), spec.replace(" ", "")))
    return packages

text = input("Requirements: ").replace(";", "\n")
packages = parse_requirements(text)
print("Count:", len(packages))
for name, spec in packages:
    print(name, spec or "any")
print("Pinned:", sum(1 for _, spec in packages if spec.startswith("==")))`,
    wrong:[R`import re

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or line.startswith("-") or line.startswith("#"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((name.lower(), spec.replace(" ", "")))
    return packages

text = input("Requirements: ").replace(";", "\n")
packages = parse_requirements(text)
print("Count:", len(packages))
for name, spec in packages:
    print(name, spec or "any")
print("Pinned:", sum(1 for _, spec in packages if spec.startswith("==")))`, R`import re

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line:
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        if not m:
            continue
        name, _, spec = m.groups()
        packages.append((name.lower(), spec.replace(" ", "")))
    return packages

text = input("Requirements: ").replace(";", "\n")
packages = parse_requirements(text)
print("Count:", len(packages))
for name, spec in packages:
    print(name, spec or "any")
print("Pinned:", sum(1 for _, spec in packages if spec.startswith("==")))`, R`import re

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((name, spec.replace(" ", "")))
    return packages

text = input("Requirements: ").replace(";", "\n")
packages = parse_requirements(text)
print("Count:", len(packages))
for name, spec in packages:
    print(name, spec or "any")
print("Pinned:", sum(1 for _, spec in packages if spec.startswith("==")))`],
    hints:['Cut each line at "#", strip it, and skip it if it is empty or starts with "-".','re.match(r"^([A-Za-z0-9_.-]+)(\\[.*?\\])?\\s*(.*)$", line) gives name, extras, spec.','Lower-case the name, remove spaces from the spec; count specs starting with "==".','import re\n\ndef parse_requirements(text):\n    packages = []\n    for raw in text.splitlines():\n        line = raw.split("#")[0].strip()\n        if not line or line.startswith("-"):\n            continue\n        m = re.match(r"^([A-Za-z0-9_.-]+)(\\[.*?\\])?\\s*(.*)$", line)\n        name, _, spec = m.groups()\n        packages.append((name.lower(), spec.replace(" ", "")))\n    return packages\n\ntext = input("Requirements: ").replace(";", "\\n")\npackages = parse_requirements(text)\nprint("Count:", len(packages))\nfor name, spec in packages:\n    print(name, spec or "any")\nprint("Pinned:", sum(1 for _, spec in packages if spec.startswith("==")))']},
  power:{can:['Read a requirements.txt line by line','Tell pinned dependencies from ranges'],
    expand:'Also report the packages with no version at all as "unpinned warnings".',
    where:'CI systems and security scanners all start by parsing requirements files.',
    next:'Next: version specifiers (==, >=, ~=) in depth.'},
  codex:{title:'requirements.txt',body:'One package per line: name[extras] specifier  # comment. -r includes files. pip install -r requirements.txt; pip freeze pins what is installed. == pins exactly.',snip:R`line = raw.split("#")[0].strip()`}
},
{
  id:'r12-03', realm:12, n:3, title:'Version specifiers: ==, >=, ~=, !=',
  teaches:['env-specifiers'], requires:['env-req'],
  story:`"Does version 2.9.1 satisfy **>=2.3,<3.0**?" Orrin asks. "That question decides whether the whole project installs. You'll build the answerer."`,
  concept:{
    html:`A **specifier set** is one or more comma-separated conditions that must **all** hold:\n\n| Spec | Meaning |\n|---|---|\n| \`==1.4.0\` | exactly this |\n| \`!=1.4.0\` | anything but this |\n| \`>=1.4\`, \`>1.4\`, \`<=\`, \`<\` | comparisons |\n| \`~=1.4.2\` | **compatible release**: \`>=1.4.2\` and \`<1.5\` |\n| \`~=1.4\` | \`>=1.4\` and \`<2\` |\n\nCompare versions as **tuples of numbers**, never as text (\`"1.10" < "1.9"\` is the wrong answer):\n\n\`\`\`\ndef vt(text):\n    return tuple(int(p) for p in text.split("."))\n\nvt("1.10.0") > vt("1.9.3")     # True\n(1, 4) == (1, 4, 0)            # False!  pad with zeros before comparing\n\`\`\`\n\n- Pad shorter versions with zeros so \`1.4\` equals \`1.4.0\`.\n- \`~=\` drops the **last** number to find the upper bound and bumps the one before it.\n- Real tools use the \`packaging\` library; knowing the rules lets you read its decisions.`,
    analogy:`Height rules on a ride: "at least 120 cm AND under 200 cm". Every rule must pass.`,
    example:R`def vt(text, size=3):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (size - len(parts)))

print(vt("1.9") == vt("1.9.0"), vt("1.10") > vt("1.9.3"))
print("1.10" > "1.9")`},
  predict:{code:R`print((1, 9) < (1, 10), "1.9" < "1.10")`, q:'What prints?', opts:['True False','True True','False True'], ans:0, why:'Tuples compare numerically; the text "1.9" > "1.10" because "9" > "1".'},
  cast:{code:R`def vt(text, size=3):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (size - len(parts)))

print(vt("1.9") == vt("1.9.0"), vt("1.10") > vt("1.9.3"))
print("1.10" > "1.9")`, task:'Cast it.'},
  bug:{broken:R`versions = ["1.9.0", "1.10.0", "1.2.0"]
print(max(versions))`, task:'Text comparison picks 1.9.0. Compare numerically. Expected: 1.10.0',
    cases:[{inputs:[],tests:[['Numeric max','lines==["1.10.0"]']]}],
    sol:R`versions = ["1.9.0", "1.10.0", "1.2.0"]
print(max(versions, key=lambda v: tuple(int(p) for p in v.split("."))))`, wrong:[R`versions = ["1.9.0", "1.10.0", "1.2.0"]
print(max(versions))`]},
  write:{prompt:'Write `satisfies(version, spec)`, where `spec` is a comma-separated set like `>=2.3,<3.0` (operators `==`, `!=`, `>=`, `<=`, `>`, `<`, `~=`; empty spec accepts everything; versions have 1 to 3 numbers). Compare as zero-padded 3-tuples. `~=X.Y.Z` means `>=X.Y.Z` and `<X.(Y+1)`; `~=X.Y` means `>=X.Y` and `<(X+1)`. Ask `Spec: ` and `Versions: ` (space-separated). Print `OK: <versions that satisfy, space separated, or none>` and `Best: <highest satisfying version, or none>`.',
    starter:R`def satisfies(version, spec):
    pass

spec = input("Spec: ")
versions = input("Versions: ").split()
`,
    inputs:['>=2.3,<3.0','2.2.9 2.3 2.9.1 3.0 3.1'],
    cases:[{inputs:['>=2.3,<3.0','2.2.9 2.3 2.9.1 3.0 3.1'],tests:[['Range','lines[-2:]==["OK: 2.3 2.9.1","Best: 2.9.1"]'],['Function','g["satisfies"]("1.4.9","~=1.4.2") and not g["satisfies"]("1.5.0","~=1.4.2") and g["satisfies"]("1.9","~=1.4") and not g["satisfies"]("2.0","~=1.4")'],['Padding','g["satisfies"]("1.4","==1.4.0") and g["satisfies"]("1.10","<1.10.1")'],['Empty spec','g["satisfies"]("9.9.9","")']]},{inputs:['==1.4','1.4.0 1.4.1 1.3'],tests:[['Exact','lines[-2:]==["OK: 1.4.0","Best: 1.4.0"]']]},{inputs:['!=2.0,>=1.0','1.0 2.0 2.1 0.9'],tests:[['Not equal','lines[-2:]==["OK: 1.0 2.1","Best: 2.1"]']]},{inputs:['~=1.4.2','1.4.1 1.4.2 1.4.9 1.5.0'],tests:[['Compatible','lines[-2:]==["OK: 1.4.2 1.4.9","Best: 1.4.9"]']]},{inputs:['>5','1.0 2.0'],tests:[['None','lines[-2:]==["OK: none","Best: none"]']]},{inputs:['','1.10 1.9'],tests:[['Empty spec numeric best','lines[-1]=="Best: 1.10"']]}],
    sol:R`def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            if len(pieces) >= 3:
                upper = (pieces[0], pieces[1] + 1, 0)
            else:
                upper = (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

spec = input("Spec: ")
versions = input("Versions: ").split()
good = [v for v in versions if satisfies(v, spec)]
print("OK:", *(good or ["none"]))
print("Best:", max(good, key=vt) if good else "none")`,
    wrong:[R`def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            ok = v >= t
        if not ok:
            return False
    return True

spec = input("Spec: ")
versions = input("Versions: ").split()
good = [v for v in versions if satisfies(v, spec)]
print("OK:", *(good or ["none"]))
print("Best:", max(good, key=vt) if good else "none")`, R`def vt(text):
    return tuple(int(p) for p in text.split("."))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            upper = (pieces[0], pieces[1] + 1, 0) if len(pieces) >= 3 else (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

spec = input("Spec: ")
versions = input("Versions: ").split()
good = [v for v in versions if satisfies(v, spec)]
print("OK:", *(good or ["none"]))
print("Best:", max(good, key=vt) if good else "none")`, R`def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            upper = (pieces[0], pieces[1] + 1, 0) if len(pieces) >= 3 else (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

spec = input("Spec: ")
versions = input("Versions: ").split()
good = [v for v in versions if satisfies(v, spec)]
print("OK:", *(good or ["none"]))
print("Best:", max(good) if good else "none")`],
    hints:['vt turns "1.4" into (1, 4, 0): pad with zeros so versions of different lengths compare fairly.','Split the spec on commas; for each part find which operator it starts with (check two-character operators first!) and compare tuples.','~=: with 3 parts the upper bound is (X, Y+1, 0); with 2 parts it is (X+1, 0, 0). Best = max(good, key=vt).','def vt(text):\n    parts = [int(p) for p in text.split(".")]\n    return tuple(parts + [0] * (3 - len(parts)))\n\ndef satisfies(version, spec):\n    v = vt(version)\n    for part in spec.replace(" ", "").split(","):\n        if not part:\n            continue\n        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):\n            if part.startswith(op):\n                target = part[len(op):]\n                break\n        t = vt(target)\n        if op == "==":\n            ok = v == t\n        elif op == "!=":\n            ok = v != t\n        elif op == ">=":\n            ok = v >= t\n        elif op == "<=":\n            ok = v <= t\n        elif op == ">":\n            ok = v > t\n        elif op == "<":\n            ok = v < t\n        else:\n            pieces = [int(p) for p in target.split(".")]\n            if len(pieces) >= 3:\n                upper = (pieces[0], pieces[1] + 1, 0)\n            else:\n                upper = (pieces[0] + 1, 0, 0)\n            ok = v >= t and v < upper\n        if not ok:\n            return False\n    return True\n\nspec = input("Spec: ")\nversions = input("Versions: ").split()\ngood = [v for v in versions if satisfies(v, spec)]\nprint("OK:", *(good or ["none"]))\nprint("Best:", max(good, key=vt) if good else "none")']},
  power:{can:['Read and evaluate version specifiers','Compare versions numerically, never as text'],
    expand:'Add support for pre-release suffixes like 1.0rc1 (they sort before 1.0).',
    where:'pip, poetry and dependabot all run this exact logic.',
    next:'Next: pyproject.toml with the tomllib module.'},
  codex:{title:'Version specifiers',body:'All comma-separated conditions must hold. ~=X.Y.Z means >=X.Y.Z,<X.(Y+1); ~=X.Y means >=X.Y,<(X+1). Compare zero-padded integer tuples, never text.',snip:R`def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))`}
},
{
  id:'r12-04', realm:12, n:4, title:'pyproject.toml and tomllib',
  teaches:['env-toml'], requires:['env-specifiers'],
  story:`"Modern projects keep their identity card in one file," Orrin says, unrolling a neat scroll of sections in square brackets. "Name, version, dependencies, even the commands it installs. It's called **pyproject.toml**."`,
  concept:{
    html:`**TOML** is a tidy config format. Python 3.11+ reads it with the built-in \`tomllib\`:\n\n\`\`\`\n[project]\nname = "spell-tools"\nversion = "1.2.0"\nrequires-python = ">=3.10"\ndependencies = ["requests>=2.31", "rich"]\n\n[project.scripts]\nspell = "spell_tools.cli:main"\n\n[tool.pytest.ini_options]\naddopts = "-q"\n\`\`\`\n\n\`\`\`\nimport tomllib\ndata = tomllib.loads(text)              # from a string (tomllib.load(f) needs a binary file)\ndata["project"]["name"]                 # 'spell-tools'\ndata["project"].get("optional-dependencies", {})\n\`\`\`\n\n- \`[section]\` = a dict; \`[a.b]\` = nested dict \`data["a"]["b"]\`. Strings use double quotes; lists use \`[ ]\`; booleans are \`true\`/\`false\`.\n- \`tomllib\` **reads** only. Bad TOML raises \`tomllib.TOMLDecodeError\`.\n- Tools keep their settings under \`[tool.<name>]\` (pytest, black, ruff, mypy ...).\n- \`pyproject.toml\` replaced the old \`setup.py\` as the standard place to describe a package.`,
    analogy:`A passport: one document holding the project's name, version and what it needs to travel.`,
    example:R`import tomllib

text = """
[project]
name = "spell-tools"
version = "1.2.0"
dependencies = ["requests>=2.31", "rich"]

[project.scripts]
spell = "spell_tools.cli:main"
"""
data = tomllib.loads(text)
print(data["project"]["name"], data["project"]["version"])
print(len(data["project"]["dependencies"]), list(data["project"]["scripts"]))`},
  predict:{code:R`import tomllib
d = tomllib.loads('a = 1\n[b]\nc = "x"')
print(d)`, q:'What prints?', opts:["{'a': 1, 'b': {'c': 'x'}}","{'a': 1, 'c': 'x'}","Error"], ans:0, why:'[b] creates a nested dict.'},
  cast:{code:R`import tomllib

text = """
[project]
name = "spell-tools"
version = "1.2.0"
dependencies = ["requests>=2.31", "rich"]

[project.scripts]
spell = "spell_tools.cli:main"
"""
data = tomllib.loads(text)
print(data["project"]["name"], data["project"]["version"])
print(len(data["project"]["dependencies"]), list(data["project"]["scripts"]))`, task:'Cast it.'},
  bug:{broken:R`import tomllib

text = "[project]\nname = 'tools'\nversion = 1.2.0"
print(tomllib.loads(text)["project"]["version"])`, task:'TOMLDecodeError: a version number must be a quoted string. Fix the TOML. Expected: 1.2.0',
    cases:[{inputs:[],tests:[['Works','lines==["1.2.0"]'],['Uses tomllib','"tomllib.loads" in src']]}],
    sol:R`import tomllib

text = "[project]\nname = 'tools'\nversion = '1.2.0'"
print(tomllib.loads(text)["project"]["version"])`, wrong:[R`print("1.2.0")`]},
  write:{prompt:'Read a pyproject given as one line where `;` stands for a line break. Ask `Toml: `. Parse it with `tomllib`. If it is invalid print `Invalid TOML`; if it has no `[project]` table print `No project table`. Otherwise print `Name: <name>`, `Version: <version or unknown>`, `Python: <requires-python or any>`, `Dependencies: <count>` and `Commands: <script names sorted, comma separated, or none>`.',
    starter:R`import tomllib

text = input("Toml: ").replace(";", "\n")
`,
    inputs:['[project];name = "spell-tools";version = "1.2.0";requires-python = ">=3.10";dependencies = ["requests>=2.31", "rich"];[project.scripts];spell = "a:b";cast = "c:d"'],
    cases:[{inputs:['[project];name = "spell-tools";version = "1.2.0";requires-python = ">=3.10";dependencies = ["requests>=2.31", "rich"];[project.scripts];spell = "a:b";cast = "c:d"'],tests:[['Full','lines[-5:]==["Name: spell-tools","Version: 1.2.0","Python: >=3.10","Dependencies: 2","Commands: cast, spell"]']]},{inputs:['[project];name = "x"'],tests:[['Minimal','lines[-5:]==["Name: x","Version: unknown","Python: any","Dependencies: 0","Commands: none"]']]},{inputs:['[tool.black];line-length = 88'],tests:[['No project','lines[-1]=="No project table"']]},{inputs:['[project;name = 1'],tests:[['Invalid','lines[-1]=="Invalid TOML"']]},{inputs:[''],tests:[['Empty','lines[-1]=="No project table"']]},{inputs:['[project];name = "n";dynamic = ["version"]'],tests:[['Dynamic version','"Version: unknown" in lines']]}],
    sol:R`import tomllib

text = input("Toml: ").replace(";", "\n")
try:
    data = tomllib.loads(text)
except tomllib.TOMLDecodeError:
    print("Invalid TOML")
else:
    project = data.get("project")
    if project is None:
        print("No project table")
    else:
        print("Name:", project.get("name", "unknown"))
        print("Version:", project.get("version", "unknown"))
        print("Python:", project.get("requires-python", "any"))
        print("Dependencies:", len(project.get("dependencies", [])))
        scripts = sorted(project.get("scripts", {}))
        print("Commands:", ", ".join(scripts) if scripts else "none")`,
    wrong:[R`import tomllib

text = input("Toml: ").replace(";", "\n")
data = tomllib.loads(text)
project = data.get("project")
if project is None:
    print("No project table")
else:
    print("Name:", project.get("name", "unknown"))
    print("Version:", project.get("version", "unknown"))
    print("Python:", project.get("requires-python", "any"))
    print("Dependencies:", len(project.get("dependencies", [])))
    scripts = sorted(project.get("scripts", {}))
    print("Commands:", ", ".join(scripts) if scripts else "none")`, R`import tomllib

text = input("Toml: ").replace(";", "\n")
try:
    data = tomllib.loads(text)
except tomllib.TOMLDecodeError:
    print("Invalid TOML")
else:
    project = data["project"] if "project" in data else {}
    print("Name:", project.get("name", "unknown"))
    print("Version:", project.get("version", "unknown"))
    print("Python:", project.get("requires-python", "any"))
    print("Dependencies:", len(project.get("dependencies", [])))
    scripts = sorted(project.get("scripts", {}))
    print("Commands:", ", ".join(scripts) if scripts else "none")`, R`import tomllib

text = input("Toml: ").replace(";", "\n")
try:
    data = tomllib.loads(text)
except tomllib.TOMLDecodeError:
    print("Invalid TOML")
else:
    project = data.get("project")
    if project is None:
        print("No project table")
    else:
        print("Name:", project.get("name", "unknown"))
        print("Version:", project.get("version", "unknown"))
        print("Python:", project.get("requires-python", "any"))
        print("Dependencies:", len(project.get("dependencies", [])))
        scripts = list(project.get("scripts", {}))
        print("Commands:", ", ".join(scripts) if scripts else "none")`],
    hints:['tomllib.loads(text) raises tomllib.TOMLDecodeError for bad TOML.','data.get("project") is None means there is no [project] table.','Use .get with defaults for optional keys; sorted(scripts) gives the command names in order.','import tomllib\n\ntext = input("Toml: ").replace(";", "\\n")\ntry:\n    data = tomllib.loads(text)\nexcept tomllib.TOMLDecodeError:\n    print("Invalid TOML")\nelse:\n    project = data.get("project")\n    if project is None:\n        print("No project table")\n    else:\n        print("Name:", project.get("name", "unknown"))\n        print("Version:", project.get("version", "unknown"))\n        print("Python:", project.get("requires-python", "any"))\n        print("Dependencies:", len(project.get("dependencies", [])))\n        scripts = sorted(project.get("scripts", {}))\n        print("Commands:", ", ".join(scripts) if scripts else "none")']},
  power:{can:['Read pyproject.toml with tomllib','Handle missing sections and invalid TOML gracefully'],
    expand:'Read `[tool.pytest.ini_options]` and print its settings.',
    where:'Build tools, linters and formatters all read their settings from pyproject.toml.',
    next:'Next: environment variables and config layers.'},
  codex:{title:'tomllib',body:'tomllib.loads(text) -> nested dicts; [a.b] = data["a"]["b"]. Read-only. Bad input raises TOMLDecodeError. pyproject.toml holds [project] metadata and [tool.x] settings.',snip:R`import tomllib
data = tomllib.loads(text)
data["project"]["name"]`}
},
{
  id:'r12-05', realm:12, n:5, title:'Configuration layers: env vars, files, defaults',
  teaches:['env-config'], requires:['env-toml'],
  story:`"The database address on your laptop is not the one in production," Orrin says. "You never change the code to change the address. You change the **environment** the code runs in."`,
  concept:{
    html:`Good programs read settings from **layers**, strongest first:\n\n1. **Environment variables** (\`os.environ\`), set per machine or per run\n2. A **config file** (\`.ini\`, \`.toml\`, \`.json\`)\n3. Built-in **defaults**\n\n\`\`\`\nimport os, configparser\n\nos.environ.get("APP_PORT")             # None if missing; always a STRING\nint(os.environ.get("APP_PORT", "8000"))\n\ncfg = configparser.ConfigParser()\ncfg.read_string("[server]\\nport = 9000\\ndebug = yes\\n")\ncfg["server"]["port"]                  # '9000' (text)\ncfg.getint("server", "port")           # 9000\ncfg.getboolean("server", "debug")      # True  (yes/true/on/1)\ncfg.get("server", "host", fallback="localhost")\n\`\`\`\n\n- Environment values are **always strings**; convert them.\n- ⚠️ \`bool("false")\` is \`True\` (a non-empty string). Parse booleans explicitly.\n- **Secrets** (passwords, API keys) belong in environment variables, never in code or git.\n- \`os.environ[name]\` raises \`KeyError\` if missing; \`.get(name, default)\` doesn't.`,
    analogy:`Dress code layers: the event rule (env) beats the company default.`,
    example:R`import os, configparser

os.environ["APP_PORT"] = "7000"
cfg = configparser.ConfigParser()
cfg.read_string("[server]\nport = 9000\ndebug = yes\n")

print(int(os.environ.get("APP_PORT", cfg.get("server", "port", fallback="8000"))))
print(cfg.getboolean("server", "debug"), cfg.get("server", "host", fallback="localhost"))
print(bool("false"))`},
  predict:{code:R`print(bool("false"), bool(""))`, q:'What prints?', opts:['True False','False False','False True'], ans:0, why:'Any non-empty string is truthy, even "false".'},
  cast:{code:R`import os, configparser

os.environ["APP_PORT"] = "7000"
cfg = configparser.ConfigParser()
cfg.read_string("[server]\nport = 9000\ndebug = yes\n")

print(int(os.environ.get("APP_PORT", cfg.get("server", "port", fallback="8000"))))
print(cfg.getboolean("server", "debug"), cfg.get("server", "host", fallback="localhost"))
print(bool("false"))`, task:'Cast it.'},
  bug:{broken:R`import os
os.environ["DEBUG"] = "false"
debug = bool(os.environ["DEBUG"])
print(debug)`, task:'bool("false") is True! Parse the text properly so DEBUG=false gives False. Expected: False',
    cases:[{inputs:[],tests:[['False','lines==["False"]'],['Parses text','"os.environ" in src and "lower" in src']]}],
    sol:R`import os
os.environ["DEBUG"] = "false"
debug = os.environ["DEBUG"].lower() in ("1", "true", "yes", "on")
print(debug)`, wrong:[R`print(False)`]},
  write:{prompt:'Write `load_settings(env, ini_text)` returning a dict with `host`, `port` (int) and `debug` (bool). Layers, strongest first: keys in the `env` dict named `APP_HOST`, `APP_PORT`, `APP_DEBUG`; then the `[server]` section of the ini text (`host`, `port`, `debug`); then defaults `localhost`, `8000`, `False`. Booleans accept `1/true/yes/on` (any case) as true; everything else is false. An invalid port (not a whole number, or outside 1-65535) raises `ValueError("Bad port: <text>")`. Ask `Env: ` (`KEY=VALUE` pairs separated by spaces, may be empty) and `Ini: ` (lines separated by `;`). Print `Host: ...`, `Port: ...`, `Debug: ...` or `Error: <message>`.',
    starter:R`import configparser

def load_settings(env, ini_text):
    pass

env = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)
ini = input("Ini: ").replace(";", "\n")
`,
    inputs:['APP_PORT=7000','[server];host = example.org;port = 9000;debug = yes'],
    cases:[{inputs:['APP_PORT=7000','[server];host = example.org;port = 9000;debug = yes'],tests:[['Layers','lines[-3:]==["Host: example.org","Port: 7000","Debug: True"]'],['Function','g["load_settings"]({}, "")=={"host":"localhost","port":8000,"debug":False}'],['Env beats file','g["load_settings"]({"APP_HOST":"e"}, "[server]\\nhost = f")["host"]=="e"']]},{inputs:['','[server];port = 9000'],tests:[['File only','lines[-3:]==["Host: localhost","Port: 9000","Debug: False"]']]},{inputs:['',''],tests:[['Defaults','lines[-3:]==["Host: localhost","Port: 8000","Debug: False"]']]},{inputs:['APP_DEBUG=TRUE APP_HOST=h',''],tests:[['Case-insensitive true','lines[-3:]==["Host: h","Port: 8000","Debug: True"]']]},{inputs:['APP_DEBUG=false','[server];debug = on'],tests:[['Env false beats file true','lines[-1]=="Debug: False"']]},{inputs:['APP_PORT=abc',''],tests:[['Bad port','lines[-1]=="Error: Bad port: abc"']]},{inputs:['APP_PORT=70000',''],tests:[['Out of range','lines[-1]=="Error: Bad port: 70000"']]},{inputs:['','[server];port = 0'],tests:[['Zero port from file','lines[-1]=="Error: Bad port: 0"']]}],
    sol:R`import configparser

def to_bool(text):
    return str(text).strip().lower() in ("1", "true", "yes", "on")

def load_settings(env, ini_text):
    cfg = configparser.ConfigParser()
    cfg.read_string(ini_text)
    section = cfg["server"] if cfg.has_section("server") else {}
    host = env.get("APP_HOST", section.get("host", "localhost"))
    port_text = env.get("APP_PORT", section.get("port", "8000"))
    debug_text = env.get("APP_DEBUG", section.get("debug", "false"))
    try:
        port = int(port_text)
    except ValueError:
        raise ValueError(f"Bad port: {port_text}")
    if not 1 <= port <= 65535:
        raise ValueError(f"Bad port: {port_text}")
    return {"host": host, "port": port, "debug": to_bool(debug_text)}

env = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)
ini = input("Ini: ").replace(";", "\n")
try:
    settings = load_settings(env, ini)
except ValueError as error:
    print("Error:", error)
else:
    print("Host:", settings["host"])
    print("Port:", settings["port"])
    print("Debug:", settings["debug"])`,
    wrong:[R`import configparser

def load_settings(env, ini_text):
    cfg = configparser.ConfigParser()
    cfg.read_string(ini_text)
    section = cfg["server"] if cfg.has_section("server") else {}
    host = env.get("APP_HOST", section.get("host", "localhost"))
    port_text = env.get("APP_PORT", section.get("port", "8000"))
    debug_text = env.get("APP_DEBUG", section.get("debug", "false"))
    try:
        port = int(port_text)
    except ValueError:
        raise ValueError(f"Bad port: {port_text}")
    if not 1 <= port <= 65535:
        raise ValueError(f"Bad port: {port_text}")
    return {"host": host, "port": port, "debug": bool(debug_text)}

env = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)
ini = input("Ini: ").replace(";", "\n")
try:
    settings = load_settings(env, ini)
except ValueError as error:
    print("Error:", error)
else:
    print("Host:", settings["host"])
    print("Port:", settings["port"])
    print("Debug:", settings["debug"])`, R`import configparser

def to_bool(text):
    return str(text).strip().lower() in ("1", "true", "yes", "on")

def load_settings(env, ini_text):
    cfg = configparser.ConfigParser()
    cfg.read_string(ini_text)
    section = cfg["server"] if cfg.has_section("server") else {}
    host = section.get("host", env.get("APP_HOST", "localhost"))
    port_text = section.get("port", env.get("APP_PORT", "8000"))
    debug_text = section.get("debug", env.get("APP_DEBUG", "false"))
    try:
        port = int(port_text)
    except ValueError:
        raise ValueError(f"Bad port: {port_text}")
    if not 1 <= port <= 65535:
        raise ValueError(f"Bad port: {port_text}")
    return {"host": host, "port": port, "debug": to_bool(debug_text)}

env = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)
ini = input("Ini: ").replace(";", "\n")
try:
    settings = load_settings(env, ini)
except ValueError as error:
    print("Error:", error)
else:
    print("Host:", settings["host"])
    print("Port:", settings["port"])
    print("Debug:", settings["debug"])`, R`import configparser

def to_bool(text):
    return str(text).strip().lower() in ("1", "true", "yes", "on")

def load_settings(env, ini_text):
    cfg = configparser.ConfigParser()
    cfg.read_string(ini_text)
    section = cfg["server"] if cfg.has_section("server") else {}
    host = env.get("APP_HOST", section.get("host", "localhost"))
    port_text = env.get("APP_PORT", section.get("port", "8000"))
    debug_text = env.get("APP_DEBUG", section.get("debug", "false"))
    try:
        port = int(port_text)
    except ValueError:
        raise ValueError(f"Bad port: {port_text}")
    return {"host": host, "port": port, "debug": to_bool(debug_text)}

env = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)
ini = input("Ini: ").replace(";", "\n")
try:
    settings = load_settings(env, ini)
except ValueError as error:
    print("Error:", error)
else:
    print("Host:", settings["host"])
    print("Port:", settings["port"])
    print("Debug:", settings["debug"])`],
    hints:['Read the ini with configparser.ConfigParser().read_string(ini_text); the section may not exist (has_section).','Lookup order: env.get("APP_PORT", section.get("port", "8000")) gives env first, then file, then default.','Parse booleans with `.lower() in ("1","true","yes","on")` and validate the port range 1-65535.','import configparser\n\ndef to_bool(text):\n    return str(text).strip().lower() in ("1", "true", "yes", "on")\n\ndef load_settings(env, ini_text):\n    cfg = configparser.ConfigParser()\n    cfg.read_string(ini_text)\n    section = cfg["server"] if cfg.has_section("server") else {}\n    host = env.get("APP_HOST", section.get("host", "localhost"))\n    port_text = env.get("APP_PORT", section.get("port", "8000"))\n    debug_text = env.get("APP_DEBUG", section.get("debug", "false"))\n    try:\n        port = int(port_text)\n    except ValueError:\n        raise ValueError(f"Bad port: {port_text}")\n    if not 1 <= port <= 65535:\n        raise ValueError(f"Bad port: {port_text}")\n    return {"host": host, "port": port, "debug": to_bool(debug_text)}\n\nenv = dict(pair.split("=", 1) for pair in input("Env: ").split() if "=" in pair)\nini = input("Ini: ").replace(";", "\\n")\ntry:\n    settings = load_settings(env, ini)\nexcept ValueError as error:\n    print("Error:", error)\nelse:\n    print("Host:", settings["host"])\n    print("Port:", settings["port"])\n    print("Debug:", settings["debug"])']},
  power:{can:['Layer settings: environment, file, defaults','Parse env-var strings into typed values safely'],
    expand:'Add an `APP_SECRET` that must come from the environment and is never printed.',
    where:'Every deployed app is configured this way (the "twelve-factor" approach).',
    next:'Next: Real-World Mission: the Dependency Auditor.'},
  codex:{title:'Config layers',body:'env vars (strings!) beat config file beat defaults. configparser reads .ini; getint/getboolean convert. bool("false") is True: parse booleans explicitly. Secrets live in env vars.',snip:R`port = int(env.get("APP_PORT", section.get("port", "8000")))`}
},
{
  id:'r12-06', realm:12, n:6, title:'Real-World Mission: The Dependency Auditor',
  teaches:['mission12a'], requires:['env-config'],
  story:`The quartermaster hands you two documents: what the project **asks for** (requirements) and what the machine **actually has** (a list of installed versions). "Tell me what's missing, what's out of range, and what is dangerously unpinned," she says. "Before the deploy goes out."`,
  concept:{
    html:`This mission combines the whole lot: requirements parsing, version specifiers and clear reports.\n\nFor each requirement \`(name, spec)\` and the installed map \`{name: version}\`:\n\n- not installed → **MISSING**\n- installed but \`satisfies(version, spec)\` is false → **MISMATCH** (show both)\n- fine → **OK**\n- also flag requirements with an empty spec as **UNPINNED** (warning only; they still get OK or MISSING)\n\nExit status matters in automation: the program should end with a one-line verdict, and a real tool would \`sys.exit(1)\` when there are problems. Here you will print \`Verdict: PASS\` or \`Verdict: FAIL\`.\n\nPackage names are case-insensitive and \`-\`, \`_\`, \`.\` are interchangeable (\`Flask_Cors\` = \`flask-cors\`). **Normalise names** before comparing.\n\n\`\`\`\nre.sub(r"[-_.]+", "-", name).lower()\n\`\`\``,
    analogy:`A pre-flight checklist: every item is ticked, flagged or fails the flight.`,
    example:R`import re

def norm(name):
    return re.sub(r"[-_.]+", "-", name).lower()

print(norm("Flask_Cors"), norm("zope.interface"), norm("Pillow"))`},
  predict:{code:R`import re
print(re.sub(r"[-_.]+", "-", "A_b..C"))`, q:'What prints?', opts:['A-b-C','A_b..C','A-b--C'], ans:0, why:'Each run of - _ . becomes a single hyphen.'},
  cast:{code:R`import re

def norm(name):
    return re.sub(r"[-_.]+", "-", name).lower()

print(norm("Flask_Cors"), norm("zope.interface"), norm("Pillow"))`, task:'Cast it.'},
  bug:{broken:R`required = ["flask-cors"]
installed = {"Flask_Cors": "4.0"}
for name in required:
    print(name, "OK" if name in installed else "MISSING")`, task:'The names differ only in case and punctuation, so it wrongly says MISSING. Normalise names before comparing. Expected: flask-cors OK',
    cases:[{inputs:[],tests:[['Normalised','lines==["flask-cors OK"]'],['Uses norm','"re.sub" in src or "replace" in src']]}],
    sol:R`import re

def norm(name):
    return re.sub(r"[-_.]+", "-", name).lower()

required = ["flask-cors"]
installed = {norm(k): v for k, v in {"Flask_Cors": "4.0"}.items()}
for name in required:
    print(name, "OK" if norm(name) in installed else "MISSING")`, wrong:[R`print("flask-cors OK")`]},
  write:{prompt:'Build the auditor. Ask `Requirements: ` (lines separated by `;`, requirements format) and `Installed: ` (space-separated `name==version` pairs). For each requirement in file order print one line: `OK <name>`, `MISSING <name>` or `MISMATCH <name>: have <version>, need <spec>`; names shown lower-cased with normalised punctuation, and a requirement with an empty spec also prints `WARN <name> is unpinned` right after its status line. Then print `Summary: <ok> ok, <missing> missing, <mismatch> mismatched, <unpinned> unpinned` and `Verdict: PASS` (no missing and no mismatches) or `Verdict: FAIL`. Support specs like `==1.0`, `>=2,<3`, `~=1.4`, `!=2.0`.',
    starter:R`import re

def norm(name):
    pass

reqs = input("Requirements: ").replace(";", "\n")
installed = input("Installed: ").split()
`,
    inputs:['requests==2.31.0;Flask-Cors>=4,<5;pandas;rich~=13.0','requests==2.31.0 flask_cors==5.0.1 pandas==2.2.0'],
    cases:[{inputs:['requests==2.31.0;Flask-Cors>=4,<5;pandas;rich~=13.0','requests==2.31.0 flask_cors==5.0.1 pandas==2.2.0'],tests:[['Full audit','[l for l in lines if not l.startswith(("Requirements:","Installed:"))]==["OK requests","MISMATCH flask-cors: have 5.0.1, need >=4,<5","OK pandas","WARN pandas is unpinned","MISSING rich","Summary: 2 ok, 1 missing, 1 mismatched, 1 unpinned","Verdict: FAIL"]'],['norm','g["norm"]("Flask_Cors")=="flask-cors" and g["norm"]("A..B")=="a-b"']]},{inputs:['a==1;b>=2','a==1 b==2.5'],tests:[['All fine','lines[-3:]==["OK b","Summary: 2 ok, 0 missing, 0 mismatched, 0 unpinned","Verdict: PASS"]']]},{inputs:['',''],tests:[['Nothing to audit','lines[-2:]==["Summary: 0 ok, 0 missing, 0 mismatched, 0 unpinned","Verdict: PASS"]']]},{inputs:['x!=2.0;# c;y~=1.4  # inline','x==2.0 y==1.9'],tests:[['Not equal and compatible','[l for l in lines if not l.startswith(("Requirements:","Installed:"))]==["MISMATCH x: have 2.0, need !=2.0","OK y","Summary: 1 ok, 0 missing, 1 mismatched, 0 unpinned","Verdict: FAIL"]']]},{inputs:['Zope.Interface','zope-interface==6.0'],tests:[['Punctuation and unpinned','[l for l in lines if not l.startswith(("Requirements:","Installed:"))]==["OK zope-interface","WARN zope-interface is unpinned","Summary: 1 ok, 0 missing, 0 mismatched, 1 unpinned","Verdict: PASS"]']]},{inputs:['missing==1;gone','' ],tests:[['Nothing installed','lines[-1]=="Verdict: FAIL" and "MISSING gone" in lines and "WARN gone is unpinned" in lines']]}],
    sol:R`import re

def norm(name):
    return re.sub(r"[-_.]+", "-", name).lower()

def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            upper = (pieces[0], pieces[1] + 1, 0) if len(pieces) >= 3 else (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((norm(name), spec.replace(" ", "")))
    return packages

reqs = input("Requirements: ").replace(";", "\n")
installed = {}
for pair in input("Installed: ").split():
    name, _, version = pair.partition("==")
    installed[norm(name)] = version

ok = missing = mismatch = unpinned = 0
for name, spec in parse_requirements(reqs):
    if name not in installed:
        print("MISSING", name)
        missing += 1
    elif not satisfies(installed[name], spec):
        print(f"MISMATCH {name}: have {installed[name]}, need {spec}")
        mismatch += 1
    else:
        print("OK", name)
        ok += 1
    if not spec:
        print(f"WARN {name} is unpinned")
        unpinned += 1
print(f"Summary: {ok} ok, {missing} missing, {mismatch} mismatched, {unpinned} unpinned")
print("Verdict:", "PASS" if not missing and not mismatch else "FAIL")`,
    wrong:[R`import re

def norm(name):
    return name.lower()

def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            upper = (pieces[0], pieces[1] + 1, 0) if len(pieces) >= 3 else (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((norm(name), spec.replace(" ", "")))
    return packages

reqs = input("Requirements: ").replace(";", "\n")
installed = {}
for pair in input("Installed: ").split():
    name, _, version = pair.partition("==")
    installed[norm(name)] = version

ok = missing = mismatch = unpinned = 0
for name, spec in parse_requirements(reqs):
    if name not in installed:
        print("MISSING", name)
        missing += 1
    elif not satisfies(installed[name], spec):
        print(f"MISMATCH {name}: have {installed[name]}, need {spec}")
        mismatch += 1
    else:
        print("OK", name)
        ok += 1
    if not spec:
        print(f"WARN {name} is unpinned")
        unpinned += 1
print(f"Summary: {ok} ok, {missing} missing, {mismatch} mismatched, {unpinned} unpinned")
print("Verdict:", "PASS" if not missing and not mismatch else "FAIL")`, R`import re

def norm(name):
    return re.sub(r"[-_.]+", "-", name).lower()

def vt(text):
    parts = [int(p) for p in text.split(".")]
    return tuple(parts + [0] * (3 - len(parts)))

def satisfies(version, spec):
    v = vt(version)
    for part in spec.replace(" ", "").split(","):
        if not part:
            continue
        for op in ("==", "!=", ">=", "<=", "~=", ">", "<"):
            if part.startswith(op):
                target = part[len(op):]
                break
        t = vt(target)
        if op == "==":
            ok = v == t
        elif op == "!=":
            ok = v != t
        elif op == ">=":
            ok = v >= t
        elif op == "<=":
            ok = v <= t
        elif op == ">":
            ok = v > t
        elif op == "<":
            ok = v < t
        else:
            pieces = [int(p) for p in target.split(".")]
            upper = (pieces[0], pieces[1] + 1, 0) if len(pieces) >= 3 else (pieces[0] + 1, 0, 0)
            ok = v >= t and v < upper
        if not ok:
            return False
    return True

def parse_requirements(text):
    packages = []
    for raw in text.splitlines():
        line = raw.split("#")[0].strip()
        if not line or line.startswith("-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)(\[.*?\])?\s*(.*)$", line)
        name, _, spec = m.groups()
        packages.append((norm(name), spec.replace(" ", "")))
    return packages

reqs = input("Requirements: ").replace(";", "\n")
installed = {}
for pair in input("Installed: ").split():
    name, _, version = pair.partition("==")
    installed[norm(name)] = version

ok = missing = mismatch = unpinned = 0
for name, spec in parse_requirements(reqs):
    if name not in installed:
        print("MISSING", name)
        missing += 1
    elif not satisfies(installed[name], spec):
        print(f"MISMATCH {name}: have {installed[name]}, need {spec}")
        mismatch += 1
    else:
        print("OK", name)
        ok += 1
    if not spec:
        print(f"WARN {name} is unpinned")
        unpinned += 1
print(f"Summary: {ok} ok, {missing} missing, {mismatch} mismatched, {unpinned} unpinned")
print("Verdict:", "PASS" if not missing else "FAIL")`],
    hints:['Reuse your parts: norm() for names, a satisfies(version, spec) function, and a requirements parser. Build installed = {norm(name): version}.','For every requirement print exactly one status line (OK / MISSING / MISMATCH ... have X, need Y); add the WARN line when the spec is empty.','Count each outcome and print the Summary; Verdict is PASS only when nothing is missing AND nothing mismatched.','(Full solution: combine the helpers from lessons 2 and 3 with the status/summary printing described above.)']},
  power:{can:['Audit a project\'s dependencies against what is installed','Normalise names and compare versions correctly'],
    expand:'Exit with a non-zero status (sys.exit(1)) on FAIL so CI can stop the pipeline.',
    where:'This is the core of tools like pip check, dependabot and security scanners.',
    next:'Next: git, the time machine for your code.'},
  codex:{title:'Mission: Dependency Auditor',body:'Normalise names (case, - _ .), parse requirements, compare installed versions to specifiers, report OK / MISSING / MISMATCH plus warnings for unpinned. FAIL when anything is missing or mismatched.',snip:R`re.sub(r"[-_.]+", "-", name).lower()`}
}
);
