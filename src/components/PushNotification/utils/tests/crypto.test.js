import { urlB64ToUint8Array } from '../crypto';

describe('', () => {
  it('should decode string', () => {
    const expected = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]);
    expect(urlB64ToUint8Array('SGVsbG8gV29ybGQh')).toEqual(expected);
  });
});
