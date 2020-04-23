<template>
  <div>
    <div id="editor-container"></div>

    <div>
      <h4>Preview image from BLOB URL:</h4>
      <img v-if="blobUrl" :src="blobUrl" />
    </div>

    <hr />

    <div>
      <h4>Get file infomation from File Object:</h4>
      <div v-if="image.file">
        <b>name:</b> <span>{{image.file.name}}</span> <br />
        <b>size:</b> <span>{{image.file.size}}</span> <br />
        <b>type:</b> <span>{{image.file.type}}</span>
      </div>
    </div>
  </div>
        
        
        
          
</template>

<script>
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

export default {
  name: 'Editor',
  data() {
    return {
      quill: null,
      image: {
        type: '', // image's mimeType
        dataUrl: null, // image's base64 string
        blob: null, // image's BLOB object
        file: null, // image's File object
      },
      blobUrl: null,
    }
  },
  methods: {
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

        this.image = { type, dataUrl, blob, file }
        this.blobUrl = URL.createObjectURL(blob)
      })
    }
  },
  mounted() {
    Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)
    this.quill = new Quill('#editor-container', {
      modules: {
        toolbar: [['bold', 'italic'], ['link', 'image']],
        imageDropAndPaste: {
          handler: this.imageHandler
        }
      },
      placeholder: 'Copy & paste, or drag an image here...',
      readOnly: false,
      theme: 'snow'
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @import '../../node_modules/quill/dist/quill.snow.css';

  #editor-container {
    height: 450px;
  }
</style>
