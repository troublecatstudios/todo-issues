import * as github from './github';
import { readTodos, writeTodos } from './../todo-dictionary';
import { formatIssueText } from './formatter';
import { ITodo } from '../todo-parser';

export type ReconcilerOptions = {
  dryRun: boolean,
  saveTodos: boolean,
};

function initOptions(options?: ReconcilerOptions): ReconcilerOptions {
  const defaults = {
    dryRun: false,
    saveTodos: true,
  };

  return {
    ...defaults,
    ...options,
  };
}

export const reconcileIssues = async (processedTodos: ITodo[], options?: ReconcilerOptions):Promise<void> => {
  let dictionary = await readTodos();

  options = initOptions(options);

  let actions = [];
  for(var todo of dictionary.todos) {
    if (todo.issue) {
      let issue = await github.getIssue(parseInt(todo.issue));
      let codeMatch = processedTodos.filter(t => t.hash === todo.hash);
      if (issue) {
        if (issue.state === 'closed') {
          continue;
        }
        if (codeMatch.length > 0) {
          actions.push({ type: 'UPDATE', todo: codeMatch[0] });
          continue;
        }
        actions.push({ type: 'CLOSE', todo: todo });
        continue;
      }
    }
    actions.push({ type: 'CREATE', todo: todo });
  }

  for(var todo of processedTodos) {
    let dictionaryMatch = dictionary.todos.filter(t => t.hash === todo.hash);
    if (dictionaryMatch.length > 0) {
      continue;
    }
    actions.push({ type: 'CREATE', todo: todo });
  }

  let todos = [];
  for(var { type, todo } of actions) {
    let body = await formatIssueText(todo);

    if (options?.dryRun) {
      console.log(`--------------`);
      console.log(`Action: ${type}`);
      console.log(`Todo JSON: ${JSON.stringify(todo)}`);
      if (type !== 'CLOSE') {
        console.log(`Issue Body:`);
        console.log(`${body}`);
      }
      console.log(`--------------`);

      if (type !== 'CLOSE') todos.push(todo);
      continue;
    }

    if (type === 'UPDATE') {
      await github.updateIssue(parseInt(todo.issue), {
        title: todo.title,
        body,
        labels: todo.type.githubLabel ? [todo.type.githubLabel] : undefined
      });
      todos.push(todo);
    }
    if (type === 'CREATE') {
      let issue = await github.createIssue({
        title: todo.title,
        body,
        labels: todo.type.githubLabel ? [todo.type.githubLabel] : undefined
      });
      if (issue) {
        todo.issue = issue;
      }
      todos.push(todo);
    }
    if (type === 'CLOSE') {
      await github.completeIssue(parseInt(todo.issue));
    }
  }

  if (options?.saveTodos) {
    await writeTodos(todos);
  }
};
