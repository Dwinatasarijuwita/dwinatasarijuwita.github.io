#!/bin/sh
# Creates small thumbnails for the Photos app strip (macOS: uses the built-in sips tool).
# Run after adding or replacing photos in src/assets/photos: npm run photos:thumbs
set -e
cd "$(dirname "$0")/../src/assets/photos"
rm -rf thumbs
mkdir thumbs
for photo in *.jpeg *.jpg *.png; do
  [ -f "$photo" ] || continue
  sips -Z 320 -s format jpeg -s formatOptions 70 "$photo" --out "thumbs/${photo%.*}.jpg" >/dev/null
done
echo "Thumbnails: $(ls thumbs | wc -l | tr -d ' ') in src/assets/photos/thumbs"
