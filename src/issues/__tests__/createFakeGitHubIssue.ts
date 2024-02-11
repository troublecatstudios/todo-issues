import { GitHubApiIssue } from "../github";

const defaultNumber = 1347;
type fakeIssueParameters = Partial<GitHubApiIssue>;
export const createFakeGitHubIssue = ({url, number, state, title, body }: fakeIssueParameters = {}): GitHubApiIssue => {
  return {
    "url": url || `https://api.github.com/repos/troublecatstudios/Hello-World/issues/${number || defaultNumber}`,
    "number": number || defaultNumber,
    "state": state || `open`,
    "title": title || `Found a bug`,
    "body": body || `I'm having a problem with this.`,
  };
};
