const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const imports = new Set();
walkDir(srcDir, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g);
    if (matches) {
      matches.forEach(match => {
        const namedImports = match.match(/{([^}]+)}/)[1];
        namedImports.split(',').forEach(imp => {
          const name = imp.trim().split(' as ')[0];
          if (name) imports.add(name);
        });
      });
    }
  }
});

// Check which of these imports conflict with global window constructors
const conflicts = [];
const globals = [
  'Image', 'Text', 'Map', 'Set', 'Date', 'URL', 'File', 'Blob', 'History',
  'Screen', 'Location', 'Navigator', 'Crypto', 'Plugin', 'Event', 'Audio',
  'Video', 'Track', 'Option', 'Notification', 'Watch', 'Radio', 'Cloud', 'Monitor', 'Battery', 'Compass'
];

imports.forEach(imp => {
  if (globals.includes(imp)) {
    conflicts.push(imp);
  }
});

console.log("All imported lucide icons:");
console.log(Array.from(imports).join(', '));
console.log("\nPotential CONFLICTS with globals:");
console.log(conflicts.join(', '));
