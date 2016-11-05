#!/bin/bash
FILES=*.png

echo '# myGallery'
echo 'A place where I want to throw my screenshots'
echo ''

for f in $FILES
do
  fname=$(basename "$f")
  echo "[![Foo](thumbs/${fname%.*}.jpg)]https://github.com/ericoporto/public_html/raw/gh-pages/screenshots/fgmkJsEngine_v0_5_0/$fname)"
  echo ''
done
