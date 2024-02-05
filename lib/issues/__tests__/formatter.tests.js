"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const formatter_1 = require("../formatter");
const todo_parser_1 = require("../../todo-parser");
describe('issues/text-formatter', () => {
    it('should exist', async () => {
        expect(formatter_1.formatIssueText).toBeDefined();
    });
    it('should accept a ITodo', async () => {
        var todo = {
            line: 10,
            hash: '',
            title: '',
            issue: '',
            type: new todo_parser_1.CommentMarker('TODO'),
            filePath: '',
            endLine: 11,
            surroundingCode: ''
        };
        let text = await (0, formatter_1.formatIssueText)(todo);
        expect(text).not.toBe('');
    });
    it('should include the surrounding code in the issue body', async () => {
        var todo = {
            line: 10,
            hash: '',
            title: '',
            issue: '',
            type: new todo_parser_1.CommentMarker('TODO'),
            filePath: 'something.js',
            endLine: 11,
            surroundingCode: 'blah, blah'
        };
        let text = await (0, formatter_1.formatIssueText)(todo);
        expect(text).toContain('```js\nblah, blah\n```');
    });
    // it should return a github issue payload { reference?, title, body }
});
//# sourceMappingURL=formatter.tests.js.map