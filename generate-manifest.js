// Scans /photos for event subfolders and writes manifest.json.
// Folder naming convention: photos/YYYY-MM-DD-Event-Name/*.jpg
// (the date prefix is optional — folders without one still work, they just sort last)
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, 'photos');
const OUTPUT_FILE = path.join(__dirname, 'manifest.json');
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

function titleFromFolder(folder) {
  const withoutDate = folder.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return withoutDate.replace(/[-_]+/g, ' ').trim();
}

function dateFromFolder(folder) {
  const match = folder.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : null;
}

function main() {
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.warn('No photos/ folder found — writing empty manifest.');
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([], null, 2));
    return;
  }

  const entries = fs.readdirSync(PHOTOS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory());

  const events = entries.map((entry) => {
    const folder = entry.name;
    const folderPath = path.join(PHOTOS_DIR, folder);
    const files = fs.readdirSync(folderPath)
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .sort();

    return {
      id: folder,
      title: titleFromFolder(folder),
      date: dateFromFolder(folder),
      photos: files.map((f) => ({
        src: `photos/${folder}/${f}`,
        alt: `${titleFromFolder(folder)} — ${f}`,
      })),
    };
  })
  // only keep events that actually have photos in them
  .filter((event) => event.photos.length > 0)
  // newest first; events without a date prefix sort to the bottom
  .sort((a, b) => (b.date || '0000-00-00').localeCompare(a.date || '0000-00-00'));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(events, null, 2));
  console.log(`Wrote manifest.json with ${events.length} event(s).`);
}

main();
