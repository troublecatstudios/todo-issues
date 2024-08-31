import { RepositoryContext } from "../repository-context";

export type SetRepositoryContextParams = Partial<RepositoryContext>;

export const setRepositoryContext = ({ workingDirectory, defaultBranch, repositoryName, repositoryNodeId, repositoryOwner }: SetRepositoryContextParams = {}): RepositoryContext => {
  process.env.GITHUB_WORKSPACE = workingDirectory || '';
  process.env.GITHUB_REPO_NODE_ID = repositoryNodeId || '';
  process.env.GITHUB_REPO_OWNER = repositoryOwner || '';
  process.env.GITHUB_REPO_NAME = repositoryName || '';
  process.env.GITHUB_REPO_DEFAULT_BRANCH = defaultBranch || '';
  return {
    workingDirectory: workingDirectory || '',
    repositoryNodeId: repositoryNodeId || '',
    repositoryOwner: repositoryOwner || '',
    repositoryName: repositoryName || '',
    defaultBranch: defaultBranch || '',
  };
};

export const clearRepositoryContext = () => {
  process.env.GITHUB_WORKSPACE = '';
  process.env.GITHUB_REPO_NODE_ID = '';
  process.env.GITHUB_REPO_OWNER = '';
  process.env.GITHUB_REPO_NAME = '';
  process.env.GITHUB_REPO_DEFAULT_BRANCH = '';
}
