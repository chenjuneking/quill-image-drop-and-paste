#!/bin/bash

dir="$(dirname "${BASH_SOURCE[0]}")/.."

# copy es6 source file
# cp $dir/src/QuillImageDropAndPaste.js $dir/index.js

# copy to react-demo
rm -rf $dir/example/react-demo/node_modules/quill-image-drop-and-paste/* \
  && cp -r $dir/src $dir/example/react-demo/node_modules/quill-image-drop-and-paste/ \
  && cp $dir/package.json $dir/example/react-demo/node_modules/quill-image-drop-and-paste/

# mkdir -p $dir/example/react-demo/node_modules/quill-image-drop-and-paste && cp $dir/src/QuillImageDropAndPaste.js $dir/example/react-demo/node_modules/quill-image-drop-and-paste/index.js

# copy to vue-demo
rm -rf $dir/example/vue-demo/node_modules/quill-image-drop-and-paste/* \
  && cp -r $dir/src $dir/example/vue-demo/node_modules/quill-image-drop-and-paste/ \
  && cp $dir/package.json $dir/example/vue-demo/node_modules/quill-image-drop-and-paste/
# mkdir -p $dir/example/vue-demo/node_modules/quill-image-drop-and-paste && cp $dir/src/QuillImageDropAndPaste.js $dir/example/vue-demo/node_modules/quill-image-drop-and-paste/index.js


# copy the template
cp $dir/src/es5-wrapper.js $dir/quill-image-drop-and-paste.min.js
# compile to es5
js=$(node $dir/node_modules/babel-cli/bin/babel.js $dir/src/QuillImageDropAndPaste.js --presets=es2015 | $dir/node_modules/uglify-js/bin/uglifyjs -m)
echo $js > tmp.js
# wrap
sed -i '' -e '/MINIFIED_JS/r tmp.js' -e '/MINIFIED_JS/d' $dir/quill-image-drop-and-paste.min.js
rm tmp.js