import utils from './utils';
import { IImageData, IImageDataMinifyOption, IImageDropAndPaste, IImageDropAndPasteOption } from './index.types';
import Quill from 'quill';

export class ImageData implements IImageData {
  dataUrl: string | ArrayBuffer;
  type: string;

  constructor(dataUrl: string | ArrayBuffer, type: string) {
    this.dataUrl = dataUrl;
    this.type = type;
  }

  /* minify the image
   */
  public minify(option: IImageDataMinifyOption): Promise<ImageData | { message: string }> {
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
        } else {
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
          resolve(new ImageData(canvasDataUrl, canvasType));
        } else {
          reject({
            message: '[error] QuillImageDropAndPaste: Fail to minify the image, create canvas context failure.',
          });
        }
      };
      image.src = utils.resolveDataUrl(this.dataUrl);
    });
  }

  /* convert blob to file
   */
  public toFile(filename: string): File | null {
    if (!window.File) {
      console.error('[error] QuillImageDropAndPaste: Your browser didnot support File API.');
      return null;
    }
    return new File([this.toBlob()], filename, { type: this.type });
  }

  /* convert dataURL to blob
   */
  public toBlob(): Blob {
    const base64 = utils.resolveDataUrl(this.dataUrl).replace(/^[^,]+,/, '');
    const buff = utils.binaryStringToArrayBuffer(atob(base64));
    return this.createBlob([buff], { type: this.type });
  }

  /* create blob
   */
  createBlob(parts: ArrayBuffer[], properties: string | { type?: string } | undefined): Blob {
    if (!properties) properties = {};
    if (typeof properties === 'string') properties = { type: properties };
    try {
      return new Blob(parts, properties);
    } catch (e) {
      if (e.name !== 'TypeError') throw e;
      const Builder =
        'BlobBuilder' in window
          ? (window as any).BlobBuilder
          : 'MSBlobBuilder' in window
          ? (window as any).MSBlobBuilder
          : 'MozBlobBuilder' in window
          ? (window as any).MozBlobBuilder
          : (window as any).WebKitBlobBuilder;
      const builder = new Builder();
      for (let i = 0; i < parts.length; i++) builder.append(parts[i]);
      return builder.getBlob(properties.type) as Blob;
    }
  }
}

export default class ImageDropAndPaste implements IImageDropAndPaste {
  static ImageData = ImageData;
  quill: Quill;
  option: IImageDropAndPasteOption;

  constructor(quill: Quill, option: IImageDropAndPasteOption) {
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
  handleDrop(e: DragEvent): void {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
        }
      }
      this.readFiles(
        e.dataTransfer.files,
        (dataUrl, type) => {
          type = type || 'image/png';
          if (typeof this.option.handler === 'function') {
            this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type));
          } else {
            this.insert.call(this, utils.resolveDataUrl(dataUrl), type);
          }
        },
        e,
      );
    }
  }

  /* handle image paste event
   */
  handlePaste(e: ClipboardEvent): void {
    if (e.clipboardData && e.clipboardData.items && e.clipboardData.items.length) {
      if (utils.isHtmlText(e.clipboardData.items)) return;
      this.readFiles(
        e.clipboardData.items,
        (dataUrl: string | ArrayBuffer, type?: string) => {
          type = type || 'image/png';
          if (typeof this.option.handler === 'function') {
            this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type));
          } else {
            this.insert(utils.resolveDataUrl(dataUrl), 'image');
          }
        },
        e,
      );
    }
  }

  /* read the files
   */
  readFiles(
    files: DataTransferItemList | FileList,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    Array.prototype.forEach.call(files, (file: DataTransferItem | File) => {
      if (file instanceof DataTransferItem) {
        this.handleDataTransfer(file, callback, e);
      } else if (file instanceof File) {
        this.handleDroppedFile(file, callback, e);
      }
    });
  }

  /* handle the pasted data
   */
  handleDataTransfer(
    file: DataTransferItem,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    const that = this;
    const type = file.type;
    if (type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          callback(e.target.result, type);
        }
      };
      const blob = file.getAsFile ? file.getAsFile() : file;
      if (blob instanceof Blob) reader.readAsDataURL(blob);
    } else if (type.match(/^text\/plain$/i)) {
      e.preventDefault();
      file.getAsString((s) => {
        utils
          .urlIsImage(s)
          .then(() => {
            that.insert(s, 'image');
          })
          .catch(() => {
            that.insert(s, 'text');
          });
      });
    }
  }

  /* handle the dropped data
   */
  handleDroppedFile(
    file: File,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    const type = file.type;
    if (type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          callback(e.target.result, type);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* insert into the editor
   */
  insert(content: string, type: string): void {
    let index: number | undefined = (this.quill.getSelection(true) || {}).index;
    if (index === undefined || index < 0) index = this.quill.getLength();
    let _index: any;
    if (type === 'image') {
      _index = index + 1;
      this.quill.insertEmbed(index, type, content, 'user');
    } else if (type === 'text') {
      _index = index + content.length;
      this.quill.insertText(index, content, 'user');
    }
    setTimeout(() => {
      this.quill.setSelection(_index);
    });
  }
}

(window as any).QuillImageDropAndPaste = ImageDropAndPaste;
if ('Quill' in window) {
  (window as any).Quill.register('modules/imageDropAndPaste', ImageDropAndPaste);
}
