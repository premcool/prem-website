# Favicon Generation Instructions

To generate the required favicon files from the SVG logo, you can use online tools or ImageMagick:

## Required Files:
- favicon.ico (16x16, 32x32, 48x48 sizes)
- icon-16x16.png
- icon-32x32.png
- apple-touch-icon.png (180x180)
- icon-192x192.png
- icon-512x512.png

## Online Tools:
1. https://realfavicongenerator.net/ - Upload favicon.svg and generate all formats
2. https://favicon.io/ - Convert SVG to all formats

## Using ImageMagick (if installed):
```bash
# Generate PNG icons
convert favicon.svg -resize 16x16 icon-16x16.png
convert favicon.svg -resize 32x32 icon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 icon-192x192.png
convert favicon.svg -resize 512x512 icon-512x512.png

# Generate ICO file (requires icotool or online converter)
```

## Quick Solution:
For now, you can use the SVG favicon directly. Modern browsers support SVG favicons.
The site.webmanifest references PNG files that should be generated from the SVG.
