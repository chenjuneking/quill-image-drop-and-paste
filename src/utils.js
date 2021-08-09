export default {
  /* generate a random string
  */
  hash(size) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const len = chars.length
    let s = []
    while (size--) s.push(chars[Math.floor(Math.random() * len)])
    return s.join('')
  },
  /* detect the giving url is a image
  */
  urlIsImage(url, abortTimeout = 3000) {
    if (!this.validURL(url)) {
      return Promise.reject(false)
    }
    if (/\.(jpeg|jpg|gif|png|webp|tiff|bmp)$/.test(url)) {
      return Promise.resolve(true)
    }
    return new Promise((resolve, reject) => {
      let timer, img = new Image()
      img.onerror = img.onabort = () => {
        clearTimeout(timer)
        reject(false)
      }
      img.onload = () => {
        clearTimeout(timer)
        resolve(true)
      }
      timer = setTimeout(() => {
        img.src = '//!/an/invalid.jpg'
        reject(false)
      }, abortTimeout)
      img.src = url
    })
  },
  /* check string is a valid url
  */
  validURL (str) {
    try {
      return Boolean(new URL(str))
    } catch(e) {
      return false
    }
  },
  /* check the giving string is a html text
  */
  isHtmlText (clipboardDataItems) {
    let isHtml = false
    Array.prototype.forEach.call(clipboardDataItems, (item) => {
      if (item.type.match(/^text\/html$/i)) {
        isHtml = true
      }
    })
    return isHtml
  },
}