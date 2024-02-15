import * as github from '@actions/github';
import { PullRequestEvent, PushEvent } from '@octokit/webhooks-definitions/schema';

const context = github.context;

export type ActionContext = {
  headCommit: string,
  ref: string,
  isPullRequest: boolean,
  pullRequestNumber: number | undefined,
};

const defaultContext: ActionContext = {
  headCommit: '',
  ref: '',
  isPullRequest: false,
  pullRequestNumber: undefined,
};

export const getActionContext = (): ActionContext => {
  const ctx = Object.assign({}, defaultContext);
  if (context.eventName === 'push') {
    const payload = context.payload as PushEvent;
    ctx.headCommit = payload.head_commit?.id || '';
    ctx.ref = payload.ref;
    ctx.isPullRequest = false;
  }
  if (context.eventName === 'pull_request' || context.eventName === 'pull_request_target') {
    const payload = context.payload as PullRequestEvent;
    ctx.headCommit = payload.pull_request.head.sha;
    ctx.ref = payload.pull_request.head.ref;
    ctx.isPullRequest = true;
    ctx.pullRequestNumber = payload.pull_request.number;
  }
  return ctx;
};

export const getIssueUrl = (issueNumber: number): string => {
  return `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/issues/${issueNumber}`;
};
