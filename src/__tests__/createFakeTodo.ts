import { CommentMarker, ITodo } from "../todo-parser";

export const createFakeTodo = (type: string, hash: string, title: string, filePath: string): ITodo => {
  let expectedCode = [
    '',
    `// ${type}:${hash ? ' [' + hash + '] ' : ' '}${title}`,
    'function add() {',
    '  var i = 0;',
    '  for(var x of arguments) {'
  ].join('\r\n');
  return {
    type: new CommentMarker(type),
    title,
    hash,
    issue: '',
    filePath,
    line: 2,
    endLine: 2,
    surroundingCode: expectedCode
  }
};
