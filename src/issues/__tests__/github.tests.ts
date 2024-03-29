import { Moctokit } from '@kie/mock-github';
import { createFakeGitHubIssue } from './createFakeGitHubIssue';
import { getAllIssues } from '../github';
import { clearRepositoryContext, setRepositoryContext } from '../../__mocks__/repository-context';

describe('getAllIssues', () => {
  const moctokit = new Moctokit();

  const fakeIssuesList = [
    createFakeGitHubIssue(),
    createFakeGitHubIssue({ number: 10, labels: ['bug'] })
  ];

  afterEach(() => {
    clearRepositoryContext();
    moctokit.cleanAll();
  });

  it('should load all the issues from the github repository', async () => {
    setRepositoryContext({ repositoryOwner: 'todo-issues', repositoryName: 'troublecatstudios' });
    moctokit.rest.issues
      .listForRepo()
      .reply({ status: 200, data: fakeIssuesList });
    const issues = await getAllIssues();
    expect(issues).toHaveLength(2);
  });

  it('should include labels for each issue', async () => {
    setRepositoryContext({ repositoryOwner: 'todo-issues', repositoryName: 'troublecatstudios' });
    moctokit.rest.issues
      .listForRepo()
      .reply({ status: 200, data: fakeIssuesList });
    const issues = await getAllIssues();
    expect(issues[0]).toHaveProperty('labels', []);
    expect(issues[1]).toHaveProperty('labels', ['bug']);
  });
});
