const fs = require('fs/promises');
const path = require('path');
const { directories } = require('./utils');

const thingsToDelete = ['./dist'];

(async function() {
  for(const thing of thingsToDelete) {
    process.stdout.write(`[clean] deleting ${thing}...`);
    await fs.rm(path.resolve(directories.root, thing), { recursive: true });
    process.stdout.write(`done!\n`);
  }
})();
