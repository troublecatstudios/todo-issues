import * as github from '@actions/github';
import * as core from '@actions/core';
import { getRepositoryContext } from './../repository-context';
import { error, info, warn } from '../logger';
import { RestEndpointMethodTypes } from '@octokit/rest';

type TaskInformation = {
  title: string;
  body: string;
  labels?: string[];
};

export type GitHubApiIssue = Pick<RestEndpointMethodTypes["issues"]["get"]["response"]["data"], "number" | "title" | "state" | "body" | "url" | "pull_request">;

const token = core.getInput('githubToken', { required: true });
const octokit = github.getOctokit(token);

export async function getAllIssues(): Promise<GitHubApiIssue[]> {
  const ctx = getRepositoryContext();
  const issues = await octokit.rest.issues.listForRepo({
    owner: ctx.repositoryOwner,
    repo: ctx.repositoryName,
  });

  const notPrs = issues.data.filter(i => !i.pull_request);
  return notPrs;
};

export async function createIssue(
  information: TaskInformation,
): Promise<number> {
  try {
    const ctx = getRepositoryContext();
    const result = await octokit.rest.issues.create({
      owner: ctx.repositoryOwner,
      repo: ctx.repositoryName,
      title: information.title,
      body: information.body,
    });
    return result.data.number;
  } catch (e) {
    if (typeof e === "string") {
      error(`error trying to create issue. ${e}`, { title: information.title, body: information.body });
    } else if (e instanceof Error) {
      error(`error trying to create issue. ${e}`, { title: information.title, body: information.body });
    }
    throw e;
  }
};

export async function completeIssue(issueNumber: number): Promise<void> {
  try {
    const ctx = getRepositoryContext();
    const result = await octokit.rest.issues.update({
      owner: ctx.repositoryOwner,
      repo: ctx.repositoryName,
      issue_number: issueNumber,
      state: 'closed',
    });
  } catch (e) {
    if (typeof e === "string") {
      error(`error trying to complete issue. ${e}`, { issueNumber });
    } else if (e instanceof Error) {
      error(`error trying to complete issue. ${e}`, { issueNumber });
    }
  }
};

export async function updateIssue(
  issueNumber: number,
  information: TaskInformation,
): Promise<boolean> {
  try {
    const ctx = getRepositoryContext();
    const result = await octokit.rest.issues.update({
      owner: ctx.repositoryOwner,
      repo: ctx.repositoryName,
      issue_number: issueNumber,
      title: information.title,
      body: information.body,
    });
    return true;
  } catch (e) {
    if (typeof e === "string") {
      error(`error trying to complete issue. ${e}`, { issueNumber, title: information.title, body: information.body });
    } else if (e instanceof Error) {
      error(`error trying to complete issue. ${e}`, { issueNumber, title: information.title, body: information.body });
    }
    return false;
  }
};
