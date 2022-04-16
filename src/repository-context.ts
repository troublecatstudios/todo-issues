import {existsSync, readFileSync} from 'fs';

let eventJson = '';
if (
  process.env.GITHUB_EVENT_PATH &&
  existsSync(process.env.GITHUB_EVENT_PATH)
) {
  eventJson = readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');
}

export type RepositoryContextType = {
  workingDirectory: string,
  repositoryNodeId: string | undefined,
  repositoryOwner: string,
  repositoryName: string,
  defaultBranch: string | undefined,
};

const event = eventJson ? JSON.parse(eventJson) : null;
const context:RepositoryContextType = {
  workingDirectory: process.env.GITHUB_WORKSPACE || '',
  repositoryNodeId:
    process.env.GITHUB_REPO_NODE_ID ||
    (event && event.repository && event.repository.node_id),
  repositoryOwner:
    process.env.GITHUB_REPO_OWNER ||
    (event && event.repository && event.repository.full_name.split('/')[0]),
  repositoryName:
    process.env.GITHUB_REPO_NAME ||
    (event && event.repository && event.repository.full_name.split('/')[1]),
  defaultBranch:
    process.env.GITHUB_REPO_DEFAULT_BRANCH ||
    (event && event.repository && event.repository.default_branch),
};

export default context;
