# Release Notes: cd 2.0.1

Released on 2026-11-24.

This is a documentation-only patch release. It corrects the release notes, changelog and security audit so that they describe the published 2.0.0 release and the rewritten repository history accurately. There is no change in code behaviour.

## Upgrade notes

No migration is needed from 2.0.0. When upgrading from 1.0.0:

- Start with `npm start` or `node src/main.js` instead of `node app.js`.
- To accept remote connections as before, set `HOST=0.0.0.0`, preferably behind a reverse proxy.
- Clients that relied on `text/html`, on `404` for `POST`, `PUT`, `PATCH`, or `DELETE`, on `200` for `OPTIONS`, or on `ETag` revalidation must be updated.

## Verification

Test results are in `reports/tests/`. GitHub Actions passed on Node.js 22 and 24 for the commit released as 2.0.0.
