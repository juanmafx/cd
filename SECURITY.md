# Security Policy

## Supported versions

| Version | Supported |
| --- | --- |
| 2.x | Yes |
| 1.x | No |

## Reporting a vulnerability

Use GitHub private vulnerability reporting for this repository if it is enabled. If it is not, open an issue asking for a private contact channel and leave out all vulnerability details.

Please include the affected version, the impact, and the steps needed to reproduce the issue.

## Deployment guidance

The service has no authentication, TLS, or rate limiting. Keep the default loopback binding, or place it behind a reverse proxy that provides those controls.
