import * as github from './github';
import { readTodos, writeTodos } from './../todo-dictionary';
import { formatIssueText } from './formatter';

export const reconcileIssues = async ():Promise<void> => {
  let dictionary = await readTodos();
  for(var todo of dictionary.todos) {
    let body = await formatIssueText(todo);
    let shouldCreateIssue = true;

    if (todo.issue) {
      // check if issue is closed
      let issue = await github.getIssue(parseInt(todo.issue));
      if (issue && issue.state === "closed") {
        continue;
      }
      if (issue) {
        // update the issue in github
        let result = await github.updateIssue(issue.number, { title: todo.title, body });
        shouldCreateIssue = false;
      }
    }
    if (shouldCreateIssue) {
      // try to create an issue
      try {
        let issue = await github.createIssue({ title: todo.title, body });
        if (issue) {
          todo.issue = issue;
        }
      } catch (e) {

      }
    }
  }
  await writeTodos(dictionary.todos);
};
