import { formatIssueText, getTodoIssueMetadata } from '../formatter';
import { CommentMarker, ITodo } from '../../todo-parser';


describe('getTodoIssueMetadata', () => {
  it('should return null if the metadata comment does not exist', async () => {
    const issueText = `
This is a multiline string. It doesn't contain the comment markers.

This is the last line.`;
    const metadata = await getTodoIssueMetadata(issueText);
    expect(metadata).toBeNull();
  });

  it('should return null if the JSON cannot be parsed', async () => {
    const issueText = `
This is an issue with a bad marker comment.
<!--
//start todo-issue
{
  "hash": abcde,
  "filePath: "",
  "line": -1
}
//end todo-issue
-->

This is the last line.`;
    const metadata = await getTodoIssueMetadata(issueText);
    expect(metadata).toBeNull();
  });

  it('should return null if any of the metadata fields are missing', async () => {
    const issueText = `
This is an issue that is missing the filePath.
<!--
//start todo-issue
{
  "hash": "abcde",
  "line": -1
}
//end todo-issue
-->

This is the last line.`;
    const metadata = await getTodoIssueMetadata(issueText);
    expect(metadata).toBeNull();
  });

  it('should return the metadata if the comment is properly formatted', async () => {
    const issueText = `
This is an issue that is missing the filePath.
<!--
//start todo-issue
{
  "hash": "abcde",
  "filePath": "./something.js",
  "line": 10
}
//end todo-issue
-->

This is the last line.`;
    const metadata = await getTodoIssueMetadata(issueText);
    expect(metadata).not.toBeNull();
    expect(metadata?.filePath).toBe('./something.js');
    expect(metadata?.hash).toBe('abcde');
    expect(metadata?.line).toBe(10);
  });
});

describe('formatIssueText', () => {
  it('should exist', async () => {
    expect(formatIssueText).toBeDefined();
  });

  it('should accept a ITodo', async () => {
    var todo: ITodo = {
      line: 10,
      hash: '',
      title: '',
      issue: '',
      type: new CommentMarker('TODO'),
      filePath: '',
      endLine: 11,
      surroundingCode: ''
    };
    let text = await formatIssueText(todo);
    expect(text).not.toBe('');
  });

  it('should include a special comment block in the issue body', async () => {
    const todo: ITodo = {
      line: 10,
      hash: '',
      title: '',
      issue: '',
      type: new CommentMarker('TODO'),
      filePath: 'something.js',
      endLine: 11,
      surroundingCode: 'blah, blah'
    };
    const body = await formatIssueText(todo);
    expect(body).toContain(`<!-- todo-issue comment block, do not remove`);
  });

  it('should include the hash, filePath and line number in the special comment block', async () => {
    const todo: ITodo = {
      line: 10,
      hash: 'abcde',
      title: '',
      issue: '',
      type: new CommentMarker('TODO'),
      filePath: 'something.js',
      endLine: 11,
      surroundingCode: 'blah, blah'
    };
    const expectedJson = {
      hash: todo.hash,
      filePath: todo.filePath,
      line: todo.line,
    };
    const body = await formatIssueText(todo);
    expect(body).toContain(JSON.stringify(expectedJson, null, 2));
  });

  it('should include the surrounding code in the issue body', async () => {
    var todo: ITodo = {
      line: 10,
      hash: '',
      title: '',
      issue: '',
      type: new CommentMarker('TODO'),
      filePath: 'something.js',
      endLine: 11,
      surroundingCode: 'blah, blah'
    };
    let text = await formatIssueText(todo);
    expect(text).toContain('```js\nblah, blah\n```');
  });

  // it should return a github issue payload { reference?, title, body }
});
