#!/bin/bash

dir="$(dirname "${BASH_SOURCE[0]}")/.."

# compile & uglify
js=$(npx browserify $dir/src/QuillImageDropAndPaste.js -t [ babelify --presets [ @babel/preset-env ] ] | $dir/node_modules/uglify-js/bin/uglifyjs -m)
echo $js > $dir/quill-image-drop-and-paste.min.js