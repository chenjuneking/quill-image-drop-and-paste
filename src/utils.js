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
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  },
}