import json
import os
import sys
import time
import urllib.error
import urllib.request

TIMEOUT = 5
RESET = ("POST", "/_test/reset")


def call(base, method, path, body=None, headers=None, raw=None):
    data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
    req = urllib.request.Request(base + path, data=data, method=method, headers=headers or {})
    if data is not None:
        req.add_header("Content-Type", "application/json")
    if os.environ.get("RESET_TOKEN"):
        req.add_header("X-Reset-Token", os.environ["RESET_TOKEN"])
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
            status, payload = resp.status, resp.read()
    except urllib.error.HTTPError as err:
        status, payload = err.code, err.read()
    return status, json.loads(payload) if payload else None


def expect(cond, message):
    if not cond:
        raise AssertionError(message)


def expect_error(status, body, want_status, want_code):
    expect(status == want_status, f"status {status}, want {want_status}")
    err = (body or {}).get("error") or {}
    expect(err.get("code") == want_code, f"error code {err.get('code')!r}, want {want_code!r}")
    expect(isinstance(err.get("message"), str) and err["message"], "error.message missing")


def slot(base, slot_id, tz="UTC"):
    status, body = call(base, "GET", f"/api/slots?tz={tz}")
    expect(status == 200 and isinstance(body, list), f"slots got {status} {body}")
    found = [s for s in body if s.get("id") == slot_id]
    expect(len(found) == 1, f"slot {slot_id} listed {len(found)} times")
    return found[0]


def check_health(base):
    status, body = call(base, "GET", "/health")
    expect(status == 200 and body == {"status": "ok"}, f"got {status} {body}")


def check_slots_in_visitor_time_zone(base):
    s3 = slot(base, "s3", "America/Argentina/Buenos_Aires")
    expect((s3.get("localDate"), s3.get("localTime")) == ("2026-11-02", "22:30"),
           f"s3 shown as {s3.get('localDate')} {s3.get('localTime')}")
    s3utc = slot(base, "s3")
    expect((s3utc.get("localDate"), s3utc.get("localTime")) == ("2026-11-03", "01:30"),
           f"s3 in UTC shown as {s3utc.get('localDate')} {s3utc.get('localTime')}")
    status, body = call(base, "GET", "/api/slots?tz=Mars/Olympus")
    expect_error(status, body, 400, "validation_error")


def check_booking_confirms(base):
    status, body = call(base, "POST", "/api/bookings", {"slotId": "s1", "name": "Ana"})
    expect(status == 201, f"status {status}, want 201: {body}")
    expect(body.get("status") == "pending" and body.get("slotId") == "s1", f"got {body}")
    expect(slot(base, "s1").get("available") is False, "s1 still available after booking")
    deadline = time.monotonic() + 2
    while True:
        status, got = call(base, "GET", f"/api/bookings/{body['id']}")
        expect(status == 200, f"read booking status {status}")
        if got.get("status") == "confirmed":
            return
        expect(time.monotonic() < deadline, f"still {got.get('status')!r} after 2 s")
        time.sleep(0.1)


def check_slot_taken(base):
    status, _ = call(base, "POST", "/api/bookings", {"slotId": "s2", "name": "Ana"})
    expect(status == 201, f"first booking status {status}")
    status, body = call(base, "POST", "/api/bookings", {"slotId": "s2", "name": "Bruno"})
    expect_error(status, body, 409, "slot_taken")


def check_unknown_ids(base):
    status, body = call(base, "POST", "/api/bookings", {"slotId": "s99", "name": "Ana"})
    expect_error(status, body, 404, "slot_not_found")
    status, body = call(base, "GET", "/api/bookings/nope")
    expect_error(status, body, 404, "booking_not_found")


def check_validation(base):
    status, body = call(base, "POST", "/api/bookings", {"slotId": "s1", "name": "  "})
    expect_error(status, body, 400, "validation_error")
    status, body = call(base, "POST", "/api/bookings", {"name": "Ana"})
    expect_error(status, body, 400, "validation_error")
    expect(slot(base, "s1").get("available") is True, "s1 taken by a rejected booking")


CHECKS = [check_health, check_slots_in_visitor_time_zone, check_booking_confirms,
          check_slot_taken, check_unknown_ids, check_validation]


def main():
    if len(sys.argv) != 2:
        print("usage: python3 checks.py <base-url>", file=sys.stderr)
        return 2
    base = sys.argv[1].rstrip("/")
    started = time.monotonic()
    results = []
    for check in CHECKS:
        try:
            if RESET:
                call(base, *RESET)
            check(base)
            results.append((check.__name__, None))
        except Exception as exc:
            results.append((check.__name__, f"{type(exc).__name__}: {exc}"))
    failed = [r for r in results if r[1]]
    print(f"checks: {len(results) - len(failed)} passed, {len(failed)} failed, "
          f"{time.monotonic() - started:.1f}s, {base}")
    for name, error in results:
        print(f"{'FAIL' if error else 'ok  '} {name}" + (f" — {error}" if error else ""))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
