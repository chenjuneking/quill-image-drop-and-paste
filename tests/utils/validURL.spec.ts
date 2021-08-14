import utils from '../../src/utils';
import { IMAGE_DATA_URL } from '../../constants';

declare const expect: jest.Expect;
describe('utils#validURL(str: string)', () => {
  test('empty url', async () => {
    const result = utils.validURL('');
    expect(result).toBe(false);
  });

  test('invalid url', async () => {
    const result = utils.validURL('foo bar');
    expect(result).toBe(false);
  });

  test('valid url', async () => {
    const result = utils.validURL('https://github.com');
    expect(result).toBe(true);
  });

  test('data url', async () => {
    const result = utils.validURL(IMAGE_DATA_URL);
    expect(result).toBe(true);
  });
});
