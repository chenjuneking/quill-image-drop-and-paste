#!/bin/bash

dir="$(dirname "${BASH_SOURCE[0]}")/.."

reactDemoRoot=example/react-demo
vueDemoRoot=example/vue-demo
simpleWebRoot=example/web-demo
file=QuillImageDropAndPaste.js


if [ -d "$reactDemoRoot/node_modules" ]; then
  cp src/$file $reactDemoRoot/node_modules/quill-image-drop-and-paste/src/$file
fi

if [ -d "$vueDemoRoot/node_modules" ]; then
  cp src/$file $vueDemoRoot/node_modules/quill-image-drop-and-paste/src/$file
fi

# compile & uglify
js=$(npx browserify $dir/src/QuillImageDropAndPaste.js -t [ babelify --presets [ @babel/preset-env ] ] | $dir/node_modules/uglify-js/bin/uglifyjs -m)
echo $js > $dir/quill-image-drop-and-paste.min.js