import utils from '../../src/utils'

declare const expect: jest.Expect
const dataUrl =
  'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAASSURBVBhXYzgUGP4fhKGM8P8AVVwJpfrFzzEAAAAASUVORK5CYII='

describe('utils#urlIsImageDataUrl(url: string)', () => {
  test('return false if url is empty', async () => {
    const result = utils.urlIsImageDataUrl('')
    expect(result).toBe(false)
  })

  test("return false if url isn't a data url", async () => {
    const result = utils.urlIsImageDataUrl('http://foo.jpeg')
    expect(result).toBe(false)
  })

  test('return false if url is a data url', async () => {
    const result = utils.urlIsImageDataUrl(dataUrl)
    expect(result).toBe(true)
  })
})
