import { Moctokit } from "@kie/mock-github";
import { createFakeGitHubIssue, issueBodyWithInvalidJSON, issueBodyWithValidMetadata } from "./createFakeGitHubIssue";
import { clearRepositoryContext, setRepositoryContext } from "../../__mocks__/repository-context";
import { getAllIssues, loadAllIssues } from './../issue-library';
import { loadavg } from "os";

describe('issue-library', () => {
  const moctokit = new Moctokit();
  const fakeIssuesList = [
    createFakeGitHubIssue({ body: issueBodyWithInvalidJSON }),
    createFakeGitHubIssue({ number: 10, body: issueBodyWithValidMetadata })
  ];

  beforeEach(() => {
    setRepositoryContext({
      repositoryName: 'todo-issues',
      repositoryOwner: 'troublecatstudios'
    });
    moctokit.rest.issues
      .listForRepo()
      .reply({ status: 200, data: fakeIssuesList });
  });

  afterEach(() => {
    clearRepositoryContext();
    moctokit.cleanAll();
  });


  describe('loadAllIssues', () => {
    it('should only load the issues that have valid metadata', async () => {
      await loadAllIssues();
      const issues = getAllIssues();
      expect(issues).toHaveLength(1);
    });

    it('should add the metadata to each issue', async () => {
      await loadAllIssues();
      const issues = getAllIssues();
      const firstIssue = issues[0];
      expect(firstIssue.metadata).not.toBeNull();
      expect(firstIssue.metadata.line).toBe(10);
      expect(firstIssue.metadata.hash).toBe('abcde');
      expect(firstIssue.metadata.filePath).toBe('./something.js');
    });
  })
});
