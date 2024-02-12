import { TodoIssueMetadata, getTodoIssueMetadata } from './formatter';
import * as github from './github';

export type GitHubIssueWithMetadata = github.GitHubApiIssue & {
  metadata: TodoIssueMetadata
};

let issueLibrary:GitHubIssueWithMetadata[] = [];

export const loadAllIssues = async (): Promise<void> => {
  const issues = await github.getAllIssues();

  issueLibrary = [];
  for(const issue of issues) {
    const metadata = await getTodoIssueMetadata(issue.body || '');
    if (metadata != null) {
      issueLibrary.push({
        ...issue,
        metadata
      });
    }
  }
};

export const getAllIssues = ():GitHubIssueWithMetadata[] => {
  const libraryCopy:GitHubIssueWithMetadata[] = [];
  return libraryCopy.concat(issueLibrary);
};
