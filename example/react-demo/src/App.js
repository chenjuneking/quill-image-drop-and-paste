import React from 'react'
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

import 'quill/dist/quill.snow.css'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = { quill: null }
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
      placeholder: 'Compose an epic...',
      readOnly: false,
      theme: 'snow'
    })
    this.setState({ quill })
  }

  imageHandler(imageDataUrl, type) {
    console.log(imageDataUrl, type)
  }

  render() {
    return (
      <div className="App">
        <div id="editor-container" style={{ height: '480px' }}></div>
      </div>
    )
  }
}
