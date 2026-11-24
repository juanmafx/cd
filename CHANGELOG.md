# Changelog

This project follows [Semantic Versioning](https://semver.org/).

## [2.0.1] - 2026-11-24

### Changed

- Corrected the release notes, changelog and security audit to reflect the published 2.0.0 release and the rewritten repository history. Documentation only, no change in code behaviour.

## [2.0.0] - 2026-11-24

### Changed

- **Breaking:** requires Node.js 22.12 or newer.
- **Breaking:** binds to `127.0.0.1` by default instead of all interfaces.
- **Breaking:** responses use `text/plain` instead of `text/html`.
- **Breaking:** `POST`, `PUT`, `PATCH`, and `DELETE` return `405` instead of `404`, and `OPTIONS` returns `405` instead of `200`.
- **Breaking:** responses no longer carry an `ETag`, and conditional requests no longer produce `304`.
- **Breaking:** the entry point moved from `app.js` to `src/main.js`, and the package is now ESM.
- The startup log line now includes the host.
- Upgraded Express from 4.17.1 to 5.3.0.
- Restructured the code into nested modules.

### Added

- `HOST` and `PORT` configuration with validation.
- Security headers, generic not-found and error handlers, server timeouts, and graceful shutdown bounded to 5 seconds.
- Automated unit and integration tests with a committed report.
- GitHub Actions CI with least-privilege permissions and pinned actions.
- Optional PostgreSQL schema and full project documentation.

### Security

- Resolved all advisories reported by `npm audit` against the original lockfile.

## [1.0.0] - 2020-11-28

- Initial single-file Express service.
- This version predates the rewritten repository history. Its commits are no longer published.
