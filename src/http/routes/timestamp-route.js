import { formatClockTime } from '../../domain/clock-format.js';

export const createTimestampHandler = ({ clock, log }) => (_req, res) => {
  res.type('text/plain').send(`\nRequest made at : ${formatClockTime(clock())}`);
  log(`Response made at: ${formatClockTime(clock())}`);
};
