jest.mock('./../github', () => {
  return {
    createIssue: jest.fn().mockResolvedValue('1')
  };
});
jest.mock('./../../todo-dictionary', () => {
  return {
    readTodos: jest.fn().mockResolvedValue({ todos: [] }),
    writeTodos: jest.fn()
  };
});
jest.mock('./../formatter', () => {
  return {
    formatIssueText: jest.fn().mockReturnValue('Example formatted issue text')
  };
});

import { readTodos, writeTodos } from './../../todo-dictionary';
import { createIssue } from './../github';
import { formatIssueText } from './../formatter';
import { reconcileIssues } from '../reconciler';
import { createFakeTodo } from '../../__tests__/createFakeTodo';
import { ITodo } from '../../todo-parser';

describe('reconcileIssues', () => {
  it('should exist', async () => {
    expect(reconcileIssues).toBeDefined();
  });

  describe('given a marker is found in the dictionary', () => {

    describe('and it is not linked to a GitHub Issue', () => {
      let todo: ITodo;
      beforeEach(async () => {
        todo = createFakeTodo('TODO', 'hash', 'Example title', './file/path.js');
        todo.issue = '';
        let dict = await readTodos();
        dict.todos.push(todo);
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call the text formatter', async () => {
        await reconcileIssues();
        expect(formatIssueText).toHaveBeenCalledWith(todo);
      });

      it('should create a GitHub issue', async () => {
        await reconcileIssues();
        let body = await formatIssueText(todo);
        expect(createIssue).toHaveBeenCalledWith({ title: todo.title, body });
      });

      it('should update the dictionary entry with the GitHub Issue number', async () => {
        await reconcileIssues();
        todo.issue = '1';
        expect(writeTodos).toHaveBeenCalledWith([todo]);
      });

      describe('if the issue cannot be created', () => {
        it('should not update the dictionary', async () => {

        });
      });
    });

    describe('and it is linked to a GitHub Issue', () => {
      it('should update the issue text', async () => {

      });

      describe('and it has no match in the codebase', () => {
        it('should close the GitHub issue', async () => {

        });

        it('should delete the dictionary entry', async () => {

        });
      });
    });
  });
});
