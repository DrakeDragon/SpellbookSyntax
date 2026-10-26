// REALM 13 — THE INTERVIEW ARENA — part B (lessons 9-18: data structures)
{
const eqM = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);
const eqMt = arr => 'lines[-' + arr.length + ':]==' + JSON.stringify(arr);

// ---------- 09 stack
const s09 = R`text = input("Text: ")
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
result = None
for i, ch in enumerate(text):
    if ch in "([{":
        stack.append((ch, i))
    elif ch in pairs:
        if not stack or stack[-1][0] != pairs[ch]:
            result = i
            break
        stack.pop()
if result is None and stack:
    result = stack[0][1]
print("Balanced" if result is None else f"Unbalanced at {result}")`;
const e09 = R`stack = []
stack.append("a")            # push
stack.append("b")
stack.append("c")
print(stack[-1])             # peek at the top without removing: c
print(stack.pop(), stack.pop())    # last in, first out: c b
print(len(stack), bool(stack))
stack.pop()
print(bool(stack))           # an empty list is False: always check before you pop
history = []
for page in ["home", "shop", "cart"]:
    history.append(page)
history.pop()                # the "back" button
print(history[-1])`;

// ---------- 10 queue
const s10 = R`from collections import deque

quantum = int(input("Quantum: "))
queue = deque()
for item in input("Tasks: ").split():
    name, units = item.split(":")
    queue.append([name, int(units)])
clock = 0
while queue:
    name, left = queue.popleft()
    run = min(quantum, left)
    clock += run
    left -= run
    if left > 0:
        queue.append([name, left])
    else:
        print(f"{name} done at {clock}")`;
const e10 = R`from collections import deque

line = deque()
line.append("ada")          # join at the back: O(1)
line.append("bob")
line.append("cy")
print(line.popleft())        # leave from the front: O(1). First in, first out
print(list(line), len(line))
line.appendleft("vip")       # deques work at BOTH ends
print(list(line))
slow = ["x", "y", "z"]
slow.pop(0)                  # a list has to shuffle every item along: O(n)`;

// ---------- 11 hash map
const s11 = R`size = int(input("Size: "))
target = int(input("Target: "))
numbers = [(i * 37) % 1000 for i in range(size)]
seen = {}
answer = None
for j, value in enumerate(numbers):
    if target - value in seen:
        answer = (seen[target - value], j)
        break
    seen.setdefault(value, j)
if answer is None:
    print("No pair")
else:
    print(f"Pair at {answer[0]} and {answer[1]}")`;
const h11 = R`size = int(input("Size: "))
target = int(input("Target: "))
numbers = [(i * 37) % 1000 for i in range(size)]
`;
const e11 = R`numbers = [2, 7, 11, 15]
target = 9
seen = {}                              # value -> index where we saw it
for j, value in enumerate(numbers):
    need = target - value              # who would complete the pair?
    if need in seen:                   # O(1) lookup instead of scanning
        print("pair at", seen[need], "and", j)
        break
    seen[value] = j
else:
    print("no pair")
# brute force tries every pair: O(n squared). The dict does it in one pass: O(n).`;

// ---------- 12 heap
const s12 = R`import heapq

heap = []
for order, item in enumerate(input("Tasks: ").split()):
    name, priority = item.split(":")
    heapq.heappush(heap, (int(priority), order, name))
show = int(input("Show: "))
shown = 0
while heap and shown < show:
    priority, _, name = heapq.heappop(heap)
    print(f"{name} (priority {priority})")
    shown += 1
print("Waiting:", len(heap))`;
const e12 = R`import heapq

heap = []
for n in [5, 1, 4, 2]:
    heapq.heappush(heap, n)            # O(log n)
print(heap[0])                         # the smallest is always at the front: O(1)
print(heapq.heappop(heap), heapq.heappop(heap))   # smallest first: 1 2
tasks = []
heapq.heappush(tasks, (2, 0, "write"))        # tuples compare left to right
heapq.heappush(tasks, (1, 1, "test"))
heapq.heappush(tasks, (1, 2, "plan"))         # same priority: the 2nd number keeps arrival order
while tasks:
    print(heapq.heappop(tasks)[2], end=" ")
print()
print(heapq.nlargest(2, [4, 9, 1, 7]), heapq.nsmallest(2, [4, 9, 1, 7]))`;

// ---------- 13 linked list
const t13 = R`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next

`;
const c13 = R`class LinkedList:
    def __init__(self):
        self.head = None
        self.size = 0

    def __len__(self):
        return self.size

    def append(self, value):
        node = Node(value)
        if self.head is None:
            self.head = node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = node
        self.size += 1

    def prepend(self, value):
        self.head = Node(value, self.head)
        self.size += 1

    def remove(self, value):
        previous, current = None, self.head
        while current:
            if current.value == value:
                if previous:
                    previous.next = current.next
                else:
                    self.head = current.next
                self.size -= 1
                return True
            previous, current = current, current.next
        return False

    def reverse(self):
        previous, current = None, self.head
        while current:
            current.next, previous, current = previous, current, current.next
        self.head = previous

    def to_list(self):
        values, current = [], self.head
        while current:
            values.append(current.value)
            current = current.next
        return values

`;
const stub13 = R`class LinkedList:
    # write __init__, __len__, append, prepend, remove, reverse and to_list
    pass

`;
const hn13 = R`ll = LinkedList()
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    cmd = parts[0]
    if cmd == "append" and len(parts) == 2:
        ll.append(parts[1])
    elif cmd == "prepend" and len(parts) == 2:
        ll.prepend(parts[1])
    elif cmd == "remove" and len(parts) == 2:
        print("Removed " + parts[1] if ll.remove(parts[1]) else "Not found: " + parts[1])
    elif cmd == "reverse":
        ll.reverse()
    elif cmd == "show":
        print(" -> ".join(ll.to_list()) or "(empty)")
    elif cmd == "len":
        print(len(ll))
    else:
        print("Unknown command")`;
const e13 = R`class Node:
    def __init__(self, value, next=None):
        self.value = value
        self.next = next             # a reference to the next node (or None at the end)

head = Node("a", Node("b", Node("c")))
current = head
while current:                       # walk the chain
    print(current.value, end=" ")
    current = current.next
print()
head = Node("z", head)               # prepend: O(1), just a new head
# remove "b": make the node BEFORE it skip over it
previous = head.next                 # "a"
previous.next = previous.next.next
current, values = head, []
while current:
    values.append(current.value)
    current = current.next
print(values)`;
const sess13 = ['append a','append b','append c','prepend z','show','len','remove b','remove q','show','reverse','show','remove z','remove c','remove a','show','len','quit'];
const out13 = ['z -> a -> b -> c','4','Removed b','Not found: q','z -> a -> c','c -> a -> z','Removed z','Removed c','Removed a','(empty)','0'];

// ---------- 14 BST
const t14 = R`class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

`;
const c14 = R`class BST:
    def __init__(self):
        self.root = None

    def add(self, value):
        if self.root is None:
            self.root = Node(value)
            return
        node = self.root
        while True:
            if value == node.value:
                return
            side = "left" if value < node.value else "right"
            child = getattr(node, side)
            if child is None:
                setattr(node, side, Node(value))
                return
            node = child

    def has(self, value):
        node = self.root
        while node:
            if value == node.value:
                return True
            node = node.left if value < node.value else node.right
        return False

    def in_order(self):
        def walk(node):
            if node is None:
                return []
            return walk(node.left) + [node.value] + walk(node.right)
        return walk(self.root)

    def height(self):
        def levels(node):
            if node is None:
                return 0
            return 1 + max(levels(node.left), levels(node.right))
        return levels(self.root)

    def minimum(self):
        node = self.root
        if node is None:
            return None
        while node.left:
            node = node.left
        return node.value

`;
const stub14 = R`class BST:
    # write __init__, add (ignore duplicates), has, in_order, height and minimum
    pass

`;
const hn14 = R`tree = BST()
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    cmd = parts[0]
    if cmd == "add" and len(parts) == 2:
        tree.add(int(parts[1]))
    elif cmd == "has" and len(parts) == 2:
        print(tree.has(int(parts[1])))
    elif cmd == "sorted":
        print(tree.in_order())
    elif cmd == "height":
        print(tree.height())
    elif cmd == "min":
        print(tree.minimum())
    else:
        print("Unknown command")`;
const e14 = R`class Node:
    def __init__(self, value):
        self.value, self.left, self.right = value, None, None

def add(node, value):                 # smaller goes left, bigger goes right
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = add(node.left, value)
    elif value > node.value:
        node.right = add(node.right, value)
    return node

def in_order(node):                   # left, me, right: visits values in sorted order
    return [] if node is None else in_order(node.left) + [node.value] + in_order(node.right)

def height(node):
    return 0 if node is None else 1 + max(height(node.left), height(node.right))

root = None
for n in [5, 3, 8, 1, 4]:
    root = add(root, n)
print(in_order(root), height(root))   # [1, 3, 4, 5, 8] 3
# a balanced tree of a million values is only about 20 levels deep: O(log n) search`;
const sess14 = ['add 5','add 3','add 8','add 1','add 4','add 7','add 9','sorted','height','min','has 4','has 6','quit'];
const out14 = ['[1, 3, 4, 5, 7, 8, 9]','3','1','True','False'];

// ---------- 15 BFS
const s15 = R`from collections import deque

graph = {}
for edge in input("Edges: ").split():
    a, b = edge.split("-")
    graph.setdefault(a, set()).add(b)
    graph.setdefault(b, set()).add(a)
start = input("Start: ").strip()
goal = input("Goal: ").strip()
if start not in graph or goal not in graph:
    print("No path")
else:
    parent = {start: None}
    queue = deque([start])
    while queue:
        node = queue.popleft()
        if node == goal:
            break
        for neighbour in sorted(graph[node]):
            if neighbour not in parent:
                parent[neighbour] = node
                queue.append(neighbour)
    if goal not in parent:
        print("No path")
    else:
        path, step = [], goal
        while step is not None:
            path.append(step)
            step = parent[step]
        print(" -> ".join(reversed(path)))`;
const e15 = R`from collections import deque

graph = {"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}
order, queue, seen = [], deque(["a"]), {"a"}
while queue:
    node = queue.popleft()            # breadth first: nearest nodes first
    order.append(node)
    for neighbour in graph[node]:
        if neighbour not in seen:     # the seen set stops endless loops in cyclic graphs
            seen.add(neighbour)
            queue.append(neighbour)
print(order)
parent = {"a": None, "b": "a", "c": "a", "d": "b"}     # remember who found each node...
path, step = [], "d"
while step is not None:
    path.append(step); step = parent[step]
print(list(reversed(path)))           # ...and walk back to rebuild the shortest path`;

// ---------- 16 grid islands
const s16 = R`rows = input("Grid: ").split()
height = len(rows)
seen = set()
islands = 0
largest = 0
for r in range(height):
    for c in range(len(rows[r])):
        if rows[r][c] == "1" and (r, c) not in seen:
            islands += 1
            area = 0
            stack = [(r, c)]
            seen.add((r, c))
            while stack:
                y, x = stack.pop()
                area += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < height and 0 <= nx < len(rows[ny]) and rows[ny][nx] == "1" and (ny, nx) not in seen:
                        seen.add((ny, nx))
                        stack.append((ny, nx))
            largest = max(largest, area)
print("Islands:", islands)
print("Largest:", largest)`;
const e16 = R`rows = ["110", "011"]
height, width = len(rows), len(rows[0])
cells = {(r, c) for r in range(height) for c in range(width) if rows[r][c] == "1"}
print(len(cells), (0, 1) in cells, (1, 0) in cells)
for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):        # four neighbours (no diagonals)
    y, x = 0 + dy, 1 + dx
    inside = 0 <= y < height and 0 <= x < width           # ALWAYS check bounds: -1 would wrap around!
    print((y, x), inside and rows[y][x])
# flood fill: pick a land cell, spread to land neighbours with a stack, mark them seen`;
const grid16big = Array(60).fill('1'.repeat(60)).join(' ');

// ---------- 17 LRU
const stub17 = R`from collections import OrderedDict

class LRUCache:
    # write __init__(capacity), get(key) (None if missing), put(key, value) and keys()
    pass

`;
const c17 = R`from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.items = OrderedDict()

    def get(self, key):
        if key not in self.items:
            return None
        self.items.move_to_end(key)
        return self.items[key]

    def put(self, key, value):
        if key in self.items:
            self.items.move_to_end(key)
        self.items[key] = value
        if len(self.items) > self.capacity:
            self.items.popitem(last=False)

    def keys(self):
        return list(self.items)

`;
const hn17 = R`cache = LRUCache(int(input("Capacity: ")))
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "put" and len(parts) == 3:
        cache.put(parts[1], parts[2])
    elif parts[0] == "get" and len(parts) == 2:
        value = cache.get(parts[1])
        print("miss" if value is None else value)
    elif parts[0] == "keys":
        print(" ".join(cache.keys()) or "(empty)")
    else:
        print("Unknown command")`;
const e17 = R`from collections import OrderedDict

d = OrderedDict(a=1, b=2, c=3)
d.move_to_end("a")                    # "a" was just used: now the newest
print(list(d))                        # ['b', 'c', 'a']
d.popitem(last=False)                 # evict the OLDEST (least recently used)
print(list(d))                        # ['c', 'a']
print("c" in d, d.get("zzz"))
# a cache keeps the hot items and drops the cold ones: get and put are both O(1)`;
const sess17 = ['put a 1','put b 2','get a','put c 3','get b','keys','put a 9','keys','get c','keys','put d 4','keys','get a','quit'];
const out17 = ['1','miss','a c','c a','3','a c','c d','miss'];

// ---------- 18 trie mission
const stub18 = R`class Trie:
    # write add(word) -> True if new, count(prefix), suggest(prefix, limit)
    pass

`;
const c18 = R`class Trie:
    def __init__(self):
        self.children = {}
        self.words_below = 0
        self.is_word = False

    def add(self, word):
        node, path = self, [self]
        for ch in word:
            node = node.children.setdefault(ch, Trie())
            path.append(node)
        if node.is_word:
            return False
        node.is_word = True
        for visited in path:
            visited.words_below += 1
        return True

    def _find(self, prefix):
        node = self
        for ch in prefix:
            node = node.children.get(ch)
            if node is None:
                return None
        return node

    def count(self, prefix):
        node = self._find(prefix)
        return node.words_below if node else 0

    def suggest(self, prefix, limit):
        node = self._find(prefix)
        found = []
        def walk(current, text):
            if len(found) >= limit:
                return
            if current.is_word:
                found.append(text)
            for ch in sorted(current.children):
                walk(current.children[ch], text + ch)
        if node:
            walk(node, prefix)
        return found

`;
const hn18 = R`trie = Trie()
while True:
    parts = input("> ").split()
    if not parts or parts[0] == "quit":
        break
    if parts[0] == "add" and len(parts) == 2:
        print("Added" if trie.add(parts[1].lower()) else "Known")
    elif parts[0] == "count" and len(parts) == 2:
        print(trie.count(parts[1].lower()))
    elif parts[0] == "suggest" and len(parts) == 2:
        found = trie.suggest(parts[1].lower(), 3)
        print(", ".join(found) if found else "none")
    else:
        print("Unknown command")`;
const e18 = R`root = {}
for word in ["car", "cat", "dog"]:
    node = root
    for ch in word:
        node = node.setdefault(ch, {})     # walk down, creating missing branches
    node["$"] = True                       # mark: a word ends here
print(sorted(root))                        # ['c', 'd']
print(sorted(root["c"]["a"]))              # ['r', 't']: "car" and "cat" share the "ca" path
node = root
for ch in "ca":                            # find a prefix by walking its letters
    node = node[ch]
print(sorted(k for k in node if k != "$"))
# words that share a start share memory, and finding a prefix costs the prefix length, not the dictionary size`;
const sess18 = ['add car','add card','add care','add careful','add cat','add dog','add car','count car','count ca','count d','count z','suggest car','suggest care','suggest ca','suggest x','add Cat','suggest CA','quit'];
const out18 = ['Added','Added','Added','Added','Added','Added','Known','4','5','1','0','car, card, care','care, careful','car, card, care','none','Known','car, card, care'];

LESSONS.push(
{
  id:'r13-09', realm:13, n:9, title:'Stacks: last in, first out',
  teaches:['ds-stack'], requires:['mission13a'],
  story:`Quill leads you to a rack of plates in the Arena kitchen. You can only take the plate on top, and you can only add to the top. "A **stack**," Quill says. "Simple, and hiding inside half the software you use: the undo button, the browser's back button, and the way Python itself tracks function calls."`,
  concept:{
    html:`A **stack** is last-in, first-out (**LIFO**). A Python list is already one:\n\n\`\`\`\nstack = []\nstack.append("a")      # push\nstack.append("b")\nstack[-1]              # peek at the top: "b"\nstack.pop()            # pop the top: "b" (O(1))\nbool(stack)            # False when empty\n\`\`\`\n\n- Both \`append\` and \`pop()\` at the **end** are O(1).\n- **Always check before popping**: \`pop()\` on an empty list raises \`IndexError\`. Use \`if stack:\` / \`if not stack:\`.\n- Classic uses: **undo history**, **back button**, **depth-first search**, **evaluating expressions**, and **matching brackets**.\n- **Bracket matching**: push each opener; when you see a closer, the top of the stack must be its matching opener. At the end the stack must be empty.\n- Storing the **index** with each opener lets you report *where* the problem is.\n- Interviews love this one: "are the brackets in this code balanced?"`,
    analogy:`A stack of plates: the last plate you put on is the first one you take off.`,
    example:e09},
  predict:{code:R`stack = []
stack.append(1)
stack.append(2)
print(stack.pop(), stack)`, q:'What prints?', opts:['2 [1]','1 [2]','2 [1, 2]'], ans:0, why:'pop() removes and returns the last item, 2, leaving [1].'},
  cast:{code:e09, task:'Cast it.'},
  bug:{broken:R`stack = []
print(stack.pop())`, task:'Popping an empty stack crashes with IndexError. Check first; print "empty" when there is nothing to pop. Expected: empty',
    cases:[{inputs:[],tests:[['Works','lines==["empty"]'],['Pops safely','"pop" in src and "if" in src']]}],
    sol:R`stack = []
if stack:
    print(stack.pop())
else:
    print("empty")`, wrong:[R`print("empty")`]},
  write:{prompt:'Ask `Text: `. Check that every `(`, `[` and `{` is closed by the matching bracket in the right order (ignore other characters). Print `Balanced`, or `Unbalanced at <index>`: the index of the first closing bracket that does not match, or, if brackets are left open at the end, the index of the **earliest** unclosed opener.',
    starter:R`text = input("Text: ")
pairs = {")": "(", "]": "[", "}": "{"}
`,
    inputs:['(a[b]{c})'],
    cases:[{inputs:['()[]{}'],tests:[['Simple',eqMt(['Balanced'])]]},{inputs:['(a[b]{c})'],tests:[['Nested with text',eqMt(['Balanced'])]]},{inputs:['(]'],tests:[['Wrong closer',eqMt(['Unbalanced at 1'])]]},{inputs:['(('],tests:[['Never closed',eqMt(['Unbalanced at 0'])]]},{inputs:['(()'],tests:[['One left open',eqMt(['Unbalanced at 0'])]]},{inputs:[')'],tests:[['Closer first',eqMt(['Unbalanced at 0'])]]},{inputs:[''],tests:[['Empty',eqMt(['Balanced'])]]},{inputs:['{[()]}('],tests:[['Late opener',eqMt(['Unbalanced at 6'])]]},{inputs:['([)]'],tests:[['Interleaved',eqMt(['Unbalanced at 2'])]]},{inputs:['abc'],tests:[['No brackets',eqMt(['Balanced'])]]},{inputs:['a(b[c)d]'],tests:[['Mismatch inside text',eqMt(['Unbalanced at 5'])]]}],
    sol:s09,
    wrong:[s09.replace('if not stack or stack[-1][0] != pairs[ch]:','if stack[-1][0] != pairs[ch]:'),s09.replace('result = stack[0][1]','result = stack[-1][1]'),s09.replace('stack.pop()\nif','pass\nif'),s09.replace('print("Balanced" if result is None','print("Balanced" if True'),s09.replace(' and stack:',':').replace('result = stack[0][1]','result = len(text)')],
    hints:['Push each opener (with its index) onto a list; for a closer look at the top of the stack.','A closer is bad if the stack is empty or the top is not its partner (use the pairs dict).','After the loop any opener still on the stack is unclosed: report the earliest one (stack[0]).',s09]},
  power:{can:['Use a list as a stack','Match brackets and report where the error is'],
    expand:'Add a rule that a closer matching nothing says `Unexpected closer at <index>` instead.',
    where:'Editors, compilers and linters all use stacks to check nesting.',
    next:'Next: queues, first in, first out.'},
  codex:{title:'Stack',body:'LIFO. list.append() pushes, list.pop() pops (both O(1) at the end), stack[-1] peeks. Check "if stack" before pop. Uses: undo, back button, DFS, bracket matching (push openers, pop on closers).',snip:R`stack.append(item)
top = stack.pop() if stack else None`}
},
{
  id:'r13-10', realm:13, n:10, title:'Queues and deque: first in, first out',
  teaches:['ds-queue'], requires:['ds-stack'],
  story:`The Arena ticket line moves one person at a time from the front while newcomers join at the back. "Fair, orderly, and quick to run," Quill says, "if you build it with the right tool. A plain list makes everyone in the line shuffle forward each time someone leaves."`,
  concept:{
    html:`A **queue** is first-in, first-out (**FIFO**). Use \`collections.deque\` (pronounced "deck"):\n\n\`\`\`\nfrom collections import deque\n\nline = deque()\nline.append("ada")      # join at the back, O(1)\nline.popleft()           # leave from the front, O(1)\nline.appendleft("vip")   # works at both ends\nlen(line); list(line)\n\`\`\`\n\n- \`list.pop(0)\` is **O(n)**: every remaining item shifts one place. \`deque.popleft()\` is **O(1)**.\n- Queues model **fairness**: print jobs, customer support, task schedulers, **breadth-first search**.\n- **Round-robin scheduling**: each task gets a fixed slice of time (the *quantum*). If it is not finished it goes to the **back** of the queue.\n- Use \`min(quantum, left)\` so a task never runs longer than it needs.\n- Items can be small lists \`[name, left]\` so you can update the remaining work.\n- Stack = last in, first out. Queue = first in, first out. Know both cold.`,
    analogy:`A line at a coffee shop: serve the person at the front, new people join at the back.`,
    example:e10},
  predict:{code:R`from collections import deque
q = deque([1, 2, 3])
q.append(4)
print(q.popleft(), list(q))`, q:'What prints?', opts:['1 [2, 3, 4]','4 [1, 2, 3]','1 [1, 2, 3, 4]'], ans:0, why:'popleft removes the oldest item, 1; the new item 4 joined at the back.'},
  cast:{code:e10, task:'Cast it.'},
  bug:{broken:R`from collections import deque
queue = deque([1, 2, 3])
print(queue.pop())`, task:'pop() takes from the back (that is a stack!). A queue serves the front. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['popleft','"popleft" in src']]}],
    sol:R`from collections import deque
queue = deque([1, 2, 3])
print(queue.popleft())`, wrong:[R`print(1)`]},
  write:{prompt:'Round-robin scheduler. Ask `Quantum: ` (time slice) and `Tasks: ` (space-separated `name:units`). Repeatedly take the task at the front, run it for `min(quantum, units left)`, advance the clock, and put it at the back if work remains. Print `<name> done at <clock>` the moment a task finishes (a task with 0 units finishes at once).',
    starter:R`from collections import deque

quantum = int(input("Quantum: "))
queue = deque()
`,
    inputs:['2','a:3 b:1 c:4'],
    cases:[{inputs:['2','a:3 b:1 c:4'],tests:[['Rounds',eqMt(['b done at 3','a done at 6','c done at 8'])]]},{inputs:['5','a:3 b:1'],tests:[['Big quantum',eqMt(['a done at 3','b done at 4'])]]},{inputs:['1','x:0 y:2'],tests:[['Zero work',eqMt(['x done at 0','y done at 2'])]]},{inputs:['3',''],tests:[['No tasks','lines==["Quantum: 3","Tasks: "]']]},{inputs:['1','a:2 b:2'],tests:[['Alternating',eqMt(['a done at 3','b done at 4'])]]},{inputs:['4','p:9'],tests:[['One long task',eqMt(['p done at 9'])]]}],
    sol:s10,
    wrong:[s10.replace('queue.popleft()','queue.pop()'),s10.replace('run = min(quantum, left)','run = quantum'),s10.replace('        queue.append([name, left])','        queue.appendleft([name, left])'),s10.replace('    if left > 0:\n        queue.append([name, left])\n    else:\n        print(f"{name} done at {clock}")','    print(f"{name} done at {clock}")'),s10.replace('clock += run','clock += 1')],
    hints:['Fill the deque with [name, int(units)] pairs, then loop while queue.','name, left = queue.popleft(); run = min(quantum, left); advance the clock and subtract.','If work is left, queue.append([name, left]); otherwise print "<name> done at <clock>".',s10]},
  power:{can:['Use deque as an O(1) queue','Simulate round-robin scheduling'],
    expand:'Print the average finishing time of all tasks.',
    where:'Operating systems, web servers and print spoolers schedule work with queues.',
    next:'Next: dictionaries as a problem-solving tool (two-sum).'},
  codex:{title:'Queue / deque',body:'FIFO. from collections import deque; append() joins the back, popleft() leaves the front (both O(1)); list.pop(0) is O(n). Round-robin: run min(quantum, left), requeue if unfinished.',snip:R`item = queue.popleft()
queue.append(item)`}
},
{
  id:'r13-11', realm:13, n:11, title:'Hash maps in action: the two-sum trick',
  teaches:['ds-hashmap'], requires:['ds-queue'],
  story:`"Find two fighters whose strengths add up to exactly 1000," Quill says. The slow arena clerk tries every pair for an hour. Quill does it in one pass with a notebook. "I write down each strength as I see it. For each new fighter I only ask: **have I already seen the partner he needs?**"`,
  concept:{
    html:`**Two-sum** is the most famous interview question. Given numbers and a target, find two positions whose values add up to it.\n\n**Brute force**: try every pair, **O(n²)**.\n\n**With a dict**: remember each value's index. For every new value ask "have I seen \`target - value\`?" Answer in **O(1)**, so the whole job is **O(n)**.\n\n\`\`\`\nseen = {}                       # value -> index\nfor j, value in enumerate(numbers):\n    need = target - value\n    if need in seen:\n        return seen[need], j    # earliest partner, current position\n    seen.setdefault(value, j)   # remember the first index of each value\n\`\`\`\n\n- Look **before** you store the current value so a number is never paired with itself.\n- \`setdefault\` keeps the **first** index when a value repeats.\n- This returns the pair whose **second** index is smallest.\n- The pattern "remember what I've seen in a dict" solves counting, grouping, complements and caching problems.\n- Always handle **no answer** (\`No pair\`) and tiny inputs (0 or 1 numbers).`,
    analogy:`Keeping a list of who has arrived, so each new guest can check whether their partner is already there.`,
    example:e11},
  predict:{code:R`seen = {}
seen[4] = 0
print(10 - 6 in seen, seen.get(7))`, q:'What prints?', opts:['True None','False 0','True 0'], ans:0, why:'10 - 6 is 4, which is a key; there is no key 7, so get returns None.'},
  cast:{code:e11, task:'Cast it.'},
  bug:{broken:R`seen = {1: "a"}
print(seen[5])`, task:'Looking up a missing key raises KeyError. Use .get so a missing key gives None. Expected: None',
    cases:[{inputs:[],tests:[['Works','lines==["None"]'],['Safe lookup','".get(" in src or "in seen" in src']]}],
    sol:R`seen = {1: "a"}
print(seen.get(5))`, wrong:[R`print(None)`]},
  write:{prompt:'The list is made for you: `numbers[i] = (i * 37) % 1000` for `i` in `0..size-1`. Ask `Size: ` and `Target: `. Find two different positions whose values add up to the target. Report the pair whose **second position is smallest** (and for that, the earliest partner) as `Pair at <i> and <j>` with `i < j`, or `No pair`. It must stay fast with 30,000 numbers.',
    starter:h11,
    inputs:['30','259'],
    cases:[{inputs:['30','259'],tests:[['Second index is smallest',eqMt(['Pair at 3 and 4'])]]},{inputs:['30','147'],tests:[['Another',eqMt(['Pair at 3 and 28'])]]},{inputs:['2000','7'],tests:[['Zero plus seven',eqMt(['Pair at 0 and 811'])]]},{inputs:['0','5'],tests:[['Empty',eqMt(['No pair'])]]},{inputs:['1','0'],tests:[['Single number',eqMt(['No pair'])]]},{inputs:['2','0'],tests:[['0 + 37 is not 0',eqMt(['No pair'])]]},{inputs:['30000','1998'],tests:[['Big, answer exists',eqMt(['Pair at 27 and 1027'])]]},{inputs:['30000','5000'],tests:[['Big, no answer: must be O(n)',eqMt(['No pair'])]]}],
    sol:s11,
    wrong:[h11 + R`answer = None
for i in range(len(numbers)):
    for j in range(i + 1, len(numbers)):
        if numbers[i] + numbers[j] == target:
            answer = (i, j)
            break
    if answer:
        break
print("No pair" if answer is None else f"Pair at {answer[0]} and {answer[1]}")`,s11.replace('if target - value in seen:','if value in seen:').replace('answer = (seen[target - value], j)','answer = (seen[value], j)'),s11.replace('    if target - value in seen:','    seen.setdefault(value, j)\n    if target - value in seen:').replace('    seen.setdefault(value, j)\nif answer','if answer'),s11.replace('print("No pair")','print("None")')],
    hints:['Keep seen = {} mapping value -> first index.','For each j, value: if target - value is in seen the pair is (seen[target - value], j); otherwise remember the value.','Look BEFORE you store, so a number never pairs with itself. Print "No pair" if the loop finds nothing.',s11]},
  power:{can:['Solve two-sum in O(n) with a dict','Choose a hash map over brute force'],
    expand:'Return ALL index pairs that add up to the target (use a dict of value -> list of indices).',
    where:'"Remember what you have seen in a dict" solves a huge share of interview and real-world problems.',
    next:'Next: heaps, always getting the smallest item fast.'},
  codex:{title:'Two-sum',body:'seen = {} (value -> index). For each value: need = target - value; if need in seen -> answer; then store. Look before you store. O(n) instead of O(n²). setdefault keeps the first index.',snip:R`if target - value in seen:
    return seen[target - value], j
seen.setdefault(value, j)`}
},
{
  id:'r13-12', realm:13, n:12, title:'Heaps: the priority queue',
  teaches:['ds-heap'], requires:['ds-hashmap'],
  story:`The Arena healer must treat the **most urgent** patient first, not the one who arrived first. "Sorting the whole waiting room every time someone walks in is a waste," Quill says. "Keep a **heap**: the most urgent is always at the front."`,
  concept:{
    html:`A **heap** keeps the **smallest** item instantly available. Python's \`heapq\` turns a list into one:\n\n\`\`\`\nimport heapq\nheap = []\nheapq.heappush(heap, 5)    # O(log n)\nheapq.heappush(heap, 1)\nheap[0]                    # the smallest, O(1)\nheapq.heappop(heap)        # remove and return the smallest, O(log n)\n\`\`\`\n\n- **Priority queue** pattern: push tuples \`(priority, order, name)\`. Tuples compare left to right, so the lowest priority number comes out first.\n- **Tie-break with an arrival counter** (\`order\`) so equal priorities come out in the order they arrived (and Python never has to compare the names).\n- It is a **min-heap**. For "largest first", push the **negative** value.\n- \`heapq.nlargest(k, items)\` / \`nsmallest(k, items)\` answer "top k" questions.\n- Pulling out n items one by one costs **O(n log n)**: it is a sort, but you can stop after k items.\n- Used for: task schedulers, "k closest points", merging sorted streams, Dijkstra's shortest path.`,
    analogy:`A hospital waiting room where the sickest patient is always called next, whatever time they arrived.`,
    example:e12},
  predict:{code:R`import heapq
h = []
for x in [5, 1, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h), h[0])`, q:'What prints?', opts:['1 3','5 1','1 5'], ans:0, why:'The smallest, 1, comes out first; the next smallest, 3, is now at the front.'},
  cast:{code:e12, task:'Cast it.'},
  bug:{broken:R`import heapq
h = []
for x in [5, 1, 3]:
    heapq.heappush(h, x)
print(heapq.heappop(h))`, task:'We want the LARGEST value (5), but a heap gives the smallest. Push negatives and negate on the way out. Expected: 5',
    cases:[{inputs:[],tests:[['Works','lines==["5"]'],['Negation','"-x" in src or "-heapq" in src or "-1 *" in src or "- " in src']]}],
    sol:R`import heapq
h = []
for x in [5, 1, 3]:
    heapq.heappush(h, -x)
print(-heapq.heappop(h))`, wrong:[R`print(5)`]},
  write:{prompt:'Ask `Tasks: ` (space-separated `name:priority`, lower number = more urgent) and `Show: ` (how many to handle). Use a heap. Print `<name> (priority <p>)` for the `Show` most urgent tasks in order (equal priorities keep their arrival order). Then print `Waiting: <how many are left>`.',
    starter:R`import heapq

heap = []
`,
    inputs:['write:3 test:1 ship:2 plan:1','3'],
    cases:[{inputs:['write:3 test:1 ship:2 plan:1','3'],tests:[['Most urgent',eqMt(['test (priority 1)','plan (priority 1)','ship (priority 2)','Waiting: 1'])],['Uses heapq','"heappush" in src']]},{inputs:['write:3 test:1','0'],tests:[['Show none',eqMt(['Waiting: 2'])]]},{inputs:['a:2 b:1','10'],tests:[['Show more than exist',eqMt(['b (priority 1)','a (priority 2)','Waiting: 0'])]]},{inputs:['','2'],tests:[['No tasks',eqMt(['Waiting: 0'])]]},{inputs:['b:1 a:1','2'],tests:[['Ties keep arrival order',eqMt(['b (priority 1)','a (priority 1)','Waiting: 0'])]]},{inputs:['x:-1 y:0 z:-5','2'],tests:[['Negative priorities',eqMt(['z (priority -5)','x (priority -1)','Waiting: 1'])]]}],
    sol:s12,
    wrong:[s12.replace('(int(priority), order, name)','(int(priority), name)'),s12.replace('(int(priority), order, name)','(-int(priority), order, name)').replace('print(f"{name} (priority {priority})")','print(f"{name} (priority {-priority})")'),s12.replace('while heap and shown < show:','while heap:'),s12.replace('print("Waiting:", len(heap))','print("Waiting:", len(heap) + 1)')],
    hints:['For each task push (int(priority), order, name) with heapq.heappush; order is the arrival number.','Pop with heapq.heappop until you have shown Show tasks or the heap is empty.','Print Waiting: with the length of the heap that is left.',s12]},
  power:{can:['Use heapq as a priority queue','Break priority ties with an arrival counter'],
    expand:'Use `heapq.nlargest(3, scores)` to print a top-3 leaderboard without sorting everything.',
    where:'Schedulers, map routing (Dijkstra) and "top k" features are built on heaps.',
    next:'Next: linked lists and pointers.'},
  codex:{title:'Heap',body:'import heapq; heappush(h, x) / heappop(h) are O(log n); h[0] is the smallest. Push (priority, order, item) tuples; order breaks ties. Max-heap: push negatives. nlargest / nsmallest for top-k.',snip:R`heapq.heappush(heap, (priority, order, name))
priority, _, name = heapq.heappop(heap)`}
},
{
  id:'r13-13', realm:13, n:13, title:'Linked lists: nodes and pointers',
  teaches:['ds-linked'], requires:['ds-heap'],
  story:`Quill ties the Arena banners together, each one holding the rope to the next. "No numbered shelf here," Quill says. "Each link only knows **who comes after it**. Cut one rope and re-tie, and the chain is changed."`,
  concept:{
    html:`A **linked list** is a chain of **nodes**. Each node stores a value and a reference to the next node.\n\n\`\`\`\nclass Node:\n    def __init__(self, value, next=None):\n        self.value = value\n        self.next = next\n\nhead = Node("a", Node("b", Node("c")))   # a -> b -> c -> None\n\ncurrent = head\nwhile current:           # walk the chain\n    print(current.value)\n    current = current.next\n\`\`\`\n\n- **Prepend** (new head) is O(1). **Append** needs to walk to the end, O(n) (unless you keep a tail).\n- **Remove**: find the node *before* it and make it skip: \`previous.next = current.next\`. If you remove the **head**, move \`head\` instead.\n- **Reverse in place**: walk the chain and flip each \`next\` pointer to point backwards, tracking \`previous\` and \`current\`.\n- Keep a \`size\` counter so \`len()\` is O(1), and update it on every add and remove.\n- Python lists are usually better in practice, but interviews use linked lists to test whether you can think in **references**.\n- Classic bugs: forgetting the head case, losing the rest of the chain, and not handling an empty list.`,
    analogy:`A treasure hunt where each clue only tells you where the next clue is.`,
    example:e13},
  predict:{code:R`class Node:
    def __init__(self, v, n=None):
        self.v, self.n = v, n

a = Node(1, Node(2, Node(3)))
print(a.n.n.v, a.n.n.n)`, q:'What prints?', opts:['3 None','2 3','3 Node'], ans:0, why:'Following next twice reaches the node holding 3, whose next is None.'},
  cast:{code:e13, task:'Cast it.'},
  bug:{broken:R`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

a = Node(1)
b = Node(2)
print(a.next.value)`, task:'a is not linked to b yet, so a.next is None. Link them. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Links','"a.next = b" in src']]}],
    sol:R`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

a = Node(1)
b = Node(2)
a.next = b
print(a.next.value)`, wrong:[R`print(2)`]},
  write:{prompt:'Write class `LinkedList` (the `Node` class is given): `append(value)`, `prepend(value)`, `remove(value)` (removes the **first** match and returns `True`, or `False` if absent), `reverse()` (in place), `to_list()` and `len()`. The command loop below drives it; do not change it.',
    starter:t13 + stub13 + hn13,
    inputs:sess13,
    cases:[{inputs:sess13,tests:[['Whole session',eqM(out13,'> ')]]},{inputs:['append x','append x','remove x','show','len','quit'],tests:[['Only the first match goes',eqM(['Removed x','x','1'],'> ')]]},{inputs:['remove a','show','reverse','show','len','quit'],tests:[['Empty list is safe',eqM(['Not found: a','(empty)','(empty)','0'],'> ')]]},{inputs:['prepend b','prepend a','append c','reverse','show','remove a','show','quit'],tests:[['Prepend, reverse, remove tail',eqM(['c -> b -> a','Removed a','c -> b'],'> ')]]},{inputs:['append 1','append 2','append 3','remove 1','show','len','dance','quit'],tests:[['Remove the head',eqM(['Removed 1','2 -> 3','2','Unknown command'],'> ')]]}],
    sol:t13 + c13 + hn13,
    wrong:[(t13 + c13 + hn13).replace('                if previous:\n                    previous.next = current.next\n                else:\n                    self.head = current.next\n','                previous.next = current.next\n'),(t13 + c13 + hn13).replace('                self.size -= 1\n                return True','                return True'),(t13 + c13 + hn13).replace('        self.head = previous\n\n    def to_list','        pass\n\n    def to_list'),(t13 + c13 + hn13).replace('        self.head = Node(value, self.head)\n        self.size += 1','        self.append(value)'),(t13 + c13 + hn13).replace('                return True\n            previous, current = current, current.next\n        return False','                previous, current = current, current.next\n                continue\n            previous, current = current, current.next\n        return True')],
    hints:['Node holds value and next. LinkedList keeps head and size.','append: walk to the last node and link the new one; prepend: Node(value, self.head).','remove: track previous and current; relink previous.next (or head). reverse: flip each next pointer while walking.',t13 + c13 + hn13]},
  power:{can:['Build a linked list with nodes and references','Remove and reverse nodes by re-pointing links'],
    expand:'Add a `find_middle()` method using two pointers (one moves twice as fast).',
    where:'Linked-list questions test whether you really understand references: a staple of coding interviews.',
    next:'Next: trees and binary search trees.'},
  codex:{title:'Linked list',body:'Node(value, next). head -> ... -> None. prepend O(1); append O(n) without a tail; remove: relink previous.next (or move head); reverse: previous/current flip loop; keep size updated. Handle empty and head cases.',snip:R`previous.next = current.next   # unlink current
current.next, previous, current = previous, current, current.next`}
},
{
  id:'r13-14', realm:13, n:14, title:'Binary search trees',
  teaches:['ds-tree'], requires:['ds-linked'],
  story:`The Arena archive is a tree of drawers: smaller names to the left of each drawer, bigger names to the right. "To find anything," Quill says, "start at the top and turn left or right. Each turn throws away **half the archive**."`,
  concept:{
    html:`A **binary search tree** (BST): every node has at most two children; everything in the **left** subtree is **smaller**, everything in the **right** is **bigger**.\n\n\`\`\`\ndef add(node, value):\n    if node is None:\n        return Node(value)\n    if value < node.value:\n        node.left = add(node.left, value)\n    elif value > node.value:\n        node.right = add(node.right, value)\n    return node               # equal values are ignored\n\ndef in_order(node):           # left, me, right  ->  sorted order!\n    return [] if node is None else in_order(node.left) + [node.value] + in_order(node.right)\n\`\`\`\n\n- **Search / insert**: turn left or right at each node. O(height): **O(log n)** when balanced, O(n) when the tree degenerates into a chain (inserting already-sorted data).\n- **In-order traversal** of a BST gives the values **sorted**.\n- **Height** = number of levels (empty tree = 0): \`1 + max(height(left), height(right))\`.\n- **Minimum** = keep going left. **Maximum** = keep going right.\n- **Recursion** needs a **base case**: \`if node is None\`.\n- Real databases use balanced relatives (B-trees) so searches stay fast.`,
    analogy:`A "higher or lower" guessing game laid out as a tree of drawers.`,
    example:e14},
  predict:{code:R`def add(t, x):
    if not t:
        t.update(v=x, l={}, r={})
    elif x < t["v"]:
        add(t["l"], x)
    else:
        add(t["r"], x)

root = {}
for x in [5, 3, 8]:
    add(root, x)
print(root["v"], root["l"]["v"], root["r"]["v"])`, q:'What prints?', opts:['5 3 8','3 5 8','5 8 3'], ans:0, why:'5 is the root; 3 is smaller so it goes left, 8 bigger so it goes right.'},
  cast:{code:e14, task:'Cast it.'},
  bug:{broken:R`class N:
    def __init__(self, v, l=None, r=None):
        self.v, self.l, self.r = v, l, r

def height(node):
    return 1 + max(height(node.l), height(node.r))

print(height(N(1, N(2))))`, task:'Recursion never stops: add a base case for an empty subtree. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Base case','"None" in src.split("def height")[1]']]}],
    sol:R`class N:
    def __init__(self, v, l=None, r=None):
        self.v, self.l, self.r = v, l, r

def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.l), height(node.r))

print(height(N(1, N(2))))`, wrong:[R`print(2)`]},
  write:{prompt:'Write class `BST` (the `Node` class is given) with `add(value)` (ignore duplicates), `has(value)`, `in_order()` (sorted list), `height()` (number of levels, 0 when empty) and `minimum()` (`None` when empty). The command loop drives it; do not change it.',
    starter:t14 + stub14 + hn14,
    inputs:sess14,
    cases:[{inputs:sess14,tests:[['Whole session',eqM(out14,'> ')]]},{inputs:['add 5','add 5','add 5','sorted','height','quit'],tests:[['Duplicates are ignored',eqM(['[5]','1'],'> ')]]},{inputs:['sorted','height','min','has 1','quit'],tests:[['Empty tree',eqM(['[]','0','None','False'],'> ')]]},{inputs:['add 1','add 2','add 3','add 4','add 5','height','sorted','min','quit'],tests:[['A chain',eqM(['5','[1, 2, 3, 4, 5]','1'],'> ')]]},{inputs:['add 10','add -5','add 20','add -9','min','has -9','has 20','has 10','height','dance','quit'],tests:[['Negatives and commands',eqM(['-9','True','True','True','3','Unknown command'],'> ')]]}],
    sol:t14 + c14 + hn14,
    wrong:[(t14 + c14 + hn14).replace('            if value == node.value:\n                return\n',''),(t14 + c14 + hn14).replace('walk(node.left) + [node.value] + walk(node.right)','[node.value] + walk(node.left) + walk(node.right)'),(t14 + c14 + hn14).replace('return 1 + max(levels(node.left), levels(node.right))','return max(levels(node.left), levels(node.right)) + (1 if node.left or node.right else 0)'),(t14 + c14 + hn14).replace('        while node.left:\n            node = node.left','        while node.right:\n            node = node.right'),(t14 + c14 + hn14).replace('node = node.left if value < node.value else node.right','node = node.left'),(t14 + c14 + hn14).replace('side = "left" if value < node.value else "right"','side = "right" if value < node.value else "left"')],
    hints:['Node has value, left and right. BST keeps root. add walks down: smaller goes left, bigger goes right, equal does nothing.','in_order: left subtree + [value] + right subtree (recursion with a base case for None).','height: 0 for None else 1 + max of both sides; minimum: keep following left.',t14 + c14 + hn14]},
  power:{can:['Build and search a binary search tree','Traverse in order to get sorted data'],
    expand:'Add `maximum()` and `size()`, then try inserting 1..300 in order and watch the height.',
    where:'Trees power file systems, databases, the DOM of every web page and decision logic.',
    next:'Next: graphs and breadth-first search.'},
  codex:{title:'BST',body:'left < node < right. add/search: turn left or right, O(height). In-order (left, me, right) = sorted. height = 1 + max(children), 0 for None. min = go left. Recursion needs the None base case. Sorted input makes a chain: O(n).',snip:R`def in_order(node):
    return [] if node is None else in_order(node.left) + [node.value] + in_order(node.right)`}
},
{
  id:'r13-15', realm:13, n:15, title:'Graphs and breadth-first search',
  teaches:['ds-graph'], requires:['ds-tree'],
  story:`The Arena is connected by tunnels: a web of rooms, not a tidy tree. "How do I get from the armoury to the throne room in the **fewest** doors?" Quill asks. "Spread out like ripples in a pond: check every room one door away, then two, then three."`,
  concept:{
    html:`A **graph** is nodes (rooms) and edges (tunnels). Store it as a dict of neighbours:\n\n\`\`\`\ngraph = {}\nfor a, b in edges:\n    graph.setdefault(a, set()).add(b)    # an undirected edge goes both ways\n    graph.setdefault(b, set()).add(a)\n\`\`\`\n\n**Breadth-first search (BFS)** uses a **queue** and visits nodes in order of distance, so the first time it reaches the goal is via a **shortest path** (fewest edges).\n\n\`\`\`\nparent = {start: None}\nqueue = deque([start])\nwhile queue:\n    node = queue.popleft()\n    for neighbour in sorted(graph[node]):\n        if neighbour not in parent:      # also the "seen" check\n            parent[neighbour] = node\n            queue.append(neighbour)\n\`\`\`\n\n- The \`parent\` dict doubles as the **visited set**. Without it, graphs with cycles loop forever.\n- **Rebuild the path** by following \`parent\` from the goal back to the start, then reverse.\n- Sorting the neighbours makes the answer **deterministic** (sets have no order).\n- Handle: unknown start/goal, start equals goal, and **disconnected** graphs (\`No path\`).\n- Time: O(nodes + edges). Depth-first search uses a stack instead and does **not** guarantee shortest paths.`,
    analogy:`Ripples spreading from a stone dropped in a pond: nearer rooms are reached first.`,
    example:e15},
  predict:{code:R`from collections import deque
g = {"a": ["b", "c"], "b": ["d"], "c": ["d"], "d": []}
order, queue, seen = [], deque(["a"]), {"a"}
while queue:
    n = queue.popleft()
    order.append(n)
    for m in g[n]:
        if m not in seen:
            seen.add(m)
            queue.append(m)
print(order)`, q:'What prints?', opts:["['a', 'b', 'c', 'd']","['a', 'b', 'd', 'c']","['a', 'd', 'b', 'c']"], ans:0, why:'Breadth first: a, then its neighbours b and c, then d one step further out.'},
  cast:{code:e15, task:'Cast it.'},
  bug:{broken:R`graph = {"a": ["b"]}
print(graph["b"])`, task:'Node b has no entry, so graph["b"] raises KeyError. Use .get with an empty list as the default. Expected: []',
    cases:[{inputs:[],tests:[['Works','lines==["[]"]'],['Safe lookup','".get(" in src']]}],
    sol:R`graph = {"a": ["b"]}
print(graph.get("b", []))`, wrong:[R`print([])`]},
  write:{prompt:'Ask `Edges: ` (space-separated `a-b`, undirected), `Start: ` and `Goal: `. Print a **shortest path** as `a -> c -> d`. When several shortest paths exist, visit neighbours in alphabetical order. If either node is unknown or no path exists print `No path`. A path from a node to itself is just that node.',
    starter:R`from collections import deque

graph = {}
for edge in input("Edges: ").split():
    a, b = edge.split("-")
    graph.setdefault(a, set()).add(b)
    graph.setdefault(b, set()).add(a)
start = input("Start: ").strip()
goal = input("Goal: ").strip()
`,
    inputs:['a-b b-c c-d a-e e-d','a','d'],
    cases:[{inputs:['a-b b-c c-d a-e e-d','a','d'],tests:[['Shortest, not first found',eqMt(['a -> e -> d'])]]},{inputs:['a-b a-c b-d c-d','a','d'],tests:[['Alphabetical tie',eqMt(['a -> b -> d'])]]},{inputs:['x-y','x','x'],tests:[['Start is goal',eqMt(['x'])]]},{inputs:['a-b c-d','a','d'],tests:[['Disconnected',eqMt(['No path'])]]},{inputs:['a-b','a','zzz'],tests:[['Unknown goal',eqMt(['No path'])]]},{inputs:['a-b b-c c-a','a','c'],tests:[['Cycle',eqMt(['a -> c'])]]},{inputs:['','a','a'],tests:[['No edges',eqMt(['No path'])]]},{inputs:['a-b b-c c-d d-e e-f','f','a'],tests:[['Long chain backwards',eqMt(['f -> e -> d -> c -> b -> a'])]]}],
    sol:s15,
    wrong:[s15.replace('queue.popleft()','queue.pop()'),s15.replace('            if neighbour not in parent:\n                parent[neighbour] = node\n                queue.append(neighbour)','            parent[neighbour] = node\n            queue.append(neighbour)'),s15.replace('if start not in graph or goal not in graph:','if False:'),s15.replace('print(" -> ".join(reversed(path)))','print(" -> ".join(path))'),s15.replace('sorted(graph[node])','sorted(graph[node], reverse=True)')],
    hints:['Build graph as dict of sets. parent = {start: None} is both the visited set and the path memory.','Pop from the front of a deque; for each unseen neighbour (sorted) set parent and append.','When the goal is in parent, follow parents back to the start and reverse the list.',s15]},
  power:{can:['Model connections as a graph','Find shortest paths with breadth-first search'],
    expand:'Print the number of doors (edges) too, and the distance to every room from the start.',
    where:'Maps, social networks, game AI and dependency resolution all run on graph search.',
    next:'Next: grids as graphs, counting islands.'},
  codex:{title:'Graphs and BFS',body:'graph = dict of neighbour sets. BFS: deque + parent dict (also the visited set); first arrival at the goal is a shortest path. Rebuild by following parents backwards. Sort neighbours for deterministic output. O(V + E).',snip:R`parent = {start: None}
queue = deque([start])`}
},
{
  id:'r13-16', realm:13, n:16, title:'Grids: counting islands with flood fill',
  teaches:['ds-grid'], requires:['ds-graph'],
  story:`From the Arena tower you see the sea map: rows of water and land. "How many islands, and how big is the biggest?" Quill asks. "Treat each land square as a room and each neighbouring square as a tunnel. A grid is just a graph in disguise."`,
  concept:{
    html:`A grid is a graph where each cell connects to its **4 neighbours** (up, down, left, right).\n\n**Flood fill**: find a land cell, then spread to every connected land cell, marking them seen.\n\n\`\`\`\nfor dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):\n    ny, nx = y + dy, x + dx\n    if 0 <= ny < height and 0 <= nx < width and rows[ny][nx] == "1" and (ny, nx) not in seen:\n        seen.add((ny, nx))\n        stack.append((ny, nx))\n\`\`\`\n\n- **Check bounds first**: Python lets \`rows[-1]\` wrap around to the last row, silently giving wrong answers.\n- **Mark cells seen when you push them**, not when you pop them, so nothing is queued twice.\n- Diagonals do **not** connect islands in this puzzle (4-neighbour rule).\n- Use a **stack (a list)** and a loop instead of recursion: Python's recursion limit (about 1000) would crash on a big island. Iterative flood fill handles 3,600 cells (or 3,600,000) easily.\n- Track the **area** of each island and keep the largest.\n- Same technique: paint bucket tools, minesweeper reveal, region counting in maps.`,
    analogy:`Pouring water on one land square and watching it spread to every connected square.`,
    example:e16},
  predict:{code:R`rows = ["110", "011"]
cells = {(r, c) for r in range(2) for c in range(3) if rows[r][c] == "1"}
print(len(cells), (0, 1) in cells, (1, 0) in cells)`, q:'What prints?', opts:['4 True False','4 False True','3 True False'], ans:0, why:'Four land cells; (0, 1) is land and (1, 0) is water.'},
  cast:{code:e16, task:'Cast it.'},
  bug:{broken:R`rows = ["10", "01"]
y, x = 0 - 1, 0
print(rows[y][x])`, task:'Row -1 silently wraps to the LAST row and prints a digit. Check the bounds and print "outside" instead. Expected: outside',
    cases:[{inputs:[],tests:[['Works','lines==["outside"]'],['Bounds check','"0 <=" in src']]}],
    sol:R`rows = ["10", "01"]
y, x = 0 - 1, 0
if 0 <= y < len(rows) and 0 <= x < len(rows[0]):
    print(rows[y][x])
else:
    print("outside")`, wrong:[R`print("outside")`]},
  write:{prompt:'Ask `Grid: ` (rows of `0` water and `1` land, separated by spaces). Count the islands (land cells connected up/down/left/right, **not** diagonally) and find the biggest. Print `Islands: <n>` and `Largest: <cells>`. Do not use recursion: a 60 x 60 island must work.',
    starter:R`rows = input("Grid: ").split()
height = len(rows)
`,
    inputs:['110 110 001'],
    cases:[{inputs:['110 110 001'],tests:[['Two islands',eqMt(['Islands: 2','Largest: 4'])]]},{inputs:['101 010 101'],tests:[['Diagonals do not connect',eqMt(['Islands: 5','Largest: 1'])]]},{inputs:['111'],tests:[['One row',eqMt(['Islands: 1','Largest: 3'])]]},{inputs:[''],tests:[['No grid',eqMt(['Islands: 0','Largest: 0'])]]},{inputs:['000 000'],tests:[['All water',eqMt(['Islands: 0','Largest: 0'])]]},{inputs:['1'],tests:[['One cell',eqMt(['Islands: 1','Largest: 1'])]]},{inputs:['1101 0111 1000'],tests:[['Snake shape and a loner',eqMt(['Islands: 2','Largest: 6'])]]},{inputs:[grid16big],tests:[['A 60 x 60 island (no recursion!)',eqMt(['Islands: 1','Largest: 3600'])]]}],
    sol:s16,
    wrong:[s16.replace('((1, 0), (-1, 0), (0, 1), (0, -1))','((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1))'),s16.replace('0 <= ny < height and ','').replace('0 <= nx < len(rows[ny]) and ',''),s16.replace('            largest = max(largest, area)\n',''),s16.replace('and (r, c) not in seen:','and True:'),s16.replace('                        seen.add((ny, nx))\n                        stack.append((ny, nx))','                        stack.append((ny, nx))'),s16.replace('            islands += 1\n','            islands += 2\n')],
    hints:['Loop over every cell; start a fill at each land cell that is not in seen.','Use a stack list: pop a cell, count it, push unseen land neighbours (mark them seen when pushed).','Check 0 <= ny < height and 0 <= nx < len(rows[ny]) before indexing. Track the largest area.',s16]},
  power:{can:['Treat a grid as a graph','Flood fill iteratively with bounds checks'],
    expand:'Also print the perimeter of the biggest island (count land edges touching water or the border).',
    where:'Map regions, image editors, game boards and minesweeper all use flood fill.',
    next:'Next: the LRU cache, a favourite interview design question.'},
  codex:{title:'Flood fill',body:'Grid = graph with 4 neighbours. Loop cells; at unseen land start a stack loop; mark seen when pushing; check 0 <= y < height and 0 <= x < width first (negative indexes wrap!). Iterative, not recursive, for big regions.',snip:R`for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
    ny, nx = y + dy, x + dx`}
},
{
  id:'r13-17', realm:13, n:17, title:'The LRU cache',
  teaches:['ds-lru'], requires:['ds-grid'],
  story:`The Arena archive can hold only a few scrolls at the front desk. When a new scroll arrives, the clerk puts back the one nobody has touched for longest. "Everything you read stays near," Quill says. "That is **least recently used** eviction."`,
  concept:{
    html:`An **LRU cache** keeps at most \`capacity\` items. When it is full, it evicts the item **least recently used**. It is one of the most-asked design questions.\n\n\`collections.OrderedDict\` remembers insertion order and can reorder in O(1):\n\n\`\`\`\nfrom collections import OrderedDict\nitems = OrderedDict()\nitems.move_to_end(key)          # "just used": now the newest\nitems.popitem(last=False)       # evict the OLDEST\n\`\`\`\n\n- \`get(key)\`: if missing return \`None\`; otherwise **move it to the end** (it was used) and return it.\n- \`put(key, value)\`: if the key exists, update it **and refresh its position**; then if over capacity, evict the oldest with \`popitem(last=False)\`.\n- \`popitem()\` with no argument pops the **newest**, which is the opposite of what you want!\n- Both operations are **O(1)**: a dict for lookup plus an ordered list of recency.\n- Real uses: browser caches, database page caches, memoising expensive function calls (\`functools.lru_cache\` does exactly this).\n- Edge cases: capacity of 1, updating an existing key, a \`get\` that saves an item from eviction.`,
    analogy:`A desk with room for a few books: the one you haven't opened for longest goes back on the shelf.`,
    example:e17},
  predict:{code:R`from collections import OrderedDict
d = OrderedDict(a=1, b=2, c=3)
d.move_to_end("a")
d.popitem(last=False)
print(list(d))`, q:'What prints?', opts:["['c', 'a']","['b', 'c']","['a', 'b']"], ans:0, why:'After moving a to the end the order is b, c, a; popping the oldest removes b.'},
  cast:{code:e17, task:'Cast it.'},
  bug:{broken:R`from collections import OrderedDict
d = OrderedDict(a=1, b=2, c=3)
d.popitem()
print(list(d))`, task:'popitem() removes the NEWEST item. Evict the oldest. Expected: [\'b\', \'c\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'b\', \'c\']"]'],['last=False','"last=False" in src']]}],
    sol:R`from collections import OrderedDict
d = OrderedDict(a=1, b=2, c=3)
d.popitem(last=False)
print(list(d))`, wrong:[R`print(['b', 'c'])`]},
  write:{prompt:'Write class `LRUCache(capacity)` with `get(key)` (`None` if missing; a hit counts as use), `put(key, value)` (updating also counts as use; evict the least recently used item when over capacity) and `keys()` (oldest first). The command loop below drives it; do not change it.',
    starter:stub17 + hn17,
    inputs:['2'].concat(sess17),
    cases:[{inputs:['2'].concat(sess17),tests:[['Whole session',eqM(['Capacity: 2'].concat(out17),'> ')]]},{inputs:['1','put a 1','put b 2','get a','get b','keys','quit'],tests:[['Capacity one',eqM(['Capacity: 1','miss','2','b'],'> ')]]},{inputs:['2','put a 1','put b 2','put a 5','put c 3','keys','get a','get b','quit'],tests:[['Updating refreshes',eqM(['Capacity: 2','a c','5','miss'],'> ')]]},{inputs:['3','keys','get x','quit'],tests:[['Empty cache',eqM(['Capacity: 3','(empty)','miss'],'> ')]]},{inputs:['2','put a 1','put b 2','get a','put c 3','keys','quit'],tests:[['A get saves an item',eqM(['Capacity: 2','1','a c'],'> ')]]}],
    sol:stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','') + hn17,
    wrong:[stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','').replace('        self.items.move_to_end(key)\n        return self.items[key]','        return self.items[key]') + hn17,stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','').replace('        if key in self.items:\n            self.items.move_to_end(key)\n        self.items[key] = value','        self.items[key] = value') + hn17,stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','').replace('popitem(last=False)','popitem()') + hn17,stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','').replace('> self.capacity','>= self.capacity') + hn17],
    hints:['Keep an OrderedDict called items and a capacity.','get: missing -> None; hit -> move_to_end(key) then return the value.','put: if the key exists move_to_end; set the value; if len > capacity, popitem(last=False). keys() is list(items).',stub17.split('class LRUCache')[0] + c17.replace('from collections import OrderedDict\n\n','') + hn17]},
  power:{can:['Design an LRU cache with O(1) operations','Reason about recency and eviction'],
    expand:'Add hit and miss counters and print the hit rate.',
    where:'Every browser, CDN and database has a cache like this; `functools.lru_cache` is the built-in version.',
    next:'Next: Real-World Mission: the Autocomplete Oracle (a trie).'},
  codex:{title:'LRU cache',body:'OrderedDict: get -> move_to_end(key); put -> update + move_to_end, then if len > capacity popitem(last=False) (oldest). popitem() default pops newest. O(1) for both. functools.lru_cache is the ready-made decorator.',snip:R`self.items.move_to_end(key)
self.items.popitem(last=False)`}
},
{
  id:'r13-18', realm:13, n:18, title:'Real-World Mission: The Autocomplete Oracle',
  teaches:['mission13b'], requires:['ds-lru'],
  story:`Type "ca" into the Arena's Oracle and it whispers *car, card, care...* before you finish. Quill leans in. "A thousand years of words, and it answers instantly. The secret is a tree where every path spells a word: a **trie**. Build the Oracle."`,
  concept:{
    html:`A **trie** (prefix tree) stores words letter by letter. Words that share a start **share nodes**.\n\n\`\`\`\nroot = {}\nfor word in ["car", "cat"]:\n    node = root\n    for ch in word:\n        node = node.setdefault(ch, {})    # walk down, creating missing branches\n\`\`\`\n\n- Finding a prefix costs the **length of the prefix**, not the size of the dictionary.\n- Each node has \`children\` (letter -> node), an \`is_word\` flag, and (for fast counts) a \`words_below\` counter.\n- **add(word)**: walk/create nodes; if the final node is already a word, return \`False\` (a duplicate); otherwise mark it and add 1 to \`words_below\` of **every node on the path**.\n- **count(prefix)**: walk the prefix; the answer is that node's \`words_below\` (0 if the walk fails).\n- **suggest(prefix, limit)**: find the prefix node, then explore children in **alphabetical order** (depth first), collecting words until you have \`limit\`.\n- Normalise input (\`lower()\`) so "Cat" and "cat" are the same word.\n- This is how autocomplete, spell-checkers, T9 keyboards and IP routing tables work.`,
    analogy:`A road map where every route to a word starts the same and only forks where the spelling differs.`,
    example:e18},
  predict:{code:R`root = {}
for word in ["car", "cat"]:
    node = root
    for ch in word:
        node = node.setdefault(ch, {})
print(sorted(root["c"]["a"]))`, q:'What prints?', opts:["['r', 't']","['car', 'cat']","['c']"], ans:0, why:'Both words share the path c -> a, then fork into r and t.'},
  cast:{code:e18, task:'Cast it.'},
  bug:{broken:R`root = {}
for word in ["car", "cat"]:
    node = root
    for ch in word:
        node[ch] = {}
        node = node[ch]
print(sorted(root["c"]["a"]))`, task:'Each word wipes out the shared branch of the one before it. Reuse an existing child. Expected: [\'r\', \'t\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'r\', \'t\']"]'],['Reuses branches','"setdefault" in src or "not in node" in src']]}],
    sol:R`root = {}
for word in ["car", "cat"]:
    node = root
    for ch in word:
        node = node.setdefault(ch, {})
print(sorted(root["c"]["a"]))`, wrong:[R`print(['r', 't'])`]},
  write:{prompt:'Write class `Trie` with `add(word)` (`True` if the word is new, `False` if known), `count(prefix)` (how many different words start with the prefix; 0 if none) and `suggest(prefix, limit)` (up to `limit` words with that prefix, alphabetical). The command loop below lower-cases input and drives it; do not change it.',
    starter:stub18 + hn18,
    inputs:sess18,
    cases:[{inputs:sess18,tests:[['Whole session',eqM(out18,'> ')],['Uses a class','"class Trie" in src']]},{inputs:['add a','add a','add a','count a','suggest a','quit'],tests:[['Duplicates are not counted twice',eqM(['Added','Known','Known','1','a'],'> ')]]},{inputs:['count a','suggest a','quit'],tests:[['Empty trie',eqM(['0','none'],'> ')]]},{inputs:['add b','add ba','add bab','add baby','add bad','suggest b','suggest ba','count ba','quit'],tests:[['Nested words',eqM(['Added','Added','Added','Added','Added','b, ba, bab','ba, bab, baby','4'],'> ')]]},{inputs:['add cat','add car','add cab','suggest ca','quit'],tests:[['Alphabetical, not insertion order',eqM(['Added','Added','Added','cab, car, cat'],'> ')]]},{inputs:['add zebra','add apple','suggest a','suggest z','count zebr','count zebras','dance','quit'],tests:[['Different branches',eqM(['Added','Added','apple','zebra','1','0','Unknown command'],'> ')]]}],
    sol:c18 + hn18,
    wrong:[(c18 + hn18).replace('        if node.is_word:\n            return False\n',''),(c18 + hn18).replace('for ch in sorted(current.children):','for ch in current.children:').replace("node.children.setdefault(ch, Trie())","node.children.setdefault(ch, Trie())") + '\n',(c18 + hn18).replace('if len(found) >= limit:\n                return','if False:\n                return'),(c18 + hn18).replace('return node.words_below if node else 0','return 1 if node else 0'),(c18 + hn18).replace('            if current.is_word:\n                found.append(text)\n','            if current.is_word and text != prefix:\n                found.append(text)\n'),(c18 + hn18).replace('        for visited in path:\n            visited.words_below += 1','        node.words_below += 1')],
    hints:['Each Trie node has children (dict of letter -> Trie), is_word and words_below.','add: walk down creating children; if the end node is already a word return False; else mark it and add 1 to words_below of every node on the path.','count: walk the prefix, return words_below (0 if missing). suggest: walk to the prefix node, then visit children in sorted order until you have limit words.',c18 + hn18]},
  power:{can:['Build a trie for fast prefix queries','Count and suggest words without scanning a dictionary'],
    expand:'Add a `remove(word)` command and a `longest` command that prints the longest stored word.',
    where:'Autocomplete, spell-check, search boxes and routers use tries.',
    next:'Next: making slow code fast, with real measurement.'},
  codex:{title:'Trie',body:'Prefix tree: children dict + is_word + words_below. add walks/creates nodes (return False if known; increment words_below along the path); count = node.words_below; suggest = DFS over sorted children until limit. Lower-case your input.',snip:R`node = node.children.setdefault(ch, Trie())`}
}
);
}
