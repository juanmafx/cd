# Security Audit

**Date:** 2026-11-23. **Scope:** the original 2020 code on `main`, the full Git history as it stood before the 2026-11-24 history rewrite, and the 2.0.0 modernization. This is a self-review using the checks listed below, not an independent third-party audit.

## Checks performed

| Check | Method | Result |
| --- | --- | --- |
| Dependency vulnerabilities, original lockfile | `npm audit --package-lock-only` | 8 advisories affecting packages: 1 critical, 4 high, 3 low |
| Dependency vulnerabilities, this branch | `npm audit` | 0 reported |
| Secrets and private keys | `gitleaks` 8.30.1 with `--redact` over all commits and the working tree | No leaks found |
| Injection, XSS, unsafe evaluation | Manual source review | No database, shell, or evaluation use; request input is not reflected |
| CSRF | Manual source review | Not applicable: no state, sessions, or cookies |
| Authentication and 2FA | Manual source review | Not implemented: the service has no accounts, sessions, or protected data |
| Cryptography | Manual source review | Not applicable: the application performs no cryptography and handles no secrets |
| HTTP edge cases | Raw-socket probes of request targets, conditional headers, and parser errors | Findings CD-09 to CD-11 |
| Shutdown behavior | Process probes with stalled connections and overlapping signals | Findings CD-12 and CD-13 |
| Tracked dependencies or build output | `git ls-files` | None |

## Findings and remediation

| ID | Severity | Finding | Status |
| --- | --- | --- | --- |
| CD-01 | Critical | Vulnerable locked dependency tree under Express 4.17.1 | Fixed: upgraded to Express 5.3.0 |
| CD-02 | Medium | Listener bound to all network interfaces by default | Fixed: defaults to loopback |
| CD-03 | Low | Unvalidated runtime configuration; port was hardcoded | Fixed: validated `HOST` and `PORT` |
| CD-04 | Low | Default error responses could expose stack traces outside production mode | Fixed: generic error handler |
| CD-05 | Low | Framework disclosed through `X-Powered-By` | Fixed |
| CD-06 | Low | No security headers; plain text was served as HTML | Fixed: restrictive headers and `text/plain` |
| CD-07 | Low | Every path accepted with no explicit method policy or timeouts | Fixed: `405` guard and explicit timeouts |
| CD-08 | Informational | No CI or dependency verification | Fixed: least-privilege CI pinned to commit SHAs |
| CD-09 | Low | `GET *` fell through to the framework HTML 404, which echoed the request target | Fixed: generic plain-text 404 |
| CD-10 | Low | `If-None-Match: *` turned the documented `200` into a `304` | Fixed: conditional handling bypassed |
| CD-11 | Informational | An `ETag` was generated for time-specific, `no-store` responses | Fixed: disabled |
| CD-12 | Medium | One idle or partial connection could block graceful shutdown indefinitely | Fixed: 5-second grace period, then remaining connections are closed |
| CD-13 | Low | `SIGTERM` followed by `SIGINT` closed the server twice and could exit with an unhandled rejection | Fixed: single shared shutdown |
| CD-14 | Low | `HOST` was documented as validated but was not | Fixed: validated as an IP address or hostname |
| CD-15 | Low | CI ran Node.js releases older than the latest security releases | Fixed: CI uses 22.23.5 and 24.22.3 |

## Accepted residual risk

- The service has no authentication, TLS, or rate limiting. It is intended for loopback or use behind a reverse proxy.
- The response discloses server local time by design.
- `engines` still permits Node.js 22.12 or newer, including releases without the latest security fixes. Operators must run a patched release.
- There is no connection limit, so a client can hold sockets open until the server timeouts apply.

## History

On 2026-11-24 the public Git history was rewritten so that it holds only the 2026 modernization. The 2020 code and its commits are no longer in any branch or tag. The `gitleaks` scan above found no secrets in the earlier history, but anything that was ever published must still be treated as public.
