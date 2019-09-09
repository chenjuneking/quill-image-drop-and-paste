<template>
  <div id="editor-container"></div>
</template>

<script>
import Quill from 'quill'
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'

export default {
  name: 'Editor',
  data() {
    return {
      quill: null
    }
  },
  methods: {
    imageHandler(imageDataUrl, type) {
      console.log(imageDataUrl, type)
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
      placeholder: 'Compose an epic...',
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
