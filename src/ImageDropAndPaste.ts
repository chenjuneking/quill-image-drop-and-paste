import utils from './utils';
import Quill from 'quill';
import ImageData from './ImageData';
interface IImageDropAndPasteOption {
  handler?: (dataUrl: string | ArrayBuffer, type?: string, imageData?: ImageData) => void;
}

abstract class QuillImageDropAndPaste {
  static ImageData;
  public quill;
  public option: IImageDropAndPasteOption;
  public constructor(quill: Quill, option: IImageDropAndPasteOption) {
    this.quill = quill;
    this.option = option;
  }
  protected abstract handleDrop(e: DragEvent);
  protected abstract handlePaste(e: ClipboardEvent);
  protected abstract readFiles(
    files: DataTransferItemList | FileList,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  );
  protected abstract handleDataTransfer(
    file: DataTransferItem,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  );
  protected abstract handleDroppedFile(
    file: File,
    callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
    e: ClipboardEvent | DragEvent,
  );
  protected abstract insert(content: string, type: string);
  protected abstract getIndex();
}

class ImageDropAndPaste extends QuillImageDropAndPaste {
  static ImageData = ImageData;
  quill: Quill;
  option: IImageDropAndPasteOption;

  constructor(quill: Quill, option: IImageDropAndPasteOption) {
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
  handleDrop(e: DragEvent): void {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
      e.preventDefault();
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
        }
      }
      this.readFiles(
        e.dataTransfer.files,
        (dataUrl: string | ArrayBuffer, type = 'image/png', name?: string) => {
          if (typeof this.option.handler === 'function') {
            this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type, name));
          } else {
            this.insert.call(this, utils.resolveDataUrl(dataUrl, type), type);
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
      if (utils.isRichText(e.clipboardData.items)) return;
      this.readFiles(
        e.clipboardData.items,
        (dataUrl: string | ArrayBuffer, type = 'image/png') => {
          if (typeof this.option.handler === 'function') {
            this.option.handler.call(this, dataUrl, type, new ImageData(dataUrl, type));
          } else {
            this.insert(utils.resolveDataUrl(dataUrl, type), 'image');
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
    callback: (dataUrl: string | ArrayBuffer, type: string, name?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    Array.prototype.forEach.call(files, (file: DataTransferItem | File) => {
      if (utils.isType(file, 'DataTransferItem')) {
        this.handleDataTransfer(file as DataTransferItem, callback, e);
      } else if (file instanceof File) {
        this.handleDroppedFile(file, callback, e);
      }
    });
  }

  /* handle the pasted data
   */
  handleDataTransfer(
    file: DataTransferItem,
    callback: (dataUrl: string | ArrayBuffer, type: string, name?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    const that = this;
    const { type } = file;
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
  handleDroppedFile(
    file: File,
    callback: (dataUrl: string | ArrayBuffer, type: string, name?: string) => void,
    e: ClipboardEvent | DragEvent,
  ): void {
    const { type, name = '' } = file;
    if (type.match(/^image\/(gif|jpe?g|a?png|svg|webp|bmp)/i)) {
      e.preventDefault();
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          callback(e.target.result, type, name);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /* insert into the editor
   */
  insert(content: string, type: string): void {
    const index = this.getIndex();
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

  getIndex(): number {
    let index: number | undefined = (this.quill.getSelection(true) || {}).index;
    if (index === undefined || index < 0) index = this.quill.getLength();
    return index;
  }
}

(window as any).QuillImageDropAndPaste = ImageDropAndPaste;
if ('Quill' in window) {
  (window as any).Quill.register('modules/imageDropAndPaste', ImageDropAndPaste);
}

export default ImageDropAndPaste;
