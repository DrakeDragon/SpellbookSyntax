from gen14 import *

L = []

# ---------------------------------------------------------------- 01 generators
s01 = r'''limit = int(input("Limit: "))

def squares(limit):
    for i in range(1, limit + 1):
        yield i * i

for value in squares(limit):
    print("Square:", value)
print("Done")'''
L.append(lesson('r14-01', 1, 'Generators: functions that can pause', ['gen-pause'], ['realm13-gap'],
 "Beyond the Arena lies the **Hall of Four Doors**, four great doors in a ring: Clockwork, Web, Data and Craft. Archmage Quill taps the first one. \"The Clockwork Guild makes programs that juggle many jobs at once,\" Quill says. \"Their secret begins with a function that can **stop in the middle** and be woken later.\"",
 "A normal function runs to the end and forgets everything. A **generator** can *pause* and *resume*.\n\n```\ndef countdown(n):\n    while n > 0:\n        yield n        # hand out n, then PAUSE here\n        n -= 1\n\ngen = countdown(3)\nprint(next(gen))   # runs until the first yield: 3\n```\n\n- A function with **`yield`** inside is a generator function. Calling it does **not run any of its code**; it returns a generator object.\n- **`next(gen)`** runs the body until the next `yield`, hands out that value and pauses with all its local variables kept.\n- When the body ends, the generator raises **`StopIteration`**. A `for` loop catches that for you and stops quietly.\n- Generators are **lazy**: values are made only when asked for, so they can be endless or huge without eating memory.\n- `return [..]` builds the whole list at once. `yield` hands out one value at a time.\n\nThis pause-and-resume trick is the engine under `async` code, which the next lessons build by hand.",
 "A bookmark: you stop reading, close the book, and later continue on exactly the same line.",
 r'''def countdown(n):
    while n > 0:
        yield n
        n -= 1
    print("Liftoff")

gen = countdown(3)
print(next(gen))
print(next(gen))
for left in gen:
    print("left", left)''',
 predict(r'''def f():
    print("hi")
    yield 1

f()
print("end")''', 'What prints?', ['end', 'hi', 'hi end'], 0, 'Calling a generator function runs none of its body. Nothing asked for a value, so "hi" never prints.'),
 dict(broken=r'''def countdown(n):
    while n > 0:
        return n
        n -= 1

for x in countdown(3):
    print(x)''', task='`countdown` should hand out 3, then 2, then 1, one at a time. Right now the `for` loop crashes. Fix the function. Expected: 3, 2, 1 on separate lines.',
  sol=r'''def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)''', extra=[('Uses yield', '"yield" in src')], wrong=[r'''print(3)
print(2)
print(1)''']),
 dict(prompt='Ask `Limit: `. Write a **generator** `squares(limit)` that yields `1, 4, 9, ...` (the squares of 1 up to `limit`). The loop that prints `Square: <value>` for each value and then `Done` is given.',
  starter=r'''limit = int(input("Limit: "))

# write the generator squares(limit) here

for value in squares(limit):
    print("Square:", value)
print("Done")''',
  cases=[dict(inputs=['3'], name='Three', extra=[('Is a generator', 'type(g["squares"](2)).__name__=="generator"'), ('Values', 'list(g["squares"](3))==[1,4,9]')]),
         dict(inputs=['1'], name='One'), dict(inputs=['0'], name='None'), dict(inputs=['5'], name='Five')],
  sol=s01,
  wrong=[('    for i in range(1, limit + 1):\n        yield i * i', '    return [i * i for i in range(1, limit + 1)]'), ('range(1, limit + 1)', 'range(limit)'), ('range(1, limit + 1)', 'range(1, limit)'), ('yield i * i', 'yield i * i * i'), ('print("Done")', 'pass')],
  hints=['A generator function contains the word yield.', 'Loop i from 1 to limit (inclusive) and yield i * i each time.', 'Do not return a list: yield one value per turn.']),
 dict(can=['Write a function that hands out values one at a time', 'Explain why a generator does not run until you ask for a value'], expand='Make a generator `evens()` that never ends and use `zip` with `range(5)` to take only five values.', where='Reading a giant log file line by line, streaming rows from a database and Python\'s own `range` all rely on this idea.', next='Next: let several generators take turns, the seed of a scheduler.'),
 dict(title='Generators', body='def f(): ... yield x. Calling f() returns a paused generator; next(gen) runs to the next yield; the body ends with StopIteration; a for loop handles it. Lazy and memory-light.', snip='def gen():\n    yield 1\n    yield 2')))

# ---------------------------------------------------------------- 02 round robin
s02 = r'''from collections import deque

def worker(name, steps):
    for i in range(1, steps + 1):
        print(f"{name} step {i}")
        yield
    print(f"{name} finished")

line = input("Tasks: ")
queue = deque()
for part in line.split():
    name, steps = part.split(":")
    queue.append(worker(name, int(steps)))

while queue:
    task = queue.popleft()
    try:
        next(task)
    except StopIteration:
        continue
    queue.append(task)'''
L.append(lesson('r14-02', 2, 'Taking turns: a round-robin scheduler', ['sched-rr'], ['gen-pause'],
 "Behind the Clockwork door a hundred brass workers share one hammer. \"Only one can swing at a time,\" says Quill, \"so each gets **one swing**, then passes it on. Watch how little code the juggling needs.\"",
 "A **scheduler** decides whose turn it is. The simplest fair one is **round robin**: everyone gets one turn, then goes to the back of the line.\n\n```\nqueue = deque([task_a, task_b, task_c])\nwhile queue:\n    task = queue.popleft()      # whose turn?\n    try:\n        next(task)              # let it run until its next yield\n    except StopIteration:\n        continue                # it finished: do not put it back\n    queue.append(task)          # still busy: back of the line\n```\n\n- Each task is a **generator** whose `yield` means *\"I am done with my turn\"*.\n- A **`deque`** gives O(1) `popleft` and `append`.\n- This is **cooperative multitasking**: tasks must yield on their own. Nothing interrupts them.\n- `yield` with no value just pauses; it is the polite way of saying \"next, please\".\n- A task that never yields would block everyone else, which is the weakness of cooperative code.",
 "Kids sharing one game controller, passing it on after every level.",
 r'''from collections import deque

def count(name, n):
    for i in range(n):
        print(name, i)
        yield

q = deque([count("A", 2), count("B", 1)])
while q:
    t = q.popleft()
    try:
        next(t)
    except StopIteration:
        continue
    q.append(t)''',
 predict(r'''from collections import deque
q = deque(["a", "b", "c"])
q.append(q.popleft())
print("".join(q))''', 'What prints?', ['bca', 'cab', 'abc'], 0, 'popleft takes "a" off the front and append puts it at the back: b, c, a.'),
 dict(broken=r'''from collections import deque

def w(name):
    print(name, 1)
    yield
    print(name, 2)
    yield

q = deque([w("A"), w("B")])
while q:
    t = q.popleft()
    try:
        next(t)
    except StopIteration:
        continue''', task='Each worker should take **two** turns, alternating: `A 1`, `B 1`, `A 2`, `B 2`. Right now every worker gets only one turn. Fix the loop.',
  sol=r'''from collections import deque

def w(name):
    print(name, 1)
    yield
    print(name, 2)
    yield

q = deque([w("A"), w("B")])
while q:
    t = q.popleft()
    try:
        next(t)
    except StopIteration:
        continue
    q.append(t)''', extra=[('Passes the baton', '"q.append(t)" in src')], wrong=[r'''print("A 1")
print("B 1")
print("A 2")
print("B 2")''']),
 dict(prompt='Ask `Tasks: ` (words like `A:3 B:2`: a name and how many steps). The workers and the queue are given. Write the **scheduler loop**: take the task at the front, let it run one turn, and put it at the back if it is not finished.',
  starter=r'''from collections import deque

def worker(name, steps):
    for i in range(1, steps + 1):
        print(f"{name} step {i}")
        yield
    print(f"{name} finished")

line = input("Tasks: ")
queue = deque()
for part in line.split():
    name, steps = part.split(":")
    queue.append(worker(name, int(steps)))

# write the scheduler loop here
''',
  cases=[dict(inputs=['A:2 B:1'], name='Two workers'), dict(inputs=['A:3 B:2 C:4'], name='Three workers'), dict(inputs=['X:1'], name='One worker'), dict(inputs=[''], name='Nobody'), dict(inputs=['A:1 B:3'], name='Short then long')],
  sol=s02,
  wrong=[('task = queue.popleft()', 'task = queue.pop()'), ('    queue.append(task)', '    pass'), ('    queue.append(task)', '    queue.appendleft(task)'), ('except StopIteration:\n        continue', 'except StopIteration:\n        break')],
  hints=['while queue: take the first task with popleft().', 'Call next(task) inside try/except StopIteration. When it finishes, do not put it back.', 'If it did not finish, append it to the back of the queue.']),
 dict(can=['Run several generators fairly in turns', 'Explain cooperative multitasking'], expand='Give each task a priority number and use a heap instead of a deque so urgent tasks get more turns.', where='Game loops, GUI frameworks and early operating systems all schedule small slices of work like this.', next='Next: `async def` and `await`, Python\'s official syntax for the same trick.'),
 dict(title='Round robin', body='deque of generators; loop: task = popleft(); try next(task) except StopIteration: continue; append(task). Cooperative: tasks must yield.', snip='task = q.popleft()\ntry:\n    next(task)\nexcept StopIteration:\n    continue\nq.append(task)')))

# ---------------------------------------------------------------- 03 coroutines
s03 = r'''PRICES = {"apple": 3, "pear": 5, "fig": 8}

def run(coro):
    try:
        while True:
            coro.send(None)
    except StopIteration as stop:
        return stop.value

async def price_of(name):
    return PRICES[name]

async def total(names):
    amount = 0
    for name in names:
        amount += await price_of(name)
    return amount

names = input("Items: ").split()
print("Total:", run(total(names)))'''
L.append(lesson('r14-03', 3, 'async def and await: coroutines', ['coro-basic'], ['sched-rr'],
 "Quill hangs a brass sign over the next gate: **async def**. \"Same pause trick, new clothes,\" the Archmage smiles. \"Python gives it keywords so the code reads top to bottom like ordinary code.\"",
 "An **`async def`** function is a **coroutine function**. Calling it returns a **coroutine object** and runs nothing yet, like a generator.\n\n```\nasync def price_of(name):\n    return PRICES[name]\n\nasync def total(names):\n    amount = 0\n    for name in names:\n        amount += await price_of(name)   # run it and get its value\n    return amount\n```\n\n- **`await x`** runs the coroutine `x` until it finishes and gives you its return value. `await` is only allowed **inside** `async def`.\n- Something has to start the first coroutine. Real programs use `asyncio.run(main())`. Here we do it by hand: **`coro.send(None)`** runs it, and a finished coroutine raises **`StopIteration`** whose **`.value`** is the return value.\n- Forgetting `await` is the classic bug: you get a coroutine object instead of a result (and a *never awaited* warning).\n- The browser build of this book cannot run the real `asyncio.run`, so we write our own tiny loop. That teaches what the real one does.",
 "A recipe card you have written but not cooked yet: calling the function hands you the card; awaiting it cooks the dish.",
 r'''async def double(x):
    return x * 2

async def main():
    a = await double(4)
    b = await double(a)
    return b

c = main()
try:
    c.send(None)
except StopIteration as stop:
    print("result", stop.value)''',
 predict(r'''async def hi():
    return 5

c = hi()
print(type(c).__name__)
c.close()''', 'What prints?', ['coroutine', 'int', 'generator'], 0, 'Calling an async function returns a coroutine object; the body has not run, so there is no 5 yet.'),
 dict(broken=r'''async def two():
    return 2

async def main():
    return two() + 1

c = main()
try:
    c.send(None)
except StopIteration as stop:
    print(stop.value)''', task='`main` should print 3, but it adds 1 to a coroutine object and crashes. Fix `main` so it uses the value `two()` returns.',
  sol=r'''async def two():
    return 2

async def main():
    return await two() + 1

c = main()
try:
    c.send(None)
except StopIteration as stop:
    print(stop.value)''', extra=[('Uses await', '"await two()" in src')], wrong=[r'''print(3)''']),
 dict(prompt='Ask `Items: ` (words like `apple pear`). `PRICES` and the hand-made `run` are given. Write the coroutines `price_of(name)` (returns the price) and `total(names)` (awaits `price_of` for each name and returns the sum), then print `Total: <sum>` using `run`.',
  starter=r'''PRICES = {"apple": 3, "pear": 5, "fig": 8}

def run(coro):
    try:
        while True:
            coro.send(None)
    except StopIteration as stop:
        return stop.value

# write the coroutines price_of and total here

names = input("Items: ").split()
''',
  cases=[dict(inputs=['apple pear'], name='Two items', extra=[('Awaits price_of', '"await price_of" in src'), ('price_of is a coroutine function', '__import__("inspect").iscoroutinefunction(g["price_of"])'), ('total is a coroutine function', '__import__("inspect").iscoroutinefunction(g["total"])')]), dict(inputs=['fig'], name='One item'), dict(inputs=[''], name='Empty'), dict(inputs=['apple apple apple'], name='Repeats')],
  sol=s03,
  wrong=[('async def price_of(name):', 'def price_of(name):'), ('amount += await price_of(name)', 'amount += PRICES[name]'), ('        amount += await price_of(name)', '        amount = await price_of(name)'), ('async def total(names):', 'def total(names):'), ('print("Total:", run(total(names)))', 'print("Total:", total(names))')],
  hints=['async def price_of(name): return PRICES[name]', 'async def total(names): loop over the names and add await price_of(name) to a running sum.', 'Finish with print("Total:", run(total(names))).']),
 dict(can=['Write coroutines with async def and await', 'Start a coroutine by hand with send(None)'], expand='Add `async def cheapest(names)` that awaits every price and returns the smallest.', where='Every async web framework and database driver exposes coroutines that you await.', next='Next: an object that makes a coroutine truly pause.'),
 dict(title='Coroutines', body='async def f() returns a coroutine; await g() runs g and gives its return value (only inside async def). Hand-run: try: c.send(None) except StopIteration as s: s.value. Missing await = coroutine object.', snip='async def main():\n    return await other()')))

# ---------------------------------------------------------------- 04 pause awaitable
s04 = r'''from collections import deque

class Pause:
    def __await__(self):
        yield

async def worker(name, steps):
    for i in range(1, steps + 1):
        print(f"{name} step {i}")
        await Pause()
    return name

def run_all(coros):
    queue = deque(coros)
    finished = []
    while queue:
        coro = queue.popleft()
        try:
            coro.send(None)
        except StopIteration as stop:
            finished.append(stop.value)
            continue
        queue.append(coro)
    return finished

line = input("Tasks: ")
coros = []
for part in line.split():
    name, steps = part.split(":")
    coros.append(worker(name, int(steps)))
print("Finished order:", " ".join(run_all(coros)))'''
L.append(lesson('r14-04', 4, 'await Pause(): the real pause point', ['coro-pause'], ['coro-basic'],
 "\"Awaiting a coroutine runs it to the end,\" Quill says, hanging a brass coin on a chain. \"So where does an `async` function actually *stop*? At the bottom of every chain there is one small object that **yields**. This is that coin.\"",
 "`await` only pauses when it reaches an object that **really yields**. We can build the simplest one:\n\n```\nclass Pause:\n    def __await__(self):\n        yield            # hand control back to whoever called send()\n```\n\n- `await Pause()` suspends the whole chain of coroutines; the loop's `coro.send(None)` **returns**.\n- The loop can then run another coroutine and come back later with `send(None)` again to resume exactly there.\n- A coroutine that finishes raises `StopIteration`, and `stop.value` is what it `return`ed.\n- Put it together and you have the heart of `asyncio`: **a loop that sends into coroutines, and awaitables that yield**.\n- A coroutine that never awaits a real pause hogs the loop; this is why blocking calls like `time.sleep` freeze async programs.",
 "A relay baton: `await Pause()` is the runner handing it back so the next runner can go.",
 r'''class Pause:
    def __await__(self):
        yield

async def job():
    print("one")
    await Pause()
    print("two")
    return 7

c = job()
c.send(None)
print("between")
try:
    c.send(None)
except StopIteration as stop:
    print("value", stop.value)''',
 predict(r'''class Pause:
    def __await__(self):
        yield

async def job():
    await Pause()
    return "x"

c = job()
c.send(None)
try:
    c.send(None)
except StopIteration as stop:
    print(stop.value)''', 'What prints?', ['x', 'None', 'Pause'], 0, 'The first send runs to the Pause; the second resumes, finishes and the StopIteration carries the return value "x".'),
 dict(broken=r'''class Pause:
    def __await__(self):
        return

async def job():
    print("a")
    await Pause()
    print("b")

c = job()
c.send(None)
print("paused")''', task='`job` should stop after printing `a` so that `paused` appears **before** `b`. `Pause` never actually pauses. Fix `Pause`. Expected: `a`, `paused`.',
  sol=r'''class Pause:
    def __await__(self):
        yield

async def job():
    print("a")
    await Pause()
    print("b")

c = job()
c.send(None)
print("paused")''', extra=[('No b yet', '"b" not in lines'), ('Yields', '"yield" in src')], wrong=[r'''print("a")
print("paused")''']),
 dict(prompt='Ask `Tasks: ` (like `A:3 B:2`). `Pause` and the workers are given. Write `run_all(coros)`: a round-robin loop over the coroutines using `send(None)`. When a coroutine finishes, remember its **return value**. Return the return values in **finishing order**. The program prints `Finished order: <names>`.',
  starter=r'''from collections import deque

class Pause:
    def __await__(self):
        yield

async def worker(name, steps):
    for i in range(1, steps + 1):
        print(f"{name} step {i}")
        await Pause()
    return name

def run_all(coros):
    queue = deque(coros)
    finished = []
    # write the loop here
    return finished

line = input("Tasks: ")
coros = []
for part in line.split():
    name, steps = part.split(":")
    coros.append(worker(name, int(steps)))
print("Finished order:", " ".join(run_all(coros)))''',
  cases=[dict(inputs=['A:3 B:1'], name='Short one finishes first'), dict(inputs=['A:1 B:2 C:3'], name='Three'), dict(inputs=['X:2 Y:2'], name='Tie'), dict(inputs=['Z:1'], name='One')],
  sol=s04,
  wrong=[('            finished.append(stop.value)\n            continue', '            continue'), ('queue.popleft()', 'queue.pop()'), ('        queue.append(coro)', '        pass'), ('finished.append(stop.value)', 'finished.insert(0, stop.value)'), ('coro.send(None)', 'next(iter([]), None)')],
  hints=['while queue: coro = queue.popleft(); try coro.send(None).', 'except StopIteration as stop: finished.append(stop.value) and continue.', 'If it did not finish, append the coroutine back to the queue.']),
 dict(can=['Explain exactly where an async function pauses', 'Drive coroutines to completion with your own loop'], expand='Add a tick counter so `run_all` also returns how many turns it took in total.', where='This is how `asyncio`, `trio` and every game engine coroutine system work underneath.', next='Next: give the loop a clock so tasks can sleep for a while.'),
 dict(title='Awaitable pause', body='An object whose __await__ yields suspends the coroutine chain; the loop sees coro.send(None) return and can run others. A finished coroutine raises StopIteration with .value.', snip='class Pause:\n    def __await__(self):\n        yield')))

# ---------------------------------------------------------------- 05 virtual clock
s05 = r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def worker(name, delay):
    print(f"t={now} {name} start")
    await Sleep(delay)
    print(f"t={now} {name} halfway")
    await Sleep(1)
    print(f"t={now} {name} done")

def run(coros):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    while heap:
        wake, order, coro = heapq.heappop(heap)
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration:
            continue
        heapq.heappush(heap, (now + delay, order, coro))

line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(worker(name, int(delay)))
run(coros)'''
L.append(lesson('r14-05', 5, 'A virtual clock: await Sleep(n)', ['coro-clock'], ['coro-pause'],
 "The brass gears of the Clockwork door whir. \"Real `asyncio.sleep` waits real seconds,\" Quill says. \"Ours will cheat: a **virtual clock** that jumps straight to the next moment something happens. Same behaviour, instant results.\"",
 "A real event loop lets a coroutine say *\"wake me in 3 seconds\"*. We can build that with a **priority queue** (heap):\n\n```\nclass Sleep:\n    def __init__(self, delay): self.delay = delay\n    def __await__(self):\n        yield self.delay          # tell the loop how long to wait\n\nheap = [(wake_time, order, coro), ...]\nwake, order, coro = heapq.heappop(heap)   # earliest wake-up first\nnow = wake                                # jump the clock forward\ndelay = coro.send(None)                   # resume it; it yields a delay\nheapq.heappush(heap, (now + delay, order, coro))\n```\n\n- The heap always gives the task that wakes **soonest**. The clock jumps; nothing really waits.\n- **`order`** is a tie-breaker: two tasks with the same wake time run in creation order. Without it Python would try to compare coroutine objects and crash.\n- `now` is a global the coroutines can read to print timestamps.\n- Three tasks sleeping 3, 1 and 2 seconds finish at times 1, 2, 3, and the whole run takes **3**, not 6: sleeping tasks overlap. That overlap is the whole point of async code for waiting on networks and disks.",
 "An alarm-clock shop: every customer leaves an alarm, and the shopkeeper always jumps to the earliest one.",
 r'''import heapq
heap = []
heapq.heappush(heap, (3, 0, "slow"))
heapq.heappush(heap, (1, 1, "fast"))
heapq.heappush(heap, (1, 2, "also fast"))
while heap:
    wake, order, name = heapq.heappop(heap)
    print(wake, name)''',
 predict(r'''import heapq
h = [(2, 1), (1, 5), (1, 3)]
heapq.heapify(h)
print(heapq.heappop(h))''', 'What prints?', ['(1, 3)', '(1, 5)', '(2, 1)'], 0, 'Tuples compare left to right: both smallest start with 1, then 3 beats 5.'),
 dict(broken=r'''import heapq
heap = [(5, 0, "late"), (2, 1, "early")]
heapq.heapify(heap)
order = []
while heap:
    wake, n, name = heapq.heappop(heap)
    order.append(name)
print(order[::-1])''', task='The tasks should be handled **earliest first** and printed as `[\'early\', \'late\']`. The final line reverses the list by mistake. Fix it.',
  sol=r'''import heapq
heap = [(5, 0, "late"), (2, 1, "early")]
heapq.heapify(heap)
order = []
while heap:
    wake, n, name = heapq.heappop(heap)
    order.append(name)
print(order)''', extra=[('No reversing', '"[::-1]" not in src'), ('Still pops', '"heappop" in src')], wrong=[r'''print(["early", "late"])''']),
 dict(prompt='Ask `Jobs: ` (like `A:3 B:1`: name and sleep time). `Sleep` and `worker` are given (a worker sleeps its own time, then 1 more); the clock is the global `now`. Write `run(coros)`: put every coroutine in a **heap** as `(wake_time, order, coro)`, repeatedly take the earliest, set `now` to its wake time and resume it with `send(None)`. It yields a delay; schedule it again at `now + delay`. A finished coroutine is dropped. Call `run(coros)` at the end.',
  starter=r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def worker(name, delay):
    print(f"t={now} {name} start")
    await Sleep(delay)
    print(f"t={now} {name} halfway")
    await Sleep(1)
    print(f"t={now} {name} done")

def run(coros):
    global now
    heap = []
    # write the event loop here

line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(worker(name, int(delay)))
''',
  cases=[dict(inputs=['A:3 B:1 C:2'], name='Three jobs'), dict(inputs=['A:2 B:2'], name='Tie keeps creation order'), dict(inputs=['X:5'], name='One job'), dict(inputs=['A:0 B:1'], name='Zero delay'), dict(inputs=[''], name='No jobs')],
  sol=s05,
  wrong=[('        now = wake\n', ''), ('heapq.heappush(heap, (now + delay, order, coro))', 'heapq.heappush(heap, (delay, order, coro))'), ('heapq.heappush(heap, (now + delay, order, coro))', 'heapq.heappush(heap, (now + delay, coro))'), ('heapq.heappush(heap, (0, order, coro))', 'heapq.heappush(heap, (order, order, coro))'), ('        except StopIteration:\n            continue', '        except StopIteration:\n            break')],
  hints=['Push (0, order, coro) for every coroutine; use enumerate for order.', 'Loop: wake, order, coro = heappop(heap); now = wake; delay = coro.send(None) inside try/except StopIteration.', 'Push (now + delay, order, coro) back after a successful send.']),
 dict(can=['Build an event loop with a virtual clock', 'Explain why waiting tasks overlap'], expand='Return the final value of `now` from `run` and print `Total time: <now>`.', where='Game servers, schedulers and test frameworks use fake clocks like this so tests run instantly.', next='Next: collect results from all tasks, like asyncio.gather.'),
 dict(title='Virtual clock loop', body='heap of (wake, order, coro); pop earliest; now = wake; delay = coro.send(None); push (now+delay, order, coro). order breaks ties. Sleeping tasks overlap: total time = longest, not the sum.', snip='wake, order, coro = heapq.heappop(heap)\nnow = wake')))

# ---------------------------------------------------------------- 06 gather
s06 = r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def fetch(name, delay):
    await Sleep(delay)
    return f"{name}={delay * 10}"

def run(coros):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    results = {}
    while heap:
        wake, order, coro = heapq.heappop(heap)
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration as stop:
            results[order] = stop.value
            continue
        heapq.heappush(heap, (now + delay, order, coro))
    return [results[i] for i in range(len(coros))]

line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(fetch(name, int(delay)))
print("Results:", run(coros))
print("Elapsed:", now)'''
L.append(lesson('r14-06', 6, 'gather: all results, in order', ['coro-gather'], ['coro-clock'],
 "\"Three messengers set off at once,\" Quill says, \"one needing 3 hours, one 1, one 2. How long until you have **all** their messages? Not six hours. Three. Let us make the loop collect their answers.\"",
 "`asyncio.gather(a, b, c)` runs coroutines together and returns their results **in the order you gave them**, not the order they finished.\n\n```\nresults = {}\n...\ntry:\n    delay = coro.send(None)\nexcept StopIteration as stop:\n    results[order] = stop.value     # remember by position\n    continue\n...\nreturn [results[i] for i in range(len(coros))]\n```\n\n- A finished coroutine's **return value** hides in `StopIteration.value`.\n- Storing by `order` and reading back `0, 1, 2, ...` restores the original order even when task 2 finished first.\n- **Elapsed time** with overlapping waits is the **longest** wait (`max`), not the sum. After the loop, `now` holds the time of the last wake-up.\n- Waiting for several things together instead of one after another is the biggest speed win in network code: 100 requests of 1 s each can take about 1 s, not 100.\n- If one task raises an exception, real `gather` re-raises it; production code decides whether to keep going or stop.",
 "Ordering pizzas from three shops at once: you collect all three boxes when the slowest arrives, and you lay them out in the order you ordered.",
 r'''results = {}
for order, value in [(2, "c"), (0, "a"), (1, "b")]:
    results[order] = value
print([results[i] for i in range(3)])''',
 predict(r'''results = {1: "b", 0: "a"}
print([results[i] for i in range(2)])''', 'What prints?', ["['a', 'b']", "['b', 'a']", '[0, 1]'], 0, 'Reading keys 0 then 1 gives the values in position order, whatever order they were stored in.'),
 dict(broken=r'''delays = [3, 1, 2]
print("Elapsed:", sum(delays))''', task='Tasks that sleep **at the same time** finish when the **longest** one finishes. The elapsed time should be 3. Fix the calculation.',
  sol=r'''delays = [3, 1, 2]
print("Elapsed:", max(delays))''', extra=[('Uses max', '"max(" in src')], wrong=[r'''print("Elapsed: 3")''']),
 dict(prompt='Ask `Jobs: ` (like `A:3 B:1`). The loop is given except the part that handles a **finished** coroutine. Make `run` remember each finished coroutine\'s return value by its `order` and return the values as a list in **the original order**. The program prints `Results: <list>` and `Elapsed: <now>`.',
  starter=r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def fetch(name, delay):
    await Sleep(delay)
    return f"{name}={delay * 10}"

def run(coros):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    results = {}
    while heap:
        wake, order, coro = heapq.heappop(heap)
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration as stop:
            pass  # TODO: remember stop.value for this order
            continue
        heapq.heappush(heap, (now + delay, order, coro))
    # TODO: return the results in the original order

line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(fetch(name, int(delay)))
print("Results:", run(coros))
print("Elapsed:", now)''',
  cases=[dict(inputs=['A:3 B:1 C:2'], name='Out-of-order finish'), dict(inputs=['A:1 B:1'], name='Tie'), dict(inputs=['A:4'], name='One'), dict(inputs=[''], name='None'), dict(inputs=['A:2 B:5 C:1 D:3'], name='Four'), dict(inputs=['Z:2 A:3 M:1'], name='Names not in A-Z order')],
  sol=s06,
  wrong=[('            results[order] = stop.value\n', '            results[len(results)] = stop.value\n'), ('return [results[i] for i in range(len(coros))]', 'return list(results.values())'), ('return [results[i] for i in range(len(coros))]', 'return sorted(results.values())'), ('wake, order, coro = heapq.heappop(heap)\n        now = wake', 'wake, order, coro = heapq.heappop(heap)\n        now += wake'), ('"Results:", run(coros)', '"Results:", run(coros)[::-1]')],
  hints=['In the except branch store results[order] = stop.value.', 'After the loop build the list with [results[i] for i in range(len(coros))].', 'Elapsed is simply the final value of now.']),
 dict(can=['Collect results from many concurrent tasks in order', 'Explain why elapsed time is the maximum, not the sum'], expand='Make `run` also print each task\'s name when it finishes, in finishing order.', where='Fetching many web pages, API calls or database rows together is the everyday use of gather.', next='Next: cancel tasks that take too long.'),
 dict(title='gather', body='Store each finished task\'s stop.value by its order; read back 0..n-1 for input order. Total time of overlapping waits = max of the delays.', snip='results[order] = stop.value\nreturn [results[i] for i in range(n)]')))

# ---------------------------------------------------------------- 07 timeouts
s07 = r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def job(name, delay):
    try:
        print(f"t={now} {name} start")
        await Sleep(delay)
        print(f"t={now} {name} done")
    finally:
        print(f"t={now} {name} cleanup")

def run(coros, timeout):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    while heap:
        wake, order, coro = heapq.heappop(heap)
        if wake > timeout:
            now = timeout
            try:
                coro.throw(TimeoutError)
            except TimeoutError:
                print(f"task {order} cancelled")
            except StopIteration:
                pass
            continue
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration:
            continue
        heapq.heappush(heap, (now + delay, order, coro))

timeout = int(input("Timeout: "))
line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(job(name, int(delay)))
run(coros, timeout)'''
L.append(lesson('r14-07', 7, 'Timeouts and cancellation', ['coro-cancel'], ['coro-gather'],
 "A messenger has been gone too long. \"You cannot wait forever,\" Quill says, \"but you must not just abandon him in the field either. A good loop tells the task *time is up*, lets it **tidy up**, then moves on.\"",
 "Real async code needs **timeouts**: give up on a task that is too slow. The loop can **throw an exception into** a paused coroutine:\n\n```\nif wake > timeout:\n    now = timeout\n    try:\n        coro.throw(TimeoutError)      # raise TimeoutError at the paused await\n    except TimeoutError:\n        print(\"cancelled\")           # the coroutine did not handle it\n    except StopIteration:\n        pass                          # it handled it and finished\n    continue\n```\n\n- **`coro.throw(exc)`** resumes the coroutine by raising `exc` *at the spot where it is paused*.\n- A coroutine can catch it, or use **`try/finally`** to always clean up (close files, release locks, print a goodbye).\n- If nothing catches it the exception travels out of `throw`, so the loop knows the task was cancelled.\n- `coro.close()` is the gentle version: it raises `GeneratorExit` inside and the task cannot refuse, but the loop gets no exception to report.\n- Real asyncio calls this **`CancelledError`** and `asyncio.wait_for(task, timeout)`.\n- Rule: cleanup code goes in **`finally`**, because cancellation can arrive at any `await`.",
 "Pulling the plug on a kettle after ten minutes: you still want it to switch itself off safely.",
 r'''def job():
    try:
        print("working")
        yield
        print("done")
    finally:
        print("cleanup")

g = job()
next(g)
try:
    g.throw(TimeoutError)
except TimeoutError:
    print("cancelled")''',
 predict(r'''def g():
    try:
        yield 1
    finally:
        print("bye", end="")

x = g()
next(x)
x.close()
print("!")''', 'What prints?', ['bye!', '!', 'bye'], 0, 'close() raises GeneratorExit at the yield, the finally block runs and prints "bye", then "!" follows on the same line.'),
 dict(broken=r'''def job():
    try:
        yield
    except TimeoutError:
        print("caught")

g = job()
next(g)
g.send(None)''', task='The job should be cancelled by **throwing** `TimeoutError` into it so that `caught` prints. Right now the code just resumes it normally and gets an unhandled `StopIteration`. Replace the last line.',
  sol=r'''def job():
    try:
        yield
    except TimeoutError:
        print("caught")

g = job()
next(g)
try:
    g.throw(TimeoutError)
except StopIteration:
    pass''', extra=[('Uses throw', '".throw(" in src')], wrong=[r'''print("caught")''']),
 dict(prompt='Ask `Timeout: ` and `Jobs: ` (like `A:2 B:6`). `job` prints start/done and always prints `cleanup` in a `finally`. Write the **timeout branch** of `run`: when a task\'s wake time is later than `timeout`, set the clock to `timeout`, **throw** `TimeoutError` into it, print `task <order> cancelled` if the exception escapes, and move on. Tasks waking exactly at the timeout still run normally.',
  starter=r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

async def job(name, delay):
    try:
        print(f"t={now} {name} start")
        await Sleep(delay)
        print(f"t={now} {name} done")
    finally:
        print(f"t={now} {name} cleanup")

def run(coros, timeout):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    while heap:
        wake, order, coro = heapq.heappop(heap)
        if wake > timeout:
            # write the cancellation here
            continue
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration:
            continue
        heapq.heappush(heap, (now + delay, order, coro))

timeout = int(input("Timeout: "))
line = input("Jobs: ")
coros = []
for part in line.split():
    name, delay = part.split(":")
    coros.append(job(name, int(delay)))
run(coros, timeout)''',
  cases=[dict(inputs=['4', 'A:2 B:6 C:9'], name='Two cancelled'), dict(inputs=['5', 'A:5 B:6'], name='Exactly at the limit survives'), dict(inputs=['10', 'A:1 B:2'], name='Nobody cancelled'), dict(inputs=['0', 'A:1'], name='Zero timeout'), dict(inputs=['3', ''], name='No jobs')],
  sol=s07,
  wrong=[('            now = timeout\n', ''), ('coro.throw(TimeoutError)', 'coro.close()'), ('if wake > timeout:', 'if wake >= timeout:'), ('                print(f"task {order} cancelled")', '                pass'), ('            except StopIteration:\n                pass\n            continue', '            except StopIteration:\n                pass\n            break')],
  hints=['Inside the if: set now = timeout first, so cleanup shows the right time.', 'try: coro.throw(TimeoutError) except TimeoutError: print(f"task {order} cancelled").', 'Also catch StopIteration (a coroutine may handle the error and finish).']),
 dict(can=['Cancel slow tasks safely', 'Use try/finally for cleanup that always runs'], expand='Let `run` return the list of cancelled task numbers and print them at the end.', where='Every HTTP client with a timeout, every request handler that can be aborted and every shutdown routine uses cancellation.', next='Next: tasks that talk to each other through a queue.'),
 dict(title='Cancellation', body='coro.throw(TimeoutError) raises inside the paused coroutine; use try/finally for cleanup; the exception escapes if unhandled. close() is the quiet version. Real asyncio: CancelledError, wait_for.', snip='try:\n    coro.throw(TimeoutError)\nexcept TimeoutError:\n    print("cancelled")')))

# ---------------------------------------------------------------- 08 producer/consumer
s08 = r'''from collections import deque

class Pause:
    def __await__(self):
        yield

class Channel:
    def __init__(self):
        self.items = deque()
    def put(self, item):
        self.items.append(item)
    async def get(self):
        while not self.items:
            await Pause()
        return self.items.popleft()

def run_all(coros):
    queue = deque(coros)
    while queue:
        coro = queue.popleft()
        try:
            coro.send(None)
        except StopIteration:
            continue
        queue.append(coro)

async def producer(channel, count):
    for i in range(1, count + 1):
        channel.put(i * 10)
        print("put", i * 10)
        await Pause()

async def consumer(channel, count):
    for _ in range(count):
        item = await channel.get()
        print("got", item)

count = int(input("Count: "))
channel = Channel()
run_all([consumer(channel, count), producer(channel, count)])'''
L.append(lesson('r14-08', 8, 'Producers and consumers', ['coro-channel'], ['coro-cancel'],
 "Two clockwork figures face each other across a conveyor belt. One drops parcels on it, the other takes them off. \"If the taker arrives first,\" Quill says, \"he must **wait**, politely, without blocking the whole factory.\"",
 "Tasks often hand work to each other: a **producer** makes items, a **consumer** processes them. They talk through a **channel** (a queue).\n\n```\nclass Channel:\n    def __init__(self):\n        self.items = deque()\n    def put(self, item):\n        self.items.append(item)\n    async def get(self):\n        while not self.items:      # nothing yet?\n            await Pause()          # let others run, then look again\n        return self.items.popleft()\n```\n\n- `get` is a coroutine: if the channel is empty it **pauses instead of blocking**, so the producer gets its turn.\n- The `while` (not `if`) re-checks after waking up, because the item might already be gone.\n- The consumer is started **first** on purpose: it finds the channel empty and waits; interleaving appears naturally.\n- Real `asyncio.Queue` adds a size limit (`maxsize`) so a fast producer cannot flood a slow consumer: that is called **backpressure**.\n- Your tasks must `await` somewhere. A consumer with `while True` and no await would freeze the program.",
 "A restaurant pass: the cook puts plates on the counter, the waiter takes them, and if the counter is empty the waiter waits without stopping the kitchen.",
 r'''from collections import deque
box = deque()
box.append("a")
box.append("b")
print(box.popleft(), len(box))''',
 predict(r'''from collections import deque
items = deque([5])
items.popleft()
print(bool(items), len(items))''', 'What prints?', ['False 0', 'True 0', 'False 1'], 0, 'After popleft the deque is empty: it is falsy and has length 0. That is how `while not self.items` notices an empty channel.'),
 dict(broken=r'''from collections import deque
items = deque([10, 20, 30])
print(items.pop())''', task='A channel must hand out items in the order they were put in (**first in, first out**). Right now the **newest** item comes out first. Fix it so the program prints `10`.',
  sol=r'''from collections import deque
items = deque([10, 20, 30])
print(items.popleft())''', extra=[('Uses popleft', '"popleft" in src')], wrong=[r'''print(10)''']),
 dict(prompt='Ask `Count: `. `Pause`, `Channel`, `run_all` and the producer are given. Write the coroutine `consumer(channel, count)`: it awaits `channel.get()` exactly `count` times and prints `got <item>` for each. The program starts the consumer **before** the producer.',
  starter=r'''from collections import deque

class Pause:
    def __await__(self):
        yield

class Channel:
    def __init__(self):
        self.items = deque()
    def put(self, item):
        self.items.append(item)
    async def get(self):
        while not self.items:
            await Pause()
        return self.items.popleft()

def run_all(coros):
    queue = deque(coros)
    while queue:
        coro = queue.popleft()
        try:
            coro.send(None)
        except StopIteration:
            continue
        queue.append(coro)

async def producer(channel, count):
    for i in range(1, count + 1):
        channel.put(i * 10)
        print("put", i * 10)
        await Pause()

# write the consumer here

count = int(input("Count: "))
channel = Channel()
run_all([consumer(channel, count), producer(channel, count)])''',
  cases=[dict(inputs=['2'], name='Two items', extra=[('consumer is a coroutine function', '__import__("inspect").iscoroutinefunction(g["consumer"])')]), dict(inputs=['3'], name='Three items'), dict(inputs=['1'], name='One item'), dict(inputs=['0'], name='None')],
  sol=s08,
  wrong=[('        item = await channel.get()', '        item = channel.items.popleft()'), ('    for _ in range(count):\n        item', '    for _ in range(count + 1):\n        item'), ('print("got", item)', 'print("got", item // 10)'), ('print("got", item)', 'print("got", item + 1)'), ('for _ in range(count):\n        item', 'for _ in range(count - 1):\n        item')],
  hints=['async def consumer(channel, count): loop count times.', 'item = await channel.get() gives the next value, waiting if needed.', 'print("got", item) each time.']),
 dict(can=['Connect tasks with a queue', 'Wait without blocking other tasks'], expand='Give `Channel` a maximum size so `put` becomes an `async` method that waits when the channel is full.', where='Web crawlers, job queues, chat servers and log pipelines all use producer/consumer channels.', next='Next: what goes wrong when tasks share data.'),
 dict(title='Channels', body='Producer calls put; consumer awaits get(), which loops "while not items: await Pause()". Start order shows waiting. Real asyncio.Queue adds maxsize for backpressure.', snip='item = await channel.get()')))

# ---------------------------------------------------------------- 09 race / lock
s09 = r'''from collections import deque

class Pause:
    def __await__(self):
        yield

class Lock:
    def __init__(self):
        self.locked = False
    async def acquire(self):
        while self.locked:
            await Pause()
        self.locked = True
    def release(self):
        self.locked = False

def run_all(coros):
    queue = deque(coros)
    while queue:
        coro = queue.popleft()
        try:
            coro.send(None)
        except StopIteration:
            continue
        queue.append(coro)

balance = 0
lock = Lock()

async def deposit(amount):
    global balance
    await lock.acquire()
    current = balance
    await Pause()
    balance = current + amount
    lock.release()

people = int(input("Depositors: "))
run_all([deposit(10) for _ in range(people)])
print("Balance:", balance)'''
L.append(lesson('r14-09', 9, 'Race conditions and locks', ['coro-lock'], ['coro-channel'],
 "Three clerks update the same ledger. Each reads the balance, walks off to fetch ink, and writes back an answer that is already out of date. \"Welcome to the **race condition**,\" Quill says grimly. \"The cure is a key to the ledger room.\"",
 "When tasks share data and can pause **between reading and writing**, updates get lost:\n\n```\ncurrent = balance          # task A reads 0\nawait Pause()              # ... task B reads 0 too ...\nbalance = current + 10     # A writes 10, B writes 10: one deposit lost\n```\n\n- The fix is a **lock**: only one task may be inside the protected section at a time.\n- `await lock.acquire()` waits (pausing politely) until the lock is free, then takes it. `lock.release()` frees it. **Always release**, ideally in `try/finally`; a forgotten release freezes everyone else (a **deadlock**).\n- The protected section should be as **short** as possible: everyone queues behind it.\n- Even single-threaded async code can race, because every `await` is a point where other tasks run. Code *without* an `await` between read and write is safe.\n- Real tools: `asyncio.Lock`, `threading.Lock`, and for processes, file or database locks.\n- Best of all: avoid sharing. Pass messages through a channel instead.",
 "A single bathroom key on a hook: whoever has the key is inside, everyone else waits for it to come back.",
 r'''balance = 0
a = balance
b = balance
balance = a + 10
balance = b + 10
print(balance)''',
 predict(r'''balance = 0
a = balance
b = balance
balance = a + 10
balance = b + 10
print(balance)''', 'Two deposits of 10 each read the balance before either wrote. What prints?', ['10', '20', '0'], 0, 'Both started from 0, so the second write replaces the first: 10, not 20. One deposit was lost.'),
 dict(broken=r'''balance = 100
current = balance
balance = current - 30
balance = current - 20
print(balance)''', task='Two withdrawals (30 and 20) should leave **50**. The second one uses the stale `current` from before the first. Make the second withdrawal start from the up-to-date balance.',
  sol=r'''balance = 100
current = balance
balance = current - 30
balance = balance - 20
print(balance)''', extra=[('No stale value', '"current - 20" not in src'), ('Re-reads', '"balance - 20" in src')], wrong=[r'''print(50)''']),
 dict(prompt='Ask `Depositors: `. `Pause`, `Lock`, `run_all` and the global `balance` are given. Write `async def deposit(amount)`: take the lock, read the balance, **pause** (`await Pause()`), write back `current + amount`, and release the lock. Every deposit must be counted. The program runs that many deposits of 10 and prints `Balance: <total>`.',
  starter=r'''from collections import deque

class Pause:
    def __await__(self):
        yield

class Lock:
    def __init__(self):
        self.locked = False
    async def acquire(self):
        while self.locked:
            await Pause()
        self.locked = True
    def release(self):
        self.locked = False

def run_all(coros):
    queue = deque(coros)
    while queue:
        coro = queue.popleft()
        try:
            coro.send(None)
        except StopIteration:
            continue
        queue.append(coro)

balance = 0
lock = Lock()

# write deposit here

people = int(input("Depositors: "))
run_all([deposit(10) for _ in range(people)])
print("Balance:", balance)''',
  cases=[dict(inputs=['3'], name='Three depositors', extra=[('deposit is a coroutine function', '__import__("inspect").iscoroutinefunction(g["deposit"])')]), dict(inputs=['1'], name='One'), dict(inputs=['0'], name='None'), dict(inputs=['5'], name='Five')],
  sol=s09,
  wrong=[('    await lock.acquire()\n    current = balance', '    current = balance\n    await lock.acquire()'), ('    await lock.acquire()\n', ''), ('    balance = current + amount\n    lock.release()', '    balance = current + amount'), ('balance = current + amount', 'balance = current + amount * 2'), ('    current = balance\n    await Pause()\n    balance = current + amount', '    current = balance\n    await Pause()\n    balance = amount')],
  hints=['Order matters: acquire the lock BEFORE reading the balance.', 'current = balance, await Pause(), balance = current + amount.', 'Call lock.release() at the end so the next depositor can go.']),
 dict(can=['Explain a race condition with a real example', 'Protect shared data with a lock and release it reliably'], expand='Wrap the protected section in `try/finally` so the lock is released even if an error happens in the middle.', where='Bank balances, inventory counts, ticket sales and any counter shared by several workers need this protection.', next='Mission time: the Download Simulator.'),
 dict(title='Locks', body='Race: read, pause, write loses updates. Lock: acquire BEFORE the read, release after the write (try/finally). Keep the section short. Deadlock = lock never released. Better: pass messages instead of sharing.', snip='await lock.acquire()\ntry:\n    ...\nfinally:\n    lock.release()')))

# ---------------------------------------------------------------- 10 mission
s10 = r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

def run(coros):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    while heap:
        wake, order, coro = heapq.heappop(heap)
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration:
            continue
        heapq.heappush(heap, (now + delay, order, coro))

async def worker(wid, jobs):
    while jobs:
        name, seconds = jobs.pop(0)
        print(f"t={now} w{wid} start {name}")
        await Sleep(seconds)
        print(f"t={now} w{wid} finish {name}")

workers = int(input("Workers: "))
jobs = []
for part in input("Downloads: ").split():
    name, seconds = part.split(":")
    jobs.append((name, int(seconds)))
run([worker(i, jobs) for i in range(1, workers + 1)])
print("Total time:", now)'''
L.append(lesson('r14-10', 10, 'Real-World Mission: The Download Simulator', ['mission14a'], ['coro-lock'],
 "A client wants to know: *\"If we download these files with two connections instead of one, how long does it take?\"* Quill pushes a laptop across the table. \"Do not guess. **Simulate**. Your virtual clock makes it instant.\"",
 "Here is the full toolkit working together: a **virtual-time event loop**, **coroutines** that `await Sleep`, and a **shared job list** that several workers pull from.\n\n```\nasync def worker(wid, jobs):\n    while jobs:                      # keep going while work remains\n        name, seconds = jobs.pop(0)  # take the next job\n        print(f\"t={now} w{wid} start {name}\")\n        await Sleep(seconds)         # pretend to download\n        print(f\"t={now} w{wid} finish {name}\")\n\nrun([worker(i, jobs) for i in range(1, workers + 1)])\nprint(\"Total time:\", now)\n```\n\n- A **worker pool** is how you limit concurrency: four workers means at most four downloads at once, with no semaphore needed.\n- Because a worker takes a job only when it is free, fast workers naturally take more jobs.\n- `jobs.pop(0)` is safe here: nothing awaits between the `while jobs` check and the `pop`.\n- Try 1, 2, 3 workers and compare **Total time**: that is capacity planning in five lines.\n- Real code would use `asyncio.Queue`, `aiohttp` and `asyncio.Semaphore`: the structure is identical.",
 "A bank with N tellers and one line: whoever is free takes the next customer.",
 r'''jobs = [("a", 4), ("b", 2), ("c", 3)]
name, seconds = jobs.pop(0)
print(name, seconds, len(jobs))''',
 predict(r'''jobs = [("a", 4), ("b", 2)]
jobs.pop(0)
print(jobs[0][0])''', 'What prints?', ['b', 'a', '2'], 0, 'pop(0) removes the first job; the remaining first job is ("b", 2).'),
 dict(broken=r'''jobs = [("a", 4), ("b", 2), ("c", 3)]
total = 0
while jobs:
    name, seconds = jobs.pop(0)
    total = max(total, seconds)
print("Total:", total)''', task='One worker doing all jobs one after another needs the **sum** of the times (9), not the longest (4). Fix the calculation. Expected: `Total: 9`.',
  sol=r'''jobs = [("a", 4), ("b", 2), ("c", 3)]
total = 0
while jobs:
    name, seconds = jobs.pop(0)
    total += seconds
print("Total:", total)''', extra=[('Adds', '"+=" in src')], wrong=[r'''print("Total: 9")''']),
 dict(prompt='Ask `Workers: ` and `Downloads: ` (like `a:4 b:2`). The clock and `run` are given. Write `async def worker(wid, jobs)`: while jobs remain, take the **first** job, print `t=<now> w<wid> start <name>`, `await Sleep(seconds)`, then print `t=<now> w<wid> finish <name>`. Start `workers` workers (numbered from 1) with `run`, then print `Total time: <now>`.',
  starter=r'''import heapq

now = 0

class Sleep:
    def __init__(self, delay):
        self.delay = delay
    def __await__(self):
        yield self.delay

def run(coros):
    global now
    heap = []
    for order, coro in enumerate(coros):
        heapq.heappush(heap, (0, order, coro))
    while heap:
        wake, order, coro = heapq.heappop(heap)
        now = wake
        try:
            delay = coro.send(None)
        except StopIteration:
            continue
        heapq.heappush(heap, (now + delay, order, coro))

# write the worker coroutine here

workers = int(input("Workers: "))
jobs = []
for part in input("Downloads: ").split():
    name, seconds = part.split(":")
    jobs.append((name, int(seconds)))
# start the workers and print the total time
''',
  cases=[dict(inputs=['2', 'a:4 b:2 c:3 d:1'], name='Two workers'), dict(inputs=['1', 'a:4 b:2 c:3'], name='One worker (sequential)'), dict(inputs=['3', 'a:5 b:5'], name='More workers than jobs'), dict(inputs=['2', ''], name='No downloads'), dict(inputs=['4', 'a:1 b:2 c:3 d:4 e:5 f:6'], name='Six jobs')],
  sol=s10,
  wrong=[('jobs.pop(0)', 'jobs.pop()'), ('range(1, workers + 1)', 'range(workers)'), ('    while jobs:\n        name, seconds = jobs.pop(0)\n        print(f"t={now} w{wid} start {name}")\n        await Sleep(seconds)\n        print(f"t={now} w{wid} finish {name}")', '    if jobs:\n        name, seconds = jobs.pop(0)\n        print(f"t={now} w{wid} start {name}")\n        await Sleep(seconds)\n        print(f"t={now} w{wid} finish {name}")'), ('await Sleep(seconds)', 'await Sleep(1)'), ('print("Total time:", now)', 'print("Total time:", now + 1)')],
  hints=['async def worker(wid, jobs): while jobs: take jobs.pop(0).', 'Print the start line, await Sleep(seconds), then the finish line (f-strings with now, wid, name).', 'run([worker(i, jobs) for i in range(1, workers + 1)]) then print("Total time:", now).']),
 dict(can=['Simulate concurrent work with a virtual clock', 'Compare 1, 2 and 3 workers to size a worker pool'], expand='Add `Longest wait:` showing how long the last job waited before it started.', where='Capacity planning, load tests and scheduling tools use exactly this kind of simulation before spending money on servers.', next='Next door: the Web Guild, where requests and responses come to life.'),
 dict(title='Worker pool', body='Shared job list + N workers: while jobs: job = jobs.pop(0); await Sleep(seconds). Fast workers take more jobs; total time falls as workers grow until jobs run out.', snip='run([worker(i, jobs) for i in range(1, n + 1)])')))

if __name__ == '__main__':
    emit('realm_14a.js', 'REALM 14 - THE HALL OF FOUR DOORS - part A (lessons 1-10: Clockwork Guild, async by hand). Generated by tools/spec14a.py', L)
