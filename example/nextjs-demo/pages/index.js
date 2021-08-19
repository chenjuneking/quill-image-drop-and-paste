import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'quill/dist/quill.snow.css'
import styles from '../styles/index.module.css'

const Quill = typeof window === 'object' ? require('quill') : () => false;
const QuillImageDropAndPaste =
  typeof window === "object"
    ? require("quill-image-drop-and-paste").default
    : () => false;

export default function QuillEditor() {
  const quillRef = useRef();
  const [quill, setQuill] = useState(null);
  const [image, setImage] = useState({
    type: '', // image's mimeType
    dataUrl: null, // image's base64 string
    blob: null, // image's BLOB object
    file: null, // image's File object
  });

  const imageHandler = (dataUrl, type, imageData) => {
    const originalFile = imageData.toFile();

    imageData.minify({
      maxWidth: 320,
      maxHeight: 320,
      quality: .7
    }).then((miniImageData) => {
      const blob = miniImageData.toBlob();
      const file = miniImageData.toFile();

      console.log(`type: ${type}`)
      console.log(`dataUrl: ${dataUrl}`)
      console.log(
        `compressed file size: ${file.size * 1e-3} KB, original file size: ${originalFile.size * 1e-3} KB`
      )

      const formData = new FormData();
      // upload the image which has less size
      formData.append('file', file.size < originalFile.size ? file : originalFile);
      axios.post('/api/upload', formData, {
        headers: {
          'content-type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        },
      }).then((res) => {
        console.log('upload response: ', res.data);
      }).catch((err) => {
        console.error('upload error: ', err);
      });

      setImage({ type, dataUrl, blob, file })
    })
  }

  useEffect(() => {
    if (quillRef.current) {
      Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);
      const quill = new Quill(quillRef.current, {
        modules: {
          toolbar: [['bold', 'italic'], ['link', 'image']],
          imageDropAndPaste: {
            handler: imageHandler,
          }
        },
        placeholder: 'Copy & paste, or drag an image here...',
        readOnly: false,
        theme: 'snow'
      });
      setQuill(quill);

      const ImageData = QuillImageDropAndPaste.ImageData
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
    }
  }, [quillRef])

  return (
    <div className="quill-page">
      <h1>Next.js Example</h1>
      <div className={styles.editor} ref={quillRef}></div>

      <div>
        <h4>Preview image from BLOB URL:</h4>
        { image.blob &&
          <img src={URL.createObjectURL(image.blob)} alt="preview blob" />
        }
      </div>

      <hr />
        
      <div>
        <h4>Get file infomation from File Object:</h4>
        { image.file &&
          <div>
            <b>name:</b> <span>{image.file.name}</span> <br />
            <b>size:</b> <span>{image.file.size}</span> <br />
            <b>type:</b> <span>{image.file.type}</span>
          </div>
        }
      </div>
    </div>
  )
}