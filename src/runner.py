import sys, io, builtins, time, traceback, json, linecache, re, os, shutil, tempfile, gc, contextlib

class SpellTimeout(Exception):
    pass

FRIENDLY_FILE = "<spell>"


def _format_error(e):
    etype = type(e).__name__
    try:
        if isinstance(e, SyntaxError):
            body = "".join(traceback.format_exception_only(type(e), e))
            body = body.replace('File "<spell>"', 'File "<spell>"')
            text = "Traceback (most recent call last):\n" + body
            line = e.lineno
        else:
            frames = [f for f in traceback.extract_tb(e.__traceback__) if f.filename == FRIENDLY_FILE]
            line = frames[-1].lineno if frames else None
            text = "Traceback (most recent call last):\n"
            text += "".join(traceback.format_list(frames))
            text += "".join(traceback.format_exception_only(type(e), e))
    except Exception:
        text = etype + ": " + str(e)
        line = None
    msg = str(e)
    if isinstance(e, SyntaxError):
        msg = e.msg
    return {"type": etype, "msg": msg, "line": line, "text": text.rstrip()}


_REAL_SLEEP = time.sleep


def _fast_sleep(seconds):
    # Keep lessons snappy: real pauses are shortened inside the Spellbook.
    try:
        _REAL_SLEEP(min(float(seconds), 0.02))
    except Exception:
        pass


def _run_once(code, inputs, timeout=4.0):
    time.sleep = _fast_sleep
    buf = io.StringIO()
    old_out, old_err = sys.stdout, sys.stderr
    sys.stdout = buf
    sys.stderr = buf
    queue = list(inputs)

    def fake_input(prompt=""):
        buf.write(str(prompt))
        if not queue:
            raise EOFError("input() wanted an answer, but the Inputs box ran out. Add another line to the Inputs box.")
        v = str(queue.pop(0))
        buf.write(v + "\n")
        return v

    linecache.cache[FRIENDLY_FILE] = (len(code), None, code.splitlines(True) or [""], FRIENDLY_FILE)
    g = {"__name__": "__main__", "input": fake_input}
    err = None
    deadline = time.time() + timeout
    counter = [0]

    def local_trace(frame, event, arg):
        if event == "line":
            counter[0] += 1
            if counter[0] % 400 == 0:
                if time.time() > deadline:
                    raise SpellTimeout("This spell ran too long. Is there a loop that never ends?")
                if buf.tell() > 20000:
                    raise SpellTimeout("This spell printed far too much. Is there a loop that never ends?")
        return local_trace

    def global_trace(frame, event, arg):
        if frame.f_code.co_filename == FRIENDLY_FILE:
            return local_trace
        return None

    try:
        try:
            compiled = compile(code, FRIENDLY_FILE, "exec")
        except SyntaxError as e:
            err = _format_error(e)
            compiled = None
        if compiled is not None:
            sys.settrace(global_trace)
            try:
                exec(compiled, g)
            except BaseException as e:
                sys.settrace(None)
                err = _format_error(e)
            finally:
                sys.settrace(None)
    finally:
        sys.settrace(None)
        time.sleep = _REAL_SLEEP
        sys.stdout, sys.stderr = old_out, old_err
    return buf.getvalue(), err, g


def _read(name, binary=False):
    try:
        with open(name, "rb" if binary else "r", encoding=None if binary else "utf-8") as f:
            return f.read()
    except Exception:
        return None


def _exists(name):
    return os.path.exists(name)


def _listdir(path="."):
    try:
        return sorted(os.listdir(path))
    except Exception:
        return []


def _check(code, out, err, g, inputs, tests):
    lines = out.splitlines()

    def last(n):
        return lines[-n:]

    def norm(s):
        return " ".join(str(s).split())

    env = {"out": out, "lines": lines, "g": g, "src": code, "inputs": inputs, "err": err,
           "last": last, "norm": norm, "re": re,
           "read": _read, "exists": _exists, "listdir": _listdir, "os": os, "json": json}
    res = []
    for name, expr in tests:
        ok = False
        if err is None:
            try:
                ok = bool(eval(expr, env))
            except Exception:
                ok = False
        res.append({"name": name, "ok": ok})
    return res


class _Sandbox:
    """Fresh empty working folder per run, with optional pre-made files."""
    def __init__(self, files):
        self.files = files or {}

    def __enter__(self):
        self.old = os.getcwd()
        self.dir = tempfile.mkdtemp(prefix="spell_")
        for name, content in self.files.items():
            path = os.path.join(self.dir, name)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(content)
        os.chdir(self.dir)
        self.saved_path = list(sys.path)
        sys.path.insert(0, self.dir)
        self.mods = set(sys.modules)
        return self

    def __exit__(self, *a):
        for m in list(sys.modules):
            if m in self.mods:
                continue
            mod = sys.modules.get(m)
            where = str(getattr(mod, "__file__", "") or "")
            paths = [str(p) for p in (getattr(mod, "__path__", None) or [])]
            if where.startswith(self.dir) or (where and not os.path.isabs(where)) or any(p.startswith(self.dir) for p in paths):
                del sys.modules[m]
        try:
            import logging
            for h in list(logging.root.handlers):
                logging.root.removeHandler(h)
            logging.root.setLevel(logging.WARNING)
            logging.disable(logging.NOTSET)
        except Exception:
            pass
        sys.path[:] = self.saved_path
        os.chdir(self.old)
        shutil.rmtree(self.dir, ignore_errors=True)
        import importlib
        importlib.invalidate_caches()


def _sweep():
    # collect leftovers now so a stray 'coroutine was never awaited' warning cannot leak into the NEXT run's output
    try:
        with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
            gc.collect()
    except Exception:
        pass


def run_job(job_json):
    job = json.loads(job_json)
    code = job.get("code", "")
    inputs = job.get("inputs", [])
    base_files = job.get("files") or {}
    with _Sandbox(base_files):
        out, err, g = _run_once(code, inputs)
    g = None
    _sweep()
    result = {"display": {"out": out, "err": err}, "cases": []}
    for case in job.get("cases", []):
        cin = case.get("inputs", [])
        files = case.get("files")
        if files is None:
            files = base_files
        with _Sandbox(files):
            cout, cerr, cg = _run_once(code, cin)
            res = _check(code, cout, cerr, cg, cin, case.get("tests", []))
        cg = None
        _sweep()
        result["cases"].append({"results": res, "err": cerr})
    return json.dumps(result)
