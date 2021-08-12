export default {
  /* detect the giving url is a image
   */
  urlIsImage(url: string, abortTimeout = 3000): Promise<boolean> {
    if (!this.validURL(url)) {
      return Promise.reject(false);
    }
    if (/\.(jpeg|jpg|gif|png|webp|tiff|bmp)$/.test(url)) {
      return Promise.resolve(true);
    }
    return new Promise((resolve, reject) => {
      let timer: any = undefined;
      const img = new Image();
      img.onerror = img.onabort = () => {
        clearTimeout(timer);
        reject(false);
      };
      img.onload = () => {
        clearTimeout(timer);
        resolve(true);
      };
      timer = setTimeout(() => {
        img.src = '//!/an/invalid.jpg';
        reject(false);
      }, abortTimeout);
      img.src = url;
    });
  },
  /* check string is a valid url
   */
  validURL(str: string): boolean {
    try {
      return Boolean(new URL(str));
    } catch (e) {
      return false;
    }
  },
  /* check the giving string is a html text
   */
  isHtmlText(clipboardDataItems: DataTransferItemList): boolean {
    let isHtml = false;
    Array.prototype.forEach.call(clipboardDataItems, (item) => {
      if (item.type.match(/^text\/html$/i)) {
        isHtml = true;
      }
    });
    return isHtml;
  },
  /* resolve dataUrl to base64 string
   */
  resolveDataUrl(dataUrl: string | ArrayBuffer): string {
    let str = '';
    if (typeof dataUrl === 'string') {
      str = dataUrl;
    } else if (dataUrl instanceof ArrayBuffer) {
      str = this.arrayBufferToBase64Url(dataUrl);
    }
    return str;
  },
  /* generate array buffer from binary string
   */
  binaryStringToArrayBuffer(binary: string): ArrayBuffer {
    const len = binary.length;
    const buffer = new ArrayBuffer(len);
    const arr = new Uint8Array(buffer);
    let i = -1;
    while (++i < len) arr[i] = binary.charCodeAt(i);
    return buffer;
  },
  /* generate base64 string from array buffer
   */
  arrayBufferToBase64Url(arrayBuffer: ArrayBuffer): string {
    return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  },
};
