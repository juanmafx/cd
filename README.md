# cd

A minimal, hardened Express service that answers any `GET` path with the server time at which the request was handled.

> **Project history:** originally created in 2020, modernized in 2026.

## Purpose

`cd` does one thing: it returns a plain-text timestamp from whichever server handled the request. That makes it a small, predictable HTTP target for checking that a host, port, or proxy route reaches a running process.

## Why this project exists

It began in 2020 as a single-file Express service, and its original intent was not documented. The 2026 version keeps the same observable response body and rebuilds everything around it to a current standard: a supported runtime, patched dependencies, secure defaults, a modular layout, and automated tests.

## What it does

| Request | Response |
| --- | --- |
| `GET` any path | `200`, `text/plain`, body `\nRequest made at : H:M:S:ms` |
| `HEAD` any path | `200`, no body |
| Any other method | `405` with `Allow: GET, HEAD` |
| Malformed percent-encoding in the path | `400` with a generic body |
| Asterisk-form target such as `GET *` | `404` with a generic body |

- Time uses the server's local time zone. Fields are not zero-padded, matching the original format, so `03:04:05.006` is shown as `3:4:5:6`.
- Each served `GET` or `HEAD` writes `Response made at: H:M:S:ms` to standard output.
- Conditional request headers are ignored and no `ETag` is sent, because every response is time-specific.
- The service does not read request bodies, store data, or echo request input.

## Architecture

```text
src/
  main.js              Process entry point and signal handling
  server.js            HTTP listener, timeouts, and shutdown
  app.js               Express composition root
  config/              Environment parsing and validation
  domain/              Pure time formatting
  http/
    middleware/        Security headers, method guard, not-found, error handler
    routes/            Timestamp route
tests/
  unit/                Pure logic and error mapping
  integration/         Real HTTP and process lifecycle
  support/             Shared raw HTTP client
db/schema.sql          Optional PostgreSQL schema
reports/tests/         Committed report from a real test run
```

This is a backend-only service with no client code, so it has no `frontend/` directory. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Quick start

Requires Node.js 22.12 or newer. Use a current patched release of an active LTS line; CI runs 22.23.5 and 24.22.3.

```bash
npm ci --ignore-scripts
npm start
```

In another terminal:

```bash
curl http://127.0.0.1:3000/
```

## Usage guide

```bash
curl -i http://127.0.0.1:3000/any/path
curl -I http://127.0.0.1:3000/
PORT=8080 npm start
HOST=0.0.0.0 PORT=8080 npm start
```

Stop the service with `Ctrl+C` or `SIGTERM`. It stops accepting connections, gives open connections up to 5 seconds to finish, closes any that remain, and exits with code `0`. A repeated identical signal terminates the process immediately.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `HOST` | `127.0.0.1` | IP address or hostname to bind. Invalid values stop startup. The original bound to all interfaces; set `0.0.0.0` for IPv4 or `::` for dual-stack where supported. |
| `PORT` | `3000` | Integer from `0` to `65535`. `0` selects a free port. Invalid values stop startup. |

## Database

**The database is optional and the application does not use it.** The service has no natural persistence. [db/schema.sql](db/schema.sql) is a small PostgreSQL schema for anyone who wants to record served requests. It deliberately has no columns for client identifiers.

```bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/schema.sql
```

## Testing

```bash
npm test
npm run test:coverage
npm run test:report
```

Tests use the built-in Node.js test runner and bind to ephemeral loopback ports. `test:report` rewrites [reports/tests/summary.txt](reports/tests/summary.txt) and [reports/tests/junit.xml](reports/tests/junit.xml).

## Security

- Binds to loopback by default.
- Sends restrictive security headers and hides the framework header.
- Returns generic application error bodies with no stack traces or request input.
- Applies request, header, and keep-alive timeouts, and a bounded shutdown.
- Has no authentication, TLS, or rate limiting. Place it behind a reverse proxy that provides them before exposing it publicly.

See [SECURITY.md](SECURITY.md) and [docs/SECURITY_AUDIT.md](docs/SECURITY_AUDIT.md).

## Versioning

The current version is `2.0.0`. See [CHANGELOG.md](CHANGELOG.md) and [RELEASE_NOTES.md](RELEASE_NOTES.md).

## License

ISC, as declared in `package.json`. Author: Juan Manuel Ramallo.
