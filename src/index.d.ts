import Quill from 'quill'

export interface IImageDataMinifyOption {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

declare module 'quill-image-drop-and-paste' {
  export class ImageData {
    constructor(dataUrl: string | ArrayBuffer, type: string, name?: string)
    dataUrl: string | ArrayBuffer
    type: string
    minify(
      option: IImageDataMinifyOption
    ): Promise<ImageData | { message: string }>
    toFile(filename?: string): File | null
    toBlob(): Blob
  }
  export default class ImageDropAndPaste {
    static ImageData: ImageData
    public quill: Quill
    public option: {
      autoConvert?: boolean
      enableNativeUploader?: boolean
      handler?: (
        dataUrl: string | ArrayBuffer,
        type?: string,
        imageData?: ImageData
      ) => void
    }
    handleDrop(e: DragEvent): void
    handlePaste(e: ClipboardEvent): void
    readFiles(
      files: DataTransferItemList | FileList,
      callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
      e: ClipboardEvent | DragEvent
    ): void
    handleDataTransfer(
      file: DataTransferItem,
      callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
      e: ClipboardEvent | DragEvent
    ): void
    handleDroppedFile(
      file: File,
      callback: (dataUrl: string | ArrayBuffer, type?: string) => void,
      e: ClipboardEvent | DragEvent
    ): void
    insert(content: string, type: string): void
  }
}
