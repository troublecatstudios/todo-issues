import { CommentMarker, ITodo } from "../todo-parser";

type createFakeTodoParameters = Partial<ITodo>;

export const createFakeTodo = ({ type, hash, title, filePath, line, endLine }: createFakeTodoParameters = {}, label?: string): ITodo => {
  let expectedCode = [
    '',
    `// ${type}:${hash ? ' [' + hash + '] ' : ' '}${title}`,
    'function add() {',
    '  var i = 0;',
    '  for(var x of arguments) {'
  ].join('\r\n');
  const markerText = [type || 'TODO', (label ? `:${label}` : '')].join('');
  return {
    type: new CommentMarker(markerText),
    title: title || 'Found a bug',
    hash: hash || 'abcde',
    issue: '',
    filePath: filePath || './something.js',
    line: line || 2,
    endLine: endLine || 2,
    surroundingCode: expectedCode
  };
};
