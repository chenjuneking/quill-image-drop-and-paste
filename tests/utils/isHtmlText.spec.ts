import utils from '../../src/utils';

declare const expect: jest.Expect;
describe('utils#isRichText(clipboardDataItems: DataTransferItemList)', () => {
  test('test with plain text', async () => {
    const items = new Array(3).fill('').map(() => ({
      type: 'text/pain',
    })) as any;
    const result = utils.isRichText(items);
    expect(result).toBe(false);
  });

  test('test with html text', async () => {
    const items = new Array(3).fill('').map(() => ({
      type: 'text/html',
    })) as any;
    const result = utils.isRichText(items);
    expect(result).toBe(true);
  });
});
