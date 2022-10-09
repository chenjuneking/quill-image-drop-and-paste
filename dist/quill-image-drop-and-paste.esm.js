var utils = {
    /* generate a filename
     */
    generateFilename() {
        return btoa(String(Math.random() * 1e6) + String(+new Date())).replace('=', '');
    },
    /* detect the giving url is a image
     */
    urlIsImage(url, abortTimeout = 3000) {
        if (!this.validURL(url)) {
            return Promise.reject(false);
        }
        if (/\.(jpeg|jpg|gif|png|webp|tiff|bmp)$/.test(url)) {
            return Promise.resolve(true);
        }
        return new Promise((resolve, reject) => {
            let timer = undefined;
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
    validURL(str) {
        try {
            return Boolean(new URL(str));
        }
        catch (e) {
            return false;
        }
    },
    /* check the giving string is a html text
     */
    isRichText(clipboardDataItems) {
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
    resolveDataUrl(dataUrl, type) {
        let str = '';
        if (typeof dataUrl === 'string') {
            str = dataUrl;
        }
        else if (dataUrl instanceof ArrayBuffer) {
            str = this.arrayBufferToBase64Url(dataUrl, type);
        }
        return str;
    },
    /* generate array buffer from binary string
     */
    binaryStringToArrayBuffer(binary) {
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const arr = new Uint8Array(buffer);
        let i = -1;
        while (++i < len)
            arr[i] = binary.charCodeAt(i);
        return buffer;
    },
    /* generate base64 string from array buffer
     */
    arrayBufferToBase64Url(arrayBuffer, type) {
        return (`data:${type};base64,` +
            btoa(new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '')));
    },
    /* copy text - make text store in the clipboard
     */
    copyText(content, target = document.body) {
        const element = document.createElement('textarea');
        const previouslyFocusedElement = document.activeElement;
        element.value = content;
        // Prevent keyboard from showing on mobile
        element.setAttribute('readonly', '');
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.fontSize = '12pt'; // Prevent zooming on iOS
        const selection = document.getSelection();
        let originalRange = false;
        if (selection && selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        target.append(element);
        element.select();
        // Explicit selection workaround for iOS
        element.selectionStart = 0;
        element.selectionEnd = content.length;
        let isSuccess = false;
        try {
            isSuccess = document.execCommand('copy');
        }
        catch (_a) { }
        element.remove();
        if (selection && originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }
        // Get the focus back on the previously focused element, if any
        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
        }
        return isSuccess;
    },
    /* check the type of specify target
     */
    isType(target, type) {
        return Object.prototype.toString.call(target) === `[object ${type}]`;
    },
};

class QuillImageData {
    constructor(dataUrl, type, name) {
        this.dataUrl = dataUrl;
        this.type = type;
        this.name = name || '';
    }
}
class ImageData extends QuillImageData {
    constructor(dataUrl, type, name) {
        super(dataUrl, type, name);
        this.dataUrl = dataUrl;
        this.type = type;
        this.name = name || `${utils.generateFilename()}.${this.getSuffix()}`;
    }
    /* minify the image
     */
    minify(option) {
        return new Promise((resolve, reject) => {
            const maxWidth = option.maxWidth || 800;
            const maxHeight = option.maxHeight || 800;
            const quality = option.quality || 0.8;
            if (!this.dataUrl) {
                return reject({
                    message: '[error] QuillImageDropAndPaste: Fail to minify the image, dataUrl should not be empty.',
                });
            }
            const image = new Image();
            image.onload = () => {
                const width = image.width;
                const height = image.height;
                if (width > height) {
                    if (width > maxWidth) {
                        image.height = (height * maxWidth) / width;
                        image.width = maxWidth;
                    }
                }
                else {
                    if (height > maxHeight) {
                        image.width = (width * maxHeight) / height;
                        image.height = maxHeight;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    const canvasType = this.type || 'image/png';
                    const canvasDataUrl = canvas.toDataURL(canvasType, quality);
                    resolve(new ImageData(canvasDataUrl, canvasType, this.name));
                }
                else {
                    reject({
                        message: '[error] QuillImageDropAndPaste: Fail to minify the image, create canvas context failure.',
                    });
                }
            };
            image.src = utils.resolveDataUrl(this.dataUrl, this.type);
        });
    }
    /* convert blob to file
     */
    toFile(filename) {
        filename = filename || this.name;
        if (!window.File) {
            console.error('[error] QuillImageDropAndPaste: Your browser didnot support File API.');
            return null;
        }
        return new File([this.toBlob()], filename, { type: this.type });
    }
    /* convert dataURL to blob
     */
    toBlob() {
        const base64 = utils.resolveDataUrl(this.dataUrl, this.type).replace(/^[^,]+,/, '');
        const buff = utils.binaryStringToArrayBuffer(atob(base64));
        return this.createBlob([buff], { type: this.type });
    }
    /* create blob
     */
    createBlob(parts, properties) {
        if (!properties)
            properties = {};
        if (typeof properties === 'string')
            properties = { type: properties };
        try {
            return new Blob(parts, properties);
        }
        catch (e) {
            if (e.name !== 'TypeError')
                throw e;
            const Builder = 'BlobBuilder' in window
                ? window.BlobBuilder
                : 'MSBlobBuilder' in window
                    ? window.MSBlobBuilder
                    : 'MozBlobBuilder' in window
                        ? window.MozBlobBuilder
                        : window.WebKitBlobBuilder;
            const builder = new Builder();
            for (let i = 0; i < parts.length; i++)
                builder.append(parts[i]);
            return builder.getBlob(properties.type);
        }
    }
    getSuffix() {
        const matched = this.type.match(/^image\/(\w+)$/);
        const suffix = matched ? matched[1] : 'png';
        return suffix;
    }
}

class QuillImageDropAndPaste {
    constructor(quill, option) {
        this.quill = quill;
        this.option = option;
    }
}
class ImageDropAndPaste extends QuillImageDropAndPaste {
    constructor(quill, option) {
        super(quill, option);
        this.quill = quill;
        this.option = option;
        this.handleDrop = this.handleDrop.bind(this);
        this.handlePaste = this.handlePaste.bind(this);
        this.insert = this.insert.bind(this);
        this.quill.root.addEventListener('drop', this.handleDrop, false);
        this.quill.root.addEventListener('paste', this.handlePaste, false);
    }
    /* handle image drop event
     */
    handleDrop(e) {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
            e.preventDefault();
            if (document.caretRangeFromPoint) {
                const selection = document.getSelection();
                const range = document.caretRangeFromPoint(e.clientX, e.clientY);
                if (selection && range) {
                    selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
                }
            }
            this.readFiles(e.dataTransfer.files, (dataUrl, type = 'image/png', name) => {
                if (typeof this.option.handler === 'function') {
                    this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type, name));
                }
                else {
                    this.insert.call(this, utils.resolveDataUrl(dataUrl, type), type);
                }
            }, e);
        }
    }
    /* handle image paste event
     */
    handlePaste(e) {
        if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
            if (utils.isRichText(e.clipboardData.items))
                return;
            this.readFiles(e.clipboardData.items, (dataUrl, type = 'image/png') => {
                if (typeof this.option.handler === 'function') {
                    this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type));
                }
                else {
                    this.insert(utils.resolveDataUrl(dataUrl, type), 'image');
                }
            }, e);
        }
    }
    /* read the files
     */
    readFiles(files, callback, e) {
        Array.prototype.forEach.call(files, (file) => {
            if (utils.isType(file, 'DataTransferItem')) {
                this.handleDataTransfer(file, callback, e);
            }
            else if (file instanceof File) {
                this.handleDroppedFile(file, callback, e);
            }
        });
    }
    /* handle the pasted data
     */
    handleDataTransfer(file, callback, e) {
        const that = this;
        const { type } = file;
        if (type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    callback(e.target.result, type);
                }
            };
            const blob = file.getAsFile ? file.getAsFile() : file;
            if (blob instanceof Blob)
                reader.readAsDataURL(blob);
        }
        else if (type.match(/^text\/plain$/i)) {
            file.getAsString((s) => {
                // Don't preventDefault here, because there might be clipboard matchers need to be triggered
                // see https://github.com/chenjuneking/quill-image-drop-and-paste/issues/37
                const i = this.getIndex();
                utils
                    .urlIsImage(s)
                    .then(() => {
                    // If the pasted plain text is an image, delete the pasted text and insert the image
                    const j = this.getIndex();
                    this.quill.deleteText(i, j - i, 'user');
                    that.insert(s, 'image');
                })
                    .catch(() => {
                    // Otherwise, do nothing
                });
            });
        }
    }
    /* handle the dropped data
     */
    handleDroppedFile(file, callback, e) {
        const { type, name = '' } = file;
        if (type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    callback(e.target.result, type, name);
                }
            };
            reader.readAsDataURL(file);
        }
    }
    /* insert into the editor
     */
    insert(content, type) {
        const index = this.getIndex();
        let _index;
        if (type === 'image') {
            _index = index + 1;
            this.quill.insertEmbed(index, type, content, 'user');
        }
        else if (type === 'text') {
            _index = index + content.length;
            this.quill.insertText(index, content, 'user');
        }
        setTimeout(() => {
            this.quill.setSelection(_index);
        });
    }
    getIndex() {
        let index = (this.quill.getSelection(true) || {}).index;
        if (index === undefined || index < 0)
            index = this.quill.getLength();
        return index;
    }
}
ImageDropAndPaste.ImageData = ImageData;
window.QuillImageDropAndPaste = ImageDropAndPaste;
if ('Quill' in window) {
    window.Quill.register('modules/imageDropAndPaste', ImageDropAndPaste);
}

export { ImageData, ImageDropAndPaste as default };
