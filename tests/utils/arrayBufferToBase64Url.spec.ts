import utils from '../../src/utils';

declare const expect: jest.Expect;
describe('utils#arrayBufferToBase64Url(arrayBuffer: ArrayBuffer)', () => {
  test('should return base64 string', async () => {
    const buffer = new ArrayBuffer(8);
    const result = utils.arrayBufferToBase64Url(buffer, 'image/gif');
    expect(result).toEqual('data:image/gif;base64,AAAAAAAAAAA=');
  });
});
