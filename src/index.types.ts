import Quill from 'quill';

export interface IImageData {
  dataUrl: string | ArrayBuffer;
  type: string;
}

export interface IImageDataMinifyOption {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface IImageDropAndPaste {
  quill: Quill;
  option: IImageDropAndPasteOption;
}

export interface IImageDropAndPasteOption {
  handler?: (dataUrl: string | ArrayBuffer, type?: string, imageData?: IImageData) => void;
}
