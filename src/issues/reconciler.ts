import * as github from './github';
import { readTodos, writeTodos } from './../todo-dictionary';
import { formatIssueText } from './formatter';
export const reconcileIssues = async ():Promise<void> => {
  let dictionary = await readTodos();
  console.log('a) reconciling issues', dictionary);
  for(var todo of dictionary.todos) {
    console.log('b) reconciling issues', todo);
    let body = await formatIssueText(todo);
    if (todo.issue) {
      // check if issue is closed
    } else {
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
