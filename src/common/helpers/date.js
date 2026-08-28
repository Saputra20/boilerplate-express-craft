const localDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
};

const startOfDayIso = (value) => {
  const date = localDate(value);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const endOfDayIso = (value) => {
  const date = localDate(value);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
};

module.exports = {
  startOfDayIso,
  endOfDayIso,
};
