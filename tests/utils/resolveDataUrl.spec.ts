import utils from '../../src/utils';
import { IMAGE_DATA_URL } from '../../constants';

describe('utils#resolveDataUrl(dataUrl: string | ArrayBuffer)', () => {
  test('should return base64 string', async () => {
    const result1 = utils.resolveDataUrl(IMAGE_DATA_URL);
    expect(result1).toEqual(IMAGE_DATA_URL);

    const buffer = new ArrayBuffer(8);
    const result2 = utils.resolveDataUrl(buffer);
    expect(result2).toEqual('AAAAAAAAAAA=');
  });
});
