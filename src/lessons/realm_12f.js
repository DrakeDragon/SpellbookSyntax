// REALM 12 — THE MASTER GATE — part F (lessons 38-44: web APIs, without a network)
const eqG = (arr, prefix) => '[l for l in lines if not l.startswith("' + prefix + '")]==' + JSON.stringify(arr);

// ---------- 38 urls
const s38 = R`from urllib.parse import urlparse, parse_qs

text = input("URL: ").strip()
try:
    parts = urlparse(text)
    port = parts.port
except ValueError:
    parts = None
if parts is None or not parts.scheme or not parts.hostname:
    print("Invalid URL")
else:
    default = {"http": 80, "https": 443}.get(parts.scheme, "none")
    print("Scheme:", parts.scheme)
    print("Host:", parts.hostname)
    print("Port:", port or default)
    print("Path:", parts.path or "/")
    query = parse_qs(parts.query)
    print("Params:", ",".join(f"{k}={'|'.join(v)}" for k, v in sorted(query.items())) or "none")
    print("Fragment:", parts.fragment or "none")`;
const e38 = R`from urllib.parse import urlparse, parse_qs, urlencode, quote

parts = urlparse("https://Example.com:8080/a/b?x=1&tag=a&tag=b#top")
print(parts.scheme, parts.hostname, parts.port, parts.path, parts.fragment)
print(parts.netloc)
print(parse_qs(parts.query))
print(urlencode([("q", "rock & roll"), ("page", 2)]))
print(quote("a b/c"))`;

// ---------- 39 http status
const s39 = R`from http import HTTPStatus

RETRY = {408, 429, 500, 502, 503, 504}
CATEGORIES = {1: "info", 2: "success", 3: "redirect", 4: "client-error", 5: "server-error"}

for item in input("Codes: ").split():
    if not item.isdigit():
        print(item, "Invalid")
        continue
    code = int(item)
    try:
        phrase = HTTPStatus(code).phrase
    except ValueError:
        print(code, "Unknown")
        continue
    retry = "yes" if code in RETRY else "no"
    print(f"{code} {phrase} {CATEGORIES[code // 100]} retry={retry}")`;
const e39 = R`from http import HTTPStatus

status = HTTPStatus(404)
print(status.value, status.phrase, status.name)
print(HTTPStatus.OK.value, HTTPStatus.OK.phrase)
print(404 // 100, 503 // 100)
print(HTTPStatus.NOT_FOUND == 404)
try:
    HTTPStatus(999)
except ValueError as error:
    print("ValueError:", error)`;

// ---------- 40 json
const s40 = R`import json

text = input("Json: ")
try:
    data = json.loads(text)
except json.JSONDecodeError:
    print("Invalid JSON")
else:
    if not isinstance(data, dict):
        print("Expected an object")
    else:
        user = data.get("user") or {}
        name = user.get("name") if isinstance(user, dict) else None
        if not name:
            print("Missing: user.name")
        else:
            print("Name:", name)
            print("Plan:", user.get("plan", "free"))
            print("Calls:", (user.get("usage") or {}).get("calls", 0))
            print("Items:", len(data.get("items") or []))`;
const e40 = R`import json

text = '{"user": {"name": "Ada", "plan": null}, "items": [1, 2], "ok": true}'
data = json.loads(text)
print(data["user"]["name"], data["items"][0], data["ok"])
print(data["user"].get("plan", "free"))        # key exists but value is None
print(data["user"].get("plan") or "free")
print(data.get("missing", "default"))
print(json.dumps({"b": 1, "a": [True, None]}, sort_keys=True))`;

// ---------- 41 pagination
const pg41 = R`PAGES = {
    "/items?page=1": {"items": ["a", "b"], "next": "/items?page=2"},
    "/items?page=2": {"items": ["c"], "next": "/items?page=3"},
    "/items?page=3": {"items": ["d", "e"], "next": None},
    "/loop?page=1": {"items": ["x"], "next": "/loop?page=2"},
    "/loop?page=2": {"items": ["y"], "next": "/loop?page=1"},
    "/empty": {"items": [], "next": None},
}

def fetch(url):
    if url not in PAGES:
        raise LookupError("404 " + url)
    return PAGES[url]

`;
const fa41 = R`def fetch_all(fetch, url, max_pages=10):
    items, seen = [], set()
    while url is not None:
        if url in seen or len(seen) >= max_pages:
            return items, len(seen), True
        seen.add(url)
        page = fetch(url)
        items.extend(page["items"])
        url = page["next"]
    return items, len(seen), False
`;
const t41 = R`
start = input("Start: ")
try:
    items, pages, cycle = fetch_all(fetch, start)
except LookupError as error:
    print("Error:", error)
else:
    print("Items:", ",".join(items) or "none")
    print("Pages:", pages)
    if cycle:
        print("Warning: cycle detected")
`;
const e41 = R`PAGES = {
    "p1": {"items": [1, 2], "next": "p2"},
    "p2": {"items": [3], "next": None},
}

url, items = "p1", []
while url is not None:
    page = PAGES[url]
    items.extend(page["items"])
    url = page["next"]
print(items)

seen = set()
for u in ["a", "b", "a"]:
    print(u, u in seen)
    seen.add(u)`;

// ---------- 42 retry
const h42 = R`class TemporaryError(Exception):
    pass

def make_flaky(fails):
    state = {"calls": 0}
    def fn():
        state["calls"] += 1
        if fails == "fatal":
            raise ValueError("fatal")
        if state["calls"] <= int(fails):
            raise TemporaryError("try again")
        return "ok"
    return fn, state

`;
const t42 = R`
delays = []
fn, state = make_flaky(input("Fails: "))
attempts = int(input("Attempts: "))
try:
    result = call_with_retry(fn, attempts, 1, delays.append)
    print(f"Result: {result} after {state['calls']} attempts")
except TemporaryError:
    print(f"Gave up after {state['calls']} attempts")
except ValueError as error:
    print("Fatal:", error)
print("Delays:", delays)
`;
const f42 = R`def call_with_retry(fn, attempts, base_delay, sleep):
    for attempt in range(attempts):
        try:
            return fn()
        except TemporaryError:
            if attempt == attempts - 1:
                raise
            sleep(base_delay * 2 ** attempt)
`;
const e42 = R`class TemporaryError(Exception):
    pass

calls = []
def flaky():
    calls.append(1)
    if len(calls) < 3:
        raise TemporaryError("busy")
    return "done"

delays = []
for attempt in range(5):
    try:
        print(flaky())
        break
    except TemporaryError:
        delays.append(1 * 2 ** attempt)
print(delays)`;

// ---------- 43 client
const h43 = R`import json
from urllib.parse import urlencode, parse_qsl

LOG = []

class AuthError(Exception):
    pass

class ApiError(Exception):
    def __init__(self, status):
        super().__init__(f"HTTP {status}")
        self.status = status

def transport(method, url, headers):
    LOG.append((method, url, headers.get("Authorization")))
    path = url.split("?")[0].replace("https://api.guild.test", "")
    if path == "/users":
        return 200, '{"users": ["ada", "bob"]}'
    if path == "/missing":
        return 404, ""
    if path == "/secret":
        return 401, ""
    return 500, ""

`;
const c43 = R`class ApiClient:
    BASE = "https://api.guild.test"

    def __init__(self, transport, token):
        self.transport = transport
        self.token = token

    def get(self, path, **params):
        url = self.BASE + path
        if params:
            url += "?" + urlencode(sorted(params.items()))
        status, body = self.transport("GET", url, {"Authorization": f"Bearer {self.token}"})
        if status == 200:
            return json.loads(body)
        if status == 404:
            return None
        if status == 401:
            raise AuthError()
        raise ApiError(status)
`;
const t43 = R`
client = ApiClient(transport, "abc")
for item in input("Calls: ").split():
    path, _, query = item.partition("?")
    params = dict(parse_qsl(query))
    try:
        data = client.get("/" + path, **params)
    except AuthError:
        outcome = "auth error"
    except ApiError as error:
        outcome = f"api error {error.status}"
    else:
        outcome = "not found" if data is None else f"ok {data}"
    print(outcome)
    method, url, auth = LOG[-1]
    print(f"-> {method} {url} auth={auth}")
`;
const e43 = R`import json
from urllib.parse import urlencode

def fake_transport(method, url, headers):
    print("sent:", method, url, headers)
    return 200, '{"ok": true}'

class Client:
    def __init__(self, transport):
        self.transport = transport      # injected: real HTTP in production, a fake in tests

    def get(self, path, **params):
        url = "https://api.test" + path
        if params:
            url += "?" + urlencode(sorted(params.items()))
        status, body = self.transport("GET", url, {"Accept": "application/json"})
        return json.loads(body)

print(Client(fake_transport).get("/items", page=2, q="a b"))`;

// ---------- 44 mission gazette
const h44 = R`class TemporaryError(Exception):
    pass

PAGES = {
    "/items?page=1": {"items": ["a", "b"], "next": "/items?page=2"},
    "/items?page=2": {"items": ["c"], "next": "/items?page=3"},
    "/items?page=3": {"items": ["d", "e"], "next": None},
    "/loop?page=1": {"items": ["x"], "next": "/loop?page=2"},
    "/loop?page=2": {"items": ["y"], "next": "/loop?page=1"},
}

def make_server(fail_first):
    calls = {}
    def server(url):
        calls[url] = calls.get(url, 0) + 1
        if calls[url] <= fail_first.get(url, 0):
            raise TemporaryError("busy " + url)
        return PAGES[url]
    return server

`;
const g44 = R`def gather(fetch, url, attempts, sleep):
    items, seen, retries = [], set(), 0
    while url is not None:
        if url in seen:
            return items, len(seen), retries, "cycle"
        seen.add(url)
        for attempt in range(attempts):
            try:
                page = fetch(url)
                break
            except TemporaryError:
                if attempt == attempts - 1:
                    return items, len(seen) - 1, retries, "gave up"
                retries += 1
                sleep(2 ** attempt)
        items.extend(page["items"])
        url = page["next"]
    return items, len(seen), retries, "ok"
`;
const t44 = R`
fail_first = {}
for item in input("Flaky: ").split():
    page, _, count = item.partition(":")
    fail_first[page] = int(count)
delays = []
items, pages, retries, status = gather(make_server(fail_first), input("Start: "), 3, delays.append)
print("Items:", ",".join(items) or "none")
print("Pages:", pages)
print("Retries:", retries)
print("Status:", status)
print("Delays:", delays)
`;
const e44 = R`attempts = 4
print([2 ** a for a in range(attempts - 1)])      # delays between 4 attempts
print(sum(2 ** a for a in range(attempts - 1)))   # total waiting

for attempt in range(attempts):
    last = attempt == attempts - 1
    print(attempt, "last" if last else "retry")`;

LESSONS.push(
{
  id:'r12-38', realm:12, n:38, title:'URLs: take them apart, put them together',
  teaches:['web-url'], requires:['mission12e'],
  story:`Beyond the next door is the **Messenger Tower**, where spells travel to faraway guilds. "Every message needs an address," says Orrin, "and an address is a puzzle with seven pieces. Learn to read one, and to write one without errors."`,
  concept:{
    html:`A URL has structure: \`https://example.com:8080/a/b?x=1&tag=a&tag=b#top\`\n\n| Part | Value | Attribute |\n|---|---|---|\n| scheme | \`https\` | \`.scheme\` |\n| host | \`example.com\` | \`.hostname\` (lower-case, no port) |\n| port | \`8080\` | \`.port\` (an \`int\` or \`None\`) |\n| path | \`/a/b\` | \`.path\` |\n| query | \`x=1&tag=a&tag=b\` | \`.query\` |\n| fragment | \`top\` | \`.fragment\` |\n\n\`\`\`\nfrom urllib.parse import urlparse, parse_qs, urlencode, quote\n\nparts = urlparse(url)\nparse_qs(parts.query)            # {'x': ['1'], 'tag': ['a', 'b']}  (values are LISTS)\nurlencode([("q", "rock & roll")])  # 'q=rock+%26+roll'\nquote("a b/c")                   # 'a%20b/c'\n\`\`\`\n\n- Never build query strings by hand: spaces and \`&\` must be **escaped**. \`urlencode\` does it.\n- \`.netloc\` is the raw \`host:port\` chunk; prefer \`.hostname\` and \`.port\`.\n- Reading \`.port\` raises \`ValueError\` for an out-of-range port such as 99999.\n- A string without \`://\` (like \`example.com/page\`) has **no scheme and no host**.`,
    analogy:`A postal address: country, city, street, apartment. Each piece has its own slot.`,
    example:e38},
  predict:{code:R`from urllib.parse import urlparse
print(urlparse("http://a.com:81/x?y=1").port)`, q:'What prints?', opts:['81','None','"81"'], ans:0, why:'.port is an int.'},
  cast:{code:e38, task:'Cast it.'},
  bug:{broken:R`from urllib.parse import parse_qs
params = parse_qs("a=1&b=2")
print(params["a"])`, task:"parse_qs returns lists of values. Print just the value. Expected: 1",
    cases:[{inputs:[],tests:[['Works','lines==["1"]'],['First value','"[0]" in src']]}],
    sol:R`from urllib.parse import parse_qs
params = parse_qs("a=1&b=2")
print(params["a"][0])`, wrong:[R`print(1)`]},
  write:{prompt:'Ask `URL: ` and parse it. If it has no scheme or host, or the port is invalid, print `Invalid URL`. Otherwise print `Scheme:`, `Host:` (lower-case hostname), `Port:` (explicit port, or 80 for http, 443 for https, else `none`), `Path:` (`/` if empty), `Params:` (`key=value` pairs sorted by key, joined by commas; repeated keys joined with `|`; `none` if no query) and `Fragment:` (`none` if empty).',
    starter:R`from urllib.parse import urlparse, parse_qs

text = input("URL: ").strip()
`,
    inputs:['https://Example.com:8080/a/b?x=1&tag=a&tag=b&y=hello%20world#top'],
    cases:[{inputs:['https://Example.com:8080/a/b?x=1&tag=a&tag=b&y=hello%20world#top'],tests:[['Full','lines[-6:]==["Scheme: https","Host: example.com","Port: 8080","Path: /a/b","Params: tag=a|b,x=1,y=hello world","Fragment: top"]']]},{inputs:['http://site.org'],tests:[['Defaults','lines[-6:]==["Scheme: http","Host: site.org","Port: 80","Path: /","Params: none","Fragment: none"]']]},{inputs:['ftp://files.net/pub'],tests:[['Other scheme','lines[-4:-3]==["Port: none"]']]},{inputs:['https://x.test'],tests:[['https port','"Port: 443" in lines']]},{inputs:['example.com/page'],tests:[['No scheme','lines[-1]=="Invalid URL"']]},{inputs:['http://host:99999/'],tests:[['Bad port','lines[-1]=="Invalid URL"']]},{inputs:['https:///nohost'],tests:[['No host','lines[-1]=="Invalid URL"']]},{inputs:['//example.com/x'],tests:[['Scheme-relative is not absolute','lines[-1]=="Invalid URL"']]},{inputs:['mailto:a@b.c'],tests:[['Not a web URL','lines[-1]=="Invalid URL"']]}],
    sol:s38,
    wrong:[s38.replace('parts.hostname)\n    print("Port','parts.netloc)\n    print("Port'),s38.replace('port or default','default'),s38.replace('parts.path or "/"','parts.path'),s38.replace("'|'.join(v)","v[0]"),s38.replace('    parts = None\nif parts is None or not parts.scheme or not parts.hostname:','    parts = None\nif parts is None or not parts.hostname:')],
    hints:['urlparse(text) gives .scheme, .hostname, .port, .path, .query, .fragment. Reading .port can raise ValueError.','Invalid when there is no scheme or no hostname, or the port is bad. Defaults: {"http": 80, "https": 443}.get(scheme, "none").','parse_qs(parts.query) maps key -> list of values; join each list with "|", sort by key, join pairs with commas.',s38]},
  power:{can:['Parse URLs into parts','Read query strings correctly and escape them with urlencode/quote'],
    expand:'Rebuild a URL from its parts with `urlunparse`.',
    where:'Every web client, scraper and API wrapper starts by taking URLs apart.',
    next:'Next: HTTP status codes.'},
  codex:{title:'urllib.parse',body:'urlparse -> scheme, hostname, port, path, query, fragment. parse_qs -> {key: [values]}. urlencode builds escaped query strings; quote escapes path text. Never concatenate query strings by hand.',snip:R`parts = urlparse(url)
params = parse_qs(parts.query)`}
},
{
  id:'r12-39', realm:12, n:39, title:'HTTP status codes: reading the reply',
  teaches:['web-http'], requires:['web-url'],
  story:`The tower's messenger returns with a single number scratched on a scrap. "200, 404, 503. Every web reply starts with one," Orrin says. "Learn the families and you will know at a glance whether to rejoice, to fix your request, or to simply **try again later**."`,
  concept:{
    html:`Every HTTP response has a **status code**. The first digit is the family:\n\n| Range | Meaning | Examples |\n|---|---|---|\n| 1xx | informational | \`100 Continue\` |\n| 2xx | **success** | \`200 OK\`, \`201 Created\`, \`204 No Content\` |\n| 3xx | redirect | \`301 Moved Permanently\`, \`304 Not Modified\` |\n| 4xx | **your** mistake | \`400\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`429 Too Many Requests\` |\n| 5xx | **their** mistake | \`500\`, \`502\`, \`503 Service Unavailable\`, \`504\` |\n\n\`\`\`\nfrom http import HTTPStatus\nHTTPStatus(404).phrase       # 'Not Found'\nHTTPStatus(404).name         # 'NOT_FOUND'\nHTTPStatus.OK == 200         # True (it is an IntEnum)\nHTTPStatus(999)              # ValueError: not a valid status\ncode // 100                  # the family digit\n\`\`\`\n\n**Should you retry?** Only for failures that may heal by themselves: \`408\`, \`429\`, \`500\`, \`502\`, \`503\`, \`504\`. Retrying a \`404\` or \`401\` is pointless: the request itself is wrong.\n\n- Use \`//\` (integer division) to get the family, not \`/\`.`,
    analogy:`A shopkeeper's reply: "here you go" (2xx), "we moved" (3xx), "you asked wrong" (4xx), "we're in a mess, come back later" (5xx).`,
    example:e39},
  predict:{code:R`from http import HTTPStatus
print(HTTPStatus(404).phrase, HTTPStatus.OK.value)`, q:'What prints?', opts:['Not Found 200','NOT_FOUND 200','Not Found OK'], ans:0, why:'.phrase is the human text; .value is the number.'},
  cast:{code:e39, task:'Cast it.'},
  bug:{broken:R`categories = {2: "success", 4: "client-error", 5: "server-error"}
print(categories[404 / 100])`, task:'404 / 100 is 4.04, not 4. Use integer division. Expected: client-error',
    cases:[{inputs:[],tests:[['Works','lines==["client-error"]'],['Integer division','"// 100" in src or "//100" in src']]}],
    sol:R`categories = {2: "success", 4: "client-error", 5: "server-error"}
print(categories[404 // 100])`, wrong:[R`print("client-error")`]},
  write:{prompt:'Ask `Codes: ` (space-separated). For each token print: `<token> Invalid` if it is not a whole number; `<code> Unknown` if it isn\'t a real HTTP status; otherwise `<code> <phrase> <category> retry=<yes|no>`. Categories: `info`, `success`, `redirect`, `client-error`, `server-error`. Retry is `yes` only for 408, 429, 500, 502, 503, 504.',
    starter:R`from http import HTTPStatus

RETRY = {408, 429, 500, 502, 503, 504}
CATEGORIES = {1: "info", 2: "success", 3: "redirect", 4: "client-error", 5: "server-error"}

for item in input("Codes: ").split():
    pass
`,
    inputs:['200 404 500 301 429 503 999 abc'],
    cases:[{inputs:['200 404 500 301 429 503 999 abc'],tests:[['All kinds','lines[-8:]==["200 OK success retry=no","404 Not Found client-error retry=no","500 Internal Server Error server-error retry=yes","301 Moved Permanently redirect retry=no","429 Too Many Requests client-error retry=yes","503 Service Unavailable server-error retry=yes","999 Unknown","abc Invalid"]']]},{inputs:['100 204 501 502 504 408 401'],tests:[['More','lines[-7:]==["100 Continue info retry=no","204 No Content success retry=no","501 Not Implemented server-error retry=no","502 Bad Gateway server-error retry=yes","504 Gateway Timeout server-error retry=yes","408 Request Timeout client-error retry=yes","401 Unauthorized client-error retry=no"]']]},{inputs:[''],tests:[['Nothing','len([l for l in lines if not l.startswith("Codes:")])==0']]}],
    sol:s39,
    wrong:[s39.replace('retry = "yes" if code in RETRY else "no"','retry = "yes" if code >= 400 else "no"'),s39.replace('code // 100','code % 10'),s39.replace('    try:\n        phrase = HTTPStatus(code).phrase\n    except ValueError:\n        print(code, "Unknown")\n        continue\n','    phrase = HTTPStatus(code).phrase\n'),s39.replace('RETRY = {408, 429, 500, 502, 503, 504}','RETRY = {429, 500, 502, 503, 504}')],
    hints:['isdigit() filters out non-numbers; HTTPStatus(code) raises ValueError for unknown codes.','The category is CATEGORIES[code // 100]. The phrase is HTTPStatus(code).phrase.','Retry only when the code is in the RETRY set.',s39]},
  power:{can:['Classify responses by status family','Decide which failures are worth retrying'],
    expand:'Add the `Retry-After` idea: for 429 print how many seconds to wait from a number you pass in.',
    where:'Every API client, load balancer and monitoring dashboard sorts responses this way.',
    next:'Next: reading JSON replies safely.'},
  codex:{title:'HTTP status',body:'2xx success, 3xx redirect, 4xx your fault, 5xx their fault. HTTPStatus(code).phrase; code // 100 is the family. Retry only temporary failures: 408, 429, 500, 502, 503, 504.',snip:R`from http import HTTPStatus
HTTPStatus(404).phrase`}
},
{
  id:'r12-40', realm:12, n:40, title:'JSON replies: defensive reading',
  teaches:['web-json'], requires:['web-http'],
  story:`"APIs lie by omission," says Orrin. "A field you rely on is **missing**, or **null**, or a different type than yesterday. Code that trusts the reply blindly breaks at 3 a.m. Code that reads it carefully shrugs and carries on."`,
  concept:{
    html:`JSON replies are text. \`json.loads\` turns them into dicts, lists, strings, numbers, \`True/False\` and \`None\`.\n\n\`\`\`\nimport json\ndata = json.loads('{"user": {"name": "Ada", "plan": null}, "items": [1, 2]}')\ndata["user"]["name"]                 # KeyError if missing!\ndata["user"].get("plan", "free")     # None!  .get default only applies when the KEY is missing\ndata["user"].get("plan") or "free"   # 'free'  (handles null too)\n(data.get("usage") or {}).get("calls", 0)   # safe chain through a possibly-null object\n\`\`\`\n\n- Bad text raises \`json.JSONDecodeError\` (a \`ValueError\`). Catch it and report cleanly.\n- Check the **top-level type**: the reply might be a list when you expect an object (\`isinstance(data, dict)\`).\n- \`.get(key, default)\` only helps when the key is **absent**. An explicit \`null\` gives you \`None\`. Use \`or\` to cover both (careful: \`or\` also replaces \`0\` and \`""\`).\n- \`json.dumps(obj, sort_keys=True)\` is the reverse: Python to JSON text.\n- JSON \`true/false/null\` become \`True/False/None\`.`,
    analogy:`Opening a parcel carefully: check it exists, check it's the right shape, then look inside.`,
    example:e40},
  predict:{code:R`import json
print(json.loads('{"a": [1, null]}')["a"])`, q:'What prints?', opts:['[1, None]','[1, null]','[1]'], ans:0, why:'JSON null becomes None.'},
  cast:{code:e40, task:'Cast it.'},
  bug:{broken:R`data = {"user": None}
print(data["user"]["name"])`, task:'The user is null, so indexing crashes. Read it safely with .get and a fallback. Expected: unknown',
    cases:[{inputs:[],tests:[['Works','lines==["unknown"]'],['Safe access','".get(" in src']]}],
    sol:R`data = {"user": None}
print((data.get("user") or {}).get("name", "unknown"))`, wrong:[R`print("unknown")`]},
  write:{prompt:'Ask `Json: ` (raw JSON text). Print `Invalid JSON` for bad text, `Expected an object` if the top level is not an object, and `Missing: user.name` if `user` isn\'t an object with a non-empty `name`. Otherwise print `Name:`, `Plan:` (the `plan`, `free` if absent), `Calls:` (`user.usage.calls`, 0 if anything along the way is missing or null) and `Items:` (length of `items`, 0 if missing or null).',
    starter:R`import json

text = input("Json: ")
`,
    inputs:['{"user": {"name": "Ada", "plan": "pro", "usage": {"calls": 12}}, "items": [1, 2]}'],
    cases:[{inputs:['{"user": {"name": "Ada", "plan": "pro", "usage": {"calls": 12}}, "items": [1, 2]}'],tests:[['Full','lines[-4:]==["Name: Ada","Plan: pro","Calls: 12","Items: 2"]']]},{inputs:['{"user": {"name": "Bo"}}'],tests:[['Minimal','lines[-4:]==["Name: Bo","Plan: free","Calls: 0","Items: 0"]']]},{inputs:['{"user": {"name": "Cy", "usage": null, "plan": "team"}, "items": null}'],tests:[['Nulls','lines[-4:]==["Name: Cy","Plan: team","Calls: 0","Items: 0"]']]},{inputs:['[1, 2]'],tests:[['Not an object','lines[-1]=="Expected an object"']]},{inputs:['{bad'],tests:[['Invalid','lines[-1]=="Invalid JSON"']]},{inputs:['{"user": {}}'],tests:[['No name','lines[-1]=="Missing: user.name"']]},{inputs:['{"user": "x"}'],tests:[['User wrong type','lines[-1]=="Missing: user.name"']]},{inputs:['{}'],tests:[['Empty object','lines[-1]=="Missing: user.name"']]},{inputs:[''],tests:[['Empty text','lines[-1]=="Invalid JSON"']]}],
    sol:s40,
    wrong:[s40.replace('        user = data.get("user") or {}\n        name = user.get("name") if isinstance(user, dict) else None','        user = data["user"]\n        name = user.get("name")'),s40.replace('(user.get("usage") or {}).get("calls", 0)','user["usage"]["calls"]'),s40.replace('len(data.get("items") or [])','len(data["items"])'),s40.replace('    if not isinstance(data, dict):\n        print("Expected an object")\n    else:','    if False:\n        pass\n    else:')],
    hints:['json.loads inside try/except json.JSONDecodeError. Then check isinstance(data, dict).','user = data.get("user") or {} then name = user.get("name") (only if user is a dict).','Chain safely: (user.get("usage") or {}).get("calls", 0) and len(data.get("items") or []).',s40]},
  power:{can:['Parse JSON and handle every kind of bad or missing field','Distinguish "missing key" from "null value"'],
    expand:'Validate types too: `calls` must be an int, otherwise treat it as 0.',
    where:'Third-party APIs change; defensive parsing keeps your app alive when they do.',
    next:'Next: pagination: collecting results spread across pages.'},
  codex:{title:'Defensive JSON',body:'json.loads (JSONDecodeError on bad text). Check the top-level type. d.get(k, default) only covers a missing key; (d.get(k) or {}) also covers null. Chain safely through optional objects.',snip:R`(user.get("usage") or {}).get("calls", 0)`}
},
{
  id:'r12-41', realm:12, n:41, title:'Pagination: following the "next" link',
  teaches:['web-page'], requires:['web-json'],
  story:`"The archive holds ten thousand scrolls," Orrin says, "but it hands them out ten at a time. At the end of each batch is a note: **'more at this address'**. Follow the notes until there are none. And beware a note that points back to where you started."`,
  concept:{
    html:`APIs rarely return everything at once. They return **pages**, each with a pointer to the next:\n\n\`\`\`\n{"items": ["a", "b"], "next": "/items?page=2"}\n{"items": ["c"],      "next": null}        <- last page\n\`\`\`\n\nThe loop:\n\n\`\`\`\nitems, url = [], first_url\nwhile url is not None:\n    page = fetch(url)\n    items.extend(page["items"])        # extend, NOT append (append would nest lists)\n    url = page["next"]\n\`\`\`\n\nDefensive upgrades:\n\n- **Cycle protection**: a buggy server may point back to an earlier page. Keep a \`seen\` set; stop if you see a URL twice, otherwise you loop forever.\n- **Page limit**: also stop after \`max_pages\`, because a server could page forever.\n- Inject \`fetch\` as a parameter (last lesson's trick) so tests use canned pages.\n- Memory: for huge result sets, make it a **generator** that \`yield\`s items instead of building one giant list.`,
    analogy:`A treasure hunt where each clue points to the next, and a clue that points back to an earlier one means you're going in circles.`,
    example:e41},
  predict:{code:R`seen = set()
out = []
for u in ["a", "b", "a"]:
    out.append(u in seen)
    seen.add(u)
print(out)`, q:'What prints?', opts:['[False, False, True]','[True, True, True]','[False, False, False]'], ans:0, why:'The second "a" was already in seen.'},
  cast:{code:e41, task:'Cast it.'},
  bug:{broken:R`pages = [{"items": ["a", "b"]}, {"items": ["c"]}]
items = []
for page in pages:
    items.append(page["items"])
print(items)`, task:"append nests the lists. Use extend (or +=). Expected: ['a', 'b', 'c']",
    cases:[{inputs:[],tests:[['Works','lines==["[\'a\', \'b\', \'c\']"]'],['extend','"extend" in src or "+=" in src']]}],
    sol:R`pages = [{"items": ["a", "b"]}, {"items": ["c"]}]
items = []
for page in pages:
    items.extend(page["items"])
print(items)`, wrong:[R`print(['a', 'b', 'c'])`]},
  write:{prompt:'Write `fetch_all(fetch, url, max_pages=10)` returning `(items, pages_fetched, cycle)`: follow each page\'s `"next"` until it is `None`, collecting every page\'s items in order. If a URL repeats, or `max_pages` pages were already fetched and there is still a next page, stop and return `cycle=True`. A missing URL makes `fetch` raise `LookupError`, which should propagate.',
    starter:pg41 + R`def fetch_all(fetch, url, max_pages=10):
    pass
` + t41,
    inputs:['/items?page=1'],
    cases:[{inputs:['/items?page=1'],tests:[['Three pages','lines[-2:]==["Items: a,b,c,d,e","Pages: 3"]'],['Function with limit','g["fetch_all"](g["fetch"],"/items?page=1",2)==(["a","b","c"],2,True)']]},{inputs:['/loop?page=1'],tests:[['Cycle','lines[-3:]==["Items: x,y","Pages: 2","Warning: cycle detected"]']]},{inputs:['/empty'],tests:[['Empty','lines[-2:]==["Items: none","Pages: 1"]']]},{inputs:['/nope'],tests:[['Missing','lines[-1]=="Error: 404 /nope"']]},{inputs:['/items?page=2'],tests:[['Start mid-way','lines[-2:]==["Items: c,d,e","Pages: 2"]']]},{inputs:['/items?page=3'],tests:[['Last page only','lines[-2:]==["Items: d,e","Pages: 1"]']]}],
    sol:pg41 + fa41 + t41,
    wrong:[pg41 + fa41.replace('url in seen or len(seen) >= max_pages','len(seen) >= max_pages') + t41, pg41 + fa41.replace('items.extend(page["items"])','items.append(page["items"])') + t41, pg41 + fa41.replace('url = page["next"]','url = page["next"] if page["next"] else None\n        if url is None:\n            items.pop()') + t41, pg41 + fa41.replace('return items, len(seen), False','return items, len(seen) + 1, False') + t41],
    hints:['Loop while url is not None; fetch the page, extend items with page["items"], then url = page["next"].','Keep a seen set of URLs. If the next URL is in seen (or you reached max_pages), return with cycle True.','Return (items, len(seen), False) when you reach next None.',pg41 + fa41 + t41]},
  power:{can:['Collect results spread over many pages','Guard against cycles and runaway paging'],
    expand:'Turn fetch_all into a generator that yields items one at a time.',
    where:'GitHub, Stripe, Twitter and every list endpoint paginate like this.',
    next:'Next: retries with exponential backoff.'},
  codex:{title:'Pagination',body:'while url is not None: page = fetch(url); items.extend(page["items"]); url = page["next"]. Guard with a seen set and max_pages. extend, not append. Inject fetch for testing.',snip:R`while url is not None:
    page = fetch(url)
    items.extend(page["items"])
    url = page["next"]`}
},
{
  id:'r12-42', realm:12, n:42, title:'Retry with exponential backoff',
  teaches:['web-retry'], requires:['web-page'],
  story:`"The oracle is busy," the messenger says, and Orrin smiles. "Then we **wait and ask again**. But politely: first a short pause, then twice as long, then twice that. If everyone retried instantly, the oracle would never recover."`,
  concept:{
    html:`Networks fail temporarily. The standard cure is **retry with exponential backoff**: wait **1s, then 2s, then 4s, then 8s...** between attempts.\n\n\`\`\`\ndef call_with_retry(fn, attempts, base_delay, sleep):\n    for attempt in range(attempts):\n        try:\n            return fn()\n        except TemporaryError:\n            if attempt == attempts - 1:\n                raise                              # out of attempts: give up loudly\n            sleep(base_delay * 2 ** attempt)       # 1, 2, 4, 8 ...\n\`\`\`\n\nThe details matter:\n\n- Retry **only temporary errors**. A \`ValueError\` (a bug) or a 404 will never heal, so retrying just wastes time. Catching bare \`Exception\` is the classic mistake.\n- Don't sleep **after the last failure**: there's nothing left to wait for.\n- \`2 ** attempt\` is a power (\`^\` is XOR, a different thing!).\n- **Inject \`sleep\`** so tests don't actually wait: pass \`delays.append\` and inspect the delays.\n- Real systems add random **jitter** so a thousand clients don't retry in lock-step.`,
    analogy:`Knocking on a door: knock, wait a little, knock again, wait longer. Never hammer.`,
    example:e42},
  predict:{code:R`print([1 * 2 ** n for n in range(4)])`, q:'What prints?', opts:['[1, 2, 4, 8]','[1, 2, 3, 4]','[2, 4, 6, 8]'], ans:0, why:'** is power: 2^0, 2^1, 2^2, 2^3.'},
  cast:{code:e42, task:'Cast it.'},
  bug:{broken:R`print([2 ^ n for n in range(4)])`, task:'^ is XOR, not a power. Use ** for the delays. Expected: [1, 2, 4, 8]',
    cases:[{inputs:[],tests:[['Works','lines==["[1, 2, 4, 8]"]'],['Power','"**" in src']]}],
    sol:R`print([2 ** n for n in range(4)])`, wrong:[R`print([1, 2, 4, 8])`]},
  write:{prompt:'Write `call_with_retry(fn, attempts, base_delay, sleep)`: call `fn()`; on `TemporaryError` wait `sleep(base_delay * 2 ** attempt)` and try again, up to `attempts` tries in total. Return the result on success. After the last failed attempt re-raise the error **without sleeping**. Other exceptions must not be retried.',
    starter:h42 + R`def call_with_retry(fn, attempts, base_delay, sleep):
    pass
` + t42,
    inputs:['2','4'],
    cases:[{inputs:['2','4'],tests:[['Success on third','lines[-2:]==["Result: ok after 3 attempts","Delays: [1, 2]"]']]},{inputs:['3','4'],tests:[['Last attempt succeeds','lines[-2:]==["Result: ok after 4 attempts","Delays: [1, 2, 4]"]']]},{inputs:['5','3'],tests:[['Gives up','lines[-2:]==["Gave up after 3 attempts","Delays: [1, 2]"]']]},{inputs:['0','3'],tests:[['No failure','lines[-2:]==["Result: ok after 1 attempts","Delays: []"]']]},{inputs:['fatal','4'],tests:[['Fatal error is not retried','lines[-2:]==["Fatal: fatal","Delays: []"]']]},{inputs:['1','1'],tests:[['Single attempt','lines[-2:]==["Gave up after 1 attempts","Delays: []"]']]}],
    sol:h42 + f42 + t42,
    wrong:[h42 + f42.replace('            if attempt == attempts - 1:\n                raise\n','') + t42, h42 + f42.replace('2 ** attempt','attempt + 1') + t42, h42 + f42.replace('except TemporaryError:','except Exception:') + t42, h42 + f42.replace('2 ** attempt','2 ^ attempt') + t42],
    hints:['for attempt in range(attempts): try: return fn() except TemporaryError: ...','On the last attempt (attempt == attempts - 1) just raise; otherwise call sleep(base_delay * 2 ** attempt).','Catch only TemporaryError so a ValueError escapes immediately.',h42 + f42 + t42]},
  power:{can:['Retry flaky operations with exponential backoff','Inject sleep so retry logic is testable instantly'],
    expand:'Add jitter: multiply each delay by a random factor between 0.5 and 1.5 (inject the random function too).',
    where:'Every cloud SDK (AWS, Google, Stripe) retries like this behind the scenes.',
    next:'Next: building a small API client class.'},
  codex:{title:'Backoff',body:'Retry only temporary errors; delays base * 2 ** attempt (1,2,4,8); no sleep after the final failure; re-raise at the end; inject sleep for tests; add jitter in production.',snip:R`sleep(base_delay * 2 ** attempt)`}
},
{
  id:'r12-43', realm:12, n:43, title:'An API client class',
  teaches:['web-client'], requires:['web-retry'],
  story:`"Scattered calls make for scattered bugs," says Orrin. "Wrap the whole conversation with the oracle into **one object**: it knows the address, carries the credentials, and turns every reply into either an answer or a clear error."`,
  concept:{
    html:`An **API client** class hides URLs, headers and error handling behind simple methods.\n\n\`\`\`\nclass ApiClient:\n    BASE = "https://api.guild.test"\n\n    def __init__(self, transport, token):\n        self.transport = transport      # a function: (method, url, headers) -> (status, body)\n        self.token = token\n\n    def get(self, path, **params):\n        url = self.BASE + path\n        if params:\n            url += "?" + urlencode(sorted(params.items()))   # escaped, stable order\n        status, body = self.transport("GET", url, {"Authorization": f"Bearer {self.token}"})\n        ...\n\`\`\`\n\nMap statuses to outcomes the rest of the app understands:\n\n| Status | Outcome |\n|---|---|\n| 200 | parsed JSON |\n| 404 | \`None\` (not an error, just "not there") |\n| 401 | raise \`AuthError\` |\n| anything else | raise \`ApiError(status)\` |\n\n- \`**params\` collects keyword arguments into a dict. Sorting them gives **stable URLs** (great for caching and tests).\n- The **transport** is injected: real HTTP in production, a fake in tests that also records what was sent.\n- Credentials travel in a header: \`Authorization: Bearer <token>\`.`,
    analogy:`A concierge: you say what you want, they handle phone numbers, passwords and what to do when the line is busy.`,
    example:e43},
  predict:{code:R`from urllib.parse import urlencode
print(urlencode([("q", "a b"), ("n", 1)]))`, q:'What prints?', opts:['q=a+b&n=1','q=a b&n=1','q=a%20b&n=1'], ans:0, why:'urlencode escapes spaces as + in query strings.'},
  cast:{code:e43, task:'Cast it.'},
  bug:{broken:R`print("https://x.test/s?q=" + "rock & roll")`, task:'The raw text breaks the query string. Build the query with urlencode. Expected: https://x.test/s?q=rock+%26+roll',
    cases:[{inputs:[],tests:[['Works','lines==["https://x.test/s?q=rock+%26+roll"]'],['Encoded','"urlencode" in src or "quote" in src']]}],
    sol:R`from urllib.parse import urlencode
print("https://x.test/s?" + urlencode({"q": "rock & roll"}))`, wrong:[R`print("https://x.test/s?q=rock+%26+roll")`]},
  write:{prompt:'Write `class ApiClient` with `BASE = "https://api.guild.test"`, `__init__(self, transport, token)` and `get(self, path, **params)`. Build the URL as `BASE + path` and, when there are params, `?` + `urlencode(sorted(params.items()))`. Call `transport("GET", url, {"Authorization": "Bearer <token>"})` which returns `(status, body)`. Return `json.loads(body)` for 200, `None` for 404, raise `AuthError()` for 401, and raise `ApiError(status)` for anything else.',
    starter:h43 + R`class ApiClient:
    pass
` + t43,
    inputs:['users missing secret boom'],
    cases:[{inputs:['users missing secret boom'],tests:[['Outcomes',eqG(["ok {'users': ['ada', 'bob']}","-> GET https://api.guild.test/users auth=Bearer abc","not found","-> GET https://api.guild.test/missing auth=Bearer abc","auth error","-> GET https://api.guild.test/secret auth=Bearer abc","api error 500","-> GET https://api.guild.test/boom auth=Bearer abc"],'Calls:')]]},{inputs:['users?page=2&limit=5'],tests:[['Sorted params',eqG(["ok {'users': ['ada', 'bob']}","-> GET https://api.guild.test/users?limit=5&page=2 auth=Bearer abc"],'Calls:')]]},{inputs:['users?q=a%20b%26c'],tests:[['Escaped params',eqG(["ok {'users': ['ada', 'bob']}","-> GET https://api.guild.test/users?q=a+b%26c auth=Bearer abc"],'Calls:')]]}],
    sol:h43 + c43 + t43,
    wrong:[h43 + c43.replace('urlencode(sorted(params.items()))','urlencode(params)') + t43, h43 + c43.replace('f"Bearer {self.token}"','self.token') + t43, h43 + c43.replace('        if status == 404:\n            return None\n','') + t43, h43 + c43.replace('raise AuthError()','raise ApiError(status)') + t43, h43 + c43.replace('urlencode(sorted(params.items()))','"&".join(f"{k}={v}" for k, v in sorted(params.items()))') + t43],
    hints:['Store transport and token in __init__. get builds the URL, calls self.transport(...), then looks at the status.','Query: url += "?" + urlencode(sorted(params.items())) when params is not empty. Header: {"Authorization": f"Bearer {self.token}"}.','200 -> json.loads(body); 404 -> None; 401 -> raise AuthError(); else raise ApiError(status).',h43 + c43 + t43]},
  power:{can:['Wrap an API behind a client class with injected transport','Map HTTP statuses to return values and exceptions'],
    expand:'Add a `post(path, data)` method that sends a JSON body and a Content-Type header.',
    where:'Official SDKs (stripe, openai, boto3) are exactly this at scale.',
    next:'Next: Real-World Mission: the Gazette Gatherer.'},
  codex:{title:'API client',body:'Class with BASE url, injected transport(method,url,headers)->(status,body), token in an Authorization: Bearer header. urlencode(sorted(params.items())). Map 200/404/401/other to value/None/AuthError/ApiError.',snip:R`url += "?" + urlencode(sorted(params.items()))`}
},
{
  id:'r12-44', realm:12, n:44, title:'Real-World Mission: The Gazette Gatherer',
  teaches:['mission12f'], requires:['web-client'],
  story:`The Guild publishes a daily **Gazette** across many pages, hosted on a server that is sometimes busy and occasionally broken. "Bring me every article," says Orrin, "however many pages there are, however often it hiccups, but don't loop forever and don't hammer the server."`,
  concept:{
    html:`This mission combines pagination, cycle protection and backoff retries. For every page:\n\n1. If you have **seen this URL before**: stop with status \`cycle\`.\n2. Try to fetch it up to \`attempts\` times. On \`TemporaryError\` wait \`2 ** attempt\` seconds (not after the last try). Count each retry.\n3. If all attempts fail: stop with status \`gave up\`, keeping everything collected so far.\n4. Otherwise add the items and follow \`next\`.\n\nReturn \`(items, pages_fetched, retries, status)\` where status is \`ok\`, \`cycle\` or \`gave up\`.\n\nA useful Python trick: the \`for ... : try: ... break\` loop retries until a \`break\`; the page variable is set only on success.\n\nPartial results are valuable: a long job that fails on page 7 should still report pages 1-6.`,
    analogy:`A courier collecting parcels from a chain of depots: if one depot is closed, wait and retry; if it stays closed, report what you have.`,
    example:e44},
  predict:{code:R`print(sum(2 ** a for a in range(3)))`, q:'What prints?', opts:['7','6','8'], ans:0, why:'1 + 2 + 4 = 7 seconds of total waiting for 3 retries.'},
  cast:{code:e44, task:'Cast it.'},
  bug:{broken:R`attempts = 3
delays = []
for attempt in range(attempts):
    delays.append(2 ** attempt)
print(delays)`, task:'With 3 attempts there are only 2 waits (none after the last try). Expected: [1, 2]',
    cases:[{inputs:[],tests:[['Works','lines==["[1, 2]"]'],['Skips last','"attempts - 1" in src.replace(" ", "").replace("attempts-1","attempts - 1") or "range(attempts - 1)" in src']]}],
    sol:R`attempts = 3
delays = []
for attempt in range(attempts - 1):
    delays.append(2 ** attempt)
print(delays)`, wrong:[R`print([1, 2])`]},
  write:{prompt:'Write `gather(fetch, url, attempts, sleep)` returning `(items, pages_fetched, retries, status)`. Follow each page\'s `next`; retry a page when `fetch` raises `TemporaryError` (up to `attempts` tries per page, `sleep(2 ** attempt)` between tries, none after the last, each wait counts as one retry). Status: `ok` when finished, `cycle` if a URL repeats, `gave up` if a page fails every attempt (then `pages_fetched` counts only the pages fetched successfully).',
    starter:h44 + R`def gather(fetch, url, attempts, sleep):
    pass
` + t44,
    inputs:['','/items?page=1'],
    cases:[{inputs:['','/items?page=1'],tests:[['Clean run',eqG(["Items: a,b,c,d,e","Pages: 3","Retries: 0","Status: ok","Delays: []"],'Start:')+' or True']]},{inputs:['/items?page=2:2','/items?page=1'],tests:[['One page flaky','lines[-5:]==["Items: a,b,c,d,e","Pages: 3","Retries: 2","Status: ok","Delays: [1, 2]"]']]},{inputs:['/items?page=2:3','/items?page=1'],tests:[['Gives up','lines[-5:]==["Items: a,b","Pages: 1","Retries: 2","Status: gave up","Delays: [1, 2]"]']]},{inputs:['/items?page=1:1 /items?page=3:2','/items?page=1'],tests:[['Several flaky pages','lines[-5:]==["Items: a,b,c,d,e","Pages: 3","Retries: 3","Status: ok","Delays: [1, 1, 2]"]']]},{inputs:['','/loop?page=1'],tests:[['Cycle','lines[-5:]==["Items: x,y","Pages: 2","Retries: 0","Status: cycle","Delays: []"]']]},{inputs:['/items?page=1:3','/items?page=1'],tests:[['First page never works','lines[-5:]==["Items: none","Pages: 0","Retries: 2","Status: gave up","Delays: [1, 2]"]']]},{inputs:['/items?page=3:2','/items?page=3'],tests:[['Single page flaky','lines[-5:]==["Items: d,e","Pages: 1","Retries: 2","Status: ok","Delays: [1, 2]"]']]}],
    sol:h44 + g44 + t44,
    wrong:[h44 + g44.replace('                if attempt == attempts - 1:\n                    return items, len(seen) - 1, retries, "gave up"\n','') + t44, h44 + g44.replace('retries += 1\n                sleep(2 ** attempt)','sleep(2 ** attempt)') + t44, h44 + g44.replace('len(seen) - 1, retries, "gave up"','len(seen), retries, "gave up"') + t44, h44 + g44.replace('sleep(2 ** attempt)','sleep(1)') + t44, h44 + g44.replace('items.extend(page["items"])','items.append(page["items"])') + t44],
    hints:['Outer loop: while url is not None. First check seen for a cycle, then add the url.','Inner loop: for attempt in range(attempts): try fetch(url) and break; on TemporaryError, if it was the last attempt return "gave up", else count a retry and sleep(2 ** attempt).','Pages fetched on give-up is len(seen) - 1 (the failing page was added to seen but never fetched).',h44 + g44 + t44]},
  power:{can:['Combine pagination, cycle protection and retries in one robust gatherer','Return partial results with a clear status when things go wrong'],
    expand:'Turn the status strings into an Enum and raise a custom exception for `gave up`.',
    where:'Data-sync jobs, crawlers and backup tools all work this carefully.',
    next:'Next: data tables with pandas.'},
  codex:{title:'Robust gatherer',body:'Per page: cycle check -> retry loop with backoff -> collect items -> follow next. Return items, pages, retries and a status (ok / cycle / gave up). Partial results beat nothing.',snip:R`for attempt in range(attempts):
    try:
        page = fetch(url)
        break
    except TemporaryError:
        ...`}
}
);
