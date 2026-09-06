const assert = require("node:assert/strict");
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");

const script = path.join(__dirname, "watch.sh");

function fixture(t, mode) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hunk-watch-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const bin = path.join(root, "bin");
  const temp = path.join(root, "temp");
  fs.mkdirSync(bin);
  fs.mkdirSync(temp);
  const sentinel = path.join(temp, ".other-00000000.so");
  fs.writeFileSync(sentinel, "unrelated");
  fs.writeFileSync(
    path.join(bin, "hunk"),
    `#!/usr/bin/env bash
set -eu
[[ "$*" == 'session comment list test-session --type user --json' ]]
n=0
[[ ! -f "$COUNTER" ]] || read -r n < "$COUNTER"
n=$((n + 1))
printf '%s\\n' "$n" > "$COUNTER"
printf artifact > "$TMPDIR/.watch-00000000.so"
if [[ "$MODE" == malformed ]]; then
  printf 'not JSON'
  exit 0
fi
if [[ "$MODE" == empty ]]; then
  printf '{"comments":[]}'
  exit 0
fi
if [[ "$n" -ge 5 ]]; then
  printf 'broker unavailable\\n' >&2
  exit 1
fi
printf '{"comments":[{"noteId":"old","filePath":"a","newRange":[1],"body":"baseline"}'
if [[ "$n" -ge 2 ]]; then
  printf '%s' ',{"noteId":"first","filePath":"b\\u001b[31m","newRange":[2],"body":"new note"}'
fi
if [[ "$n" -ge 4 ]]; then
  printf ',{"noteId":"second","filePath":"c","oldRange":[3],"body":"deleted line"}'
fi
printf ']}'
`,
    { mode: 0o700 },
  );
  fs.writeFileSync(path.join(bin, "sleep"), "#!/usr/bin/env bash\nexit 0\n", {
    mode: 0o700,
  });
  const env = {
    ...process.env,
    PATH: `${bin}:${process.env.PATH}`,
    TMPDIR: temp,
    COUNTER: path.join(root, "counter"),
    MODE: mode,
  };
  return {
    env,
    checkCleanup() {
      assert.equal(fs.readFileSync(sentinel, "utf8"), "unrelated");
      assert.deepEqual(fs.readdirSync(temp), [path.basename(sentinel)]);
    },
  };
}

test("reports only new IDs, stops after three failures, and preserves unrelated files", (t) => {
  const f = fixture(t, "stream");
  const result = spawnSync("bash", [script, "test-session"], {
    env: f.env,
    encoding: "utf8",
    timeout: 10000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.equal((result.stdout.match(/NEW-COMMENT/g) || []).length, 2);
  const notes = result.stdout
    .split("\n")
    .filter((line) => line.startsWith("NEW-COMMENT "))
    .map((line) => JSON.parse(line.slice("NEW-COMMENT ".length)));
  assert.deepEqual(notes, [
    { noteId: "first", filePath: "b\u001b[31m", line: 2 },
    { noteId: "second", filePath: "c", line: 3 },
  ]);
  assert.ok(
    [...result.stdout].every((character) => {
      const code = character.codePointAt(0);
      return code === 10 || (code >= 32 && (code < 127 || code > 159));
    }),
  );
  assert.doesNotMatch(result.stdout, /baseline|new note|deleted line/);
  assert.match(result.stderr, /HUNK-SESSION-LOST/);
  assert.equal(fs.readFileSync(f.env.COUNTER, "utf8").trim(), "7");
  f.checkCleanup();
});

test("rejects malformed initial output instead of treating it as an empty baseline", (t) => {
  const f = fixture(t, "malformed");
  const result = spawnSync("bash", [script, "test-session"], {
    env: f.env,
    encoding: "utf8",
    timeout: 10000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.doesNotMatch(result.stdout, /HUNK-WATCH-START/);
  assert.match(result.stderr, /HUNK-WATCH-ERROR/);
  f.checkCleanup();
});

test("accepts an empty baseline and cleans up on termination", async (t) => {
  const f = fixture(t, "empty");
  const child = spawn("bash", [script, "test-session"], { env: f.env });
  t.after(() => child.kill("SIGKILL"));
  const timer = setTimeout(() => child.kill("SIGKILL"), 10000);
  let output = "";
  child.stdout.on("data", (data) => {
    output += data;
    if (output.includes("HUNK-WATCH-START")) child.kill("SIGTERM");
  });
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("close", resolve);
  }).finally(() => clearTimeout(timer));
  assert.equal(code, 143);
  assert.match(output, /HUNK-WATCH-START/);
  assert.doesNotMatch(output, /NEW-COMMENT/);
  f.checkCleanup();
});
