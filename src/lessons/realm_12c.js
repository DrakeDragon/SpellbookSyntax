// REALM 12 — THE MASTER GATE — part C (lessons 14-24: testing)
const jC = R`import unittest, io

def judge(test_class, name, impl):
    globals()[name] = impl
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(test_class)
    result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
    return result.wasSuccessful()
`;
const tC = (cls, name) => `
good_ok = judge(${cls}, "${name}", good)
print("Good version passes:", "yes" if good_ok else "no")
caught = 0
for label, impl in MUTANTS.items():
    if judge(${cls}, "${name}", impl):
        print("MISSED", label)
    else:
        caught += 1
        print("caught", label)
print(f"Caught {caught}/{len(MUTANTS)}")
`;
const unitRun = R`import unittest, io

def run_class(test_class):
    suite = unittest.defaultTestLoader.loadTestsFromTestCase(test_class)
    return unittest.TextTestRunner(stream=io.StringIO()).run(suite)
`;

// ---------- 14 clamp
const h14 = R`def good(x, lo, hi):
    return max(lo, min(x, hi))

MUTANTS = {
    "ignores low limit": lambda x, lo, hi: min(x, hi),
    "ignores high limit": lambda x, lo, hi: max(x, lo),
    "off by one at top": lambda x, lo, hi: max(lo, min(x, hi - 1)),
}
clamp = good

`;
const c14 = R`class TestClamp(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_below(self):
        self.assertEqual(clamp(-3, 0, 10), 0)

    def test_above(self):
        self.assertEqual(clamp(15, 0, 10), 10)
`;
const p14 = c => jC + '\n' + h14 + c + tC('TestClamp', 'clamp');
const eC14 = R`import unittest, io

def clamp(x, lo, hi):
    return max(lo, min(x, hi))

class TestClamp(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_above(self):
        self.assertEqual(clamp(15, 0, 10), 10)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestClamp)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print("Ran:", result.testsRun)
print("OK:", result.wasSuccessful())`;
const out14 = '["Good version passes: yes","caught ignores low limit","caught ignores high limit","caught off by one at top","Caught 3/3"]';

// ---------- 15 parse_age
const h15 = R`def good(text):
    value = int(text)
    if value < 0 or value > 150:
        raise ValueError("age out of range")
    return value

def no_negative_check(text):
    value = int(text)
    if value > 150:
        raise ValueError("age out of range")
    return value

def no_upper_check(text):
    value = int(text)
    if value < 0:
        raise ValueError("age out of range")
    return value

def returns_text(text):
    good(text)
    return text

def wrong_error(text):
    if not text.lstrip("-").isdigit():
        raise TypeError("not a number")
    return good(text)

MUTANTS = {
    "accepts negatives": no_negative_check,
    "no upper limit": no_upper_check,
    "returns text": returns_text,
    "wrong exception type": wrong_error,
}
parse_age = good

`;
const c15 = R`class TestParseAge(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(parse_age("42"), 42)
        self.assertEqual(parse_age("0"), 0)

    def test_not_a_number(self):
        with self.assertRaises(ValueError):
            parse_age("abc")

    def test_negative(self):
        with self.assertRaises(ValueError):
            parse_age("-5")

    def test_too_old(self):
        with self.assertRaises(ValueError):
            parse_age("200")
`;
const p15 = c => jC + '\n' + h15 + c + tC('TestParseAge', 'parse_age');
const eC15 = R`import unittest

class T(unittest.TestCase):
    def test_float(self):
        self.assertAlmostEqual(0.1 + 0.2, 0.3)       # fine: compares to 7 decimal places

    def test_error(self):
        with self.assertRaises(ZeroDivisionError):
            1 / 0

    def test_membership(self):
        self.assertIn("a", "cat")
        self.assertTrue(len("cat") == 3)
        self.assertIsNone(None)

import io
suite = unittest.defaultTestLoader.loadTestsFromTestCase(T)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(result.testsRun, result.wasSuccessful())`;
const out15 = '["Good version passes: yes","caught accepts negatives","caught no upper limit","caught returns text","caught wrong exception type","Caught 4/4"]';

// ---------- 16 Inventory setUp
const h16 = R`class Inventory:
    def __init__(self):
        self.items = {}

    def add(self, name, qty=1):
        self.items[name] = self.items.get(name, 0) + qty

    def remove(self, name, qty=1):
        if self.items.get(name, 0) < qty:
            raise ValueError("not enough " + name)
        self.items[name] -= qty

    def count(self, name):
        return self.items.get(name, 0)

class SharedStock(Inventory):
    items = {}
    def __init__(self):
        pass

class RemoveAll(Inventory):
    def remove(self, name, qty=1):
        if self.items.get(name, 0) < qty:
            raise ValueError("not enough " + name)
        self.items[name] = 0

class OverRemove(Inventory):
    def remove(self, name, qty=1):
        self.items[name] = self.items.get(name, 0) - qty

class AddOverwrites(Inventory):
    def add(self, name, qty=1):
        self.items[name] = qty

good = Inventory
MUTANTS = {
    "stock shared between inventories": SharedStock,
    "remove empties the item": RemoveAll,
    "can remove too many": OverRemove,
    "add overwrites": AddOverwrites,
}

`;
const c16 = R`class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()

    def test_add_accumulates(self):
        self.inv.add("potion", 2)
        self.inv.add("potion", 3)
        self.assertEqual(self.inv.count("potion"), 5)

    def test_remove(self):
        self.inv.add("potion", 5)
        self.inv.remove("potion", 2)
        self.assertEqual(self.inv.count("potion"), 3)

    def test_remove_too_many(self):
        self.inv.add("potion", 1)
        with self.assertRaises(ValueError):
            self.inv.remove("potion", 2)

    def test_starts_empty(self):
        self.assertEqual(self.inv.count("potion"), 0)
`;
const p16 = c => jC + '\n' + h16 + c + tC('TestInventory', 'Inventory');
const eC16 = R`import unittest, io

calls = []
class T(unittest.TestCase):
    def setUp(self):
        calls.append("set")
    def tearDown(self):
        calls.append("tear")
    def test_b(self):
        calls.append("b")
    def test_a(self):
        calls.append("a")

suite = unittest.defaultTestLoader.loadTestsFromTestCase(T)
unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(calls)`;
const out16 = '["Good version passes: yes","caught stock shared between inventories","caught remove empties the item","caught can remove too many","caught add overwrites","Caught 4/4"]';

// ---------- 17 grade boundaries
const h17 = R`def build(a=90, b=80, c=70, min_score=0, max_score=100):
    def grade(score):
        if score < min_score or score > max_score:
            raise ValueError("score out of range")
        if score >= a:
            return "A"
        if score >= b:
            return "B"
        if score >= c:
            return "C"
        return "F"
    return grade

good = build()
MUTANTS = {
    "A starts at 91": build(a=91),
    "A starts at 89": build(a=89),
    "B starts at 81": build(b=81),
    "B starts at 79": build(b=79),
    "C starts at 71": build(c=71),
    "C starts at 69": build(c=69),
    "accepts 101": build(max_score=101),
    "accepts -1": build(min_score=-1),
    "rejects 100": build(max_score=99),
    "rejects 0": build(min_score=1),
}
grade = good

`;
const c17 = R`class TestGrade(unittest.TestCase):
    def test_boundaries(self):
        table = {100: "A", 90: "A", 89: "B", 80: "B", 79: "C", 70: "C", 69: "F", 0: "F"}
        for score, expected in table.items():
            self.assertEqual(grade(score), expected)

    def test_out_of_range(self):
        for bad in (-1, 101):
            with self.assertRaises(ValueError):
                grade(bad)
`;
const p17 = c => jC + '\n' + h17 + c + tC('TestGrade', 'grade');
const eC17 = R`def band(score):
    return "A" if score > 90 else "B"      # bug: should be >= 90

for s in (89, 90, 91, 95):
    print(s, band(s))
# Typical values (95) hide the bug. The boundary (90) exposes it.`;
const out17 = '["Good version passes: yes","caught A starts at 91","caught A starts at 89","caught B starts at 81","caught B starts at 79","caught C starts at 71","caught C starts at 69","caught accepts 101","caught accepts -1","caught rejects 100","caught rejects 0","Caught 10/10"]';

// ---------- 18 TDD slugify
const s18 = R`import re, unittest, io

class TestSlugify(unittest.TestCase):
    def test_words(self):
        self.assertEqual(slugify("Hello World"), "hello-world")

    def test_trim(self):
        self.assertEqual(slugify("  Trim me  "), "trim-me")

    def test_punctuation(self):
        self.assertEqual(slugify("Rock & Roll"), "rock-roll")

    def test_empty(self):
        self.assertEqual(slugify(""), "")

`;
const t18 = R`
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestSlugify)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(f"Tests: {result.testsRun}, failures: {len(result.failures)}, errors: {len(result.errors)}")
print("Result:", "PASS" if result.wasSuccessful() else "FAIL")
`;
const f18 = R`def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
`;
const eC18 = R`import re

def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

print(slugify("Hello World"))
print(slugify("  Trim me  "))
print(slugify("Rock & Roll!!"))
print(repr(slugify("")))`;

// ---------- 19 dependency injection
const s19 = R`def make_fake(temp_text):
    def fake_fetch(city):
        if temp_text == "down":
            raise ConnectionError("offline")
        return float(temp_text)
    return fake_fetch

`;
const m19 = R`
city = input("City: ")
temp_text = input("Temp: ")
print(weather_note(make_fake(temp_text), city))
`;
const f19 = R`def weather_note(fetch_temp, city):
    try:
        temp = fetch_temp(city)
    except ConnectionError:
        return f"{city}: unavailable"
    if temp >= 30:
        note = "hot"
    elif temp <= 5:
        note = "cold"
    else:
        note = "mild"
    return f"{city}: {note}"
`;
const eC19 = R`def greet(get_name):
    return "Hi " + get_name()

print(greet(lambda: "Ada"))            # a fake name source
print(greet(lambda: "Bob"))

calls = []
def spy(city):
    calls.append(city)
    return 21.5

def report(fetch, city):
    return f"{city}: {fetch(city)}"

print(report(spy, "Oslo"), calls)`;

// ---------- 20 mock
const s20 = R`from unittest.mock import Mock

`;
const m20 = R`
users = []
for item in input("Users: ").split():
    name, _, flag = item.partition(":")
    users.append({"name": name, "active": flag == "1"})
send = Mock()
sent = notify_all(users, send)
print("Sent:", sent)
for call in send.call_args_list:
    print(*call.args)
print("Calls:", send.call_count)
`;
const f20 = R`def notify_all(users, send):
    sent = 0
    for user in users:
        if user["active"]:
            send(user["name"] + "@guild.test", f"Hello {user['name']}!")
            sent += 1
    return sent
`;
const eC20 = R`from unittest.mock import Mock

send = Mock(return_value="queued")
print(send("ann@x.test", "Hi"))
send("bob@x.test", "Yo")
print(send.call_count)
print(send.call_args_list[0].args)
send.assert_any_call("bob@x.test", "Yo")
print(send.mock_calls[-1])`;

// ---------- 21 doctest
const m21 = R`
import doctest
finder = doctest.DocTestFinder()
runner = doctest.DocTestRunner(verbose=False)
for test in finder.find(average, "average", module=False, globs={"average": average}):
    runner.run(test, out=lambda text: None)
print("Examples:", runner.tries)
print("Failed:", runner.failures)
`;
const f21 = R`def average(numbers):
    """Return the mean rounded to 2 places.

    >>> average([1, 2, 3])
    2.0
    >>> average([1, 2])
    1.5
    >>> average([10, 20, 25])
    18.33
    >>> average([])
    Traceback (most recent call last):
        ...
    ValueError: empty list
    """
    if not numbers:
        raise ValueError("empty list")
    return round(sum(numbers) / len(numbers), 2)
`;
const eC21 = f21 + m21;

// ---------- 22 subTest
const s22 = R`import unittest, io

def buggy(year):
    return year % 4 == 0 and year % 100 != 0

def fixed(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)

CASES = [(2024, True), (2023, False), (1900, False), (2000, True), (2100, False), (1600, True)]
is_leap = buggy if input("Version: ").strip() == "buggy" else fixed

`;
const m22 = R`
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestLeap)
result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print("Cases:", len(CASES))
print("Failing cases:", len(result.failures))
`;
const c22 = R`class TestLeap(unittest.TestCase):
    def test_table(self):
        for year, expected in CASES:
            with self.subTest(year=year):
                self.assertEqual(is_leap(year), expected)
`;
const eC22 = R`import unittest, io

class T(unittest.TestCase):
    def test_x(self):
        for n in (1, 2, 3):
            with self.subTest(n=n):
                self.assertLess(n, 2)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, len(result.failures))
for test, trace in result.failures:
    print(test)`;

// ---------- 23 Account
const h23 = R`class Account:
    def __init__(self, balance=0):
        if balance < 0:
            raise ValueError("negative start")
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("bad amount")
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("bad amount")
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

class Overdraft(Account):
    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("bad amount")
        self.balance -= amount
        return self.balance

class ZeroDeposit(Account):
    def deposit(self, amount):
        if amount < 0:
            raise ValueError("bad amount")
        self.balance += amount
        return self.balance

class KeepsBalance(Account):
    def withdraw(self, amount):
        super().withdraw(amount)
        return self.balance + amount

class NoEmptying(Account):
    def withdraw(self, amount):
        if amount >= self.balance:
            raise ValueError("insufficient funds")
        return super().withdraw(amount)

class NegativeStart(Account):
    def __init__(self, balance=0):
        self.balance = balance

good = Account
MUTANTS = {
    "overdraft allowed": Overdraft,
    "zero deposit allowed": ZeroDeposit,
    "withdraw returns wrong balance": KeepsBalance,
    "cannot withdraw the full balance": NoEmptying,
    "negative opening balance allowed": NegativeStart,
}

`;
const c23 = R`class TestAccount(unittest.TestCase):
    def setUp(self):
        self.acct = Account(100)

    def test_deposit(self):
        self.assertEqual(self.acct.deposit(50), 150)
        self.assertEqual(self.acct.balance, 150)

    def test_deposit_zero(self):
        with self.assertRaises(ValueError):
            self.acct.deposit(0)

    def test_withdraw(self):
        self.assertEqual(self.acct.withdraw(30), 70)
        self.assertEqual(self.acct.balance, 70)

    def test_withdraw_everything(self):
        self.acct.withdraw(100)
        self.assertEqual(self.acct.balance, 0)

    def test_overdraft(self):
        with self.assertRaises(ValueError):
            self.acct.withdraw(101)

    def test_negative_start(self):
        with self.assertRaises(ValueError):
            Account(-1)
`;
const p23 = c => jC + '\n' + h23 + c + tC('TestAccount', 'Account');
const eC23 = R`import unittest, io

class Counter:
    def __init__(self):
        self.n = 0
    def hit(self):
        self.n += 1

class T(unittest.TestCase):
    def test_new_counter_is_zero(self):
        self.assertEqual(Counter().n, 0)

    def test_hit_twice(self):
        c = Counter()
        c.hit()
        c.hit()
        self.assertEqual(c.n, 2)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, result.wasSuccessful())`;
const out23 = '["Good version passes: yes","caught overdraft allowed","caught zero deposit allowed","caught withdraw returns wrong balance","caught cannot withdraw the full balance","caught negative opening balance allowed","Caught 5/5"]';

// ---------- 24 mission Cart
const h24 = R`class Cart:
    def __init__(self):
        self.lines = {}

    def add(self, name, price, qty=1):
        if price < 0 or qty < 1:
            raise ValueError("bad item")
        old_price, old_qty = self.lines.get(name, (price, 0))
        self.lines[name] = (price, old_qty + qty)

    def remove(self, name):
        if name not in self.lines:
            raise KeyError(name)
        del self.lines[name]

    def count(self):
        return sum(qty for _, qty in self.lines.values())

    def total(self, coupon=None):
        subtotal = sum(price * qty for price, qty in self.lines.values())
        if coupon == "SAVE10":
            subtotal *= 0.9
        return round(subtotal, 2)

class AddOverwrites(Cart):
    def add(self, name, price, qty=1):
        if price < 0 or qty < 1:
            raise ValueError("bad item")
        self.lines[name] = (price, qty)

class NegativePrice(Cart):
    def add(self, name, price, qty=1):
        if qty < 1:
            raise ValueError("bad item")
        super().add(name, abs(price), qty)
        self.lines[name] = (price, self.lines[name][1])

class ZeroQty(Cart):
    def add(self, name, price, qty=1):
        if price < 0 or qty < 0:
            raise ValueError("bad item")
        if qty:
            super().add(name, price, qty)

class BigCoupon(Cart):
    def total(self, coupon=None):
        subtotal = sum(price * qty for price, qty in self.lines.values())
        if coupon == "SAVE10":
            subtotal *= 0.8
        return round(subtotal, 2)

class SilentRemove(Cart):
    def remove(self, name):
        self.lines.pop(name, None)

class NoRounding(Cart):
    def total(self, coupon=None):
        subtotal = sum(price * qty for price, qty in self.lines.values())
        if coupon == "SAVE10":
            subtotal *= 0.9
        return subtotal

class CountsLines(Cart):
    def count(self):
        return len(self.lines)

good = Cart
MUTANTS = {
    "add overwrites quantity": AddOverwrites,
    "negative price allowed": NegativePrice,
    "zero quantity allowed": ZeroQty,
    "coupon takes 20%": BigCoupon,
    "removing a missing item is silent": SilentRemove,
    "total is not rounded": NoRounding,
    "count counts lines not units": CountsLines,
}

`;
const c24 = R`class TestCart(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()

    def test_add_accumulates(self):
        self.cart.add("potion", 5.0, 2)
        self.cart.add("potion", 5.0, 3)
        self.assertEqual(self.cart.count(), 5)
        self.assertEqual(self.cart.total(), 25.0)

    def test_count_units(self):
        self.cart.add("potion", 5.0, 2)
        self.cart.add("scroll", 2.0, 3)
        self.assertEqual(self.cart.count(), 5)

    def test_negative_price(self):
        with self.assertRaises(ValueError):
            self.cart.add("potion", -1.0)

    def test_zero_quantity(self):
        with self.assertRaises(ValueError):
            self.cart.add("potion", 1.0, 0)

    def test_coupon(self):
        self.cart.add("potion", 10.0, 2)
        self.assertEqual(self.cart.total("SAVE10"), 18.0)
        self.assertEqual(self.cart.total(), 20.0)

    def test_remove(self):
        self.cart.add("potion", 10.0)
        self.cart.remove("potion")
        self.assertEqual(self.cart.count(), 0)
        with self.assertRaises(KeyError):
            self.cart.remove("potion")

    def test_rounding(self):
        self.cart.add("candy", 0.1, 3)
        self.assertEqual(self.cart.total(), 0.3)
`;
const p24 = c => jC + '\n' + h24 + c + tC('TestCart', 'Cart');
const out24 = '["Good version passes: yes","caught add overwrites quantity","caught negative price allowed","caught zero quantity allowed","caught coupon takes 20%","caught removing a missing item is silent","caught total is not rounded","caught count counts lines not units","Caught 7/7"]';
const eC24 = R`import unittest, io

def good(x):
    return x * 2

equivalent = lambda x: x + x          # behaves identically: no test can ever catch it
broken = lambda x: x * 3

print(all(good(n) == equivalent(n) for n in range(5)))
print(all(good(n) == broken(n) for n in range(5)))
print([n for n in range(5) if good(n) != broken(n)])`;

LESSONS.push(
{
  id:'r12-14', realm:12, n:14, title:'unittest: tests that guard your code',
  teaches:['ut-basic'], requires:['mission12b'],
  story:`"Code you can't test is code you can't trust," says Orrin, leading you into the **Proving Hall**. Rows of dummy monsters wait, each one a subtly broken spell. "A good test is a trap. Set it well and a broken spell cannot slip past."`,
  concept:{
    html:`**Unit tests** are small programs that check your code and shout when it breaks. Python includes \`unittest\`.\n\n\`\`\`\nimport unittest\n\nclass TestClamp(unittest.TestCase):\n    def test_inside(self):                 # must start with test_\n        self.assertEqual(clamp(5, 0, 10), 5)\n\n    def test_above(self):\n        self.assertEqual(clamp(15, 0, 10), 10)\n\`\`\`\n\n- A test class extends \`unittest.TestCase\`. Each method named **\`test_...\`** is one test. Methods without that prefix are **never run**.\n- \`assertEqual(actual, expected)\` passes if they match, otherwise the test **fails**. If the test crashes, it is an **error**.\n- Running them: \`unittest.main()\` in a script, or \`python -m unittest\`. In this Spellbook the runner is below the class.\n- A suite is only as good as the bugs it catches. This realm's **Proving Hall** secretly swaps your function for **broken copies** (mutants). A strong test class must **catch every mutant** and still pass the correct version.\n\nYour job: write tests that *fail when the code is wrong*.`,
    analogy:`A smoke alarm: useless if it only rings when there is no fire.`,
    example:eC14},
  predict:{code:R`import unittest
class T(unittest.TestCase):
    def test_a(self):
        self.assertEqual(2 * 2, 4)
    def helper(self):
        pass
print(unittest.defaultTestLoader.getTestCaseNames(T))`, q:'What prints?', opts:["['test_a']","['helper', 'test_a']","[]"], ans:0, why:'Only methods starting with test are collected.'},
  cast:{code:eC14, task:'Cast it.'},
  bug:{broken:R`import unittest, io

class T(unittest.TestCase):
    def check_add(self):
        self.assertEqual(1 + 1, 2)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, result.wasSuccessful())`, task:'It says 0 tests ran and "passes"! The method name is wrong, so it never runs. Fix it. Expected: 1 True',
    cases:[{inputs:[],tests:[['Runs','lines==["1 True"]'],['Named right','"def test_" in src']]}],
    sol:R`import unittest, io

class T(unittest.TestCase):
    def test_add(self):
        self.assertEqual(1 + 1, 2)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, result.wasSuccessful())`, wrong:[R`print("1 True")`]},
  write:{prompt:'Fill in `class TestClamp(unittest.TestCase)` so that it passes the correct `clamp` but **catches all 3 broken versions**. Write at least one test for a value below the range, inside it and above it.',
    starter:p14(R`class TestClamp(unittest.TestCase):
    pass
`),
    inputs:[],
    cases:[{inputs:[],tests:[['All caught','lines[-5:]=='+out14],['Class exists','"class TestClamp" in src and "def test_" in src']]}],
    sol:p14(c14),
    wrong:[p14(R`class TestClamp(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)
`),p14(R`class TestClamp(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_below(self):
        self.assertEqual(clamp(-3, 0, 10), 0)
`),p14(R`class TestClamp(unittest.TestCase):
    def test_inside(self):
        self.assertEqual(clamp(5, 0, 10), 5)

    def test_above(self):
        self.assertEqual(clamp(15, 0, 10), 10)
`)],
    hints:['Each test is a method starting with test_. Use self.assertEqual(clamp(...), expected).','Three situations matter: value below lo (expect lo), inside (expect itself), above hi (expect hi).','A mutant is caught only when some test fails for it. "Off by one at top" is only caught by a value above the range.',p14(c14)]},
  power:{can:['Write unittest test classes','Judge a test suite by the bugs it catches, not by how many tests it has'],
    expand:'Add tests for clamp(10, 0, 10) and clamp(0, 0, 10), the exact edges.',
    where:'Every professional codebase has an automated test suite that runs before each release.',
    next:'Next: more assertions: raises, almost-equal, membership.'},
  codex:{title:'unittest',body:'class TestX(unittest.TestCase) with test_ methods; assertEqual(actual, expected). Failure = wrong result, error = crash. Methods not starting with test_ never run. Good tests fail when the code is wrong.',snip:R`class TestClamp(unittest.TestCase):
    def test_above(self):
        self.assertEqual(clamp(15, 0, 10), 10)`}
},
{
  id:'r12-15', realm:12, n:15, title:'The assert toolbox: raises and friends',
  teaches:['ut-assert'], requires:['ut-basic'],
  story:`"Testing that the right answer comes out is half the job," Orrin says. "The other half is making sure **bad input is refused loudly**, with the right kind of alarm."`,
  concept:{
    html:`\`assertEqual\` is one of many. Pick the one that tells the clearest story:\n\n| Assertion | Checks |\n|---|---|\n| \`assertEqual(a, b)\` / \`assertNotEqual\` | \`a == b\` |\n| \`assertTrue(x)\` / \`assertFalse(x)\` | truthiness |\n| \`assertIs(a, b)\` / \`assertIsNone(x)\` | identity |\n| \`assertIn(a, b)\` / \`assertNotIn\` | membership |\n| \`assertAlmostEqual(a, b, places=7)\` | floats, close enough |\n| \`assertGreater / assertLess\` | ordering |\n| \`assertIsInstance(x, T)\` | type |\n| \`assertRaises(Err)\` | an exception **is** raised |\n\n\`\`\`\nwith self.assertRaises(ValueError):\n    parse_age("abc")\n\`\`\`\n\n- Use the **specific** exception. \`assertRaises(Exception)\` also passes for *wrong* errors (a \`TypeError\` where you wanted \`ValueError\`), which hides bugs.\n- Never compare floats with \`assertEqual\` when rounding error is possible: \`0.1 + 0.2 != 0.3\`. Use \`assertAlmostEqual\`.\n- \`self.assertRaisesRegex(Err, "text")\` also checks the message.`,
    analogy:`Different gauges for different things: you don't weigh a river with a ruler.`,
    example:eC15},
  predict:{code:R`print(0.1 + 0.2 == 0.3, round(0.1 + 0.2, 7) == round(0.3, 7))`, q:'What prints?', opts:['False True','True True','False False'], ans:0, why:'Floating point error: the sum is 0.30000000000000004, which rounds to 0.3.'},
  cast:{code:eC15, task:'Cast it.'},
  bug:{broken:R`import unittest, io

class T(unittest.TestCase):
    def test_error(self):
        with self.assertRaises(Exception):
            int("12")

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.wasSuccessful())`, task:'int("12") does NOT raise, so this test correctly fails. Test a string that really is invalid ("abc") with the precise ValueError. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Precise','"ValueError" in src and "assertRaises(Exception)" not in src']]}],
    sol:R`import unittest, io

class T(unittest.TestCase):
    def test_error(self):
        with self.assertRaises(ValueError):
            int("abc")

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.wasSuccessful())`, wrong:[R`print(True)`]},
  write:{prompt:'Write `class TestParseAge`: it must pass the correct `parse_age` and **catch all 4 broken versions** (accepts negatives, no upper limit, returns text instead of a number, raises the wrong exception type). Use `assertRaises(ValueError)` for the bad inputs. Valid ages are 0 to 150.',
    starter:p15(R`class TestParseAge(unittest.TestCase):
    pass
`),
    inputs:[],
    cases:[{inputs:[],tests:[['All caught','lines[-6:]=='+out15],['Precise exception','"assertRaises(ValueError)" in src']]}],
    sol:p15(c15),
    wrong:[p15(R`class TestParseAge(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(parse_age("42"), 42)
`),p15(R`class TestParseAge(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(parse_age("42"), 42)

    def test_bad(self):
        for text in ("abc", "-5", "200"):
            with self.assertRaises(Exception):
                parse_age(text)
`),p15(R`class TestParseAge(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(parse_age("42"), 42)

    def test_not_a_number(self):
        with self.assertRaises(ValueError):
            parse_age("abc")

    def test_negative(self):
        with self.assertRaises(ValueError):
            parse_age("-5")
`)],
    hints:['One test for a valid age (check the VALUE and that it is an int, not text), then one test per way it can be invalid.','The bad inputs: "abc" (not a number), "-5" (too small), "200" (too big). Use with self.assertRaises(ValueError).','assertRaises(Exception) lets the "wrong exception type" mutant slip through. Name ValueError exactly.',p15(c15)]},
  power:{can:['Choose the right assertion for the job','Test that errors are raised, and the right kind of error'],
    expand:'Use assertRaisesRegex to also check the error message.',
    where:'Testing the failure paths is where most real bugs hide.',
    next:'Next: fixtures: setUp keeps every test independent.'},
  codex:{title:'Assertions',body:'assertEqual, assertTrue, assertIn, assertIsNone, assertAlmostEqual (floats), assertRaises(SpecificError). Broad assertRaises(Exception) hides wrong-error bugs.',snip:R`with self.assertRaises(ValueError):
    parse_age("abc")`}
},
{
  id:'r12-16', realm:12, n:16, title:'setUp: a fresh start for every test',
  teaches:['ut-setup'], requires:['ut-assert'],
  story:`"Imagine every duelist begins on a **clean arena**," Orrin says. "If the last fight leaves bloodstains, the next one lies about who won. Tests must never leak into each other."`,
  concept:{
    html:`Tests must be **independent**: no test may depend on another having run first. Python runs methods in **alphabetical order**, which makes hidden dependencies easy to create and painful to debug.\n\n\`\`\`\nclass TestInventory(unittest.TestCase):\n    def setUp(self):                      # runs BEFORE every test\n        self.inv = Inventory()            # a brand new object each time\n\n    def tearDown(self):                   # runs AFTER every test (cleanup)\n        ...\n\n    def test_add(self):\n        self.inv.add("potion", 2)\n        self.assertEqual(self.inv.count("potion"), 2)\n\`\`\`\n\n- \`setUp\` builds the **fixture** (the objects every test needs). \`tearDown\` cleans up (close files, delete temp data).\n- Because each test gets a new object, one test's changes can't leak into another.\n- One bug that only independence reveals: a **shared mutable class attribute** (\`items = {}\` on the class) is shared by *all* instances. A test that asserts "starts empty" fails once an earlier test added something.\n- Keep one idea per test and name tests by behaviour: \`test_remove_too_many\`.`,
    analogy:`Resetting the chessboard between games.`,
    example:eC16},
  predict:{code:R`import unittest
class T(unittest.TestCase):
    def test_b(self): pass
    def test_a(self): pass
    def test_c(self): pass
print(unittest.defaultTestLoader.getTestCaseNames(T))`, q:'What prints?', opts:["['test_a', 'test_b', 'test_c']","['test_b', 'test_a', 'test_c']","['test_c', 'test_b', 'test_a']"], ans:0, why:'Tests are sorted alphabetically, not in the order written.'},
  cast:{code:eC16, task:'Cast it.'},
  bug:{broken:R`import unittest, io

class T(unittest.TestCase):
    items = []

    def test_a(self):
        self.items.append("x")
        self.assertEqual(len(self.items), 1)

    def test_b(self):
        self.items.append("y")
        self.assertEqual(len(self.items), 1)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, result.wasSuccessful())`, task:'test_b fails because the list is shared by every test. Create a fresh list in setUp. Expected: 2 True',
    cases:[{inputs:[],tests:[['Works','lines==["2 True"]'],['Uses setUp','"def setUp" in src']]}],
    sol:R`import unittest, io

class T(unittest.TestCase):
    def setUp(self):
        self.items = []

    def test_a(self):
        self.items.append("x")
        self.assertEqual(len(self.items), 1)

    def test_b(self):
        self.items.append("y")
        self.assertEqual(len(self.items), 1)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(result.testsRun, result.wasSuccessful())`, wrong:[R`print("2 True")`]},
  write:{prompt:'Write `class TestInventory` using `setUp` (a fresh `Inventory` in `self.inv`). Use the item name `"potion"` everywhere. Include tests named `test_add_accumulates` (two adds sum up), `test_remove`, `test_remove_too_many` (raises `ValueError`) and `test_starts_empty` (a new inventory has 0 potions; it runs last alphabetically, so it exposes leftovers). It must catch all 4 broken versions.',
    starter:p16(R`class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()
`),
    inputs:[],
    cases:[{inputs:[],tests:[['All caught','lines[-6:]=='+out16],['Fixture','"def setUp" in src and "test_starts_empty" in src']]}],
    sol:p16(c16),
    wrong:[p16(R`class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()

    def test_add_accumulates(self):
        self.inv.add("potion", 2)
        self.inv.add("potion", 3)
        self.assertEqual(self.inv.count("potion"), 5)

    def test_remove(self):
        self.inv.add("potion", 5)
        self.inv.remove("potion", 2)
        self.assertEqual(self.inv.count("potion"), 3)

    def test_starts_empty(self):
        self.assertEqual(self.inv.count("potion"), 0)
`),p16(R`class TestInventory(unittest.TestCase):
    def setUp(self):
        self.inv = Inventory()

    def test_add_accumulates(self):
        self.inv.add("potion", 2)
        self.inv.add("potion", 3)
        self.assertEqual(self.inv.count("potion"), 5)

    def test_remove_too_many(self):
        self.inv.add("potion", 1)
        with self.assertRaises(ValueError):
            self.inv.remove("potion", 2)

    def test_starts_empty(self):
        self.assertEqual(self.inv.count("potion"), 0)
`)],
    hints:['setUp creates self.inv = Inventory() so every test gets a new one.','test_add_accumulates: add 2 then 3 and expect 5. test_remove: add 5, remove 2, expect 3.','test_remove_too_many: add 1, then assertRaises(ValueError) around remove("potion", 2). test_starts_empty: just count == 0.',p16(c16)]},
  power:{can:['Use setUp/tearDown fixtures','Keep tests independent of each other and of run order'],
    expand:'Add a tearDown that prints nothing but proves it ran (hint: append to a list).',
    where:'Fixtures create test databases, temp folders and fake users in professional test suites.',
    next:'Next: edge cases and boundaries, where bugs love to live.'},
  codex:{title:'Fixtures',body:'setUp runs before each test (build fresh objects), tearDown after (clean up). Tests run alphabetically and must not depend on each other. Shared class attributes leak state between instances.',snip:R`def setUp(self):
    self.inv = Inventory()`}
},
{
  id:'r12-17', realm:12, n:17, title:'Edge cases: test the boundaries',
  teaches:['ut-edge'], requires:['ut-setup'],
  story:`"Dragons," Orrin says, "rarely hide in the middle of a map. They live at the **edges**: zero, one, one-past-the-end. A tester who only checks comfortable values has never really tested."`,
  concept:{
    html:`Bugs cluster at **boundaries**, where behaviour changes. For a rule like "90 and above is an A", the interesting inputs are **90** and **89**, not 95.\n\nA checklist for edge cases:\n\n- **On the line and just off it**: 90 and 89; 80 and 79\n- **Extremes**: 0, the maximum, empty list, empty string\n- **Just outside the valid range**: -1, 101 (must be rejected)\n- **One item vs many**, **duplicates**, **negative numbers**, **None**\n\nOne bug type is the **off-by-one**: \`>\` where \`>=\` was meant.\n\n\`\`\`\ndef band(score):\n    return "A" if score > 90 else "B"      # 90 is wrongly a B\n\`\`\`\n\nTesting 95 passes. Testing 90 finds the bug. Use a **table of cases** to keep boundary tests compact:\n\n\`\`\`\ntable = {100: "A", 90: "A", 89: "B"}\nfor score, expected in table.items():\n    self.assertEqual(grade(score), expected)\n\`\`\``,
    analogy:`Testing a fence by checking the corners, not the middle of each plank.`,
    example:eC17},
  predict:{code:R`def band(s):
    return "A" if s > 90 else "B"
print(band(90), band(91))`, q:'What prints?', opts:['B A','A A','A B'], ans:0, why:'90 is not > 90, so it falls to "B". The boundary bug.'},
  cast:{code:eC17, task:'Cast it.'},
  bug:{broken:R`def band(score):
    return "A" if score > 90 else "B"

print(band(90))`, task:'90 and above should be an A. Fix the comparison. Expected: A',
    cases:[{inputs:[],tests:[['Works','lines==["A"]'],['Operator','">=" in src']]}],
    sol:R`def band(score):
    return "A" if score >= 90 else "B"

print(band(90))`, wrong:[R`print("A")`]},
  write:{prompt:'Write `class TestGrade` for `grade(score)`: A from 90, B from 80, C from 70, otherwise F; scores outside 0-100 raise `ValueError`. It must pass the correct version and **catch all 10 broken versions** (every threshold off by one either way, and each end of the valid range wrongly accepted or rejected).',
    starter:p17(R`class TestGrade(unittest.TestCase):
    pass
`),
    inputs:[],
    cases:[{inputs:[],tests:[['All caught','lines[-12:]=='+out17]]}],
    sol:p17(c17),
    wrong:[p17(R`class TestGrade(unittest.TestCase):
    def test_typical(self):
        table = {95: "A", 85: "B", 75: "C", 50: "F"}
        for score, expected in table.items():
            self.assertEqual(grade(score), expected)
`),p17(R`class TestGrade(unittest.TestCase):
    def test_boundaries(self):
        table = {90: "A", 89: "B", 80: "B", 79: "C", 70: "C", 69: "F"}
        for score, expected in table.items():
            self.assertEqual(grade(score), expected)
`),p17(R`class TestGrade(unittest.TestCase):
    def test_boundaries(self):
        table = {100: "A", 90: "A", 89: "B", 80: "B", 79: "C", 70: "C", 69: "F"}
        for score, expected in table.items():
            self.assertEqual(grade(score), expected)

    def test_out_of_range(self):
        for bad in (-1, 101):
            with self.assertRaises(ValueError):
                grade(bad)
`)],
    hints:['For each threshold test the value ON it and the value just BELOW: 90/89, 80/79, 70/69.','Also test the extremes 0 and 100 (must be accepted) and -1 and 101 (must raise ValueError).','A dict table {score: expected} and a loop keeps it short.',p17(c17)]},
  power:{can:['Find the boundary values for any rule','Catch off-by-one bugs that typical-value tests miss'],
    expand:'Add the float boundary: does grade(89.999) behave as you expect?',
    where:'Banks, tax software and date libraries are tested heavily at their edges.',
    next:'Next: TDD, writing the test first.'},
  codex:{title:'Edge cases',body:'Test on the line and just off it (90 and 89), the extremes (0, max, empty), and just outside the valid range. Typical values hide off-by-one bugs.',snip:R`table = {90: "A", 89: "B"}
for score, expected in table.items():
    self.assertEqual(grade(score), expected)`}
},
{
  id:'r12-18', realm:12, n:18, title:'TDD: red, green, refactor',
  teaches:['ut-tdd'], requires:['ut-edge'],
  story:`"Now the pros' trick: write the **test first**," Orrin says, handing you a sealed list of demands. "Watch it fail: that's the red light. Write just enough code to make it pass: green. Then tidy up."`,
  concept:{
    html:`**Test-driven development** (TDD) loops through three steps:\n\n1. 🔴 **Red**: write a small failing test describing the next bit of behaviour.\n2. 🟢 **Green**: write the simplest code that makes it pass.\n3. 🔵 **Refactor**: clean up while the tests keep you safe.\n\nWhy bother?\n\n- You design the **function's interface** from the caller's side.\n- A test you never saw fail might not be testing anything.\n- You always have a safety net for later changes.\n\nA test **result** object tells the story: \`result.testsRun\`, \`len(result.failures)\` (wrong answers), \`len(result.errors)\` (crashes), \`result.wasSuccessful()\`.\n\nIn this lesson the tests already exist in the file. Your function \`slugify(text)\` (make text URL-friendly: lower-case, runs of non-letters/digits become one \`-\`, no leading or trailing \`-\`) must turn them green. Careful: the demands list is short, but the *real* rules are what the sentence says.`,
    analogy:`Drawing the target before throwing the dart.`,
    example:eC18},
  predict:{code:R`import unittest, io
class T(unittest.TestCase):
    def test_ok(self): self.assertTrue(True)
    def test_fail(self): self.assertEqual(1, 2)
    def test_err(self): 1 / 0
r = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(r.testsRun, len(r.failures), len(r.errors))`, q:'What prints?', opts:['3 1 1','3 2 0','3 0 2'], ans:0, why:'assertEqual(1, 2) is a failure; 1/0 crashes, which is an error.'},
  cast:{code:eC18, task:'Cast it.'},
  bug:{broken:R`import re

def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")

print(slugify("Hello World"))`, task:'The expected output is hello-world, but capital letters are being turned into dashes. Fix it. Expected: hello-world',
    cases:[{inputs:[],tests:[['Works','lines==["hello-world"]'],['Lowercases','"lower" in src']]}],
    sol:R`import re

def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

print(slugify("Hello World"))`, wrong:[R`print("hello-world")`]},
  write:{prompt:'The tests are written and failing (red). Write `slugify(text)` to make them green: lower-case it, turn every run of characters that are not `a-z` or `0-9` into a single `-`, and strip leading/trailing `-`. The runner prints the result.',
    starter:s18 + R`def slugify(text):
    pass
` + t18,
    inputs:[],
    cases:[{inputs:[],tests:[['Green','lines[-2:]==["Tests: 4, failures: 0, errors: 0","Result: PASS"]'],['Extra: punctuation','g["slugify"]("  Hello,   World!! ")=="hello-world"'],['Extra: underscore','g["slugify"]("a_b")=="a-b"'],['Extra: symbols','g["slugify"]("C++ & Rust")=="c-rust"'],['Extra: only symbols','g["slugify"]("---")==""'],['Extra: digits','g["slugify"]("Cafe 2024")=="cafe-2024"']]}],
    sol:s18 + f18 + t18,
    wrong:[s18 + R`def slugify(text):
    return re.sub(r"\W+", "-", text.lower()).strip("-")
` + t18, s18 + R`def slugify(text):
    return text.lower().strip().replace(" ", "-")
` + t18],
    hints:['text.lower() first, then replace runs of anything that is not a letter or digit.','re.sub(r"[^a-z0-9]+", "-", lowered) replaces each run with one dash. Note: \\W would keep underscores!','Finish with .strip("-") to remove dashes at either end.',s18 + f18 + t18]},
  power:{can:['Follow the red-green-refactor loop','Read a unittest result: run, failures, errors'],
    expand:'Add a new test for "Ünï" and decide what slugify should do, then make it pass.',
    where:'TDD is standard practice at teams that ship often and sleep well.',
    next:'Next: dependency injection: giving functions fakes to talk to.'},
  codex:{title:'TDD',body:'Red (failing test) -> Green (simplest passing code) -> Refactor. result.testsRun, failures (wrong), errors (crash), wasSuccessful().',snip:R`result = unittest.TextTestRunner(stream=io.StringIO()).run(suite)
print(result.testsRun, len(result.failures), len(result.errors))`}
},
{
  id:'r12-19', realm:12, n:19, title:'Dependency injection: pass in the outside world',
  teaches:['ut-fake'], requires:['ut-tdd'],
  story:`"A spell that phones a faraway oracle for the weather can't be tested when the oracle is asleep," Orrin says. "So don't hard-wire the oracle in. Let the **caller hand it in**. In tests, hand it a puppet."`,
  concept:{
    html:`Code that touches the outside world (the network, the clock, a database, randomness) is hard to test. The fix: **dependency injection**, which means passing the dependency in as a parameter instead of reaching out for it.\n\n\`\`\`\n# hard to test: calls the real network inside\ndef weather_note(city):\n    temp = requests.get(...).json()[...]\n\n# easy to test: the fetcher is a parameter\ndef weather_note(fetch_temp, city):\n    temp = fetch_temp(city)\n\`\`\`\n\n- In production pass the real fetcher. In tests pass a **fake**: a tiny function returning canned data, or raising an error on purpose.\n- A **spy** is a fake that records how it was called (\`calls.append(city)\`).\n- Functions are values, so a fake is just \`lambda city: 21.5\`.\n- Inject: network clients, clocks (\`now=datetime.now\`), random generators, file readers.\n- Catch **only the error you can handle** (\`ConnectionError\`), not bare \`Exception\`; real bugs must stay loud.`,
    analogy:`A flight simulator: the plane's controls are real, the sky is fake, so crashes are free.`,
    example:eC19},
  predict:{code:R`def greet(get_name):
    return "Hi " + get_name()
print(greet(lambda: "Ada"))`, q:'What prints?', opts:['Hi Ada','Hi','TypeError'], ans:0, why:'The fake name source is called inside greet.'},
  cast:{code:eC19, task:'Cast it.'},
  bug:{broken:R`def report(fetch, city):
    return f"{city}: {fetch(city)}"

print(report(lambda: 21, "Oslo"))`, task:'The fake takes no arguments but report passes the city. Give the fake a parameter. Expected: Oslo: 21',
    cases:[{inputs:[],tests:[['Works','lines==["Oslo: 21"]'],['Still injected','"fetch" in src and "lambda" in src']]}],
    sol:R`def report(fetch, city):
    return f"{city}: {fetch(city)}"

print(report(lambda city: 21, "Oslo"))`, wrong:[R`print("Oslo: 21")`]},
  write:{prompt:'Write `weather_note(fetch_temp, city)`. Call `fetch_temp(city)` exactly once. Return `"<city>: hot"` for 30 or more, `"<city>: cold"` for 5 or less, otherwise `"<city>: mild"`. If the fetcher raises `ConnectionError`, return `"<city>: unavailable"` (let other errors through). The program feeds it a fake fetcher.',
    starter:s19 + R`def weather_note(fetch_temp, city):
    pass
` + m19,
    inputs:['Oslo','4'],
    cases:[{inputs:['Oslo','4'],tests:[['Cold','lines[-1]=="Oslo: cold"'],['Spy','(lambda c: g["weather_note"](lambda city: c.append(city) or 20.0, "Oslo")=="Oslo: mild" and c==["Oslo"])([])']]},{inputs:['Cairo','30'],tests:[['Hot boundary','lines[-1]=="Cairo: hot"']]},{inputs:['Rome','5.1'],tests:[['Mild','lines[-1]=="Rome: mild"']]},{inputs:['Rome','5'],tests:[['Cold boundary','lines[-1]=="Rome: cold"']]},{inputs:['Rome','down'],tests:[['Unavailable','lines[-1]=="Rome: unavailable"']]}],
    sol:s19 + f19 + m19,
    wrong:[s19 + f19.replace('temp >= 30','temp > 30') + m19, s19 + f19.replace('        temp = fetch_temp(city)','        fetch_temp(city)\n        temp = fetch_temp(city)') + m19, s19 + f19.replace('    try:\n        temp = fetch_temp(city)\n    except ConnectionError:\n        return f"{city}: unavailable"','    temp = fetch_temp(city)') + m19],
    hints:['Call temp = fetch_temp(city) once, inside try/except ConnectionError.','On ConnectionError return f"{city}: unavailable".','temp >= 30 is hot, temp <= 5 is cold, else mild. Return f"{city}: {note}".',s19 + f19 + m19]},
  power:{can:['Make code testable by injecting its dependencies','Use fakes and spies instead of the real network'],
    expand:'Inject a clock too: `greeting(now)` returns "Good morning" before noon.',
    where:'Clean architecture, hexagonal design and every serious test suite rely on injection.',
    next:'Next: unittest.mock builds fakes for you.'},
  codex:{title:'Dependency injection',body:'Pass collaborators in as parameters (fetch, clock, db). Tests pass fakes (canned data, errors) or spies (record calls). Catch only errors you can handle.',snip:R`def weather_note(fetch_temp, city):
    temp = fetch_temp(city)`}
},
{
  id:'r12-20', realm:12, n:20, title:'unittest.mock: instant fakes',
  teaches:['ut-mock'], requires:['ut-fake'],
  story:`"Writing every puppet by hand gets tiring," Orrin admits, waving a wand at a blank mannequin. "**Mock** makes one that *remembers everything done to it*."`,
  concept:{
    html:`\`unittest.mock.Mock\` makes a shape-shifting fake object.\n\n\`\`\`\nfrom unittest.mock import Mock\n\nsend = Mock(return_value="queued")     # calling it returns "queued"\nsend("ann@x.test", "Hi")\nsend.call_count                        # 1\nsend.call_args                         # the last call\nsend.call_args_list[0].args            # ('ann@x.test', 'Hi')\nsend.assert_called_once()              # raises AssertionError if not exactly 1 call\nsend.assert_any_call("ann@x.test", "Hi")\nsend.assert_not_called()\n\`\`\`\n\n- A Mock accepts **any** call and any attribute, and records them all.\n- \`Mock(side_effect=ConnectionError)\` makes the call **raise**; \`side_effect=[1, 2]\` returns different values per call.\n- \`.args\` and \`.kwargs\` hold what a call received.\n- Use mocks for **interactions** (was it called, how many times, with what). Prefer plain fakes when you only need canned data.\n- \`patch\` (also in \`unittest.mock\`) swaps a real function for a mock temporarily.`,
    analogy:`A tape recorder hidden inside the dummy.`,
    example:eC20},
  predict:{code:R`from unittest.mock import Mock
m = Mock(return_value=5)
print(m(1), m(2), m.call_count)`, q:'What prints?', opts:['5 5 2','1 2 2','5 5 1'], ans:0, why:'return_value is returned every call, and both calls were counted.'},
  cast:{code:eC20, task:'Cast it.'},
  bug:{broken:R`from unittest.mock import Mock

send = Mock()
send("hello")
send("world")
send.assert_called_once()
print("done")`, task:'send was called twice, so assert_called_once raises AssertionError. Make the program correct by asserting the real count (2) with call_count. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['Uses call_count','"call_count" in src']]}],
    sol:R`from unittest.mock import Mock

send = Mock()
send("hello")
send("world")
print(send.call_count)`, wrong:[R`print(2)`]},
  write:{prompt:'Write `notify_all(users, send)`. For every user dict with `"active": True`, call `send(<name>@guild.test, "Hello <name>!")` and count it. Return how many were sent. The program uses a `Mock` as `send` and prints what it recorded.',
    starter:s20 + R`def notify_all(users, send):
    pass
` + m20,
    inputs:['ann:1 bob:0 cy:1'],
    cases:[{inputs:['ann:1 bob:0 cy:1'],tests:[['Calls','lines[-4:]==["Sent: 2","ann@guild.test Hello ann!","cy@guild.test Hello cy!","Calls: 2"]'],['With a Mock','(lambda m: g["notify_all"]([{"name":"z","active":True}], m)==1 and m.call_args.args==("z@guild.test","Hello z!"))(__import__("unittest.mock",fromlist=["Mock"]).Mock())']]},{inputs:['ann:0 bob:0'],tests:[['None active','lines[-2:]==["Sent: 0","Calls: 0"]']]},{inputs:['dee:1'],tests:[['One','lines[-3:]==["Sent: 1","dee@guild.test Hello dee!","Calls: 1"]']]},{inputs:[''],tests:[['No users','lines[-2:]==["Sent: 0","Calls: 0"]']]}],
    sol:s20 + f20 + m20,
    wrong:[s20 + f20.replace('if user["active"]:','if True:') + m20, s20 + f20.replace('sent += 1','sent += 2') + m20, s20 + f20.replace('user["name"] + "@guild.test", f"Hello {user[\'name\']}!"','user["name"], "Hello"') + m20],
    hints:['Loop over users and only act when user["active"] is true.','send(email, message): email = name + "@guild.test", message = f"Hello {name}!".','Count the sends and return the count.',s20 + f20 + m20]},
  power:{can:['Create Mocks and read call_count / call_args','Assert on how a dependency was used'],
    expand:'Make a Mock with side_effect=ConnectionError and check how notify_all copes.',
    where:'Mocks stand in for email servers, payment gateways and APIs in tests.',
    next:'Next: doctest, tests that live inside the docstring.'},
  codex:{title:'Mock',body:'Mock(return_value=..., side_effect=...). Records call_count, call_args, call_args_list; assert_called_once(), assert_any_call(...). Great for interactions with outside services.',snip:R`send = Mock()
send("a", "b")
send.call_args.args`}
},
{
  id:'r12-21', realm:12, n:21, title:'doctest: examples that test themselves',
  teaches:['ut-doctest'], requires:['ut-mock'],
  story:`"The best documentation can't go stale," Orrin says, tapping a docstring. "Write an **example** in it. The machine runs the example. If the code changes and the docs lie, the alarm sounds."`,
  concept:{
    html:`A **doctest** is an example inside a docstring, written like an interactive session:\n\n\`\`\`\ndef average(numbers):\n    """Return the mean rounded to 2 places.\n\n    >>> average([1, 2, 3])\n    2.0\n    >>> average([])\n    Traceback (most recent call last):\n        ...\n    ValueError: empty list\n    """\n\`\`\`\n\n- Lines starting with \`>>>\` are code; the **next lines are the exact expected output**.\n- To expect an exception write \`Traceback (most recent call last):\`, then \`...\`, then \`ExceptionType: message\`.\n- Run them with \`python -m doctest file.py\` or \`doctest.testmod()\`. The runner counts \`tries\` and \`failures\`.\n- Output must match **exactly**, including \`2.0\` vs \`2\`. Don't depend on dict order or addresses.\n- Doctests are perfect for small, pure functions and for documentation that is guaranteed true. Use \`unittest\` for bigger scenarios.`,
    analogy:`A recipe that cooks itself to prove the photo is accurate.`,
    example:eC21},
  predict:{code:R`def inc(x):
    """
    >>> inc(1)
    2
    """
    return x + 1
print(">>>" in inc.__doc__, inc.__doc__.count(">>>"))`, q:'What prints?', opts:['True 1','True 2','False 0'], ans:0, why:'The docstring holds one >>> example.'},
  cast:{code:eC21, task:'Cast it.'},
  bug:{broken:R`def double(x):
    """
    >>> double(2)
    5
    """
    return x * 2

import doctest
runner = doctest.DocTestRunner(verbose=False)
for t in doctest.DocTestFinder().find(double, "double", module=False, globs={"double": double}):
    runner.run(t, out=lambda text: None)
print(runner.failures)`, task:'The documentation example is wrong: 2 doubled is 4. Fix the docstring. Expected: 0',
    cases:[{inputs:[],tests:[['Works','lines==["0"]'],['Real doctest','">>> double(2)" in src']]}],
    sol:R`def double(x):
    """
    >>> double(2)
    4
    """
    return x * 2

import doctest
runner = doctest.DocTestRunner(verbose=False)
for t in doctest.DocTestFinder().find(double, "double", module=False, globs={"double": double}):
    runner.run(t, out=lambda text: None)
print(runner.failures)`, wrong:[R`print(0)`]},
  write:{prompt:'Write `average(numbers)`: the mean rounded to 2 decimals; an empty list raises `ValueError("empty list")`. Give it a docstring with **at least 3 examples including the empty-list `Traceback` example**, all correct. The doctest runner at the bottom reports how many examples ran and how many failed.',
    starter:R`def average(numbers):
    pass
` + m21,
    inputs:[],
    cases:[{inputs:[],tests:[['No failures','lines[-1]=="Failed: 0"'],['At least 3 examples','int(lines[-2].split()[-1])>=3'],['Has Traceback example','"Traceback" in src and "ValueError: empty list" in src'],['Function','g["average"]([10,20,25])==18.33 and g["average"]([2,4])==3.0'],['Raises','(lambda f: f([]) if False else True)(g["average"])']]}],
    sol:f21 + m21,
    wrong:[R`def average(numbers):
    """
    >>> average([1, 2, 3])
    2.0
    >>> average([1, 2])
    1.5
    """
    if not numbers:
        raise ValueError("empty list")
    return round(sum(numbers) / len(numbers), 2)
` + m21, R`def average(numbers):
    """
    >>> average([1, 2, 3])
    2.0
    >>> average([1, 2])
    1.5
    >>> average([10, 20, 25])
    18.3
    """
    if not numbers:
        raise ValueError("empty list")
    return round(sum(numbers) / len(numbers), 2)
` + m21, R`def average(numbers):
    """
    >>> average([1, 2, 3])
    2.0
    >>> average([1, 2])
    1.5
    >>> average([10, 20, 25])
    18.33
    >>> average([])
    Traceback (most recent call last):
        ...
    ValueError: empty list
    """
    return round(sum(numbers) / len(numbers), 2)
` + m21],
    hints:['Each example is a >>> line followed by the exact output on the next line.','For the empty list: >>> average([]) then Traceback (most recent call last): / ... / ValueError: empty list.','Implement: raise ValueError("empty list") for [], else round(sum/len, 2). 10,20,25 averages to 18.33.',f21 + m21]},
  power:{can:['Embed runnable examples in docstrings','Run doctests and read tries/failures'],
    expand:'Add a docstring example showing the float formatting of a longer list.',
    where:'The Python standard library docs are full of doctests that keep them honest.',
    next:'Next: subTest, one test run over a table of cases.'},
  codex:{title:'doctest',body:'>>> code lines, exact expected output below. Exceptions: Traceback (most recent call last): / ... / ErrorType: msg. DocTestRunner counts tries and failures; python -m doctest runs a file.',snip:R`"""
>>> average([1, 2, 3])
2.0
"""`}
},
{
  id:'r12-22', realm:12, n:22, title:'subTest: one test, many cases',
  teaches:['ut-subtest'], requires:['ut-doctest'],
  story:`"A table of cases is the tester's best friend," Orrin says, "but if the first row fails and the loop stops, you learn about **one** bug while three more sleep. **subTest** keeps going and reports every failing row."`,
  concept:{
    html:`Testing a function over a table of inputs is common. A plain loop has a flaw: the first failed assertion **ends the whole test**, hiding later failures.\n\n\`\`\`\nCASES = [(2024, True), (1900, False), (2000, True)]\n\nclass TestLeap(unittest.TestCase):\n    def test_table(self):\n        for year, expected in CASES:\n            with self.subTest(year=year):          # each row is its own mini-test\n                self.assertEqual(is_leap(year), expected)\n\`\`\`\n\n- Each failing row is reported **separately** (with its \`year=...\` label), and the loop carries on.\n- The result counts them: \`len(result.failures)\` is the number of failing rows.\n- The label in \`subTest(...)\` is what tells you *which* case failed. Pick informative names.\n- Perfect for data-driven tests: parsing, formatting, validation rules.\n\nThe leap-year rule has the classic trap: divisible by 4, except centuries, except every 400 years.`,
    analogy:`Marking an exam question by question instead of failing the whole paper on the first wrong answer.`,
    example:eC22},
  predict:{code:R`import unittest, io
class T(unittest.TestCase):
    def test_x(self):
        for n in (1, 2, 3):
            with self.subTest(n=n):
                self.assertLess(n, 2)
r = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(r.testsRun, len(r.failures))`, q:'What prints?', opts:['1 2','3 2','1 1'], ans:0, why:'One test method ran; the subtests for n=2 and n=3 both failed and are counted separately.'},
  cast:{code:eC22, task:'Cast it.'},
  bug:{broken:R`import unittest, io

class T(unittest.TestCase):
    def test_x(self):
        for n in (1, 2, 3, 4):
            self.assertLess(n, 3)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(len(result.failures))`, task:'Two cases (3 and 4) are wrong but only one failure is reported. Make each case its own subtest so both show. Expected: 2',
    cases:[{inputs:[],tests:[['Works','lines==["2"]'],['subTest','"subTest" in src']]}],
    sol:R`import unittest, io

class T(unittest.TestCase):
    def test_x(self):
        for n in (1, 2, 3, 4):
            with self.subTest(n=n):
                self.assertLess(n, 3)

result = unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(len(result.failures))`, wrong:[R`print(2)`]},
  write:{prompt:'Write `test_table` inside `TestLeap`: loop over **all** `CASES` (year, expected) and check `is_leap(year)` against `expected`, each in its own `self.subTest(year=year)`. The program picks the `buggy` or `fixed` implementation from the input and reports how many cases fail.',
    starter:s22 + R`class TestLeap(unittest.TestCase):
    pass
` + m22,
    inputs:['buggy'],
    cases:[{inputs:['buggy'],tests:[['Two failing rows','lines[-2:]==["Cases: 6","Failing cases: 2"]'],['Uses subTest','"subTest" in src']]},{inputs:['fixed'],tests:[['Fixed passes','lines[-2:]==["Cases: 6","Failing cases: 0"]']]}],
    sol:s22 + c22 + m22,
    wrong:[s22 + R`class TestLeap(unittest.TestCase):
    def test_table(self):
        for year, expected in CASES:
            self.assertEqual(is_leap(year), expected)
` + m22, s22 + R`class TestLeap(unittest.TestCase):
    def test_table(self):
        for year, expected in CASES[:4]:
            with self.subTest(year=year):
                self.assertEqual(is_leap(year), expected)
` + m22],
    hints:['Loop with for year, expected in CASES:.','Wrap the assertion in with self.subTest(year=year): so failures do not stop the loop.','self.assertEqual(is_leap(year), expected) inside the with block, for ALL cases.',s22 + c22 + m22]},
  power:{can:['Run one test over a table of cases','Report every failing case, not only the first'],
    expand:'Fix `buggy` and watch "Failing cases" drop to 0. The fixed rule: divisible by 4, except centuries unless divisible by 400.',
    where:'Parsers, validators and formatters are tested with big tables like this.',
    next:'Next: testing classes with state.'},
  codex:{title:'subTest',body:'with self.subTest(label=value): inside a loop makes each row an independent check; every failure is reported with its label and the loop continues.',snip:R`for year, expected in CASES:
    with self.subTest(year=year):
        self.assertEqual(is_leap(year), expected)`}
},
{
  id:'r12-23', realm:12, n:23, title:'Testing classes with state',
  teaches:['ut-class'], requires:['ut-subtest'],
  story:`"Objects remember," Orrin says, holding a coin purse that jingles. "That makes them harder to test: the answer depends on **what happened before**. Set the scene, act once, then check both the result and the aftermath."`,
  concept:{
    html:`Testing objects with state follows **Arrange, Act, Assert**:\n\n\`\`\`\ndef test_withdraw(self):\n    acct = Account(100)                       # Arrange: set the scene\n    result = acct.withdraw(30)                # Act: one action\n    self.assertEqual(result, 70)              # Assert: the return value...\n    self.assertEqual(acct.balance, 70)        # ...AND the new state\n\`\`\`\n\nA good checklist for a stateful class:\n\n- Check **return values and the changed state**; they can disagree.\n- Check **each way to fail**: invalid amounts, not enough funds, bad starting values.\n- Check the **exact boundary**: withdrawing the whole balance must work; one more must fail.\n- Use \`setUp\` to arrange the common starting object.\n- One behaviour per test, so a failure points straight at the problem.\n\nThe Proving Hall's broken accounts: overdraft allowed, zero deposits allowed, a wrong returned balance, the full balance refused, and a negative opening balance.`,
    analogy:`Checking a vending machine: coin in, item out, change correct, and the display updated.`,
    example:eC23},
  predict:{code:R`import unittest, io
calls = []
class T(unittest.TestCase):
    def setUp(self): calls.append("set")
    def test_a(self): calls.append("a")
    def test_b(self): calls.append("b")
unittest.TextTestRunner(stream=io.StringIO()).run(unittest.defaultTestLoader.loadTestsFromTestCase(T))
print(calls)`, q:'What prints?', opts:["['set', 'a', 'set', 'b']","['set', 'a', 'b']","['a', 'b', 'set']"], ans:0, why:'setUp runs before every test.'},
  cast:{code:eC23, task:'Cast it.'},
  bug:{broken:R`class Account:
    def __init__(self, balance=0):
        self.balance = balance
    def withdraw(self, amount):
        self.balance -= amount
        return self.balance

a = Account(100)
a.withdraw(30)
print(a.withdraw(80))`, task:'The second withdrawal takes the balance to -10! Raise ValueError("insufficient funds") when amount is more than the balance, and print the safe result: catch it and print the message. Expected: insufficient funds',
    cases:[{inputs:[],tests:[['Works','lines==["insufficient funds"]'],['Guards','"raise ValueError" in src and "except" in src']]}],
    sol:R`class Account:
    def __init__(self, balance=0):
        self.balance = balance
    def withdraw(self, amount):
        if amount > self.balance:
            raise ValueError("insufficient funds")
        self.balance -= amount
        return self.balance

a = Account(100)
a.withdraw(30)
try:
    print(a.withdraw(80))
except ValueError as error:
    print(error)`, wrong:[R`print("insufficient funds")`]},
  write:{prompt:'Write `class TestAccount` with a `setUp` creating `self.acct = Account(100)`. It must pass the correct `Account` and **catch all 5 broken versions**: check return values *and* balance, invalid amounts (0), overdraft (101), withdrawing exactly everything (100), and an invalid opening balance (-1).',
    starter:p23(R`class TestAccount(unittest.TestCase):
    def setUp(self):
        self.acct = Account(100)
`),
    inputs:[],
    cases:[{inputs:[],tests:[['All caught','lines[-7:]=='+out23],['Fixture','"def setUp" in src']]}],
    sol:p23(c23),
    wrong:[p23(R`class TestAccount(unittest.TestCase):
    def setUp(self):
        self.acct = Account(100)

    def test_deposit(self):
        self.assertEqual(self.acct.deposit(50), 150)

    def test_withdraw(self):
        self.assertEqual(self.acct.withdraw(30), 70)
`),p23(R`class TestAccount(unittest.TestCase):
    def setUp(self):
        self.acct = Account(100)

    def test_deposit(self):
        self.assertEqual(self.acct.deposit(50), 150)
        self.assertEqual(self.acct.balance, 150)

    def test_deposit_zero(self):
        with self.assertRaises(ValueError):
            self.acct.deposit(0)

    def test_withdraw(self):
        self.assertEqual(self.acct.withdraw(30), 70)
        self.assertEqual(self.acct.balance, 70)

    def test_overdraft(self):
        with self.assertRaises(ValueError):
            self.acct.withdraw(101)

    def test_negative_start(self):
        with self.assertRaises(ValueError):
            Account(-1)
`)],
    hints:['Arrange (setUp gives Account(100)), Act (one call), Assert (return value AND self.acct.balance).','Failure cases: deposit(0), withdraw(101), Account(-1) all raise ValueError.','The boundary: withdraw(100) must work and leave a balance of 0.',p23(c23)]},
  power:{can:['Test stateful objects with arrange-act-assert','Check return values, state and every failure path'],
    expand:'Add tests for a `transfer(other, amount)` method, then write the method.',
    where:'Shopping carts, bank accounts and game inventories all need tests like these.',
    next:'Next: Real-World Mission: the Bug Zoo.'},
  codex:{title:'Testing classes',body:'Arrange, act, assert. Check return value AND resulting state. Test every failure path and exact boundaries. Use setUp for the common starting object.',snip:R`self.assertEqual(self.acct.withdraw(30), 70)
self.assertEqual(self.acct.balance, 70)`}
},
{
  id:'r12-24', realm:12, n:24, title:'Real-World Mission: The Bug Zoo',
  teaches:['mission12c'], requires:['ut-class'],
  story:`Orrin unlocks the last cage in the Proving Hall. Seven creatures prowl inside, each a **Cart** with one tiny hidden defect. "Write one test suite," he says, "that lets the real Cart walk free and traps **all seven** beasts. If one escapes, a customer pays the wrong price."`,
  concept:{
    html:`This technique is called **mutation testing**: automatically make small breaking changes (mutants) and check your tests notice. A surviving mutant means a hole in your tests.\n\nYour shopping \`Cart\` has these rules:\n\n- \`add(name, price, qty=1)\`: repeated adds of the same item **accumulate**; a negative price or a quantity below 1 raises \`ValueError\`\n- \`remove(name)\`: removing an item that isn't there raises \`KeyError\`\n- \`count()\`: total **units**, not distinct lines\n- \`total(coupon=None)\`: sum of price x qty; coupon \`"SAVE10"\` takes 10% off; result **rounded to 2 places**\n\nA few honest limits of mutation testing:\n\n- An **equivalent mutant** behaves identically to the original, so no test can catch it (that's fine, ignore it).\n- 100% of mutants caught does not prove the code is bug-free, but surviving mutants prove your tests are weak.\n- Float money is risky: \`0.1 * 3 == 0.30000000000000004\`. That's why \`total\` rounds.`,
    analogy:`Testing a smoke alarm by actually lighting a (small, safe) fire.`,
    example:eC24},
  predict:{code:R`good = lambda x: x * 2
mutant = lambda x: x + x
print(all(good(n) == mutant(n) for n in range(5)))`, q:'What prints?', opts:['True','False','Error'], ans:0, why:'x*2 and x+x always agree: an equivalent mutant that no test can catch.'},
  cast:{code:eC24, task:'Cast it.'},
  bug:{broken:R`total = 0
for price in (0.1, 0.1, 0.1):
    total += price
print(total == 0.3)`, task:'Floats add with tiny errors, so the comparison is False. Round before comparing. Expected: True',
    cases:[{inputs:[],tests:[['Works','lines==["True"]'],['Rounds','"round" in src']]}],
    sol:R`total = 0
for price in (0.1, 0.1, 0.1):
    total += price
print(round(total, 2) == 0.3)`, wrong:[R`print(True)`]},
  write:{prompt:'Write `class TestCart` (with `setUp` making `self.cart = Cart()`) that passes the real `Cart` and **catches all 7 mutants**: add must accumulate, negative price and zero quantity must raise `ValueError`, the `SAVE10` coupon takes exactly 10 percent, removing a missing item raises `KeyError`, `count()` counts units, and totals are rounded (try 3 candies at 0.1 each).',
    starter:p24(R`class TestCart(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()
`),
    inputs:[],
    cases:[{inputs:[],tests:[['Whole zoo caught','lines[-9:]=='+out24],['Fixture','"def setUp" in src']]}],
    sol:p24(c24),
    wrong:[p24(R`class TestCart(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()

    def test_basic(self):
        self.cart.add("potion", 5.0, 2)
        self.assertEqual(self.cart.total(), 10.0)
`),p24(R`class TestCart(unittest.TestCase):
    def setUp(self):
        self.cart = Cart()

    def test_add_accumulates(self):
        self.cart.add("potion", 5.0, 2)
        self.cart.add("potion", 5.0, 3)
        self.assertEqual(self.cart.count(), 5)
        self.assertEqual(self.cart.total(), 25.0)

    def test_count_units(self):
        self.cart.add("potion", 5.0, 2)
        self.cart.add("scroll", 2.0, 3)
        self.assertEqual(self.cart.count(), 5)

    def test_negative_price(self):
        with self.assertRaises(ValueError):
            self.cart.add("potion", -1.0)

    def test_zero_quantity(self):
        with self.assertRaises(ValueError):
            self.cart.add("potion", 1.0, 0)

    def test_coupon(self):
        self.cart.add("potion", 10.0, 2)
        self.assertEqual(self.cart.total("SAVE10"), 18.0)
        self.assertEqual(self.cart.total(), 20.0)

    def test_remove(self):
        self.cart.add("potion", 10.0)
        self.cart.remove("potion")
        self.assertEqual(self.cart.count(), 0)
`)],
    hints:['One test per rule: accumulate, count units, negative price, zero qty, coupon, remove, rounding.','Use numbers that tell mutants apart: coupon on 20.0 must be 18.0 (not 16.0); count of mixed items 5 (not 2 lines).','Rounding: add("candy", 0.1, 3) and expect total() == 0.3 exactly. Removing twice: the 2nd must raise KeyError.',p24(c24)]},
  power:{can:['Judge a test suite with mutation thinking','Write tests that pin down every business rule of a class'],
    expand:'Invent an eighth mutant yourself (say, tax added twice) and make sure your suite catches it.',
    where:'Mutation testing tools (mutmut, cosmic-ray) automate exactly this in large projects.',
    next:'Next: code quality: linters and style.'},
  codex:{title:'Mutation thinking',body:'A mutant is a deliberately broken copy of your code; good tests catch every one. Use values that separate the mutants. Equivalent mutants cannot be caught. Surviving mutants = weak tests.',snip:R`for label, impl in MUTANTS.items():
    caught = not judge(TestCart, "Cart", impl)`}
}
);
