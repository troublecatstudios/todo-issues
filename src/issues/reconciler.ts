import * as github from './github';
import { formatIssueText } from './formatter';
import { ITodo } from '../todo-parser';
import { publish } from '../hooks';
import { GitHubIssueWithMetadata, getAllIssues, loadAllIssues } from './issue-library';
import { error, info } from '../logger';

export type ReconcileUpdateAction = {
  number: number,
  todo: ITodo
};

export type ReconcileCreateAction = {
  todo: ITodo
};

export type ReconcileCloseAction = {
  number: number,
};

export type ReconcileActions = ReconcileCreateAction | ReconcileUpdateAction | ReconcileCloseAction;
const processActionQueue = async (queue: ReconcileActions[]): Promise<void> => {
  for(const action of queue) {
    let result:boolean = false;
    if ('number' in action && 'todo' in action) {
      result = await updateAction(action);
    } else if ('todo' in action) {
      result = await createAction(action);
    } else {
      result = await closeAction(action);
    }
  }
};

const updateAction = async (action:ReconcileUpdateAction): Promise<boolean> => {
  try{
    const body = await formatIssueText(action.todo);
    const result = await github.updateIssue(action.number, {
      title: action.todo.title,
      body,
      labels: action.todo.type.githubLabel ? [action.todo.type.githubLabel] : undefined
    });
    if (result) {
      info(`issue updated.`, { title: action.todo.title, labels: [action.todo.type.githubLabel], number: action.number, filePath: action.todo.filePath });
      await publish('IssueUpdated', { issueId: action.number, todo: action.todo });
      return true;
    }
    return false;
  } catch(e) {
    error(`Unable to update issue. ${e}`, {
      number: action.number,
      hash: action.todo.hash,
      title: action.todo.title,
      filePath: action.todo.filePath,
    });
    return false;
  }
};

const createAction = async (action:ReconcileCreateAction): Promise<boolean> => {
  try {
    const body = await formatIssueText(action.todo);
    let issue = await github.createIssue({
      title: action.todo.title,
      body,
      labels: action.todo.type.githubLabel ? [action.todo.type.githubLabel] : undefined
    });
    await publish('IssueCreated', { issueId: issue, todo: action.todo });
    info(`issue created.`, { title: action.todo.title, labels: [action.todo.type.githubLabel], number: issue, filePath: action.todo.filePath });
    return true;
  } catch(e) {
    error(`Unable to create issue. ${e}`, {
      hash: action.todo.hash,
      title: action.todo.title,
      filePath: action.todo.filePath,
    });
    return false;
  }
};

const closeAction = async (action:ReconcileCloseAction): Promise<boolean> => {
  try {
    await github.completeIssue(action.number);
    await publish('IssueClosed', { issueId: action.number });
    info(`issue closed.`, { number: action.number });
    return true;
  } catch(e) {
    error(`Unable to close issue. ${e}`, {
      number: action.number,
    });
    return false;
  }
};

const isIssueNeedingUpdate = (issue: GitHubIssueWithMetadata, todo: ITodo): boolean => {
  if (issue.title !== todo.title || issue.metadata.line !== todo.line || issue.metadata.filePath !== todo.filePath) {
    return true;
  }
  if (todo.type.githubLabel && !issue.labels.map(l => typeof l === 'string' ? l : l.name).find(l => l === todo.type.githubLabel)) {
    return true;
  }
  return false;
};

export const reconcileIssues = async (processedTodos: ITodo[]):Promise<void> => {
  await loadAllIssues();
  const library = getAllIssues();
  const actions: Array<ReconcileActions> = [];
  const issuesToCreate = processedTodos.filter(p => !library.find(i => i.metadata.hash === p.hash)).map(p => { return { todo: p }; });
  for(const issue of library) {
    const match = processedTodos.find(p => p.hash === issue.metadata.hash);
    if (match) {
      if (isIssueNeedingUpdate(issue, match)) {
        actions.push({ number: issue.number, todo: match });
      }
      continue;
    } else {
      actions.push({ number: issue.number });
      continue;
    }
  }
  actions.push(...issuesToCreate);

  await processActionQueue(actions);
};
