import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import Quill from 'quill';
import QuillImageDropAndPaste, { ImageData as QuillImageData } from 'quill-image-drop-and-paste';

interface IImageMeta {
  type: string;
  dataUrl: string;
  blobUrl: SafeUrl;
  file: File | null;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Angular Example';
  image: IImageMeta = {
    type: '',
    dataUrl: '',
    blobUrl: '',
    file: null,
  };

  constructor(private sanitizer: DomSanitizer) {}

  imageHandler(dataUrl: string, type: string, imageData: QuillImageData) {
    imageData
      .minify({
        maxWidth: 320,
        maxHeight: 320,
        quality: 0.7,
      })
      .then((miniImageData) => {
        if (miniImageData instanceof QuillImageData) {
          const blob = miniImageData.toBlob();
          const file = miniImageData.toFile('my_cool_image.png');

          console.log(`type: ${type}`);
          console.log(`dataUrl: ${dataUrl}`);
          console.log(`blob: ${blob}`);
          console.log(`file: ${file}`);

          this.image = {
            type,
            dataUrl,
            blobUrl: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)),
            file,
          };
        }
      });
  }

  ngOnInit() {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
    new Quill('#editor-container', {
      modules: {
        toolbar: [
          ['bold', 'italic'],
          ['link', 'image'],
        ],
        imageDropAndPaste: {
          handler: this.imageHandler.bind(this),
        },
      },
      placeholder: 'Copy & paste, or drag an image here...',
      readOnly: false,
      theme: 'snow',
    });
  }
}
