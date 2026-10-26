// REALM 7 — THE WARDS — part B (lessons 10-18: errors)
LESSONS.push(
{
  id:'r7-10', realm:7, n:10, title:'try / except: catching an error',
  teaches:['err-try'], requires:['rec-nested'],
  story:`Hopper steps out of the mirrors and takes off her cap. A small brown moth is pinned to the lining. "The first computer **bug**, 1947, a real moth in a relay. We've been catching them ever since. The Wards teach a program to **catch its own errors** instead of falling over."`,
  concept:{
    html:`So far an error ends your program. \`try/except\` lets you **catch** it and carry on:\n\n\`\`\`\ntext = input("Number: ")\ntry:\n    n = int(text)\n    print(n * 2)\nexcept ValueError:\n    print("Not a number")\n\`\`\`\n\n- Python runs the \`try\` block. If an error of the named type happens, it **jumps** to the \`except\` block.\n- If nothing goes wrong, the \`except\` block is skipped.\n- Lines after the \`try\` statement continue either way.\n\nThis is better than guessing in advance with \`isdigit()\`: it handles negatives, spaces and anything you did not think of.`,
    analogy:`A safety net under a trapeze: you only notice it when someone falls.`,
    example:R`text = "abc"
try:
    n = int(text)
    print(n * 2)
except ValueError:
    print("Not a number")
print("Carrying on")`},
  predict:{code:R`try:
    print(int("12"))
except ValueError:
    print("bad")
print("end")`, q:'What prints?', opts:['12\nend','bad\nend','end'], ans:0, why:'No error happens, so the except block is skipped.'},
  cast:{code:R`text = "abc"
try:
    n = int(text)
    print(n * 2)
except ValueError:
    print("Not a number")
print("Carrying on")`, task:'Cast it. Change the text to "21".'},
  bug:{broken:R`text = "abc"
n = int(text)
print(n * 2)
print("Carrying on")`, task:'It crashes before "Carrying on". Catch the ValueError and print Not a number, then carry on.',
    cases:[{inputs:[],tests:[['Handled','lines==["Not a number","Carrying on"]']]}],
    sol:R`text = "abc"
try:
    n = int(text)
    print(n * 2)
except ValueError:
    print("Not a number")
print("Carrying on")`, wrong:[R`text = "abc"
n = int(text)
print(n * 2)
print("Carrying on")`]},
  write:{prompt:'Ask `Number: `. Print double the whole number, or `Not a number` if it cannot be converted. Use `try/except` (not `isdigit`).',
    starter:R`text = input("Number: ")
`,
    inputs:['21'],
    cases:[{inputs:['21'],tests:[['21','lines[-1]=="42"']]},{inputs:['abc'],tests:[['abc','lines[-1]=="Not a number"']]},{inputs:['-4'],tests:[['Negative','lines[-1]=="-8"']]},{inputs:['3.5'],tests:[['Decimal','lines[-1]=="Not a number"']]},{inputs:[''],tests:[['Empty','lines[-1]=="Not a number"']]},{inputs:['  7  '],tests:[['Spaces are fine for int()','lines[-1]=="14"']]},{inputs:['5'],tests:[['Uses try','"try:" in src and "except" in src']]}],
    sol:R`text = input("Number: ")
try:
    n = int(text)
    print(n * 2)
except ValueError:
    print("Not a number")`,
    wrong:[R`text = input("Number: ")
if text.isdigit():
    print(int(text) * 2)
else:
    print("Not a number")`, R`text = input("Number: ")
n = int(text)
print(n * 2)`],
    hints:['Put the conversion and the print inside try:','except ValueError: print("Not a number")','Both branches print exactly one line.','text = input("Number: ")\ntry:\n    n = int(text)\n    print(n * 2)\nexcept ValueError:\n    print("Not a number")']},
  power:{can:['Keep a program running when an error happens','Handle bad input without guessing every case'],
    expand:'Wrap a division in try/except ZeroDivisionError and print a friendly message.',
    where:'Every real program handles bad input, missing files and network failures this way.',
    next:'Next: catching specific errors differently.'},
  codex:{title:'try / except',body:'try: risky code. except ErrorType: what to do if it fails. The program continues afterwards.',snip:R`try:
    n = int(text)
except ValueError:
    ...`}
},
{
  id:'r7-11', realm:7, n:11, title:'Catching specific errors',
  teaches:['err-specific'], requires:['err-try'],
  story:`"A moth in the relay needs a net," Hopper says. "A short circuit needs a fuse. **Different failures, different fixes.** Name the error you are catching."`,
  concept:{
    html:`Use a separate \`except\` for each error you expect:\n\n\`\`\`\ntry:\n    a = int(a_text)\n    b = int(b_text)\n    print(a / b)\nexcept ValueError:\n    print("Not numbers")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\n\`\`\`\n\n**Never** use a bare \`except:\`. It also swallows typos (\`NameError\`), keyboard interrupts and genuine bugs, and hides them from you.\n\nPython picks the **first** matching \`except\`. Catch only what you can actually handle.`,
    analogy:`A hospital triage desk: broken arm to one room, fever to another.`,
    example:R`a_text, b_text = "7", "0"
try:
    a = int(a_text)
    b = int(b_text)
    print(a / b)
except ValueError:
    print("Not numbers")
except ZeroDivisionError:
    print("Cannot divide by zero")`},
  predict:{code:R`try:
    print(1 / 0)
except ValueError:
    print("V")
except ZeroDivisionError:
    print("Z")`, q:'What prints?', opts:['Z','V','Error'], ans:0, why:'The error is ZeroDivisionError, so that handler runs.'},
  cast:{code:R`a_text, b_text = "7", "0"
try:
    a = int(a_text)
    b = int(b_text)
    print(a / b)
except ValueError:
    print("Not numbers")
except ZeroDivisionError:
    print("Cannot divide by zero")`, task:'Cast it. Try "x" for the first value.'},
  bug:{broken:R`a, b = "7", "0"
try:
    print(int(a) / int(b))
except ValueError:
    print("Not numbers")`, task:'ZeroDivisionError slips through. Add a handler that prints Cannot divide by zero.',
    cases:[{inputs:[],tests:[['Handled','lines==["Cannot divide by zero"]']]}],
    sol:R`a, b = "7", "0"
try:
    print(int(a) / int(b))
except ValueError:
    print("Not numbers")
except ZeroDivisionError:
    print("Cannot divide by zero")`, wrong:[R`a, b = "7", "0"
try:
    print(int(a) / int(b))
except ValueError:
    print("Not numbers")`]},
  write:{prompt:'Ask `A: ` and `B: `. Print `A / B` (as a float), or `Not numbers` if either is not a whole number, or `Cannot divide by zero`. No bare `except:`.',
    starter:R`a_text = input("A: ")
b_text = input("B: ")
`,
    inputs:['10','4'],
    cases:[{inputs:['10','4'],tests:[['10/4','lines[-1]=="2.5"']]},{inputs:['7','0'],tests:[['Zero','lines[-1]=="Cannot divide by zero"']]},{inputs:['x','2'],tests:[['First bad','lines[-1]=="Not numbers"']]},{inputs:['1','x'],tests:[['Second bad','lines[-1]=="Not numbers"']]},{inputs:['9','3'],tests:[['9/3','lines[-1]=="3.0"']]},{inputs:['4','2'],tests:[['No bare except','"except:" not in src.replace(" ","")']]}],
    sol:R`a_text = input("A: ")
b_text = input("B: ")
try:
    a = int(a_text)
    b = int(b_text)
    print(a / b)
except ValueError:
    print("Not numbers")
except ZeroDivisionError:
    print("Cannot divide by zero")`,
    wrong:[R`a_text = input("A: ")
b_text = input("B: ")
try:
    a = int(a_text)
    b = int(b_text)
    print(a / b)
except:
    print("Not numbers")`, R`a_text = input("A: ")
b_text = input("B: ")
try:
    a = int(a_text)
    b = int(b_text)
    print(a / b)
except ValueError:
    print("Not numbers")`],
    hints:['Convert both inside one try block and print a / b.','except ValueError → Not numbers.','except ZeroDivisionError → Cannot divide by zero.','a_text = input("A: ")\nb_text = input("B: ")\ntry:\n    a = int(a_text)\n    b = int(b_text)\n    print(a / b)\nexcept ValueError:\n    print("Not numbers")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")']},
  power:{can:['Handle different failures differently','Avoid the bare except trap'],
    expand:'Add a third handler for a missing second value.',
    where:'Precise handlers keep real bugs visible while handling the failures you expect.',
    next:'Next: else and finally.'},
  codex:{title:'Specific excepts',body:'One except per error type. Never use a bare except:.',snip:R`except ZeroDivisionError:`}
},
{
  id:'r7-12', realm:7, n:12, title:'else and finally',
  teaches:['err-else-finally'], requires:['err-specific'],
  story:`"Two more doors in the Ward," Hopper says. "One opens only when *nothing went wrong*. The other opens **no matter what**, even in disaster."`,
  concept:{
    html:`A full \`try\` statement has up to four parts:\n\n\`\`\`\ntry:\n    n = int(text)          # risky\nexcept ValueError:\n    print("Invalid")       # runs only on that error\nelse:\n    print("Half:", n / 2)  # runs only if NO error\nfinally:\n    print("Done")          # ALWAYS runs\n\`\`\`\n\n- \`else\` keeps your **success code** out of the \`try\` so it can't hide unrelated errors.\n- \`finally\` is for **clean-up** that must happen regardless: closing a file, printing a footer, releasing a lock.\n\n\`finally\` even runs when the \`try\` block ends with a \`return\`.`,
    analogy:`Hotel check-out: whether the stay was good or bad, you always return the key.`,
    example:R`text = "8"
try:
    n = int(text)
except ValueError:
    print("Invalid")
else:
    print("Half:", n / 2)
finally:
    print("Done")`},
  predict:{code:R`try:
    x = 1
except ValueError:
    print("E")
else:
    print("else")
finally:
    print("fin")`, q:'What prints?', opts:['else\nfin','E\nfin','fin'], ans:0, why:'No error: else runs, then finally always runs.'},
  cast:{code:R`text = "8"
try:
    n = int(text)
except ValueError:
    print("Invalid")
else:
    print("Half:", n / 2)
finally:
    print("Done")`, task:'Cast it. Then try "x".'},
  bug:{broken:R`def f():
    try:
        return "try"
    finally:
        print("cleanup")

print(f())`, task:'`finally` runs before the caller sees the returned value, so "cleanup" prints first. Make the output try, then cleanup: let f just return, and print "cleanup" after the call.',
    cases:[{inputs:[],tests:[['Order','lines==["try","cleanup"]']]}],
    sol:R`def f():
    try:
        return "try"
    finally:
        pass

print(f())
print("cleanup")`, wrong:[R`def f():
    try:
        return "try"
    finally:
        print("cleanup")

print(f())`]},
  write:{prompt:'Ask `Number: `. Use `try/except/else/finally`: on a bad number print `Invalid`; otherwise print `Half: ` and half the number (a float); and **always** print `Done` last.',
    starter:R`text = input("Number: ")
`,
    inputs:['8'],
    cases:[{inputs:['8'],tests:[['Good','lines[-2:]==["Half: 4.0","Done"]'],['Uses finally and else','"finally:" in src and "else:" in src']]},{inputs:['x'],tests:[['Bad','lines[-2:]==["Invalid","Done"]']]},{inputs:['-3'],tests:[['Negative','lines[-2:]==["Half: -1.5","Done"]']]},{inputs:['0'],tests:[['Zero','lines[-2:]==["Half: 0.0","Done"]']]}],
    sol:R`text = input("Number: ")
try:
    n = int(text)
except ValueError:
    print("Invalid")
else:
    print("Half:", n / 2)
finally:
    print("Done")`,
    wrong:[R`text = input("Number: ")
try:
    n = int(text)
    print("Half:", n / 2)
except ValueError:
    print("Invalid")
print("Done")`, R`text = input("Number: ")
try:
    n = int(text)
except ValueError:
    print("Invalid")
else:
    print("Half:", n / 2)
print("Done")`],
    hints:['try: n = int(text). except ValueError: print Invalid.','else: print("Half:", n / 2). finally: print("Done").','Remember the colons after else and finally.','text = input("Number: ")\ntry:\n    n = int(text)\nexcept ValueError:\n    print("Invalid")\nelse:\n    print("Half:", n / 2)\nfinally:\n    print("Done")']},
  power:{can:['Separate risky code from success code','Guarantee clean-up always happens'],
    expand:'Add a finally to a file-reading script so the file is always closed.',
    where:'Clean-up guarantees are what keep servers and files healthy.',
    next:'Next: raising your own errors.'},
  codex:{title:'else and finally',body:'else runs only if no error. finally always runs. Both follow the except blocks.',snip:R`try: ...
except E: ...
else: ...
finally: ...`}
},
{
  id:'r7-13', realm:7, n:13, title:'raise: signalling your own errors',
  teaches:['err-raise'], requires:['err-else-finally'],
  story:`"Catching is half the craft," Hopper says. "The other half: when *your* function is handed nonsense, say so **loudly**, rather than quietly returning a wrong answer."`,
  concept:{
    html:`Use \`raise\` to signal that something is wrong:\n\n\`\`\`\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("Amount must be positive")\n    if amount > balance:\n        raise ValueError("Insufficient funds")\n    return balance - amount\n\`\`\`\n\nThe caller decides what to do:\n\n\`\`\`\ntry:\n    print(withdraw(100, 500))\nexcept ValueError as e:\n    print("Error:", e)\n\`\`\`\n\n- \`as e\` captures the error object; \`print(e)\` shows its message.\n- Pick the **right type**: \`ValueError\` for a bad value, \`TypeError\` for a wrong kind of thing, \`KeyError\` for a missing key.\n- Raising ends the function immediately, like \`return\`.\n\nWhy not return \`None\` or \`-1\`? Callers forget to check. An exception **cannot be ignored by accident**.`,
    analogy:`A smoke alarm instead of a quiet note on the fridge.`,
    example:R`def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    print(withdraw(100, 500))
except ValueError as e:
    print("Error:", e)`},
  predict:{code:R`def f(x):
    if x < 0:
        raise ValueError("negative")
    return x

try:
    f(-1)
except ValueError as e:
    print(e)`, q:'What prints?', opts:['negative','-1','ValueError'], ans:0, why:'print(e) shows the message the error was raised with.'},
  cast:{code:R`def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    print(withdraw(100, 500))
except ValueError as e:
    print("Error:", e)`, task:'Cast it. Try other amounts.'},
  bug:{broken:R`def withdraw(balance, amount):
    if amount > balance:
        return "Insufficient funds"
    return balance - amount

new_balance = withdraw(100, 500) - 10
print(new_balance)`, task:'The error message was returned like a number and then used in maths (TypeError). Raise a ValueError instead and catch it to print Error: Insufficient funds.',
    cases:[{inputs:[],tests:[['Printed','lines==["Error: Insufficient funds"]'],['Uses raise','"raise ValueError" in src']]}],
    sol:R`def withdraw(balance, amount):
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

try:
    new_balance = withdraw(100, 500) - 10
    print(new_balance)
except ValueError as e:
    print("Error:", e)`, wrong:[R`def withdraw(balance, amount):
    if amount > balance:
        return "Insufficient funds"
    return balance - amount

new_balance = withdraw(100, 500) - 10
print(new_balance)`]},
  write:{prompt:'Write `withdraw(balance, amount)` that raises `ValueError("Amount must be positive")` for an amount of 0 or less and `ValueError("Insufficient funds")` if the amount exceeds the balance; otherwise returns the new balance. Then call it for amounts 30, 0 and 500 against a balance of 100, printing the new balance or `Error: <message>`.',
    starter:R`# define withdraw, then try the three amounts
`,
    cases:[{inputs:[],tests:[['Printed','lines==["70","Error: Amount must be positive","Error: Insufficient funds"]'],['Normal','g["withdraw"](50,10)==40'],['Exactly all','g["withdraw"](50,50)==0'],['Raises on zero','__import__("unittest").TestCase().assertRaises(ValueError, g["withdraw"], 50, 0) is None'],['Raises on too much','__import__("unittest").TestCase().assertRaises(ValueError, g["withdraw"], 50, 51) is None'],['Uses raise','"raise ValueError" in src']]}],
    sol:R`def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount > balance:
        raise ValueError("Insufficient funds")
    return balance - amount

for amount in (30, 0, 500):
    try:
        print(withdraw(100, amount))
    except ValueError as e:
        print("Error:", e)`,
    wrong:[R`def withdraw(balance, amount):
    if amount <= 0:
        return "Amount must be positive"
    if amount > balance:
        return "Insufficient funds"
    return balance - amount

for amount in (30, 0, 500):
    result = withdraw(100, amount)
    if isinstance(result, str):
        print("Error:", result)
    else:
        print(result)`, R`def withdraw(balance, amount):
    if amount <= 0:
        raise ValueError("Amount must be positive")
    if amount >= balance:
        raise ValueError("Insufficient funds")
    return balance - amount

for amount in (30, 0, 500):
    try:
        print(withdraw(100, amount))
    except ValueError as e:
        print("Error:", e)`],
    hints:['raise ValueError("message") for each bad case, before the return.','Order: positive check, then funds check.','Loop over (30, 0, 500) with try/except ValueError as e: print("Error:", e).','def withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("Amount must be positive")\n    if amount > balance:\n        raise ValueError("Insufficient funds")\n    return balance - amount\n\nfor amount in (30, 0, 500):\n    try:\n        print(withdraw(100, amount))\n    except ValueError as e:\n        print("Error:", e)']},
  power:{can:['Signal bad input loudly','Catch an error and show its message'],
    expand:'Raise a TypeError when the amount is not a number.',
    where:'Libraries use raise to enforce their rules; your functions should too.',
    next:'Next: validation functions that raise, with a caller that retries.'},
  codex:{title:'raise',body:'raise ValueError("message") signals a problem. except ValueError as e: print(e) shows the message.',snip:R`raise ValueError("Insufficient funds")`}
},
{
  id:'r7-14', realm:7, n:14, title:'Validation with exceptions',
  teaches:['err-validate'], requires:['err-raise','fn-validate'],
  story:`"Split the job," Hopper says, handing you two keys. "One function **judges** the input and raises if it's wrong. A second asks again until the judge is satisfied."`,
  concept:{
    html:`A clean pattern: a **validator** raises; the **caller** catches and retries.\n\n\`\`\`\ndef parse_age(text):\n    if not text.isdigit():\n        raise ValueError("Age must be a number")\n    age = int(text)\n    if not 1 <= age <= 120:\n        raise ValueError("Age must be 1-120")\n    return age\n\nwhile True:\n    try:\n        age = parse_age(input("Age: "))\n        break\n    except ValueError as e:\n        print("Error:", e)\n\`\`\`\n\n- The validator has **one job** and is easy to test.\n- The messages come from the **place that knows what is wrong**.\n- The loop decides what to do about it: retry, give up, or log.`,
    analogy:`A bouncer who explains why you're refused, and a queue that lets you try again.`,
    example:R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    age = int(text)
    if not 1 <= age <= 120:
        raise ValueError("Age must be 1-120")
    return age

print(parse_age("30"))`},
  predict:{code:R`def check(n):
    if n < 0:
        raise ValueError("neg")
    return n

for x in (1, -1, 2):
    try:
        print(check(x))
    except ValueError:
        print("bad")`, q:'What prints?', opts:['1\nbad\n2','1\nbad','bad'], ans:0, why:'Each iteration has its own try, so the loop continues after the error.'},
  cast:{code:R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    age = int(text)
    if not 1 <= age <= 120:
        raise ValueError("Age must be 1-120")
    return age

print(parse_age("30"))`, task:'Cast it. Try parse_age("abc") yourself.'},
  bug:{broken:R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    return int(text)

try:
    print(parse_age("abc"))
except TypeError as e:
    print("Error:", e)`, task:'Wrong error type is caught, so it crashes. The validator raises ValueError.',
    cases:[{inputs:[],tests:[['Handled','lines==["Error: Age must be a number"]']]}],
    sol:R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    return int(text)

try:
    print(parse_age("abc"))
except ValueError as e:
    print("Error:", e)`, wrong:[R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    return int(text)

try:
    print(parse_age("abc"))
except TypeError as e:
    print("Error:", e)`]},
  write:{prompt:'Write `parse_age(text)` that raises `ValueError("Age must be a number")` for non-digits and `ValueError("Age must be 1-120")` for out-of-range, else returns the int. Then loop: ask `Age: `, catch the error and print `Error: <message>`, until valid; finally print `Age: n`.',
    starter:R`# define parse_age and the retry loop
`,
    inputs:['abc','200','30'],
    cases:[{inputs:['abc','200','30'],tests:[['Errors then success','[l for l in lines if l.startswith("Error")]==["Error: Age must be a number","Error: Age must be 1-120"] and lines[-1]=="Age: 30"']]},{inputs:['25'],tests:[['Straight in','lines[-1]=="Age: 25" and not any(l.startswith("Error") for l in lines)']]},{inputs:['0','1'],tests:[['Zero rejected','lines[-1]=="Age: 1" and "Error: Age must be 1-120" in lines']]},{inputs:['121','120'],tests:[['Edge','lines[-1]=="Age: 120" and "Error: Age must be 1-120" in lines']]},{inputs:['30'],tests:[['parse_age works and raises','g["parse_age"]("40")==40 and __import__("unittest").TestCase().assertRaises(ValueError, g["parse_age"], "x") is None and __import__("unittest").TestCase().assertRaises(ValueError, g["parse_age"], "0") is None']]}],
    sol:R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    age = int(text)
    if not 1 <= age <= 120:
        raise ValueError("Age must be 1-120")
    return age

while True:
    try:
        age = parse_age(input("Age: "))
        break
    except ValueError as e:
        print("Error:", e)
print("Age:", age)`,
    wrong:[R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    return int(text)

while True:
    try:
        age = parse_age(input("Age: "))
        break
    except ValueError as e:
        print("Error:", e)
print("Age:", age)`, R`def parse_age(text):
    if not text.isdigit():
        raise ValueError("Age must be a number")
    age = int(text)
    if not 1 <= age <= 120:
        raise ValueError("Age must be 1-120")
    return age

age = parse_age(input("Age: "))
print("Age:", age)`],
    hints:['parse_age checks isdigit, converts, then checks the range, raising ValueError each time.','while True: try: age = parse_age(input("Age: ")); break.','except ValueError as e: print("Error:", e). After the loop print Age.','def parse_age(text):\n    if not text.isdigit():\n        raise ValueError("Age must be a number")\n    age = int(text)\n    if not 1 <= age <= 120:\n        raise ValueError("Age must be 1-120")\n    return age\n\nwhile True:\n    try:\n        age = parse_age(input("Age: "))\n        break\n    except ValueError as e:\n        print("Error:", e)\nprint("Age:", age)']},
  power:{can:['Separate validating from retrying','Show users specific, helpful error messages'],
    expand:'Add a parse_email validator and loop for it the same way.',
    where:'Web forms, APIs and apps do exactly this: validate, explain, retry.',
    next:'Next: ask forgiveness or permission?'},
  codex:{title:'Validators that raise',body:'A validator raises ValueError with a clear message; a loop catches, reports and retries.',snip:R`except ValueError as e:
    print("Error:", e)`}
},
{
  id:'r7-15', realm:7, n:15, title:'Look before you leap, or ask forgiveness?',
  teaches:['err-eafp'], requires:['err-validate'],
  story:`"Two schools in the Wards," Hopper says. "One *checks first* that the door is open. The other just walks through and apologises if it hits the wall. Python mostly prefers the second."`,
  concept:{
    html:`Two styles:\n\n- **LBYL**: *Look Before You Leap*: check first with \`if\`.\n- **EAFP**: *Easier to Ask Forgiveness than Permission*: just try, then catch the error.\n\n\`\`\`\n# LBYL\nif index < len(data):\n    value = data[index]\n\n# EAFP\ntry:\n    value = data[index]\nexcept IndexError:\n    value = None\n\`\`\`\n\nEAFP wins when:\n- the check is **hard to get right** (negative indexes! \`data[-1]\` is valid, so \`index < len(data)\` alone isn't enough)\n- the check and the action can get **out of sync** (a file deleted between check and open)\n- the normal case is the **common** one\n\nLBYL wins when the check is **cheap and obvious**, or when failing has side effects.`,
    analogy:`Just open the door and handle a locked one vs phoning ahead to ask if it's open.`,
    example:R`data = [10, 20, 30]
for i in (1, 5, -1):
    try:
        print(data[i])
    except IndexError:
        print("none")`},
  predict:{code:R`data = [1, 2]
try:
    print(data[-1])
except IndexError:
    print("none")`, q:'What prints?', opts:['2','none','1'], ans:0, why:'Negative indexes count from the end, so -1 is valid.'},
  cast:{code:R`data = [10, 20, 30]
for i in (1, 5, -1):
    try:
        print(data[i])
    except IndexError:
        print("none")`, task:'Cast it.'},
  bug:{broken:R`def safe_get(data, index, default=None):
    if 0 <= index < len(data):
        return data[index]
    return default

print(safe_get([1, 2], -1))`, task:'The check wrongly rejects the valid index -1. Use try/except so the answer is 2.',
    cases:[{inputs:[],tests:[['Prints 2','out.strip()=="2"'],['Uses try','"try:" in src']]}],
    sol:R`def safe_get(data, index, default=None):
    try:
        return data[index]
    except IndexError:
        return default

print(safe_get([1, 2], -1))`, wrong:[R`def safe_get(data, index, default=None):
    if 0 <= index < len(data):
        return data[index]
    return default

print(safe_get([1, 2], -1))`]},
  write:{prompt:'Write `safe_get(data, index, default=None)` using `try/except IndexError` (EAFP). Print `safe_get(letters, 1)` and `safe_get(letters, 9, "?")`.',
    starter:R`letters = ["a", "b", "c"]
`,
    cases:[{inputs:[],tests:[['Printed','lines==["b","?"]'],['Negative index','g["safe_get"]([1,2],-1)==2'],['Too far negative','g["safe_get"]([1,2],-3,"x")=="x"'],['Empty list','g["safe_get"]([],0) is None'],['Default used','g["safe_get"]([5],4,"d")=="d"'],['Uses try','"try:" in src and "except IndexError" in src']]}],
    sol:R`letters = ["a", "b", "c"]

def safe_get(data, index, default=None):
    try:
        return data[index]
    except IndexError:
        return default

print(safe_get(letters, 1))
print(safe_get(letters, 9, "?"))`,
    wrong:[R`letters = ["a", "b", "c"]

def safe_get(data, index, default=None):
    if 0 <= index < len(data):
        return data[index]
    return default

print(safe_get(letters, 1))
print(safe_get(letters, 9, "?"))`, R`letters = ["a", "b", "c"]

def safe_get(data, index, default=None):
    try:
        return data[index]
    except IndexError:
        return None

print(safe_get(letters, 1))
print(safe_get(letters, 9, "?"))`],
    hints:['try: return data[index].','except IndexError: return default.','Call it for index 1 and for index 9 with default "?".','letters = ["a", "b", "c"]\n\ndef safe_get(data, index, default=None):\n    try:\n        return data[index]\n    except IndexError:\n        return default\n\nprint(safe_get(letters, 1))\nprint(safe_get(letters, 9, "?"))']},
  power:{can:['Choose between checking first and catching later','Write the Pythonic try-it style'],
    expand:'Write safe_div(a, b, default=0) using EAFP.',
    where:'Python\'s own libraries lean on EAFP, so reading them gets easier.',
    next:'Next: an input helper that never crashes.'},
  codex:{title:'EAFP vs LBYL',body:'LBYL checks with if. EAFP tries and catches. Python often prefers EAFP.',snip:R`try:
    value = data[i]
except IndexError: ...`}
},
{
  id:'r7-16', realm:7, n:16, title:'A crash-proof ask_float',
  teaches:['err-safe-input'], requires:['err-eafp'],
  story:`"Now a ward at the door," Hopper says. "Anything the visitor types, the program must survive: letters, blanks, emoji, a cat on the keyboard."`,
  concept:{
    html:`Combine a loop, a function and try/except into a reusable helper:\n\n\`\`\`\ndef ask_float(prompt):\n    while True:\n        text = input(prompt)\n        try:\n            return float(text)\n        except ValueError:\n            print("Invalid number")\n\`\`\`\n\n- \`float()\` accepts \`"2.5"\`, \`"-1.5"\`, \`" 7 "\` and even \`"1e2"\`, so you don't have to guess what a "number" looks like.\n- \`return\` inside \`try\` exits the function on success.\n- Loop until it works: the helper **never** returns garbage and **never** crashes.\n\nCompare this to the \`isdigit()\` version: it rejected negatives and decimals. Letting Python try is more accurate.`,
    analogy:`A door that politely refuses until you present a valid ticket.`,
    example:R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            return float(text)
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(x)`},
  predict:{code:R`print(float("1e2"), float(" 7 "))`, q:'What prints?', opts:['100.0 7.0','Error','1e2 7'], ans:0, why:'float understands scientific notation and ignores surrounding spaces.'},
  cast:{code:R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            return float(text)
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(x)`, task:'Cast it with inputs: abc, 2.5.', inputs:['abc','2.5']},
  bug:{broken:R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            float(text)
            break
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(x)`, task:'It breaks out but returns None. Return the converted number.',
    cases:[{inputs:['2.5'],tests:[['Prints 2.5','lines[-1]=="2.5"']]}],
    sol:R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            return float(text)
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(x)`, wrong:[R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            float(text)
            break
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(x)`]},
  write:{prompt:'Write `ask_float(prompt)` that keeps asking, printing `Invalid number` after every bad answer, and **returns** the float. Use it: `x = ask_float("Number: ")` then `print(f"You entered {x:.2f}")`.',
    starter:R`# define ask_float, then use it
`,
    inputs:['abc','','2.5'],
    cases:[{inputs:['abc','','2.5'],tests:[['Two retries','lines.count("Invalid number")==2 and lines[-1]=="You entered 2.50"']]},{inputs:['-1.5'],tests:[['Negative','lines[-1]=="You entered -1.50" and "Invalid number" not in lines']]},{inputs:['1e2'],tests:[['Scientific','lines[-1]=="You entered 100.00"']]},{inputs:['7'],tests:[['Whole','lines[-1]=="You entered 7.00"']]},{inputs:['x','y','z','3'],tests:[['Many retries','lines.count("Invalid number")==3 and lines[-1]=="You entered 3.00"']]}],
    sol:R`def ask_float(prompt):
    while True:
        text = input(prompt)
        try:
            return float(text)
        except ValueError:
            print("Invalid number")

x = ask_float("Number: ")
print(f"You entered {x:.2f}")`,
    wrong:[R`def ask_float(prompt):
    while True:
        text = input(prompt)
        if text.replace(".", "", 1).isdigit():
            return float(text)
        print("Invalid number")

x = ask_float("Number: ")
print(f"You entered {x:.2f}")`, R`def ask_float(prompt):
    text = input(prompt)
    try:
        return float(text)
    except ValueError:
        print("Invalid number")

x = ask_float("Number: ")
print(f"You entered {x:.2f}")`],
    hints:['while True: ask, then try: return float(text).','except ValueError: print("Invalid number") and loop again.','Format the result with :.2f.','def ask_float(prompt):\n    while True:\n        text = input(prompt)\n        try:\n            return float(text)\n        except ValueError:\n            print("Invalid number")\n\nx = ask_float("Number: ")\nprint(f"You entered {x:.2f}")']},
  power:{can:['Build crash-proof input helpers','Trust float()/int() to judge input'],
    expand:'Add low/high limits and raise or retry for numbers outside them.',
    where:'Every console tool and every game needs this helper.',
    next:'Next: catching several error types and reading the error.'},
  codex:{title:'ask_float',body:'while True + try: return float(text) + except ValueError: retry.',snip:R`try:
    return float(text)
except ValueError: ...`}
},
{
  id:'r7-17', realm:7, n:17, title:'Several errors, and as e',
  teaches:['err-multi'], requires:['err-safe-input','fn-args'],
  story:`"Last piece of the net," Hopper says. "Sometimes you want to catch a *family* of errors, or just record **what** went wrong and keep going."`,
  concept:{
    html:`**Catch several types at once** with a tuple:\n\n\`\`\`\nexcept (ValueError, TypeError):\n    ...\n\`\`\`\n\n**Capture the error** with \`as e\`, and ask for its type and message:\n\n\`\`\`\nexcept Exception as e:\n    print(type(e).__name__, "-", e)\n\`\`\`\n\nErrors form a **family tree**. \`Exception\` is the parent of almost everything you'll meet (\`ValueError\`, \`TypeError\`, \`KeyError\`, \`IndexError\`, \`ZeroDivisionError\` ...). So \`except Exception\` catches nearly all of them.\n\nUse \`except Exception as e\` only at a **boundary** (a program's outer loop, a plugin runner) where you want to log and keep going, and put specific handlers **first**.`,
    analogy:`A building's front desk: a specific team for each problem, one general desk for the rest.`,
    example:R`def safe_call(func, *args):
    try:
        return ("ok", func(*args))
    except Exception as e:
        return ("error", type(e).__name__)

print(safe_call(int, "5"))
print(safe_call(int, "x"))`},
  predict:{code:R`try:
    {}["a"]
except Exception as e:
    print(type(e).__name__)`, q:'What prints?', opts:['KeyError','Exception','a'], ans:0, why:'type(e).__name__ is the specific error class, which is KeyError.'},
  cast:{code:R`def safe_call(func, *args):
    try:
        return ("ok", func(*args))
    except Exception as e:
        return ("error", type(e).__name__)

print(safe_call(int, "5"))
print(safe_call(int, "x"))`, task:'Cast it.'},
  bug:{broken:R`try:
    print(len(5))
except ValueError:
    print("bad value")`, task:'len(5) raises TypeError, which this does not catch. Catch both ValueError and TypeError in one handler. Expected: bad value',
    cases:[{inputs:[],tests:[['Handled','lines==["bad value"]'],['Tuple of errors','"(ValueError, TypeError)" in src or "(TypeError, ValueError)" in src']]}],
    sol:R`try:
    print(len(5))
except (ValueError, TypeError):
    print("bad value")`, wrong:[R`try:
    print(len(5))
except ValueError:
    print("bad value")`]},
  write:{prompt:'Write `safe_call(func, *args)` returning `("ok", result)` or `("error", "<ErrorClassName>")` if the call raises. Then print `safe_call(int, "5")`, `safe_call(int, "x")`, `safe_call(len, 5)` and `safe_call(divmod, 1, 0)`.',
    starter:R`# define safe_call
`,
    cases:[{inputs:[],tests:[['Printed','lines==["(\'ok\', 5)","(\'error\', \'ValueError\')","(\'error\', \'TypeError\')","(\'error\', \'ZeroDivisionError\')"]'],['Direct','g["safe_call"](int,"7")==("ok",7)'],['Lambda','g["safe_call"](lambda: {}["k"])==("error","KeyError")'],['No args','g["safe_call"](list)==("ok",[])'],['Not bare','"except:" not in src.replace(" ","")']]}],
    sol:R`def safe_call(func, *args):
    try:
        return ("ok", func(*args))
    except Exception as e:
        return ("error", type(e).__name__)

print(safe_call(int, "5"))
print(safe_call(int, "x"))
print(safe_call(len, 5))
print(safe_call(divmod, 1, 0))`,
    wrong:[R`def safe_call(func, *args):
    try:
        return ("ok", func(*args))
    except ValueError:
        return ("error", "ValueError")

print(safe_call(int, "5"))
print(safe_call(int, "x"))
print(safe_call(len, 5))
print(safe_call(divmod, 1, 0))`, R`def safe_call(func, *args):
    try:
        return ("ok", func(*args))
    except Exception as e:
        return ("error", str(e))

print(safe_call(int, "5"))
print(safe_call(int, "x"))
print(safe_call(len, 5))
print(safe_call(divmod, 1, 0))`],
    hints:['Wrap return ("ok", func(*args)) in a try.','except Exception as e: return ("error", type(e).__name__).','type(e).__name__ is the class name as text.','def safe_call(func, *args):\n    try:\n        return ("ok", func(*args))\n    except Exception as e:\n        return ("error", type(e).__name__)\n\nprint(safe_call(int, "5"))\nprint(safe_call(int, "x"))\nprint(safe_call(len, 5))\nprint(safe_call(divmod, 1, 0))']},
  power:{can:['Catch families of errors','Report which error happened'],
    expand:'Log every failure to a list as (func name, error name) instead of printing.',
    where:'Task runners, web servers and test frameworks all wrap work in a boundary like this.',
    next:'Next: reading tracebacks through nested function calls.'},
  codex:{title:'Several errors',body:'except (A, B): groups types. except Exception as e: catches nearly all. type(e).__name__ names the error.',snip:R`except Exception as e:
    print(type(e).__name__, e)`}
},
{
  id:'r7-18', realm:7, n:18, title:'Reading a traceback through nested calls',
  teaches:['err-traceback'], requires:['err-multi'],
  story:`Hopper unrolls a long scroll of error text. "Beginners see a wall. A ward-keeper sees a **map**: read it from the bottom up, and it points straight at the break."`,
  concept:{
    html:`When an error passes through several function calls, Python prints a **traceback**: a stack of the calls that were active.\n\n\`\`\`\nTraceback (most recent call last):\n  File "<spell>", line 9, in <module>\n    print(total("12,x,5"))\n  File "<spell>", line 5, in total\n    return sum(parse_numbers(text))\n  File "<spell>", line 2, in parse_numbers\n    return [int(p) for p in text.split(",")]\nValueError: invalid literal for int() with base 10: 'x'\n\`\`\`\n\nHow to read it:\n\n1. **Last line first**: *what* happened (\`ValueError ... 'x'\`).\n2. **Bottom frame**: *where* it happened (\`parse_numbers\`, line 2).\n3. **Frames above it**: *how* we got there (the chain of callers).\n\nFix at the **source**, or catch it in the right layer.`,
    analogy:`A trail of footprints: the last print shows where the trouble is, the earlier ones show the path.`,
    example:R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    return sum(parse_numbers(text))

print(total("12,5"))`},
  predict:{code:R`def a():
    return 1 / 0

def b():
    return a()

b()`, q:'Which function does the LAST frame of the traceback show?', opts:['a','b','<module>'], ans:0, why:'The error happened inside a; that is the most recent call.'},
  cast:{code:R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    return sum(parse_numbers(text))

print(total("12,x,5"))`, task:'Cast it. Read the traceback from the bottom up.', expectError:true},
  bug:{broken:R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    return sum(parse_numbers(text))

print(total("12,x,5"))`, task:'The traceback points at parse_numbers. Fix it THERE: skip items that are not whole numbers and print `Skipping x` for each. Expected output: Skipping x, then Total: 17.',
    cases:[{inputs:[],tests:[['Skips and totals','lines==["Skipping x","17"]']]}],
    sol:R`def parse_numbers(text):
    result = []
    for p in text.split(","):
        try:
            result.append(int(p))
        except ValueError:
            print("Skipping", p)
    return result

def total(text):
    return sum(parse_numbers(text))

print(total("12,x,5"))`, wrong:[R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    return sum(parse_numbers(text))

print(total("12,x,5"))`]},
  write:{prompt:'Fix `parse_numbers` so bad items are skipped with `Skipping <item>` printed, while `total` stays unchanged. The final line already prints the total.',
    starter:R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    return sum(parse_numbers(text))

print("Total:", total("12,x,5,y,3"))
`,
    cases:[{inputs:[],tests:[['Output','lines==["Skipping x","Skipping y","Total: 20"]'],['parse_numbers good','g["parse_numbers"]("4,5")==[4,5]'],['parse_numbers mixed','g["parse_numbers"]("a,1,-2")==[1,-2]'],['total','g["total"]("7,x,3")==10'],['total unchanged','"sum(parse_numbers(text))" in src']]}],
    sol:R`def parse_numbers(text):
    result = []
    for p in text.split(","):
        try:
            result.append(int(p))
        except ValueError:
            print("Skipping", p)
    return result

def total(text):
    return sum(parse_numbers(text))

print("Total:", total("12,x,5,y,3"))`,
    wrong:[R`def parse_numbers(text):
    return [int(p) for p in text.split(",") if p.isdigit()]

def total(text):
    return sum(parse_numbers(text))

print("Total:", total("12,x,5,y,3"))`, R`def parse_numbers(text):
    return [int(p) for p in text.split(",")]

def total(text):
    try:
        return sum(parse_numbers(text))
    except ValueError:
        return 0

print("Total:", total("12,x,5,y,3"))`],
    hints:['Loop over text.split(",") and build a result list.','try: result.append(int(p)); except ValueError: print("Skipping", p).','Return result. Leave total alone.','def parse_numbers(text):\n    result = []\n    for p in text.split(","):\n        try:\n            result.append(int(p))\n        except ValueError:\n            print("Skipping", p)\n    return result\n\ndef total(text):\n    return sum(parse_numbers(text))\n\nprint("Total:", total("12,x,5,y,3"))']},
  power:{can:['Read tracebacks from the bottom up','Fix an error where it starts rather than where it shows'],
    expand:'Add a docstring to parse_numbers explaining what happens to bad items.',
    where:'Reading a stack trace quickly is the single most useful debugging skill.',
    next:'Next: retrying work a limited number of times.'},
  codex:{title:'Tracebacks',body:'Read the last line (what), then the bottom frame (where), then the frames above (how we got there).',snip:R`ValueError: invalid literal ...`}
}
);
