import { formatIssueText } from '../formatter';
import { ITodo } from '../../todo-parser';

describe('issues/text-formatter', () => {
  it('should exist', async () => {
    expect(formatIssueText).toBeDefined();
  });

  it('should accept a ITodo', async () => {
    var todo: ITodo = {
      line: 10,
      hash: '',
      title: '',
      issue: '',
      type: 'TODO',
      filePath: '',
      endLine: 11,
      surroundingCode: ''
    };
    let text = await formatIssueText(todo);
    expect(text).not.toBe('');
  });

  it('should include the surrounding code in the issue body', async () => {
    var todo: ITodo = {
      line: 10,
      hash: '',
      title: '',
      issue: '',
      type: 'TODO',
      filePath: 'something.js',
      endLine: 11,
      surroundingCode: 'blah, blah'
    };
    let text = await formatIssueText(todo);
    expect(text).toContain('```js\nblah, blah\n```');
  });

  // it should return a github issue payload { reference?, title, body }
});
