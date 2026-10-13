#!/bin/sh
set -eu

case "${1:-}" in
  app-change) msg="Redesign: rename Book to Confirm booking" ;;
  environment) msg="Run CI in the team's time zone" ;;
  test-data) msg="Seed a sample booking so the demo calendar is never empty" ;;
  regression) msg="Simplify booking confirmation" ;;
  quarantine) msg="Write an audit entry before saving each booking" ;;
  *)
    echo "usage: demo/scenarios/apply.sh <app-change|environment|test-data|regression|quarantine>" >&2
    exit 2
    ;;
esac

root=$(git rev-parse --show-toplevel)
patch="$root/demo/scenarios/$1.patch"

if [ -n "$(git -C "$root" status --porcelain)" ]; then
  echo "apply.sh: the working tree has changes; commit or stash them first." >&2
  exit 1
fi

if ! git -C "$root" apply --check "$patch"; then
  echo "apply.sh: $1.patch no longer applies to this branch; regenerate it." >&2
  exit 1
fi

git -C "$root" apply "$patch"
git -C "$root" commit -qam "$msg"
echo "Committed scenario '$1': $msg"
echo "Next: git push origin main"
echo "To undo after the run: git revert --no-edit HEAD && git push origin main"
