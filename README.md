# QuillImageDropAndPaste
> A quill editor module for drop and paste image, with a callback hook before inserting image into the editor.

This module was forked from [quill-image-drop-module]: https://www.npmjs.com/package/quill-image-drop-module <br>
The only difference was that we could choose how to handle the image we just dropped or pasted, without inserting a base64 url image into the editor directly. <br>
For example, a base64 string was too large, if we saved it into the database, it could easilly out of the size for the column, the best practice was to save the image on our server and returned the image's url, and finally we inserted the image with the returned url into the editor. <br>

## Install
```bash
npm install quill-image-drop-and-paste --save
```

## Usage

### ES6

```javascript
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'
import { base64StringToBlob } from 'blob-util'

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

const quill = new Quill('#editor-container', {
  imageDropAndPaste: {
    // add an custom image handler
    handler: imageHandler
  }
})

/**
* Do something to our dropped or pasted image
* @param.imageDataUrl - image's base64 url
* @param.type - image's mime type
*/
function imageHandler(imageDataUrl, type) {
  // give a default mime type if the type was null
  if (!type) type = 'image/png'

  // base64 to blob
  var blob = base64StringToBlob(base64URL.replace(/^data:image\/\w+;base64,/, ''), type)

  var filename = ['my', 'cool', 'image', '-', Math.floor(Math.random() * 1e12), '-', new Date().getTime(), '.', type.match(/^image\/(\w+)$/i)[1]].join('')

  // generate a form data
  var formData = new FormData()
  formData.append('filename', filename)
  formData.append('file', blob)

  // upload image to your server
  callUploadAPI(your_upload_url, formData, (err, res) => {
    if (err) return
    // success? you should return the uploaded image's url
    // then insert into the quill editor
    const index = (quill.getSelection() || {}).index || quill.getLength()
    if (index) quill.insertEmbed(index, 'image', res.data.image_url, 'user')
  })
}
```

Additional, you could rewrite the toolbar's insert image button with our image handler.

```javascript
quill.getModule('toolbar').addHandler('image', (clicked) => {
  if (clicked) {
    let fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput == null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', (e) => {
        var files = e.target.files, file
        if (files.length > 0) {
          file = files[0]
          var type = file.type
          var reader = new FileReader()
          reader.onload = (e) => {
            // handle the inserted image
            imageHandler(e.target.result, type)
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

### Script Tag

Copy quill-image-drop-and-paste.min.js into your web root or include from node_modules

```html
<script src="/node_modules/quill-image-drop-and-paste/quill-image-drop-and-paste.min.js"></script>
```

```javascript
var quill = new Quill(editor, {
    // ...
    modules: {
        // ...
        imageDrop: true
    }
});
```

### Finally

If you didnot config a image handler, it will insert the image into the quill editor directory after you drop/paste a image.
Just like the module [quill-image-drop-module]: https://www.npmjs.com/package/quill-image-drop-module did.


































