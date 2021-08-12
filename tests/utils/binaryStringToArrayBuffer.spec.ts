import utils from '../../src/utils';

describe('utils#binaryStringToArrayBuffer(binary: string)', () => {
  test('should return array buffer', async () => {
    const base64Str = 'AAAAAAAAAAA=';
    const result = utils.binaryStringToArrayBuffer(base64Str);
    expect(result instanceof ArrayBuffer).toBe(true);
    expect(result.byteLength).toEqual(12);
  });
});
