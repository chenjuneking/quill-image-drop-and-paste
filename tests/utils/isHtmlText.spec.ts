import utils from '../../src/utils'

declare const expect: jest.Expect
describe('utils#isRichText(clipboardDataItems: DataTransferItemList)', () => {
  test('return false if the clipboard data items are plain text', async () => {
    const items = new Array(3).fill('').map(() => ({
      kind: 'string',
      type: 'text/pain',
    })) as any
    const result = utils.isRichText(items)
    expect(result).toBe(false)
  })

  test('return true if the clipboard data items are rich text - 1', async () => {
    const items = new Array(3).fill('').map(() => ({
      kind: 'string',
      type: 'text/html',
    })) as any
    const result = utils.isRichText(items)
    expect(result).toBe(true)
  })

  test('return true if the clipboard data items are rich text - 2', async () => {
    const items = [
      { kind: 'string', type: 'text/pain' },
      { kind: 'string', type: 'text/html' },
    ] as any
    const result = utils.isRichText(items)
    expect(result).toBe(true)
  })

  test("return false if the clipboard data items has image's data url", async () => {
    const items = [
      { kind: 'string', type: 'text/pain' },
      { kind: 'string', type: 'text/html' },
      { kind: 'file', type: 'image/png' },
    ] as any
    const result = utils.isRichText(items)
    expect(result).toBe(false)
  })
})
