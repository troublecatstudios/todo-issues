import { resolve } from "path";
import { RepositoryContextType } from "../repository-context";

const context: RepositoryContextType = {
  workingDirectory: resolve(__dirname, './../../'),
  repositoryName: 'todo-issues',
  repositoryNodeId: '',
  defaultBranch: 'stable',
  repositoryOwner: 'troublecatstudios'
};

export default context;
