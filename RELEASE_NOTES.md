# Release Notes: cd 2.0.0

**Status:** prepared, not yet tagged or published.

Version 2.0.0 modernizes the 2020 service. The response body is unchanged; the runtime, dependencies, defaults, structure, and verification are new.

## Highlights

- Express 5.3.0 on Node.js 22.12 or newer, with no advisories reported by `npm audit` at preparation time.
- Secure defaults: loopback binding, restrictive headers, generic errors, and timeouts.
- Modular source layout with automated tests and a committed report from a real run.

## Upgrade notes

- Start with `npm start` or `node src/main.js` instead of `node app.js`.
- To accept remote connections as before, set `HOST=0.0.0.0`, preferably behind a reverse proxy.
- Clients that relied on `text/html` or on `404` for non-GET methods must be updated.

## Verification

Test results are in `reports/tests/`. The CI workflow has not yet run on GitHub.
