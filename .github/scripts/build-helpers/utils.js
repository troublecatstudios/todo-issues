const fs = require('fs/promises');
const { existsSync, mkdirSync } = require('fs');
const path = require('path');

const rootDirectory = path.resolve(__dirname, './../../../');
const directories = {
  dist: path.resolve(rootDirectory, './dist'),
  src: path.resolve(rootDirectory, './src'),
  docs: path.resolve(rootDirectory, './docs'),
  root: rootDirectory,
};

const copyFile = async (from, to) => {
  const destinationDirectory = path.dirname(to);
  if (!existsSync(destinationDirectory)) {
    mkdirSync(destinationDirectory, { recursive: true });
  }
  if (!existsSync(from)) {
    throw `Unable to locate the source file '${from}'. Make sure this file exists!`
  }
  await fs.copyFile(from, to);
};

module.exports = {
  directories,
  cp: copyFile,
};
