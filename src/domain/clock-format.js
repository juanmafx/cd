export const formatClockTime = (date) =>
  [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()].join(':');
