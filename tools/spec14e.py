from gen14 import *

L = []

# ------------------------------------------------------------------ boss
once_sol = r'''import functools

def once(func):
    state = {}
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if "result" not in state:
            state["result"] = func(*args, **kwargs)
        return state["result"]
    return wrapper

counter = {"n": 0}

@once
def setup():
    counter["n"] += 1
    return f"ready{counter['n']}"

for _ in range(int(input("Calls: "))):
    print(setup())
print("Ran", counter["n"], "time(s)")'''
once_start = once_sol[:once_sol.index('def once')] + '''# write the once decorator here

''' + once_sol[once_sol.index('counter = '):]

qs_sol = r'''from urllib.parse import urlparse, parse_qs

target = input("Target: ")
parts = urlparse(target)
print("Path:", parts.path)
for key, values in sorted(parse_qs(parts.query).items()):
    print(key, "=", "|".join(values))'''
qs_start = r'''from urllib.parse import urlparse, parse_qs

target = input("Target: ")
'''

run_sol = r'''class Pause:
    def __await__(self):
        yield

async def compute(n):
    for _ in range(n):
        await Pause()
    return n * n

def run(coro):
    pauses = 0
    try:
        while True:
            coro.send(None)
            pauses += 1
    except StopIteration as stop:
        return stop.value, pauses

n = int(input("N: "))
value, pauses = run(compute(n))
print(f"Result: {value} after {pauses} pauses")'''
run_start = run_sol[:run_sol.index('def run')] + '''# write run(coro) here: return (result, number of pauses)

''' + run_sol[run_sol.index('n = int(input'):]

phases = [
 mcq(r'''def g():
    x = yield 1
    yield x * 2

it = g()
a = next(it)
b = it.send(21)
print(a, b)''', 'Strike 1 (Clockwork): What prints?', ['1 42', '1 21', '1 2'], 0, 'send(21) resumes the generator and makes the paused yield evaluate to 21, so the next yield hands out 21 * 2 = 42.', ['gen-pause', 'coro-pause']),
 wphase('Strike 2 (Web): Ask `Target: ` (a path with an optional query string). Print `Path: <path>`, then one line `<key> = <values joined by |>` for every query key in **alphabetical order** (decode escapes; repeated keys list all their values).',
  qs_start, qs_sol,
  [dict(inputs=['/search?q=red+shoes&page=2&tag=b&tag=a'], name='Full'), dict(inputs=['/plain'], name='No query'), dict(inputs=['/find?q=caf%C3%A9&z=1&a=%26'], name='Escapes and order'), dict(inputs=['/x?tag=one&tag=two&tag=three'], name='Repeated key')],
  [('sorted(parse_qs(parts.query).items())', 'parse_qs(parts.query).items()'), ('"|".join(values)', 'values[0]'), ('parts.path', 'target'), ('print("Path:", parts.path)', 'print("Path:", parts.path.upper())'), ('parse_qs(parts.query)', 'dict(p.split("=") for p in parts.query.split("&") if p)') ],
  ['urlparse(target) gives .path and .query.', 'parse_qs(parts.query) is a dict of lists; sorted(...items()) orders the keys.', 'Print key, "=", and "|".join(values).'], ['web-query']),
 mcq(r'''tp, fp, fn = 6, 2, 3
print(round(tp / (tp + fp), 2))''', 'Strike 3 (Data): What is the precision?', ['0.75', '0.67', '0.25'], 0, 'Precision = TP / (TP + FP) = 6 / 8 = 0.75. (Recall would use FN: 6 / 9 = 0.67.)', ['ml-metrics']),
 wphase('Strike 4 (Craft): Write a decorator `once` so that a function runs **only the first time**; every later call returns the first call\'s result without running the function again. Keep the function\'s name with `functools.wraps`. Ask `Calls: ` and call `setup()` that many times, printing each result.',
  once_start, once_sol,
  [dict(inputs=['3'], name='Three calls', extra=[('Name kept', 'g["setup"].__name__ == "setup"')]), dict(inputs=['0'], name='No calls'), dict(inputs=['1'], name='One call')],
  [('        if "result" not in state:\n            state["result"] = func(*args, **kwargs)\n        return state["result"]', '        return func(*args, **kwargs)'), ('        @functools.wraps(func)\n', '') if False else ('    @functools.wraps(func)\n', ''), ('state["result"] = func(*args, **kwargs)', 'state["result"] = None'), ('        if "result" not in state:', '        if True:'), ('return state["result"]', 'return func(*args, **kwargs)')],
  ['Keep a dict state inside once(), not inside wrapper.', 'In wrapper: if "result" not in state, call func and store it. Always return state["result"].', 'Add @functools.wraps(func) above wrapper.'], ['craft-retry', 'r13-20']),
 wphase('Strike 5 (Clockwork): `compute(n)` pauses `n` times and returns `n * n`. Write `run(coro)` that drives a coroutine to the end with `send(None)` and returns `(result, number_of_pauses)`. Ask `N: `.',
  run_start, run_sol,
  [dict(inputs=['3'], name='Three pauses'), dict(inputs=['0'], name='No pauses'), dict(inputs=['7'], name='Seven')],
  [('            pauses += 1\n', ''), ('        return stop.value, pauses', '        return stop.value, pauses + 1'), ('        return stop.value, pauses', '        return pauses, pauses'), ('            coro.send(None)\n            pauses += 1', '            pauses += 1\n            coro.send(None)') if False else ('coro.send(None)', 'next(iter(()), None)')],
  ['Loop forever calling coro.send(None); each time it returns, the coroutine paused once.', 'When the coroutine ends, StopIteration is raised; its .value is the result.', 'Return (stop.value, pauses) from the except block.'], ['coro-pause', 'coro-gather']),
]
L.append(boss('r14-41', 41, 'Boss: The Four-Door Chimera', ['realm14-boss'], ['mission14d'],
 "The four doors slam together and merge into a four-faced **brass Chimera**: one face ticks like a clock, one speaks in headers and status codes, one wears a mask of glowing numbers, one holds a toolbox. \"It has five questions,\" Quill says, tightening the strap on the Archmage's hat. \"Answer each from a different guild. Think, test the edges, and strike when you are sure.\"",
 'The Four-Door Chimera', 5, phases,
 dict(can=['Combine async, web, data and craft skills in one sitting', 'Read unfamiliar code and predict what it does'], expand='Write your own boss: pick one idea from each guild and combine them into a single program.', where='Senior-level work means moving between these worlds in the same afternoon.', next='The final test: the Four Doors Gap Check.'),
 dict(title='Four Doors recap', body='Clockwork: generators and coroutines pause at yield/await; a loop with send(None) drives them. Web: request/response text, routing, query strings, middleware. Data: arrays, masks, statistics, regression, k-NN, precision/recall. Craft: dataclasses, enums+match, type hints, context managers, decorators, logging, itertools, property tests.', snip='coro.send(None)  # the heartbeat of async')))

# ------------------------------------------------------------------ gap check
G = []
def g(code, q, opts, why, tags):
    G.append(mcq(code, q, opts, 0, why, tags))

g(r'''def f():
    yield 1
    yield 2

it = f()
next(it)
print(list(it))''', 'What prints?', ['[2]', '[1, 2]', '[]'], 'next(it) already used the first value, so list(it) collects only what is left: [2].', ['gen-pause'])
g(r'''import inspect

async def f():
    return 1

print(inspect.iscoroutinefunction(f))''', 'What prints?', ['True', 'False', '1'], 'An async def function is a coroutine function; calling it would give a coroutine object, not the 1.', ['coro-basic'])
g(r'''import heapq
h = [(2, "b"), (1, "z"), (1, "a")]
heapq.heapify(h)
print(heapq.heappop(h)[1])''', 'What prints?', ['a', 'z', 'b'], 'Tuples compare left to right: both smallest start with 1, then "a" is smaller than "z". (This is why the event loop adds an order number.)', ['coro-clock'])
g(r'''r = {2: "c", 0: "a", 1: "b"}
print([r[i] for i in range(3)])''', 'What prints?', ["['a', 'b', 'c']", "['c', 'a', 'b']", "[2, 0, 1]"], 'Reading keys 0, 1, 2 restores the original order, however the results arrived.', ['coro-gather'])
g(r'''balance = 5
a = balance
b = balance
balance = a + 10
balance = b + 10
print(balance)''', 'Two tasks both read the balance before either wrote. What prints?', ['15', '25', '5'], 'Both started from 5, so the second write replaces the first: 15. One deposit was lost. A lock prevents this.', ['coro-lock'])
g(r'''def g():
    try:
        yield
    except TimeoutError:
        return "cancelled"

x = g()
next(x)
try:
    x.throw(TimeoutError)
except StopIteration as stop:
    print(stop.value)''', 'What prints?', ['cancelled', 'None', 'TimeoutError'], 'throw raises TimeoutError at the yield; the generator catches it and returns "cancelled", which arrives as StopIteration.value.', ['coro-cancel'])
g(r'''print("POST /a?b=1 HTTP/1.1".split()[1].partition("?")[2])''', 'What prints?', ['b=1', '/a', 'POST'], 'The target is "/a?b=1"; partition("?") splits it and [2] is the query string after the question mark.', ['web-request'])
g(r'''import json
print(len(json.dumps({"a": 1})))''', 'What prints?', ['8', '6', '7'], 'The text is {"a": 1}: braces, quotes, colon and a space add up to 8 characters. Content-Length counts these (in bytes).', ['web-response'])
g(r'''print(len("/a/b/".strip("/").split("/")))''', 'What prints?', ['2', '3', '4'], 'Stripping the outer slashes leaves "a/b", which splits into two segments.', ['web-route'])
g(r'''from urllib.parse import parse_qs
print(parse_qs("a=1&a=2")["a"])''', 'What prints?', ["['1', '2']", "'1'", "['2']"], 'parse_qs returns a list of values for every key, because keys can repeat.', ['web-query'])
g(r'''reg = {}
def route(path):
    def decorator(func):
        reg[path] = func
        return func
    return decorator

@route("/x")
def handler():
    return 5

print(reg["/x"]())''', 'What prints?', ['5', 'None', '/x'], 'The decorator stored the function under "/x" and returned it unchanged, so calling it gives 5.', ['web-decorator'])
g(r'''def a(f):
    return lambda: "A" + f()

def b(f):
    return lambda: "B" + f()

app = lambda: "!"
for m in reversed([a, b]):
    app = m(app)
print(app())''', 'What prints?', ['AB!', 'BA!', '!AB'], 'reversed wraps b first, then a, so a is the outermost layer: A, then B, then "!".', ['web-middleware'])
g(r'''import numpy as np
print(np.array([[1, 2], [3, 4]]).sum(axis=1).tolist())''', 'What prints?', ['[3, 7]', '[4, 6]', '[10]'], 'axis=1 adds across each row: 1+2 and 3+4.', ['np-axis'])
g(r'''import numpy as np
print((np.array([1, 5, 9, 2]) > 2).sum())''', 'What prints?', ['2', '4', '[5, 9]'], 'Two values (5 and 9) are above 2; True counts as 1 when summed.', ['np-mask'])
g(r'''import statistics
print(statistics.median([7, 1, 3, 9]))''', 'What prints?', ['5.0', '4.0', '3'], 'Sorted: 1, 3, 7, 9. With an even count the median is the average of the middle two: (3 + 7) / 2 = 5.0.', ['stats-describe'])
g(r'''xs, ys = [1, 2, 3], [2, 4, 6]
mx, my = sum(xs) / 3, sum(ys) / 3
print(sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs))''', 'What prints? (the least-squares slope)', ['2.0', '1.0', '4.0'], 'The points lie exactly on y = 2x, so the slope is 2.0.', ['ml-line'])
g(r'''tp, fp, fn = 2, 2, 6
print(round(tp / (tp + fn), 2))''', 'What is the recall?', ['0.25', '0.5', '0.33'], 'Recall = TP / (TP + FN) = 2 / 8 = 0.25: only a quarter of the real positives were caught.', ['ml-metrics'])
g(r'''from dataclasses import dataclass

@dataclass
class C:
    n: int = 5

print(C().n + C(2).n)''', 'What prints?', ['7', '10', '2'], 'C() uses the default 5 and C(2) sets 2, so 5 + 2 = 7.', ['craft-dataclass'])
g(r'''from enum import Enum

class Color(Enum):
    RED = 1
    GREEN = 2

print(Color["GREEN"].value)''', 'What prints?', ['2', 'GREEN', '1'], 'Color["GREEN"] looks the member up by name, and .value is 2.', ['craft-enum-match'])
g(r'''from contextlib import contextmanager

out = []

@contextmanager
def c():
    out.append("in")
    yield
    out.append("out")

with c():
    out.append("body")
print(out)''', 'What prints?', ["['in', 'body', 'out']", "['body', 'in', 'out']", "['in', 'out', 'body']"], 'Setup runs before the yield, the with-body runs at the yield, and cleanup runs after it.', ['craft-ctx'])
g(r'''import logging
print(logging.INFO >= logging.WARNING)''', 'With the level set to WARNING, are INFO messages shown? What does this comparison print?', ['False', 'True', '20'], 'INFO (20) is lower than WARNING (30), so INFO messages are filtered out.', ['craft-log'])
g(r'''from itertools import groupby
print([k for k, _ in groupby("aabaa")])''', 'What prints?', ["['a', 'b', 'a']", "['a', 'b']", "['a', 'a', 'b']"], 'groupby only joins neighbours, so the two separate runs of "a" produce two separate groups.', ['craft-itertools'])

L.append(gap('r14-42', 42, 'Gap Check: the Four Doors Trial', ['realm14-gap'], ['realm14-boss'],
 "The Chimera folds back into four plain doors. Quill writes a single line on the lintel: *Eighty percent, and the Hall is yours.* \"No hints,\" the Archmage adds. \"Twenty-two questions, one from every corner of the Guild. Read the code slowly. You know more than you think.\"",
 G,
 dict(can=['Show solid skills in async, web, data and craft topics', 'Pick out gaps to revisit before an interview or project'], expand='For every question you missed, reopen the lesson tagged below it and rewrite its mission from memory.', where='This is the breadth that separates a script writer from a working developer.', next='You have finished the Spellbook. Build something that matters.'),
 dict(title='Four Doors mastery', body='Async by hand (yield/await/send), web request-response-routing-middleware, data with arrays/stats/models/metrics, craft with dataclasses/enums/hints/context managers/decorators/logging/itertools/property tests.', snip='# you can build real things now')))

TAGID = {'gen-pause':'r14-01','sched-rr':'r14-02','coro-basic':'r14-03','coro-pause':'r14-04','coro-clock':'r14-05','coro-gather':'r14-06','coro-cancel':'r14-07','coro-channel':'r14-08','coro-lock':'r14-09','web-request':'r14-11','web-response':'r14-12','web-route':'r14-13','web-query':'r14-14','web-decorator':'r14-15','web-middleware':'r14-16','web-auth':'r14-17','web-validate':'r14-18','web-crud':'r14-19','np-array':'r14-21','np-axis':'r14-22','np-mask':'r14-23','stats-describe':'r14-24','ml-line':'r14-25','ml-knn':'r14-26','ml-split':'r14-27','ml-metrics':'r14-28','ml-scale':'r14-29','craft-dataclass':'r14-31','craft-enum-match':'r14-32','craft-types':'r14-33','craft-ctx':'r14-34','craft-retry':'r14-35','craft-log':'r14-36','craft-itertools':'r14-37','craft-fuzz':'r14-38','craft-observer':'r14-39'}
def fixtags(lessons):
    for l in lessons:
        for ph in l.get('phases', []):
            ph['tags'] = [TAGID.get(t, t) for t in ph.get('tags', [])]
fixtags(L)

if __name__ == '__main__':
    emit('realm_14e.js', 'REALM 14 - THE HALL OF FOUR DOORS - part E (lessons 41-42: boss and gap). Generated by tools/spec14e.py', L)
