import utils from '../../src/utils'

declare const expect: jest.Expect

async function exec(url: string, expected: boolean, abortTimeout?: number) {
  let result: boolean
  try {
    result = await utils.urlIsImage(url, abortTimeout)
  } catch (e) {
    result = false
  }
  expect(result).toBe(expected)
}

describe('utils#urlIsImage(url: string, abortTimeout = 3000)', () => {
  test('empty url', async () => {
    await exec('', false)
  })

  test('check suffix', async () => {
    await exec('http://foo.jpeg', true)
    await exec('http://foo.jpg', true)
    await exec('http://foo.gif', true)
    await exec('http://foo.png', true)
    await exec('http://foo.tiff', true)
    await exec('http://foo.bmp', true)
    await exec('http://foo.txt', false)
  })
})
