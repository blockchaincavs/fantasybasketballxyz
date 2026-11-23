#!/usr/bin/env bash
# Stop hook: runs the quiet test suite when Claude finishes a turn.
# Passing -> silent. Failing -> prints only the last 30 lines and exits 2,
# which tells Claude the turn isn't done until tests pass.
set -u
input=$(cat)
# Avoid an endless loop if Claude is already continuing because of this hook.
if echo "$input" | grep -q '"stop_hook_active": *true'; then exit 0; fi
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -d node_modules ] || exit 0
mkdir -p logs
if ! npm run -s tests > logs/tests.log 2>&1; then
  echo "Tests failing (full log: logs/tests.log):" >&2
  tail -n 30 logs/tests.log >&2
  exit 2
fi
exit 0
