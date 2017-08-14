const expect = require('expect');

const getOrNull = require('./../utils/getOrNull');

describe('Get or null', () => {
  it('should return the value of the given key if not empty', () => {
    const obj = { x: 1 };

    expect(getOrNull(obj, 'x')).toBe(obj.x);
  });

  it('should return null if empty', () => {
    const obj = { x: '' };

    expect(getOrNull(obj, 'x')).toBe(null);
  });

  it('should return null if missing', () => {
    const obj = {};

    expect(getOrNull(obj, 'x')).toBe(null);
  });
});
