const path = require('path');
const { directories, cp } = require('./utils');

const linguistPath = path.resolve(directories.root, './node_modules/linguist/lib/linguist/languages.yml');

const filesToCopy = [
  [path.resolve(directories.src, './issues/.template.eta'), path.resolve(directories.dist, '.template.eta')],
  [linguistPath, path.resolve(directories.dist, './languages.yml')],
  [linguistPath, path.resolve(directories.src, './issues/languages.yml')]
];

(async function() {
  for(const set of filesToCopy) {
    const [key, value] = set;
    process.stdout.write(`[copy] copying ${key} to ${value}...`);
    await cp(key, value);
    process.stdout.write(`done!\n`);
  }
})();
