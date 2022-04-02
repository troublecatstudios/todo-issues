import { formatIssueText } from '../../issues/formatter';
import { ITodo } from '../../todo-parser';

describe('issues/text-formatter', () => {
  it('should exist', async () => {
    expect(formatIssueText).toBeDefined();
  });

  it('should accept a ITodo', async () => {
    var todo: ITodo = {
      line: 10,
      reference: '',
      title: '',
      type: 'TODO',
      filePath: '',
      endLine: 11,
      surroundingCode: ''
    };
    expect(formatIssueText(todo)).toBe('');
  });

  // it should return a github issue payload { reference?, title, body }
});
