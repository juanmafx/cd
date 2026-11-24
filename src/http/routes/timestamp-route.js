import { formatClockTime } from '../../domain/clock-format.js';

export const createTimestampHandler = ({ clock, log }) => (_req, res) => {
  res.status(200).type('text/plain').end(`\nRequest made at : ${formatClockTime(clock())}`);
  log(`Response made at: ${formatClockTime(clock())}`);
};
