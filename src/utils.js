export default {
  /* generate a random string
  */
  hash(size) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const len = chars.length
    let s = []
    while (size--) s.push(chars[Math.floor(Math.random() * len)])
    return s.join('')
  }
}