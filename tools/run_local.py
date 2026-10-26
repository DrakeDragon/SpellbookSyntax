import sys, json, os, tempfile, builtins, io, contextlib, shutil
sol, inputs, files = sys.argv[1], json.loads(sys.argv[2]), json.loads(sys.argv[3]) if len(sys.argv)>3 else {}
d = tempfile.mkdtemp()
for n, c in files.items():
    p = os.path.join(d, n); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", newline="").write(c)
src = open(os.path.abspath(sol)).read()
os.chdir(d)
it = iter(inputs)
def fake(prompt=""):
    a = next(it)
    print(prompt + a)
    return a
builtins.input = fake
try:
    exec(compile(src, "main", "exec"), {"__name__": "__main__"})
except SystemExit: pass

