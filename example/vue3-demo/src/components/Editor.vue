<template>
  <div>
    <h1>Vue Example</h1>
    <div id="editor-container"></div>

    <div>
      <h4>Preview image from BLOB URL:</h4>
      <img v-if="blobUrl" :src="blobUrl" alt="preview blob" />
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
import { defineComponent, ref, reactive, onMounted } from 'vue'
import Quill from 'quill'
import QuillImageDropAndPaste, { ImageData } from 'quill-image-drop-and-paste'

const Delta = Quill.import('delta')
Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste)

export default defineComponent({
  name: 'Editor',
  setup: () => {
    const quill = ref(null)
    const blobUrl = ref(null)
    const image = reactive({
      type: '', // image's mimeType
      dataUrl: null, // image's base64 string
      blob: null, // image's BLOB object
      file: null, // image's File object
    })

    const isUrl = (str) => {
      try {
        return Boolean(new URL(str))
      } catch (e) {
        return false
      }
    }

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
        image.type = type
        image.dataUrl = dataUrl
        image.blob = blob
        image.file = file
        blobUrl.value = URL.createObjectURL(blob)
      })
    }

    const textPasteHander = (text) => {
      return isUrl(text)
        ? new Delta().insert(text, { link: text })
        : new Delta().insert(text)
    }

    onMounted(() => {
      quill.value = new Quill('#editor-container', {
        modules: {
          toolbar: [['bold', 'italic'], ['link', 'image']],
          imageDropAndPaste: {
            handler: imageHandler
          },
          clipboard: {
            matchers: [
              // your custom paste handler
              [Node.TEXT_NODE, (node, delta) => textPasteHander(node.data, delta)],
            ]
          }
        },
        placeholder: 'Copy & paste, or drag an image here...',
        readOnly: false,
        theme: 'snow'
      })

      quill.value
        .getModule('toolbar')
        .addHandler('image', function (clicked) {
          if (clicked) {
            let fileInput = this.container.querySelector(
              'input.ql-image[type=file]'
            );
            if (fileInput == null) {
              fileInput = document.createElement('input');
              fileInput.setAttribute('type', 'file');
              fileInput.setAttribute(
                'accept',
                'image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
              );
              fileInput.classList.add('ql-image');

              fileInput.addEventListener('change', function (e) {
                const files = e.target.files;
                let file;
                if (files.length > 0) {
                  file = files[0];
                  const type = file.type;
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    // handle the inserted image
                    const dataUrl = e.target.result;
                    imageHandler(
                      dataUrl,
                      type,
                      new ImageData(dataUrl, type, file.name)
                    );
                    fileInput.value = '';
                  };
                  reader.readAsDataURL(file);
                }
              });
            }
            fileInput.click();
          }
        });
    })

    return {
      quill,
      image,
      blobUrl,
    }
  },
})
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
  @import '../../node_modules/quill/dist/quill.snow.css';
  #editor-container {
    height: 320px;
  }
</style>
