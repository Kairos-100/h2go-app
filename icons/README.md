# PWA Icons

This folder should contain the PWA icons for the H2GO app.

## Required Icon Sizes

You need to generate the following icon sizes from your logo:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

## How to Generate Icons

### Option 1: Online Tool (Easiest)
1. Go to https://realfavicongenerator.net/
2. Upload your logo (`assets/logos/H2GO AQUA.png`)
3. Configure settings for PWA
4. Download and extract icons to this folder

### Option 2: Using ImageMagick (Command Line)
If you have ImageMagick installed:

```bash
# Install ImageMagick first (if not installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Then run these commands from the project root:
convert "assets/logos/H2GO AQUA.png" -resize 72x72 icons/icon-72x72.png
convert "assets/logos/H2GO AQUA.png" -resize 96x96 icons/icon-96x96.png
convert "assets/logos/H2GO AQUA.png" -resize 128x128 icons/icon-128x128.png
convert "assets/logos/H2GO AQUA.png" -resize 144x144 icons/icon-144x144.png
convert "assets/logos/H2GO AQUA.png" -resize 152x152 icons/icon-152x152.png
convert "assets/logos/H2GO AQUA.png" -resize 192x192 icons/icon-192x192.png
convert "assets/logos/H2GO AQUA.png" -resize 384x384 icons/icon-384x384.png
convert "assets/logos/H2GO AQUA.png" -resize 512x512 icons/icon-512x512.png
```

### Option 3: Use PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator "assets/logos/H2GO AQUA.png" icons/ --manifest manifest.json
```

## Screenshot Images (Optional)

For better app store presentation, also add:
- `screenshot-mobile.png` (540x720px) - Mobile screenshot
- `screenshot-desktop.png` (1280x720px) - Desktop screenshot

## Temporary Placeholder

Until you generate the actual icons, placeholder icons will be used. Make sure to replace them before deploying to production!

