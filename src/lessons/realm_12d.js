// REALM 12 — THE MASTER GATE — part D (lessons 25-30: code quality and linting)
const eqD = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

// ---------- 25 naming
const s25 = R`import re

def to_snake(name):
    return re.sub(r"(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])", "_", name).lower()

PATTERNS = {
    "func": r"[a-z_][a-z0-9_]*",
    "var": r"[a-z_][a-z0-9_]*",
    "class": r"[A-Z][A-Za-z0-9]*",
    "const": r"[A-Z][A-Z0-9_]*",
}

def suggest(kind, name):
    snake = to_snake(name)
    if kind == "class":
        return "".join(part.capitalize() for part in snake.split("_"))
    if kind == "const":
        return snake.upper()
    return snake

problems = 0
for item in input("Names: ").split():
    kind, _, name = item.partition(":")
    if not re.fullmatch(PATTERNS[kind], name):
        print(f"bad {kind} {name} -> {suggest(kind, name)}")
        problems += 1
print("Clean" if not problems else f"Problems: {problems}")`;
const e25 = R`import re

print(bool(re.fullmatch(r"[a-z_][a-z0-9_]*", "fetch_data")))     # snake_case: good
print(bool(re.fullmatch(r"[a-z_][a-z0-9_]*", "fetchData")))      # camelCase: not PEP 8 for functions
print(bool(re.fullmatch(r"[A-Z][A-Za-z0-9]*", "SpellBook")))     # PascalCase class
print(bool(re.fullmatch(r"[A-Z][A-Z0-9_]*", "MAX_HP")))          # CONSTANT

print(re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", "fetchDataNow").lower())`;
const st25 = R`import re

def to_snake(name):
    pass

PATTERNS = {
    "func": r"[a-z_][a-z0-9_]*",
    "var": r"[a-z_][a-z0-9_]*",
    "class": r"[A-Z][A-Za-z0-9]*",
    "const": r"[A-Z][A-Z0-9_]*",
}

def suggest(kind, name):
    pass

problems = 0
for item in input("Names: ").split():
    kind, _, name = item.partition(":")
`;

// ---------- 26 unused imports
const s26 = R`import ast

source = input("Code: ").replace(";", "\n")
try:
    tree = ast.parse(source)
except SyntaxError as error:
    print("Syntax error line", error.lineno)
else:
    imported = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imported.append(((alias.asname or alias.name).split(".")[0], node.lineno))
        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                if alias.name != "*":
                    imported.append((alias.asname or alias.name, node.lineno))
    used = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}
    unused = sorted((line, name) for name, line in imported if name not in used)
    for line, name in unused:
        print(f"line {line}: unused import {name}")
    print(f"Imports: {len(imported)}, unused: {len(unused)}")`;
const e26 = R`import ast

tree = ast.parse("import os\nx = 1 + 2\nprint(x)")
for node in ast.walk(tree):
    print(type(node).__name__)

names = {n.id for n in ast.walk(tree) if isinstance(n, ast.Name)}
print(sorted(names))`;

// ---------- 27 docstrings
const s27 = R`import ast

source = open("code.py").read()
tree = ast.parse(source)
missing = []
if not ast.get_docstring(tree):
    missing.append((1, "module", ""))
for node in ast.walk(tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        if node.name.startswith("_"):
            continue
        if not ast.get_docstring(node):
            kind = "class" if isinstance(node, ast.ClassDef) else "function"
            missing.append((node.lineno, kind, node.name))
for line, kind, name in sorted(missing):
    print(f"line {line}: {kind} {name}".rstrip() + " has no docstring")
print(f"Missing: {len(missing)}")`;
const e27 = R`import ast

source = '''"""Tools."""

def fine():
    """Documented."""

def lazy():
    return 1
'''
tree = ast.parse(source)
print(repr(ast.get_docstring(tree)))
for node in tree.body[1:]:
    print(node.name, node.lineno, repr(ast.get_docstring(node)))`;
const f27 = {
  A: `"""Tools."""

def public():
    """Ok."""

def undocumented():
    return 1

class Thing:
    def method(self):
        pass

def _private():
    pass
`,
  B: `x = 1
`,
  C: `"""All good."""

class A:
    """Doc."""

    def run(self):
        """Doc."""
`,
  D: `"""M."""

async def fetch():
    return 1
`};

// ---------- 28 complexity
const s28 = R`import ast

def complexity(func):
    score = 1
    for node in ast.walk(func):
        if isinstance(node, (ast.If, ast.IfExp, ast.For, ast.While, ast.ExceptHandler)):
            score += 1
        elif isinstance(node, ast.BoolOp):
            score += len(node.values) - 1
    return score

def rating(score):
    if score <= 5:
        return "ok"
    if score <= 10:
        return "warn"
    return "refactor"

tree = ast.parse(open("code.py").read())
results = [(complexity(n), n.name) for n in tree.body if isinstance(n, ast.FunctionDef)]
for score, name in sorted(results, key=lambda r: (-r[0], r[1])):
    print(f"{name} {score} {rating(score)}")`;
const e28 = R`import ast

source = '''
def grade(s):
    if s >= 90:
        return "A"
    elif s >= 80:
        return "B"
    return "F"
'''
func = ast.parse(source).body[0]
kinds = [type(n).__name__ for n in ast.walk(func) if isinstance(n, ast.If)]
print(kinds, "-> complexity", 1 + len(kinds))`;
const f28a = `def simple(x):
    return x + 1


def grade(s):
    if s >= 90:
        return "A"
    elif s >= 80:
        return "B"
    elif s >= 70:
        return "C"
    return "F"


def messy(items, flag):
    total = 0
    for item in items:
        if item > 0 and flag:
            total += item
        elif item < 0 or not flag:
            total -= 1
    while total > 100:
        total //= 2
    try:
        x = 1 / total
    except ZeroDivisionError:
        x = 0
    return x if total else 0
`;
const f28b = `def monster(a):
` + Array.from({length: 11}, (_, i) => `    if a == ${i + 1}:\n        return ${i + 1}`).join('\n') + `


def b():
    def inner(v):
        if v:
            return 1
        return 0
    return inner(1)


def a():
    return [x for x in range(3) if x]


class K:
    def m(self):
        if 1:
            pass
`;

// ---------- 29 formatting
const long29 = 'y = "' + 'a'.repeat(76) + '"';
const s29 = R`MAX = 79
text = open("code.py").read()
lines = text.split("\n")
if lines and lines[-1] == "":
    lines.pop()
    ends_with_newline = True
else:
    ends_with_newline = False
issues = []
for number, line in enumerate(lines, start=1):
    if line.rstrip() != line:
        issues.append((number, "W291", "trailing whitespace"))
    if "\t" in line[:len(line) - len(line.lstrip())]:
        issues.append((number, "W191", "tab indentation"))
    if len(line) > MAX:
        issues.append((number, "E501", f"line too long ({len(line)} > {MAX})"))
if text and not ends_with_newline:
    issues.append((len(lines), "W292", "no newline at end of file"))
for number, code, message in sorted(issues):
    print(f"{number}: {code} {message}")
print(f"Issues: {len(issues)}")`;
const e29 = R`line = "x = 1   "
print(repr(line.rstrip()), len(line))
print(len("	indented") - len("	indented".lstrip()))
text = "a = 1\nb = 2"
print(text.split("\n"), text.endswith("\n"))
print(text.splitlines(), "a = 1\nb = 2\n".split("\n"))`;
const f29 = {
  A: 'x = 1   \nif x:\n\treturn 2\n' + long29 + '\nz = 3',
  B: 'x = 1\nif x:\n    y = 2\n',
  C: 'x'.repeat(79) + '\n' + 'x'.repeat(80) + '\n',
  D: '',
  E: '\tx = 1 \n',
};

// ---------- 30 mission linter
const s30 = R`import ast

MAX = 79
source = open("code.py").read()
tree = ast.parse(source)
issues = []

for number, line in enumerate(source.splitlines(), start=1):
    if line.rstrip() != line:
        issues.append((number, "W291", "trailing whitespace"))
    if len(line) > MAX:
        issues.append((number, "E501", f"line too long ({len(line)} > {MAX})"))

imported = []
for node in ast.walk(tree):
    if isinstance(node, ast.Import):
        for alias in node.names:
            imported.append(((alias.asname or alias.name).split(".")[0], node.lineno))
    elif isinstance(node, ast.ImportFrom):
        for alias in node.names:
            imported.append((alias.asname or alias.name, node.lineno))
used = {n.id for n in ast.walk(tree) if isinstance(n, ast.Name)}
for name, line in imported:
    if name not in used:
        issues.append((line, "F401", f"'{name}' imported but unused"))

for node in ast.walk(tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        if not node.name.startswith("_") and not ast.get_docstring(node):
            issues.append((node.lineno, "D103", f"public function '{node.name}' has no docstring"))
        for default in node.args.defaults + node.args.kw_defaults:
            if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                issues.append((default.lineno, "B006", "mutable default argument"))
    elif isinstance(node, ast.ExceptHandler) and node.type is None:
        issues.append((node.lineno, "E722", "bare except"))
    elif isinstance(node, ast.Compare):
        for op, right in zip(node.ops, node.comparators):
            if isinstance(op, (ast.Eq, ast.NotEq)) and isinstance(right, ast.Constant) and right.value is None:
                issues.append((node.lineno, "E711", "comparison to None, use 'is'"))

issues.sort()
for line, code, message in issues:
    print(f"{line}: {code} {message}")
counts = {}
for _, code, _ in issues:
    counts[code] = counts.get(code, 0) + 1
for code in sorted(counts):
    print(f"{code}: {counts[code]}")
print(f"Total: {len(issues)}")
print("Verdict:", "PASS" if not issues else "FAIL")`;
const e30 = R`import ast

source = '''
try:
    risky()
except:
    pass
if x == None:
    pass
def f(a=[]):
    pass
'''
tree = ast.parse(source)
for node in ast.walk(tree):
    if isinstance(node, ast.ExceptHandler) and node.type is None:
        print(node.lineno, "bare except")
    if isinstance(node, ast.FunctionDef):
        for d in node.args.defaults:
            if isinstance(d, ast.List):
                print(node.lineno, "mutable default")`;
const f30a = `import os
import sys

def load(path, cache=[]):
    try:
        data = open(path).read()
    except:
        return None
    if data == None:
        return cache${'   '}
    return sys.argv
`;
const f30b = `"""Clean."""
import os


def show(path):
    """Show it."""
    try:
        return os.path.exists(path)
    except ValueError:
        return False
`;
const f30c = 'from x import y as z\n' + 'q = "' + 'a'.repeat(76) + '"\n';
const f30d = `def f(*, a={}, b=None):
    """d"""
    return a

async def g():
    pass
`;

LESSONS.push(
{
  id:'r12-25', realm:12, n:25, title:'Style and naming: PEP 8 in code',
  teaches:['q-style'], requires:['mission12c'],
  story:`At the **Polishing Hall**, Orrin shows two identical swords. One has a rough hilt and a bent handle, the other is gleaming. "Both cut," he says. "But only one will be gladly picked up by the next wielder. Code is read far more than it is written."`,
  concept:{
    html:`**PEP 8** is Python's style guide. Following it means any Python developer can read your code fast. Naming is the heart of it:\n\n| Thing | Style | Example |\n|---|---|---|\n| functions, variables, modules | \`snake_case\` | \`fetch_data\`, \`max_hp\` |\n| classes | \`PascalCase\` | \`SpellBook\` |\n| constants | \`UPPER_SNAKE\` | \`MAX_HP\` |\n| "private" by convention | leading underscore | \`_cache\` |\n\nOther basics: 4-space indents, lines up to 79 characters, two blank lines between top-level definitions, spaces around operators.\n\nYou can check names with **regular expressions**, but use the right matcher:\n\n- \`re.match\` only anchors the **start** (\`"abcDEF"\` matches \`[a-z]+\`)\n- \`re.fullmatch\` requires the **whole string** to fit. Use it for validation.\n\nConverting camelCase to snake_case with lookarounds (\`(?<=...)\` looks behind, \`(?=...)\` looks ahead) inserts an underscore *between* a lowercase and an uppercase letter without consuming any characters.`,
    analogy:`Traffic rules: not about being clever, but about everyone knowing what to expect.`,
    example:e25},
  predict:{code:R`import re
print(bool(re.match(r"[a-z]+", "abcDEF")), bool(re.fullmatch(r"[a-z]+", "abcDEF")))`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'match only checks the beginning; fullmatch needs the entire string to fit.'},
  cast:{code:e25, task:'Cast it.'},
  bug:{broken:R`import re
name = "fetch_Data"
print(bool(re.match(r"[a-z_][a-z0-9_]*", name)))`, task:'"fetch_Data" is NOT snake_case, but re.match only checks the beginning. Use fullmatch. Expected: False',
    cases:[{inputs:[],tests:[['Works','lines==["False"]'],['fullmatch','"fullmatch" in src']]}],
    sol:R`import re
name = "fetch_Data"
print(bool(re.fullmatch(r"[a-z_][a-z0-9_]*", name)))`, wrong:[R`print(False)`]},
  write:{prompt:'Check names. Ask `Names: ` (space-separated `kind:name` items; kind is `func`, `var`, `class` or `const`). Rules: func/var = `snake_case`, class = `PascalCase` (letters and digits, no underscores), const = `UPPER_SNAKE`. For each bad name print `bad <kind> <name> -> <fix>` where the fix is `snake_case` for func/var, `PascalCase` for class and `UPPER_SNAKE` for const. Then print `Problems: <n>` or `Clean` if there were none. Acronyms split like this: `HTTPServer` -> `http_server`.',
    starter:st25,
    inputs:['func:fetchData class:my_class class:myClass const:maxSize var:ok_name var:CamelVar class:Good const:API_KEY'],
    cases:[{inputs:['func:fetchData class:my_class class:myClass const:maxSize var:ok_name var:CamelVar class:Good const:API_KEY'],tests:[['Report','lines[-6:]==["bad func fetchData -> fetch_data","bad class my_class -> MyClass","bad class myClass -> MyClass","bad const maxSize -> MAX_SIZE","bad var CamelVar -> camel_var","Problems: 5"]']]},{inputs:['func:HTTPServer var:getHTTPResponse2 class:bad_Name'],tests:[['Acronyms','lines[-4:]==["bad func HTTPServer -> http_server","bad var getHTTPResponse2 -> get_http_response2","bad class bad_Name -> BadName","Problems: 3"]']]},{inputs:['func:run var:_private const:MAX class:Ok2'],tests:[['Clean','lines[-1]=="Clean"']]},{inputs:[''],tests:[['Nothing','lines[-1]=="Clean"']]}],
    sol:s25,
    wrong:[s25.replace('re.fullmatch(PATTERNS[kind], name)','re.match(PATTERNS[kind], name)'),s25.replace('snake = to_snake(name)','snake = name'),s25.replace('re.sub(r"(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])", "_", name)','re.sub("([A-Z])", r"_\\1", name)')],
    hints:['Validate with re.fullmatch(PATTERNS[kind], name): the WHOLE name must fit.','to_snake: insert "_" between a lowercase/digit and an uppercase letter, and between an acronym and a following capitalised word, then .lower().','Suggestions: class -> capitalise each "_" part of the snake form; const -> snake.upper(); func/var -> snake.',s25]},
  power:{can:['Apply PEP 8 naming conventions','Validate with fullmatch and convert names with lookarounds'],
    expand:'Add a `module` kind (lowercase, no underscores preferred) and flag `My-Module`.',
    where:'Linters like flake8 and ruff run these naming checks on every commit.',
    next:'Next: reading code as data with the ast module.'},
  codex:{title:'PEP 8 naming',body:'snake_case functions/variables, PascalCase classes, UPPER_SNAKE constants, _private. Validate with re.fullmatch (match only checks the start). Lookarounds insert underscores in camelCase.',snip:R`re.sub(r"(?<=[a-z0-9])(?=[A-Z])", "_", name).lower()`}
},
{
  id:'r12-26', realm:12, n:26, title:'Reading code as data: the ast module',
  teaches:['q-ast'], requires:['q-style'],
  story:`"Linters don't squint at your text," Orrin says. "They **take your code apart like a clockmaker** and inspect every gear." He opens a spell and reveals it's a tree: branches for statements, leaves for names.`,
  concept:{
    html:`Python can parse source code into an **abstract syntax tree** (AST): ordinary Python objects describing the program.\n\n\`\`\`\nimport ast\ntree = ast.parse("import os\\nx = 1 + 2\\nprint(x)")\n\nfor node in ast.walk(tree):          # visits every node in the tree\n    print(type(node).__name__)       # Module, Import, Assign, Expr, Call, Name, ...\n\`\`\`\n\nUseful node types:\n\n- \`ast.Import\` / \`ast.ImportFrom\`: \`.names\` is a list of aliases (\`.name\`, \`.asname\`), \`.lineno\` the line\n- \`ast.Name\`: a variable use, with \`.id\`\n- \`ast.FunctionDef\`, \`ast.ClassDef\`: \`.name\`, \`.body\`, \`.lineno\`\n- \`ast.Call\`, \`ast.If\`, \`ast.For\`, \`ast.Compare\`...\n\n- \`ast.parse\` raises \`SyntaxError\` (with \`.lineno\`) for broken code. **It never runs the code**, so it's safe.\n- Why not search the text? \`"os"\` also appears inside strings and comments. The tree knows which are real uses.\n- \`import os.path\` binds the name \`os\`; \`import numpy as np\` binds \`np\`.`,
    analogy:`Taking a sentence apart into subject, verb and object instead of counting letters.`,
    example:e26},
  predict:{code:R`import ast
print(ast.dump(ast.parse("x = 1").body[0].value))`, q:'What prints?', opts:['Constant(value=1)','Num(1)','Name(id=1)'], ans:0, why:'In modern Python a literal number is an ast.Constant.'},
  cast:{code:e26, task:'Cast it.'},
  bug:{broken:R`import ast
tree = ast.parse("from math import sqrt")
names = []
for node in ast.walk(tree):
    if isinstance(node, ast.Import):
        names += [a.name for a in node.names]
print(names)`, task:"It finds nothing: `from ... import` is a different node type. Handle ImportFrom too. Expected: ['sqrt']",
    cases:[{inputs:[],tests:[['Works','lines==["[\'sqrt\']"]'],['ImportFrom','"ImportFrom" in src']]}],
    sol:R`import ast
tree = ast.parse("from math import sqrt")
names = []
for node in ast.walk(tree):
    if isinstance(node, (ast.Import, ast.ImportFrom)):
        names += [a.name for a in node.names]
print(names)`, wrong:[R`print(['sqrt'])`]},
  write:{prompt:'Find unused imports. Ask `Code: ` (lines separated by `;`). Parse it with `ast`. On a `SyntaxError` print `Syntax error line <n>`. Otherwise collect the names the imports **bind** (`import a.b` binds `a`, `import x as y` binds `y`, `from m import n as k` binds `k`; ignore `*`), and report each one never used as a `Name`: `line <n>: unused import <name>` sorted by line, then `Imports: <total>, unused: <count>`.',
    starter:R`import ast

source = input("Code: ").replace(";", "\n")
`,
    inputs:['import os;import sys;print(sys.argv)'],
    cases:[{inputs:['import os;import sys;print(sys.argv)'],tests:[['Unused os','lines[-2:]==["line 1: unused import os","Imports: 2, unused: 1"]']]},{inputs:['from math import sqrt, pi;print(pi)'],tests:[['From-import','lines[-2:]==["line 1: unused import sqrt","Imports: 2, unused: 1"]']]},{inputs:["import os;print('os')"],tests:[['Strings do not count','lines[-2:]==["line 1: unused import os","Imports: 1, unused: 1"]']]},{inputs:['import numpy as np;x = np.zeros(2)'],tests:[['Alias used','lines[-1]=="Imports: 1, unused: 0"']]},{inputs:['def f(:'],tests:[['Syntax error','lines[-1]=="Syntax error line 1"']]},{inputs:[''],tests:[['Empty','lines[-1]=="Imports: 0, unused: 0"']]},{inputs:['import a, b;import c as d;print(b)'],tests:[['Several','lines[-3:]==["line 1: unused import a","line 2: unused import d","Imports: 3, unused: 2"]']]},{inputs:['import os.path;print(os.sep)'],tests:[['Dotted import binds first part','lines[-1]=="Imports: 1, unused: 0"']]}],
    sol:s26,
    wrong:[s26.replace('if name not in used','if source.count(name) < 2'),s26.replace('elif isinstance(node, ast.ImportFrom):','elif False:'),s26.replace('(alias.asname or alias.name).split(".")[0]','alias.name.split(".")[0]')],
    hints:['ast.parse(source) inside try/except SyntaxError; error.lineno has the line.','Walk the tree: ast.Import gives alias.name/asname; ast.ImportFrom too. The bound name is asname, else the first part of the dotted name.','used = {node.id for node in ast.walk(tree) if isinstance(node, ast.Name)}. Unused = bound names not in used.',s26]},
  power:{can:['Parse code into a tree and walk it','Find unused imports without running the code'],
    expand:'Also report unused imports inside functions (ast.walk already sees them).',
    where:'Tools like pyflakes, ruff, black and mypy are built on exactly this.',
    next:'Next: docstring checks on real files.'},
  codex:{title:'ast',body:'ast.parse(src) -> tree (never runs code). ast.walk(tree) visits all nodes. Import/ImportFrom (.names -> name, asname), Name (.id), FunctionDef (.name, .lineno). SyntaxError.lineno for broken code.',snip:R`tree = ast.parse(source)
used = {n.id for n in ast.walk(tree) if isinstance(n, ast.Name)}`}
},
{
  id:'r12-27', realm:12, n:27, title:'Docstrings: documenting for humans',
  teaches:['q-doc'], requires:['q-ast'],
  story:`Orrin opens a dusty spellbook. The spells work, but nobody knows what half of them do. "A function without a docstring is a locked door with no sign. Let's build a tool that **hunts for unlabelled doors**."`,
  concept:{
    html:`A **docstring** is a string literal as the first statement of a module, class or function. Tools and \`help()\` show it.\n\n\`\`\`\ndef average(numbers):\n    """Return the mean of numbers.\n\n    Raises ValueError for an empty list.\n    """\n\`\`\`\n\n- \`ast.get_docstring(node)\` returns the docstring (cleaned up) or \`None\`.\n- It works on a **Module**, **ClassDef**, **FunctionDef** and **AsyncFunctionDef**.\n- Convention: first line is a one-sentence summary ending with a period, then a blank line, then details.\n- Names starting with \`_\` are *private*: linters usually don't demand docs for them.\n- \`ast.walk\` finds **nested** items too, such as methods inside classes.\n\nNow the tool reads a real file. In this Spellbook the sandbox gives your program a file named \`code.py\` that you open like any other file.`,
    analogy:`Labels on drawers: private drawers need none, public ones must say what is inside.`,
    example:e27},
  predict:{code:R`import ast
t = ast.parse('def f():\n    """Hi."""')
print(ast.get_docstring(t.body[0]))`, q:'What prints?', opts:['Hi.','None','"""Hi."""'], ans:0, why:'get_docstring returns the cleaned text without quotes.'},
  cast:{code:e27, task:'Cast it.'},
  bug:{broken:R`import ast
tree = ast.parse("def f():\n    return 1")
func = tree.body[0]
print(func.docstring)`, task:'AttributeError: nodes have no .docstring attribute. Use ast.get_docstring(node). Expected: None',
    cases:[{inputs:[],tests:[['Works','lines==["None"]'],['Function','"get_docstring" in src']]}],
    sol:R`import ast
tree = ast.parse("def f():\n    return 1")
func = tree.body[0]
print(ast.get_docstring(func))`, wrong:[R`print(None)`]},
  write:{prompt:'Read the file `code.py` and parse it. Report public (not starting with `_`) functions, async functions and classes without a docstring, **including methods**, and also a missing module docstring. Print `line <n>: <kind> <name> has no docstring` sorted by line (kind is `function` or `class`; for the module print `line 1: module has no docstring`), then `Missing: <count>`.',
    starter:R`import ast

source = open("code.py").read()
tree = ast.parse(source)
`,
    inputs:[],
    cases:[{inputs:[],files:{'code.py':f27.A},tests:[['Report','lines[-4:]==["line 6: function undocumented has no docstring","line 9: class Thing has no docstring","line 10: function method has no docstring","Missing: 3"]']]},{inputs:[],files:{'code.py':f27.B},tests:[['Module','lines[-2:]==["line 1: module has no docstring","Missing: 1"]']]},{inputs:[],files:{'code.py':f27.C},tests:[['All documented','lines[-1]=="Missing: 0"']]},{inputs:[],files:{'code.py':f27.D},tests:[['Async','lines[-2:]==["line 3: function fetch has no docstring","Missing: 1"]']]}],
    sol:s27,
    wrong:[s27.replace('        if node.name.startswith("_"):\n            continue\n',''),s27.replace('ast.walk(tree)','tree.body'),s27.replace('(ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)','(ast.FunctionDef, ast.ClassDef)'),s27.replace('if not ast.get_docstring(tree):','if False:')],
    hints:['source = open("code.py").read(); tree = ast.parse(source).','ast.walk(tree) reaches methods too. Check isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)) and skip names starting with "_".','The module itself: ast.get_docstring(tree) is None means line 1: module has no docstring. Sort the findings by line.',s27]},
  power:{can:['Check documentation coverage automatically','Read real files in a program and analyse them with ast'],
    expand:'Also flag docstrings whose first line does not end in a period.',
    where:'Documentation checkers keep big projects (and your future self) sane.',
    next:'Next: measuring complexity.'},
  codex:{title:'Docstrings',body:'First string in a module/class/function. ast.get_docstring(node) -> text or None. Skip _private names. ast.walk finds methods. Convention: one-line summary, blank line, details.',snip:R`if not ast.get_docstring(node):
    ...`}
},
{
  id:'r12-28', realm:12, n:28, title:'Complexity: how tangled is this function?',
  teaches:['q-complexity'], requires:['q-doc'],
  story:`Orrin unrolls a spell so tangled with ifs and loops that it covers the whole floor. "Nobody understands this one, not even its author. We need a **number** that warns us before the knot gets this bad."`,
  concept:{
    html:`**Cyclomatic complexity** counts the independent paths through a function. More paths means more tests needed and more places to hide bugs.\n\nA simple recipe: start at **1**, then add 1 for each decision point:\n\n- \`if\` / \`elif\` (each \`elif\` is its own \`If\` node), conditional expression \`a if b else c\`\n- \`for\`, \`while\`\n- \`except\` clause\n- each extra operand of \`and\` / \`or\` (\`a and b and c\` adds 2: the node has 3 values)\n\n\`\`\`\nfor node in ast.walk(func):\n    if isinstance(node, (ast.If, ast.IfExp, ast.For, ast.While, ast.ExceptHandler)):\n        score += 1\n    elif isinstance(node, ast.BoolOp):\n        score += len(node.values) - 1\n\`\`\`\n\nRules of thumb: **1-5 fine, 6-10 getting hard, over 10 refactor**.\n\n- Cure: extract helper functions, use early returns, replace long \`if/elif\` chains with a dictionary lookup.\n- Count a function's nested helpers inside it, because they add to what a reader must hold in their head.`,
    analogy:`A road map: the more junctions, the more ways to get lost.`,
    example:e28},
  predict:{code:R`import ast
t = ast.parse("x = a and b and c")
print(len(t.body[0].value.values))`, q:'What prints?', opts:['3','2','1'], ans:0, why:'One BoolOp holds three operands, so it adds 2 to the complexity.'},
  cast:{code:e28, task:'Cast it.'},
  bug:{broken:R`def complexity(ifs, loops, bool_ops):
    score = 0
    score += ifs + loops + bool_ops
    return score

print(complexity(2, 1, 1))`, task:'A function with no branches still has 1 path, so counting must start at 1. Fix it. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['Start at 1','"score = 1" in src']]}],
    sol:R`def complexity(ifs, loops, bool_ops):
    score = 1
    score += ifs + loops + bool_ops
    return score

print(complexity(2, 1, 1))`, wrong:[R`print(5)`]},
  write:{prompt:'Read `code.py`. For every **top-level function** (not methods) compute its complexity (start 1; +1 for each `If`, `IfExp`, `For`, `While`, `ExceptHandler`; +`len(values)-1` for each `BoolOp`; nested functions count inside their parent). Print `<name> <score> <rating>` sorted by score highest first (ties by name), with ratings `ok` (1-5), `warn` (6-10), `refactor` (11+).',
    starter:R`import ast

tree = ast.parse(open("code.py").read())
`,
    inputs:[],
    cases:[{inputs:[],files:{'code.py':f28a},tests:[['Scores','lines[-3:]==["messy 9 warn","grade 4 ok","simple 1 ok"]']]},{inputs:[],files:{'code.py':f28b},tests:[['Monster, nested, comprehension, methods ignored','lines[-3:]==["monster 12 refactor","b 2 ok","a 1 ok"]'],['Only top-level','len(lines)==3']]}],
    sol:s28,
    wrong:[s28.replace('        elif isinstance(node, ast.BoolOp):\n            score += len(node.values) - 1\n',''),s28.replace('score = 1','score = 0'),s28.replace('-r[0]','r[0]'),s28.replace('for n in tree.body if','for n in ast.walk(tree) if')],
    hints:['complexity(func): score = 1, then walk the function and add for each decision node.','If, IfExp, For, While, ExceptHandler add 1. A BoolOp adds len(node.values) - 1.','Iterate tree.body only (top-level), build (score, name) pairs and sort with key=lambda r: (-r[0], r[1]).',s28]},
  power:{can:['Measure cyclomatic complexity','Spot functions that need refactoring'],
    expand:'Also count `with` blocks, `assert` and `match` cases, and see how the ratings shift.',
    where:'Code-quality dashboards (SonarQube, radon) track exactly this number.',
    next:'Next: formatting checks: whitespace and line length.'},
  codex:{title:'Complexity',body:'Start at 1; +1 per if/elif, ternary, for, while, except; +operands-1 per and/or. 1-5 ok, 6-10 warn, 11+ refactor. Extract helpers, use early returns or dict lookups.',snip:R`if isinstance(node, (ast.If, ast.For, ast.While)):
    score += 1`}
},
{
  id:'r12-29', realm:12, n:29, title:'Formatting checks: whitespace and line length',
  teaches:['q-format'], requires:['q-complexity'],
  story:`"Invisible mistakes are the worst kind," Orrin sighs, holding a page that looks perfect and fails inspection. "A space nobody can see. A tab hiding in the margin. A line that runs off the edge of the world."`,
  concept:{
    html:`Formatting problems are plain **text** problems, so no \`ast\` needed. Typical checks:\n\n| Code | Problem |\n|---|---|\n| \`E501\` | line longer than 79 characters |\n| \`W291\` | trailing whitespace |\n| \`W191\` | tab used for indentation |\n| \`W292\` | file doesn't end with a newline |\n\nTools you need:\n\n- \`line.rstrip() != line\` means the line has trailing whitespace\n- \`line[:len(line) - len(line.lstrip())]\` is the **indentation** part\n- \`text.split("\\n")\` keeps a final empty item when the text ends with a newline, \`splitlines()\` does not. Use that difference to detect the missing final newline.\n- \`enumerate(lines, start=1)\` gives human line numbers.\n\n⚠️ A bug that bites linters: a line read from a file ends with \`"\\n"\`, which \`rstrip()\` removes. Strip the newline first (\`rstrip("\\n")\`) before checking for trailing spaces.\n\nIn practice you let a formatter (black, ruff format) fix these automatically, and a checker confirm.`,
    analogy:`A proofreader looking for stray ink smudges, not bad ideas.`,
    example:e29},
  predict:{code:R`print(repr("x = 1   ".rstrip()), len("x = 1   "))`, q:'What prints?', opts:["'x = 1' 8","'x = 1   ' 5","'x = 1' 5"], ans:0, why:'rstrip removes the trailing spaces; the original is 8 characters long.'},
  cast:{code:e29, task:'Cast it.'},
  bug:{broken:R`for line in ["x = 1   \n", "x = 1\n"]:
    print(line.rstrip() != line)`, task:'Both lines report trailing whitespace because of the newline character. Remove the newline first. Expected: True then False',
    cases:[{inputs:[],tests:[['Works','lines==["True","False"]'],['Strips newline only','\'rstrip("\\\\n")\' in src or "splitlines" in src or "[:-1]" in src']]}],
    sol:R`for line in ["x = 1   \n", "x = 1\n"]:
    line = line.rstrip("\n")
    print(line.rstrip() != line)`, wrong:[R`print("True")
print("False")`]},
  write:{prompt:'Read `code.py` and report: `E501` for lines longer than 79 characters (`line too long (<len> > 79)`), `W291` trailing whitespace, `W191` tab indentation, and `W292` (`no newline at end of file`, reported on the last line) when the file does not end with a newline. Print `<line>: <code> <message>` sorted by line then code, then `Issues: <n>`.',
    starter:R`MAX = 79
text = open("code.py").read()
`,
    inputs:[],
    cases:[{inputs:[],files:{'code.py':f29.A},tests:[['All four','lines[-5:]==["1: W291 trailing whitespace","3: W191 tab indentation","4: E501 line too long (82 > 79)","5: W292 no newline at end of file","Issues: 4"]']]},{inputs:[],files:{'code.py':f29.B},tests:[['Clean','lines[-1]=="Issues: 0"']]},{inputs:[],files:{'code.py':f29.C},tests:[['79 ok, 80 too long','lines[-2:]==["2: E501 line too long (80 > 79)","Issues: 1"]']]},{inputs:[],files:{'code.py':f29.D},tests:[['Empty file','lines[-1]=="Issues: 0"']]},{inputs:[],files:{'code.py':f29.E},tests:[['Same line, sorted codes','lines[-3:]==["1: W191 tab indentation","1: W291 trailing whitespace","Issues: 2"]']]}],
    sol:s29,
    wrong:[s29.replace('len(line) > MAX','len(line) >= MAX'),s29.replace('line.rstrip() != line','line.strip() != line'),s29.replace('if text and not ends_with_newline:','if False:'),s29.replace('"\\t" in line[:len(line) - len(line.lstrip())]','False')],
    hints:['Split with text.split("\\n"); if the last item is "" the file ends with a newline (pop it).','Per line (number from 1): rstrip() != line -> W291; a tab in the indentation -> W191; len(line) > 79 -> E501.','If the text is non-empty and did not end in a newline, add W292 on the last line. Sort by (line, code).',s29]},
  power:{can:['Detect common whitespace and length problems','Report issues in the standard linter style'],
    expand:'Add an auto-fix that rewrites the file: strip trailing spaces, tabs to 4 spaces, final newline.',
    where:'pycodestyle, flake8 and black enforce these rules on every Python project.',
    next:'Next: Real-World Mission: build a full linter.'},
  codex:{title:'Format checks',body:'E501 length, W291 trailing whitespace (rstrip() != line), W191 tab indentation, W292 missing final newline. split("\\n") keeps a trailing empty item, splitlines() does not.',snip:R`if line.rstrip() != line:
    issues.append((number, "W291", "trailing whitespace"))`}
},
{
  id:'r12-30', realm:12, n:30, title:'Real-World Mission: The Spell Linter',
  teaches:['mission12d'], requires:['q-format'],
  story:`The Guild asks for a single inspector that reads any spell file and returns a verdict before the spell goes into the vault. "Unused imports, undocumented functions, careless exceptions, the mutable-default trap and untidy margins," Orrin lists. "Combine everything you've learned. Make it a gate that only good code passes."`,
  concept:{
    html:`Your linter combines text checks and \`ast\` checks into one report. The new rules:\n\n| Code | Rule | How to find it |\n|---|---|---|\n| \`E722\` | bare \`except:\` swallows *everything*, even Ctrl-C | \`ast.ExceptHandler\` with \`node.type is None\` |\n| \`E711\` | \`x == None\` | \`ast.Compare\` with \`Eq\`/\`NotEq\` and a \`Constant\` whose value is \`None\` |\n| \`B006\` | mutable default argument | \`node.args.defaults\` + \`kw_defaults\` containing \`List\`, \`Dict\`, \`Set\` |\n| \`D103\` | public function without docstring | \`ast.get_docstring\` |\n| \`F401\` | unused import | names vs \`ast.Name\` uses |\n| \`E501\` / \`W291\` | long line / trailing space | text checks |\n\nWhy are two of these dangerous?\n\n- **Mutable default**: \`def f(cache=[])\` creates the list **once**, shared by every call, so it remembers old data between calls.\n- **\`== None\`**: a class can define \`__eq__\` to return anything. \`is None\` can't be fooled.\n\nSort the findings by line, summarise per code, and end with a verdict.`,
    analogy:`A building inspector with a checklist: each failed item on the report, and one stamp at the end.`,
    example:e30},
  predict:{code:R`class Weird:
    def __eq__(self, other):
        return True
print(Weird() == None, Weird() is None)`, q:'What prints?', opts:['True False','True True','False False'], ans:0, why:'== calls the custom __eq__, which lies; "is" checks identity and cannot be fooled.'},
  cast:{code:e30, task:'Cast it.'},
  bug:{broken:R`def add_item(item, items=[]):
    items.append(item)
    return items

add_item("a")
print(add_item("b"))`, task:"The default list is shared between calls, so 'a' leaks into the second call. Use None as the default. Expected: ['b']",
    cases:[{inputs:[],tests:[['Works','lines==["[\'b\']"]'],['None default','"=None" in src.replace(" ", "")']]}],
    sol:R`def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

add_item("a")
print(add_item("b"))`, wrong:[R`print(['b'])`]},
  write:{prompt:'Write the linter. Read `code.py` and report, sorted by (line, code): `W291` and `E501` (`line too long (<len> > 79)`), `F401` (`\'<name>\' imported but unused`), `D103` (`public function \'<name>\' has no docstring`, functions and async functions not starting with `_`), `B006` (`mutable default argument`, `[]`, `{}` or a set literal in positional or keyword-only defaults), `E722` (`bare except`), `E711` (`comparison to None, use \'is\'`). Print each as `<line>: <code> <message>`, then one `<code>: <count>` line per code (sorted), then `Total: <n>` and `Verdict: PASS` (no issues) or `Verdict: FAIL`.',
    starter:R`import ast

MAX = 79
source = open("code.py").read()
tree = ast.parse(source)
issues = []
`,
    inputs:[],
    cases:[{inputs:[],files:{'code.py':f30a},tests:[['Full report',eqD(["1: F401 'os' imported but unused","4: B006 mutable default argument","4: D103 public function 'load' has no docstring","7: E722 bare except","9: E711 comparison to None, use 'is'","10: W291 trailing whitespace","B006: 1","D103: 1","E711: 1","E722: 1","F401: 1","W291: 1","Total: 6","Verdict: FAIL"])],['Total and verdict','lines[-2:]==["Total: 6","Verdict: FAIL"]']]},{inputs:[],files:{'code.py':f30b},tests:[['Clean file','lines[-2:]==["Total: 0","Verdict: PASS"] and len(lines)==2']]},{inputs:[],files:{'code.py':f30c},tests:[['Import and length','lines[-6:]==["1: F401 \'z\' imported but unused","2: E501 line too long (82 > 79)","E501: 1","F401: 1","Total: 2","Verdict: FAIL"]']]},{inputs:[],files:{'code.py':f30d},tests:[['Keyword-only default and async','lines[-6:]==["1: B006 mutable default argument","5: D103 public function \'g\' has no docstring","B006: 1","D103: 1","Total: 2","Verdict: FAIL"]']]}],
    sol:s30,
    wrong:[s30.replace('    elif isinstance(node, ast.Compare):','    elif False:'),s30.replace(' + node.args.kw_defaults',''),s30.replace('(ast.FunctionDef, ast.AsyncFunctionDef)','ast.FunctionDef'),s30.replace('"PASS" if not issues else "FAIL"','"PASS"'),s30.replace('isinstance(node, ast.ExceptHandler) and node.type is None','isinstance(node, ast.ExceptHandler)')],
    hints:['Collect everything into one issues list of (line, code, message) tuples, then issues.sort().','Text checks use splitlines; import and function checks use ast.walk. ExceptHandler.type is None means a bare except; Compare has .ops and .comparators.','Defaults: node.args.defaults + node.args.kw_defaults (the latter may contain None). Count per code with a dict.',s30]},
  power:{can:['Build a multi-rule linter from ast and text checks','Explain why mutable defaults, bare excepts and == None are dangerous'],
    expand:'Read the filename from `sys.argv`-style input and lint several files in a row.',
    where:'This is what ruff and flake8 do, on millions of lines, in milliseconds.',
    next:'Next: command-line tools with argparse.'},
  codex:{title:'Mini linter',body:'One issues list of (line, code, message); text checks + ast checks; sort; count per code; verdict. Bare except = ExceptHandler.type None. Mutable default = List/Dict/Set in args.defaults/kw_defaults. Use "is None".',snip:R`issues.sort()
for line, code, message in issues:
    print(f"{line}: {code} {message}")`}
}
);
