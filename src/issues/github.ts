import {Octokit} from '@octokit/rest';
import {Endpoints} from '@octokit/types';
import {retry} from '@octokit/plugin-retry';
import {throttling} from '@octokit/plugin-throttling';
import RepositoryContext from './../repository-context';

type TaskInformation = {
  title: string;
  body: string;
};

type IssuesListResponse =
  Endpoints['GET /repos/{owner}/{repo}/issues']['response']['data'];

const Octo = Octokit.plugin(retry, throttling);
const octokit = new Octo({
  auth: `token ${process.env.GITHUB_TOKEN}`,
  throttle: {
    onRateLimit: (retryAfter: any, options: any) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`,
      );

      if (options.request.retryCount === 0) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onAbuseLimit: (retryAfter: any, options: any) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`,
      );
    },
  },
  retry: {
    doNotRetry: ['429'],
  },
});

export async function getAllIssues(): Promise<IssuesListResponse> {
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: RepositoryContext.repositoryOwner,
    repo: RepositoryContext.repositoryName,
  });

  const notPrs = issues.filter(i => !i.pull_request);
  return notPrs;
}

export async function createIssue(
  information: TaskInformation,
): Promise<string | null> {
  const result = await octokit.rest.issues.create({
    owner: RepositoryContext.repositoryOwner,
    repo: RepositoryContext.repositoryName,
    title: information.title,
    body: information.body,
  });
  return result.data.number ? `#${result.data.number}` : null;
}

export async function completeIssue(taskReference: string): Promise<void> {
  const result = await octokit.issues.update({
    owner: RepositoryContext.repositoryOwner,
    repo: RepositoryContext.repositoryName,
    issue_number: +taskReference.substr(1),
    state: 'closed',
  });
}

export async function updateIssue(
  taskReference: string,
  information: TaskInformation,
): Promise<void> {
  const result = await octokit.issues.update({
    owner: RepositoryContext.repositoryOwner,
    repo: RepositoryContext.repositoryName,
    issue_number: +taskReference.substr(1),
    title: information.title,
    body: information.body,
  });
}
