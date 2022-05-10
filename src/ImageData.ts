import utils from './utils';
import { IImageDataMinifyOption } from './index.d';

abstract class QuillImageData {
  public dataUrl: string | ArrayBuffer;
  public type: string;
  public name: string;
  public constructor(dataUrl: string | ArrayBuffer, type: string, name?: string) {
    this.dataUrl = dataUrl;
    this.type = type;
    this.name = name || '';
  }
  public abstract minify(option: IImageDataMinifyOption);
  public abstract toFile(filename?: string);
  public abstract toBlob();
}

class ImageData extends QuillImageData {
  dataUrl: string | ArrayBuffer;
  type: string;
  name: string;

  constructor(dataUrl: string | ArrayBuffer, type: string, name?: string) {
    super(dataUrl, type, name);
    this.dataUrl = dataUrl;
    this.type = type;
    this.name = name || `${utils.generateFilename()}.${this.getSuffix()}`;
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
          resolve(new ImageData(canvasDataUrl, canvasType, this.name));
        } else {
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
  public toFile(filename?: string): File | null {
    filename = filename || this.name;
    if (!window.File) {
      console.error('[error] QuillImageDropAndPaste: Your browser didnot support File API.');
      return null;
    }
    return new File([this.toBlob()], filename, { type: this.type });
  }

  /* convert dataURL to blob
   */
  public toBlob(): Blob {
    const base64 = utils.resolveDataUrl(this.dataUrl, this.type).replace(/^[^,]+,/, '');
    const buff = utils.binaryStringToArrayBuffer(atob(base64));
    return this.createBlob([buff], { type: this.type });
  }

  /* create blob
   */
  private createBlob(parts: ArrayBuffer[], properties: string | { type?: string } | undefined): Blob {
    if (!properties) properties = {};
    if (typeof properties === 'string') properties = { type: properties };
    try {
      return new Blob(parts, properties);
    } catch (e: any) {
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

  private getSuffix(): string {
    const matched = this.type.match(/^image\/(\w+)$/);
    const suffix = matched ? matched[1] : 'png';
    return suffix;
  }
}

export default ImageData;
