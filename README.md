# QuillImageDropAndPaste
> A quill editor module for drop and paste image, with a callback hook before inserting image into the editor.

This module supported drop and paste image into the [quill](https://quilljs.com/) editor, by default, it would insert a image with a base64 url. Because of a base64 string was too large, if we saved it into the database, it could easilly out of the size of the column, the best practice was to save the image on our server and returned the image's url, and finally we inserted the image with the returned url into the editor. <br>


### Examples

[React Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/react-demo)

[Vue Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/vue-demo)

[Simple Web Demo](https://github.com/chenjuneking/quill-image-drop-and-paste/tree/master/example/web-demo)


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

var quill = new Quill('#editor-container', {
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
* @param.imageData {object} - provided more functions to handle the image
*   - imageData.toBlob() {function} - convert image to a BLOB Object
*   - imageData.toFile(filename) {function} - convert image to a File Object
*   - imageData.minify(options) {function)- minify the image, return a promise
*      - options.maxWidth {number} - specify the max width of the image, default is 800
*      - options.maxHeight {number} - specify the max height of the image, default is 800
*      - options.quality {number} - specify the quality of the image, default is 0.8
*/
function imageHandler(imageDataUrl, type, imageData) {

  var filename = 'my_cool_image.png'
  var blob = imageData.toBlob()
  var file = imageData.toFile(filename)

  // generate a form data
  var formData = new FormData()

  // append blob data
  formData.append('filename', filename)
  formData.append('file', blob)

  // or just append the file
  formData.append('file', file)

  // upload image to your server
  callUploadAPI(your_upload_url, formData, (err, res) => {
    if (err) return
    // success? you should return the uploaded image's url
    // then insert into the quill editor
    var index = (quill.getSelection() || {}).index || quill.getLength()
    if (index) quill.insertEmbed(index, 'image', res.data.image_url, 'user')
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
    var filename = 'my_cool_image.png'
    var blob = miniImageData.toBlob()
    var file = miniImageData.toFile(filename)
    // create a form data, and upload to the server...
  })
}
```

Additional, you could rewrite the toolbar's insert image button with our image handler.

```javascript
var ImageData = QuillImageDropAndPaste.ImageData
quill.getModule('toolbar').addHandler('image', function(clicked) {
  if (clicked) {
    var fileInput = this.container.querySelector('input.ql-image[type=file]')
    if (fileInput == null) {
      fileInput = document.createElement('input')
      fileInput.setAttribute('type', 'file')
      fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon')
      fileInput.classList.add('ql-image')
      fileInput.addEventListener('change', function(e) {
        var files = e.target.files, file
        if (files.length > 0) {
          file = files[0]
          var type = file.type
          var reader = new FileReader()
          reader.onload = (e) => {
            // handle the inserted image
            var dataUrl = e.target.result
            imageHandler(dataUrl, type, new ImageData(dataUrl, type))
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
var quill = new Quill(editorSelector, {
  // ...
  modules: {
    imageDropAndPaste: {
      // add an custom image handler
      handler: imageHandler
    }
  }
});
```

### Finally

If you didnot config a image handler, it will insert the image with dataURL into the quill editor directory after your drop/paste.