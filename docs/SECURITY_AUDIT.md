# Security Audit

**Date:** 2026-11-23. **Scope:** the tracked files on `main` at commit `4135e56`, the full Git history, and this branch. This is a self-review using the checks listed below, not an independent third-party audit.

## Checks performed

| Check | Method | Result |
| --- | --- | --- |
| Dependency vulnerabilities, original lockfile | `npm audit --package-lock-only` | 8 advisories affecting packages: 1 critical, 4 high, 3 low |
| Dependency vulnerabilities, this branch | `npm audit` | 0 reported |
| Secrets and private keys | Keyword search over all commits on all branches | No matches |
| Injection, XSS, unsafe evaluation | Manual source review | No database, shell, or evaluation use; request input is not reflected |
| CSRF | Manual source review | Not applicable: no state, sessions, or cookies |
| Weak hashing | Manual source review | Not applicable: no hashing |
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

## Accepted residual risk

- The service has no authentication, TLS, or rate limiting. It is intended for loopback or use behind a reverse proxy.
- The response discloses server local time by design.
- The GitHub Actions workflow has not yet run on GitHub.
