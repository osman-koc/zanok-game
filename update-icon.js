// Script to update app icon
// Run this to download and replace the app icon files

const fs = require('fs');
const https = require('https');

const iconUrl = 'https://r2-pub.rork.com/generated-images/0a4efe91-da95-4a06-80fb-5e3baf127ec1.png';

const iconPaths = [
  './assets/images/icon.png',
  './assets/images/adaptive-icon.png', 
  './assets/images/splash-icon.png',
  './assets/images/favicon.png'
];

function downloadIcon(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filepath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

async function updateAllIcons() {
  console.log('Updating app icons...');
  
  for (const iconPath of iconPaths) {
    try {
      await downloadIcon(iconUrl, iconPath);
    } catch (error) {
      console.error(`Failed to update ${iconPath}:`, error);
    }
  }
  
  console.log('Icon update complete!');
}

updateAllIcons();