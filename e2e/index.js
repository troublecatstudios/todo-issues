/*
This runs our end-to-end tests
*/
const path = require('path');
const { getFiles } = require('./../src/file-provider');
const { getCommentsByMarker } = require('./../src/todo-parser');
const { reconcileIssues } = require('./../src/issues/reconciler');
const tests = [
  javascriptProject('TODO')
];

(async function main() {
  for(var test of tests) {
    await test();
  }
})();

const javascriptProject = (...markers) => {
  return async function() {
    let files = await getFiles(path.resolve(__dirname, './javascriptProject'), '**/*.js');
    let comments = [];
    for(let file of files) {
      for(let marker of markers) {
        let parsedComments = await getCommentsByMarker(marker, file);
        comments = comments.concat(parsedComments);
      }
    }
    await reconcileIssues(comments);
  };
};
