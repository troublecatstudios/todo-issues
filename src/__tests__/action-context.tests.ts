import { setGitHubContext } from "../__mocks__/@actions/github";
import { getActionContext, getIssueUrl } from "../action-context";

describe('action-context', () => {
  describe('getIssueUrl', () => {
    it('should return the full URL to the given issue number', async () => {
      setGitHubContext({
        serverUrl: 'http://fakegithub.com',
        repo: {
          owner: 'troublecatstudios',
          repo: 'todo-issues'
        }
      });
      const url = getIssueUrl(123);
      expect(url).toBe('http://fakegithub.com/troublecatstudios/todo-issues/issues/123');
    });
  });
  describe('getActionContext', () => {
    it('should get the head commit and ref from a push event', async () => {
      setGitHubContext({
        eventName: 'push',
        payload: {
          head_commit: {
            id: 'abcde'
          },
          ref: 'refs/head/my-branch'
        }
      });
      const context = getActionContext();
      expect(context).toHaveProperty('headCommit', 'abcde');
      expect(context).toHaveProperty('ref', 'refs/head/my-branch');
      expect(context).toHaveProperty('isPullRequest', false);
      expect(context).toHaveProperty('pullRequestNumber', undefined);
    });

    it('should get the head commit and ref from a pull_request event', async () => {
      setGitHubContext({
        eventName: 'pull_request',
        payload: {
          pull_request: {
            head: {
              sha: 'abcde',
              ref: 'refs/head/my-branch'
            },
            number: 123
          }
        }
      });
      const context = getActionContext();
      expect(context).toHaveProperty('headCommit', 'abcde');
      expect(context).toHaveProperty('ref', 'refs/head/my-branch');
      expect(context).toHaveProperty('isPullRequest', true);
      expect(context).toHaveProperty('pullRequestNumber', 123);
    });

    it('should get the head commit and ref from a pull_request_target event', async () => {
      setGitHubContext({
        eventName: 'pull_request_target',
        payload: {
          pull_request: {
            head: {
              sha: 'abcde',
              ref: 'refs/head/my-branch'
            },
            number: 123
          }
        }
      });
      const context = getActionContext();
      expect(context).toHaveProperty('headCommit', 'abcde');
      expect(context).toHaveProperty('ref', 'refs/head/my-branch');
      expect(context).toHaveProperty('isPullRequest', true);
      expect(context).toHaveProperty('pullRequestNumber', 123);
    });
  });
});
