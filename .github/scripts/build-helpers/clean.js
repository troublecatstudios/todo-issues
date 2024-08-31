const fs = require('fs/promises');
const path = require('path');
const { directories } = require('./utils');

const thingsToDelete = ['./dist'];

async function exists(f) {
  try {
    await fs.promises.stat(f);
    return true;
  } catch {
    return false;
  }
}

(async function() {
  for(const thing of thingsToDelete) {
    process.stdout.write(`[clean] deleting ${thing}...`);
    const directory = path.resolve(directories.root, thing);
    if (await exists(directory)) {
      await fs.rm(directory, { recursive: true });
    }

    process.stdout.write(`done!\n`);
  }
})();
