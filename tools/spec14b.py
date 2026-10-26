from gen14 import *

L = []
PREV = 'mission14a'

# ---------------------------------------------------------------- 11 http request
s11 = r'''request_line = input("Request: ")
method, target, version = request_line.split(" ")
path, _, query = target.partition("?")

headers = {}
while True:
    line = input("Header: ")
    if not line:
        break
    key, _, value = line.partition(":")
    headers[key.strip().lower()] = value.strip()

print("Method:", method)
print("Path:", path)
print("Query:", query or "-")
print("Host:", headers.get("host", "unknown"))'''
L.append(lesson('r14-11', 11, 'What a web request really is', ['web-request'], [PREV],
 "The second door of the Hall of Four Doors opens onto a noisy marketplace of brass pipes. \"Every website you have ever used,\" says Quill, \"is just **text going back and forth**. The Web Guild's first lesson: read that text yourself.\"",
 "A **web request** is plain text with a fixed shape:\n\n```\nGET /users?id=7 HTTP/1.1        <- request line: METHOD TARGET VERSION\nHost: example.com               <- headers: Name: value\nAccept: text/html\n                                <- a blank line ends the headers\n(optional body)\n```\n\n- **Method**: `GET` (read), `POST` (create), `PUT` (replace), `DELETE` (remove).\n- **Target**: the path, then `?` and the **query string**. `\"/users?id=7\".partition(\"?\")` gives `('/users', '?', 'id=7')`.\n- **Headers** are `Name: value` lines. Names are **case-insensitive**, so store them lower-case. Use `partition(\":\")` (not `split`) because values may contain colons, like `Host: api.test:8080`.\n- Always `strip()` the spaces around names and values.\n- `dict.get(key, default)` gives a fallback when a header is missing.\n- A web server's first job is exactly this: turn text into a dictionary it can work with. You are about to write that part yourself.",
 "A letter with a fixed layout: addressed on the first line, labelled notes under it, then the message.",
 r'''line = "POST /login HTTP/1.1"
method, target, version = line.split(" ")
print(method, target)
print("Content-Type: text/plain".partition(":"))''',
 predict(r'''print("GET /a?x=1 HTTP/1.1".split(" ")[1].partition("?")[0])''', 'What prints?', ['/a', '/a?x=1', 'x=1'], 0, 'The second word is the target "/a?x=1"; partition("?") splits it and [0] is the part before the question mark.'),
 dict(broken=r'''method, target = "GET /home HTTP/1.1".split(" ")
print(method, target)''', task='A request line has **three** parts: method, target and version. The code crashes while unpacking. Fix it. Expected: `GET /home`',
  sol=r'''method, target, version = "GET /home HTTP/1.1".split(" ")
print(method, target)''', extra=[('Unpacks the version', '"version" in src')], wrong=[r'''print("GET /home")''']),
 dict(prompt='Ask `Request: ` (a request line). The line is already split into `method`, `target` and the `path`/`query`. Now read **header lines** (prompt `Header: `) until a **blank line**. Store them in `headers` with the name in lower case and spaces stripped from name and value (a value may contain colons). The final prints are given.',
  starter=r'''request_line = input("Request: ")
method, target, version = request_line.split(" ")
path, _, query = target.partition("?")

headers = {}
# read the header lines here

print("Method:", method)
print("Path:", path)
print("Query:", query or "-")
print("Host:", headers.get("host", "unknown"))''',
  cases=[dict(inputs=['GET /users?id=7 HTTP/1.1', 'Host: example.com', 'Accept: text/html', ''], name='Normal'), dict(inputs=['POST /login HTTP/1.1', 'HOST:   api.test:8080', 'Content-Type: application/json', ''], name='Case, spaces and a colon in the value'), dict(inputs=['GET / HTTP/1.1', ''], name='No headers'), dict(inputs=['GET /a?x=1&y=2 HTTP/1.1', 'host: a.b', ''], name='Query kept whole')],
  sol=s11,
  wrong=[('headers[key.strip().lower()]', 'headers[key.strip()]'), ('line.partition(":")', 'line.split(":")'), ('value.strip()', 'value'), ('        break\n', '        continue\n'), ('headers[key.strip().lower()] = value.strip()', 'headers[value.strip().lower()] = key.strip()')],
  hints=['Loop forever with while True and stop (break) when the line is empty.', 'key, _, value = line.partition(":") splits at the first colon only.', 'Store headers[key.strip().lower()] = value.strip().']),
 dict(can=['Read a raw HTTP request and pull out its parts', 'Handle header names that vary in case'], expand='Also read a `Content-Length` header and then read that many characters as the request body.', where='Every web server, proxy and API gateway starts by parsing requests this way.', next='Next: write the response a server sends back.'),
 dict(title='HTTP request', body='Request line: METHOD TARGET VERSION. Headers: Name: value (case-insensitive; partition(":")). Blank line ends headers. Query string after ?.', snip='method, target, version = line.split(" ")\npath, _, query = target.partition("?")')))

# ---------------------------------------------------------------- 12 http response
s12 = r'''import json

REASONS = {200: "OK", 201: "Created", 404: "Not Found", 500: "Internal Server Error"}

def build_response(status, data):
    body = json.dumps(data, ensure_ascii=False)
    length = len(body.encode("utf-8"))
    return (f"HTTP/1.1 {status} {REASONS[status]}\n"
            "Content-Type: application/json\n"
            f"Content-Length: {length}\n"
            "\n"
            f"{body}")

status = int(input("Status: "))
name = input("Name: ")
print(build_response(status, {"name": name}))'''
L.append(lesson('r14-12', 12, 'Building a response: status, headers, JSON', ['web-response'], ['web-request'],
 "\"A request asks,\" says Quill, stamping a brass plate **200 OK**. \"The response answers, and it must be **exactly** right, down to the length of the message in bytes. Browsers are fussy readers.\"",
 "A **response** mirrors the request:\n\n```\nHTTP/1.1 201 Created              <- status line: version, code, reason\nContent-Type: application/json    <- headers\nContent-Length: 15                <- size of the body IN BYTES\n                                  <- blank line\n{\"name\": \"Ada\"}                   <- body\n```\n\n- **Status codes**: `2xx` success (200 OK, 201 Created), `3xx` redirect, `4xx` the client erred (404 Not Found, 422 invalid data), `5xx` the server erred (500).\n- `json.dumps(data)` turns a dict into JSON text. Pass `ensure_ascii=False` to keep letters like `é` as they are.\n- **`Content-Length` counts bytes, not characters**: `len(body.encode(\"utf-8\"))`. `é` is 1 character but **2 bytes**, and a wrong length makes browsers hang or cut the message.\n- A blank line separates headers from body.\n- Build the text with an f-string; lookup the reason phrase in a dict. Python's `http.HTTPStatus` has all codes built in.",
 "A parcel label: what is inside, how heavy it is (measured honestly), then the parcel itself.",
 r'''import json
body = json.dumps({"ok": True})
print(body, len(body))''',
 predict(r'''print(len("é".encode("utf-8")))''', 'What prints?', ['2', '1', '3'], 0, 'The letter é needs two bytes in UTF-8, so the byte length is 2 even though the text has 1 character.'),
 dict(broken=r'''import json
data = {"msg": "hi"}
body = json.dumps(data)
print("Content-Length:", len(data))''', task='`Content-Length` must be the length of the **body text**, not the number of keys in the dict. Fix it. Expected: `Content-Length: 13`',
  sol=r'''import json
data = {"msg": "hi"}
body = json.dumps(data)
print("Content-Length:", len(body.encode("utf-8")))''', extra=[('Measures the body', '"len(body" in src')], wrong=[r'''print("Content-Length: 13")''']),
 dict(prompt='Ask `Status: ` (a number) and `Name: `. `REASONS` is given. Write `build_response(status, data)` returning the full response text: the status line `HTTP/1.1 <code> <reason>`, `Content-Type: application/json`, `Content-Length: <bytes>`, a blank line, then the JSON body (use `ensure_ascii=False`). The program prints it for `{"name": name}`.',
  starter=r'''import json

REASONS = {200: "OK", 201: "Created", 404: "Not Found", 500: "Internal Server Error"}

# write build_response here

status = int(input("Status: "))
name = input("Name: ")
print(build_response(status, {"name": name}))''',
  cases=[dict(inputs=['200', 'Ada'], name='OK', extra=[('Status line first', 'g["build_response"](200, {}).startswith("HTTP/1.1 200 OK\\n")')]), dict(inputs=['404', 'Nobody'], name='Not found'), dict(inputs=['201', 'José'], name='Bytes, not characters'), dict(inputs=['500', ''], name='Empty name')],
  sol=s12,
  wrong=[('length = len(body.encode("utf-8"))', 'length = len(body)'), ('            "\\n"\n', ''), ('Content-Type: application/json', 'Content-Type: text/html'), ('{REASONS[status]}', '{status}'), ('ensure_ascii=False', 'ensure_ascii=True')],
  hints=['body = json.dumps(data, ensure_ascii=False)', 'length = len(body.encode("utf-8")) because Content-Length is in bytes.', 'Join status line, two headers, a blank line and the body with newlines.']),
 dict(can=['Write a correct HTTP response by hand', 'Explain bytes versus characters'], expand='Add a `Date` header using the `datetime` module and a `Connection: close` header.', where='Frameworks do this for you, but when a response is cut off or garbled, knowing the format is how you debug it.', next='Next: route different paths to different code.'),
 dict(title='HTTP response', body='Status line, headers, blank line, body. Content-Length = len(body.encode("utf-8")). 2xx ok, 4xx client error, 5xx server error. json.dumps for JSON.', snip='length = len(body.encode("utf-8"))')))

# ---------------------------------------------------------------- 13 routing
s13 = r'''ROUTES = [
    ("/users/<id>", "user"),
    ("/users/<id>/posts/<post>", "post"),
    ("/about", "about"),
]

def match(pattern, path):
    p_parts = pattern.strip("/").split("/")
    s_parts = path.strip("/").split("/")
    if len(p_parts) != len(s_parts):
        return None
    params = {}
    for p, s in zip(p_parts, s_parts):
        if p.startswith("<") and p.endswith(">"):
            params[p[1:-1]] = s
        elif p != s:
            return None
    return params

path = input("Path: ")
for pattern, name in ROUTES:
    params = match(pattern, path)
    if params is not None:
        print(f"Handler: {name}, params: {params}")
        break
else:
    print("404 Not Found")'''
L.append(lesson('r14-13', 13, 'Routing: paths with parameters', ['web-route'], ['web-response'],
 "A great brass switchboard fills the wall: thousands of cables, each labelled with a path. \"A URL like `/users/7/posts/12` should reach one function and hand it the numbers,\" Quill says. \"That sorting is called **routing**.\"",
 "A **route** is a pattern such as `/users/<id>`. Matching splits both pattern and path into segments:\n\n```\ndef match(pattern, path):\n    p_parts = pattern.strip(\"/\").split(\"/\")\n    s_parts = path.strip(\"/\").split(\"/\")\n    if len(p_parts) != len(s_parts):\n        return None                      # different shape: no match\n    params = {}\n    for p, s in zip(p_parts, s_parts):\n        if p.startswith(\"<\") and p.endswith(\">\"):\n            params[p[1:-1]] = s          # <id> captures the value\n        elif p != s:\n            return None                  # a fixed word must match exactly\n    return params                        # may be {} for a plain path\n```\n\n- Compare **segment by segment**. First check the **count**, because `zip` silently stops at the shorter list.\n- A segment in `<angle brackets>` is a **parameter**: it matches anything and its value is saved under that name.\n- Return `None` for no match, and `{}` (empty but not `None`) for a match without parameters. Test with `is not None`, never just `if params:`.\n- Captured values are always **strings**: convert with `int(...)` before using them as numbers.\n- Routes are tried **in order**; put specific routes before general ones.\n- Flask and Django do the same with `@app.route(\"/users/<int:id>\")`.",
 "A mail sorter reading the address piece by piece: country, city, street, number.",
 r'''print("/users/7".strip("/").split("/"))
print("/".strip("/").split("/"))''',
 predict(r'''print(list(zip(["a", "b", "c"], [1, 2])))''', 'What prints?', ["[('a', 1), ('b', 2)]", "[('a', 1), ('b', 2), ('c', None)]", "[('a', 1)]"], 0, 'zip stops at the shorter list, which is why the lengths must be compared first when matching routes.'),
 dict(broken=r'''pattern = "/users/<id>"
path = "/users/7/extra"
p = pattern.strip("/").split("/")
s = path.strip("/").split("/")
print("match" if all(a.startswith("<") or a == b for a, b in zip(p, s)) else "no match")''', task='`/users/7/extra` has an extra segment and must **not** match `/users/<id>`. `zip` hides the length difference. Add the missing length check. Expected: `no match`',
  sol=r'''pattern = "/users/<id>"
path = "/users/7/extra"
p = pattern.strip("/").split("/")
s = path.strip("/").split("/")
print("match" if len(p) == len(s) and all(a.startswith("<") or a == b for a, b in zip(p, s)) else "no match")''', extra=[('Checks length', '"len(p) == len(s)" in src')], wrong=[r'''print("no match")''']),
 dict(prompt='Ask `Path: `. `ROUTES` and the loop that tries them in order are given. Write `match(pattern, path)`: return `None` if the path does not fit, otherwise a dict of the parameters (`<id>` becomes the key `id`). A plain route returns `{}`. Ignore leading and trailing slashes.',
  starter=r'''ROUTES = [
    ("/users/<id>", "user"),
    ("/users/<id>/posts/<post>", "post"),
    ("/about", "about"),
]

# write match(pattern, path) here

path = input("Path: ")
for pattern, name in ROUTES:
    params = match(pattern, path)
    if params is not None:
        print(f"Handler: {name}, params: {params}")
        break
else:
    print("404 Not Found")''',
  cases=[dict(inputs=['/users/7'], name='One parameter'), dict(inputs=['/users/7/posts/12'], name='Two parameters'), dict(inputs=['/about'], name='Plain route'), dict(inputs=['/users'], name='Too short'), dict(inputs=['/users/7/extra'], name='Too long'), dict(inputs=['/about/'], name='Trailing slash'), dict(inputs=['/other'], name='Different word'), dict(inputs=['/'], name='Root')],
  sol=s13,
  wrong=[('    if len(p_parts) != len(s_parts):\n        return None\n', ''), ('    elif p != s:\n            return None', '    elif False:\n            return None'), ('params[p[1:-1]] = s', 'params[p] = s'), ('        elif p != s:\n            return None', '        elif p != s:\n            return {}'), ('p_parts = pattern.strip("/").split("/")', 'p_parts = pattern.split("/")')],
  hints=['Split pattern and path into segments with strip("/").split("/").', 'If the number of segments differs, return None. Then compare segment by segment with zip.', 'A segment like <id> stores params["id"] = the path segment; any other segment must be equal or return None.']),
 dict(can=['Match URL patterns with parameters', 'Explain why route order matters'], expand='Support `<int:id>` that only matches digits and converts the value to an `int`.', where='Every web framework routes this way; microservices and API gateways run thousands of such patterns.', next='Next: read the query string safely.'),
 dict(title='Routing', body='Split pattern and path on "/". Different length -> None. <name> segments capture strings; other segments must be equal. Return {} for no params, None for no match; test with "is not None".', snip='if len(p_parts) != len(s_parts):\n    return None')))

# ---------------------------------------------------------------- 14 query strings
s14 = r'''from urllib.parse import urlparse, parse_qs

url = input("URL: ")
parts = urlparse(url)
query = parse_qs(parts.query)
page = int(query.get("page", ["1"])[0])
text = query.get("q", [""])[0]
tags = query.get("tag", [])
print("Path:", parts.path)
print("Query:", text)
print("Next page:", page + 1)
print("Tags:", ", ".join(tags) if tags else "none")'''
L.append(lesson('r14-14', 14, 'Query strings and urllib.parse', ['web-query'], ['web-route'],
 "A customer slides a long, tangled address across the counter: `/search?q=caf%C3%A9&tag=a%26b&tag=new&page=3`. \"Never take that apart with `split`,\" Quill warns. \"It has escapes, repeats and gaps. Use the guild's tools.\"",
 "URLs have escape rules: `%C3%A9` is `é`, `+` is a space, `%26` is `&`. Python's **`urllib.parse`** handles all of it:\n\n```\nfrom urllib.parse import urlparse, parse_qs, urlencode, quote\n\nparts = urlparse(\"https://shop.dev/search?q=red+shoes&tag=a&tag=b\")\nparts.path                    # '/search'\nparse_qs(parts.query)         # {'q': ['red shoes'], 'tag': ['a', 'b']}\nurlencode({\"q\": \"café\", \"page\": 2})   # 'q=caf%C3%A9&page=2'\n```\n\n- **`parse_qs`** returns a dict whose values are **lists**, because a key can repeat (`tag=a&tag=b`). It also decodes the escapes for you.\n- Use `.get(key, default)` with a **list default**, e.g. `query.get(\"page\", [\"1\"])[0]`, so a missing key never crashes.\n- Query values are always **strings**: convert with `int(...)` before doing arithmetic.\n- Never trust them: a user can send `page=abc`. Real code validates (next lessons).\n- `urlencode` builds a query string safely; never glue strings together by hand.\n- Hand-rolled `split(\"&\")` and `split(\"=\")` break on encoded characters and repeated keys, and are a classic source of security bugs.",
 "A customs officer who opens sealed packages the proper way instead of tearing them.",
 r'''from urllib.parse import parse_qs
print(parse_qs("tag=a&tag=b&q=hi+there"))''',
 predict(r'''from urllib.parse import parse_qs
print(parse_qs("q=a%26b")["q"][0])''', 'What prints?', ['a&b', 'a%26b', "['a&b']"], 0, '%26 is the escape for an ampersand. parse_qs decodes it, and [0] picks the first (only) value.'),
 dict(broken=r'''from urllib.parse import parse_qs
query = parse_qs("page=3")
page = query.get("page", ["1"])[0]
print("Next page:", page + 1)''', task='Query values are strings, so `page + 1` crashes. Convert the page to a number before adding. Expected: `Next page: 4`',
  sol=r'''from urllib.parse import parse_qs
query = parse_qs("page=3")
page = int(query.get("page", ["1"])[0])
print("Next page:", page + 1)''', extra=[('Uses int', '"= int(" in src')], wrong=[r'''print("Next page: 4")''']),
 dict(prompt='Ask `URL: `. Use `urlparse` and `parse_qs`. Print `Path: <path>`, `Query: <q or empty text>`, `Next page: <page + 1>` (`page` defaults to 1 and is a number), and `Tags: <all tag values joined by ", ">` or `Tags: none`.',
  starter=r'''from urllib.parse import urlparse, parse_qs

url = input("URL: ")
''',
  cases=[dict(inputs=['https://shop.dev/search?q=red+shoes&page=3&tag=sale&tag=new'], name='Full URL'), dict(inputs=['/search'], name='Nothing at all'), dict(inputs=['/find?q=caf%C3%A9&tag=a%26b'], name='Escapes decoded'), dict(inputs=['https://x.io/list?page=2'], name='Only page'), dict(inputs=['/s?tag=one&tag=two&tag=three&q='], name='Empty q, many tags')],
  sol=s14,
  wrong=[('int(query.get("page", ["1"])[0])', 'query.get("page", ["1"])[0]'), ('tags = query.get("tag", [])', 'tags = query.get("tag", [])[:1]'), ('["1"]', '["0"]'), ('parse_qs(parts.query)', 'dict(p.split("=") for p in parts.query.split("&") if p)'), ('parts.path', 'parts.netloc')],
  hints=['parts = urlparse(url); query = parse_qs(parts.query).', 'query.get("page", ["1"])[0] gives the first value or "1"; wrap it in int().', 'tags = query.get("tag", []) is a list; join it or print none when empty.']),
 dict(can=['Parse URLs and query strings correctly', 'Handle repeated and missing parameters'], expand='Build a link for the next page with `urlencode` so the other parameters are kept.', where='Search pages, filters and pagination links are all query strings.', next='Next: register routes with decorators.'),
 dict(title='urllib.parse', body='urlparse(url).path/.query; parse_qs(query) -> {key: [values]} decoded; query.get(key, default_list)[0]; int() the numbers; urlencode builds queries. Never split by hand.', snip='query = parse_qs(urlparse(url).query)\npage = int(query.get("page", ["1"])[0])')))

# ---------------------------------------------------------------- 15 route decorator
s15 = r'''class App:
    def __init__(self):
        self.routes = {}

    def route(self, path):
        def decorator(func):
            self.routes[path] = func
            return func
        return decorator

    def handle(self, path):
        func = self.routes.get(path)
        if func is None:
            return 404, "Not Found"
        return 200, func()

app = App()

@app.route("/hello")
def hello():
    return "Hello!"

@app.route("/bye")
def bye():
    return "Goodbye!"

status, body = app.handle(input("Path: "))
print(status, body)'''
L.append(lesson('r14-15', 15, 'Decorators that register routes', ['web-decorator'], ['web-query'],
 "Quill points at a famous line in a famous framework: `@app.route(\"/hello\")`. \"It looks like magic,\" the Archmage says. \"It is a **decorator with an argument**. Build it once and the magic is gone, which is the best kind of magic.\"",
 "A decorator with an argument is a **function that returns a decorator**:\n\n```\nclass App:\n    def route(self, path):            # step 1: receives \"/hello\"\n        def decorator(func):          # step 2: receives the function\n            self.routes[path] = func  # register it\n            return func               # hand the function back unchanged\n        return decorator\n\n@app.route(\"/hello\")\ndef hello(): ...\n```\n\n- `@app.route(\"/hello\")` first **calls** `app.route(\"/hello\")`, which returns `decorator`. Then Python calls `decorator(hello)`.\n- It is shorthand for `hello = app.route(\"/hello\")(hello)`.\n- The decorator **must return a function** (usually `func` itself). If it returns `None`, the name `hello` becomes `None`, a very common beginner bug.\n- Registering functions in a dict keyed by path gives `O(1)` lookup.\n- The same pattern builds command handlers, plugin systems, event listeners and test registries.\n- To keep `__name__` and docstrings when you *wrap* a function, use `functools.wraps`.",
 "A coat-check desk: you hand over a coat with a ticket number and later redeem the ticket, but you always get your own coat back.",
 r'''registry = {}

def register(name):
    def decorator(func):
        registry[name] = func
        return func
    return decorator

@register("hi")
def hi():
    return "hello"

print(registry["hi"]())''',
 predict(r'''def tag(label):
    def decorator(func):
        return label
    return decorator

@tag("x")
def f():
    pass

print(f)''', 'What prints?', ['x', 'None', '<function f>'], 0, 'The decorator returned the label instead of the function, so the name f now refers to the string "x".'),
 dict(broken=r'''def register(name):
    def decorator(func):
        print("registered", name)
    return decorator

@register("hi")
def hi():
    return "hello"

print(hi())''', task='`hi()` crashes because the decorator replaced `hi` with `None`. Make the decorator hand the function back. Expected: `registered hi`, then `hello`.',
  sol=r'''def register(name):
    def decorator(func):
        print("registered", name)
        return func
    return decorator

@register("hi")
def hi():
    return "hello"

print(hi())''', extra=[('Returns the function', '"return func" in src')], wrong=[r'''print("registered hi")
print("hello")''']),
 dict(prompt='Ask `Path: `. The `App` class, the handlers and the final lines are given, except `route(self, path)`. Write it as a **decorator factory**: it stores the decorated function in `self.routes[path]` and returns the original function.',
  starter=r'''class App:
    def __init__(self):
        self.routes = {}

    # write route(self, path) here

    def handle(self, path):
        func = self.routes.get(path)
        if func is None:
            return 404, "Not Found"
        return 200, func()

app = App()

@app.route("/hello")
def hello():
    return "Hello!"

@app.route("/bye")
def bye():
    return "Goodbye!"

status, body = app.handle(input("Path: "))
print(status, body)''',
  cases=[dict(inputs=['/hello'], name='Hello', extra=[('Function still works', 'g["hello"]() == "Hello!"')]), dict(inputs=['/bye'], name='Bye', extra=[('Second function too', 'g["bye"]() == "Goodbye!"')]), dict(inputs=['/missing'], name='Unknown'), dict(inputs=['/'], name='Root')],
  sol=s15,
  wrong=[('            return func\n', '            return None\n'), ('self.routes[path] = func', 'self.routes[func.__name__] = func'), ('self.routes[path] = func', 'self.routes[path.upper()] = func'), ('        return decorator\n', '        return None\n'), ('self.routes[path] = func', 'self.routes[path] = func()')],
  hints=['route(self, path) must return a function called decorator.', 'decorator(func) stores self.routes[path] = func.', 'decorator must return func so the decorated name keeps working.']),
 dict(can=['Write a decorator that takes an argument', 'Build a registry of handlers like Flask does'], expand='Make `route` accept a list of methods and store `(method, path)` pairs.', where='Flask, FastAPI, pytest and click all register functions with decorators like this.', next='Next: middleware that wraps every request.'),
 dict(title='Decorator factory', body='@app.route("/x") = app.route("/x")(func). route(path) returns decorator(func) which registers func and returns func (never None).', snip='def route(self, path):\n    def decorator(func):\n        self.routes[path] = func\n        return func\n    return decorator')))

# ---------------------------------------------------------------- 16 middleware
s16 = r'''def logger(next_handler):
    def wrapped(request):
        print("-> request", request["path"])
        response = next_handler(request)
        print("<- status", response["status"])
        return response
    return wrapped

def auth(next_handler):
    def wrapped(request):
        if request.get("token") != "secret":
            return {"status": 401, "body": "Unauthorized"}
        return next_handler(request)
    return wrapped

def home(request):
    return {"status": 200, "body": "Welcome"}

def build(handler, middlewares):
    for middleware in reversed(middlewares):
        handler = middleware(handler)
    return handler

token = input("Token: ")
app = build(home, [logger, auth])
response = app({"path": "/", "token": token})
print(response["status"], response["body"])'''
L.append(lesson('r14-16', 16, 'Middleware: layers around every request', ['web-middleware'], ['web-decorator'],
 "Every message into the Guild passes a **gatekeeper**, a **scribe** and finally the clerk. \"None of them knows about the others,\" Quill says. \"Each wraps the next. In the web world this is called **middleware**.\"",
 "**Middleware** is code that runs around every request: logging, login checks, timing, error handling. Each layer is a function that **takes a handler and returns a new handler**:\n\n```\ndef auth(next_handler):\n    def wrapped(request):\n        if request.get(\"token\") != \"secret\":\n            return {\"status\": 401, \"body\": \"Unauthorized\"}   # stop here\n        return next_handler(request)                          # pass it on\n    return wrapped\n\ndef build(handler, middlewares):\n    for middleware in reversed(middlewares):   # wrap from the inside out\n        handler = middleware(handler)\n    return handler\n```\n\n- A layer can run code **before** calling `next_handler(request)`, **after** it (to look at the response), or **instead** of it (to refuse).\n- The **first** middleware in the list should be the **outermost**: wrap the innermost layers first, which means looping in `reversed` order.\n- With `[logger, auth]`, logging happens even for refused requests. With `[auth, logger]`, refused requests are never logged. Order is a design decision.\n- Functions that take and return functions are called **higher-order functions**.\n- Real examples: Django middleware, Express `app.use`, Python's WSGI/ASGI wrappers.",
 "Russian dolls: each doll wraps the next one, and a request must open them from the outside in.",
 r'''def shout(f):
    def wrapped(x):
        return f(x).upper()
    return wrapped

def greet(name):
    return "hi " + name

print(shout(greet)("ada"))''',
 predict(r'''print(list(reversed([1, 2, 3])))''', 'What prints?', ['[3, 2, 1]', '[1, 2, 3]', '[2, 3, 1]'], 0, 'reversed walks the list from the end: 3, 2, 1.'),
 dict(broken=r'''def add_one(f):
    def wrapped(x):
        f(x) + 1
    return wrapped

def double(x):
    return x * 2

print(add_one(double)(5))''', task='The wrapper computes the answer but throws it away, so it prints `None`. Make `wrapped` give the result back. Expected: `11`',
  sol=r'''def add_one(f):
    def wrapped(x):
        return f(x) + 1
    return wrapped

def double(x):
    return x * 2

print(add_one(double)(5))''', extra=[('Returns the result', '"return f(x)" in src')], wrong=[r'''print(11)''']),
 dict(prompt='Ask `Token: `. `logger`, `auth` and `home` are given. Write `build(handler, middlewares)` so that the **first** middleware in the list is the **outermost** layer. It returns the finished handler.',
  starter=r'''def logger(next_handler):
    def wrapped(request):
        print("-> request", request["path"])
        response = next_handler(request)
        print("<- status", response["status"])
        return response
    return wrapped

def auth(next_handler):
    def wrapped(request):
        if request.get("token") != "secret":
            return {"status": 401, "body": "Unauthorized"}
        return next_handler(request)
    return wrapped

def home(request):
    return {"status": 200, "body": "Welcome"}

# write build(handler, middlewares) here

token = input("Token: ")
app = build(home, [logger, auth])
response = app({"path": "/", "token": token})
print(response["status"], response["body"])''',
  cases=[dict(inputs=['secret'], name='Allowed'), dict(inputs=['wrong'], name='Refused but still logged', extra=[('Logger is outermost', 'lines[1]=="-> request /"')]), dict(inputs=[''], name='No token')],
  sol=s16,
  wrong=[('reversed(middlewares)', 'middlewares'), ('        handler = middleware(handler)\n    return handler', '        handler = middleware(handler)\n    return home'), ('    for middleware in reversed(middlewares):\n        handler = middleware(handler)', '    for middleware in reversed(middlewares[:1]):\n        handler = middleware(handler)'), ('    return handler', '    return middlewares[0](handler)')],
  hints=['Start with the handler and wrap it once per middleware.', 'Loop over reversed(middlewares) so the first one is applied last (outermost).', 'handler = middleware(handler) inside the loop; return handler at the end.']),
 dict(can=['Wrap handlers in reusable layers', 'Explain why middleware order matters'], expand='Add a `timer` middleware that prints how many steps (use a counter) the request took.', where='Authentication, CORS, compression, rate limiting and error pages are all middleware in real frameworks.', next='Next: store passwords safely.'),
 dict(title='Middleware', body='A middleware takes a handler and returns a wrapped handler: before, after or instead of calling next. Build with reversed(list) so the first listed is outermost. Order changes behaviour.', snip='for mw in reversed(middlewares):\n    handler = mw(handler)')))

# ---------------------------------------------------------------- 17 passwords
s17 = r'''import hashlib
import hmac

SALT = b"spellbook-salt"
ITERATIONS = 1000

def hash_password(password):
    digest = SALT + password.encode("utf-8")
    for _ in range(ITERATIONS):
        digest = hashlib.sha256(digest).digest()
    return digest.hex()

def verify(stored, attempt):
    return hmac.compare_digest(stored, hash_password(attempt))

password = input("Password: ")
stored = hash_password(password)
print("Stored:", stored[:16])
attempt = input("Attempt: ")
print("Login ok" if verify(stored, attempt) else "Login failed")'''
L.append(lesson('r14-17', 17, 'Passwords: hashing, salt and safe comparison', ['web-auth'], ['web-middleware'],
 "A thief once stole the Guild's ledger of members and their secret words, written in plain ink. \"Never again,\" says Quill, sealing a new ledger with brass. \"We store only a **scrambled fingerprint** that cannot be unscrambled.\"",
 "**Never store passwords.** Store a **hash**: a one-way fingerprint.\n\n```\nimport hashlib, hmac\ndigest = SALT + password.encode(\"utf-8\")\nfor _ in range(ITERATIONS):\n    digest = hashlib.sha256(digest).digest()   # hash the hash, again and again\nstored = digest.hex()\n```\n\n- A **hash function** turns any input into a fixed-size scramble. The same input always gives the same output, but you cannot go backwards.\n- One plain `sha256(password)` is too fast: attackers try billions of guesses per second. **Key stretching** repeats the hash `ITERATIONS` times so each guess costs more. Real Python code uses `hashlib.pbkdf2_hmac(...)` (or `bcrypt`, `scrypt`, `argon2`) with hundreds of thousands of rounds; this browser build has no OpenSSL, so we stretch by hand with 1000 rounds to see the idea.\n- A **salt** is extra data mixed in so two users with the same password get different hashes, and prebuilt \"rainbow tables\" are useless. Real code makes a fresh salt per user with `secrets.token_bytes(16)` and stores it next to the hash.\n- To check a login, hash the attempt the same way and compare. Use **`hmac.compare_digest(a, b)`**: it takes the same time however many characters match, so attackers cannot learn the answer from timing.\n- Both arguments of `compare_digest` must be the same type (two strings or two bytes).\n- Also: never log passwords, never email them, and use HTTPS.",
 "A fingerprint scanner: it can confirm your finger matches, but nobody can rebuild your finger from the scan.",
 r'''import hashlib
print(hashlib.sha256(b"a").hexdigest()[:8])
print(len(hashlib.sha256(b"a").hexdigest()))''',
 predict(r'''import hashlib
print(len(hashlib.sha256(b"a").hexdigest()))''', 'What prints?', ['64', '32', '8'], 0, 'SHA-256 makes 32 bytes, which are 64 hex characters.'),
 dict(broken=r'''import hmac, hashlib
stored = hashlib.sha256(b"pw").hexdigest()
attempt = hashlib.sha256(b"pw").digest()
print(hmac.compare_digest(stored, attempt))''', task='`compare_digest` needs two values of the **same type**. One is hex text and the other raw bytes, so it crashes. Make both hex text. Expected: `True`',
  sol=r'''import hmac, hashlib
stored = hashlib.sha256(b"pw").hexdigest()
attempt = hashlib.sha256(b"pw").hexdigest()
print(hmac.compare_digest(stored, attempt))''', extra=[('Both hex', 'src.count("hexdigest()") == 2')], wrong=[r'''print(True)''']),
 dict(prompt='Ask `Password: ` and `Attempt: `. `SALT` and `ITERATIONS` are given. Write `hash_password(password)` (start from the salt followed by the password bytes, apply SHA-256 `ITERATIONS` times to the result of the previous round, return the final digest as hex text) and `verify(stored, attempt)` (hash the attempt and compare with `hmac.compare_digest`). The program prints the first 16 hex characters of the stored hash, then `Login ok` or `Login failed`.',
  starter=r'''import hashlib
import hmac

SALT = b"spellbook-salt"
ITERATIONS = 1000

# write hash_password and verify here

password = input("Password: ")
stored = hash_password(password)
print("Stored:", stored[:16])
attempt = input("Attempt: ")
print("Login ok" if verify(stored, attempt) else "Login failed")''',
  cases=[dict(inputs=['hunter2', 'hunter2'], name='Right password', extra=[('Safe comparison', '"compare_digest" in src'), ('Stretches the hash', '"range(" in src and "SALT" in src')]), dict(inputs=['hunter2', 'Hunter2'], name='Wrong case'), dict(inputs=['a', 'b'], name='Different'), dict(inputs=['', ''], name='Empty password')],
  sol=s17,
  wrong=[('range(ITERATIONS)', 'range(ITERATIONS - 1)'), ('digest = SALT + password.encode("utf-8")', 'digest = password.encode("utf-8")'), ('hashlib.sha256(digest).digest()', 'hashlib.md5(digest).digest()'), ('hmac.compare_digest(stored, hash_password(attempt))', 'stored == hash_password(attempt)'), ('    for _ in range(ITERATIONS):\n        digest = hashlib.sha256(digest).digest()\n', '    digest = hashlib.sha256(digest).digest()\n'), ('return digest.hex()', 'return digest.hex()[::-1]')],
  hints=['Start with digest = SALT + password.encode("utf-8").', 'Repeat ITERATIONS times: digest = hashlib.sha256(digest).digest(). Return digest.hex().', 'verify hashes the attempt and returns hmac.compare_digest(stored, that_hash).']),
 dict(can=['Store passwords safely as salted, slowed hashes', 'Compare secrets without leaking timing'], expand='Generate a new random salt per user with `secrets.token_bytes(16)` and store `salt.hex() + ":" + hash`.', where='Every login system you use should do exactly this; a plain-text password database is a company-ending mistake.', next='Next: check what people send you.'),
 dict(title='Password hashing', body='Store a salted, repeatedly hashed digest (real code: hashlib.pbkdf2_hmac / bcrypt / argon2), never the password. Salt per user (secrets.token_bytes). Compare with hmac.compare_digest. Never log or email passwords.', snip='for _ in range(ITERATIONS):\n    digest = hashlib.sha256(digest).digest()')))

# ---------------------------------------------------------------- 18 validation
s18 = r'''import json

def validate(data):
    errors = []
    name = data.get("name")
    if not isinstance(name, str) or not name.strip() or len(name) > 20:
        errors.append("name must be 1-20 characters")
    age = data.get("age")
    if not isinstance(age, int) or isinstance(age, bool) or not 0 <= age <= 130:
        errors.append("age must be a whole number from 0 to 130")
    email = data.get("email")
    if not isinstance(email, str) or "@" not in email:
        errors.append("email must contain @")
    return errors

raw = input("Body: ")
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    print("400 Bad JSON")
else:
    errors = validate(data) if isinstance(data, dict) else ["body must be an object"]
    if errors:
        print("422", "; ".join(errors))
    else:
        print("201 Created")'''
L.append(lesson('r14-18', 18, 'Validation and honest error responses', ['web-validate'], ['web-auth'],
 "\"The golden rule of the Web Guild,\" Quill says, tapping a sign above the door: **never trust input**. \"People send typos, nonsense and traps. Your reply must say clearly *what* was wrong, so they can fix it.\"",
 "Data from outside is hostile until checked. A good API **validates** and answers with the right status:\n\n- **400 Bad Request**: the text is not even valid JSON.\n- **422 Unprocessable**: valid JSON, but the *values* are wrong. List **all** the problems at once, not just the first.\n- **201 Created** when it worked.\n\n```\ntry:\n    data = json.loads(raw)\nexcept json.JSONDecodeError:\n    ...400...\n\ndef validate(data):\n    errors = []\n    if not isinstance(name, str) or not name.strip() or len(name) > 20:\n        errors.append(\"name must be 1-20 characters\")\n    ...\n    return errors\n```\n\n- Use `data.get(\"key\")` (returns `None` when missing) instead of `data[\"key\"]` (crashes).\n- Check the **type first**, then the range: `isinstance(age, int)` before `0 <= age <= 130`.\n- **Trap:** in Python `True` is an `int`! `isinstance(True, int)` is `True`, so `\"age\": true` slips through unless you also exclude `bool`.\n- `\"  \".strip()` is empty, so whitespace-only names are caught with `name.strip()`.\n- Chained comparison `0 <= age <= 130` reads like maths and includes both ends.\n- Libraries such as `pydantic` automate this, but you now know what they do.",
 "An airport security desk: each rule is checked, and you are told every item to fix, not just the first.",
 r'''print(isinstance(True, int), isinstance("5", int))''',
 predict(r'''print(isinstance(True, int))''', 'What prints?', ['True', 'False', 'None'], 0, 'bool is a subclass of int in Python, so True counts as an int. That is why validators exclude bool explicitly.'),
 dict(broken=r'''age = True
if isinstance(age, int) and 0 <= age <= 130:
    print("valid")
else:
    print("invalid")''', task='A JSON `true` must **not** count as an age. Exclude booleans in the condition. Expected: `invalid`',
  sol=r'''age = True
if isinstance(age, int) and not isinstance(age, bool) and 0 <= age <= 130:
    print("valid")
else:
    print("invalid")''', extra=[('Excludes bool', '"isinstance(age, bool)" in src')], wrong=[r'''print("invalid")''']),
 dict(prompt='Ask `Body: ` (JSON text). The program already answers `400 Bad JSON` for broken JSON and `422 ...` when `validate` finds problems. Write `validate(data)` returning a **list of error messages**: `name must be 1-20 characters` (a non-blank text of at most 20 characters), `age must be a whole number from 0 to 130` (not a bool) and `email must contain @` (a text containing `@`). Missing fields are errors too.',
  starter=r'''import json

# write validate(data) here

raw = input("Body: ")
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    print("400 Bad JSON")
else:
    errors = validate(data) if isinstance(data, dict) else ["body must be an object"]
    if errors:
        print("422", "; ".join(errors))
    else:
        print("201 Created")''',
  cases=[dict(inputs=['{"name": "Ada", "age": 36, "email": "ada@x.dev"}'], name='Valid'), dict(inputs=['{}'], name='Everything missing'), dict(inputs=['{"name": "Al", "age": true, "email": "a@b"}'], name='Boolean age'), dict(inputs=['{"name": "Al", "age": 131, "email": "a@b"}'], name='Age too high'), dict(inputs=['{"name": "Al", "age": 130, "email": "a@b"}'], name='Age at the limit'), dict(inputs=['{"name": "Al", "age": 0, "email": "a@b"}'], name='Age zero'), dict(inputs=['{"name": "Al", "age": "5", "email": "a@b"}'], name='Age as text'), dict(inputs=['{"name": "abcdefghijklmnopqrstu", "age": 5, "email": "a@b"}'], name='Name 21 characters'), dict(inputs=['{"name": "abcdefghijklmnopqrst", "age": 5, "email": "a@b"}'], name='Name 20 characters'), dict(inputs=['{"name": "   ", "age": 5, "email": "a@b"}'], name='Blank name'), dict(inputs=['{"name": "Al", "age": 5, "email": "nope"}'], name='Bad email'), dict(inputs=['{"name": "Al", "age": -1, "email": "a@b"}'], name='Negative age'), dict(inputs=['{oops'], name='Broken JSON'), dict(inputs=['[1, 2]'], name='Not an object')],
  sol=s18,
  wrong=[('or isinstance(age, bool) ', ''), ('0 <= age <= 130', '0 <= age < 130'), ('len(name) > 20', 'len(name) > 21'), ('not name.strip() or ', ''), ('0 <= age <= 130', '1 <= age <= 130'), ('"@" not in email', 'len(email) < 3'), ('not isinstance(email, str) or ', ''), ('0 <= age <= 130', 'age >= 0')],
  hints=['Start with errors = [] and append one message per broken rule.', 'Use data.get("name") so a missing key gives None instead of crashing; check the type first.', 'For age: isinstance int, not bool, and 0 <= age <= 130.']),
 dict(can=['Validate untrusted data and report every problem', 'Choose between 400, 422 and 201'], expand='Add a rule that the email must have text before and after the `@` and a dot after it.', where='Signup forms, payment APIs and file importers all depend on this layer between the wild and your database.', next='Next: create, read, update and delete.'),
 dict(title='Validation', body='Never trust input. 400 = unparsable; 422 = parsed but wrong; list all errors. data.get(); check type then range; exclude bool from int checks; strip() blank text.', snip='if not isinstance(age, int) or isinstance(age, bool):\n    errors.append("age must be a whole number")')))

# ---------------------------------------------------------------- 19 CRUD
s19 = r'''import json

books = {}
next_id = 1

def handle(method, path, body):
    global next_id
    parts = path.strip("/").split("/")
    if parts[0] != "books":
        return 404, "Not Found"
    if len(parts) == 1:
        if method == "GET":
            return 200, list(books.values())
        if method == "POST":
            book = {"id": next_id, **body}
            books[next_id] = book
            next_id += 1
            return 201, book
        return 405, "Method Not Allowed"
    book_id = int(parts[1])
    if book_id not in books:
        return 404, "Not Found"
    if method == "GET":
        return 200, books[book_id]
    if method == "PUT":
        books[book_id] = {"id": book_id, **body}
        return 200, books[book_id]
    if method == "DELETE":
        del books[book_id]
        return 204, None
    return 405, "Method Not Allowed"

while True:
    line = input("> ")
    if line == "quit":
        break
    method, path, *rest = line.split(" ", 2)
    body = json.loads(rest[0]) if rest else {}
    status, data = handle(method, path, body)
    print(status, json.dumps(data))'''
L.append(lesson('r14-19', 19, 'CRUD: the four verbs of a REST API', ['web-crud'], ['web-validate'],
 "Quill unrolls a map with four brass rivets labelled **Create, Read, Update, Delete**. \"Nearly every web service you will ever build is these four verbs wearing different hats,\" the Archmage says. \"Learn them on a library of books.\"",
 "**REST** maps the four everyday actions on *things* to HTTP methods and URLs:\n\n| Action | Request | Success |\n|---|---|---|\n| Create | `POST /books` + JSON | **201** + the new book |\n| Read all | `GET /books` | 200 + list |\n| Read one | `GET /books/3` | 200 + book, or **404** |\n| Update | `PUT /books/3` + JSON | 200 + book |\n| Delete | `DELETE /books/3` | **204** (no body) |\n\n```\nbook = {\"id\": next_id, **body}      # merge the client's fields into a new dict\nbooks[next_id] = book\nnext_id += 1                        # ids are never reused\n```\n\n- A dict `id -> book` is a tiny in-memory database (a real service uses SQL; the logic is the same).\n- Check `book_id in books` **before** reading or deleting: a missing id is a **404**, not a crash.\n- A known path with the wrong method is **405 Method Not Allowed**.\n- `global next_id` is needed to *assign* to a module-level variable inside a function.\n- `{\"id\": id, **body}` puts `id` first and lets the client's fields follow. A client must not choose its own id.\n- `PUT` replaces the whole item; `PATCH` (not covered here) changes only some fields.",
 "A library desk: add a book, look one up, swap it for a new edition, or take it off the shelf.",
 r'''items = {}
items[1] = {"id": 1, "title": "Dune"}
print(items[1]["title"], 2 in items)''',
 predict(r'''body = {"title": "Dune"}
print({"id": 1, **body})''', 'What prints?', ["{'id': 1, 'title': 'Dune'}", "{'title': 'Dune', 'id': 1}", "{'id': 1}"], 0, '** unpacks body into the new dict after the id key, so the id comes first.'),
 dict(broken=r'''books = {1: "Dune"}
del books[2]
print("deleted")''', task='Deleting a missing id crashes with `KeyError`. Check that the id exists first: if it does not, print `404` instead. Expected: `404`',
  sol=r'''books = {1: "Dune"}
if 2 in books:
    del books[2]
    print("deleted")
else:
    print(404)''', extra=[('Checks first', '" in books" in src')], wrong=[r'''print(404)''']),
 dict(prompt='A tiny book API reads commands like `POST /books {"title": "Dune"}`, `GET /books/1`, `PUT /books/1 {...}`, `DELETE /books/1` until `quit`. The loop that prints `<status> <JSON>` is given. Write `handle(method, path, body)` returning `(status, data)`. `POST` creates (201) with the next id (1, 2, 3... never reused); `GET /books` lists (200); `GET`/`PUT`/`DELETE` on `/books/<id>` give 200/200/204 (`None` data on delete) or 404 for an unknown id; a known route with an unsupported method is 405; any other path is 404.',
  starter=r'''import json

books = {}
next_id = 1

# write handle(method, path, body) here

while True:
    line = input("> ")
    if line == "quit":
        break
    method, path, *rest = line.split(" ", 2)
    body = json.loads(rest[0]) if rest else {}
    status, data = handle(method, path, body)
    print(status, json.dumps(data))''',
  cases=[dict(inputs=['POST /books {"title": "Dune"}', 'POST /books {"title": "Emma", "year": 1815}', 'GET /books', 'GET /books/2', 'PUT /books/1 {"title": "Dune Messiah"}', 'PUT /books/2 {"title": "Emma 2"}', 'GET /books/2', 'DELETE /books/2', 'GET /books/2', 'POST /books {"title": "Ulysses"}', 'GET /books', 'quit'], name='Full tour'), dict(inputs=['GET /books/5', 'DELETE /books/1', 'PUT /books/1 {"title": "x"}', 'quit'], name='Unknown ids'), dict(inputs=['PATCH /books', 'DELETE /books', 'GET /movies', 'POST /books {"title": "A"}', 'POST /books {"title": "B"}', 'PATCH /books/1', 'quit'], name='Wrong methods and paths'), dict(inputs=['quit'], name='Nothing')],
  sol=s19,
  wrong=[('            next_id += 1\n', ''), ('        return 204, None', '        return 200, None'), ('            return 201, book', '            return 200, book'), ('        books[book_id] = {"id": book_id, **body}', '        books[book_id].update(body)'), ('            return 200, list(books.values())', '            return 200, books'), ('    if book_id not in books:\n        return 404, "Not Found"\n', ''), ('            book = {"id": next_id, **body}', '            book = {**body}'), ('    return 405, "Method Not Allowed"\n\nwhile', '    return 404, "Not Found"\n\nwhile')],
  hints=['Split the path: parts = path.strip("/").split("/"). If parts[0] is not "books" return 404.', 'One part means the collection (GET list, POST create). Two parts means one book: convert parts[1] with int() and check it is in books.', 'POST: book = {"id": next_id, **body}; store it; next_id += 1; return 201, book. DELETE returns 204, None.']),
 dict(can=['Build create, read, update and delete handlers', 'Pick correct status codes: 200, 201, 204, 404, 405'], expand='Add `GET /books?title=Dune` that filters the list.', where='This is the backbone of almost every mobile app backend and admin panel.', next='Mission time: assemble a mini web framework.'),
 dict(title='REST CRUD', body='POST create -> 201; GET list/one -> 200 or 404; PUT replace -> 200; DELETE -> 204. Check the id exists first. Known path, wrong method -> 405. Dict id -> item is the tiny database.', snip='book = {"id": next_id, **body}\nbooks[next_id] = book\nnext_id += 1')))

# ---------------------------------------------------------------- 20 mission
s20 = r'''import json
from urllib.parse import urlparse, parse_qs

def match(pattern, path):
    p_parts = pattern.strip("/").split("/")
    s_parts = path.strip("/").split("/")
    if len(p_parts) != len(s_parts):
        return None
    params = {}
    for p, s in zip(p_parts, s_parts):
        if p.startswith("<") and p.endswith(">"):
            params[p[1:-1]] = s
        elif p != s:
            return None
    return params

class App:
    def __init__(self):
        self.routes = []

    def route(self, method, pattern):
        def decorator(func):
            self.routes.append((method, pattern, func))
            return func
        return decorator

    def handle(self, method, target):
        parsed = urlparse(target)
        query = {key: values[0] for key, values in parse_qs(parsed.query).items()}
        path_exists = False
        for route_method, pattern, func in self.routes:
            params = match(pattern, parsed.path)
            if params is None:
                continue
            path_exists = True
            if route_method != method:
                continue
            try:
                return func(params, query)
            except Exception:
                return 500, "Internal Server Error"
        if path_exists:
            return 405, "Method Not Allowed"
        return 404, "Not Found"

app = App()
USERS = {"1": "Ada", "2": "Lin"}

@app.route("GET", "/users/<id>")
def get_user(params, query):
    name = USERS.get(params["id"])
    if name is None:
        return 404, "No such user"
    return 200, name

@app.route("GET", "/search")
def search(params, query):
    return 200, "Results for " + query.get("q", "nothing")

@app.route("POST", "/echo")
def echo(params, query):
    return 201, json.dumps(query, sort_keys=True)

@app.route("GET", "/boom")
def boom(params, query):
    return 200, str(1 / 0)

@app.route("GET", "/bad")
def bad(params, query):
    return 200, {}["missing"]

while True:
    line = input("> ")
    if line == "quit":
        break
    method, target = line.split(" ")
    status, body = app.handle(method, target)
    print(status, body)'''
st20 = s20[:s20.index('    def handle(self, method, target):')] + '''    # write handle(self, method, target) here

''' + s20[s20.index('app = App()'):]
L.append(lesson('r14-20', 20, 'Real-World Mission: A Mini Web Framework', ['mission14b'], ['web-crud'],
 "The Web Guild's master, a tall figure wired with copper cables, sets down a challenge: *\"Flask is only a few hundred lines in its heart. Build the heart.\"* Quill grins. \"Every piece you need, you already wrote. Now they meet.\"",
 "This mission joins the whole Web Guild toolkit into one dispatcher:\n\n```\ndef handle(self, method, target):\n    parsed = urlparse(target)                     # path + query\n    query = {k: v[0] for k, v in parse_qs(parsed.query).items()}\n    path_exists = False\n    for route_method, pattern, func in self.routes:\n        params = match(pattern, parsed.path)      # routing\n        if params is None:\n            continue\n        path_exists = True                        # the PATH is known...\n        if route_method != method:\n            continue                              # ...but not for this METHOD\n        try:\n            return func(params, query)            # run the handler\n        except Exception:\n            return 500, \"Internal Server Error\"   # a crash is the server's fault\n    return 405 if path_exists else 404\n```\n\n- **404** means *no route has this path*; **405** means *the path exists, but not for this method*. Track `path_exists` to tell them apart.\n- A handler that crashes must not take the whole server down: catch the error and answer **500**.\n- A dictionary comprehension turns `parse_qs`'s lists into simple first values.\n- Handlers get `(params, query)`: path parameters from the route, query parameters from `?...`.\n- Add the pieces from earlier lessons (validation, middleware, auth) and you have the skeleton of a real framework.",
 "A hotel front desk: wrong building (404), right building but that service is closed to you (405), and an apology when something inside catches fire (500).",
 r'''query = {"a": ["1", "2"], "b": ["3"]}
print({k: v[0] for k, v in query.items()})''',
 predict(r'''print({k: len(k) for k in ["ab", "c"]})''', 'What prints?', ["{'ab': 2, 'c': 1}", "{'ab': 1, 'c': 1}", "['ab', 'c']"], 0, 'The dict comprehension makes one entry per key, with the length of each key as its value.'),
 dict(broken=r'''def risky():
    return 1 / 0

try:
    print(risky())
except ZeroDivisionError:
    print(500, "Internal Server Error")
print("still running")''', task='The server survived, but the message should be printed for **any** crash, not just a division by zero. Catch the general `Exception`. Expected: `500 Internal Server Error`, then `still running`.',
  sol=r'''def risky():
    return 1 / 0

try:
    print(risky())
except Exception:
    print(500, "Internal Server Error")
print("still running")''', extra=[('Catches Exception', '"except Exception" in src')], wrong=[r'''print(500, "Internal Server Error")
print("still running")''']),
 dict(prompt='A mini framework: `match`, the `App` class with its `route(method, pattern)` decorator, four handlers and a request loop (`GET /users/1`, `quit`, ...) are given. Write `App.handle(method, target)`: split the target into path and query (`urlparse`, `parse_qs`, first value of each), find the route whose pattern matches **and** whose method matches and return its `(status, body)` by calling `func(params, query)`. A crashing handler gives `500, "Internal Server Error"`. A known path with the wrong method gives `405, "Method Not Allowed"`; an unknown path `404, "Not Found"`.',
  starter=st20,
  cases=[dict(inputs=['GET /users/1', 'GET /users/9', 'GET /search?q=cats', 'GET /search', 'POST /search', 'DELETE /users/1', 'GET /nothing', 'POST /echo?b=2&a=1', 'GET /boom', 'GET /bad', 'GET /after', 'quit'], name='Full tour'), dict(inputs=['GET /search?q=caf%C3%A9+au+lait', 'GET /search?q=a&q=b', 'quit'], name='Decoding and repeats'), dict(inputs=['GET /users/2/', 'GET /boom?x=1', 'quit'], name='Slash and query'), dict(inputs=['quit'], name='Nothing')],
  sol=s20,
  wrong=[('            if route_method != method:\n                continue\n', ''), ('            path_exists = True\n', ''), ('            except Exception:\n                return 500, "Internal Server Error"', '            except ZeroDivisionError:\n                return 500, "Internal Server Error"'), ('            try:\n                return func(params, query)\n            except Exception:\n                return 500, "Internal Server Error"', '            return func(params, query)'), ('        if path_exists:\n            return 405, "Method Not Allowed"\n', ''), ('query = {key: values[0] for key, values in parse_qs(parsed.query).items()}', 'query = {}'), ('match(pattern, parsed.path)', 'match(pattern, target)'), ('return func(params, query)', 'return func(query, params)')],
  hints=['parsed = urlparse(target); build query = {key: values[0] ...} from parse_qs(parsed.query).', 'Loop over self.routes: skip if match(...) is None; remember the path exists; skip if the method differs; otherwise return func(params, query) inside try/except.', 'After the loop: 405 if the path existed, else 404.']),
 dict(can=['Assemble routing, decorators, query parsing and error handling into a framework', 'Tell 404, 405 and 500 apart'], expand='Add middleware support: `app.use(logger)` wraps every handler before dispatch.', where='Reading the source of Flask or Bottle after this lesson will feel like reading your own code.', next='Next door: the Data Guild, where numbers become decisions.'),
 dict(title='Dispatcher', body='urlparse + parse_qs -> path, query. For each route: match path (None = skip), remember path_exists, skip wrong method, run handler in try/except -> 500. After loop 405 if path_exists else 404.', snip='try:\n    return func(params, query)\nexcept Exception:\n    return 500, "Internal Server Error"')))

if __name__ == '__main__':
    emit('realm_14b.js', 'REALM 14 - THE HALL OF FOUR DOORS - part B (lessons 11-20: Web Guild). Generated by tools/spec14b.py', L)
