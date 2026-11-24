import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = join(rootDir, 'reports', 'tests');
const junitPath = join(reportDir, 'junit.xml');
const summaryPath = join(reportDir, 'summary.txt');

const sanitize = (text) =>
  text
    .replaceAll(rootDir, '.')
    .replace(/hostname="[^"]*"/g, 'hostname="redacted"');

mkdirSync(reportDir, { recursive: true });

const run = spawnSync(
  process.execPath,
  [
    '--test',
    '--experimental-test-coverage',
    '--test-coverage-include=src/**',
    '--test-reporter=spec',
    `--test-reporter-destination=${summaryPath}`,
    '--test-reporter=junit',
    `--test-reporter-destination=${junitPath}`,
  ],
  { cwd: rootDir, stdio: 'inherit' },
);

const header = `Generated: ${new Date().toISOString()}\nNode.js: ${process.version}\nExit code: ${run.status}\n\n`;
writeFileSync(summaryPath, header + sanitize(readFileSync(summaryPath, 'utf8')));
writeFileSync(junitPath, sanitize(readFileSync(junitPath, 'utf8')));
process.exitCode = run.status ?? 1;
