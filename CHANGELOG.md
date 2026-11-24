# Changelog

This project follows [Semantic Versioning](https://semver.org/).

## [2.0.0] - Unreleased (prepared 2026-11-23)

### Changed

- **Breaking:** requires Node.js 22.12 or newer.
- **Breaking:** binds to `127.0.0.1` by default instead of all interfaces.
- **Breaking:** responses use `text/plain` instead of `text/html`.
- **Breaking:** methods other than `GET` and `HEAD` return `405` instead of `404`.
- **Breaking:** the entry point moved from `app.js` to `src/main.js`, and the package is now ESM.
- The startup log line now includes the host.
- Upgraded Express from 4.17.1 to 5.3.0.
- Restructured the code into nested modules.

### Added

- `HOST` and `PORT` configuration with validation.
- Security headers, a generic error handler, server timeouts, and graceful shutdown.
- Automated unit and integration tests with a committed report.
- GitHub Actions CI with least-privilege permissions and pinned actions.
- Optional PostgreSQL schema and full project documentation.

### Security

- Resolved all advisories reported by `npm audit` against the original lockfile.

## [1.0.0] - 2020-11-28

- Initial single-file Express service.
