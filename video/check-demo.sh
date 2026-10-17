#!/bin/sh
set -u
cd "$(git rev-parse --show-toplevel)"
fail=0
ok() { echo "ok    $1"; }
bad() { echo "FAIL  $1"; fail=1; }

git fetch -q origin main
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] && ok "local main matches origin/main" || bad "local main differs from origin/main"
[ -z "$(git status --porcelain --untracked-files=no)" ] && ok "no tracked changes" || bad "tracked files have changes"
git apply --check demo/scenarios/order.patch 2>/dev/null && ok "order.patch applies" || bad "order.patch does not apply"

status=$(glab api "projects/87376478/pipelines?ref=main&source=push&per_page=1" | python3 -c "import json,sys;print(json.load(sys.stdin)[0]['status'])")
[ "$status" = success ] && ok "last main pipeline: success" || bad "last main pipeline: $status"

open=$(glab api "projects/87376478/merge_requests?state=opened&per_page=100" | python3 -c "import json,sys;print(' '.join('!'+str(m['iid']) for m in json.load(sys.stdin) if m['source_branch'].startswith(('fix/','update/'))))")
[ -z "$open" ] && ok "no open fix/ or update/ merge request" || bad "open flow merge requests: $open"

curl -fsS https://showcase-8b103c.gitlab.io/ | grep -q "<title>Plumb" && ok "landing serves Plumb" || bad "landing does not serve Plumb"
curl -fsS https://booking-vic4jyzsha-uc.a.run.app/ | grep -q "Book an appointment" && ok "live app serves the booking page" || bad "live app does not serve the booking page"

exit $fail
