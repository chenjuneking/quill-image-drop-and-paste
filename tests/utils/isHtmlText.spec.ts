import utils from '../../src/utils';

describe('utils#isHtmlText(clipboardDataItems: DataTransferItemList)', () => {
  test('test with plain text', async () => {
    const items = new Array(3).fill('').map(() => ({
      type: 'text/pain',
    })) as any;
    const result = utils.isHtmlText(items);
    expect(result).toBe(false);
  });

  test('test with html text', async () => {
    const items = new Array(3).fill('').map(() => ({
      type: 'text/html',
    })) as any;
    const result = utils.isHtmlText(items);
    expect(result).toBe(true);
  });
});
