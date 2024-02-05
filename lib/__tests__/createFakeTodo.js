"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeTodo = void 0;
const todo_parser_1 = require("../todo-parser");
const createFakeTodo = (type, hash, title, filePath, label) => {
    let expectedCode = [
        '',
        `// ${type}:${hash ? ' [' + hash + '] ' : ' '}${title}`,
        'function add() {',
        '  var i = 0;',
        '  for(var x of arguments) {'
    ].join('\r\n');
    const markerText = [type, (label ? `:${label}` : '')].join('');
    return {
        type: new todo_parser_1.CommentMarker(markerText),
        title,
        hash,
        issue: '',
        filePath,
        line: 2,
        endLine: 2,
        surroundingCode: expectedCode
    };
};
exports.createFakeTodo = createFakeTodo;
//# sourceMappingURL=createFakeTodo.js.map