import * as Eta from 'eta';
import { ITodo } from "../todo-parser";
import path from 'path';
import fs from 'fs';
import { getCodeForExtension } from './linguist-language-map';
import { error } from '../logger';
import { getRepositoryContext } from '../repository-context';

const templateFile = path.resolve(__dirname, './.template.eta');
const templateContents = fs.readFileSync(templateFile).toString();

const metadataStartMarker = '//start todo-issue';
const metadataEndMarker = '//end todo-issue';

export type TodoIssueMetadata = {
  hash: string,
  filePath: string,
  line: number
};

Eta.configure({
  cache: true, // Make Eta cache templates
  rmWhitespace: false,
  autoTrim: false,
})

export const formatIssueText = async (todo: ITodo): Promise<string> => {
  const ext = path.extname(todo.filePath);
  const repoContext = getRepositoryContext();
  const relativeFilePath = path.relative(repoContext.workingDirectory, todo.filePath).replace(/\\/ig, '/');
  const props = {
    languageCode: await getCodeForExtension(ext) || '',
    relativeFilePath,
    githubUrl: `https://github.com/${repoContext.repositoryOwner}/${repoContext.repositoryName}/blob/${repoContext.defaultBranch}/${relativeFilePath}#L${todo.line}`
  };
  const text = Eta.render(templateContents, { ...todo, ...props, ...repoContext });
  return text || '';
};

export const getTodoIssueMetadata = async (issueText: string): Promise<TodoIssueMetadata | null> => {
  if (issueText.includes(metadataStartMarker)) {
    const json = issueText.split(metadataStartMarker)[1].split(metadataEndMarker)[0];
    try {
      const metadata = JSON.parse(json) as TodoIssueMetadata;
      if (metadata['hash'] && metadata['line'] && metadata['filePath']) return metadata;
    } catch (e) {
      error(`error decoding issue metadata. ${e}`);
    }
  }
  return null;
};
