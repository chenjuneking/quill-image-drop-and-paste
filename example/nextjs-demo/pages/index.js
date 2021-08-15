import React, { useState, useEffect, useRef } from 'react';
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
    imageData.minify({
      maxWidth: 320,
      maxHeight: 320,
      quality: .7
    }).then((miniImageData) => {
      const blob = miniImageData.toBlob()
      const file = miniImageData.toFile('my_cool_image.png')

      console.log(`type: ${type}`)
      console.log(`dataUrl: ${dataUrl}`)
      console.log(`blob: ${blob}`)
      console.log(`file: ${file}`)

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