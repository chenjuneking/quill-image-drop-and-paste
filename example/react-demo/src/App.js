import React from 'react'
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

import 'quill/dist/quill.snow.css'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      quill: null,
      image: {
        type: '', // image's mimeType
        dataUrl: null, // image's base64 string
        blob: null, // image's BLOB object
        file: null, // image's File object
      }
    }
  }

  componentDidMount() {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
    const quill = new Quill('#editor-container', {
      modules: {
        toolbar: [['bold', 'italic'], ['link', 'image']],
        imageDropAndPaste: {
          handler: this.imageHandler.bind(this)
        }
      },
      placeholder: 'Copy & paste, or drag an image here...',
      readOnly: false,
      theme: 'snow'
    })
    this.setState({ quill })
  }

  imageHandler(dataUrl, type, imageData) {
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

      this.setState({ image: { type, dataUrl, blob, file } })
    })
  }

  render() {
    const { image } = this.state

    return (
      <div className="App">
        <div id="editor-container" style={{ height: '480px' }}></div>
        
        <div>
          <h4>Preview image from BLOB URL:</h4>
          { image.blob &&
            <img src={URL.createObjectURL(image.blob)} />
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
}
