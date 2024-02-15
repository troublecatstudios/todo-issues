import { TodoIssueMetadata } from "../formatter";
import { GitHubApiIssue } from "../github";
import { GitHubIssueWithMetadata } from "../issue-library";

const defaultNumber = 1347;
type fakeIssueParameters = Partial<GitHubApiIssue>;
type fakeMetadataParameters = Partial<TodoIssueMetadata>;
export const createFakeGitHubIssue = ({url, number, state, title, body, pull_request, labels }: fakeIssueParameters = {}): GitHubApiIssue => {
  return {
    "url": url || `https://api.github.com/repos/troublecatstudios/Hello-World/issues/${number || defaultNumber}`,
    "number": number || defaultNumber,
    "state": state || `open`,
    "title": title || `Found a bug`,
    "body": body || `I'm having a problem with this.`,
    "pull_request": pull_request || undefined,
    "labels": labels || []
  };
};

export const createFakeGitHubIssueWithMetadata = ({url, number, state, title, body, pull_request }: fakeIssueParameters = {}, { hash, filePath, line }: fakeMetadataParameters = {}): GitHubIssueWithMetadata => {
 return {
  ...createFakeGitHubIssue({url, number, state, title, body, pull_request }),
  metadata: {
    hash: hash || 'abcde',
    filePath: filePath || './something.js',
    line: line || 100
  }
 };
};

export const issueBodyWithNoMetadata = `
This is a multiline string. It doesn't contain the comment markers.

This is the last line.`;

export const issueBodyWithInvalidJSON = `
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

export const issueBodyWithMissingMetadataFields = `
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

export const issueBodyWithValidMetadata = `
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

export const issueBodyWithValidMetadata2 = `
This is an issue that is missing the filePath.
<!--
//start todo-issue
{
  "hash": "abcdef",
  "filePath": "./something2.js",
  "line": 100
}
//end todo-issue
-->

This is the last line.`;
