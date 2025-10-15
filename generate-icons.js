#!/usr/bin/env node

/**
 * Icon Generator Script for H2GO PWA
 * 
 * This script checks if icons exist and provides instructions for generating them.
 * For actual icon generation, you'll need ImageMagick or an online tool.
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ICONS_DIR = path.join(__dirname, 'icons');
const LOGO_PATH = path.join(__dirname, 'assets', 'logos', 'H2GO AQUA.png');

const REQUIRED_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

console.log('🎨 H2GO PWA Icon Generator\n');

// Check if icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
    console.log('✅ Created icons directory');
}

// Check if logo exists
if (!fs.existsSync(LOGO_PATH)) {
    console.log('❌ Logo not found at:', LOGO_PATH);
    console.log('Please ensure your logo is located at: assets/logos/H2GO AQUA.png\n');
    process.exit(1);
}

console.log('✅ Logo found at:', LOGO_PATH);

// Check which icons are missing
const missingIcons = REQUIRED_SIZES.filter(size => {
    const iconPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
    return !fs.existsSync(iconPath);
});

if (missingIcons.length === 0) {
    console.log('\n✅ All PWA icons are present!\n');
    process.exit(0);
}

console.log(`\n⚠️  Missing ${missingIcons.length} icon(s):`, missingIcons.map(s => `${s}x${s}`).join(', '));

// Try to detect if ImageMagick is installed
exec('which convert', (error, stdout, stderr) => {
    if (error) {
        console.log('\n📝 ImageMagick not found. Here are your options:\n');
        printManualInstructions();
    } else {
        console.log('\n✅ ImageMagick detected! Generating icons...\n');
        generateIconsWithImageMagick();
    }
});

function printManualInstructions() {
    console.log('Option 1: Use an online tool (Easiest)');
    console.log('  → Go to https://realfavicongenerator.net/');
    console.log('  → Upload your logo');
    console.log('  → Download and extract to ./icons/\n');
    
    console.log('Option 2: Install ImageMagick and run this script again');
    console.log('  macOS:   brew install imagemagick');
    console.log('  Ubuntu:  sudo apt-get install imagemagick');
    console.log('  Then run: node generate-icons.js\n');
    
    console.log('Option 3: Install PWA Asset Generator');
    console.log('  npm install -g pwa-asset-generator');
    console.log('  pwa-asset-generator "assets/logos/H2GO AQUA.png" icons/\n');
}

function generateIconsWithImageMagick() {
    let completed = 0;
    
    missingIcons.forEach(size => {
        const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
        const command = `convert "${LOGO_PATH}" -resize ${size}x${size} "${outputPath}"`;
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`❌ Failed to generate ${size}x${size} icon:`, error.message);
            } else {
                console.log(`✅ Generated icon-${size}x${size}.png`);
            }
            
            completed++;
            if (completed === missingIcons.length) {
                console.log('\n🎉 Icon generation complete!\n');
            }
        });
    });
}

