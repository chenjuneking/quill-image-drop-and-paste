const path = require('path')

module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
  },
  lintOnSave: false,
  configureWebpack: {
    resolve: {
      alias: {
        'quill-image-drop-and-paste': path.join(__dirname, '../../src/QuillImageDropAndPaste.js'),
      }
    }
  },
}