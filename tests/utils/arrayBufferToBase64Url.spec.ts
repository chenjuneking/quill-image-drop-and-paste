import utils from '../../src/utils';

describe('utils#arrayBufferToBase64Url(arrayBuffer: ArrayBuffer)', () => {
  test('should return base64 string', async () => {
    const buffer = new ArrayBuffer(8);
    const result = utils.arrayBufferToBase64Url(buffer);
    expect(result).toEqual('AAAAAAAAAAA=');
  });
});
