# QuillImageDropAndPaste
> A quill editor module for drop and paste image, with a callback hook before inserting image into the editor.

This module supported drop and paste image into the [quill](https://quilljs.com/) editor, by default, it would insert a image with a base64 url. Because of a base64 string was too large, if we saved it into the database, it could easilly out of the size of the column, the best practice was to save the image on our server and returned the image's url, and finally we inserted the image with the returned url into the editor. <br>


### Examples

[React Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/react-demo)

[Vue2 Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/vue-demo)

[Vue3 Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/vue3-demo)

[Angular Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/angular-demo)

[Next.js Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/nextjs-demo) (full example with client and server side image upload implementation)

[Script Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/script-demo)


## Install
```bash
npm install quill-image-drop-and-paste --save
```

## Usage

### ES6

```javascript
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

const quill = new Quill('#editor-container', {
  modules: {
    imageDropAndPaste: {
      // add an custom image handler
      handler: imageHandler
    }
  }
})

/**
* Do something to our dropped or pasted image
* @param.imageDataUrl {string} - image's dataURL
* @param.type {string} - image's mime type
* @param.imageData {ImageData} - provided more functions to handle the image
*   - imageData.toBlob() {function} - convert image to a BLOB Object
*   - imageData.toFile(filename?: string) {function} - convert image to a File Object. filename is optional, it will generate a random name if the original image didn't have a name.
*   - imageData.minify(options) {function)- minify the image, return a promise
*      - options.maxWidth {number} - specify the max width of the image, default is 800
*      - options.maxHeight {number} - specify the max height of the image, default is 800
*      - options.quality {number} - specify the quality of the image, default is 0.8
*/
function imageHandler(imageDataUrl, type, imageData) {
  const blob = imageData.toBlob()
  const file = imageData.toFile()

  // generate a form data
  const formData = new FormData()

  // append blob data
  formData.append('file', blob)

  // or just append the file
  formData.append('file', file)

  // upload image to your server
  callUploadAPI(your_upload_url, formData, (err, res) => {
    if (err) return
    // success? you should return the uploaded image's url
    // then insert into the quill editor
    let index = (quill.getSelection() || {}).index;
    if (index === undefined || index < 0) index = quill.getLength();
    quill.insertEmbed(index, 'image', res.data.image_url, 'user')
  })
}
```

Minify image before upload to the server.

```javascript
function imageHandler(imageDataUrl, type, imageData) {
  imageData.minify({
    maxWidth: 320,
    maxHeight: 320,
    quality: 0.7
  }).then(miniImageData => {
    const blob = miniImageData.toBlob()
    const file = miniImageData.toFile()
    // create a form data, and upload to the server...
  })
}
```

Additional, you could rewrite the toolbar's insert image button with our image handler.

```javascript
import { ImageData } from 'quill-image-drop-and-paste'

quill.getModule('toolbar').addHandler('image', function(clicked) {
  if (clicked) {
    let fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput == null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', function(e) {
        const files = e.target.files
        let file
        if (files.length > 0) {
          file = files[0]
          const type = file.type
          const reader = new FileReader()
          reader.onload = (e) => {
            // handle the inserted image
            const dataUrl = e.target.result
            imageHandler(dataUrl, type, new ImageData(dataUrl, type, file.name))
            fileInput.value = ''
          }
          reader.readAsDataURL(file)
        }
      })
    }
    fileInput.click()
  }
})
```

> ⚠️ **Can be confused**: `ImageData` from `quill-image-drop-and-paste` is different from [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData) in the Web API.

### Script Tag

Copy `dist/quill-image-drop-and-paste.min.js` into your web root or include from node_modules

```html
<script src="/node_modules/quill-image-drop-and-paste/quill-image-drop-and-paste.min.js"></script>
```

```javascript
const quill = new Quill(editorSelector, {
  // ...
  modules: {
    imageDropAndPaste: {
      // add an custom image handler
      handler: imageHandler
    }
  }
});

// access ImageData
// avoid to cover window's ImageData constructor, we should give it another name
const QuillImageData = QuillImageDropAndPaste.ImageData
```

### Finally

If you didnot config a image handler, it will insert the image with dataURL into the quill editor directory after your drop/paste.
