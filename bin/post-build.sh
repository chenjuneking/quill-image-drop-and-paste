#!/bin/bash

VUE_EXAMPLE_PACKAGE_DIR=example/vue-demo/node_modules/quill-image-drop-and-paste
REACT_EXAMPLE_PACKAGE_DIR=example/react-demo/node_modules/quill-image-drop-and-paste
SCRIPT_EXAMPLE_DIR=example/script-demo
DIST=dist

# copy bundle to vue demo
if [ ! -d "$VUE_EXAMPLE_PACKAGE_DIR/dist" ]; then
  mkdir -p $VUE_EXAMPLE_PACKAGE_DIR/dist
fi
cp package.json $VUE_EXAMPLE_PACKAGE_DIR && cp -R $DIST/* $VUE_EXAMPLE_PACKAGE_DIR/dist

# copy bundle to react demo
if [ ! -d "$REACT_EXAMPLE_PACKAGE_DIR/dist" ]; then
  mkdir -p $REACT_EXAMPLE_PACKAGE_DIR/dist
fi
cp package.json $REACT_EXAMPLE_PACKAGE_DIR && cp -R $DIST/* $REACT_EXAMPLE_PACKAGE_DIR/dist
