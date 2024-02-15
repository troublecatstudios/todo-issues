import {existsSync, readFileSync} from 'fs';



export type RepositoryContext = {
  workingDirectory: string,
  repositoryNodeId: string | undefined,
  repositoryOwner: string,
  repositoryName: string,
  defaultBranch: string | undefined,
};


export const getRepositoryContext = (): RepositoryContext => {
  let eventJson = '';
  if (
    process.env.GITHUB_EVENT_PATH &&
    existsSync(process.env.GITHUB_EVENT_PATH)
  ) {
    eventJson = readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');
  }
  const event = eventJson ? JSON.parse(eventJson) : null;

  const workingDirectory = process.env.GITHUB_WORKSPACE || '';
  const repositoryNodeId = process.env.GITHUB_REPO_NODE_ID || (event && event.repository && event.repository.node_id);
  const repositoryOwner = process.env.GITHUB_REPO_OWNER || (event && event.repository && event.repository.full_name.split('/')[0]);
  const repositoryName = process.env.GITHUB_REPO_NAME || (event && event.repository && event.repository.full_name.split('/')[1]);
  const defaultBranch = process.env.GITHUB_REPO_DEFAULT_BRANCH || (event && event.repository && event.repository.default_branch);
  return {
    workingDirectory,
    repositoryNodeId,
    repositoryOwner,
    repositoryName,
    defaultBranch
  };
};
