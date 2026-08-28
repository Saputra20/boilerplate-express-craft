const { describe, expect, test } = require('bun:test');
const security = require('../src/common/helpers/security');
const { endOfDayIso, startOfDayIso } = require('../src/common/helpers/date');

describe('Bun native replacements', () => {
  test('keeps bcrypt hashes compatible', () => {
    const existingHash = '$2b$10$6CIPlx/hTXMmKM21P9Nc3OTL2MrULLnFXDWpX7qBGeNuUoHEEPmtm';
    const nextHash = security.hash('compatibility-check');

    expect(security.compareHash('compatibility-check', existingHash)).toBe(true);
    expect(security.compareHash('wrong-password', existingHash)).toBe(false);
    expect(security.compareHash('compatibility-check', nextHash)).toBe(true);
  });

  test('preserves local date boundaries', () => {
    const start = startOfDayIso('2026-08-28');
    const end = endOfDayIso('2026-08-28');

    expect(new Date(start).getHours()).toBe(0);
    expect(new Date(start).getMinutes()).toBe(0);
    expect(new Date(end).getHours()).toBe(23);
    expect(new Date(end).getMinutes()).toBe(59);
    expect(new Date(end).getSeconds()).toBe(59);
    expect(new Date(end).getMilliseconds()).toBe(999);
  });
});
