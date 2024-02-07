const path = require('path');

['INPUT_MARKERS=TODO', 'INPUT_FILES=**'].forEach(e => {
  const [name, value] = e.split('=');
  process.env[name] = value;
});

const e2ePath = path.resolve(__dirname, './../../e2e');

(async () => {
  process.chdir(e2ePath);
  const input = require('./../../dist/index');
})();
