#!/bin/bash
mogrify -resize 384x216 -background white -gravity center -extent 384x216 -format jpg -quality 75 -path thumbs *.png
