from gen14 import *

L = []
PREV = 'mission14b'

# ---------------------------------------------------------------- 21 numpy arrays
s21 = r'''import numpy as np

numbers = list(map(int, input("Numbers: ").split()))
arr = np.array(numbers)
print("Doubled:", (arr * 2).tolist())
print("Sum:", int(arr.sum()))
print("Mean:", round(float(arr.mean()), 2))
print("Biggest:", int(arr.max()))'''
L.append(lesson('r14-21', 21, 'NumPy arrays: maths on whole lists at once', ['np-array'], [PREV],
 "The third door of the Hall of Four Doors hums with a cold blue light. Inside, rows of glass jars hold glowing numbers. \"The Data Guild never touches numbers one at a time,\" Quill says. \"They move whole **crowds** with a single spell.\"",
 "A Python list does not know maths: `[1, 2, 3] * 2` just **repeats** it. **NumPy** adds the **array**, a block of numbers that does maths on every element at once:\n\n```\nimport numpy as np\narr = np.array([1, 2, 3])\narr * 2          # array([2, 4, 6])   every element doubled\narr + 10         # array([11, 12, 13])\narr.sum()        # 6\narr.mean()       # 2.0\narr.max()        # 3\n```\n\n- This is called **vectorization**: no loop in your code. NumPy runs the loop in fast compiled code, often 10 to 100 times faster than a Python `for`.\n- All elements share one **type** (`int64`, `float64`...). Mixing ints and floats makes everything float.\n- `arr.tolist()` converts back to a plain list. Printing NumPy numbers directly can show extra decoration, so convert with `int(...)`, `float(...)` or `.tolist()` for clean output.\n- `arr.mean()` is a float even for whole numbers.\n- Arrays do **element-wise** maths: `a + b` adds matching positions (they need the same length, or compatible shapes, see the next lesson).\n- Beware: for *tiny* data a plain list is fine. NumPy shines on thousands to millions of numbers.",
 "A conductor raising one arm so the whole orchestra plays the same note change at once.",
 r'''import numpy as np
arr = np.array([4, 8, 15])
print((arr + 1).tolist(), arr.sum())''',
 predict(r'''import numpy as np
print((np.array([1, 2, 3]) * 2).tolist())''', 'What prints?', ['[2, 4, 6]', '[1, 2, 3, 1, 2, 3]', '[1, 2, 3, 2]'], 0, 'On a NumPy array, * 2 doubles every element. (On a plain list it would repeat the list.)'),
 dict(broken=r'''data = [1, 2, 3]
print(data * 2)''', task='Multiplying a list repeats it. Turn `data` into a NumPy array so every element is doubled. Expected: `[2, 4, 6]`',
  sol=r'''import numpy as np
data = [1, 2, 3]
print((np.array(data) * 2).tolist())''', extra=[('Uses an array', '"np.array" in src')], wrong=[r'''print([2, 4, 6])''']),
 dict(prompt='Ask `Numbers: ` (whole numbers separated by spaces; the list `numbers` is given). Make a NumPy array `arr` from it and print `Doubled: <list>`, `Sum: <whole number>`, `Mean: <rounded to 2 decimals>` and `Biggest: <whole number>`.',
  starter=r'''import numpy as np

numbers = list(map(int, input("Numbers: ").split()))
''',
  cases=[dict(inputs=['1 2 3 4'], name='Four numbers', extra=[('arr is a NumPy array', 'type(g["arr"]).__name__ == "ndarray"')]), dict(inputs=['10'], name='One number'), dict(inputs=['5 -3 8 8 0'], name='Negatives'), dict(inputs=['2 4 100'], name='Skewed')],
  sol=s21,
  wrong=[('(arr * 2).tolist()', '(arr + 2).tolist()'), ('(arr * 2).tolist()', 'numbers * 2'), ('int(arr.sum())', 'int(arr.max())'), ('arr.mean()', 'np.median(arr)'), ('int(arr.max())', 'int(arr.min())')],
  hints=['arr = np.array(numbers) turns the list into an array.', 'arr * 2 doubles every element; use .tolist() so it prints like a normal list.', 'Use arr.sum(), arr.mean() and arr.max(); wrap in int(...) / round(float(...), 2) for tidy output.']),
 dict(can=['Do maths on whole lists without a loop', 'Explain vectorization'], expand='Compare `sum(x * x for x in numbers)` with `(arr * arr).sum()` on a million numbers using `perf_counter`.', where='Image processing, finance, physics and machine learning all run on NumPy arrays.', next='Next: two-dimensional arrays and broadcasting.'),
 dict(title='NumPy arrays', body='np.array(list); arr * 2, arr + 1 are element-wise (vectorized). arr.sum()/mean()/max(); .tolist() for clean printing. One dtype per array. Lists repeat on *, arrays do maths.', snip='arr = np.array([1, 2, 3])\n(arr * 2).tolist()')))

# ---------------------------------------------------------------- 22 axis & broadcasting
s22 = r'''import numpy as np

rows = int(input("Rows: "))
grid = np.arange(rows * 3).reshape(rows, 3)
print("Column sums:", grid.sum(axis=0).tolist())
print("Row maxes:", grid.max(axis=1).tolist())
centered = grid - grid.mean(axis=0)
print("Centered:", centered.tolist())'''
L.append(lesson('r14-22', 22, 'Rows, columns and broadcasting', ['np-axis'], ['np-array'],
 "A glass wall of numbers fills the room: rows and columns, a spreadsheet the size of a house. \"Which way do you add?\" Quill asks. \"Down the columns, or across the rows? In NumPy you name the **axis**.\"",
 "A 2-D array is a table. `np.arange(6).reshape(2, 3)` makes:\n\n```\n[[0 1 2]\n [3 4 5]]\n```\n\n- **`axis=0`** means *go down the rows*: `grid.sum(axis=0)` gives one total **per column**: `[3, 5, 7]`.\n- **`axis=1`** means *go across the columns*: `grid.max(axis=1)` gives one maximum **per row**: `[2, 5]`.\n- Memory trick: the axis you name is the one that **disappears**.\n- `grid.shape` is `(rows, columns)`. `reshape` rearranges the same numbers into a new shape (the count must match).\n- **Broadcasting**: NumPy stretches a smaller array to fit a bigger one when the shapes are compatible. `grid - grid.mean(axis=0)` subtracts each column's average from that whole column (shape `(rows, 3)` minus shape `(3,)`). That is called **centering** and is a standard first step in data science.\n- `grid.mean()` with no axis averages **everything** into one number: usually not what you want.\n- Shape mismatches raise a clear `ValueError` showing both shapes. Read them!",
 "A seating chart: `axis=0` adds up each column of seats, `axis=1` adds up each row.",
 r'''import numpy as np
grid = np.arange(6).reshape(2, 3)
print(grid.shape, grid.sum(axis=0).tolist(), grid.sum(axis=1).tolist())''',
 predict(r'''import numpy as np
print(np.arange(6).reshape(2, 3).sum(axis=0).tolist())''', 'What prints?', ['[3, 5, 7]', '[3, 12]', '[15]'], 0, 'axis=0 adds down each column: 0+3, 1+4, 2+5.'),
 dict(broken=r'''import numpy as np
grid = np.arange(6).reshape(2, 3)
print(grid.sum(axis=1).tolist())''', task='These are the **row** sums, but we want the sum of each **column**: `[3, 5, 7]`. Fix the axis.',
  sol=r'''import numpy as np
grid = np.arange(6).reshape(2, 3)
print(grid.sum(axis=0).tolist())''', extra=[('Uses axis 0', '"axis=0" in src')], wrong=[r'''print([3, 5, 7])''']),
 dict(prompt='Ask `Rows: `. The array `grid` has that many rows and 3 columns. Print `Column sums: <list>` (one per column), `Row maxes: <list>` (one per row) and `Centered: <list of lists>` where each column has its own average subtracted (use broadcasting).',
  starter=r'''import numpy as np

rows = int(input("Rows: "))
grid = np.arange(rows * 3).reshape(rows, 3)
''',
  cases=[dict(inputs=['2'], name='Two rows'), dict(inputs=['3'], name='Three rows (square)'), dict(inputs=['4'], name='Four rows'), dict(inputs=['1'], name='One row')],
  sol=s22,
  wrong=[('grid.sum(axis=0)', 'grid.sum(axis=1)'), ('grid.max(axis=1)', 'grid.max(axis=0)'), ('grid.mean(axis=0)', 'grid.mean()'), ('grid.mean(axis=0)', 'grid.mean(axis=1, keepdims=True)'), ('grid - grid.mean(axis=0)', 'grid + grid.mean(axis=0)')],
  hints=['Column sums: grid.sum(axis=0). Row maxes: grid.max(axis=1).', 'Convert results with .tolist() before printing.', 'grid - grid.mean(axis=0) subtracts each column average from that column.']),
 dict(can=['Summarise rows and columns of a table', 'Center data with broadcasting'], expand='Divide each centered column by its standard deviation (`grid.std(axis=0)`) to get z-scores.', where='Spreadsheets, images (height x width x colour) and every machine learning dataset are 2-D or higher arrays.', next='Next: pick values with true/false masks.'),
 dict(title='Axes and broadcasting', body='axis=0 sums down columns, axis=1 across rows; the named axis disappears. reshape(rows, cols). Broadcasting: grid - grid.mean(axis=0) subtracts each column mean. shape is (rows, cols).', snip='grid.sum(axis=0)   # per column\ngrid.max(axis=1)   # per row')))

# ---------------------------------------------------------------- 23 masks
s23 = r'''import numpy as np

raw = input("Scores: ")
scores = np.array(list(map(int, raw.split())))
passed = scores[scores >= 60]
print("Passed:", passed.tolist())
print("Fail count:", int((scores < 60).sum()))
curved = np.minimum(scores + 5, 100)
print("Curved:", curved.tolist())
labels = np.where(scores >= 90, "A", np.where(scores >= 60, "P", "F"))
print("Labels:", "".join(labels))'''
L.append(lesson('r14-23', 23, 'Boolean masks: filter without loops', ['np-mask'], ['np-axis'],
 "\"Imagine a million exam scores,\" says Quill. \"You want every score of 60 or more. A Python loop would be slow and wordy. NumPy has a **stencil**: lay it over the data, and only the matching numbers show through.\"",
 "Comparing an array gives an array of `True`/`False`, called a **mask**:\n\n```\nscores = np.array([55, 60, 91])\nmask = scores >= 60            # [False  True  True]\nscores[mask]                   # [60 91]   keep only the True ones\nscores[scores >= 60]           # the same, in one line\n(scores < 60).sum()            # 1         True counts as 1\n```\n\n- `True` counts as 1 and `False` as 0, so **`.sum()` of a mask counts matches** and `.mean()` gives the fraction.\n- **`np.minimum(a, b)`** / **`np.maximum`** compare element by element: `np.minimum(scores + 5, 100)` adds 5 but never goes above 100 (a **cap**).\n- **`np.where(condition, if_true, if_false)`** chooses per element. Nest it for three-way choices.\n- Combine masks with `&` (and), `|` (or), `~` (not) and **brackets**: `(a > 1) & (a < 5)`. Python's `and`/`or` do not work on arrays.\n- Assigning through a mask edits matching elements in place: `scores[scores < 0] = 0`.\n- Boundaries matter: `>=` includes 60, `>` does not. Always test the edge value.",
 "A stencil laid over a page: only the words in the holes are visible.",
 r'''import numpy as np
a = np.array([3, 8, 5, 10])
print(a[a > 4].tolist(), (a > 4).sum())''',
 predict(r'''import numpy as np
print((np.array([1, 5, 9]) > 4).sum())''', 'What prints?', ['2', '3', '[5, 9]'], 0, 'Two values (5 and 9) are bigger than 4, and True counts as 1 when summed.'),
 dict(broken=r'''import numpy as np
scores = np.array([50, 60, 70])
print(scores[scores > 60].tolist())''', task='A score of exactly 60 should pass. The comparison is too strict. Expected: `[60, 70]`',
  sol=r'''import numpy as np
scores = np.array([50, 60, 70])
print(scores[scores >= 60].tolist())''', extra=[('Includes the edge', '">= 60" in src')], wrong=[r'''print([60, 70])''']),
 dict(prompt='Ask `Scores: ` (whole numbers). Make the array `scores`, then print `Passed: <scores that are 60 or more>`, `Fail count: <how many are below 60>`, `Curved: <every score plus 5, but never above 100>` and `Labels: <one letter per score joined together: A for 90+, P for 60-89, F below 60>`.',
  starter=r'''import numpy as np

raw = input("Scores: ")
''',
  cases=[dict(inputs=['55 60 61 89 90 95 100'], name='Edges'), dict(inputs=['10 20'], name='All fail'), dict(inputs=['100 100'], name='All top'), dict(inputs=['59 60'], name='Just around 60'), dict(inputs=['96 97 98 99'], name='Cap matters')],
  sol=s23,
  wrong=[('scores >= 60]', 'scores > 60]'), ('(scores < 60).sum()', '(scores <= 60).sum()'), ('np.minimum(scores + 5, 100)', 'np.maximum(scores + 5, 100)'), ('scores >= 90', 'scores > 90'), ('np.minimum(scores + 5, 100)', 'scores + 5')],
  hints=['scores = np.array(list(map(int, raw.split()))). A mask is scores >= 60.', 'scores[mask] keeps passing scores; (scores < 60).sum() counts failures; np.minimum(scores + 5, 100) caps.', 'np.where(scores >= 90, "A", np.where(scores >= 60, "P", "F")) gives the letters; "".join(...) glues them.']),
 dict(can=['Filter and count data with masks', 'Cap and label values without loops'], expand='Replace every failing score with 0 using `scores[scores < 60] = 0` and print the new average.', where='Cleaning sensor data, flagging fraud and picking test rows all use masks.', next='Next: describe a dataset with statistics.'),
 dict(title='Masks', body='arr >= 60 gives True/False per element. arr[mask] filters; mask.sum() counts; np.where(cond, a, b) chooses; np.minimum/maximum cap; combine masks with & | ~ and brackets.', snip='arr[arr >= 60]\nint((arr < 60).sum())')))

# ---------------------------------------------------------------- 24 statistics
s24 = r'''import statistics

values = list(map(int, input("Values: ").split()))
mean = statistics.mean(values)
spread = statistics.stdev(values)
print("Mean:", round(mean, 2))
print("Median:", statistics.median(values))
print("Mode:", min(statistics.multimode(values)))
print("Stdev:", round(spread, 2))
outliers = [v for v in values if abs(v - mean) > 2 * spread]
print("Outliers:", outliers)'''
L.append(lesson('r14-24', 24, 'Describing data: mean, median, mode, spread', ['stats-describe'], ['np-mask'],
 "A dataset lands on the table like a fish. \"Before any clever machine,\" Quill says, \"ask five plain questions: what is typical, what is most common, how spread out is it, and is anything *strange*?\"",
 "Python's **`statistics`** module answers the first questions:\n\n```\nimport statistics\nstatistics.mean([1, 2, 3, 10])      # 4.0   the average, pulled by big values\nstatistics.median([1, 2, 3, 10])    # 2.5   the middle, ignores extremes\nstatistics.multimode([1, 2, 2, 3, 3])   # [2, 3]   every most-common value\nstatistics.stdev([1, 2, 3, 10])     # sample standard deviation (spread)\n```\n\n- **Mean** is sensitive to extremes; **median** is robust. Salaries and house prices are reported as medians for this reason.\n- **Mode** is the most common value. Several values can tie, so `multimode` returns a list. Pick a rule (e.g. the smallest) when you need one.\n- **Standard deviation** says how far values typically sit from the mean. `stdev` (sample, divides by n-1) is for a sample of a bigger population; `pstdev` is for the whole population. They differ slightly.\n- **Outliers**: a common rule flags values more than 2 (or 3) standard deviations from the mean. They are *suspects*, not automatically errors: check before deleting.\n- `stdev` needs at least 2 values.\n- `round(x, 2)` tidies the printout without changing the maths.",
 "A doctor's first check: temperature, pulse, and anything unusual, before any fancy test.",
 r'''import statistics
data = [2, 4, 4, 10]
print(statistics.mean(data), statistics.median(data), statistics.multimode(data))''',
 predict(r'''import statistics
print(statistics.median([9, 1, 5]))''', 'What prints?', ['5', '1', '5.0'], 0, 'median sorts the values first (1, 5, 9) and takes the middle one: 5.'),
 dict(broken=r'''values = [9, 1, 5]
print(values[len(values) // 2])''', task='The middle of the **unsorted** list is not the median. Use the `statistics` module so the data is sorted for you. Expected: `5`',
  sol=r'''import statistics
values = [9, 1, 5]
print(statistics.median(values))''', extra=[('Uses statistics', '"statistics.median" in src')], wrong=[r'''print(5)''']),
 dict(prompt='Ask `Values: ` (at least two whole numbers). The list `values` is given. Print `Mean: <2 decimals>`, `Median: <median>`, `Mode: <the smallest of the most common values>`, `Stdev: <sample standard deviation, 2 decimals>` and `Outliers: <list of values more than 2 standard deviations from the mean, in original order>`.',
  starter=r'''import statistics

values = list(map(int, input("Values: ").split()))
''',
  cases=[dict(inputs=['10 12 11 13 12 95 11 10 12 11'], name='One big outlier'), dict(inputs=['5 5 5 5'], name='No spread'), dict(inputs=['1 2'], name='Two values'), dict(inputs=['1 2 2 3 3'], name='Tied modes'), dict(inputs=['4 8 6 5 3 200 7 6 5 4 6'], name='Skewed data'), dict(inputs=['100 98 102 99 101 100 3 100 99 101'], name='Low outlier')],
  sol=s24,
  wrong=[('statistics.stdev(values)', 'statistics.pstdev(values)'), ('> 2 * spread', '> spread'), ('min(statistics.multimode(values))', 'max(statistics.multimode(values))'), ('statistics.median(values)', 'statistics.mean(values)'), ('abs(v - mean)', '(v - mean)')],
  hints=['mean = statistics.mean(values); spread = statistics.stdev(values).', 'statistics.multimode(values) returns a list; take min(...) of it.', 'Outliers: [v for v in values if abs(v - mean) > 2 * spread].']),
 dict(can=['Summarise a dataset in five numbers', 'Spot outliers and explain why median beats mean'], expand='Print the middle 50% of the data (the interquartile range) with `statistics.quantiles`.', where='Dashboards, A/B tests and monitoring alerts all start with these summaries.', next='Next: draw the best straight line through points.'),
 dict(title='statistics module', body='mean (pulled by extremes), median (robust), multimode (list of ties), stdev (sample, n-1) vs pstdev. Outlier rule: |v - mean| > 2 * stdev. stdev needs 2+ values.', snip='mean = statistics.mean(v)\nspread = statistics.stdev(v)')))

# ---------------------------------------------------------------- 25 regression
s25 = r'''xs = list(map(float, input("X: ").split()))
ys = list(map(float, input("Y: ").split()))
mean_x = sum(xs) / len(xs)
mean_y = sum(ys) / len(ys)
numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
denominator = sum((x - mean_x) ** 2 for x in xs)
slope = numerator / denominator
intercept = mean_y - slope * mean_x
print(f"y = {slope:.2f}x + {intercept:.2f}")
target = float(input("Predict at: "))
print("Prediction:", round(slope * target + intercept, 2))'''
L.append(lesson('r14-25', 25, 'Your first model: a line through the data', ['ml-line'], ['stats-describe'],
 "Quill pins a scatter of dots to the wall: house sizes against prices. \"A **model** is just a rule that guesses,\" the Archmage says, drawing a straight line through the dots. \"This line is the oldest and most useful one in all of machine learning.\"",
 "**Linear regression** finds the line `y = slope * x + intercept` that sits closest to all the points (least squares). The formulas use only averages:\n\n```\nmean_x = sum(xs) / len(xs)\nmean_y = sum(ys) / len(ys)\nslope = sum((x - mean_x) * (y - mean_y)) / sum((x - mean_x) ** 2)\nintercept = mean_y - slope * mean_x\n```\n\n- **slope**: how much `y` changes when `x` goes up by 1.\n- **intercept**: the predicted `y` when `x` is 0.\n- The top of the fraction measures how `x` and `y` **move together** around their means (covariance); the bottom is how much `x` varies by itself.\n- The line always passes through the point `(mean_x, mean_y)`, which is why the intercept formula works.\n- **Prediction** is just plugging a new `x` into the line.\n- **Training** a model means computing its numbers (slope, intercept) from data. **Predicting** uses them on new input.\n- Beware **extrapolation**: a line fitted on sizes 50-150 says little about size 5000.\n- Real libraries: `numpy.polyfit`, `scikit-learn`'s `LinearRegression`. You just rebuilt the core.",
 "Stretching a ruler through a cloud of dots until it is as close to every dot as it can be.",
 r'''xs = [1, 2, 3]
ys = [2, 4, 6]
mx = sum(xs) / 3
my = sum(ys) / 3
slope = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sum((x - mx) ** 2 for x in xs)
print(slope, my - slope * mx)''',
 predict(r'''xs = [1, 2, 3]
print(sum((x - 2) ** 2 for x in xs))''', 'What prints?', ['2', '6', '0'], 0, 'The squared distances from 2 are 1, 0 and 1, which add up to 2.'),
 dict(broken=r'''x1, y1, x2, y2 = 1, 3, 3, 7
slope = (x2 - x1) / (y2 - y1)
print(slope)''', task='Slope is **rise over run**: how much `y` changes divided by how much `x` changes. The fraction is upside down. Expected: `2.0`',
  sol=r'''x1, y1, x2, y2 = 1, 3, 3, 7
slope = (y2 - y1) / (x2 - x1)
print(slope)''', extra=[('Rise over run', '"(y2 - y1) / (x2 - x1)" in src')], wrong=[r'''print(2.0)''']),
 dict(prompt='Ask `X: ` and `Y: ` (numbers separated by spaces; the lists `xs` and `ys` are given). Compute the least-squares `slope` and `intercept` with the averages formulas. Print `y = <slope>x + <intercept>` (2 decimals each), then ask `Predict at: ` and print `Prediction: <slope * x + intercept rounded to 2 decimals>`.',
  starter=r'''xs = list(map(float, input("X: ").split()))
ys = list(map(float, input("Y: ").split()))
''',
  cases=[dict(inputs=['1 2 3 4', '3 5 7 9', '10'], name='Perfect line'), dict(inputs=['1 2 3 4 5', '2.2 4.1 5.9 8.2 9.8', '6'], name='Noisy line'), dict(inputs=['0 1 2 3', '10 7 4 1', '4'], name='Falling line'), dict(inputs=['2 4 6', '5 5 5', '100'], name='Flat line'), dict(inputs=['10 20 30', '25 45 65', '15'], name='Larger x')],
  sol=s25,
  wrong=[('(x - mean_x) * (y - mean_y)', 'x * y'), ('slope = numerator / denominator', 'slope = numerator / len(xs)'), ('intercept = mean_y - slope * mean_x', 'intercept = mean_y'), ('slope * target + intercept', 'slope * target'), ('(x - mean_x) ** 2', '(x - mean_x)')],
  hints=['First the two averages: mean_x and mean_y.', 'slope = sum((x - mean_x) * (y - mean_y)) / sum((x - mean_x) ** 2), using zip(xs, ys).', 'intercept = mean_y - slope * mean_x. Prediction = slope * target + intercept.']),
 dict(can=['Fit a straight-line model from scratch', 'Use a model to predict new values'], expand='Compute `r_squared` (how much of the variation the line explains) and print it.', where='Pricing, forecasting sales, estimating delivery times: simple lines still solve a surprising number of business questions.', next='Next: a model that decides by asking its neighbours.'),
 dict(title='Linear regression', body='slope = sum((x-mx)(y-my)) / sum((x-mx)^2); intercept = my - slope*mx. Train = compute numbers; predict = plug in x. Do not extrapolate far outside the data.', snip='slope = num / den\nintercept = mean_y - slope * mean_x')))

# ---------------------------------------------------------------- 26 knn
s26 = r'''import math
from collections import Counter

TRAIN = [(1, 1, "red"), (1, 3, "red"), (2, 2, "red"), (3, 1, "red"), (4, 4, "red"),
         (6, 6, "blue"), (7, 5, "blue"), (8, 8, "blue"), (5, 7, "blue"), (6, 4, "blue")]

def classify(x, y, k):
    ranked = sorted(TRAIN, key=lambda p: math.hypot(p[0] - x, p[1] - y))
    labels = [p[2] for p in ranked[:k]]
    return Counter(labels).most_common(1)[0][0]

x, y = map(float, input("Point: ").split())
k = int(input("K: "))
print("Label:", classify(x, y, k))'''
L.append(lesson('r14-26', 26, 'Classifying by asking the neighbours (k-NN)', ['ml-knn'], ['ml-line'],
 "A new, nameless colour dot appears on Quill's wall. \"Red or blue?\" the Archmage asks. \"Do not think. **Look at who lives next to it.** If most of the nearest dots are red, call it red. That lazy trick is called k-nearest neighbours, and it really works.\"",
 "**Classification** means choosing a label for a new item. **k-NN** needs no training at all: keep the labelled examples and, for a new point, **vote among the `k` closest**.\n\n```\nranked = sorted(TRAIN, key=lambda p: math.hypot(p[0] - x, p[1] - y))\nlabels = [p[2] for p in ranked[:k]]            # the k nearest labels\nCounter(labels).most_common(1)[0][0]           # the winning label\n```\n\n- **Distance**: `math.hypot(dx, dy)` is the straight-line (Euclidean) distance.\n- **Sort by distance**, keep the first `k`, and let them **vote** with `Counter`.\n- **Choosing `k`**: k=1 follows every quirk (noisy); a huge k blurs everything toward the biggest group. Use an odd `k` for two classes to avoid tied votes.\n- The same point can get a **different label** for a different `k`: try it.\n- **Features must be on similar scales** or one feature dominates the distance (see the scaling lesson).\n- k-NN is slow on huge data (it compares with everything) but is a great baseline and easy to explain.",
 "Asking your nearest neighbours what restaurant to try; the majority wins.",
 r'''import math
print(round(math.hypot(3, 4), 1))''',
 predict(r'''from collections import Counter
print(Counter(["red", "blue", "blue"]).most_common(1)[0][0])''', 'What prints?', ['blue', 'red', '2'], 0, 'blue appears twice and red once, so the vote winner is blue.'),
 dict(broken=r'''import math
points = [(5, 5), (1, 1), (3, 3)]
ranked = sorted(points, key=lambda p: math.hypot(p[0] - 2, p[1] - 2), reverse=True)
print(ranked[0])''', task='We want the point **nearest** to (2, 2), but the sort puts the farthest first. Fix it. Expected: `(1, 1)`',
  sol=r'''import math
points = [(5, 5), (1, 1), (3, 3)]
ranked = sorted(points, key=lambda p: math.hypot(p[0] - 2, p[1] - 2))
print(ranked[0])''', extra=[('No reverse', '"reverse=True" not in src'), ('Measures distance', '"hypot" in src')], wrong=[r'''print((1, 1))''']),
 dict(prompt='`TRAIN` holds labelled points `(x, y, label)`. Ask `Point: ` (`x y`) and `K: `. Write `classify(x, y, k)`: rank the training points by straight-line distance to `(x, y)`, take the `k` nearest and return the label that most of them have. Print `Label: <label>`.',
  starter=r'''import math
from collections import Counter

TRAIN = [(1, 1, "red"), (1, 3, "red"), (2, 2, "red"), (3, 1, "red"), (4, 4, "red"),
         (6, 6, "blue"), (7, 5, "blue"), (8, 8, "blue"), (5, 7, "blue"), (6, 4, "blue")]

# write classify(x, y, k) here

x, y = map(float, input("Point: ").split())
k = int(input("K: "))
print("Label:", classify(x, y, k))''',
  cases=[dict(inputs=['2 3', '3'], name='Deep in red'), dict(inputs=['7 7', '3'], name='Deep in blue'), dict(inputs=['4.6 4.6', '1'], name='k=1 follows the nearest'), dict(inputs=['4.6 4.6', '3'], name='k=3 changes the vote'), dict(inputs=['4.6 4.6', '9'], name='Huge k drifts to the crowd'), dict(inputs=['5.2 5.2', '5'], name='Border point'), dict(inputs=['0 0', '3'], name='Far corner'), dict(inputs=['1.7 6.4', '1'], name='Straight line, not city blocks'), dict(inputs=['1.1 7.0', '1'], name='x and y are different')],
  sol=s26,
  wrong=[('math.hypot(p[0] - x, p[1] - y))', 'math.hypot(p[0] - x, p[1] - y), reverse=True)'), ('ranked[:k]', 'ranked[:k + 2]'), ('ranked[:k]', 'ranked[-k:]'), ('most_common(1)[0][0]', 'most_common()[-1][0]'), ('math.hypot(p[0] - x, p[1] - y)', 'abs(p[0] - x) + abs(p[1] - y)'), ('p[1] - y', 'p[1] - x')],
  hints=['Sort TRAIN with key=lambda p: math.hypot(p[0] - x, p[1] - y).', 'Keep the first k: ranked[:k], and collect their labels p[2].', 'Counter(labels).most_common(1)[0][0] is the winner.']),
 dict(can=['Classify with k-nearest neighbours', 'Explain how k changes the answer'], expand='Return the vote counts too, e.g. `{"red": 2, "blue": 1}`, so you can see how confident the answer is.', where='Recommendation shortcuts, handwriting baselines and quick prototypes use k-NN before anything fancy.', next='Next: how to know whether a model is any good.'),
 dict(title='k-NN', body='Sort labelled points by distance (math.hypot), keep first k, majority vote with Counter. Small k = noisy, big k = blurry. Odd k avoids ties. Scale features first.', snip='ranked = sorted(TRAIN, key=lambda p: math.hypot(p[0]-x, p[1]-y))')))

# ---------------------------------------------------------------- 27 train/test
DATA = [(1.0,'low'),(2.1,'low'),(2.9,'low'),(3.5,'low'),(8.2,'high'),(9.0,'high'),(2.5,'low'),(7.7,'high'),(8.8,'high'),(3.9,'low'),(6.1,'high'),(4.4,'low'),(9.5,'high'),(5.2,'high'),(1.8,'low'),(7.1,'high'),(4.8,'low'),(8.4,'high'),(3.1,'low'),(6.6,'high')]
s27 = 'DATA = ' + repr(DATA).replace('), (', '),\n        (') + r'''

def split(data, every):
    train, test = [], []
    for i, row in enumerate(data):
        if i % every == every - 1:
            test.append(row)
        else:
            train.append(row)
    return train, test

def fit(train):
    lows = [x for x, label in train if label == "low"]
    highs = [x for x, label in train if label == "high"]
    return (sum(lows) / len(lows) + sum(highs) / len(highs)) / 2

def accuracy(data, threshold):
    correct = 0
    for x, label in data:
        guess = "high" if x >= threshold else "low"
        if guess == label:
            correct += 1
    return 100 * correct / len(data)

every = int(input("Every: "))
train, test = split(DATA, every)
threshold = fit(train)
print(f"Train: {len(train)}  Test: {len(test)}")
print(f"Threshold: {threshold:.2f}")
print(f"Train accuracy: {accuracy(train, threshold):.1f}%")
print(f"Test accuracy: {accuracy(test, threshold):.1f}%")'''
st27 = s27[:s27.index('def split')] + '''# write split(data, every), fit(train) and accuracy(data, threshold) here

every = int(input("Every: "))
train, test = split(DATA, every)
threshold = fit(train)
print(f"Train: {len(train)}  Test: {len(test)}")
print(f"Threshold: {threshold:.2f}")
print(f"Train accuracy: {accuracy(train, threshold):.1f}%")
print(f"Test accuracy: {accuracy(test, threshold):.1f}%")'''
L.append(lesson('r14-27', 27, 'Train/test split: never grade on the homework', ['ml-split'], ['ml-knn'],
 "A student boasts: \"I scored 100%!\" Quill raises an eyebrow. \"On which questions? The ones you memorised the answers to? A model must be graded on data it has **never seen**, or the score is flattery.\"",
 "Models can **memorise** their training data. To measure real skill, hold some data back:\n\n```\ntrain, test = [], []\nfor i, row in enumerate(data):\n    if i % every == every - 1:\n        test.append(row)        # every n-th row is held out\n    else:\n        train.append(row)\n```\n\n- **Train set**: used to fit the model. **Test set**: used only to score it. Never let the model peek at the test set while training.\n- A simple classifier: put a **threshold** halfway between the average of the `low` group and the average of the `high` group, using **train rows only**. A value above it is `high`.\n- **Accuracy** = correct guesses / total guesses (as a percentage).\n- Train accuracy is almost always better than test accuracy. A **big gap** means **overfitting**: the model learned the quirks, not the pattern.\n- Real projects shuffle first (`random.Random(seed).shuffle`) and use a fixed seed so results repeat.\n- With very little data, even the test score is shaky: five test rows means each mistake costs 20 points.",
 "Practice exam versus real exam: the real one must contain questions you have not seen.",
 r'''rows = list(range(10))
print([r for i, r in enumerate(rows) if i % 4 == 3])''',
 predict(r'''rows = list(range(10))
print([r for i, r in enumerate(rows) if i % 5 == 4])''', 'What prints?', ['[4, 9]', '[0, 5]', '[5]'], 0, 'Indexes 4 and 9 have remainder 4 when divided by 5, so those rows form the test set.'),
 dict(broken=r'''correct, total = 4, 5
print(f"Accuracy: {correct / total}%")''', task='Accuracy as a **percentage** should be `80.0%`; the code prints a fraction with a percent sign. Fix the calculation. Expected: `Accuracy: 80.0%`',
  sol=r'''correct, total = 4, 5
print(f"Accuracy: {100 * correct / total}%")''', extra=[('Multiplies by 100', '"100 *" in src')], wrong=[r'''print("Accuracy: 80.0%")''']),
 dict(prompt='`DATA` is a list of `(value, label)` rows. Ask `Every: ` (n). Write `split(data, every)` (every n-th row, counting from 1, is a **test** row; the rest are train, original order kept), `fit(train)` (threshold halfway between the **average of the low values** and the **average of the high values**, train rows only) and `accuracy(data, threshold)` (percentage of rows where `value >= threshold` matches `high`). The printing is given.',
  starter=st27,
  cases=[dict(inputs=['4'], name='Every 4th'), dict(inputs=['5'], name='Every 5th'), dict(inputs=['2'], name='Half and half'), dict(inputs=['10'], name='Big training set')],
  sol=s27,
  wrong=[('i % every == every - 1', 'i % every == 0'), ('        if guess == label:\n            correct += 1', '        if guess != label:\n            correct += 1'), ('return 100 * correct / len(data)', 'return correct / len(data)'), ('sum(lows) / len(lows)', 'max(lows)'), ('/ 2\n\ndef accuracy', '/ 2 + 0.5\n\ndef accuracy'), ('lows = [x for x, label in train if label == "low"]', 'lows = [x for x, label in DATA if label == "low"]')],
  hints=['Loop with enumerate; rows where i % every == every - 1 go to test.', 'fit: average of the low values and average of the high values (train only); the threshold is halfway.', 'accuracy: count rows where ("high" if x >= threshold else "low") equals the label; return 100 * correct / len(data).']),
 dict(can=['Hold out test data and score honestly', 'Spot overfitting from a train/test gap'], expand='Shuffle the rows with `random.Random(7).shuffle` before splitting and compare scores.', where='Every credible machine learning claim reports a test score; "100% on training data" is a red flag.', next='Next: scores beyond accuracy.'),
 dict(title='Train/test', body='Hold out test rows; fit only on train; score on test. accuracy = 100 * correct / total. A big train-test gap = overfitting. Fixed seed for repeatability.', snip='train, test = split(data, 4)\nthreshold = fit(train)\naccuracy(test, threshold)')))

# ---------------------------------------------------------------- 28 confusion matrix
s28 = r'''actual = list(map(int, input("Actual: ").split()))
predicted = list(map(int, input("Predicted: ").split()))
tp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)
fp = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 1)
fn = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 0)
tn = sum(1 for a, p in zip(actual, predicted) if a == 0 and p == 0)
accuracy = (tp + tn) / len(actual)
precision = tp / (tp + fp) if tp + fp else 0.0
recall = tp / (tp + fn) if tp + fn else 0.0
f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
print(f"TP={tp} FP={fp} FN={fn} TN={tn}")
print(f"Accuracy={accuracy:.2f} Precision={precision:.2f} Recall={recall:.2f} F1={f1:.2f}")'''
L.append(lesson('r14-28', 28, 'Beyond accuracy: precision and recall', ['ml-metrics'], ['ml-split'],
 "\"My smoke alarm is 99% accurate!\" a salesman cries. Quill asks one question: \"How often does your house burn down?\" Rarely. \"Then an alarm that *never rings* is also 99% accurate. Accuracy alone can lie.\"",
 "For yes/no predictions, every guess lands in one of four boxes (the **confusion matrix**):\n\n| | predicted 1 | predicted 0 |\n|---|---|---|\n| **actual 1** | TP (true positive) | FN (missed it) |\n| **actual 0** | FP (false alarm) | TN (true negative) |\n\n```\ntp = sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1)\nprecision = tp / (tp + fp) if tp + fp else 0.0\nrecall    = tp / (tp + fn) if tp + fn else 0.0\n```\n\n- **Accuracy** = (TP + TN) / everything. Fine for balanced data, **misleading when one class is rare**.\n- **Precision**: of everything I flagged, how much was really positive? (Few false alarms.)\n- **Recall**: of everything really positive, how much did I catch? (Few misses.)\n- **F1** = `2 * P * R / (P + R)` balances the two.\n- Which matters more depends on the cost: a cancer screen wants high recall; a spam filter that hides real mail wants high precision.\n- **Guard every division**: with no flagged items `tp + fp` is 0, and dividing by it crashes. Return `0.0` in that case.",
 "A fishing net: recall is how many fish you caught of all fish in the lake; precision is how many of what you pulled up were fish and not boots.",
 r'''actual = [1, 0, 1]
predicted = [1, 1, 0]
print(sum(1 for a, p in zip(actual, predicted) if a == 1 and p == 1))''',
 predict(r'''tp, fp = 3, 1
print(tp / (tp + fp))''', 'What prints?', ['0.75', '0.25', '3.0'], 0, 'Precision is 3 correct flags out of 4 flags: 0.75.'),
 dict(broken=r'''tp, fp = 0, 0
precision = tp / (tp + fp)
print(f"Precision={precision:.2f}")''', task='When nothing was flagged, precision divides by zero. Guard the division and use `0.0` in that case. Expected: `Precision=0.00`',
  sol=r'''tp, fp = 0, 0
precision = tp / (tp + fp) if tp + fp else 0.0
print(f"Precision={precision:.2f}")''', extra=[('Has a guard', '" if tp + fp" in src')], wrong=[r'''print("Precision=0.00")''']),
 dict(prompt='Ask `Actual: ` and `Predicted: ` (lists of 0/1 separated by spaces; same length, at least one item). Print `TP=<n> FP=<n> FN=<n> TN=<n>` and then `Accuracy=<x> Precision=<x> Recall=<x> F1=<x>`, each with 2 decimals. Any ratio whose denominator is zero is `0.0`.',
  starter=r'''actual = list(map(int, input("Actual: ").split()))
predicted = list(map(int, input("Predicted: ").split()))
''',
  cases=[dict(inputs=['1 1 1 0 0 1 0 0', '1 0 0 1 0 1 1 1'], name='Mixed'), dict(inputs=['1 1 1 1 1 0 0 0', '1 1 0 0 0 0 0 0'], name='Careful but misses'), dict(inputs=['0 0 0 0 0 0 0 0 0 1', '0 0 0 0 0 0 0 0 0 0'], name='Rare class, lazy model'), dict(inputs=['1 0 1 0', '1 0 1 0'], name='Perfect'), dict(inputs=['0 0 0', '0 0 0'], name='No positives anywhere'), dict(inputs=['1 1 1', '0 0 0'], name='Missed everything'), dict(inputs=['0 0 0 0', '1 1 1 1'], name='Only false alarms')],
  sol=s28,
  wrong=[('tp / (tp + fp) if tp + fp else 0.0', 'tp / (tp + fn) if tp + fn else 0.0'), ('tp / (tp + fn) if tp + fn else 0.0', 'tp / (tp + fp) if tp + fp else 0.0'), ('(tp + tn) / len(actual)', 'tp / len(actual)'), ('if a == 0 and p == 1)', 'if a == 1 and p == 1)'), ('2 * precision * recall / (precision + recall)', '(precision + recall) / 2'), ('f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0', 'f1 = 2 * precision * recall / (precision + recall)'), ('precision = tp / (tp + fp) if tp + fp else 0.0', 'precision = tp / (tp + fp)')],
  hints=['Count the four boxes with sum(1 for a, p in zip(actual, predicted) if ...).', 'precision = tp / (tp + fp) and recall = tp / (tp + fn), each guarded with "if denominator else 0.0".', 'f1 = 2 * precision * recall / (precision + recall), also guarded.']),
 dict(can=['Read a confusion matrix', 'Choose between precision and recall for a problem'], expand='Print a fifth line `Specificity=<TN / (TN + FP)>` and explain what it measures.', where='Medical tests, fraud detection and spam filters are judged with exactly these numbers.', next='Next: put features on the same scale.'),
 dict(title='Precision and recall', body='TP FP FN TN. Precision = TP/(TP+FP); recall = TP/(TP+FN); F1 balances; accuracy lies on rare classes. Guard every division by zero.', snip='precision = tp / (tp + fp) if tp + fp else 0.0')))

# ---------------------------------------------------------------- 29 scaling
s29 = r'''values = list(map(float, input("Values: ").split()))
low, high = min(values), max(values)
mean = sum(values) / len(values)
spread = (sum((v - mean) ** 2 for v in values) / len(values)) ** 0.5
if high == low:
    minmax = [0.0 for v in values]
else:
    minmax = [(v - low) / (high - low) for v in values]
if spread == 0:
    zscores = [0.0 for v in values]
else:
    zscores = [(v - mean) / spread for v in values]
print("Min-max:", [round(v, 2) for v in minmax])
print("Z-scores:", [round(v, 2) for v in zscores])'''
L.append(lesson('r14-29', 29, 'Scaling features so no number bullies the rest', ['ml-scale'], ['ml-metrics'],
 "Two judges compare people by age (about 30) and yearly income (about 50 000). \"Distance in income,\" Quill notes, \"will always swamp distance in age: a gap of 5 000 dollars drowns a gap of 20 years.\" The cure is to **put every feature on the same scale**.",
 "Many models compare numbers by distance. If one feature is huge in size, it **dominates**. **Scaling** fixes this:\n\n- **Min-max scaling** squeezes values into 0 to 1: `(v - low) / (high - low)`. The smallest becomes 0, the biggest becomes 1.\n- **Z-score (standardization)** measures how many standard deviations a value is from the mean: `(v - mean) / spread`. The result has mean 0 and spread 1; negative means below average.\n\n```\nspread = (sum((v - mean) ** 2 for v in values) / len(values)) ** 0.5\nzscores = [(v - mean) / spread for v in values]\n```\n\n- **Guard the zero case**: if every value is equal, `high - low` and `spread` are 0 and the divisions crash. Use `0.0` for everything then.\n- Compute `low`, `high`, `mean`, `spread` from the **training** data only and reuse them on new data; otherwise information leaks from the test set.\n- k-NN, clustering and gradient descent need scaling; decision trees do not care.\n- Min-max is sensitive to outliers (one huge value squashes the rest); z-scores cope better.",
 "Converting every measurement to a percentage of a ruler so inches and miles can be compared fairly.",
 r'''values = [10, 20, 30]
print([(v - min(values)) / (max(values) - min(values)) for v in values])''',
 predict(r'''values = [10, 20, 30]
print((values[1] - 10) / (30 - 10))''', 'What prints?', ['0.5', '1.0', '0.0'], 0, 'The middle value is halfway between the smallest and biggest, so its min-max score is 0.5.'),
 dict(broken=r'''values = [5.0, 5.0, 5.0]
low, high = min(values), max(values)
print([(v - low) / (high - low) for v in values])''', task='All values are equal, so `high - low` is zero and the division crashes. When `high == low` print `[0.0, 0.0, 0.0]` (a list of zeros). Fix it.',
  sol=r'''values = [5.0, 5.0, 5.0]
low, high = min(values), max(values)
if high == low:
    print([0.0 for v in values])
else:
    print([(v - low) / (high - low) for v in values])''', extra=[('Checks for equal values', '"high == low" in src')], wrong=[r'''print([0.0, 0.0, 0.0])''']),
 dict(prompt='Ask `Values: ` (numbers; `values` is given). Print `Min-max: <list>` (0 to 1, 2 decimals) and `Z-scores: <list>` (using the **population** standard deviation, i.e. divide by n; 2 decimals). If all values are equal both lists are all `0.0`.',
  starter=r'''values = list(map(float, input("Values: ").split()))
''',
  cases=[dict(inputs=['10 20 30'], name='Even steps'), dict(inputs=['1 2 3 4 100'], name='One huge value'), dict(inputs=['7 7 7'], name='All equal'), dict(inputs=['-5 0 5 10'], name='Negatives'), dict(inputs=['42'], name='Single value')],
  sol=s29,
  wrong=[('(v - low) / (high - low)', '(v - low) / high'), ('(v - mean) / spread', '(v - mean)'), ('/ len(values)) ** 0.5', '/ (len(values) - 1)) ** 0.5') if False else ('/ len(values)) ** 0.5', '/ len(values))'), ('if high == low:\n    minmax = [0.0 for v in values]\nelse:\n    minmax = [(v - low) / (high - low) for v in values]', 'minmax = [(v - low) / (high - low) for v in values]'), ('if spread == 0:\n    zscores = [0.0 for v in values]\nelse:\n    zscores = [(v - mean) / spread for v in values]', 'zscores = [(v - mean) / spread for v in values]'), ('(v - low) / (high - low)', '(high - v) / (high - low)')],
  hints=['low, high = min(values), max(values); mean = sum(values) / len(values).', 'spread = (sum((v - mean) ** 2 for v in values) / len(values)) ** 0.5.', 'Min-max = (v - low) / (high - low); z-score = (v - mean) / spread; guard the zero denominators.']),
 dict(can=['Scale features with min-max and z-scores', 'Explain why unscaled features mislead distance-based models'], expand='Scale the x and y columns of the k-NN dataset before classifying and compare the results.', where='Every machine learning pipeline has a scaling step before the model.', next='Mission time: a mini prediction pipeline from raw CSV to forecast.'),
 dict(title='Scaling', body='Min-max (v-low)/(high-low) -> 0..1. Z-score (v-mean)/spread -> mean 0, spread 1. Guard zero denominators. Fit scalers on train data only.', snip='z = (v - mean) / spread')))

# ---------------------------------------------------------------- 30 mission
HOUSES = ['size,price']
sizes = [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 55, 65, 75, 85, 95, 105]
noise = [4000, -3000, 5000, -6000, 2000, 7000, -2000, 3000, -5000, 1000, -4000, 6000, -1000, 2500, -3500, 4500, -500, 3500, -7000, 1500]
rows = []
for s, n in zip(sizes, noise):
    rows.append('%d,%d' % (s, 3000 * s + 20000 + n))
bad = ['75,abc', ',', '-5,1000', '90,', '120,0', '110']
mixed = []
bi = 0
for i, r in enumerate(rows):
    mixed.append(r)
    if i % 3 == 1 and bi < len(bad):
        mixed.append(bad[bi]); bi += 1
HOUSES_CSV = '\n'.join(HOUSES + mixed) + '\n'
s30 = r'''import csv
import math

def load(path):
    rows = []
    skipped = 0
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            try:
                size = float(row["size"])
                price = float(row["price"])
            except (ValueError, TypeError):
                skipped += 1
                continue
            if size <= 0 or price <= 0:
                skipped += 1
                continue
            rows.append((size, price))
    return rows, skipped

def fit(rows):
    mean_x = sum(x for x, y in rows) / len(rows)
    mean_y = sum(y for x, y in rows) / len(rows)
    slope = sum((x - mean_x) * (y - mean_y) for x, y in rows) / sum((x - mean_x) ** 2 for x, y in rows)
    return slope, mean_y - slope * mean_x

def rmse(rows, slope, intercept):
    errors = [(slope * x + intercept - y) ** 2 for x, y in rows]
    return math.sqrt(sum(errors) / len(errors))

rows, skipped = load("houses.csv")
test = [r for i, r in enumerate(rows) if i % 4 == 3]
train = [r for i, r in enumerate(rows) if i % 4 != 3]
slope, intercept = fit(train)
print(f"Rows: {len(rows)} (skipped {skipped})")
print(f"Model: price = {slope:.1f} * size + {intercept:.1f}")
print(f"Test RMSE: {rmse(test, slope, intercept):.1f}")
size = float(input("Predict size: "))
print(f"Predicted price: {slope * size + intercept:.0f}")'''
st30 = s30[:s30.index('def load')] + '''# write load(path), fit(rows) and rmse(rows, slope, intercept) here

''' + s30[s30.index('rows, skipped = load'):]
L.append(lesson('r14-30', 30, 'Real-World Mission: The House Price Predictor', ['mission14c'], ['ml-scale'],
 "A real-estate agent slides a messy CSV across the table: sizes, prices, and a few rows that are plainly garbage. \"Can your guild tell me what a 125 square-metre house should cost,\" she asks, \"and how wrong you might be?\" Quill smiles. \"Clean it. Split it. Fit it. Score it. Predict.\"",
 "A complete (tiny) **machine learning pipeline** uses everything from this guild:\n\n1. **Load and clean**: read the CSV with `csv.DictReader`; wrap `float(...)` in `try/except (ValueError, TypeError)`; reject impossible values (zero or negative sizes and prices) and **count what you skipped**.\n2. **Split**: hold out every 4th clean row as the test set.\n3. **Fit**: least-squares slope and intercept on the **train** rows only.\n4. **Evaluate**: **RMSE** (root mean squared error) is the typical size of a mistake, in the same units as the price:\n\n```\nerrors = [(slope * x + intercept - y) ** 2 for x, y in rows]\nrmse = math.sqrt(sum(errors) / len(errors))\n```\n\n5. **Predict** for the size the user asks about.\n\n- Missing cells arrive as empty strings; `float(\"\")` raises `ValueError`; `None` (a short row) raises `TypeError`. Catch both.\n- Report how many rows were skipped: silently dropping data hides problems.\n- Squaring the errors stops positive and negative mistakes cancelling and punishes big misses.\n- A model is only as honest as its evaluation: the test rows were never used for fitting.\n- This is the skeleton of real projects with `pandas` and `scikit-learn`.",
 "A bakery taste test: clean the ingredients, bake with most of the dough, taste with the rest, and report how far off you were.",
 r'''import math
print(round(math.sqrt((4 + 16) / 2), 2))''',
 predict(r'''import math
print(math.sqrt((3 ** 2 + 4 ** 2) / 2) > 3)''', 'What prints?', ['True', 'False', '3.5'], 0, 'The root-mean-square of 3 and 4 is about 3.54, which is greater than 3.'),
 dict(broken=r'''import math
errors = [2, -2, 4, -4]
print(round(math.sqrt(sum(errors) / len(errors)), 1))''', task='Positive and negative errors cancel in a plain sum, so the program crashes (square root of 0 is fine here, but the answer is wrong). Square each error **before** averaging. Expected: `3.2`',
  sol=r'''import math
errors = [2, -2, 4, -4]
print(round(math.sqrt(sum(e ** 2 for e in errors) / len(errors)), 1))''', extra=[('Squares first', '"** 2" in src')], wrong=[r'''print(3.2)''']),
 dict(prompt='`houses.csv` has columns `size,price` and some bad rows (missing cells, text, zero or negative values). Write `load(path)` returning the clean `(size, price)` float pairs and the count of skipped rows; `fit(rows)` returning `(slope, intercept)` of the least-squares line; and `rmse(rows, slope, intercept)`. The split, printing and prediction are given.',
  starter=st30,
  files={'houses.csv': HOUSES_CSV},
  cases=[dict(inputs=['125'], name='Predict 125'), dict(inputs=['60'], name='Predict 60'), dict(inputs=['200'], name='Predict 200')],
  sol=s30,
  wrong=[('                skipped += 1\n                continue\n            if size', '                continue\n            if size'), ('except (ValueError, TypeError):', 'except ValueError:'), ('if size <= 0 or price <= 0:', 'if size < 0 or price < 0:'), ('/ sum((x - mean_x) ** 2 for x, y in rows)', '/ len(rows)'), ('return slope, mean_y - slope * mean_x', 'return slope, mean_y'), ('math.sqrt(sum(errors) / len(errors))', 'sum(errors) / len(errors)'), ('(slope * x + intercept - y) ** 2', 'abs(slope * x + intercept - y)'), ('rows.append((size, price))', 'rows.append((price, size))')],
  hints=['load: csv.DictReader; try float(row["size"]), float(row["price"]) except (ValueError, TypeError): count the skip.', 'Also skip size <= 0 or price <= 0 (count those as skipped too).', 'fit: the averages formula. rmse: sqrt of the mean of the squared errors.']),
 dict(can=['Run a full clean, split, fit, evaluate, predict pipeline', 'Report model error in real units'], expand='Add a scaled second feature (number of rooms) and fit with `numpy.linalg.lstsq` to see whether the error drops.', where='Pricing tools, demand forecasts and insurance quotes all follow this pipeline, just with more features and bigger models.', next='The last guild: the Craft Guild, where code becomes professional.'),
 dict(title='ML pipeline', body='Load + clean (count skips) -> split (hold out test) -> fit on train -> RMSE on test (sqrt of mean squared error, same units as target) -> predict. Never fit on test rows.', snip='rmse = math.sqrt(sum(e ** 2 for e in errors) / len(errors))')))

if __name__ == '__main__':
    emit('realm_14c.js', 'REALM 14 - THE HALL OF FOUR DOORS - part C (lessons 21-30: Data Guild). Generated by tools/spec14c.py', L)
