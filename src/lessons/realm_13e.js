// REALM 13 — THE INTERVIEW ARENA — part E (lessons 34-51: interview patterns)
{
const s34 = R`phrase = input("Phrase: ")
chars = [ch.lower() for ch in phrase if ch.isalnum()]
left, right = 0, len(chars) - 1
result = True
while left < right:
    if chars[left] != chars[right]:
        result = False
        break
    left += 1
    right -= 1
print("Palindrome" if result else "Not a palindrome")`;
const s35 = R`size = int(input("Size: "))
target = int(input("Target: "))
numbers = [i + i // 3 for i in range(size)]
left, right = 0, size - 1
pairs = 0
while left < right:
    total = numbers[left] + numbers[right]
    if total < target:
        left += 1
    elif total > target:
        right -= 1
    else:
        pairs += 1
        left += 1
        right -= 1
print("Pairs:", pairs)`;
const s36 = R`n = int(input("Length: "))
text = "".join(chr(97 + (i * i + i // 7) % 26) for i in range(n))
last = {}
start = 0
best = 0
best_start = 0
for i, ch in enumerate(text):
    if ch in last and last[ch] >= start:
        start = last[ch] + 1
    last[ch] = i
    if i - start + 1 > best:
        best = i - start + 1
        best_start = start
print("Longest:", best)
print("Starts at:", best_start)`;
const s37 = R`size = int(input("Size: "))
k = int(input("K: "))
numbers = [(i * 7919) % 1000 - 500 for i in range(size)]
if k < 1 or k > size:
    print("Window too big")
else:
    window = sum(numbers[:k])
    best = window
    best_start = 0
    for i in range(k, size):
        window += numbers[i] - numbers[i - k]
        if window > best:
            best = window
            best_start = i - k + 1
    print("Best sum:", best)
    print("Starts at:", best_start)`;
const s38 = R`groups = {}
for word in input("Words: ").lower().split():
    groups.setdefault("".join(sorted(word)), []).append(word)
for line in sorted(" ".join(sorted(members)) for members in groups.values()):
    print(line)
print("Groups:", len(groups))`;
const s39 = R`raw = input("Intervals: ").split()
pairs = sorted((int(a), int(b)) for a, b in (p.split("-") for p in raw))
merged = []
for start, end in pairs:
    if merged and start <= merged[-1][1]:
        merged[-1][1] = max(merged[-1][1], end)
    else:
        merged.append([start, end])
print(" ".join(f"{a}-{b}" for a, b in merged) or "none")`;
const s40 = R`n = int(input("Packages: "))
days = int(input("Days: "))
weights = [(i * 37) % 50 + 1 for i in range(n)]


def days_needed(capacity):
    used, load = 1, 0
    for w in weights:
        if load + w > capacity:
            used += 1
            load = 0
        load += w
    return used


if n == 0:
    print("Capacity: 0")
else:
    low, high = max(weights), sum(weights)
    while low < high:
        mid = (low + high) // 2
        if days_needed(mid) <= days:
            high = mid
        else:
            low = mid + 1
    print("Capacity:", low)`;
const s41 = R`numbers = sorted(int(x) for x in input("Numbers: ").split())
target = int(input("Target: "))
found = []


def search(start, chosen, remaining):
    if remaining == 0:
        if chosen:
            found.append(chosen[:])
        return
    for i in range(start, len(numbers)):
        if numbers[i] > remaining:
            break
        chosen.append(numbers[i])
        search(i + 1, chosen, remaining - numbers[i])
        chosen.pop()


search(0, [], target)
for combo in found[:5]:
    print("+".join(str(n) for n in combo))
print("Combos:", len(found))`;
const s42 = R`n = int(input("N: "))


def place(row, cols, down, up):
    if row == n:
        return 1
    count = 0
    for c in range(n):
        if c in cols or row - c in down or row + c in up:
            continue
        cols.add(c)
        down.add(row - c)
        up.add(row + c)
        count += place(row + 1, cols, down, up)
        cols.remove(c)
        down.remove(row - c)
        up.remove(row + c)
    return count


print("Solutions:", place(0, set(), set(), set()))`;
const s43 = R`coins = [int(x) for x in input("Coins: ").split()]
amount = int(input("Amount: "))
INF = amount + 1
best = [0] + [INF] * amount
for total in range(1, amount + 1):
    for coin in coins:
        if coin <= total and best[total - coin] + 1 < best[total]:
            best[total] = best[total - coin] + 1
print("Fewest coins:", best[amount] if best[amount] != INF else "Impossible")`;
const s44 = R`a = input("A: ")
b = input("B: ")
previous = [0] * (len(b) + 1)
for ch in a:
    current = [0]
    for j, other in enumerate(b, 1):
        if ch == other:
            current.append(previous[j - 1] + 1)
        else:
            current.append(max(previous[j], current[j - 1]))
    previous = current
print("LCS:", previous[-1])`;
const s45 = R`n = int(input("Items: "))
capacity = int(input("Capacity: "))
weights = [(i * 7) % 23 + 1 for i in range(n)]
values = [(i * 13) % 37 + 1 for i in range(n)]
best = [0] * (capacity + 1)
for w, v in zip(weights, values):
    for c in range(capacity, w - 1, -1):
        best[c] = max(best[c], best[c - w] + v)
print("Best value:", best[capacity])`;
const s46 = R`meetings = sorted((int(b), int(a)) for a, b in (m.split("-") for m in input("Meetings: ").split()))
count = 0
free_at = -1
for end, start in meetings:
    if start >= free_at:
        count += 1
        free_at = end
print("Max meetings:", count)`;
const s47 = R`from collections import deque

tokens = input("Tree: ").split()
if not tokens or tokens[0] == "x":
    print("Depth: 0")
else:
    root = {"value": tokens[0], "left": None, "right": None}
    queue = deque([root])
    index = 1
    while queue and index < len(tokens):
        node = queue.popleft()
        for side in ("left", "right"):
            if index < len(tokens):
                token = tokens[index]
                index += 1
                if token != "x":
                    node[side] = {"value": token, "left": None, "right": None}
                    queue.append(node[side])
    level = [root]
    depth = 0
    while level:
        depth += 1
        print(f"Level {depth}:", " ".join(n["value"] for n in level))
        level = [child for n in level for child in (n["left"], n["right"]) if child]
    print("Depth:", depth)`;
const s48 = R`n = int(input("Days: "))
temps = list(range(n, 0, -1)) + [n + 5] + [(i * 37) % 101 for i in range(200)]
waits = [0] * len(temps)
stack = []
for day, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        earlier = stack.pop()
        waits[earlier] = day - earlier
    stack.append(day)
print("Checksum:", sum(waits))
print("Longest wait:", max(waits))
print("Never warmer:", waits.count(0))`;
const s49 = R`import heapq
from collections import Counter

size = int(input("Size: "))
k = int(input("K: "))
numbers = [(i * i) % 97 for i in range(size)]
counts = Counter(numbers)
for value, count in heapq.nsmallest(k, counts.items(), key=lambda pair: (-pair[1], pair[0])):
    print(f"{value}: {count}")`;
const s50 = R`import heapq

count = int(input("Count: "))
meetings = []
for i in range(count):
    start = (i * 37) % 5000
    meetings.append((start, start + 1 + (i * 11) % 90))
rooms = []
for start, end in sorted(meetings):
    if rooms and rooms[0] <= start:
        heapq.heapreplace(rooms, end)
    else:
        heapq.heappush(rooms, end)
print("Rooms:", len(rooms))`;
const s51 = R`digits = input("Digits: ").strip()
if not digits or digits[0] == "0":
    print("Ways: 0")
else:
    two_back, one_back = 1, 1
    for i in range(1, len(digits)):
        now = 0
        if digits[i] != "0":
            now += one_back
        if 10 <= int(digits[i - 1:i + 1]) <= 26:
            now += two_back
        two_back, one_back = one_back, now
    print("Ways:", one_back)`;
const e34 = R`phrase = "Never odd or even"
chars = [ch.lower() for ch in phrase if ch.isalnum()]    # clean first: lower-case, letters and digits only
print("".join(chars))
left, right = 0, len(chars) - 1          # two pointers walk inwards from both ends
while left < right:
    if chars[left] != chars[right]:
        print("not a palindrome")
        break
    left += 1
    right -= 1
else:
    print("palindrome")
# the method: restate -> examples -> edge cases ("", punctuation only, one letter) -> code -> test -> complexity`;
const e35 = R`numbers = [1, 3, 4, 6, 9, 11]            # SORTED
target = 10
left, right = 0, len(numbers) - 1
while left < right:
    total = numbers[left] + numbers[right]
    if total == target:
        print("pair", numbers[left], numbers[right])
        left += 1
        right -= 1
    elif total < target:
        left += 1                        # need a bigger sum: move the small end up
    else:
        right -= 1                       # need a smaller sum: move the big end down
# one pass, O(n), no extra memory. Brute force checks every pair: O(n squared)`;
const e36 = R`text = "abcabcbb"
last = {}                                # letter -> where we last saw it
start = 0                                # left edge of the window
best = 0
for i, ch in enumerate(text):
    if ch in last and last[ch] >= start:
        start = last[ch] + 1             # slide the left edge past the repeat
    last[ch] = i
    best = max(best, i - start + 1)      # window size = right - left + 1
print(best)                              # 3  ("abc")
# the window only ever moves RIGHT, so the whole scan is O(n)`;
const e37 = R`numbers = [2, 1, 5, 1, 3, 2]
k = 3
window = sum(numbers[:k])                # build the first window once
best = window
for i in range(k, len(numbers)):
    window += numbers[i] - numbers[i - k]    # add the newcomer, drop the leaver
    best = max(best, window)
print(best)                              # 9
# recomputing sum(numbers[i:i+k]) every time would be O(n * k)`;
const e38 = R`words = ["listen", "silent", "cat", "act"]
groups = {}
for word in words:
    key = "".join(sorted(word))          # anagrams share the same sorted letters
    groups.setdefault(key, []).append(word)
print(groups)
print(sorted(groups.values()))
# a canonical KEY turns "are these the same kind of thing?" into a dict lookup`;
const e39 = R`pairs = sorted([(8, 10), (1, 3), (2, 6)])      # sort by start first!
merged = []
for start, end in pairs:
    if merged and start <= merged[-1][1]:             # overlaps (or touches) the last block
        merged[-1][1] = max(merged[-1][1], end)       # stretch it
    else:
        merged.append([start, end])                   # a new block
print(merged)                                         # [[1, 6], [8, 10]]
# sorting costs O(n log n); the merge pass is O(n)`;
const e40 = R`weights = [3, 2, 2, 4, 1, 4]
days = 3

def days_needed(capacity):
    used, load = 1, 0
    for w in weights:
        if load + w > capacity:          # does not fit today: start a new day
            used, load = used + 1, 0
        load += w
    return used

low, high = max(weights), sum(weights)   # the answer must lie between these
while low < high:
    mid = (low + high) // 2
    if days_needed(mid) <= days:
        high = mid                       # mid works: try smaller
    else:
        low = mid + 1                    # mid is too small
print(low)                               # 6
# binary search works on ANY yes/no question that flips once: "is capacity c enough?"`;
const e41 = R`numbers = [2, 3, 5]
target = 5
found = []

def search(start, chosen, remaining):
    if remaining == 0:                   # success: record a COPY
        found.append(chosen[:])
        return
    for i in range(start, len(numbers)):
        if numbers[i] > remaining:       # prune: sorted, so nothing later fits either
            break
        chosen.append(numbers[i])        # choose
        search(i + 1, chosen, remaining - numbers[i])    # explore
        chosen.pop()                     # un-choose (backtrack)

search(0, [], target)
print(found)                             # [[2, 3], [5]]`;
const e42 = R`n = 4
def place(row, cols, down, up):
    if row == n:
        return 1                         # all rows filled: one solution
    total = 0
    for c in range(n):
        if c in cols or row - c in down or row + c in up:
            continue                     # attacked square: skip it
        cols.add(c); down.add(row - c); up.add(row + c)         # place
        total += place(row + 1, cols, down, up)                  # recurse
        cols.remove(c); down.remove(row - c); up.remove(row + c) # undo
    return total
print(place(0, set(), set(), set()))     # 2
# constraints check in O(1) with sets; dead ends are abandoned early, not fully explored`;
const e43 = R`coins = [1, 3, 4]
amount = 6
INF = amount + 1
best = [0] + [INF] * amount              # best[x] = fewest coins that make x
for total in range(1, amount + 1):
    for coin in coins:
        if coin <= total:
            best[total] = min(best[total], best[total - coin] + 1)
print(best)                              # [0, 1, 2, 1, 1, 2, 2]
print(best[amount])                      # 2  (3 + 3), greedy would pick 4+1+1 = 3 coins
# DP = solve small amounts first, build each answer from smaller ones`;
const e44 = R`a, b = "abcde", "ace"
table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
for i in range(1, len(a) + 1):
    for j in range(1, len(b) + 1):
        if a[i - 1] == b[j - 1]:
            table[i][j] = table[i - 1][j - 1] + 1               # a match extends the diagonal
        else:
            table[i][j] = max(table[i - 1][j], table[i][j - 1]) # else best of dropping one letter
print(table[-1][-1])                     # 3 ("ace")
# 2D DP: O(len(a) * len(b)) time. Only the previous row is ever needed, so memory can be one row`;
const e45 = R`items = [(1, 1), (3, 4), (4, 5), (5, 7)]       # (weight, value)
capacity = 7
best = [0] * (capacity + 1)              # best[c] = top value using capacity c
for weight, value in items:
    for c in range(capacity, weight - 1, -1):   # BACKWARDS: each item used at most once
        best[c] = max(best[c], best[c - weight] + value)
print(best[capacity])                    # 9  (items of weight 3 and 4)
# going forwards would let one item be used over and over (the unbounded version)`;
const e46 = R`meetings = [(1, 4), (3, 5), (0, 6), (5, 7), (8, 9), (5, 9)]
meetings.sort(key=lambda m: m[1])        # greedy: always finish earliest
count, free_at = 0, -1
for start, end in meetings:
    if start >= free_at:                 # fits after the last chosen one
        count += 1
        free_at = end
print(count)                             # 3
# a greedy choice is only correct when you can PROVE it. Earliest finish leaves the most room`;
const e47 = R`from collections import deque

root = {"v": 1, "l": {"v": 2, "l": None, "r": None}, "r": {"v": 3, "l": None, "r": None}}
level = [root]
depth = 0
while level:                             # one loop turn = one level of the tree
    depth += 1
    print("Level", depth, [n["v"] for n in level])
    level = [child for n in level for child in (n["l"], n["r"]) if child]
print("depth", depth)
queue = deque(["a"])                     # a queue explores nearest-first
print(queue.popleft())`;
const e48 = R`temps = [73, 74, 75, 71, 69, 72, 76, 73]
waits = [0] * len(temps)
stack = []                               # indexes of days still waiting for a warmer day
for day, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        earlier = stack.pop()
        waits[earlier] = day - earlier   # today is the warmer day they waited for
    stack.append(day)
print(waits)                             # [1, 1, 4, 2, 1, 1, 0, 0]
# every day is pushed once and popped once: O(n), not O(n squared)`;
const e49 = R`import heapq
from collections import Counter

counts = Counter([1, 1, 1, 2, 2, 3, 4, 4])
print(counts.most_common(2))
best = heapq.nsmallest(2, counts.items(), key=lambda p: (-p[1], p[0]))
print(best)                              # ties broken by value, the answer is deterministic
print(heapq.nlargest(3, [5, 1, 9, 3, 7]))
# top-k with a heap is O(n log k), cheaper than sorting everything when k is small`;
const e50 = R`import heapq

meetings = [(0, 30), (5, 10), (15, 20)]
rooms = []                               # min-heap of when each busy room frees up
for start, end in sorted(meetings):
    if rooms and rooms[0] <= start:      # the earliest-free room is free by now: reuse it
        heapq.heapreplace(rooms, end)
    else:
        heapq.heappush(rooms, end)       # all rooms busy: open a new one
print(len(rooms))                        # 2`;
const e51 = R`digits = "226"
two_back, one_back = 1, 1                # ways for the prefixes two and one letters ago
for i in range(1, len(digits)):
    now = 0
    if digits[i] != "0":                 # a single digit 1-9 is a letter
        now += one_back
    if 10 <= int(digits[i - 1:i + 1]) <= 26:     # a pair 10-26 is a letter
        now += two_back
    two_back, one_back = one_back, now
print(one_back)                          # 3  (BZ, VF, BBF)
# keep only the last two answers: O(n) time, O(1) memory`;

const T = (name, expr) => [name, expr];
const bigA = Array.from({length: 500}, (_, i) => 'abcd'[(i * i + i) % 4]).join('');
const bigB = Array.from({length: 500}, (_, i) => 'abcd'[(i * 3 + Math.floor(i / 5)) % 4]).join('');

LESSONS.push(
{
  id:'r13-34', realm:13, n:34, title:'The interview method: clarify, example, edge cases',
  teaches:['int-method'], requires:['mission13d'],
  story:`Archmage Quill meets you at the Arena gate. "Most people fail interviews in the first two minutes," Quill says, "not because they cannot code, but because they start coding before they understand. Slow down, ask, test your idea on paper."`,
  concept:{
    html:`Interviewers grade **how you think**, not just the answer. Use the same steps every time:\n\n1. **Restate** the problem in your own words. Ask about input size, duplicates, empty input, upper/lower case.\n2. **Work an example** by hand. Then a tricky one.\n3. **List edge cases**: empty, one item, all the same, negative, huge.\n4. **Brute force first.** Say it out loud and state its complexity.\n5. **Optimise**: which repeated work can a set, dict, sort or pointer remove?\n6. **Code it** in small clean functions.\n7. **Test** with your examples and edge cases. Trace one by hand.\n8. **State the complexity**: time and extra memory.\n\n**Valid palindrome** is the classic warm-up:\n- Ignore everything that is not a letter or digit, ignore case.\n- Two pointers walk in from both ends.\n- Edge cases: empty text, punctuation only, a single character, \`"0P"\` (digits count!).\n\n\`isalnum()\` keeps letters **and digits**; \`isalpha()\` would wrongly drop the 0.\n\nIf you are stuck, say what you tried. Silence is the worst answer; a clear idea with a small bug beats a perfect answer you could not explain.`,
    analogy:`A pilot's checklist: boring, and the reason planes land.`,
    example:e34},
  predict:{code:R`print("Aa".lower() == "aA".lower(), "0P".isalnum())`, q:'What prints?', opts:['True True','True False','False True'], ans:0, why:'Lower-casing makes both "aa"; "0P" is a digit plus a letter, so it is alphanumeric.'},
  cast:{code:e34, task:'Cast it.'},
  bug:{broken:R`word = "Level"
print(word == word[::-1])`, task:'"Level" reads the same backwards, but upper and lower case make the comparison fail. Ignore case. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Ignores case','".lower()" in src or ".upper()" in src']]}],
    sol:R`word = "Level"
print(word.lower() == word.lower()[::-1])`, wrong:[R`print(True)`]},
  write:{prompt:'Ask `Phrase: `. Ignoring case and every character that is not a letter or digit, is it a palindrome? Print `Palindrome` or `Not a palindrome`. Empty text (or only punctuation) counts as a palindrome.',
    starter:R`phrase = input("Phrase: ")
`,
    inputs:['A man, a plan, a canal: Panama'],
    cases:[{inputs:['A man, a plan, a canal: Panama'],tests:[['Classic',eqL(['Palindrome'])]]},{inputs:['race a car'],tests:[['Not one',eqL(['Not a palindrome'])]]},{inputs:[''],tests:[['Empty',eqL(['Palindrome'])]]},{inputs:['.,'],tests:[['Punctuation only',eqL(['Palindrome'])]]},{inputs:['ab'],tests:[['Two different',eqL(['Not a palindrome'])]]},{inputs:['Aa'],tests:[['Case ignored',eqL(['Palindrome'])]]},{inputs:['0P'],tests:[['Digits count',eqL(['Not a palindrome'])]]},{inputs:['abca'],tests:[['Looks close',eqL(['Not a palindrome'])]]}],
    sol:s34,
    wrong:[s34.replace('ch.lower()','ch'),s34.replace(' if ch.isalnum()',''),s34.replace('ch.isalnum()','ch.isalpha()'),s34.replace('while left < right:','while left < right - 1:'),R`print("Palindrome")`],
    hints:['Build chars: lower-case letters and digits only (ch.isalnum()).','Walk two pointers inwards: left from 0, right from the end.','If chars[left] != chars[right] it is not a palindrome. Stop when the pointers meet.',s34]},
  power:{can:['Follow a repeatable interview method','Handle empty, punctuation and digit edge cases'],
    expand:'Count how many characters you ignored and print it too.',
    where:'The method matters more than any single trick; it is what interviewers actually score.',
    next:'Next: the two-pointer pattern.'},
  codex:{title:'Interview method',body:'Restate, example, edge cases, brute force + its complexity, optimise, code, test, state complexity. Valid palindrome: clean with isalnum + lower, two pointers inwards. Empty counts as true. Digits are alphanumeric.',snip:R`chars = [c.lower() for c in s if c.isalnum()]`}
},
{
  id:'r13-35', realm:13, n:35, title:'Pattern: two pointers',
  teaches:['int-twopointers'], requires:['int-method'],
  story:`Two scouts start at opposite ends of a sorted line of warriors and walk toward each other. "Too weak a pair? The left scout steps up. Too strong? The right scout steps down," Quill says. "No pair is ever checked twice."`,
  concept:{
    html:`**Two pointers** on a **sorted** list: one at each end, moving inwards based on a comparison.\n\n\`\`\`\nleft, right = 0, len(numbers) - 1\nwhile left < right:\n    total = numbers[left] + numbers[right]\n    if total == target:  count it; left += 1; right -= 1\n    elif total < target: left += 1      # need more\n    else:                right -= 1     # need less\n\`\`\`\n\n- **Why it works:** if the sum is too small, the current left value cannot pair with *anything* left of right, so we discard it for good.\n- Each step discards one candidate, so the loop runs at most **n** times: **O(n)** and no extra memory.\n- Brute force (every pair) is O(n²): hopeless for 100,000 numbers.\n- The input **must be sorted** (here it is generated in increasing order). If it is not, sort first: O(n log n).\n- After a match, move **both** pointers (values are all different here).\n- Other uses: palindromes, merging sorted lists, removing duplicates in place, container problems.\n- Always use \`left < right\` so an item never pairs with itself.`,
    analogy:`Two people closing a gap from either side of a hallway.`,
    example:e35},
  predict:{code:R`numbers = [1, 4, 6, 9]
left, right = 0, 3
total = numbers[left] + numbers[right]
print(total, "move left" if total < 12 else "move right")`, q:'What prints?', opts:['10 move left','10 move right','13 move left'], ans:0, why:'1 + 9 = 10, which is below 12, so we need a bigger sum: move the left pointer up.'},
  cast:{code:e35, task:'Cast it.'},
  bug:{broken:R`numbers = [1, 3, 5, 7]
left, right = 0, len(numbers) - 1
while left < right:
    total = numbers[left] + numbers[right]
    if total < 8:
        left += 1
    elif total > 8:
        right -= 1
    else:
        print(left, right)`, task:'After finding the pair nothing moves, so the loop never ends. Stop after printing. Expected: 0 3',
    cases:[{inputs:[],tests:[['Works','lines==["0 3"]'],['Stops','"break" in src or "+= 1" in src.split("else:")[1]']]}],
    sol:R`numbers = [1, 3, 5, 7]
left, right = 0, len(numbers) - 1
while left < right:
    total = numbers[left] + numbers[right]
    if total < 8:
        left += 1
    elif total > 8:
        right -= 1
    else:
        print(left, right)
        break`, wrong:[R`print("0 3")`]},
  write:{prompt:'The sorted list is made for you: `numbers[i] = i + i // 3`. Ask `Size: ` and `Target: `. Count the pairs at different positions whose values add up to the target. Print `Pairs: <n>`. Use two pointers: it must handle 100,000 numbers.',
    starter:R`size = int(input("Size: "))
target = int(input("Target: "))
numbers = [i + i // 3 for i in range(size)]
`,
    inputs:['10','15'],
    cases:[{inputs:['10','15'],tests:[['Small',eqL(['Pairs: 2'])]]},{inputs:['10','100'],tests:[['No pairs',eqL(['Pairs: 0'])]]},{inputs:['0','5'],tests:[['Empty',eqL(['Pairs: 0'])]]},{inputs:['1','0'],tests:[['One number',eqL(['Pairs: 0'])]]},{inputs:['2','1'],tests:[['Two numbers',eqL(['Pairs: 1'])]]},{inputs:['9','12'],tests:[['Odd size',eqL(['Pairs: 2'])]]},{inputs:['12','25'],tests:[['Edge of the list',eqL(['Pairs: 1'])]]},{inputs:['100000','150000'],tests:[['Big (needs O(n))',eqL(['Pairs: 29166'])]]},{inputs:['50000','40001'],tests:[['Big, many matches',eqL(['Pairs: 10001'])]]}],
    sol:s35,
    wrong:[s35.replace('if total < target:','if total > target:').replace('elif total > target:','elif total < target:'),s35.replace('while left < right:','while left <= right:'),s35.replace('        pairs += 1\n        left += 1\n        right -= 1','        pairs += 1\n        break'),R`size = int(input("Size: "))
target = int(input("Target: "))
numbers = [i + i // 3 for i in range(size)]
pairs = 0
for i in range(size):
    for j in range(i + 1, size):
        if numbers[i] + numbers[j] == target:
            pairs += 1
print("Pairs:", pairs)`],
    hints:['Start with left = 0 and right = size - 1.','total too small -> left += 1; too big -> right -= 1; equal -> count it and move both.','Loop while left < right. Print Pairs: with the count.',s35]},
  power:{can:['Use two pointers on sorted data','Replace O(n squared) with O(n)'],
    expand:'Print the first matching pair of values as well.',
    where:'Two pointers appears in a large share of coding interviews.',
    next:'Next: the sliding window.'},
  codex:{title:'Two pointers',body:'Sorted data: left at 0, right at the end, move inwards by comparing the sum with the target (small -> left up, big -> right down). Each step discards a candidate: O(n). Use left < right. Sort first if unsorted.',snip:R`while left < right:
    total = a[left] + a[right]`}
},
{
  id:'r13-36', realm:13, n:36, title:'Pattern: the sliding window',
  teaches:['int-window'], requires:['int-twopointers'],
  story:`Quill slides a glass frame along a long banner. "Only what is inside the frame matters. When a repeated letter sneaks in, push the left edge past it. The frame only ever moves right."`,
  concept:{
    html:`A **sliding window** is a range \`[start, i]\` that you grow on the right and shrink on the left, keeping a rule true.\n\n**Longest substring without a repeated letter:**\n\n\`\`\`\nlast = {}                         # letter -> index where last seen\nstart = 0\nfor i, ch in enumerate(text):\n    if ch in last and last[ch] >= start:\n        start = last[ch] + 1      # jump past the earlier copy\n    last[ch] = i\n    size = i - start + 1\n\`\`\`\n\n- \`last[ch] >= start\` matters: a copy **outside** the window (left of \`start\`) is already forgotten, so it must not move the window backwards.\n- Window size = \`right - left + 1\`.\n- Update \`best\` only when the new size is **strictly larger** so ties report the **first** longest window.\n- Every index enters the window once and leaves once: **O(n)**.\n- Template: *expand right, fix the left until the rule holds again, record the best.*\n- Used for: longest/shortest substring problems, max sum of k items, "at most k distinct" problems.`,
    analogy:`A magnifying glass sliding over a line of text: it never goes backwards.`,
    example:e36},
  predict:{code:R`text = "abca"
last = {}
start = 0
for i, ch in enumerate(text):
    if ch in last and last[ch] >= start:
        start = last[ch] + 1
    last[ch] = i
print(start)`, q:'What prints?', opts:['1','0','3'], ans:0, why:'The second a (index 3) sees the first a at index 0 inside the window, so start becomes 1.'},
  cast:{code:e36, task:'Cast it.'},
  bug:{broken:R`text = "abba"
last = {}
start = 0
best = 0
for i, ch in enumerate(text):
    if ch in last:
        start = last[ch] + 1
    last[ch] = i
    best = max(best, i - start + 1)
print(best)`, task:'The last "a" is outside the window already, yet it drags start backwards. Only move start when the old copy is inside the window. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Guard','">= start" in src']]}],
    sol:R`text = "abba"
last = {}
start = 0
best = 0
for i, ch in enumerate(text):
    if ch in last and last[ch] >= start:
        start = last[ch] + 1
    last[ch] = i
    best = max(best, i - start + 1)
print(best)`, wrong:[R`print(2)`]},
  write:{prompt:'The text is made for you from `Length: `. Find the longest stretch with **no repeated letter**. Print `Longest: <size>` and `Starts at: <index of the FIRST longest stretch>`. For an empty text both are 0.',
    starter:R`n = int(input("Length: "))
text = "".join(chr(97 + (i * i + i // 7) % 26) for i in range(n))
`,
    inputs:['30'],
    cases:[{inputs:['30'],tests:[['Thirty letters',eqL(['Longest: 11','Starts at: 3'])]]},{inputs:['0'],tests:[['Empty',eqL(['Longest: 0','Starts at: 0'])]]},{inputs:['1'],tests:[['One letter',eqL(['Longest: 1','Starts at: 0'])]]},{inputs:['2'],tests:[['Two letters',eqL(['Longest: 2','Starts at: 0'])]]},{inputs:['5'],tests:[['Five',eqL(['Longest: 5','Starts at: 0'])]]},{inputs:['8'],tests:[['Eight',eqL(['Longest: 8','Starts at: 0'])]]},{inputs:['100'],tests:[['Hundred',eqL(['Longest: 11','Starts at: 3'])]]},{inputs:['50000'],tests:[['Long text',eqL(['Longest: 11','Starts at: 3'])]]}],
    sol:s36,
    wrong:[s36.replace('if ch in last and last[ch] >= start:','if ch in last:'),s36.replace('start = last[ch] + 1','start = last[ch]'),s36.replace('if i - start + 1 > best:','if i - start + 1 >= best:'),s36.replace('    last[ch] = i\n',''),s36.replace('best_start = start','best_start = i')],
    hints:['Track last[ch], the index where each letter was last seen, and start, the window edge.','If ch was seen at or after start, set start = last[ch] + 1.','After updating, size = i - start + 1; keep the first strictly larger one and remember its start.',s36]},
  power:{can:['Slide a variable-size window','Keep a rule true while scanning once'],
    expand:'Print the longest substring itself as well.',
    where:'Streaming data, rate limiting and text search all use sliding windows.',
    next:'Next: fixed-size windows.'},
  codex:{title:'Sliding window',body:'Grow right, move left to keep the rule. Longest unique substring: last[ch], and if last[ch] >= start then start = last[ch] + 1. size = i - start + 1. Strict > keeps the first best. O(n).',snip:R`if ch in last and last[ch] >= start:
    start = last[ch] + 1`}
},
{
  id:'r13-37', realm:13, n:37, title:'Fixed windows and running sums',
  teaches:['int-fixedwindow'], requires:['int-window'],
  story:`A glass frame exactly k banners wide slides along a long wall. "Don't recount all k banners each step," Quill says. "Add the banner that just entered, subtract the one that just left."`,
  concept:{
    html:`A **fixed-size window** of \`k\` items slides one step at a time. Keep a **running total**:\n\n\`\`\`\nwindow = sum(numbers[:k])               # first window: add k items once\nbest = window\nfor i in range(k, len(numbers)):\n    window += numbers[i] - numbers[i - k]   # newcomer in, leaver out\n    if window > best:\n        best = window\n        best_start = i - k + 1\n\`\`\`\n\n- The window ending at \`i\` starts at \`i - k + 1\`.\n- Recomputing \`sum(numbers[i-k+1:i+1])\` every step is **O(n·k)**; the running total makes it **O(n)**.\n- Validate \`k\` first: \`k < 1\` or \`k > len(numbers)\` has no window (print \`Window too big\`).\n- Use \`>\` (strict) to report the **first** best window.\n- Numbers may be **negative**, so start \`best\` with the first window, never with 0.\n- Related: prefix sums answer *any* range sum in O(1) after one O(n) pass.\n- Same idea: moving averages in charts, "busiest hour" in logs.`,
    analogy:`A bus tour counting passengers: people get on and off, you adjust the count instead of recounting the bus.`,
    example:e37},
  predict:{code:R`numbers = [2, 1, 5, 1]
k = 2
w = sum(numbers[:k])
w += numbers[2] - numbers[0]
print(w)`, q:'What prints?', opts:['6','3','8'], ans:0, why:'First window is 3 (2 + 1). Moving on: add 5, remove 2 gives 6 (1 + 5).'},
  cast:{code:e37, task:'Cast it.'},
  bug:{broken:R`numbers = [2, 1, 5, 1, 3]
k = 3
window = sum(numbers[:k])
best = window
for i in range(k, len(numbers)):
    window += numbers[i] - numbers[i - 1]
    best = max(best, window)
print(best)`, task:'The leaver is k places back, not 1. Fix the index. Expected: 9',
    cases:[{inputs:[],tests:[['Works','lines==["9"]'],['Index','"i - k" in src']]}],
    sol:R`numbers = [2, 1, 5, 1, 3]
k = 3
window = sum(numbers[:k])
best = window
for i in range(k, len(numbers)):
    window += numbers[i] - numbers[i - k]
    best = max(best, window)
print(best)`, wrong:[R`print(9)`]},
  write:{prompt:'`numbers[i] = (i * 7919) % 1000 - 500` is made for you. Ask `Size: ` and `K: `. Find the block of `K` consecutive numbers with the biggest sum. Print `Best sum: <n>` and `Starts at: <index of the FIRST best block>`. If `K` is below 1 or above `Size` print `Window too big`. It must handle 100,000 numbers with a window of 50,000.',
    starter:R`size = int(input("Size: "))
k = int(input("K: "))
numbers = [(i * 7919) % 1000 - 500 for i in range(size)]
`,
    inputs:['10','3'],
    cases:[{inputs:['10','3'],tests:[['Small',eqL(['Best sum: 1014','Starts at: 1'])]]},{inputs:['5','5'],tests:[['Whole list',eqL(['Best sum: 690','Starts at: 0'])]]},{inputs:['5','6'],tests:[['Too big',eqL(['Window too big'])]]},{inputs:['3','0'],tests:[['Zero window',eqL(['Window too big'])]]},{inputs:['1','1'],tests:[['Single negative',eqL(['Best sum: -500','Starts at: 0'])]]},{inputs:['12','4'],tests:[['Twelve, four',eqL(['Best sum: 1190','Starts at: 1'])]]},{inputs:['20','1'],tests:[['Window of one',eqL(['Best sum: 447','Starts at: 13'])]]},{inputs:['7','2'],tests:[['Seven, two',eqL(['Best sum: 757','Starts at: 1'])]]},{inputs:['100000','50000'],tests:[['Huge (needs a running total)',eqL(['Best sum: -25000','Starts at: 0'])]]}],
    sol:s37,
    wrong:[s37.replace('numbers[i - k]','numbers[i - k + 1]'),s37.replace('if window > best:','if window >= best:'),s37.replace('best = window\n    best_start = 0','best = 0\n    best_start = 0'),s37.replace('if k < 1 or k > size:','if k > size:'),s37.replace('best_start = i - k + 1','best_start = i - k')],
    hints:['Check k first: below 1 or above size means Window too big.','Add the first k numbers once. Then for each new i add numbers[i] and subtract numbers[i - k].','When the window beats best (strictly), save best and the start i - k + 1.',s37]},
  power:{can:['Slide a fixed window with a running total','Avoid recomputing sums'],
    expand:'Also print the average of the best window.',
    where:'Moving averages, throughput peaks and rate limits all work this way.',
    next:'Next: grouping with canonical keys.'},
  codex:{title:'Fixed window',body:'window = sum(first k). For i in range(k, n): window += a[i] - a[i-k]. Window ending at i starts at i-k+1. Start best from the first window (negatives!). Check k range first. O(n).',snip:R`window += numbers[i] - numbers[i - k]`}
},
{
  id:'r13-38', realm:13, n:38, title:'Pattern: canonical keys (group anagrams)',
  teaches:['int-grouping'], requires:['int-fixedwindow'],
  story:`The Arena's word-wizards swear that "listen" and "silent" are the same spell in different order. "Spell the letters in alphabetical order and they turn into the SAME word," Quill whispers. "That sorted word is a **key**, and a dict does the rest."`,
  concept:{
    html:`When items are "the same kind" if some property matches, compute a **canonical key** and group by it.\n\n\`\`\`\ngroups = {}\nfor word in words:\n    key = "".join(sorted(word))             # listen -> eilnst, silent -> eilnst\n    groups.setdefault(key, []).append(word)\n\`\`\`\n\n- \`sorted("listen")\` returns a **list** of letters; \`"".join(...)\` makes it a string key (lists cannot be dict keys; strings can).\n- \`dict.setdefault(key, [])\` creates the empty group the first time.\n- **Normalise** first (\`lower()\`) so "CAB" and "abc" match.\n- For stable output: sort each group, then sort the groups. Never rely on dict order for the answer you print.\n- Cost: sorting each word of length L is O(L log L); total O(n · L log L). Counting letters instead gives O(n · L).\n- Same pattern for: grouping files by size, users by country, duplicate detection, "words that rhyme".\n- Duplicated words stay in their group twice unless you remove them.`,
    analogy:`Sorting laundry by colour: pick the key, then drop each item in its pile.`,
    example:e38},
  predict:{code:R`print("".join(sorted("cab")), sorted("cab"))`, q:'What prints?', opts:["abc ['a', 'b', 'c']","cab ['c', 'a', 'b']","abc abc"], ans:0, why:'sorted gives a list of letters in order; join turns it into the string abc.'},
  cast:{code:e38, task:'Cast it.'},
  bug:{broken:R`groups = {}
for word in ["ab", "ba"]:
    groups[sorted(word)] = word
print(len(groups))`, task:'A list cannot be used as a dict key (TypeError). Join it into a string. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['String key','"join" in src']]}],
    sol:R`groups = {}
for word in ["ab", "ba"]:
    groups["".join(sorted(word))] = word
print(len(groups))`, wrong:[R`print(1)`]},
  write:{prompt:'Ask `Words: ` (space separated, any case; lower-case them). Group the words that are anagrams of each other. Print one group per line: the words sorted A to Z and joined by spaces, with the groups sorted alphabetically. Then print `Groups: <n>`.',
    starter:R`groups = {}
`,
    inputs:['listen silent enlist google gogole cat act tac dog'],
    cases:[{inputs:['listen silent enlist google gogole cat act tac dog'],tests:[['Several groups',eqL(['act cat tac','dog','enlist listen silent','gogole google','Groups: 4'])]]},{inputs:['a'],tests:[['One word',eqL(['a','Groups: 1'])]]},{inputs:[''],tests:[['No words',eqL(['Groups: 0'])]]},{inputs:['abc bca CAB x'],tests:[['Case ignored',eqL(['abc bca cab','x','Groups: 2'])]]}],
    sol:s38,
    wrong:[s38.replace('.lower().split()','.split()'),s38.replace('"".join(sorted(word))','word'),s38.replace('" ".join(sorted(members))','" ".join(members)').replace('input("Words: ").lower().split()','input("Words: ").lower().split()[::-1]'),s38.replace('print("Groups:", len(groups))','print("Groups:", len(lines))'),s38.replace('for line in sorted(','for line in reversed(sorted(').replace('groups.values()):','groups.values())):')],
    hints:['key = "".join(sorted(word)) is identical for anagrams.','groups.setdefault(key, []).append(word) collects the words.','Print each group as " ".join(sorted(members)) in sorted order, then the group count.',s38]},
  power:{can:['Group items by a canonical key','Produce stable, sorted output'],
    expand:'Only print groups that have at least two words.',
    where:'Deduping, clustering and indexing all start with picking the right key.',
    next:'Next: merging overlapping ranges.'},
  codex:{title:'Canonical keys',body:'Pick a key that is equal for items of the same kind (sorted letters for anagrams). groups.setdefault(key, []).append(item). Lists are unhashable: join to a string or use a tuple. Sort groups before printing for deterministic output.',snip:R`groups.setdefault("".join(sorted(word)), []).append(word)`}
},
{
  id:'r13-39', realm:13, n:39, title:'Pattern: merge intervals',
  teaches:['int-intervals'], requires:['int-grouping'],
  story:`The Arena guard roster is a mess of overlapping shifts: 1-3, 2-6, 8-10. "Sort them by start," Quill says, "then look only at the last block you built. Overlap? Stretch it. Gap? Start a new one."`,
  concept:{
    html:`**Merge overlapping intervals**, a top-5 interview question.\n\n1. **Sort by start.** This is the key insight: after sorting, an interval can only overlap the **last** merged block.\n2. For each \`(start, end)\`:\n   - if \`start <= merged[-1][1]\`: overlap (or touching), so extend: \`merged[-1][1] = max(merged[-1][1], end)\`\n   - otherwise append a new block \`[start, end]\`.\n\n\`\`\`\nmerged = []\nfor start, end in sorted(pairs):\n    if merged and start <= merged[-1][1]:\n        merged[-1][1] = max(merged[-1][1], end)\n    else:\n        merged.append([start, end])\n\`\`\`\n\n- **max** matters: \`0-9\` swallows \`2-3\` completely, so the end must not shrink.\n- Decide **touching**: does \`1-2\` and \`2-3\` become \`1-3\`? Ask the interviewer. Here: yes (\`<=\`).\n- Use **lists** \`[start, end]\` (not tuples) so you can modify the end.\n- Convert text with \`a, b = p.split("-")\` and \`int()\`. Sort **numbers**, not text ("10" < "9" as text).\n- O(n log n) for the sort, O(n) for the merge.`,
    analogy:`Merging rolled-out carpets that overlap: the combined carpet runs from the leftmost edge to the rightmost.`,
    example:e39},
  predict:{code:R`print(sorted([(8, 10), (1, 3), (2, 6)]))`, q:'What prints?', opts:['[(1, 3), (2, 6), (8, 10)]','[(8, 10), (2, 6), (1, 3)]','[(1, 3), (8, 10), (2, 6)]'], ans:0, why:'Tuples sort by their first item, so the list is ordered by start.'},
  cast:{code:e39, task:'Cast it.'},
  bug:{broken:R`merged = [[1, 9]]
start, end = 2, 3
merged[-1][1] = end
print(merged)`, task:'The new interval 2-3 is INSIDE 1-9, but its end shrinks the block. Take the bigger end. Expected: [[1, 9]]',
    cases:[{inputs:[],tests:[['Works','lines==["[[1, 9]]"]'],['max','"max(" in src']]}],
    sol:R`merged = [[1, 9]]
start, end = 2, 3
merged[-1][1] = max(merged[-1][1], end)
print(merged)`, wrong:[R`print([[1, 9]])`]},
  write:{prompt:'Ask `Intervals: ` (space separated `start-end`, whole numbers, not in order). Merge the overlapping ones; intervals that **touch** (`1-2` and `2-3`) are merged too. Print them in order as `1-6 8-10 15-18`, or `none` when there are no intervals.',
    starter:R`raw = input("Intervals: ").split()
`,
    inputs:['1-3 2-6 8-10 15-18'],
    cases:[{inputs:['1-3 2-6 8-10 15-18'],tests:[['Classic',eqL(['1-6 8-10 15-18'])]]},{inputs:['1-2 2-3'],tests:[['Touching',eqL(['1-3'])]]},{inputs:['5-6 1-10'],tests:[['Unsorted, swallowed',eqL(['1-10'])]]},{inputs:[''],tests:[['None',eqL(['none'])]]},{inputs:['4-5 1-2'],tests:[['Separate',eqL(['1-2 4-5'])]]},{inputs:['1-4 2-3 0-9 20-21 21-22'],tests:[['Many',eqL(['0-9 20-22'])]]},{inputs:['10-11 9-12 100-101 2-3'],tests:[['Numeric sort, not text',eqL(['2-3 9-12 100-101'])]]}],
    sol:s39,
    wrong:[s39.replace('start <= merged[-1][1]','start < merged[-1][1]'),s39.replace('sorted((int(a), int(b))','list((int(a), int(b))').replace('for p in raw))','for p in raw))'),s39.replace('max(merged[-1][1], end)','end'),s39.replace('or "none"','or "-"'),s39.replace('(int(a), int(b))','(a, b)')],
    hints:['Turn each text into an int pair and sort the pairs.','Keep a merged list of [start, end]. If start <= merged[-1][1], extend the end with max.','Otherwise append a new block. Print blocks as "start-end" joined by spaces.',s39]},
  power:{can:['Sort then sweep to merge ranges','Handle touching and swallowed intervals'],
    expand:'Print the total length covered by the merged intervals.',
    where:'Calendars, booking systems and range queries all merge intervals.',
    next:'Next: binary search on the answer.'},
  codex:{title:'Merge intervals',body:'Sort by start (numbers!). For each (s, e): if s <= merged[-1][1] extend with max(old end, e) else append [s, e]. Use lists to allow editing the end. Decide whether touching merges. O(n log n).',snip:R`merged[-1][1] = max(merged[-1][1], end)`}
},
{
  id:'r13-40', realm:13, n:40, title:'Pattern: binary search on the answer',
  teaches:['int-bsanswer'], requires:['int-intervals'],
  story:`The Arena must ship a pile of crates within D days, one ship, crates in order. "What is the smallest ship that works?" Quill asks. "Don't try every size. Ask: is THIS size enough? If yes try smaller, if no try bigger. That flips exactly once, and a yes/no that flips once is a binary search."`,
  concept:{
    html:`You can binary-search not just a list, but the **answer itself** whenever "is X enough?" flips from no to yes **once**.\n\n**Ship within D days:** the smallest capacity so the crates (in order) fit in D days.\n\n\`\`\`\ndef days_needed(capacity):\n    used, load = 1, 0\n    for w in weights:\n        if load + w > capacity:       # does not fit: next day\n            used += 1\n            load = 0\n        load += w\n    return used\n\nlow, high = max(weights), sum(weights)    # the answer lives between these\nwhile low < high:\n    mid = (low + high) // 2\n    if days_needed(mid) <= days:\n        high = mid                    # mid works: maybe smaller works too\n    else:\n        low = mid + 1                 # too small\n\`\`\`\n\n- **Lower bound** \`max(weights)\`: the ship must hold the heaviest crate. **Upper bound** \`sum(weights)\`: everything in one day.\n- \`high = mid\` (not \`mid - 1\`): \`mid\` might be the answer.\n- The loop ends when \`low == high\`: the smallest capacity that works.\n- Cost: **O(n log(sum))** instead of trying every capacity, **O(n · sum)**.\n- Spot the pattern: "minimise the maximum", "smallest value such that...".`,
    analogy:`Tuning a radio: too low or too high tells you which way to turn, so you home in fast.`,
    example:e40},
  predict:{code:R`low, high = 3, 10
mid = (low + high) // 2
print(mid)
low = mid + 1
print(low)`, q:'What prints?', opts:['6 then 7','6 then 6','7 then 8'], ans:0, why:'(3 + 10) // 2 is 6; moving low past it gives 7.'},
  cast:{code:e40, task:'Cast it.'},
  bug:{broken:R`low, high = 0, 100
steps = 0
while low < high:
    mid = (low + high) // 2
    if mid >= 37:
        high = mid
    else:
        low = mid
    steps += 1
    if steps > 50:
        break
print(low)`, task:'low = mid never moves forward, so the search stalls. Use mid + 1. Expected: 37',
    cases:[{inputs:[],tests:[['Works','lines==["37"]'],['Moves past mid','"low = mid + 1" in src']]}],
    sol:R`low, high = 0, 100
steps = 0
while low < high:
    mid = (low + high) // 2
    if mid >= 37:
        high = mid
    else:
        low = mid + 1
    steps += 1
    if steps > 50:
        break
print(low)`, wrong:[R`print(37)`]},
  write:{prompt:'`weights[i] = (i * 37) % 50 + 1` for `i` in `0..Packages-1` is made for you. Ask `Packages: ` and `Days: `. Crates must be shipped **in order**, one ship, at most `Days` days. Print `Capacity: <smallest ship capacity that works>` (0 when there are no packages). It must handle 20,000 packages.',
    starter:R`n = int(input("Packages: "))
days = int(input("Days: "))
weights = [(i * 37) % 50 + 1 for i in range(n)]
`,
    inputs:['10','3'],
    cases:[{inputs:['10','3'],tests:[['Ten crates',eqL(['Capacity: 108'])]]},{inputs:['0','2'],tests:[['No crates',eqL(['Capacity: 0'])]]},{inputs:['1','1'],tests:[['One crate',eqL(['Capacity: 1'])]]},{inputs:['5','2'],tests:[['Five, two days',eqL(['Capacity: 64'])]]},{inputs:['6','6'],tests:[['A day each',eqL(['Capacity: 49'])]]},{inputs:['3','1'],tests:[['One day',eqL(['Capacity: 64'])]]},{inputs:['20000','5'],tests:[['Big (binary search)',eqL(['Capacity: 102000'])]]},{inputs:['20000','20000'],tests:[['Big, a day each',eqL(['Capacity: 50'])]]},{inputs:['20000','1'],tests:[['Big, one day',eqL(['Capacity: 510000'])]]}],
    sol:s40,
    wrong:[s40.replace('if days_needed(mid) <= days:','if days_needed(mid) < days:'),s40.replace('high = mid\n','high = mid - 1\n'),s40.replace('    low, high = max(weights), sum(weights)\n    while low < high:\n        mid = (low + high) // 2\n        if days_needed(mid) <= days:\n            high = mid\n        else:\n            low = mid + 1\n','    low = max(weights)\n    while days_needed(low) > days:\n        low += 1\n'),s40.replace('used, load = 1, 0','used, load = 0, 0'),s40.replace('low, high = max(weights), sum(weights)','low, high = 1, sum(weights)').replace('days_needed(mid) <= days','days_needed(mid) <= days and mid >= 1').replace('print("Capacity:", low)','print("Capacity:", low - 1 if low == 1 else low)')],
    hints:['days_needed(capacity) walks the crates and starts a new day when the next one does not fit.','low = max(weights), high = sum(weights). While low < high look at mid.','If days_needed(mid) <= days then high = mid, else low = mid + 1. Print low.',s40]},
  power:{can:['Binary search over possible answers','Write a feasibility check'],
    expand:'Print how many days that capacity really uses.',
    where:'Capacity planning, scheduling and "minimise the maximum" questions use this pattern.',
    next:'Next: backtracking.'},
  codex:{title:'Binary search on the answer',body:'If "is x enough?" flips from no to yes once: low/high bounds, mid; works -> high = mid; fails -> low = mid + 1; stop at low == high. Write a feasibility function. O(cost of check * log range).',snip:R`if enough(mid): high = mid
else: low = mid + 1`}
},
{
  id:'r13-41', realm:13, n:41, title:'Pattern: backtracking (choose, explore, undo)',
  teaches:['int-backtrack'], requires:['int-bsanswer'],
  story:`The Arena maze has forks everywhere. "Walk down a path," Quill says. "If it works, remember it. If it dead-ends, walk back one step and try the next fork. And if a path is already hopeless, don't even start down it."`,
  concept:{
    html:`**Backtracking** explores choices recursively: **choose**, **explore**, **un-choose**.\n\n**Combination sum:** which different numbers from a list add up to the target? (each number used at most once)\n\n\`\`\`\nnumbers.sort()\nfound = []\n\ndef search(start, chosen, remaining):\n    if remaining == 0:\n        found.append(chosen[:])         # save a COPY\n        return\n    for i in range(start, len(numbers)):\n        if numbers[i] > remaining:      # PRUNE: sorted, so the rest are too big too\n            break\n        chosen.append(numbers[i])                       # choose\n        search(i + 1, chosen, remaining - numbers[i])   # explore\n        chosen.pop()                                    # un-choose\n\`\`\`\n\n- \`chosen[:]\` copies the list. Appending \`chosen\` itself would store a list you keep changing.\n- \`start\` (and \`i + 1\`) means each number is used once and combinations are not repeated in a different order.\n- **Sort first** so the answers appear in order and **pruning** works.\n- **Pruning** abandons hopeless branches early: without \`break\` a list of 20 numbers explores about a million branches.\n- The same skeleton solves subsets, permutations, N-Queens, Sudoku and word search.\n- Sizes grow fast (2ⁿ), so backtracking is for **small n** or heavy pruning.`,
    analogy:`Exploring a maze with chalk: mark a turn, walk, and if it fails rub out the mark and try the next.`,
    example:e41},
  predict:{code:R`chosen = [1]
saved = chosen[:]
chosen.append(2)
print(saved, chosen)`, q:'What prints?', opts:['[1] [1, 2]','[1, 2] [1, 2]','[1] [1]'], ans:0, why:'chosen[:] made an independent copy, so later changes do not affect saved.'},
  cast:{code:e41, task:'Cast it.'},
  bug:{broken:R`found = []
chosen = [1, 2]
found.append(chosen)
chosen.pop()
print(found)`, task:'found holds the SAME list that keeps changing. Save a copy. Expected: [[1, 2]]',
    cases:[{inputs:[],tests:[['Works','lines==["[[1, 2]]"]'],['Copy','"[:]" in src or "copy" in src or "list(" in src']]}],
    sol:R`found = []
chosen = [1, 2]
found.append(chosen[:])
chosen.pop()
print(found)`, wrong:[R`print([[1, 2]])`]},
  write:{prompt:'Ask `Numbers: ` (different positive whole numbers) and `Target: `. Find every combination of **different positions** that adds up to the target. List them in order, each as `2+3+5` (numbers ascending inside, combinations in dictionary order); print at most the first 5, then `Combos: <total found>`. It must stay fast for 1..26 with target 36 (635 combos).',
    starter:R`numbers = sorted(int(x) for x in input("Numbers: ").split())
target = int(input("Target: "))
found = []
`,
    inputs:['2 3 5 7 8 10','15'],
    cases:[{inputs:['2 3 5 7 8 10','15'],tests:[['Several',eqL(['2+3+10','2+5+8','3+5+7','5+10','7+8','Combos: 5'])]]},{inputs:['1 2 3','10'],tests:[['None',eqL(['Combos: 0'])]]},{inputs:['5','5'],tests:[['Single',eqL(['5','Combos: 1'])]]},{inputs:['3 1 2','3'],tests:[['Unsorted input',eqL(['1+2','3','Combos: 2'])]]},{inputs:['1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26','36'],tests:[['Needs pruning',eqL(['1+2+3+4+5+6+7+8','1+2+3+4+5+6+15','1+2+3+4+5+7+14','1+2+3+4+5+8+13','1+2+3+4+5+9+12','Combos: 635'])]]}],
    sol:s41,
    wrong:[s41.replace('        if numbers[i] > remaining:\n            break\n',''),s41.replace('search(i + 1, chosen','search(i, chosen'),s41.replace('found.append(chosen[:])','found.append(chosen)'),s41.replace('for combo in found[:5]:','for combo in found:'),s41.replace('numbers = sorted(int(x) for x in input("Numbers: ").split())','numbers = [int(x) for x in input("Numbers: ").split()]')],
    hints:['search(start, chosen, remaining): when remaining is 0, save a copy of chosen.','Loop i from start; break when numbers[i] > remaining (sorted, so the rest are bigger).','choose: append, explore: search(i + 1, ...), un-choose: pop().',s41]},
  power:{can:['Write a backtracking search','Prune hopeless branches'],
    expand:'Allow each number to be used any number of times (search(i, ...)).',
    where:'Puzzle solvers, configuration search and test generators use backtracking.',
    next:'Next: N-Queens.'},
  codex:{title:'Backtracking',body:'choose (append), explore (recurse with updated state), un-choose (pop). Save copies (chosen[:]). Sort and prune (break) to skip hopeless branches. start/i+1 stops reuse and reordering. Exponential: only for small n or heavy pruning.',snip:R`chosen.append(x)
search(i + 1, chosen, remaining - x)
chosen.pop()`}
},
{
  id:'r13-42', realm:13, n:42, title:'Backtracking classic: N-Queens',
  teaches:['int-nqueens'], requires:['int-backtrack'],
  story:`Eight queens must stand on a chessboard so that none can capture another. "People tried every placement and aged," Quill says. "Place one queen per row. The moment a square is attacked, skip it. Most boards die in the first few rows."`,
  concept:{
    html:`**N-Queens:** place \`n\` queens on an \`n × n\` board so no two share a row, column or diagonal. Count the ways.\n\n- Put **one queen per row**: recursion goes row by row (row 0, 1, 2 ...).\n- Remember which **columns** and **diagonals** are taken, in **sets** (O(1) check):\n  - the "down" diagonal of a square is constant for \`row - col\`\n  - the "up" diagonal is constant for \`row + col\`\n\n\`\`\`\ndef place(row, cols, down, up):\n    if row == n:\n        return 1                        # every row filled\n    total = 0\n    for c in range(n):\n        if c in cols or row - c in down or row + c in up:\n            continue                    # attacked: skip\n        cols.add(c); down.add(row - c); up.add(row + c)          # place\n        total += place(row + 1, cols, down, up)\n        cols.remove(c); down.remove(row - c); up.remove(row + c) # undo\n    return total\n\`\`\`\n\n- **Undo exactly what you placed**, otherwise later branches see ghost queens.\n- Known counts: n=4 → 2, n=5 → 10, n=6 → 4, n=8 → 92, n=10 → 724.\n- Trying all arrangements (n! permutations) is hopeless for n=10, while pruned search handles it in a blink.`,
    analogy:`Seating nervous guests: place one per row, and move on only if the new guest is not next to a rival.`,
    example:e42},
  predict:{code:R`row, c = 2, 1
print(row - c, row + c)`, q:'What prints?', opts:['1 3','3 1','2 1'], ans:0, why:'The two diagonal labels for square (row 2, col 1) are row - col = 1 and row + col = 3.'},
  cast:{code:e42, task:'Cast it.'},
  bug:{broken:R`cols = set()
cols.add(2)
cols.add(2)
cols.remove(2)
cols.remove(2)
print(len(cols))`, task:'remove raises KeyError the second time because 2 is already gone. Use a safe way to take it out once. Expected: 0',
    cases:[{inputs:[],tests:[['Works','lines==["0"]'],['Safe','"discard" in src']]}],
    sol:R`cols = set()
cols.add(2)
cols.add(2)
cols.remove(2)
cols.discard(2)
print(len(cols))`, wrong:[R`print(0)`]},
  write:{prompt:'Ask `N: ` (1 to 10). Count the ways to place N queens on an N x N board with none attacking another. Print `Solutions: <count>`. Use backtracking with sets (10 queens has 724 solutions).',
    starter:R`n = int(input("N: "))
`,
    inputs:['6'],
    cases:[{inputs:['1'],tests:[['One',eqL(['Solutions: 1'])]]},{inputs:['2'],tests:[['Two',eqL(['Solutions: 0'])]]},{inputs:['3'],tests:[['Three',eqL(['Solutions: 0'])]]},{inputs:['4'],tests:[['Four',eqL(['Solutions: 2'])]]},{inputs:['5'],tests:[['Five',eqL(['Solutions: 10'])]]},{inputs:['6'],tests:[['Six',eqL(['Solutions: 4'])]]},{inputs:['8'],tests:[['Classic eight',eqL(['Solutions: 92'])]]},{inputs:['10'],tests:[['Ten (needs pruning)',eqL(['Solutions: 724'])]]}],
    sol:s42,
    wrong:[s42.replace(' or row + c in up',''),s42.replace('row - c in down','row + c in down'),s42.replace('        up.remove(row + c)\n','        pass\n'),s42.replace('        cols.remove(c)\n','        pass\n'),R`from itertools import permutations

n = int(input("N: "))
total = 0
for perm in permutations(range(n)):
    if len({row + c for row, c in enumerate(perm)}) == n and len({row - c for row, c in enumerate(perm)}) == n:
        total += 1
print("Solutions:", total)`],
    hints:['place(row, cols, down, up) fills one row at a time; row == n means a full board: return 1.','A square is attacked if c is in cols, row - c in down or row + c in up.','Add, recurse, then remove exactly what you added. Sum the results.',s42]},
  power:{can:['Solve constraint puzzles with backtracking','Track attacked lines in sets'],
    expand:'Also print the first solution found as a list of columns.',
    where:'Scheduling, Sudoku and layout engines are constraint searches like this one.',
    next:'Next: dynamic programming.'},
  codex:{title:'N-Queens',body:'One queen per row; sets for columns, row-col diagonals and row+col diagonals; place, recurse, undo. row == n is one solution. Pruning makes n=10 instant while n! permutations is hopeless.',snip:R`if c in cols or row - c in down or row + c in up:
    continue`}
},
{
  id:'r13-43', realm:13, n:43, title:'Dynamic programming 1: coin change',
  teaches:['int-dp1'], requires:['int-nqueens'],
  story:`The Arena cashier has coins worth 1, 3 and 4 and must pay exactly 6 using the FEWEST coins. A greedy cashier grabs the 4 first, then 1 and 1: three coins. "But 3 + 3 is two," Quill smiles. "When greed fails, we solve every smaller amount first, and build up."`,
  concept:{
    html:`**Dynamic programming (DP)** = break a problem into overlapping smaller problems, solve each **once**, store the answers, and build up.\n\n**Fewest coins for an amount:** \`best[x]\` = the fewest coins that make \`x\`.\n\n\`\`\`\nINF = amount + 1                      # "impossible" marker (bigger than any answer)\nbest = [0] + [INF] * amount            # best[0] = 0 coins\nfor total in range(1, amount + 1):\n    for coin in coins:\n        if coin <= total and best[total - coin] + 1 < best[total]:\n            best[total] = best[total - coin] + 1\n\`\`\`\n\n- The answer for \`total\` is **one coin plus the best answer for what is left**: \`best[total - coin] + 1\`, and we try every coin.\n- If \`best[amount]\` is still \`INF\`, it is **impossible** (for example coins [2], amount 3).\n- **Greedy** (always take the biggest coin) is wrong for coins like 1, 3, 4.\n- Plain recursion without memory re-solves the same amounts exponentially. The table does it once: **O(amount × coins)**.\n- Steps to design any DP: **state** (what does \`best[x]\` mean?), **transition** (how to build it), **base case** (\`best[0] = 0\`), **answer** (which cell).\n- Amount 0 needs 0 coins.`,
    analogy:`Filling in a price list from small to big: each new price is a cheaper earlier price plus one more coin.`,
    example:e43},
  predict:{code:R`best = [0, 1, 2, 1]
coin = 3
print(best[3 - coin] + 1)`, q:'What prints?', opts:['1','2','0'], ans:0, why:'Paying 3 with a 3-coin leaves 0, which costs 0 coins: one coin in total.'},
  cast:{code:e43, task:'Cast it.'},
  bug:{broken:R`coins = [2]
amount = 3
best = [0] + [0] * amount
for total in range(1, amount + 1):
    for coin in coins:
        if coin <= total:
            best[total] = best[total - coin] + 1
print("Impossible" if best[amount] == 0 else best[amount])`, task:'Unreached amounts start at 0, which looks like a real answer. Start them at a big marker, so 3 with coin 2 is Impossible. Expected: Impossible',
    cases:[{inputs:[],tests:[['Works','lines==["Impossible"]'],['Marker','"INF" in src or "inf" in src or "amount + 1" in src or "999" in src']]}],
    sol:R`coins = [2]
amount = 3
INF = amount + 1
best = [0] + [INF] * amount
for total in range(1, amount + 1):
    for coin in coins:
        if coin <= total and best[total - coin] + 1 < best[total]:
            best[total] = best[total - coin] + 1
print("Impossible" if best[amount] == INF else best[amount])`, wrong:[R`print("Impossible")`]},
  write:{prompt:'Ask `Coins: ` (space separated, positive) and `Amount: `. Print `Fewest coins: <n>` for the fewest coins (any coin can be reused) that make exactly the amount, or `Fewest coins: Impossible`. Amount 0 needs 0 coins. It must handle amount 10000.',
    starter:R`coins = [int(x) for x in input("Coins: ").split()]
amount = int(input("Amount: "))
`,
    inputs:['1 3 4','6'],
    cases:[{inputs:['1 3 4','6'],tests:[['Greedy fails here',eqL(['Fewest coins: 2'])]]},{inputs:['2','3'],tests:[['Impossible',eqL(['Fewest coins: Impossible'])]]},{inputs:['1 2 5','11'],tests:[['Classic',eqL(['Fewest coins: 3'])]]},{inputs:['5 10','0'],tests:[['Zero',eqL(['Fewest coins: 0'])]]},{inputs:['5','3'],tests:[['Coin bigger than the amount',eqL(['Fewest coins: Impossible'])]]},{inputs:['3 7','11'],tests:[['Impossible again',eqL(['Fewest coins: Impossible'])]]},{inputs:['1 7 13','10000'],tests:[['Big amount',eqL(['Fewest coins: 772'])]]}],
    sol:s43,
    wrong:[R`coins = sorted((int(x) for x in input("Coins: ").split()), reverse=True)
amount = int(input("Amount: "))
count = 0
for coin in coins:
    count += amount // coin
    amount %= coin
print("Fewest coins:", count if amount == 0 else "Impossible")`,s43.replace('for total in range(1, amount + 1):','for total in range(1, amount):'),s43.replace('best[total] = best[total - coin] + 1','best[total] = best[total - coin]'),s43.replace('best = [0] + [INF] * amount','best = [0] * (amount + 1)'),s43.replace('if coin <= total and','if')],
    hints:['best[x] is the fewest coins for x. best[0] = 0 and the rest start at INF = amount + 1.','For every total and every coin that fits, try best[total - coin] + 1.','If best[amount] is still INF print Impossible.',s43]},
  power:{can:['Build a DP table bottom-up','Recognise when greedy fails'],
    expand:'Also print which coins make up the best answer (store the last coin used).',
    where:'Change-making, pricing and resource allocation use this DP.',
    next:'Next: DP on two strings, longest common subsequence.'},
  codex:{title:'DP: coin change',body:'State best[x]; base best[0]=0; others INF = amount+1; transition best[t] = min over coins of best[t-coin]+1; answer best[amount] (INF = impossible). Greedy can be wrong. O(amount * coins).',snip:R`best = [0] + [INF] * amount`}
},
{
  id:'r13-44', realm:13, n:44, title:'Dynamic programming 2: longest common subsequence',
  teaches:['int-dp2'], requires:['int-dp1'],
  story:`Two Arena scribes copied the same prophecy and each made mistakes. "How much did they agree on, in order, skipping the errors?" Quill asks. "Compare their scrolls letter against letter, in a grid."`,
  concept:{
    html:`The **longest common subsequence (LCS)** of two strings is the longest sequence of letters that appears in **both**, in order, but not necessarily next to each other. \`"abcde"\` and \`"ace"\` share \`"ace"\` (length 3).\n\nDP table: \`table[i][j]\` = LCS of the first \`i\` letters of \`a\` and first \`j\` letters of \`b\`.\n\n\`\`\`\nif a[i-1] == b[j-1]:\n    table[i][j] = table[i-1][j-1] + 1                 # a match extends the diagonal\nelse:\n    table[i][j] = max(table[i-1][j], table[i][j-1])   # drop a letter from either string\n\`\`\`\n\n- Row 0 and column 0 are all **0** (an empty string has no common letters).\n- Answer: the bottom-right cell.\n- Cost: **O(len(a) × len(b))**. Brute force over all subsequences is 2ⁿ.\n- You only need the **previous row**, so memory can be O(len(b)):\n\n\`\`\`\nprevious = [0] * (len(b) + 1)\nfor ch in a:\n    current = [0]\n    for j, other in enumerate(b, 1):\n        current.append(previous[j-1] + 1 if ch == other else max(previous[j], current[j-1]))\n    previous = current\n\`\`\`\n\n- The same grid idea solves edit distance (spell-check suggestions) and diff tools.`,
    analogy:`Laying two ribbons side by side and linking the matching beads without crossing the links.`,
    example:e44},
  predict:{code:R`a, b = "ab", "ab"
print(max(0, 1) + 1 if a[1] == b[1] else 0)`, q:'What prints?', opts:['2','1','0'], ans:0, why:'The last letters match, so we take the diagonal value (here 1) plus one: 2.'},
  cast:{code:e44, task:'Cast it.'},
  bug:{broken:R`a, b = "ab", "ab"
table = [[0] * 3 for _ in range(3)]
for i in range(1, 3):
    for j in range(1, 3):
        if a[i - 1] == b[j - 1]:
            table[i][j] = table[i][j - 1] + 1
        else:
            table[i][j] = max(table[i - 1][j], table[i][j - 1])
print(table[2][2])`, task:'A match must extend the DIAGONAL cell (i-1, j-1), not the cell on its left. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Diagonal','"table[i - 1][j - 1] + 1" in src']]}],
    sol:R`a, b = "ab", "ab"
table = [[0] * 3 for _ in range(3)]
for i in range(1, 3):
    for j in range(1, 3):
        if a[i - 1] == b[j - 1]:
            table[i][j] = table[i - 1][j - 1] + 1
        else:
            table[i][j] = max(table[i - 1][j], table[i][j - 1])
print(table[2][2])`, wrong:[R`print(2)`]},
  write:{prompt:'Ask `A: ` and `B: `. Print `LCS: <length of the longest common subsequence>`. Use a table (or two rows): the strings in the last test are 500 letters long.',
    starter:R`a = input("A: ")
b = input("B: ")
`,
    inputs:['abcde','ace'],
    cases:[{inputs:['abcde','ace'],tests:[['Classic',eqL(['LCS: 3'])]]},{inputs:['abc','def'],tests:[['Nothing shared',eqL(['LCS: 0'])]]},{inputs:['',''],tests:[['Both empty',eqL(['LCS: 0'])]]},{inputs:['abcbdab','bdcaba'],tests:[['Textbook',eqL(['LCS: 4'])]]},{inputs:['aaaa','aa'],tests:[['Repeats',eqL(['LCS: 2'])]]},{inputs:['cbaa','abbc'],tests:[['Match must use the diagonal',eqL(['LCS: 1'])]]},{inputs:[bigA,bigB],tests:[['500 letters each',eqL(['LCS: 300'])]]}],
    sol:s44,
    wrong:[s44.replace('current.append(previous[j - 1] + 1)','current.append(current[j - 1] + 1)'),s44.replace('max(previous[j], current[j - 1])','previous[j - 1]'),s44.replace('print("LCS:", previous[-1])','print("LCS:", len(set(a) & set(b)))'),s44.replace('if ch == other:','if ch != other:'),R`import sys
sys.setrecursionlimit(100000)
a = input("A: ")
b = input("B: ")
def lcs(i, j):
    if i == len(a) or j == len(b):
        return 0
    if a[i] == b[j]:
        return 1 + lcs(i + 1, j + 1)
    return max(lcs(i + 1, j), lcs(i, j + 1))
print("LCS:", lcs(0, 0))`],
    hints:['Keep a row of len(b) + 1 zeros for the previous row.','For each letter of a build a new row: a match takes previous[j - 1] + 1, otherwise the max of the cell above and the cell to the left.','The answer is the last cell of the final row.',s44]},
  power:{can:['Fill a two-dimensional DP table','Reduce memory to one row'],
    expand:'Print the ratio LCS / length of the longer string as a similarity percentage.',
    where:'Diff tools, DNA comparison and spell checkers use this table.',
    next:'Next: the knapsack problem.'},
  codex:{title:'DP: LCS',body:'table[i][j]: match -> table[i-1][j-1] + 1; else max(table[i-1][j], table[i][j-1]). Row/col 0 are 0. Answer bottom-right. O(len(a) * len(b)); keep only the previous row to save memory.',snip:R`current.append(previous[j - 1] + 1 if ch == other else max(previous[j], current[j - 1]))`}
},
{
  id:'r13-45', realm:13, n:45, title:'Dynamic programming 3: the 0/1 knapsack',
  teaches:['int-dp3'], requires:['int-dp2'],
  story:`Quill gives you a backpack that holds 7 kilos and a pile of treasures, each with a weight and a worth. "Take each item or leave it," Quill says. "Maximise the worth. A hundred items means 2 to the power of a hundred ways to choose, and a table of only a few hundred cells."`,
  concept:{
    html:`**0/1 knapsack:** each item is taken **once or not at all**. Maximise total value within a weight limit.\n\n\`best[c]\` = the highest value reachable with capacity \`c\`.\n\n\`\`\`\nbest = [0] * (capacity + 1)\nfor weight, value in items:\n    for c in range(capacity, weight - 1, -1):         # BACKWARDS\n        best[c] = max(best[c], best[c - weight] + value)\n\`\`\`\n\n- For each item, either **skip** it (\`best[c]\` stays) or **take** it (\`best[c - weight] + value\`). Keep the bigger.\n- **Loop capacity backwards** so \`best[c - weight]\` still holds the answer from **before** this item. Going forwards would let one item count several times (that is the *unbounded* knapsack).\n- The range stops at \`weight - 1\` so we never index below 0; \`range(capacity, weight - 1, -1)\` includes \`c == weight\` exactly.\n- Cost: **O(items × capacity)** time, **O(capacity)** memory.\n- Brute force tries 2ⁿ subsets.\n- Greedy by "value per kilo" is **not** always optimal for the 0/1 version.\n- Same table solves: budget allocation, "can I make exactly this sum?", cargo loading.`,
    analogy:`Packing a suitcase: for each item you decide "does it earn its space?", comparing with the best you could do without it.`,
    example:e45},
  predict:{code:R`best = [0, 0, 0, 5, 5]
weight, value = 2, 4
c = 4
print(max(best[c], best[c - weight] + value))`, q:'What prints?', opts:['5','4','9'], ans:0, why:'Skipping keeps 5; taking gives best[2] + 4 = 4. The larger is 5.'},
  cast:{code:e45, task:'Cast it.'},
  bug:{broken:R`items = [(2, 3)]
capacity = 6
best = [0] * (capacity + 1)
for weight, value in items:
    for c in range(weight, capacity + 1):
        best[c] = max(best[c], best[c - weight] + value)
print(best[capacity])`, task:'Looping forwards lets the single item be reused 3 times (answer 9). Loop backwards so it is used once. Expected: 3',
    cases:[{inputs:[],tests:[['Works','lines==["3"]'],['Backwards','"-1)" in src']]}],
    sol:R`items = [(2, 3)]
capacity = 6
best = [0] * (capacity + 1)
for weight, value in items:
    for c in range(capacity, weight - 1, -1):
        best[c] = max(best[c], best[c - weight] + value)
print(best[capacity])`, wrong:[R`print(3)`]},
  write:{prompt:'`weights[i] = (i * 7) % 23 + 1` and `values[i] = (i * 13) % 37 + 1` are made for you from `Items: `. Ask `Capacity: ` as well. Each item can be taken at most once. Print `Best value: <n>`.',
    starter:R`n = int(input("Items: "))
capacity = int(input("Capacity: "))
weights = [(i * 7) % 23 + 1 for i in range(n)]
values = [(i * 13) % 37 + 1 for i in range(n)]
`,
    inputs:['3','5'],
    cases:[{inputs:['3','5'],tests:[['Three items',eqL(['Best value: 1'])]]},{inputs:['0','10'],tests:[['No items',eqL(['Best value: 0'])]]},{inputs:['1','0'],tests:[['No room',eqL(['Best value: 0'])]]},{inputs:['20','100'],tests:[['Twenty items',eqL(['Best value: 287'])]]},{inputs:['100','500'],tests:[['A hundred items',eqL(['Best value: 1354'])]]},{inputs:['100','1000'],tests:[['Roomier',eqL(['Best value: 1831'])]]}],
    sol:s45,
    wrong:[s45.replace('for c in range(capacity, w - 1, -1):','for c in range(w, capacity + 1):'),s45.replace('range(capacity, w - 1, -1)','range(capacity, w, -1)'),s45.replace('best[c - w] + v','best[c - w] + w'),R`n = int(input("Items: "))
capacity = int(input("Capacity: "))
weights = [(i * 7) % 23 + 1 for i in range(n)]
values = [(i * 13) % 37 + 1 for i in range(n)]
order = sorted(range(n), key=lambda i: -values[i] / weights[i])
room, total = capacity, 0
for i in order:
    if weights[i] <= room:
        room -= weights[i]
        total += values[i]
print("Best value:", total)`,s45.replace('for c in range(capacity, w - 1, -1):','for c in range(capacity - 1, w - 1, -1):')],
    hints:['best[c] is the top value with capacity c, starting as all zeros.','For each item, for c from capacity DOWN to the weight: best[c] = max(best[c], best[c - weight] + value).','Print best[capacity].',s45]},
  power:{can:['Solve the 0/1 knapsack with a 1D table','Explain why the loop must run backwards'],
    expand:'Change the loop direction and watch the answer for 1 item turn into the unbounded version.',
    where:'Budgeting, cargo loading and feature prioritisation are knapsacks.',
    next:'Next: greedy algorithms.'},
  codex:{title:'DP: knapsack',body:'best[c] = top value with capacity c. For each item: for c from capacity down to weight: best[c] = max(best[c], best[c-w] + v). Backwards = use each item once. O(items * capacity). Greedy by ratio is not always optimal.',snip:R`for c in range(capacity, w - 1, -1):
    best[c] = max(best[c], best[c - w] + v)`}
},
{
  id:'r13-46', realm:13, n:46, title:'Pattern: greedy choices',
  teaches:['int-greedy'], requires:['int-dp3'],
  story:`One conference room, forty meetings. Which choice leaves the most room for others? "The one that finishes earliest," Quill says. "Take it, then take the next that fits. Sometimes a simple rule is provably the best one."`,
  concept:{
    html:`A **greedy** algorithm makes the best-looking choice at each step and never looks back. It is fast and simple, but only correct when you can argue **why** it is safe.\n\n**Activity selection:** the most meetings with no overlap in one room.\n\n\`\`\`\nmeetings.sort(key=lambda m: m[1])      # by END time\ncount, free_at = 0, -1\nfor start, end in meetings:\n    if start >= free_at:               # fits after the last chosen one\n        count += 1\n        free_at = end\n\`\`\`\n\n- **Why earliest end?** Finishing sooner never hurts: it leaves at least as much room for everything after it.\n- Sorting by **start** or by **shortest length** gives wrong answers on easy examples (one huge meeting starting first blocks everything).\n- Touching meetings (\`1-4\` then \`4-5\`) are allowed: use \`>=\`.\n- Cost: O(n log n) for the sort, O(n) for the scan.\n- **Greedy vs DP:** coins 1, 3, 4 break greedy; coins 1, 5, 10, 25 do not. When unsure, prove it or use DP.\n- Other greedy staples: jump game, fractional knapsack, Huffman coding, gas station, minimum arrows to burst balloons.`,
    analogy:`Packing a calendar: always pick the event that frees you up soonest.`,
    example:e46},
  predict:{code:R`m = [(1, 4), (3, 5), (0, 6)]
m.sort(key=lambda x: x[1])
print(m)`, q:'What prints?', opts:['[(1, 4), (3, 5), (0, 6)]','[(0, 6), (1, 4), (3, 5)]','[(3, 5), (1, 4), (0, 6)]'], ans:0, why:'Sorted by the second item (end time): 4, then 5, then 6.'},
  cast:{code:e46, task:'Cast it.'},
  bug:{broken:R`meetings = [(0, 10), (1, 2), (3, 4)]
meetings.sort()
count, free_at = 0, -1
for start, end in meetings:
    if start >= free_at:
        count += 1
        free_at = end
print(count)`, task:'Sorting by start picks the huge 0-10 meeting first and blocks the rest. Sort by END. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Sort by end','"[1]" in src']]}],
    sol:R`meetings = [(0, 10), (1, 2), (3, 4)]
meetings.sort(key=lambda m: m[1])
count, free_at = 0, -1
for start, end in meetings:
    if start >= free_at:
        count += 1
        free_at = end
print(count)`, wrong:[R`print(2)`]},
  write:{prompt:'Ask `Meetings: ` (space separated `start-end`). One room: choose the most meetings that do not overlap (a meeting may start exactly when another ends). Print `Max meetings: <n>`; no meetings gives 0.',
    starter:R`raw = input("Meetings: ").split()
`,
    inputs:['1-3 2-4 3-5'],
    cases:[{inputs:['1-3 2-4 3-5'],tests:[['Basic',eqL(['Max meetings: 2'])]]},{inputs:['1-2 1-2 1-2'],tests:[['Identical',eqL(['Max meetings: 1'])]]},{inputs:['0-10 1-2 2-3 3-4'],tests:[['A huge one blocks',eqL(['Max meetings: 3'])]]},{inputs:[''],tests:[['None',eqL(['Max meetings: 0'])]]},{inputs:['5-7'],tests:[['One',eqL(['Max meetings: 1'])]]},{inputs:['1-4 4-5 5-6 2-3'],tests:[['Touching allowed',eqL(['Max meetings: 3'])]]}],
    sol:s46,
    wrong:[s46.replace('sorted((int(b), int(a))','sorted((int(a), int(b))').replace('for end, start in meetings:','for start, end in meetings:'),s46.replace('if start >= free_at:','if start > free_at:'),s46.replace('free_at = end','free_at = start'),s46.replace('        count += 1\n','        count += 1\n        continue\n') + '\nprint("x")'],
    hints:['Turn each text into (end, start) so sorting orders by end time.','Walk the meetings; if start >= free_at take it and set free_at = end.','Print Max meetings: with the count.',s46]},
  power:{can:['Pick a provably safe greedy rule','Know when greedy fails and DP is needed'],
    expand:'Also print which meetings you chose.',
    where:'Schedulers, compression and routing algorithms use greedy rules.',
    next:'Next: trees in interviews, level by level.'},
  codex:{title:'Greedy',body:'Choose the locally best option and never revisit. Activity selection: sort by END time, take if start >= free_at. Prove the rule (exchange argument) or use DP. Sorting by start or length is wrong here.',snip:R`meetings.sort(key=lambda m: m[1])`}
},
{
  id:'r13-47', realm:13, n:47, title:'Interview trees: build and walk level by level',
  teaches:['int-trees'], requires:['int-greedy'],
  story:`The interviewer hands you a tree written as a list, row by row: 3 9 20 x x 15 7 where x means "nobody here". "Rebuild it, then read it out level by level," Quill says. "That is how real trees travel in files and APIs."`,
  concept:{
    html:`Trees often arrive as a **level-order list** with \`x\` for a missing child.\n\n\`3 9 20 x x 15 7\` means:\n\n- root \`3\`; its children are the next two tokens \`9\` and \`20\`\n- \`9\` has children \`x x\` (none); \`20\` has \`15\` and \`7\`\n\n**Build with a queue.** Take nodes in order; each non-missing node consumes the next **two** tokens as its left and right children and joins the queue.\n\n\`\`\`\nroot = {"value": tokens[0], "left": None, "right": None}\nqueue = deque([root])\nindex = 1\nwhile queue and index < len(tokens):\n    node = queue.popleft()\n    for side in ("left", "right"):\n        if index < len(tokens):\n            token = tokens[index]; index += 1\n            if token != "x":\n                node[side] = {"value": token, "left": None, "right": None}\n                queue.append(node[side])\n\`\`\`\n\n**Read level by level**: keep a list of the current level, print it, then replace it with all their existing children.\n\n\`\`\`\nlevel = [root]\nwhile level:\n    ...print values...\n    level = [c for n in level for c in (n["left"], n["right"]) if c]\n\`\`\`\n\n- The number of levels is the tree's **depth** (empty tree = 0).\n- Edge cases: empty input, a root of \`x\`, a lonely root, a lopsided tree.\n- Level-order = **BFS** with a queue; depth-first uses a stack or recursion.`,
    analogy:`Reading a family tree one generation at a time.`,
    example:e47},
  predict:{code:R`level = ["a", "b"]
kids = {"a": ["c", "d"], "b": []}
print([c for n in level for c in kids[n]])`, q:'What prints?', opts:["['c', 'd']","['a', 'b']","[['c', 'd'], []]"], ans:0, why:'The nested comprehension flattens the children of every node in the level.'},
  cast:{code:e47, task:'Cast it.'},
  bug:{broken:R`tokens = "1 x 2".split()
nodes = []
for token in tokens:
    nodes.append(token)
print(nodes)`, task:'x means "no node here", so it must not be stored as a real value. Skip it. Expected: [\'1\', \'2\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'1\', \'2\']"]'],['Skips x','"!= \\"x\\"" in src or "!= \'x\'" in src']]}],
    sol:R`tokens = "1 x 2".split()
nodes = []
for token in tokens:
    if token != "x":
        nodes.append(token)
print(nodes)`, wrong:[R`print(['1', '2'])`]},
  write:{prompt:'Ask `Tree: ` (level-order tokens, `x` = missing; may be empty). Build the tree and print each level as `Level 1: 3`, `Level 2: 9 20`, then `Depth: <levels>`. An empty tree, or one whose root is `x`, prints only `Depth: 0`.',
    starter:R`from collections import deque

tokens = input("Tree: ").split()
`,
    inputs:['3 9 20 x x 15 7'],
    cases:[{inputs:['3 9 20 x x 15 7'],tests:[['Classic',eqL(['Level 1: 3','Level 2: 9 20','Level 3: 15 7','Depth: 3'])]]},{inputs:['1'],tests:[['Lonely root',eqL(['Level 1: 1','Depth: 1'])]]},{inputs:[''],tests:[['Empty',eqL(['Depth: 0'])]]},{inputs:['x'],tests:[['Missing root',eqL(['Depth: 0'])]]},{inputs:['1 2 x 3'],tests:[['Lopsided left',eqL(['Level 1: 1','Level 2: 2','Level 3: 3','Depth: 3'])]]},{inputs:['1 x 2 x 3 x 4'],tests:[['Lopsided right',eqL(['Level 1: 1','Level 2: 2','Level 3: 3','Level 4: 4','Depth: 4'])]]},{inputs:['5 3 8 1 4 7 9 x x x x x x x 10'],tests:[['Deeper',eqL(['Level 1: 5','Level 2: 3 8','Level 3: 1 4 7 9','Level 4: 10','Depth: 4'])]]}],
    sol:s47,
    wrong:[s47.replace('                if token != "x":','                if True:'),s47.replace('("left", "right")','("right", "left")'),s47.replace('        depth += 1\n','        depth += 2\n'),s47.replace('level = [child for n in level for child in (n["left"], n["right"]) if child]','level = [child for n in level for child in (n["left"], n["right"]) if child][:1]'),s47.replace('if not tokens or tokens[0] == "x":','if not tokens:')],
    hints:['The root is tokens[0] (unless empty or "x"). Use a queue of nodes still needing children.','Each popped node takes the next two tokens as left and right; "x" means no child.','Then loop level by level: print the values, and collect the children that exist for the next level.',s47]},
  power:{can:['Rebuild a tree from a level-order list','Traverse breadth-first by levels'],
    expand:'Print the rightmost value on each level (the "right side view").',
    where:'JSON trees, DOM nodes and org charts all arrive in forms like this.',
    next:'Next: the monotonic stack.'},
  codex:{title:'Level-order trees',body:'Queue builder: each node consumes the next two tokens (x = none). Read by levels: level = [children that exist]. Depth = number of levels, empty = 0. BFS uses a queue; DFS uses a stack or recursion.',snip:R`level = [c for n in level for c in (n["left"], n["right"]) if c]`}
},
{
  id:'r13-48', realm:13, n:48, title:'Pattern: the monotonic stack',
  teaches:['int-monostack'], requires:['int-trees'],
  story:`Daily temperatures: how many days until it gets warmer? "Don't scan ahead for every day," Quill says. "Keep a stack of days still waiting. When a warm day arrives, it settles the debts of all the cooler days waiting on it."`,
  concept:{
    html:`**Next greater element**, **daily temperatures**, **stock span**: all solved with a **monotonic stack**.\n\nKeep a stack of **indexes** of days still waiting for something warmer. Their temperatures are always non-increasing from bottom to top.\n\n\`\`\`\nwaits = [0] * len(temps)\nstack = []\nfor day, temp in enumerate(temps):\n    while stack and temps[stack[-1]] < temp:     # today beats the waiting day\n        earlier = stack.pop()\n        waits[earlier] = day - earlier\n    stack.append(day)\n\`\`\`\n\n- Strictly warmer: use \`<\` (an equal temperature does **not** count).\n- Days left on the stack at the end never find a warmer day: their wait stays **0**.\n- **O(n)**: every day is pushed once and popped at most once, even though there is a nested \`while\`.\n- The naive way scans forward for each day: **O(n²)**. For a long cooling spell (50,000 days getting colder) that is over a billion steps.\n- Store **indexes**, not temperatures, so you can compute the distance.\n- Use for: next greater/smaller element, largest rectangle in a histogram, trapping rain water.`,
    analogy:`A line of people waiting for someone taller to arrive: the new arrival steps in front of all the shorter people, who then leave.`,
    example:e48},
  predict:{code:R`temps = [3, 1, 2]
stack = []
for d, t in enumerate(temps):
    while stack and temps[stack[-1]] < t:
        stack.pop()
    stack.append(d)
print(stack)`, q:'What prints?', opts:['[0, 2]','[0, 1, 2]','[2]'], ans:0, why:'Day 1 (temp 1) is popped by day 2 (temp 2); day 0 (temp 3) stays.'},
  cast:{code:e48, task:'Cast it.'},
  bug:{broken:R`temps = [70, 75]
waits = [0, 0]
stack = []
for day, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        earlier = stack.pop()
        waits[earlier] = day
    stack.append(day)
print(waits)`, task:'The wait is the DISTANCE between the days, not the later day number. Expected: [1, 0]',
    cases:[{inputs:[],tests:[['Works','lines==["[1, 0]"]'],['Distance','"day - earlier" in src']]}],
    sol:R`temps = [70, 75]
waits = [0, 0]
stack = []
for day, temp in enumerate(temps):
    while stack and temps[stack[-1]] < temp:
        earlier = stack.pop()
        waits[earlier] = day - earlier
    stack.append(day)
print(waits)`, wrong:[R`print([1, 0])`]},
  write:{prompt:'The temperatures are made for you from `Days: `. For every day find how many days until a **strictly warmer** day (0 if none). Print `Checksum: <sum of all waits>`, `Longest wait: <largest wait>` and `Never warmer: <number of days with wait 0>`. 50,000 days must finish fast.',
    starter:R`n = int(input("Days: "))
temps = list(range(n, 0, -1)) + [n + 5] + [(i * 37) % 101 for i in range(200)]
waits = [0] * len(temps)
`,
    inputs:['10'],
    cases:[{inputs:['0'],tests:[['No cooling',eqL(['Checksum: 543','Longest wait: 71','Never warmer: 5'])]]},{inputs:['5'],tests:[['Five',eqL(['Checksum: 558','Longest wait: 71','Never warmer: 5'])]]},{inputs:['10'],tests:[['Ten',eqL(['Checksum: 598','Longest wait: 71','Never warmer: 5'])]]},{inputs:['100'],tests:[['A hundred',eqL(['Checksum: 5591','Longest wait: 100','Never warmer: 6'])]]},{inputs:['50000'],tests:[['Long cooling spell (needs O(n))',eqL(['Checksum: 1250025541','Longest wait: 50000','Never warmer: 6'])]]}],
    sol:s48,
    wrong:[s48.replace('temps[stack[-1]] < temp','temps[stack[-1]] <= temp'),s48.replace('waits[earlier] = day - earlier','waits[earlier] = day'),s48.replace('print("Never warmer:", waits.count(0))','print("Never warmer:", len(stack) + 1)'),R`n = int(input("Days: "))
temps = list(range(n, 0, -1)) + [n + 5] + [(i * 37) % 101 for i in range(200)]
waits = [0] * len(temps)
for i in range(len(temps)):
    for j in range(i + 1, len(temps)):
        if temps[j] > temps[i]:
            waits[i] = j - i
            break
print("Checksum:", sum(waits))
print("Longest wait:", max(waits))
print("Never warmer:", waits.count(0))`,s48.replace('while stack and','if stack and')],
    hints:['Keep stack as a list of day indexes still waiting.','For each day, while the top day is cooler than today: pop it and set waits[earlier] = day - earlier.','Push today. Afterwards print the sum, the max and the number of zeros.',s48]},
  power:{can:['Use a monotonic stack','Explain why nested loops can still be O(n)'],
    expand:'Print the day number of the first never-warmer day.',
    where:'Stock spans, histograms and bracket parsers all use monotonic stacks.',
    next:'Next: top-k with a heap.'},
  codex:{title:'Monotonic stack',body:'Stack of indexes still waiting. For each new value: while stack top is smaller (strict <), pop it and record the distance, then push today. Leftovers stay 0. Every item pushed/popped once: O(n).',snip:R`while stack and temps[stack[-1]] < temp:
    earlier = stack.pop()`}
},
{
  id:'r13-49', realm:13, n:49, title:'Pattern: top-k with a heap',
  teaches:['int-topk'], requires:['int-monostack'],
  story:`The Arena crowd cheers for a thousand different fighters. Quill wants only the three most popular. "Counting is easy; ranking is the question. Don't sort the whole crowd: keep only the best few."`,
  concept:{
    html:`**Top-k frequent** is a favourite: count, then pick the k best.\n\n\`\`\`\nimport heapq\nfrom collections import Counter\n\ncounts = Counter(numbers)\nbest = heapq.nsmallest(k, counts.items(), key=lambda pair: (-pair[1], pair[0]))\n\`\`\`\n\n- \`Counter\` counts in O(n).\n- \`heapq.nsmallest(k, items, key=...)\` uses a heap of size k: **O(n log k)**, cheaper than sorting everything when k is small. (\`nlargest\` is the mirror.)\n- The key \`(-count, value)\` means **highest count first**, and **smallest value first** among ties. Interviewers always ask about ties: decide a rule and state it.\n- If \`k\` is bigger than the number of different values you simply get all of them.\n- Empty input gives an empty result (print nothing).\n- Alternative: \`counts.most_common(k)\`, but its tie order depends on insertion order, so add your own key when ties matter.\n- Bucket sort by count gives O(n) when you need it.\n- Generated data here: \`numbers[i] = (i * i) % 97\` (squares modulo 97 repeat in pairs).`,
    analogy:`A talent show leaderboard that only ever remembers the top few.`,
    example:e49},
  predict:{code:R`import heapq
print(heapq.nlargest(2, [5, 1, 9, 3]))`, q:'What prints?', opts:['[9, 5]','[5, 9]','[9, 3]'], ans:0, why:'nlargest returns the biggest values, biggest first.'},
  cast:{code:e49, task:'Cast it.'},
  bug:{broken:R`import heapq
counts = {"a": 3, "b": 5, "c": 1}
print(heapq.nsmallest(1, counts, key=counts.get))`, task:'nsmallest picks the LEAST frequent. We want the most frequent key. Expected: [\'b\']',
    cases:[{inputs:[],tests:[['Works','lines==["[\'b\']"]'],['Largest','"nlargest" in src or "-counts" in src or "max(" in src']]}],
    sol:R`import heapq
counts = {"a": 3, "b": 5, "c": 1}
print(heapq.nlargest(1, counts, key=counts.get))`, wrong:[R`print(['b'])`]},
  write:{prompt:'`numbers[i] = (i * i) % 97` is made for you from `Size: `. Ask `K: `. Print the `K` most frequent numbers as `<value>: <count>`, highest count first and smaller value first among ties (fewer lines if fewer distinct values).',
    starter:R`import heapq
from collections import Counter

size = int(input("Size: "))
k = int(input("K: "))
numbers = [(i * i) % 97 for i in range(size)]
`,
    inputs:['200000','5'],
    cases:[{inputs:['20','3'],tests:[['Ties by value',eqL(['0: 1','1: 1','2: 1'])]]},{inputs:['0','2'],tests:[['Empty','lines==["Size: 0","K: 2"]']]},{inputs:['200000','5'],tests:[['Big data',eqL(['6: 4124','8: 4124','11: 4124','12: 4124','18: 4124'])]]},{inputs:['10','50'],tests:[['K bigger than distinct',eqL(['0: 1','1: 1','4: 1','9: 1','16: 1','25: 1','36: 1','49: 1','64: 1','81: 1'])]]},{inputs:['97','1'],tests:[['Winner has two',eqL(['1: 2'])]]}],
    sol:s49,
    wrong:[s49.replace('key=lambda pair: (-pair[1], pair[0])','key=lambda pair: -pair[1]').replace('heapq.nsmallest(k, counts.items()','heapq.nsmallest(k, reversed(list(counts.items()))'),s49.replace('(-pair[1], pair[0])','(pair[1], pair[0])'),s49.replace('nsmallest(k,','nsmallest(k + 1,'),s49.replace('(-pair[1], pair[0])','(-pair[1], -pair[0])')],
    hints:['counts = Counter(numbers) gives value -> how often.','heapq.nsmallest(k, counts.items(), key=...) with key (-count, value) ranks the way we want.','Print each as f"{value}: {count}".',s49]},
  power:{can:['Rank with heapq.nsmallest/nlargest','Define a clear tie-break'],
    expand:'Use `counts.most_common(k)` too and find an input where its ties differ from yours.',
    where:'Trending topics, best-sellers and log analysis all rank the top k.',
    next:'Next: Mock Interview 1.'},
  codex:{title:'Top-k',body:'Counter, then heapq.nsmallest(k, counts.items(), key=lambda p: (-p[1], p[0])) = highest count first, ties by value. O(n log k). nlargest is the mirror. Always state your tie rule; most_common ties depend on insertion order.',snip:R`heapq.nsmallest(k, counts.items(), key=lambda p: (-p[1], p[0]))`}
},
{
  id:'r13-50', realm:13, n:50, title:'Mock Interview 1: Meeting Rooms',
  teaches:['mock1'], requires:['int-topk'],
  story:`A stern interviewer slides a card across the table. "Given a list of meetings, how many rooms do we need so nobody waits?" Quill whispers from the doorway: *Restate. Examples. Brute force. Then the heap.*`,
  concept:{
    html:`**The question:** meetings have a start and end. A room can be reused when a meeting ends **at or before** the next one starts. What is the minimum number of rooms?\n\n**Think out loud:**\n1. *Restate:* the rooms needed equals the largest number of meetings overlapping at one moment.\n2. *Example:* \`(0,30) (5,10) (15,20)\` needs **2** rooms.\n3. *Brute force:* for each meeting count how many others overlap: O(n²). Too slow for 30,000.\n4. *Better:* sort by start. Keep a **min-heap of end times** of the rooms in use. For each meeting:\n   - if the earliest-finishing room is free by now (\`rooms[0] <= start\`), reuse it: \`heapq.heapreplace(rooms, end)\`\n   - otherwise open a new room: \`heappush\`.\n5. The answer is the heap's size.\n\n\`\`\`\nrooms = []\nfor start, end in sorted(meetings):\n    if rooms and rooms[0] <= start:\n        heapq.heapreplace(rooms, end)\n    else:\n        heapq.heappush(rooms, end)\n\`\`\`\n\n- Back-to-back meetings (\`end == start\`) **share** a room: use \`<=\`.\n- Complexity: O(n log n) time, O(rooms) memory.\n- Edge cases: no meetings (0 rooms), one meeting, all identical.\n\nMeetings here are generated: \`start = (i * 37) % 5000\`, \`end = start + 1 + (i * 11) % 90\`.`,
    analogy:`A hotel that gives the next guest the first room to be vacated.`,
    example:e50},
  predict:{code:R`import heapq
rooms = []
heapq.heappush(rooms, 30)
heapq.heappush(rooms, 10)
print(rooms[0])`, q:'What prints?', opts:['10','30','40'], ans:0, why:'The heap keeps the smallest end time at the front.'},
  cast:{code:e50, task:'Cast it.'},
  bug:{broken:R`import heapq
rooms = [10]
start, end = 10, 20
if rooms and rooms[0] < start:
    heapq.heapreplace(rooms, end)
else:
    heapq.heappush(rooms, end)
print(len(rooms))`, task:'A meeting that starts exactly when another ends can share the room. Allow equality. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['<=','"<= start" in src']]}],
    sol:R`import heapq
rooms = [10]
start, end = 10, 20
if rooms and rooms[0] <= start:
    heapq.heapreplace(rooms, end)
else:
    heapq.heappush(rooms, end)
print(len(rooms))`, wrong:[R`print(1)`]},
  write:{prompt:'Ask `Count: `. Meeting `i` starts at `(i * 37) % 5000` and ends at `start + 1 + (i * 11) % 90` (made for you). A room is free again at the moment its meeting ends. Print `Rooms: <minimum number of rooms>`. It must handle 30,000 meetings.',
    starter:R`import heapq

count = int(input("Count: "))
meetings = []
for i in range(count):
    start = (i * 37) % 5000
    meetings.append((start, start + 1 + (i * 11) % 90))
`,
    inputs:['6'],
    cases:[{inputs:['0'],tests:[['None',eqL(['Rooms: 0'])]]},{inputs:['1'],tests:[['One',eqL(['Rooms: 1'])]]},{inputs:['2'],tests:[['Two',eqL(['Rooms: 1'])]]},{inputs:['6'],tests:[['Six',eqL(['Rooms: 2'])]]},{inputs:['200'],tests:[['Two hundred',eqL(['Rooms: 5'])]]},{inputs:['30000'],tests:[['Thirty thousand (needs a heap)',eqL(['Rooms: 290'])]]}],
    sol:s50,
    wrong:[s50.replace('rooms[0] <= start','rooms[0] < start'),s50.replace('        heapq.heapreplace(rooms, end)\n    else:\n        heapq.heappush(rooms, end)','        heapq.heappush(rooms, end)'),s50.replace('for start, end in sorted(meetings):','for start, end in sorted(meetings, key=lambda m: m[1]):'),R`import heapq

count = int(input("Count: "))
meetings = []
for i in range(count):
    start = (i * 37) % 5000
    meetings.append((start, start + 1 + (i * 11) % 90))
best = 0
for start, end in meetings:
    overlapping = sum(1 for s, e in meetings if s <= start < e)
    best = max(best, overlapping)
print("Rooms:", best)`,s50.replace('print("Rooms:", len(rooms))','print("Rooms:", len(rooms) + 1)')],
    hints:['Sort the meetings by start time. rooms is a min-heap of end times.','If rooms and rooms[0] <= start: heapq.heapreplace(rooms, end). Otherwise heappush.','The answer is len(rooms).',s50]},
  power:{can:['Solve a medium interview question end to end','Explain brute force, then optimise with a heap'],
    expand:'Record which room number each meeting got.',
    where:'This exact question is asked at many well-known companies.',
    next:'Next: Mock Interview 2, decoding messages.'},
  codex:{title:'Meeting rooms',body:'Sort by start. Min-heap of room end times. If the earliest end <= start, reuse (heapreplace) else open a room (heappush). Rooms = len(heap). Equality shares a room. O(n log n).',snip:R`if rooms and rooms[0] <= start:
    heapq.heapreplace(rooms, end)
else:
    heapq.heappush(rooms, end)`}
},
{
  id:'r13-51', realm:13, n:51, title:'Mock Interview 2: Decode Ways',
  teaches:['mock2'], requires:['mock1'],
  story:`The next interviewer smiles. "A message was encoded as A=1, B=2 ... Z=26 and written without spaces: 226. How many different messages could it be?" You take a breath. Quill taps two fingers on the table: *small cases, then a pattern.*`,
  concept:{
    html:`**The question:** \`"226"\` could be \`BZ\` (2,26), \`VF\` (22,6) or \`BBF\` (2,2,6): **3** ways. Count the ways to decode a digit string.\n\n**Think out loud:**\n1. *Small cases:* \`"12"\` → AB or L = 2. \`"10"\` → only J = 1. \`"100"\` → 0 (no letter for 00). \`"06"\` → 0 (leading zero).\n2. *Recursion idea:* the last letter is either one digit (1-9) or two digits (10-26).\n3. *Brute force recursion* re-solves the same prefixes: exponential. With 300 ones the answer has 62 digits; recursion would never finish.\n4. *DP:* \`ways[i]\` = ways to decode the first \`i\` digits.\n   - single digit \`s[i-1] != "0"\`: add \`ways[i-1]\`\n   - two digits \`10 <= int(s[i-2:i]) <= 26\`: add \`ways[i-2]\`\n5. Only the **last two** values are needed, so keep two variables.\n\n\`\`\`\ntwo_back, one_back = 1, 1\nfor i in range(1, len(digits)):\n    now = 0\n    if digits[i] != "0":\n        now += one_back\n    if 10 <= int(digits[i - 1:i + 1]) <= 26:\n        now += two_back\n    two_back, one_back = one_back, now\n\`\`\`\n\n- Check the **start** first: empty text or a leading 0 gives 0 ways.\n- Python integers never overflow, so the huge answer is exact.\n- O(n) time, O(1) memory.`,
    analogy:`Walking up stairs where you may take one or two steps, but some steps are blocked by zeros.`,
    example:e51},
  predict:{code:R`print(10 <= int("26") <= 26, 10 <= int("27") <= 26, int("06"))`, q:'What prints?', opts:['True False 6','True True 6','False False 6'], ans:0, why:'26 is a valid letter, 27 is not, and int("06") is just 6 (so a pair like "06" must be rejected by the range test).'},
  cast:{code:e51, task:'Cast it.'},
  bug:{broken:R`digits = "10"
ways = 0
if digits[1] != "0":
    ways += 1
print(ways)`, task:'"10" can be read as the single letter J (the pair 10), but the code only counts single digits. Add the pair rule: a two-digit number from 10 to 26 is a letter. Expected: 1',
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['Pair rule','"26" in src']]}],
    sol:R`digits = "10"
ways = 0
if digits[1] != "0":
    ways += 1
if 10 <= int(digits) <= 26:
    ways += 1
print(ways)`, wrong:[R`print(1)`]},
  write:{prompt:'Ask `Digits: `. Print `Ways: <number of ways to read it as letters A=1 ... Z=26>`. A leading 0, empty text, or a 0 that cannot pair (`100`, `301`) gives 0. 300 ones must finish instantly.',
    starter:R`digits = input("Digits: ").strip()
`,
    inputs:['226'],
    cases:[{inputs:['12'],tests:[['Two ways',eqL(['Ways: 2'])]]},{inputs:['226'],tests:[['Classic',eqL(['Ways: 3'])]]},{inputs:['0'],tests:[['Just zero',eqL(['Ways: 0'])]]},{inputs:['10'],tests:[['Ten',eqL(['Ways: 1'])]]},{inputs:['100'],tests:[['Hundred',eqL(['Ways: 0'])]]},{inputs:['06'],tests:[['Leading zero',eqL(['Ways: 0'])]]},{inputs:['27'],tests:[['Over 26',eqL(['Ways: 1'])]]},{inputs:['1111'],tests:[['Fibonacci-like',eqL(['Ways: 5'])]]},{inputs:['11106'],tests:[['Mixed zeros',eqL(['Ways: 2'])]]},{inputs:['301'],tests:[['Stranded zero',eqL(['Ways: 0'])]]},{inputs:['1'.repeat(300)],tests:[['300 ones (needs DP)',eqL(['Ways: 359579325206583560961765665172189099052367214309267232255589801'])]]}],
    sol:s51,
    wrong:[s51.replace('        if digits[i] != "0":\n            now += one_back\n','        now += one_back\n'),s51.replace('10 <= int(','1 <= int('),s51.replace('digits[0] == "0"','digits[0] == "9"'),s51.replace('<= 26','< 26'),R`digits = input("Digits: ").strip()
def ways(i):
    if i == len(digits):
        return 1
    if digits[i] == "0":
        return 0
    total = ways(i + 1)
    if i + 1 < len(digits) and int(digits[i:i + 2]) <= 26:
        total += ways(i + 2)
    return total
print("Ways:", ways(0))`],
    hints:['Return 0 ways for empty text or when the first digit is 0.','Keep two_back and one_back (both start at 1). For each next digit: a non-zero digit adds one_back; a pair from 10 to 26 adds two_back.','Slide the pair forward: two_back, one_back = one_back, now. Print one_back.',s51]},
  power:{can:['Count possibilities with a rolling DP','Tackle a tricky zero-handling question'],
    expand:'Add a `Show:` mode that also prints the first decoded message.',
    where:'Parsing ambiguous input is a daily reality in messaging, compilers and bioinformatics.',
    next:'Next: explaining your work, docstrings and type hints.'},
  codex:{title:'Decode ways',body:'ways[i] = (single digit 1-9 ? ways[i-1]) + (pair 10-26 ? ways[i-2]). Start: empty or leading 0 -> 0. Keep two variables: O(n) time, O(1) memory. Recursion without memory is exponential.',snip:R`two_back, one_back = one_back, now`}
}
);
}
