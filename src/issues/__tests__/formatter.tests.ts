import { formatIssueText, getTodoIssueMetadata } from '../formatter';
import { CommentMarker, ITodo } from '../../todo-parser';
import { issueBodyWithInvalidJSON, issueBodyWithMissingMetadataFields, issueBodyWithNoMetadata, issueBodyWithValidMetadata } from './createFakeGitHubIssue';


describe('getTodoIssueMetadata', () => {
  it('should return null if the metadata comment does not exist', async () => {
    const metadata = await getTodoIssueMetadata(issueBodyWithNoMetadata);
    expect(metadata).toBeNull();
  });

  it('should return null if the JSON cannot be parsed', async () => {
    const metadata = await getTodoIssueMetadata(issueBodyWithInvalidJSON);
    expect(metadata).toBeNull();
  });

  it('should return null if any of the metadata fields are missing', async () => {
    const metadata = await getTodoIssueMetadata(issueBodyWithMissingMetadataFields);
    expect(metadata).toBeNull();
  });

  it('should return the metadata if the comment is properly formatted', async () => {
    const metadata = await getTodoIssueMetadata(issueBodyWithValidMetadata);
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
