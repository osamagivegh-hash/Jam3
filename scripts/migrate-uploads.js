const fs = require('fs');
const path = require('path');

const oldDir = path.join(__dirname, '..', 'frontend', 'public', 'uploads');
const newDir = path.join(__dirname, '..', 'backend', 'uploads');

function migrate() {
  if (!fs.existsSync(oldDir)) {
    console.log(`Old directory not found: ${oldDir}`);
    return;
  }

  const entries = fs.readdirSync(oldDir).filter((file) => {
    const fullPath = path.join(oldDir, file);
    const stat = fs.statSync(fullPath);
    return stat.isFile();
  });

  if (!entries.length) {
    fs.mkdirSync(newDir, { recursive: true });
    console.log('No images found to move.');
    return;
  }

  fs.mkdirSync(newDir, { recursive: true });

  let moved = 0;
  entries.forEach((file) => {
    const from = path.join(oldDir, file);
    const to = path.join(newDir, file);
    fs.renameSync(from, to);
    moved += 1;
  });

  console.log(`Moved ${moved} image${moved === 1 ? '' : 's'} to ${newDir}`);

  const destinationFiles = fs.readdirSync(newDir);
  if (destinationFiles.length >= moved) {
    fs.rmSync(oldDir, { recursive: true, force: true });
    console.log('Old directory deleted.');
  } else {
    console.log('Migration check failed: not deleting old directory.');
  }
}

migrate();
