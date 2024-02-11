import { Moctokit } from '@kie/mock-github';
import { createFakeGitHubIssue } from './createFakeGitHubIssue';
import { getAllIssues } from '../github';

describe('getAllIssues', () => {
  const moctokit = new Moctokit();

  const fakeIssuesList = [
    createFakeGitHubIssue(),
    createFakeGitHubIssue({ number: 10 })
  ]

  it('should load all the issues from the github repository', async () => {
    moctokit.rest.issues
      .listForRepo()
      .reply({ status: 200, data: fakeIssuesList });
    const issues = await getAllIssues();
    expect(issues).toHaveLength(2);
  });
});
