const path = require('path');
const { directories, cp } = require('./utils');

const filesToCopy = {
  './src/issues/.template.eta': './dist/issues/.template.eta'
};

(async function() {
  for(const key of Object.keys(filesToCopy)) {
    const value = filesToCopy[key];
    process.stdout.write(`[copy] copying ${key} to ${value}...`);
    await cp(path.resolve(directories.root, key), path.resolve(directories.root, value));
    process.stdout.write(`done!\n`);
  }
})();
