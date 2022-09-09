/*
  Todo-Issues CLI
  -----------------------

  Mostly used for e2e testing.
*/
const pkg = require('./../package.json');
const fileProvider = require('./../lib/file-provider');
const parser = require('./../lib/todo-parser');
const reconciler = require('./../lib/issues/reconciler');

process.stdout.write(`Todo-Issues CLI v${pkg.version}\n`);
process.stdout.write(`-------------------------------\n`);

// setup our args with their defaults
const args = process.argv.slice(2);
let [markers, files] = args;
markers ||= `
TODO
FIXME: bug
HACK
BUG: bug
OPTIMIZE
NOTE
`;
files ||= `
**
!.git/**
!node_modules/**
`;

// build our context

let ctx = {
  workingDirectory: process.cwd(),
  repositoryNodeId: undefined,
  repositoryOwner: 'testOwner',
  repositoryName: 'testRepository',
  defaultBranch: 'main',
};

console.log(markers, files, ctx);

(async function main() {
  let fileList = await fileProvider.getFiles(ctx.workingDirectory, files);
  console.log(fileList);
  let todos = [];
  for(let file of fileList) {
    for(let marker of markers.split('\n')) {
      let t = await parser.getCommentsByMarker(marker, file);
      todos = todos.concat(t);
    }
  }

  await reconciler.reconcileIssues(todos, { dryRun: true });
})();
