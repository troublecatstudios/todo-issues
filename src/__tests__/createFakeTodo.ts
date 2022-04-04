import { CommentMarker, ITodo } from "../todo-parser";

export const createFakeTodo = (type: CommentMarker, reference: string, title: string, filePath: string): ITodo => {
  let expectedCode = [
    '',
    `// ${type}:${reference ? ' ' + reference + ' ' : ' '}${title}`,
    'function add() {',
    '  var i = 0;',
    '  for(var x of arguments) {'
  ].join('\r\n');
  return {
    type,
    title,
    reference,
    filePath,
    line: 10,
    endLine: 10,
    surroundingCode: expectedCode
  }
};
