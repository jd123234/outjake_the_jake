const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Icon sizes needed for Apple Touch Icons
const iconSizes = [
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'apple-touch-icon-152x152.png', size: 152 },
  { name: 'apple-touch-icon-120x120.png', size: 120 },
  { name: 'apple-touch-icon-76x76.png', size: 76 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-16x16.png', size: 16 }
];

// Also generate favicon.ico for src/app/
const faviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');

async function generateIcons() {
  const inputFile = path.join(__dirname, 'public', 'logo.png');
  
  // Check if source logo exists
  if (!fs.existsSync(inputFile)) {
    console.error('❌ Please save your logo as /public/logo.png first!');
    return;
  }

  console.log('🚀 Generating Apple Touch Icons...');

  try {
    for (const icon of iconSizes) {
      const outputPath = path.join(__dirname, 'public', icon.name);
      
      await sharp(inputFile)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate favicon.ico for src/app/
    await sharp(inputFile)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    
    // Convert PNG to ICO (or just copy the PNG as ICO)
    await sharp(inputFile)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(faviconPath);
    
    console.log(`✅ Generated favicon.ico (32x32)`);
    
    console.log('🎉 All icons generated successfully!');
    console.log('📱 Your app is now ready for iPhone home screen!');
    
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('💡 Make sure you have installed sharp: npm install sharp');
  }
}

generateIcons();
