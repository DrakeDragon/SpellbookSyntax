"""Authoring helper for Realm 14. Specs are written in Python; expected outputs are computed by
running the reference solutions, so test expectations can never drift from reality.
Emitted JS uses JSON strings (no template-literal escaping problems)."""
import json, os, subprocess, tempfile, sys

HERE = os.path.dirname(os.path.abspath(__file__))
RUN = os.path.join(HERE, 'run_local.py')


def run(src, inputs=(), files=None):
    """Run a program like the in-browser runner does; return list of stdout lines."""
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as f:
        f.write(src)
        path = f.name
    try:
        r = subprocess.run([sys.executable, RUN, path, json.dumps(list(inputs)), json.dumps(files or {})],
                           capture_output=True, text=True, timeout=60)
    finally:
        os.unlink(path)
    out = r.stdout
    if r.returncode != 0 or 'Traceback' in r.stderr:
        raise RuntimeError('program crashed:\n' + src[:400] + '\n' + r.stderr[-600:])
    lines = out.split('\n')
    while lines and lines[-1] == '':
        lines.pop()
    return lines


def mutate(sol, pairs):
    out = []
    for p in pairs:
        if isinstance(p, str):
            out.append(p)
            continue
        old, new = p
        assert old in sol, 'mutation target not found: ' + repr(old[:70])
        m = sol.replace(old, new)
        assert m != sol
        out.append(m)
    return out


def tests_for(sol, case, files=None):
    lines = run(sol, case.get('inputs', []), case.get('files', files))
    tests = [[case.get('name', 'Output'), 'lines==' + json.dumps(lines)]]
    for t in case.get('extra', []):
        tests.append(list(t))
    return tests


def mk_cases(sol, cases, files=None):
    out = []
    for c in cases:
        d = {'inputs': c.get('inputs', []), 'tests': tests_for(sol, c, files)}
        f = c.get('files', files)
        if f:
            d['files'] = f
        out.append(d)
    return out


def predict(code, q, opts, ans, why, inputs=None):
    lines = run(code, inputs or [])
    assert len(lines) == 1 and lines[0] == opts[ans], 'predict mismatch: %r vs %r' % (lines, opts[ans])
    return {'code': code, 'q': q, 'opts': opts, 'ans': ans, 'why': why}


def lesson(id, n, title, teaches, requires, story, html, analogy, example, pred, bug, write, power, codex, cast_inputs=None):
    realm = int(id.split('-')[0][1:])
    run(example, cast_inputs or [])  # must not crash
    b_sol = bug['sol']
    b_cases = mk_cases(b_sol, [dict(inputs=[], name='Works', extra=bug.get('extra', []))])
    # broken code must not produce the expected output (the verify gate also checks this)
    w_sol = write['sol']
    w_cases = mk_cases(w_sol, write['cases'], write.get('files'))
    d = {
        'id': id, 'realm': realm, 'n': n, 'title': title, 'teaches': teaches, 'requires': requires, 'story': story,
        'concept': {'html': html, 'analogy': analogy, 'example': example},
        'predict': pred,
        'cast': {'code': example, 'task': 'Cast it.'},
        'bug': {'broken': bug['broken'], 'task': bug['task'], 'cases': b_cases, 'sol': b_sol,
                'wrong': mutate(b_sol, bug['wrong'])},
        'write': {'prompt': write['prompt'], 'starter': write['starter'],
                  'inputs': write.get('inputs') or write['cases'][0].get('inputs', []),
                  'cases': w_cases, 'sol': w_sol, 'wrong': mutate(w_sol, write['wrong']),
                  'hints': list(write['hints'][:3]) + [w_sol]},
        'power': power, 'codex': codex,
    }
    if cast_inputs:
        d['cast']['inputs'] = cast_inputs
    if write.get('files'):
        d['write']['files'] = write['files']
    return d


def mcq(code, q, opts, ans, why, tags, inputs=None):
    lines = run(code, inputs or [])
    assert len(lines) == 1 and lines[0] == opts[ans], 'mcq mismatch: %r vs %r' % (lines, opts[ans])
    p = {'type': 'mcq', 'code': code, 'q': q, 'opts': opts, 'ans': ans, 'why': why, 'tags': tags}
    if inputs:
        p['inputs'] = inputs
    return p


def wphase(prompt, starter, sol, cases, wrong, hints, tags, files=None):
    return {'type': 'write', 'prompt': prompt, 'starter': starter,
            'inputs': cases[0].get('inputs', []),
            'cases': mk_cases(sol, cases, files), 'sol': sol, 'wrong': mutate(sol, wrong),
            'hints': list(hints[:3]) + [sol], 'tags': tags}


def boss(id, n, title, teaches, requires, story, name, hp, phases, power, codex):
    return {'id': id, 'realm': int(id.split('-')[0][1:]), 'n': n, 'title': title, 'kind': 'boss', 'teaches': teaches,
            'requires': requires, 'story': story, 'boss': {'name': name, 'hp': hp}, 'phases': phases,
            'power': power, 'codex': codex}


def gap(id, n, title, teaches, requires, story, phases, power, codex, pass_pct=80):
    return {'id': id, 'realm': int(id.split('-')[0][1:]), 'n': n, 'title': title, 'kind': 'gap', 'passPct': pass_pct,
            'teaches': teaches, 'requires': requires, 'story': story, 'phases': phases, 'power': power, 'codex': codex}


def emit(fname, header, lessons):
    path = os.path.join(HERE, '..', 'src', 'lessons', fname)
    body = ',\n'.join(json.dumps(l, ensure_ascii=False, indent=None) for l in lessons)
    with open(path, 'w') as f:
        f.write('// ' + header + '\nLESSONS.push(\n' + body + '\n);\n')
    print('wrote', fname, len(lessons), 'lessons', os.path.getsize(path), 'bytes')
